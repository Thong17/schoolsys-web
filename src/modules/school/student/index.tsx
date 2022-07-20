import Container from 'components/shared/Container'
import useLanguage from 'hooks/useLanguage'
import useAuth from 'hooks/useAuth'
import Axios from 'constants/functions/Axios'
import useNotify from 'hooks/useNotify'
import useWeb from 'hooks/useWeb'
import { DeleteDialog } from 'components/shared/table/DeleteDialog'
import { StickyTable } from 'components/shared/table/StickyTable'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import { selectListStudent, getListStudent } from './redux'
import { useEffect, useState } from 'react'
import { capitalizeText, debounce } from 'utils'
import { useSearchParams } from 'react-router-dom'
import useTheme from 'hooks/useTheme'
import { Header } from './Header'
import {
  Data,
  createData,
  columnData,
  importColumnData,
  importColumns,
} from './constant'
import { ImportExcel } from 'constants/functions/Excels'
import useAlert from 'hooks/useAlert'
import { AlertDialog } from 'components/shared/table/AlertDialog'
import { Button, DialogActions, IconButton } from '@mui/material'
import { CustomButton } from 'styles'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'

export const Students = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const confirm = useAlert()
  const { loadify } = useNotify()
  const { lang } = useLanguage()
  const { theme } = useTheme()
  const { device } = useWeb()
  const { user } = useAuth()
  const [rowData, setRowData] = useState<Data[]>([])
  const { data: students, count, status } = useAppSelector(selectListStudent)
  const [dialog, setDialog] = useState({ open: false, id: null })
  const [queryParams, setQueryParams] = useSearchParams()
  const [importDialog, setImportDialog] = useState({ open: false, data: [] })

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
    dispatch(getListStudent({ query: queryParams }))
  }, [dispatch, queryParams])

  const handleImport = (e) => {
    const response = ImportExcel(
      '/school/student/excel/import',
      e.target.files[0],
      importColumns
    )
    loadify(response)
    response.then((data) => {
      const importList = data.data.data.map((importData) => {
        const ImportAction = ({ no }) => (
          <IconButton
            onClick={() => {
              setImportDialog((prevData) => {
                return {
                  ...prevData,
                  data: prevData.data.filter(
                    (prevItem: any) => prevItem.no !== no
                  ),
                }
              })
            }}
            style={{ color: theme.text.secondary }}
          >
            <CloseRoundedIcon />
          </IconButton>
        )
        return { ...importData, action: <ImportAction no={importData?.no} /> }
      })

      return setImportDialog({ open: true, data: importList })
    })
  }

  const handleCloseImport = () => {
    confirm({
      title: 'Discard Import',
      description: 'Do you want to discard all the change?',
      variant: 'error',
    })
      .then(() => setImportDialog({ ...importDialog, open: false }))
      .catch(() => setImportDialog({ ...importDialog }))
  }

  const handleConfirmImport = () => {
    const response = Axios({
      method: 'POST',
      url: '/school/student/batch',
      body: importDialog.data,
    })
    loadify(response)
    response.then(() => {
      setImportDialog({ ...importDialog, open: false })
      dispatch(getListStudent({}))
    })
  }

  const handleConfirmDelete = (id) => {
    const response = Axios({
      method: 'DELETE',
      url: `/school/student/disable/${id}`,
    })
    loadify(response)
    response.then(() => dispatch(getListStudent({ query: queryParams })))

    setDialog({ open: false, id: null })
  }

  useEffect(() => {
    const listStudents = students.map((student: any) => {
      return createData(
        student._id,
        student.profile,
        student.lastName,
        student.firstName,
        capitalizeText(student.gender),
        student.dateOfBirth,
        student.placeOfBirth,
        student.nationality,
        student.address,
        student.contact,
        student.application?.appliedClass?.name?.[lang] ||
          student.application?.appliedClass?.name?.['English'] ||
          '...',
        student.currentAcademy?.class?.name?.[lang] ||
          student.currentAcademy?.class?.name?.['English'] ||
          '...',
        student.createdBy?.username || '...',
        user?.privilege,
        device,
        navigate,
        setDialog
      )
    })
    setRowData(listStudents)
  }, [students, lang, user, device, navigate])

  return (
    <Container
      header={
        <Header
          data={students}
          styled={theme}
          navigate={navigate}
          handleSearch={handleSearch}
          handleFilter={handleFilter}
          handleImport={handleImport}
        />
      }
    >
      <AlertDialog isOpen={importDialog.open} handleClose={handleCloseImport}>
        <div style={{ position: 'relative' }}>
          <StickyTable
            columns={importColumnData}
            rows={importDialog.data}
            style={{ maxWidth: '90vw' }}
          />
        </div>
        <DialogActions>
          <Button onClick={handleCloseImport}>Cancel</Button>
          <CustomButton
            style={{
              marginLeft: 10,
              backgroundColor: theme.background.secondary,
              color: theme.text.secondary,
            }}
            styled={theme}
            onClick={handleConfirmImport}
            autoFocus
          >
            Import
          </CustomButton>
        </DialogActions>
      </AlertDialog>
      <DeleteDialog
        id={dialog.id}
        isOpen={dialog.open}
        handleConfirm={handleConfirmDelete}
        handleClose={() => setDialog({ open: false, id: null })}
      ></DeleteDialog>
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

export { CreateStudent } from './Create'
export { UpdateStudent } from './Update'
export { DetailStudent } from './Detail'
export { DetailFormStudent } from './DetailForm'
