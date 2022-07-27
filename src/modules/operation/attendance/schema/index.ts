import * as yup from 'yup'

export const permissionSchema = yup.object().shape({
  permissionType: yup.string().required(),
  description: yup.string().optional(),
  checkedOut: yup.string().required(),
})
