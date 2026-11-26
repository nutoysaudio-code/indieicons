"""Arma una lámina con todos los iconos del tema para el README.

Uso: python scripts/make-showcase.py
Requiere Inkscape y Pillow.
"""

import json
import os
import subprocess
import tempfile
from pathlib import Path

from PIL import Image

INKSCAPE = r"C:\Program Files\Inkscape\bin\inkscape.com"
ROOT = Path(__file__).resolve().parent.parent
THEME = ROOT / "themes" / "indie-icons-theme.json"
OUT = ROOT / "assets" / "icons-preview.png"

ICON_SIZE = 64
CELL = 88
COLS = 10
PADDING = 24
BACKGROUND = "#232136"


def main() -> None:
    theme = json.loads(THEME.read_text(encoding="utf-8"))
    icons = []
    for definition in theme["iconDefinitions"].values():
        icon_path = (THEME.parent / definition["iconPath"]).resolve()
        icons.append(icon_path)

    with tempfile.TemporaryDirectory() as tmp:
        rendered = []
        for index, icon_path in enumerate(icons):
            png_path = Path(tmp) / f"{index}.png"
            subprocess.run(
                [
                    INKSCAPE,
                    str(icon_path),
                    "--export-type=png",
                    f"--export-filename={png_path}",
                    f"--export-width={ICON_SIZE}",
                    f"--export-height={ICON_SIZE}",
                ],
                check=True,
                capture_output=True,
            )
            rendered.append(png_path)

        rows = (len(rendered) + COLS - 1) // COLS
        width = COLS * CELL + PADDING * 2
        height = rows * CELL + PADDING * 2
        sheet = Image.new("RGB", (width, height), BACKGROUND)

        for index, png_path in enumerate(rendered):
            icon = Image.open(png_path).convert("RGBA")
            x = PADDING + (index % COLS) * CELL + (CELL - ICON_SIZE) // 2
            y = PADDING + (index // COLS) * CELL + (CELL - ICON_SIZE) // 2
            sheet.paste(icon, (x, y), icon)

        OUT.parent.mkdir(parents=True, exist_ok=True)
        sheet.save(OUT, optimize=True)
        print(f"{OUT} ({width}x{height}, {len(rendered)} iconos)")


if __name__ == "__main__":
    main()
