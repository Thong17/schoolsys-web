
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
  const { data: teachers, status } = useAppSelector(selectListTeacher)
  const [dialog, setDialog] = useState({ open: false, id: null })
  const [queryParams, setQueryParams] = useSearchParams()
  const [loading, setLoading] = useState(status === 'LOADING' ? true : false)
  const [importDialog, setImportDialog] = useState({ open: false, data: [] })

  const updateQuery = debounce((value) => {
    setLoading(false)
    setQueryParams({ search: value })
  }, 300)

  const handleSearch = (e) => {
    updateQuery(e.target.value)
  }

  const handleImport = (e) => {
    const response = ImportExcel(
      '/admin/teacher/excel/import',
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
      url: '/admin/teacher/batch',
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
      url: `/admin/teacher/disable/${id}`,
    })
    loadify(response)
    response.then(() => dispatch(getListTeacher({ query: queryParams })))

    setDialog({ open: false, id: null })
  }

  useEffect(() => {
    if (status !== 'INIT') return
    dispatch(getListTeacher({ query: queryParams }))
  }, [dispatch, status, queryParams])

  useEffect(() => {
    const listTeachers = teachers.map((teacher: any) => {
      return createData(
        teacher._id,
        teacher.lastName,
        teacher.firstName,
        teacher.gender,
        teacher.birthDate,
        teacher.address,
        teacher.contact,
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
          handleImport={handleImport}
        />
      }
    >
      <AlertDialog isOpen={importDialog.open} handleClose={handleCloseImport}>
        <div style={{ position: 'relative' }}>
          <StickyTable columns={importColumnData} rows={importDialog.data} loading={loading} style={{ maxWidth: '90vw' }} />
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
      <StickyTable columns={columnData} rows={rowData} loading={loading} />
    </Container>
  )
}

export { CreateTeacher } from './Create'
export { UpdateTeacher } from './Update'
export { DetailTeacher } from './Detail'