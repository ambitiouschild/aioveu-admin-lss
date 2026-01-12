<template>

  <!-- 组件容器 -->
  <div class="component-container">

    <!-- 树形分类组件 -->
    <!-- 加载状态显示 -->
    <!-- 树形数据 -->
    <!-- 节点标签使用name字段 -->
    <!-- 子节点使用children字段 -->
    <!-- 不禁用任何节点 -->


    <!-- 节点的唯一标识字段 -->
    <!-- 默认展开所有节点 -->
    <!-- 手风琴模式，一次只展开一个同级节点 -->
    <!-- 节点点击事件 -->
    <el-tree
      ref="categoryTreeRef"
      v-loading="loading"
      class="category"
      :data="categoryOptions"
      :props="{ label: 'name', children: 'children', disabled: '' }"
      node-key="id"
      :expand-on-click-node="false"
      default-expand-all
      :accordion="true"
      @node-click="handleNodeClick"
    >

      <!-- 自定义节点内容 -->
      <template #default="scope">
        <div class="category_node">
          <!-- 左侧：节点内容显示 -->
          <div>
            <!-- 只有三级分类（叶子节点）显示图标 -->
            <!-- 三级分类显示图标 -->
            <!-- 图标URL -->
            <!-- 图标样式 -->
            <el-image
              v-show="scope.data.level == 3"
              :src="scope.data.iconUrl"
              class="category_node_img"
            >
              <!-- 图标加载失败的占位符 -->
              <!-- 图片占位图标 -->
              <template #error>
                <div class="image-slot">
                  <i-ep-picture />
                </div>
              </template>
            </el-image>
            <!-- 分类名称 -->
            {{ scope.data.name }}
          </div>

          <!-- 右侧：操作按钮 -->
          <div>

            <!-- 非三级分类显示新增按钮（最多三级分类） -->
            <!-- 阻止事件冒泡 -->
            <el-button
              v-show="scope.data.level != 3"
              type="success"
              link
              @click.stop="handleAdd(scope.data)"
            >新增</el-button
            >

            <!-- 非根节点显示编辑按钮 -->
            <el-button
              v-show="scope.data.id !== 0"
              type="warning"
              link
              @click.stop="handleUpdate(scope.data)"
            >编辑
            </el-button>

            <!-- 叶子节点（没有子节点）显示删除按钮 -->
            <el-button
              v-show="
                scope.data.id &&
                (!scope.data.children || scope.data.children.length <= 0)
              "
              type="danger"
              link
              @click.stop="handleDelete(scope.data)"
            >删除</el-button
            >
          </div>
        </div>
      </template>
    </el-tree>


    <!-- 新增/编辑分类对话框 -->
    <el-dialog v-model="dialog.visible" :title="dialog.title" width="750px">

      <!-- 表单 -->
      <el-form
        ref="dataFormRef"
        :model="formData"
        :rules="rules"
        label-width="100px"
      >

        <!-- 上级分类（只读） -->
        <el-form-item label="上级分类" prop="parentId">
          <el-input v-model="parent.name" readonly />
        </el-form-item>

        <!-- 分类名称 -->
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="formData.name" />
        </el-form-item>


        <!-- 分类图标上传 -->
        <el-form-item label="分类图标" prop="iconUrl">
          <single-upload v-model="formData.iconUrl" />
        </el-form-item>


        <!-- 显示状态 -->
        <el-form-item label="显示状态" prop="visible">
          <el-radio-group v-model="formData.visible">
            <el-radio :label="1">显示</el-radio>
            <el-radio :label="0">隐藏</el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- 排序 -->
        <el-form-item label="排序" prop="sort">
          <el-input v-model="formData.sort" />
        </el-form-item>
      </el-form>

      <!-- 对话框底部按钮 -->
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="closeDialog">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<!--
  商品分类管理组件
  功能：树形结构展示商品分类，支持分类的增删改查操作
  特点：
    1. 支持最多三级分类结构
    2. 通过树形结构直观展示分类层级
    3. 支持拖拽排序（如需要可实现）
    4. 使用Element Plus的ElTree组件
-->

<script setup lang="ts">

// 导入API函数
import
  PmsCategoryAPI
  from "@/api/aioveuMall/aioveuMallPms/aioveuMallPmsCategory/pms-category";

// 定义组件事件，用于向父组件传递当前选中的分类
const emit = defineEmits(["category-click"]);

// 定义组件引用
const categoryTreeRef = ref(ElTree);  // 树形组件引用
const dataFormRef = ref(ElForm);    // 表单组件引用


// 响应式状态管理
const state = reactive({
  loading: true,  // 加载状态
  ids: [],       // 选中的分类ID数组（用于批量操作）
  queryParam: {},    // 查询参数

  // 分类树形数据
  categoryOptions: [] as Array<any>,

  // 表单数据模型
  formData: {
    id: undefined,    // 分类ID
    name: undefined,  // 分类名称
    parentId: 0,     // 父级分类ID，0表示根分类
    level: undefined,  // 分类层级（1,2,3）
    iconUrl: undefined,   // 分类图标URL
    visible: 1,     // 显示状态：1显示，0隐藏
    sort: 100,    // 排序值
  },

  // 表单验证规则
  rules: {
    parentId: [
      {
        required: true,
        message: "请选择上级分类",
        trigger: "blur",
      },
    ],
    name: [
      {
        required: true,
        message: "请输入分类名称",
        trigger: "blur",
      },
    ],
  },

  // 对话框控制
  dialog: {
    title: "",    // 对话框标题
    visible: false,   // 对话框显示/隐藏
  },
  parent: {} as any,    // 当前选中分类的父级信息
  current: {} as any,   // 当前选中的分类信息
});

