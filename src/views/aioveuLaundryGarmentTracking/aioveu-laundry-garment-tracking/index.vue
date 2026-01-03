<template>
  <div class="app-container">
    <div class="search-container">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true">
<!--                <el-form-item label="衣物流转记录" prop="id">-->
<!--                      <el-input-->
<!--                          v-model="queryParams.id"-->
<!--                          placeholder="衣物流转记录"-->
<!--                          clearable-->
<!--                          @keyup.enter="handleQuery()"-->
<!--                      />-->
<!--                </el-form-item>-->

<!--                <el-form-item label="衣物编码" prop="garmentCode">-->
<!--                      <el-input-->
<!--                          v-model="queryParams.garmentCode"-->
<!--                          placeholder="衣物编码"-->
<!--                          clearable-->
<!--                          @keyup.enter="handleQuery()"-->
<!--                      />-->
<!--                </el-form-item>-->

                    <el-form-item label="衣物编码" prop="garmentCode">
                      <el-select
                        v-model="queryParams.garmentCode"
                        placeholder="请选择衣物编码"
                        clearable
                        filterable
                        @keyup.enter="handleQuery()"
                      >
                        <el-option
                          v-for="item in garmentIdentityOption"
                          :key="item.id"
                          :label="item.garmentCode"
                          :value="item.id"
                        />
                      </el-select>
                    </el-form-item>


<!--                <el-form-item label="操作类型" prop="operationType">-->
<!--                      <el-input-->
<!--                          v-model="queryParams.operationType"-->
<!--                          placeholder="操作类型"-->
<!--                          clearable-->
<!--                          @keyup.enter="handleQuery()"-->
<!--                      />-->
<!--                </el-form-item>-->

                    <el-form-item label="操作类型" prop="operationType">
                      <el-select
                        v-model="queryParams.operationType"
                        placeholder="操作类型"
                        clearable
                        filterable
                        @keyup.enter="handleQuery()"
                      >
                        <el-option
                          v-for="item in operationTypeOptions"
                          :key="Number(item.value)"
                          :label="item.label"
                          :value="Number(item.value)"
                        />
                      </el-select>
                    </el-form-item>




<!--                <el-form-item label="操作人ID" prop="operatorId">-->
<!--                      <el-input-->
<!--                          v-model="queryParams.operatorId"-->
<!--                          placeholder="操作人ID"-->
<!--                          clearable-->
<!--                          @keyup.enter="handleQuery()"-->
<!--                      />-->
<!--                </el-form-item>-->

                    <el-form-item label="操作人" prop="operatorId">
                      <el-select
                        v-model="queryParams.operatorId"
                        placeholder="请选择操作人"
                        clearable
                        filterable
                        @keyup.enter="handleQuery()"
                      >
                        <el-option
                          v-for="item in operatorOptions"
                          :key="item.employeeId"
                          :label="item.employeeName"
                          :value="item.employeeId"
                        />
                      </el-select>
                    </el-form-item>






<!--                <el-form-item label="位置（仓库/门店）" prop="locationId">-->
<!--                      <el-input-->
<!--                          v-model="queryParams.locationId"-->
<!--                          placeholder="位置（仓库/门店）"-->
<!--                          clearable-->
<!--                          @keyup.enter="handleQuery()"-->
<!--                      />-->
<!--                </el-form-item>-->

                    <el-form-item label="位置（仓库/门店）" prop="locationId">
                      <el-select
                        v-model="queryParams.locationId"
                        placeholder="请选择位置（仓库/门店）"
                        clearable
                        filterable
                        @keyup.enter="handleQuery()"
                      >
                        <el-option
                          v-for="item in warehouseOption"
                          :key="item.warehouseId"
                          :label="item.warehouseName"
                          :value="item.warehouseId"
                        />
                      </el-select>
                    </el-form-item>

                <el-form-item label="备注" prop="remark">
                      <el-input
                          v-model="queryParams.remark"
                          placeholder="备注"
                          clearable
                          type="textarea"
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
            v-hasPerm="['aioveuLaundryGarmentTracking:aioveu-laundry-garment-tracking:add']"
            type="success"
            @click="handleOpenDialog()"
        >
          <template #icon><Plus /></template>
          新增
        </el-button>
        <el-button
            v-hasPerm="['aioveuLaundryGarmentTracking:aioveu-laundry-garment-tracking:delete']"
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
<!--                    <el-table-column-->
<!--                        key="id"-->
<!--                        label="衣物流转记录ID"-->
<!--                        prop="id"-->
<!--                        min-width="150"-->
<!--                        align="center"-->
<!--                    />-->
<!--                    <el-table-column-->
<!--                        key="garmentCode"-->
<!--                        label="衣物编码"-->
<!--                        prop="garmentCode"-->
<!--                        min-width="150"-->
<!--                        align="center"-->
<!--                    />-->


                    <el-table-column
                      key="garmentCodeName"
                      label="衣物编码"
                      prop="garmentCodeName"
                      min-width="150"
                      align="center"
                    />

