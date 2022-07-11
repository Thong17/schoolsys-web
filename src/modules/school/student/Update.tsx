import HomeWorkRoundedIcon from '@mui/icons-material/HomeWorkRounded'
import Container from 'components/shared/Container'
import { StudentForm } from './Form'
import { useParams } from 'react-router-dom'
import { getStudent, selectStudent } from './redux'
import { useAppSelector, useAppDispatch } from 'app/hooks'
import { useEffect } from 'react'
import Breadcrumb from 'components/shared/Breadcrumbs'

const Header = ({ stages }) => {
  return <Breadcrumb stages={stages} title={<HomeWorkRoundedIcon />} />
}

export const UpdateStudent = () => {
  const dispatch = useAppDispatch()
  const { data: defaultValues, status } = useAppSelector(selectStudent)
  const { id } = useParams()

  const stages = [
    {
      title: 'School',
      path: '/school',
    },
    {
      title: 'Student',
      path: '/school/student',
    },
    {
      title: 'Update',
    },
    {
      title: 'Family',
      path: `/school/student/update/${id}/family`,
    },
    {
      title: 'Health',
      path: `/school/student/update/${id}/health`,
    },
    {
      title: 'Application',
      path: `/school/student/update/${id}/academy`,
    },
  ]
  
  useEffect(() => {
    if (id) {
      dispatch(getStudent({ id, fields: ['firstName', 'lastName', 'gender', 'dateOfBirth', 'placeOfBirth', 'nationality', 'contact', 'profile', 'address'] }))
    }
  }, [dispatch, id])

  return (
    <Container header={<Header stages={stages} />}>
      {
        status === 'SUCCESS' && <StudentForm id={id} defaultValues={defaultValues} />
      }
    </Container>
  )
}
