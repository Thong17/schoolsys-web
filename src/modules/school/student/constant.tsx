import { ReactElement } from 'react'
import {
  UpdateButton,
  DeleteButton,
  ViewButton,
} from 'components/shared/table/ActionButton'
import { DeviceOptions } from 'contexts/web/interface'
import { MenuDialog } from 'components/shared/MenuDialog'
import { ITableColumn } from 'components/shared/table/StickyTable'
import MenuList from '@mui/material/MenuList'
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

export declare type ColumnHeader = 'appliedClass' | 'profile' | 'lastName' | 'firstName' | 'gender' | 'dateOfBirth' | 'placeOfBirth' | 'nationality' | 'address' | 'contact' | 'action'

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
  { id: 'profile', label: 'Profile' },
  { id: 'lastName', label: 'Last\u00a0Name' },
  { id: 'firstName', label: 'First\u00a0Name' },
  { id: 'gender', label: 'Gender' },
  // { id: 'dateOfBirth', label: 'Date\u00a0Of\u00a0Birth' },
  // { id: 'placeOfBirth', label: 'Place\u00a0Of\u00a0Birth' },
  // { id: 'nationality', label: 'Nationality' },
  // { id: 'address', label: 'Address' },
  { id: 'contact', label: 'Contact' },
  { id: 'appliedClass', label: 'Applied\u00a0Grade' },
  { id: 'action', label: 'Action', align: 'right' },
]
export interface Data {
  id: string
  profile: ReactElement
  lastName: string
  firstName: string
  gender: string
  dateOfBirth: string
  placeOfBirth: string
  nationality: string
  address: string
  contact: string
  appliedClass: string
  createdBy: string
  action: ReactElement
}

export const createData = (
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
            <MenuList
              component='div'
              onClick={() => navigate(`/school/student/update/${id}`)}
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
              onClick={() => navigate(`/school/student/detail/${id}`)}
            >
              View
            </MenuList>
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

  return { id, profile: profileImage, lastName, firstName, gender, dateOfBirth: formattedBirthDate, placeOfBirth, nationality, address, contact, appliedClass, createdBy, action: action }
}