/* ==========================================================================
   ARENA_CORE — MULTI-TOURNAMENT DATA FETCH & CACHE LAYER
   Node.js data acquisition script for top global football competitions.
   - Reads process.env.API_FOOTBALL_KEY securely (never exposed to browser)
   - Discovers valid seasons, rate-limits requests
   - Generates sanitized local data/real-tournaments.json & data/real-tournaments.js
   ========================================================================== */

const fs = require('fs');
const path = require('path');

const API_KEY = process.env.API_FOOTBALL_KEY;
const BASE_URL = 'https://v3.football.api-sports.io';

const COMPETITIONS_TO_FETCH = [
  { key: 'wc', leagueId: 1, name: 'FIFA World Cup', category: 'international', format: 'worldcup48', preferredSeason: 2022 },
  { key: 'ucl', leagueId: 2, name: 'UEFA Champions League', category: 'continental_club', format: 'uclLeaguePhase', preferredSeason: 2023 },
  { key: 'pl', leagueId: 39, name: 'Premier League', category: 'domestic_league', format: 'leagueSeason', preferredSeason: 2023 },
  { key: 'laliga', leagueId: 140, name: 'La Liga', category: 'domestic_league', format: 'leagueSeason', preferredSeason: 2023 },
  { key: 'serieA', leagueId: 135, name: 'Serie A', category: 'domestic_league', format: 'leagueSeason', preferredSeason: 2023 },
  { key: 'bundesliga', leagueId: 78, name: 'Bundesliga', category: 'domestic_league', format: 'leagueSeason', preferredSeason: 2023 },
  { key: 'europaLeague', leagueId: 3, name: 'UEFA Europa League', category: 'continental_club', format: 'uclLeaguePhase', preferredSeason: 2023 },
  { key: 'euro', leagueId: 4, name: 'UEFA European Championship', category: 'international', format: 'euro24', preferredSeason: 2024 },
  { key: 'copa', leagueId: 9, name: 'Copa América', category: 'international', format: 'copa16', preferredSeason: 2024 },
  { key: 'libertadores', leagueId: 13, name: 'Copa Libertadores', category: 'continental_club', format: 'genericCup', preferredSeason: 2023 }
];

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function apiFetch(endpoint, params = {}) {
  if (!API_KEY) {
    throw new Error('API_FOOTBALL_KEY environment variable is missing.');
  }

  const url = new URL(`${BASE_URL}${endpoint}`);
  Object.entries(params).forEach(([k, v]) => url.searchParams.append(k, String(v)));

  console.log(`[API-Football] Requesting: ${url.pathname}${url.search}`);
  const res = await fetch(url, {
    headers: { 'x-apisports-key': API_KEY }
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status} for ${endpoint}: ${text}`);
  }

  const json = await res.json();
  if (json.errors && Object.keys(json.errors).length > 0) {
    console.warn(`[API-Football] API Warnings/Errors for ${endpoint}:`, json.errors);
  }

  // Rate limiting delay (1.2 seconds between requests to avoid hitting rate limits)
  await sleep(1200);
  return json.response || [];
}

async function discoverSeason(leagueId, preferredSeason) {
  try {
    const leagues = await apiFetch('/leagues', { id: leagueId });
    if (!leagues || leagues.length === 0) {
      console.warn(`[API-Football] No league metadata for ID ${leagueId}, falling back to ${preferredSeason}`);
      return preferredSeason;
    }
    const seasons = leagues[0].seasons || [];
    const validSeasons = seasons
      .map(s => s.year)
      .filter(y => y >= 2020)
      .sort((a, b) => b - a);

    if (validSeasons.includes(preferredSeason)) {
      return preferredSeason;
    }
    return validSeasons[0] || preferredSeason;
  } catch (err) {
    console.warn(`[API-Football] Season discovery failed for ${leagueId}: ${err.message}`);
    return preferredSeason;
  }
}

async function fetchCompetitionData(compConfig) {
  const { key, leagueId, name, format, category, preferredSeason } = compConfig;
  console.log(`\n==================================================`);
  console.log(`[Fetch Layer] Processing: ${name} (ID: ${leagueId})`);
  console.log(`==================================================`);

  const actualSeason = await discoverSeason(leagueId, preferredSeason);
  console.log(`[Fetch Layer] Using season: ${actualSeason} (preferred: ${preferredSeason})`);

  let teams = [];
  let standings = [];
  let fixtures = [];
  let topScorers = [];
  let leagueLogo = '';

  // 1. Fetch Teams
  try {
    const teamsRaw = await apiFetch('/teams', { league: leagueId, season: actualSeason });
    teams = teamsRaw.map(t => ({
      id: t.team.id,
      name: t.team.name,
      code: t.team.code || t.team.name.slice(0, 3).toUpperCase(),
      logo: t.team.logo || '',
      country: t.team.country || '',
      stadium: t.venue?.name || '',
      capacity: t.venue?.capacity || 0,
      city: t.venue?.city || ''
    }));
    console.log(`[Fetch Layer] Loaded ${teams.length} teams for ${key}`);
  } catch (err) {
    console.warn(`[Fetch Layer] Teams fetch failed for ${key}: ${err.message}`);
  }

  // 2. Fetch Standings
  try {
    const standingsRaw = await apiFetch('/standings', { league: leagueId, season: actualSeason });
    if (standingsRaw?.[0]?.league) {
      leagueLogo = standingsRaw[0].league.logo || '';
      const rawGroups = standingsRaw[0].league.standings || [];
      standings = rawGroups.flat().map(s => ({
        pos: s.rank,
        teamId: s.team.id,
        club: s.team.name,
        logo: s.team.logo,
        group: s.group || 'Standings',
        mp: s.all.played,
        w: s.all.win,
        d: s.all.draw,
        l: s.all.lose,
        gf: s.all.goals.for,
        ga: s.all.goals.against,
        gd: s.goalsDiff,
        pts: s.points,
        form: s.form || '–',
        status: s.description || ''
      }));
      console.log(`[Fetch Layer] Loaded ${standings.length} standings rows for ${key}`);
    }
  } catch (err) {
    console.warn(`[Fetch Layer] Standings fetch failed for ${key}: ${err.message}`);
  }

  // 3. Fetch Top Scorers
  try {
    const scorersRaw = await apiFetch('/players/topscorers', { league: leagueId, season: actualSeason });
    topScorers = (scorersRaw || []).slice(0, 5).map((p, idx) => ({
      rank: idx + 1,
      name: p.player.name,
      photo: p.player.photo || '',
      team: p.statistics?.[0]?.team?.name || '',
      teamLogo: p.statistics?.[0]?.team?.logo || '',
      goals: p.statistics?.[0]?.goals?.total || 0,
      assists: p.statistics?.[0]?.goals?.assists || 0
    }));
    console.log(`[Fetch Layer] Loaded ${topScorers.length} top scorers for ${key}`);
  } catch (err) {
    console.warn(`[Fetch Layer] Top scorers fetch failed for ${key}: ${err.message}`);
  }

  // 4. Fetch Sample Fixtures
  try {
    const fixturesRaw = await apiFetch('/fixtures', { league: leagueId, season: actualSeason, next: 10 });
    fixtures = (fixturesRaw || []).map(f => ({
      id: f.fixture.id,
      date: f.fixture.date,
      venue: f.fixture.venue?.name || 'Main Stadium',
      status: f.fixture.status?.short || 'NS',
      home: f.teams.home.name,
      homeLogo: f.teams.home.logo,
      homeScore: f.goals.home,
      away: f.teams.away.name,
      awayLogo: f.teams.away.logo,
      awayScore: f.goals.away,
      round: f.league.round || 'Regular Season'
    }));
  } catch (err) {
    console.warn(`[Fetch Layer] Fixtures fetch failed for ${key}: ${err.message}`);
  }

  return {
    key,
    leagueId,
    name,
    category,
    format,
    requestedSeason: preferredSeason,
    actualSeason,
    logo: leagueLogo,
    teamCount: teams.length,
    teams,
    standings,
    topScorers,
    fixtures,
    isRealData: true,
    lastUpdated: new Date().toISOString()
  };
}

async function runDataPipeline() {
  console.log(`==================================================`);
  console.log(`STARTING API-FOOTBALL 10-COMPETITION FETCH PIPELINE`);
  console.log(`==================================================`);

  const outputData = {};

  for (const comp of COMPETITIONS_TO_FETCH) {
    try {
      const data = await fetchCompetitionData(comp);
      outputData[comp.key] = data;
    } catch (err) {
      console.error(`[Fetch Layer] Failed processing competition ${comp.key}:`, err.message);
    }
  }

  const dataDir = path.join(__dirname, '..', 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const jsonPath = path.join(dataDir, 'real-tournaments.json');
  const jsPath = path.join(dataDir, 'real-tournaments.js');

  fs.writeFileSync(jsonPath, JSON.stringify(outputData, null, 2), 'utf8');
  fs.writeFileSync(jsPath, `/* AUTO-GENERATED REAL FOOTBALL DATA LAYER */\nwindow.REAL_TOURNAMENTS_DATA = ${JSON.stringify(outputData, null, 2)};\n`, 'utf8');

  console.log(`\n✓ SUCCESS: Saved sanitized football data to:`);
  console.log(`  - ${jsonPath}`);
  console.log(`  - ${jsPath}`);
  console.log(`Pipeline complete without exposing API keys.`);
}

if (require.main === module) {
  if (!API_KEY) {
    console.log(`[Fetch Layer] Notice: API_FOOTBALL_KEY is not set in environment.`);
    console.log(`[Fetch Layer] Keeping existing sanitized offline local dataset in data/real-tournaments.js.`);
  } else {
    runDataPipeline().catch(err => {
      console.error('Fatal pipeline error:', err);
      process.exit(1);
    });
  }
}

module.exports = { runDataPipeline, discoverSeason, fetchCompetitionData, COMPETITIONS_TO_FETCH };