import { format } from "date-fns";
import { CalendarIcon, CheckIcon, ChevronDown, ChevronsUpDownIcon } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/custom/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { clsx } from "clsx";
import { useState } from "react";
import { PopoverAnchor } from "@radix-ui/react-popover";
import PhoneInput from "react-phone-number-input/input";
import { Label } from "./ui/label";

export const TextInputField = ({
  form,
  name,
  placeholder,
  required,
  label,
  className,
  disabled,
  type,
  maxLength,
}: {
  form: UseFormReturn<any>;
  name: string;
  placeholder: string;
  required?: boolean;
  label?: string;
  className?: string;
  disabled?: boolean;
  type?: "text" | "password" | "email";
  maxLength?: number;
}) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field, fieldState }) => {
        return (
          <FormItem className={className}>
            {label && (
              <div className="ml-1 flex min-h-5 items-center justify-between space-x-2">
                <Label>{label}</Label>
                <FormMessage />
              </div>
            )}
            <FormControl>
              <Input
                {...field}
                disabled={disabled}
                required={required}
                className={clsx(
                  "disabled:cursor-default",
                  fieldState.invalid && "border-red-500",
                )}
                placeholder={placeholder}
                type={type}
                maxLength={maxLength}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                  }
                }}
              />
            </FormControl>
          </FormItem>
        );
      }}
    />
  );
};

