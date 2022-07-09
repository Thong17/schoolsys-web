import AdminBreadcrumbs from '../components/Breadcrumbs'
import Container from 'components/shared/Container'
import { initState } from './constant'
import { GradeForm } from './Form'

export const CreateGrade = () => {
  const Header = () => {
    return (
      <>
        <AdminBreadcrumbs page='gradeCreate' />
      </>
    )
  }

  return (
    <Container header={<Header />}>
      <GradeForm defaultValues={initState} />
    </Container>
  )
}
