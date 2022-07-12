import AdminBreadcrumbs from '../components/Breadcrumbs'
import Container from 'components/shared/Container'
import { TeacherForm } from './Form'
import { useParams } from 'react-router-dom'
import { getTeacher, selectTeacher } from './redux'
import { useAppSelector, useAppDispatch } from 'app/hooks'
import { useEffect } from 'react'

const Header = () => {
  return (
    <>
      <AdminBreadcrumbs page='teacherUpdate' />
    </>
  )
}

export const UpdateTeacher = () => {
  const dispatch = useAppDispatch()
  const { data: defaultValues, status } = useAppSelector(selectTeacher)  
  const { id } = useParams()
  
  useEffect(() => {
    if (id) {
      dispatch(getTeacher({ id, query: {}, fields: ['firstName', 'lastName', 'gender', 'birthDate', 'email', 'contact', 'grade', 'subject', 'profile', 'address'] }))
    }
  }, [dispatch, id])

  return (
    <Container header={<Header />}>
      {
        status === 'SUCCESS' && <TeacherForm id={id} defaultValues={defaultValues} />
      }
    </Container>
  )
}
