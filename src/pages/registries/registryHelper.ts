import React, { lazy, createElement } from 'react';

const lazyCache = new Map<string, React.LazyExoticComponent<any>>();

/**
 * rp - registry page loader
 * Uses a static import function that the bundler CAN analyze.
 * Pages are lazy-loaded on demand with proper code splitting.
 */
export function rp(
importFn: () => Promise<any>,
exportName: string)
: () => React.LazyExoticComponent<any> {
  const cacheKey = `rp_${exportName}_${Math.random().toString(36).slice(2, 8)}`;
  let cached: React.LazyExoticComponent<any> | null = null;

  return () => {
    if (cached) {
      return cached;
    }
    const LazyComponent = lazy(() =>
    importFn().
    then((m: any) => {
      const component = m[exportName] || m.default;
      if (!component) {
        return {
          default: () =>
          createElement(
            'div',
            {
              className:
              'flex-1 flex items-center justify-center p-12 text-center text-gray-500'
            },
            createElement(
              'p',
              null,
              `Page "${exportName}" is not available.`
            )
          )
        };
      }
      return { default: component };
    }).
    catch(() => ({
      default: () =>
      createElement(
        'div',
        {
          className:
          'flex-1 flex items-center justify-center p-12 text-center text-gray-500'
        },
        createElement('p', null, 'Failed to load page. Please refresh.')
      )
    }))
    );
    cached = LazyComponent;
    return LazyComponent;
  };
}