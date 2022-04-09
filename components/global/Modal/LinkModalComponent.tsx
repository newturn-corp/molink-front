import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import TextArea from 'antd/lib/input/TextArea'
import { observer } from 'mobx-react'
import SupportManager from '../../../manager/global/SupportManager'
import { Button } from '../Button'
import { TextAreaRef } from 'antd/es/input/TextArea'
import { CustomModal } from '../../utils/CustomModal'
import LinkManager from '../../../manager/Editing/Link/LinkManager'
import { CustomInput } from '../../utils/CustomInput'
import { AnalyzeLinkResponseDTO } from '@newturn-develop/types-molink'
import mainAPI from '../../../api/mainAPI'
import { isURL } from 'class-validator'

export const LinkModalComponent: React.FC<{
}> = observer(() => {
    const textAreaRef = useRef<HTMLInputElement>(null)
    useEffect(() => {
        LinkManager.modal.contentRef = textAreaRef
    }, [LinkManager.modal.isOpen, textAreaRef])

    const [info, setInfo] = useState<AnalyzeLinkResponseDTO>(null)

    useEffect(() => {
        if (isURL(LinkManager.modal.content)) {
            mainAPI.analyzeLink(LinkManager.modal.content)
                .then((dto) => setInfo(dto))
        } else {
            setInfo(null)
        }
    }, [LinkManager.modal.content])

    return <CustomModal
        className={'link-modal'}
        title="링크"
        onCancel={() => LinkManager.modal.close()}
        isOpen={LinkManager.modal.isOpen}
    >
        <CustomInput
            inputRef={textAreaRef}
            type="text"
            variant={'outlined'}
            autoComplete={'off'}
            error={LinkManager.modal.isError}
            helperText={LinkManager.modal.helperText}
            onChange={(e) => {
                LinkManager.modal.handleChange(e as ChangeEvent<HTMLTextAreaElement>)
            }}
            style={{
                marginTop: 10
            }}
            value={LinkManager.modal.content}
        />
        <pre
            className={'desc'}
            style={{
                marginTop: 10,
                marginBottom: 0
            }}
        >
            {'Tip! 링크를 복사한 뒤 페이지에 붙여넣으면 바로 북마크를 추가할 수 있습니다.'}
        </pre>
        {
            info
                ? <div
                    className={'bookmark'}
                >
                    <div
                        className={'text-container'}
                    >
                        <div
                            className={'title'}
                        >
                            {info.title}
                        </div>
                        {
                            info.description
                                ? <div
                                    className={'description'}
                                >
                                    {info.description}
                                </div>
                                : <></>
                        }
                        <div
                            className={'url-container'}
                        >
                            {
                                info.iconURL
                                    ? <img
                                        src={info.iconURL}
                                        className={'icon'}
                                    />
                                    : <></>
                            }
                            <div
                                className={'url'}
                            >
                                {LinkManager.modal.content}
                            </div>
                        </div>
                    </div>
                    {
                        info.imageURL
                            ? <div
                                className={'image-container'}
                            >
                                <div
                                    style={{
                                        position: 'absolute',
                                        inset: 0
                                    }}
                                >
                                    <img
                                        className={'image'}
                                        src={info.imageURL}
                                    ></img>
                                </div>
                            </div>
                            : <></>
                    }</div>
                : <></>
        }
        <div
            className={'modal-buttons'}
            style={{
                marginTop: 15
            }}
        >
            <Button
                theme={'primary'}
                text={'확인'}
                style={{
                    width: 100,
                    height: 40
                }}
                fontSize={15}
                onClick={() => LinkManager.modal.handleOk()}
            ></Button>
        </div>
    </CustomModal>
})
