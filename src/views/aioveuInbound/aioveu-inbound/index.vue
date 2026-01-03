<template>
  <div class="app-container">
    <div class="search-container">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true">
                <el-form-item label="入库ID" prop="id">
                      <el-input
                          v-model="queryParams.id"
                          placeholder="入库ID"
                          clearable
                          @keyup.enter="handleQuery()"
                      />
                </el-form-item>
                <el-form-item label="入库单号" prop="inboundNo">
                      <el-input
                          v-model="queryParams.inboundNo"
                          placeholder="入库单号"
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

                <el-form-item label="入库类型" prop="inboundType">
                  <el-select
                    v-model="queryParams.inboundType"
                    placeholder="入库类型"
                    clearable
                    filterable
                    @keyup.enter="handleQuery()"
                  >
                    <el-option
                      v-for="item in inboundTypeOptions"
                      :key="Number(item.value)"
                      :label="item.label"
                      :value="Number(item.value)"
                    />
                  </el-select>
                </el-form-item>

<!--                <el-form-item label="入库时间" prop="inTime">-->
<!--                      <el-date-picker-->
<!--                          v-model="queryParams.inTime"-->
<!--                          type="daterange"-->
<!--                          range-separator="~"-->
<!--                          start-placeholder="开始时间"-->
<!--                          end-placeholder="结束时间"-->
<!--                          value-format="YYYY-MM-DD HH:mm:ss"-->
<!--                      />-->
<!--                </el-form-item>-->
<!--                <el-form-item label="操作员" prop="operatorName">-->
<!--                      <el-input-->
<!--                          v-model="queryParams.operatorName"-->
<!--                          placeholder="操作员"-->
<!--                          clearable-->
<!--                          @keyup.enter="handleQuery()"-->
<!--                      />-->
<!--                </el-form-item>-->

                <el-form-item label="操作员" prop="operatorName">
                  <el-select
                    v-model="queryParams.operatorName"
                    placeholder="操作员"
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
            v-hasPerm="['aioveuInbound:aioveu-inbound:add']"
            type="success"
            @click="handleOpenDialog()"
        >
          <template #icon><Plus /></template>
          新增
        </el-button>
        <el-button
            v-hasPerm="['aioveuInbound:aioveu-inbound:delete']"
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
                        label="入库ID"
                        prop="id"
                        min-width="150"
                        align="center"
                    />
                    <el-table-column
                        key="inboundNo"
                        label="入库单号"
                        prop="inboundNo"
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
                        label="入库数量（支持小数计量）"
                        prop="quantity"
                        min-width="150"
                        align="center"
                    />
                    <el-table-column
                        key="unitPrice"
                        label="入库单价"
                        prop="unitPrice"
                        min-width="150"
                        align="center"
                    />
                    <el-table-column
                        key="totalAmount"
                        label="总金额"
                        prop="totalAmount"
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
                        key="productionDate"
                        label="生产日期"
                        prop="productionDate"
                        min-width="150"
                        align="center"
                    />
                    <el-table-column
                        key="expiryDate"
                        label="有效期至"
                        prop="expiryDate"
                        min-width="150"
                        align="center"
                    />
                    <el-table-column
                        key="supplierId"
                        label="供应商ID"
                        prop="supplierId"
                        min-width="150"
                        align="center"
                    />
                    <el-table-column
                      label="入库类型"
                      min-width="150"
                      align="center"
                    >
                      <template #default="scope">
                        <DictLabel v-model="scope.row.inboundType" code="inbound_type" />
                      </template>
                    </el-table-column>
                    <el-table-column
                        key="inTime"
                        label="入库时间"
                        prop="inTime"
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
                v-hasPerm="['aioveuInbound:aioveu-inbound:edit']"
                type="primary"
                size="small"
                link
                @click="handleOpenDialog(scope.row.id)"
            >
              <template #icon><Edit /></template>
              编辑
            </el-button>
            <el-button
                v-hasPerm="['aioveuInbound:aioveu-inbound:delete']"
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

    <!-- 入库信息表单弹窗 -->
    <el-dialog
        v-model="dialog.visible"
        :title="dialog.title"
        width="500px"
        @close="handleCloseDialog"
    >
      <el-form ref="dataFormRef" :model="formData" :rules="rules" label-width="100px">
                <el-form-item label="入库单号" prop="inboundNo">
                      <el-input
                          v-model="formData.inboundNo"
                          placeholder="入库单号"
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

