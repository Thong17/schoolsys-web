import { ITableColumn } from 'components/shared/table/StickyTable'
import { IconButton } from '@mui/material'
import BarChartRoundedIcon from '@mui/icons-material/BarChartRounded'
import { IThemeStyle } from 'contexts/theme/interface'

export const columnData: ITableColumn<any>[] = [
  { id: 'ref', label: 'ID' },
  { id: 'name', label: 'Name' },
  { id: 'gender', label: 'Gender' },
  { id: 'contact', label: 'Contact' },
  { id: 'action', label: 'Action', align: 'right' },
]

export const createData = (
  type: 'student' | 'teacher',
  id: string,
  ref: string,
  lastName: string,
  firstName: string,
  gender: string,
  contact: string,
  privilege: any,
  navigate: Function,
  theme: IThemeStyle
) => {
  let action = (
    <div style={{ float: 'right' }}>
      {privilege?.grade?.detail && (
        <IconButton
          onClick={() => navigate(`/report/attendance/${type}/${id}`)}
          size='small'
          style={{
            backgroundColor: `${theme.color.info}22`,
            borderRadius: theme.radius.primary,
            marginLeft: 5,
            color: theme.color.info,
          }}
        >
          <BarChartRoundedIcon fontSize='small' />
        </IconButton>
      )}
    </div>
  )

  return { id, ref, name: `${lastName} ${firstName}`, gender, contact, action: action }
}
