import React from 'react'
import { observer } from 'mobx-react'
import { IconButton, Menu, MenuItem } from '@material-ui/core'
import { LockRounded, Public, EmojiPeople } from '@material-ui/icons'
import { DocumentVisibility } from '../../../domain/renew/Document'
import ContentManager from '../../../manager/renew/ContentManager'

const VisibilityIcon: React.FC<{
    visibility: DocumentVisibility
}> = ({ visibility }) => {
    switch (visibility) {
    case DocumentVisibility.Private:
        return <LockRounded className='private-icon' />
    case DocumentVisibility.Public:
        return <Public className='public-icon' />
    case DocumentVisibility.OnlyFriend:
        return <EmojiPeople className='only-friend-icon'/>
    default:
        throw new Error('unhandled network status')
    }
}

export const Visibility: React.FC<{
  }> = observer(() => {
      const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
      const open = Boolean(anchorEl)

      if (!ContentManager.openedDocument || !ContentManager.openedDocument.authority.editable) {
          return <></>
      }

      const handleClick = (event: React.MouseEvent<HTMLElement>) => {
          setAnchorEl(event.currentTarget)
      }

      const handleClose = (key: DocumentVisibility) => {
          if (key !== ContentManager.openedDocument.meta.visibility) {
              ContentManager.openedDocument.changeDocumentVisibility(key)
          }
          setAnchorEl(null)
      }

      return <div className='visibility-container'>
          <IconButton
              aria-label="more"
              aria-controls="long-menu"
              aria-haspopup="true"
              onClick={handleClick}
          >
              <VisibilityIcon visibility={ContentManager.openedDocument.meta.visibility}/>
          </IconButton>
          <Menu
              id="long-menu"
              anchorEl={anchorEl}
              keepMounted
              open={open}
              onClose={(event) => handleClose(null)}
              PaperProps={{
                  style: {
                      maxHeight: 48 * 4.5,
                      width: '20ch'
                  }
              }}
          >
              <MenuItem key={'public'} onClick={(event) => handleClose(DocumentVisibility.Public)}>
                  {'전체 공개'}
              </MenuItem>
              <MenuItem key={'only_friend'} onClick={(event) => handleClose(DocumentVisibility.OnlyFriend)}>
                  {'친구만'}
              </MenuItem>
              <MenuItem key={'private'} onClick={(event) => handleClose(DocumentVisibility.Private)}>
                  {'비공개'}
              </MenuItem>
          </Menu>
      </div>
  })
