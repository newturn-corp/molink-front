import { observer } from 'mobx-react'
import React from 'react'
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@material-ui/core'
import DialogManager from '../manager/global/DialogManager'

export const DialogComponent: React.FC<{
  }> = observer(() => {
      return <Dialog
          open={DialogManager.showDialog}
          onClose={() => DialogManager.onClose(-1)}
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
              {
                  DialogManager.buttenTexts.map((text, index) =>
                      <Button key={Math.random()} onClick={(e) => {
                          e.stopPropagation()
                          DialogManager.onClose(index)
                      }} color="primary">
                          {text}
                      </Button>)
              }
          </DialogActions>
      </Dialog>
  })
