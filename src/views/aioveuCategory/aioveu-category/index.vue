<template>
  <div class="app-container">
    <div class="search-container">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true">
                <el-form-item label="分类ID" prop="id">
                      <el-input
                          v-model="queryParams.id"
                          placeholder="分类ID"
                          clearable
                          @keyup.enter="handleQuery()"
                      />
                </el-form-item>
<!--                <el-form-item label="分类名称" prop="name">-->
<!--                      <el-input-->
<!--                          v-model="queryParams.name"-->
<!--                          placeholder="分类名称"-->
<!--                          clearable-->
<!--                          @keyup.enter="handleQuery()"-->
<!--                      />-->
<!--                </el-form-item>-->

                <el-form-item label="分类名称" prop="name">
                  <el-select
                    v-model="queryParams.name"
                    placeholder="分类名称"
                    clearable
                    filterable
                    @keyup.enter="handleQuery()"
                  >
                    <el-option
                      v-for="category in categoryOptions"
                      :key="category.categoryId"
                      :label="category.categoryName"
                      :value="category.categoryName"
                    />
                  </el-select>
                </el-form-item>

                <el-form-item label="分类描述" prop="description">
                      <el-input
                          type="textarea"
                          v-model="queryParams.description"
                          placeholder="分类描述"
                          clearable
                          @keyup.enter="handleQuery()"
                      />
                </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">
            <template #icon><Search /></template>
            搜索
          </el-button>
          <el-button @click="handleResetQuery">
            <template #icon><Refresh /></template>
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-card shadow="never">
      <div class="mb-10px">
        <el-button
            v-hasPerm="['aioveuCategory:aioveu-category:add']"
            type="success"
            @click="handleOpenDialog()"
        >
          <template #icon><Plus /></template>
          新增
        </el-button>
        <el-button
            v-hasPerm="['aioveuCategory:aioveu-category:delete']"
            type="danger"
            :disabled="removeIds.length === 0"
            @click="handleDelete()"
        >
          <template #icon><Delete /></template>
          删除
        </el-button>
      </div>

      <el-table
          ref="dataTableRef"
          v-loading="loading"
          :data="pageData"
          highlight-current-row
          border
          @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
                    <el-table-column
                        key="id"
                        label="分类ID"
                        prop="id"
                        min-width="150"
                        align="center"
                    />
                    <el-table-column
                        key="name"
                        label="分类名称"
                        prop="name"
                        min-width="150"
                        align="center"
                    />
                    <el-table-column
                      key="parentCategoryName"
                      label="父分类"
                      prop="parentCategoryName"
                      min-width="150"
                      align="center"
                    />
                    <el-table-column
                        key="level"
                        label="分类层级"
                        prop="level"
                        min-width="150"
                        align="center"
                    />
                    <el-table-column
                        key="description"
                        label="分类描述"
                        prop="description"
                        min-width="150"
                        align="center"
                    />
                    <el-table-column
                        key="createTime"
                        label="创建时间"
                        prop="createTime"
                        min-width="150"
                        align="center"
                    />
                    <el-table-column
                        key="updateTime"
                        label="更新时间"
                        prop="updateTime"
                        min-width="150"
                        align="center"
                    />
        <el-table-column fixed="right" label="操作" width="220">
          <template #default="scope">
            <el-button
                v-hasPerm="['aioveuCategory:aioveu-category:edit']"
                type="primary"
                size="small"
                link
                @click="handleOpenDialog(scope.row.id)"
            >
              <template #icon><Edit /></template>
              编辑
            </el-button>
            <el-button
                v-hasPerm="['aioveuCategory:aioveu-category:delete']"
                type="danger"
                size="small"
                link
                @click="handleDelete(scope.row.id)"
            >
              <template #icon><Delete /></template>
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination
          v-if="total > 0"
          v-model:total="total"
          v-model:page="queryParams.pageNum"
          v-model:limit="queryParams.pageSize"
          @pagination="handleQuery()"
      />
    </el-card>

    <!-- 物资分类表单弹窗 -->
    <el-dialog
        v-model="dialog.visible"
        :title="dialog.title"
        width="500px"
        @close="handleCloseDialog"
    >
      <el-form ref="dataFormRef" :model="formData" :rules="rules" label-width="100px">

                <el-form-item label="分类名称" prop="name">
                      <el-input
                          v-model="formData.name"
                          placeholder="分类名称"
                      />
                </el-form-item>

