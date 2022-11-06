import Container from 'components/shared/Container'
import ReportBreadcrumbs from './components/Breadcrumbs'
import { ITableColumn, StickyTable } from 'components/shared/table/StickyTable'
import BarChartRoundedIcon from '@mui/icons-material/BarChartRounded'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import {
  getReportAcademyDashboard,
  selectReportAcademyDashboard,
} from 'shared/redux'
import { useEffect, useState } from 'react'
import useTheme from 'hooks/useTheme'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { capitalizeText, dateFormat, debounce } from 'utils'
// import { SearchField } from 'components/shared/table/SearchField'
// import { FilterButton } from 'components/shared/table/FilterButton'
import { IconButton } from '@mui/material'
// import { SortIcon } from 'components/shared/icons/SortIcon'
import useLanguage from 'hooks/useLanguage'

export const columnData: ITableColumn<any>[] = [
  { id: 'class', label: 'Class' },
  { id: 'grade', label: 'Grade' },
  { id: 'room', label: 'Room' },
  { id: 'schedule', label: 'Schedule' },
  { id: 'totalStudent', label: 'Total Student' },
  { id: 'graduatedAt', label: 'Graduated At' },
  { id: 'action', label: 'Action', align: 'right' },
]

const mappedData = (data, lang, theme, navigate) => {
  let action = (
    <div style={{ float: 'right' }}>
      <IconButton
        onClick={() => navigate(`/report/academy/${data._id}`)}
        size='small'
        style={{
          backgroundColor: `${theme.color.info}22`,
          borderRadius: theme.radius.primary,
          marginLeft: 5,
          color: theme.color.info,
        }}
      >
        <BarChartRoundedIcon fontSize='small' />
      </IconButton>
    </div>
  )
  return {
    class: data.name[lang] || data.name['English'],
    grade: data.grade[lang] || data.grade['English'],
    room: data.room,
    schedule: capitalizeText(data.schedule),
    totalStudent: data.students.length,
    graduatedAt: dateFormat(data.endedAt),
    action,
  }
}

const Header = ({ handleFilter, onSearch }) => {
  // const [sortObj, setSortObj] = useState({
  //   ref: false,
  //   checkedInOn: false,
  //   checkedOutOn: false,
  //   lastName: false,
  //   firstName: false,
  //   gender: false,
  // })

  // const handleChangeFilter = ({ filter }) => {
  //   setSortObj({ ...sortObj, [filter]: !sortObj[filter] })
  //   return handleFilter({ filter, asc: sortObj[filter] })
  // }

  return (
    <>
      <ReportBreadcrumbs page='academyReport' />
      {/* <div style={{ display: 'flex', alignItems: 'center' }}>
        <SearchField onChange={(e) => onSearch(e)} />
        <FilterButton style={{ marginLeft: 10 }}>
          <MenuItem onClick={() => handleChangeFilter({ filter: 'gender' })}>
            <SortIcon asc={sortObj.gender} /> By Gender
          </MenuItem>
        </FilterButton>
      </div> */}
    </>
  )
}

export const AcademyReport = () => {
  const navigate = useNavigate()
  const { lang } = useLanguage()
  const { theme } = useTheme()
  const {
    data,
    count,
    status,
  } = useAppSelector(selectReportAcademyDashboard)
  const dispatch = useAppDispatch()
  const [rowData, setRowData] = useState<any[]>([])
  const [queryParams, setQueryParams] = useSearchParams()

  useEffect(() => {
    setRowData(data.map((item) => mappedData(item, lang, theme, navigate)))
    // eslint-disable-next-line
  }, [data])

  useEffect(() => {
    dispatch(getReportAcademyDashboard(queryParams))
  }, [dispatch, queryParams])

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

    if (limit || search) return setQueryParams({ ...query, ...data, page: 0 })
    setQueryParams({ ...query, ...data })
  }

  return (
    <Container
      header={
        <Header
          handleFilter={handleFilter}
          onSearch={handleSearch}
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
  )
}
