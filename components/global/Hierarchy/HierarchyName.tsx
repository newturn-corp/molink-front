import React from 'react'
import { observer } from 'mobx-react'
import { Avatar } from '@material-ui/core'
import Identicon from 'identicon.js'
import crypto from 'crypto'
import UserManager from '../../../manager/global/User/UserManager'

export const HierarchyName: React.FC<{
}> = observer(() => {
    return (
        <>
            <div className={'hierarchy-name'}>
                <Avatar
                    className='profile-image'
                    sizes='32'
                    src={`data:image/png;base64,${
                        new Identicon(
                            crypto.createHash('sha512')
                                .update(UserManager.profile.nickname)
                                .digest('base64'), {
                                size: 64,
                                foreground: [58, 123, 191, 255]
                            }).toString()}`}
                />
                <div
                    className='text'
                >
                    {'Molink의 공간'}
                </div>
            </div>
            <div className={'divider'}/>
        </>
    )
})
