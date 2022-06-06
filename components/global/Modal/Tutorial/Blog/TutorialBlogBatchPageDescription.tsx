import React from 'react'
import { observer } from 'mobx-react'

export const TutorialBlogBatchPageDescription: React.FC<{
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
            {'페이지 배치하기'}
        </div>
        <div
            className={'description'}
            dangerouslySetInnerHTML={{
                __html: 'Molink는 직관적인 <b>페이지 배치 기능</b>을 제공합니다.<br>그저 배치하고 싶은 페이지를 <b>드래그</b>한 뒤, 원하는 위치에 놓기만 하면 됩니다.'
            }}
        />
        <img
            src={'https://knowlink-development-content-image.s3.ap-northeast-2.amazonaws.com/content-image-f5ff7d7d-7624-417c-9f9d-c93064617d48.gif'}
            style={{
                marginTop: 5,
                marginBottom: 5
            }}
        />
    </div>
})
