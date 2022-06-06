import React, { useCallback } from 'react'
import { observer } from 'mobx-react'
import UserManager from '../../../../../manager/global/User/UserManager'

export const TutorialBlogMainDescription: React.FC<{
}> = observer(() => {
    const description = `<b>블로그</b>는 페이지들이 모여있는 공간입니다.<br>${UserManager.isUserAuthorized ? `<b>${UserManager.profile.nickname}님</b>은 ` : ''}이 곳에서 자유롭게 페이지들을 <b>만들고, 배치하고, 삭제</b>할 수 있습니다.`

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
            {'블로그'}
        </div>
        <div
            className={'description'}
            dangerouslySetInnerHTML={{
                __html: description
            }}
        />
        <div
            style={{
                display: 'flex',
                marginBottom: 10
            }}
        >
            <img
                src={'https://knowlink-development-content-image.s3.ap-northeast-2.amazonaws.com/content-image-5aabea9c-1c7a-43ca-a704-c4fb80aeef4b.png'}
                style={{
                    margin: '0 auto'
                }}
            />
        </div>
    </div>
})
