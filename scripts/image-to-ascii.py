#!/usr/bin/env python3
"""Render an image as a text block for build-time decorative use."""

from __future__ import annotations

import argparse
import random
import sys
from pathlib import Path


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("image", type=Path, help="Input image readable by Pillow")
    parser.add_argument("-w", "--width", type=int, default=72, help="Output character width")
    parser.add_argument(
        "-d",
        "--density",
        type=float,
        default=1.0,
        help="Sampling density multiplier (0.25-2; higher produces more rows)",
    )
    parser.add_argument(
        "-c",
        "--charset",
        default=" .:-=+*#%@",
        help="Characters ordered from lightest to darkest",
    )
    parser.add_argument("--invert", action="store_true", help="Invert luminance before mapping")
    parser.add_argument("--glitch", type=float, default=0, help="Chance per cell to perturb its character (0-1)")
    parser.add_argument("-o", "--output", type=Path, help="Write to a file instead of stdout")
    return parser.parse_args()


def render(args: argparse.Namespace) -> str:
    try:
        from PIL import Image
    except ImportError as error:
        raise SystemExit("This build-time script requires Pillow: python -m pip install Pillow") from error

    if args.width < 1:
        raise SystemExit("--width must be positive")
    if not 0.25 <= args.density <= 2:
        raise SystemExit("--density must be between 0.25 and 2")
    if not args.charset:
        raise SystemExit("--charset must contain at least one character")
    if not 0 <= args.glitch <= 1:
        raise SystemExit("--glitch must be between 0 and 1")

    with Image.open(args.image) as source:
        image = source.convert("L")
        aspect_ratio = image.height / image.width
        # Terminal glyphs are taller than they are wide; this correction keeps
        # the source composition readable in a monospaced text block.
        height = max(1, round(args.width * aspect_ratio * 0.5 * args.density))
        image = image.resize((args.width, height))

        rng = random.Random(f"{args.image.resolve()}:{args.width}:{args.density}:{args.charset}")
        rows: list[str] = []
        for y in range(height):
            chars: list[str] = []
            for x in range(args.width):
                luminance = image.getpixel((x, y)) / 255
                if args.invert:
                    luminance = 1 - luminance
                index = round(luminance * (len(args.charset) - 1))
                if args.glitch and rng.random() < args.glitch:
                    index = max(0, min(len(args.charset) - 1, index + rng.choice((-2, -1, 1, 2))))
                chars.append(args.charset[index])
            rows.append("".join(chars).rstrip())

    return "\n".join(rows).rstrip() + "\n"


def main() -> None:
    args = parse_args()
    output = render(args)
    if args.output:
        args.output.write_text(output, encoding="utf-8")
    else:
        sys.stdout.write(output)


if __name__ == "__main__":
    main()
