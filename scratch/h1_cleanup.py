#!/usr/bin/env python3
"""H1 CSS cleanup: remove dead classes and duplicate blocks.

Strategy:
1. Parse all selector blocks from style.css
2. Determine which classes are "used" = in index.html OR referenced in any JS file
3. Remove class selectors that are provably unused
4. Remove duplicate blocks (same selector + same properties appearing >1x)
5. Write cleaned CSS back to style.css
"""
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

# ─── 1. Collect used classes ────────────────────────────────────────────────────
used = set()

# From index.html
for m in re.finditer(r'class="([^"]*)"', html):
    for cls in m.group(1).split():
        used.add(cls)

# From JS: classList.add/remove/toggle, className, createElement
used.update(re.findall(r"classList\.(?:add|remove|toggle)\('([^']+)'\)", js_sources))
used.update(re.findall(r"className\s*=\s*['\"]([^'\"]+)['\"]", js_sources))
used.update(re.findall(r"className\s*\+=?['\"]([^'\"]+)['\"]", js_sources))
used.update(re.findall(r"createElement\([^\)]*['\"]\w+['\"]\).*?className\s*=\s*['\"]([^'\"]+)['\"]",
                       js_sources, re.DOTALL))
# From JS template literals: className = '...' or class="..."
for m in re.finditer(r"className\s*=\s*['\"]([^'\"]+)['\"]", js_sources):
    for cls in m.group(1).split():
        used.add(cls)
for m in re.finditer(r'<[^>]*class="([^"]*)"', js_sources):
    for cls in m.group(1).split():
        used.add(cls)

print(f"Used classes: {len(used)}")

# ─── 2. Find all selector blocks ────────────────────────────────────────────────
blocks = re.findall(r'([^{]+)\{([^}]*)\}', css)
selector_props = []
for selector, props in blocks:
    selector = selector.strip()
    props = props.strip()
    selector_props.append((selector, props))

# ─── 3. Identify dead classes (not used) ────────────────────────────────────────
# Extract class names from selectors
css_classes_used = set()
for selector, _ in selector_props:
    for cls in re.findall(r'\.([a-zA-Z][a-zA-Z0-9_-]*)', selector):
        css_classes_used.add(cls)

# Wait - the selector might be a compound selector like ".a .b", so we need
# to check if ANY class in the selector is used
def selector_has_used_class(selector):
    classes = re.findall(r'\.([a-zA-Z][a-zA-Z0-9_-]*)', selector)
    return any(c in used for c in classes)

# Filter: keep blocks where selector has at least one used class
kept_blocks = []
removed_count = 0
for selector, props in selector_props:
    if selector_has_used_class(selector):
        kept_blocks.append((selector, props))
    else:
        removed_count += 1

print(f"Removed {removed_count} class selector blocks (all classes unverified as used)")

# ─── 4. Remove duplicate blocks ─────────────────────────────────────────────────
# Re-count with kept blocks
kp = Counter()
for selector, props in kept_blocks:
    if selector and props:
        kp[(selector, props)] += 1

dups = {k: v for k, v in kp.items() if v > 1}
print(f"Duplicate blocks remaining after class check: {len(dups)}")
for (selector, props), count in sorted(dups.items(), key=lambda x: -x[1]):
    print(f"  x{count}: {selector[:60]}")

# For duplicates, keep only the FIRST occurrence
seen = set()
unique_blocks = []
removed_dup_count = 0
for selector, props in kept_blocks:
    key = (selector, props)
    if key in seen:
        removed_dup_count += 1
        continue
    seen.add(key)
    unique_blocks.append((selector, props))

print(f"Removed {removed_dup_count} duplicate blocks")

# ─── 5. Reconstruct CSS ─────────────────────────────────────────────────────────
def block_to_css(selector, props):
    # Preserve the original formatting (leading whitespace, comments before selector)
    # We'll use the first line of selector for indentation
    lines = selector.split('\n')
    first = lines[0].strip()
    rest = '\n'.join(lines[1:]) if len(lines) > 1 else ''
    return f"{first} {{{props}}}"

new_css = "\n\n".join(block_to_css(s, p) for s, p in unique_blocks)

# Clean up excessive blank lines
new_css = re.sub(r'\n{3,}', '\n\n', new_css)
new_css = re.sub(r'\n\s*\n\s*\n+', '\n\n', new_css)
new_css = new_css.strip() + '\n'

with open(CSS_PATH, 'w') as f:
    f.write(new_css)

print(f"\n✅ CSS cleanup complete")
print(f"   Original: {css.count(chr(10)) + 1} lines")
print(f"   Cleaned:  {new_css.count(chr(10)) + 1} lines")
