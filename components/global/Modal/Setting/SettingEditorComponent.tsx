import React from 'react'
import { observer } from 'mobx-react'
import { Switch } from 'antd'
import UserManager from '../../../../manager/global/User/UserManager'

export const SettingEditorComponent: React.FC<{
}> = observer(() => {
    const editorSetting = UserManager.setting.editorSetting

    return <>
        <div className='toolbar'>
            <div className={'text-container'}>
                <div
                    className={'main'}
                >
                    {'툴바'}
                </div>
                <div
                    className={'description'}
                >
                    {'작성을 도와주는 다양한 버튼이 모여있는 툴바를 활성화합니다.'}
                </div>
            </div>
            <Switch
                checked={editorSetting.toolbarEnable}
                onChange={(checked) => {
                    if (checked) {
                        editorSetting.enableToolbar()
                    } else {
                        editorSetting.disableToolbar()
                    }
                }}
            />
        </div>
    </>
})
