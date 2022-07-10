import Breadcrumb from 'components/shared/Breadcrumbs'
import HomeWorkRoundedIcon from '@mui/icons-material/HomeWorkRounded'
import { useNavigate, useParams } from 'react-router-dom'
import Container from 'components/shared/Container'
import { CustomButton } from 'styles'
import useTheme from 'hooks/useTheme'
import { SubjectForm } from './SubjectForm'
import { useEffect, useState } from 'react'
import { createSubjectData, initSubject, subjectColumnData } from './constant'
import Axios from 'constants/functions/Axios'
import useNotify from 'hooks/useNotify'
import { mapSubjectBody } from './redux/constant'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import { getGrade, selectGrade } from './redux'
import { DeleteDialog } from 'components/shared/table/DeleteDialog'
import { StickyTable } from 'components/shared/table/StickyTable'
import useLanguage from 'hooks/useLanguage'
import useWeb from 'hooks/useWeb'
import useAuth from 'hooks/useAuth'

const Header = ({ stages, styled, setSubjectDialog, setSubjectValue }) => {
  return (
    <>
      <Breadcrumb stages={stages} title={<HomeWorkRoundedIcon />} />
      <CustomButton
        style={{
          marginLeft: 10,
          backgroundColor: styled.background.secondary,
          color: styled.text.secondary,
        }}
        styled={styled}
        onClick={() => {
            setSubjectValue(initSubject)
            setSubjectDialog((subject) => {
                return { ...subject, open: true }
            })
        }}
      >
        Create
      </CustomButton>
    </>
  )
}

export const SubjectGrade = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { data: grade, status } = useAppSelector(selectGrade)
  const { id, action } = useParams()
  const { lang } = useLanguage()
  const { theme } = useTheme()
  const { device } = useWeb()
  const { user } = useAuth()
  const { notify, loadify } = useNotify()
  const [dialog, setDialog] = useState({ open: false, id: null })
  const [subjectValue, setSubjectValue] = useState(initSubject)
  const [rowData, setRowData] = useState<any[]>([])
  const [subjectDialog, setSubjectDialog] = useState({
    open: false,
    gradeId: id,
    subjectId: null,
  })

  const handleConfirmDelete = (id) => {
    const response = Axios({
      method: 'DELETE',
      url: `/school/subject/disable/${id}`,
    })
    loadify(response)
    response.then(() =>
      dispatch(getGrade({ id: subjectDialog?.gradeId as string, query: {} }))
    )

    setDialog({ open: false, id: null })
  }

  useEffect(() => {
    if (status !== 'INIT') return
    dispatch(getGrade({ id: subjectDialog?.gradeId as string, query: {} }))
  }, [dispatch, status, subjectDialog])

  useEffect(() => {
    const handleEditSubject = (sid) => {
        Axios({
        method: 'GET',
        url: `/school/subject/detail/${sid}`,
        })
        .then((data) => {
            setSubjectValue(mapSubjectBody(data.data.data))
            setSubjectDialog({
            ...subjectDialog,
            subjectId: sid,
            open: true,
            })
        })
        .catch((err) => {
            notify(err?.response?.data?.msg, 'error')
        })
    }

    const listSubjects = grade?.subjects?.map((subject: any) => {
      return createSubjectData(
        subject._id,
        subject.name?.[lang] || grade.name?.['English'],
        subject.level,
        subject.passScore,
        subject.fullScore,
        subject.description,
        subject.createdBy?.username || '...',
        user?.privilege,
        device,
        handleEditSubject,
        setDialog
      )
    })
    listSubjects && setRowData(listSubjects)
  }, [grade, lang, user, device, subjectDialog, notify, navigate, setDialog, setSubjectDialog])

  const actionLink =
    action === 'create' ? '/school/grade/create' : `/school/grade/update/${id}`

  if (action !== 'create' && action !== 'update') return <>Not found</>

  const stages = [
    {
      title: 'School',
      path: '/school',
    },
    {
      title: 'Grade',
      path: '/school/grade',
    },
    {
      title: action === 'create' ? 'Create' : grade.name?.[lang] || grade.name?.['English'],
      path: actionLink,
    },
    {
      title: 'Subject',
    },
  ]

  return (
    <Container
      header={
        <Header
          stages={stages}
          styled={theme}
          setSubjectDialog={setSubjectDialog}
          setSubjectValue={setSubjectValue}
        />
      }
    >
      <SubjectForm
        dialog={subjectDialog}
        setDialog={setSubjectDialog}
        theme={theme}
        defaultValues={subjectValue}
      />
      <DeleteDialog
        id={dialog.id}
        isOpen={dialog.open}
        handleConfirm={handleConfirmDelete}
        handleClose={() => setDialog({ open: false, id: null })}
      ></DeleteDialog>
      <StickyTable columns={subjectColumnData} rows={rowData} loading={false} />
    </Container>
  )
}
