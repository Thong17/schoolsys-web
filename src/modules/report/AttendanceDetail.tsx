import Breadcrumb from 'components/shared/Breadcrumbs'
import FactCheckRoundedIcon from '@mui/icons-material/FactCheckRounded'
import { Layout } from 'components/layouts/Layout'
import Container from 'components/shared/Container'
import ReportNavbar from './components/ReportNavbar'
import { useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import { useEffect, useState } from 'react'
import { DetailContainer } from 'components/shared/container/DetailContainer'
import { DetailTitle } from 'components/shared/container/DetailTitle'
import { FillBarChart } from 'components/shared/charts/FillBarChart'
import useTheme from 'hooks/useTheme'
import { calculatePercentage, formatAttendanceDate } from 'utils'
import {
  AttendanceCalendar,
  ICalendarEvent,
} from 'components/shared/calendar/FullCalendar'
import Loading from 'components/shared/Loading'
import {
  getUserAttendance,
  selectUserAttendance,
} from 'modules/operation/attendance/redux'

const Header = ({ stages }) => {
  return (
    <>
      <Breadcrumb stages={stages} title={<FactCheckRoundedIcon />} />
    </>
  )
}

export const AttendanceDetail = () => {
  const { theme } = useTheme()
  const { userId, type } = useParams()
  const dispatch = useAppDispatch()
  const [events, setEvents] = useState<ICalendarEvent[]>([])
  const {
    data: { attendances, user, totalAL, totalSL, totalAb, totalPresent },
  } = useAppSelector(selectUserAttendance)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const mappedEvent: ICalendarEvent[] = attendances?.map((attendance) => {
      const title = attendance.permissionType || 'Present'
      return {
        title,
        start: formatAttendanceDate(attendance.checkedIn),
      }
    })
    setEvents(mappedEvent)
  }, [attendances])

  useEffect(() => {
    if (!userId || !type) return
    const query = new URLSearchParams()
    query.append('type', type)
    dispatch(getUserAttendance({ userId, query }))
    setTimeout(() => {
      setLoading(false)
    }, 300)
  }, [dispatch, userId, type])

  const stages = [
    {
      title: 'Attendance Report',
      path: '/report/attendance',
    },
    {
      title: `${user?.lastName} ${user?.firstName}`,
    },
  ]

  return (
    <Layout navbar={<ReportNavbar />}>
      <Container header={<Header stages={stages} />}>
        {!loading ? (
          <>
            <DetailContainer
              username={`${user?.lastName} ${user?.firstName}`}
              profile={user?.profile?.filename}
              position='Student'
              id={user?.ref}
            >
              <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                <DetailTitle title='Total Present' value={totalPresent} />
                <DetailTitle title='Annual Leave' value={totalAL} />
                <DetailTitle title='Sick Leave' value={totalSL} />
                <DetailTitle title='Absent' value={totalAb} />
              </div>
              <div style={{ marginTop: 10 }}>
                <FillBarChart
                  percent={`${calculatePercentage(totalAL, 10)}%`}
                  color={`${theme.color.info}ee`}
                  title='Annual Leave'
                />
                <FillBarChart
                  percent={`${calculatePercentage(totalSL, 10)}%`}
                  color={`${theme.color.warning}aa`}
                  title='Sick Leave'
                />
                <FillBarChart
                  percent={`${calculatePercentage(totalAb, 5)}%`}
                  color={`${theme.color.error}dd`}
                  title='Absent'
                  limit={5}
                />
              </div>
            </DetailContainer>
            <div>
              <AttendanceCalendar events={events} />
            </div>
          </>
        ) : (
          <Loading />
        )}
      </Container>
    </Layout>
  )
}
