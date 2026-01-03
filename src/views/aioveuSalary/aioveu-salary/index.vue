<template>
  <div class="app-container">
    <div class="search-container">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true">
                <el-form-item label="工资记录ID" prop="id">
                      <el-input
                          v-model="queryParams.id"
                          placeholder="工资记录ID"
                          clearable
                          @keyup.enter="handleQuery()"
                      />
                </el-form-item>
<!--                <el-form-item label="员工" prop="employeeName">-->
<!--                      <el-input-->
<!--                          v-model="queryParams.employeeName"-->
<!--                          placeholder="员工"-->
<!--                          clearable-->
<!--                          @keyup.enter="handleQuery()"-->
<!--                      />-->
<!--                </el-form-item>-->

                <el-form-item label="员工" prop="employeeName">
                  <el-select
                    v-model="queryParams.employeeName"
                    placeholder="员工"
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


                <el-form-item label="基本工资" prop="baseSalary">
                      <el-input
                          v-model="queryParams.baseSalary"
                          placeholder="基本工资"
                          clearable
                          @keyup.enter="handleQuery()"
                      />
                </el-form-item>
<!--                <el-form-item label="绩效奖金" prop="performanceBonus">-->
<!--                      <el-input-->
<!--                          v-model="queryParams.performanceBonus"-->
<!--                          placeholder="绩效奖金"-->
<!--                          clearable-->
<!--                          @keyup.enter="handleQuery()"-->
<!--                      />-->
<!--                </el-form-item>-->
<!--                <el-form-item label="加班补贴" prop="overtimePay">-->
<!--                      <el-input-->
<!--                          v-model="queryParams.overtimePay"-->
<!--                          placeholder="加班补贴"-->
<!--                          clearable-->
<!--                          @keyup.enter="handleQuery()"-->
<!--                      />-->
<!--                </el-form-item>-->
<!--                <el-form-item label="各类津贴" prop="allowances">-->
<!--                      <el-input-->
<!--                          v-model="queryParams.allowances"-->
<!--                          placeholder="各类津贴"-->
<!--                          clearable-->
<!--                          @keyup.enter="handleQuery()"-->
<!--                      />-->
<!--                </el-form-item>-->
<!--                <el-form-item label="社保扣除" prop="socialSecurity">-->
<!--                      <el-input-->
<!--                          v-model="queryParams.socialSecurity"-->
<!--                          placeholder="社保扣除"-->
<!--                          clearable-->
<!--                          @keyup.enter="handleQuery()"-->
<!--                      />-->
<!--                </el-form-item>-->
<!--                <el-form-item label="住房公积金" prop="housingFund">-->
<!--                      <el-input-->
<!--                          v-model="queryParams.housingFund"-->
<!--                          placeholder="住房公积金"-->
<!--                          clearable-->
<!--                          @keyup.enter="handleQuery()"-->
<!--                      />-->
<!--                </el-form-item>-->
<!--                <el-form-item label="个人所得税" prop="tax">-->
<!--                      <el-input-->
<!--                          v-model="queryParams.tax"-->
<!--                          placeholder="个人所得税"-->
<!--                          clearable-->
<!--                          @keyup.enter="handleQuery()"-->
<!--                      />-->
<!--                </el-form-item>-->
<!--                <el-form-item label="其他扣款" prop="otherDeductions">-->
<!--                      <el-input-->
<!--                          v-model="queryParams.otherDeductions"-->
<!--                          placeholder="其他扣款"-->
<!--                          clearable-->
<!--                          @keyup.enter="handleQuery()"-->
<!--                      />-->
<!--                </el-form-item>-->
                <el-form-item label="实发工资" prop="netSalary">
                      <el-input
                          v-model="queryParams.netSalary"
                          placeholder="实发工资"
                          clearable
                          @keyup.enter="handleQuery()"
                      />
                </el-form-item>
