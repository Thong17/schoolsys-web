import { Layout } from 'components/layouts/Layout'
import { useOutlet } from 'react-router'
import Container from 'components/shared/Container'
import StoreNavbar from './components/StoreNavbar'
import StoreBreadcrumbs from './components/Breadcrumbs'

export const Store = () => {
  const outlet = useOutlet()

  const Header = () => {
    return (
      <>
        <StoreBreadcrumbs page='store' />
      </>
    )
  }

  return (
    <Layout navbar={<StoreNavbar />}>
      {outlet || <Container header={<Header />}>Store Updated</Container>}
    </Layout>
  )
}

export { Brands, CreateBrand, DetailBrand, UpdateBrand  } from './brand'
export { Categories, CreateCategory, DetailCategory, UpdateCategory  } from './category'
export { Products, CreateProduct, DetailProduct, UpdateProduct, ProductSetup  } from './product'
