<template>
  <div class="app-container">
    <div class="search-container">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true">
                <el-form-item label="出库ID" prop="id">
                      <el-input
                          v-model="queryParams.id"
                          placeholder="出库ID"
                          clearable
                          @keyup.enter="handleQuery()"
                      />
                </el-form-item>
                <el-form-item label="出库单号" prop="outboundNo">
                      <el-input
                          v-model="queryParams.outboundNo"
                          placeholder="出库单号"
                          clearable
                          @keyup.enter="handleQuery()"
                      />
                </el-form-item>
<!--                <el-form-item label="物资" prop="materialName">-->
<!--                      <el-input-->
<!--                          v-model="queryParams.materialName"-->
<!--                          placeholder="物资"-->
<!--                          clearable-->
<!--                          @keyup.enter="handleQuery()"-->
<!--                      />-->
<!--                </el-form-item>-->

                <el-form-item label="物资" prop="materialName">
                  <el-select
                    v-model="queryParams.materialName"
                    placeholder="物资"
                    clearable
                    filterable
                    @keyup.enter="handleQuery()"
                  >
                    <el-option
                      v-for="material in materialOptions"
                      :key="material.materialId"
                      :label="material.materialName"
                      :value="material.materialName"
                    />
                  </el-select>
                </el-form-item>


<!--                <el-form-item label="仓库" prop="warehouseName">-->
<!--                      <el-input-->
<!--                          v-model="queryParams.warehouseName"-->
<!--                          placeholder="仓库"-->
<!--                          clearable-->
<!--                          @keyup.enter="handleQuery()"-->
<!--                      />-->
<!--                </el-form-item>-->

                <el-form-item label="仓库" prop="warehouseName">
                  <el-select
                    v-model="queryParams.warehouseName"
                    placeholder="仓库"
                    clearable
                    filterable
                  >
                    <el-option
                      v-for="warehouse in warehouseOptions"
                      :key="warehouse.warehouseId"
                      :label="warehouse.warehouseName"
                      :value="warehouse.warehouseName"
                    />
                  </el-select>
                </el-form-item>

