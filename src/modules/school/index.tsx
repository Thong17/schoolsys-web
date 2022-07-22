import { Layout } from 'components/layouts/Layout'
import Navbar from './components/Navbar'
import { useOutlet } from 'react-router'
import Container from 'components/shared/Container'
import AdminBreadcrumbs from './components/Breadcrumbs'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import { DetailSection } from 'components/shared/container/DetailSection'
import SecurityRoundedIcon from '@mui/icons-material/SecurityRounded'
import AdminPanelSettingsRoundedIcon from '@mui/icons-material/AdminPanelSettingsRounded'
import useTheme from 'hooks/useTheme'
import { TextEllipsis } from 'components/shared/TextEllipsis'
import useWeb from 'hooks/useWeb'
import { CustomPieChart } from 'components/shared/charts/PieChart'
import { useEffect, useState } from 'react'
import { getSchoolDashboard, selectSchoolDashboard } from 'shared/redux'
import useLanguage from 'hooks/useLanguage'
import { useLocation } from 'react-router-dom'

const Header = () => {
  return (
    <>
      <AdminBreadcrumbs page='school' />
    </>
  )
}

export const School = () => {
  const outlet = useOutlet()
  const { theme } = useTheme()
  const { device } = useWeb()
  const { lang } = useLanguage()
  const [roles, setRoles] = useState([])
  const [users, setUsers] = useState([])
  const dispatch = useAppDispatch()
  const location = useLocation()
  const { data: dashboard } = useAppSelector(selectSchoolDashboard)

  useEffect(() => {
    const mappedRole = dashboard?.roles?.map((role) => {
      return {
        name: role.name?.[lang],
        value: role.value,
        title: role.title,
      }
    })
    setRoles(mappedRole)

    const mappedUser = dashboard?.users?.map((role) => {
      return {
        name: role.name?.[lang],
        value: role.value,
        title: role.title,
      }
    })
    setUsers(mappedUser)
  }, [dashboard, lang])

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
                title='Total Role'
                data={dashboard?.roles}
                icon={<SecurityRoundedIcon style={{ fontSize: 40 }} />}
              />
              <DetailSection
                title='Total User'
                data={dashboard?.users}
                icon={<AdminPanelSettingsRoundedIcon style={{ fontSize: 40 }} />}
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
                Role Privilege
              </TextEllipsis>
              <CustomPieChart
                data={roles}
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
                User Privilege
              </TextEllipsis>
              <CustomPieChart
                data={users}
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


