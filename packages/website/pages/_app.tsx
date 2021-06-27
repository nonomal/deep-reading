import { useRef } from 'react'
import { useRouter } from 'next/router'
import type { AppProps } from 'next/app'

import TrayMenu from '../components/TrayMenu'
import '../styles/common.scss'

interface KeepAliveItem {
    route: string
    PageComponent: any
    current: boolean
}

export default function App({ Component, pageProps }: AppProps) {
    const router = useRouter()
    const keepAlive = useRef<KeepAliveItem[]>([
        {
            route: '/reading',
            PageComponent: undefined,
            current: false,
        },
        {
            route: '/explore',
            PageComponent: undefined,
            current: false,
        },
        {
            route: '/word',
            PageComponent: undefined,
            current: false,
        },
    ])

    let isKeepAlivePage = false

    keepAlive.current.forEach((data) => {
        if (router.route === data.route) {
            data.current = true
            data.PageComponent = Component
            isKeepAlivePage = true
            return
        }
        data.current = false
    })

    return (
        <>
            {keepAlive.current.map(
                ({ PageComponent, current }) =>
                    PageComponent && <PageComponent hidden={!current} />
            )}
            {!isKeepAlivePage && <Component {...pageProps} />}
            <TrayMenu />
        </>
    )
}
