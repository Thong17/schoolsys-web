import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded'
import { MenuDialog } from '../MenuDialog'
import { CustomDownloadButton } from 'styles'
import useTheme from 'hooks/useTheme'

export const DownloadButton = ({ children, ...props }) => {
  const { theme } = useTheme()

  return <CustomDownloadButton styled={theme} {...props}>
    <MenuDialog 
      label={<DownloadRoundedIcon />}
    >
      {children}
    </MenuDialog> 
  </CustomDownloadButton>
}
