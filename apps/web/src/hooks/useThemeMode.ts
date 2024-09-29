import { useEffect, useState } from 'react'
import { createGlobalState } from 'react-hooks-global-state'

export const useThemeMode = () => {
    const [isDarkMode, setIsDarkMode] = useState(false)

    useEffect(() => {
        if (localStorage.theme === 'dark') {
            toDark()
        } else {
            toLight()
        }
    }, [])

    const toDark = () => {
        setIsDarkMode(true)
        const root = document.querySelector('html')
        if (!root) return
        !root.classList.contains('dark') && root.classList.add('dark')
        localStorage.theme = 'dark'
    }

    const toLight = () => {
        setIsDarkMode(false)
        const root = document.querySelector('html')
        if (!root) return
        root.classList.remove('dark')
        localStorage.theme = 'light'
    }

    function _toogleDarkMode() {
        if (localStorage.theme === 'light') {
            toDark()
        } else {
            toLight()
        }
    }

    return {
        isDarkMode,
        toDark,
        toLight,
        _toogleDarkMode,
    }
}
