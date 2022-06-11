import React from 'react'
import { observer } from 'mobx-react'
import { UploadLimitComponent } from '../../../setting/FileUpload/UploadLimitComponent'
import LanguageManager from '../../../../manager/global/LanguageManager'
import UserManager from '../../../../manager/global/User/UserManager'

export const SettingFileUploadComponent: React.FC<{
}> = observer(() => {
    const {
        maxTotalUploadLimit,
        totalUploadLimit,
        maxDailyUploadLimit,
        dailyUploadLimit
    } = UserManager.limit
    return <>
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
    </>
})
