import { ReactElement } from 'react'
import ArrowRightAltRoundedIcon from '@mui/icons-material/ArrowRightAltRounded'
import PersonPinCircleRoundedIcon from '@mui/icons-material/PersonPinCircleRounded'
import NotListedLocationRoundedIcon from '@mui/icons-material/NotListedLocationRounded'
import WhereToVoteRoundedIcon from '@mui/icons-material/WhereToVoteRounded'
import RestartAltRoundedIcon from '@mui/icons-material/RestartAltRounded'
import { ITableColumn } from 'components/shared/table/StickyTable'
import { IThemeStyle } from 'contexts/theme/interface'
import { TextHighlight } from 'components/shared/TextHighlight'
import { IconButton } from '@mui/material'
import { CircleIcon } from 'components/shared/table/CustomIcon'
import { capitalizeText, timeFormat } from 'utils'
import { MiniSelectField } from 'components/shared/form'

export const columnData: ITableColumn<any>[] = [
  { id: 'name', label: 'Class' },
  { id: 'room', label: 'Room' },
  { id: 'schedule', label: 'Schedule' },
  { id: 'grade', label: 'Grade' },
  { id: 'status', label: 'Status' },
  { id: 'student', label: 'Student' },
  { id: 'checkedIn', label: 'Checked\u00a0In' },
  { id: 'checkedOut', label: 'Checked\u00a0Out' },
  { id: 'action', label: 'Action', align: 'right' },
]

export interface Data {
  id: string
  name: string
  room: string
  schedule: string
  student: ReactElement
  checkedIn: ReactElement
  checkedOut: ReactElement
  grade: string
  teacher: string
  status: ReactElement
  action: ReactElement
}

export const createData = (
  id: string,
  name: string,
  room: string,
  schedule: string,
  student: number,
  checkedIn: number,
  checkedOut: number,
  grade: string,
  teacher: string,
  status: boolean,
  privilege: any,
  theme: IThemeStyle,
  navigate: Function
): Data => {
  let action = (
    <div style={{ float: 'right' }}>
      <>
        {privilege?.class?.update && (
          <IconButton
            disabled={!status}
            onClick={() => navigate(`/operation/attendance/class/${id}`)}
            size='small'
            style={{
              backgroundColor: status ? `${theme.color.info}22` : `${theme.text.secondary}22`,
              borderRadius: theme.radius.primary,
              marginLeft: 5,
              color: status ? theme.color.info : theme.text.secondary,
            }}
          >
            <ArrowRightAltRoundedIcon fontSize='small' />
          </IconButton>
        )}
      </>
    </div>
  )

  const statusButton = status 
    ? <TextHighlight text='In Progress' color={theme.color.success} />
    : <TextHighlight text='Closed' color={theme.color.error} />

  return {
    id,
    name,
    room,
    schedule,
    student: <TextHighlight text={student} color={theme.color.info} />,
    checkedIn: <TextHighlight text={checkedIn || 0} color={student === checkedIn ? theme.color.success : theme.color.error} />,
    checkedOut: <TextHighlight text={checkedOut || 0} color={student === checkedOut ? theme.color.success : theme.color.error} />,
    grade,
    teacher,
    status: statusButton,
    action: action,
  }
}

export const attendanceColumnData: ITableColumn<any>[] = [
  { id: 'ref', label: 'ID' },
  { id: 'profile', label: 'Profile' },
  { id: 'lastName', label: 'Last\u00a0Name' },
  { id: 'firstName', label: 'First\u00a0Name' },
  { id: 'gender', label: 'Gender' },
  { id: 'checkedIn', label: 'Checked\u00a0In' },
  { id: 'checkedOut', label: 'Checked\u00a0Out' },
  { id: 'action', label: 'Action', align: 'right' },
]

