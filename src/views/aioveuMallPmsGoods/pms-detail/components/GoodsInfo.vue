<template>
  <div class="component-container">
    <!-- 主要内容区域 -->
    <div class="component-container__main">

      <el-form
        ref="dataFormRef"
        :rules="rules"
        :model="goodsInfo"
        label-width="120px"
        label-position="right"
      >
        <!-- 商品名称 -->
        <el-form-item label="商品名称" prop="name">
          <el-input
            v-model="goodsInfo.name"
            placeholder="请输入商品名称"
            clearable
            maxlength="100"
            show-word-limit
            style="width: 400px"
          />
        </el-form-item>

        <!-- 商品品牌 -->
        <el-form-item label="商品品牌" prop="brandId">
          <el-select
            v-model="goodsInfo.brandId"
            placeholder="请选择商品品牌"
            filterable
            clearable
            style="width: 400px"
          >
            <el-option
              v-for="brand in brandOptions"
              :key="brand.id"
              :label="brand.name"
              :value="brand.id"
            />
          </el-select>

          <span v-if="goodsInfo.brandName" class="brand-name-hint">
            已选品牌：{{ goodsInfo.brandName }}
          </span>

        </el-form-item>

        <!-- 零售价 -->
        <el-form-item label="零售价" prop="originPrice">
          <el-input
            v-model="goodsInfo.originPrice"
            placeholder="请输入零售价"
            type="number"
            min="0"
            step="0.01"
            style="width: 400px"
          >
            <template #prefix>¥</template>
          </el-input>

          <span v-if="goodsInfo.originPrice" class="price-hint">
            零售价：{{ formatPrice(goodsInfo.originPrice) }}
          </span>

        </el-form-item>

        <!-- 促销价 -->
        <el-form-item label="促销价" prop="price">
          <el-input
            v-model="goodsInfo.price"
            placeholder="请输入促销价"
            type="number"
            min="0"
            step="0.01"
            style="width: 400px"
          >
            <template #prefix>¥</template>
          </el-input>


        </el-form-item>

<!--        &lt;!&ndash; 商品主图 &ndash;&gt;-->
<!--        <el-form-item label="商品主图" prop="picUrl">-->
<!--          <SingleImageUpload-->
<!--            v-model="goodsInfo.picUrl"-->
<!--            :max-file-size="5"-->
<!--            accept=".jpg,.jpeg,.png,.webp"-->
<!--            :style="{ width: '200px', height: '200px' }"-->
<!--            :show-file-list="false"-->
<!--            action="/api/upload/image"-->
<!--            :headers="uploadHeaders"-->
<!--            :before-upload="handleBeforeUpload"-->
<!--            :on-success="handleMainImageSuccess"-->
<!--            :on-error="handleUploadError"-->
<!--          />-->
<!--          <div class="upload-tip">-->
<!--            建议尺寸：800×800px，最大5MB，支持格式：JPG、JPEG、PNG、WebP-->
<!--          </div>-->
<!--        </el-form-item>-->

        <el-form-item label="商品主图">
          <SingleImageUpload
            v-model="goodsInfo.picUrl"
            :maxFileSize="5"
            accept=".jpg,.jpeg,.png"
            @upload-success="handleMainImageSuccess"
          />

        </el-form-item>

        <!-- 商品轮播图 -->
        <el-form-item label="商品轮播图">
          <MultiImageUpload
            v-model="goodsInfo.album"
            :limit="10"
            :max-file-size="2"
            accept=".jpg,.jpeg,.png,.gif,.webp"
            :data="{ category: 'product' }"
          />

          <!-- 显示已有轮播图 -->
          <div v-if="goodsInfo.album && goodsInfo.album.length > 0" class="album-preview">
            <div class="album-title">当前轮播图 ({{ goodsInfo.album.length }})</div>
            <div class="album-images">
              <div
                v-for="(url, index) in goodsInfo.album"
                :key="index"
                class="album-image-item"
              >
                <el-image
                  :src="url"
                  fit="cover"
                  style="width: 80px; height: 80px; border-radius: 4px;"
                  :preview-src-list="goodsInfo.album"
                  :initial-index="index"
                />
                <span class="image-index">{{ index + 1 }}</span>
              </div>
            </div>
          </div>

        </el-form-item>

        <!-- 商品简介 -->
        <el-form-item label="商品简介">
          <el-input
            v-model="goodsInfo.description"
            type="textarea"
            placeholder="请输入商品简介，最多500字"
            :autosize="{ minRows: 3, maxRows: 6 }"
            maxlength="500"
            show-word-limit
            resize="none"
          />

        </el-form-item>

        <!-- 商品详情 -->
        <el-form-item label="商品详情" prop="detail">

          <Editor
            v-model="goodsInfo.detail"
            :style="{ height: '600px' }"
            :placeholder="'请输入商品详情内容'"
            @change="handleEditorChange"
          />

        </el-form-item>
      </el-form>
    </div>

    <!-- 底部操作按钮 -->
    <div class="component-container__footer">
      <el-button @click="handlePrev">上一步，选择商品分类</el-button>
      <el-button type="primary" @click="handleNext">下一步，设置商品属性</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
