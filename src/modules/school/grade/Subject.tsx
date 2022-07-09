import Breadcrumb from 'components/shared/Breadcrumbs'
import HomeWorkRoundedIcon from '@mui/icons-material/HomeWorkRounded'
import { useParams } from 'react-router-dom'
import Container from 'components/shared/Container'

const Header = ({ stages }) => {
  return <Breadcrumb stages={stages} title={<HomeWorkRoundedIcon />} />
}

export const SubjectGrade = () => {
  const { id, action } = useParams()

  const actionLink = action === 'create'
    ? '/school/grade/create'
    : `/school/grade/update/${id}`

  if (action !== 'create' && action !== 'update') return <>Not found</>

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
      title: action === 'create' ? 'Create' : 'Update',
      path: actionLink,
    },
    {
        title: 'Subject'
    }
  ]

  return (
    <Container header={<Header stages={stages}/>}>
        Hello
    </Container>
  )
}
