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

export interface IAttendanceBody {
  lastName: string,
  firstName: string,
  gender: string,
  birthDate: string,
  address: string,
  contact: string,
  email: string,
}

export const initState = {
  lastName: '',
  firstName: '',
  gender: '',
  birthDate: '',
  address: '',
  contact: '',
  email: ''
}

export declare type ColumnHeader = 'lastName' | 'firstName' | 'gender' | 'birthDate' | 'address' | 'contact' | 'email' | 'action'

export const importColumns = ['_id', 'lastName', 'firstName', 'gender', 'birthDate', 'address', 'contact', 'email']

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
    label: 'email',
    key: 'email'
  },
]

export const importColumnData: ITableColumn<ColumnHeader>[] = [
  { id: 'lastName', label: 'Last\u00a0Name' },
  { id: 'firstName', label: 'First\u00a0Name' },
  { id: 'gender', label: 'Gender' },
  { id: 'birthDate', label: 'Birth\u00a0Date' },
  { id: 'address', label: 'Address' },
  { id: 'contact', label: 'Contact' },
  { id: 'action', label: 'Remove' },
]

export const columnData: ITableColumn<ColumnHeader>[] = [
  { id: 'lastName', label: 'Last\u00a0Name' },
  { id: 'firstName', label: 'First\u00a0Name' },
  { id: 'gender', label: 'Gender' },
  { id: 'birthDate', label: 'Birth\u00a0Date' },
  { id: 'address', label: 'Address' },
  { id: 'contact', label: 'Contact' },
  { id: 'action', label: 'Action', align: 'right' },
]
export interface Data {
  id: string
  lastName: string
  firstName: string
  gender: string
  birthDate: string
  address: string
  contact: string
  createdBy: string
  action: ReactElement
}

export const createData = (
  id: string,
  lastName: string,
  firstName: string,
  gender: string,
  birthDate: string,
  address: string,
  contact: string,
  createdBy: string,
  privilege: any,
  device: DeviceOptions,
  navigate: Function,
  setDialog: Function
): Data => {
  let action = (
    <div style={{ float: 'right' }}>
      {device === 'mobile' ? (
        privilege?.attendance?.detail && (
          <MenuDialog label={<ViewButton />}>
            <MenuList
              component='div'
              onClick={() => navigate(`/school/attendance/update/${id}`)}
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
              onClick={() => navigate(`/school/attendance/detail/${id}`)}
            >
              View
            </MenuList>
          </MenuDialog>
        )
      ) : (
        <>
          {privilege?.attendance?.update && (
            <UpdateButton
              onClick={() => navigate(`/school/attendance/update/${id}`)}
            />
          )}
          {privilege?.attendance?.delete && (
            <DeleteButton onClick={() => setDialog({ open: true, id })} />
          )}
        </>
      )}
    </div>
  )

  const formattedBirthDate = dateFormat(birthDate)

  return { id, lastName, firstName, gender, birthDate: formattedBirthDate, address, contact, createdBy, action: action }
}