import React from 'react'
import { observer } from 'mobx-react'
import NewUserManager from '../../../manager/global/NewUserManager'
import { Avatar } from '@material-ui/core'
import Identicon from 'identicon.js'
import crypto from 'crypto'

export const HierarchyName: React.FC<{
}> = observer(() => {
    return (
        <>
            <div className={'hierarchy-name'}>
                <Avatar className='profile-image' sizes='32' src={`data:image/png;base64,${
                    new Identicon(
                        crypto.createHash('sha512')
                            .update(NewUserManager.profile ? NewUserManager.profile.nickname : '테스트')
                            .digest('base64'), {
                            size: 64,
                            foreground: [58, 123, 191, 255]
                        }).toString()}`}></Avatar>
                <div className='text'>
                    {'Molink의 공간'}
                </div>
            </div>
            <div className={'divider'}>

            </div>
        </>
    )
})
