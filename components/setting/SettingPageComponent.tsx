import React from 'react'
import { observer } from 'mobx-react'
import { Header } from '../../components/global/Header/Header'
import { SettingCategory } from '../../components/setting/SettingCategory'

const SettingEditorPageComponent: React.FC<{}> = observer((props) => {
    return <div className='setting-page' onClick={() => {
    } } >
        <Header />
        <div className={'index-body'}>
            <div className='core'>
                <div className='setting-meta'>
                    <SettingCategory/>
                </div>
                <div className='setting-list'>
                    {props.children}
                </div>
            </div>
        </div>
    </div>
})

export default SettingEditorPageComponent
