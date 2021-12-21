import { observer } from 'mobx-react'
import React from 'react'
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@material-ui/core'
import DialogManager from '../manager/DialogManager'

export const DialogComponent: React.FC<{
  }> = observer(() => {
      const handleClose = () => {
          DialogManager.showDialog = false
          DialogManager.onClose()
      }

      return <Dialog
          open={DialogManager.showDialog}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
      >
          <DialogTitle id="alert-dialog-title">{DialogManager.title}</DialogTitle>
          <DialogContent>
              <DialogContentText id="alert-dialog-description">
                  {DialogManager.description}
              </DialogContentText>
          </DialogContent>
          <DialogActions>
              <Button onClick={handleClose} color="primary">
          이전
              </Button>
          </DialogActions>
      </Dialog>
  })