<!--                <el-form-item label="出库时间" prop="outTime">-->
<!--                      <el-date-picker-->
<!--                          v-model="queryParams.outTime"-->
<!--                          type="daterange"-->
<!--                          range-separator="~"-->
<!--                          start-placeholder="开始时间"-->
<!--                          end-placeholder="结束时间"-->
<!--                          value-format="YYYY-MM-DD HH:mm:ss"-->
<!--                      />-->
<!--                </el-form-item>-->
<!--                <el-form-item label="领用人" prop="recipientName">-->
<!--                      <el-input-->
<!--                          v-model="queryParams.recipientName"-->
<!--                          placeholder="领用人"-->
<!--                          clearable-->
<!--                          @keyup.enter="handleQuery()"-->
<!--                      />-->
<!--                </el-form-item>-->

                <el-form-item label="领用人" prop="recipientName">
                  <el-select
                    v-model="queryParams.recipientName"
                    placeholder="领用人"
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

                <el-form-item label="状态" prop="status">
                  <el-select
                    v-model="queryParams.status"
                    placeholder="状态"
                    clearable
                    filterable
                    @keyup.enter="handleQuery()"
                  >
                    <el-option
                      v-for="item in statusOptions"
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
            v-hasPerm="['aioveuOutbound:aioveu-outbound:add']"
            type="success"
            @click="handleOpenDialog()"
        >
          <template #icon><Plus /></template>
          新增
        </el-button>
        <el-button
            v-hasPerm="['aioveuOutbound:aioveu-outbound:delete']"
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
                        label="出库ID"
                        prop="id"
                        min-width="150"
                        align="center"
                    />
                    <el-table-column
                        key="outboundNo"
                        label="出库单号"
                        prop="outboundNo"
                        min-width="150"
                        align="center"
                    />
                    <el-table-column
                      key="materialName"
                      label="物资"
                      prop="materialName"
                      min-width="150"
                      align="center"
                      fixed="left"
                    />
                    <el-table-column
                      key="warehouseName"
                      label="仓库"
                      prop="warehouseName"
                      min-width="150"
                      align="center"
                    />
                    <el-table-column
                        key="quantity"
                        label="出库数量"
                        prop="quantity"
                        min-width="150"
                        align="center"
                    />
                    <el-table-column
                        key="batchNumber"
                        label="批次号"
                        prop="batchNumber"
                        min-width="150"
                        align="center"
                    />
                    <el-table-column
                        key="outTime"
                        label="出库时间"
                        prop="outTime"
                        min-width="150"
                        align="center"
                    />
                    <el-table-column
                        key="operatorName"
                        label="操作员"
                        prop="operatorName"
                        min-width="150"
                        align="center"
                    />
                    <el-table-column
                        key="recipientName"
                        label="领用人"
                        prop="recipientName"
                        min-width="150"
                        align="center"
                    />
                    <el-table-column
                      key="departmentName"
                      label="领用部门"
                      prop="departmentName"
                      min-width="150"
                      align="center"
                    />

                    <el-table-column
                        key="purpose"
                        label="用途说明"
                        prop="purpose"
                        min-width="150"
                        align="center"
                    />
                    <el-table-column
                        key="projectId"
                        label="关联项目ID"
                        prop="projectId"
                        min-width="150"
                        align="center"
                    />
                    <el-table-column
                      label="出库状态"
                      min-width="150"
                      align="center"
                    >
                      <template #default="scope">
                        <DictLabel v-model="scope.row.status" code="outbound_status" />
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
                v-hasPerm="['aioveuOutbound:aioveu-outbound:edit']"
                type="primary"
                size="small"
                link
                @click="handleOpenDialog(scope.row.id)"
            >
              <template #icon><Edit /></template>
              编辑
            </el-button>
            <el-button
                v-hasPerm="['aioveuOutbound:aioveu-outbound:delete']"
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

    <!-- 出库记录表单弹窗 -->
    <el-dialog
        v-model="dialog.visible"
        :title="dialog.title"
        width="500px"
        @close="handleCloseDialog"
    >
      <el-form ref="dataFormRef" :model="formData" :rules="rules" label-width="100px">
                <el-form-item label="出库单号" prop="outboundNo">
                      <el-input
                          v-model="formData.outboundNo"
                          placeholder="出库单号"
                      />
                </el-form-item>

<!--                <el-form-item label="物资" prop="materialName">-->
<!--                  <el-input-->
<!--                    v-model="formData.materialName"-->
<!--                    placeholder="物资"-->
<!--                  />-->
<!--                </el-form-item>-->

                <el-form-item label="物资" prop="materialName">
                  <el-select
                    v-model="formData.materialName"
                    placeholder="物资"
                    clearable
                    filterable
                  >
                    <el-option
                      v-for="material in materialOptions"
                      :key="material.materialId"
                      :label="material.materialName"
                      :value="material.materialName"
                    />
                  </el-select>
                </el-form-item>

<!--        <el-form-item label="仓库" prop="warehouseName">-->
<!--                  <el-input-->
<!--                    v-model="formData.warehouseName"-->
<!--                    placeholder="仓库"-->
<!--                  />-->
<!--                </el-form-item>-->

                <el-form-item label="仓库" prop="warehouseName">
                  <el-select
                    v-model="formData.warehouseName"
                    placeholder="仓库"
                    clearable
                    filterable
                  >
                    <el-option
                      v-for="warehouse in warehouseOptions"
                      :key="warehouse.warehouseId"
                      :label="warehouse.warehouseName"
                      :value="warehouse.warehouseName"
                    />
                  </el-select>
                </el-form-item>

                <el-form-item label="出库数量" prop="quantity">
                      <el-input
                          v-model="formData.quantity"
                          placeholder="出库数量"
                      />
                </el-form-item>

                <el-form-item label="批次号" prop="batchNumber">
                      <el-input
                          v-model="formData.batchNumber"
                          placeholder="批次号"
                      />
                </el-form-item>

                <el-form-item label="出库时间" prop="outTime">
                      <el-date-picker
                          v-model="formData.outTime"
                          type="datetime"
                          placeholder="出库时间"
                          value-format="YYYY-MM-DD HH:mm:ss"
                      />
                </el-form-item>

