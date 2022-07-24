import { Layout } from 'components/layouts/Layout'
import Container from 'components/shared/Container'
import ReportNavbar from './components/ReportNavbar'
import ReportBreadcrumbs from './components/Breadcrumbs'
import { ChartContainer } from 'components/shared/container/ChartContainer'
import { CustomAreaChart } from 'components/shared/charts/AreaChart'

const Header = () => {
  return (
    <>
      <ReportBreadcrumbs page='attendanceReport' />
    </>
  )
}

export const AttendanceReport = () => {
  return (
    <Layout navbar={<ReportNavbar />}>
      <Container header={<Header />}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gridColumnGap: 20,
            gridTemplateAreas: ` 
                'header header' 
                'charts charts'
              `,
          }}
        >
          <ChartContainer
            title={<>Charts</>}
            style={{ gridArea: 'charts' }}
          >
            <CustomAreaChart />
          </ChartContainer>
        </div>
      </Container>
    </Layout>
  )
}
