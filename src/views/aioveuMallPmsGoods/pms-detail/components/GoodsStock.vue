<template>
  <div class="component-container">
    <!-- 主要内容区域 -->
    <div class="component-container__main">
      <!-- 规格设置卡片 -->
      <el-card class="box-card" shadow="never">
        <template #header>
          <div class="card-header">
            <span class="card-title">商品规格</span>
            <el-button
              type="success"
              size="small"
              @click="handleAddSpec"
              :disabled="specForm.specList.length >= 3"
            >
              <el-icon><Plus /></el-icon>
              添加规格项
            </el-button>
          </div>
        </template>

        <!-- 规格表单 -->
        <el-form
          ref="specFormRef"
          :model="specForm"
          :rules="specRules"
          size="small"
          label-width="0"
        >
          <el-table
            :data="specForm.specList"
            row-key="id"
            size="small"
            border
            stripe
            v-if="specForm.specList.length > 0"
          >
            <!-- 规格名称列 -->
            <el-table-column label="规格名" width="200">
              <template #default="scope">
                <el-form-item
                  :prop="`specList[${scope.$index}].name`"
                  :rules="specNameRules"
                  class="table-form-item"
                >
                  <el-input
                    v-model="scope.row.name"
                    placeholder="请输入规格名称"
                    clearable
                    @input="handleSpecChange"
                  />
                </el-form-item>
              </template>
            </el-table-column>

            <!-- 规格值列 -->
            <el-table-column label="规格值">
              <template #header>
                <span>规格值</span>
<!--                <el-link type="danger" style="font-size: 12px; margin-left: 8px" underline="never">-->
<!--                  （默认第一条规格包含图片）-->
<!--                </el-link>-->
              </template>

              <template #default="scope">
                <div class="spec-values-container">
                  <!-- 规格值标签 -->
                  <el-tag
                    v-for="value in scope.row.values"
                    :key="value.id"
                    size="small"
                    closable
                    :type="getColorType(scope.$index) as any"
                    class="spec-value-tag"
                    @close="handleRemoveSpecValue(scope.$index, value.id)"
                  >
                    {{ value.value }}
                    <span v-if="value.picUrl" class="has-image-icon">🖼️</span>
                  </el-tag>

                  <!-- 第一个规格项的图片上传 -->
