import Breadcrumb from 'components/shared/Breadcrumbs'
import HomeWorkRoundedIcon from '@mui/icons-material/HomeWorkRounded'
import { useParams } from 'react-router-dom'
import Container from 'components/shared/Container'
import { FamilyForm } from './form/FamilyForm'
import { ApplicationForm } from './form/ApplicationForm'
import { HealthForm } from './form/HealthForm'
import { ReactElement, useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import { getStudent, selectStudent } from './redux'

const Header = ({ stages }) => {
  return <Breadcrumb stages={stages} title={<HomeWorkRoundedIcon />} />
}

export const DetailFormStudent = () => {
  const { id, detail, action } = useParams()
  const [form, setForm] = useState<ReactElement | null>(null)
  const [breadcrumb, setBreadcrumb] = useState<any[]>([])
  const dispatch = useAppDispatch()
  const { data } = useAppSelector(selectStudent)

  const actionLink = action === 'create'
    ? '/school/student/create'
    : `/school/student/update/${id}`

  const detailLink = action === 'create'
    ? `/school/student/create/${id}`
    : `/school/student/update/${id}`

  useEffect(() => {
    if (!id) return
    dispatch(getStudent({ id }))
  }, [id, dispatch])

  useEffect(() => {
    switch (detail) {
      case 'family':
        setForm(<FamilyForm studentId={id} defaultValues={data?.family} />)
        setBreadcrumb([
          {
            title: 'Family'
          },
          {
            title: 'Health',
            path: `${detailLink}/health`,
          },
          {
            title: 'Application',
            path: `${detailLink}/application`,
          },
        ])
        break
      case 'application':
        setForm(<ApplicationForm studentId={id} defaultValues={data?.application} />)
        setBreadcrumb([
          {
            title: 'Family',
            path: `${detailLink}/family`,
          },
          {
            title: 'Health',
            path: `${detailLink}/health`,
          },
          {
            title: 'Application',
          },
        ])
        break
      case 'health':
        setForm(<HealthForm studentId={id} defaultValues={data?.health} />)
        setBreadcrumb([
          {
            title: 'Family',
            path: `${detailLink}/family`,
          },
          {
            title: 'Health',
          },
          {
            title: 'Application',
            path: `${detailLink}/application`,
          },
        ])
        break
    
      default:
        break
    }
  }, [detail, detailLink, data, id])

  if (action !== 'create' && action !== 'update') return <>Not found</>
  if (detail !== 'family' && detail !== 'application' && detail !== 'health') return <>Not found</>

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
      title: action === 'create' ? 'Create' : 'Update',
      path: actionLink,
    },
    ...breadcrumb
  ]

  return (
    <Container header={<Header stages={stages}/>}>
      {form}
    </Container>
  )
}
