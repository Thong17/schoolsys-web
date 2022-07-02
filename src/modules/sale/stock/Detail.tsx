import { ProductInfo } from 'components/shared/ProductInfo'
import { AlertDialog } from 'components/shared/table/AlertDialog'
import { CustomDetailContainer } from 'styles/container'

export const Detail = ({
  theme,
  dialog,
  setDialog,
  defaultValues,
}: any) => { 
  const handleCloseDialog = () => {
    setDialog({ ...dialog, stockId: null, open: false })
  }

  return (
    <AlertDialog
      isOpen={dialog.open}
      handleClose={handleCloseDialog}
    >
      <CustomDetailContainer styled={theme}>
        <ProductInfo info={defaultValues} />
        <div className="detail">

        </div>
      </CustomDetailContainer>
    </AlertDialog>
  )
}
