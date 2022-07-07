import AdminBreadcrumbs from '../components/Breadcrumbs'
import Container from 'components/shared/Container'
import { AttendanceForm } from './Form'
import { useParams } from 'react-router-dom'
import { getAttendance, selectAttendance } from './redux'
import { useAppSelector, useAppDispatch } from 'app/hooks'
import { useEffect } from 'react'

const Header = () => {
  return (
    <>
      <AdminBreadcrumbs page='attendanceUpdate' />
    </>
  )
}

export const UpdateAttendance = () => {
  const dispatch = useAppDispatch()
  const { data: defaultValues, status } = useAppSelector(selectAttendance)
  const { id } = useParams()
  
  useEffect(() => {
    if (id) {
      dispatch(getAttendance({ id, fields: ['firstName', 'lastName', 'gender', 'birthDate', 'email', 'contact', 'profile', 'address'] }))
    }
  }, [dispatch, id])

  return (
    <Container header={<Header />}>
      {
        status === 'SUCCESS' && <AttendanceForm id={id} defaultValues={defaultValues} />
      }
    </Container>
  )
}
