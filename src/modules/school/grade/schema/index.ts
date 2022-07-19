import * as yup from 'yup'

export const gradeSchema = yup.object().shape({
  name: yup.object({
    English: yup.string().required('English is required'),
  }),
  level: yup.string().optional(),
  description: yup.string().optional(),
})

export const subjectSchema = yup.object().shape({
  name: yup.object({
    English: yup.string().required('English is required'),
  }),
  teacher: yup.string().optional().nullable(true),
  passScore: yup.number().required(),
  fullScore: yup.number().required(),
  description: yup.string().optional(),
})