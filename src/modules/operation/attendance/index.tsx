
import Container from 'components/shared/Container'
import { StickyTable } from 'components/shared/table/StickyTable'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import { useEffect, useState } from 'react'
import { debounce } from 'utils'
import { useSearchParams } from 'react-router-dom'
import { Data, createData, columnData } from './constant'
import { getListClass, selectListClass } from 'modules/school/class/redux'
import FactCheckRoundedIcon from '@mui/icons-material/FactCheckRounded'
import useLanguage from 'hooks/useLanguage'
import useAuth from 'hooks/useAuth'
import useTheme from 'hooks/useTheme'
import Breadcrumb from 'components/shared/Breadcrumbs'
import { SearchField } from 'components/shared/table/SearchField'
import { FilterButton } from 'components/shared/table/FilterButton'
import { MenuList } from '@mui/material'

const Header = ({ onSearch }) => {
  const stages = [
    {
      title: 'Operation',
      path: '/operation',
    },
    {
      title: 'Attendance',
    }
  ]

  return <>
    <Breadcrumb stages={stages} title={<FactCheckRoundedIcon />} />
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <SearchField onChange={(e) => onSearch(e)} />
      <FilterButton style={{ marginLeft: 10 }}>
        <MenuList>Sort By Name</MenuList>
        <MenuList>Sort By Date</MenuList>
      </FilterButton>
    </div>
  </>
}

export const Classes = () => {
  const { lang } = useLanguage()
  const { user } = useAuth()
  const { theme } = useTheme()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [rowData, setRowData] = useState<Data[]>([])
  const { data: classes, status } = useAppSelector(selectListClass)
  const [queryParams, setQueryParams] = useSearchParams()
  const [loading, setLoading] = useState(status === 'LOADING' ? true : false)

  const updateQuery = debounce((value) => {
    setLoading(false)
    setQueryParams({ search: value })
  }, 300)

  const handleSearch = (e) => {
    updateQuery(e.target.value)
  }
  
  useEffect(() => {
    dispatch(getListClass({ query: queryParams }))
  }, [dispatch, queryParams])

  useEffect(() => {
    if (status !== 'SUCCESS') return

    const mappedClasses = classes?.map((_class: any) => {
      return createData(
        _class._id,
        _class.name?.[lang] || _class.name?.['English'],
        _class.room,
        _class.schedule,
        _class.students?.length,
        _class.attendance?.checkedIn,
        _class.attendance?.checkedOut,
        _class.grade?.name?.[lang] || _class.grade?.name?.['English'],
        `${_class.teacher?.lastName} ${_class.teacher?.firstName}`,
        _class.isActive,
        user?.privilege,
        theme,
        navigate,
      )
    })

    setRowData(mappedClasses)
  }, [classes, status, lang, navigate, theme, user])
  

  return (
    <Container
      header={<Header onSearch={handleSearch} />}
    >
      <StickyTable columns={columnData} rows={rowData} loading={loading} />
    </Container>
  )
}

export { Attendance } from './Attendance'
