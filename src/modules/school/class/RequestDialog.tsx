import Button from '@mui/material/Button'
import DialogActions from '@mui/material/DialogActions'
import { useAppDispatch } from 'app/hooks'
import { FlexBetween } from 'components/shared/container/FlexBetween'
import { AlertDialog } from 'components/shared/table/AlertDialog'
import { DeleteDialog } from 'components/shared/table/DeleteDialog'
import { StickyTable } from 'components/shared/table/StickyTable'
import { TextLabel } from 'components/shared/TextLabel'
import Axios from 'constants/functions/Axios'
import useAuth from 'hooks/useAuth'
import useNotify from 'hooks/useNotify'
import useTheme from 'hooks/useTheme'
import useWeb from 'hooks/useWeb'
import { deleteAppliedStudent } from 'modules/school/student/redux'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { capitalizeText } from 'utils'
import { createRequestData, requestColumnData } from './constant'
import { getClass, getListStudentOfClass } from './redux'

export const RequestDialog = ({
  classId,
  dialog,
  setDialog,
  _class,
  grade,
  rowData,
  
}: any) => {
  const { user } = useAuth()
  const { device } = useWeb()
  const { theme } = useTheme()
  const navigate = useNavigate()
  const { notify } = useNotify()
  const [requestData, setRequestData] = useState([])
  const [rejectDialog, setRejectDialog] = useState({ open: false, id: null })
  const dispatch = useAppDispatch()
  
  const handleConfirmReject = (id) => {
    Axios({
      method: 'DELETE',
      url: `/school/class/reject/applied/${id}`,
    })
      .then((data) => {
        dispatch(deleteAppliedStudent(id))
        notify(data?.data?.msg, 'info')
      })
      .catch((err) => notify(err?.response?.data?.msg, 'error'))

    setRejectDialog({ open: false, id: null })
  }

  useEffect(() => {
    const handleAccept = (id) => {
      Axios({
        method: 'PUT',
        url: `/school/class/accept/applied/${id}`,
      })
        .then((data) => {
          dispatch(getListStudentOfClass({ id: classId }))
          dispatch(getClass({ id: classId, query: {}, fields: ['_id', 'name', 'room', 'schedule', 'grade', 'description', 'students', 'monitor'] }))
          dispatch(deleteAppliedStudent(id))
          notify(data?.data?.msg, 'info')
        })
        .catch((err) => notify(err?.response?.data?.msg, 'error'))
    }

    const requestData = rowData?.map((request) => {
      return createRequestData(
        request._id, 
        request.student?.profile?.filename,
        request.student?.lastName,
        request.student?.firstName,
        capitalizeText(request.student?.gender),
        request.previousSchool,
        request.previousGrade,
        request.student?.contact,
        user?.privilege,
        device,
        handleAccept,
        setRejectDialog
      )
    })
    setRequestData(requestData)
  }, [rowData, device, navigate, setRejectDialog, notify, user, classId, dispatch])

  const handleCloseDialog = () => {
    setDialog({ ...dialog, open: false })
  }
  
  return (
    <AlertDialog
      isOpen={dialog.open}
      handleClose={handleCloseDialog}
    ><DeleteDialog
        id={rejectDialog.id}
        isOpen={rejectDialog.open}
        handleConfirm={handleConfirmReject}
        handleClose={() => setRejectDialog({ open: false, id: null })}
      ></DeleteDialog>
      <div style={{ padding: '20px 30px', fontFamily: theme.font.family }}>
        <FlexBetween>
          <h3 style={{ color: theme.text.secondary }}>Application List</h3>
          <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between' }}>
            <TextLabel label='Class'><span style={{ color: theme.text.tertiary }}>{_class}</span></TextLabel>
            <TextLabel label='Grade'><span style={{ color: theme.text.tertiary }}>{grade}</span></TextLabel>
          </div>
        </FlexBetween>
      </div>
      <div style={{ width: '95vw', height: '75vh', marginBottom: 10, position: 'relative', overflowY: 'auto' }}>
        <StickyTable columns={requestColumnData} rows={requestData} />
      </div>
      <DialogActions style={{ position: 'absolute', bottom: 5, left: 10 }}>
        <Button onClick={handleCloseDialog} variant='contained'>Close</Button>
      </DialogActions>
    </AlertDialog>
  )
}
