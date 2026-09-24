"""Minimal Home Assistant stand-ins for Windows-safe client unit tests.

These stubs are inserted into sys.path only when the real Home Assistant
runtime is unavailable (native Windows, where HA Core fails to import because
of Unix-only modules). They mirror just the API surface that
custom_components/bl_haos/client.py touches — nothing more.
"""
