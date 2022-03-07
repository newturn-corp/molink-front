import * as React from 'react'
import { IconPropsInterface } from './interface'

const OnlyFollowerIcon = (props: IconPropsInterface) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <path d="M9.443 10.845v5.444H4a5.443 5.443 0 0 1 5.443-5.444Zm4.083 5.104-2 1.051.382-2.226-1.617-1.578 2.235-.325 1-2.026 1 2.026 2.235.325-1.617 1.578.381 2.226-1.999-1.051Zm-4.083-5.784a4.081 4.081 0 0 1-4.082-4.082A4.081 4.081 0 0 1 9.443 2a4.081 4.081 0 0 1 4.083 4.083 4.081 4.081 0 0 1-4.083 4.082Z" />
    </svg>
)

export default OnlyFollowerIcon
