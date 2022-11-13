import { Button } from '@mui/material'
import { MiniSelectField } from 'components/shared/form'
import { IOptions } from 'components/shared/form/SelectField'
import { AlertDialog } from 'components/shared/table/AlertDialog'
import { CircleIcon } from 'components/shared/table/CustomIcon'
import { ITableColumn, StickyTable } from 'components/shared/table/StickyTable'
import { TextHighlight } from 'components/shared/TextHighlight'
import { TextTitle } from 'components/shared/TextTitle'
import Axios from 'constants/functions/Axios'
import useNotify from 'hooks/useNotify'
import useTheme from 'hooks/useTheme'
import { useEffect, useState } from 'react'
import { CustomButton } from 'styles/index'
import { capitalizeText, convertBufferToArrayBuffer, dateFormat, downloadBuffer, durationMap, timeFormat } from 'utils/index'

const durationOption: IOptions[] = [
  { label: 'Daily', value: 'daily' },
  { label: 'Weekly', value: 'weekly' },
  { label: 'Monthly', value: 'monthly' },
  { label: 'Quarterly', value: 'quarterly' },
  { label: 'Yearly', value: 'yearly' }
]

const attendanceColumn: ITableColumn<any>[] = [
  { id: 'ref', label: 'ID' },
  { id: 'profile', label: 'Profile' },
  { id: 'username', label: 'Username' },
  { id: 'gender', label: 'Gender' },
  { id: 'position', label: 'Position' },
  { id: 'attendance', label: 'Attendance' },
  { id: 'date', label: 'Date' },
  { id: 'checkedIn', label: 'Checked In' },
  { id: 'checkedOut', label: 'Checked Out' },
]

const mappedAttendanceData = (data, theme) => {
  let attendanceColor
  switch (data.permissionType) {
    case 'Annual Leave':
      attendanceColor = theme.color.info
      break
    case 'Sick Leave':
      attendanceColor = theme.color.warning
      break
    case 'Urgent Leave':
      attendanceColor = theme.color.warning
      break
    case 'Absent':
      attendanceColor = theme.color.error
      break
    default:
      attendanceColor = theme.color.success
      break
  }

  return {
    ref: data.user.username,
    profile: <CircleIcon master={data.user.segment === 'Teacher'} icon={data.profile} />,
    username: data.username,
    gender: capitalizeText(data.gender),
    position: data.user.segment,
    attendance: <TextHighlight text={data.permissionType} color={attendanceColor} /> || '...',
    date: dateFormat(data?.checkedIn) || '...',
    checkedIn: timeFormat(data?.checkedIn) || '...',
    checkedOut: timeFormat(data?.checkedOut) || '...',
  }
}

export const AttendanceReport = ({
  dialog,
  setDialog,
}: any) => {
  const { notify } = useNotify()
  const { theme } = useTheme()
  const [rowData, setRowData] = useState<any>([])
  const [durationType, setDurationType] = useState<any>('daily')

  useEffect(() => {
    const classId = dialog.classId
    if (!classId) return
    const params = new URLSearchParams()
    const { fromDate, toDate } = durationMap(durationType)

    if (fromDate && toDate) {
      params.append('fromDate', fromDate.toString())
      params.append('toDate', toDate.toString())
    }

    Axios({ method: 'GET', url: `/operation/attendance/report/${classId}`, params })
      .then((data) => {
        setRowData(data.data.data.map((data) => mappedAttendanceData(data, theme)))
      })
      .catch((err) => notify(err?.response?.data?.msg))
    // eslint-disable-next-line
  }, [dialog.classId, durationType])
  

  const handleCloseDialog = () => {
    setDialog({ classId: null, open: false })
  }

  const handleExportReport = () => {
    let body = durationMap(durationType)
  
    const config = {
      responseType: "arraybuffer",
      body,
      headers: {
        Accept: "application/octet-stream",
      },
    }
    Axios({ url: `/export/attendance/class/${dialog.classId}`, method: 'POST', ...config })
      .then(data => {                        
        downloadBuffer(convertBufferToArrayBuffer(data?.data?.file?.data), 'class_attendance.xlsx')
      })
      .catch(err => notify(err?.response?.data?.message, 'error'))
  }
  
  return (
    <AlertDialog
      isOpen={dialog.open}
      handleClose={handleCloseDialog}
    >
      <TextTitle title='Attendance Report' />
      <br />
      <div style={{ width: '90vw', height: '71vh' }}>
        <div style={{ width: '100%', height: 40, display: 'flex', justifyContent: 'flex-end', padding: '0 10px', boxSizing: 'border-box' }}>
          <MiniSelectField options={durationOption} value={durationType} onChange={(event) => setDurationType(event.target.value)} />
        </div>
        <StickyTable columns={attendanceColumn} rows={rowData} pagination={false} />
      </div>
      <div style={{ gridArea: 'action', display: 'flex', justifyContent: 'end', padding: '0 20px 20px 0' }}>
        <Button
          onClick={handleCloseDialog}
        >
          Cancel
        </Button>
        <CustomButton
          onClick={handleExportReport}
          style={{
            marginLeft: 10,
            backgroundColor: theme.background.secondary,
            color: theme.text.secondary,
          }}
          styled={theme}
          autoFocus
        >
          Export
        </CustomButton>
      </div>
    </AlertDialog>
  )
}
