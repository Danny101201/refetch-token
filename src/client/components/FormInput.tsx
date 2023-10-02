import { register } from 'module';
import React, { ChangeEvent } from 'react'
import { FieldValues, UseFormRegister, Path, FieldError } from 'react-hook-form';


interface FormInputProps<SchemaType extends FieldValues> {
  label: string;
  register: UseFormRegister<SchemaType>
  name: Path<SchemaType>,
  error: FieldError | undefined
  type?: string;
  placeholder?: string;
}
export const FormInput = <SchemaType extends FieldValues>({
  label,
  name,
  register,
  error,
  type = 'text',
  placeholder = ''
}: FormInputProps<SchemaType>) => {
  return (
    <div>
      <label htmlFor={name} className='block text-ct-blue-600 mb-3'>
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        className='block w-full rounded-2xl appearance-none focus:outline-none py-2 px-4'
        {...register(name)}
      />
      {error && (
        <p className='text-red-500 text-xs pt-1 '>{error.message}</p>
      )}
    </div>
  )
}

