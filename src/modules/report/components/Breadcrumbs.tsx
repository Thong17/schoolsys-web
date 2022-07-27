import Breadcrumb from 'components/shared/Breadcrumbs'
import { FC } from 'react'
import { IBreadcrumbs } from 'constants/interfaces/Breadcrumbs'
import BarChartRoundedIcon from '@mui/icons-material/BarChartRounded'
import useLanguage from 'hooks/useLanguage'

declare type page = 'schoolReport' | 'attendanceReport'

const ReportBreadcrumbs: FC<IBreadcrumbs<page>> = ({ page }) => {
  const { language } = useLanguage()
  const stages = {
    schoolReport: [
      {
        title: language['SCHOOL_REPORT'],
      },
    ],
    attendanceReport: [
      {
        title: language['ATTENDANCE_REPORT'],
      },
    ],
  }
  return <Breadcrumb stages={stages[page]} title={<BarChartRoundedIcon />} />
}

export default ReportBreadcrumbs
