<template>
  <div class="app-container">
    <div class="search-container">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true">
<!--                <el-form-item label="订单ID" prop="id">-->
<!--                      <el-input-->
<!--                          v-model="queryParams.id"-->
<!--                          placeholder="订单ID"-->
<!--                          clearable-->
<!--                          @keyup.enter="handleQuery()"-->
<!--                      />-->
<!--                </el-form-item>-->
                <el-form-item label="订单编号" prop="orderNo">
                      <el-input
                          v-model="queryParams.orderNo"
                          placeholder="订单编号"
                          clearable
                          @keyup.enter="handleQuery()"
                      />
                </el-form-item>
<!--                <el-form-item label="客户" prop="customerName">-->
<!--                      <el-input-->
<!--                          v-model="queryParams.customerName"-->
<!--                          placeholder="客户"-->
<!--                          clearable-->
<!--                          @keyup.enter="handleQuery()"-->
<!--                      />-->
<!--                </el-form-item>-->

                <el-form-item label="客户" prop="customerName">
                  <el-select
                    v-model="queryParams.customerName"
                    placeholder="客户"
                    clearable
                    filterable
                    @keyup.enter="handleQuery()"
                  >
                    <el-option
                      v-for="customer in customerOptions"
                      :key="customer.customerId"
                      :label="customer.customerName"
                      :value="customer.customerName"
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

                <el-form-item label="支付状态" prop="paymentStatus">
                  <el-select
                    v-model="queryParams.paymentStatus"
                    placeholder="支付状态"
                    clearable
                    filterable
                    @keyup.enter="handleQuery()"
                  >
                    <el-option
                      v-for="item in paymentStatusOptions"
                      :key="Number(item.value)"
                      :label="item.label"
                      :value="Number(item.value)"
                    />
                  </el-select>
                </el-form-item>

                <el-form-item label="订单状态" prop="orderStatus">
                  <el-select
                    v-model="queryParams.orderStatus"
                    placeholder="订单状态"
                    clearable
                    filterable
                    @keyup.enter="handleQuery()"
                  >
                    <el-option
                      v-for="item in orderStatusOptions"
                      :key="Number(item.value)"
                      :label="item.label"
                      :value="Number(item.value)"
                    />
                  </el-select>
                </el-form-item>

                <el-form-item label="运输方式" prop="shippingMethod">
                  <el-select
                    v-model="queryParams.shippingMethod"
                    placeholder="运输方式"
                    clearable
                    filterable
                    @keyup.enter="handleQuery()"
                  >
                    <el-option
                      v-for="item in shippingMethodOptions"
                      :key="Number(item.value)"
                      :label="item.label"
                      :value="Number(item.value)"
                    />
                  </el-select>
                </el-form-item>