<!--                    <el-table-column-->
<!--                        key="operationType"-->
<!--                        label="操作类型"-->
<!--                        prop="operationType"-->
<!--                        min-width="150"-->
<!--                        align="center"-->
<!--                    />-->

                    <el-table-column
                      label="操作类型"
                      min-width="150"
                      align="center"
                    >
                      <template #default="scope">
                        <DictLabel v-model="scope.row.operationType" code="laundry_garment_tracking_operation_type" />
                      </template>
                    </el-table-column>

<!--                    <el-table-column-->
<!--                        key="operatorId"-->
<!--                        label="操作人"-->
<!--                        prop="operatorId"-->
<!--                        min-width="150"-->
<!--                        align="center"-->
<!--                    />-->

                    <el-table-column
                      key="operatorName"
                      label="操作人"
                      prop="operatorName"
                      min-width="150"
                      align="center"
                    />

<!--                    <el-table-column-->
<!--                        key="locationId"-->
<!--                        label="位置ID（仓库/门店）"-->
<!--                        prop="locationId"-->
<!--                        min-width="150"-->
<!--                        align="center"-->
<!--                    />-->

                    <el-table-column
                      key="locationName"
                      label="位置（仓库/门店）"
                      prop="locationName"
                      min-width="150"
                      align="center"
                    />

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
                v-hasPerm="['aioveuLaundryGarmentTracking:aioveu-laundry-garment-tracking:edit']"
                type="primary"
                size="small"
                link
                @click="handleOpenDialog(scope.row.id)"
            >
              <template #icon><Edit /></template>
              编辑
            </el-button>
            <el-button
                v-hasPerm="['aioveuLaundryGarmentTracking:aioveu-laundry-garment-tracking:delete']"
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

    <!-- 衣物流转记录表单弹窗 -->
    <el-dialog
        v-model="dialog.visible"
        :title="dialog.title"
        width="500px"
        @close="handleCloseDialog"
    >
      <el-form ref="dataFormRef" :model="formData" :rules="rules" label-width="100px">
<!--                <el-form-item label="衣物流转记录ID" prop="id">-->
<!--                      <el-input-->
<!--                          v-model="formData.id"-->
<!--                          placeholder="衣物流转记录ID"-->
<!--                      />-->
<!--                </el-form-item>-->

<!--                <el-form-item label="衣物编码" prop="garmentCode">-->
<!--                      <el-input-->
<!--                          v-model="formData.garmentCode"-->
<!--                          placeholder="衣物编码"-->
<!--                      />-->
<!--                </el-form-item>-->

                    <el-form-item label="衣物编码" prop="garmentCode">
                      <el-select
                        v-model="formData.garmentCode"
                        placeholder="请选择衣物编码"
                        clearable
                        filterable
                      >
                        <el-option
                          v-for="item in garmentIdentityOption"
                          :key="item .id"
                          :label="item .garmentCode"
                          :value="item .id"
                        />
                      </el-select>
                    </el-form-item>

