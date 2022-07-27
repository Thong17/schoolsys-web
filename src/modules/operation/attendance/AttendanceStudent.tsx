import Breadcrumb from 'components/shared/Breadcrumbs'
import FactCheckRoundedIcon from '@mui/icons-material/FactCheckRounded'
import Container from 'components/shared/Container'
import { useParams } from 'react-router-dom'
import useLanguage from 'hooks/useLanguage'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import { getClass, selectClass } from 'modules/school/class/redux'
import { useEffect, useState } from 'react'
import { getUserAttendance, selectUserAttendance } from './redux'
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

const Header = ({ stages }) => {
  return (
    <>
      <Breadcrumb stages={stages} title={<FactCheckRoundedIcon />} />
    </>
  )
}

export const AttendanceStudent = () => {
  const { language } = useLanguage()
  const { theme } = useTheme()
  const { classId, userId } = useParams()
  const dispatch = useAppDispatch()
  const { lang } = useLanguage()
  const { data: _class } = useAppSelector(selectClass)
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
    if (!classId) return
    dispatch(getClass({ id: classId }))
  }, [dispatch, classId])

  useEffect(() => {
    if (!userId || !classId) return
    const query = new URLSearchParams()
    query.append('classId', classId)
    query.append('type', 'student')
    dispatch(getUserAttendance({ userId, query }))
    setTimeout(() => {
      setLoading(false)
    }, 300)
  }, [dispatch, userId, classId])

  const stages = [
    {
      title: language['OPERATION'],
      path: '/operation',
    },
    {
      title: language['ATTENDANCE'],
      path: '/operation/attendance',
    },
    {
      title: `${_class?.name?.[lang] || _class?.name?.['English'] || '...'}`,
      path: `/operation/attendance/class/${_class._id}`,
    },
    {
      title: `${user?.lastName} ${user?.firstName}`,
    },
  ]

  return (
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
                limit={totalAL > 10 ? totalAL : 10}
              />
              <FillBarChart
                percent={`${calculatePercentage(totalSL, 10)}%`}
                color={`${theme.color.warning}aa`}
                title='Sick Leave'
                limit={totalSL > 10 ? totalSL : 10}
              />
              <FillBarChart
                percent={`${calculatePercentage(totalAb, 5)}%`}
                color={`${theme.color.error}dd`}
                title='Absent'
                limit={totalAb > 5 ? totalAb : 5}
              />
            </div>
          </DetailContainer>
          <div>
            <AttendanceCalendar events={events} />
          </div>
        </>
      ): <Loading />}
    </Container>
  )
}
