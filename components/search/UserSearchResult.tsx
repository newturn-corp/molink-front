import { observer } from 'mobx-react'
import React from 'react'
import { ListItem, ListItemAvatar, Avatar, ListItemText } from '@material-ui/core'
import SearchManager from '../../manager/SearchManager'

export const UserSearchResult: React.FC<{
    id: number
    nickname: string
    profileImageUrl: string | null
    biography: string
  }> = observer(({ id, nickname, profileImageUrl, biography }) => {
      const profileImageSrc = profileImageUrl || undefined
      const profileInnerText = profileImageUrl ? undefined : nickname[0]

      const handleClick = () => {
          SearchManager.moveBySearchResult(id)
      }

      return <ListItem alignItems="flex-start" className='user-search-result' onClick={() => handleClick()}>
          <ListItemAvatar>
              <Avatar sizes='40' src={profileImageSrc}>{profileInnerText}</Avatar>
          </ListItemAvatar>
          <ListItemText
              primary={nickname}
              secondary={
                  <React.Fragment>
                      {biography}
                  </React.Fragment>
              }
          />
      </ListItem>
  })
