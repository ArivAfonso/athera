import handleSideMove from './handleSideClampsMove'
import handleCornerMove from './handleCornerClampsMove'

enum ClampType {
    Left = 'media-resize-clamp--left',
    Right = 'media-resize-clamp--right',
    Top = 'media-resize-clamp--top',
    Bottom = 'media-resize-clamp--bottom',
    TopRight = 'media-resize-clamp--top-right',
    TopLeft = 'media-resize-clamp--top-left',
    BottomRight = 'media-resize-clamp--bottom-right',
    BottomLeft = 'media-resize-clamp--bottom-left',
    Rotate = 'media-resize-clamp--rotate',
}

function createClamp(extraClass: ClampType): HTMLDivElement {
    const clamp = document.createElement('div')
    clamp.classList.add('media-resize-clamp', extraClass)
    return clamp
}

function createClamps() {
    return {
        rotate: createClamp(ClampType.Rotate),
        sides: [
            createClamp(ClampType.Left),
            createClamp(ClampType.Right),
            createClamp(ClampType.Top),
            createClamp(ClampType.Bottom),
        ],
        corners: {
            topRight: createClamp(ClampType.TopRight),
            topLeft: createClamp(ClampType.TopLeft),
            bottomRight: createClamp(ClampType.BottomRight),
            bottomLeft: createClamp(ClampType.BottomLeft),
        },
    }
}

interface Node {
    type: { name: string }
    content: { size: number; childCount: number }
    attrs: { keyId: string }
}

interface Doc {
    descendants: (callback: (node: Node, pos: number) => void) => void
}

export function extractImageNode(nodeNames: string[], doc: Doc) {
    const result: {
        from: number
        to: number
        nodeSize: number
        childCount: number
        keyId: string
    }[] = []
    doc.descendants((node: Node, pos: number) => {
        if (nodeNames.includes(node.type.name)) {
            const { size: nodeSize, childCount } = node.content
            result.push({
                from: pos,
                to: pos + nodeSize,
                nodeSize,
                childCount,
                keyId: node.attrs.keyId,
            })
        }
    })
    return result
}

interface Editor {}

export const createMediaResizeGripper = (prob: any, editor: Editor) => {
    const gripper = document.createElement('div')
    gripper.classList.add('hypermultimedia__resize-gripper')

    const clamps = createClamps()
    gripper.append(
        /*clamps.rotate,*/ ...clamps.sides,
        ...Object.values(clamps.corners)
    )

    // handleRotateMove(clamps.rotate, gripper, editor, prob);
    ;[...clamps.sides].forEach((clamp) => {
        handleSideMove(clamp, gripper, editor, prob)
    })

    for (const corner in clamps.corners) {
        if (clamps.corners.hasOwnProperty(corner)) {
            handleCornerMove(
                clamps.corners[corner as keyof typeof clamps.corners],
                corner,
                gripper,
                editor,
                prob
            )
        }
    }

    return gripper
}
