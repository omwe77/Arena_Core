#!/usr/bin/env python3
"""H3 accessibility: fix bracket tab tabindex pattern (WAI-ARIA tabs)."""
import re

HTML_PATH = "index.html"

with open(HTML_PATH) as f:
    html = f.read()

# Strategy: For each bracket tab button:
# - Active tab (has "active" class): ensure tabindex="0"
# - Inactive tab: add tabindex="-1"

def fix_tab(m):
    tag = m.group(0)
    if 'class="bracket-tab active"' in tag:
        # Active tab: add tabindex="0" if not present
        if 'tabindex=' not in tag:
            tag = tag.rstrip('>') + ' tabindex="0">'
    else:
        # Inactive tab: add tabindex="-1" if not present
        if 'tabindex=' not in tag:
            tag = tag.rstrip('>') + ' tabindex="-1">'
    return tag

pattern = re.compile(r'<button type="button" class="bracket-tab"[^>]*role="tab"[^>]*>')
html = pattern.sub(fix_tab, html)

with open(HTML_PATH, 'w') as f:
    f.write(html)

print("✅ Bracket tab tabindex pattern fixed (WAI-ARIA tabs pattern)")