<!--                <el-form-item label="销售负责人" prop="salesRepName">-->
<!--                      <el-input-->
<!--                          v-model="queryParams.salesRepName"-->
<!--                          placeholder="销售负责人"-->
<!--                          clearable-->
<!--                          @keyup.enter="handleQuery()"-->
<!--                      />-->
<!--                </el-form-item>-->

                <el-form-item label="负责人" prop="salesRepName">
                  <el-select
                    v-model="queryParams.salesRepName"
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
            v-hasPerm="['aioveuSalesOrder:aioveu-sales-order:add']"
            type="success"
            @click="handleOpenDialog()"
        >
          <template #icon><Plus /></template>
          新增
        </el-button>
        <el-button
            v-hasPerm="['aioveuSalesOrder:aioveu-sales-order:delete']"
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
<!--                        label="订单ID（主键）"-->
<!--                        prop="id"-->
<!--                        min-width="150"-->
<!--                        align="center"-->
<!--                    />-->
                    <el-table-column
                        key="orderNo"
                        label="订单编号"
                        prop="orderNo"
                        min-width="150"
                        align="center"
                    />
                    <el-table-column
                      key="customerName"
                      label="客户"
                      prop="customerName"
                      min-width="150"
                      align="center"
                    />
                    <el-table-column
                      key="contactName"
                      label="联系人"
                      prop="contactName"
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
                        label="预计交货日期"
                        prop="expectedDelivery"
                        min-width="150"
                        align="center"
                    />
                    <el-table-column
                        key="actualDelivery"
                        label="实际交货日期"
                        prop="actualDelivery"
                        min-width="150"
                        align="center"
                    />
                    <el-table-column
                        key="totalAmount"
                        label="订单总金额"
                        prop="totalAmount"
                        min-width="150"
                        align="center"
                    />
                    <el-table-column
                        key="currency"
                        label="货币代码"
                        prop="currency"
                        min-width="150"
                        align="center"
                    />
                    <el-table-column
                        key="discount"
                        label="整体折扣率"
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
                        key="taxAmount"
                        label="税额"
                        prop="taxAmount"
                        min-width="150"
                        align="center"
                    />
                    <el-table-column
                        key="grandTotal"
                        label="订单总额（含税）"
                        prop="grandTotal"
                        min-width="150"
                        align="center"
                    />
                    <el-table-column
                      label="付款条件"
                      min-width="150"
                      align="center"
                    >
                      <template #default="scope">
                        <DictLabel v-model="scope.row.paymentTerms" code="salesOrder_payment_terms" />
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="支付状态"
                      min-width="150"
                      align="center"
                    >
                      <template #default="scope">
                        <DictLabel v-model="scope.row.paymentStatus" code="salesOrder_payment_status" />
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="订单状态"
                      min-width="150"
                      align="center"
                    >
                      <template #default="scope">
                        <DictLabel v-model="scope.row.orderStatus" code="salesOrder_order_status" />
                      </template>
                    </el-table-column>
                    <el-table-column
                        key="shippingAddress"
                        label="收货地址"
                        prop="shippingAddress"
                        min-width="150"
                        align="center"
                    />
                    <el-table-column
                      label="运输方式"
                      min-width="150"
                      align="center"
                    >
                      <template #default="scope">
                        <DictLabel v-model="scope.row.shippingMethod" code="salesOrder_shipping_method" />
                      </template>
                    </el-table-column>
                    <el-table-column
                        key="trackingNo"
                        label="物流单号"
                        prop="trackingNo"
                        min-width="150"
                        align="center"
                    />
                    <el-table-column
                        key="salesRepName"
                        label="销售负责人"
                        prop="salesRepName"
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
                v-hasPerm="['aioveuSalesOrder:aioveu-sales-order:edit']"
                type="primary"
                size="small"
                link
                @click="handleOpenDialog(scope.row.id)"
            >
              <template #icon><Edit /></template>
              编辑
            </el-button>
            <el-button
                v-hasPerm="['aioveuSalesOrder:aioveu-sales-order:delete']"
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

    <!-- 销售订单表单弹窗 -->
    <el-dialog
        v-model="dialog.visible"
        :title="dialog.title"
        width="500px"
        @close="handleCloseDialog"
    >
      <el-form ref="dataFormRef" :model="formData" :rules="rules" label-width="100px">
                <el-form-item label="订单编号" prop="orderNo">
                      <el-input
                          v-model="formData.orderNo"
                          placeholder="订单编号（唯一）"
                      />
                </el-form-item>

<!--                <el-form-item label="客户" prop="customerName">-->
<!--                  <el-input-->
<!--                    v-model="formData.customerName"-->
<!--                    placeholder="客户"-->
<!--                  />-->
<!--                </el-form-item>-->

                <el-form-item label="客户" prop="customerName">
                  <el-select
                    v-model="formData.customerName"
                    placeholder="客户"
                    clearable
                    filterable
                  >
                    <el-option
                      v-for="customer in customerOptions"
                      :key="customer.customerId"
                      :label="customer.customerName"
                      :value="customer.customerName"
                    />
                  </el-select>
                </el-form-item>