<!--                  <div v-if="scope.$index === 0" class="spec-image-upload">-->
<!--                    <SingleImageUpload-->
<!--                      v-if="scope.row.values && scope.row.values.length > 0"-->
<!--                      v-model="getFirstSpecValue(scope.row)!.picUrl"-->
<!--                      :maxFileSize="5"-->
<!--                      accept=".jpg,.jpeg,.png"-->
<!--                      @upload-success="handleImageUploadSuccess"-->
<!--                    />-->
<!--                    <div class="upload-tip">最大图片大小：5MB，支持格式：JPG、JPEG、PNG</div>-->
<!--                  </div>-->

                  <!-- 规格值输入框 -->
                  <el-input
                    v-if="tagInputs[scope.$index]?.visible"
                    v-model="tagInputs[scope.$index].value"
                    class="spec-input"
                    size="small"
                    placeholder="请输入规格值"
                    @keyup.enter="handleInputSpecValue(scope.$index)"
                    @blur="handleInputSpecValue(scope.$index)"
                    @keyup.esc="cancelSpecInput(scope.$index)"
                    ref="specInputRefs"
                  />

                  <!-- 添加规格值按钮 -->
                  <el-button
                    v-else
                    type="primary"
                    size="small"
                    plain
                    @click="showSpecInput(scope.$index)"
                  >
                    <el-icon><Plus /></el-icon>
                    添加规格值
                  </el-button>
                </div>
              </template>
            </el-table-column>

            <!-- 操作列 -->
            <el-table-column width="80" label="操作" align="center" fixed="right">
              <template #default="scope">
                <el-tooltip content="删除该规格" placement="top">
                  <el-button
                    type="danger"
                    size="small"
                    circle
                    plain
                    @click.stop="handleRemoveSpec(scope.$index)"
                  >
                    <el-icon><Minus /></el-icon>
                  </el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>

          <!-- 空状态 -->
          <div v-else class="empty-state">
            <el-empty description="暂无规格配置" :image-size="100">
              <el-button type="primary" @click="handleAddSpec">添加规格</el-button>
            </el-empty>
          </div>
        </el-form>
      </el-card>

      <!-- 库存设置卡片 -->
      <el-card
        class="box-card"
        shadow="never"
        v-if="specForm.specList.some((spec) => spec.values && spec.values.length > 0)"
        style="margin-top: 20px"
      >
        <template #header>
          <div class="card-header">
            <span class="card-title">商品库存</span>
            <span class="sku-count">共 {{ skuForm.skuList.length }} 个SKU</span>
          </div>
        </template>

        <!-- SKU表单 -->
        <el-form ref="skuFormRef" :model="skuForm" :rules="skuRules" size="small" label-width="0">
          <el-table
            :data="skuForm.skuList"
            border
            stripe
            size="small"
            class="sku-table"
            v-if="skuForm.skuList.length > 0"
          >
            <!-- 动态生成规格列 -->
            <!-- 保持120px -->
            <el-table-column
              v-for="(title, index) in specTitles"
              :key="index"
              :label="title"
              align="center"
              width="120"
            >
              <template #default="scope">
                <span class="spec-value">{{ scope.row[`specValue${index + 1}`] }}</span>
              </template>
            </el-table-column>

            <!-- SKU编码 -->
            <!-- 增加到180px -->
            <el-table-column label="SKU编码" width="180" align="center">
              <template #default="scope">
                <el-form-item
                  :prop="`skuList[${scope.$index}].skuSn`"
                  :rules="skuSnRules"
                  class="table-form-item"
                >
                  <el-input v-model="scope.row.skuSn" placeholder="如: SKU001" clearable />
                </el-form-item>
              </template>
            </el-table-column>

            <!-- 价格 -->
            <el-table-column label="价格(元)" width="150" align="center">
              <template #default="scope">
                <el-form-item
                  :prop="`skuList[${scope.$index}].price`"
                  :rules="priceRules"
                  class="table-form-item"
                >
                  <el-input
                    v-model.number="scope.row.price"
                    type="number"
                    placeholder="0.00"
                    :min="0"
                    :step="0.01"
                    @input="handlePriceChange(scope.row)"
                  >
                    <template #prefix>¥</template>
                  </el-input>
                </el-form-item>
              </template>
            </el-table-column>

            <!-- 库存 -->
            <el-table-column label="库存" width="120" align="center">
              <template #default="scope">
                <el-form-item
                  :prop="`skuList[${scope.$index}].stock`"
                  :rules="stockRules"
                  class="table-form-item"
                >
                  <el-input
                    v-model.number="scope.row.stock"
                    type="number"
                    placeholder="0"
                    :min="0"
                    :step="1"
                  />
                </el-form-item>
              </template>
            </el-table-column>

            <!-- SKU图片预览 -->
            <!-- 增加SKU图片列的宽度到300px -->
            <el-table-column label="规格图片" width="300" align="center" >
              <template #default="scope">
                <div class="sku-image-cell">
                  <SingleImageUpload
                    v-model="scope.row.picUrl"
                    :maxFileSize="5"
                    accept=".jpg,.jpeg,.png"
                    :show-file-list="false"
                    button-text="上传图片"
                    button-size="small"
                    :show-tip="false"
                    @upload-success="
                      (url: string) => handleSkuImageUploadSuccess(scope.$index, url)
                    "
                  />
                  <!-- 图片预览 -->

                  <el-image
                    v-if="scope.row.picUrl"
                    :src="scope.row.picUrl"
                    :preview-src-list="[scope.row.picUrl]"
                    :initial-index="0"
                    fit="cover"
                    style="width: 40px; height: 40px; border-radius: 4px; cursor: pointer"
                    class="sku-image-preview"
                  />
                  <span v-else class="no-image">无图</span>
                </div>
              </template>
            </el-table-column>
          </el-table>

          <!-- SKU空状态 -->
          <div v-else class="empty-state">
            <el-empty description="请先配置规格值" :image-size="100" />
          </div>
        </el-form>
      </el-card>
    </div>

    <!-- 底部操作按钮 -->
    <div class="component-container__footer">
      <el-button @click="handlePrev">上一步，设置商品属性</el-button>
      <el-button type="primary" @click="handleSubmit">提交商品</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
// ==================== 导入依赖 ====================
import { ref, computed, onMounted, watch, nextTick } from "vue";
import { ElMessage, ElNotification, type FormInstance, type FormRules } from "element-plus";
import { Plus, Minus } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";

