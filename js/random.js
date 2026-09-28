/**
 * ARENA CORE — Seeded PRNG (Milestone 3)
 * Replacement for Math.random() in simulation engine.
 * Uses mulberry32 algorithm: same seed + same code = same output.
 */

(function () {
  'use strict';

  let rng = Math.random;
  let currentSeed = null;

  /** Seed the PRNG with a numeric seed. */
  function seed(value) {
    currentSeed = value >>> 0;
    let s = currentSeed;
    rng = function () {
      s = (s + 0x6d2b79f5) | 0;
      let t = Math.imul(s ^ (s >>> 15), 1 | s);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function unseed() {
    rng = Math.random;
    currentSeed = null;
  }

  function random() {
    return rng();
  }

  function randomInt(min, max) {
    if (min > max) { const t = min; min = max; max = t; }
    return Math.floor(random() * (max - min + 1)) + min;
  }

  function randomRange(min, max) {
    return random() * (max - min) + min;
  }

  function pick(arr) {
    if (!arr || arr.length === 0) return undefined;
    if (arr.length === 1) return arr[0];
    return arr[Math.floor(random() * arr.length)];
  }

  function weightedPick(items) {
    if (!items || items.length === 0) return undefined;
    if (items.length === 1) return items[0].value;
    let total = 0;
    for (const item of items) total += item.weight;
    let r = random() * total;
    for (const item of items) {
      r -= item.weight;
      if (r <= 0) return item.value;
    }
    return items[items.length - 1].value;
  }

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      const tmp = a[i];
      a[i] = a[j];
      a[j] = tmp;
    }
    return a;
  }

  function chance(p) {
    return random() < p;
  }

  function poisson(lambda) {
    const L = Math.exp(-lambda);
    let k = 0;
    let p = 1;
    do { k++; p *= random(); } while (p > L);
    return k - 1;
  }

  window.ArenaRandom = {
    seed,
    unseed,
    random,
    randomInt,
    randomRange,
    pick,
    weightedPick,
    shuffle,
    chance,
    poisson,
    getSeed: () => currentSeed,
    isSeeded: () => currentSeed !== null
  };
})();
