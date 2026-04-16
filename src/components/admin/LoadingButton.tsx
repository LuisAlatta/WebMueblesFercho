"use client";

import { forwardRef } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { type VariantProps } from "class-variance-authority";

type ButtonProps = React.ComponentProps<typeof Button> &
  VariantProps<typeof buttonVariants>;

interface LoadingButtonProps extends ButtonProps {
  loading?: boolean;
  loadingText?: string;
}

const LoadingButton = forwardRef<HTMLButtonElement, LoadingButtonProps>(
  function LoadingButton(
    { loading = false, loadingText, disabled, children, ...props },
    ref
  ) {
    return (
      <Button
        ref={ref as React.Ref<HTMLButtonElement>}
        disabled={loading || disabled}
        {...props}
      >
        {loading && <Loader2 className="animate-spin" />}
        {loading && loadingText ? loadingText : children}
      </Button>
    );
  }
);

export default LoadingButton;
