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

export interface IClassBody {
  name: string,
  room: string,
  schedule: string,
  subjects: string,
  students: string,
  description: string,
}

export const initState = {
  name: '',
  room: '',
  schedule: '',
  subjects: '',
  students: '',
  description: '',
}

export declare type ColumnHeader = 'name' | 'room' | 'level' | 'schedule' | 'subjects' | 'students' | 'description' | 'action'

export const importColumns = ['_id', 'name', 'room', 'schedule', 'subjects', 'students', 'description']

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
    label: 'subjects',
    key: 'subjects'
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
  { id: 'description', label: 'Description' },
  { id: 'action', label: 'Remove' },
]

export const columnData: ITableColumn<ColumnHeader>[] = [
  { id: 'name', label: 'Name' },
  { id: 'room', label: 'Room' },
  { id: 'schedule', label: 'Schedule' },
  { id: 'students', label: 'Students' },
  { id: 'description', label: 'Description' },
  { id: 'action', label: 'Action', align: 'right' },
]
export interface Data {
  id: string
  name: string,
  room: string,
  schedule: string,
  students: string,
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

  return { id, name, room, schedule, students, description, createdBy, action: action }
}