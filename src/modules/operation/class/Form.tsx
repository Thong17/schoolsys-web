import {
  DetailField,
  TextField,
  SelectField,
} from 'components/shared/form'
import { useForm } from 'react-hook-form'
import { classSchema } from './schema'
import { yupResolver } from '@hookform/resolvers/yup'
import useWeb from 'hooks/useWeb'
import Button from 'components/shared/Button'
import Axios from 'constants/functions/Axios'
import useNotify from 'hooks/useNotify'
import { useEffect, useState } from 'react'
import { inputDateFormat } from 'utils'
import { useAppDispatch } from 'app/hooks'
import { getListClass } from './redux'

const listSchedule = [
  { label: 'Morning', value: 'morning' },
  { label: 'Afternoon', value: 'afternoon' },
  { label: 'Evening', value: 'evening' },
]

export const ClassForm = ({ defaultValues, id }: any) => {
  const {
    watch,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(classSchema), defaultValues: {...defaultValues, birthDate: inputDateFormat(defaultValues?.birthDate)} })
  const dispatch = useAppDispatch()
  const { device } = useWeb()
  const { notify } = useNotify()
  const [loading, setLoading] = useState(false)
  const [schedule, setSchedule] = useState('')
  const scheduleId = watch('schedule')

  useEffect(() => {
    const schedule = listSchedule.find((schedule) => schedule.value === scheduleId)
    setSchedule(schedule?.value || '')
  }, [scheduleId])

  const submit = async (data) => {
    Axios({
      method: id ? 'PUT' : 'POST',
      url: id ? `/school/class/update/${id}` : `/school/class/create`,
      body: data,
    })
      .then((data) => {
        notify(data?.data?.msg, 'success')
        dispatch(getListClass({}))
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
              'name name grade' 
              'room schedule schedule'
              'subjects subjects subjects'
              'description description description'
              'action action action'
            `
            : ` 
              'name name grade' 
              'room schedule schedule'
              'subjects subjects subjects'
              'description description description'
              'action action action'
            `,
      }}
    >
      <div style={{ gridArea: 'name' }}>
        <TextField
          type='text'
          label='Class Name'
          err={errors.name?.message}
          {...register('name')}
        />
      </div>
      <div style={{ gridArea: 'grade' }}>
        <SelectField
          value={schedule}
          label='Grade'
          err={errors.grade?.message}
          options={listSchedule}
          {...register('grade')}
        />
      </div>
      <div style={{ gridArea: 'room' }}>
        <TextField
          type='text'
          label='Room'
          err={errors.room?.message}
          {...register('room')}
        />
      </div>
      <div style={{ gridArea: 'schedule' }}>
        <SelectField
          value={schedule}
          label='Schedule'
          err={errors.schedule?.message}
          options={listSchedule}
          {...register('schedule')}
        />
      </div>
      <div style={{ gridArea: 'description' }}>
        <DetailField
          type='text'
          label='Description'
          err={errors.description?.message}
          style={{ height: 70 }}
          {...register('description')}
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
