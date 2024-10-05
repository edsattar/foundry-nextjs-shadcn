import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import PhoneInput from "react-phone-number-input/input";
import PhoneInputWithCountry, { Country } from "react-phone-number-input";
import { CalendarIcon, ChevronDown } from "lucide-react";
import { UseFormReturn, FieldValues, Path } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Calendar, type CalendarProps } from "@/components/ui_/calendar";
import { Input, InputNumber, SpinVariant } from "./input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useCallback, useState } from "react";

export const TextInputField = <TFieldValues extends FieldValues>({
  form,
  name,
  placeholder,
  disabled,
  label,
  className,
  required,
  type,
  maxLength,
}: {
  form: UseFormReturn<TFieldValues>;
  name: Path<TFieldValues>;
  placeholder: string;
  disabled?: boolean;
  label?: string;
  className?: string;
  required?: boolean;
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
                className={`disabled:cursor-default ${fieldState.invalid && "border-red-500"}`}
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

export const NumberInputField = <TFieldValues extends FieldValues>({
  form,
  name,
  placeholder,
  label,
  className,
  disabled,
  min,
  max,
  spinVariant,
  showErrorMessage,
}: {
  form: UseFormReturn<TFieldValues>;
  name: Path<TFieldValues>;
  placeholder: string;
  label?: string;
  className?: string;
  disabled?: boolean;
  min?: number;
  max?: number;
  spinVariant?: SpinVariant;
  showErrorMessage?: boolean;
}) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem className={className}>
          {label && (
            <div className="ml-1 flex min-h-5 items-center space-x-2">
              <FormLabel>{label}</FormLabel>
              {/* <FormMessage /> */}
            </div>
          )}
          <FormControl>
            <InputNumber
              {...field}
              disabled={disabled}
              className={`disabled:cursor-default ${fieldState.invalid && "border-red-500"}`}
              placeholder={placeholder}
              min={min}
              max={max}
              spinVariant={spinVariant}
            />
          </FormControl>
          {showErrorMessage && (
            <div className="h-4 px-2">
              <FormMessage className="h-4 overflow-hidden overflow-ellipsis text-nowrap text-right leading-tight" />
            </div>
          )}
        </FormItem>
      )}
    />
  );
};

