// 由 scripts/gen-site-icons.mjs 生成，请勿手工编辑
const localIcons = {}

export const getSiteIcon = (link) => {
    try {
        const host = new URL(link, 'https://yupaits.top').hostname
        return localIcons[host] || '/icon/url.png'
    } catch {
        return '/icon/url.png'
    }
}
