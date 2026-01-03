<template>
  <div class="app-container">
    <div class="search-container">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true">
                <el-form-item label="仓库ID" prop="id">
                      <el-input
                          v-model="queryParams.id"
                          placeholder="仓库ID"
                          clearable
                          @keyup.enter="handleQuery()"
                      />
                </el-form-item>
<!--                <el-form-item label="仓库名称" prop="name">-->
<!--                      <el-input-->
<!--                          v-model="queryParams.name"-->
<!--                          placeholder="仓库名称"-->
<!--                          clearable-->
<!--                          @keyup.enter="handleQuery()"-->
<!--                      />-->
<!--                </el-form-item>-->

                <el-form-item label="仓库名称" prop="name">
                  <el-select
                    v-model="queryParams.name"
                    placeholder="仓库名称"
                    clearable
                    filterable
                    @keyup.enter="handleQuery()"
                  >
                    <el-option
                      v-for="warehouse in warehouseOptions"
                      :key="warehouse.warehouseId"
                      :label="warehouse.warehouseName"
                      :value="warehouse.warehouseName"
                    />
                  </el-select>
                </el-form-item>

                <el-form-item label="仓库编码" prop="code">
                      <el-input
                          v-model="queryParams.code"
                          placeholder="仓库编码"
                          clearable
                          @keyup.enter="handleQuery()"
                      />
                </el-form-item>
                <el-form-item label="仓库位置" prop="location">
                      <el-input
                        type="textarea"
                          v-model="queryParams.location"
                          placeholder="仓库位置"
                          clearable
                          @keyup.enter="handleQuery()"
                      />
                </el-form-item>
<!--                <el-form-item label="负责人" prop="managerName">-->
<!--                      <el-input-->
<!--                          v-model="queryParams.managerName"-->
<!--                          placeholder="负责人"-->
<!--                          clearable-->
<!--                          @keyup.enter="handleQuery()"-->
<!--                      />-->
<!--                </el-form-item>-->

                <el-form-item label="负责人" prop="managerName">
                  <el-select
                    v-model="queryParams.managerName"
                    placeholder="负责人"
                    clearable
                    filterable
                    @keyup.enter="handleQuery()"
                  >
                    <el-option
                      v-for="employee in employeeOptions"
                      :key="employee.employeeId"
                      :label="employee.employeeName"
                      :value="employee.employeeName"
                    />
                  </el-select>
                </el-form-item>


                <el-form-item label="联系电话" prop="contactPhone">
                      <el-input
                          v-model="queryParams.contactPhone"
                          placeholder="联系电话"
                          clearable
                          @keyup.enter="handleQuery()"
                      />
                </el-form-item>
                <el-form-item label="启用状态" prop="isActive">
                  <el-select
                    v-model="queryParams.isActive"
                    placeholder="启用状态"
                    clearable
                    filterable
                    @keyup.enter="handleQuery()"
                  >
                    <el-option
                      v-for="item in isActiveOptions"
                      :key="Number(item.value)"
                      :label="item.label"
                      :value="Number(item.value)"
                    />
                  </el-select>
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
            v-hasPerm="['aioveuWarehouse:aioveu-warehouse:add']"
            type="success"
            @click="handleOpenDialog()"
        >
          <template #icon><Plus /></template>
          新增
        </el-button>
        <el-button
            v-hasPerm="['aioveuWarehouse:aioveu-warehouse:delete']"
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
                        label="仓库ID"
                        prop="id"
                        min-width="150"
                        align="center"
                    />
                    <el-table-column
                        key="name"
                        label="仓库名称"
                        prop="name"
                        min-width="150"
                        align="center"
                    />
                    <el-table-column
                        key="code"
                        label="仓库编码"
                        prop="code"
                        min-width="150"
                        align="center"
                    />
                    <el-table-column
                        key="location"
                        label="仓库位置"
                        prop="location"
                        min-width="150"
                        align="center"
                    />
                    <el-table-column
                        key="area"
                        label="仓库面积"
                        prop="area"
                        min-width="150"
                        align="center"
                    />
                    <el-table-column
                        key="capacity"
                        label="存储容量"
                        prop="capacity"
                        min-width="150"
                        align="center"
                    />
                    <el-table-column
                        key="managerName"
                        label="负责人"
                        prop="managerName"
                        min-width="150"
                        align="center"
                    />
                    <el-table-column
                        key="contactPhone"
                        label="联系电话"
                        prop="contactPhone"
                        min-width="150"
                        align="center"
                    />
                    <el-table-column
                        key="description"
                        label="仓库描述"
                        prop="description"
                        min-width="150"
                        align="center"
                    />
                    <el-table-column
                      label="启用状态"
                      min-width="150"
                      align="center"
                    >
                      <template #default="scope">
                        <DictLabel v-model="scope.row.isActive" code="warehouse_is_active" />
                      </template>
                    </el-table-column>
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
                v-hasPerm="['aioveuWarehouse:aioveu-warehouse:edit']"
                type="primary"
                size="small"
                link
                @click="handleOpenDialog(scope.row.id)"
            >
              <template #icon><Edit /></template>
              编辑
            </el-button>
            <el-button
                v-hasPerm="['aioveuWarehouse:aioveu-warehouse:delete']"
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

    <!-- 仓库信息表单弹窗 -->
    <el-dialog
        v-model="dialog.visible"
        :title="dialog.title"
        width="500px"
        @close="handleCloseDialog"
    >
      <el-form ref="dataFormRef" :model="formData" :rules="rules" label-width="100px">
                <el-form-item label="仓库名称" prop="name">
                      <el-input
                          v-model="formData.name"
                          placeholder="仓库名称"
                      />
                </el-form-item>

                <el-form-item label="仓库编码" prop="code">
                      <el-input
                          v-model="formData.code"
                          placeholder="仓库编码"
                      />
                </el-form-item>

                <el-form-item label="仓库位置" prop="location">
                      <el-input
                          type="textarea"
                          v-model="formData.location"
                          placeholder="仓库位置"
                      />
                </el-form-item>

                <el-form-item label="仓库面积" prop="area">
                  <el-input
                    v-model="formData.area"
                    placeholder="仓库面积"
                  />
                </el-form-item>

                <el-form-item label="存储容量" prop="capacity">
                  <el-input
                    v-model="formData.capacity"
                    placeholder="存储容量"
                  />
                </el-form-item>

