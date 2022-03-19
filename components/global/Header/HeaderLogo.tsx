import React from 'react'
import { observer } from 'mobx-react'
import RoutingManager, { Page } from '../../../manager/global/RoutingManager'
// import Image from 'next/image'

export const HeaderLogo: React.FC<{
}> = observer(() => {
    return <div className='logo'>
        <img
            src={'/image/global/header/logo.png'}
            onClick={() => RoutingManager.moveTo(Page.Index)}
        />
    </div>
})
