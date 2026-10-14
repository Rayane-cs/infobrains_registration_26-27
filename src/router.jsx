import React, { createContext, useContext, useEffect, useState, useTransition } from 'react';
import { getCategoryById } from './config/categories.js';

const RouterContext = createContext({
  path: '/',
  category: null,
  navigate: () => {},
});

function parseLocation() {
  const pathname = window.location.pathname.replace(/\/+$/, '') || '/';
  const rawHash = window.location.hash.replace(/^#\/?/, '').trim();
  const hash = rawHash.split('?')[0].trim();

  // Check if hash points to a category (e.g. #web, #category/web, #/ai)
  if (hash) {
    const hashClean = hash.replace(/^category\//, '').replace(/^\//, '');
    const categoryFromHash = getCategoryById(hashClean);
    if (categoryFromHash) {
      return {
        path: `/${categoryFromHash.id}`,
        category: categoryFromHash,
      };
    }
  }

  // Check pathname (e.g. /web, /category/web, /ai)
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length > 0) {
    const candidate = segments[segments[0] === 'category' ? 1 : 0];
    const matchedCategory = getCategoryById(candidate);
    if (matchedCategory) {
      return {
        path: `/${matchedCategory.id}`,
        category: matchedCategory,
      };
    }
  }

  return {
    path: '/',
    category: null,
  };
}

export function RouterProvider({ children }) {
  const [routeState, setRouteState] = useState(parseLocation);
  const [, startTransition] = useTransition();

  useEffect(() => {
    function handleLocationChange() {
      startTransition(() => {
        setRouteState(parseLocation());
      });
    }

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  function navigate(to, { replace = false } = {}) {
    let target = to;
    if (!target.startsWith('/') && !target.startsWith('#')) {
      target = `/${target}`;
    }

    if (replace) {
      window.history.replaceState(null, '', target);
    } else {
      window.history.pushState(null, '', target);
    }

    startTransition(() => {
      setRouteState(parseLocation());
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  return (
    <RouterContext.Provider
      value={{
        path: routeState.path,
        category: routeState.category,
        isHome: !routeState.category && routeState.path === '/',
        navigate,
      }}
    >
      {children}
    </RouterContext.Provider>
  );
}

export function useRouter() {
  return useContext(RouterContext);
}

export function Link({ to, children, className = '', onClick, replace = false, ...rest }) {
  const { navigate } = useRouter();

  function handleClick(event) {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.altKey ||
      event.ctrlKey ||
      event.shiftKey
    ) {
      return;
    }

    event.preventDefault();
    if (onClick) onClick(event);
    navigate(to, { replace });
  }

  return (
    <a href={to} className={className} onClick={handleClick} {...rest}>
      {children}
    </a>
  );
}
