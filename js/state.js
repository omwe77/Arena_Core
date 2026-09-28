/**
 * ARENA CORE — Central Application State Store (Milestone 1)
 * Single source of truth for navigation route, active competition,
 * simulation lifecycle, and user preferences.
 */

(function () {
  'use strict';

  // Explicit Simulation States
  const SimulationStatus = Object.freeze({
    READY: 'READY',
    PLAYING: 'PLAYING',
    PAUSED: 'PAUSED',
    REPLAYING: 'REPLAYING',
    FINISHED: 'FINISHED',
    ERROR: 'ERROR'
  });

  const DataStatus = Object.freeze({
    ONLINE: 'ONLINE',
    CACHED: 'CACHED',
    OFFLINE: 'OFFLINE'
  });

  // Default Initial State
  const initialState = {
    route: {
      path: '/',
      name: 'home',
      params: {},
      query: {}
    },
    competition: 'wc',
    season: '2023/2024',
    simulation: {
      simulationId: null,
      seed: null,
      modelVersion: 'v1.0.0',
      datasetVersion: '2024.11',
      status: SimulationStatus.READY,
      stage: 'all',
      currentMatch: null,
      currentMinute: 0,
      completed: false,
      champion: null
    },
    userPreferences: {
      sfxEnabled: true,
      theme: 'dark',
      reducedMotion: false
    },
    dataStatus: DataStatus.ONLINE
  };

  // State Container & Listeners
  let state = { ...initialState };
  const listeners = new Set();

  function getState() {
    return state;
  }

  function subscribe(listener) {
    if (typeof listener === 'function') {
      listeners.add(listener);
      return () => listeners.delete(listener);
    }
    return () => {};
  }

  function notify(changeType, payload) {
    listeners.forEach((listener) => {
      try {
        listener(state, changeType, payload);
      } catch (err) {
        console.error('[AppState] Error in listener:', err);
      }
    });
  }

  function setRoute(newRoute) {
    state.route = { ...state.route, ...newRoute };
    notify('ROUTE_CHANGED', state.route);
  }

  function setCompetition(competitionKey, season) {
    state.competition = competitionKey;
    if (season) state.season = season;
    notify('COMPETITION_CHANGED', { competition: competitionKey, season: state.season });
  }

  function setSimulationStatus(status, details = {}) {
    if (!Object.values(SimulationStatus).includes(status)) {
      console.warn(`[AppState] Invalid simulation status: ${status}`);
      return;
    }
    state.simulation = {
      ...state.simulation,
      status,
      ...details
    };
    notify('SIMULATION_STATUS_CHANGED', state.simulation);
  }

  function setSimulationProgress(currentMinute, currentMatch) {
    state.simulation.currentMinute = currentMinute;
    if (currentMatch !== undefined) state.simulation.currentMatch = currentMatch;
    notify('SIMULATION_TICK', { currentMinute, currentMatch });
  }

  function setChampion(championName, simulationId) {
    state.simulation.champion = championName;
    state.simulation.completed = true;
    state.simulation.status = SimulationStatus.FINISHED;
    if (simulationId) state.simulation.simulationId = simulationId;
    notify('CHAMPION_CROWNED', { champion: championName, simulationId });
  }

  function resetSimulation(seedValue = null) {
    const numericSeed = (seedValue !== null && typeof seedValue === 'number')
      ? (seedValue >>> 0)
      : (Math.floor(Math.random() * 2147483647) >>> 0);

    state.simulation = {
      ...state.simulation,
      simulationId: `sim_${Date.now()}_${numericSeed.toString(36)}`,
      seed: numericSeed,
      status: SimulationStatus.READY,
      currentMatch: null,
      currentMinute: 0,
      completed: false,
      champion: null
    };

    // Seed the deterministic PRNG for this simulation
    if (window.ArenaRandom) {
      window.ArenaRandom.seed(numericSeed);
    }

    notify('SIMULATION_RESET', state.simulation);
  }

  function setUserPreference(key, value) {
    state.userPreferences = {
      ...state.userPreferences,
      [key]: value
    };
    try {
      localStorage.setItem('arena_user_prefs', JSON.stringify(state.userPreferences));
    } catch {
      // ignore storage quota / access issues
    }
    notify('PREFERENCE_CHANGED', { key, value });
  }

  // Load saved preferences
  try {
    const saved = localStorage.getItem('arena_user_prefs');
    if (saved) {
      state.userPreferences = { ...state.userPreferences, ...JSON.parse(saved) };
    }
  } catch {
    // default
  }

  // Export to global namespace
  window.AppState = {
    SimulationStatus,
    DataStatus,
    getState,
    subscribe,
    setRoute,
    setCompetition,
    setSimulationStatus,
    setSimulationProgress,
    setChampion,
    resetSimulation,
    setUserPreference
  };
})();
