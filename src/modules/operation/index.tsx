import { Layout } from 'components/layouts/Layout'
import Navbar from './components/Navbar'
import { useOutlet } from 'react-router'
import Container from 'components/shared/Container'
import AdminBreadcrumbs from './components/Breadcrumbs'

export const Operation = () => {
  const outlet = useOutlet()

  const Header = () => {
    return (
      <>
        <AdminBreadcrumbs page='operation' />
      </>
    )
  }

  return (
    <Layout navbar={<Navbar />}>
      {outlet || <Container header={<Header />}>Operation Updated</Container>}
    </Layout>
  )
}

export { Attendances, CreateAttendance, UpdateAttendance, DetailAttendance } from './attendance'

