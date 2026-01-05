import React from "react";
import { cn } from "@/lib/utils";

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, ...props }, ref) => {
    return (
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          className={cn(
            "h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary focus:ring-offset-2",
            className
          )}
          ref={ref}
          {...props}
        />
        {label && (
          <label className="text-sm font-medium text-gray-700 cursor-pointer" onClick={() => {
            if (props.onChange && !props.disabled) {
              props.onChange({ target: { checked: !props.checked } } as any);
            }
          }}>
            {label}
          </label>
        )}
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";

