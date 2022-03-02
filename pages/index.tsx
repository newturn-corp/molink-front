import React, { useEffect } from 'react'

import { observer } from 'mobx-react'
import RoutingManager, { Page } from '../manager/global/RoutingManager'
import UserManager from '../manager/global/User/UserManager'

const Index = observer(() => {
    useEffect(() => {
        UserManager.load()
            .then(async () => {
                if (UserManager.isUserAuthorized) {
                    await RoutingManager.moveTo(Page.Blog, `/${UserManager.profile.nickname}`)
                } else {
                    await RoutingManager.moveTo(Page.SignIn)
                }
            })
    }, [])
    return <>
    </>
})

export default Index
