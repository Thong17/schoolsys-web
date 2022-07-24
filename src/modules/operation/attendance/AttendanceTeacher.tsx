import Breadcrumb from 'components/shared/Breadcrumbs'
import FactCheckRoundedIcon from '@mui/icons-material/FactCheckRounded'
import Container from 'components/shared/Container'
import { useParams } from 'react-router-dom'
import useLanguage from 'hooks/useLanguage'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import { getClass, selectClass } from 'modules/school/class/redux'
import { useEffect } from 'react'
import { getUserAttendance, selectUserAttendance } from './redux'

const Header = ({ stages }) => {
  return (
    <>
      <Breadcrumb stages={stages} title={<FactCheckRoundedIcon />} />
    </>
  )
}

export const AttendanceTeacher = () => {
  const { classId, userId } = useParams()
  const dispatch = useAppDispatch()
  const { lang } = useLanguage()
  const { data: _class } = useAppSelector(selectClass)
  const { data } = useAppSelector(selectUserAttendance)

  console.log(data);
  
  useEffect(() => {
    if (!classId) return
    dispatch(getClass({ id: classId }))
  }, [dispatch, classId])

  useEffect(() => {
    if (!userId || !classId) return
    const query = new URLSearchParams()
    query.append('classId', classId)
    query.append('type', 'teacher')
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
      title: 'User',
    },
  ]

  return <Container header={<Header stages={stages} />}>
    <div>{userId}</div>
  </Container>
}
