<template>
  <div class="app-container">
    <div class="search-container">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true">
                <el-form-item label="设备ID" prop="id">
                      <el-input
                          v-model="queryParams.id"
                          placeholder="设备ID"
                          clearable
                          @keyup.enter="handleQuery()"
                      />
                </el-form-item>
                <el-form-item label="资产编号" prop="assetNo">
                      <el-input
                          v-model="queryParams.assetNo"
                          placeholder="资产编号"
                          clearable
                          @keyup.enter="handleQuery()"
                      />
                </el-form-item>
                <el-form-item label="设备名称" prop="name">
                      <el-input
                          v-model="queryParams.name"
                          placeholder="设备名称"
                          clearable
                          @keyup.enter="handleQuery()"
                      />
                </el-form-item>
<!--                <el-form-item label="设备分类" prop="categoryName">-->
<!--                      <el-input-->
<!--                          v-model="queryParams.categoryName"-->
<!--                          placeholder="设备分类"-->
<!--                          clearable-->
<!--                          @keyup.enter="handleQuery()"-->
<!--                      />-->
<!--                </el-form-item>-->

                <el-form-item label="设备分类" prop="categoryName">
                  <el-select
                    v-model="queryParams.categoryName"
                    placeholder="设备分类"
                    clearable
                    filterable
                  >
                    <el-option
                      v-for="category in categoryOptions"
                      :key="category.categoryId"
                      :label="category.categoryName"
                      :value="category.categoryName"
                    />
                  </el-select>
                </el-form-item>

                <el-form-item label="序列号" prop="serialNo">
                      <el-input
                          v-model="queryParams.serialNo"
                          placeholder="序列号"
                          clearable
                          @keyup.enter="handleQuery()"
                      />
                </el-form-item>
<!--                <el-form-item label="责任人" prop="responsiblePersonName">-->
<!--                      <el-input-->
<!--                          v-model="queryParams.responsiblePersonName"-->
<!--                          placeholder="责任人"-->
<!--                          clearable-->
<!--                          @keyup.enter="handleQuery()"-->
<!--                      />-->
<!--                </el-form-item>-->

                <el-form-item label="责任人" prop="responsiblePersonName">
                  <el-select
                    v-model="queryParams.responsiblePersonName"
                    placeholder="责任人"
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
            v-hasPerm="['aioveuEquipment:aioveu-equipment:add']"
            type="success"
            @click="handleOpenDialog()"
        >
          <template #icon><Plus /></template>
          新增
        </el-button>
        <el-button
            v-hasPerm="['aioveuEquipment:aioveu-equipment:delete']"
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
                        label="设备ID"
                        prop="id"
                        min-width="150"
                        align="center"
                    />
                    <el-table-column
                        key="assetNo"
                        label="资产编号"
                        prop="assetNo"
                        min-width="150"
                        align="center"
                    />
                    <el-table-column
                        key="name"
                        label="设备名称"
                        prop="name"
                        min-width="150"
                        align="center"
                        fixed="left"
                    />
                    <el-table-column
                      key="categoryName"
                      label="设备分类"
                      prop="categoryName"
                      min-width="150"
                      align="center"
                    />
                    <el-table-column
                        key="model"
                        label="设备型号"
                        prop="model"
                        min-width="150"
                        align="center"
                    />
                    <el-table-column
                        key="serialNo"
                        label="序列号"
                        prop="serialNo"
                        min-width="150"
                        align="center"
                    />
                    <el-table-column
                      key="departmentName"
                      label="所属部门"
                      prop="departmentName"
                      min-width="150"
                      align="center"
                    />
                    <el-table-column
                        key="responsiblePersonName"
                        label="责任人"
                        prop="responsiblePersonName"
                        min-width="150"
                        align="center"
                    />
                    <el-table-column
                        key="purchaseDate"
                        label="采购日期"
                        prop="purchaseDate"
                        min-width="150"
                        align="center"
                    />
                    <el-table-column
                        key="purchasePrice"
                        label="采购价格"
                        prop="purchasePrice"
                        min-width="150"
                        align="center"
                    />
                    <el-table-column
                        key="warrantyPeriod"
                        label="保修期（月）"
                        prop="warrantyPeriod"
                        min-width="150"
                        align="center"
                    />
                    <el-table-column
                        key="maintenanceCycle"
                        label="维保周期（月）"
                        prop="maintenanceCycle"
                        min-width="150"
                        align="center"
                    />
                    <el-table-column
                        key="lastMaintenance"
                        label="上次维保日期"
                        prop="lastMaintenance"
                        min-width="150"
                        align="center"
                    />
                    <el-table-column
                        key="nextMaintenance"
                        label="下次维保日期"
                        prop="nextMaintenance"
                        min-width="150"
                        align="center"
                    />
                    <el-table-column
                      label="设备状态"
                      min-width="150"
                      align="center"
                    >
                      <template #default="scope">
                        <DictLabel v-model="scope.row.status" code="equipment_status" />
                      </template>
                    </el-table-column>

                    <el-table-column
                        key="remark"
                        label="备注"
                        prop="remark"
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
                v-hasPerm="['aioveuEquipment:aioveu-equipment:edit']"
                type="primary"
                size="small"
                link
                @click="handleOpenDialog(scope.row.id)"
            >
              <template #icon><Edit /></template>
              编辑
            </el-button>
            <el-button
                v-hasPerm="['aioveuEquipment:aioveu-equipment:delete']"
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

    <!-- 设备管理表单弹窗 -->
    <el-dialog
        v-model="dialog.visible"
        :title="dialog.title"
        width="500px"
        @close="handleCloseDialog"
    >
      <el-form ref="dataFormRef" :model="formData" :rules="rules" label-width="100px">
                <el-form-item label="资产编号" prop="assetNo">
                      <el-input
                          v-model="formData.assetNo"
                          placeholder="资产编号"
                      />
                </el-form-item>

                <el-form-item label="设备名称" prop="name">
                      <el-input
                          v-model="formData.name"
                          placeholder="设备名称"
                      />
                </el-form-item>

