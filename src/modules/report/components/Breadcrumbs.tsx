import Breadcrumb from 'components/shared/Breadcrumbs'
import { FC } from 'react'
import { IBreadcrumbs } from 'constants/interfaces/Breadcrumbs'
import BarChartRoundedIcon from '@mui/icons-material/BarChartRounded'

const stages = {
  report: [
    {
      title: 'Report',
    },
  ],
}
declare type page = 'report'

const ReportBreadcrumbs: FC<IBreadcrumbs<page>> = ({ page }) => {
  return <Breadcrumb stages={stages[page]} title={<BarChartRoundedIcon />} />
}

export default ReportBreadcrumbs
