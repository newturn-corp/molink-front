import * as React from 'react'
import { IconPropsInterface } from './interface'

const PublicIcon = (props: IconPropsInterface) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <path
            clipRule="evenodd"
            d="M8.152 1.772a8.47 8.47 0 0 0-5.879 4.853h3.544c.431-2.178 1.268-3.914 2.335-4.853Zm6.03 4.853h3.543a8.47 8.47 0 0 0-5.877-4.853c1.067.94 1.904 2.675 2.334 4.853Zm-1.152 0c-.594-2.756-1.86-4.5-3.03-4.5-1.17 0-2.436 1.744-3.03 4.5h6.06ZM6.625 10c0 .752.05 1.504.15 2.25h6.45a16.88 16.88 0 0 0 0-4.5h-6.45c-.1.746-.15 1.497-.15 2.25ZM10 17.875c-1.17 0-2.436-1.744-3.03-4.5h6.06c-.594 2.756-1.86 4.5-3.03 4.5ZM14.361 7.75h3.768a8.382 8.382 0 0 1 0 4.5h-3.768a18.178 18.178 0 0 0 0-4.5Zm-2.513 10.477a8.469 8.469 0 0 0 5.879-4.852h-3.544c-.431 2.177-1.268 3.913-2.335 4.852Zm-9.573-4.852h3.543c.43 2.177 1.267 3.913 2.335 4.852a8.469 8.469 0 0 1-5.878-4.852ZM5.639 7.75a18.184 18.184 0 0 0 0 4.5H1.871a8.381 8.381 0 0 1 0-4.5h3.768Z"
        />
    </svg>
)

export default PublicIcon