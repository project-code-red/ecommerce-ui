import React from "react";
import { cn } from "@/lib/utils";

export interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ className, label, ...props }, ref) => {
    return (
      <div className="flex items-center space-x-2">
        <input
          type="radio"
          className={cn(
            "h-4 w-4 border-gray-300 text-primary focus:ring-primary focus:ring-offset-2",
            className
          )}
          ref={ref}
          {...props}
        />
        {label && (
          <label className="text-sm font-medium text-gray-700 cursor-pointer" onClick={() => {
            if (props.onChange && !props.disabled) {
              props.onChange({ target: { checked: true } } as any);
            }
          }}>
            {label}
          </label>
        )}
      </div>
    );
  }
);

Radio.displayName = "Radio";

