import React from 'react'
import { LibraryAdd } from '@material-ui/icons'
import { observer } from 'mobx-react'
import { IconButton } from '@material-ui/core'
import ContentManager from '../../manager/ContentManager'
import UserManager from '../../manager/global/UserManager'

export const CollectButton: React.FC<{
  }> = observer(() => {
      //   const [showDialog, setShowDialog] = useState(false)
      if (!UserManager.isUserAuthorized || !ContentManager.openedDocument || ContentManager.openedDocument.meta.userId === UserManager.profile.userId) {
          return <></>
      }

      return <>
          <div className='share-button'>
              <IconButton onClick={() => {
                  ContentManager.openedDocument.collect()
              }}>
                  <LibraryAdd/>
              </IconButton>
          </div>
          {/* <Dialog
              open={showDialog}
              onClose={() => setShowDialog(false)}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
          >
              <DialogTitle id="alert-dialog-title">{'테스트'}</DialogTitle>
              <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                      {DialogManager.description}
                  </DialogContentText>
              </DialogContent>
              <DialogActions>
                  {
                      DialogManager.buttenTexts.map((text, index) =>
                          <Button key={Math.random()} onClick={() => DialogManager.onClose(index)} color="primary">
                              {text}
                          </Button>)
                  }
              </DialogActions>
          </Dialog> */}
      </>
  })