<!--                <el-form-item label="操作类型" prop="operationType">-->
<!--                      <el-input-->
<!--                          v-model="formData.operationType"-->
<!--                          placeholder="操作类型"-->
<!--                      />-->
<!--                </el-form-item>-->

                <el-form-item label="操作类型" prop="operationType">
                  <el-select
                    v-model="formData.operationType"
                    placeholder="请选择操作类型"
                    clearable
                    filterable
                  >
                    <el-option
                      v-for="item in operationTypeOptions"
                      :key="Number(item.value)"
                      :label="item.label"
                      :value="Number(item.value)"
                    />
                  </el-select>
                </el-form-item>

<!--                <el-form-item label="操作人" prop="operatorId">-->
<!--                      <el-input-->
<!--                          v-model="formData.operatorId"-->
<!--                          placeholder="操作人"-->
<!--                      />-->
<!--                </el-form-item>-->

                <el-form-item label="操作人" prop="operatorId">
                  <el-select
                    v-model="formData.operatorId"
                    placeholder="请选择操作人"
                    clearable
                    filterable
                  >
                    <el-option
                      v-for="item in operatorOptions"
                      :key="item .employeeId"
                      :label="item .employeeName"
                      :value="item .employeeId"
                    />
                  </el-select>
                </el-form-item>

<!--                <el-form-item label="位置" prop="locationId">-->
<!--                      <el-input-->
<!--                          v-model="formData.locationId"-->
<!--                          placeholder="位置"-->
<!--                      />-->
<!--                </el-form-item>-->

                <el-form-item label="门店或位置" prop="locationId">
                  <el-select
                    v-model="formData.locationId"
                    placeholder="请选择门店或位置"
                    clearable
                    filterable
                  >
                    <el-option
                      v-for="item in warehouseOption"
                      :key="item .warehouseId"
                      :label="item .warehouseName"
                      :value="item .warehouseId"
                    />
                  </el-select>
                </el-form-item>

                <el-form-item label="备注" prop="remark">
                      <el-input
                          v-model="formData.remark"
                          placeholder="备注"
                          type="textarea"
                      />
                </el-form-item>

<!--                <el-form-item label="创建时间" prop="createTime">-->
<!--                      <el-date-picker-->
<!--                          v-model="formData.createTime"-->
<!--                          type="datetime"-->
<!--                          placeholder="创建时间"-->
<!--                          value-format="YYYY-MM-DD HH:mm:ss"-->
<!--                      />-->
<!--                </el-form-item>-->