// ==================== 导入依赖 ====================
import { ref, computed, onMounted, reactive } from "vue";
import { ElMessage, type FormInstance } from "element-plus";

// 导入组件
import Editor from "@/components/WangEditor/index.vue";
import SingleImageUpload from "@/components/Upload/SingleImageUpload.vue";
import MultiImageUpload from "@/components/Upload/MultiImageUpload.vue";

// 导入API
import PmsBrandAPI from "@/api/aioveuMall/aioveuMallPms/aioveuMallPmsBrand/pms-brand";

// 导入父组件使用的类型
import type { PmsSpuPageVO } from "@/api/aioveuMall/aioveuMallPms/aioveuMallPmsSpu/pms-spu";

// ==================== 类型定义 ====================
interface BrandOption {
  id: number;
  name: string;
  logoUrl?: string;
  [key: string]: any;
}


interface FormRules {
  [key: string]: Array<{
    required?: boolean;
    message: string;
    trigger: string;
    validator?: (rule: any, value: any, callback: any) => void;
  }>;
}

// ==================== Props和Emit ====================
const props = defineProps<{
  modelValue: PmsSpuPageVO;
  isEditMode?: boolean;  // 新增：接收编辑模式标志
}>();

const emit = defineEmits<{
  (e: "prev"): void;
  (e: "next"): void;
  (e: "update:modelValue", value: PmsSpuPageVO): void;
}>();

// ==================== 响应式数据 ====================
// 表单引用
const dataFormRef = ref<FormInstance>();

// 品牌选项
const brandOptions = ref<BrandOption[]>([]);
const localGoodsInfo = ref({});

// 商品信息（双向绑定）
const goodsInfo = computed<PmsSpuPageVO>({
  get: () => props.modelValue,
  set: (value) => {
    emit("update:modelValue", value);
  },
});

// 表单验证规则
const rules = reactive<FormRules>({
  name: [
    { required: true, message: "请填写商品名称", trigger: "blur" },
    { min: 2, max: 100, message: "商品名称长度在2-100个字符", trigger: "blur" } as any // ✅ 使用类型断言
  ],
  brandId: [
    { required: true, message: "请选择商品品牌", trigger: "change" }
  ],
  originPrice: [
    { required: true, message: "请填写零售价", trigger: "blur" },
  ],
  price: [
    { required: true, message: "请填写促销价", trigger: "blur" },
  ],
  picUrl: [
    { required: true, message: "请上传商品主图", trigger: "change" }
  ],
  detail: [
    { required: true, message: "请填写商品详情", trigger: "blur" }
  ]
});


// ==================== 计算属性 ====================


// ==================== 业务方法 ====================
/**
 * 加载品牌数据
 */
const loadBrandData = async (): Promise<void> => {
  try {
    console.log("📦 开始加载品牌数据");

    const response = await PmsBrandAPI.getBrandList();

    if (response && Array.isArray(response)) {

      brandOptions.value = response as BrandOption[];

      console.log(`✅ 品牌数据加载成功，共 ${brandOptions.value.length} 条,{}`,brandOptions.value);

    } else {
      console.warn("⚠️ 品牌数据格式错误");
      ElMessage.warning("品牌数据加载失败");
    }
  } catch (error) {
    console.error("❌ 加载品牌数据失败:", error);
    ElMessage.error("加载品牌失败，请重试");
  }
};


/**
 * 格式化价格
 */
const formatPrice = (price: number | undefined): string => {
  if (price === undefined || price === null) return '0.00';
  return Number(price).toFixed(2);
};


/**
 * 上一步
 */
const handlePrev = (): void => {
  console.log("⬅️ 返回上一步");
  emit("prev");
};

/**
 * 下一步
 */
const handleNext = async (): Promise<void> => {
  try {
    if (!dataFormRef.value) {
      console.error("表单引用未初始化");
      return;
    }

    // 表单验证
    const isValid = await dataFormRef.value.validate();

    if (isValid) {
      // 额外的业务验证
      if (goodsInfo.value.price && goodsInfo.value.originPrice &&
        Number(goodsInfo.value.price) > Number(goodsInfo.value.originPrice)) {
        ElMessage.warning("促销价不能高于零售价");
        return;
      }

      console.log("✅ 表单验证通过");
      console.log("商品信息:", goodsInfo.value);

      // 触发下一步事件
      emit("next");
    } else {
      console.log("❌ 表单验证失败");
      ElMessage.warning("请填写完整的商品信息");
    }
  } catch (error) {
    console.error("表单验证出错:", error);
  }
};

// ==================== 上传相关方法 ====================

/**
 * 主图上传成功
 */
const handleMainImageSuccess = (response: any): void => {
  console.log("✅ 主图上传成功:", response);
  if (response.data && response.data.url) {
    goodsInfo.value.picUrl = response.data.url;
    ElMessage.success("主图上传成功");
  }
};


