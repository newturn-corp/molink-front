import React from 'react'
import { observer } from 'mobx-react'
import { MobileColumnDrawer } from '../../../utils/MobileColumeDrawer/MobileColumnDrawer'
import UserManager from '../../../../manager/global/User/UserManager'
import RoutingManager from '../../../../manager/global/RoutingManager'

export const PrivacyAndTermsButton: React.FC<{
}> = observer(() => {
    return (
        <div
            className={'privacy-and-terms-container'}
        >
            <div
                className={'text'}
                onClick={async () => {
                    await RoutingManager.rawMoveTo('https://www.molink.life/blog/Molink/4629add3ae7d9971bc539427afd127ad/%EC%9D%B4%EC%9A%A9%20%EC%95%BD%EA%B4%80', true)
                }}
            >
                {'이용 약관'}
            </div>
            <div
                className={'text'}
            >
                {'·'}
            </div>
            <div
                className={'text'}
                onClick={async () => {
                    await RoutingManager.rawMoveTo('https://www.molink.life/blog/Molink/43a7cfacb97e8d9a94aa8b8f0e9325e3/%EB%89%B4%ED%84%B4%EC%BD%94%ED%8D%BC%EB%A0%88%EC%9D%B4%EC%85%98%20%EA%B0%9C%EC%9D%B8%EC%A0%95%EB%B3%B4%20%EC%B2%98%EB%A6%AC%EB%B0%A9%EC%B9%A8', true)
                }}
            >
                {'개인정보 처리 방침'}
            </div>
        </div>
    )
})
