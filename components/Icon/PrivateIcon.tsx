import * as React from 'react'
import { IconPropsInterface } from './interface'

const PrivateIcon = (props: IconPropsInterface) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <path d="M4.452 5.545 2.156 3.249 3.195 2.21l14.54 14.542-1.038 1.038-2.431-2.43A8.082 8.082 0 0 1 2 10a8.066 8.066 0 0 1 2.453-4.455Zm7.519 7.52-1.076-1.076A2.204 2.204 0 0 1 7.957 9.05L6.882 7.975a3.672 3.672 0 0 0 5.089 5.09ZM6.989 3.947A8.082 8.082 0 0 1 17.892 10a8.04 8.04 0 0 1-1.478 3.373l-2.835-2.835a3.672 3.672 0 0 0-4.172-4.172L6.99 3.95Z" />
    </svg>
)

export default PrivateIcon