<!--                <el-form-item label="仓库" prop="warehouseName">-->
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

                <el-form-item label="入库数量" prop="quantity">
                      <el-input
                          v-model="formData.quantity"
                          placeholder="入库数量（支持小数计量）"
                      />
                </el-form-item>

                <el-form-item label="入库单价" prop="unitPrice">
                      <el-input
                          v-model="formData.unitPrice"
                          placeholder="入库单价"
                      />
                </el-form-item>

                <el-form-item label="总金额" prop="totalAmount">
                      <el-input
                          v-model="formData.totalAmount"
                          placeholder="总金额"
                      />
                </el-form-item>

                <el-form-item label="批次号" prop="batchNumber">
                      <el-input
                          v-model="formData.batchNumber"
                          placeholder="批次号"
                      />
                </el-form-item>

                <el-form-item label="生产日期" prop="productionDate">
                      <el-date-picker
                          class="!w-[240px]"
                          v-model="formData.productionDate"
                          type="date"
                          placeholder="生产日期"
                          value-format="YYYY-MM-DD"
                      />
                </el-form-item>

                <el-form-item label="有效期至" prop="expiryDate">
                      <el-date-picker
                          class="!w-[240px]"
                          v-model="formData.expiryDate"
                          type="date"
                          placeholder="有效期至"
                          value-format="YYYY-MM-DD"
                      />
                </el-form-item>

                <el-form-item label="供应商ID" prop="supplierId">
                      <el-input
                          v-model="formData.supplierId"
                          placeholder="供应商ID"
                      />
                </el-form-item>

                <el-form-item label="入库类型" prop="inboundType">
                  <el-select
                    v-model="formData.inboundType"
                    placeholder="入库类型"
                    clearable
                  >
                    <el-option
                      v-for="item in inboundTypeOptions"
                      :key="Number(item.value)"
                      :label="item.label"
                      :value="Number(item.value)"
                    />
                  </el-select>
                </el-form-item>

                <el-form-item label="入库时间" prop="inTime">
                      <el-date-picker
                          v-model="formData.inTime"
                          type="datetime"
                          placeholder="入库时间"
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
    name: "AioveuInbound",
    inheritAttrs: false,
  });

  import AioveuInboundAPI, { AioveuInboundPageVO, AioveuInboundForm, AioveuInboundPageQuery } from "@/api/aioveuInbound/aioveu-inbound";
  // 导入字典值
  import DictAPI,{ DictItemOption } from '@/api/system/dict.api'
  import AioveuMaterialAPI, { MaterialOptionVO } from "@/api/aioveuMaterial/aioveu-material";
  import AioveuWarehouseAPI, { WarehouseOptionVO } from "@/api/aioveuWarehouse/aioveu-warehouse";
  import AioveuEmployeeAPI, { EmployeeOptionVO } from "@/api/aioveuEmployee/aioveu-employee";


  const queryFormRef = ref();
  const dataFormRef = ref();

  const loading = ref(false);
  const removeIds = ref<number[]>([]);
  const total = ref(0);

  const queryParams = reactive<AioveuInboundPageQuery>({
    pageNum: 1,
    pageSize: 10,
  });

  // 入库信息表格数据
  const pageData = ref<AioveuInboundPageVO[]>([]);
  // 选项
  const inboundTypeOptions = ref<DictItemOption[]>([])
  const materialOptions = ref<MaterialOptionVO[]>([]);
  const warehouseOptions = ref<WarehouseOptionVO[]>([]);
  const employeeOptions = ref<EmployeeOptionVO[]>([]);


  // 弹窗
  const dialog = reactive({
    title: "",
    visible: false,
  });

  // 入库信息表单数据
  const formData = reactive<AioveuInboundForm>({});

  // 入库信息表单校验规则
  const rules = reactive({
                      inboundNo: [{ required: true, message: "请输入入库单号", trigger: "blur" }],
                      materialName: [{ required: true, message: "请输入物资", trigger: "blur" }],
                      warehouseName: [{ required: true, message: "请输入仓库", trigger: "blur" }],
                      quantity: [{ required: true, message: "请输入入库数量（支持小数计量）", trigger: "blur" }],
                      unitPrice: [{ required: true, message: "请输入入库单价", trigger: "blur" }],
                      totalAmount: [{ required: true, message: "请输入总金额", trigger: "blur" }],
                      inTime: [{ required: true, message: "请输入入库时间", trigger: "blur" }],
                      operatorName: [{ required: true, message: "请输入操作员", trigger: "blur" }],
  });

  /** 查询入库信息 */
  function handleQuery() {
    loading.value = true;
          AioveuInboundAPI.getPage(queryParams)
        .then((data) => {
          pageData.value = data.list;
          total.value = data.total;
        })
        .finally(() => {
          loading.value = false;
        });
  }

  /** 重置入库信息查询 */
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
  const editingInboundId = ref<number | undefined>(undefined);

  /** 打开入库信息弹窗 */
  function handleOpenDialog(id?: number) {


    editingInboundId.value = id; // 保存ID

    if (id) {
      dialog.title = "修改入库信息";
            AioveuInboundAPI.getFormData(id).then((data) => {
        Object.assign(formData, data);
              dialog.visible = true;
      });
    } else {
      dialog.title = "新增入库信息";
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

  /** 提交入库信息表单 */
  function handleSubmit() {
    dataFormRef.value.validate((valid: any) => {
      if (valid) {
        loading.value = true;
        const id = editingInboundId.value;  // 使用存储的ID
        if (id) {
                AioveuInboundAPI.update(id, formData)
              .then(() => {
                ElMessage.success("修改成功");
                handleCloseDialog();
                handleResetQuery();
              })
              .finally(() => (loading.value = false));
        } else {
                AioveuInboundAPI.add(formData)
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

  /** 关闭入库信息弹窗 */
  function handleCloseDialog() {
    dialog.visible = false;

    // 关键修复：在关闭弹窗时重置加载状态
    loading.value = false;
    // 延迟重置表单（等待动画完成）
    setTimeout(() => {
    dataFormRef.value.resetFields();
    dataFormRef.value.clearValidate();

    // 清除编辑ID
    editingInboundId.value = undefined;
    }, 300);
  }

  /** 删除入库信息 */
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
                AioveuInboundAPI.deleteByIds(ids)
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
  function loadInboundTypeOptions() {
    DictAPI.getDictItems('inbound_type').then(response => {
      inboundTypeOptions.value = response
    })
  }

  // 加载选项
  function loadMaterialOptions() {
    AioveuMaterialAPI.getAllMaterialOptions().then(response => {
      materialOptions.value = response
    })
  }

  // 加载选项
  function loadWarehouseOptions() {
    AioveuWarehouseAPI.getAllWarehouseOptions().then(response => {
      warehouseOptions.value = response
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
    loadInboundTypeOptions()
    loadMaterialOptions();
    loadWarehouseOptions();
    loadEmployeeOptions();
  });
</script>