<!--                <el-form-item label="父分类" prop="parentCategoryName">-->
<!--                  <el-input-->
<!--                    v-model="formData.parentCategoryName"-->
<!--                    placeholder="父分类"-->
<!--                  />-->
<!--                </el-form-item>-->

                <el-form-item label="父分类" prop="parentCategoryName">
                  <el-select
                    v-model="formData.parentCategoryName"
                    placeholder="请选择父分类"
                    clearable
                    filterable
                  >
                    <el-option
                      v-for="dept in parentCategoryOptions"
                      :key="dept.categoryId"
                      :label="dept.categoryName"
                      :value="dept.categoryName"
                    />
                  </el-select>
                </el-form-item>

                <el-form-item label="分类层级" prop="level">
                      <el-input
                          v-model="formData.level"
                          placeholder="分类层级"
                      />
                </el-form-item>



                <el-form-item label="分类描述" prop="description">
                      <el-input
                          type="textarea"
                          v-model="formData.description"
                          placeholder="分类描述"
                      />
                </el-form-item>

      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="handleSubmit()">确定</el-button>
          <el-button @click="handleCloseDialog()">取消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
  defineOptions({
    name: "AioveuCategory",
    inheritAttrs: false,
  });

  import AioveuCategoryAPI, { AioveuCategoryPageVO, AioveuCategoryForm, AioveuCategoryPageQuery ,CategoryOptionVO} from "@/api/aioveuCategory/aioveu-category";


  const queryFormRef = ref();
  const dataFormRef = ref();

  const loading = ref(false);
  const removeIds = ref<number[]>([]);
  const total = ref(0);

  const queryParams = reactive<AioveuCategoryPageQuery>({
    pageNum: 1,
    pageSize: 10,
  });

  // 物资分类表格数据
  const pageData = ref<AioveuCategoryPageVO[]>([]);


  // 新增：父分类选项
  const parentCategoryOptions = ref<CategoryOptionVO[]>([]);

  // 新增：父分类选项
  const categoryOptions = ref<CategoryOptionVO[]>([]);

  // 弹窗
  const dialog = reactive({
    title: "",
    visible: false,
  });

  // 物资分类表单数据
  const formData = reactive<AioveuCategoryForm>({});

  // 物资分类表单校验规则
  const rules = reactive({
                      id: [{ required: true, message: "请输入分类ID", trigger: "blur" }],
                      name: [{ required: true, message: "请输入分类名称", trigger: "blur" }],
  });

  /** 查询物资分类 */
  function handleQuery() {
    loading.value = true;
          AioveuCategoryAPI.getPage(queryParams)
        .then((data) => {
          pageData.value = data.list;
          total.value = data.total;
        })
        .finally(() => {
          loading.value = false;
        });
  }

  /** 重置物资分类查询 */
  function handleResetQuery() {
    queryFormRef.value!.resetFields();
    queryParams.pageNum = 1;
    handleQuery();
  }

  /** 行复选框选中记录选中ID集合 */
  function handleSelectionChange(selection: any) {
    removeIds.value = selection.map((item: any) => item.id);
  }

  // 在组件中添加一个变量存储当前编辑的ID
  const editingCategoryId = ref<number | undefined>(undefined);

  /** 打开物资分类弹窗 */
  function handleOpenDialog(id?: number) {


    editingCategoryId.value = id; // 保存ID

    if (id) {
      dialog.title = "修改物资分类";
            AioveuCategoryAPI.getFormData(id).then((data) => {
        Object.assign(formData, data);
              dialog.visible = true;
      });
    } else {
      dialog.title = "新增物资分类";

      // 使用 nextTick 确保在 DOM 更新后重置表单
      nextTick(() => {
        if (dataFormRef.value) {
          dataFormRef.value.resetFields();
          dataFormRef.value.clearValidate();
        }

        // 打开弹窗
        dialog.visible = true;
      });

    }
  }

  /** 提交物资分类表单 */
  function handleSubmit() {
    dataFormRef.value.validate((valid: any) => {
      if (valid) {
        loading.value = true;
        const id = editingCategoryId.value; // 使用存储的ID
        if (id) {
                AioveuCategoryAPI.update(id, formData)
              .then(() => {
                ElMessage.success("修改成功");
                handleCloseDialog();
                handleResetQuery();
              })
              .finally(() => (loading.value = false));
        } else {
                AioveuCategoryAPI.add(formData)
              .then(() => {
                ElMessage.success("新增成功");
                handleCloseDialog();
                handleResetQuery();
              })
              .finally(() => (loading.value = false));
        }
      }
    });
  }

  /** 关闭物资分类弹窗 */
  function handleCloseDialog() {
    dialog.visible = false;

    // 关键修复：在关闭弹窗时重置加载状态
    loading.value = false;

    // 延迟重置表单（等待动画完成）
    setTimeout(() => {
    dataFormRef.value.resetFields();
    dataFormRef.value.clearValidate();
    // 清除编辑ID
    editingCategoryId.value = undefined;
    }, 300);
  }

  /** 删除物资分类 */
  function handleDelete(id?: number) {
    const ids = [id || removeIds.value].join(",");
    if (!ids) {
      ElMessage.warning("请勾选删除项");
      return;
    }

    ElMessageBox.confirm("确认删除已选中的数据项?", "警告", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    }).then(
        () => {
          loading.value = true;
                AioveuCategoryAPI.deleteByIds(ids)
              .then(() => {
                ElMessage.success("删除成功");
                handleResetQuery();
              })
              .finally(() => (loading.value = false));
        },
        () => {
          ElMessage.info("已取消删除");
        }
    );
  }

  // 加载选项
  function loadParentCategoryOptions() {
    AioveuCategoryAPI.getAllCategoryOptions().then(response => {
      parentCategoryOptions.value = response
    })
  }

  function loadCategoryOptions() {
    AioveuCategoryAPI.getAllCategoryOptions().then(response => {
      categoryOptions.value = response
    })
  }


  onMounted(() => {
    handleQuery();
    loadParentCategoryOptions();
    loadCategoryOptions();
  });
</script>
