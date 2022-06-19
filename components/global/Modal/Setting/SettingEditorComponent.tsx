import React from 'react'
import { observer } from 'mobx-react'
import { Switch } from 'antd'
import UserManager from '../../../../manager/global/User/UserManager'
import HierarchyAPI from '../../../../api/HierarchyAPI'
import { SetHeaderIconActiveDTO } from '@newturn-develop/types-molink'
import Blog from '../../../../manager/global/Blog/Blog'

export const SettingEditorComponent: React.FC<{
}> = observer(() => {
    const editorSetting = UserManager.setting.editorSetting

    return <>
        <div className='switch-setting'>
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
        {/* <div className='switch-setting'> */}
        {/*     <div className={'text-container'}> */}
        {/*         <div */}
        {/*             className={'main'} */}
        {/*         > */}
        {/*             {'아이콘'} */}
        {/*         </div> */}
        {/*         <div */}
        {/*             className={'description'} */}
        {/*         > */}
        {/*             {'페이지를 나타내는 아이콘을 활성화합니다.'} */}
        {/*         </div> */}
        {/*     </div> */}
        {/*     <Switch */}
        {/*         checked={Blog.pageHierarchy.headerIconActive} */}
        {/*         onChange={async (checked) => { */}
        {/*             if (checked) { */}
        {/*                 await HierarchyAPI.setBlogHeaderIconActive(new SetHeaderIconActiveDTO(UserManager.blogID, true)) */}
        {/*             } else { */}
        {/*                 await HierarchyAPI.setBlogHeaderIconActive(new SetHeaderIconActiveDTO(UserManager.blogID, false)) */}
        {/*             } */}
        {/*         }} */}
        {/*     /> */}
        {/* </div> */}
    </>
})
