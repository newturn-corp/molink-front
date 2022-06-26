import React from 'react'
import { observer } from 'mobx-react-lite'
import { Progress } from 'antd'
import SignUpManager from '../../../manager/Auth/SignUpManager'

export const AuthSignUpProgress = observer(() => {
    return <div
        className={'auth-sign-up-progress'}
    >
        <div
            className={'text'}
        >
            {`${SignUpManager.step + 1}/5`}
        </div>
        <Progress
            percent={(SignUpManager.step + 1) * 20}
            showInfo={false}
        />
    </div>
})