export const PhoneInputField = <TFieldValues extends FieldValues>({
  form,
  name,
  label,
  disabled,
  country,
  countrySelect = false,
}: {
  form: UseFormReturn<TFieldValues>;
  name: Path<TFieldValues>;
  label?: string;
  disabled?: boolean;
  country?: Country;
  countrySelect?: boolean;
}) => {
  const CountrySelect = ({
    name,
    value,
    onChange,
    options,
  }: {
    name: string;
    value: string;
    onChange: (value: string | undefined) => void;
    options: {
      value: string;
      label: string;
    }[];
  }) => {
    const onChange_ = useCallback(
      (value: string) => onChange(value === "ZZ" ? "" : value),
      [onChange],
    );
    return (
      <Select name={name} value={value} onValueChange={onChange_}>
        <SelectTrigger className="w-2/5 disabled:cursor-default" disabled={disabled}>
          <SelectValue placeholder="International" />
        </SelectTrigger>
        <SelectContent>
          {options.map((option, index) => (
            <SelectItem key={index} value={option.value || "ZZ"}>
              {option.value} - {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  };

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field, fieldState }) => {
        return (
          <FormItem>
            {label && (
              <div className="ml-1 flex min-h-5 items-center justify-between space-x-2 ">
                <Label>{label}</Label>
                <FormMessage />
              </div>
            )}
            <FormControl>
              {countrySelect ? (
                <PhoneInputWithCountry
                  className={`mt-0 flex gap-x-2 [&_input]:w-3/5 ${fieldState.invalid && "[&_input]:border-red-500"}`}
                  disabled={disabled}
                  defaultCountry="BD"
                  countrySelectComponent={CountrySelect}
                  inputComponent={Input}
                  limitMaxLength
                  international
                  {...field}
                />
              ) : (
                <PhoneInput
                  className={fieldState.invalid && "border-red-500"}
                  disabled={disabled}
                  country={country}
                  international
                  withCountryCallingCode
                  inputComponent={Input}
                  {...field}
                />
              )}
            </FormControl>
          </FormItem>
        );
      }}
    />
  );
};

// export const SearchableInputField = <TFieldValues extends FieldValues>({
//   form,
//   name,
//   placeholder,
//   disabled,
//   className,
//   label,
//   list,
//   listHeading,
//   onSelect,
// }: {
//   form: UseFormReturn<TFieldValues>;
//   name: Path<TFieldValues>;
//   placeholder: string;
//   disabled?: boolean;
//   className?: string;
//   label?: string;
//   list: { [key: string]: any }[];
//   listHeading?: string;
//   onSelect: (item: any) => void;
// }) => {
//   const [open, setOpen] = useState(false);
//   const [filteredList, setFilteredList] = useState<{ [key: string]: any }[]>([]);
//   return (
//     <FormField
//       control={form.control}
//       name={name}
//       render={({ field }) => (
//         <FormItem className={className}>
//           {label && (
//             <div className="ml-1 flex min-h-5 items-center space-x-2">
//               <FormLabel>{label}</FormLabel>
//               <FormMessage />
//             </div>
//           )}
//           <Popover open={open} onOpenChange={setOpen}>
//             <PopoverAnchor asChild>
//               <FormControl>
//                 <Input
//                   disabled={disabled}
//                   {...field}
//                   onChange={(event) => {
//                     field.onChange(event);
//                     if (event.target.value.length > 2) {
//                       const filtered = list.filter((item) => {
//                         return item[name]
//                           .toLowerCase()
//                           .includes(event.target.value.toLowerCase());
//                       });
//                       setFilteredList(filtered);
//                       if (filtered.length > 0) {
//                         setOpen(true);
//                       } else {
//                         setOpen(false);
//                       }
//                     } else {
//                       setOpen(false);
//                     }
//                   }}
//                   autoComplete="off"
//                   className="disabled:cursor-default"
//                   placeholder={placeholder}
//                   // type={type}
//                 />
//               </FormControl>
//             </PopoverAnchor>
//             <PopoverContent
//               className="p-1"
//               onOpenAutoFocus={(event) => {
//                 event.preventDefault();
//               }}
//             >
//               <Command shouldFilter={false}>
//                 <CommandList>
//                   <CommandGroup
//                     heading={
//                       listHeading
//                         ? listHeading
//                         : `matching ${name}${filteredList.length > 1 ? "s" : ""}`
//                     }
//                   >
//                     {filteredList.map((item) => (
//                       <CommandItem
//                         key={item.id}
//                         value={item.id}
//                         onSelect={() => {
//                           form.setValue(name, item[name]);
//                           setOpen(false);
//                           onSelect(item);
//                         }}
//                       >
//                         {item[name]}
//                       </CommandItem>
//                     ))}
//                   </CommandGroup>
//                 </CommandList>
//               </Command>
//             </PopoverContent>
//           </Popover>
//         </FormItem>
//       )}
//     />
//   );
// };

// export const ComboBoxField = <TFieldValues extends FieldValues>(props: {
//   form: UseFormReturn<TFieldValues>;
//   name: Path<TFieldValues>;
//   placeholder: string;
//   label?: string;
//   disabled?: boolean;
//   list: {
//     label: string;
//     value: string;
//   }[];
// }) => {
//   return (
//     <FormField
//       control={props.form.control}
//       name={props.name}
//       render={({ field }) => (
//         <FormItem className="w-full">
//           {props.label && (
//             <div className="ml-1 flex min-h-5 items-center space-x-2">
//               <FormLabel>{props.label}</FormLabel>
//               <FormMessage />
//             </div>
//           )}
//           <Popover>
//             <PopoverTrigger asChild>
//               <FormControl>
//                 <Button
//                   variant="outline"
//                   role="combobox"
//                   disabled={props.disabled}
//                   className={`w-full justify-between ${!field.value && "text-muted-foreground"}`}
//                 >
//                   {field.value
//                     ? props.list.find((item) => item.value === field.value)?.label
//                     : props.placeholder}
//                   <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
//                 </Button>
//               </FormControl>
//             </PopoverTrigger>
//             <PopoverContent align="start" className="mr-4 p-0">
//               <Command>
//                 <CommandInput placeholder="Search" />
//                 <CommandList className="h-40">
//                   <CommandEmpty>No Match</CommandEmpty>
//                   <CommandGroup>
//                     {props.list.map((item) => (
//                       <CommandItem
//                         key={item.value}
//                         value={item.label}
//                         onSelect={() => {
//                           props.form.clearErrors(props.name);
//                           props.form.setValue(props.name, item.value);
//                         }}
//                       >
//                         <CheckIcon
//                           className={`mr-2 h-4 w-4 ${item.value === field.value ? "opacity-100" : "opacity-0"}`}
//                         />
//                         {item.label}
//                       </CommandItem>
//                     ))}
//                   </CommandGroup>
//                 </CommandList>
//               </Command>
//             </PopoverContent>
//           </Popover>
//         </FormItem>
//       )}
//     />
//   );
// };

export const DateInputField = <TFieldValues extends FieldValues>({
  className,
  form,
  name,
  label,
  disabled,
  placeholder = "Pick a date",
  disabledDates,
  initialFocus = false,
  fromMonth,
  month,
  onMonthChange,
}: CalendarProps & {
  form: UseFormReturn<TFieldValues>;
  name: Path<TFieldValues>;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  disabledDates?: (date: Date) => boolean;
}) => {
  const [localMonth, setLocalMonth] = useState(new Date());

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem className={className}>
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
                  className={`h-10 w-full min-w-[80px] px-2 text-left font-normal 2xs:px-3 ${!field.value && "text-muted-foreground"} ${fieldState.invalid && "border-red-500"}`}
                >
                  {field.value ? (
                    <p>
                      {format(field.value, "d MMM")}
                      <span className="max-2xs:hidden"> {field.value.getFullYear()}</span>
                      <span className="2xs:hidden"> &apos;{field.value.getFullYear() % 100}</span>
                    </p>
                  ) : (
                    placeholder
                  )}
                  <CalendarIcon
                    className={`ml-auto h-4 w-4 opacity-50 ${field.value ? "max-xs:hidden" : ""}`}
                  />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={(value?: Date) => {
                  if (!value) return;
                  // if (month.getMonth() !== value.getMonth()) {
                  //   setMonth(value);
                  // }
                  field.onChange(value);
                }}
                month={month ?? localMonth}
                onMonthChange={onMonthChange ?? setLocalMonth}
                disabled={disabledDates}
                required
                {...{ initialFocus, fromMonth }}
              />
            </PopoverContent>
          </Popover>
        </FormItem>
      )}
    />
  );
};

