import * as yup from 'yup'

export const classSchema = yup.object().shape({
  name: yup.object({
    English: yup.string().required('English is required'),
  }),
  schedule: yup.string().required(),
  room: yup.string().optional(),
  grade: yup.string().required(),
  description: yup.string().optional(),
})