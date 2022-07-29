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
import { getListGrade, selectListGrade } from 'shared/redux'
import useLanguage from 'hooks/useLanguage'
import { getListTeacher, selectListTeacher } from 'shared/redux'

const listSchedule = [
  { label: 'Morning', value: 'morning' },
  { label: 'Afternoon', value: 'afternoon' },
  { label: 'Evening', value: 'evening' },
]

export const ClassForm = ({ defaultValues, id }: any) => {
  const {
    reset,
    watch,
    register,
    setValue,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(classSchema), defaultValues: { ...defaultValues, grade: defaultValues?.grade?._id, teacher: defaultValues?.teacher?._id }})
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

  const { data: listTeacher, status: statusListTeacher } = useAppSelector(selectListTeacher)
  const [teacherOption, setTeacherOption] = useState<IOptions[]>([])
  const [monitorOption, setMonitorOption] = useState<IOptions[]>([])
  const [monitor, setMonitor] = useState('')
  const monitorId = watch('monitor')

  useEffect(() => {
    const monitors: any = defaultValues?.students?.find((value: any) => value._id === monitorId)
    setMonitor(monitors?._id || '')
  }, [monitorId, defaultValues])
  useEffect(() => {
    let monitorOptions: IOptions[] = []
    defaultValues?.students?.forEach((key: any) => {
      monitorOptions = [...monitorOptions, { label: `${key.lastName} ${key.firstName}`, value: key._id }]
    })

    setMonitorOption(monitorOptions)
  }, [defaultValues])
  

  const [teacher, setTeacher] = useState('')
  const teacherId = watch('teacher')
  useEffect(() => {
    dispatch(getListTeacher())
  }, [dispatch])

  useEffect(() => {
    const teacher: any = listTeacher.find((value: any) => value._id === teacherId)
    setTeacher(teacher?._id || '')
  }, [teacherId, listTeacher])
  useEffect(() => {
    let teacherOptions: IOptions[] = []
    listTeacher.forEach((key: any) => {
      teacherOptions = [...teacherOptions, { label: `${key.lastName} ${key.firstName}`, value: key._id }]
    })

    setTeacherOption(teacherOptions)
  }, [listTeacher])

  const handleLocaleChange = (data) => {
    setValue('name', data)
  }

  useEffect(() => {
    dispatch(getListGrade())
  }, [dispatch])

  useEffect(() => {
    const grade: any = listGrade.find((value: any) => value._id === gradeId)
    setGrade(grade?._id || '')
  }, [gradeId, listGrade])

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
    delete data.students
    Axios({
      method: id ? 'PUT' : 'POST',
      url: id ? `/school/class/update/${id}` : `/school/class/create`,
      body: data,
    })
      .then((data) => {
        notify(data?.data?.msg, 'success')
        if (!id) {
          reset()
        }
      })
      .catch((err) => {
        if (err?.response?.status === 422) return notify(err?.response?.data?.[0]?.path, 'error')
        notify(err?.response?.data?.msg, 'error')
      })
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
              'schedule schedule room'
              'grade teacher monitor'
              'description description description'
              'action action action'
            `
            : ` 
              'name name name' 
              'schedule schedule room'
              'grade teacher monitor'
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
      <div style={{ gridArea: 'grade' }}>
        <SelectField
          search={true}
          value={grade}
          label='Grade'
          err={errors.grade?.message}
          options={gradeOption}
          loading={statusListGrade === 'LOADING' ? true : false}
          {...register('grade')}
        />
      </div>
      <div style={{ gridArea: 'teacher' }}>
        <SelectField
          search={true}
          value={teacher}
          label='Class Teacher'
          err={errors.teacher?.message}
          options={teacherOption}
          loading={statusListTeacher === 'LOADING' ? true : false}
          {...register('teacher')}
        />
      </div>
      <div style={{ gridArea: 'monitor' }}>
        <SelectField
          search={true}
          value={monitor}
          label='Class Monitor'
          err={errors.monitor?.message}
          options={monitorOption}
          {...register('monitor')}
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
