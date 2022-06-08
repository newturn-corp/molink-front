import React from 'react'
import { observer } from 'mobx-react'
import { Progress } from 'antd'
import { numberToByteExpression } from '../../../utils/numberToByteExpression'

export interface UploadLimitComponentInterface {
    settingName: string
    max: number,
    left: number
}

export const UploadLimitComponent: React.FC<UploadLimitComponentInterface> = observer((props) => {
    const usage = props.max - props.left
    return <div className={'upload-limit'}>
        <p className='setting-name'>
            {props.settingName}
        </p>
        <Progress
            style={{
                width: 400,
                height: 50
            }}
            percent={usage / props.max * 100}
            format={v => `${numberToByteExpression(props.max)} 중 ${numberToByteExpression(props.left)} 남음`}
        />
    </div>
})
