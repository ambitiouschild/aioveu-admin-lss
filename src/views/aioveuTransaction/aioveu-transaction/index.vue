<template>
  <div class="app-container">
    <div class="search-container">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true">
<!--                <el-form-item label="交易ID" prop="id">-->
<!--                      <el-input-->
<!--                          v-model="queryParams.id"-->
<!--                          placeholder="交易ID"-->
<!--                          clearable-->
<!--                          @keyup.enter="handleQuery()"-->
<!--                      />-->
<!--                </el-form-item>-->
                <el-form-item label="交易编号" prop="transactionNo">
                      <el-input
                          v-model="queryParams.transactionNo"
                          placeholder="交易编号"
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

<!--                <el-form-item label="联系人" prop="contactName">-->
<!--                      <el-input-->
<!--                          v-model="queryParams.contactName"-->
<!--                          placeholder="联系人"-->
<!--                          clearable-->
<!--                          @keyup.enter="handleQuery()"-->
<!--                      />-->
<!--                </el-form-item>-->

                <el-form-item label="联系人" prop="contactName">
                  <el-select
                    v-model="queryParams.contactName"
                    placeholder="联系人"
                    clearable
                    filterable
                    @keyup.enter="handleQuery()"
                  >
                    <el-option
                      v-for="contact in contactOptions"
                      :key="contact.contactId"
                      :label="contact.contactName"
                      :value="contact.contactName"
                    />
                  </el-select>
                </el-form-item>

