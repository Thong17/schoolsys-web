import { Layout } from 'components/layouts/Layout'
import Navbar from './components/Navbar'
import { useOutlet } from 'react-router'
import Container from 'components/shared/Container'
import AdminBreadcrumbs from './components/Breadcrumbs'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import { DetailSection } from 'components/shared/container/DetailSection'
import LocalLibraryRoundedIcon from '@mui/icons-material/LocalLibraryRounded'
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded'
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded'
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded'
import HourglassBottomRoundedIcon from '@mui/icons-material/HourglassBottomRounded'
import useTheme from 'hooks/useTheme'
import { CustomPieChart } from 'components/shared/charts/PieChart'
import { useEffect, useState } from 'react'
import { getSchoolDashboard, selectSchoolDashboard } from 'shared/redux'
import useLanguage from 'hooks/useLanguage'
import { useLocation, useNavigate } from 'react-router-dom'
import ArrowRightAltRoundedIcon from '@mui/icons-material/ArrowRightAltRounded'
import { IconButton } from '@mui/material'
import { CardContainer } from 'components/shared/container/CardContainer'
import useWeb from 'hooks/useWeb'

const Header = () => {
  return (
    <>
      <AdminBreadcrumbs page='school' />
    </>
  )
}

export const School = () => {
  const outlet = useOutlet()
  const { width } = useWeb()
  const navigate = useNavigate()
  const { theme } = useTheme()
  const { lang } = useLanguage()
  const [classes, setClasses] = useState([])
  const [grades, setGrades] = useState([])
  const dispatch = useAppDispatch()
  const location = useLocation()
  const { data: dashboard } = useAppSelector(selectSchoolDashboard)

  useEffect(() => {
    const mappedClass = dashboard?.classes?.map((cl) => {
      return {
        name: cl.name,
        value: cl.value,
        title: cl.title,
        fill: cl.name === 'Closed' ? theme.color.error : theme.color.success
      }
    })
    setClasses(mappedClass)

    const mappedGrade = dashboard?.grades?.map((grade) => {
      return {
        name: grade.name?.[lang],
        value: grade.value,
        title: grade.title,
        detail: `Level ${grade.detail}`
      }
    })
    setGrades(mappedGrade)
  }, [dashboard, lang, theme])

  useEffect(() => {
    if (location.pathname !== '/school') return
    dispatch(getSchoolDashboard())
  }, [dispatch, location.pathname])
  
  return (
    <Layout navbar={<Navbar />}>
      {outlet || (
        <Container header={<Header />}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gridGap: 20,
              gridTemplateAreas: width < 1024 ? ` 
                'header header' 
                'role role'
                'user user'
              ` : ` 
                'header header' 
                'role user'
              `,
            }}
          >
            <div
              style={{
                gridArea: 'header',
                display: 'flex',
                alignItems: 'center',
                gap: 20,
                overflowX: 'auto',
                padding: 20,
              }}
            >
              <DetailSection
                title='Total Class'
                data={dashboard?.totalClass}
                icon={<LocalLibraryRoundedIcon style={{ fontSize: 40 }} />}
                action={<IconButton style={{ color: theme.text.secondary }} onClick={() => navigate('/school/class')}><ArrowRightAltRoundedIcon /></IconButton>}
              />
              <DetailSection
                title='Total Grade'
                data={dashboard?.totalGrade}
                icon={<SchoolRoundedIcon style={{ fontSize: 40 }} />}
                action={<IconButton style={{ color: theme.text.secondary }} onClick={() => navigate('/school/grade')}><ArrowRightAltRoundedIcon /></IconButton>}
              />
              <DetailSection
                title='Total Student'
                data={dashboard?.totalStudent}
                icon={<GroupsRoundedIcon style={{ fontSize: 40 }} />}
                action={<IconButton style={{ color: theme.text.secondary }} onClick={() => navigate('/school/student')}><ArrowRightAltRoundedIcon /></IconButton>}
              />
              <DetailSection
                title='Total Teacher'
                data={dashboard?.totalTeacher}
                icon={<PeopleRoundedIcon style={{ fontSize: 40 }} />}
                action={<IconButton style={{ color: theme.text.secondary }} onClick={() => navigate('/school/teacher')}><ArrowRightAltRoundedIcon /></IconButton>}
              />
              <DetailSection
                title='Pending Application'
                data={dashboard?.pendingApplication}
                icon={<HourglassBottomRoundedIcon style={{ fontSize: 40 }} />}
                action={<IconButton style={{ color: theme.text.secondary }} onClick={() => navigate('/school/class')}><ArrowRightAltRoundedIcon /></IconButton>}
              />
            </div>
            <CardContainer title={<>Class</>} style={{ gridArea: 'role' }}>
              <CustomPieChart
                data={classes}
                fill={'#7B7D7D'}
                color={theme.text.secondary}
              />
            </CardContainer>
            <CardContainer title={<>Grade</>} style={{ gridArea: 'user' }}>
              <CustomPieChart
                data={grades}
                fill={'#7B7D7D'}
                color={theme.text.secondary}
              />
            </CardContainer>
          </div>
        </Container>
      )}
    </Layout>
  )
}

export { Students, CreateStudent, UpdateStudent, DetailStudent, DetailFormStudent } from './student'
export { Teachers, CreateTeacher, UpdateTeacher, DetailTeacher } from './teacher'
export { Grades, CreateGrade, UpdateGrade, DetailGrade, SubjectGrade } from './grade'
export { Classes, CreateClass, UpdateClass, DetailClass, StudentClass } from './class'


