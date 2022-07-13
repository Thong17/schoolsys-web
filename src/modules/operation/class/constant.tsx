import { ReactElement } from 'react'
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

export interface IClassBody {
  name: Object,
  room: string,
  schedule: string,
  grade: string,
  teacher: string,
  description: string,
}

export const initState = {
  name: {},
  room: '',
  schedule: '',
  grade: '',
  teacher: '',
  description: '',
}

export declare type ColumnHeader = 'name' | 'room' | 'level' | 'schedule' | 'grade' | 'teacher' | 'students' | 'description' | 'action' | 'applied'

export const importColumns = ['_id', 'name', 'room', 'schedule', 'grade', 'teacher', 'students', 'description']

export const headerColumns = [
  {
    label: '_id',
    key: '_id'
  },
  {
    label: 'name',
    key: 'name'
  },
  {
    label: 'room',
    key: 'room'
  },
  {
    label: 'schedule',
    key: 'schedule'
  },
  {
    label: 'grade',
    key: 'grade'
  },
  {
    label: 'teacher',
    key: 'teacher'
  },
  {
    label: 'students',
    key: 'students'
  },
  {
    label: 'description',
    key: 'description'
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
  name: string,
  room: string,
  schedule: string,
  students: ReactElement,
  applied: ReactElement,
  grade: string,
  teacher: string,
  description: string,
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
  description: string,
  createdBy: string,
  privilege: any,
  theme: IThemeStyle,
  device: DeviceOptions,
  navigate: Function,
  setDialog: Function
): Data => {
  let action = (
    <div style={{ float: 'right' }}>
      {device === 'mobile' ? (
        privilege?.class?.detail && (
          <MenuDialog label={<ViewButton />}>
            <MenuList
              component='div'
              onClick={() => navigate(`/operation/class/update/${id}`)}
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
              onClick={() => navigate(`/operation/class/detail/${id}`)}
            >
              View
            </MenuList>
          </MenuDialog>
        )
      ) : (
        <>
          {privilege?.class?.update && (
            <UpdateButton
              onClick={() => navigate(`/operation/class/update/${id}`)}
            />
          )}
          {privilege?.class?.delete && (
            <DeleteButton onClick={() => setDialog({ open: true, id })} />
          )}
        </>
      )}
    </div>
  )

  return { id, name, room, schedule, students: <TextHighlight text={students} color={`${theme.color.info}11`} />, applied: <TextHighlight text={applied} color={`${theme.color.error}22`} />, grade, teacher, description, createdBy, action: action }
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
            <MenuList
              component='div'
              onClick={() => onAccept(id)}
            >
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
            <ConfirmButton
              onClick={() => onAccept(id)}
            />
          )}
        </>
      )}
    </div>
  )

  const profileImage = <CircleIcon icon={profile} />

  return { id, profile: profileImage, lastName, firstName, gender, previousSchool, previousGrade, contact, action: action }
}

export const createStudentData = (
  id: string,
  ref: string,
  profile: string,
  lastName: string,
  firstName: string,
  gender: string,
  score: number,
  average: number,
  privilege: any,
  device: DeviceOptions,
  onRemove: Function
): any => {
  let action = (
    <div style={{ float: 'right' }}>
      {device === 'mobile' ? (
        privilege?.class?.detail && (
          <MenuDialog label={<ViewButton />}>
            <MenuList
              component='div'
            >
              Reject
            </MenuList>
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

  const profileImage = <CircleIcon icon={profile} />

  return { id, ref, profile: profileImage, lastName, firstName, gender, score, average, action: action }
}