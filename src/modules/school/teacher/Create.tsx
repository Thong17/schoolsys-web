import AdminBreadcrumbs from '../components/Breadcrumbs'
import Container from 'components/shared/Container'
import { initState } from './constant'
import { TeacherForm } from './Form'

export const CreateTeacher = () => {
  const Header = () => {
    return (
      <>
        <AdminBreadcrumbs page='teacherCreate' />
      </>
    )
  }

  return (
    <Container header={<Header />}>
      <TeacherForm defaultValues={initState} />
    </Container>
  )
}
