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
import { TextEllipsis } from 'components/shared/TextEllipsis'
import useWeb from 'hooks/useWeb'
import { CustomPieChart } from 'components/shared/charts/PieChart'
import { useEffect, useState } from 'react'
import { getSchoolDashboard, selectSchoolDashboard } from 'shared/redux'
import useLanguage from 'hooks/useLanguage'
import { useLocation, useNavigate } from 'react-router-dom'
import ArrowRightAltRoundedIcon from '@mui/icons-material/ArrowRightAltRounded'
import { IconButton } from '@mui/material'

const Header = () => {
  return (
    <>
      <AdminBreadcrumbs page='school' />
    </>
  )
}

export const School = () => {
  const outlet = useOutlet()
  const navigate = useNavigate()
  const { theme } = useTheme()
  const { device } = useWeb()
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
              gridColumnGap: 20,
              gridTemplateAreas: ` 
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
              />
              <DetailSection
                title='Total Grade'
                data={dashboard?.totalGrade}
                icon={<SchoolRoundedIcon style={{ fontSize: 40 }} />}
              />
              <DetailSection
                title='Total Student'
                data={dashboard?.totalStudent}
                icon={<GroupsRoundedIcon style={{ fontSize: 40 }} />}
              />
              <DetailSection
                title='Total Teacher'
                data={dashboard?.totalTeacher}
                icon={<PeopleRoundedIcon style={{ fontSize: 40 }} />}
              />
              <DetailSection
                title='Pending Application'
                data={dashboard?.pendingApplication}
                icon={<HourglassBottomRoundedIcon style={{ fontSize: 40 }} />}
                action={<IconButton style={{ color: theme.text.secondary }} onClick={() => navigate('/school/class')}><ArrowRightAltRoundedIcon /></IconButton>}
              />
            </div>
            <div
              style={{
                background: theme.background.secondary,
                width: '100%',
                borderRadius: theme.radius.secondary,
                gridArea: 'role',
                position: 'relative',
                display: 'flex',
                justifyContent: 'center',
                boxShadow: theme.shadow.container,
                paddingTop: 20,
              }}
            >
              <TextEllipsis
                style={{
                  textAlign: 'center',
                  position: 'absolute',
                  top: 15,
                  width: '100%',
                  fontSize: theme.responsive[device]?.text.h3,
                }}
              >
                Class
              </TextEllipsis>
              <CustomPieChart
                data={classes}
                fill={'#7B7D7D'}
                color={theme.text.secondary}
              />
            </div>
            <div
              style={{
                background: theme.background.secondary,
                width: '100%',
                borderRadius: theme.radius.secondary,
                gridArea: 'user',
                position: 'relative',
                display: 'flex',
                justifyContent: 'center',
                boxShadow: theme.shadow.container,
                paddingTop: 20,
              }}
            >
              <TextEllipsis
                style={{
                  textAlign: 'center',
                  position: 'absolute',
                  top: 15,
                  width: '100%',
                  fontSize: theme.responsive[device]?.text.h3,
                }}
              >
                Grade
              </TextEllipsis>
              <CustomPieChart
                data={grades}
                fill={'#7B7D7D'}
                color={theme.text.secondary}
              />
            </div>
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


