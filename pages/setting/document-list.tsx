import React from 'react'
import { observer } from 'mobx-react'
import { Header } from '../../components/global/Header/Header'
import { FormControlLabel, FormGroup, Checkbox } from '@material-ui/core'
import { SettingCategory } from '../../components/setting/SettingCategory'
import UserManager from '../../manager/global/User/UserManager'

const SettingDocumentList = observer(() => {
    // const [value, setValue] = React.useState('female')
    //
    // const handleLinkOptionChange = (event) => {
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
        {/* <Header /> */}
        {/* <div className={'index-body'}> */}
        {/*     <div className='core'> */}
        {/*         <div className='setting-meta'> */}
        {/*             <SettingCategoryListComponent/> */}
        {/*         </div> */}
        {/*         <div className='setting-list'> */}
        {/*             <div className='show-sub-document-count'> */}
        {/*                 <p className='setting-name'>하위 문서 표기</p> */}
        {/*                 <FormGroup aria-label="position" row> */}
        {/*                     <div className='options'> */}
        {/*                         <div className='option'> */}
        {/*                             <img src="/showSubDocumentCount.png" alt="" /> */}
        {/*                             <FormControlLabel */}
        {/*                                 value="follow-without-approve" */}
        {/*                                 control={ */}
        {/*                                     <Checkbox */}
        {/*                                         checked={!UserManager.setting.showSubDocumentCount} */}
        {/*                                         onChange={(event) => UserManager.setting.setShowSubDocumentCount(!event.target.checked)} */}
        {/*                                     /> */}
        {/*                                 } */}
        {/*                                 label="하위 문서의 개수를 표기하지 않습니다." /> */}
        {/*                         </div> */}
        {/*                         <div className='option'> */}
        {/*                             <img src="/notShowSubDocumentCount.png" alt="" /> */}
        {/*                             <FormControlLabel */}
        {/*                                 value="follow-without-approve" */}
        {/*                                 control={ */}
        {/*                                     <Checkbox */}
        {/*                                         checked={UserManager.setting.showSubDocumentCount} */}
        {/*                                         onChange={(event) => UserManager.setting.setShowSubDocumentCount(event.target.checked)} */}
        {/*                                     /> */}
        {/*                                 } */}
        {/*                                 label="하위 문서의 개수를 표기합니다." /> */}
        {/*                         </div> */}
        {/*                     </div> */}

        {/*                 </FormGroup> */}

        {/*             </div> */}
        {/*         </div> */}
        {/*     </div> */}
        {/* </div> */}
    </div>
})

export default SettingDocumentList