<!--                <el-form-item label="交易日期" prop="transactionDate">-->
<!--                      <el-date-picker-->
<!--                          v-model="queryParams.transactionDate"-->
<!--                          type="daterange"-->
<!--                          range-separator="~"-->
<!--                          start-placeholder="开始时间"-->
<!--                          end-placeholder="结束时间"-->
<!--                          value-format="YYYY-MM-DD HH:mm:ss"-->
<!--                      />-->
<!--                </el-form-item>-->

                <el-form-item label="支付方式" prop="paymentMethod">
                  <el-select
                    v-model="queryParams.paymentMethod"
                    placeholder="支付方式"
                    clearable
                    filterable
                    @keyup.enter="handleQuery()"
                  >
                    <el-option
                      v-for="item in paymentMethodOptions"
                      :key="Number(item.value)"
                      :label="item.label"
                      :value="Number(item.value)"
                    />
                  </el-select>
                </el-form-item>

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

                <el-form-item label="交易类型" prop="transactionType">
                  <el-select
                    v-model="queryParams.transactionType"
                    placeholder="交易类型"
                    clearable
                    filterable
                    @keyup.enter="handleQuery()"
                  >
                    <el-option
                      v-for="item in transactionTypeOptions"
                      :key="Number(item.value)"
                      :label="item.label"
                      :value="Number(item.value)"
                    />
                  </el-select>
                </el-form-item>

                <el-form-item label="交易状态" prop="transactionStatus">
                  <el-select
                    v-model="queryParams.transactionStatus"
                    placeholder="交易状态"
                    clearable
                    filterable
                    @keyup.enter="handleQuery()"
                  >
                    <el-option
                      v-for="item in transactionStatusOptions"
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
            v-hasPerm="['aioveuTransaction:aioveu-transaction:add']"
            type="success"
            @click="handleOpenDialog()"
        >
          <template #icon><Plus /></template>
          新增
        </el-button>
        <el-button
            v-hasPerm="['aioveuTransaction:aioveu-transaction:delete']"
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
<!--                        label="交易ID"-->
<!--                        prop="id"-->
<!--                        min-width="150"-->
<!--                        align="center"-->
<!--                    />-->
                    <el-table-column
                        key="transactionNo"
                        label="交易编号"
                        prop="transactionNo"
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
                        key="transactionDate"
                        label="交易日期"
                        prop="transactionDate"
                        min-width="150"
                        align="center"
                    />
                    <el-table-column
                        key="amount"
                        label="交易金额"
                        prop="amount"
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
                      label="支付方式"
                      min-width="150"
                      align="center"
                    >
                      <template #default="scope">
                        <DictLabel v-model="scope.row.paymentMethod" code="transaction_payment_method" />
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="支付状态"
                      min-width="150"
                      align="center"
                    >
                      <template #default="scope">
                        <DictLabel v-model="scope.row.paymentStatus" code="transaction_payment_status" />
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="交易类型"
                      min-width="150"
                      align="center"
                    >
                      <template #default="scope">
                        <DictLabel v-model="scope.row.transactionType" code="transaction_type" />
                      </template>
                    </el-table-column>
                    <el-table-column
                        key="invoiceNo"
                        label="发票号码"
                        prop="invoiceNo"
                        min-width="150"
                        align="center"
                    />
                    <el-table-column
                        key="productId"
                        label="产品ID"
                        prop="productId"
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
                        key="taxAmount"
                        label="税额"
                        prop="taxAmount"
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
                        key="salesRepName"
                        label="销售负责人"
                        prop="salesRepName"
                        min-width="150"
                        align="center"
                    />
                    <el-table-column
                      label="交易状态"
                      min-width="150"
                      align="center"
                    >
                      <template #default="scope">
                        <DictLabel v-model="scope.row.transactionStatus" code="transaction_status" />
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
                v-hasPerm="['aioveuTransaction:aioveu-transaction:edit']"
                type="primary"
                size="small"
                link
                @click="handleOpenDialog(scope.row.id)"
            >
              <template #icon><Edit /></template>
              编辑
            </el-button>
            <el-button
                v-hasPerm="['aioveuTransaction:aioveu-transaction:delete']"
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

    <!-- 客户交易记录表单弹窗 -->
    <el-dialog
        v-model="dialog.visible"
        :title="dialog.title"
        width="500px"
        @close="handleCloseDialog"
    >
      <el-form ref="dataFormRef" :model="formData" :rules="rules" label-width="100px">
                <el-form-item label="交易编号" prop="transactionNo">
                      <el-input
                          v-model="formData.transactionNo"
                          placeholder="交易编号"
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

                <el-form-item label="交易日期" prop="transactionDate">
                      <el-date-picker
                          v-model="formData.transactionDate"
                          type="datetime"
                          placeholder="交易日期"
                          value-format="YYYY-MM-DD HH:mm:ss"
                      />
                </el-form-item>

                <el-form-item label="交易金额" prop="amount">
                      <el-input
                          v-model="formData.amount"
                          placeholder="交易金额"
                      />
                </el-form-item>

                <el-form-item label="货币代码" prop="currency">
                      <el-input
                          v-model="formData.currency"
                          placeholder="货币代码"
                      />
                </el-form-item>

                <el-form-item label="支付方式" prop="paymentMethod">
                  <el-select
                    v-model="formData.paymentMethod"
                    placeholder="支付方式"
                    clearable
                  >
                    <el-option
                      v-for="item in paymentMethodOptions"
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

                <el-form-item label="交易类型" prop="transactionType">
                  <el-select
                    v-model="formData.transactionType"
                    placeholder="交易类型"
                    clearable
                  >
                    <el-option
                      v-for="item in transactionTypeOptions"
                      :key="Number(item.value)"
                      :label="item.label"
                      :value="Number(item.value)"
                    />
                  </el-select>
                </el-form-item>

                <el-form-item label="发票号码" prop="invoiceNo">
                      <el-input
                          v-model="formData.invoiceNo"
                          placeholder="发票号码"
                      />
                </el-form-item>

                <el-form-item label="产品ID" prop="productId">
                      <el-input
                          v-model="formData.productId"
                          placeholder="产品ID"
                      />
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

                <el-form-item label="税额" prop="taxAmount">
                      <el-input
                          v-model="formData.taxAmount"
                          placeholder="税额"
                      />
                </el-form-item>

                <el-form-item label="总金额" prop="totalAmount">
                      <el-input
                          v-model="formData.totalAmount"
                          placeholder="总金额"
                      />
                </el-form-item>

