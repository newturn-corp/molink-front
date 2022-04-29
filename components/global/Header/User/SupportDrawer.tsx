import React from 'react'
import { observer } from 'mobx-react'
import { MobileColumnDrawer } from '../../../utils/MobileColumeDrawer/MobileColumnDrawer'
import SupportManager from '../../../../manager/global/SupportManager'
import TextArea from 'antd/lib/input/TextArea'
import { Button } from '../../Button'
import { MobileColumnDrawerElement } from '../../../utils/MobileColumeDrawer/MobileColumnDrawerElement'
import { MobileColumnDrawerGroup } from '../../../utils/MobileColumeDrawer/MobileColumnDrawerGroup'
import LanguageManager from '../../../../manager/global/LanguageManager'

export const SupportDrawer: React.FC<{
}> = observer(() => {
    return (
        <MobileColumnDrawer
            className={'support-drawer'}
            open={SupportManager.isSupportDrawerOpen}
            onClose={() => {
                SupportManager.isSupportDrawerOpen = false
            }}
            backgroundColor={'#FAFAFB'}
            title={LanguageManager.languageMap.SupportTitleInMobile}
        >
            <MobileColumnDrawerGroup>
                <MobileColumnDrawerElement
                    style={{
                        flexDirection: 'column'
                    }}
                >
                    <div
                        className={'desc'}
                    >
                        {LanguageManager.languageMap.SupportDescription}
                    </div>
                    <TextArea
                        className={'support-input'}
                        placeholder={LanguageManager.languageMap.SupportPlaceholder}
                        showCount
                        value={SupportManager.content}
                        maxLength={300}
                        onChange={(e) => SupportManager.handleChange(e)}
                        autoSize={{ minRows: 4, maxRows: 10 }}
                        style={{
                            marginBottom: 15
                        }}
                    />
                    <div
                        className={'button-container'}
                    >
                        <Button
                            theme={'primary'}
                            text={LanguageManager.languageMap.Send}
                            style={{
                                width: 60,
                                height: 30
                            }}
                            fontSize={14}
                            onClick={() => SupportManager.handleOk()}
                        ></Button>
                    </div>
                </MobileColumnDrawerElement>
            </MobileColumnDrawerGroup>
        </MobileColumnDrawer>
    )
})
