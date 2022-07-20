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
  const [classes, setClasses] = useState([])
  const [sortObj, setSortObj] = useState({
    name: false,
    createdAt: false,
    room: false,
    schedule: false,
    totalApplied: false,
    isActive: false,
    startedAt: false,
  })

  const handleChangeFilter = ({ filter }) => {
    setSortObj({ ...sortObj, [filter]: !sortObj[filter] })
    return handleFilter({ filter, asc: sortObj[filter] })
  }

  const FilterOption = () => {
    return <>
      <MenuItem onClick={() => handleChangeFilter({ filter: 'name' })}><SortIcon asc={sortObj.name} /> By Name</MenuItem>
      <MenuItem onClick={() => handleChangeFilter({ filter: 'createdAt' })}><SortIcon asc={sortObj.createdAt} /> By Date Created</MenuItem>
      <MenuItem onClick={() => handleChangeFilter({ filter: 'room' })}><SortIcon asc={sortObj.room} /> By Room</MenuItem>
      <MenuItem onClick={() => handleChangeFilter({ filter: 'schedule' })}><SortIcon asc={sortObj.schedule} /> By Schedule</MenuItem>
      <MenuItem onClick={() => handleChangeFilter({ filter: 'totalApplied' })}><SortIcon asc={sortObj.totalApplied} /> By Total Applied</MenuItem>
      <MenuItem onClick={() => handleChangeFilter({ filter: 'isActive' })}><SortIcon asc={sortObj.isActive} /> By Active</MenuItem>
      <MenuItem onClick={() => handleChangeFilter({ filter: 'startedAt' })}><SortIcon asc={sortObj.startedAt} /> By Date Started</MenuItem>
    </>
  }

  useEffect(() => {
    const newClasses = data.map((role) => {
      return {
        _id: role._id,
        name: JSON.stringify(role.name)?.replace(/"/g, '""'),
        description: role.description,
        privilege: JSON.stringify(role.privilege)?.replace(/"/g, '""'),
      }
    })
    setClasses(newClasses)
  }, [data])

  return (
    <DefaultHeader
      exportData={classes}
      styled={styled}
      navigate={navigate}
      handleSearch={handleSearch}
      handleImport={handleImport}
      excelHeader={headerColumns}
      breadcrumb={<AdminBreadcrumbs page='class' />}
      createUrl='/school/class/create'
      filename='classes'
      filterOption={<FilterOption />}
    />
  )
}
