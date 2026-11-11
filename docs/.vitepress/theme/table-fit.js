// 表格列宽增强：测量每个单元格，某列只要有单元格被自动换行到 3 行以上，就按
// 「让这段文本恰好 3 行」估算所需列宽并放宽该列；表格整体超出正文宽度时交给
// .vp-table-wrapper 横向滚动，单元格自身不产生滚动，也不会让整页横滚。
//
// 为了避免「先按默认列宽画一遍、脚本再把列宽撑开」造成跳动，样式里让未完成的表格
// 先 visibility: hidden（保留占位、不影响布局），这里一次性算完最终列宽并写回后才
// 打上 data-table-fit="done" 让表格显示；无 JS 时该隐藏规则不生效，表格保持原 auto 布局。

const MAX_LINES = 3
const MAX_ROUNDS = 3
// 拉丁字母、数字与常见符号视为不可断词；中文等 CJK 可在任意字间断行，按单字计
const LATIN_TOKEN = /[A-Za-z0-9_+\-./:%@#=&?~$^'"[\](){}<>|\\,;!*]+/g

let canvasCtx
const measureText = (text, font) => {
    if (!canvasCtx) canvasCtx = document.createElement('canvas').getContext('2d')
    canvasCtx.font = font
    return canvasCtx.measureText(text).width
}

const fontOf = (cs) => `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`

// 按 <br> 切成作者显式分行的若干段，逐段统计「自动换行」后的行数，
// 这样 <br> 列表不会被误判成过度换行，而列表里过长的单段仍会被识别。
const segmentsOf = (cell) => {
    const segments = []
    let nodes = []
    for (const node of cell.childNodes) {
        if (node.nodeName === 'BR') {
            if (nodes.length) segments.push(nodes)
            nodes = []
            continue
        }
        nodes.push(node)
    }
    if (nodes.length) segments.push(nodes)
    return segments
}

const segmentText = (nodes) =>
    nodes.map((node) => node.textContent || '').join('').replace(/\s+/g, ' ').trim()

// 用 Range 逐行矩形的数量数出真实换行行数，比按高度估算更可靠：
// 表格单元格会被同行最高的单元格撑高，按高度算会虚高。
const countLines = (nodes) => {
    const range = document.createRange()
    range.setStartBefore(nodes[0])
    range.setEndAfter(nodes[nodes.length - 1])
    const tops = []
    for (const rect of range.getClientRects()) {
        if (!rect.width && !rect.height) continue
        if (!tops.some((top) => Math.abs(top - rect.top) < 4)) tops.push(rect.top)
    }
    return Math.max(1, tops.length)
}

const cellLines = (cell) => {
    const segments = segmentsOf(cell)
    if (!segments.length) return 1
    return segments.reduce((max, nodes) => Math.max(max, countLines(nodes)), 0)
}

// 估算「这段文本缩到 3 行以内」所需的内容宽度：
// 取「最长不可断词」与「整段宽度的 1/3」的较大值，再补上左右内边距。
const cellNeed = (cell) => {
    const cs = getComputedStyle(cell)
    const padding = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight)
    const font = fontOf(cs)
    let need = 0
    for (const nodes of segmentsOf(cell)) {
        const text = segmentText(nodes)
        if (!text) continue
        const total = measureText(text, font)
        let longest = measureText('中', font)
        for (const token of text.match(LATIN_TOKEN) || []) {
            longest = Math.max(longest, measureText(token, font))
        }
        need = Math.max(need, longest, total / MAX_LINES)
    }
    return Math.ceil(need + padding) + 1
}

const resetTable = (table) => {
    table.querySelector(':scope > colgroup[data-table-fit]')?.remove()
    table.style.removeProperty('table-layout')
    table.style.removeProperty('width')
}

const applyWidths = (table, widths) => {
    let colgroup = table.querySelector(':scope > colgroup[data-table-fit]')
    if (!colgroup) {
        colgroup = document.createElement('colgroup')
        colgroup.dataset.tableFit = ''
        while (colgroup.children.length < widths.length) colgroup.appendChild(document.createElement('col'))
        table.insertBefore(colgroup, table.firstChild)
    }
    ;[...colgroup.children].forEach((col, index) => {
        col.style.width = widths[index] + 'px'
    })
    table.style.tableLayout = 'fixed'
    table.style.width = widths.reduce((sum, width) => sum + width, 0) + 'px'
}

