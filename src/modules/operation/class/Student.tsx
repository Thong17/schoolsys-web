import Breadcrumb from 'components/shared/Breadcrumbs'
import FactCheckRoundedIcon from '@mui/icons-material/FactCheckRounded'
import { useParams } from 'react-router-dom'
import Container from 'components/shared/Container'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import { getClass, selectClass } from './redux'
import { useEffect } from 'react'
import useLanguage from 'hooks/useLanguage'

const Header = ({ stages }) => {
  return (
    <>
      <Breadcrumb stages={stages} title={<FactCheckRoundedIcon />} />
    </>
  )
}

export const StudentClass = () => {
  const { id, action } = useParams()
  const dispatch = useAppDispatch()
  const { lang } = useLanguage()
  const { data: _class } = useAppSelector(selectClass)  

  useEffect(() => {
    if (id) {
      dispatch(getClass({ id, query: {}, fields: ['name', 'room', 'schedule', 'grade', 'description', 'students'] }))
    }
  }, [dispatch, id])

  const actionLink =
    action === 'create' ? '/operation/class/create' : `/operation/class/update/${id}`

  if (action !== 'create' && action !== 'update') return <>Not found</>

  const stages = [
    {
      title: 'Operation',
      path: '/operation',
    },
    {
      title: 'Class',
      path: '/operation/class',
    },
    {
      title: action === 'create' ? 'Create' : _class?.name?.[lang] || _class?.name?.['English'],
      path: actionLink,
    },
    {
      title: 'Student',
    },
  ]

  return (
    <Container
      header={
        <Header
          stages={stages}
        />
      }
    >
    </Container>
  )
}
