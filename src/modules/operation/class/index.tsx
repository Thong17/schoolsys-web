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
import { selectListClass, getListClass, getClass, selectClass } from './redux'
import { useEffect, useState } from 'react'
import { capitalizeText, debounce, dateFullYear } from 'utils'
import { useSearchParams } from 'react-router-dom'
import useTheme from 'hooks/useTheme'
import { Header } from './Header'
import {
  Data,
  createData,
  columnData,
  importColumnData,
  importColumns,
  graduateColumnData,
  createGraduateData,
  graduateExportColumnData,
} from './constant'
import { ImportExcel } from 'constants/functions/Excels'
import useAlert from 'hooks/useAlert'
import { AlertDialog } from 'components/shared/table/AlertDialog'
import { Button, DialogActions, IconButton } from '@mui/material'
import { CustomButton } from 'styles'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import FileDownloadRoundedIcon from '@mui/icons-material/FileDownloadRounded'
import { CSVLink } from 'react-csv'

export const Classes = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const confirm = useAlert()
  const { loadify } = useNotify()
  const { lang } = useLanguage()
  const { theme } = useTheme()
  const { device } = useWeb()
  const { user } = useAuth()
  const { notify } = useNotify()
  const [rowData, setRowData] = useState<Data[]>([])
  const [graduateRowData, setGraduateRowData] = useState<any[]>([])
  const [graduateExportRowData, setGraduateExportRowData] = useState<any[]>([])
  const { data: _class, status: statusClass } = useAppSelector(selectClass)
  const { data: classes, status } = useAppSelector(selectListClass)
  const [dialog, setDialog] = useState({ open: false, id: null })
  const [graduateDialog, setGraduateDialog] = useState({
    open: false,
    id: null,
  })
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

  const handleCloseGraduateDialog = () => {
    setGraduateDialog({ open: false, id: null })
    setGraduateRowData([])
  }

  const handleImport = (e) => {
    const response = ImportExcel(
      '/operation/class/excel/import',
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
      url: '/operation/class/batch',
      body: importDialog.data,
    })
    loadify(response)
    response.then(() => {
      setImportDialog({ ...importDialog, open: false })
      dispatch(getListClass({}))
    })
  }

  const handleConfirmDelete = (id) => {
    const response = Axios({
      method: 'DELETE',
      url: `/operation/class/delete/${id}`,
    })
    loadify(response)
    response.then(() => dispatch(getListClass({ query: queryParams })))

    setDialog({ open: false, id: null })
  }

  const handleFinishGraduate = () => {
    confirm({
      title: 'Confirm Graduate',
      description: `Are you sure you want to graduate class ${_class.name?.[lang] || _class.name?.['English']}?`,
      variant: 'info'
    })
      .then(() => {
        Axios({
          method: 'PUT',
          url: `/operation/class/graduate/${graduateDialog.id}`,
        })
        .then((data) => {
          notify(data?.data?.data?.msg, 'success')
          dispatch(getListClass({ query: queryParams }))
          handleCloseGraduateDialog()
        })
        .catch((err) => notify(err?.msg, 'error'))
      })
      .catch(() => {})
  }

  useEffect(() => {
    if (statusClass !== 'SUCCESS') return
    let exportDate: any = []
    const graduateStudents = _class?.students?.map((student, key) => {
      const data = createGraduateData(
        student.profile?.filename,
        student.ref,
        student.lastName,
        student.firstName,
        student.gender,
        student.currentAcademy?.scores,
        _class.grade?.subjects
      )
      exportDate = [
        ...exportDate,
        {
          ID: data.ref,
          LastName: data.lastName,
          FirstName: data.firstName,
          Gender: data.gender,
          Contact: student.contact,
          Score: data.score,
          Average: data.averageText,
          Grade: data.result,
        },
      ]
      return data
    })
    setGraduateExportRowData(exportDate?.sort((a, b) => a.Score > b.Score ? -1 : 1).map((student, key) => { return { ...student, Rank: `#${key+1}` } }))
    setGraduateRowData(graduateStudents?.sort((a, b) => a.score > b.score ? -1 : 1).map((student, key) => { return { ...student, rank: `#${key+1}` } }))
  }, [_class, statusClass])

  useEffect(() => {
    dispatch(getListClass({ query: queryParams }))
  }, [dispatch, queryParams])

  useEffect(() => {
    const handleGraduateDialog = (data) => {
      dispatch(
        getClass({
          id: data.id,
          query: {},
          fields: [
            '_id',
            'name',
            'room',
            'schedule',
            'grade',
            'description',
            'students',
            'createdAt',
          ],
        })
      )
      setGraduateDialog(data)
    }

    const handleEnableClass = (id) => {
      confirm({
        title: 'Start Class',
        description: 'Are you sure you want to start this class?',
        variant: 'info'
      }).then(() => {
        Axios({
          method: 'PUT',
          url: `/operation/class/enable/${id}`,
        })
          .then((data) => {
            notify(data?.data?.msg, 'success')
            dispatch(getListClass({ query: queryParams }))
          })
          .catch((err) => notify(err?.response?.data?.msg, 'error'))
      }).catch(() => {})
    }

    const listClasses = classes.map((_class: any) => {
      return createData(
        _class._id,
        _class.name?.[lang] || _class.name?.['English'],
        _class.room,
        capitalizeText(_class.schedule),
        _class.students?.length,
        _class.totalApplied,
        _class.grade?.name?.[lang] || _class.grade?.name?.['English'],
        _class.teacher,
        _class.isActive,
        _class.description,
        _class.createdBy?.username || '...',
        user?.privilege,
        theme,
        device,
        navigate,
        setDialog,
        handleGraduateDialog,
        handleEnableClass,
      )
    })
    setRowData(listClasses)
  }, [classes, lang, user, device, theme, queryParams, navigate, dispatch, notify, confirm])

  return (
    <Container
      header={
        <Header
          data={classes}
          styled={theme}
          navigate={navigate}
          handleSearch={handleSearch}
          handleImport={handleImport}
        />
      }
    >
      <AlertDialog isOpen={importDialog.open} handleClose={handleCloseImport}>
        <div style={{ position: 'relative' }}>
          <StickyTable
            columns={importColumnData}
            rows={importDialog.data}
            loading={loading}
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

      <AlertDialog
        isOpen={graduateDialog.open}
        handleClose={handleCloseGraduateDialog}
      >
        <div
          style={{
            padding: '13px 30px',
            fontFamily: theme.font.family,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <h3 style={{ color: theme.text.secondary }}>
            Graduate Class:{' '}
            {_class.grade?.name?.[lang] || _class.grade?.name?.['English']},{' '}
            <span
              style={{
                color: theme.text.secondary,
                fontWeight: theme.font.weight,
              }}
            >
              {dateFullYear(_class.startedAt)} - {dateFullYear()}
            </span>
          </h3>
          <CSVLink
            headers={graduateExportColumnData}
            data={graduateExportRowData}
            filename={`graduate_${
              _class.grade?.name?.['English']
            }_${new Date().toDateString()}.csv`}
            style={{
              color: theme.text.secondary,
              textDecoration: 'none',
            }}
          >
            <CustomButton
              style={{
                backgroundColor: theme.background.secondary,
                color: theme.text.secondary,
              }}
              styled={theme}
              autoFocus
            >
              <FileDownloadRoundedIcon />
            </CustomButton>
          </CSVLink>
        </div>
        <div
          style={{
            width: '95vw',
            height: '75vh',
            marginBottom: 10,
            position: 'relative',
            overflowY: 'auto',
          }}
        >
          <StickyTable pagination={false} columns={graduateColumnData} rows={graduateRowData} />
        </div>
        <DialogActions style={{ position: 'absolute', bottom: 5, right: 10 }}>
          <Button onClick={handleCloseGraduateDialog}>Close</Button>
          <CustomButton onClick={handleFinishGraduate} styled={theme} style={{ backgroundColor: theme.background.secondary, color: theme.text.secondary, marginLeft: 10 }}>Graduate</CustomButton>
        </DialogActions>
      </AlertDialog>

      <StickyTable columns={columnData} rows={rowData} loading={loading} />
    </Container>
  )
}

export { CreateClass } from './Create'
export { UpdateClass } from './Update'
export { DetailClass } from './Detail'
export { StudentClass } from './Student'
