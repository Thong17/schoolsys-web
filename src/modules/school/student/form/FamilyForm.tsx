import { TextField } from 'components/shared/form'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import Button from 'components/shared/Button'
import Axios from 'constants/functions/Axios'
import useNotify from 'hooks/useNotify'
import { useEffect, useState } from 'react'
import useWeb from 'hooks/useWeb'
import { familySchema } from '../schema'
import { getListStudent, getStudent } from '../redux'
import { useAppDispatch } from 'app/hooks'

export const FamilyForm = ({ studentId, defaultValues }) => {
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(familySchema)
  })
  const { device } = useWeb()
  const { notify } = useNotify()
  const [loading, setLoading] = useState(false)
  const dispatch = useAppDispatch()

  useEffect(() => {
    setValue('guardian', defaultValues?.guardian)
    setValue('contact', defaultValues?.contact)
    setValue('numberOfSibling', defaultValues?.numberOfSibling)
    setValue('siblingAttendSchool', defaultValues?.siblingAttendSchool)
    setValue('languages', defaultValues?.languages)
  }, [defaultValues, setValue])
  
  const submit = async (data) => {
    if (!defaultValues) return
    Axios({
      method: 'PUT',
      url: `/school/student/family/${defaultValues?._id}`,
      body: {...data, student: studentId},
    })
      .then((data) => {
        dispatch(getStudent({ id: studentId }))
        dispatch(getListStudent({}))
        notify(data?.data?.msg, 'success')
      })
      .catch((err) => notify(err?.response?.data?.msg, 'error'))
      .finally(() => setLoading(false))
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
                'guardian guardian contact'
                'numberOfSibling siblingAttendSchool siblingAttendSchool'
                'languages languages languages'
                'action action action'
            `
            : ` 
                'guardian guardian contact'
                'numberOfSibling siblingAttendSchool siblingAttendSchool'
                'languages languages languages'
                'action action action'
            `,
      }}
    >
      <div style={{ gridArea: 'guardian' }}>
        <TextField
          type='text'
          label='Guardian'
          err={errors.guardian?.message}
          {...register('guardian')}
        />
      </div>
      <div style={{ gridArea: 'contact' }}>
        <TextField
          type='text'
          label='Contact'
          err={errors.contact?.message}
          {...register('contact')}
        />
      </div>
      <div style={{ gridArea: 'numberOfSibling' }}>
        <TextField
          type='number'
          label='Number Of Sibling'
          err={errors.numberOfSibling?.message}
          {...register('numberOfSibling')}
        />
      </div>
      <div style={{ gridArea: 'siblingAttendSchool' }}>
        <TextField
          type='number'
          label='Sibling Attend School'
          err={errors.siblingAttendSchool?.message}
          {...register('siblingAttendSchool')}
        />
      </div>
      <div style={{ gridArea: 'languages' }}>
        <TextField
          type='text'
          label='Languages'
          err={errors.languages?.message}
          {...register('languages')}
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
          Save
        </Button>
      </div>
    </form>
  )
}
