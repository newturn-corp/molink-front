import React from 'react'
import { observer } from 'mobx-react'

export const TutorialEditingShortcutDescription: React.FC<{
}> = observer(() => {
    return <div
        style={{
            padding: 10
        }}
    >
        <div
            style={{
                fontSize: 22,
                fontWeight: 600,
                textAlign: 'center',
                marginBottom: 10
            }}
        >
            {'단축 입력 사용하기'}
        </div>
        <div
            className={'description'}
            dangerouslySetInnerHTML={{
                __html: 'Molink는 더 빠른 입력을 위해 아래와 같은 <b>단축 입력 방법</b>을 제공합니다.'
            }}
        />
        <img
            src={'https://knowlink-development-content-image.s3.ap-northeast-2.amazonaws.com/shortcut.PNG'}
            style={{
                marginTop: 5,
                marginBottom: 5,
                width: '100%'
            }}
        />
    </div>
})
