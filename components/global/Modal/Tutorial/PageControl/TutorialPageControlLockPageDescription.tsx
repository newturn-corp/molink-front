import React from 'react'
import { observer } from 'mobx-react'

export const TutorialPageControlLockPageDescription: React.FC<{
}> = observer(() => {
    const description = '<b>의도치 않은 수정</b>이 걱정되시거나, <b>방문객이 보는 화면</b>을 확인하시고 싶으시다면<br>우측 상단의 <b>페이지 잠그기 버튼</b>을 이용하여 잠금 상태로 만들 수 있습니다.'

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
            {'페이지 잠그기'}
        </div>
        <div
            className={'description'}
            dangerouslySetInnerHTML={{
                __html: description
            }}
        />
        <img
            src={'https://knowlink-development-content-image.s3.ap-northeast-2.amazonaws.com/ezgif-1-ec826db561.gif'}
            style={{
                marginTop: 5,
                marginBottom: 5
            }}
        />
    </div>
})
