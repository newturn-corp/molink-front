import { observer } from 'mobx-react'
import React from 'react'
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@material-ui/core'
import DialogManager from '../manager/global/DialogManager'

export const DialogComponent: React.FC<{
  }> = observer(() => {
      return <Dialog
          className={'dialog'}
          open={DialogManager.showDialog}
          onClose={() => DialogManager.onClose(-1)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
      >
          <DialogTitle
              id="alert-dialog-title"
              className={'dialog-title'}
          >
              {DialogManager.title}
          </DialogTitle>
          <DialogContent
              className={'dialog-content'}
          >
              <pre>
                  {DialogManager.description}
              </pre>
              {/* <DialogContentText id="alert-dialog-description"> */}
              {/*      */}
              {/* </DialogContentText> */}
          </DialogContent>
          <DialogActions>
              {
                  DialogManager.buttonTexts.map((text, index) =>
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
