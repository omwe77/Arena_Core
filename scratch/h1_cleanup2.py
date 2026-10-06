#!/usr/bin/env python3
"""H1 CSS cleanup - careful version with proper brace matching."""
import re
from collections import Counter

CSS_PATH = "style.css"
HTML_PATH = "index.html"
JS_PATHS = ["app.js", "js/audio-fx.js", "js/motion-fx.js", "js/state.js",
            "js/router.js", "js/random.js"]

with open(CSS_PATH) as f:
    original_css = f.read()

with open(HTML_PATH) as f:
    html = f.read()

js_sources = ""
for jp in JS_PATHS:
    with open(jp) as f:
        js_sources += f.read()

# ─── 1. Collect used classes ────────────────────────────────────────────────────
used = set()
for m in re.finditer(r'class="([^"]*)"', html):
    for cls in m.group(1).split():
        used.add(cls)

used.update(re.findall(r"classList\.(?:add|remove|toggle)\('([^']+)'\)", js_sources))
used.update(re.findall(r"className\s*=\s*['\"]([^'\"]+)['\"]", js_sources))
used.update(re.findall(r"className\s*\+=?['\"]([^'\"]+)['\"]", js_sources))
for m in re.finditer(r'<[^>]*class="([^"]*)"', js_sources):
    for cls in m.group(1).split():
        used.add(cls)

print(f"Used classes: {len(used)}")

# ─── 2. Parse CSS into blocks using brace matching ─────────────────────────────
def parse_css_blocks(css_text):
    """Parse CSS into a list of (selector_text, properties_text) tuples.
    Handles nested braces (media queries, keyframes, etc.)."""
    blocks = []
    i = 0
    n = len(css_text)
    
    while i < n:
        # Skip whitespace and comments
        while i < n and css_text[i] in ' \t\r\n':
            i += 1
        if i >= n:
            break
        
        # Check for comments
        if css_text.startswith('/*', i):
            end = css_text.find('*/', i)
            if end == -1:
                break
            i = end + 2
            continue
        
        # Find the opening { that starts the rule
        brace_start = css_text.find('{', i)
        if brace_start == -1:
            break
        
        # Find the matching closing }
        depth = 0
        j = brace_start
        while j < n:
            if css_text[j] == '{':
                depth += 1
            elif css_text[j] == '}':
                depth -= 1
                if depth == 0:
                    break
            j += 1
        
        if j >= n:
            break
        
        selector_text = css_text[i:brace_start].strip()
        props_text = css_text[brace_start + 1:j].strip()
        blocks.append((selector_text, props_text))
        
        i = j + 1
    
    return blocks

blocks = parse_css_blocks(original_css)
print(f"Total blocks parsed: {len(blocks)}")

# ─── 3. Identify which blocks to keep ───────────────────────────────────────────
# A block is kept if its selector contains a used class
def selector_has_used_class(selector):
    classes = re.findall(r'\.([a-zA-Z][a-zA-Z0-9_-]*)', selector)
    return any(c in used for c in classes)

kept_blocks = []
removed_class_blocks = 0
for selector, props in blocks:
    if selector_has_used_class(selector):
        kept_blocks.append((selector, props))
    else:
        removed_class_blocks += 1

print(f"Removed {removed_class_blocks} class blocks (all classes unverified as used)")

# ─── 4. Remove duplicate blocks ─────────────────────────────────────────────────
kp = Counter()
for selector, props in kept_blocks:
    if selector and props:
        kp[(selector, props)] += 1

dups = {k: v for k, v in kp.items() if v > 1}
print(f"Duplicate blocks: {len(dups)}")
for (selector, props), count in sorted(dups.items(), key=lambda x: -x[1]):
    print(f"  x{count}: {selector[:60]}")

# Keep first occurrence of each unique block
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
    return f"{selector} {{{props}}}"

new_css = "\n\n".join(block_to_css(s, p) for s, p in unique_blocks)
new_css = re.sub(r'\n{3,}', '\n\n', new_css)
new_css = new_css.strip() + '\n'

# Verify: brace balance should be 0
open_braces = new_css.count('{')
close_braces = new_css.count('}')
print(f"\nBrace balance: {open_braces} open, {close_braces} close")
assert open_braces == close_braces, f"Brace mismatch: {open_braces} vs {close_braces}"

with open(CSS_PATH, 'w') as f:
    f.write(new_css)

print(f"\n✅ CSS cleanup complete")
print(f"   Original: {original_css.count(chr(10)) + 1} lines")
print(f"   Cleaned:  {new_css.count(chr(10)) + 1} lines")
