<template>
  <div class="app-container">
    <div class="search-container">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true">
                <el-form-item label="明细ID" prop="id">
                      <el-input
                          v-model="queryParams.id"
                          placeholder="明细ID"
                          clearable
                          @keyup.enter="handleQuery()"
                      />
                </el-form-item>
<!--                <el-form-item label="订单" prop="orderName">-->
<!--                      <el-input-->
<!--                          v-model="queryParams.orderName"-->
<!--                          placeholder="订单"-->
<!--                          clearable-->
<!--                          @keyup.enter="handleQuery()"-->
<!--                      />-->
<!--                </el-form-item>-->


                <el-form-item label="订单" prop="orderName">
                  <el-select
                    v-model="queryParams.orderName"
                    placeholder="订单"
                    clearable
                    filterable
                    @keyup.enter="handleQuery()"
                  >
                    <el-option
                      v-for="salesOrder in salesOrderOptions"
                      :key="salesOrder.salesOrderId"
                      :label="salesOrder.salesOrderNo"
                      :value="salesOrder.salesOrderNo"
                    />
                  </el-select>
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

                <el-form-item label="发货仓库" prop="warehouseName">
                      <el-input
                          v-model="queryParams.warehouseName"
                          placeholder="发货仓库"
                          clearable
                          @keyup.enter="handleQuery()"
                      />
                </el-form-item>

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


                <el-form-item label="明细状态" prop="status">
                  <el-select
                    v-model="queryParams.status"
                    placeholder="明细状态"
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
            v-hasPerm="['aioveuSalesOrderDetail:aioveu-sales-order-detail:add']"
            type="success"
            @click="handleOpenDialog()"
        >
          <template #icon><Plus /></template>
          新增
        </el-button>
        <el-button
            v-hasPerm="['aioveuSalesOrderDetail:aioveu-sales-order-detail:delete']"
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
                        label="明细ID"
                        prop="id"
                        min-width="150"
                        align="center"
                    />
                    <el-table-column
                      key="salesOrderNo"
                      label="订单"
                      prop="salesOrderNo"
                      min-width="150"
                      align="center"
                    />
                    <el-table-column
                      key="materialName"
                      label="物资"
                      prop="materialName"
                      min-width="150"
                      align="center"
                    />
                    <el-table-column
                        key="quantity"
                        label="数量"
                        prop="quantity"
                        min-width="150"
                        align="center"
                    />
                    <el-table-column
                        key="unitPrice"
                        label="单价"
                        prop="unitPrice"
                        min-width="150"
                        align="center"
                    />
                    <el-table-column
                        key="discount"
                        label="折扣率"
                        prop="discount"
                        min-width="150"
                        align="center"
                    />
                    <el-table-column
                        key="taxRate"
                        label="税率"
                        prop="taxRate"
                        min-width="150"
                        align="center"
                    />
                    <el-table-column
                        key="subtotal"
                        label="小计"
                        prop="subtotal"
                        min-width="150"
                        align="center"
                    />
                    <el-table-column
                        key="taxAmount"
                        label="税额"
                        prop="taxAmount"
                        min-width="150"
                        align="center"
                    />
                    <el-table-column
                        key="totalPrice"
                        label="总金额"
                        prop="totalPrice"
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
                        key="deliveryDate"
                        label="要求交货日期"
                        prop="deliveryDate"
                        min-width="150"
                        align="center"
                    />
                    <el-table-column
                      key="warehouseName"
                      label="发货仓库"
                      prop="warehouseName"
                      min-width="150"
                      align="center"
                    />

                    <el-table-column
                      label="明细状态"
                      min-width="150"
                      align="center"
                    >
                      <template #default="scope">
                        <DictLabel v-model="scope.row.status" code="salesOrderDetail_status" />
                      </template>
                    </el-table-column>

                    <el-table-column
                        key="notes"
                        label="备注"
                        prop="notes"
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
                v-hasPerm="['aioveuSalesOrderDetail:aioveu-sales-order-detail:edit']"
                type="primary"
                size="small"
                link
                @click="handleOpenDialog(scope.row.id)"
            >
              <template #icon><Edit /></template>
              编辑
            </el-button>
            <el-button
                v-hasPerm="['aioveuSalesOrderDetail:aioveu-sales-order-detail:delete']"
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

    <!-- 订单明细表单弹窗 -->
    <el-dialog
        v-model="dialog.visible"
        :title="dialog.title"
        width="500px"
        @close="handleCloseDialog"
    >
      <el-form ref="dataFormRef" :model="formData" :rules="rules" label-width="100px">

