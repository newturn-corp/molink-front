import React from 'react'
import { observer } from 'mobx-react'
import { OptionButton } from './OptionButton'
import Blog from '../../../../manager/global/Blog/Blog'

export const OptionButtonGroup: React.FC<{}> = observer(() => {
    return (
        <div
            className={'option-button-group'}
        >
            {
                Blog.pageHierarchy.contextMenu.availControlOptions.map(option =>
                    (<OptionButton
                        icon={option.icon}
                        name={option.name}
                        key={`option-button-${option.name}`}
                        onClick={() => option.handleOnClick()}
                    />)
                )
            }
        </div>
    )
})
