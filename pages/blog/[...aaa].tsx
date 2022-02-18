import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
const Test = () => {
    const router = useRouter()
    const aaa = router.query.aaa
    console.log(aaa)
    return <div onClick={() => {
    } } >
    </div>
}

export default Test
