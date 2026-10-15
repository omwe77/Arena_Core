#!/bin/bash
set -euo pipefail
cd "/c/Users/LENOVO/OneDrive - London Metropolitan University/Documents/my_projects/Arena_Core"

[ -f index.html ] || { echo "index.html not found"; exit 1; }
cp index.html index.html.bak

# Use | as sed delimiter so // inside labels does not clash.
# Convert green-on-light text-primary to navy/ink-variant (text-on-surface-variant = #3e4a3d)
sed -i \
  -e 's|text-primary font-bold">// 48 CONTENDERS</span>|text-on-surface-variant font-bold">// 48 CONTENDERS</span>|g' \
  -e 's|uppercase font-bold tracking-wider">PROJECTED PATHWAY // STAGE 01</span>|uppercase text-on-surface-variant font-bold tracking-wider">PROJECTED PATHWAY // STAGE 01</span>|g' \
  -e 's|text-primary font-bold">ADV</span>|text-on-surface-variant font-bold">ADV</span>|g' \
  -e 's|text-primary font-bold">10K ITERATIONS</span>|text-on-surface-variant font-bold">10K ITERATIONS</span>|g' \
  -e 's|text-label-telemetry text-primary font-bold">98.4% (OPTA CALIBRATED)</span>|text-label-telemetry text-on-surface-variant font-bold">98.4% (OPTA CALIBRATED)</span>|g' \
  -e 's|text-label-telemetry text-primary font-bold">4.21</span>|text-label-telemetry text-on-surface-variant font-bold">4.21</span>|g' \
  -e 's|text-label-telemetry text-primary font-bold">3.88</span>|text-label-telemetry text-on-surface-variant font-bold">3.88</span>|g' \
  -e 's|text-label-telemetry text-primary font-bold">3.45</span>|text-label-telemetry text-on-surface-variant font-bold">3.45</span>|g' \
  -e 's|text-label-telemetry text-primary font-bold">3.12</span>|text-label-telemetry text-on-surface-variant font-bold">3.12</span>|g' \
  -e 's|text-primary font-bold">READY</span>|text-on-surface font-bold">READY</span>|g' \
  -e 's|font-label-telemetry text-label-telemetry text-primary font-bold">FEED A1</span>|font-label-telemetry text-label-telemetry text-on-surface-variant font-bold">FEED A1</span>|g' \
  -e 's|font-label-telemetry text-label-telemetry text-primary font-bold">SIMULATE GROUPS</span>|font-label-telemetry text-label-telemetry text-on-surface-variant font-bold">SIMULATE GROUPS</span>|g' \
  -e 's|text-primary">18ms</span>|text-on-surface-variant">18ms</span>|g' \
  -e 's|text-primary">12.4%</span>|text-on-surface-variant">12.4%</span>|g' \
  -e 's|text-primary">SYNCED</span>|text-on-surface-variant">SYNCED</span>|g' \
  -e 's|text-primary">ENABLED</span>|text-on-surface-variant">ENABLED</span>|g' \
  -e 's|text-primary">2.74</span>|text-on-surface-variant">2.74</span>|g' \
  -e 's|text-primary">21.4%</span>|text-on-surface-variant">21.4%</span>|g' \
  -e 's|text-primary">18.9%</span>|text-on-surface-variant">18.9%</span>|g' \
  -e 's|text-primary">16.2%</span>|text-on-surface-variant">16.2%</span>|g' \
  -e 's|text-primary">12.5%</span>|text-on-surface-variant">12.5%</span>|g' \
  -e 's|text-primary">RUN SPEED: 29.4K OPS/SEC</span>|text-on-surface-variant">RUN SPEED: 29.4K OPS/SEC</span>|g' \
  -e 's|font-label-telemetry text-label-telemetry text-primary font-bold">MATCH 64</span>|font-label-telemetry text-label-telemetry text-on-surface-variant font-bold">MATCH 64</span>|g' \
  -e 's|font-label-telemetry text-label-telemetry text-primary font-bold tracking-wider">OFFICIAL SIM ENGINE</span>|font-label-telemetry text-label-telemetry text-on-surface-variant font-bold tracking-wider">OFFICIAL SIM ENGINE</span>|g' \
  -e 's|text-primary font-bold">1</span>|text-on-surface-variant font-bold">1</span>|g' \
  -e 's|text-primary font-bold">2</span>|text-on-surface-variant font-bold">2</span>|g' \
  -e 's|text-primary">MX</span>|text-on-surface-variant">MX</span>|g' \
  index.html

# Footer "Core" still green on light footer pill -> navy
sed -i 's|uppercase text-primary">Core</span>|uppercase text-on-surface">Core</span>|g' index.html

# Old alpha green color refs in inline shadows / config -> darker green for consistency
sed -i 's|0,107,44|0,135,58|g' index.html
sed -i 's|#006b2c|#00873a|g' index.html

# Fix the malformed double-quote introduced earlier on nav data-active-classes
sed -i 's|bg-primary-container text-on-primary-container font-bold shadow-\[0_1px_4px_rgba(0,135,58,0.18)\]"\">|bg-primary-container text-on-primary-container font-bold shadow-[0_1px_4px_rgba(0,135,58,0.18)]">|g' index.html

# Probability bar adv-labels were green on light bar -> ink-variant
sed -i 's|font-label-telemetry text-label-telemetry text-primary font-bold">Adv:|font-label-telemetry text-label-telemetry text-on-surface-variant font-bold">Adv:|g' index.html

echo "PATCHED"
echo "text-primary count: $(grep -c 'text-primary' index.html)"
echo "text-on-surface-variant count: $(grep -c 'text-on-surface-variant' index.html)"