// 导入组件
import SingleImageUpload from "@/components/Upload/SingleImageUpload.vue";

// 导入API

//这个组件不需要调用 PmsSpuAttributeAPI来加载规格数据。规格数据应该来自父组件传递的商品信息，或者用户手动添加。
// import PmsSpuAttributeAPI from "@/api/aioveuMall/aioveuMallPms/aioveuMallPmsSpuAttribute/pms-spu-attribute";

import PmsSpuAPI from "@/api/aioveuMall/aioveuMallPms/aioveuMallPmsSpu/pms-spu";

// ==================== 类型定义 ====================
/**
 * 规格值接口
 */
interface SpecValue {
  id: string; // 规格值ID - 必须为字符串
  value: string; // 规格值名称
  picUrl?: string; // 规格图片URL
  [key: string]: any; // 其他字段
}

/**
 * 规格项接口
 */
interface Specification {
  id: string; // 规格ID - 必须为字符串
  name: string; // 规格名称
  values: SpecValue[]; // 规格值列表
  [key: string]: any; // 其他字段
}

/**
 * SKU项接口
 */
interface SkuItem {
  id?: number; // SKU ID
  skuSn: string; // SKU编码
  price: number; // 价格（元）
  stock: number; // 库存
  specIds: string; // 规格ID组合
  Lockedstock: number;
  specValues: string; // 规格值组合
  picUrl?: string; // SKU组合图片 - 每个SKU独立
  [key: string]: any; // 动态规格字段
}

/**
 * 商品信息接口
 */
interface GoodsInfo {
  id?: number; // 商品ID
  name?: string; // 商品名称 ✅ 改为可选
  categoryId?: number; // 分类ID
  brandId?: number; // 品牌ID
  originPrice?: number; // 原价（单位：分）
  price?: number; // 现价（单位：分）
  album?: any[]; // 商品相册图片数组 ✅ 改为可选
  attrList?: any[]; // 商品属性列表 ✅ 改为可选
  specList?: any[]; // 规格列表
  skuList?: any[]; // SKU列表
  detail?: string; // 商品详情HTML ✅ 改为可选
  sales?: number; // 销量 ✅ 改为可选
  stock?: number; // 总库存 ✅ 改为可选
  picUrl?: string; // 商品主图 ✅ 改为可选
  categoryName?: string; // 分类名称 ✅ 改为可选
  brandName?: string; // 品牌名称 ✅ 改为可选
  activeStep?: number; // 当前步骤 ✅ 添加步骤字段
  [key: string]: any; // 其他字段
}

/**
 * 规格输入框状态
 */
interface TagInputState {
  value?: string; // 输入值
  visible: boolean; // 是否显示
}

// ==================== Props和Emit ====================
const props = defineProps<{
  modelValue: GoodsInfo; // 双向绑定的商品信息
}>();

const emit = defineEmits<{
  (e: "prev"): void; // 上一步事件
  (e: "update:modelValue", value: GoodsInfo): void; // 更新商品信息
}>();

// ==================== 路由和组件引用 ====================
const router = useRouter();
const specFormRef = ref<FormInstance>();
const skuFormRef = ref<FormInstance>();
const specInputRefs = ref<HTMLInputElement[]>([]);

// ==================== 响应式数据 ====================
// 规格表单数据
const specForm = ref<{ specList: Specification[] }>({
  specList: [],
});

// SKU表单数据
const skuForm = ref<{ skuList: SkuItem[] }>({
  skuList: [],
});

// 规格标题
const specTitles = ref<string[]>([]);

// 规格输入框状态
const tagInputs = ref<TagInputState[]>([{ value: undefined, visible: false }]);

// 加载状态
// const loading = ref(false);

// 临时ID前缀
const TEMP_ID_PREFIX = "temp_";

// ==================== 工具函数 ====================
/**
 * 生成临时ID
 */
