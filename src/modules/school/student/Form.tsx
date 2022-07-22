import {
  DetailField,
  TextField,
  SelectField,
  FileField,
} from 'components/shared/form'
import { useForm } from 'react-hook-form'
import { studentSchema } from './schema'
import { yupResolver } from '@hookform/resolvers/yup'
import useWeb from 'hooks/useWeb'
import Button from 'components/shared/Button'
import Axios from 'constants/functions/Axios'
import useNotify from 'hooks/useNotify'
import { useEffect, useState } from 'react'
import { inputDateFormat } from 'utils'
import { IImage } from 'components/shared/form/UploadField'
import { useNavigate } from 'react-router-dom'

const listGender = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
]

export const StudentForm = ({ defaultValues, id }: any) => {
  const {
    watch,
    register,
    setValue,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(studentSchema),
    defaultValues: {
      ...defaultValues,
      dateOfBirth: inputDateFormat(defaultValues?.dateOfBirth),
    },
  })
  const navigate = useNavigate()
  const { device } = useWeb()
  const { notify } = useNotify()
  const [loading, setLoading] = useState(false)
  const [gender, setGender] = useState('')
  const [profile, setProfile] = useState<IImage | undefined>(
    defaultValues?.profile
  )
  const genderId = watch('gender')

  useEffect(() => {
    const gender = listGender.find((gender) => gender.value === genderId)
    setGender(gender?.value || '')
  }, [genderId])

  const submit = async (data) => {
    Axios({
      method: id ? 'PUT' : 'POST',
      url: id ? `/school/student/update/${id}` : `/school/student/create`,
      body: data,
    })
      .then((data) => {
        notify(data?.data?.msg, 'success')
        !id && navigate(`/school/student/create/${data?.data?.data?._id}/family`)
      })
      .catch((err) => notify(err?.response?.data?.msg, 'error'))
      .finally(() => setLoading(false))
  }

  const handleProfileChange = (event) => {
    const image = event.target.files[0]
    const formData = new FormData()
    formData.append('images', image)

    Axios({
      method: 'POST',
      url: '/shared/upload/image',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then((data) => {
        setProfile(data?.data?.data[0])
        setValue('profile', data?.data?.data[0]?._id)
      })
      .catch((err) => notify(err?.response?.data?.msg, 'error'))
      .finally(() => setLoading(false))
  }

  const handleDeleteProfile = () => {
    setProfile(undefined)
    setValue('profile', null)
  }

  return (
    <form
      onSubmit={handleSubmit(submit)}
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gridColumnGap: 20,
        gridTemplateAreas:
          device === 'mobile'
            ? ` 
                'firstName lastName nationality' 
                'gender dateOfBirth dateOfBirth'
                'placeOfBirth placeOfBirth contact'
                'profile profile profile'
                'address address address'
                'action action action'
              `
            : ` 
                'firstName lastName nationality' 
                'gender dateOfBirth dateOfBirth'
                'placeOfBirth placeOfBirth contact'
                'profile profile profile'
                'address address address'
                'action action action'
              `,
      }}
    >
      <div style={{ gridArea: 'firstName' }}>
        <TextField
          type='text'
          label='FirstName'
          err={errors.firstName?.message}
          {...register('firstName')}
        />
      </div>
      <div style={{ gridArea: 'lastName' }}>
        <TextField
          type='text'
          label='LastName'
          err={errors.lastName?.message}
          {...register('lastName')}
        />
      </div>
      <div style={{ gridArea: 'nationality' }}>
        <TextField
          type='text'
          label='Nationality'
          err={errors.nationality?.message}
          {...register('nationality')}
        />
      </div>
      <div style={{ gridArea: 'gender' }}>
        <SelectField
          value={gender}
          label='Gender'
          err={errors.gender?.message}
          options={listGender}
          {...register('gender')}
        />
      </div>
      <div style={{ gridArea: 'dateOfBirth' }}>
        <TextField
          type='date'
          label='Date Of Birth'
          err={errors.dateOfBirth?.message}
          {...register('dateOfBirth')}
        />
      </div>
      <div style={{ gridArea: 'placeOfBirth' }}>
        <TextField
          type='text'
          label='Place Of Birth'
          err={errors.placeOfBirth?.message}
          {...register('placeOfBirth')}
        />
      </div>
      <div style={{ gridArea: 'contact' }}>
        <TextField
          type='tel'
          label='Contact'
          err={errors.contact?.message}
          {...register('contact')}
        />
      </div>
      <div style={{ gridArea: 'profile' }}>
        <FileField
          name='profile'
          height={130}
          images={profile && [profile]}
          selected={getValues('profile')?._id}
          label='Profile'
          accept='image/png, image/jpeg'
          onChange={handleProfileChange}
          handleDelete={handleDeleteProfile}
          err={errors.profile?.message}
        />
      </div>
      <div style={{ gridArea: 'address' }}>
        <DetailField
          type='text'
          label='Address'
          err={errors.address?.message}
          style={{ height: 70 }}
          {...register('address')}
        />
      </div>
      <div
        style={{
          gridArea: 'action',
          marginTop: 10,
          display: 'flex',
          justifyContent: 'end',
        }}
      >
        <Button variant='contained' color='error'>
          Cancel
        </Button>
        <Button
          loading={loading}
          type='submit'
          variant='contained'
          color='success'
          style={{ marginLeft: 20 }}
        >
          {id ? 'Save' : 'Create'}
        </Button>
      </div>
    </form>
  )
}