<!--                <el-form-item label="设备分类" prop="categoryName">-->
<!--                  <el-input-->
<!--                    v-model="formData.categoryName"-->
<!--                    placeholder="设备分类"-->
<!--                  />-->
<!--                </el-form-item>-->

                <el-form-item label="设备分类" prop="categoryName">
                  <el-select
                    v-model="formData.categoryName"
                    placeholder="设备分类"
                    clearable
                    filterable
                  >
                    <el-option
                      v-for="category in categoryOptions"
                      :key="category.categoryId"
                      :label="category.categoryName"
                      :value="category.categoryName"
                    />
                  </el-select>
                </el-form-item>

                <el-form-item label="设备型号" prop="model">
                      <el-input
                          v-model="formData.model"
                          placeholder="设备型号"
                      />
                </el-form-item>

                <el-form-item label="序列号" prop="serialNo">
                      <el-input
                          v-model="formData.serialNo"
                          placeholder="序列号"
                      />
                </el-form-item>

<!--                <el-form-item label="位置ID" prop="locationId">-->
<!--                      <el-input-->
<!--                          v-model="formData.locationId"-->
<!--                          placeholder="位置ID"-->
<!--                      />-->
<!--                </el-form-item>-->

<!--                <el-form-item label="所属部门" prop="departmentName">-->
<!--                  <el-input-->
<!--                    v-model="formData.departmentName"-->
<!--                    placeholder="所属部门"-->
<!--                  />-->
<!--                </el-form-item>-->

                <el-form-item label="所属部门" prop="departmentName">
                  <el-select
                    v-model="formData.departmentName"
                    placeholder="请选择部门"
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


