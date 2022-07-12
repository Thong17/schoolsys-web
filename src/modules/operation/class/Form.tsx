import {
  DetailField,
  TextField,
  SelectField,
  LocaleField,
} from 'components/shared/form'
import { useForm } from 'react-hook-form'
import { classSchema } from './schema'
import { yupResolver } from '@hookform/resolvers/yup'
import useWeb from 'hooks/useWeb'
import Button from 'components/shared/Button'
import Axios from 'constants/functions/Axios'
import useNotify from 'hooks/useNotify'
import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import { IOptions } from 'components/shared/form/SelectField'
import { getListGrade, selectListGrade } from 'modules/school/grade/redux'
import useLanguage from 'hooks/useLanguage'
import { useNavigate } from 'react-router-dom'

const listSchedule = [
  { label: 'Morning', value: 'morning' },
  { label: 'Afternoon', value: 'afternoon' },
  { label: 'Evening', value: 'evening' },
]

export const ClassForm = ({ defaultValues, id }: any) => {
  const navigate = useNavigate()
  const {
    watch,
    register,
    setValue,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(classSchema), defaultValues })
  const dispatch = useAppDispatch()
  const { device } = useWeb()
  const { notify } = useNotify()
  const { lang } = useLanguage()
  const [loading, setLoading] = useState(false)
  const [schedule, setSchedule] = useState('')
  const scheduleId = watch('schedule')
  const { data: listGrade, status: statusListGrade } = useAppSelector(selectListGrade)
  const [gradeOption, setGradeOption] = useState<IOptions[]>([])
  const [grade, setGrade] = useState('')
  const gradeId = watch('grade')

  const handleLocaleChange = (data) => {
    setValue('name', data)
  }

  useEffect(() => {
    const grade: any = listGrade.find((value: any) => value._id === gradeId)
    setGrade(grade?._id || '')
  }, [gradeId, listGrade])

  useEffect(() => {
    if (statusListGrade !== 'INIT') return
    dispatch(getListGrade({}))
  }, [dispatch, statusListGrade])

  useEffect(() => {
    let gradeOptions: IOptions[] = []
    listGrade.forEach((key: any) => {
      gradeOptions = [...gradeOptions, { label: key.name?.[lang] || key.name?.['English'], value: key._id }]
    })

    setGradeOption(gradeOptions)
  }, [listGrade, lang])

  useEffect(() => {
    const schedule = listSchedule.find((schedule) => schedule.value === scheduleId)
    setSchedule(schedule?.value || '')
  }, [scheduleId])

  const submit = async (data) => {
    Axios({
      method: id ? 'PUT' : 'POST',
      url: id ? `/operation/class/update/${id}` : `/operation/class/create`,
      body: data,
    })
      .then((data) => {
        notify(data?.data?.msg, 'success')
        !id && navigate(`/operation/class/create/${data?.data?.data?._id}/student`)
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
              'name name name' 
              'grade schedule room'
              'subjects subjects subjects'
              'description description description'
              'action action action'
            `
            : ` 
              'name name name' 
              'grade schedule room'
              'subjects subjects subjects'
              'description description description'
              'action action action'
            `,
      }}
    >
      <div style={{ gridArea: 'name', marginTop: 20 }}>
        <LocaleField
          name='name'
          err={errors?.name}
          describe='Class Name'
          defaultValue={getValues('name')}
          onChange={handleLocaleChange}
        />
      </div>
      <div style={{ gridArea: 'grade' }}>
        <SelectField
          value={grade}
          label='Grade'
          err={errors.grade?.message}
          options={gradeOption}
          loading={statusListGrade === 'LOADING' ? true : false}
          {...register('grade')}
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
      <div style={{ gridArea: 'room' }}>
        <TextField
          type='text'
          label='Room'
          err={errors.room?.message}
          {...register('room')}
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
