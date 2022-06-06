import React from 'react'
import { observer } from 'mobx-react'

export const TutorialEditingCommandDescription: React.FC<{
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
            {'명령어 사용하기'}
        </div>
        <div
            className={'description'}
            dangerouslySetInnerHTML={{
                __html: 'Molink는 작성에 도움이 되는 다양한 명령어를 지원합니다.<br><b>(/, 슬래시)</b>를 입력하여 명령어의 목록을 확인할 수 있고, <b>Enter 키</b>를 이용하여 현재 선택된 명령어를 사용할 수 있습니다.<br>/ 뒤에 <b>명령어의 이름을 입력</b>하여 명령어를 더 빠르게 찾을 수 있습니다.'
            }}
        />
        <img
            src={'https://knowlink-development-content-image.s3.ap-northeast-2.amazonaws.com/content-image-23051656-717f-4b22-8e29-8ce28ba71b3b.gif'}
            style={{
                marginTop: 5,
                marginBottom: 5
            }}
        />
    </div>
})
