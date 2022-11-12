import { DeviceOptions } from 'contexts/web/interface'
import { ITableColumn } from 'components/shared/table/StickyTable'
import { ReactElement } from 'react'
import { MenuItem } from '@mui/material'

import {
  UpdateButton,
  DeleteButton,
  ViewButton,
} from 'components/shared/table/ActionButton'
import { MenuDialog } from 'components/shared/MenuDialog'

export interface IUserBody {
  username: string
  password: string
  email: string
  role: string
}

export const initState: IUserBody = {
  username: '',
  password: '',
  email: '',
  role: '',
}

export const importColumns = [
  '_id',
  'username',
  'role',
  'email',
  'config',
  'profile',
]

export const headerColumns = [
  { label: '_id', key: '_id' },
  { label: 'username', key: 'username' },
  { label: 'role', key: 'role' },
  { label: 'email', key: 'email' },
  { label: 'config', key: 'config' },
  { label: 'profile', key: 'profile' },
]

export const importColumnData: ITableColumn<ColumnHeader>[] = [
  { id: 'no', label: 'No' },
  { id: 'username', label: 'Username', minWidth: 100 },
  { id: 'role', label: 'Role', minWidth: 100 },
  { id: 'email', label: 'Email', minWidth: 150 },
  { id: 'action', label: 'Remove' },
]

export declare type ColumnHeader =
  | 'ref'
  | 'no'
  | 'fullName'
  | 'username'
  | 'role'
  | 'email'
  | 'action'
  | 'status'

export const columnData: ITableColumn<ColumnHeader>[] = [
  { id: 'no', label: 'NO' },
  { id: 'username', label: 'Username' },
  { id: 'fullName', label: 'Full Name' },
  { id: 'role', label: 'Position' },
  { id: 'email', label: 'Email' },
  { id: 'action', label: 'Action', align: 'right' },
]

export interface Data {
  no: number
  id: string
  username: string
  fullName: string
  role: string
  email: string
  action: ReactElement
}

export const createData = (
  key: number,
  id: string,
  username: string,
  fullName: string,
  role: string,
  email: any,
  privilege: any,
  device: DeviceOptions,
  navigate: Function,
  setDialog: Function
): Data => {
  let action = (
    <div style={{ float: 'right' }}>
      {device === 'mobile' ? (
        <MenuDialog label={<ViewButton />}>
          {privilege?.user?.update && (
            <MenuItem
              component='div'
              onClick={() => navigate(`/admin/user/update/${id}`)}
            >
              Edit
            </MenuItem>
          )}
          {privilege?.user?.delete && (
            <MenuItem
              component='div'
              onClick={() => setDialog({ open: true, id })}
            >
              Delete
            </MenuItem>
          )}
        </MenuDialog>
      ) : (
        <>
          {privilege?.user?.update && (
            <UpdateButton
              onClick={() => navigate(`/admin/user/update/${id}`)}
            />
          )}
          {privilege?.user?.delete && (
            <DeleteButton onClick={() => setDialog({ open: true, id })} />
          )}
        </>
      )}
    </div>
  )
  return { no: key, id, username, fullName, role, email, action }
}
