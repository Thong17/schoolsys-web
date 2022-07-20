import Breadcrumb from 'components/shared/Breadcrumbs'
import FactCheckRoundedIcon from '@mui/icons-material/FactCheckRounded'
import { FC } from 'react'
import { stages } from './constant'

declare type page = 'operation' | 'class' | 'attendance'
 
interface IAdminBreadcrumbs {
  page: page
}

const AdminBreadcrumbs: FC<IAdminBreadcrumbs> = ({ page }) => {
  return <Breadcrumb stages={stages[page]} title={<FactCheckRoundedIcon />} />
}

export default AdminBreadcrumbs
