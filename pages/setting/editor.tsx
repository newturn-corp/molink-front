import React, { useEffect, useState } from 'react'
import { observer } from 'mobx-react'
import { Header } from '../../components/global/Header/Header'
import { Avatar, Checkbox, FormControlLabel, FormGroup } from '@material-ui/core'
import RoutingManager, { Page } from '../../manager/global/RoutingManager'
import { Input } from 'antd'
import { SettingCategory } from '../../components/setting/SettingCategory'
import UserManager from '../../manager/global/User/UserManager'
import LanguageManager from '../../manager/global/LanguageManager'
import { BiographySetting } from '../../components/setting/Profile/BiographySetting'
import SettingPageComponent from '../../components/setting/SettingPageComponent'
import { ProfileImageSetting } from '../../components/setting/Profile/ProfileImageSetting'

const SettingEditorPageComponent = observer(() => {
    return <SettingPageComponent>
        <div className='profile'>
            <div>
                <p className='setting-name'>페이지 아이콘</p>
                <FormGroup aria-label="position" row>
                    {/* <FormControlLabel */}
                    {/*     value="follow-without-approve" */}
                    {/*     control={ */}
                    {/*         <Checkbox */}
                    {/*             checked={UserManager.setting.followWithoutApprove} */}
                    {/*             onChange={(event) => UserManager.setting.setFollowWithoutApprove(event.target.checked)} */}
                    {/*         /> */}
                    {/*     } */}
                    {/*     label="활성화" */}
                    {/* /> */}
                </FormGroup>
            </div>
        </div>
    </SettingPageComponent>
})

export default SettingEditorPageComponent
