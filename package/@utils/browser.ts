// ==========================================================================
// 读取浏览器的名称和版本

// ==========================================================================
type Browser = 'isIE' | 'isEdge' | 'isWebkit' | 'isIPhone' | 'isIos'
type BrowserType = Boolean | string | null | undefined
const browser: Record<Browser, BrowserType> = {
  isIE: Boolean((window.document as any).documentMode),
  isEdge: window.navigator.userAgent.includes('Edge'),
  isWebkit: 'WebkitAppearance' in document.documentElement.style && !/Edge/.test(navigator.userAgent),
  isIPhone: /(iPhone|iPod)/gi.test(navigator.platform),
  isIos:
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
    || /(iPad|iPhone|iPod)/gi.test(navigator.platform),
}

export default browser
