/**
 * ARENA CORE — Client Router (Milestone 1)
 * Lightweight declarative client-side router supporting HTML5 History
 * and Hash fallback for static Azure hosting.
 */

(function () {
  'use strict';

  const routes = [];
  let currentRoute = null;

  /**
   * Register a route pattern with an optional handler
   * e.g. addRoute('/competition/:competitionId/standings', handler)
   */
  function addRoute(pattern, handler) {
    const paramNames = [];
    // Convert /competition/:competitionId into regex /competition/([^/]+)
    const regexPattern = pattern
      .replace(/:([a-zA-Z0-9_]+)/g, (_, name) => {
        paramNames.push(name);
        return '([^/]+)';
      })
      .replace(/\//g, '\\/');

    const regex = new RegExp(`^${regexPattern}$`);
    routes.push({ pattern, regex, paramNames, handler });
  }

  /**
   * Parse path and extract query parameters
   */
  function parseLocation() {
    let rawPath = window.location.pathname;

    // Check if using hash routing fallback (e.g. /#/competition/ucl)
    if (window.location.hash && window.location.hash.startsWith('#/')) {
      rawPath = window.location.hash.substring(1);
    }

    const [pathname, search] = rawPath.split('?');
    const query = {};
    if (search) {
      new URLSearchParams(search).forEach((v, k) => {
        query[k] = v;
      });
    }

    // Clean pathname
    const cleanPath = (pathname || '/').replace(/\/+$/, '') || '/';
    return { path: cleanPath, query };
  }

  /**
   * Match a path against registered routes
   */
  function matchRoute(path) {
    for (const r of routes) {
      const match = path.match(r.regex);
      if (match) {
        const params = {};
        r.paramNames.forEach((name, index) => {
          params[name] = decodeURIComponent(match[index + 1]);
        });
        return { route: r, params, path };
      }
    }
    return null;
  }

  /**
   * Navigate to a path programmatically
   */
  function navigate(targetPath, replace = false) {
    const cleanPath = targetPath.startsWith('/') ? targetPath : `/${targetPath}`;
    
    // Check if server supports HTML5 routing or if we should use hash
    const useHash = window.location.protocol === 'file:' || window._ARENA_USE_HASH_ROUTER;

    if (useHash) {
      if (replace) {
        window.location.replace(`#${cleanPath}`);
      } else {
        window.location.hash = `#${cleanPath}`;
      }
    } else {
      if (replace) {
        window.history.replaceState(null, '', cleanPath);
      } else {
        window.history.pushState(null, '', cleanPath);
      }
      handleRouteChange();
    }
  }

  /**
   * Main route resolver
   */
  function handleRouteChange() {
    const { path, query } = parseLocation();
    const matched = matchRoute(path);

    if (matched) {
      currentRoute = {
        path,
        pattern: matched.route.pattern,
        params: matched.params,
        query
      };

      if (window.AppState) {
        window.AppState.setRoute(currentRoute);
      }

      if (typeof matched.route.handler === 'function') {
        matched.route.handler(matched.params, query);
      }
    } else {
      // Fallback: route to home
      if (path !== '/') {
        console.warn(`[Router] No route match for: ${path}, redirecting to /`);
        navigate('/', true);
      }
    }
  }

  /**
   * Initialize router listeners
   */
  function init() {
    window.addEventListener('popstate', handleRouteChange);
    window.addEventListener('hashchange', handleRouteChange);

    // Initial resolution once DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', handleRouteChange);
    } else {
      handleRouteChange();
    }
  }

  window.ArenaRouter = {
    addRoute,
    navigate,
    getCurrentRoute: () => currentRoute,
    parseLocation,
    init
  };
})();
