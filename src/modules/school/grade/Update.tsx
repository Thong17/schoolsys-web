import Breadcrumb from 'components/shared/Breadcrumbs'
import HomeWorkRoundedIcon from '@mui/icons-material/HomeWorkRounded'
import Container from 'components/shared/Container'
import { GradeForm } from './Form'
import { useParams } from 'react-router-dom'
import { getGrade, selectGrade } from './redux'
import { useAppSelector, useAppDispatch } from 'app/hooks'
import { useEffect } from 'react'

const Header = ({ stages }) => {
  return <Breadcrumb stages={stages} title={<HomeWorkRoundedIcon />} />
}

export const UpdateGrade = () => {
  const dispatch = useAppDispatch()
  const { data: defaultValues, status } = useAppSelector(selectGrade)
  const { id } = useParams()

  const stages = [
    {
      title: 'School',
      path: '/school',
    },
    {
      title: 'Grade',
      path: '/school/grade',
    },
    {
      title: 'Update',
    },
    {
      title: 'Subject',
      path: `/school/grade/update/${id}/subject`,
    },
  ]

  useEffect(() => {
    if (id) {
      dispatch(
        getGrade({
          id,
          query: {},
          fields: [
            'name',
            'level',
            'description',
            'subjects'
          ],
        })
      )
    }
  }, [dispatch, id])

  return (
    <Container header={<Header stages={stages} />}>
      {status === 'SUCCESS' && (
        <GradeForm id={id} defaultValues={defaultValues} />
      )}
    </Container>
  )
}