<!--                <el-form-item label="实际发放日期" prop="paymentDate">-->
<!--                      <el-date-picker-->
<!--                          class="!w-[240px]"-->
<!--                          v-model="queryParams.paymentDate"-->
<!--                          type="daterange"-->
<!--                          range-separator="~"-->
<!--                          start-placeholder="开始时间"-->
<!--                          end-placeholder="结束时间"-->
<!--                          value-format="YYYY-MM-DD"-->
<!--                      />-->
<!--                </el-form-item>-->
                <el-form-item label="发放状态" prop="paymentStatus">
                  <el-select
                    v-model="queryParams.paymentStatus"
                    placeholder="发放状态"
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
<!--                <el-form-item label="创建时间" prop="createTime">-->
<!--                      <el-date-picker-->
<!--                          class="!w-[240px]"-->
<!--                          v-model="queryParams.createTime"-->
<!--                          type="daterange"-->
<!--                          range-separator="~"-->
<!--                          start-placeholder="开始时间"-->
<!--                          end-placeholder="结束时间"-->
<!--                          value-format="YYYY-MM-DD"-->
<!--                      />-->
<!--                </el-form-item>-->
<!--                <el-form-item label="更新时间" prop="updateTime">-->
<!--                      <el-date-picker-->
<!--                          class="!w-[240px]"-->
<!--                          v-model="queryParams.updateTime"-->
<!--                          type="daterange"-->
<!--                          range-separator="~"-->
<!--                          start-placeholder="开始时间"-->
<!--                          end-placeholder="结束时间"-->
<!--                          value-format="YYYY-MM-DD"-->
<!--                      />-->
<!--                </el-form-item>-->
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
      <!-- ...顶部操作按钮区域保持不变... -->
      <div class="mb-10px">
        <el-button
            v-hasPerm="['aioveuSalary:aioveu-salary:add']"
            type="success"
            @click="handleOpenDialog()"
        >
          <template #icon><Plus /></template>
          新增
        </el-button>
        <el-button
            v-hasPerm="['aioveuSalary:aioveu-salary:delete']"
            type="danger"
            :disabled="removeIds.length === 0"
            @click="handleDelete()"
        >
          <template #icon><Delete /></template>
          删除
        </el-button>


      </div>

      <!-- 优化表格 - 关键修改 -->
      <el-table
          ref="dataTableRef"
          v-loading="loading"
          :data="pageData"
          highlight-current-row
          border
          @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />

        <!-- 列设置工具栏 -->
                    <el-table-column
                        key="id"
                        label="工资记录ID"
                        prop="id"
                        min-width="150"
                        align="center"
                    />
                    <el-table-column
                        key="employeeName"
                        label="员工"
                        prop="employeeName"
                        min-width="150"
                        align="center"
                        fixed="left"
                    />
        <!-- 时间相关列 -->
                    <el-table-column
                        key="salaryPeriod"
                        label="工资周期（月份）"
                        prop="salaryPeriod"
                        min-width="150"
                        align="center"
                    />


        <!-- 工资组成列 -->
                    <el-table-column
                        key="baseSalary"
                        label="基本工资"
                        prop="baseSalary"
                        min-width="150"
                        align="center"
                    />
                    <el-table-column
                        key="performanceBonus"
                        label="绩效奖金"
                        prop="performanceBonus"
                        min-width="150"
                        align="center"
                    />
                    <el-table-column
                        key="overtimePay"
                        label="加班补贴"
                        prop="overtimePay"
                        min-width="150"
                        align="center"
                    />
                    <el-table-column
                        key="allowances"
                        label="各类津贴"
                        prop="allowances"
                        min-width="150"
                        align="center"
                    />
                    <el-table-column
                        key="socialSecurity"
                        label="社保扣除"
                        prop="socialSecurity"
                        min-width="150"
                        align="center"
                    />
                    <el-table-column
                        key="housingFund"
                        label="住房公积金"
                        prop="housingFund"
                        min-width="150"
                        align="center"
                    />
                    <el-table-column
                        key="tax"
                        label="个人所得税"
                        prop="tax"
                        min-width="150"
                        align="center"
                    />
                    <el-table-column
                        key="otherDeductions"
                        label="其他扣款"
                        prop="otherDeductions"
                        min-width="150"
                        align="center"
                    />
                    <el-table-column
                        key="netSalary"
                        label="实发工资"
                        prop="netSalary"
                        min-width="150"
                        align="center"
                    />
                    <el-table-column
                        key="paymentDate"
                        label="实际发放日期"
                        prop="paymentDate"
                        min-width="150"
                        align="center"
                    />
        <!-- 状态列 -->
                    <el-table-column
                      label="发放状态"
                      min-width="150"
                      align="center"
                    >
                      <template #default="scope">
                        <DictLabel v-model="scope.row.paymentStatus" code="salary_payment_status" />
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



        <!-- 操作列 -->
        <el-table-column fixed="right" label="操作" width="220">
          <template #default="scope">
            <el-button
                v-hasPerm="['aioveuSalary:aioveu-salary:edit']"
                type="primary"
                size="small"
                link
                @click="handleOpenDialog(scope.row.id)"
            >
              <template #icon><Edit /></template>
              编辑
            </el-button>
            <el-button
                v-hasPerm="['aioveuSalary:aioveu-salary:delete']"
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


      <!-- 分页组件保持不变... -->
      <pagination
          v-if="total > 0"
          v-model:total="total"
          v-model:page="queryParams.pageNum"
          v-model:limit="queryParams.pageSize"
          @pagination="handleQuery()"
      />
    </el-card>

    <!-- 员工工资明细表单弹窗 -->
    <!-- 详细信息的弹窗 - 保持原有完整表单 -->
    <el-dialog
        v-model="dialog.visible"
        :title="dialog.title"
        width="500px"
        @close="handleCloseDialog"
    >
      <el-form ref="dataFormRef" :model="formData" :rules="rules" label-width="100px">
