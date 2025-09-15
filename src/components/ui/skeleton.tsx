'use client';

import * as React from 'react';
import { cn } from '@/utils/utils';

type SkeletonProps = React.HTMLAttributes<HTMLDivElement>;

const Skeleton = ({ className, ...props }: SkeletonProps) => (
  <div className={cn('animate-pulse rounded-md bg-muted', className)} {...props} />
);

export { Skeleton };
