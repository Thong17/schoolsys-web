import * as yup from 'yup'

export const gradeSchema = yup.object().shape({
  name: yup.string().required(),
  level: yup.string().optional(),
  description: yup.string().optional(),
})