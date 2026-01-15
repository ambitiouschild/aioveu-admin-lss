<template>
  <div class="product-detail-preview">
    <template v-if="!detail || detail.trim() === ''">
      <span class="empty-text">-</span>
    </template>

    <template v-else>
      <!-- 显示第一张图片 -->
      <div v-if="firstImage" class="image-preview">
        <el-image
          :src="firstImage"
          fit="cover"
          class="preview-img"
          :preview-src-list="allImages"
          :initial-index="0"
          :preview-teleported="true"
        >
          <template #error>
            <div class="image-error">
              <el-icon><Picture /></el-icon>
            </div>
          </template>
        </el-image>

        <!-- 图片数量提示 -->
        <div v-if="imageCount > 1" class="image-count">
          <el-tag size="small" type="info">
            {{ imageCount }}张
          </el-tag>
        </div>
      </div>

      <!-- 文本预览 -->
      <div class="text-preview">
                <span class="preview-text">
                    {{ textPreview }}
                </span>
      </div>

      <!-- 操作按钮 -->
      <div class="action-buttons">
        <el-button
          type="primary"
          link
          size="small"
          @click="handlePreview"
        >
          查看详情
        </el-button>

        <el-popover
          placement="top"
          :width="300"
          trigger="hover"
        >
          <template #reference>
            <el-button
              type="primary"
              link
              size="small"
            >
              快速预览
            </el-button>
          </template>
          <div class="quick-preview">
            <div
              v-html="formatDetailContent(detail)"
              class="preview-content"
            ></div>
          </div>
        </el-popover>
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { getFirstImage, getImageCount, getAllImages, generateTextPreview, formatDetailContent } from '@/utils/htmlParser'

const props = defineProps({
  detail: String
})

const emit = defineEmits(['preview'])

// 计算属性
const firstImage = computed(() => getFirstImage(props.detail))
const imageCount = computed(() => getImageCount(props.detail))
const allImages = computed(() => getAllImages(props.detail))
const textPreview = computed(() => generateTextPreview(props.detail, 30))

const handlePreview = () => {
  emit('preview', props.detail)
}
</script>

<style scoped>
.product-detail-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
}

.image-preview {
  position: relative;
  display: inline-block;
}

.preview-img {
  width: 60px;
  height: 60px;
  border-radius: 4px;
  object-fit: cover;
  border: 1px solid #f0f0f0;
}

.image-count {
  position: absolute;
  bottom: -5px;
  right: -5px;
}

.text-preview {
  max-width: 100%;
  text-align: center;
}

.preview-text {
  font-size: 12px;
  color: #666;
  line-height: 1.4;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.empty-text {
  color: #999;
}

.image-error {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  color: #999;
}

.quick-preview {
  max-height: 200px;
  overflow-y: auto;
}

.preview-content {
  line-height: 1.6;
  font-size: 12px;
}

.preview-content img {
  max-width: 100%;
  height: auto;
}
</style>