<!--                <el-form-item label="联系人" prop="contactName">-->
<!--                  <el-input-->
<!--                    v-model="formData.contactName"-->
<!--                    placeholder="联系人"-->
<!--                  />-->
<!--                </el-form-item>-->

                <el-form-item label="联系人" prop="contactName">
                  <el-select
                    v-model="formData.contactName"
                    placeholder="联系人"
                    clearable
                    filterable
                  >
                    <el-option
                      v-for="contact in contactOptions"
                      :key="contact.contactId"
                      :label="contact.contactName"
                      :value="contact.contactName"
                    />
                  </el-select>
                </el-form-item>

                <el-form-item label="下单时间" prop="orderDate">
                      <el-date-picker
                          v-model="formData.orderDate"
                          type="datetime"
                          placeholder="下单时间"
                          value-format="YYYY-MM-DD HH:mm:ss"
                      />
                </el-form-item>

                <el-form-item label="预计交货日期" prop="expectedDelivery">
                      <el-date-picker
                          class="!w-[240px]"
                          v-model="formData.expectedDelivery"
                          type="date"
                          placeholder="预计交货日期"
                          value-format="YYYY-MM-DD"
                      />
                </el-form-item>

                <el-form-item label="实际交货日期" prop="actualDelivery">
                      <el-date-picker
                          class="!w-[240px]"
                          v-model="formData.actualDelivery"
                          type="date"
                          placeholder="实际交货日期"
                          value-format="YYYY-MM-DD"
                      />
                </el-form-item>

                <el-form-item label="订单总金额" prop="totalAmount">
                      <el-input
                          v-model="formData.totalAmount"
                          placeholder="订单总金额"
                      />
                </el-form-item>

                <el-form-item label="货币代码" prop="currency">
                      <el-input
                          v-model="formData.currency"
                          placeholder="货币代码"
                      />
                </el-form-item>

                <el-form-item label="整体折扣率" prop="discount">
                      <el-input
                          v-model="formData.discount"
                          placeholder="整体折扣率"
                      />
                </el-form-item>

                <el-form-item label="税率" prop="taxRate">
                      <el-input
                          v-model="formData.taxRate"
                          placeholder="税率"
                      />
                </el-form-item>

                <el-form-item label="税额" prop="taxAmount">
                      <el-input
                          v-model="formData.taxAmount"
                          placeholder="税额"
                      />
                </el-form-item>

                <el-form-item label="订单总额" prop="grandTotal">
                      <el-input
                          v-model="formData.grandTotal"
                          placeholder="订单总额（含税）"
                      />
                </el-form-item>

                <el-form-item label="付款条件" prop="paymentTerms">
                  <el-select
                    v-model="formData.paymentTerms"
                    placeholder="付款条件"
                    clearable
                  >
                    <el-option
                      v-for="item in paymentTermsOptions"
                      :key="Number(item.value)"
                      :label="item.label"
                      :value="Number(item.value)"
                    />
                  </el-select>
                </el-form-item>

                <el-form-item label="支付状态" prop="paymentStatus">
                  <el-select
                    v-model="formData.paymentStatus"
                    placeholder="支付状态"
                    clearable
                  >
                    <el-option
                      v-for="item in paymentStatusOptions"
                      :key="Number(item.value)"
                      :label="item.label"
                      :value="Number(item.value)"
                    />
                  </el-select>
                </el-form-item>

                <el-form-item label="订单状态" prop="orderStatus">
                  <el-select
                    v-model="formData.orderStatus"
                    placeholder="订单状态"
                    clearable
                  >
                    <el-option
                      v-for="item in orderStatusOptions"
                      :key="Number(item.value)"
                      :label="item.label"
                      :value="Number(item.value)"
                    />
                  </el-select>
                </el-form-item>

                <el-form-item label="收货地址" prop="shippingAddress">
                      <el-input
                          v-model="formData.shippingAddress"
                          placeholder="收货地址"
                      />
                </el-form-item>

                <el-form-item label="运输方式" prop="shippingMethod">
                  <el-select
                    v-model="formData.shippingMethod"
                    placeholder="运输方式"
                    clearable
                  >
                    <el-option
                      v-for="item in shippingMethodOptions"
                      :key="Number(item.value)"
                      :label="item.label"
                      :value="Number(item.value)"
                    />
                  </el-select>
                </el-form-item>

                <el-form-item label="物流单号" prop="trackingNo">
                      <el-input
                          v-model="formData.trackingNo"
                          placeholder="物流单号"
                      />
                </el-form-item>