<!--                <el-form-item label="订单" prop="orderName">-->
<!--                  <el-input-->
<!--                    v-model="formData.orderName"-->
<!--                    placeholder="订单"-->
<!--                  />-->
<!--                </el-form-item>-->

                <el-form-item label="订单" prop="orderName">
                  <el-select
                    v-model="formData.orderName"
                    placeholder="订单"
                    clearable
                    filterable
                  >
                    <el-option
                      v-for="salesOrder in salesOrderOptions"
                      :key="salesOrder.salesOrderId"
                      :label="salesOrder.salesOrderNo"
                      :value="salesOrder.salesOrderNo"
                    />
                  </el-select>
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

        <el-form-item label="数量" prop="quantity">
                      <el-input
                          v-model="formData.quantity"
                          placeholder="数量"
                      />
                </el-form-item>

                <el-form-item label="单价" prop="unitPrice">
                      <el-input
                          v-model="formData.unitPrice"
                          placeholder="单价"
                      />
                </el-form-item>

                <el-form-item label="折扣率" prop="discount">
                      <el-input
                          v-model="formData.discount"
                          placeholder="折扣率"
                      />
                </el-form-item>

                <el-form-item label="税率" prop="taxRate">
                      <el-input
                          v-model="formData.taxRate"
                          placeholder="税率"
                      />
                </el-form-item>

<!--                <el-form-item label="小计" prop="subtotal">-->
<!--                      <el-input-->
<!--                          v-model="formData.subtotal"-->
<!--                          placeholder="小计"-->
<!--                      />-->
<!--                </el-form-item>-->

<!--                <el-form-item label="税额" prop="taxAmount">-->
<!--                      <el-input-->
<!--                          v-model="formData.taxAmount"-->
<!--                          placeholder="税额"-->
<!--                      />-->
<!--                </el-form-item>-->

