'use client';

import * as React from 'react';
import { cn } from '@/utils';

const Spinner = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent',
      className,
    )}
    {...props}
  />
);

export { Spinner };