<!--                <el-form-item label="负责人" prop="managerName">-->
<!--                  <el-input-->
<!--                    v-model="formData.managerName"-->
<!--                    placeholder="负责人"-->
<!--                  />-->
<!--                </el-form-item>-->

                <el-form-item label="负责人" prop="managerName">
                  <el-select
                    v-model="formData.managerName"
                    placeholder="负责人"
                    clearable
                    filterable
                  >
                    <el-option
                      v-for="employee in employeeOptions"
                      :key="employee.employeeId"
                      :label="employee.employeeName"
                      :value="employee.employeeName"
                    />
                  </el-select>
                </el-form-item>

                <el-form-item label="联系电话" prop="contactPhone">
                  <el-input
                    v-model="formData.contactPhone"
                    placeholder="联系电话"
                  />
                </el-form-item>

                <el-form-item label="仓库描述" prop="description">
                  <el-input
                    type="textarea"
                    v-model="formData.description"
                    placeholder="仓库描述"
                  />
                </el-form-item>

                <el-form-item label="启用状态" prop="isActive">
                  <el-select
                    v-model="formData.isActive"
                    placeholder="启用状态"
                    clearable
                  >
                    <el-option
                      v-for="item in isActiveOptions"
                      :key="Number(item.value)"
                      :label="item.label"
                      :value="Number(item.value)"
                    />
                  </el-select>
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
    name: "AioveuWarehouse",
    inheritAttrs: false,
  });

  import AioveuWarehouseAPI, { AioveuWarehousePageVO, AioveuWarehouseForm, AioveuWarehousePageQuery ,WarehouseOptionVO } from "@/api/aioveuWarehouse/aioveu-warehouse";
  // 导入字典值
  import DictAPI,{ DictItemOption } from '@/api/system/dict.api'
  import AioveuEmployeeAPI, { EmployeeOptionVO } from "@/api/aioveuEmployee/aioveu-employee";
  const queryFormRef = ref();
  const dataFormRef = ref();

  const loading = ref(false);
  const removeIds = ref<number[]>([]);
  const total = ref(0);

  const queryParams = reactive<AioveuWarehousePageQuery>({
    pageNum: 1,
    pageSize: 10,
  });


  const warehouseOptions = ref<WarehouseOptionVO[]>([]);
  const employeeOptions = ref<EmployeeOptionVO[]>([]);
  // 仓库信息表格数据
  const pageData = ref<AioveuWarehousePageVO[]>([]);

  // 弹窗
  const dialog = reactive({
    title: "",
    visible: false,
  });

  // 选项
  const isActiveOptions = ref<DictItemOption[]>([])

  // 仓库信息表单数据
  const formData = reactive<AioveuWarehouseForm>({});

  // 仓库信息表单校验规则
  const rules = reactive({
                      name: [{ required: true, message: "请输入仓库名称", trigger: "blur" }],
                      code: [{ required: true, message: "请输入仓库编码", trigger: "blur" }],
                      location: [{ required: true, message: "请输入仓库位置", trigger: "blur" }],
    managerName: [{ required: true, message: "请输入负责人", trigger: "blur" }],
  });

  /** 查询仓库信息 */
  function handleQuery() {
    loading.value = true;
          AioveuWarehouseAPI.getPage(queryParams)
        .then((data) => {
          pageData.value = data.list;
          total.value = data.total;
        })
        .finally(() => {
          loading.value = false;
        });
  }

  /** 重置仓库信息查询 */
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
  const editingWarehouseId = ref<number | undefined>(undefined);

  /** 打开仓库信息弹窗 */
  function handleOpenDialog(id?: number) {


    editingWarehouseId.value = id; // 保存ID

    if (id) {
      dialog.title = "修改仓库信息";
            AioveuWarehouseAPI.getFormData(id).then((data) => {
        Object.assign(formData, data);
              dialog.visible = true;
      });
    } else {

      dialog.title = "新增仓库信息";
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

  /** 提交仓库信息表单 */
  function handleSubmit() {
    dataFormRef.value.validate((valid: any) => {
      if (valid) {
        loading.value = true;
        const id = editingWarehouseId.value; // 使用存储的ID
        if (id) {
                AioveuWarehouseAPI.update(id, formData)
              .then(() => {
                ElMessage.success("修改成功");
                handleCloseDialog();
                handleResetQuery();
              })
              .finally(() => (loading.value = false));
        } else {
                AioveuWarehouseAPI.add(formData)
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

  /** 关闭仓库信息弹窗 */
  function handleCloseDialog() {
    dialog.visible = false;

    // 关键修复：在关闭弹窗时重置加载状态
    loading.value = false;
    // 延迟重置表单（等待动画完成）
    setTimeout(() => {
    dataFormRef.value.resetFields();
    dataFormRef.value.clearValidate();

    // 清除编辑ID
    editingWarehouseId.value = undefined;
    }, 300);

  }

  /** 删除仓库信息 */
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
                AioveuWarehouseAPI.deleteByIds(ids)
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

  // 加载字典
  function loadIsActiveOptions() {
    DictAPI.getDictItems('warehouse_is_active').then(response => {
      isActiveOptions.value = response
    })
  }

  function loadWarehouseOptions() {
    AioveuWarehouseAPI.getAllWarehouseOptions().then(response => {
      warehouseOptions.value = response
    })
  }

  function loadEmployeeOptions() {
    AioveuEmployeeAPI.getAllEmployeeOptions().then(response => {
      employeeOptions.value = response
    })
  }

  onMounted(() => {
    handleQuery();
    loadIsActiveOptions();
    loadWarehouseOptions();
    loadEmployeeOptions();
  });
</script>
