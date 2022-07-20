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
  const [roles, setStudents] = useState([])
  const [sortObj, setSortObj] = useState({
    lastName: false,
    firstName: false,
    createdAt: false,
    dateOfBirth: false
  })

  const handleChangeFilter = ({ filter }) => {
    setSortObj({ ...sortObj, [filter]: !sortObj[filter] })
    return handleFilter({ filter, asc: sortObj[filter] })
  }

  const FilterOption = () => {
    return <>
      <MenuItem onClick={() => handleChangeFilter({ filter: 'lastName' })}><SortIcon asc={sortObj.lastName} /> By LastName</MenuItem>
      <MenuItem onClick={() => handleChangeFilter({ filter: 'firstName' })}><SortIcon asc={sortObj.firstName} /> By FirstName</MenuItem>
      <MenuItem onClick={() => handleChangeFilter({ filter: 'createdAt' })}><SortIcon asc={sortObj.createdAt} /> By Date</MenuItem>
      <MenuItem onClick={() => handleChangeFilter({ filter: 'dateOfBirth' })}><SortIcon asc={sortObj.dateOfBirth} /> By BirthDate</MenuItem>
    </>
  }

  useEffect(() => {
    const newStudents = data.map((role) => {
      return {
        _id: role._id,
        name: JSON.stringify(role.name)?.replace(/"/g, '""'),
        description: role.description,
        privilege: JSON.stringify(role.privilege)?.replace(/"/g, '""'),
      }
    })
    setStudents(newStudents)
  }, [data])

  return (
    <DefaultHeader
      exportData={roles}
      styled={styled}
      navigate={navigate}
      handleSearch={handleSearch}
      handleImport={handleImport}
      excelHeader={headerColumns}
      breadcrumb={<AdminBreadcrumbs page='student' />}
      createUrl='/school/student/create'
      filename='roles'
      filterOption={<FilterOption />}
    />
  )
}
