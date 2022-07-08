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
import { academySchema } from '../schema'
import { getStudent } from '../redux'
import { useAppDispatch } from 'app/hooks'

export const AcademyForm = ({ studentId, defaultValues }) => {
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(academySchema)
  })
  const { device } = useWeb()
  const { notify } = useNotify()
  const [loading, setLoading] = useState(false)
  const dispatch = useAppDispatch()

  useEffect(() => {
    setValue('previousGrade', defaultValues?.previousGrade)
    setValue('previousSchool', defaultValues?.previousSchool)
    setValue('appliedGrade', defaultValues?.appliedGrade)
  }, [defaultValues, setValue])

  const submit = async (data) => {
    if (!defaultValues) return
    Axios({
      method: 'PUT',
      url: `/school/student/academy/${defaultValues?._id}`,
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
            ? ` 'previousSchool previousSchool previousSchool'
                'previousGrade previousGrade appliedGrade'
                'action action action'
              `
            : ` 
                'previousSchool previousSchool previousSchool'
                'previousGrade previousGrade appliedGrade'
                'action action action'
              `,
      }}
    >
      <div style={{ gridArea: 'previousSchool' }}>
        <TextField
          type='text'
          label='Previous School'
          err={errors.previousSchool?.message}
          {...register('previousSchool')}
        />
      </div>
      <div style={{ gridArea: 'previousGrade' }}>
        <TextField
          type='text'
          label='Previous Grade'
          err={errors.previousGrade?.message}
          {...register('previousGrade')}
        />
      </div>
      <div style={{ gridArea: 'appliedGrade' }}>
        <TextField
          type='text'
          label='Applied Grade'
          err={errors.appliedGrade?.message}
          {...register('appliedGrade')}
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
