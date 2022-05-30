import React, { useCallback } from 'react'
import { observer } from 'mobx-react'
import { css } from '@emotion/css'

export const CodeHighlightLeaf: React.FC<{
    children,
    leaf
}> = observer(({
    children,
    leaf
}) => {
    const getCodeLeafStyle = useCallback((leaf) => {
        if (leaf.punctuation) {
            return {
                color: '#999'
            }
        } else if (leaf.comment) {
            return {
                color: 'slategray'
            }
        } else if (leaf.operator) {
            return {
                color: 'hsl(301, 63%, 40%)'
            }
        } else if (leaf.url) {
            return {
                color: 'hsl(198, 99%, 37%)'
            }
        } else if (leaf.keyword) {
            return {
                color: '#07a'
            }
        } else if (leaf.variable || leaf.regex) {
            return {
                color: '#e90'
            }
        } else if (leaf.string || leaf.char) {
            return {
                color: '#690'
            }
        } else if (leaf.function || leaf['class-name']) {
            return {
                color: 'hsl(221, 87%, 60%)'
            }
        } else if (leaf.number ||
            leaf.boolean ||
            leaf.tag ||
            leaf.constant ||
            leaf.symbol ||
            leaf['attr-name'] ||
            leaf.selector) {
            return {
                color: '#905'
            }
        }
        return {}
    }, [])

    return (
        <span
            style={getCodeLeafStyle(leaf)}
        >
            {children}
        </span>
    )
})
