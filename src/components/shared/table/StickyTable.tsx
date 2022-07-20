import * as React from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import useTheme from 'hooks/useTheme'
import useWeb from 'hooks/useWeb'
import Loading from '../Loading'
import { CustomPagination, CustomTableContainer } from 'styles'
import ToggleOnIcon from '@mui/icons-material/ToggleOn'
import ToggleOffIcon from '@mui/icons-material/ToggleOff'
import { IconButton } from '@mui/material'

export interface ITableColumn<Column> {
  id: Column
  label: string
  minWidth?: number
  maxWidth?: number
  align?: 'left' | 'right' | 'center'
  format?: (value: any) => any
}

interface ITable {
  pagination?: Boolean
  columns: ITableColumn<string>[]
  rows: any[]
  loading?: boolean
  handleClick?: (id) => void
  style?: React.CSSProperties
}

export const StickyTable = ({
  pagination = true,
  columns,
  rows,
  loading,
  handleClick,
  style,
}: ITable) => {
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(10)
  const { theme } = useTheme()
  const { device } = useWeb()

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  return (
    <CustomTableContainer styled={theme} device={device} style={style}>
      <div className='table-container'>
        {loading && <Loading />}
        <TableContainer className='table'>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    style={{
                      minWidth: column.minWidth,
                      maxWidth: column.maxWidth,
                    }}
                    key={column.id}
                    align={column.align}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            {rows?.length > 0 && (
              !loading && pagination ? (
                <TableBody>
                  {rows
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                      return (
                        <TableRow
                          onClick={() => {
                            handleClick && handleClick(row.id)
                          }}
                          hover
                          role='checkbox'
                          tabIndex={-1}
                          key={row.id || index}
                          style={{
                            cursor: handleClick ? 'pointer' : 'default',
                          }}
                        >
                          {columns.map((column) => {
                            let value = row[column.id]
                            if (typeof value === 'boolean') {
                              value = value ? (
                                <IconButton
                                  size='small'
                                  style={{ color: theme.color.success }}
                                >
                                  <ToggleOnIcon style={{ fontSize: 30 }} />
                                </IconButton>
                              ) : (
                                <IconButton
                                  size='small'
                                  style={{ color: theme.color.error }}
                                >
                                  <ToggleOffIcon style={{ fontSize: 30 }} />
                                </IconButton>
                              )
                            }

                            return (
                              <TableCell
                                key={column.id}
                                align={column.align}
                                style={{
                                  minWidth: column.minWidth,
                                  maxWidth: column.maxWidth,
                                }}
                              >
                                {column.format && typeof value === 'number'
                                  ? column.format(value)
                                  : value}
                              </TableCell>
                            )
                          })}
                        </TableRow>
                      )
                    })}
                </TableBody>
              ) : (
                <TableBody>
                  {rows.map((row, index) => {
                    return (
                      <TableRow
                        onClick={() => {
                          handleClick && handleClick(row.id)
                        }}
                        hover
                        role='checkbox'
                        tabIndex={-1}
                        key={row.id || index}
                        style={{ cursor: handleClick ? 'pointer' : 'default' }}
                      >
                        {columns.map((column) => {
                          let value = row[column.id]
                          if (typeof value === 'boolean') {
                            value = value ? (
                              <IconButton
                                size='small'
                                style={{ color: theme.color.success }}
                              >
                                <ToggleOnIcon style={{ fontSize: 30 }} />
                              </IconButton>
                            ) : (
                              <IconButton
                                size='small'
                                style={{ color: theme.color.error }}
                              >
                                <ToggleOffIcon style={{ fontSize: 30 }} />
                              </IconButton>
                            )
                          }

                          return (
                            <TableCell
                              key={column.id}
                              align={column.align}
                              style={{
                                minWidth: column.minWidth,
                                maxWidth: column.maxWidth,
                              }}
                            >
                              {column.format && typeof value === 'number'
                                ? column.format(value)
                                : value}
                            </TableCell>
                          )
                        })}
                      </TableRow>
                    )
                  })}
                </TableBody>
              )
            )}
          </Table>
        </TableContainer>
      </div>
      {!loading && pagination && (
        <CustomPagination styled={theme}>
          <TablePagination
            rowsPerPageOptions={[10, 25, 50, 100]}
            component='div'
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </CustomPagination>
      )}
    </CustomTableContainer>
  )
}