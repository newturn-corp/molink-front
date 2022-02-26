import React from 'react'
import { observer } from 'mobx-react'
import { Header } from '../../components/global/Header/Header'
import { ButtonGroup, Button, List, Divider, Avatar, RadioGroup, Radio, FormControlLabel, FormGroup, Checkbox } from '@material-ui/core'
import { UserSearchResult } from '../../components/search/UserSearchResult'
import UserManager from '../../manager/global/UserManager'
import RoutingManager, { Page } from '../../manager/global/RoutingManager'
import { Input } from 'antd'
import { SettingButtonList } from '../../components/setting/SettingButtonList'

const SettingProfile = observer(() => {
    // const [value, setValue] = React.useState('female')
    //
    // const handleChange = (event) => {
    //     setValue(event.target.value)
    // }
    // UserManager.updateUserProfile()
    //     .then(() => {
    //         if (!UserManager.isUserAuthorized) {
    //             RoutingManager.moveTo(Page.SignIn)
    //         }
    //     })
    // if (!UserManager.isUserAuthorized) {
    //     return <></>
    // }

    return <div className='setting-page' onClick={() => {
    } } >
        <Header />
        <div className={'index-body'}>
            <div className='core'>
                <div className='setting-meta'>
                    <SettingButtonList/>
                </div>
                <div className='setting-list'>
                    <div>
                        <p className='setting-name'>팔로우 승인</p>
                        <FormGroup aria-label="position" row>
                            <FormControlLabel
                                value="follow-without-approve"
                                control={
                                    <Checkbox
                                        checked={UserManager.setting.followWithoutApprove}
                                        onChange={(event) => UserManager.setting.setFollowWithoutApprove(event.target.checked)}
                                    />
                                }
                                label="내 승인 없이 다른 사람이 나를 팔로우할 수 있습니다." />
                        </FormGroup>
                    </div>
                </div>
            </div>
        </div>
    </div>
})

export default SettingProfile
