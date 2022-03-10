import React from 'react'
import { observer } from 'mobx-react'
import { SignUpCheckbox } from './SignUpCheckbox'
import SignupManager from '../../manager/Auth/SignupManager'
import { SignUpCheckListState } from '../../manager/Auth/AuthStates'

const getSignUpCheckListHelperText = (state: SignUpCheckListState) => {
    switch (state) {
    case SignUpCheckListState.Default:
        return <></>
    case SignUpCheckListState.NotAllAccepted:
        return <p
            className={'sign-up-check-list-helper-text'}
        >모두 동의하셔야 가입하실 수 있습니다.</p>
    }
}

export const SignupCheckList: React.FC<{
}> = observer(() => {
    return <div
        className={'sign-up-check-list'}
    >
        <SignUpCheckbox
            isChecked={SignupManager.isAcceptAllCheckList}
            textNode={<p>전체 동의</p>}
            onChange={event => {
                SignupManager.isAcceptAllCheckList = event.target.checked
            }}
        />
        <div
            className={'divider'}
        ></div>
        <SignUpCheckbox
            isChecked={SignupManager.isAcceptTermOfUse}
            textNode={<p><a href={'https://www.molink.life/blog/Molink/4629add3ae7d9971bc539427afd127ad/%EC%9D%B4%EC%9A%A9%20%EC%95%BD%EA%B4%80'} target={'_blank'} rel="noreferrer">이용 약관</a> 동의 (필수)</p>}
            onChange={event => {
                SignupManager.isAcceptTermOfUse = event.target.checked
            }}
        />
        <SignUpCheckbox
            isChecked={SignupManager.isAcceptPrivacy}
            textNode={
                <p>
                    <a href={'https://www.molink.life/blog/Molink/43a7cfacb97e8d9a94aa8b8f0e9325e3/%EB%89%B4%ED%84%B4%EC%BD%94%ED%8D%BC%EB%A0%88%EC%9D%B4%EC%85%98%20%EA%B0%9C%EC%9D%B8%EC%A0%95%EB%B3%B4%20%EC%B2%98%EB%A6%AC%EB%B0%A9%EC%B9%A8'}
                        target={'_blank'}
                        rel="noreferrer">
                    개인정보 수집, 이용
                    </a> 동의 (필수)
                </p>}
            onChange={event => {
                SignupManager.isAcceptPrivacy = event.target.checked
            }}
        />
        {getSignUpCheckListHelperText(SignupManager.checkListState)}
    </div>
})
