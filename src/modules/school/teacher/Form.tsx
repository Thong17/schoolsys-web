import {
  DetailField,
  TextField,
  SelectField,
  FileField,
} from 'components/shared/form'
import { useForm } from 'react-hook-form'
import { teacherSchema } from './schema'
import { yupResolver } from '@hookform/resolvers/yup'
import useWeb from 'hooks/useWeb'
import Button from 'components/shared/Button'
import Axios from 'constants/functions/Axios'
import useNotify from 'hooks/useNotify'
import { useEffect, useState } from 'react'
import { IImage } from 'components/shared/form/UploadField'
import { inputDateFormat } from 'utils'

const listGender = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
]

export const TeacherForm = ({ defaultValues, id }: any) => {
  const {
    watch,
    register,
    getValues,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(teacherSchema), defaultValues: {...defaultValues, birthDate: inputDateFormat(defaultValues?.birthDate)} })
  const { device } = useWeb()
  const { notify } = useNotify()
  const [loading, setLoading] = useState(false)
  const [gender, setGender] = useState('')
  const [profile, setProfile] = useState<IImage | undefined>(defaultValues?.profile)
  const genderId = watch('gender')

  useEffect(() => {
    const gender = listGender.find((gender) => gender.value === genderId)
    setGender(gender?.value || '')
  }, [genderId])

  const submit = async (data) => {
    Axios({
      method: id ? 'PUT' : 'POST',
      url: id ? `/school/teacher/update/${id}` : `/school/teacher/create`,
      body: data,
    })
      .then((data) => {
        notify(data?.data?.msg, 'success')
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
        notify(data?.data?.msg, 'success')
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
                'firstName firstName lastName' 
                'gender birthDate birthDate'
                'gender birthDate birthDate'
                'email email contact'
                'grade subject subject'
                'profile profile profile'
                'address address address'
                'action action action'
              `
            : ` 
                'firstName firstName lastName' 
                'gender birthDate birthDate'
                'gender birthDate birthDate'
                'email email contact'
                'grade subject subject'
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
      <div style={{ gridArea: 'gender' }}>
        <SelectField
          value={gender}
          label='Gender'
          err={errors.gender?.message}
          options={listGender}
          {...register('gender')}
        />
      </div>
      <div style={{ gridArea: 'birthDate' }}>
        <TextField
          type='date'
          label='Birth Date'
          err={errors.birthDate?.message}
          {...register('birthDate')}
        />
      </div>
      <div style={{ gridArea: 'email' }}>
        <TextField
          type='email'
          label='Email'
          err={errors.email?.message}
          {...register('email')}
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
      <div style={{ gridArea: 'grade' }}>
        <TextField
          type='text'
          label='Grade'
          err={errors.grade?.message}
          {...register('grade')}
        />
      </div>
      <div style={{ gridArea: 'subject' }}>
        <TextField
          type='text'
          label='Subject'
          err={errors.subject?.message}
          {...register('subject')}
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
