import React from 'react'
import { observer } from 'mobx-react'
import { FollowRequestComponent } from './FollowRequestComponent'
import { FollowRequest } from '@newturn-develop/types-molink'

export const FollowRequests: React.FC<{
    requests: FollowRequest[]
}> = observer(({ requests }) => {
    if (requests.filter(req => !req.isHandled).length === 0) {
        return <></>
    }
    return <>
        <p className='label'>팔로우 요청</p>
        {
            requests.map(req => {
                return <FollowRequestComponent key={'follow-request-' + req.id} followRequest={req}/>
            })
        }
    </>
})
