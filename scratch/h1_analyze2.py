#!/usr/bin/env python3
"""H1 CSS analysis: refined dead-class detection + design token audit."""
import re
from collections import Counter

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

# 1. HTML classes
html_classes = set()
for m in re.finditer(r'class="([^"]*)"', html):
    for cls in m.group(1).split():
        html_classes.add(cls)

# 2. JS class references (comprehensive)
js_classes = set()
js_classes.update(re.findall(r"classList\.add\('([^']+)'\)", js_sources))
js_classes.update(re.findall(r"classList\.remove\('([^']+)'\)", js_sources))
js_classes.update(re.findall(r"classList\.toggle\('([^']+)'\)", js_sources))
js_classes.update(re.findall(r"className\s*=\s*['\"]([^'\"]+)['\"]", js_sources))
js_classes.update(re.findall(r"className\s*\+=\s*['\"]([^'\"]+)['\"]", js_sources))
js_classes.update(re.findall(r'[a-zA-Z_$][a-zA-Z0-9_$]*\.className\s*=\s*["\']([^"\']+)["\']', js_sources))
for m in re.finditer(r'<[^>]*class="([^"]*)"', js_sources):
    for cls in m.group(1).split():
        js_classes.add(cls)
js_classes.update(re.findall(r"onclick=\"[^\"]*classList\.add\('([^']+)'\)", js_sources))
js_classes.update(re.findall(r"\.add\('([^']+)'\)", js_sources))

# 3. All CSS class selectors
css_classes = set()
for m in re.finditer(r'\.([a-zA-Z][a-zA-Z0-9_-]*)', css):
    css_classes.add(m.group(1))

used = html_classes | js_classes
dead = sorted(css_classes - used)
print(f"[1] HTML classes: {len(html_classes)}")
print(f"[2] JS class refs: {len(js_classes)}")
print(f"[3] CSS classes total: {len(css_classes)}")
print(f"[4] Used (HTML|JS): {len(used)}")
print(f"[5] Potentially dead CSS: {len(dead)}")
print()

# 4. Design tokens
print("[6] DESIGN TOKENS")
color_re = re.compile(r'--color-(text-|bg-|border-|accent-|success-|warning-|danger-|info-|archive-|team-)[a-z-]+:\s*#([0-9a-fA-F]{6})')
colors = Counter()
for m in color_re.finditer(css):
    colors[m.group(2)] += 1
print("   Repeated color values:")
for color, count in colors.most_common(15):
    print(f"      #{color} x{count}")

space_re = re.compile(r'--(space|radius|shadow|transition|text|font-weight|line-height)-([a-z0-9-]+):\s*([^;]+)')
spacing = Counter()
for m in space_re.finditer(css):
    key = m.group(1) + "-" + m.group(2)
    spacing[key] += 1
print("   Spacing/radius/shadow/transition tokens:")
for key, count in spacing.most_common(20):
    print(f"      {key}: {count}")

font_re = re.compile(r'--font-[a-z-]+:\s*[^;]+;')
fonts = Counter(re.findall(r'--font-[a-z-]+:\s*([^;]+);', css))
print("   Font values:")
for font, count in fonts.most_common():
    print(f"      {font}: {count}")

# 5. Key CSS problem areas
print("[7] PROBLEM AREAS")
important_count = css.count('!important')
print(f"   !important usage: {important_count}")
media_blocks = re.findall(r'@media[^{]*\{[^}]*\}', css)
print(f"   Media query blocks: {len(media_blocks)}")
ids_in_css = re.findall(r'#[a-zA-Z][a-zA-Z0-9_-]*', css)
print(f"   ID selectors in CSS: {len(ids_in_css)}")
hex_overrides = re.findall(r'(color:)\s*#([0-9a-fA-F]{6})', css)
print(f"   Hex color overrides: {len(hex_overrides)}")