// 写入后按真实渲染复核，仍有超 3 行的列按超出比例继续放宽。
// 读取会强制同步布局，整个过程在同一个任务里完成，表格不会中途显示。
const refine = (table, widths) => {
    const head = table.rows[0]
    if (!head) return
    const bodyRows = [...table.rows].slice(1)
    for (let round = 0; round < MAX_ROUNDS; round++) {
        let changed = false
        for (let index = 0; index < head.cells.length; index++) {
            const cells = bodyRows.map((row) => row.cells[index]).filter(Boolean)
            const maxLines = cells.reduce((max, cell) => Math.max(max, cellLines(cell)), 0)
            if (maxLines > MAX_LINES) {
                widths[index] = Math.ceil(widths[index] * Math.max(1.15, maxLines / MAX_LINES))
                changed = true
            }
        }
        if (!changed) return
        applyWidths(table, widths)
    }
}

const fitTable = (wrapper) => {
    const table = wrapper.querySelector(':scope > table')
    if (!table) return
    resetTable(table)
    const head = table.rows[0]
    if (!head?.cells.length || table.rows.length < 2) return
    // 合并单元格会打乱「列 -> 单元格」映射，保持原样
    if (table.querySelector('[colspan], [rowspan]')) return

    const bodyRows = [...table.rows].slice(1)
    const widths = [...head.cells].map((cell) => cell.getBoundingClientRect().width)
    const targets = [...widths]
    let changed = false

    for (let index = 0; index < head.cells.length; index++) {
        const cells = bodyRows.map((row) => row.cells[index]).filter(Boolean)
        const wrapped = cells.filter((cell) => cellLines(cell) > MAX_LINES)
        if (!wrapped.length) continue
        let need = Math.max(widths[index], head.cells[index].scrollWidth || 0)
        for (const cell of wrapped) need = Math.max(need, cellNeed(cell))
        if (need > widths[index] + 1) {
            targets[index] = need
            changed = true
        }
    }
    if (!changed) return

    applyWidths(table, targets)
    refine(table, targets)
}

export const fitTables = () => {
    if (typeof window === 'undefined') return
    document.querySelectorAll('.vp-doc .vp-table-wrapper').forEach((wrapper) => {
        try {
            fitTable(wrapper)
        } catch {
            // 单张表测量失败时保持原布局，不影响其它表
        }
        // 无论是否调整，都标记为完成，让被隐藏的表格显示出来
        wrapper.dataset.tableFit = 'done'
    })
}

let rafId = 0
export const fitTablesSoon = () => {
    if (typeof window === 'undefined') return
    cancelAnimationFrame(rafId)
    rafId = requestAnimationFrame(fitTables)
}

export const initTableFit = () => {
    if (typeof window === 'undefined') return
    // 表格里的行内代码用的是 font-display: swap 的等宽字体。表格隐藏期间浏览器可能还没请求它，
    // 等表格显示出来再换字体会让列宽二次变化；先主动触发这些字体加载（最多等 600ms），
    // 让第一次测量就按最终字形宽度算，显示后不再位移。
    const warmTableFonts = async () => {
        const specs = new Set()
        document.querySelectorAll('.vp-doc .vp-table-wrapper code, .vp-doc .vp-table-wrapper kbd').forEach((el) => {
            const cs = getComputedStyle(el)
            specs.add(`${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`)
        })
        if (!specs.size || !document.fonts?.load) return
        await Promise.race([
            Promise.all([...specs].map((spec) => document.fonts.load(spec).catch(() => {}))),
            new Promise((resolve) => setTimeout(resolve, 600))
        ])
    }
    const fonts = document.fonts?.ready || Promise.resolve()
    let timedOut = false
    Promise.race([
        fonts,
        new Promise((resolve) => setTimeout(() => {
            timedOut = true
            resolve()
        }, 400))
    ]).then(async () => {
        await warmTableFonts()
        fitTablesSoon()
        if (timedOut) fonts.then(() => fitTablesSoon())
    })
    window.addEventListener('resize', fitTablesSoon, {passive: true})
}
