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
import SailingRoundedIcon from '@mui/icons-material/SailingRounded'
import { dateFormat } from 'utils'
import { TextEllipsis } from 'components/shared/TextEllipsis'
import useWeb from 'hooks/useWeb'

const data = [
  { name: 'Group A', value: 400, title: 'Student' },
  { name: 'Group B', value: 300, title: 'Student' },
  { name: 'Group C', value: 300, title: 'Student' },
  { name: 'Group D', value: 200, title: 'Student' },
  { name: 'Group E', value: 200, title: 'Student' },
]

export const Operation = () => {
  const outlet = useOutlet()
  const { theme } = useTheme()
  const { device } = useWeb()

  const Header = () => {
    return (
      <>
        <AdminBreadcrumbs page='operation' />
      </>
    )
  }

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
              <DetailSection title='Total Student' data={300} icon={<GroupsRoundedIcon style={{ fontSize: 40 }} />} />
              <DetailSection title='Total Teacher' data={30} icon={<PeopleRoundedIcon style={{ fontSize: 40 }} />} />
              <DetailSection title='Attendance' data={30} icon={<PeopleRoundedIcon style={{ fontSize: 40 }} />} />
              <DetailSection title='Annual Leave' data={30} icon={<SailingRoundedIcon style={{ fontSize: 40 }} />} />
              <DetailSection title='Sick Leave' data={30} icon={<HotelRoundedIcon style={{ fontSize: 40 }} />} />
            </div>
            <div
              style={{
                backgroundColor: theme.background.secondary,
                width: '100%',
                borderRadius: theme.radius.secondary,
                gridArea: 'student',
                position: 'relative',
                display: 'flex',
                justifyContent: 'center',
                boxShadow: theme.shadow.container
              }}
            >
              <TextEllipsis style={{ textAlign: 'center', position: 'absolute', top: 15, width: '100%', fontSize: theme.responsive[device]?.text.h3 }}>Checked In: <span style={{ color: theme.text.tertiary }}>{dateFormat()}</span></TextEllipsis>
              <CustomPieChart
                data={data}
                fill={`${theme.color.info}77`}
                color={theme.text.secondary}
              />
            </div>
            <div
              style={{
                backgroundColor: theme.background.secondary,
                width: '100%',
                borderRadius: theme.radius.secondary,
                gridArea: 'teacher',
                position: 'relative',
                display: 'flex',
                justifyContent: 'center',
                boxShadow: theme.shadow.container
              }}
            >
              <TextEllipsis style={{ textAlign: 'center', position: 'absolute', top: 15, width: '100%', fontSize: theme.responsive[device]?.text.h3 }}>Checked Out: <span style={{ color: theme.text.tertiary }}>{dateFormat()}</span></TextEllipsis>
              <CustomPieChart
                data={data}
                fill={`${theme.color.error}88`}
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
