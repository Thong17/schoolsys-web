
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
import { MenuItem } from '@mui/material'
import { SortIcon } from 'components/shared/icons/SortIcon'
import { checkInAttendance, checkOutAttendance, resetAttendance, getListAttendance, selectListAttendance } from './redux'
import { CustomButton } from 'styles'
import Axios from 'constants/functions/Axios'
import useNotify from 'hooks/useNotify'
import useAlert from 'hooks/useAlert'

const Header = ({ onSearch, stages, isCheckedIn, isCheckedOut, styled, onClick, handleFilter }) => {
  const [sortObj, setSortObj] = useState({
    ref: false,
    lastName: false,
    firstName: false,
    gender: false,
  })

  const handleChangeFilter = ({ filter }) => {
    setSortObj({ ...sortObj, [filter]: !sortObj[filter] })
    return handleFilter({ filter, asc: sortObj[filter] })
  }

  return <>
    <Breadcrumb stages={stages} title={<FactCheckRoundedIcon />} />
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <SearchField onChange={(e) => onSearch(e)} />
      <FilterButton style={{ marginLeft: 10 }}>
        <MenuItem onClick={() => handleChangeFilter({ filter: 'ref' })}><SortIcon asc={sortObj.ref} /> By Id</MenuItem>
        <MenuItem onClick={() => handleChangeFilter({ filter: 'lastName' })}><SortIcon asc={sortObj.lastName} /> By LastName</MenuItem>
        <MenuItem onClick={() => handleChangeFilter({ filter: 'firstName' })}><SortIcon asc={sortObj.firstName} /> By FirstName</MenuItem>
        <MenuItem onClick={() => handleChangeFilter({ filter: 'gender' })}><SortIcon asc={sortObj.gender} /> By Gender</MenuItem>
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

export const Attendances = () => {
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
      title: `${_class?.name?.[lang] || _class?.name?.['English'] || '...'}`,
    },
    {
      title: dateFormat(),
    },
  ]

  const updateQuery = debounce((value) => {
    handleQuery({ search: value })
  }, 300)

  const handleSearch = (e) => {
    updateQuery(e.target.value)
  }

  const handleFilter = (option) => {
    handleQuery({ filter: option.filter, sort: option.asc ? 'asc' : 'desc' })
  }

  const handleQuery = (data) => {
    let query = {}
    const _search = queryParams.get('search')
    const _filter = queryParams.get('filter')
    const _sort = queryParams.get('sort')

    if (_search) query = { search: _search, ...query }
    if (_filter) query = { filter: _filter, ...query }
    if (_sort) query = { sort: _sort, ...query }

    setQueryParams({...query, ...data})
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
              url: `/operation/attendance/checkInAll/${_class?._id}`,
              body
            })
              .then((data) => {
                const query = new URLSearchParams()
                query.append('classId', _class?._id)
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
    dispatch(getClass({ id }))
  }, [dispatch, id])

  useEffect(() => {
    if (status !== 'SUCCESS') return
    const query = new URLSearchParams()
    query.append('classId', _class?._id)
    dispatch(getListAttendance({ query }))
  }, [_class, status, dispatch])
  
  useEffect(() => {
    if (statusAttendance !== 'SUCCESS') return
    const _search = new RegExp(queryParams.get('search') || '', "i")
    const _filter = queryParams.get('filter') || 'createdAt'
    const _sort = queryParams.get('sort') || 'asc'

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
      const tags = `${JSON.stringify(student.firstName)}${student.lastName}${student.gender}${student.ref}`.replace(/ /g,'')
      const attendance: any = attendances.find((attendance: any) => attendance.user === student.authenticate)
      return createAttendanceData(
        tags,
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
    const filteredAttendances = mappedAttendances?.filter((elem) => _search.test(elem.tags))
    
    setRowData(filteredAttendances.sort((a, b) => {
      if (_sort === 'desc') {
        return b[_filter] < a[_filter] ? -1 : 1
      } else {
        return a[_filter] - b[_filter] ? -1 : 1
      }
    }))

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
  }, [attendances, statusAttendance, _class, theme, user, queryParams, dispatch])

  return (
    <Container
      header={<Header stages={stages} onSearch={handleSearch} styled={theme} isCheckedIn={isCheckedIn} isCheckedOut={isCheckedOut} onClick={handleClick} handleFilter={handleFilter} />}
    >
      <StickyTable columns={attendanceColumnData} rows={rowData} pagination={false} />
    </Container>
  )
}
