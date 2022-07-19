import AdminBreadcrumbs from '../components/Breadcrumbs'
import Container from 'components/shared/Container'
import { initState } from './constant'
import { ClassForm } from './Form'

export const CreateClass = () => {
  const Header = () => {
    return (
      <>
        <AdminBreadcrumbs page='classCreate' />
      </>
    )
  }

  return (
    <Container header={<Header />}>
      <ClassForm defaultValues={initState} />
    </Container>
  )
}
