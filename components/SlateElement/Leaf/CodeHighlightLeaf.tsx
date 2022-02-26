import React from 'react'
import { observer } from 'mobx-react'
import { css } from '@emotion/css'

export const CodeHighlightLeaf: React.FC<{
    attributes,
    children,
    leaf
}> = observer(({
    attributes,
    children,
    leaf
}) => {
    return (
        <span
            {...attributes}
            className={css`
            ${leaf.comment &&
            css`
                color: slategray;
              `} 
    
            ${(leaf.operator) &&
            css`
                color: hsl(301, 63%, 40%);
              `}
            ${(leaf.url) &&
                css`
                color: hsl(198, 99%, 37%);
              `}
            }
            ${leaf.keyword &&
            css`
                color: #07a;
              `}
            ${(leaf.variable || leaf.regex) &&
            css`
                color: #e90;
              `}
            ${(leaf.number ||
                leaf.boolean ||
                leaf.tag ||
                leaf.constant ||
                leaf.symbol ||
                leaf['attr-name'] ||
                leaf.selector) &&
            css`
                color: #905;
              `}
            ${leaf.punctuation &&
            css`
                color: #999;
              `}
            ${(leaf.string || leaf.char) &&
            css`
                color: #690;
              `}
            ${(leaf.function || leaf['class-name']) &&
            css`
                color: hsl(221, 87%, 60%);
              `}
            `}
        >
            {children}
        </span>
    )
})
