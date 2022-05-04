import React, { useEffect, useState } from 'react'
import { observer } from 'mobx-react'
import { Header } from '../../components/global/Header/Header'
import { Avatar } from '@material-ui/core'
import RoutingManager, { Page } from '../../manager/global/RoutingManager'
import { Progress } from 'antd'
import { SettingCategory } from '../../components/setting/SettingCategory'
import UserManager from '../../manager/global/User/UserManager'

const SettingProfile = observer(() => {
    useEffect(() => {
        UserManager.load()
            .then(() => {
                if (!UserManager.isUserAuthorized) {
                    RoutingManager.moveTo(Page.SignIn)
                }
            })
    }, [])
    const maxTotalUploadLimit = 104857600 * 5
    const totalUploadLimit = UserManager.limit.totalUploadLimit
    const totalUsage = maxTotalUploadLimit - totalUploadLimit
    const leftTotalSpaceMB = (totalUploadLimit / 1048576).toFixed(1)
    console.log(totalUsage)
    const maxDailyUploadLimit = 104857600
    const dailyUploadLimit = UserManager.limit.dailyUploadLimit
    const dailyUsage = maxDailyUploadLimit - dailyUploadLimit
    const leftDailySpaceMB = (dailyUploadLimit / 1048576).toFixed(1)
    console.log(dailyUsage)
    return <div className='setting-page' onClick={() => {
    } } >
        <Header />
        <div className={'index-body'}>
            <div className='core'>
                <div className='setting-meta'>
                    <SettingCategory/>
                </div>
                <div className='setting-list'>
                    <div className={'total-upload-limit'}>
                        <p className='setting-name'>총 저장 공간</p>
                        <Progress
                            style={{
                                width: 400,
                                height: 50
                            }}
                            percent={totalUsage / maxTotalUploadLimit * 100}
                            format={v => `500MB 중 ${leftTotalSpaceMB}MB 남음`}/>
                    </div>
                    <div className={'daily-upload-limit'}>
                        <p className='setting-name'>일일 사용량</p>
                        <Progress
                            style={{
                                width: 400,
                                height: 50
                            }}
                            percent={dailyUsage / maxDailyUploadLimit * 100}
                            format={v => `100MB 중 ${leftDailySpaceMB}MB 남음`}/>
                    </div>
                </div>
            </div>
        </div>
    </div>
})

export default SettingProfile
