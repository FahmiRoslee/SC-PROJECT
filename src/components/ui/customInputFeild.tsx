import { Input } from "@components/components/ui/input";
import { Label } from "@components/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/components/ui/select";
import { useEffect, useState } from "react";

// Text Input Field
interface TextInputFieldProps {
  id: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  readOnly?: boolean;
  disabled?: boolean;
  className?: string;
}

export const TextInputField = ({
  id,
  label,
  placeholder,
  required = false,
  type = "text",
  value,
  onChange,
  readOnly = false,
  disabled = false,
  className = "",
}: TextInputFieldProps) => (
  <div className="space-y-2 flex-1 font-sans">
    <Label
      htmlFor={id}
      className={`font-medium ${required ? "after:content-['*'] after:text-red-500 after:ml-0.5" : ""}`}
    >
      {label}
    </Label>
    <Input
      id={id}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      readOnly={readOnly}
      disabled={disabled}
      className={className}
    />
  </div>
);

// Date Input Field
interface DateInputFieldProps {
  id: string;
  label: string;
  required?: boolean;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const DateInputField = ({
  id,
  label,
  required = false,
  placeholder,
  value,
  onChange,
}: DateInputFieldProps) => (
  <div className="space-y-2 flex-1 font-sans">
    <Label
      htmlFor={id}
      className={`font-medium ${required ? "after:content-['*'] after:text-red-500 after:ml-0.5" : ""}`}
    >
      {label}
    </Label>
    <Input
      id={id}
      type="date"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  </div>
);
;

interface DropdownOption {
  label: string;
  value: string;
}

interface DropdownFieldProps {
  id: string;
  label: string;
  placeholder: string;
  options: DropdownOption[];
  required?: boolean; // Make it optional since you set a default false
  // ADD THESE TWO PROPS:
  value: string; // The currently selected value
  onValueChange: (value: string) => void; // Callback when the value changes
}

export const DropdownField = ({
  id,
  label,
  placeholder,
  options,
  required = false,
  value, // Destructure the value prop
  onValueChange, // Destructure the onValueChange prop
}: DropdownFieldProps) => (
  <div className="space-y-2 flex-1 font-sans">
    <Label
      htmlFor={id}
      className={`font-medium ${required ? "after:content-['*'] after:text-red-500 after:ml-0.5" : ""}`}
    >
      {label}
    </Label>
    {/* Pass the value and onValueChange props to the shadcn/ui Select component */}
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger id={id}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value} className="font-normal">
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
)

interface PhoneNumberFieldProps {
  id: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
export const PhoneNumberField = ({
  id,
  label,
  placeholder,
  required = false,
  value,
  onChange,
}: PhoneNumberFieldProps) => (
  <div className="space-y-2 flex-1 font-sans">
    <Label
      htmlFor={id}
      className={required ? "after:content-['*'] after:text-red-500 after:ml-0.5" : ""}
    >
      {label}
    </Label>
    <div className="flex">
      <Input
        className="w-16 rounded-r-none bg-muted text-muted-foreground cursor-not-allowed"
        value="+60"
        readOnly
      />
      <Input
        id={id}
        type="number"
        className="flex-1 rounded-l-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  </div>
);

interface FileInputFieldProps {
  id: string;
  label: string;
  required?: boolean;
  acceptedFormats?: string[];
  onFileChange?: (file: File | null) => void;
  value?: string; // ✅ NEW PROP
}

export const FileInputField = ({
  id,
  label,
  required = false,
  acceptedFormats,
  onFileChange,
  value, // ✅ file name from Redux
}: FileInputFieldProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setSelectedFile(file);
    if (onFileChange) {
      onFileChange(file);
    }
  };

  // ✅ Reset local file state if Redux doesn't match it
  useEffect(() => {
    if (!value) {
      setSelectedFile(null);
    }
  }, [value]);

  return (
    <div className="space-y-2 font-sans">
      <Label
        htmlFor={id}
        className={`font-medium ${
          required ? "after:content-['*'] after:text-red-500 after:ml-0.5" : ""
        }`}
      >
        {label}
        {acceptedFormats?.length > 0 && (
          <span className="text-muted-foreground ml-1">
            ({acceptedFormats.join(", ").toUpperCase()})
          </span>
        )}
      </Label>

      <div className="flex items-center space-x-2 px-2 py-2 border border-gray-400 rounded-md">
        <Input
          id={id}
          type="file"
          className="hidden"
          accept={acceptedFormats ? acceptedFormats.map((format) => `.${format}`).join(",") : ""}
          onChange={handleFileChange}
        />
        <Label
          htmlFor={id}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 cursor-pointer"
        >
          Choose File
        </Label>

        {/* ✅ Show file name from either local state or Redux value */}
        <span>{selectedFile?.name || value || "No file chosen"}</span>
      </div>
    </div>
  );
};