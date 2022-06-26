import React from 'react'
import LanguageManager from '../../../../../manager/global/LanguageManager'
import { Avatar } from 'antd'

export const ProfileImageSetting: React.FC<{
    text: string
    onChange: React.ChangeEventHandler<HTMLInputElement>
    profileImageSrc: string
    id: string
}> = (props) => {
    return <div className='profile-image'>
        <p className='setting-name'>
            {props.text}
        </p>
        <input
            accept='image/jpg,image/png,image/jpeg'
            style={{ display: 'none' }}
            id={props.id}
            multiple
            onChange={(event) => {
                props.onChange(event)
            }}
            type="file"
        />
        <label
            htmlFor={props.id}
        >
            <Avatar className='image' size={200} src={props.profileImageSrc}/>
        </label>
        <div className='edit'>
            {LanguageManager.languageMap.PressToChange}
        </div>
    </div>
}
