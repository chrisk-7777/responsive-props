import { useEffect, useState } from 'react';

import mediaVariables from '../styles/custom-media.module.css';

export type BreakpointValues<T> = Partial<Record<string, T>>;

// Must match custom-media.module.css
// --
// Accepting the manual list of breakpoints but it makes sense as we refer to manual breakpoints in css, and so we do the
// same in JS use the hooks at the bottom (useIsSm)
//
const mediaVariableKeys = ['sm', 'md', 'lg', 'xl'] as const;
const mediaVariableKeysReversed = [...mediaVariableKeys].reverse();
const mediaVariableValues: Record<typeof mediaVariableKeys[number], number> = {
  sm: cssVarToNumber(mediaVariables['sm']),
  md: cssVarToNumber(mediaVariables['md']),
  lg: cssVarToNumber(mediaVariables['lg']),
  xl: cssVarToNumber(mediaVariables['xl']),
} as const;

const getWindowsSize = () => window.innerWidth;

function cssVarToNumber(cssVar: string) {
  return Number(cssVar.replace('px', ''));
}

function getCurrentBp(screenWidth: number) {
  const matchedBp = mediaVariableKeysReversed.find((bp) => screenWidth >= mediaVariableValues[bp]);
  return matchedBp ?? 'base';
}

function backFillMissing(prop: BreakpointValues<string>) {
  if (Object.keys(prop).length === 0 || !('base' in prop)) {
    console.warn('responsiveProps@backFillMissing is empty and cannot be back filled');
    return prop;
  }

  let previous = prop.base!;

  mediaVariableKeys.forEach((bp) => {
    if (!prop[bp]) {
      prop[bp] = previous;
    }
    previous = prop[bp]!;
  });

  return prop;
}

export function useWindowSize(): number {
  const [windowSize, setWindowSize] = useState<number>(getWindowsSize());

  useEffect(() => {
    function handleResize() {
      setWindowSize(getWindowsSize());
    }

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return windowSize;
}

export function useResponsiveProps(prop: string | BreakpointValues<string>) {
  const width = useWindowSize();

  if (typeof prop === 'string') {
    return prop;
  }

  const bp = getCurrentBp(width);
  const backFilled = backFillMissing(prop);
  return backFilled[bp] ?? '';
}

export function useIsSm() {
  return useWindowSize() < mediaVariableValues.sm;
}
export function useIsMd() {
  return useWindowSize() < mediaVariableValues.md;
}
export function useIsLg() {
  return useWindowSize() < mediaVariableValues.lg;
}
export function useIsXl() {
  return useWindowSize() < mediaVariableValues.xl;
}
