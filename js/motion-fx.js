/* ==========================================================================
   ARENA_CORE — Anime.js Motion & Confetti Celebration Engine
   Delivers broadcast-grade animations: multi-burst confetti cannons,
   trophy spring presentations, goal notification banners, and table row staggers.
   ========================================================================== */

(function () {
  'use strict';

  /**
   * Universal Anime.js wrapper supporting v4 (anime.animate) and v3 (anime({...}))
   */
  function runAnime(options) {
    if (!window.anime) return null;
    try {
      if (typeof window.anime.animate === 'function') {
        const targets = options.targets;
        const params = { ...options };
        delete params.targets;
        return window.anime.animate(targets, params);
      } else if (typeof window.anime === 'function') {
        return window.anime(options);
      }
    } catch (e) {
      console.warn('Anime execution fallback:', e);
    }
    return null;
  }

  function getStagger(val) {
    if (window.anime && typeof window.anime.stagger === 'function') {
      return window.anime.stagger(val);
    }
    return (el, i) => i * val;
  }

  /**
   * Multi-stage Confetti Cannon for Tournament Champions
   */
  function launchChampionConfetti(primaryColor = '#00f2fe') {
    if (typeof window.confetti !== 'function') return;

    const colors = ['#ffd700', '#ffffff', primaryColor, '#00ff87', '#60efff'];

    // Wave 1: Side cannons
    window.confetti({
      particleCount: 70,
      angle: 60,
      spread: 60,
      origin: { x: 0.05, y: 0.75 },
      colors
    });
    window.confetti({
      particleCount: 70,
      angle: 120,
      spread: 60,
      origin: { x: 0.95, y: 0.75 },
      colors
    });

    // Wave 2: Center skyburst after 300ms
    setTimeout(() => {
      window.confetti({
        particleCount: 100,
        spread: 120,
        startVelocity: 45,
        origin: { x: 0.5, y: 0.5 },
        colors: ['#ffd700', '#ffb703', '#ffffff', '#fb8500']
      });
    }, 320);

    // Wave 3: Raining sparkles after 750ms
    setTimeout(() => {
      window.confetti({
        particleCount: 60,
        angle: 90,
        spread: 160,
        gravity: 0.7,
        ticks: 300,
        origin: { x: 0.5, y: 0.2 },
        colors
      });
    }, 780);
  }

  /**
   * Trophy Presentation Animation with Anime.js
   */
  function animateTrophyPresentation(containerEl) {
    if (!containerEl) return;

    runAnime({
      targets: containerEl,
      scale: [0.65, 1.12, 1],
      opacity: [0, 1],
      duration: 1100
    });

    const trophyIcon = containerEl.querySelector('.champion-trophy-icon, .fa-trophy, svg');
    if (trophyIcon) {
      runAnime({
        targets: trophyIcon,
        translateY: [-8, 0],
        duration: 800,
        loop: true,
        alternate: true
      });
    }
  }

  /**
   * Full Champion Celebration Pipeline
   */
  function celebrateChampion(championName, tournName, accentColor = '#00f2fe') {
    // 1. Confetti
    launchChampionConfetti(accentColor);

    // 2. Victorious Fanfare + Stadium Roar
    if (window.ArenaAudio) {
      window.ArenaAudio.playFanfare();
      setTimeout(() => {
        window.ArenaAudio.playGoalHorn();
      }, 700);
    }

    // 3. Floating Champion Banner Notification
    showChampionToast(championName, tournName);
  }

  /**
   * Floating Champion Toast Banner
   */
  function showChampionToast(championName, tournName) {
    let toast = document.getElementById('arena-champion-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'arena-champion-toast';
      toast.className = 'arena-champion-toast';
      document.body.appendChild(toast);
    }

    toast.innerHTML = `
      <div class="champion-toast-inner">
        <div class="champion-toast-trophy">🏆</div>
        <div class="champion-toast-content">
          <span class="champion-toast-league">${tournName.toUpperCase()} CHAMPION</span>
          <span class="champion-toast-name">${championName}</span>
        </div>
        <div class="champion-toast-stars">⭐⭐⭐</div>
      </div>
    `;

    toast.classList.add('visible');

    runAnime({
      targets: toast,
      translateY: [-60, 0],
      opacity: [0, 1],
      scale: [0.85, 1],
      duration: 800
    });

    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => {
      runAnime({
        targets: toast,
        translateY: [0, -40],
        opacity: [1, 0],
        scale: [1, 0.9],
        duration: 500,
        onComplete: () => {
          toast.classList.remove('visible');
        }
      });
    }, 4500);
  }

  /**
   * Real-Time Goal Celebration Toast
   */
  function showGoalBanner(teamName, scoreLine = '', isPenalty = false) {
    let banner = document.getElementById('arena-goal-banner');
    if (!banner) {
      banner = document.createElement('div');
      banner.id = 'arena-goal-banner';
      banner.className = 'arena-goal-banner';
      document.body.appendChild(banner);
    }

    banner.innerHTML = `
      <div class="goal-banner-inner">
        <span class="goal-pulse-ring"></span>
        <span class="goal-badge">${isPenalty ? '⚽ PENALTY GOAL!' : '⚽ GOAL!'}</span>
        <span class="goal-team-name">${teamName}</span>
        ${scoreLine ? `<span class="goal-score-pill">${scoreLine}</span>` : ''}
      </div>
    `;

    banner.classList.add('active');

    // Play Goal Horn & Referee Whistle
    if (window.ArenaAudio) {
      window.ArenaAudio.playWhistle('short');
      window.ArenaAudio.playGoalHorn();
    }

    // Mini confetti burst on goal
    if (typeof window.confetti === 'function') {
      window.confetti({
        particleCount: 35,
        spread: 60,
        origin: { x: 0.5, y: 0.25 },
        colors: ['#00f2fe', '#ffd700', '#ffffff']
      });
    }

    runAnime({
      targets: banner,
      scale: [0.75, 1.08, 1],
      opacity: [0, 1],
      duration: 550
    });

    clearTimeout(banner._dismissTimer);
    banner._dismissTimer = setTimeout(() => {
      runAnime({
        targets: banner,
        opacity: [1, 0],
        scale: [1, 0.8],
        translateY: [0, -20],
        duration: 400,
        onComplete: () => {
          banner.classList.remove('active');
        }
      });
    }, 2800);
  }

  /**
   * Stagger-in Standings Table Rows
   */
  function staggerStandings() {
    const rows = document.querySelectorAll('.standings-table tbody tr, .league-table-clean tbody tr, .tech-table tbody tr');
    if (!rows.length) return;

    runAnime({
      targets: rows,
      opacity: [0, 1],
      translateX: [-18, 0],
      delay: getStagger(22),
      duration: 450
    });
  }

  /**
   * Stagger-in Matchday Fixture Cards
   */
  function staggerFixtures() {
    const cards = document.querySelectorAll('.matchday-fixture-card, .match-card, .ucl-gate-league-card');
    if (!cards.length) return;

    runAnime({
      targets: cards,
      opacity: [0, 1],
      translateY: [16, 0],
      delay: getStagger(28),
      duration: 500
    });
  }

  // Expose on window.ArenaMotion
  window.ArenaMotion = {
    runAnime,
    launchChampionConfetti,
    animateTrophyPresentation,
    celebrateChampion,
    showGoalBanner,
    staggerStandings,
    staggerFixtures
  };
})();