<!--                <el-form-item label="销售负责人" prop="salesRepName">-->
<!--                  <el-input-->
<!--                    v-model="formData.salesRepName"-->
<!--                    placeholder="销售负责人"-->
<!--                  />-->
<!--                </el-form-item>-->

                <el-form-item label="负责人" prop="salesRepName">
                  <el-select
                    v-model="formData.salesRepName"
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

                <el-form-item label="备注" prop="notes">
                      <el-input
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
    name: "AioveuSalesOrder",
    inheritAttrs: false,
  });

  import AioveuSalesOrderAPI, { AioveuSalesOrderPageVO, AioveuSalesOrderForm, AioveuSalesOrderPageQuery } from "@/api/aioveuSalesOrder/aioveu-sales-order";
  // 导入字典值
  import DictAPI,{ DictItemOption } from '@/api/system/dict.api'

  import AioveuCustomerAPI, {CustomerOptionVO} from "@/api/aioveuCustomer/aioveu-customer";
  import AioveuEmployeeAPI, { EmployeeOptionVO } from "@/api/aioveuEmployee/aioveu-employee";
  import AioveuContactAPI, {ContactOptionVO} from "@/api/aioveuContact/aioveu-contact";

  const queryFormRef = ref();
  const dataFormRef = ref();

  const loading = ref(false);
  const removeIds = ref<number[]>([]);
  const total = ref(0);

  const queryParams = reactive<AioveuSalesOrderPageQuery>({
    pageNum: 1,
    pageSize: 10,
  });

  // 销售订单表格数据
  const pageData = ref<AioveuSalesOrderPageVO[]>([]);

  // 弹窗
  const dialog = reactive({
    title: "",
    visible: false,
  });

  // 选项
  const paymentTermsOptions = ref<DictItemOption[]>([])
  // 选项
  const paymentStatusOptions = ref<DictItemOption[]>([])
  // 选项
  const orderStatusOptions = ref<DictItemOption[]>([])
  // 选项
  const shippingMethodOptions = ref<DictItemOption[]>([])

  const customerOptions = ref<CustomerOptionVO[]>([]);
  const employeeOptions = ref<EmployeeOptionVO[]>([]);

  const contactOptions = ref<ContactOptionVO[]>([]);


  // 销售订单表单数据
  const formData = reactive<AioveuSalesOrderForm>({});

  // 销售订单表单校验规则
  const rules = reactive({
                      orderNo: [{ required: true, message: "请输入订单编号（唯一）", trigger: "blur" }],
                      customerName: [{ required: true, message: "请输入客户", trigger: "blur" }],
                      orderDate: [{ required: true, message: "请输入下单时间", trigger: "blur" }],
                      totalAmount: [{ required: true, message: "请输入订单总金额", trigger: "blur" }],
                      paymentStatus: [{ required: true, message: "请输入支付状态", trigger: "blur" }],
                      orderStatus: [{ required: true, message: "请输入订单状态", trigger: "blur" }],
                      operatorName: [{ required: true, message: "请输入操作员", trigger: "blur" }],
    salesRepName: [{ required: true, message: "请输入负责人", trigger: "blur" }],
    contactName: [{ required: true, message: "请输入联系人", trigger: "blur" }],
  });

  /** 查询销售订单 */
  function handleQuery() {
    loading.value = true;
          AioveuSalesOrderAPI.getPage(queryParams)
        .then((data) => {
          pageData.value = data.list;
          total.value = data.total;
        })
        .finally(() => {
          loading.value = false;
        });
  }

  /** 重置销售订单查询 */
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
  const editingSalesOrderId = ref<number | undefined>(undefined);

  /** 打开销售订单弹窗 */
  function handleOpenDialog(id?: number) {


    editingSalesOrderId.value = id; // 保存ID

    if (id) {
      dialog.title = "修改销售订单";
            AioveuSalesOrderAPI.getFormData(id).then((data) => {
        Object.assign(formData, data);
              dialog.visible = true;
      });
    } else {
      dialog.title = "新增销售订单";
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

  /** 提交销售订单表单 */
  function handleSubmit() {
    dataFormRef.value.validate((valid: any) => {
      if (valid) {
        loading.value = true;
        const id = editingSalesOrderId.value; // 使用存储的ID
        if (id) {
                AioveuSalesOrderAPI.update(id, formData)
              .then(() => {
                ElMessage.success("修改成功");
                handleCloseDialog();
                handleResetQuery();
              })
              .finally(() => (loading.value = false));
        } else {
                AioveuSalesOrderAPI.add(formData)
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

  /** 关闭销售订单弹窗 */
  function handleCloseDialog() {
    dialog.visible = false;

    // 关键修复：在关闭弹窗时重置加载状态
    loading.value = false;
    // 延迟重置表单（等待动画完成）
    setTimeout(() => {
    dataFormRef.value.resetFields();
    dataFormRef.value.clearValidate();


    // 清除编辑ID
    editingSalesOrderId.value = undefined;
    }, 300);

  }

  /** 删除销售订单 */
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
                AioveuSalesOrderAPI.deleteByIds(ids)
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
  function loadOptions() {
    DictAPI.getDictItems('salesOrder_payment_terms').then(response => {
      paymentTermsOptions.value = response
    })

    DictAPI.getDictItems('salesOrder_payment_status').then(response => {
      paymentStatusOptions.value = response
    })

    DictAPI.getDictItems('salesOrder_order_status').then(response => {
      orderStatusOptions.value = response
    })

    DictAPI.getDictItems('salesOrder_shipping_method').then(response => {
      shippingMethodOptions.value = response
    })

  }

  // 加载选项
  function loadCustomerOptions() {
    AioveuCustomerAPI.getAllCustomerOptions().then(response => {
      customerOptions.value = response
    })
  }

  // 加载选项
  function loadEmployeeOptions() {
    AioveuEmployeeAPI.getAllEmployeeOptions().then(response => {
      employeeOptions.value = response
    })
  }
  // 加载选项
  function loadContactOptions() {
    AioveuContactAPI.getAllContactOptions().then(response => {
      contactOptions.value = response
    })
  }



  onMounted(() => {
    handleQuery();
    loadOptions()
    loadCustomerOptions()
    loadEmployeeOptions();
    loadContactOptions();
  });
</script>
