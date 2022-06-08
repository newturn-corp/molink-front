import React, { useEffect, useState } from 'react'
import { observer } from 'mobx-react'
import { Header } from '../../components/global/Header/Header'
import { Avatar } from '@material-ui/core'
import RoutingManager, { Page } from '../../manager/global/RoutingManager'
import { Progress } from 'antd'
import { SettingCategory } from '../../components/setting/SettingCategory'
import UserManager from '../../manager/global/User/UserManager'
import LanguageManager from '../../manager/global/LanguageManager'
import { UploadLimitComponent } from '../../components/setting/FileUpload/UploadLimitComponent'

const SettingProfile = observer(() => {
    useEffect(() => {
        UserManager.load()
            .then(() => {
                if (!UserManager.isUserAuthorized) {
                    RoutingManager.moveTo(Page.SignIn)
                }
            })
    }, [])
    const {
        maxTotalUploadLimit,
        totalUploadLimit,
        maxDailyUploadLimit,
        dailyUploadLimit
    } = UserManager.limit
    return <div className='setting-page' onClick={() => {
    } } >
        <Header />
        <div className={'index-body'}>
            <div className='core'>
                <div className='setting-meta'>
                    <SettingCategory/>
                </div>
                <div className='setting-list'>
                    <UploadLimitComponent
                        settingName={LanguageManager.languageMap.TotalFileSpace}
                        max={maxTotalUploadLimit}
                        left={totalUploadLimit}
                    />
                    <UploadLimitComponent
                        settingName={LanguageManager.languageMap.DailyFileSpace}
                        max={maxDailyUploadLimit}
                        left={dailyUploadLimit}
                    />
                </div>
            </div>
        </div>
    </div>
})

export default SettingProfile
