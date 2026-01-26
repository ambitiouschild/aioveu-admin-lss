<template>
  <!-- 页面容器 -->
  <div class="app-container">
    <!-- 搜索区域 -->
    <div class="search-container">
      <!-- 搜索表单 -->
      <el-form ref="queryFormRef" :model="queryParams" :inline="true">
        <!-- 关键字搜索 -->
        <el-form-item label="关键字">
          <el-input
            v-model="queryParams.name"
            placeholder="请输入商品名称"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>

        <!-- 商品分类筛选 -->
        <el-form-item label="商品分类">
          <el-cascader
            v-model="queryParams.categoryId"
            placeholder="请选择商品分类"
            :props="{ emitPath: false, value: 'id', label: 'name', children: 'children' }"
            :options="categoryOptions"
            clearable
            style="width: 300px"
          />
        </el-form-item>

        <!-- 搜索操作按钮 -->
        <el-form-item>
          <el-button type="primary" @click="handleQuery">
            <el-icon><Search /></el-icon> 搜索
          </el-button>
          <el-button @click="resetQuery">
            <el-icon><Refresh /></el-icon> 重置
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 表格区域 -->
    <el-card shadow="never">
      <!-- 卡片头部：操作按钮 -->
      <template #header>
        <el-button type="success" @click="handleAdd">
          <el-icon><Plus /></el-icon> 新增商品
        </el-button>
        <el-button
          type="danger"
          :disabled="selectedIds.length === 0"
          @click="handleBatchDelete"
        >
          <el-icon><Delete /></el-icon> 批量删除
        </el-button>
      </template>

      <!-- 商品数据表格 -->
      <el-table
        ref="dataTableRef"
        v-loading="loading"
        :data="goodsList"
        border
        stripe
        @selection-change="handleSelectionChange"
        @row-click="handleRowClick"
      >
        <!-- 选择列 -->
        <el-table-column type="selection" width="55" align="center" />

        <!-- 展开列：显示商品SKU库存 -->
        <el-table-column type="expand" width="120" label="商品规格">
          <template #default="scope">
            <el-table :data="scope.row.skuList" border>
              <el-table-column align="center" label="规格编码" prop="skuSn" width="120" />
              <el-table-column align="left" label="规格名称" prop="name" width="400" />
              <el-table-column label="规格图片" prop="picUrl" width="100">
                <template #default="skuScope">
                  <img
                    v-if="skuScope.row.picUrl"
                    :src="skuScope.row.picUrl"
                    width="40"
                    height="40"
                    style="object-fit: cover;"
                  />
                  <span v-else class="text-gray-400">无图片</span>
                </template>
              </el-table-column>
              <el-table-column align="center" label="规格价格" prop="price" width="120">
                <template #default="skuScope">
                  {{ formatPrice(skuScope.row.price) }}
                </template>
              </el-table-column>
              <el-table-column align="center" label="库存数量" prop="stock" width="100" />
            </el-table>
          </template>
        </el-table-column>

        <!-- 商品名称列 -->
        <el-table-column label="商品名称" prop="name" min-width="200" show-overflow-tooltip />

        <!-- 商品主图列 -->
        <el-table-column label="商品主图" width="100">
          <template #default="scope">
            <el-popover
              placement="right"
              :width="300"
              trigger="hover"
              v-if="scope.row.picUrl"
            >
              <template #reference>
                <img
                  :src="scope.row.picUrl"
                  style="width: 60px; height: 60px; object-fit: cover; cursor: pointer;"
                />
              </template>
              <img
                :src="scope.row.picUrl"
                style="width: 100%; height: auto;"
              />
            </el-popover>
            <span v-else class="text-gray-400">无图片</span>
          </template>
        </el-table-column>

        <!-- 商品分类列 -->
        <el-table-column label="商品类目" prop="categoryName" min-width="120" />

        <!-- 商品品牌列 -->
        <el-table-column label="商品品牌" prop="brandName" min-width="120" />

        <!-- 原价列 -->
        <el-table-column align="center" label="原价" prop="originalPrice" width="120">
          <template #default="scope">
            {{ formatPrice(scope.row.originPrice) }}
          </template>
        </el-table-column>

        <!-- 现价列 -->
        <el-table-column align="center" label="现价" prop="price" width="120">
          <template #default="scope">
            {{ formatPrice(scope.row.price) }}
          </template>
        </el-table-column>

        <!-- 销量列 -->
        <el-table-column label="销量" prop="sales" width="100" align="center" />

        <!-- 操作列 -->
        <el-table-column label="操作" width="220" fixed="right" align="center">
          <template #default="scope">
            <!-- 查看详情按钮 -->
            <el-tooltip content="查看商品详情" placement="top">
              <el-button
                type="success"
                link
                @click.stop="handleViewDetail(scope.row.detail)"
              >
                <el-icon><View /></el-icon> 详情
              </el-button>
            </el-tooltip>

            <!-- 编辑按钮 -->
            <el-tooltip content="编辑商品信息" placement="top">
              <el-button
                type="primary"
                link
                @click.stop="handleEdit(scope.row)"
              >
                <el-icon><Edit /></el-icon> 编辑
              </el-button>
            </el-tooltip>

            <!-- 删除按钮 -->
            <el-tooltip content="删除商品" placement="top">
              <el-button
                type="danger"
                link
                @click.stop="handleDelete(scope.row)"
              >
                <el-icon><Delete /></el-icon> 删除
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 分页组件 -->
    <pagination
      v-if="total > 0"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      :total="total"
      @pagination="handleQuery"
    />

    <!-- 商品详情弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      title="商品详情"
      width="800px"
      :append-to-body="true"
    >
      <div class="goods-detail-box" v-html="goodDetail"></div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
