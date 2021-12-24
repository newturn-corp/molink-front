import { observer } from 'mobx-react'
import React from 'react'
import { ListItem, ListItemAvatar, Avatar, ListItemText } from '@material-ui/core'
import SearchManager from '../../manager/SearchManager'

export const UserSearchResult: React.FC<{
    id: number
    nickname: string
  }> = observer(({ id, nickname }) => {
      const handleClick = () => {
          SearchManager.moveBySearchResult(id)
      }

      return <ListItem alignItems="flex-start" className='user-search-result' onClick={() => handleClick()}>
          <ListItemAvatar>
              <Avatar alt={nickname} />
          </ListItemAvatar>
          <ListItemText
              primary={nickname}
              //   secondary={
              //       <React.Fragment>
              //           {'테스트 텍스트 테스트 텍스트'}
              //       </React.Fragment>
              //   }
          />
      </ListItem>
  })
