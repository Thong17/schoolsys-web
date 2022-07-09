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

export interface IGradeBody {
  name: string,
  level: string,
  description: string,
}

export const initState = {
  name: '',
  level: '',
  description: '',
}

export declare type ColumnHeader = 'name' | 'level' | 'subjects' | 'description' | 'action'

export const importColumns = ['_id', 'name', 'level', 'subjects', 'description']

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
    label: 'level',
    key: 'level'
  },
  {
    label: 'subjects',
    key: 'subjects'
  },
  {
    label: 'description',
    key: 'description'
  },
]

export const importColumnData: ITableColumn<ColumnHeader>[] = [
  { id: 'name', label: 'Name' },
  { id: 'level', label: 'Level' },
  { id: 'subjects', label: 'Subjects' },
  { id: 'description', label: 'Description' },
  { id: 'action', label: 'Remove' },
]

export const columnData: ITableColumn<ColumnHeader>[] = [
  { id: 'name', label: 'Name' },
  { id: 'level', label: 'Level' },
  { id: 'subjects', label: 'Subjects' },
  { id: 'description', label: 'Description' },
  { id: 'action', label: 'Action', align: 'right' },
]
export interface Data {
  id: string
  name: string,
  level: string,
  subjects: number,
  description: string,
  createdBy: string
  action: ReactElement
}

export const createData = (
  id: string,
  name: string,
  level: string,
  subjects: string,
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
        privilege?.grade?.detail && (
          <MenuDialog label={<ViewButton />}>
            <MenuList
              component='div'
              onClick={() => navigate(`/school/grade/update/${id}`)}
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
              onClick={() => navigate(`/school/grade/detail/${id}`)}
            >
              View
            </MenuList>
          </MenuDialog>
        )
      ) : (
        <>
          {privilege?.grade?.update && (
            <UpdateButton
              onClick={() => navigate(`/school/grade/update/${id}`)}
            />
          )}
          {privilege?.grade?.delete && (
            <DeleteButton onClick={() => setDialog({ open: true, id })} />
          )}
        </>
      )}
    </div>
  )

  return { id, name, level, subjects: subjects?.length, description, createdBy, action: action }
}