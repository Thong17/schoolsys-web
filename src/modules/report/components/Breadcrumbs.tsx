import Breadcrumb from 'components/shared/Breadcrumbs'
import { FC } from 'react'
import { IBreadcrumbs } from 'constants/interfaces/Breadcrumbs'
import BarChartRoundedIcon from '@mui/icons-material/BarChartRounded'

const stages = {
  schoolReport: [
    {
      title: 'School Report',
    },
  ],
  attendanceReport: [
    {
      title: 'Attendance Report',
    },
  ],
}
declare type page = 'schoolReport' | 'attendanceReport'

const ReportBreadcrumbs: FC<IBreadcrumbs<page>> = ({ page }) => {
  return <Breadcrumb stages={stages[page]} title={<BarChartRoundedIcon />} />
}

export default ReportBreadcrumbs
