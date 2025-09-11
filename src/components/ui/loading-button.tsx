'use client';

import * as React from 'react';
import { Button, IButtonProps } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

interface ILoadingButtonProps extends IButtonProps {
  isLoading?: boolean;
}

const LoadingButton = React.forwardRef<HTMLButtonElement, ILoadingButtonProps>(
  ({ isLoading, children, disabled, ...props }, ref) => {
    return (
      <Button ref={ref} disabled={isLoading || disabled} {...props}>
        {isLoading ? <Skeleton className="h-4 w-full" /> : children}
      </Button>
    );
  }
);
LoadingButton.displayName = 'LoadingButton';

export { LoadingButton };
