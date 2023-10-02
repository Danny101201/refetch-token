import React, { ChangeEvent, useState } from 'react'
import { Control, Controller, FieldError, FieldValues, Path, UseFormRegister, UseFormSetValue, useController, useFormContext } from 'react-hook-form'
import { useStore } from '../store'
import { Spinner } from './Spinner'

interface FileUploadProps<SchemaType extends FieldValues> {
  label: string,
  register: UseFormRegister<SchemaType>
  name: Path<SchemaType>,
  // control: Control<SchemaType, any>,
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  error: FieldError | undefined
}
export const FileUpload = <SchemaType extends FieldValues>({ label, error, name, register, onChange }: FileUploadProps<SchemaType>) => {
  const { uploadImage } = useStore()
  return (
    <>
      <div className='mb-2 flex justify-between items-center'>
        <div>
          <label htmlFor={name} className='block text-ct-blue-600 mb-3'>
            {label}
          </label>
          <input
            {...register(name)}
            type="file"
            className='block text-sm mb-2 text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100'
            onChange={onChange}
            accept='image/*'
            multiple={false}
          />
          <div>
            {uploadImage && <Spinner className='text-yellow-400' />}
          </div>
        </div>

      </div>
      {error && (
        <p className='text-red-500 text-xs italic mb-2'>
          {error.message}
        </p>
      )}
    </>
  )
}
