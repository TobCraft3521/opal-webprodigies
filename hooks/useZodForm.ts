import { UseMutateFunction } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import z, { ZodSchema } from "zod"
const useZodForm = (
  schema: ZodSchema,
  mutation: UseMutateFunction,
  defaultValues?: any
) => {
  const {
    register,
    watch,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues,
  })

  const onFormSubmit = handleSubmit(async (values) => {
    mutation({ ...values })
  })

  return {
    register,
    watch,
    reset,
    errors,
    onFormSubmit,
  }
}
export default useZodForm
