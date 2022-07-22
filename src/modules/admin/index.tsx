import { Layout } from 'components/layouts/Layout'
import AdminNavbar from './components/AdminNavbar'
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
import { getAdminDashboard, selectAdminDashboard } from 'shared/redux'
import useLanguage from 'hooks/useLanguage'
import { useLocation } from 'react-router-dom'

const Header = () => {
  return (
    <>
      <AdminBreadcrumbs page='admin' title='Dashboard' />
    </>
  )
}

export const Admin = () => {
  const outlet = useOutlet()
  const { theme } = useTheme()
  const { device } = useWeb()
  const { lang } = useLanguage()
  const [totalRole, setTotalRole] = useState(0)
  const [totalUser, setTotalUser] = useState(0)
  const [roles, setRoles] = useState([])
  const [users, setUsers] = useState([])
  const dispatch = useAppDispatch()
  const location = useLocation()
  const { data: dashboard } = useAppSelector(selectAdminDashboard)
  
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
    setTotalRole(dashboard?.totalRole)
    setTotalUser(dashboard?.totalUser)
  }, [dashboard, lang])


  useEffect(() => {
    if (location.pathname !== '/admin') return
    dispatch(getAdminDashboard())
  }, [dispatch, location.pathname])
  
  return (
    <Layout navbar={<AdminNavbar />}>
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
                data={totalRole}
                icon={<SecurityRoundedIcon style={{ fontSize: 40 }} />}
              />
              <DetailSection
                title='Total User'
                data={totalUser}
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

export { Users, CreateUser, UpdateUser, DetailUser } from './user'
export { Roles, CreateRole, UpdateRole, DetailRole } from './role'
