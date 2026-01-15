// src/utils/htmlParser.js

/**
 * 从HTML内容中提取第一张图片
 */
export const getFirstImage = (htmlContent :any) => {
  if (!htmlContent) return null

  const imgRegex = /<img[^>]+src="([^">]+)"/g
  const match = imgRegex.exec(htmlContent)

  return match ? match[1] : null
}

/**
 * 计算HTML中的图片数量
 */
export const getImageCount = (htmlContent :any) => {
  if (!htmlContent) return 0

  const imgRegex = /<img/g
  const matches = htmlContent.match(imgRegex)

  return matches ? matches.length : 0
}

/**
 * 提取所有图片URL
 */
export const getAllImages = (htmlContent :any) => {
  if (!htmlContent) return []

  const imgRegex = /<img[^>]+src="([^">]+)"/g
  const images = []
  let match

  while ((match = imgRegex.exec(htmlContent)) !== null) {
    images.push(match[1])
  }

  return images
}

/**
 * 格式化HTML内容（安全处理）
 */
export const formatDetailContent = (htmlContent:  any) => {
  if (!htmlContent) return '暂无详情'

  // 简单的HTML清理
  const content = htmlContent
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/on\w+="[^"]*"/g, '')

  return content
}

/**
 * 生成纯文本预览
 */
export const generateTextPreview = (htmlContent:any, maxLength = 50) => {
  if (!htmlContent) return '暂无详情'

  // 移除HTML标签
  const text = htmlContent.replace(/<[^>]*>/g, '').trim()

  if (text.length === 0) return '暂无详情'

  if (text.length <= maxLength) {
    return text
  }

  return text.substring(0, maxLength) + '...'
}
