import React from 'react'
import { observer } from 'mobx-react'

export const TutorialEditingUploadFileDescription: React.FC<{
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
            {'이미지/동영상/파일 추가하기'}
        </div>
        <div
            className={'description'}
            dangerouslySetInnerHTML={{
                __html: '페이지로 <b>드래그하거나 주소를 입력</b>해서 간단하게 추가할 수 있습니다.'
            }}
        />
        <img
            src={'https://knowlink-development-content-image.s3.ap-northeast-2.amazonaws.com/ezgif-2-d8afb0cb5a.gif'}
            style={{
                marginTop: 5,
                marginBottom: 5
            }}
        />
    </div>
})
