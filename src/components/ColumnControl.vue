
<!-- src/components/ColumnControl.vue   创建独立的列控制组件 -->
<template>
  <div class="column-control">
    <el-popover placement="bottom" trigger="click">
      <template #reference>
        <el-button size="small" text>
          <Setting class="w-4 h-4 mr-1" />列设置
        </el-button>
      </template>

      <div class="p-2">
        <el-checkbox-group v-model="selectedColumnKeys">
          <el-checkbox
            v-for="col in columnOptions"
            :key="col.key"
            :label="col.key"
            class="block mb-2"
          >
            {{ col.label }}
          </el-checkbox>
        </el-checkbox-group>
      </div>
    </el-popover>
  </div>

</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Setting } from '@element-plus/icons-vue'

const emit = defineEmits(['update:modelValue'])
const props = defineProps({
  // 所有列配置选项
  columnOptions: {
    type: Array as () => Array<{ key: string; label: string }>,
    required: true,
    default: () => []
  },
  // 当前选中的列键值
  modelValue: {
    type: Array as () => string[],
    required: true,
    default: () => []
  }
})

// 选中的列键值
const selectedColumnKeys = ref<string[]>(props.modelValue)

// 监听变化并通知父组件
watch(selectedColumnKeys, (newVal) => {
  emit('update:modelValue', newVal)
})

</script>

<style scoped lang="scss">

.column-control {
  display: inline-block;
  margin-left: 10px;
}

</style>
