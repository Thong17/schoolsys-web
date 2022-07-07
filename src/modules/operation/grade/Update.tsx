import AdminBreadcrumbs from '../components/Breadcrumbs'
import Container from 'components/shared/Container'
import { GradeForm } from './Form'
import { useParams } from 'react-router-dom'
import { getGrade, selectGrade } from './redux'
import { useAppSelector, useAppDispatch } from 'app/hooks'
import { useEffect } from 'react'

const Header = () => {
  return (
    <>
      <AdminBreadcrumbs page='gradeUpdate' />
    </>
  )
}

export const UpdateGrade = () => {
  const dispatch = useAppDispatch()
  const { data: defaultValues, status } = useAppSelector(selectGrade)  
  const { id } = useParams()
  
  useEffect(() => {
    if (id) {
      dispatch(getGrade({ id, query: {}, fields: ['firstName', 'lastName', 'gender', 'birthDate', 'email', 'contact', 'profile', 'address'] }))
    }
  }, [dispatch, id])

  return (
    <Container header={<Header />}>
      {
        status === 'SUCCESS' && <GradeForm id={id} defaultValues={defaultValues} />
      }
    </Container>
  )
}
