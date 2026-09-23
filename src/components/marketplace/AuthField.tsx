import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import type { Control, FieldPath, FieldValues } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

export function TextField<TValues extends FieldValues>({
  control,
  name,
  label,
  type,
  ...props
}: React.ComponentProps<typeof Input> & {
  control: Control<TValues>;
  name: FieldPath<TValues>;
  label: string;
}) {
  const [visible, setVisible] = useState(false);
  const isPassword = type === "password";
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            {isPassword ? (
              <div className="relative">
                <Input
                  {...field}
                  {...props}
                  type={visible ? "text" : "password"}
                  className="pr-10"
                  value={(field.value as string) ?? ""}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setVisible((v) => !v)}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground hover:text-foreground"
                  aria-label={visible ? "Hide password" : "Show password"}
                >
                  {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            ) : (
              <Input {...field} {...props} type={type} value={(field.value as string) ?? ""} />
            )}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export function PasswordInput(props: React.ComponentProps<typeof Input>) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <Input {...props} type={visible ? "text" : "password"} className="pr-10" />
      <button
        type="button"
        tabIndex={-1}
        onClick={() => setVisible((v) => !v)}
        className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground hover:text-foreground"
        aria-label={visible ? "Hide password" : "Show password"}
      >
        {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
    </div>
  );
}
