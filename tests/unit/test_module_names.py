"""Guard against constants that are referenced but never imported.

The Linux-only SIL job is the only place some integration paths execute (a
Windows or macOS checkout cannot import Home Assistant Core), so a missing
import reaches CI as a runtime `NameError` instead of a local failure. That is
exactly how `ENDPOINT_SCHEME_NAMES` once shipped: it was added to `const.py`
after `config_flow.py`'s import block had been written, and nothing on Windows
ever called the function that read it.

This module walks the shipped sources and reports any bare UPPER_CASE name that
is read without being imported or defined.
"""

from __future__ import annotations

import ast
from pathlib import Path

PACKAGE_ROOT = Path(__file__).resolve().parents[2] / "custom_components" / "bl_haos"
IMPORT_STAR_SENTINEL = "*"
BUILTINS = set(dir(__builtins__)) if not isinstance(__builtins__, dict) else set(__builtins__)


def _bound_names(tree: ast.Module) -> tuple[set[str], bool]:
    """Return every name the module binds, plus whether it uses ``import *``."""
    names: set[str] = set()
    star_import = False

    def add_arguments(args: ast.arguments) -> None:
        names.update(arg.arg for arg in (*args.posonlyargs, *args.args, *args.kwonlyargs))
        if args.vararg:
            names.add(args.vararg.arg)
        if args.kwarg:
            names.add(args.kwarg.arg)

    for node in ast.walk(tree):
        if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef, ast.ClassDef)):
            names.add(node.name)
            if not isinstance(node, ast.ClassDef):
                add_arguments(node.args)
        elif isinstance(node, ast.Lambda):
            add_arguments(node.args)
        elif isinstance(node, ast.Import):
            for alias in node.names:
                if alias.name == IMPORT_STAR_SENTINEL:
                    star_import = True
                names.add((alias.asname or alias.name).split(".")[0])
        elif isinstance(node, ast.ImportFrom):
            for alias in node.names:
                if alias.name == IMPORT_STAR_SENTINEL:
                    star_import = True
                names.add(alias.asname or alias.name)
        elif isinstance(node, ast.Name) and isinstance(node.ctx, (ast.Store, ast.Del)):
            names.add(node.id)
        elif isinstance(node, ast.ExceptHandler) and node.name:
            names.add(node.name)
        elif isinstance(node, ast.comprehension):
            for target in ast.walk(node.target):
                if isinstance(target, ast.Name):
                    names.add(target.id)
    return names, star_import


def _read_upper_names(tree: ast.Module) -> dict[str, int]:
    """Return UPPER_CASE names read as bare names, mapped to their line number."""
    read: dict[str, int] = {}
    for node in ast.walk(tree):
        if isinstance(node, ast.Name) and isinstance(node.ctx, ast.Load):
            if node.id.isupper() and node.id not in BUILTINS:
                read.setdefault(node.id, node.lineno)
    return read


def test_shipped_constants_are_always_imported():
    sources = sorted(PACKAGE_ROOT.rglob("*.py"))
    assert sources, "the integration package must contain Python sources"

    findings: list[str] = []
    checked = 0
    for path in sources:
        tree = ast.parse(path.read_text(encoding="utf-8"), filename=str(path))
        bound, star_import = _bound_names(tree)
        checked += 1
        if star_import:
            # A star import can supply any name, so the module cannot be checked.
            continue
        for name, lineno in sorted(_read_upper_names(tree).items()):
            if name not in bound:
                findings.append(f"{path.relative_to(PACKAGE_ROOT)}:{lineno}: {name} used but not defined")

    assert not findings, "constants referenced without an import:\n" + "\n".join(findings)
    assert checked == len(sources)
