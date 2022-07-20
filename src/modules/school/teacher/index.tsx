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
import { selectListTeacher, getListTeacher } from './redux'
import { useEffect, useState } from 'react'
import { debounce } from 'utils'
import { useSearchParams } from 'react-router-dom'
import useTheme from 'hooks/useTheme'
import { Header } from './Header'
import { Data, createData, columnData, importColumnData, importColumns } from './constant'
import { ImportExcel } from 'constants/functions/Excels'
import useAlert from 'hooks/useAlert'
import { AlertDialog } from 'components/shared/table/AlertDialog'
import { Button, DialogActions, IconButton } from '@mui/material'
import { CustomButton } from 'styles'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'

export const Teachers = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const confirm = useAlert()
  const { loadify } = useNotify()
  const { lang } = useLanguage()
  const { theme } = useTheme()
  const { device } = useWeb()
  const { user } = useAuth()
  const [rowData, setRowData] = useState<Data[]>([])
  const { data: teachers, count, status } = useAppSelector(selectListTeacher)
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
    dispatch(getListTeacher({ query: queryParams }))
  }, [dispatch, queryParams])

  const handleImport = (e) => {
    const response = ImportExcel(
      '/school/teacher/excel/import',
      e.target.files[0],
      importColumns
    )
    loadify(response)
    response.then((data) => {
      const importList = data.data.data.map((importData) => {
        const ImportAction = ({ no }) => (
          <IconButton
            onClick={
              () => {
                setImportDialog((prevData) => {
                  return { ...prevData, data: prevData.data.filter((prevItem: any) => prevItem.no !== no) }
                })
              }
            }
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
      variant: 'error'
    }).then(() => setImportDialog({ ...importDialog, open: false }))
      .catch(() => setImportDialog({ ...importDialog }))
  }

  const handleConfirmImport = () => {
    const response = Axios({
      method: 'POST',
      url: '/school/teacher/batch',
      body: importDialog.data
    })
    loadify(response)
    response.then(() => {
      setImportDialog({ ...importDialog, open: false })
      dispatch(getListTeacher({}))
    })
  }

  const handleConfirmDelete = (id) => {
    const response = Axios({
      method: 'DELETE',
      url: `/school/teacher/disable/${id}`,
    })
    loadify(response)
    response.then(() => dispatch(getListTeacher({ query: queryParams })))

    setDialog({ open: false, id: null })
  }

  useEffect(() => {
    const listTeachers = teachers.map((teacher: any) => {
      return createData(
        teacher._id,
        teacher.profile,
        teacher.lastName,
        teacher.firstName,
        teacher.gender,
        teacher.birthDate,
        teacher.address,
        teacher.contact,
        teacher.grade,
        teacher.subject,
        teacher.createdBy?.username || '...',
        user?.privilege,
        device,
        navigate,
        setDialog
      )
    })
    setRowData(listTeachers)
  }, [teachers, lang, user, device, navigate])

  return (
    <Container
      header={
        <Header
          data={teachers}
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
          <StickyTable columns={importColumnData} rows={importDialog.data} style={{ maxWidth: '90vw' }} />
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
        skip={status === 'SUCCESS' ? parseInt(queryParams.get('page') || '0') : 0} />
    </Container>
  )
}

export { CreateTeacher } from './Create'
export { UpdateTeacher } from './Update'
export { DetailTeacher } from './Detail'
