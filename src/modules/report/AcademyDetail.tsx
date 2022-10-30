import Container from 'components/shared/Container'
import ReportBreadcrumbs from './components/Breadcrumbs'

const Header = () => {
  return (
    <>
      <ReportBreadcrumbs page='academyDetail' />
    </>
  )
}

export const AcademyDetail = () => {

  return (
    <Container header={<Header />}>
      Detail
    </Container>
  )
}
