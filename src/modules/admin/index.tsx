import { Layout } from 'components/layouts/Layout'
import AdminNavbar from './components/AdminNavbar'
import { useOutlet } from 'react-router'
import Container from 'components/shared/Container'
import AdminBreadcrumbs from './components/Breadcrumbs'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import { DetailSection } from 'components/shared/container/DetailSection'
import SecurityRoundedIcon from '@mui/icons-material/SecurityRounded'
import AdminPanelSettingsRoundedIcon from '@mui/icons-material/AdminPanelSettingsRounded'
import LocalPoliceRoundedIcon from '@mui/icons-material/LocalPoliceRounded'
import useTheme from 'hooks/useTheme'
import { CustomPieChart } from 'components/shared/charts/PieChart'
import { useEffect, useState } from 'react'
import { getAdminDashboard, selectAdminDashboard } from 'shared/redux'
import useLanguage from 'hooks/useLanguage'
import { useLocation } from 'react-router-dom'
import { ChartContainer } from 'components/shared/container/ChartContainer'

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
  const { lang } = useLanguage()
  const [totalRole, setTotalRole] = useState(0)
  const [totalUser, setTotalUser] = useState(0)
  const [totalPrivilege, setTotalPrivilege] = useState(0)
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
        detail: `Privilege ${role.detail}`,
        fill: role.detail === role.value ? theme.color.success : theme.color.info
      }
    })
    setRoles(mappedRole)

    const mappedUser = dashboard?.users?.map((role) => {
      return {
        name: role.name?.[lang],
        value: role.value,
        title: role.title,
        detail: `Privilege ${role.detail}`
      }
    })
    setUsers(mappedUser)
    setTotalRole(dashboard?.totalRole)
    setTotalUser(dashboard?.totalUser)
    setTotalPrivilege(dashboard?.totalPrivilege)
  }, [dashboard, lang, theme])


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
              <DetailSection
                title='Total Privilege'
                data={totalPrivilege}
                icon={<LocalPoliceRoundedIcon style={{ fontSize: 40 }} />}
              />
            </div>
            <ChartContainer title={<>Role Privilege</>} style={{ gridArea: 'role' }}>
              <CustomPieChart
                data={roles}
                fill={'#7B7D7D'}
                color={theme.text.secondary}
              />
            </ChartContainer>
            <ChartContainer title={<>User Privilege</>} style={{ gridArea: 'user' }}>
              <CustomPieChart
                data={users}
                fill={'#7B7D7D'}
                color={theme.text.secondary}
              />
            </ChartContainer>
          </div>
        </Container>
      )}
    </Layout>
  )
}

export { Users, CreateUser, UpdateUser, DetailUser } from './user'
export { Roles, CreateRole, UpdateRole, DetailRole } from './role'
