import {
  TextField,
} from 'components/shared/form'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import Button from 'components/shared/Button'
import Axios from 'constants/functions/Axios'
import useNotify from 'hooks/useNotify'
import { useEffect, useState } from 'react'
import useWeb from 'hooks/useWeb'
import { healthSchema } from '../schema'
import { getStudent } from '../redux'
import { useAppDispatch } from 'app/hooks'
import { useNavigate } from 'react-router-dom'

export const HealthForm = ({ studentId, defaultValues }) => {
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(healthSchema)
  })
  const navigate = useNavigate()
  const { device } = useWeb()
  const { notify } = useNotify()
  const [loading, setLoading] = useState(false)
  const dispatch = useAppDispatch()

  useEffect(() => {
    setValue('previousTreatment', defaultValues?.previousTreatment)
    setValue('presentTreatment', defaultValues?.presentTreatment)
    setValue('allergies', defaultValues?.allergies)
  }, [defaultValues, setValue])

  const submit = async (data) => {
    if (!defaultValues) return
    Axios({
      method: 'PUT',
      url: `/school/student/health/${defaultValues?._id}`,
      body: {...data, student: studentId},
    })
      .then((data) => {
        dispatch(getStudent({ id: studentId }))
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
            ? ` 'previousTreatment previousTreatment presentTreatment'
                'allergies allergies allergies'
                'action action action'
              `
            : ` 
                'previousTreatment previousTreatment presentTreatment'
                'allergies allergies allergies'
                'action action action'
              `,
      }}
    >
      <div style={{ gridArea: 'previousTreatment' }}>
        <TextField
          type='text'
          label='Previous Treatment'
          err={errors.previousTreatment?.message}
          {...register('previousTreatment')}
        />
      </div>
      <div style={{ gridArea: 'presentTreatment' }}>
        <TextField
          type='text'
          label='Present Treatment'
          err={errors.presentTreatment?.message}
          {...register('presentTreatment')}
        />
      </div>
      <div style={{ gridArea: 'allergies' }}>
        <TextField
          type='text'
          label='Allergies'
          err={errors.allergies?.message}
          {...register('allergies')}
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
        <Button variant='contained' color='error' onClick={() => navigate(-1)}>
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
