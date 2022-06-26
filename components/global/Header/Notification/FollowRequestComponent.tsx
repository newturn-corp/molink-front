import React from 'react'
import { observer } from 'mobx-react'
import { Avatar, MenuItem } from '@material-ui/core'
import { getRelativeTime } from '../../../../utils/getRelativeTime'
import { FollowRequestInfo } from '@newturn-develop/types-molink'
import LanguageManager from '../../../../manager/global/LanguageManager'
import UserManager from '../../../../manager/global/User/UserManager'
import RoutingManager, { Page } from '../../../../manager/global/RoutingManager'

export const FollowRequestComponent: React.FC<{
    followRequest: FollowRequestInfo,
    index: number
  }> = observer(({ followRequest, index }) => {
      return <MenuItem>
          {/* <div className='notification-block'> */}
          {/*     <div className='avatar-part' */}
          {/*         onClick={() => RoutingManager.moveTo(Page.Blog, `/${followRequest.blogName}`)} */}
          {/*     > */}
          {/*         <Avatar className='img' sizes='32' src={followRequest.profileImgUrl}/> */}
          {/*     </div> */}
          {/*     <div> */}
          {/*         <div className='view-part'> */}
          {/*             <div className='msg-container'> */}
          {/*                 <div className='msg'><b>{followRequest.blogName}</b>{LanguageManager.languageMap.FollowRequestText}</div> */}
          {/*                 <p className='createdAt'>{getRelativeTime(followRequest.createdAt)}</p> */}
          {/*             </div> */}
          {/*         </div> */}
          {/*         <div className='interaction'> */}
          {/*             <div */}
          {/*                 className='button accept' */}
          {/*                 onClick={() => UserManager.follow.acceptFollowRequest(index)} */}
          {/*             >{LanguageManager.languageMap.Accept}</div> */}
          {/*             <div */}
          {/*                 className='button reject' */}
          {/*                 onClick={() => UserManager.follow.rejectFollowRequest(index)} */}
          {/*             >{LanguageManager.languageMap.Delete}</div> */}
          {/*         </div> */}
          {/*     </div> */}
          {/* </div> */}
      </MenuItem>
  })
