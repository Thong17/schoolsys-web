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
  name: {},
  level: '',
  description: '',
}

export const mapGradeBody = (body): IGradeBody => {
  return { name: body?.name, level: body?.level, description: body?.description }
}

export const initSubject = {
  name: {},
  teacher: '',
  passScore: 0,
  fullScore: 0,
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
  { id: 'subjects', label: 'Subject' },
  { id: 'description', label: 'Description' },
  { id: 'action', label: 'Remove' },
]

export const columnData: ITableColumn<ColumnHeader>[] = [
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
        privilege?.grade?.detail && (
          <MenuDialog label={<ViewButton />}>
            <MenuList
              component='div'
              onClick={() => onEdit(id)}
            >
              Edit
            </MenuList>
            <MenuList
              component='div'
              onClick={() => setDialog({ open: true, id })}
            >
              Delete
            </MenuList>
          </MenuDialog>
        )
      ) : (
        <>
          {privilege?.grade?.update && (
            <UpdateButton
              onClick={() => onEdit(id)}
            />
          )}
          {privilege?.grade?.delete && (
            <DeleteButton onClick={() => setDialog({ open: true, id })} />
          )}
        </>
      )}
    </div>
  )

  return { id, name, teacher, passScore, fullScore, description, createdBy, action: action }
}