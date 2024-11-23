import { useThemeMode } from '@/hooks/useThemeMode'
import createGlobe from 'cobe'
import { useEffect, useRef } from 'react'
import { useSpring, SpringConfig } from 'react-spring'

interface CobeProps {
    // Add any additional props here
}

function Cobe(props: CobeProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const pointerInteracting = useRef<number | null>(null)
    const pointerInteractionMovement = useRef<number>(0)
    const { isDarkMode } = useThemeMode()

    const [{ r }, api] = useSpring<{ r: number }>(() => ({
        r: 0,
        config: {
            mass: 1,
            tension: 280,
            friction: 40,
            precision: 0.001,
        },
    }))

    useEffect(() => {
        let phi = 0
        let theta = 0.3
        let width = 0

        const onResize = () => {
            if (canvasRef.current) width = canvasRef.current.offsetWidth
        }

        window.addEventListener('resize', onResize)
        onResize()

        if (!canvasRef.current) return
        const globe = createGlobe(canvasRef.current, {
            devicePixelRatio: 2,
            baseColor: isDarkMode ? [0.024, 0.125, 0.337] : [0.973, 0.973, 1],
            width: width * 2,
            height: width * 2,
            opacity: isDarkMode ? 0.42 : 0.9,
            phi: 0,
            theta: 0.3,
            dark: isDarkMode ? 1 : 0,
            diffuse: 1.25,
            mapSamples: isDarkMode ? 30000 : 40000,
            mapBrightness: 8.2,
            scale: 1.0,
            markerColor: [251 / 255, 100 / 255, 21 / 255],
            glowColor: isDarkMode
                ? [0.118, 0.251, 0.686]
                : [0.376, 0.647, 0.98],
            markers: [],
            onRender: (state: any) => {
                if (!pointerInteracting.current) {
                    phi += 0.002
                }
                state.phi = phi + r.get()
                state.width = width * 2
                state.height = width * 2
            },
        })

        setTimeout(() => {
            if (canvasRef.current) canvasRef.current.style.opacity = '1'
        })

        return () => {
            globe.destroy()
            window.removeEventListener('resize', onResize)
        }
    }, [isDarkMode, r])

    const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
        if (canvasRef.current) {
            pointerInteracting.current =
                e.clientX - pointerInteractionMovement.current
            canvasRef.current.style.cursor = 'grabbing'
        }
    }

    const handlePointerUp = () => {
        pointerInteracting.current = null
        if (canvasRef.current) canvasRef.current.style.cursor = 'grab'
    }

    const handlePointerOut = () => {
        pointerInteracting.current = null
        if (canvasRef.current) canvasRef.current.style.cursor = 'grab'
    }

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (pointerInteracting.current !== null) {
            const delta = e.clientX - pointerInteracting.current
            pointerInteractionMovement.current = delta
            api.start({ r: delta / 200 })
        }
    }

    const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
        if (pointerInteracting.current !== null && e.touches[0]) {
            const delta = e.touches[0].clientX - pointerInteracting.current
            pointerInteractionMovement.current = delta
            api.start({ r: delta / 100 })
        }
    }

    return (
        <div className="w-full max-w-3xl m-auto relative aspect-[1] space-y-10">
            <canvas
                ref={canvasRef}
                onPointerDown={handlePointerDown}
                onPointerUp={handlePointerUp}
                onPointerOut={handlePointerOut}
                onMouseMove={handleMouseMove}
                onTouchMove={handleTouchMove}
                style={{
                    cursor: 'grab',
                    contain: 'layout paint size',
                    opacity: 0,
                    transition: 'opacity 1s ease',
                }}
                className="w-full h-full"
            />
        </div>
    )
}

export default Cobe
