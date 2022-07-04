import AdminBreadcrumbs from '../components/Breadcrumbs'
import Container from 'components/shared/Container'
import { initState } from './constant'
import { StudentForm } from './Form'

export const CreateStudent = () => {
  const Header = () => {
    return (
      <>
        <AdminBreadcrumbs page='studentCreate' />
      </>
    )
  }

  return (
    <Container header={<Header />}>
      <StudentForm defaultValues={initState} />
    </Container>
  )
}