// ==================== 组件配置 ====================
defineOptions({
  name: "GoodsList",  // 组件名称
  inheritAttrs: false, // 不继承非prop属性
});

// ==================== 导入依赖 ====================
import { ref, reactive, onMounted, nextTick } from "vue";
import { useRouter } from "vue-router";
import {
  ElMessage,
  ElMessageBox,
  type FormInstance,
  type TableInstance
} from "element-plus";
import {
  Search,
  Refresh,
  Plus,
  Delete,
  View,
  Edit
} from "@element-plus/icons-vue";

// 导入API接口
import PmsSpuAPI, {
  type PmsSpuPageQuery,
  type PmsSpuPageVO
} from "@/api/aioveuMall/aioveuMallPms/aioveuMallPmsSpu/pms-spu";
import PmsCategoryAPI from "@/api/aioveuMall/aioveuMallPms/aioveuMallPmsCategory/pms-category";

// 导入工具函数
import { moneyFormatter } from "@/utils/filter";

// ==================== 类型定义 ====================
interface CategoryOption {
  id: number;
  name: string;
  children?: CategoryOption[];
}

// ==================== 响应式数据 ====================
// 表格引用
const dataTableRef = ref<TableInstance>();
// 表单引用
const queryFormRef = ref<FormInstance>();
// 路由实例
const router = useRouter();

// 页面状态
const loading = ref(true); // 加载状态
const selectedIds = ref<number[]>([]); // 已选择的商品ID数组
const total = ref(0); // 总条数
const goodsList = ref<PmsSpuPageVO[]>([]); // 商品列表数据
const categoryOptions = ref<CategoryOption[]>([]); // 分类选项数据
const goodDetail = ref<string>(""); // 商品详情HTML
const dialogVisible = ref(false); // 详情弹窗显示状态

// 查询参数
const queryParams = reactive<PmsSpuPageQuery>({
  pageNum: 1,
  pageSize: 10,
  name: undefined,
  categoryId: undefined,
});

// ==================== 工具函数 ====================
/**
 * 格式化价格显示
 * @param price 价格（分）
 * @returns 格式化后的价格字符串
 */
const formatPrice = (price?: number): string => {
  if (price === undefined || price === null) return "-";
  return moneyFormatter(price);
};

// ==================== 业务方法 ====================
/**
 * 执行搜索查询
 */
const handleQuery = async (): Promise<void> => {
  try {
    loading.value = true;

    // 调用API获取商品列表
    const response = await PmsSpuAPI.getPage(queryParams);

    if (response.data) {
      goodsList.value = response.data.list || [];
      total.value = response.data.total || 0;
    }
  } catch (error) {
    console.error("查询商品列表失败:", error);
    ElMessage.error("获取商品列表失败，请重试");
  } finally {
    loading.value = false;
  }
};

/**
 * 重置查询条件
 */
const resetQuery = (): void => {
  // 重置查询参数
  queryParams.pageNum = 1;
  queryParams.pageSize = 10;
  queryParams.name = undefined;
  queryParams.categoryId = undefined;

  // 执行查询
  handleQuery();
};

/**
 * 查看商品详情
 * @param detail 商品详情HTML
 */
const handleViewDetail = (detail: string): void => {
  goodDetail.value = detail || "暂无商品详情";
  dialogVisible.value = true;
};

/**
 * 新增商品
 */
const handleAdd = (): void => {
  router.push({
    name: "GoodsDetail",
    query: { mode: "add" }
  });
};

/**
 * 编辑商品
 * @param row 商品行数据
 */
const handleEdit = (row: PmsSpuPageVO): void => {
  router.push({
    name: "GoodsDetail",
    query: {
      mode: "edit",
      goodsId: row.id,
      categoryId: row.categoryId
    }
  });
};

