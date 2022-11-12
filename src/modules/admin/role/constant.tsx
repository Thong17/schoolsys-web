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

export interface IRoleBody {
  name: Object
  description: string
  privilege: Object
}

export const initState = {
  name: {},
  description: '',
  privilege: {},
}

export declare type ColumnHeader =
  | 'no'
  | 'name'
  | 'description'
  | 'createdBy'
  | 'action'
  | 'privilege'

export const importColumns = ['_id', 'name', 'description', 'privilege']

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
    label: 'description',
    key: 'description',
  },
  {
    label: 'privilege',
    key: 'privilege',
  },
]

export const importColumnData: ITableColumn<ColumnHeader>[] = [
  { id: 'name', label: 'Name' },
  { id: 'description', label: 'Description' },
  { id: 'privilege', label: 'Privilege' },
  { id: 'action', label: 'Remove' },
]

export const columnData: ITableColumn<ColumnHeader>[] = [
  { id: 'no', label: 'NO' },
  { id: 'name', label: 'Name' },
  { id: 'description', label: 'Description' },
  { id: 'createdBy', label: 'Created\u00a0By', align: 'right' },
  { id: 'action', label: 'Action', align: 'right' },
]
export interface Data {
  no: number
  id: string
  name: string
  description: string
  createdBy: string
  action: ReactElement
}

export const createData = (
  key: number,
  id: string,
  name: string,
  description: string,
  createdBy: string,
  privilege: any,
  device: DeviceOptions,
  navigate: Function,
  setDialog: Function
): Data => {
  let action = (
    <div style={{ float: 'right' }}>
      {device === 'mobile' ? (
        <MenuDialog label={<ViewButton />}>
          {privilege?.role?.update && (
            <MenuItem
              component='div'
              onClick={() => navigate(`/admin/role/update/${id}`)}
            >
              Edit
            </MenuItem>
          )}
          {privilege?.role?.delete && (
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
          {privilege?.role?.update && (
            <UpdateButton
              onClick={() => navigate(`/admin/role/update/${id}`)}
            />
          )}
          {privilege?.role?.delete && (
            <DeleteButton onClick={() => setDialog({ open: true, id })} />
          )}
        </>
      )}
    </div>
  )

  return { no: key, id, name, description, createdBy, action: action }
}
