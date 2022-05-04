import { observer } from 'mobx-react'
import React from 'react'
import { ContentHeaderIcon } from './ContentHeaderIcon'
import { EditorContainer } from './EditorContainer'
import { ContentTitleComponent } from './ContentTitleComponent'
import { ContentFooter } from './ContentFooter'
import StyleManager from '../../../../manager/global/Style/StyleManager'
import { PageUserInfoComponent } from './PageUserInfoComponent'
import EditorManager from '../../../../manager/Blog/EditorManager'

export const ContentComponent: React.FC<{
}> = observer(() => {
    return <>
        <div className={'contents'}
            style={StyleManager.contentStyle.main}
        >
            <ContentHeaderIcon/>
            <ContentTitleComponent/>
            {
                EditorManager.editable
                    ? <></>
                    : <PageUserInfoComponent/>
            }
            <EditorContainer/>
        </div>
        <ContentFooter/>
    </>
})