// 从state中解构出需要在模板中使用的响应式属性
const { loading, categoryOptions, formData, rules, dialog, parent } =
  toRefs(state);


/**
 * 查询分类数据
 * 从服务器获取分类列表，并构建树形结构
 */
function handleQuery() {
  state.loading = true;   // 显示加载状态
  PmsCategoryAPI.getListCategories(state.queryParam).then((response) => {

    // 构建树形数据，添加一个虚拟的根节点"全部分类"
    state.categoryOptions = [
      {
        id: 0,                  // 根节点ID设为0
        name: "全部分类",        // 根节点名称
        parentId: 0,            // 父节点为自身
        level: 0,                // 层级为0
        children: response.data,   // 实际的分类数据作为子节点
      },
    ];
    state.loading = false;         // 隐藏加载状态
  });
}


/**
 * 树节点点击事件处理
 * @param row - 点击的分类节点数据
 */
function handleNodeClick(row: any) {

  // 获取树形组件实例
  const categoryTree = unref(categoryTreeRef);

  // 获取当前节点的父节点
  const parentNode = categoryTree.getNode(row.parentId);


  // 更新父级分类信息
  state.parent = {
    id: parentNode.key,    // 父节点ID
    name: parentNode.label,   // 父节点名称
    level: row.level,     // 父节点层级
  };

  // 深度拷贝当前分类信息（避免引用问题）
  state.current = JSON.parse(JSON.stringify(row));

  // 向父组件发射事件，传递当前选中的分类
  emit("category-click", row);
}


/**
 * 新增分类
 * @param row - 要在此分类下新增子分类的节点数据
 */
function handleAdd(row: any) {

  // 设置对话框标题和显示状态
  state.dialog = {
    title: "新增商品分类",
    visible: true,
  };

  // 重置表单ID
  state.formData.id = undefined;

  // 如果传入了行数据，说明是点击某个分类的"新增"按钮
  if (row.id != null) {
    // 行点击新增
    state.parent = {
      id: row.id,
      name: row.name,
      level: row.level,
    };
  }
}


/**
 * 修改分类
 * @param row - 要修改的分类节点数据
 */
function handleUpdate(row: any) {

  // 先触发节点点击，获取父节点信息
  handleNodeClick(row);

  // 设置对话框标题和显示状态
  state.dialog = {
    title: "修改商品分类",
    visible: true,
  };

  // 将当前分类数据复制到表单中
  Object.assign(state.formData, state.current);
}


/**
 * 提交表单（新增或修改）
 */
function submitForm() {

  // 表单验证
  dataFormRef.value.validate((valid: any) => {
    if (valid) {

      // 如果有ID，执行更新操作
      if (state.formData.id) {
        PmsCategoryAPI.update(state.formData.id, state.formData).then(() => {
          ElMessage.success("修改成功");
          closeDialog();   // 关闭对话框
          handleQuery();  // 刷新数据
        });
      } else {

        // 新增操作
        const parentCategory = state.parent as any;

        // 设置父级ID和层级
        state.formData.parentId = parentCategory.id;
        state.formData.level = parentCategory.level + 1;

        PmsCategoryAPI.add(state.formData).then(() => {
          ElMessage.success("新增成功");   // 关闭对话框
          closeDialog();
          handleQuery();       // 刷新数据
        });
      }
    }
  });
}


/**
 * 删除分类
 * @param row - 要删除的分类节点数据
 */
function handleDelete(row: any) {

  // 准备要删除的ID（支持单个或多个）
  const ids = [row.id || state.ids].join(",");

  // 显示确认对话框
  ElMessageBox.confirm("确认删除已选中的数据项?", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {

    // 用户确认后执行删除
    PmsCategoryAPI.deleteByIds(ids).then(() => {
      ElMessage.success("删除成功");
      handleQuery();
    });
  });
}

/**
 * 关闭对话框并重置表单
 */
function closeDialog() {
  state.dialog.visible = false;   // 隐藏对话框
  dataFormRef.value.resetFields();  // 重置表单字段
  state.dialog.visible = false;    // 清空父级分类信息
}

// 组件挂载时自动加载数据
onMounted(() => {
  handleQuery();
});
</script>

<!--
  模板说明：
  1. 使用el-tree展示分类树形结构
  2. 通过插槽自定义树节点的显示内容
  3. 只有叶子节点（三级分类）显示图标
  4. 非叶子节点显示"新增"按钮
  5. 所有节点（除根节点）都显示"编辑"按钮
  6. 只有叶子节点显示"删除"按钮
-->
<!-- 商品分类层级最多为三层，level字段标识 -->



<!-- 组件样式 -->
<style lang="scss">
.category {

  /* 树节点容器样式 */
  &_node {
    display: flex;
    align-items: center;   /* 垂直居中 */
    justify-content: space-between;    /* 两端对齐 */
    font-size: 14px;
    width: 100%;  /* 确保占满整行 */

    /* 图标样式 */
    &_img {
      width: 20px;
      height: 20px;
      margin-top: -5px;    /* 微调垂直位置 */
      vertical-align: middle;   /* 垂直居中 */
      margin-right: 5px;     /* 图标和文字间距 */
    }
  }
}
</style>