<!--                <el-form-item label="负责人" prop="salesRepName">-->
<!--                  <el-input-->
<!--                    v-model="formData.salesRepName"-->
<!--                    placeholder="负责人"-->
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

                <el-form-item label="交易状态" prop="transactionStatus">
                  <el-select
                    v-model="formData.transactionStatus"
                    placeholder="交易状态"
                    clearable
                  >
                    <el-option
                      v-for="item in transactionStatusOptions"
                      :key="Number(item.value)"
                      :label="item.label"
                      :value="Number(item.value)"
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
    name: "AioveuTransaction",
    inheritAttrs: false,
  });

  import AioveuTransactionAPI, { AioveuTransactionPageVO, AioveuTransactionForm, AioveuTransactionPageQuery } from "@/api/aioveuTransaction/aioveu-transaction";
  // 导入字典值
  import DictAPI,{ DictItemOption } from '@/api/system/dict.api'
  import AioveuCustomerAPI, {CustomerOptionVO} from "@/api/aioveuCustomer/aioveu-customer";
  import AioveuContactAPI, {ContactOptionVO} from "@/api/aioveuContact/aioveu-contact";

  import AioveuEmployeeAPI, { EmployeeOptionVO } from "@/api/aioveuEmployee/aioveu-employee";


  const queryFormRef = ref();
  const dataFormRef = ref();

  const loading = ref(false);
  const removeIds = ref<number[]>([]);
  const total = ref(0);

  const queryParams = reactive<AioveuTransactionPageQuery>({
    pageNum: 1,
    pageSize: 10,
  });

  // 客户交易记录表格数据
  const pageData = ref<AioveuTransactionPageVO[]>([]);

  // 弹窗
  const dialog = reactive({
    title: "",
    visible: false,
  });

  // 选项
  const paymentMethodOptions = ref<DictItemOption[]>([])
  // 选项
  const paymentStatusOptions = ref<DictItemOption[]>([])
  // 选项
  const transactionTypeOptions = ref<DictItemOption[]>([])
  // 选项
  const transactionStatusOptions = ref<DictItemOption[]>([])

  const customerOptions = ref<CustomerOptionVO[]>([]);

  const contactOptions = ref<ContactOptionVO[]>([]);

  const employeeOptions = ref<EmployeeOptionVO[]>([]);


  // 客户交易记录表单数据
  const formData = reactive<AioveuTransactionForm>({});

  // 客户交易记录表单校验规则
  const rules = reactive({
                      transactionNo: [{ required: true, message: "请输入交易编号", trigger: "blur" }],
                      customerName: [{ required: true, message: "请输入客户ID", trigger: "blur" }],
    contactName: [{ required: true, message: "请输入联系人", trigger: "blur" }],
                      transactionDate: [{ required: true, message: "请输入交易日期", trigger: "blur" }],
                      amount: [{ required: true, message: "请输入交易金额", trigger: "blur" }],
                      paymentMethod: [{ required: true, message: "请输入支付方式", trigger: "blur" }],
                      paymentStatus: [{ required: true, message: "请输入支付状态", trigger: "blur" }],
                      transactionType: [{ required: true, message: "请输入交易类型", trigger: "blur" }],
                      transactionStatus: [{ required: true, message: "请输入交易状态", trigger: "blur" }],
    salesRepName: [{ required: true, message: "请输入交易状态", trigger: "blur" }]
  });

  /** 查询客户交易记录 */
  function handleQuery() {
    loading.value = true;
          AioveuTransactionAPI.getPage(queryParams)
        .then((data) => {
          pageData.value = data.list;
          total.value = data.total;
        })
        .finally(() => {
          loading.value = false;
        });
  }

  /** 重置客户交易记录查询 */
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
  const editingTransactionId = ref<number | undefined>(undefined);

  /** 打开客户交易记录弹窗 */
  function handleOpenDialog(id?: number) {


    editingTransactionId.value = id; // 保存ID

    if (id) {
      dialog.title = "修改客户交易记录";
            AioveuTransactionAPI.getFormData(id).then((data) => {
        Object.assign(formData, data);
              dialog.visible = true;
      });
    } else {
      dialog.title = "新增客户交易记录";

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

  /** 提交客户交易记录表单 */
  function handleSubmit() {
    dataFormRef.value.validate((valid: any) => {
      if (valid) {
        loading.value = true;
        const id = editingTransactionId.value; // 使用存储的ID
        if (id) {
                AioveuTransactionAPI.update(id, formData)
              .then(() => {
                ElMessage.success("修改成功");
                handleCloseDialog();
                handleResetQuery();
              })
              .finally(() => (loading.value = false));
        } else {
                AioveuTransactionAPI.add(formData)
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

  /** 关闭客户交易记录弹窗 */
  function handleCloseDialog() {
    dialog.visible = false;

    // 关键修复：在关闭弹窗时重置加载状态
    loading.value = false;
    // 延迟重置表单（等待动画完成）
    setTimeout(() => {
    dataFormRef.value.resetFields();
    dataFormRef.value.clearValidate();

    // 清除编辑ID
    editingTransactionId.value = undefined;
    }, 300);

  }

  /** 删除客户交易记录 */
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
                AioveuTransactionAPI.deleteByIds(ids)
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
    DictAPI.getDictItems('transaction_payment_method').then(response => {
      paymentMethodOptions.value = response
    })

    DictAPI.getDictItems('transaction_payment_status').then(response => {
      paymentStatusOptions.value = response
    })

    DictAPI.getDictItems('transaction_type').then(response => {
      transactionTypeOptions.value = response
    })

    DictAPI.getDictItems('transaction_status').then(response => {
      transactionStatusOptions.value = response
    })
  }

  function loadCustomerOptions() {
    AioveuCustomerAPI.getAllCustomerOptions().then(response => {
      customerOptions.value = response
    })
  }

  // 加载选项
  function loadContactOptions() {
    AioveuContactAPI.getAllContactOptions().then(response => {
      contactOptions.value = response
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
    loadOptions()
    loadCustomerOptions();
    loadContactOptions();
    loadEmployeeOptions();

  });
</script>
