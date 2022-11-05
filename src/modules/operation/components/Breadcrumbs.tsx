import Breadcrumb from 'components/shared/Breadcrumbs'
import HomeWorkRoundedIcon from '@mui/icons-material/HomeWorkRounded'
import { FC } from 'react'
import useLanguage from 'hooks/useLanguage'

declare type page = 'operation' | 'class' | 'attendance'

interface IAdminBreadcrumbs {
  page: page
}

const AdminBreadcrumbs: FC<IAdminBreadcrumbs> = ({ page }) => {
  const { language } = useLanguage()
  const stages = {
    operation: [
      {
        title: language['SCHOOL'],
      },
    ],
    class: [
      {
        title: language['SCHOOL'],
        path: '/school',
      },
      {
        title: language['CLASS'],
      },
    ]
  }
  return <Breadcrumb stages={stages[page]} title={<HomeWorkRoundedIcon />} />
}

export default AdminBreadcrumbs
