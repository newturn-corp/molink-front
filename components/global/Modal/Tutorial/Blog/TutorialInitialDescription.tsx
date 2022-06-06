import React, { useCallback } from 'react'
import { observer } from 'mobx-react'
import UserManager from '../../../../../manager/global/User/UserManager'

export const TutorialInitialDescription: React.FC<{
}> = observer(() => {
    const description = `${UserManager.isUserAuthorized ? `<b>${UserManager.profile.nickname}님</b>, ` : ''}Molink에 오신 것을 환영합니다!<br>이 화면에서는 Molink의 <b>기본적인 사용 방법</b>을 확인할 수 있습니다.<br><br>만약 이 화면을 다음에 다시 보고 싶으시다면,<br><b>화면 우측 상단</b>에 위치한 <b>유저 메뉴</b>에서 <b>사용 방법</b>을 클릭하여 확인하실 수 있습니다.`

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
            {'환영합니다!'}
        </div>
        <div
            className={'description'}
            dangerouslySetInnerHTML={{
                __html: description
            }}
        />
    </div>
})
