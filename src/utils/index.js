/**
 * 基于给定 HEX 颜色生成从浅到深的 10 个颜色
 * @param {string} hexColor - 基础颜色 (HEX 格式)
 * @returns {string[]} - 包含从浅到深颜色的数组
 */
function generateCustomShades(hexColor) {
  const rgb = hexToRgb(hexColor)
  const shades = []

  // 浅色部分 (更接近白色)
  for (let i = 4; i > 0; i--) {
    const factor = i / 5
    const r = Math.round(rgb.r + (255 - rgb.r) * factor)
    const g = Math.round(rgb.g + (255 - rgb.g) * factor)
    const b = Math.round(rgb.b + (255 - rgb.b) * factor)
    shades.push(rgbToHex(r, g, b))
  }

  // 基础颜色
  shades.push(hexColor)

  // 深色部分 (更接近黑色)
  for (let i = 1; i <= 5; i++) {
    const factor = i / 6
    const r = Math.round(rgb.r * (1 - factor))
    const g = Math.round(rgb.g * (1 - factor))
    const b = Math.round(rgb.b * (1 - factor))
    shades.push(rgbToHex(r, g, b))
  }

  return shades
}

/**
 * HEX 转 RGB
 * @param {string} hex - HEX 格式颜色 (例如: #7ce160)
 * @returns {object} - RGB 格式颜色 (例如: { r: 124, g: 225, b: 96 })
 */
function hexToRgb(hex) {
  return {
    r: parseInt(hex.slice(1, 3), 16),
    g: parseInt(hex.slice(3, 5), 16),
    b: parseInt(hex.slice(5, 7), 16),
  }
}

/**
 * RGB 转 HEX
 * @param {number} r - 红色通道值 (0-255)
 * @param {number} g - 绿色通道值 (0-255)
 * @param {number} b - 蓝色通道值 (0-255)
 * @returns {string} - HEX 格式颜色 (例如: #7ce160)
 */
function rgbToHex(r, g, b) {
  return `#${[r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('')}`
}

// 示例用法
const baseColor = '#7ce160' // 原始颜色
const customShades = generateCustomShades(baseColor)

console.log(customShades)
// 输出: ["#f4fdf0", "#e4fcdc", "#c9f7bb", "#9eee87", "#7ce160", "#46c423", "#35a217", "#2c7f16", "#276417", "#205314", "#0c2e05"];
