import Breadcrumb from 'components/shared/Breadcrumbs'
import HomeWorkRoundedIcon from '@mui/icons-material/HomeWorkRounded'
import { FC } from 'react'
import { stages } from './constant'

declare type page = 'school' | 'student' | 'studentCreate' | 'studentUpdate' | 'teacher' | 'teacherCreate' | 'teacherUpdate' | 'grade' | 'gradeCreate' | 'gradeUpdate' | 'class' | 'classCreate' | 'classUpdate'

interface IAdminBreadcrumbs {
  page: page
}

const AdminBreadcrumbs: FC<IAdminBreadcrumbs> = ({ page }) => {
  return <Breadcrumb stages={stages[page]} title={<HomeWorkRoundedIcon />} />
}

export default AdminBreadcrumbs
