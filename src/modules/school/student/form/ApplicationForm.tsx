import {
  TextField,
  SelectField
} from 'components/shared/form'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import Button from 'components/shared/Button'
import Axios from 'constants/functions/Axios'
import useNotify from 'hooks/useNotify'
import { useEffect, useState } from 'react'
import useWeb from 'hooks/useWeb'
import { applicationSchema } from '../schema'
import { getStudent } from '../redux'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import { IOptions } from 'components/shared/form/SelectField'
import useLanguage from 'hooks/useLanguage'
import { selectListClass, getListClass } from 'modules/operation/class/redux'

export const ApplicationForm = ({ studentId, defaultValues }) => {
  const { data: listClass, status: statusListClass } = useAppSelector(selectListClass)
  const {
    watch,
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(applicationSchema)
  })
  const { device } = useWeb()
  const { lang } = useLanguage()
  const { notify } = useNotify()
  const [loading, setLoading] = useState(false)
  const dispatch = useAppDispatch()
  const [classOption, setClassOption] = useState<IOptions[]>([])
  const [_class, setClass] = useState('')
  const gradeId = watch('appliedClass')

  useEffect(() => {
    const _class: any = listClass.find((value: any) => value._id === gradeId)
    setClass(_class?._id || '')
  }, [gradeId, listClass])

  useEffect(() => {
    if (statusListClass !== 'INIT') return
    dispatch(getListClass({}))
  }, [dispatch, statusListClass])

  useEffect(() => {
    let classOptions: IOptions[] = []
    listClass.forEach((key: any) => {
      classOptions = [...classOptions, { label: key.name?.[lang] || key.name?.['English'], value: key._id }]
    })

    setClassOption(classOptions)
  }, [listClass, lang])

  useEffect(() => {
    setValue('previousGrade', defaultValues?.previousGrade)
    setValue('previousSchool', defaultValues?.previousSchool)
    setValue('appliedClass', defaultValues?.appliedClass)
  }, [defaultValues, setValue])

  const submit = async (data) => {
    if (!defaultValues) return
    Axios({
      method: 'PUT',
      url: `/school/student/application/${defaultValues?._id}`,
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
                'previousGrade previousGrade appliedClass'
                'action action action'
              `
            : ` 
                'previousSchool previousSchool previousSchool'
                'previousGrade previousGrade appliedClass'
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
      <div style={{ gridArea: 'appliedClass' }}>
        <SelectField
          value={_class}
          label='Applied Class'
          options={classOption}
          err={errors?.appliedClass?.message}
          loading={statusListClass === 'LOADING' ? true : false}
          {...register('appliedClass')}
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
