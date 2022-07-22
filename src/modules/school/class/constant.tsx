import { ReactElement } from 'react'
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded'
import {
  UpdateButton,
  DeleteButton,
  RejectButton,
  ConfirmButton,
  ViewButton,
} from 'components/shared/table/ActionButton'
import { DeviceOptions } from 'contexts/web/interface'
import { MenuDialog } from 'components/shared/MenuDialog'
import { ITableColumn } from 'components/shared/table/StickyTable'
import MenuList from '@mui/material/MenuList'
import { CircleIcon } from 'components/shared/table/CustomIcon'
import { TextHighlight } from 'components/shared/TextHighlight'
import { IThemeStyle } from 'contexts/theme/interface'
import {
  calculateTotalScore,
  calculateAverageScore,
  capitalizeText,
  calculateGraduateResult,
} from 'utils'
import { IconButton } from '@mui/material'
import { AverageHighlight } from 'components/shared/AverageHighlight'

export interface IClassBody {
  name: Object
  room: string
  schedule: string
  grade: string
  teacher: string
  description: string
}

export const initState = {
  name: {},
  room: '',
  schedule: '',
  grade: '',
  teacher: null,
  monitor: null,
  description: '',
}

export declare type ColumnHeader =
  | 'name'
  | 'room'
  | 'level'
  | 'schedule'
  | 'grade'
  | 'teacher'
  | 'students'
  | 'description'
  | 'action'
  | 'applied'
  | 'status'

export const importColumns = [
  '_id',
  'name',
  'room',
  'schedule',
  'grade',
  'teacher',
  'students',
  'description',
]

export const headerColumns = [
  {
    label: '_id',
    key: '_id',
  },
  {
    label: 'name',
    key: 'name',
  },
  {
    label: 'room',
    key: 'room',
  },
  {
    label: 'schedule',
    key: 'schedule',
  },
  {
    label: 'grade',
    key: 'grade',
  },
  {
    label: 'teacher',
    key: 'teacher',
  },
  {
    label: 'students',
    key: 'students',
  },
  {
    label: 'description',
    key: 'description',
  },
]

export const importColumnData: ITableColumn<ColumnHeader>[] = [
  { id: 'name', label: 'Name' },
  { id: 'room', label: 'Room' },
  { id: 'schedule', label: 'Schedule' },
  { id: 'students', label: 'Students' },
  { id: 'grade', label: 'Grade' },
  { id: 'teacher', label: 'Teacher' },
  { id: 'description', label: 'Description' },
  { id: 'action', label: 'Remove' },
]

export const columnData: ITableColumn<ColumnHeader>[] = [
  { id: 'name', label: 'Name' },
  { id: 'room', label: 'Room' },
  { id: 'schedule', label: 'Schedule' },
  { id: 'grade', label: 'Grade' },
  // { id: 'teacher', label: 'Teacher' },
  { id: 'students', label: 'Student' },
  { id: 'applied', label: 'Applied' },
  { id: 'status', label: 'Status' },
  { id: 'action', label: 'Action', align: 'right' },
]

export const requestColumnData: ITableColumn<any>[] = [
  { id: 'profile', label: 'Profile' },
  { id: 'lastName', label: 'Last\u00a0Name' },
  { id: 'firstName', label: 'First\u00a0Name' },
  { id: 'gender', label: 'Gender' },
  { id: 'previousSchool', label: 'Previous\u00a0School' },
  { id: 'previousGrade', label: 'Previous\u00a0Grade' },
  { id: 'contact', label: 'Contact' },
  { id: 'action', label: 'Action', align: 'right' },
]

export const studentColumnData: ITableColumn<any>[] = [
  { id: 'ref', label: 'ID' },
  { id: 'profile', label: 'Profile' },
  { id: 'lastName', label: 'Last\u00a0Name' },
  { id: 'firstName', label: 'First\u00a0Name' },
  { id: 'gender', label: 'Gender' },
  { id: 'score', label: 'Score' },
  { id: 'average', label: 'Average' },
  { id: 'action', label: 'Remove', align: 'right' },
]

export interface Data {
  id: string
  name: string
  room: string
  schedule: string
  students: ReactElement
  applied: ReactElement
  grade: string
  teacher: string
  status: ReactElement
  description: string
  createdBy: string
  action: ReactElement
}

