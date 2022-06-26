import React from 'react'
import SignUpManager from '../../../manager/Auth/SignUpManager'
import { observer } from 'mobx-react'
import { AuthButton } from '../AuthButton'
import RoutingManager, { Page } from '../../../manager/global/RoutingManager'

export const SignUpMoveButton: React.FC<{
    showBack?: boolean,
    showNext?: boolean,
    onBack?: Function,
    onNext?: Function
}> = observer((props) => {
    const showNext = !(props.showNext === false)
    const showBack = !(props.showBack === false)

    return <div
        style={{
            display: 'flex',
            flexDirection: 'row-reverse'
        }}
    >
        {showNext && <AuthButton
            text={'다음'}
            theme={'primary-stroke'}
            onClick={() => {
                if (props.onNext) {
                    props.onNext()
                }
            }}
            textStyle={{
                fontSize: 15
            }}
        />}
        {
            showBack && <AuthButton
                text={'뒤로'}
                theme={'gray-stroke'}
                onClick={() => {
                    if (props.onBack) {
                        props.onBack()
                    }
                }}
                border={'1px solid #9DA7B0'}
                style={{
                    margin: '0px 16px 0px 0px'
                }}
                textStyle={{
                    fontSize: 15
                }}
            />
        }
    </div>
})