<!--                <el-form-item label="总金额" prop="totalPrice">-->
<!--                      <el-input-->
<!--                          v-model="formData.totalPrice"-->
<!--                          placeholder="总金额"-->
<!--                      />-->
<!--                </el-form-item>-->

                <el-form-item label="批次号" prop="batchNumber">
                      <el-input
                          v-model="formData.batchNumber"
                          placeholder="批次号"
                      />
                </el-form-item>

                <el-form-item label="要求交货日期" prop="deliveryDate">
                      <el-date-picker
                          class="!w-[240px]"
                          v-model="formData.deliveryDate"
                          type="date"
                          placeholder="要求交货日期"
                          value-format="YYYY-MM-DD"
                      />
                </el-form-item>

                <el-form-item label="发货仓库" prop="warehouseName">
                  <el-select
                    v-model="formData.warehouseName"
                    placeholder="发货仓库"
                    clearable
                  >
                    <el-option
                      v-for="warehouse in warehouseOptions"
                      :key="warehouse.warehouseId"
                      :label="warehouse.warehouseName"
                      :value="warehouse.warehouseName"
                    />
                  </el-select>
                </el-form-item>

                <el-form-item label="明细状态" prop="status">
                  <el-select
                    v-model="formData.status"
                    placeholder="明细状态"
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

                <el-form-item label="备注" prop="notes">
                      <el-input
                          type="textarea"
                          v-model="formData.notes"
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
    name: "AioveuSalesOrderDetail",
    inheritAttrs: false,
  });

  import AioveuSalesOrderDetailAPI, { AioveuSalesOrderDetailPageVO, AioveuSalesOrderDetailForm, AioveuSalesOrderDetailPageQuery } from "@/api/aioveuSalesOrderDetail/aioveu-sales-order-detail";
  // 导入字典值
  import DictAPI,{ DictItemOption } from '@/api/system/dict.api'
  // 新增：导入部门API
  import AioveuWarehouseAPI, {  WarehouseOptionVO } from "@/api/aioveuWarehouse/aioveu-warehouse";

  import AioveuSalesOrderAPI, {SalesOrderOptionVO} from "@/api/aioveuSalesOrder/aioveu-sales-order";
  import AioveuMaterialAPI, { MaterialOptionVO } from "@/api/aioveuMaterial/aioveu-material";
  const queryFormRef = ref();
  const dataFormRef = ref();

  const loading = ref(false);
  const removeIds = ref<number[]>([]);
  const total = ref(0);

  const queryParams = reactive<AioveuSalesOrderDetailPageQuery>({
    pageNum: 1,
    pageSize: 10,
  });

  // 订单明细表格数据
  const pageData = ref<AioveuSalesOrderDetailPageVO[]>([]);

  // 弹窗
  const dialog = reactive({
    title: "",
    visible: false,
  });

  // 选项
  const warehouseOptions = ref<WarehouseOptionVO[]>([])
  // 选项
  const statusOptions = ref<DictItemOption[]>([])

  const salesOrderOptions = ref<SalesOrderOptionVO[]>([]);

  const materialOptions = ref<MaterialOptionVO[]>([]);


  // 订单明细表单数据
  const formData = reactive<AioveuSalesOrderDetailForm>({});

  // 订单明细表单校验规则
  const rules = reactive({
    orderName: [{ required: true, message: "请输入订单", trigger: "blur" }],
                      materialName: [{ required: true, message: "请输入物资", trigger: "blur" }],
                      quantity: [{ required: true, message: "请输入数量", trigger: "blur" }],
                      unitPrice: [{ required: true, message: "请输入单价", trigger: "blur" }],
      warehouseName: [{ required: true, message: "请输入仓库", trigger: "blur" }],
  });

  /** 查询订单明细 */
  function handleQuery() {
    loading.value = true;
          AioveuSalesOrderDetailAPI.getPage(queryParams)
        .then((data) => {
          pageData.value = data.list;
          total.value = data.total;
        })
        .finally(() => {
          loading.value = false;
        });
  }

  /** 重置订单明细查询 */
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
  const editingSalesOrderDetailId = ref<number | undefined>(undefined);

  /** 打开订单明细弹窗 */
  function handleOpenDialog(id?: number) {


    editingSalesOrderDetailId.value = id; // 保存ID

    if (id) {
      dialog.title = "修改订单明细";
            AioveuSalesOrderDetailAPI.getFormData(id).then((data) => {
        Object.assign(formData, data);
              dialog.visible = true;
      });
    } else {
      dialog.title = "新增订单明细";

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

  /** 提交订单明细表单 */
  function handleSubmit() {
    dataFormRef.value.validate((valid: any) => {
      if (valid) {
        loading.value = true;
        const id = editingSalesOrderDetailId.value; // 使用存储的ID
        if (id) {
                AioveuSalesOrderDetailAPI.update(id, formData)
              .then(() => {
                ElMessage.success("修改成功");
                handleCloseDialog();
                handleResetQuery();
              })
              .finally(() => (loading.value = false));
        } else {
                AioveuSalesOrderDetailAPI.add(formData)
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

  /** 关闭订单明细弹窗 */
  function handleCloseDialog() {
    dialog.visible = false;

    // 关键修复：在关闭弹窗时重置加载状态
    loading.value = false;
    // 延迟重置表单（等待动画完成）
    setTimeout(() => {
    dataFormRef.value.resetFields();
    dataFormRef.value.clearValidate();

    // 清除编辑ID
    editingSalesOrderDetailId.value = undefined;
    }, 300);
  }

  /** 删除订单明细 */
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
                AioveuSalesOrderDetailAPI.deleteByIds(ids)
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

  // 主要修改点：部门列表加载方法
  function loadWarehouses() {
    loading.value = true;
    AioveuWarehouseAPI.getAllWarehouseOptions()
      .then(response => {
        // 确保响应数据是数组类型
        if (Array.isArray(response)) {
          // 转换数据类型：确保deptId是数字
          warehouseOptions.value = response;
        } else {
          // 处理非数组响应
          console.error("仓库列表响应格式错误:", response);
          ElMessage.error("仓库列表格式错误");
        }
      })
      .catch(error => {
        console.error("加载仓库列表失败:", error);
        ElMessage.error("加载仓库列表失败");
      })
      .finally(() => {
        loading.value = false;
      });
  }

  // 加载字典
  function loadOptions() {
    DictAPI.getDictItems('salesOrderDetail_status').then(response => {
      statusOptions.value = response
    })

  }

  // 加载选项
  function loadSalesOrderOptions() {
    AioveuSalesOrderAPI.getAllSalesOrderOptions().then(response => {
      salesOrderOptions.value = response
    })
  }

  // 加载选项
  function loadMaterialOptions() {
    AioveuMaterialAPI.getAllMaterialOptions().then(response => {
      materialOptions.value = response
    })
  }


  onMounted(() => {
    handleQuery();
    loadWarehouses();
    loadOptions()
    loadSalesOrderOptions();
    loadMaterialOptions();
  });
</script>
