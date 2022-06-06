import React, { useCallback } from 'react'
import { observer } from 'mobx-react'

export const TutorialBlogCreatePageDescription: React.FC<{
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
            {'페이지 만들기'}
        </div>
        <div
            className={'description'}
            dangerouslySetInnerHTML={{
                __html: '글을 작성하기 위해서는 먼저 <b>페이지를 만들어야 합니다.</b>'
            }}
        />
        <div
            className={'description'}
            dangerouslySetInnerHTML={{
                __html: '페이지를 만드는 방법은 총 <b>3가지</b>입니다.'
            }}
        />
        <img
            src={'https://knowlink-development-content-image.s3.ap-northeast-2.amazonaws.com/content-image-cca12f9f-55a6-4ace-9816-899728248256.png'}
            style={{
                marginTop: 5,
                marginBottom: 5
            }}
        />
        <div
            className={'description'}
            dangerouslySetInnerHTML={{
                __html: '블로그의 <b>좌측 상단에 있는 새 페이지 만들기 버튼</b>을 눌러서 만들거나'
            }}
        />
        <img
            src={'https://knowlink-development-content-image.s3.ap-northeast-2.amazonaws.com/content-image-9c436840-862a-471b-97e3-fc4da25d7f14.png'}
            style={{
                marginTop: 5,
                marginBottom: 5
            }}
        />
        <div
            className={'description'}
        >
            {'블로그의 빈 공간 또는 페이지를 '}<b>{'우클릭'}</b>{'해서 만들거나'}
        </div>
        <img
            src={'https://knowlink-development-content-image.s3.ap-northeast-2.amazonaws.com/%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7(7).png'}
            style={{
                marginTop: 5,
                marginBottom: 5
            }}
        />
        <div
            className={'description'}
        >
            {'페이지 옆의 '}<b>{'+ 버튼'}</b>{'을 눌러서 만들 수 있습니다.'}
        </div>
    </div>
})
