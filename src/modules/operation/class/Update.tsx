import AdminBreadcrumbs from '../components/Breadcrumbs'
import Container from 'components/shared/Container'
import { ClassForm } from './Form'
import { useParams } from 'react-router-dom'
import { getClass, selectClass } from './redux'
import { useAppSelector, useAppDispatch } from 'app/hooks'
import { useEffect } from 'react'

const Header = () => {
  return (
    <>
      <AdminBreadcrumbs page='classUpdate' />
    </>
  )
}

export const UpdateClass = () => {
  const dispatch = useAppDispatch()
  const { data: defaultValues, status } = useAppSelector(selectClass)  
  const { id } = useParams()
  
  useEffect(() => {
    if (id) {
      dispatch(getClass({ id, query: {}, fields: ['firstName', 'lastName', 'gender', 'birthDate', 'email', 'contact', 'profile', 'address'] }))
    }
  }, [dispatch, id])

  return (
    <Container header={<Header />}>
      {
        status === 'SUCCESS' && <ClassForm id={id} defaultValues={defaultValues} />
      }
    </Container>
  )
}
