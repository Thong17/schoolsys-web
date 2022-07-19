import Breadcrumb from 'components/shared/Breadcrumbs'
import HomeWorkRoundedIcon from '@mui/icons-material/HomeWorkRounded'
import Container from 'components/shared/Container'
import { ClassForm } from './Form'
import { useParams } from 'react-router-dom'
import { getClass, selectClass } from './redux'
import { useAppSelector, useAppDispatch } from 'app/hooks'
import { useEffect } from 'react'

const Header = ({ stages }) => {
  return (
    <>
      <Breadcrumb stages={stages} title={<HomeWorkRoundedIcon />} />
    </>
  )
}

export const UpdateClass = () => {
  const dispatch = useAppDispatch()
  const { data: defaultValues, status } = useAppSelector(selectClass)  
  const { id } = useParams()

  const stages = [
    {
      title: 'School',
      path: '/school',
    },
    {
      title: 'Class',
      path: '/school/class',
    },
    {
      title: 'Update',
    },
    {
      title: 'Student',
      path: `/school/class/update/${id}/student`,
    },
  ]
  
  useEffect(() => {
    if (id) {
      dispatch(getClass({ id, query: {}, fields: ['name', 'room', 'schedule', 'grade', 'description', 'teacher', 'monitor', 'students'] }))
    }
  }, [dispatch, id])

  return (
    <Container header={<Header stages={stages} />}>
      {
        status === 'SUCCESS' && <ClassForm id={id} defaultValues={defaultValues} />
      }
    </Container>
  )
}
