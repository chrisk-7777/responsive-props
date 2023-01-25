import classNames from 'classnames';
import { ReactNode } from 'react';

import { BreakpointValues, useResponsiveProps } from '../hooks/useMedia';

import cn from './stack.module.css';

type Direction = 'row' | 'column';

type StackProps = {
  children: ReactNode;
  direction?: Direction | BreakpointValues<Direction>;
};

export function Stack(props: StackProps) {
  const { children, direction = 'column' } = props;

  const directionClass = cn[useResponsiveProps(direction)];

  return <div className={classNames(cn.root, directionClass)}>{children}</div>;
}
