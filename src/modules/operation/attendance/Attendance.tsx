import Container from 'components/shared/Container'
import { StickyTable } from 'components/shared/table/StickyTable'
import { useNavigate, useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import { useEffect, useState } from 'react'
import { dateFormat, debounce, downloadBuffer, convertBufferToArrayBuffer } from 'utils'
import { useSearchParams } from 'react-router-dom'
import { Data, createAttendanceData, attendanceColumnData, createTeacherAttendanceData } from './constant'
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
import { PermissionForm } from './PermissionForm'
import { getListTeacher, selectListTeacher } from 'shared/redux'
import { DownloadButton } from 'components/shared/table/DownloadButton'
import moment from 'moment'

const Header = ({ onSearch, classId, stages, isCheckedIn, isCheckedOut, styled, onClick, handleFilter }) => {
  const { notify } = useNotify()
  const [sortObj, setSortObj] = useState({
    ref: false,
    checkedInOn: false,
    checkedOutOn: false,
    lastName: false,
    firstName: false,
    gender: false,
  })

  const handleChangeFilter = ({ filter }) => {
    setSortObj({ ...sortObj, [filter]: !sortObj[filter] })
    return handleFilter({ filter, asc: sortObj[filter] })
  }

  const handleExportReport = (duration) => {
    let body = {}
    switch (duration) {
      case 'weekly':
        body = {
          fromDate: moment().startOf('week'),
          toDate: moment().endOf('week'),
        }
        break
        
      case 'monthly':
        body = {
          fromDate: moment().startOf('month'),
          toDate: moment().endOf('month'),
        }
        break

      case 'quarterly':
        body = {
          fromDate: moment().startOf('month'),
          toDate: moment().endOf('month'),
        }
        break

      case 'yearly':
        body = {
          fromDate: moment().startOf('year'),
          toDate: moment().endOf('year'),
        }
        break

      default:
        body = {
          fromDate: moment().startOf('day'),
          toDate: moment().endOf('day'),
        }
        break
    }
    const config = {
      responseType: "arraybuffer",
      body,
      headers: {
        Accept: "application/octet-stream",
      },
    }
    Axios({ url: `/export/attendance/class/${classId}`, method: 'POST', ...config })
      .then(data => {                        
        downloadBuffer(convertBufferToArrayBuffer(data?.data?.file?.data), 'class_attendance.xlsx')
      })
      .catch(err => notify(err?.response?.data?.message, 'error'))
  }

  return <>
    <Breadcrumb stages={stages} title={<FactCheckRoundedIcon />} />
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <SearchField onChange={(e) => onSearch(e)} />
      <FilterButton style={{ marginLeft: 10 }}>
        <MenuItem onClick={() => handleChangeFilter({ filter: 'ref' })}><SortIcon asc={sortObj.ref} /> By Id</MenuItem>
        <MenuItem onClick={() => handleChangeFilter({ filter: 'checkedInOn' })}><SortIcon asc={sortObj.checkedInOn} /> By Checked In</MenuItem>
        <MenuItem onClick={() => handleChangeFilter({ filter: 'checkedOutOn' })}><SortIcon asc={sortObj.ref} /> By Checked out</MenuItem>
        <MenuItem onClick={() => handleChangeFilter({ filter: 'lastName' })}><SortIcon asc={sortObj.lastName} /> By LastName</MenuItem>
        <MenuItem onClick={() => handleChangeFilter({ filter: 'firstName' })}><SortIcon asc={sortObj.firstName} /> By FirstName</MenuItem>
        <MenuItem onClick={() => handleChangeFilter({ filter: 'gender' })}><SortIcon asc={sortObj.gender} /> By Gender</MenuItem>
      </FilterButton>
      <DownloadButton style={{ marginLeft: 10 }}>
        <MenuItem onClick={() => handleExportReport('today')}>Today</MenuItem>
        <MenuItem onClick={() => handleExportReport('weekly')}>Weekly</MenuItem>
        <MenuItem onClick={() => handleExportReport('monthly')}>Monthly</MenuItem>
        <MenuItem onClick={() => handleExportReport('quarterly')}>Quarterly</MenuItem>
        <MenuItem onClick={() => handleExportReport('yearly')}>Yearly</MenuItem>
      </DownloadButton>
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
  const navigate = useNavigate()
  const confirm = useAlert()
  const { language } = useLanguage()
  const { id } = useParams()
  const { lang } = useLanguage()
  const { notify } = useNotify()
  const { user } = useAuth()
  const { theme } = useTheme()
  const dispatch = useAppDispatch()
  const [rowData, setRowData] = useState<Data[]>([])
  const { data: _class, status } = useAppSelector(selectClass)
  const { data: attendances, status: statusAttendance } = useAppSelector(selectListAttendance)
  const { data: listTeacher, status: statusListTeacher } = useAppSelector(selectListTeacher)
  const [queryParams, setQueryParams] = useSearchParams()
  const [isCheckedIn, setIsCheckedIn] = useState(false)
  const [isCheckedOut, setIsCheckedOut] = useState(false)
  const [teacherOption, setTeacherOption] = useState<any[]>([])
  const [teacher, setTeacher] = useState<any>(_class?.teacher)
  const [permissionDialog, setPermissionDialog] = useState({
    open: false,
    studentId: null,
    attendanceId: null,
    classId: null
  })
  const [loading, setLoading] = useState(true)

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
          
          if (!attendances?.some((attendance: any) => attendance.user === teacher?.authenticate)) {
            body.push({
              user: teacher?.authenticate,
              class: _class?._id
            })
          }

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

    const teacherQuery = new URLSearchParams()
    teacherQuery.append('fields', 'ref lastName firstName tags')
    dispatch(getListTeacher(teacherQuery))
    setTimeout(() => {
      setLoading(false)
    }, 300)
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

    const handlePermission = (id, attendanceId) => {
      setPermissionDialog({
        studentId: id,
        attendanceId,
        open: true,
        classId: _class?._id
      })
    }

    const handleStudentDetail = (id) => {
      navigate(`/operation/attendance/class/${_class._id}/student/${id}`)
    }

    const handleTeacherDetail = (id) => {
      navigate(`/operation/attendance/class/${_class._id}/teacher/${id}`)
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
        'Student',
        attendance,
        user?.privilege,
        theme,
        handleStudentDetail,
        handleCheckIn,
        handleCheckOut,
        handleReset,
        handlePermission
      )
    })
    const filteredAttendances = mappedAttendances?.filter((elem) => _search.test(elem.tags))

    const handleChangeTeacher = (event) => {
      Axios({
        method: 'GET',
        url: `/school/teacher/detail/${event.target.value}`
      })
        .then((data) => {
          setTeacher(data?.data?.data)
        })
        .catch((err) => notify(err?.response?.data?.msg, 'error'))
    }

    const sortedData = filteredAttendances.sort((a, b) => {
      if (_sort === 'desc') {
        if (b[_filter] < a[_filter]) return -1
        if (b[_filter] > a[_filter]) return 1
        return 0
      } else {
        if (a[_filter] < b[_filter]) return -1
        if (a[_filter] > b[_filter]) return 1
        return 0
      }
    })

    if (teacher) {
      const teacherTags = `${JSON.stringify(teacher?.firstName)}${teacher?.lastName}${teacher?.gender}${teacher?.ref}`.replace(/ /g,'')
      const teacherAttendance: any = attendances.find((attendance: any) => attendance.user === teacher?.authenticate)
      const mappedTeacher = createTeacherAttendanceData(
        teacherTags,
        teacher?._id,
        teacher?.authenticate,
        teacher?.profile?.filename,
        teacher?.lastName,
        teacher?.firstName,
        teacher?.gender,
        'Teacher',
        teacherOption,
        teacherAttendance,
        user?.privilege,
        theme,
        handleTeacherDetail,
        handleCheckIn,
        handleCheckOut,
        handleReset,
        handlePermission,
        handleChangeTeacher
      )
      setRowData([mappedTeacher, ...sortedData])
    } else {
      setRowData(sortedData)
    }

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
  }, [attendances, statusAttendance, _class, theme, user, queryParams, teacherOption, teacher, dispatch, notify, navigate])

  useEffect(() => {
    setTeacher(_class?.teacher)
  }, [_class])
  
  useEffect(() => {
    if (statusListTeacher !== 'SUCCESS') return 
    setTeacherOption(listTeacher)
    
  }, [statusListTeacher, listTeacher])

  return (
    <Container
      header={<Header classId={id} stages={stages} onSearch={handleSearch} styled={theme} isCheckedIn={isCheckedIn} isCheckedOut={isCheckedOut} onClick={handleClick} handleFilter={handleFilter} />}
    >
      <PermissionForm
        dialog={permissionDialog}
        setDialog={setPermissionDialog}
        defaultValues={{}}
        theme={theme}
      />
      <StickyTable columns={attendanceColumnData} rows={rowData} pagination={false} loading={loading} />
    </Container>
  )
}