export const NumberInputField = (props: {
  form: UseFormReturn<any>;
  name: string;
  placeholder: string;
  label?: string;
  className?: string;
  disabled?: boolean;
  min?: number;
}) => {
  return (
    <FormField
      control={props.form.control}
      name={props.name}
      render={({ field, fieldState }) => (
        <FormItem className={props.className}>
          {props.label && (
            <div className="ml-1 flex min-h-5 items-center space-x-2">
              <FormLabel>{props.label}</FormLabel>
              <FormMessage />
            </div>
          )}
          <FormControl>
            <Input
              {...field}
              disabled={props.disabled}
              className={clsx(
                "disabled:cursor-default",
                fieldState.invalid && "border-red-500",
              )}
              placeholder={props.placeholder}
              type="number"
              min={props.min}
              onChange={(event) => field.onChange(+event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                }
              }}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
};

export const PhoneInputField = ({
  form,
  name,
  label,
  disabled,
}: {
  form: UseFormReturn<any>;
  name: string;
  label?: string;
  disabled?: boolean;
}) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem>
          {label && (
            <div className="ml-1 flex min-h-5 items-center justify-between space-x-2">
              <Label>{label}</Label>
              <FormMessage />
            </div>
          )}
          <FormControl>
            <PhoneInput
              className={clsx(
                "disabled:cursor-default",
                fieldState.invalid && "border-red-500",
              )}
              disabled={disabled}
              country="BD"
              international
              withCountryCallingCode
              inputComponent={Input}
              maxLength={16}
              {...field}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
};

export const SearchableInputField = ({
  form,
  name,
  placeholder,
  disabled = false,
  className,
  label,
  list,
  listHeading,
  onSelect,
}: {
  form: UseFormReturn<any>;
  name: string;
  placeholder: string;
  disabled?: boolean;
  className?: string;
  label?: string;
  list: { [key: string]: any }[];
  listHeading?: string;
  onSelect: (item: any) => void;
}) => {
  const [open, setOpen] = useState(false);
  const [filteredList, setFilteredList] = useState<{ [key: string]: any }[]>([]);
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          {label && (
            <div className="ml-1 flex min-h-5 items-center space-x-2">
              <FormLabel>{label}</FormLabel>
              <FormMessage />
            </div>
          )}
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverAnchor asChild>
              <FormControl>
                <Input
                  disabled={disabled}
                  {...field}
                  onChange={(event) => {
                    field.onChange(event);
                    if (event.target.value.length > 2) {
                      const filtered = list.filter((item) => {
                        return item[name]
                          .toLowerCase()
                          .includes(event.target.value.toLowerCase());
                      });
                      setFilteredList(filtered);
                      if (filtered.length > 0) {
                        setOpen(true);
                      } else {
                        setOpen(false);
                      }
                    } else {
                      setOpen(false);
                    }
                  }}
                  autoComplete="off"
                  className="disabled:cursor-default"
                  placeholder={placeholder}
                // type={type}
                />
              </FormControl>
            </PopoverAnchor>
            <PopoverContent
              className="p-1"
              onOpenAutoFocus={(event) => {
                event.preventDefault();
              }}
            >
              <Command shouldFilter={false}>
                <CommandList>
                  <CommandGroup
                    heading={
                      listHeading
                        ? listHeading
                        : `matching ${name}${filteredList.length > 1 ? "s" : ""}`
                    }
                  >
                    {filteredList.map((item) => (
                      <CommandItem
                        key={item.id}
                        value={item.id}
                        onSelect={() => {
                          form.setValue(name, item[name]);
                          setOpen(false);
                          onSelect(item);
                        }}
                      >
                        {item[name]}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </FormItem>
      )}
    />
  );
};

export const ComboBoxField = (props: {
  form: UseFormReturn<any>;
  name: string;
  placeholder: string;
  label?: string;
  list: {
    label: string;
    value: string;
  }[];
  disabled?: boolean;
}) => {
  return (
    <FormField
      control={props.form.control}
      name={props.name}
      render={({ field }) => (
        <FormItem className="w-full">
          {props.label && (
            <div className="ml-1 flex min-h-5 items-center space-x-2">
              <FormLabel>{props.label}</FormLabel>
              <FormMessage />
            </div>
          )}
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  disabled={props.disabled}
                  className={clsx(
                    "w-full justify-between",
                    !field.value && "text-muted-foreground",
                  )}
                >
                  {field.value
                    ? props.list.find((item) => item.value === field.value)?.label
                    : props.placeholder}
                  <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent align="start" className="mr-4 p-0">
              <Command>
                <CommandInput placeholder="Search" />
                <CommandList className="h-40">
                  <CommandEmpty>No Match</CommandEmpty>
                  <CommandGroup>
                    {props.list.map((item) => (
                      <CommandItem
                        key={item.value}
                        value={item.label}
                        onSelect={() => {
                          props.form.clearErrors(props.name);
                          props.form.setValue(props.name, item.value);
                        }}
                      >
                        <CheckIcon
                          className={clsx(
                            "mr-2 h-4 w-4",
                            item.value === field.value ? "opacity-100" : "opacity-0",
                          )}
                        />
                        {item.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </FormItem>
      )}
    />
  );
};

export const DateInputField = ({
  className,
  form,
  name,
  label,
  disabled,
  disabledDates,
  placeholder = "Pick a date",
}: {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  disabledDates?: (date: Date) => boolean;
}) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem className="flex flex-col">
          {label && (
            <div className="ml-1 flex min-h-5 items-center justify-between space-x-2">
              <Label>{label}</Label>
              <FormMessage />
            </div>
          )}
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  disabled={disabled}
                  className={clsx(
                    "min-w-[140px] pl-3 text-left font-normal",
                    !field.value && "text-muted-foreground",
                    fieldState.invalid && "border-red-500",
                  )}
                >
                  {field.value ? format(field.value, "d MMM yyyy") : placeholder}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={new Date(field.value)}
                onSelect={(value) => field.onChange(format(value!, "yyyy-MM-dd"))}
                disabled={disabledDates}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </FormItem>
      )}
    />
  );
};

export const SelectField = ({
  form,
  name,
  placeholder,
  list,
  label,
  className,
  disabled,
}: {
  form: UseFormReturn<any>;
  name: string;
  placeholder: string;
  list: {
    value: string;
    label?: string;
  }[];
  label?: string;
  className?: string;
  disabled?: boolean;
}) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field, fieldState }) => {
        return (
          <FormItem className={className}>
            {label && (
              <div className="ml-1 flex min-h-5 items-center justify-between gap-2">
                <Label>{label}</Label>
                <FormMessage />
              </div>
            )}
            <FormControl>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger
                  disabled={disabled}
                  className={clsx(
                    "h-10 disabled:cursor-default",
                    fieldState.invalid && "border-red-500",
                    !field.value && "text-foreground/50",
                  )}
                >
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                  {list.map((item, index) => (
                    <SelectItem key={index} value={item.value}>
                      {item.label || item.value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
          </FormItem>
        );
      }}
    />
  );
};

export const SelectGridField = ({
  form,
  name,
  label,
  placeholder,
  list,
  className,
  disabled,
}: {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  placeholder: string;
  list: { [key: string]: string | number }[];
  className?: string;
  disabled?: boolean;
}) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="w-full">
          <div className="ml-1 flex min-h-5 items-center space-x-2">
            {label && <FormLabel>{label}</FormLabel>}
            <FormMessage />
          </div>
          <Select
            disabled={disabled}
            onValueChange={field.onChange}
            defaultValue={field.value && String(field.value)}
          >
            <FormControl>
              <SelectTrigger
                className={clsx(
                  className,
                  "disabled:cursor-default",
                  !field.value && "text-muted-foreground",
                )}
              >
                {field.value ? <SelectValue /> : placeholder}
                <ChevronDown className="h-4 w-4 opacity-50" />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="md:w-[332px]">
              <div className="grid grid-cols-4 md:w-80 md:grid-cols-8">
                {list.map((item) => (
                  <SelectItem
                    key={item.value}
                    value={String(item.value)}
                    className={clsx(
                      "w-10 justify-center",
                      field.value === String(item.value) && "bg-foreground/10",
                      (item.label as number) % 100 === 1 && "col-start-1", // TODO: only for room number
                    )}
                  >
                    {item.label}
                  </SelectItem>
                ))}
              </div>
            </SelectContent>
          </Select>
        </FormItem>
      )}
    />
  );
};

export const SwitchField = ({
  form,
  name,
  label,
  className,
}: {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  className?: string;
}) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem
          className={clsx("flex items-center justify-between gap-2 space-y-0", className)}
        >
          <FormLabel>{label}</FormLabel>
          <Switch checked={field.value} onCheckedChange={field.onChange} />
        </FormItem>
      )}
    />
  );
};
