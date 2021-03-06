import AdminBreadcrumbs from '../components/Breadcrumbs'
import { useEffect, useState } from 'react'
import { headerColumns } from './constant'
import { DefaultHeader } from 'components/shared/table/DefaultHeader'
import { MenuItem } from '@mui/material'
import { SortIcon } from 'components/shared/icons/SortIcon'

export const Header = ({
  data,
  styled,
  navigate,
  handleSearch,
  handleFilter,
  handleImport,
}) => {
  const [users, setUsers] = useState([])
  const [sortObj, setSortObj] = useState({
    username: false,
    createdAt: false,
    email: false,
  })

  const handleChangeFilter = ({ filter }) => {
    setSortObj({ ...sortObj, [filter]: !sortObj[filter] })
    return handleFilter({ filter, asc: sortObj[filter] })
  }

  const FilterOption = () => {
    return <>
      <MenuItem onClick={() => handleChangeFilter({ filter: 'username' })}><SortIcon asc={sortObj.username} /> By Username</MenuItem>
      <MenuItem onClick={() => handleChangeFilter({ filter: 'createdAt' })}><SortIcon asc={sortObj.createdAt} /> By Date Created</MenuItem>
      <MenuItem onClick={() => handleChangeFilter({ filter: 'email' })}><SortIcon asc={sortObj.email} /> By Email</MenuItem>
    </>
  }

  useEffect(() => {
    const newUsers = data.map((user) => {
      return {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role._id,
        config: user.config,
        profile: user.profile
      }
    })
    setUsers(newUsers)
  }, [data])

  return (
    <DefaultHeader
      exportData={users}
      styled={styled}
      navigate={navigate}
      handleSearch={handleSearch}
      handleImport={handleImport}
      excelHeader={headerColumns}
      breadcrumb={<AdminBreadcrumbs page='user' />}
      createUrl='/admin/user/create'
      filename='users'
      filterOption={<FilterOption />}
    />
  )
}
