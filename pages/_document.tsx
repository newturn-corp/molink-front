import React, { useEffect } from 'react'
import { Html, Head, Main, NextScript } from 'next/document'

const Document = () => {
    return (
        <Html>
            <Head>
                <link
                    rel={'stylesheet'}
                    href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css"
                />
                <link href="https://fonts.googleapis.com/css2?family=Fira+Mono&display=swap" rel="stylesheet"/>
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    )
}

export default Document