<!--                <el-form-item label="员工" prop="employeeName">-->
<!--                      <el-input-->
<!--                          v-model="formData.employeeName"-->
<!--                          placeholder="员工"-->
<!--                      />-->
<!--                </el-form-item>-->

                <el-form-item label="员工" prop="employeeName">
                  <el-select
                    v-model="formData.employeeName"
                    placeholder="员工"
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

                <el-form-item label="工资周期" prop="salaryPeriod">
                      <el-date-picker
                          class="!w-[240px]"
                          v-model="formData.salaryPeriod"
                          type="date"
                          placeholder="工资周期"
                          value-format="YYYY-MM-DD"
                      />
                </el-form-item>

                <el-form-item label="基本工资" prop="baseSalary">
                      <el-input
                          v-model="formData.baseSalary"
                          placeholder="基本工资"
                      />
                </el-form-item>

                <el-form-item label="绩效奖金" prop="performanceBonus">
                      <el-input
                          v-model="formData.performanceBonus"
                          placeholder="绩效奖金"
                      />
                </el-form-item>

                <el-form-item label="加班补贴" prop="overtimePay">
                      <el-input
                          v-model="formData.overtimePay"
                          placeholder="加班补贴"
                      />
                </el-form-item>

                <el-form-item label="各类津贴" prop="allowances">
                      <el-input
                          v-model="formData.allowances"
                          placeholder="各类津贴"
                      />
                </el-form-item>

                <el-form-item label="社保扣除" prop="socialSecurity">
                      <el-input
                          v-model="formData.socialSecurity"
                          placeholder="社保扣除"
                      />
                </el-form-item>

                <el-form-item label="住房公积金" prop="housingFund">
                      <el-input
                          v-model="formData.housingFund"
                          placeholder="住房公积金"
                      />
                </el-form-item>

                <el-form-item label="个人所得税" prop="tax">
                      <el-input
                          v-model="formData.tax"
                          placeholder="个人所得税"
                      />
                </el-form-item>

                <el-form-item label="其他扣款" prop="otherDeductions">
                      <el-input
                          v-model="formData.otherDeductions"
                          placeholder="其他扣款"
                      />
                </el-form-item>

                <el-form-item label="实发工资" prop="netSalary">
                      <el-input
                          v-model="formData.netSalary"
                          placeholder="实发工资"
                      />
                </el-form-item>

                <el-form-item label="实际发放日期" prop="paymentDate">
                      <el-date-picker
                          class="!w-[240px]"
                          v-model="formData.paymentDate"
                          type="date"
                          placeholder="实际发放日期"
                          value-format="YYYY-MM-DD"
                      />
                </el-form-item>

                <el-form-item label="发放状态" prop="paymentStatus">
                  <el-select
                    v-model="formData.paymentStatus"
                    placeholder="发放状态"
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
    name: "AioveuSalary",
    inheritAttrs: false,
  });

  import AioveuSalaryAPI, { AioveuSalaryPageVO, AioveuSalaryForm, AioveuSalaryPageQuery } from "@/api/aioveuSalary/aioveu-salary";
  // 导入字典值
  import DictAPI,{ DictItemOption } from '@/api/system/dict.api'

  import AioveuEmployeeAPI, { EmployeeOptionVO } from "@/api/aioveuEmployee/aioveu-employee";

  const queryFormRef = ref();
  const dataFormRef = ref();

  const loading = ref(false);
  const removeIds = ref<number[]>([]);
  const total = ref(0);

  const queryParams = reactive<AioveuSalaryPageQuery>({
    pageNum: 1,
    pageSize: 10,
  });

  // 员工工资明细表格数据
  const pageData = ref<AioveuSalaryPageVO[]>([]);

  // 状态选项
  const paymentStatusOptions = ref<DictItemOption[]>([])

  const employeeOptions = ref<EmployeeOptionVO[]>([]);


  // 弹窗
  const dialog = reactive({
    title: "",
    visible: false,
  });

  // 员工工资明细表单数据
  const formData = reactive<AioveuSalaryForm>({});

  // 员工工资明细表单校验规则
  const rules = reactive({
                      employeeName: [{ required: true, message: "请输入员工", trigger: "blur" }],
                      salaryPeriod: [{ required: true, message: "请输入工资周期（月份）", trigger: "blur" }],
                      baseSalary: [{ required: true, message: "请输入基本工资", trigger: "blur" }],
                      netSalary: [{ required: true, message: "请输入实发工资", trigger: "blur" }],
    paymentStatus: [{ required: true, message: "请选择发放状态", trigger: "blur" }]
  });

  /** 查询员工工资明细 */
  function handleQuery() {
    loading.value = true;
          AioveuSalaryAPI.getPage(queryParams)
        .then((data) => {
          pageData.value = data.list;
          total.value = data.total;
        })
        .finally(() => {
          loading.value = false;
        });
  }

  /** 重置员工工资明细查询 */
  function handleResetQuery() {
    queryFormRef.value!.resetFields();
    queryParams.pageNum = 1;
    handleQuery();
  }

  /** 行复选框选中记录选中ID集合 */
  function handleSelectionChange(selection: AioveuSalaryPageVO[]) {
    removeIds.value = selection
      .map(item => item.id)
      .filter((id): id is number => id !== undefined && id !== null) as number[];
  }

  // 在组件中添加一个变量存储当前编辑的ID
  const editingSalaryId = ref<number | undefined>(undefined);

  /** 打开员工工资明细弹窗 */
  function handleOpenDialog(id?: number) {

    editingSalaryId.value = id; // 保存ID

    if (id) {
      dialog.title = "修改员工工资明细";
            AioveuSalaryAPI.getFormData(id).then((data) => {
        Object.assign(formData, data);
              dialog.visible = true;
      });
    } else {
      dialog.title = "新增员工工资明细";
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

  /** 提交员工工资明细表单 */
  function handleSubmit() {
    dataFormRef.value.validate((valid: any) => {
      if (valid) {
        loading.value = true;
        const id = editingSalaryId.value; // 使用存储的ID
        if (id) {
                AioveuSalaryAPI.update(id, formData)
              .then(() => {
                ElMessage.success("修改成功");
                handleCloseDialog();
                handleResetQuery();
              })
              .finally(() => (loading.value = false));
        } else {
                AioveuSalaryAPI.add(formData)
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

  /** 关闭员工工资明细弹窗 */
  function handleCloseDialog() {
    dialog.visible = false;
    // 关键修复：在关闭弹窗时重置加载状态
    loading.value = false;

    // 延迟重置表单（等待动画完成）
    setTimeout(() => {
    dataFormRef.value.resetFields();
    dataFormRef.value.clearValidate();
    editingSalaryId.value = undefined;
    }, 300);

  }

  /** 删除员工工资明细 */
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
                AioveuSalaryAPI.deleteByIds(ids)
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
  function loadPaymentStatusOptions() {
    DictAPI.getDictItems('salary_payment_status').then(response => {
      paymentStatusOptions.value = response
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
    loadPaymentStatusOptions();
    loadEmployeeOptions();

  });
</script>