<!--                <el-form-item label="责任人" prop="responsiblePersonName">-->
<!--                  <el-input-->
<!--                    v-model="formData.responsiblePersonName"-->
<!--                    placeholder="责任人"-->
<!--                  />-->
<!--                </el-form-item>-->

                <el-form-item label="责任人" prop="responsiblePersonName">
                  <el-select
                    v-model="formData.responsiblePersonName"
                    placeholder="责任人"
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

                <el-form-item label="采购日期" prop="purchaseDate">
                      <el-date-picker
                          class="!w-[240px]"
                          v-model="formData.purchaseDate"
                          type="date"
                          placeholder="采购日期"
                          value-format="YYYY-MM-DD"
                      />
                </el-form-item>

                <el-form-item label="采购价格" prop="purchasePrice">
                      <el-input
                          v-model="formData.purchasePrice"
                          placeholder="采购价格"
                      />
                </el-form-item>

                <el-form-item label="保修期" prop="warrantyPeriod">
                      <el-input
                          v-model="formData.warrantyPeriod"
                          placeholder="保修期（月）"
                      />
                </el-form-item>

                <el-form-item label="维保周期" prop="maintenanceCycle">
                      <el-input
                          v-model="formData.maintenanceCycle"
                          placeholder="维保周期（月）"
                      />
                </el-form-item>

                <el-form-item label="上次维保日期" prop="lastMaintenance">
                      <el-date-picker
                          class="!w-[240px]"
                          v-model="formData.lastMaintenance"
                          type="date"
                          placeholder="上次维保日期"
                          value-format="YYYY-MM-DD"
                      />
                </el-form-item>

                <el-form-item label="下次维保日期" prop="nextMaintenance">
                      <el-date-picker
                          class="!w-[240px]"
                          v-model="formData.nextMaintenance"
                          type="date"
                          placeholder="下次维保日期"
                          value-format="YYYY-MM-DD"
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

                <el-form-item label="备注" prop="remark">
                      <el-input
                          type="textarea"
                          v-model="formData.remark"
                          placeholder="备注"
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
    name: "AioveuEquipment",
    inheritAttrs: false,
  });

  import AioveuEquipmentAPI, { AioveuEquipmentPageVO, AioveuEquipmentForm, AioveuEquipmentPageQuery } from "@/api/aioveuEquipment/aioveu-equipment";
  // 导入字典值
  import DictAPI,{ DictItemOption } from '@/api/system/dict.api';

  import AioveuDepartmentAPI, { DeptOptionVO } from "@/api/aioveuDepartment/aioveu-department";
  import AioveuCategoryAPI, {CategoryOptionVO} from "@/api/aioveuCategory/aioveu-category";
  import AioveuEmployeeAPI, { EmployeeOptionVO } from "@/api/aioveuEmployee/aioveu-employee";
  const queryFormRef = ref();
  const dataFormRef = ref();

  const loading = ref(false);
  const removeIds = ref<number[]>([]);
  const total = ref(0);

  const queryParams = reactive<AioveuEquipmentPageQuery>({
    pageNum: 1,
    pageSize: 10,
  });

  // 设备管理表格数据
  const pageData = ref<AioveuEquipmentPageVO[]>([]);

  // 选项
  const statusOptions = ref<DictItemOption[]>([])

  // 新增：部门选项
  const deptOptions = ref<DeptOptionVO[]>([]);

  // 新增：父分类选项
  const categoryOptions = ref<CategoryOptionVO[]>([]);

  const employeeOptions = ref<EmployeeOptionVO[]>([]);

  // 弹窗
  const dialog = reactive({
    title: "",
    visible: false,
  });

  // 设备管理表单数据
  const formData = reactive<AioveuEquipmentForm>({});

  // 设备管理表单校验规则
  const rules = reactive({
                      assetNo: [{ required: true, message: "请输入资产编号", trigger: "blur" }],
                      name: [{ required: true, message: "请输入设备名称", trigger: "blur" }],
                      categoryName: [{ required: true, message: "请输入设备分类", trigger: "blur" }],
                      status: [{ required: true, message: "请输入状态", trigger: "blur" }],
    departmentName: [{ required: true, message: "请输入部门", trigger: "blur" }],
    responsiblePersonName: [{ required: true, message: "请输入责任人", trigger: "blur" }],
  });

  /** 查询设备管理 */
  function handleQuery() {
    loading.value = true;
          AioveuEquipmentAPI.getPage(queryParams)
        .then((data) => {
          pageData.value = data.list;
          total.value = data.total;
        })
        .finally(() => {
          loading.value = false;
        });
  }

  /** 重置设备管理查询 */
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
  const editingEquipmentId = ref<number | undefined>(undefined);

  /** 打开设备管理弹窗 */
  function handleOpenDialog(id?: number) {


    editingEquipmentId.value = id; // 保存ID

    if (id) {
      dialog.title = "修改设备管理";
            AioveuEquipmentAPI.getFormData(id).then((data) => {
        Object.assign(formData, data);
          dialog.visible = true;
      });
    } else {
      dialog.title = "新增设备管理";
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

  /** 提交设备管理表单 */
  function handleSubmit() {
    dataFormRef.value.validate((valid: any) => {
      if (valid) {
        loading.value = true;
        const id = editingEquipmentId.value; // 使用存储的ID
        if (id) {
                AioveuEquipmentAPI.update(id, formData)
              .then(() => {
                ElMessage.success("修改成功");
                handleCloseDialog();
                handleResetQuery();
              })
              .finally(() => (loading.value = false));
        } else {
                AioveuEquipmentAPI.add(formData)
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

  /** 关闭设备管理弹窗 */
  function handleCloseDialog() {
    dialog.visible = false;

    // 关键修复：在关闭弹窗时重置加载状态
    loading.value = false;
    // 延迟重置表单（等待动画完成）
    setTimeout(() => {
    dataFormRef.value.resetFields();
    dataFormRef.value.clearValidate();

    // 清除编辑ID
    editingEquipmentId.value = undefined;
    }, 300);
  }

  /** 删除设备管理 */
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
                AioveuEquipmentAPI.deleteByIds(ids)
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
    DictAPI.getDictItems('equipment_status').then(response => {
      statusOptions.value = response
    })
  }

  // 加载选项
  function loadDeptOptions() {
    AioveuDepartmentAPI.getAllDepartmentOptions().then(response => {
      deptOptions.value = response
    })
  }


  // 加载选项
  function loadParentCategoryOptions() {
    AioveuCategoryAPI.getAllCategoryOptions().then(response => {
      categoryOptions.value = response
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
    loadParentCategoryOptions();
    loadDeptOptions();
    loadEmployeeOptions();
  });
</script>
