import { ReactElement } from 'react'
import {
  UpdateButton,
  DeleteButton,
  ViewButton,
} from 'components/shared/table/ActionButton'
import { DeviceOptions } from 'contexts/web/interface'
import { MenuDialog } from 'components/shared/MenuDialog'
import { ITableColumn } from 'components/shared/table/StickyTable'
import MenuItem from '@mui/material/MenuItem'
import { capitalizeText, dateFormat } from 'utils'
import { CircleIcon } from 'components/shared/table/CustomIcon'

export interface ITeacherBody {
  lastName: string,
  firstName: string,
  gender: string,
  birthDate: string,
  address: string,
  contact: string,
  grade: string,
  subject: string,
  email: string,
}

export const initState = {
  lastName: '',
  firstName: '',
  gender: '',
  birthDate: '',
  address: '',
  contact: '',
  grade: '',
  subject: '',
  email: ''
}

export declare type ColumnHeader = 'no' | 'profile' | 'lastName' | 'username' | 'ref' | 'firstName' | 'gender' | 'birthDate' | 'address' | 'contact' | 'grade' | 'subject' | 'email' | 'action'

export const importColumns = ['_id', 'lastName', 'firstName', 'gender', 'birthDate', 'address', 'contact', 'email', 'grade', 'subject']

export const headerColumns = [
  {
    label: '_id',
    key: '_id'
  },
  {
    label: 'profile',
    key: 'profile'
  },
  {
    label: 'lastName',
    key: 'lastName'
  },
  {
    label: 'firstName',
    key: 'firstName'
  },
  {
    label: 'gender',
    key: 'gender'
  },
  {
    label: 'birthDate',
    key: 'birthDate'
  },
  {
    label: 'address',
    key: 'address'
  },
  {
    label: 'contact',
    key: 'contact'
  },
  {
    label: 'grade',
    key: 'grade'
  },
  {
    label: 'subject',
    key: 'subject'
  },
  {
    label: 'email',
    key: 'email'
  },
]

export const importColumnData: ITableColumn<ColumnHeader>[] = [
  { id: 'profile', label: 'Profile' },
  { id: 'lastName', label: 'Last Name' },
  { id: 'firstName', label: 'First Name' },
  { id: 'gender', label: 'Gender' },
  { id: 'birthDate', label: 'Birth Date' },
  { id: 'address', label: 'Address' },
  { id: 'contact', label: 'Contact' },
  { id: 'grade', label: 'Grade' },
  { id: 'subject', label: 'Subject' },
  { id: 'action', label: 'Remove' },
]

export const columnData: ITableColumn<ColumnHeader>[] = [
  { id: 'no', label: 'NO' },
  { id: 'ref', label: 'ID' },
  { id: 'profile', label: 'Profile' },
  { id: 'username', label: 'Username' },
  { id: 'gender', label: 'Gender' },
  { id: 'birthDate', label: 'Date Of Birth' },
  // { id: 'address', label: 'Address' },
  { id: 'contact', label: 'Contact' },
  { id: 'grade', label: 'Grade' },
  { id: 'subject', label: 'Subject' },
  { id: 'action', label: 'Action', align: 'right' },
]
export interface Data {
  no: number
  ref: string
  id: string
  profile: ReactElement
  username: string
  gender: string
  birthDate: string
  address: string
  contact: string
  grade: string
  subject: string
  createdBy: string
  action: ReactElement
}

export const createData = (
  key: number,
  ref: string,
  id: string,
  profile: any,
  lastName: string,
  firstName: string,
  gender: string,
  birthDate: string,
  address: string,
  contact: string,
  grade: string,
  subject: string,
  createdBy: string,
  privilege: any,
  device: DeviceOptions,
  navigate: Function,
  setDialog: Function
): Data => {
  let action = (
    <div style={{ float: 'right' }}>
      {device === 'mobile' ? (
        privilege?.teacher?.detail && (
          <MenuDialog label={<ViewButton />}>
            <MenuItem
              component='div'
              onClick={() => navigate(`/school/teacher/update/${id}`)}
            >
              Edit
            </MenuItem>
            <MenuItem
              component='div'
              onClick={() => setDialog({ open: true, id })}
            >
              Delete
            </MenuItem>
          </MenuDialog>
        )
      ) : (
        <>
          {privilege?.teacher?.update && (
            <UpdateButton
              onClick={() => navigate(`/school/teacher/update/${id}`)}
            />
          )}
          {privilege?.teacher?.delete && (
            <DeleteButton onClick={() => setDialog({ open: true, id })} />
          )}
        </>
      )}
    </div>
  )

  const formattedBirthDate = dateFormat(birthDate)
  const profileImage = <CircleIcon icon={profile?.filename} />

  return { no: key, ref, id, profile: profileImage, username: `${lastName} ${firstName}`, gender: capitalizeText(gender), birthDate: formattedBirthDate, address, contact, grade, subject, createdBy, action: action }
}