const generateTempId = (): string => {
  return `${TEMP_ID_PREFIX}${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * 判断是否是临时ID
 */
const isTempId = (id: string): boolean => {
  return id.startsWith(TEMP_ID_PREFIX);
};

/**
 * 获取颜色类型
 */
const getColorType = (index: number): string => {
  const types = ["primary", "success", "info", "warning", "danger"];
  return types[index % types.length];
};

/**
 * 获取第一个规格值
 */
// const getFirstSpecValue = (spec: Specification): SpecValue | undefined => {
//   return spec.values && spec.values.length > 0 ? spec.values[0] : undefined;
// };

/**
 * 检查是否有规格图片 这个检查逻辑有问题。您当前的逻辑是检查规格值是否有图片，但您想要的是检查SKU是否有图片。
 */
// const hasSpecImage = computed(() => {
//   return specForm.value.specList.some(spec =>
//     spec.values.some(value => value.picUrl)
//   );
// });

/**
 * 检查是否有SKU图片
 * 总结：
 * 1.原逻辑错误：检查的是规格值图片，不是SKU图片
 * 2.建议方案：直接显示图片列，不需要条件判断
 * 3.如果必须条件判断：使用hasSkuImage计算属性
 * 推荐直接显示图片列，因为：
 * 用户需要知道可以上传SKU图片
 * 避免用户困惑为什么没有图片上传功能
 * 即使当前没有图片，也应该显示上传按钮
 *
 */
// const hasSkuImage = computed(() => {
//   return !skuForm.value.skuList.some((sku) => sku.picUrl);
// });

// ==================== 表单验证规则 ====================
// 规格表单规则
const specRules: FormRules = {
  specList: [],
};

// 规格名称验证
const specNameRules = [
  { required: true, message: "请输入规格名称", trigger: "blur" },
  { min: 1, max: 20, message: "规格名称长度在1-20个字符", trigger: "blur" },
];

// SKU表单规则
const skuRules: FormRules = {
  skuList: [],
};

// SKU编码验证
const skuSnRules = [
  { required: true, message: "请输入SKU编码", trigger: "blur" },
  { min: 1, max: 50, message: "SKU编码长度在1-50个字符", trigger: "blur" },
];

// 价格验证
const priceRules = [
  { required: true, message: "请输入价格", trigger: "blur" },
  {
    validator: (rule: any, value: any, callback: any) => {
      if (value === undefined || value === null || value === "") {
        callback(new Error("价格不能为空"));
      } else if (isNaN(Number(value))) {
        callback(new Error("价格必须是数字"));
      } else if (Number(value) < 0) {
        callback(new Error("价格不能小于0"));
      } else if (Number(value) > 9999999) {
        callback(new Error("价格超出范围"));
      } else {
        callback();
      }
    },
    trigger: "blur",
  },
];

// 库存验证
const stockRules = [
  { required: true, message: "请输入库存", trigger: "blur" },
  {
    validator: (rule: any, value: any, callback: any) => {
      if (value === undefined || value === null || value === "") {
        callback(new Error("库存不能为空"));
      } else if (isNaN(Number(value))) {
        callback(new Error("库存必须是数字"));
      } else if (!Number.isInteger(Number(value))) {
        callback(new Error("库存必须是整数"));
      } else if (Number(value) < 0) {
        callback(new Error("库存不能小于0"));
      } else if (Number(value) > 999999) {
        callback(new Error("库存超出范围"));
      } else {
        callback();
      }
    },
    trigger: "blur",
  },
];

// 商品信息双向绑定
const goodsInfo = computed<GoodsInfo>({
  get: () => props.modelValue,
  set: (value) => {
    emit("update:modelValue", value);
  },
});

// ==================== 业务方法 ====================
/**
 * 加载商品数据（编辑模式）
 */
const loadGoodsData = async (): Promise<void> => {
  try {

    const goodsId = goodsInfo.value.id;

    console.log("🔍 加载商品规格数据，商品信息:", {
      id: goodsId,
      hasSpecList: !!goodsInfo.value.specList,
      hasSkuList: !!goodsInfo.value.skuList
    });

    if (!goodsId) {
      console.log("📝 没有商品ID，跳过数据加载");
      return;
    }

    // 如果有规格数据，处理规格
    if (goodsInfo.value.specList && goodsInfo.value.specList.length > 0) {
      console.log("📦 开始处理规格数据:", goodsInfo.value.specList);
      await processSpecList(goodsInfo.value.specList);
    }else {
      console.log("📝 商品没有规格数据");
    }

    // 处理SKU数据
    if (goodsInfo.value.skuList && goodsInfo.value.skuList.length > 0) {
      console.log("📦 开始处理SKU数据:", goodsInfo.value.skuList);
      await processSkuList(goodsInfo.value.skuList);
    }else {
      console.log("📝 商品没有SKU数据");
    }

    // 重新生成SKU列表
    generateSkuList();


  } catch (error) {
    console.error("加载商品数据失败:", error);
  }
};

/**
 * 处理规格列表
 */
const processSpecList = async (specList: any[]): Promise<void> => {
  const specs: Specification[] = [];
  const specMap = new Map<string, Specification>();

  // 按规格名称分组
  specList.forEach((item: any) => {
    if (!specMap.has(item.name)) {
      specMap.set(item.name, {
        id: item.id ? String(item.id) : generateTempId(),
        name: item.name || "",
        values: [],
      });
    }

    const spec = specMap.get(item.name)!;
    spec.values.push({
      id: item.id ? String(item.id) : generateTempId(),
      value: item.value || "",
      picUrl: item.picUrl,
    });
  });

  // 转换为数组
  specMap.forEach((spec) => {
    specs.push(spec);
  });

  specForm.value.specList = specs;
  tagInputs.value = specs.map(() => ({ value: undefined, visible: false }));
  updateSpecTitles();

  console.log("✅ 处理规格数据完成:", specs);
};

/**
 * 处理SKU列表
 */
const processSkuList = async (skuList: any[]): Promise<void> => {
  // 转换价格（分转元）
  const processedSkus: SkuItem[] = skuList.map((sku) => {
    const skuItem: SkuItem = {
      id: sku.id,
      skuSn: sku.skuSn || `SKU_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      price: sku.price ? sku.price / 100 : 0,
      stock: sku.stock || 0,
      Lockedstock: 0,
      specIds: sku.specIds || "",
      specValues: sku.specValues || "",
      picUrl: sku.picUrl,
    };

    // 解析规格值
    if (sku.specValues) {
      const values = sku.specValues.split("_");
      values.forEach((value: string, index: number) => {
        skuItem[`specValue${index + 1}`] = value;
      });
    }

    return skuItem;
  });

  skuForm.value.skuList = processedSkus;
  console.log("✅ 处理SKU数据完成:", processedSkus);
};

