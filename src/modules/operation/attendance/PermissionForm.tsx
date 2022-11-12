import { CustomButton } from 'styles'
import { Button } from '@mui/material'
import { AlertDialog } from 'components/shared/table/AlertDialog'
import { permissionSchema } from './schema'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import {
  DetailField,
  SelectField,
  TextField,
} from 'components/shared/form'
import { useEffect, useState } from 'react'
import useWeb from 'hooks/useWeb'
import { TextTitle } from 'components/shared/TextTitle'
import { useAppDispatch } from 'app/hooks'
import { permissionAttendance } from './redux'

const listPermission = [
  { label: 'Permission', value: 'Permission' },
  { label: 'Absent', value: 'Absent' },
]

export const PermissionForm = ({
  dialog,
  setDialog,
  defaultValues,
  theme,
}: any) => {
  const {
    reset,
    watch,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(permissionSchema), defaultValues })
  const { width } = useWeb()
  const dispatch = useAppDispatch()
  const [permissionType, setPermissionType] = useState('')
  const permission = watch('permissionType')

  useEffect(() => {
    const permissionType = listPermission.find((key) => key.value === permission)
    setPermissionType(permissionType?.value || '')
  }, [permission])

  const handleCloseDialog = () => {
    setDialog({ ...dialog, attendanceId: null, studentId: null, open: false })
  }

  useEffect(() => {
    reset(defaultValues)
  }, [defaultValues, reset])

  const submit = (data) => {
    const body = {
      ...data,
      class: dialog?.classId,
      user: dialog?.studentId,
      attendance: dialog?.attendanceId || null
    }
    dispatch(permissionAttendance(body))
    handleCloseDialog()
  }
  
  return (
    <AlertDialog
      isOpen={dialog.open}
      handleClose={handleCloseDialog}
    >
      <TextTitle title='Attendance Form' />
      <form
        style={{
          fontFamily: theme.font.family,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          width: width < 1024 ? '80vw' : '60vw',
          padding: 20,
          gridColumnGap: 20,
          gridTemplateAreas: `
                            'permissionType permissionType checkedOut'
                            'description description description'
                            'action action action'
                        `,
        }}
      >
        <div style={{ gridArea: 'permissionType' }}>
          <SelectField
            value={permissionType}
            label='Type Of Attendance'
            err={errors.permissionType?.message}
            options={listPermission}
            {...register('permissionType')}
          />
        </div>
        <div style={{ gridArea: 'checkedOut' }}>
          <TextField
            type='datetime-local'
            label='Date'
            err={errors.checkedOut?.message}
            {...register('checkedOut')}
          />
        </div>
        <div style={{ gridArea: 'description' }}>
          <DetailField
            type='text'
            label='Reason'
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
            Submit
          </CustomButton>
        </div>
      </form>
    </AlertDialog>
  )
}
