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
  const [roles, setTeachers] = useState([])
  const [sortObj, setSortObj] = useState({
    lastName: false,
    firstName: false,
    createdAt: false,
    birthDate: false
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
      <MenuItem onClick={() => handleChangeFilter({ filter: 'birthDate' })}><SortIcon asc={sortObj.birthDate} /> By BirthDate</MenuItem>
    </>
  }

  useEffect(() => {
    const newTeachers = data.map((role) => {
      return {
        _id: role._id,
        name: JSON.stringify(role.name)?.replace(/"/g, '""'),
        description: role.description,
        privilege: JSON.stringify(role.privilege)?.replace(/"/g, '""'),
      }
    })
    setTeachers(newTeachers)
  }, [data])

  return (
    <DefaultHeader
      exportData={roles}
      styled={styled}
      navigate={navigate}
      handleSearch={handleSearch}
      handleImport={handleImport}
      excelHeader={headerColumns}
      breadcrumb={<AdminBreadcrumbs page='teacher' />}
      createUrl='/school/teacher/create'
      filename='teachers'
      filterOption={<FilterOption />}
    />
  )
}