export const createAttendanceData = (
  tags: string,
  monitor: string,
  studentId: string,
  id: string,
  ref: string,
  profile: string,
  lastName: string,
  firstName: string,
  gender: string,
  attendance: any,
  privilege: any,
  theme: IThemeStyle,
  onCheckIn: Function,
  onCheckOut: Function,
  onReset: Function,
  onPermission: Function
): any => {
  let action = (
    <div style={{ float: 'right' }}>
      <>
        {privilege?.class?.update && !attendance?.checkedOut ? (
          <>
            {
              attendance?.checkedIn ? (
                <IconButton
                  onClick={() => onCheckOut(attendance?._id)}
                  size='small'
                  style={{
                    backgroundColor: `${theme.color.success}22`,
                    borderRadius: theme.radius.primary,
                    marginLeft: 5,
                    color: theme.color.success,
                  }}
                >
                  <WhereToVoteRoundedIcon fontSize='small' />
                </IconButton>
              ) : (
                <>
                  <IconButton
                    onClick={() => onCheckIn(id)}
                    size='small'
                    style={{
                      backgroundColor: `${theme.color.info}22`,
                      borderRadius: theme.radius.primary,
                      marginLeft: 5,
                      color: theme.color.info,
                    }}
                  >
                    <PersonPinCircleRoundedIcon fontSize='small' />
                  </IconButton>
                </>
              )
            }
            <IconButton
              disabled={attendance?.checkedIn ? true : false}
              onClick={() => onPermission(id, attendance?._id)}
              size='small'
              style={{
                backgroundColor: `${attendance?.checkedIn ? `${theme.text.secondary}22` : `${theme.color.error}22`}`,
                borderRadius: theme.radius.primary,
                marginLeft: 5,
                color: attendance?.checkedIn ? theme.text.secondary : theme.color.error,
              }}
            >
              <NotListedLocationRoundedIcon fontSize='small' />
            </IconButton>
          </>
        ) : (
          <IconButton
            onClick={() => onReset(attendance?._id)}
            size='small'
            style={{
              backgroundColor: `${theme.color.info}22`,
              borderRadius: theme.radius.primary,
              marginLeft: 5,
              color: theme.color.info,
            }}
          >
            <RestartAltRoundedIcon fontSize='small' />
          </IconButton>
        )}
      </>
    </div>
  )

  const profileImage = studentId === monitor 
    ? (
      <CircleIcon star={true} icon={profile} />
    ) : (
      <CircleIcon icon={profile} />
    )

  const checkedInText = attendance?.permissionType ? attendance?.permissionType : timeFormat(attendance?.checkedIn)
  const checkedOutText = attendance?.permissionType ? attendance?.permissionType : timeFormat(attendance?.checkedOut)

  let attendanceColor
  switch (attendance?.permissionType) {
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
    tags,
    id,
    ref,
    profile: profileImage,
    lastName,
    firstName,
    gender: capitalizeText(gender),
    checkedIn: attendance?.checkedIn ? <TextHighlight text={checkedInText} color={attendanceColor} /> : '...',
    checkedOut: attendance?.checkedOut ? <TextHighlight text={checkedOutText} color={attendanceColor} /> : '...',
    checkedInOn: attendance?.checkedIn,
    checkedOutOn: attendance?.checkedOut,
    action: action,
  }
}

export const createTeacherAttendanceData = (
  tags: string,
  teacherId: string,
  id: string,
  profile: string,
  lastName: string,
  firstName: string,
  gender: string,
  teacherOption: any[],
  attendance: any,
  privilege: any,
  theme: IThemeStyle,
  onCheckIn: Function,
  onCheckOut: Function,
  onReset: Function,
  onPermission: Function,
  onChangeTeacher: Function
): any => {
  let action = (
    <div style={{ float: 'right' }}>
      <>
        {privilege?.class?.update && !attendance?.checkedOut ? (
          <>
            {
              attendance?.checkedIn ? (
                <IconButton
                  onClick={() => onCheckOut(attendance?._id)}
                  size='small'
                  style={{
                    backgroundColor: `${theme.color.success}22`,
                    borderRadius: theme.radius.primary,
                    marginLeft: 5,
                    color: theme.color.success,
                  }}
                >
                  <WhereToVoteRoundedIcon fontSize='small' />
                </IconButton>
              ) : (
                <>
                  <IconButton
                    onClick={() => onCheckIn(id)}
                    size='small'
                    style={{
                      backgroundColor: `${theme.color.info}22`,
                      borderRadius: theme.radius.primary,
                      marginLeft: 5,
                      color: theme.color.info,
                    }}
                  >
                    <PersonPinCircleRoundedIcon fontSize='small' />
                  </IconButton>
                </>
              )
            }
            <IconButton
              disabled={attendance?.checkedIn ? true : false}
              onClick={() => onPermission(id, attendance?._id)}
              size='small'
              style={{
                backgroundColor: `${attendance?.checkedIn ? `${theme.text.secondary}22` : `${theme.color.error}22`}`,
                borderRadius: theme.radius.primary,
                marginLeft: 5,
                color: attendance?.checkedIn ? theme.text.secondary : theme.color.error,
              }}
            >
              <NotListedLocationRoundedIcon fontSize='small' />
            </IconButton>
          </>
        ) : (
          <IconButton
            onClick={() => onReset(attendance?._id)}
            size='small'
            style={{
              backgroundColor: `${theme.color.info}22`,
              borderRadius: theme.radius.primary,
              marginLeft: 5,
              color: theme.color.info,
            }}
          >
            <RestartAltRoundedIcon fontSize='small' />
          </IconButton>
        )}
      </>
    </div>
  )

  const profileImage = <CircleIcon master={true} icon={profile} />

  const checkedInText = attendance?.permissionType ? attendance?.permissionType : timeFormat(attendance?.checkedIn)
  const checkedOutText = attendance?.permissionType ? attendance?.permissionType : timeFormat(attendance?.checkedOut)

  let attendanceColor
  switch (attendance?.permissionType) {
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

  const mappedOption = teacherOption.map(teacher => ({ label: teacher.ref, value: teacher._id }))
  const selectRef = <MiniSelectField
    name='teacher'
    options={mappedOption}
    value={mappedOption.length ? teacherId : ''}
    onChange={(event) => onChangeTeacher(event)}
  />

  return {
    tags,
    id,
    ref: selectRef,
    profile: profileImage,
    lastName,
    firstName,
    gender: capitalizeText(gender),
    checkedIn: attendance?.checkedIn ? <TextHighlight text={checkedInText} color={attendanceColor} /> : '...',
    checkedOut: attendance?.checkedOut ? <TextHighlight text={checkedOutText} color={attendanceColor} /> : '...',
    checkedInOn: attendance?.checkedIn,
    checkedOutOn: attendance?.checkedOut,
    action: action,
  }
}