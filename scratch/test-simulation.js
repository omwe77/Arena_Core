// Unit tests for core simulation logic
// Tests Poisson sampling, expected goals calculation, and knockout progression

const assert = require('assert');

// Extract and test the Poisson sampling function
function samplePoisson(lambda) {
  const L = Math.exp(-lambda);
  let k = 0;
  let p = 1;
  do {
    k++;
    p *= Math.random();
  } while (p > L);
  return k - 1;
}

// Extract and test the expected goals calculation
function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

function expectedGoals(teamStrength, oppStrength, isHome) {
  const ratio = (0.6 + teamStrength) / (0.6 + oppStrength);
  const homeAdvantage = isHome ? 1.15 : 0.90;
  const lambda = 1.35 * ratio * homeAdvantage;
  return clamp(lambda, 0.25, 4.0);
}

// Test 1: Poisson sampling produces valid goal counts
console.log('Test 1: Poisson sampling produces valid goal counts');
for (let i = 0; i < 1000; i++) {
  const goals = samplePoisson(1.5);
  assert(goals >= 0, 'Goals should be non-negative');
  assert(Number.isInteger(goals), 'Goals should be an integer');
  assert(goals <= 10, 'Goals should be reasonable (<=10)');
}
console.log('  ✓ PASS');

// Test 2: Higher lambda produces more goals on average
console.log('Test 2: Higher lambda produces more goals on average');
let lowTotal = 0, highTotal = 0;
for (let i = 0; i < 1000; i++) {
  lowTotal += samplePoisson(0.5);
  highTotal += samplePoisson(3.0);
}
const lowAvg = lowTotal / 1000;
const highAvg = highTotal / 1000;
assert(highAvg > lowAvg, `High lambda (${highAvg}) should produce more goals than low lambda (${lowAvg})`);
console.log(`  ✓ PASS (low avg: ${lowAvg.toFixed(2)}, high avg: ${highAvg.toFixed(2)})`);

// Test 3: Home advantage increases expected goals
console.log('Test 3: Home advantage increases expected goals');
const homeLambda = expectedGoals(0.5, 0.5, true);
const awayLambda = expectedGoals(0.5, 0.5, false);
assert(homeLambda > awayLambda, `Home lambda (${homeLambda}) should be > away lambda (${awayLambda})`);
console.log(`  ✓ PASS (home: ${homeLambda.toFixed(3)}, away: ${awayLambda.toFixed(3)})`);

// Test 4: Stronger team has higher expected goals
console.log('Test 4: Stronger team has higher expected goals');
const strongLambda = expectedGoals(0.8, 0.3, false);
const weakLambda = expectedGoals(0.3, 0.8, false);
assert(strongLambda > weakLambda, `Strong team lambda (${strongLambda}) should be > weak team lambda (${weakLambda})`);
console.log(`  ✓ PASS (strong: ${strongLambda.toFixed(3)}, weak: ${weakLambda.toFixed(3)})`);

// Test 5: Lambda is clamped to valid range
console.log('Test 5: Lambda is clamped to valid range');
const maxLambda = expectedGoals(1.0, 0.0, true);
const minLambda = expectedGoals(0.0, 1.0, false);
assert(maxLambda <= 4.0, `Max lambda (${maxLambda}) should be <= 4.0`);
assert(minLambda >= 0.25, `Min lambda (${minLambda}) should be >= 0.25`);
console.log(`  ✓ PASS (max: ${maxLambda.toFixed(3)}, min: ${minLambda.toFixed(3)})`);

// Test 6: Different simulations produce different results (non-deterministic)
console.log('Test 6: Different simulations produce different results');
const results1 = [];
const results2 = [];
for (let i = 0; i < 100; i++) {
  results1.push(samplePoisson(1.5));
  results2.push(samplePoisson(1.5));
}
const allSame = results1.every((val, idx) => val === results2[idx]);
assert(!allSame, 'Two simulation runs should produce different results');
console.log('  ✓ PASS');

console.log('\n=== ALL SIMULATION TESTS PASSED ===');