/**
 * 更新规格标题
 */
const updateSpecTitles = (): void => {
  specTitles.value = specForm.value.specList
    .filter((spec) => spec.values && spec.values.length > 0)
    .map((spec) => spec.name);
  console.log("📊 规格标题:", specTitles.value);
};

/**
 * 添加规格
 */
const handleAddSpec = (): void => {
  if (specForm.value.specList.length >= 3) {
    ElMessage.warning("最多支持3个规格");
    return;
  }

  const newSpec: Specification = {
    id: generateTempId(),
    name: "",
    values: [],
  };

  specForm.value.specList.push(newSpec);
  tagInputs.value.push({ value: undefined, visible: false });

  console.log(`➕ 添加规格，当前共 ${specForm.value.specList.length} 个`);
  updateSpecTitles();
};

/**
 * 删除规格
 */
const handleRemoveSpec = (index: number): void => {
  if (specForm.value.specList.length <= 1) {
    ElMessage.warning("至少需要保留一个规格");
    return;
  }

  console.log(`🗑️ 删除规格: ${specForm.value.specList[index].name}`);
  specForm.value.specList.splice(index, 1);
  tagInputs.value.splice(index, 1);

  // 重新生成SKU
  generateSkuList();
  updateSpecTitles();
};

/**
 * 显示规格值输入框
 */
const showSpecInput = (index: number): void => {
  tagInputs.value[index] = { value: undefined, visible: true };
  nextTick(() => {
    const input = document.querySelector(`.spec-input`) as HTMLInputElement;
    input?.focus();
  });
};

/**
 * 取消规格值输入
 */
const cancelSpecInput = (index: number): void => {
  tagInputs.value[index].visible = false;
  tagInputs.value[index].value = undefined;
};

/**
 * 处理规格值输入
 */
const handleInputSpecValue = (index: number): void => {
  const inputValue = tagInputs.value[index].value?.trim();

  if (!inputValue) {
    cancelSpecInput(index);
    return;
  }

  // 检查重复
  const spec = specForm.value.specList[index];
  const exists = spec.values.some((v) => v.value === inputValue);

  if (exists) {
    ElMessage.warning("规格值已存在");
    return;
  }

  // 添加规格值
  const newValue: SpecValue = {
    id: generateTempId(),
    value: inputValue,
  };

  spec.values.push(newValue);
  console.log(`➕ 添加规格值: ${inputValue}`);

  // 重置输入框
  cancelSpecInput(index);

  // 重新生成SKU
  generateSkuList();
  updateSpecTitles();
};