/**
 * 编辑器内容变化
 */
const handleEditorChange = (html: string): void => {
  console.log("📝 编辑器内容变化，字符数:", html?.length || 0);
  goodsInfo.value.detail = html;
};

// ==================== 生命周期钩子 ====================
onMounted(async () => {

  console.log("🔄 GoodsInfo 组件挂载");

  // 初始数据
  localGoodsInfo.value = { ...goodsInfo.value };
  console.log("📦 初始数据:", localGoodsInfo.value);

  loadBrandData();

});

// ==================== 计算属性和监听 ====================
//核心问题：步骤切换导致组件重新创建，数据在重新创建时可能丢失。需要确保在组件重新创建时能获取到完整数据。
// 监听父组件传递的数据变化
watch(() => props.modelValue, (newValue) => {
  console.log("🔄 GoodsInfo 监听到父组件数据变化:", {
    id: newValue.id,
    name: newValue.name,
    picUrl: newValue.picUrl,
    albumLength: newValue.album?.length || 0,
    detailLength: newValue.detail?.length || 0,
    goodsInfo:goodsInfo.value,
  });
}, { deep: true, immediate: true });



// 监听品牌ID变化
watch(() => goodsInfo.value.brandId, (newBrandId) => {
  if (newBrandId) {
    const selectedBrand = brandOptions.value.find(brand => brand.id === newBrandId);
    console.log("选中的品牌:", selectedBrand?.name);
  }
});

// 监听价格变化，自动比较
watch(() => [goodsInfo.value.originPrice, goodsInfo.value.price], () => {
  if (goodsInfo.value.originPrice && goodsInfo.value.price &&
    Number(goodsInfo.value.price) > Number(goodsInfo.value.originPrice)) {
    console.warn("⚠️ 促销价高于零售价");
  }
});

// 监听详情变化
watch(() => goodsInfo.value.detail, (newDetail) => {
  console.log("📝 详情数据，长度:", newDetail?.length || 0);
}, { immediate: true });

</script>

<style lang="scss" scoped>
.component-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: calc(100vh - 200px);
  padding: 20px;
  box-sizing: border-box;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

  &__main {
    flex: 1;
    width: 100%;
    max-width: 900px;
    margin: 0 auto;
    overflow-y: auto;
    padding-bottom: 80px; // 为底部按钮留出空间

    .el-form {
      .el-form-item {
        margin-bottom: 24px;

        &:last-child {
          margin-bottom: 0;
        }

        .el-input,
        .el-select,
        .el-textarea {
          width: 100%;
          max-width: 400px;
        }

        .el-textarea {
          :deep(.el-textarea__inner) {
            resize: vertical;
            font-family: inherit;
            line-height: 1.5;
          }
        }
      }
    }
  }

  &__footer {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 16px 20px;
    background-color: #fff;
    border-top: 1px solid #ebeef5;
    text-align: right;
    box-shadow: 0 -2px 12px 0 rgba(0, 0, 0, 0.05);
    z-index: 100;

    .el-button {
      min-width: 120px;
      height: 40px;
      font-size: 16px;
      font-weight: 500;
      margin-left: 12px;

      &:first-child {
        margin-left: 0;
      }
    }
  }
}

// 上传组件样式
:deep(.el-upload) {
  border: 1px dashed #dcdfe6;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: border-color 0.2s;

  &:hover {
    border-color: #409eff;
  }
}

:deep(.el-upload-list) {
  margin-top: 8px;
}

.upload-tip {
  font-size: 12px;
  color: #909399;
  line-height: 1.5;
  margin-top: 8px;
}

// 富文本编辑器样式
:deep(.editor-container) {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  overflow: hidden;

  .w-e-text-container {
    border: none;
  }

  .w-e-bar {
    border-bottom: 1px solid #dcdfe6;
  }
}

// 响应式设计
@media (max-width: 768px) {
  .component-container {
    padding: 15px;

    &__main {
      padding-bottom: 70px;

      .el-form {
        .el-form-item {
          margin-bottom: 20px;

          .el-input,
          .el-select,
          .el-textarea {
            max-width: 100%;
          }
        }
      }
    }

    &__footer {
      padding: 12px 15px;
      text-align: center;

      .el-button {
        width: 48%;
        min-width: auto;
        margin: 0;

        &:first-child {
          margin-right: 4%;
        }
      }
    }
  }
}

@media (max-width: 480px) {
  .component-container {
    padding: 10px;

    &__main {
      .el-form {
        .el-form-item {
          :deep(.el-form-item__label) {
            width: 100% !important;
            text-align: left;
            margin-bottom: 8px;
          }

          :deep(.el-form-item__content) {
            margin-left: 0 !important;
          }
        }
      }
    }

    &__footer {
      padding: 10px;

      .el-button {
        width: 100%;
        margin-bottom: 8px;

        &:last-child {
          margin-bottom: 0;
        }
      }
    }
  }
}
</style>
