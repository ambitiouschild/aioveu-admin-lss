<template>
  <div class="app-container">
    <div class="search-container">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true">
                <el-form-item label="采购ID" prop="id">
                      <el-input
                          v-model="queryParams.id"
                          placeholder="采购ID"
                          clearable
                          @keyup.enter="handleQuery()"
                      />
                </el-form-item>
                <el-form-item label="采购单号" prop="procurementNo">
                      <el-input
                          v-model="queryParams.procurementNo"
                          placeholder="采购单号"
                          clearable
                          @keyup.enter="handleQuery()"
                      />
                </el-form-item>
<!--                <el-form-item label="供应商ID" prop="supplierId">-->
<!--                      <el-input-->
<!--                          v-model="queryParams.supplierId"-->
<!--                          placeholder="供应商ID"-->
<!--                          clearable-->
<!--                          @keyup.enter="handleQuery()"-->
<!--                      />-->
<!--                </el-form-item>-->
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

<!--                <el-form-item label="下单时间" prop="orderDate">-->
<!--                      <el-date-picker-->
<!--                          v-model="queryParams.orderDate"-->
<!--                          type="daterange"-->
<!--                          range-separator="~"-->
<!--                          start-placeholder="开始时间"-->
<!--                          end-placeholder="结束时间"-->
<!--                          value-format="YYYY-MM-DD HH:mm:ss"-->
<!--                      />-->
<!--                </el-form-item>-->

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

<!--                <el-form-item label="申请人" prop="applicantName">-->
<!--                      <el-input-->
<!--                          v-model="queryParams.applicantName"-->
<!--                          placeholder="申请人"-->
<!--                          clearable-->
<!--                          @keyup.enter="handleQuery()"-->
<!--                      />-->
<!--                </el-form-item>-->

                <el-form-item label="申请人" prop="applicantName">
                  <el-select
                    v-model="queryParams.applicantName"
                    placeholder="申请人"
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
            v-hasPerm="['aioveu:aioveu-procurement:add']"
            type="success"
            @click="handleOpenDialog()"
        >
          <template #icon><Plus /></template>
          新增
        </el-button>
        <el-button
            v-hasPerm="['aioveu:aioveu-procurement:delete']"
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
                        label="采购ID"
                        prop="id"
                        min-width="150"
                        align="center"
                    />
                    <el-table-column
                        key="procurementNo"
                        label="采购单号"
                        prop="procurementNo"
                        min-width="150"
                        align="center"
                    />
