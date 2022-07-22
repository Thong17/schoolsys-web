import { Layout } from 'components/layouts/Layout'
import Navbar from './components/Navbar'
import { useOutlet } from 'react-router'
import Container from 'components/shared/Container'
import AdminBreadcrumbs from './components/Breadcrumbs'
import { CustomPieChart } from 'components/shared/charts/PieChart'
import useTheme from 'hooks/useTheme'
import { DetailSection } from 'components/shared/container/DetailSection'
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded'
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded'
import HotelRoundedIcon from '@mui/icons-material/HotelRounded'
import WrongLocationRoundedIcon from '@mui/icons-material/WrongLocationRounded'
import SailingRoundedIcon from '@mui/icons-material/SailingRounded'
import { dateFormat } from 'utils'
import { TextEllipsis } from 'components/shared/TextEllipsis'
import useWeb from 'hooks/useWeb'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import { getOperationDashboard, selectOperationDashboard } from 'shared/redux'
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import useLanguage from 'hooks/useLanguage'

const Header = () => {
  return (
    <>
      <AdminBreadcrumbs page='operation' />
    </>
  )
}

export const Operation = () => {
  const outlet = useOutlet()
  const { lang } = useLanguage()
  const { theme } = useTheme()
  const { device } = useWeb()
  const location = useLocation()
  const dispatch = useAppDispatch()
  const { data: dashboard } = useAppSelector(selectOperationDashboard)
  const [checkedIn, setCheckedIn] = useState([])
  const [checkedOut, setCheckedOut] = useState([])

  useEffect(() => {
    const mappedCheckedIn = dashboard?.checkedIn?.map(chkIn => {
      const totalCheckedIn = chkIn.checkedIn
      return {
        name: chkIn.name?.[lang],
        value: chkIn.value,
        title: chkIn.title,
        detail: `${totalCheckedIn} Checked In`,
        fill: totalCheckedIn === chkIn.value ? theme.color.success : totalCheckedIn > 0 ? theme.color.info : theme.text.quaternary
      }
    })
    const mappedCheckedOut = dashboard?.checkedOut?.map(chkOut => {
      const totalCheckedOut = chkOut.checkedOut
      return {
        name: chkOut.name?.[lang],
        value: chkOut.value,
        title: chkOut.title,
        detail: `${totalCheckedOut} Checked Out`,
        fill: totalCheckedOut === chkOut.value ? theme.color.success : totalCheckedOut > 0 ? theme.color.info : theme.text.quaternary
      }
    })
    setCheckedOut(mappedCheckedOut)
    setCheckedIn(mappedCheckedIn)
  }, [dashboard, lang, theme])
  

  useEffect(() => {
    if (location.pathname !== '/operation') return
    dispatch(getOperationDashboard())
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
                'student teacher'
              `,
            }}
          >
            <div style={{ gridArea: 'header', display: 'flex', alignItems: 'center', gap: 20, overflowX: 'auto', padding: 20 }}>
              <DetailSection title='Total Student' data={dashboard?.students} icon={<GroupsRoundedIcon style={{ fontSize: 40 }} />} />
              <DetailSection title='Attendance' data={dashboard?.attendances} icon={<PeopleRoundedIcon style={{ fontSize: 40 }} />} />
              <DetailSection title='Absent' data={dashboard?.absent} icon={<WrongLocationRoundedIcon style={{ fontSize: 40 }} />} />
              <DetailSection title='Annual Leave' data={dashboard?.annualLeave} icon={<SailingRoundedIcon style={{ fontSize: 40 }} />} />
              <DetailSection title='Sick Leave' data={dashboard?.sickLeave} icon={<HotelRoundedIcon style={{ fontSize: 40 }} />} />
            </div>
            <div
              style={{
                background: theme.background.secondary,
                width: '100%',
                borderRadius: theme.radius.secondary,
                gridArea: 'student',
                position: 'relative',
                display: 'flex',
                justifyContent: 'center',
                boxShadow: theme.shadow.container,
                paddingTop: 20
              }}
            >
              <TextEllipsis style={{ textAlign: 'center', position: 'absolute', top: 15, width: '100%', fontSize: theme.responsive[device]?.text.h3 }}>Checked In: <span style={{ color: theme.text.tertiary }}>{dateFormat()}</span></TextEllipsis>
              <CustomPieChart
                data={checkedIn}
                fill={'#7B7D7D'}
                color={theme.text.secondary}
              />
            </div>
            <div
              style={{
                background: theme.background.secondary,
                width: '100%',
                borderRadius: theme.radius.secondary,
                gridArea: 'teacher',
                position: 'relative',
                display: 'flex',
                justifyContent: 'center',
                boxShadow: theme.shadow.container,
                paddingTop: 20
              }}
            >
              <TextEllipsis style={{ textAlign: 'center', position: 'absolute', top: 15, width: '100%', fontSize: theme.responsive[device]?.text.h3 }}>Checked Out: <span style={{ color: theme.text.tertiary }}>{dateFormat()}</span></TextEllipsis>
              <CustomPieChart
                data={checkedOut}
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

export { Classes, Attendances } from './attendance'
