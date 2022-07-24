import Breadcrumb from 'components/shared/Breadcrumbs'
import FactCheckRoundedIcon from '@mui/icons-material/FactCheckRounded'
import Container from 'components/shared/Container'
import { useParams } from 'react-router-dom'
import useLanguage from 'hooks/useLanguage'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import { getClass, selectClass } from 'modules/school/class/redux'
import { useEffect } from 'react'
import { getUserAttendance, selectUserAttendance } from './redux'
import { DetailContainer } from 'components/shared/container/DetailContainer'
import { DetailTitle } from 'components/shared/container/DetailTitle'
import { FillBarChart } from 'components/shared/charts/FillBarChart'
import useTheme from 'hooks/useTheme'
import { calculatePercentage } from 'utils'

const Header = ({ stages }) => {
  return (
    <>
      <Breadcrumb stages={stages} title={<FactCheckRoundedIcon />} />
    </>
  )
}

export const AttendanceStudent = () => {
  const { theme } = useTheme()
  const { classId, userId } = useParams()
  const dispatch = useAppDispatch()
  const { lang } = useLanguage()
  const { data: _class } = useAppSelector(selectClass)
  const { data: { attendances, user, totalAL, totalSL, totalAb, totalPresent } } = useAppSelector(selectUserAttendance)

  console.log(attendances, user);
  
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
  }, [dispatch, userId, classId])
  
  const stages = [
    {
      title: 'Operation',
      path: '/operation',
    },
    {
      title: 'Attendance',
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

  return <Container header={<Header stages={stages} />}>
    <DetailContainer username={`${user?.lastName} ${user?.firstName}`} profile={user?.profile?.filename} position='Student' id={user?.ref}>
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <DetailTitle title='Total Present' value={totalPresent} />
        <DetailTitle title='Annual Leave' value={totalAL} />
        <DetailTitle title='Sick Leave' value={totalSL} />
        <DetailTitle title='Absent' value={totalAb} />
      </div>
      <div style={{ marginTop: 10 }}>
        <FillBarChart percent={`${calculatePercentage(totalAL, 10)}%`} color={`${theme.color.info}ee`} title='Annual Leave' />
        <FillBarChart percent={`${calculatePercentage(totalSL, 10)}%`} color={`${theme.color.warning}aa`} title='Sick Leave' />
        <FillBarChart percent={`${calculatePercentage(totalAb, 5)}%`} color={`${theme.color.error}dd`} title='Absent' limit={5} />
      </div>
    </DetailContainer>
  </Container>
}
