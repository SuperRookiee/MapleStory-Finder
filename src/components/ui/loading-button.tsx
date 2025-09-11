'use client';

import * as React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

interface LoadingButtonProps extends ButtonProps {
  isLoading?: boolean;
}

const LoadingButton = React.forwardRef<HTMLButtonElement, LoadingButtonProps>(
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
