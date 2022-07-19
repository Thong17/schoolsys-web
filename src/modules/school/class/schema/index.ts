import * as yup from 'yup'

export const classSchema = yup.object().shape({
  name: yup.object({
    English: yup.string().required('English is required'),
  }),
  schedule: yup.string().required(),
  room: yup.string().optional(),
  teacher: yup.string().nullable(true),
  monitor: yup.string().nullable(true),
  grade: yup.string().required(),
  description: yup.string().optional(),
})