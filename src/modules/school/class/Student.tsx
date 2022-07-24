import Breadcrumb from 'components/shared/Breadcrumbs'
import GroupAddRoundedIcon from '@mui/icons-material/GroupAddRounded'
import BallotIcon from '@mui/icons-material/Ballot'
import HomeWorkRoundedIcon from '@mui/icons-material/HomeWorkRounded'
import { useParams, useSearchParams } from 'react-router-dom'
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
import { SearchField } from 'components/shared/table/SearchField'
import { FilterButton } from 'components/shared/table/FilterButton'
import { MenuItem } from '@mui/material'
import { SortIcon } from 'components/shared/icons/SortIcon'
import { debounce } from 'utils'

const Header = ({ stages, styled, onOpenRequest, onOpenAchievement, totalRequest, onSearch, onFilter }) => {
  const [sortObj, setSortObj] = useState({
    ref: false,
    lastName: false,
    firstName: false,
    gender: false,
    score: false,
  })

  const handleChangeFilter = ({ filter }) => {
    setSortObj({ ...sortObj, [filter]: !sortObj[filter] })
    return onFilter({ filter, asc: sortObj[filter] })
  }

  return (
    <>
      <Breadcrumb stages={stages} title={<HomeWorkRoundedIcon />} />
      <div style={{ display: 'flex' }}>
        <SearchField onChange={(e) => onSearch(e)} />
        <FilterButton style={{ marginLeft: 10 }}>
          <MenuItem onClick={() => handleChangeFilter({ filter: 'score' })}><SortIcon asc={sortObj.score} /> By Score</MenuItem>
          <MenuItem onClick={() => handleChangeFilter({ filter: 'ref' })}><SortIcon asc={sortObj.ref} /> By Id</MenuItem>
          <MenuItem onClick={() => handleChangeFilter({ filter: 'lastName' })}><SortIcon asc={sortObj.lastName} /> By LastName</MenuItem>
          <MenuItem onClick={() => handleChangeFilter({ filter: 'firstName' })}><SortIcon asc={sortObj.firstName} /> By FirstName</MenuItem>
          <MenuItem onClick={() => handleChangeFilter({ filter: 'gender' })}><SortIcon asc={sortObj.gender} /> By Gender</MenuItem>
        </FilterButton>
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
              color: styled.text.secondary,
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
  const [queryParams, setQueryParams] = useSearchParams()
  const [studentData, setStudentData] = useState([])
  const [loading, setLoading] = useState(true)
  const [requestDialog, setRequestDialog] = useState<any>({
    open: false,
    students: []
  })
  const [achievementDialog, setAchievementDialog] = useState({
    open: false,
  })
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null })

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
    let query = {}
    const _search = queryParams.get('search')
    const _filter = queryParams.get('filter')
    const _sort = queryParams.get('sort')

    if (_search) query = { search: _search, ...query }
    if (_filter) query = { filter: _filter, ...query }
    if (_sort) query = { sort: _sort, ...query }

    setQueryParams({...query, ...data})
  }
  
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
    const _request = queryParams.get('request')
    setRequestDialog({ students: appliedStudents, open: _request === '1' ? true : false })
  }, [statusAppliedStudents, appliedStudents, queryParams])
  
  useEffect(() => {
    if (statusClass !== 'SUCCESS' || !_class?._id) return
    dispatch(getListApplied({ id: _class._id }))
    setTimeout(() => {
      setLoading(false)
    }, 300)
  }, [dispatch, statusClass, _class])

  useEffect(() => {
    if (statusClass !== 'SUCCESS') return
    const _search = new RegExp(queryParams.get('search') || '', "i")
    const _filter = queryParams.get('filter') || 'createdAt'
    const _sort = queryParams.get('sort') || 'asc'

    const studentData = _class?.students?.map((student) => {
      const tags = `${JSON.stringify(student.firstName)}${student.lastName}${student.gender}${student.ref}`.replace(/ /g,'')
      return createStudentData(
        tags,
        _class.monitor,
        student?._id,
        student?.ref,
        student?.profile?.filename,
        student?.lastName,
        student?.firstName,
        student?.gender,
        student?.currentAcademy?.scores,
        _class?.grade?.subjects,
        user?.privilege,
        device,
        setDeleteDialog
      )
    })
    
    const filteredAttendances = studentData?.filter((elem) => _search.test(elem.tags))
    
    setStudentData(filteredAttendances.sort((a, b) => {
      if (_sort === 'desc') {
        if (b[_filter] < a[_filter]) return -1
        if (b[_filter] > a[_filter]) return 1
        return 0
      } else {
        if (a[_filter] < b[_filter]) return -1
        if (a[_filter] > b[_filter]) return 1
        return 0
      }
    }))

  }, [statusClass, _class, device, user, theme, queryParams, notify, dispatch, setDeleteDialog])

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
          onFilter={handleFilter}
          onSearch={handleSearch}
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
      <StickyTable columns={studentColumnData} rows={studentData} pagination={false} loading={loading} />
    </Container>
  )
}
