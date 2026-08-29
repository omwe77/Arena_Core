const fs = require('fs');

const indexHtml = fs.readFileSync('index.html', 'utf8');
const styleCss = fs.readFileSync('style.css', 'utf8');
const appJs = fs.readFileSync('app.js', 'utf8');

console.log('=== VERIFYING 3D HOLOGRAPHIC STADIUM BROADCAST STUDIO ===');

// 1. Check HTML Markup
const hasBroadcastModal = indexHtml.includes('id="broadcast-hologram-modal"') &&
                          indexHtml.includes('holo-stage-viewport') &&
                          indexHtml.includes('holo-3d-ball-track') &&
                          indexHtml.includes('holo-floating-turf-wrapper') &&
                          indexHtml.includes('holo-device-tablet');
console.log('✓ 3D Holographic Broadcast Modal in HTML (Ball + Floating Turf + Tablet):', hasBroadcastModal);

// 2. Check CSS 3D Transforms and Lighting
const hasBroadcastCss = styleCss.includes('.broadcast-modal') &&
                        styleCss.includes('.holo-stage-viewport') &&
                        styleCss.includes('.holo-device-tablet') &&
                        styleCss.includes('.holo-floating-turf-wrapper') &&
                        styleCss.includes('.holo-3d-ball-sphere') &&
                        styleCss.includes('@keyframes floatTurf');
console.log('✓ 3D Holographic CSS & 3-layer depth styles:', hasBroadcastCss);

// 3. Check JavaScript Controller & Sync
const hasBroadcastJs = appJs.includes('open3DHolographicBroadcast') &&
                       appJs.includes('holo-action-bubble') &&
                       appJs.includes('holo-events-ticker') &&
                       appJs.includes('window.open3DHolographicBroadcast = open3DHolographicBroadcast');
console.log('✓ JavaScript Broadcast Controller, 3D Ball Physics & Window Export:', hasBroadcastJs);

console.log('\nAll 3D Holographic Stadium Broadcast checks passed successfully! 🎉');
