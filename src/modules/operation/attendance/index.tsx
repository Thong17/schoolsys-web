
import Container from 'components/shared/Container'
import { StickyTable } from 'components/shared/table/StickyTable'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import { useEffect, useState } from 'react'
import { debounce } from 'utils'
import { useSearchParams } from 'react-router-dom'
import { Data, createData, columnData } from './constant'
import { getListClass, selectListClass } from 'modules/school/class/redux'
import HomeWorkRoundedIcon from '@mui/icons-material/HomeWorkRounded'
import useLanguage from 'hooks/useLanguage'
import useAuth from 'hooks/useAuth'
import useTheme from 'hooks/useTheme'
import Breadcrumb from 'components/shared/Breadcrumbs'
import { SearchField } from 'components/shared/table/SearchField'
import { FilterButton } from 'components/shared/table/FilterButton'
import { MenuItem } from '@mui/material'
import { SortIcon } from 'components/shared/icons/SortIcon'

const Header = ({ onSearch, handleFilter }) => {
  const { language } = useLanguage()
  const [sortObj, setSortObj] = useState({
    name: false,
    createdAt: false,
    room: false,
    schedule: false,
    isActive: false,
    startedAt: false,
  })

  const handleChangeFilter = ({ filter }) => {
    setSortObj({ ...sortObj, [filter]: !sortObj[filter] })
    return handleFilter({ filter, asc: sortObj[filter] })
  }

  const stages = [
    {
      title: language['SCHOOL'],
      path: '/school',
    },
    {
      title: language['ATTENDANCE'],
    }
  ]

  return <>
    <Breadcrumb stages={stages} title={<HomeWorkRoundedIcon />} />
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <SearchField onChange={(e) => onSearch(e)} />
      <FilterButton style={{ marginLeft: 10 }}>
        <MenuItem onClick={() => handleChangeFilter({ filter: 'name' })}><SortIcon asc={sortObj.name} /> By Class</MenuItem>
        <MenuItem onClick={() => handleChangeFilter({ filter: 'createdAt' })}><SortIcon asc={sortObj.createdAt} /> By Date Created</MenuItem>
        <MenuItem onClick={() => handleChangeFilter({ filter: 'room' })}><SortIcon asc={sortObj.room} /> By Room</MenuItem>
        <MenuItem onClick={() => handleChangeFilter({ filter: 'schedule' })}><SortIcon asc={sortObj.schedule} /> By Schedule</MenuItem>
        <MenuItem onClick={() => handleChangeFilter({ filter: 'isActive' })}><SortIcon asc={sortObj.isActive} /> By Active</MenuItem>
        <MenuItem onClick={() => handleChangeFilter({ filter: 'startedAt' })}><SortIcon asc={sortObj.startedAt} /> By Date Started</MenuItem>
      </FilterButton>
    </div>
  </>
}

export const Classes = () => {
  const { lang } = useLanguage()
  const { user } = useAuth()
  const { theme } = useTheme()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [rowData, setRowData] = useState<Data[]>([])
  const { data: classes, count, status } = useAppSelector(selectListClass)
  const [queryParams, setQueryParams] = useSearchParams()

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
    let { limit, search } = data

    let query = {}
    const _limit = queryParams.get('limit')
    const _page = queryParams.get('page')
    const _search = queryParams.get('search')
    const _filter = queryParams.get('filter')
    const _sort = queryParams.get('sort')

    if (_limit) query = { limit: _limit, ...query }
    if (_page) query = { page: _page, ...query }
    if (_search) query = { search: _search, ...query }
    if (_filter) query = { filter: _filter, ...query }
    if (_sort) query = { sort: _sort, ...query }

    if (limit || search) return setQueryParams({...query, ...data, page: 0})
    setQueryParams({...query, ...data})
  }
  
  useEffect(() => {
    dispatch(getListClass({ query: queryParams }))
  }, [dispatch, queryParams])

  useEffect(() => {
    if (status !== 'SUCCESS') return

    const mappedClasses = classes?.filter((item: any) => item.isActive)?.map((_class: any) => {
      return createData(
        _class._id,
        _class.name?.[lang] || _class.name?.['English'],
        _class.room,
        _class.schedule,
        _class.students?.length,
        _class.attendance?.checkedIn,
        _class.attendance?.checkedOut,
        _class.grade?.name?.[lang] || _class.grade?.name?.['English'],
        `${_class.teacher?.lastName} ${_class.teacher?.firstName}`,
        _class.isActive,
        user?.privilege,
        theme,
        navigate,
      )
    })

    setRowData(mappedClasses)
  }, [classes, status, lang, navigate, theme, user])
  

  return (
    <Container
      header={<Header onSearch={handleSearch} handleFilter={handleFilter} />}
    >
      <StickyTable 
        columns={columnData} 
        rows={rowData}        
        setQuery={handleQuery}
        count={count}
        limit={parseInt(queryParams.get('limit') || '10')}
        skip={status === 'SUCCESS' ? parseInt(queryParams.get('page') || '0') : 0} 
      />
    </Container>
  )
}

export { Attendances } from './Attendance'
export { AttendanceStudent } from './AttendanceStudent'
export { AttendanceTeacher } from './AttendanceTeacher'
