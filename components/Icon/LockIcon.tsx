import * as React from 'react'
import { IconPropsInterface } from './interface'

const LockIcon = (props: IconPropsInterface) => (
    <svg
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
        fill={'#000000'}
        {...props}
    >
        <path d="M15.48 8.528h-.79V6.123a4.456 4.456 0 1 0-8.912 0v2.405H4.99a.823.823 0 0 0-.822.822v8.16a.823.823 0 0 0 .822.823H15.48a.822.822 0 0 0 .823-.822V9.35a.824.824 0 0 0-.823-.823Zm-3.815 4.896a1.43 1.43 0 1 1-1.43-1.43 1.43 1.43 0 0 1 1.43 1.43Zm1.381-4.896H7.423V6.123a2.811 2.811 0 0 1 5.623 0v2.405Z" />
    </svg>
)

export default LockIcon
