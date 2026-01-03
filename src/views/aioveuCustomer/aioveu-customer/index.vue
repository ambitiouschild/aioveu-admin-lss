<template>
  <div class="app-container">
    <div class="search-container">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true">
<!--                <el-form-item label="客户ID" prop="id">-->
<!--                      <el-input-->
<!--                          v-model="queryParams.id"-->
<!--                          placeholder="客户ID"-->
<!--                          clearable-->
<!--                          @keyup.enter="handleQuery()"-->
<!--                      />-->
<!--                </el-form-item>-->
                <el-form-item label="客户编号" prop="customerNo">
                      <el-input
                          v-model="queryParams.customerNo"
                          placeholder="客户编号"
                          clearable
                          @keyup.enter="handleQuery()"
                      />
                </el-form-item>
<!--                <el-form-item label="客户名称" prop="name">-->
<!--                      <el-input-->
<!--                          v-model="queryParams.name"-->
<!--                          placeholder="客户名称"-->
<!--                          clearable-->
<!--                          @keyup.enter="handleQuery()"-->
<!--                      />-->
<!--                </el-form-item>-->

                <el-form-item label="客户名称" prop="name">
                  <el-select
                    v-model="queryParams.name"
                    placeholder="客户名称"
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


                <el-form-item label="客户类型" prop="type">
                  <el-select
                    v-model="queryParams.type"
                    placeholder="客户类型"
                    clearable
                    filterable
                    @keyup.enter="handleQuery()"
                  >
                    <el-option
                      v-for="item in typeOptions"
                      :key="Number(item.value)"
                      :label="item.label"
                      :value="Number(item.value)"
                    />
                  </el-select>
                </el-form-item>

                <el-form-item label="信用等级" prop="creditRating">
                  <el-select
                    v-model="queryParams.creditRating"
                    placeholder="信用等级"
                    clearable
                    filterable
                    @keyup.enter="handleQuery()"
                  >
                    <el-option
                      v-for="item in creditRatingOptions"
                      :key="Number(item.value)"
                      :label="item.label"
                      :value="Number(item.value)"
                    />
                  </el-select>
                </el-form-item>

                <el-form-item label="客户状态" prop="customerStatus">
                  <el-select
                    v-model="queryParams.customerStatus"
                    placeholder="客户状态"
                    clearable
                    filterable
                    @keyup.enter="handleQuery()"
                  >
                    <el-option
                      v-for="item in customerStatusOptions"
                      :key="Number(item.value)"
                      :label="item.label"
                      :value="Number(item.value)"
                    />
                  </el-select>
                </el-form-item>

                <el-form-item label="所在城市" prop="city">
                      <el-input
                          v-model="queryParams.city"
                          placeholder="所在城市"
                          clearable
                          @keyup.enter="handleQuery()"
                      />
                </el-form-item>
                <el-form-item label="所在省份" prop="province">
                      <el-input
                          v-model="queryParams.province"
                          placeholder="所在省份"
                          clearable
                          @keyup.enter="handleQuery()"
                      />
                </el-form-item>
                <el-form-item label="联系电话" prop="phone">
                      <el-input
                          v-model="queryParams.phone"
                          placeholder="联系电话"
                          clearable
                          @keyup.enter="handleQuery()"
                      />
                </el-form-item>

                <el-form-item label="客户来源" prop="source">
                  <el-select
                    v-model="queryParams.source"
                    placeholder="客户来源"
                    clearable
                    filterable
                    @keyup.enter="handleQuery()"
                  >
                    <el-option
                      v-for="item in sourceOptions"
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
            v-hasPerm="['aioveuCustomer:aioveu-customer:add']"
            type="success"
            @click="handleOpenDialog()"
        >
          <template #icon><Plus /></template>
          新增
        </el-button>
        <el-button
            v-hasPerm="['aioveuCustomer:aioveu-customer:delete']"
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
<!--                        label="客户ID"-->
<!--                        prop="id"-->
<!--                        min-width="150"-->
<!--                        align="center"-->
<!--                    />-->
                    <el-table-column
                        key="customerNo"
                        label="客户编号"
                        prop="customerNo"
                        min-width="150"
                        align="center"
                    />
                    <el-table-column
                        key="name"
                        label="客户名称"
                        prop="name"
                        min-width="150"
                        align="center"
                        fixed="left"
                    />
                    <el-table-column
                      label="客户类型"
                      min-width="150"
                      align="center"
                    >
                      <template #default="scope">
                        <DictLabel v-model="scope.row.type" code="customer_customer_type" />
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="信用等级"
                      min-width="150"
                      align="center"
                    >
                      <template #default="scope">
                        <DictLabel v-model="scope.row.creditRating" code="customer_credit_rating" />
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="客户状态"
                      min-width="150"
                      align="center"
                    >
                      <template #default="scope">
                        <DictLabel v-model="scope.row.customerStatus" code="customer_status" />
                      </template>
                    </el-table-column>
                    <el-table-column
                        key="address"
                        label="客户地址"
                        prop="address"
                        min-width="150"
                        align="center"
                    />
                    <el-table-column
                        key="city"
                        label="所在城市"
                        prop="city"
                        min-width="150"
                        align="center"
                    />
                    <el-table-column
                        key="province"
                        label="所在省份"
                        prop="province"
                        min-width="150"
                        align="center"
                    />
                    <el-table-column
                        key="country"
                        label="国家"
                        prop="country"
                        min-width="150"
                        align="center"
                    />
                    <el-table-column
                        key="postalCode"
                        label="邮政编码"
                        prop="postalCode"
                        min-width="150"
                        align="center"
                    />
                    <el-table-column
                        key="phone"
                        label="联系电话"
                        prop="phone"
                        min-width="150"
                        align="center"
                    />
                    <el-table-column
                        key="email"
                        label="电子邮箱"
                        prop="email"
                        min-width="150"
                        align="center"
                    />
                    <el-table-column
                        key="website"
                        label="网址"
                        prop="website"
                        min-width="150"
                        align="center"
                    />
                    <el-table-column
                        key="taxId"
                        label="税号"
                        prop="taxId"
                        min-width="150"
                        align="center"
                    />
                    <el-table-column
                        key="bankAccount"
                        label="银行账号"
                        prop="bankAccount"
                        min-width="150"
                        align="center"
                    />
                    <el-table-column
                        key="bankName"
                        label="开户行"
                        prop="bankName"
                        min-width="150"
                        align="center"
                    />
                    <el-table-column
                        key="annualRevenue"
                        label="年营业额"
                        prop="annualRevenue"
                        min-width="150"
                        align="center"
                    />
                    <el-table-column
                        key="employeeCount"
                        label="员工人数"
                        prop="employeeCount"
                        min-width="150"
                        align="center"
                    />
                    <el-table-column
                        key="establishedDate"
                        label="成立日期"
                        prop="establishedDate"
                        min-width="150"
                        align="center"
                    />
                    <el-table-column
                      label="客户来源"
                      min-width="150"
                      align="center"
                    >
                      <template #default="scope">
                        <DictLabel v-model="scope.row.source" code="customer_source" />
                      </template>
                    </el-table-column>
                    <el-table-column
                        key="salesRepName"
                        label="负责人"
                        prop="salesRepName"
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
                v-hasPerm="['aioveuCustomer:aioveu-customer:edit']"
                type="primary"
                size="small"
                link
                @click="handleOpenDialog(scope.row.id)"
            >
              <template #icon><Edit /></template>
              编辑
            </el-button>
            <el-button
                v-hasPerm="['aioveuCustomer:aioveu-customer:delete']"
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

    <!-- 客户信息表单弹窗 -->
    <el-dialog
        v-model="dialog.visible"
        :title="dialog.title"
        width="500px"
        @close="handleCloseDialog"
    >
      <el-form ref="dataFormRef" :model="formData" :rules="rules" label-width="100px">
                <el-form-item label="客户编号" prop="customerNo">
                      <el-input
                          v-model="formData.customerNo"
                          placeholder="客户编号"
                      />
                </el-form-item>

                <el-form-item label="客户名称" prop="name">
                      <el-input
                          v-model="formData.name"
                          placeholder="客户名称"
                      />
                </el-form-item>

                <el-form-item label="客户类型" prop="type">
                  <el-select
                    v-model="formData.type"
                    placeholder="客户类型"
                    clearable
                  >
                    <el-option
                      v-for="item in typeOptions"
                      :key="Number(item.value)"
                      :label="item.label"
                      :value="Number(item.value)"
                    />
                  </el-select>
                </el-form-item>

                <el-form-item label="信用等级" prop="creditRating">
                  <el-select
                    v-model="formData.creditRating"
                    placeholder="信用等级"
                    clearable
                  >
                    <el-option
                      v-for="item in creditRatingOptions"
                      :key="Number(item.value)"
                      :label="item.label"
                      :value="Number(item.value)"
                    />
                  </el-select>
                </el-form-item>

                <el-form-item label="客户状态" prop="customerStatus">
                  <el-select
                    v-model="formData.customerStatus"
                    placeholder="客户状态"
                    clearable
                  >
                    <el-option
                      v-for="item in customerStatusOptions"
                      :key="Number(item.value)"
                      :label="item.label"
                      :value="Number(item.value)"
                    />
                  </el-select>
                </el-form-item>

                <el-form-item label="客户地址" prop="address">
                      <el-input
                          v-model="formData.address"
                          placeholder="客户地址"
                      />
                </el-form-item>

                <el-form-item label="所在城市" prop="city">
                      <el-input
                          v-model="formData.city"
                          placeholder="所在城市"
                      />
                </el-form-item>

                <el-form-item label="所在省份" prop="province">
                      <el-input
                          v-model="formData.province"
                          placeholder="所在省份"
                      />
                </el-form-item>

                <el-form-item label="国家" prop="country">
                      <el-input
                          v-model="formData.country"
                          placeholder="国家"
                      />
                </el-form-item>

                <el-form-item label="邮政编码" prop="postalCode">
                      <el-input
                          v-model="formData.postalCode"
                          placeholder="邮政编码"
                      />
                </el-form-item>

                <el-form-item label="联系电话" prop="phone">
                      <el-input
                          v-model="formData.phone"
                          placeholder="联系电话"
                      />
                </el-form-item>

                <el-form-item label="电子邮箱" prop="email">
                      <el-input
                          v-model="formData.email"
                          placeholder="电子邮箱"
                      />
                </el-form-item>

                <el-form-item label="网址" prop="website">
                      <el-input
                          v-model="formData.website"
                          placeholder="网址"
                      />
                </el-form-item>

                <el-form-item label="税号" prop="taxId">
                      <el-input
                          v-model="formData.taxId"
                          placeholder="税号"
                      />
                </el-form-item>

                <el-form-item label="银行账号" prop="bankAccount">
                      <el-input
                          v-model="formData.bankAccount"
                          placeholder="银行账号"
                      />
                </el-form-item>

                <el-form-item label="开户行" prop="bankName">
                      <el-input
                          v-model="formData.bankName"
                          placeholder="开户行"
                      />
                </el-form-item>

                <el-form-item label="年营业额" prop="annualRevenue">
                      <el-input
                          v-model="formData.annualRevenue"
                          placeholder="年营业额"
                      />
                </el-form-item>

                <el-form-item label="员工人数" prop="employeeCount">
                      <el-input
                          v-model="formData.employeeCount"
                          placeholder="员工人数"
                      />
                </el-form-item>

                <el-form-item label="成立日期" prop="establishedDate">
                      <el-date-picker
                          class="!w-[240px]"
                          v-model="formData.establishedDate"
                          type="date"
                          placeholder="成立日期"
                          value-format="YYYY-MM-DD"
                      />
                </el-form-item>

                <el-form-item label="客户来源" prop="source">
                  <el-select
                    v-model="formData.source"
                    placeholder="客户来源"
                    clearable
                  >
                    <el-option
                      v-for="item in sourceOptions"
                      :key="Number(item.value)"
                      :label="item.label"
                      :value="Number(item.value)"
                    />
                  </el-select>
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
    name: "AioveuCustomer",
    inheritAttrs: false,
  });

  import AioveuCustomerAPI, { AioveuCustomerPageVO, AioveuCustomerForm, AioveuCustomerPageQuery ,CustomerOptionVO } from "@/api/aioveuCustomer/aioveu-customer";
  import AioveuEmployeeAPI, { EmployeeOptionVO } from "@/api/aioveuEmployee/aioveu-employee";
  // 导入字典值
  import DictAPI,{ DictItemOption } from '@/api/system/dict.api'
  const queryFormRef = ref();
  const dataFormRef = ref();

  const loading = ref(false);
  const removeIds = ref<number[]>([]);
  const total = ref(0);

  const queryParams = reactive<AioveuCustomerPageQuery>({
    pageNum: 1,
    pageSize: 10,
  });




  // 客户信息表格数据
  const pageData = ref<AioveuCustomerPageVO[]>([]);

  // 弹窗
  const dialog = reactive({
    title: "",
    visible: false,
  });

  // 选项
  const typeOptions = ref<DictItemOption[]>([])
  // 选项
  const creditRatingOptions = ref<DictItemOption[]>([])
  // 选项
  const customerStatusOptions = ref<DictItemOption[]>([])
  // 选项
  const sourceOptions = ref<DictItemOption[]>([])

  const customerOptions = ref<CustomerOptionVO[]>([]);
  const employeeOptions = ref<EmployeeOptionVO[]>([]);


  // 客户信息表单数据
  const formData = reactive<AioveuCustomerForm>({});

  // 客户信息表单校验规则
  const rules = reactive({
                      customerNo: [{ required: true, message: "请输入客户编号", trigger: "blur" }],
                      name: [{ required: true, message: "请输入客户名称", trigger: "blur" }],
                      type: [{ required: true, message: "请输入客户类型", trigger: "blur" }],
                      creditRating: [{ required: true, message: "请输入信用等级", trigger: "blur" }],
                      customerStatus: [{ required: true, message: "请输入客户状态", trigger: "blur" }],
  });

  /** 查询客户信息 */
  function handleQuery() {
    loading.value = true;
          AioveuCustomerAPI.getPage(queryParams)
        .then((data) => {
          pageData.value = data.list;
          total.value = data.total;
        })
        .finally(() => {
          loading.value = false;
        });
  }

  /** 重置客户信息查询 */
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
  const editingCustomerId = ref<number | undefined>(undefined);

  /** 打开客户信息弹窗 */
  function handleOpenDialog(id?: number) {


    editingCustomerId.value = id; // 保存ID

    if (id) {
      dialog.title = "修改客户信息";
            AioveuCustomerAPI.getFormData(id).then((data) => {
        Object.assign(formData, data);
              dialog.visible = true;
      });
    } else {
      dialog.title = "新增客户信息";
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

  /** 提交客户信息表单 */
  function handleSubmit() {
    dataFormRef.value.validate((valid: any) => {
      if (valid) {
        loading.value = true;
        const id = editingCustomerId.value; // 使用存储的ID
        if (id) {
                AioveuCustomerAPI.update(id, formData)
              .then(() => {
                ElMessage.success("修改成功");
                handleCloseDialog();
                handleResetQuery();
              })
              .finally(() => (loading.value = false));
        } else {
                AioveuCustomerAPI.add(formData)
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

  /** 关闭客户信息弹窗 */
  function handleCloseDialog() {
    dialog.visible = false;

    // 关键修复：在关闭弹窗时重置加载状态
    loading.value = false;
    // 延迟重置表单（等待动画完成）
    setTimeout(() => {
    dataFormRef.value.resetFields();
    dataFormRef.value.clearValidate();

    // 清除编辑ID
    editingCustomerId.value = undefined;
    }, 300);
  }

  /** 删除客户信息 */
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
                AioveuCustomerAPI.deleteByIds(ids)
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
    DictAPI.getDictItems('customer_customer_type').then(response => {
      typeOptions.value = response
    })

    DictAPI.getDictItems('customer_credit_rating').then(response => {
      creditRatingOptions.value = response
    })

    DictAPI.getDictItems('customer_status').then(response => {
      customerStatusOptions.value = response
    })

    DictAPI.getDictItems('customer_source').then(response => {
      sourceOptions.value = response
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

  onMounted(() => {
    handleQuery();
    loadOptions()
    loadCustomerOptions();
    loadEmployeeOptions();
  });
</script>
