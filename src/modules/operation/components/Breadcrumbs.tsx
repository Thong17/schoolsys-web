import Breadcrumb from 'components/shared/Breadcrumbs'
import HomeWorkRoundedIcon from '@mui/icons-material/HomeWorkRounded'
import { FC } from 'react'
import { stages } from './constant'

declare type page = 'operation' | 'attendance' | 'attendanceCheck' | 'attendanceUpdate'

interface IAdminBreadcrumbs {
  page: page
}

const AdminBreadcrumbs: FC<IAdminBreadcrumbs> = ({ page }) => {
  return <Breadcrumb stages={stages[page]} title={<HomeWorkRoundedIcon />} />
}

export default AdminBreadcrumbs
