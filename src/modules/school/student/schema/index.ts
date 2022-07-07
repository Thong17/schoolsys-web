import * as yup from 'yup'

export const studentSchema = yup.object().shape({
  lastName: yup.string().required(),
  firstName: yup.string().required(),
  gender: yup.string().required(),
  dateOfBirth: yup.string().required(),
  placeOfBirth: yup.string().required(),
  nationality: yup.string().required(),
  address: yup.string().optional(),
  contact: yup.string().optional(),
  profile: yup.mixed().optional(),
})
