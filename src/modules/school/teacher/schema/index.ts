import * as yup from 'yup'

export const teacherSchema = yup.object().shape({
  lastName: yup.string().required(),
  firstName: yup.string().required(),
  gender: yup.string().required(),
  birthDate: yup.string().required(),
  address: yup.string().optional(),
  contact: yup.string().optional(),
  grade: yup.string().optional(),
  subject: yup.string().optional(),
  email: yup.string().optional(),
  profile: yup.mixed().optional(),
})