export const DateRangeField = <TFieldValues extends FieldValues>({
  className,
  form,
  name,
  label,
  disabled,
  disabledDates,
  placeholder = "Pick a date",
  initialFocus = false,
}: {
  form: UseFormReturn<TFieldValues>;
  name: Path<TFieldValues>;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  disabledDates?: (date: Date) => boolean;
  initialFocus?: boolean;
}) => {
  const formatDateRange = (value: DateRange) => {
    if (value.from && value.to) {
      return `${format(value.from, "d MMM")} - ${format(value.to, "d MMM")}`;
    } else if (value.from) {
      return format(value.from, "d MMM");
    } else {
      return null;
    }
  };

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem className={className}>
          {label && <Label className="h-5">{label}</Label>}
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  disabled={disabled}
                  className={`h-10 w-full min-w-36 px-3 font-normal max-[384px]:min-w-28 max-[384px]:px-1.5 ${!field.value ? "text-muted-foreground" : ""} ${fieldState.invalid ? "border-red-500" : ""}`}
                >
                  {formatDateRange(field.value) ?? placeholder}
                  <CalendarIcon
                    className={`ml-auto h-4 w-4 opacity-50 ${field.value.from ? "max-2xs:hidden" : ""}`}
                  />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus={initialFocus}
                mode="range"
                selected={field.value}
                onSelect={(value) => field.onChange(value!)}
                numberOfMonths={2}
                disabled={disabledDates}
              />
            </PopoverContent>
          </Popover>
        </FormItem>
      )}
    />
  );
};

export const SelectField = <TFieldValues extends FieldValues>({
  form,
  name,
  placeholder,
  list,
  label,
  className,
  disabled,
}: {
  form: UseFormReturn<TFieldValues>;
  name: Path<TFieldValues>;
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
                  className={`h-10 disabled:cursor-default ${!field.value && "text-muted-foreground"} ${fieldState.invalid && "border-red-500"}`}
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

export const SelectGridField = <TFieldValues extends FieldValues>({
  form,
  name,
  label,
  placeholder,
  list,
  disabled,
}: {
  form: UseFormReturn<TFieldValues>;
  name: Path<TFieldValues>;
  label: string;
  placeholder: string;
  list: { [key: string]: string | number }[];
  disabled?: boolean;
}) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field, fieldState }) => (
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
                className={`disabled:cursor-default ${!field.value && "text-muted-foreground"} ${fieldState.invalid && "border-red-500"}`}
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
                    // TODO: only for room number
                    className={`w-10 justify-center ${field.value === String(item.value) && "bg-foreground/10"} ${(item.label as number) % 100 === 1 && "col-start-1"}`}
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

export const SwitchField = <TFieldValues extends FieldValues>({
  form,
  name,
  label,
}: {
  form: UseFormReturn<TFieldValues>;
  name: Path<TFieldValues>;
  label: string;
}) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex items-center justify-between gap-2 space-y-0">
          <FormLabel>{label}</FormLabel>
          <Switch checked={field.value} onCheckedChange={field.onChange} />
        </FormItem>
      )}
    />
  );
};
