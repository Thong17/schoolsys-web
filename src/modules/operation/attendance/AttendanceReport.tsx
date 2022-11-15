import { Button, styled } from '@mui/material'
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
import useWeb from 'hooks/useWeb'
import { useEffect, useState } from 'react'
import { CustomButton } from 'styles/index'
import {
  capitalizeText,
  convertBufferToArrayBuffer,
  downloadBuffer,
  durationMap,
} from 'utils/index'

const durationOption: IOptions[] = [
  { label: 'Daily', value: 'daily' },
  { label: 'Weekly', value: 'weekly' },
  { label: 'Monthly', value: 'monthly' },
  { label: 'Quarterly', value: 'quarterly' },
  { label: 'Yearly', value: 'yearly' },
  { label: 'Range', value: 'range' },
]

const attendanceColumn: ITableColumn<any>[] = [
  { id: 'no', label: 'NO' },
  { id: 'ref', label: 'ID' },
  { id: 'profile', label: 'Profile' },
  { id: 'username', label: 'Username' },
  { id: 'gender', label: 'Gender' },
  { id: 'attendance', label: 'Attendance' },
  { id: 'absent', label: 'Absent' },
  { id: 'permission', label: 'Permission' },
]

const mappedAttendanceData = (data, theme) => {
  return {
    ref: data.ref,
    profile: <CircleIcon icon={data.profile?.filename} />,
    username: `${data.lastName} ${data.firstName}`,
    gender: capitalizeText(data.gender),
    attendance:
      <TextHighlight text={data.totalAttendance} color={theme.color.info} /> ||
      '...',
    absent:
      <TextHighlight text={data.totalAbsent} color={theme.color.error} /> ||
      '...',
    permission:
      (
        <TextHighlight
          text={data.totalPermission}
          color={theme.color.warning}
        />
      ) || '...',
  }
}

export const CustomInput = styled('div')(
  ({ styled, device }: { styled; device }) => ({
    position: 'relative',
    overflow: 'hidden',
    '& label': {
      transition: '0.2s ease',
      position: 'absolute',
      cursor: 'text',
      top: '39px',
      left: '14px',
      fontSize: styled.responsive[device]?.text.primary,
      color: styled.text.quaternary,
      userSelect: 'none',
      display: 'inline',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      width: '100%',
      overflow: 'hidden',
    },
    '& input[type="date"]::-webkit-calendar-picker-indicator, & input[type="datetime-local"]::-webkit-calendar-picker-indicator':
      {
        filter: 'invert(0.5)',
      },
    '& input': {
      position: 'relative',
      zIndex: 10,
      backgroundColor: 'transparent',
      boxSizing: 'border-box',
      padding: '5px 10px',
      color: styled.text.primary,
      width: '100%',
      border: styled.border.tertiary,
      height: 30,
      borderRadius: styled.radius.primary,
      outline: 'none !important',
      boxShadow: 'none',
      transition: '0.3s ease',
      fontFamily: `${styled.font.family} !important`,
      fontWeight: `${styled.font.weight} !important`,
      fontSize: `${styled.responsive[device].text.primary} !important`,
      '&:hover, &:focus': {
        border: styled.border.secondary,
      },
      '&:focus ~ label, &:not(:placeholder-shown) ~ label': {
        transform: 'translate(-8px, -24px)',
        backgroundColor: 'inherit',
        fontSize: styled.responsive[device].text.quaternary,
        color: styled.text.secondary,
      },
    },
  })
)

export const AttendanceReport = ({ dialog, setDialog }: any) => {
  const { notify } = useNotify()
  const { theme } = useTheme()
  const { device } = useWeb()
  const [rowData, setRowData] = useState<any>([])
  const [durationType, setDurationType] = useState<any>('daily')
  const [fromDate, setFromDate] = useState<any>('')
  const [toDate, setToDate] = useState<any>('')

  useEffect(() => {
    const classId = dialog.classId
    if (!classId) return
    const params = new URLSearchParams()
    const { fromDate: durationFromDate, toDate: durationToDate } = durationMap(durationType)

    if (durationType === 'range') {
      if (fromDate && toDate) {
        params.append('fromDate', fromDate.toString())
        params.append('toDate', toDate.toString())
      }
    } else {
      if (durationFromDate && durationToDate) {
        params.append('fromDate', durationFromDate.toString())
        params.append('toDate', durationToDate.toString())
      }
    }

    Axios({
      method: 'GET',
      url: `/operation/attendance/report/${classId}`,
      params,
    })
      .then((data) => {
        setRowData(
          data.data.data.map((data, index) => ({
            ...mappedAttendanceData(data, theme),
            no: index + 1,
          }))
        )
      })
      .catch((err) => notify(err?.response?.data?.msg))
    // eslint-disable-next-line
  }, [dialog.classId, durationType, fromDate, toDate])

  const handleCloseDialog = () => {
    setDialog({ classId: null, open: false })
  }

  const handleExportReport = () => {
    let body = durationMap(durationType)

    const config = {
      responseType: 'arraybuffer',
      body,
      headers: {
        Accept: 'application/octet-stream',
      },
    }
    Axios({
      url: `/export/attendance/class/${dialog.classId}`,
      method: 'POST',
      ...config,
    })
      .then((data) => {
        downloadBuffer(
          convertBufferToArrayBuffer(data?.data?.file?.data),
          'class_attendance.xlsx'
        )
      })
      .catch((err) => notify(err?.response?.data?.message, 'error'))
  }

  return (
    <AlertDialog isOpen={dialog.open} handleClose={handleCloseDialog}>
      <TextTitle title='Attendance Report' />
      <br />
      <div style={{ width: '90vw', height: '71vh' }}>
        <div
          style={{
            width: '100%',
            height: 40,
            display: 'flex',
            justifyContent: 'flex-end',
            padding: '0 10px',
            boxSizing: 'border-box',
          }}
        >
          <MiniSelectField
            options={durationOption}
            value={durationType}
            onChange={(event) => setDurationType(event.target.value)}
          />
          {durationType === 'range' && (
            <>
              <CustomInput styled={theme} device={device}>
                <input type='date' name='fromDate' id='fromDate' value={fromDate} onChange={(event) => setFromDate(event.target.value)} />
              </CustomInput>
              <span style={{ width: 10 }}></span>
              <CustomInput styled={theme} device={device}>
                <input type='date' name='toDate' id='toDate' value={toDate} onChange={(event) => setToDate(event.target.value)} />
              </CustomInput>
            </>
          )}
        </div>
        <StickyTable
          columns={attendanceColumn}
          rows={rowData}
          pagination={false}
        />
      </div>
      <div
        style={{
          gridArea: 'action',
          display: 'flex',
          justifyContent: 'end',
          padding: '0 20px 20px 0',
        }}
      >
        <Button onClick={handleCloseDialog}>Cancel</Button>
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