<!--                <el-form-item label="更新时间" prop="updateTime">-->
<!--                      <el-date-picker-->
<!--                          v-model="formData.updateTime"-->
<!--                          type="datetime"-->
<!--                          placeholder="更新时间"-->
<!--                          value-format="YYYY-MM-DD HH:mm:ss"-->
<!--                      />-->
<!--                </el-form-item>-->

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
    name: "AioveuLaundryGarmentTracking",
    inheritAttrs: false,
  });

  import AioveuLaundryGarmentTrackingAPI, { AioveuLaundryGarmentTrackingPageVO, AioveuLaundryGarmentTrackingForm, AioveuLaundryGarmentTrackingPageQuery } from "@/api/aioveuLaundryGarmentTracking/aioveu-laundry-garment-tracking";
  // 导入字典值API
  import DictAPI,{ DictItemOption } from '@/api/system/dict.api'
  import AioveuGarmentIdentityAPI, { AioveuGarmentIdentityOptionVO } from "@/api/aioveuLaundryGarmentIdentity/aioveu-laundry-garment-identity";
  import AioveuEmployeeAPI, { EmployeeOptionVO } from "@/api/aioveuEmployee/aioveu-employee";
  import AioveuWarehouseAPI, { WarehouseOptionVO } from "@/api/aioveuWarehouse/aioveu-warehouse";
  const queryFormRef = ref();
  const dataFormRef = ref();

  const loading = ref(false);
  const removeIds = ref<number[]>([]);
  const total = ref(0);

  // 字典选项
  const operationTypeOptions = ref<DictItemOption[]>([])

  // 新增：选项
  const garmentIdentityOption = ref<AioveuGarmentIdentityOptionVO[]>([]);

  // 新增：选项
  const warehouseOption = ref<WarehouseOptionVO[]>([]);

  // 字典选项
  const operatorOptions = ref<EmployeeOptionVO[]>([])

  const queryParams = reactive<AioveuLaundryGarmentTrackingPageQuery>({
    pageNum: 1,
    pageSize: 10,
  });

  // 加载选项
  function loadOptions() {

    AioveuGarmentIdentityAPI.getAllGarmentIdentityOptions().then(response => {
      garmentIdentityOption.value = response
    })

    AioveuEmployeeAPI.getAllEmployeeOptions().then(response => {
      operatorOptions.value = response
    })

    AioveuWarehouseAPI.getAllWarehouseOptions().then(response => {
      warehouseOption.value = response
    })

    // 加载字典
    DictAPI.getDictItems('laundry_garment_tracking_operation_type').then(response => {
      operationTypeOptions.value = response
    })
  }

  // 衣物流转记录表格数据
  const pageData = ref<AioveuLaundryGarmentTrackingPageVO[]>([]);

  // 弹窗
  const dialog = reactive({
    title: "",
    visible: false,
  });

  // 衣物流转记录表单数据
  const formData = reactive<AioveuLaundryGarmentTrackingForm>({});

  // 衣物流转记录表单校验规则
  const rules = reactive({
                      garmentCode: [{ required: true, message: "请输入衣物编码", trigger: "blur" }],
                      operationType: [{ required: true, message: "请输入操作类型", trigger: "blur" }],
  });

  /** 查询衣物流转记录 */
  function handleQuery() {
    loading.value = true;
          AioveuLaundryGarmentTrackingAPI.getPage(queryParams)
        .then((data) => {
          pageData.value = data.list;
          total.value = data.total;
        })
        .finally(() => {
          loading.value = false;
        });
  }

  /** 重置衣物流转记录查询 */
  function handleResetQuery() {
    queryFormRef.value!.resetFields();
    queryParams.pageNum = 1;
    handleQuery();
  }

  /** 行复选框选中记录选中ID集合 */
  function handleSelectionChange(selection: any) {
    removeIds.value = selection.map((item: any) => item.id);
  }

  /** 打开衣物流转记录弹窗 */
  function handleOpenDialog(id?: number) {
    console.log('打开弹窗', id ? '编辑' : '新增');
    if (id) {
      dialog.title = "修改衣物流转记录";
            AioveuLaundryGarmentTrackingAPI.getFormData(id).then((data) => {
        Object.assign(formData, data);
              //先准备数据，再显示弹窗
              dialog.visible = true;
      });
    } else {
      dialog.title = "新增衣物流转记录";
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

  /** 提交衣物流转记录表单 */
  function handleSubmit() {
    dataFormRef.value.validate((valid: any) => {
      if (valid) {
        loading.value = true;
        const id = formData.id;
        if (id) {
                AioveuLaundryGarmentTrackingAPI.update(id, formData)
              .then(() => {
                ElMessage.success("修改成功");
                handleCloseDialog();
                handleResetQuery();
              })
              .finally(() => (loading.value = false));
        } else {
                AioveuLaundryGarmentTrackingAPI.add(formData)
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

  /** 关闭衣物流转记录弹窗 */
  function handleCloseDialog() {
    dialog.visible = false;
    // 关键修复：在关闭弹窗时重置加载状态
    loading.value = false;

    // 延迟重置表单（等待动画完成）
    setTimeout(() => {
      dataFormRef.value.resetFields();
      dataFormRef.value.clearValidate();
      //editingId.value = undefined;
      formData.id = undefined;
    }, 3);
  }

  /** 删除衣物流转记录 */
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
                AioveuLaundryGarmentTrackingAPI.deleteByIds(ids)
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

  onMounted(() => {
    handleQuery();
    loadOptions()
  });
</script>
