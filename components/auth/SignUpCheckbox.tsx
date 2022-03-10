import React, { ReactNode } from 'react'

export const SignUpCheckbox: React.FC<{
    isChecked: boolean
    textNode: ReactNode
    onChange: React.ChangeEventHandler<HTMLInputElement>
}> = ({ textNode, isChecked, onChange }) => {
    return <div
        className={'sign-up-check-box'}
    >
        <label className="container">
            {textNode}
            <input
                type="checkbox"
                checked={isChecked}
                onChange={event => {
                    onChange(event)
                }}
            />
            <span
                className="checkmark"
            >
            </span>
        </label>
    </div>
}
