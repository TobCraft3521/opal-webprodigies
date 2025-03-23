import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import React from "react"
import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form"
import { ErrorMessage } from "@hookform/error-message"
import { Textarea } from "@/components/ui/textarea"

type Props = {
  type?: "text" | "email" | "password" | "number"
  inputType: "select" | "input" | "textarea"
  options?: {
    value: string
    label: string
    id: string
  }[]
  label?: string
  placeholder: string
  register: UseFormRegister<any>
  name: string
  errors: FieldErrors<FieldValues>
  lines?: number
}

const FormGenerator = ({
  type,
  inputType,
  options,
  label,
  placeholder,
  register,
  name,
  errors,
  lines,
}: Props) => {
  switch (inputType) {
    case "input":
      return (
        <Label
          className="flex flex-col gap-2 text-[#9D9D9D]"
          htmlFor={`input-${label}`}
        >
          {label && label}
          <Input
            id={`input-${label}`}
            type={type}
            placeholder={placeholder}
            className="bg-transparent border-themeGray text-themeTextGray"
            {...register(name)}
          />
          <ErrorMessage
            errors={errors}
            name={name}
            render={({ message }) => (
              <span className="text-red-400 mt-2">
                {message === "Required" ? "" : message}
              </span>
            )}
          />
        </Label>
      )
    case "select":
      return (
        <Label
          className="flex flex-col gap-2 text-[#9D9D9D]"
          htmlFor={`select-${label}`}
        >
          {label && label}
          <select
            id={`select-${label}`}
            className="w-full bg-transparent border-[1px] p-3 rounded-lg"
            {...register(name)}
          >
            {options?.length &&
              options.map((option) => (
                <option
                  key={option.id}
                  value={option.value}
                  className="dark:bg-muted"
                >
                  {option.label}
                </option>
              ))}
          </select>
          <ErrorMessage
            errors={errors}
            name={name}
            render={({ message }) => (
              <span className="text-red-400 mt-2">
                {message === "Required" ? "" : message}
              </span>
            )}
          />
        </Label>
      )
    case "textarea":
      return (
        <Label
          className="flex flex-col gap-2 text-[#9D9D9D]"
          htmlFor={`textarea-${label}`}
        >
          {label && label}
          <Textarea
            className="bg-transparent border-themeGray text-themeTextGray"
            id={`textarea-${label}`}
            placeholder={placeholder}
            rows={lines}
            {...register(name)}
          />
          <ErrorMessage
            errors={errors}
            name={name}
            render={({ message }) => (
              <span className="text-red-400 mt-2">
                {message === "Required" ? "" : message}
              </span>
            )}
          />
        </Label>
      )
  }
}

export default FormGenerator
