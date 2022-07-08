import { Layout } from 'components/layouts/Layout'
import Navbar from './components/Navbar'
import { useOutlet } from 'react-router'
import Container from 'components/shared/Container'
import AdminBreadcrumbs from './components/Breadcrumbs'

export const School = () => {
  const outlet = useOutlet()

  const Header = () => {
    return (
      <>
        <AdminBreadcrumbs page='school' />
      </>
    )
  }

  return (
    <Layout navbar={<Navbar />}>
      {outlet || <Container header={<Header />}>School Updated</Container>}
    </Layout>
  )
}

export { Students, CreateStudent, UpdateStudent, DetailStudent, DetailFormStudent } from './student'
export { Teachers, CreateTeacher, UpdateTeacher, DetailTeacher } from './teacher'

