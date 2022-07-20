
import Container from 'components/shared/Container'
import { StickyTable } from 'components/shared/table/StickyTable'
import { useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import { useEffect, useState } from 'react'
import { dateFormat, debounce } from 'utils'
import { useSearchParams } from 'react-router-dom'
import { Data, createAttendanceData, attendanceColumnData } from './constant'
import { getClass, selectClass } from 'modules/school/class/redux'
import FactCheckRoundedIcon from '@mui/icons-material/FactCheckRounded'
import useLanguage from 'hooks/useLanguage'
import useAuth from 'hooks/useAuth'
import useTheme from 'hooks/useTheme'
import Breadcrumb from 'components/shared/Breadcrumbs'
import { SearchField } from 'components/shared/table/SearchField'
import { FilterButton } from 'components/shared/table/FilterButton'
import { MenuList } from '@mui/material'
import { checkInAttendance, checkOutAttendance, resetAttendance, getListAttendance, selectListAttendance } from './redux'
import { CustomButton } from 'styles'
import Axios from 'constants/functions/Axios'
import useNotify from 'hooks/useNotify'
import useAlert from 'hooks/useAlert'

const Header = ({ onSearch, stages, isCheckedIn, isCheckedOut, styled, onClick }) => {
  return <>
    <Breadcrumb stages={stages} title={<FactCheckRoundedIcon />} />
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <SearchField onChange={(e) => onSearch(e)} />
      <FilterButton style={{ marginLeft: 10 }}>
        <MenuList>Sort By Name</MenuList>
        <MenuList>Sort By Date</MenuList>
      </FilterButton>
      <CustomButton
        style={{
          marginLeft: 10,
          backgroundColor: styled.background.secondary,
          color: styled.text.secondary,
        }}
        styled={styled}
        onClick={() => onClick(isCheckedOut ? 'reset' : isCheckedIn ? 'checkOut' : 'checkIn')}
      > 
        {isCheckedOut ? 'Reset' : isCheckedIn ? 'Check Out' : 'Check In'}
      </CustomButton>
    </div>
  </>
}

export const Attendance = () => {
  const confirm = useAlert()
  const { id } = useParams()
  const { lang } = useLanguage()
  const { notify } = useNotify()
  const { user } = useAuth()
  const { theme } = useTheme()
  const dispatch = useAppDispatch()
  const [rowData, setRowData] = useState<Data[]>([])
  const { data: _class, status } = useAppSelector(selectClass)
  const { data: attendances, status: statusAttendance } = useAppSelector(selectListAttendance)
  const [queryParams, setQueryParams] = useSearchParams()
  const [isCheckedIn, setIsCheckedIn] = useState(false)
  const [isCheckedOut, setIsCheckedOut] = useState(false)

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
      title: `${_class?.name?.[lang] || _class?.name?.['English']}`,
    },
    {
      title: dateFormat(),
    },
  ]

  const updateQuery = debounce((value) => {
    setQueryParams({ search: value })
  }, 300)

  const handleSearch = (e) => {
    updateQuery(e.target.value)
  }

  const handleClick = async (action) => {
      switch (action) {
        case 'reset':
          confirm({
            title: 'Reset All Student',
            description: 'Are you sure you want to reset all attendance?',
            variant: 'error'
          }).then(() => {
            Axios({
              method: 'PUT',
              url: `/operation/attendance/resetAll/${_class?._id}`
            })
              .then((data) => {
                const query = new URLSearchParams()
                query.append('classId', _class._id)
                dispatch(getListAttendance({ query }))
                notify(data?.data?.msg, 'success')
              })
              .catch((err) => notify(err?.response?.data?.msg, 'error'))
          }).catch(() => {})
          break
        case 'checkOut':
          confirm({
            title: 'Check Out All Student',
            description: 'Are you sure you want to check out all attendance?',
            variant: 'info'
          }).then(() => {
            Axios({
              method: 'PUT',
              url: `/operation/attendance/checkOutAll/${_class?._id}`
            })
              .then((data) => {
                const query = new URLSearchParams()
                query.append('classId', _class._id)
                dispatch(getListAttendance({ query }))
                notify(data?.data?.msg, 'success')
              })
              .catch((err) => notify(err?.response?.data?.msg, 'error'))
          }).catch(() => {})
          break
        default:
          confirm({
            title: 'Check In All Student',
            description: 'Are you sure you want to check in all attendance?',
            variant: 'info'
          }).then(() => {
            const body: any[] = []
            _class?.students?.forEach((student) =>  {
              if (attendances?.some((attendance: any) => attendance.user === student.authenticate)) return
              body.push({
                user: student.authenticate,
                class: _class._id
              })
            })
            Axios({
              method: 'POST',
              url: '/operation/attendance/checkInAll',
              body
            })
              .then((data) => {
                const query = new URLSearchParams()
                query.append('classId', _class._id)
                dispatch(getListAttendance({ query }))
                notify(data?.data?.msg, 'success')
              })
              .catch((err) => notify(err?.response?.data?.msg, 'error'))
          }).catch(() => {})
          break
      }
  }
  
  useEffect(() => {
    if (!id) return
    dispatch(getClass({ id, query: queryParams }))
  }, [dispatch, id, queryParams])

  useEffect(() => {
    if (status !== 'SUCCESS') return
    const query = new URLSearchParams()
    query.append('classId', _class._id)
    dispatch(getListAttendance({ query }))
  }, [_class, status, dispatch])
  
  useEffect(() => {
    if (statusAttendance !== 'SUCCESS') return
    const handleCheckIn = (id) => {
      dispatch(checkInAttendance({ user: id, class: _class?._id }))
    }

    const handleCheckOut = (id) => {
      dispatch(checkOutAttendance(id))
    }

    const handleReset = (id) => {
      dispatch(resetAttendance(id))
    }

    const mappedAttendances = _class?.students?.map((student: any) => {
      const attendance: any = attendances.find((attendance: any) => attendance.user === student.authenticate)
      return createAttendanceData(
        _class.monitor,
        student?._id,
        student?.authenticate,
        student?.ref,
        student?.profile?.filename,
        student?.lastName,
        student?.firstName,
        student?.gender,
        attendance,
        user?.privilege,
        theme,
        handleCheckIn,
        handleCheckOut,
        handleReset
      )
    })
    setRowData(mappedAttendances)

    let checkedOut = true
    attendances?.forEach((attendance: any) => {
      if (!attendance.checkedOut) checkedOut = false
    })
    setIsCheckedOut(checkedOut)

    attendances?.length >= _class?.students?.length ? setIsCheckedIn(true) : setIsCheckedIn(false)    

    if (attendances?.length === 0) {
      setIsCheckedIn(false)
      setIsCheckedOut(false)
    }  
  }, [attendances, statusAttendance, _class, theme, user, dispatch])

  return (
    <Container
      header={<Header stages={stages} onSearch={handleSearch} styled={theme} isCheckedIn={isCheckedIn} isCheckedOut={isCheckedOut} onClick={handleClick} />}
    >
      <StickyTable columns={attendanceColumnData} rows={rowData} />
    </Container>
  )
}
