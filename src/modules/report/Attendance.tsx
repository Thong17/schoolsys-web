import { Layout } from 'components/layouts/Layout'
import Container from 'components/shared/Container'
import ReportNavbar from './components/ReportNavbar'
import ReportBreadcrumbs from './components/Breadcrumbs'

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

      </Container>
    </Layout>
  )
}
