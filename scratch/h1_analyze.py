#!/usr/bin/env python3
"""H1 CSS Baseline Analysis for Arena_Core.

Identifies:
- duplicate CSS rules (provably unused)
- dead CSS classes (not used in HTML, not referenced in JS)
- repeated design values (colors, spacing, radii, shadows, typography)
- reports design tokens and CSS problem areas
"""
import re
from collections import Counter, defaultdict

CSS_PATH = "style.css"
HTML_PATH = "index.html"
JS_PATHS = ["app.js", "js/audio-fx.js", "js/motion-fx.js", "js/state.js",
            "js/router.js", "js/random.js"]

with open(CSS_PATH) as f:
    css = f.read()

with open(HTML_PATH) as f:
    html = f.read()

js_sources = ""
for jp in JS_PATHS:
    with open(jp) as f:
        js_sources += f.read()

# ─── 1. Duplicate selector blocks ───────────────────────────────────────────────
blocks = re.findall(r'([^{]+)\{([^}]*)\}', css)
selector_props = []
for selector, props in blocks:
    selector = selector.strip()
    props = props.strip()
    selector_props.append((selector, props))

counter = Counter()
for selector, props in selector_props:
    if selector and props:
        counter[(selector, props)] += 1

dups = {k: v for k, v in counter.items() if v > 1}
print(f"[1] DUPLICATE BLOCKS: {len(dups)}")
for (selector, props), count in sorted(dups.items(), key=lambda x: -x[1]):
    print(f"    x{count}: {selector[:70]}")


# ─── 2. Dead CSS classes ────────────────────────────────────────────────────────
# Extract all class names used in HTML
html_classes = set()
for m in re.finditer(r'class="([^"]*)"', html):
    for cls in m.group(1).split():
        html_classes.add(cls)

# Extract classes referenced in JS (classList.add, className, template strings)
js_classes = set()
# classList.add('foo')
for m in re.finditer(r"classList\.add\('([^']+)'\)", js_sources):
    js_classes.add(m.group(1))
# className = 'foo'
for m in re.finditer(r"className\s*=\s*['\"]([^'\"]+)['\"]", js_sources):
    for cls in m.group(1).split():
        js_classes.add(cls)
# template literals with class names
for m in re.finditer(r'`[^`]*\.([a-zA-Z][a-zA-Z0-9_-]*)[^`]*`', js_sources):
    js_classes.add(m.group(1))

# Classes used in HTML or JS
used_classes = html_classes | js_classes

# All CSS class selectors
css_classes = set()
for m in re.finditer(r'\.([a-zA-Z][a-zA-Z0-9_-]*)', css):
    css_classes.add(m.group(1))

dead = sorted(css_classes - used_classes)
print(f"\n[2] DEAD CSS CLASSES (not in HTML, not in JS): {len(dead)}")
for cls in dead:
    print(f"    .{cls}")


# ─── 3. Repeated design values ──────────────────────────────────────────────────
print(f"\n[3] REPEATED DESIGN VALUES")

# Colors
color_pattern = re.compile(r'--color-(text-|bg-|border-|accent-|success-|warning-|danger-|info-|archive-|team-)[a-z-]+:\s*#([0-9a-fA-F]{6})')
colors = Counter()
for m in color_pattern.finditer(css):
    colors[m.group(2)] += 1
print("    Repeated color values:")
for color, count in colors.most_common(15):
    print(f"      #{color} x{count}")

# Spacing
space_pattern = re.compile(r'--(space|radius|shadow|transition|text|font-weight|line-height)-([a-z0-9-]+):\s*([^;]+)')
spacing = Counter()
for m in space_pattern.finditer(css):
    key = m.group(1) + "-" + m.group(2)
    spacing[key] += 1
print("    Spacing/radius/shadow/transition tokens used:")
for key, count in spacing.most_common(20):
    print(f"      {key}: {count}")
