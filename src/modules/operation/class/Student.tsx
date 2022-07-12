import Breadcrumb from 'components/shared/Breadcrumbs'
import GroupAddRoundedIcon from '@mui/icons-material/GroupAddRounded'
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded'
import FactCheckRoundedIcon from '@mui/icons-material/FactCheckRounded'
import { useParams } from 'react-router-dom'
import Container from 'components/shared/Container'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import { getClass, removeStudent, selectClass } from './redux'
import { useEffect, useState } from 'react'
import useLanguage from 'hooks/useLanguage'
import { getListApplied, selectListApplied } from 'modules/school/student/redux'
import { CustomButton } from 'styles'
import useTheme from 'hooks/useTheme'
import { RequestDialog } from './RequestDialog'
import { AchievementDialog } from './AchievementDialog'
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
      <Breadcrumb stages={stages} title={<FactCheckRoundedIcon />} />
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
          <SchoolRoundedIcon />
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
      url: `/operation/class/student/remove/${id}`,
      body: {
        classId: _class?._id
      }
    })
      .then((data) => {
        dispatch(removeStudent(id))
        notify(data?.data?.msg, 'success')
        setDeleteDialog({ open: false, id: null })
      })
      .catch((err) => notify(err?.response?.data?.msg, 'error'))
  }
  
  useEffect(() => {
    if (id) {
      dispatch(getClass({ id, query: {}, fields: ['_id', 'name', 'room', 'schedule', 'grade', 'description', 'students'] }))
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
        student?._id,
        student?.ref,
        student?.profile?.filename,
        student?.lastName,
        student?.firstName,
        student?.gender,
        100,
        5.0,
        user?.privilege,
        device,
        setDeleteDialog
      )
    })

    setStudentData(studentData || [])
  }, [statusClass, _class, device, user, notify, dispatch, setDeleteDialog])

  const actionLink =
    action === 'create' ? '/operation/class/create' : `/operation/class/update/${id}`

  if (action !== 'create' && action !== 'update') return <>Not found</>

  const stages = [
    {
      title: 'Operation',
      path: '/operation',
    },
    {
      title: 'Class',
      path: '/operation/class',
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
      <AchievementDialog
        dialog={achievementDialog}
        setDialog={setAchievementDialog}
        rowData={[]}
      />
      <StickyTable columns={studentColumnData} rows={studentData} />
    </Container>
  )
}