/**
 * 删除规格值
 */
const handleRemoveSpecValue = (specIndex: number, valueId: string): void => {
  const spec = specForm.value.specList[specIndex];
  const valueIndex = spec.values.findIndex((v) => v.id === valueId);

  if (valueIndex === -1) return;

  const removedValue = spec.values[valueIndex];
  console.log(`🗑️ 删除规格值: ${removedValue.value}`);

  spec.values.splice(valueIndex, 1);

  // 重新生成SKU
  generateSkuList();
  updateSpecTitles();
};

/**
 * 处理规格变化
 */
const handleSpecChange = (): void => {
  updateSpecTitles();
};

/**
 * 生成SKU列表（笛卡尔积）
 */
const generateSkuList = (): void => {
  console.log("🔄 开始生成SKU列表");

  // 过滤有值的规格
  const validSpecs = specForm.value.specList.filter(
    (spec) => spec.values && spec.values.length > 0
  );

  if (validSpecs.length === 0) {
    skuForm.value.skuList = [];
    console.log("📝 无有效规格，清空SKU列表");
    return;
  }

  // 计算笛卡尔积
  const cartesianProduct = (...arrays: any[][]) => {
    return arrays.reduce(
      (acc, curr) => {
        return acc.flatMap((x) => curr.map((y) => [...x, y]));
      },
      [[]]
    );
  };

  // 获取所有规格值的组合
  const valueCombinations = cartesianProduct(...validSpecs.map((spec) => spec.values));

  // 生成SKU列表
  const newSkus: SkuItem[] = valueCombinations.map((values: SpecValue[], index) => {
    const specValues = values.map((v) => v.value).join("_");

    // 数据库中的 specIds可能是下划线分隔，而您生成的 specIds是竖线分隔
    const specIds = values.map((v) => v.id).join("_"); // 改为竖线

    // 查找现有SKU
    const existingSku = skuForm.value.skuList.find((sku) => sku.specIds === specIds);

    console.log(`✅ 查找现有SKU`,existingSku);

    // 构建SKU对象
    const sku: SkuItem = {
      skuSn:
        existingSku?.skuSn ||
        `SKU_${Date.now().toString(36).substr(2, 4)}_${index + 1}`.toUpperCase(),
      price: existingSku?.price || 0,
      stock: existingSku?.stock || 0,
      Lockedstock: existingSku?.Lockedstock || 0,
      specIds,
      specValues,
      id: existingSku?.id,
      // picUrl: values[0]?.picUrl  // 第一个规格值的图片
      picUrl: existingSku?.picUrl || "", // 保留现有图片
    };

    // 添加动态规格字段
    values.forEach((value, i) => {
      sku[`specValue${i + 1}`] = value.value;
    });

    return sku;
  });

  skuForm.value.skuList = newSkus;
  console.log(`✅ 生成 ${newSkus.length} 个SKU`);
  console.log(`✅ 生成SKU`,newSkus);
};

/**
 * 处理价格变化
 */
const handlePriceChange = (sku: SkuItem): void => {
  if (sku.price < 0) {
    sku.price = 0;
    ElMessage.warning("价格不能小于0");
  }
};

/**
 * 处理图片上传成功
 */
// const handleImageUploadSuccess = (url: string): void => {
//   console.log("✅ 图片上传成功:", url);
//
//   // 更新第一个规格的第一个规格值的图片
//   if (specForm.value.specList[0]?.values[0]) {
//     specForm.value.specList[0].values[0].picUrl = url;
//
//     // 重新生成SKU以更新图片
//     generateSkuList();
//     ElMessage.success("图片上传成功");
//   }
// };

/**
 * 处理SKU图片上传成功
 */
const handleSkuImageUploadSuccess = (index: number, url: string): void => {
  console.log(`✅ SKU图片上传成功: ${url}, SKU索引: ${index}`);

  if (skuForm.value.skuList[index]) {
    skuForm.value.skuList[index].picUrl = url;
    ElMessage.success("SKU图片上传成功");
  }
};

/**
 * 上一步
 */
const handlePrev = (): void => {
  console.log("⬅️ 返回上一步");
  emit("prev");
};

/**
 * 提交表单
 */
