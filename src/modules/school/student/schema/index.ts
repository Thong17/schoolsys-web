import * as yup from 'yup'

export const studentSchema = yup.object().shape({
  lastName: yup.string().required(),
  firstName: yup.string().required(),
  gender: yup.string().required(),
  dateOfBirth: yup.string().required(),
  placeOfBirth: yup.string().optional(),
  nationality: yup.string().optional(),
  address: yup.string().optional(),
  contact: yup.string().optional(),
  profile: yup.mixed().optional(),
})

export const applicationSchema = yup.object().shape({
  previousGrade: yup.string().optional(),
  previousSchool: yup.string().optional(),
  appliedClass: yup.string().optional().nullable(true),
})

export const familySchema = yup.object().shape({
  guardian: yup.string().optional(),
  contact: yup.string().optional(),
  numberOfSibling: yup.string().optional(),
  siblingAttendSchool: yup.string().optional(),
  languages: yup.string().optional(),
})

export const healthSchema = yup.object().shape({
  previousTreatment: yup.string().optional(),
  presentTreatment: yup.string().optional(),
  allergies: yup.string().optional(),
})

