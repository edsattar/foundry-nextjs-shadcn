"use client";

import * as React from "react";
import { EyeIcon, EyeOffIcon, MinusIcon, PlusIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { cva, type VariantProps } from "class-variance-authority";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

const InputPassword = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const toggleVisibility = () => setShowPassword(!showPassword);

    return (
      <div className="relative">
        <input
          type={type === "password" ? (showPassword ? "text" : "password") : type}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground placeholder:opacity-75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            className,
          )}
          ref={ref}
          {...props}
        />
        {type === "password" && (
          <div className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3 text-gray-400">
            {showPassword ? (
              <EyeIcon className="h-4 w-4" onClick={toggleVisibility} />
            ) : (
              <EyeOffIcon className="h-4 w-4" onClick={toggleVisibility} />
            )}
          </div>
        )}
      </div>
    );
  },
);
InputPassword.displayName = "InputPassword";

const spinVariants = cva("relative", {
  variants: {
    spinVariant: {
      default: "",
      none: "[&_input]:[-moz-appearance:textfield] [&_input]:[&::-webkit-inner-spin-button]:[-webkit-appearance:none]",
      end: "[&_input]:[-moz-appearance:textfield] [&_input]:[&::-webkit-inner-spin-button]:[-webkit-appearance:none] [&_input]:pr-6 [&_div]:right-0",
    },
  },
  defaultVariants: {
    spinVariant: "default",
  },
});

type SpinVariant = VariantProps<typeof spinVariants>["spinVariant"];

interface InputNumberProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof spinVariants> {
  incrementValue?: number;
  allowFloat?: boolean;
  value?: string;
  onChange: (...event: any[]) => void;
  min?: number;
  max?: number;
}

const InputNumber = React.forwardRef<HTMLInputElement, InputNumberProps>(
  (
    {
      className,
      value: controlledValue,
      onChange,
      max = Number.MAX_SAFE_INTEGER,
      min = Number.MIN_SAFE_INTEGER,
      incrementValue = 1,
      allowFloat = false,
      spinVariant = "default",
      ...props
    },
    ref,
  ) => {
    const timeoutId = React.useRef<NodeJS.Timeout | null>(null);
    const intervalId = React.useRef<NodeJS.Timeout | null>(null);

    const [value, setValue] = React.useState<string>(controlledValue ?? "0");

    React.useEffect(() => {
      if (controlledValue) {
        setValue(controlledValue);
      }
    }, [controlledValue]);

    const increment = () => {
      setValue((prev) => {
        const float = parseFloat(prev);
        if (isNaN(float)) return min.toString() ?? "0";
        const val = allowFloat ? float : Math.floor(float);
        return Math.min(max, val + incrementValue).toString();
      });
    };
    const handleIncrement = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      increment();
      timeoutId.current = setTimeout(() => {
        intervalId.current = setInterval(increment, 100);
      }, 500);
    };

    const decrement = () => {
      setValue((prev) => {
        const float = parseFloat(prev);
        if (isNaN(float)) return min.toString() ?? "0";
        const val = allowFloat ? float : Math.ceil(float);
        return Math.max(min, val - incrementValue).toString();
      });
    };
    const handleDecrement = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      decrement();
      timeoutId.current = setTimeout(() => {
        intervalId.current = setInterval(decrement, 100);
      }, 500);
    };
    const handleMouseUp = () => {
      clearTimeout(timeoutId.current!);
      clearInterval(intervalId.current!);
      onChange(value);
    };
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.value;
      if (parseFloat(newValue) > max) {
        setValue(max.toString());
        return;
      } else if (parseFloat(newValue) < min) {
        setValue(min.toString());
        return;
      }
      setValue(newValue);
      onChange(newValue);
    };
    return (
      <div className={spinVariants({ spinVariant })}>
        {!(spinVariant === "none" || spinVariant === "default") && (
          <div className="absolute top-0 flex h-full w-6 flex-col">
            <Button
              size="icon"
              type="button"
              className="h-1/2 w-full p-1"
              onMouseDown={handleIncrement}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <PlusIcon />
            </Button>
            <Button
              size="icon"
              type="button"
              className="h-1/2 w-full p-1"
              onMouseDown={handleDecrement}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <MinusIcon />
            </Button>
          </div>
        )}
        <input
          {...props}
          ref={ref}
          type="number"
          value={value}
          onChange={handleChange}
          min={min}
          max={max}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground placeholder:opacity-75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            className,
          )}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
            }
          }}
        />
      </div>
    );
  },
);
InputNumber.displayName = "InputNumber";

export { Input, InputNumber, InputPassword, type SpinVariant };