<!--                <el-form-item label="操作员" prop="operatorName">-->
<!--                  <el-input-->
<!--                    v-model="formData.operatorName"-->
<!--                    placeholder="操作员"-->
<!--                  />-->
<!--                </el-form-item>-->

                <el-form-item label="操作员" prop="operatorName">
                  <el-select
                    v-model="formData.operatorName"
                    placeholder="操作员"
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

<!--                <el-form-item label="领用人" prop="recipientName">-->
<!--                  <el-input-->
<!--                    v-model="formData.recipientName"-->
<!--                    placeholder="领用人"-->
<!--                  />-->
<!--                </el-form-item>-->


                <el-form-item label="领用人" prop="recipientName">
                  <el-select
                    v-model="formData.recipientName"
                    placeholder="领用人"
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

<!--                <el-form-item label="领用部门" prop="departmentName">-->
<!--                  <el-input-->
<!--                    v-model="formData.departmentName"-->
<!--                    placeholder="领用部门"-->
<!--                  />-->
<!--                </el-form-item>-->

                <el-form-item label="领用部门" prop="departmentName">
                  <el-select
                    v-model="formData.departmentName"
                    placeholder="领用部门"
                    clearable
                    filterable
                  >
                    <el-option
                      v-for="dept in deptOptions"
                      :key="dept.deptId"
                      :label="dept.deptName"
                      :value="dept.deptName"
                    />
                  </el-select>
                </el-form-item>

                <el-form-item label="用途说明" prop="purpose">
                      <el-input
                          type="textarea"
                          v-model="formData.purpose"
                          placeholder="用途说明"
                      />
                </el-form-item>

                <el-form-item label="关联项目ID" prop="projectId">
                      <el-input
                          v-model="formData.projectId"
                          placeholder="关联项目ID"
                      />
                </el-form-item>

                <el-form-item label="状态" prop="status">
                  <el-select
                    v-model="formData.status"
                    placeholder="状态"
                    clearable
                  >
                    <el-option
                      v-for="item in statusOptions"
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
    name: "AioveuOutbound",
    inheritAttrs: false,
  });

  import AioveuOutboundAPI, { AioveuOutboundPageVO, AioveuOutboundForm, AioveuOutboundPageQuery } from "@/api/aioveuOutbound/aioveu-outbound";
  import AioveuMaterialAPI, { MaterialOptionVO } from "@/api/aioveuMaterial/aioveu-material";
  import AioveuWarehouseAPI, { WarehouseOptionVO } from "@/api/aioveuWarehouse/aioveu-warehouse";
  import AioveuDepartmentAPI, { DeptOptionVO } from "@/api/aioveuDepartment/aioveu-department";
  import AioveuEmployeeAPI, { EmployeeOptionVO } from "@/api/aioveuEmployee/aioveu-employee";
  // 导入字典值
  import DictAPI,{ DictItemOption } from '@/api/system/dict.api'
  const queryFormRef = ref();
  const dataFormRef = ref();

  const loading = ref(false);
  const removeIds = ref<number[]>([]);
  const total = ref(0);

  const queryParams = reactive<AioveuOutboundPageQuery>({
    pageNum: 1,
    pageSize: 10,
  });
  // 选项
  const statusOptions = ref<DictItemOption[]>([])

  const materialOptions = ref<MaterialOptionVO[]>([])

  const warehouseOptions = ref<WarehouseOptionVO[]>([])
  const deptOptions = ref<DeptOptionVO[]>([]);
  const employeeOptions = ref<EmployeeOptionVO[]>([]);

  // 出库记录表格数据
  const pageData = ref<AioveuOutboundPageVO[]>([]);

  // 弹窗
  const dialog = reactive({
    title: "",
    visible: false,
  });

  // 出库记录表单数据
  const formData = reactive<AioveuOutboundForm>({});

  // 出库记录表单校验规则
  const rules = reactive({
                      outboundNo: [{ required: true, message: "请输入出库单号", trigger: "blur" }],
                      materialName: [{ required: true, message: "请输入物资", trigger: "blur" }],
                      warehouseName: [{ required: true, message: "请输入仓库", trigger: "blur" }],
                      quantity: [{ required: true, message: "请输入出库数量", trigger: "blur" }],
                      outTime: [{ required: true, message: "请输入出库时间", trigger: "blur" }],
                      operatorName: [{ required: true, message: "请输入操作员", trigger: "blur" }],
    recipientName: [{ required: true, message: "请输入领用人", trigger: "blur" }],
                      status: [{ required: true, message: "请输入状态", trigger: "blur" }],
    departmentName: [{ required: true, message: "请输入领用部门", trigger: "blur" }],
    purpose: [{ required: true, message: "请输入用途", trigger: "blur" }],
  });

  /** 查询出库记录 */
  function handleQuery() {
    loading.value = true;
          AioveuOutboundAPI.getPage(queryParams)
        .then((data) => {
          pageData.value = data.list;
          total.value = data.total;
        })
        .finally(() => {
          loading.value = false;
        });
  }

  /** 重置出库记录查询 */
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
  const editingOutboundId = ref<number | undefined>(undefined);

  /** 打开出库记录弹窗 */
  function handleOpenDialog(id?: number) {


    editingOutboundId.value = id; // 保存ID

    if (id) {
      dialog.title = "修改出库记录";
            AioveuOutboundAPI.getFormData(id).then((data) => {
        Object.assign(formData, data);
              dialog.visible = true;
      });
    } else {
      dialog.title = "新增出库记录";
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

  /** 提交出库记录表单 */
  function handleSubmit() {
    dataFormRef.value.validate((valid: any) => {
      if (valid) {
        loading.value = true;
        const id = editingOutboundId.value; // 使用存储的ID
        if (id) {
                AioveuOutboundAPI.update(id, formData)
              .then(() => {
                ElMessage.success("修改成功");
                handleCloseDialog();
                handleResetQuery();
              })
              .finally(() => (loading.value = false));
        } else {
                AioveuOutboundAPI.add(formData)
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

  /** 关闭出库记录弹窗 */
  function handleCloseDialog() {
    dialog.visible = false;

    // 关键修复：在关闭弹窗时重置加载状态
    loading.value = false;
    // 延迟重置表单（等待动画完成）
    setTimeout(() => {
    dataFormRef.value.resetFields();
    dataFormRef.value.clearValidate();

    // 清除编辑ID
    editingOutboundId.value = undefined;
    }, 300);
  }

  /** 删除出库记录 */
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
                AioveuOutboundAPI.deleteByIds(ids)
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
  function loadStatusOptions() {
    DictAPI.getDictItems('outbound_status').then(response => {
      statusOptions.value = response
    })
  }

  // 加载选项
  function loadMaterialOptions() {
    AioveuMaterialAPI.getAllMaterialOptions().then(response => {
      materialOptions.value = response
    })
  }

  function loadWarehouseOptions() {
    AioveuWarehouseAPI.getAllWarehouseOptions().then(response => {
      warehouseOptions.value = response
    })
  }

  function loadDeptOptions() {
    AioveuDepartmentAPI.getAllDepartmentOptions().then(response => {
      deptOptions.value = response
    })
  }

  // 加载选项
  function loadEmployeeOptions() {
    AioveuEmployeeAPI.getAllEmployeeOptions().then(response => {
      employeeOptions.value = response
    })
  }



  onMounted(() => {
    handleQuery();
    loadStatusOptions();
    loadMaterialOptions();
    loadWarehouseOptions();
    loadDeptOptions();
    loadEmployeeOptions();
  });
</script>
