import { observer } from 'mobx-react'
import React from 'react'
import { ListItem, ListItemAvatar, Avatar, ListItemText } from '@material-ui/core'

export const UserSearchResult: React.FC<{
    nickname: string
  }> = observer(({ nickname }) => {
      const handleClick = () => {
          console.log(nickname)
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
