import AdminBreadcrumbs from '../components/Breadcrumbs'
import Container from 'components/shared/Container'
import { initState } from './constant'
import { AttendanceForm } from './Form'

export const CreateAttendance = () => {
  const Header = () => {
    return (
      <>
        <AdminBreadcrumbs page='attendanceCheck' />
      </>
    )
  }

  return (
    <Container header={<Header />}>
      <AttendanceForm defaultValues={initState} />
    </Container>
  )
}
