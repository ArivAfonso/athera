import { cn } from '@/utils/cn'

export function RoundedBottomBar({
    x,
    y,
    width,
    height,
    fill,
    fillOpacity,
    cornerRadius = 6,
    className,
}: any) {
    const roundedHeight = Math.max(cornerRadius, height)
    const path = `
    M${x},${y}
    L${x},${y + roundedHeight - cornerRadius}
    Q${x},${y + roundedHeight} ${x + cornerRadius},${y + roundedHeight}
    L${x + width - cornerRadius},${y + roundedHeight}
    Q${x + width},${y + roundedHeight} ${x + width},${
        y + roundedHeight - cornerRadius
    }
    L${x + width},${y}
    Z
  `
    return (
        <path
            d={path}
            fill={fill}
            fillOpacity={fillOpacity}
            className={cn(className)}
        />
    )
}
