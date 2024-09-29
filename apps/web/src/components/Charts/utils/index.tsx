'use client'

const textRefactor = (text: string, size: number): string => {
    return `${text.split(' ').slice(0, size).join(' ')}...`
}

const chartLinearGradient = (
    canvas: HTMLCanvasElement,
    height: number,
    color: { start: string; end: string }
): CanvasGradient => {
    const ctx = canvas.getContext('2d')
    //@ts-ignore
    const gradient = ctx.createLinearGradient(0, 0, 0, height)
    gradient.addColorStop(0, `${color.start}`)
    gradient.addColorStop(1, `${color.end}`)
    return gradient
}

// Custom Tooltip
const customTooltips = function (this: any, context: any): void {
    // Tooltip Element
    let tooltipEl = document.querySelector('.chartjs-tooltip') as HTMLDivElement

    // // Ensure this._chart is defined before accessing its canvas property
    // if (!this._chart || !this._chart.canvas) {
    //     return
    // }

    if (
        !this._chart.canvas
            .closest('.hexadash-chart-container')
            .contains(tooltipEl)
    ) {
        tooltipEl = document.createElement('div')
        tooltipEl.className =
            'chartjs-tooltip absolute bg-white dark:bg-[#323541] min-w-[140px] px-1.5 py-2 rounded-md dark:border-white10 dark:border-[#323541] border-1 shadow-custom before:absolute before:border-x-5 before:border-t-5 before:border-transparent before:border-t-gray-200 before:rounded-full before:-bottom-1.5 ltr:before:left-1/2 rtl:before:right-1/2 before:-translate-x-2/45'
        tooltipEl.innerHTML = '<table></table>'

        document.querySelectorAll('.hexadash-chart-container').forEach((el) => {
            if (el.contains(document.querySelector('.chartjs-tooltip'))) {
                document.querySelector('.chartjs-tooltip')?.remove()
            }
        })

        this._chart.canvas
            .closest('.hexadash-chart-container')
            .appendChild(tooltipEl)
    }
    const tooltipModel = context.tooltip
    // Hide if no tooltip
    if (tooltipModel.opacity === 0) {
        tooltipEl.style.opacity = '0'
        return
    }
    // Set caret Position
    tooltipEl.classList.remove('above', 'below', 'no-transform')
    if (tooltipModel.yAlign) {
        tooltipEl.classList.add(tooltipModel.yAlign)
    } else {
        tooltipEl.classList.add('no-transform')
    }

    function getBody(bodyItem: any): string[] {
        return bodyItem.lines
    }

    // Set Text
    if (tooltipModel.body) {
        const titleLines = tooltipModel.title || []
        const bodyLines = tooltipModel.body.map(getBody)

        let innerHtml = '<thead>'

        titleLines.forEach(function (title: string) {
            innerHtml += `<div class='mb-1 text-body dark:text-white87 text-xs font-medium capitalize'>${title}</div>`
        })
        innerHtml += '</thead><tbody>'

        bodyLines.forEach(function (body: string[], i: number) {
            const colors = tooltipModel.labelColors[i]
            let style = `background:${colors.backgroundColor}`
            style += `; border-color:${colors.borderColor}`
            style += '; border-width: 2px'
            style += '; border-radius: 30px'
            const span = `<span class="inline-block w-[10px] h-[10px] ltr:mr-2 rtl:ml-2 dark:!border-transparent" style="${style}"></span>`
            innerHtml += `<tr><td class="flex items-center mb-[3px] text-light-extra dark:text-white60 text-xs font-medium">${span}${body}</td></tr>`
        })

        innerHtml += '</tbody>'

        const tableRoot = tooltipEl.querySelector('table') as HTMLElement
        tableRoot.innerHTML = innerHtml
    }

    const positionY = this._chart.canvas.offsetTop
    const positionX = this._chart.canvas.offsetLeft
    const toolTip = document.querySelector('.chartjs-tooltip')
    const toolTipHeight = toolTip?.clientHeight || 0

    // Display, position, and set styles for font
    tooltipEl.style.opacity = '1'
    tooltipEl.style.left = `${positionX + tooltipModel.caretX}px`
    tooltipEl.style.top = `${
        positionY +
        tooltipModel.caretY -
        (tooltipModel.caretY > 10
            ? toolTipHeight > 100
                ? toolTipHeight + 5
                : toolTipHeight + 15
            : 70)
    }px`
    tooltipEl.style.fontFamily = tooltipModel.options.bodyFontFamily
    tooltipEl.style.fontSize = `${tooltipModel.options.bodyFontSize}px`
    tooltipEl.style.fontStyle = tooltipModel.options.bodyFontStyle
    tooltipEl.style.padding = `${tooltipModel.yPadding}px ${tooltipModel.xPadding}px`
}

export { textRefactor, chartLinearGradient, customTooltips }
