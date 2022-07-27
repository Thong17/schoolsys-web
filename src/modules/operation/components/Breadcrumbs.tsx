import Breadcrumb from 'components/shared/Breadcrumbs'
import FactCheckRoundedIcon from '@mui/icons-material/FactCheckRounded'
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
        title: language['OPERATION'],
      },
    ],
    class: [
      {
        title: language['OPERATION'],
        path: '/operation',
      },
      {
        title: language['CLASS'],
      },
    ]
  }
  return <Breadcrumb stages={stages[page]} title={<FactCheckRoundedIcon />} />
}

export default AdminBreadcrumbs
