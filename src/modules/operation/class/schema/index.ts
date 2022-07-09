import * as yup from 'yup'

export const classSchema = yup.object().shape({
  name: yup.string().required(),
  schedule: yup.string().required(),
  students: yup.string().required(),
  grade: yup.string().required(),
  description: yup.string().optional(),
})