/**
 * 删除单个商品
 * @param row 商品行数据
 */
const handleDelete = async (row: PmsSpuPageVO): Promise<void> => {
  try {
    // 确认删除提示
    await ElMessageBox.confirm(
      `确定要删除商品 "${row.name}" 吗？`,
      "删除确认",
      {
        confirmButtonText: "确定删除",
        cancelButtonText: "取消",
        type: "warning",
        confirmButtonClass: "el-button--danger",
      }
    );

    // 执行删除
    await PmsSpuAPI.deleteByIds(row.id!.toString());

    ElMessage.success("商品删除成功");
    // 刷新列表
    handleQuery();
  } catch (error) {
    // 用户取消删除时不处理
    if (error !== "cancel") {
      console.error("删除商品失败:", error);
      ElMessage.error("删除商品失败，请重试");
    }
  }
};

/**
 * 批量删除商品
 */
const handleBatchDelete = async (): Promise<void> => {
  if (selectedIds.value.length === 0) {
    ElMessage.warning("请先选择要删除的商品");
    return;
  }

  try {
    // 确认删除提示
    await ElMessageBox.confirm(
      `确定要删除选中的 ${selectedIds.value.length} 个商品吗？`,
      "批量删除确认",
      {
        confirmButtonText: "确定删除",
        cancelButtonText: "取消",
        type: "warning",
        confirmButtonClass: "el-button--danger",
      }
    );

    // 执行批量删除
    await PmsSpuAPI.deleteByIds(selectedIds.value.join(","));

    ElMessage.success(`成功删除 ${selectedIds.value.length} 个商品`);
    // 清空选择
    selectedIds.value = [];
    // 刷新列表
    handleQuery();
  } catch (error) {
    // 用户取消删除时不处理
    if (error !== "cancel") {
      console.error("批量删除商品失败:", error);
      ElMessage.error("批量删除商品失败，请重试");
    }
  }
};

/**
 * 表格行点击事件
 * @param row 点击的行数据
 */
const handleRowClick = (row: PmsSpuPageVO): void => {
  if (dataTableRef.value) {
    dataTableRef.value.toggleRowSelection(row);
  }
};

/**
 * 表格选择变化事件
 * @param selection 选中的行数据数组
 */
const handleSelectionChange = (selection: PmsSpuPageVO[]): void => {
  selectedIds.value = selection.map(item => item.id!);
};

/**
 * 加载商品分类选项
 */
const loadCategoryOptions = async (): Promise<void> => {
  try {
    const response = await PmsCategoryAPI.getCategoryOptions();
    if (response.data) {
      categoryOptions.value = response.data as CategoryOption[];
    }
  } catch (error) {
    console.error("加载商品分类选项失败:", error);
    ElMessage.warning("加载商品分类失败，部分功能可能受限");
  }
};

// ==================== 生命周期钩子 ====================
onMounted(async () => {
  // 并行加载分类选项和商品列表
  await Promise.all([
    loadCategoryOptions(),
    handleQuery()
  ]);

  // 确保DOM更新完成
  await nextTick();
  console.log("商品列表页面加载完成");
});
</script>

<style lang="scss" scoped>
.app-container {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: calc(100vh - 84px);
}

.search-container {
  background-color: #fff;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

  .el-form {
    margin-bottom: 0;

    .el-form-item {
      margin-bottom: 0;
      margin-right: 20px;

      &:last-child {
        margin-right: 0;
      }
    }
  }
}

:deep(.el-card) {
  border: none;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

  .el-card__header {
    padding: 18px 20px;
    background-color: #f8f9fa;
    border-bottom: 1px solid #ebeef5;

    .el-button {
      margin-right: 10px;

      &:last-child {
        margin-right: 0;
      }
    }
  }

  .el-card__body {
    padding: 20px;
  }
}

// 表格样式
:deep(.el-table) {
  .el-table__row {
    cursor: pointer;

    &:hover {
      background-color: #f5f7fa;
    }
  }

  .cell {
    .el-button--link {
      padding: 5px 8px;
      font-size: 12px;

      + .el-button--link {
        margin-left: 5px;
      }
    }
  }
}

// 商品详情弹窗样式
.goods-detail-box {
  max-height: 60vh;
  overflow-y: auto;
  padding: 10px;
  line-height: 1.6;

  :deep(*) {
    max-width: 100%;
  }

  :deep(img) {
    max-width: 100%;
    height: auto;
  }
}

// 图片样式
img {
  border-radius: 4px;
  border: 1px solid #ebeef5;
  background-color: #fff;
}

// 工具提示样式
.text-gray-400 {
  color: #c0c4cc;
}

// 分页样式
.pagination-container {
  margin-top: 20px;
  text-align: right;
  background-color: #fff;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
</style>
