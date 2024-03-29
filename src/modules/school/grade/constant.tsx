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

export interface IGradeBody {
  name: string,
  level: string,
  description: string,
}

export const initState = {
  name: {},
  level: '',
  description: '',
}

export const mapGradeBody = (body): IGradeBody => {
  return { name: body?.name, level: body?.level, description: body?.description }
}

export const initSubject = {
  name: {},
  teacher: null,
  passScore: 0,
  fullScore: 0,
  description: '',
}

export declare type ColumnHeader = 'no' | 'name' | 'level' | 'subjects' | 'description' | 'action'

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
  { id: 'subjects', label: 'Subject' },
  { id: 'description', label: 'Description' },
  { id: 'action', label: 'Remove' },
]

export const columnData: ITableColumn<ColumnHeader>[] = [
  { id: 'no', label: 'NO' },
  { id: 'name', label: 'Name' },
  { id: 'level', label: 'Level' },
  { id: 'subjects', label: 'Subject' },
  { id: 'description', label: 'Description' },
  { id: 'action', label: 'Action', align: 'right' },
]

export const subjectColumnData: ITableColumn<any>[] = [
  { id: 'name', label: 'Name' },
  { id: 'teacher', label: 'Teacher' },
  { id: 'passScore', label: 'Pass Score' },
  { id: 'fullScore', label: 'Full Score' },
  { id: 'description', label: 'Description' },
  { id: 'action', label: 'Action', align: 'right' },
]

export interface Data {
  no: number
  id: string
  name: string,
  level: string,
  subjects: number,
  description: string,
  createdBy: string
  action: ReactElement
}

export const createData = (
  key: number,
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
            <MenuItem
              component='div'
              onClick={() => navigate(`/school/grade/update/${id}`)}
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

  return { no: key, id, name, level, subjects: subjects?.length, description, createdBy, action: action }
}

export const createSubjectData = (
  id: string,
  name: string,
  teacher: string,
  passScore: string,
  fullScore: string,
  description: string,
  createdBy: string,
  privilege: any,
  device: DeviceOptions,
  onEdit: Function,
  setDialog: Function
): any => {
  let action = (
    <div style={{ float: 'right' }}>
      {device === 'mobile' ? (
        <MenuDialog label={<ViewButton />}>
          {privilege?.subject?.update && <MenuItem
            component='div'
            onClick={() => onEdit(id)}
          >
            Edit
          </MenuItem>}
          {privilege?.subject?.delete && <MenuItem
            component='div'
            onClick={() => setDialog({ open: true, id })}
          >
            Delete
          </MenuItem>}
        </MenuDialog>
      ) : (
        <>
          {privilege?.subject?.update && (
            <UpdateButton
              onClick={() => onEdit(id)}
            />
          )}
          {privilege?.subject?.delete && (
            <DeleteButton onClick={() => setDialog({ open: true, id })} />
          )}
        </>
      )}
    </div>
  )

  return { id, name, teacher, passScore, fullScore, description, createdBy, action: action }
}