import React, { useCallback } from 'react'
import { observer } from 'mobx-react'
import UserManager from '../../../../../manager/global/User/UserManager'

export const TutorialPageControlPublishDescription: React.FC<{
}> = observer(() => {
    const description = '페이지를 피드에 올려 많은 사람들이 볼 수 있게 만들고 싶다면,<br>우측 상단의 <b>발행하기 버튼</b>을 눌러서 페이지를 발행할 수 있습니다.<br>발행된 페이지는 <b>메인 페이지의 피드</b>에 노출됩니다!<br>발행하기는 <b>3일</b>에 한 번만 가능하니 유의해주세요!'

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
            {'페이지 발행하기'}
        </div>
        <div
            className={'description'}
            dangerouslySetInnerHTML={{
                __html: description
            }}
        />
        <img
            src={'https://knowlink-development-content-image.s3.ap-northeast-2.amazonaws.com/ezgif-1-d0b928cd85.gif'}
            style={{
                marginTop: 5,
                marginBottom: 5
            }}
        />
    </div>
})
