import AdminBreadcrumbs from '../components/Breadcrumbs'
import Container from 'components/shared/Container'
import { StudentForm } from './Form'
import { useParams } from 'react-router-dom'
import { getStudent, selectStudent } from './redux'
import { useAppSelector, useAppDispatch } from 'app/hooks'
import { useEffect } from 'react'

const Header = () => {
  return (
    <>
      <AdminBreadcrumbs page='studentUpdate' />
    </>
  )
}

export const UpdateStudent = () => {
  const dispatch = useAppDispatch()
  const { data: defaultValues, status } = useAppSelector(selectStudent)
  const { id } = useParams()
  
  useEffect(() => {
    if (id) {
      dispatch(getStudent({ id, fields: ['firstName', 'lastName', 'gender', 'birthDate', 'email', 'contact', 'profile', 'address'] }))
    }
  }, [dispatch, id])

  return (
    <Container header={<Header />}>
      {
        status === 'SUCCESS' && <StudentForm id={id} defaultValues={defaultValues} />
      }
    </Container>
  )
}
