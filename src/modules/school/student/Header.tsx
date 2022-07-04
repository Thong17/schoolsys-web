import AdminBreadcrumbs from '../components/Breadcrumbs'
import { useEffect, useState } from 'react'
import { headerColumns } from './constant'
import { DefaultHeader } from 'components/shared/table/DefaultHeader'

export const Header = ({
  data,
  styled,
  navigate,
  handleSearch,
  handleImport,
}) => {
  const [roles, setStudents] = useState([])

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
    />
  )
}