<!--                    <el-table-column-->
<!--                        key="supplierId"-->
<!--                        label="供应商ID"-->
<!--                        prop="supplierId"-->
<!--                        min-width="150"-->
<!--                        align="center"-->
<!--                        fixed="left"-->
<!--                    />-->
                    <el-table-column
                      key="materialName"
                      label="物资"
                      prop="materialName"
                      min-width="150"
                      align="center"
                      fixed="left"
                    />
                    <el-table-column
                        key="quantity"
                        label="采购数量"
                        prop="quantity"
                        min-width="150"
                        align="center"
                    />
                    <el-table-column
                        key="unitPrice"
                        label="采购单价"
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
                        key="orderDate"
                        label="下单时间"
                        prop="orderDate"
                        min-width="150"
                        align="center"
                    />
                    <el-table-column
                        key="expectedDelivery"
                        label="预计到货日期"
                        prop="expectedDelivery"
                        min-width="150"
                        align="center"
                    />
                    <el-table-column
                        key="actualDelivery"
                        label="实际到货日期"
                        prop="actualDelivery"
                        min-width="150"
                        align="center"
                    />
                    <el-table-column
                        key="receiptDate"
                        label="签收时间"
                        prop="receiptDate"
                        min-width="150"
                        align="center"
                    />
                    <el-table-column
                      key="warehouseName"
                      label="入库仓库"
                      prop="warehouseName"
                      min-width="150"
                      align="center"
                    />
                    <el-table-column
                        key="inboundDate"
                        label="入库时间"
                        prop="inboundDate"
                        min-width="150"
                        align="center"
                    />
                    <el-table-column
                      label="采购状态"
                      min-width="150"
                      align="center"
                    >
                      <template #default="scope">
                        <DictLabel v-model="scope.row.status" code="procurement_status" />
                      </template>
                    </el-table-column>

                    <el-table-column
                        key="applicantName"
                        label="申请人"
                        prop="applicantName"
                        min-width="150"
                        align="center"
                    />
                    <el-table-column
                        key="reviewerName"
                        label="审核人"
                        prop="reviewerName"
                        min-width="150"
                        align="center"
                    />
                    <el-table-column
                        key="reviewTime"
                        label="审核时间"
                        prop="reviewTime"
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
                v-hasPerm="['aioveu:aioveu-procurement:edit']"
                type="primary"
                size="small"
                link
                @click="handleOpenDialog(scope.row.id)"
            >
              <template #icon><Edit /></template>
              编辑
            </el-button>
            <el-button
                v-hasPerm="['aioveu:aioveu-procurement:delete']"
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

    <!-- 采购流程表单弹窗 -->
    <el-dialog
        v-model="dialog.visible"
        :title="dialog.title"
        width="500px"
        @close="handleCloseDialog"
    >
      <el-form ref="dataFormRef" :model="formData" :rules="rules" label-width="100px">
                <el-form-item label="采购单号" prop="procurementNo">
                      <el-input
                          v-model="formData.procurementNo"
                          placeholder="采购单号"
                      />
                </el-form-item>

                <el-form-item label="供应商ID" prop="supplierId">
                      <el-input
                          v-model="formData.supplierId"
                          placeholder="供应商ID"
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

        <el-form-item label="采购数量" prop="quantity">
                      <el-input
                          v-model="formData.quantity"
                          placeholder="采购数量"
                      />
                </el-form-item>

                <el-form-item label="采购单价" prop="unitPrice">
                      <el-input
                          v-model="formData.unitPrice"
                          placeholder="采购单价"
                      />
                </el-form-item>

                <el-form-item label="总金额" prop="totalAmount">
                      <el-input
                          v-model="formData.totalAmount"
                          placeholder="总金额"
                      />
                </el-form-item>

                <el-form-item label="下单时间" prop="orderDate">
                      <el-date-picker
                          v-model="formData.orderDate"
                          type="datetime"
                          placeholder="下单时间"
                          value-format="YYYY-MM-DD HH:mm:ss"
                      />
                </el-form-item>

                <el-form-item label="预计到货日期" prop="expectedDelivery">
                      <el-date-picker
                          class="!w-[240px]"
                          v-model="formData.expectedDelivery"
                          type="date"
                          placeholder="预计到货日期"
                          value-format="YYYY-MM-DD"
                      />
                </el-form-item>

                <el-form-item label="实际到货日期" prop="actualDelivery">
                      <el-date-picker
                          class="!w-[240px]"
                          v-model="formData.actualDelivery"
                          type="date"
                          placeholder="实际到货日期"
                          value-format="YYYY-MM-DD"
                      />
                </el-form-item>

                <el-form-item label="签收时间" prop="receiptDate">
                      <el-date-picker
                          v-model="formData.receiptDate"
                          type="datetime"
                          placeholder="签收时间"
                          value-format="YYYY-MM-DD HH:mm:ss"
                      />
                </el-form-item>

<!--                <el-form-item label="入库仓库" prop="warehouseName">-->
<!--                  <el-input-->
<!--                    v-model="formData.warehouseName"-->
<!--                    placeholder="入库仓库"-->
<!--                  />-->
<!--                </el-form-item>-->

              <el-form-item label="入库仓库" prop="warehouseName">
                <el-select
                  v-model="formData.warehouseName"
                  placeholder="入库仓库"
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

                <el-form-item label="入库时间" prop="inboundDate">
                      <el-date-picker
                          v-model="formData.inboundDate"
                          type="datetime"
                          placeholder="入库时间"
                          value-format="YYYY-MM-DD HH:mm:ss"
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

<!--                <el-form-item label="申请人" prop="applicantName">-->
<!--                  <el-input-->
<!--                    v-model="formData.applicantName"-->
<!--                    placeholder="申请人"-->
<!--                  />-->
<!--                </el-form-item>-->

                <el-form-item label="申请人" prop="applicantName">
                  <el-select
                    v-model="formData.applicantName"
                    placeholder="申请人"
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


