const fs = require('fs');

// Verify formation calculations and positions
function getFormationPositions(formation, isHome) {
  // Field dimensions: x from 0 to 100%, y from 0 to 100%
  // Home plays Left to Right (x: 5% to 48%), Away plays Right to Left (x: 52% to 95%)
  const positions = [];
  
  if (isHome) {
    // 4-3-3
    // GK
    positions.push({ role: 'GK', x: 8, y: 50, num: 1 });
    // 4 Defenders (LB, CB, CB, RB)
    positions.push({ role: 'LB', x: 20, y: 18, num: 3 });
    positions.push({ role: 'CB', x: 18, y: 38, num: 4 });
    positions.push({ role: 'CB', x: 18, y: 62, num: 5 });
    positions.push({ role: 'RB', x: 20, y: 82, num: 2 });
    // 3 Midfielders (LCM, CM, RCM)
    positions.push({ role: 'LCM', x: 32, y: 28, num: 8 });
    positions.push({ role: 'CM',  x: 30, y: 50, num: 6 });
    positions.push({ role: 'RCM', x: 32, y: 72, num: 10 });
    // 3 Attackers (LW, ST, RW)
    positions.push({ role: 'LW', x: 44, y: 22, num: 11 });
    positions.push({ role: 'ST', x: 46, y: 50, num: 9 });
    positions.push({ role: 'RW', x: 44, y: 78, num: 7 });
  } else {
    // 4-2-3-1
    // GK
    positions.push({ role: 'GK', x: 92, y: 50, num: 1 });
    // 4 Defenders (RB, CB, CB, LB)
    positions.push({ role: 'RB', x: 80, y: 18, num: 2 });
    positions.push({ role: 'CB', x: 82, y: 38, num: 4 });
    positions.push({ role: 'CB', x: 82, y: 62, num: 5 });
    positions.push({ role: 'LB', x: 80, y: 82, num: 3 });
    // 2 DMs (LDM, RDM)
    positions.push({ role: 'LDM', x: 70, y: 36, num: 6 });
    positions.push({ role: 'RDM', x: 70, y: 64, num: 8 });
    // 3 AMs (LM, CAM, RM)
    positions.push({ role: 'LM',  x: 60, y: 20, num: 11 });
    positions.push({ role: 'CAM', x: 58, y: 50, num: 10 });
    positions.push({ role: 'RM',  x: 60, y: 80, num: 7 });
    // 1 Striker (ST)
    positions.push({ role: 'ST', x: 54, y: 50, num: 9 });
  }
  return positions;
}

console.log('Home 4-3-3 positions count:', getFormationPositions('4-3-3', true).length);
console.log('Away 4-2-3-1 positions count:', getFormationPositions('4-2-3-1', false).length);
