import { AlertDialog } from 'components/shared/table/AlertDialog'
import { TextTitle } from 'components/shared/TextTitle'

export const AchievementDialog = ({
  dialog,
  setDialog,
  rowData,
}: any) => {
  const handleCloseDialog = () => {
    setDialog({ ...dialog, open: false })
  }
  
  return (
    <AlertDialog
      isOpen={dialog.open}
      handleClose={handleCloseDialog}
    >
      <TextTitle title='Achievement Form' />
      
    </AlertDialog>
  )
}
