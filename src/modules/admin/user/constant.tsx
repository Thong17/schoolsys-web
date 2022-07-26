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

export const importColumns = ['_id', 'username', 'role', 'email', 'config', 'profile']

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
  | 'no'
  | 'username'
  | 'role'
  | 'email'
  | 'action'
  | 'status'

export const columnData: ITableColumn<ColumnHeader>[] = [
  { id: 'username', label: 'Username' },
  { id: 'role', label: 'Role' },
  { id: 'email', label: 'Email' },
  { id: 'action', label: 'Action', align: 'right' },
]

export interface Data {
  id: string
  username: string
  role: string
  email: string
  action: ReactElement
}

export const createData = (
  id: string,
  username: string,
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
        privilege?.role?.detail && (
          <MenuDialog label={<ViewButton />}>
            <MenuItem
              component='div'
              onClick={() => navigate(`/admin/user/update/${id}`)}
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
          {privilege?.role?.update && (
            <UpdateButton
              onClick={() => navigate(`/admin/user/update/${id}`)}
            />
          )}
          {privilege?.role?.delete && (
            <DeleteButton onClick={() => setDialog({ open: true, id })} />
          )}
        </>
      )}
    </div>
  )
  return { id, username, role, email, action }
}