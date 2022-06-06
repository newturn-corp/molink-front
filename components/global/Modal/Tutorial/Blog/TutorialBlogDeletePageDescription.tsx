import React, { useCallback } from 'react'
import { observer } from 'mobx-react'

export const TutorialBlogDeletePageDescription: React.FC<{
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
            {'페이지 삭제하기'}
        </div>
        <div
            className={'description'}
            dangerouslySetInnerHTML={{
                __html: '작성하신 페이지를 <b>삭제</b>하고 싶다면,<br><b>블로그에서 페이지를 우클릭</b> 한 뒤 <b>삭제하기 버튼</b>을 눌러 삭제하실 수 있습니다.<br><br><b>삭제된 페이지는 다시 복구할 수 없고,<br>삭제하려는 페이지에 하위 페이지가 있다면 같이 삭제되니 유의하셔야 합니다. </b>'
            }}
        />
        <img
            src={'https://knowlink-development-content-image.s3.ap-northeast-2.amazonaws.com/content-image-78aaa078-b94d-4aa6-b4a3-ccb6b8dd86ea.png'}
            style={{
                marginTop: 5,
                marginBottom: 5
            }}
        />
    </div>
})
