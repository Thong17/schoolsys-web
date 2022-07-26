import {
  MenuItem,
  Select,
  SelectProps,
  CircularProgress,
  ListSubheader,
  TextField,
  InputAdornment,
} from '@mui/material'
import useTheme from 'hooks/useTheme'
import useWeb from 'hooks/useWeb'
import {
  forwardRef,
  InputHTMLAttributes,
  ForwardRefRenderFunction,
  useState,
  useMemo,
} from 'react'
import { CustomMiniSelect, CustomSelect } from 'styles'
import SearchIcon from '@mui/icons-material/Search'

export interface IOptions {
  value: any
  label: string
  selected?: boolean
  display?: string
}

interface ISelectField extends SelectProps {
  options: Array<IOptions>
  name?: string
  value?: string | Array<string>
  label?: string
  err?: string
  hint?: string
  loading?: boolean
  search?: boolean
}

const containsText = (text, searchText) => {
  return text.toLowerCase().indexOf(searchText.toLowerCase()) > -1
}

const Input: ForwardRefRenderFunction<
  InputHTMLAttributes<HTMLSelectElement>,
  ISelectField
> = ({ options, name, value, label, err, hint, loading, search = true, ...props }, ref) => {
  const { theme } = useTheme()
  const { device } = useWeb()

  const [searchText, setSearchText] = useState('')
  const displayedOptions = useMemo(
    () => options.map((option) => !containsText(option.label, searchText) ? { ...option, display: 'none' } : option),
    [searchText, options]
  )

  return (
    <CustomSelect
      styled={theme}
      device={device}
      active={value !== '' ? 'active' : undefined}
    >
      <Select
        value={value}
        ref={ref}
        id={name}
        name={name}
        className={err && 'input-error'}
        onClose={() => setSearchText('')}
        MenuProps={{
          autoFocus: false,
          sx: {
            '& .MuiPaper-root': {
              backgroundColor: theme.background.primary,
              color: theme.text.primary,
              '& .MuiList-root': {
                maxHeight: 300
              },
              '& .MuiListSubheader-root': {
                backgroundColor: theme.background.primary,
                '& .MuiOutlinedInput-input, & .MuiSvgIcon-root': {
                  color: theme.text.secondary,
                },
                '& .MuiOutlinedInput-root': {
                  border: theme.border.quaternary,
                  height: 37,
                  borderRadius: theme.radius.primary,
                  paddingLeft: 1,
                  '&:hover': {
                    border: theme.border.tertiary,
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    border: 'none',
                  },
                },
              },
            },
          },
        }}
        {...props}
      >
        {search && <ListSubheader>
          <TextField
            size='small'
            autoFocus
            placeholder='Type to search...'
            fullWidth
            onChange={(e) => setSearchText(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            onKeyDown={(e) => {
              if (e.key !== 'Escape') {
                e.stopPropagation()
              }
            }}
          />
        </ListSubheader>}
        {!loading ? (
          displayedOptions.map((item, index) => {
            return (
              <MenuItem key={index} value={item.value} style={{ display: item.display || 'block' }}>
                {item.label}
              </MenuItem>
            )
          })
        ) : (
          <CircularProgress />
        )}
      </Select>
      <label htmlFor={name}>{label}</label>
      <div className='err'>{err}</div>
      <div className='hint'>{hint}</div>
    </CustomSelect>
  )
}

const MiniInput: ForwardRefRenderFunction<
  InputHTMLAttributes<HTMLSelectElement>,
  ISelectField
> = ({ options, name, value, label, err, hint, loading, search = true, ...props }, ref) => {
  const { theme } = useTheme()
  const { device } = useWeb()

  const [searchText, setSearchText] = useState('')
  const displayedOptions = useMemo(
    () => options.map((option) => !containsText(option.label, searchText) ? { ...option, display: 'none' } : option),
    [searchText, options]
  )

  return (
    <CustomMiniSelect
      styled={theme}
      device={device}
      active={value !== '' ? 'active' : undefined}
    >
      <Select
        value={value}
        ref={ref}
        id={name}
        name={name}
        className={err && 'input-error'}
        onClose={() => setSearchText('')}
        MenuProps={{
          autoFocus: false,
          sx: {
            '& .MuiPaper-root': {
              backgroundColor: theme.background.primary,
              color: theme.text.primary,
              '& .MuiList-root': {
                maxHeight: 300
              },
              '& .MuiListSubheader-root': {
                backgroundColor: theme.background.primary,
                '& .MuiOutlinedInput-input, & .MuiSvgIcon-root': {
                  color: theme.text.secondary,
                },
                '& .MuiOutlinedInput-root': {
                  border: theme.border.quaternary,
                  height: 37,
                  borderRadius: theme.radius.primary,
                  paddingLeft: 1,
                  '&:hover': {
                    border: theme.border.tertiary,
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    border: 'none',
                  },
                },
              },
            },
          },
        }}
        {...props}
      >
        {search && <ListSubheader>
          <TextField
            size='small'
            autoFocus
            placeholder='Type to search...'
            fullWidth
            onChange={(e) => setSearchText(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            onKeyDown={(e) => {
              if (e.key !== 'Escape') {
                e.stopPropagation()
              }
            }}
          />
        </ListSubheader>}
        {!loading ? (
          displayedOptions.map((item, index) => {
            return (
              <MenuItem key={index} value={item.value} style={{ display: item.display || 'block' }}>
                {item.label}
              </MenuItem>
            )
          })
        ) : (
          <CircularProgress />
        )}
      </Select>
      <label htmlFor={name}>{label}</label>
      <div className='err'>{err}</div>
      <div className='hint'>{hint}</div>
    </CustomMiniSelect>
  )
}

const SelectField = forwardRef(Input)
const MiniSelectField = forwardRef(MiniInput)
export { SelectField, MiniSelectField }
