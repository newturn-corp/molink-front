import React, { useEffect } from 'react'

import { observer } from 'mobx-react'
import { MobileHeader } from '../../components/mobile/MobileHeader'
import RoutingManager from '../../manager/global/RoutingManager'
import ArrowLeftIcon from 'public/image/icon/arrow-left.svg'
import { SiteHead } from '../../components/global/SiteHead'

const Support = observer(() => {
    return <>
        <SiteHead/>
        {/* <MobileHeader/> */}
        <div
            className={'support-header'}
        >
            <div
                className={'title'}
            >
                타이틀
            </div>
            <div
                className={'back-button'}
                onClick={() => RoutingManager.back()}
            >
                <ArrowLeftIcon/>
            </div>
        </div>
    </>
})

export default Support
