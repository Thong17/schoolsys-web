import { Layout } from 'components/layouts/Layout'
import Container from 'components/shared/Container'
import ReportNavbar from './components/ReportNavbar'
import ReportBreadcrumbs from './components/Breadcrumbs'
import { StickyTable } from 'components/shared/table/StickyTable'
import { columnData, createData } from './constant'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import {
  getReportAttendanceDashboard,
  selectReportAttendanceDashboard,
} from 'shared/redux'
import { useEffect, useState } from 'react'
import useAuth from 'hooks/useAuth'
import useTheme from 'hooks/useTheme'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { capitalizeText, debounce } from 'utils'
import { SearchField } from 'components/shared/table/SearchField'
import { FilterButton } from 'components/shared/table/FilterButton'
import { MenuItem } from '@mui/material'
import { SortIcon } from 'components/shared/icons/SortIcon'
import { MiniSelectField } from 'components/shared/form'

const Header = ({ handleFilter, onSearch, onChangeType, type }) => {
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

  return (
    <>
      <ReportBreadcrumbs page='attendanceReport' />
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <MiniSelectField
          options={[
            { label: 'Student', value: 'student' },
            { label: 'Teacher', value: 'teacher' },
          ]}
          name='type'
          value={type}
          onChange={(event) => onChangeType(event)}
        />
        <SearchField onChange={(e) => onSearch(e)} />
        <FilterButton style={{ marginLeft: 10 }}>
          <MenuItem onClick={() => handleChangeFilter({ filter: 'ref' })}>
            <SortIcon asc={sortObj.ref} /> By Id
          </MenuItem>
          <MenuItem
            onClick={() => handleChangeFilter({ filter: 'checkedInOn' })}
          >
            <SortIcon asc={sortObj.checkedInOn} /> By Checked In
          </MenuItem>
          <MenuItem
            onClick={() => handleChangeFilter({ filter: 'checkedOutOn' })}
          >
            <SortIcon asc={sortObj.ref} /> By Checked out
          </MenuItem>
          <MenuItem onClick={() => handleChangeFilter({ filter: 'lastName' })}>
            <SortIcon asc={sortObj.lastName} /> By LastName
          </MenuItem>
          <MenuItem onClick={() => handleChangeFilter({ filter: 'firstName' })}>
            <SortIcon asc={sortObj.firstName} /> By FirstName
          </MenuItem>
          <MenuItem onClick={() => handleChangeFilter({ filter: 'gender' })}>
            <SortIcon asc={sortObj.gender} /> By Gender
          </MenuItem>
        </FilterButton>
      </div>
    </>
  )
}

export const AttendanceReport = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { theme } = useTheme()
  const {
    data: { students, teachers },
    count,
    status,
  } = useAppSelector(selectReportAttendanceDashboard)
  const dispatch = useAppDispatch()
  const [rowData, setRowData] = useState<any[]>([])
  const [queryParams, setQueryParams] = useSearchParams()
  const [type, setType] = useState(queryParams.get('type') || 'student')

  useEffect(() => {
    let mappedData: any[] = []
    if (students) {
      const mappedStudent = students?.map((item) => {
        return createData(
          'student',
          item.authenticate,
          item.ref,
          item.lastName,
          item.firstName,
          capitalizeText(item.gender),
          item.contact || '...',
          user?.privilege,
          navigate,
          theme
        )
      })
      mappedData = mappedStudent
    }

    if (teachers) {
      const mappedTeacher = teachers?.map((item) => {
        return createData(
          'teacher',
          item.authenticate,
          item.ref,
          item.lastName,
          item.firstName,
          capitalizeText(item.gender),
          item.contact || '...',
          user?.privilege,
          navigate,
          theme
        )
      })
      mappedData = [...mappedData, ...mappedTeacher]
    }
    setRowData(mappedData)
  }, [students, teachers, theme, user, navigate])

  useEffect(() => {
    dispatch(getReportAttendanceDashboard(queryParams))
  }, [dispatch, queryParams])

  const updateQuery = debounce((value) => {
    handleQuery({ search: value })
  }, 300)

  const handleSearch = (e) => {
    updateQuery(e.target.value)
  }

  const handleChangeType = (e) => {
    setType(e.target.value)
    handleQuery({ type: e.target.value })
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
    const _type = queryParams.get('type')

    if (_limit) query = { limit: _limit, ...query }
    if (_page) query = { page: _page, ...query }
    if (_search) query = { search: _search, ...query }
    if (_filter) query = { filter: _filter, ...query }
    if (_sort) query = { sort: _sort, ...query }
    if (_type) query = { type: _type, ...query }

    if (limit || search) return setQueryParams({ ...query, ...data, page: 0 })
    setQueryParams({ ...query, ...data })
  }

  return (
    <Layout navbar={<ReportNavbar />}>
      <Container
        header={
          <Header
            handleFilter={handleFilter}
            onSearch={handleSearch}
            onChangeType={handleChangeType}
            type={type}
          />
        }
      >
        <StickyTable
          columns={columnData}
          rows={rowData}
          setQuery={handleQuery}
          count={count}
          limit={parseInt(queryParams.get('limit') || '10')}
          skip={
            status === 'SUCCESS' ? parseInt(queryParams.get('page') || '0') : 0
          }
        />
      </Container>
    </Layout>
  )
}
