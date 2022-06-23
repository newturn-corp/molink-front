import React, { useEffect, useState } from 'react'
import { observer } from 'mobx-react'
import LanguageManager from '../../../../../manager/global/LanguageManager'
import UserManager from '../../../../../manager/global/User/UserManager'
import { Input } from 'antd'
import { Button } from '../../../Button'
const { TextArea } = Input

export const BiographySetting: React.FC<{
    settingName: string,
    currentBiography: string
    onUpdate: (biography: string) => {}
}> = observer((props) => {
    const [biography, setBiography] = useState('')

    useEffect(() => {
        setBiography(props.currentBiography)
    }, [props.currentBiography])

    return <div className='biography'>
        <p className='setting-name'>
            {LanguageManager.languageMap.Biography}
        </p>
        <TextArea
            maxLength={100}
            autoSize={{ minRows: 3, maxRows: 3 }}
            onChange={(e) => {
                setBiography(e.target.value)
            }}
            value={biography}
        />
        {
            props.currentBiography !== biography && <div
                className={'button-container'}
            >
                <Button
                    theme={'primary'}
                    text={'수정'}
                    style={{
                        width: 60,
                        height: 35,
                        marginLeft: 10
                    }}
                    fontSize={14}
                    onClick={async () => {
                        props.onUpdate(biography)
                    }}
                />
                <Button
                    theme={'gray-stroke'}
                    text={'취소'}
                    style={{
                        width: 60,
                        height: 35,
                        marginLeft: 10
                    }}
                    fontSize={14}
                    onClick={async () => {
                        setBiography(props.currentBiography)
                    }}
                />
            </div>
        }
    </div>
})