const handleSubmit = async (): Promise<void> => {
  try {
    console.log("📤 开始提交表单");
    console.log("📤 提交数据的分类id:", goodsInfo.value.categoryId);

    // 1. 检查必填字段
    if (!goodsInfo.value.categoryId) {
      ElMessage.warning("请先选择商品分类");
      return;
    }

    // 2. 验证规格表单
    if (!specFormRef.value) {
      console.error("规格表单未初始化");
      return;
    }

    const specValid = await specFormRef.value.validate();
    if (!specValid) {
      ElMessage.warning("请填写完整的规格信息");
      return;
    }

    // 3. 检查规格值
    const hasSpecValues = specForm.value.specList.some(
      (spec) => spec.values && spec.values.length > 0
    );

    if (!hasSpecValues) {
      ElMessage.warning("请至少为一个规格添加规格值");
      return;
    }

    // 4. 验证SKU表单
    if (!skuFormRef.value) {
      console.error("SKU表单未初始化");
      return;
    }

    const skuValid = await skuFormRef.value.validate();
    if (!skuValid) {
      ElMessage.warning("请填写完整的SKU信息");
      return;
    }

    // 5. 检查是否有SKU
    if (skuForm.value.skuList.length === 0) {
      ElMessage.warning("未生成商品SKU");
      return;
    }

    // 6. 准备提交数据
    const submitData = { ...goodsInfo.value };

    // 处理规格数据 - 按照后端期望的格式
    const processedSpecs: any[] = [];
    specForm.value.specList.forEach((spec) => {
      spec.values.forEach((value) => {
        // 构建规格对象 - ID必须为字符串
        const specObj: any = {
          name: spec.name || "",
          value: value.value || "",
          picUrl: value.picUrl || "",
        };

        // 关键修复：确保每个规格对象都有id字段
        // 1. 如果是临时ID，保留id字段
        // 2. 如果不是临时ID，保留id字段
        // 3. 如果id不存在，生成一个
        let specId = value.id;
        if (!specId) {
          specId = generateTempId(); // 如果id不存在，生成一个临时ID
        }

        // ID处理：临时ID不包含，已有ID保留
        if (value.id && !isTempId(value.id)) {
          specObj.id = value.id; // 已有ID
        }
        // 临时ID的specObj不包含id字段，后端会将其视为新增

        specObj.id = specId; // 所有规格对象都要有id字段

        processedSpecs.push(specObj);
      });
    });
    submitData.specList = processedSpecs;

    console.log(
      "📤 规格数据（检查每个对象都有id）:",
      processedSpecs.map((s) => ({
        name: s.name,
        value: s.value,
        id: s.id,
        idType: typeof s.id,
      }))
    );

    console.log("📤 规格数据:", submitData.specList);

    // 处理SKU数据（元转分）
    const processedSkus = skuForm.value.skuList.map((sku) => ({
      id: sku.id, // 编辑时可能有ID
      skuSn: sku.skuSn,
      price: Math.round(Number(sku.price) * 100), // 元转分
      stock: Number(sku.stock),
      Lockedstock: Number(0),
      specIds: sku.specIds,
      specValues: sku.specValues,
      picUrl: sku.picUrl || "",
    }));
    submitData.skuList = processedSkus;

    // 价格转换修复 - 添加条件判断
    if (goodsInfo.value.originPrice !== undefined) {
      submitData.originPrice = Math.round(Number(goodsInfo.value.originPrice) * 100);
    }

    if (goodsInfo.value.price !== undefined) {
      submitData.price = Math.round(Number(goodsInfo.value.price) * 100);
    }

    console.log("📤 SKU数据:", submitData.skuList);
    console.log("📤 完整提交数据:", submitData);

    // 7. 调用API
    if (goodsInfo.value.id) {
      // 编辑
      await PmsSpuAPI.update(goodsInfo.value.id, submitData);
      ElNotification.success({
        title: "成功",
        message: "商品编辑成功",
        type: "success",
      });

      // ❌ 删除这行：不应该在子组件中控制步骤
      router.push("/pms/pms-brand");
    } else {
      // 新增
      await PmsSpuAPI.add(submitData);
      ElNotification.success({
        title: "成功",
        message: "商品新增成功",
        type: "success",
      });

      // ❌ 删除这行：不应该在子组件中控制步骤
      // 提交成功后可以跳转到列表页
      router.push("/pms/pms-brand");
    }
    //
    // // 跳转到商品列表
    // router.push("/goods/list");
  } catch (error: any) {
    console.error("❌ 提交失败:", error);

    // 更详细的错误信息
    if (error.response?.data) {
      const errorMsg = error.response.data.message || error.response.data.error || "提交失败";
      ElMessage.error(`提交失败: ${errorMsg}`);
    } else {
      ElMessage.error(`提交失败: ${error.message || "未知错误"}`);
    }
  }
};