<!--                <el-form-item label="审核人" prop="reviewerName">-->
<!--                  <el-input-->
<!--                    v-model="formData.reviewerName"-->
<!--                    placeholder="审核人"-->
<!--                  />-->
<!--                </el-form-item>-->

                <el-form-item label="审核人" prop="reviewerName">
                  <el-select
                    v-model="formData.reviewerName"
                    placeholder="审核人"
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

                <el-form-item label="审核时间" prop="reviewTime">
                      <el-date-picker
                          v-model="formData.reviewTime"
                          type="datetime"
                          placeholder="审核时间"
                          value-format="YYYY-MM-DD HH:mm:ss"
                      />
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
    name: "AioveuProcurement",
    inheritAttrs: false,
  });

  import AioveuProcurementAPI, { AioveuProcurementPageVO, AioveuProcurementForm, AioveuProcurementPageQuery } from "@/api/aioveu/aioveu-procurement";
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

  const queryParams = reactive<AioveuProcurementPageQuery>({
    pageNum: 1,
    pageSize: 10,
  });
  // 选项
  const statusOptions = ref<DictItemOption[]>([])

  // 采购流程表格数据
  const pageData = ref<AioveuProcurementPageVO[]>([]);

  const materialOptions = ref<MaterialOptionVO[]>([]);
  const warehouseOptions = ref<WarehouseOptionVO[]>([]);
  const employeeOptions = ref<EmployeeOptionVO[]>([]);

  // 弹窗
  const dialog = reactive({
    title: "",
    visible: false,
  });

  // 采购流程表单数据
  const formData = reactive<AioveuProcurementForm>({});

  // 采购流程表单校验规则
  const rules = reactive({
                      procurementNo: [{ required: true, message: "请输入采购单号", trigger: "blur" }],
                      supplierId: [{ required: true, message: "请输入供应商ID", trigger: "blur" }],
                      materialName: [{ required: true, message: "请输入物资", trigger: "blur" }],
                      quantity: [{ required: true, message: "请输入采购数量", trigger: "blur" }],
                      unitPrice: [{ required: true, message: "请输入采购单价", trigger: "blur" }],
                      totalAmount: [{ required: true, message: "请输入总金额", trigger: "blur" }],
                      orderDate: [{ required: true, message: "请输入下单时间", trigger: "blur" }],
                      status: [{ required: true, message: "请输入状态", trigger: "blur" }],
                      applicantName: [{ required: true, message: "请输入申请人", trigger: "blur" }],
                      reviewerName: [{ required: true, message: "请输入审核人", trigger: "blur" }],
    warehouseName: [{ required: true, message: "请输入仓库", trigger: "blur" }],
  });

  /** 查询采购流程 */
  function handleQuery() {
    loading.value = true;
          AioveuProcurementAPI.getPage(queryParams)
        .then((data) => {
          pageData.value = data.list;
          total.value = data.total;
        })
        .finally(() => {
          loading.value = false;
        });
  }

  /** 重置采购流程查询 */
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
  const editingProcurementId = ref<number | undefined>(undefined);


  /** 打开采购流程弹窗 */
  function handleOpenDialog(id?: number) {


    editingProcurementId.value = id; // 保存ID

    if (id) {
      dialog.title = "修改采购流程";
            AioveuProcurementAPI.getFormData(id).then((data) => {
        Object.assign(formData, data);
              dialog.visible = true;
      });
    } else {
      dialog.title = "新增采购流程";

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

  /** 提交采购流程表单 */
  function handleSubmit() {
    dataFormRef.value.validate((valid: any) => {
      if (valid) {
        loading.value = true;
        const id = editingProcurementId.value; // 使用存储的ID
        if (id) {
                AioveuProcurementAPI.update(id, formData)
              .then(() => {
                ElMessage.success("修改成功");
                handleCloseDialog();
                handleResetQuery();
              })
              .finally(() => (loading.value = false));
        } else {
                AioveuProcurementAPI.add(formData)
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

  /** 关闭采购流程弹窗 */
  function handleCloseDialog() {
    dialog.visible = false;

    // 关键修复：在关闭弹窗时重置加载状态
    loading.value = false;

    // 延迟重置表单（等待动画完成）
    setTimeout(() => {
    dataFormRef.value.resetFields();
    dataFormRef.value.clearValidate();

    // 清除编辑ID
    editingProcurementId.value = undefined;
    }, 300);
  }

  /** 删除采购流程 */
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
                AioveuProcurementAPI.deleteByIds(ids)
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
    DictAPI.getDictItems('procurement_status').then(response => {
      statusOptions.value = response
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
    loadStatusOptions()
    loadMaterialOptions();
    loadWarehouseOptions();
    loadEmployeeOptions();
  });
</script>
