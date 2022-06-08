import React, { useCallback } from 'react'
import { observer } from 'mobx-react'
import { TutorialBlogMainDescription } from './Blog/TutorialBlogMainDescription'
import { TutorialBlogCreatePageDescription } from './Blog/TutorialBlogCreatePageDescription'
import { TutorialBlogBatchPageDescription } from './Blog/TutorialBlogBatchPageDescription'
import { TutorialBlogDeletePageDescription } from './Blog/TutorialBlogDeletePageDescription'
import { TutorialComponent } from './TutorialComponent'
import { TutorialInitialDescription } from './Blog/TutorialInitialDescription'
import TutorialManager from '../../../../manager/global/TutorialManager'

export const BlogTutorialComponent: React.FC<{
}> = observer((props) => {
    const getDescription = useCallback(() => {
        switch (TutorialManager.step) {
        case 0:
            return <TutorialInitialDescription/>
        case 1:
            return <TutorialBlogMainDescription/>
        case 2:
            return <TutorialBlogCreatePageDescription/>
        case 3:
            return <TutorialBlogBatchPageDescription/>
        case 4:
            return <TutorialBlogDeletePageDescription/>
        default:
            return <></>
        }
    }, [TutorialManager.step])

    return <TutorialComponent
        length={5}
    >
        {
            getDescription()
        }
    </TutorialComponent>
})