// ==================== 生命周期钩子 ====================
onMounted(() => {
  console.log("🔄 商品规格组件挂载");

  // 加载商品数据（编辑模式）
  loadGoodsData();
});

// 添加监听器
watch(() => props.modelValue, async (newValue) => {
  console.log("🔄 GoodsStock 监听到父组件数据变化");

  // 如果商品ID存在，重新加载数据
  if (newValue.id) {
    console.log("🔄 商品ID存在，重新加载规格和SKU数据");

    // 重新加载数据
    await  loadGoodsData();
  }
}, { deep: true, immediate: true });


// 监听规格变化，自动生成SKU
watch(
  () => specForm.value.specList,
  () => {
    generateSkuList();
  },
  { deep: true }
);
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
    max-width: 1400px;
    margin: 0 auto;
    overflow-y: auto;
    padding-bottom: 80px;

    .box-card {
      border: none;
      box-shadow: none;
      margin-bottom: 20px;

      &:last-child {
        margin-bottom: 0;
      }

      :deep(.el-card__header) {
        padding: 18px 20px;
        background-color: #f8f9fa;
        border-bottom: 1px solid #ebeef5;

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;

          .card-title {
            font-size: 18px;
            font-weight: 600;
            color: #303133;
          }

          .sku-count {
            font-size: 14px;
            color: #909399;
          }
        }
      }

      :deep(.el-card__body) {
        padding: 20px;
      }
    }

    // 规格值容器
    .spec-values-container {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 8px;
      min-height: 40px;

      .spec-value-tag {
        margin-bottom: 8px;
        transition: all 0.2s;
        position: relative;
        padding-right: 25px;

        &:hover {
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .has-image-icon {
          position: absolute;
          right: 6px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 12px;
        }
      }

      .spec-image-upload {
        margin-left: 16px;
        min-width: 200px;

        .upload-tip {
          font-size: 12px;
          color: #909399;
          margin-top: 4px;
        }
      }

      .spec-input {
        width: 150px;
        margin-right: 8px;
      }
    }

    // SKU表格
    .sku-table {
      width: 100%; // 确保占满父容器
      margin-top: 10px;
      min-width: 1000px; // 设置最小宽度

      .spec-value {
        padding: 4px 8px;
        background-color: #f5f7fa;
        border-radius: 4px;
        font-size: 12px;
        color: #606266;
        display: inline-block;
        min-width: 80px; // 增加最小宽度
        text-align: center;
      }

      .no-image {
        font-size: 12px;
        color: #c0c4cc;
        font-style: italic;
      }

      // SKU图片单元格样式
      .sku-image-cell {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        padding: 12px  0; // 改为padding控制上下间距  增加上下内边距
        min-width: 180px; // 确保宽度足够

        .sku-image-preview {
          width: 60px;
          height: 60px;
          border-radius: 4px;
          cursor: pointer;
          object-fit: cover;
          border: 1px solid #ebeef5;
          //transition: all 0.2s;

          &:hover {
            transform: scale(1.05);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          }
        }
      }
    }

    // 表格内表单
    .table-form-item {
      margin-bottom: 0;

      :deep(.el-form-item__content) {
        margin-left: 0 !important;
      }

      :deep(.el-form-item__error) {
        padding-top: 2px;
        font-size: 12px;
      }
    }

    // 空状态
    .empty-state {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 200px;
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

// 加载状态
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;

  .loading-text {
    margin-left: 10px;
    color: #409eff;
  }
}

// 响应式设计
@media (max-width: 768px) {
  .component-container {
    padding: 15px;

    &__main {
      padding-bottom: 70px;

      .box-card {
        :deep(.el-card__header) {
          padding: 15px;

          .card-header {
            flex-direction: column;
            align-items: stretch;
            gap: 10px;

            .card-title {
              text-align: center;
            }
          }
        }

        :deep(.el-card__body) {
          padding: 15px;
        }
      }

      .spec-values-container {
        flex-direction: column;
        align-items: flex-start;

        .spec-image-upload {
          margin-left: 0;
          margin-top: 10px;
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
      .box-card {
        :deep(.el-card__body) {
          padding: 10px;
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
