# Interactive StarCraft II build chart

## Site

Create a static site that opens at `index.html` from disk or a static host, without a build step, backend, or external dependencies. Use `flowchart.png` only as a transcription reference; the site must not load or display the PNG.

## Chart

Recreate the original nodes as HTML cards with selectable text and draw their directed links as SVG arrows. Preserve every branch, build step, supply count, timestamp (including the source's `XX:XX`), and the meaningful text colors. Keep the top-to-bottom layout and the distinct scouting checkpoints. On narrow viewports, let the chart scroll horizontally rather than shrinking text or stacking branches out of context.

## Interaction

Hovering over a card or focusing it by keyboard highlights its immediate predecessor and successor cards and the arrows connecting them. Click, tap, Enter, or Space to pin or unpin that highlight, and press Escape or click empty chart space to clear it. Hover and focus may preview a different card without replacing a pinned choice. All chart text and arrows remain visible if JavaScript is unavailable.

## Checks

Compare the rendered cards and their links against the source. Check visual layout and horizontal scrolling at desktop and phone widths, and verify preview, pin, and clear with mouse, touch, and keyboard. Confirm that the page does not request the PNG. Use local Git for version history; do not configure a remote or push.
