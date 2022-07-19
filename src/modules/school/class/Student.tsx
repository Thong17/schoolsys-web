import Breadcrumb from 'components/shared/Breadcrumbs'
import GroupAddRoundedIcon from '@mui/icons-material/GroupAddRounded'
import BallotIcon from '@mui/icons-material/Ballot'
import HomeWorkRoundedIcon from '@mui/icons-material/HomeWorkRounded'
import { useParams } from 'react-router-dom'
import Container from 'components/shared/Container'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import { getClass, getListStudentOfClass, removeStudent, selectClass } from './redux'
import { useEffect, useState } from 'react'
import useLanguage from 'hooks/useLanguage'
import { getListApplied, selectListApplied } from 'modules/school/student/redux'
import { CustomButton } from 'styles'
import useTheme from 'hooks/useTheme'
import { RequestDialog } from './RequestDialog'
import { ScoreDialog } from './ScoreDialog'
import { StickyTable } from 'components/shared/table/StickyTable'
import { createStudentData, studentColumnData } from './constant'
import useAuth from 'hooks/useAuth'
import useWeb from 'hooks/useWeb'
import Axios from 'constants/functions/Axios'
import useNotify from 'hooks/useNotify'
import { DeleteDialog } from 'components/shared/table/DeleteDialog'

const Header = ({ stages, styled, onOpenRequest, onOpenAchievement, totalRequest }) => {
  return (
    <>
      <Breadcrumb stages={stages} title={<HomeWorkRoundedIcon />} />
      <div>
        <CustomButton
          style={{
            marginLeft: 10,
            backgroundColor: styled.background.secondary,
            color: styled.text.secondary,
          }}
          styled={styled}
          onClick={() => onOpenRequest()}
        >
          {totalRequest > 0 && <span 
            style={{
              position: 'absolute',
              top: -7,
              right: -7,
              padding: '0 7px',
              height: 21,
              borderRadius: styled.radius.secondary,
              backgroundColor: styled.color.error,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {totalRequest}
          </span>}
          <GroupAddRoundedIcon />
        </CustomButton>
        <CustomButton
          style={{
            marginLeft: 10,
            backgroundColor: styled.background.secondary,
            color: styled.text.secondary,
          }}
          styled={styled}
          onClick={() => onOpenAchievement()}
        >
          <BallotIcon />
        </CustomButton>
      </div>
    </>
  )
}

export const StudentClass = () => {
  const { id, action } = useParams()
  const dispatch = useAppDispatch()
  const { device } = useWeb()
  const { user } = useAuth()
  const { notify } = useNotify()
  const { lang } = useLanguage()
  const { theme } = useTheme()
  const { data: _class, status: statusClass } = useAppSelector(selectClass)
  const { data: appliedStudents, status: statusAppliedStudents } = useAppSelector(selectListApplied)
  const [studentData, setStudentData] = useState([])
  const [requestDialog, setRequestDialog] = useState<any>({
    open: false,
    students: []
  })
  const [achievementDialog, setAchievementDialog] = useState({
    open: false,
  })
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null })
  
  const handleOpenRequest = () => {
    setRequestDialog({ ...requestDialog, open: true })
  }

  const handleOpenAchievement = () => {
    setAchievementDialog({ ...requestDialog, open: true })
  }

  const handleRemove = (id) => {
    Axios({
      method: 'DELETE',
      url: `/school/class/student/remove/${id}`,
      body: {
        classId: _class?._id
      }
    })
      .then((data) => {
        dispatch(removeStudent(id))
        dispatch(getListStudentOfClass({ id: _class?._id }))
        notify(data?.data?.msg, 'success')
        setDeleteDialog({ open: false, id: null })
      })
      .catch((err) => notify(err?.response?.data?.msg, 'error'))
  }
  
  useEffect(() => {
    if (id) {
      dispatch(getClass({ id, query: {}, fields: ['_id', 'name', 'room', 'schedule', 'grade', 'description', 'students', 'monitor'] }))
    }
  }, [dispatch, id])  

  useEffect(() => {
    if (statusAppliedStudents !== 'SUCCESS') return
    setRequestDialog((prevData) => { 
      return { ...prevData, students: appliedStudents }
     })
  }, [statusAppliedStudents, appliedStudents])
  
  useEffect(() => {
    if (statusClass !== 'SUCCESS' || !_class?._id) return
    dispatch(getListApplied({ id: _class._id }))
  }, [dispatch, statusClass, _class])

  useEffect(() => {
    if (statusClass !== 'SUCCESS') return

    const studentData = _class?.students?.map((student) => {
      return createStudentData(
        _class.monitor,
        student?._id,
        student?.ref,
        student?.profile?.filename,
        student?.lastName,
        student?.firstName,
        student?.gender,
        student?.currentAcademy?.scores,
        _class?.grade?.subjects?.length,
        user?.privilege,
        device,
        setDeleteDialog
      )
    })

    setStudentData(studentData || [])
  }, [statusClass, _class, device, user, theme, notify, dispatch, setDeleteDialog])

  const actionLink =
    action === 'create' ? '/school/class/create' : `/school/class/update/${id}`

  if (action !== 'create' && action !== 'update') return <>Not found</>

  const stages = [
    {
      title: 'School',
      path: '/school',
    },
    {
      title: 'Class',
      path: '/school/class',
    },
    {
      title: action === 'create' ? 'Create' : _class?.name?.[lang] || _class?.name?.['English'],
      path: actionLink,
    },
    {
      title: 'Student',
    },
  ]

  return (
    <Container
      header={
        <Header
          stages={stages}
          styled={theme}
          onOpenRequest={handleOpenRequest}
          onOpenAchievement={handleOpenAchievement}
          totalRequest={appliedStudents?.length || 0}
        />
      }
    >
      <DeleteDialog
        title='Remove Student'
        description='Are you sure you want to remove this student?'
        action='Remove'
        id={deleteDialog.id}
        isOpen={deleteDialog.open}
        handleConfirm={handleRemove}
        handleClose={() => setDeleteDialog({ open: false, id: null })}
      ></DeleteDialog>
      <RequestDialog
        classId={_class?._id}
        dialog={requestDialog}
        setDialog={setRequestDialog}
        _class={_class?.name?.[lang] || _class?.name?.['English']}
        grade={_class?.grade?.name?.[lang] || _class?.grade?.name?.['English']}
        rowData={requestDialog.students || []}
      />
      <ScoreDialog
        classId={_class?._id}
        gradeId={_class?.grade?._id}
        dialog={achievementDialog}
        setDialog={setAchievementDialog}
        rowData={[]}
      />
      <StickyTable columns={studentColumnData} rows={studentData} />
    </Container>
  )
}
