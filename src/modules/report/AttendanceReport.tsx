import Container from 'components/shared/Container'
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
import { capitalizeText, convertBufferToArrayBuffer, debounce, downloadBuffer, durationMap } from 'utils'
import { SearchField } from 'components/shared/table/SearchField'
import { FilterButton } from 'components/shared/table/FilterButton'
import {
  Button,
  DialogActions,
  FormControlLabel,
  MenuItem,
  Radio,
  RadioGroup,
} from '@mui/material'
import { SortIcon } from 'components/shared/icons/SortIcon'
import { MiniSelectField } from 'components/shared/form'
import { AlertDialog } from 'components/shared/table/AlertDialog'
import { CustomButton } from 'styles/index'
import Axios from 'constants/functions/Axios'
import useNotify from 'hooks/useNotify'

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
  const [exportDialog, setExportDialog] = useState({ open: false, id: null, type: null })
  const [duration, setDuration] = useState('today')
  const { notify } = useNotify()

  useEffect(() => {
    let mappedData: any[] = []
    const exportReport = (id, type) => {
      setExportDialog({ id, type, open: true })
    }

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
          exportReport,
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
          exportReport,
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

  const handleCloseExport = () => {
    setExportDialog({ id: null, type: null, open: false })
  }

  const handleConfirmExport = (event) => {
    event.preventDefault()    
    let body = durationMap(duration)
  
    const config = {
      responseType: "arraybuffer",
      body,
      headers: {
        Accept: "application/octet-stream",
      },
    }
    Axios({ url: `/export/attendance/student/${exportDialog.id}/${exportDialog.type}`, method: 'POST', ...config })
      .then(data => {
        handleCloseExport()
        downloadBuffer(convertBufferToArrayBuffer(data?.data?.file?.data), 'student_attendance.xlsx')
      })
      .catch(err => notify(err?.response?.data?.message, 'error'))
  }

  return (
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
      <AlertDialog isOpen={exportDialog.open} handleClose={handleCloseExport}>
        <form
          onSubmit={handleConfirmExport}
          style={{ position: 'relative', minWidth: 400 }}
        >
          <div style={{ padding: 20, color: theme.text.secondary }}>
            <h3 style={{ fontFamily: theme.font.family, fontWeight: theme.font.weight, marginBottom: 20 }}>Export Student Attendance</h3>
            <RadioGroup name='duration' onChange={(event) => setDuration(event.target.value)} value={duration}>
              <FormControlLabel
                value='today'
                control={<Radio style={{ color: theme.text.secondary }} />}
                label='Today'
              />
              <FormControlLabel
                value='weekly'
                control={<Radio style={{ color: theme.text.secondary }} />}
                label='Weekly'
              />
              <FormControlLabel
                value='monthly'
                control={<Radio style={{ color: theme.text.secondary }} />}
                label='Monthly'
              />
              <FormControlLabel
                value='yearly'
                control={<Radio style={{ color: theme.text.secondary }} />}
                label='Yearly'
              />
            </RadioGroup>
          </div>
          <DialogActions>
            <Button onClick={handleCloseExport}>Cancel</Button>
            <CustomButton
              type='submit'
              style={{
                marginLeft: 10,
                backgroundColor: theme.background.secondary,
                color: theme.text.secondary,
              }}
              styled={theme}
              autoFocus
            >
              Export
            </CustomButton>
          </DialogActions>
        </form>
      </AlertDialog>
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
