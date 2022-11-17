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
import { dateFormat } from 'utils'
import { CircleIcon } from 'components/shared/table/CustomIcon'

export interface IStudentBody {
  lastName: string,
  firstName: string,
  gender: string,
  dateOfBirth: string,
  placeOfBirth: string,
  nationality: string,
  address: string,
  contact: string,
}

export const initState = {
  lastName: '',
  firstName: '',
  gender: '',
  dateOfBirth: '',
  placeOfBirth: '',
  nationality: '',
  address: '',
  contact: '',
}

export declare type ColumnHeader = 'no' | 'appliedClass' | 'currentClass' | 'profile' | 'ref' | 'username' | 'lastName' | 'firstName' | 'gender' | 'dateOfBirth' | 'placeOfBirth' | 'nationality' | 'address' | 'contact' | 'action'

export const importColumns = ['_id', 'lastName', 'firstName', 'gender', 'dateOfBirth', 'placeOfBirth', 'nationality', 'address', 'contact']

export const headerColumns = [
  {
    label: '_id',
    key: '_id'
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
    label: 'dateOfBirth',
    key: 'dateOfBirth'
  },
  {
    label: 'placeOfBirth',
    key: 'placeOfBirth'
  },
  {
    label: 'nationality',
    key: 'nationality'
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
    label: 'email',
    key: 'email'
  },
]

export const importColumnData: ITableColumn<ColumnHeader>[] = [
  { id: 'lastName', label: 'Last\u00a0Name' },
  { id: 'firstName', label: 'First\u00a0Name' },
  { id: 'gender', label: 'Gender' },
  { id: 'dateOfBirth', label: 'Date\u00a0Of\u00a0Birth' },
  { id: 'placeOfBirth', label: 'Place\u00a0Of\u00a0Birth' },
  { id: 'nationality', label: 'Nationality' },
  { id: 'address', label: 'Address' },
  { id: 'contact', label: 'Contact' },
  { id: 'action', label: 'Remove' },
]

export const columnData: ITableColumn<ColumnHeader>[] = [
  { id: 'no', label: 'NO' },
  { id: 'ref', label: 'ID' },
  { id: 'profile', label: 'Profile' },
  { id: 'username', label: 'Full Name' },
  { id: 'gender', label: 'Gender' },
  // { id: 'dateOfBirth', label: 'Date\u00a0Of\u00a0Birth' },
  // { id: 'placeOfBirth', label: 'Place\u00a0Of\u00a0Birth' },
  // { id: 'nationality', label: 'Nationality' },
  // { id: 'address', label: 'Address' },
  { id: 'contact', label: 'Contact' },
  { id: 'appliedClass', label: 'Applied\u00a0Class' },
  { id: 'currentClass', label: 'Current\u00a0Class' },
  { id: 'action', label: 'Action', align: 'right' },
]
export interface Data {
  no: number
  ref: string
  id: string
  profile: ReactElement
  username: string
  gender: string
  dateOfBirth: string
  placeOfBirth: string
  nationality: string
  address: string
  contact: string
  appliedClass: string
  currentClass: string
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
  dateOfBirth: string,
  placeOfBirth: string,
  nationality: string,
  address: string,
  contact: string,
  appliedClass: string,
  currentClass: string,
  createdBy: string,
  privilege: any,
  device: DeviceOptions,
  navigate: Function,
  setDialog: Function
): Data => {
  let action = (
    <div style={{ float: 'right' }}>
      {device === 'mobile' ? (
        privilege?.student?.detail && (
          <MenuDialog label={<ViewButton />}>
            <MenuItem
              component='div'
              onClick={() => navigate(`/school/student/update/${id}`)}
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
          {privilege?.student?.update && (
            <UpdateButton
              onClick={() => navigate(`/school/student/update/${id}`)}
            />
          )}
          {privilege?.student?.delete && (
            <DeleteButton onClick={() => setDialog({ open: true, id })} />
          )}
        </>
      )}
    </div>
  )

  const formattedBirthDate = dateFormat(dateOfBirth)
  const profileImage = <CircleIcon icon={profile?.filename} />

  return { no: key, ref, id, profile: profileImage, username: `${lastName} ${firstName}`, gender, dateOfBirth: formattedBirthDate, placeOfBirth, nationality, address, contact, appliedClass, currentClass, createdBy, action: action }
}