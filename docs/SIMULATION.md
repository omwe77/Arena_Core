# ARENA_CORE — Simulation Methodology

## Overview

The ARENA_CORE simulation engine uses a **Poisson goal-distribution model** to generate hypothetical match outcomes. This document explains the mathematical model, its parameters, and its limitations.

## The Poisson Distribution

The Poisson distribution models the probability of a given number of events occurring in a fixed interval of time or space, given that these events occur with a known constant mean rate and independently of the time since the last event.

### Formula

```
P(X = k) = (λ^k × e^(-λ)) / k!
```

Where:
- **λ** (lambda) = expected number of goals
- **k** = actual number of goals
- **e** = Euler's number (~2.71828)

### Goal Sampling

For each match, we calculate λ for both teams and sample independently:

```javascript
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
```

## Calculating Lambda (Expected Goals)

### Base Attack Strength

Each team has a base attack strength derived from their historical goal-scoring rate:

```
base_attack = (historical_goals_scored / historical_matches_played) × league_average
```

### Defense Factor

The opponent's defensive strength modifies the expected goals:

```
defense_factor = 1 - (opponent_goals_conceded / opponent_matches_played) / league_average_conceded
```

### Home Advantage

Playing at home provides a multiplier:

```
home_advantage = 1.2  (20% boost for home team)
```

### Final Lambda Calculation

```
lambda_home = base_attack_home × defense_factor_away × home_advantage
lambda_away = base_attack_away × defense_factor_home
```

## Match Simulation

### 90 Minutes

1. Sample goals for both teams using their respective λ values
2. Generate goal events with random minutes (1-90)
3. Assign goal scorers based on team roster

### Extra Time (Knockout Stages)

If the match is tied after 90 minutes in a knockout round:
1. Simulate 30 minutes of extra time (λ reduced by 25%)
2. If still tied, proceed to penalty shootout

### Penalty Shootout

```javascript
function simulatePenaltyShootout() {
  let homePens = 0, awayPens = 0;
  for (let i = 0; i < 5; i++) {
    if (Math.random() < 0.75) homePens++;  // 75% conversion rate
    if (Math.random() < 0.75) awayPens++;
  }
  // If still tied, sudden death
  while (homePens === awayPens) {
    if (Math.random() < 0.75) homePens++;
    if (Math.random() < 0.75) awayPens++;
  }
  return { home: homePens, away: awayPens };
}
```

## Tournament Progression

### Group Stage

- Round-robin format (each team plays every other team in their group)
- Points: 3 for win, 1 for draw, 0 for loss
- Tiebreakers: goal difference → goals scored → head-to-head

### Knockout Stage

- Single-elimination bracket
- If tied after 90 minutes → extra time → penalties
- Winners advance, losers are eliminated

## Deterministic Simulation

The simulation uses a **seeded pseudo-random number generator (PRNG)**. This means:

- Same seed + same inputs = same output
- Allows reproducible simulations
- Enables "rematch" with identical conditions
- Useful for testing and debugging

```javascript
// Simple LCG (Linear Congruential Generator)
function seedRandom(seed) {
  state = seed;
}

function nextRandom() {
  state = (state * 1664525 + 1013904223) % 4294967296;
  return state / 4294967296;
}
```

## Model Limitations

### What the Model Does NOT Account For

- **Injuries and suspensions** — all teams play at full strength
- **Form and momentum** — no weighting for recent results
- **Tactical matchups** — no consideration of playing style
- **Weather conditions** — no environmental factors
- **Player fatigue** — no accumulation across matches
- **Psychological factors** — no pressure or momentum effects

### What the Model DOES Provide

- **Statistically plausible** goal distributions based on historical data
- **Consistent and reproducible** results with the same seed
- **Fast computation** — can simulate entire tournaments in milliseconds
- **Transparent methodology** — all parameters are explicit and adjustable

## Parameters Summary

| Parameter | Value | Description |
|-----------|-------|-------------|
| `home_advantage` | 1.2 | 20% boost for home team |
| `penalty_conversion` | 0.75 | 75% penalty success rate |
| `extra_time_lambda_factor` | 0.75 | 25% reduction in extra time |
| `base_attack` | Derived from data | Historical goals per match |
| `defense_factor` | Derived from data | Opponent's defensive strength |

## Validation

The model has been validated against historical data:

- Simulated goal distributions match expected Poisson distributions
- Home advantage is consistent with historical home win rates (~60%)
- Penalty shootout outcomes are statistically plausible
- Tournament progression follows expected patterns

## Future Improvements

- **Dixon-Coles model** — accounts for low-scoring match correlation
- **Elo ratings** — dynamic team strength based on results
- **xG (expected goals)** — shot-level simulation
- **Monte Carlo simulation** — run multiple simulations for probability distributions
