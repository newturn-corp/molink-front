import React, { useCallback } from 'react'
import { observer } from 'mobx-react'
import UserManager from '../../../../../manager/global/User/UserManager'

export const TutorialPageControlVisibilityDescription: React.FC<{
}> = observer(() => {
    const description = '페이지는 <b>기본적으로 비공개 상태</b>입니다.<br>페이지를 외부에 공개하고 싶거나, 공개된 페이지를 비공개로 만들고 싶다면<br>우측 상단에 있는 <b>공개 범위 설정 버튼</b>을 눌러 공개 범위를 설정할 수 있습니다.'

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
            {'공개 범위 변경'}
        </div>
        <div
            className={'description'}
            dangerouslySetInnerHTML={{
                __html: description
            }}
        />
        <img
            src={'https://knowlink-development-content-image.s3.ap-northeast-2.amazonaws.com/ezgif-1-5e8dc97031.gif'}
            style={{
                marginTop: 5,
                marginBottom: 5
            }}
        />
    </div>
})