export const createData = (
  id: string,
  name: string,
  room: string,
  schedule: string,
  students: string,
  applied: string,
  grade: string,
  teacher: string,
  status: boolean,
  description: string,
  createdBy: string,
  privilege: any,
  theme: IThemeStyle,
  device: DeviceOptions,
  navigate: Function,
  setDialog: Function,
  setGraduateDialog: Function,
  onEnable: Function,
): Data => {
  let action = (
    <div style={{ float: 'right' }}>
      {device === 'mobile' ? (
        privilege?.class?.detail && (
          <MenuDialog label={<ViewButton />}>
            <MenuList
              component='div'
              onClick={() => navigate(`/school/class/update/${id}`)}
            >
              Edit
            </MenuList>
            <MenuList
              component='div'
              onClick={() => setDialog({ open: true, id })}
            >
              Delete
            </MenuList>
            <MenuList
              component='div'
              onClick={() => navigate(`/school/class/detail/${id}`)}
            >
              View
            </MenuList>
          </MenuDialog>
        )
      ) : (
        <>
          {privilege?.class?.update && (
            <UpdateButton
              onClick={() => navigate(`/school/class/update/${id}`)}
            />
          )}
          {privilege?.class?.delete && (
            <DeleteButton onClick={() => setDialog({ open: true, id })} />
          )}
          {
            status 
              ? <IconButton
                  onClick={() => setGraduateDialog({ open: true, id })}
                  size='small'
                  style={{
                    backgroundColor: `${theme.color.success}22`,
                    borderRadius: theme.radius.primary,
                    marginLeft: 5,
                    color: theme.color.success,
                  }}
                >
                  <SchoolRoundedIcon fontSize='small' />
                </IconButton> 
              : <IconButton
                  onClick={() => onEnable(id)}
                  size='small'
                  style={{
                    backgroundColor: `${theme.color.success}22`,
                    borderRadius: theme.radius.primary,
                    marginLeft: 5,
                    color: theme.color.success,
                  }}
                >
                  <SchoolRoundedIcon fontSize='small' />
                </IconButton>
          }
        </>
      )}
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
    students: <TextHighlight text={students} color={theme.color.info} />,
    applied: <TextHighlight text={applied} color={theme.color.error} />,
    grade,
    teacher,
    status: statusButton,
    description,
    createdBy,
    action: action,
  }
}

export const createRequestData = (
  id: string,
  profile: string,
  lastName: string,
  firstName: string,
  gender: string,
  previousSchool: string,
  previousGrade: string,
  contact: string,
  privilege: any,
  device: DeviceOptions,
  onAccept: Function,
  setDialog: Function
): any => {
  let action = (
    <div style={{ float: 'right' }}>
      {device === 'mobile' ? (
        privilege?.class?.detail && (
          <MenuDialog label={<ViewButton />}>
            <MenuList component='div' onClick={() => onAccept(id)}>
              Edit
            </MenuList>
            <MenuList
              component='div'
              onClick={() => setDialog({ open: true, id })}
            >
              Reject
            </MenuList>
          </MenuDialog>
        )
      ) : (
        <>
          {privilege?.class?.delete && (
            <RejectButton onClick={() => setDialog({ open: true, id })} />
          )}
          {privilege?.class?.update && (
            <ConfirmButton onClick={() => onAccept(id)} />
          )}
        </>
      )}
    </div>
  )

  const profileImage = <CircleIcon icon={profile} />

  return {
    id,
    profile: profileImage,
    lastName,
    firstName,
    gender,
    previousSchool,
    previousGrade,
    contact,
    action: action,
  }
}

export const createStudentData = (
  tags: string,
  monitor: string,
  id: string,
  ref: string,
  profile: string,
  lastName: string,
  firstName: string,
  gender: string,
  scores: Array<any>,
  subjects: Array<any>,
  privilege: any,
  device: DeviceOptions,
  onRemove: Function
): any => {
  let action = (
    <div style={{ float: 'right' }}>
      {device === 'mobile' ? (
        privilege?.class?.detail && (
          <MenuDialog label={<ViewButton />}>
            <MenuList component='div'>Reject</MenuList>
          </MenuDialog>
        )
      ) : (
        <>
          {privilege?.class?.delete && (
            <RejectButton onClick={() => onRemove({ open: true, id })} />
          )}
        </>
      )}
    </div>
  )
  const calculatedAverage = calculateAverageScore(scores, subjects.length)
  
  const profileImage = id === monitor ? <CircleIcon star={true} icon={profile} /> : <CircleIcon icon={profile} />
  let averageText = <AverageHighlight calculatedAverage={calculatedAverage} subjects={subjects} />

  return {
    tags,
    id,
    ref,
    profile: profileImage,
    lastName,
    firstName,
    gender: capitalizeText(gender),
    score: calculateTotalScore(scores),
    average: averageText,
    action: action
  }
}

export const graduateColumnData: ITableColumn<any>[] = [
  { id: 'rank', label: 'Rank' },
  { id: 'profile', label: 'Profile' },
  { id: 'ref', label: 'ID' },
  { id: 'lastName', label: 'Last\u00a0Name' },
  { id: 'firstName', label: 'First\u00a0Name' },
  { id: 'gender', label: 'Gender' },
  // { id: 'contact', label: 'Contact' },
  { id: 'score', label: 'Score' },
  { id: 'average', label: 'Average' },
  { id: 'result', label: 'Grade' },
]

export const graduateExportColumnData = [
  'Rank',
  'ID',
  'LastName',
  'FirstName',
  'Gender',
  'Contact',
  'Score',
  'Average',
  'Grade',
]

export const createGraduateData = (profile, ref, lastName, firstName, gender, scores, subjects) => {
  const profileImage = <CircleIcon icon={profile} />
  const calculatedAverage = calculateAverageScore(scores, subjects?.length)  
  let averageText = <AverageHighlight calculatedAverage={calculatedAverage} subjects={subjects} />
  
  return {
    profile: profileImage,
    ref,
    lastName,
    firstName,
    gender: capitalizeText(gender),
    // contact,
    score: calculateTotalScore(scores),
    average: averageText,
    averageText: calculatedAverage,
    result: calculateGraduateResult(scores, subjects)
  }
}