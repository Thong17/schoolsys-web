import { CustomButton } from 'styles'
import { Button } from '@mui/material'
import { AlertDialog } from 'components/shared/table/AlertDialog'
import { subjectSchema } from './schema'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import {
  DetailField,
  LocaleField,
  SelectField,
  TextField,
} from 'components/shared/form'
import Axios from 'constants/functions/Axios'
import useNotify from 'hooks/useNotify'
import { useEffect, useState } from 'react'
import useWeb from 'hooks/useWeb'
import { TextTitle } from 'components/shared/TextTitle'
import { getGrade } from './redux'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import { IOptions } from 'components/shared/form/SelectField'
import { getListTeacher, selectListTeacher } from '../teacher/redux'

export const SubjectForm = ({
  dialog,
  setDialog,
  defaultValues,
  theme,
}: any) => {
  const {
    watch,
    reset,
    register,
    handleSubmit,
    setValue,
    setError,
    getValues,
    formState: { errors },
  } = useForm({ resolver: yupResolver(subjectSchema), defaultValues })
  const { notify } = useNotify()
  const { width } = useWeb()
  const dispatch = useAppDispatch()

  const { data: listTeacher, status: statusListTeacher } = useAppSelector(selectListTeacher)
  const [teacherOption, setTeacherOption] = useState<IOptions[]>([])
  const [teacher, setTeacher] = useState('')
  const teacherId = watch('teacher')
  useEffect(() => {
    dispatch(getListTeacher({}))
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

  useEffect(() => {
    reset(defaultValues)
  }, [defaultValues, reset])

  const handleLocaleChange = (data) => {
    setValue('name', data)
  }

  const handleCloseDialog = () => {
    setDialog({ ...dialog, subjectId: null, open: false })
  }

  const submit = (data) => {
    delete data.imagePath
    Axios({
      method: dialog.subjectId ? 'PUT' : 'POST',
      url: dialog.subjectId ? `/school/subject/update/${dialog.subjectId}` : `/school/subject/create`,
      body: {
        ...data,
        grade: dialog.gradeId,
      },
    })
      .then((data) => {
        dispatch(getGrade({ id: dialog?.gradeId as string, query: {} }))
        notify(data?.data?.msg, 'success')
        handleCloseDialog()
      })
      .catch((err) => {
        if (!err?.response?.data?.msg) {
          setError(err?.response?.data[0]?.key, {
            message: err?.response?.data[0]?.path,
          })
        }

        notify(err?.response?.data?.msg, 'error')
      })
  }
  
  return (
    <AlertDialog
      isOpen={dialog.open}
      handleClose={handleCloseDialog}
    >
      <TextTitle title='Subject Form' />
      <form
        style={{
          fontFamily: theme.font.family,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          width: width < 1024 ? '80vw' : '60vw',
          padding: 20,
          gridColumnGap: 20,
          gridTemplateAreas: `
                            'subject subject subject'
                            'teacher passScore fullScore'
                            'description description description'
                            'action action action'
                        `,
        }}
      >
        <div style={{ gridArea: 'subject' }}>
          <LocaleField
            name='name'
            err={errors?.name}
            describe='Subject Name'
            defaultValue={getValues('name')}
            onChange={handleLocaleChange}
          />
        </div>
        <div style={{ gridArea: 'teacher' }}>
          <SelectField
            value={teacher}
            label='Teacher'
            err={errors.teacher?.message}
            options={teacherOption}
            loading={statusListTeacher === 'LOADING' ? true : false}
            {...register('teacher')}
          />
        </div>
        <div style={{ gridArea: 'passScore' }}>
          <TextField
            type='number'
            label='Pass Score'
            err={errors?.passScore?.message}
            {...register('passScore')}
          />
        </div>
        <div style={{ gridArea: 'fullScore' }}>
          <TextField
            type='number'
            label='Full Score'
            err={errors?.fullScore?.message}
            {...register('fullScore')}
          />
        </div>
        <div style={{ gridArea: 'description' }}>
          <DetailField
            type='text'
            label='Description'
            style={{ height: 70 }}
            {...register('description')}
          />
        </div>
        <div style={{ gridArea: 'action', display: 'flex', justifyContent: 'end' }}>
          <Button
            onClick={handleCloseDialog}
          >
            Cancel
          </Button>
          <CustomButton
            type='submit'
            style={{
              marginLeft: 10,
              backgroundColor: theme.background.secondary,
              color: theme.text.secondary,
            }}
            styled={theme}
            onClick={handleSubmit(submit)}
            autoFocus
          >
            { dialog.subjectId ? 'Update' : 'Create' }
          </CustomButton>
        </div>
      </form>
    </AlertDialog>
  )
}
