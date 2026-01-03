<template>
  <div class="app-container">
    <div class="search-container">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true">
<!--                <el-form-item label="充值记录ID" prop="id">-->
<!--                      <el-input-->
<!--                          v-model="queryParams.id"-->
<!--                          placeholder="充值记录ID"-->
<!--                          clearable-->
<!--                          @keyup.enter="handleQuery()"-->
<!--                      />-->
<!--                </el-form-item>-->
                <el-form-item label="充值单号" prop="rechargeNo">
                      <el-input
                          v-model="queryParams.rechargeNo"
                          placeholder="充值单号"
                          clearable
                          @keyup.enter="handleQuery()"
                      />
                </el-form-item>
<!--                <el-form-item label="会员ID" prop="memberId">-->
<!--                      <el-input-->
<!--                          v-model="queryParams.memberId"-->
<!--                          placeholder="会员ID"-->
<!--                          clearable-->
<!--                          @keyup.enter="handleQuery()"-->
<!--                      />-->
<!--                </el-form-item>-->
                    <el-form-item label="会员卡号" prop="memberId">
                      <el-select
                        v-model="queryParams.memberId"
                        placeholder="请选择会员卡号"
                        clearable
                        filterable
                        @keyup.enter="handleQuery()"
                      >
                        <el-option
                          v-for="memberOption in aioveuMemberOption"
                          :key="memberOption.memberId"
                          :label="memberOption.memberNo"
                          :value="memberOption.memberId"
                        />
                      </el-select>
                    </el-form-item>


<!--                <el-form-item label="支付方式" prop="paymentType">-->
<!--                      <el-input-->
<!--                          v-model="queryParams.paymentType"-->
<!--                          placeholder="支付方式"-->
<!--                          clearable-->
<!--                          @keyup.enter="handleQuery()"-->
<!--                      />-->
<!--                </el-form-item>-->

                    <el-form-item label="支付方式" prop="paymentType">
                      <el-select
                        v-model="queryParams.paymentType"
                        placeholder="支付方式"
                        clearable
                        filterable
                        @keyup.enter="handleQuery()"
                      >
                        <el-option
                          v-for="item in member_recharge_record_payment_type_Options"
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
        <!-- 充值会员按钮 -->
        <el-button
          v-hasPerm="['aioveuMemberRechargeRecord:aioveu-member-recharge-record:recharge']"
          type="primary"
          @click="handleOpenRechargeDialog()"
        >
          <template #icon><Plus /></template>
          充值会员
        </el-button>
        <!-- 新增记录按钮 -->
        <el-button
            v-hasPerm="['aioveuMemberRechargeRecord:aioveu-member-recharge-record:add']"
            type="success"
            @click="handleOpenDialog()"
        >
          <template #icon><Plus /></template>
          新增记录
        </el-button>
        <!-- 删除按钮 -->
        <el-button
            v-hasPerm="['aioveuMemberRechargeRecord:aioveu-member-recharge-record:delete']"
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
<!--                        label="充值记录ID"-->
<!--                        prop="id"-->
<!--                        min-width="150"-->
<!--                        align="center"-->
<!--                    />-->
                    <el-table-column
                        key="rechargeNo"
                        label="充值单号"
                        prop="rechargeNo"
                        min-width="150"
                        align="center"
                    />
<!--                    <el-table-column-->
<!--                        key="memberId"-->
<!--                        label="会员ID"-->
<!--                        prop="memberId"-->
<!--                        min-width="150"-->
<!--                        align="center"-->
<!--                    />-->

                    <el-table-column
                      key="memberNo"
                      label="会员卡号"
                      prop="memberNo"
                      min-width="150"
                      align="center"
                    />

                    <el-table-column
                      key="name"
                      label="会员姓名"
                      prop="name"
                      min-width="150"
                      align="center"
                    />
                    <el-table-column
                        key="amount"
                        label="充值金额"
                        prop="amount"
                        min-width="150"
                        align="center"
                    />
                    <el-table-column
                        key="giftAmount"
                        label="赠送金额"
                        prop="giftAmount"
                        min-width="150"
                        align="center"
                    />
<!--                    <el-table-column-->
<!--                        key="paymentType"-->
<!--                        label="支付方式"-->
<!--                        prop="paymentType"-->
<!--                        min-width="150"-->
<!--                        align="center"-->
<!--                    />-->

                    <el-table-column
                      label="支付方式"
                      min-width="150"
                      align="center"
                    >
                      <template #default="scope">
                        <DictLabel v-model="scope.row.paymentType" code="member_recharge_record_payment_type" />
                      </template>
                    </el-table-column>

                    <el-table-column
                        key="rechargeTime"
                        label="充值时间"
                        prop="rechargeTime"
                        min-width="150"
                        align="center"
                    />
<!--                    <el-table-column-->
<!--                        key="operatorId"-->
<!--                        label="操作员"-->
<!--                        prop="operatorId"-->
<!--                        min-width="150"-->
<!--                        align="center"-->
<!--                    />-->

                    <el-table-column
                      key="operatorName"
                      label="操作员"
                      prop="operatorName"
                      min-width="150"
                      align="center"
                    />
<!--                    <el-table-column-->
<!--                        key="status"-->
<!--                        label="状态"-->
<!--                        prop="status"-->
<!--                        min-width="150"-->
<!--                        align="center"-->
<!--                    />-->

                    <el-table-column
                      label="状态"
                      min-width="150"
                      align="center"
                    >
                      <template #default="scope">
                        <DictLabel v-model="scope.row.status" code="member_recharge_record_status" />
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
                v-hasPerm="['aioveuMemberRechargeRecord:aioveu-member-recharge-record:edit']"
                type="primary"
                size="small"
                link
                @click="handleOpenDialog(scope.row.id)"
            >
              <template #icon><Edit /></template>
              编辑
            </el-button>
            <el-button
                v-hasPerm="['aioveuMemberRechargeRecord:aioveu-member-recharge-record:delete']"
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

    <!-- 会员充值记录表单弹窗 -->
    <el-dialog
        v-model="dialog.visible"
        :title="dialog.title"
        width="500px"
        @close="handleCloseDialog"
    >
      <el-form ref="dataFormRef" :model="formData" :rules="rules" label-width="100px">
                <!-- 后端自动生成字段 -->
<!--                <el-form-item label="充值单号" prop="rechargeNo">-->
<!--                      <el-input-->
<!--                          v-model="formData.rechargeNo"-->
<!--                          placeholder="充值单号"-->
<!--                      />-->
<!--                </el-form-item>-->
                    <!-- 编辑特有字段 -->
                    <template v-if="dialog.type === 'edit'">
                      <el-form-item label="会员卡号" prop="memberId">
                        <el-select
                          v-model="formData.memberId"
                          placeholder="请选择会员卡号"
                          clearable
                          filterable
                          disabled
                        >
                          <template #prefix>
                            <el-icon><lock /></el-icon>
                          </template>
                          <el-option
                            v-for="item in aioveuMemberOption"
                            :key="item .memberId"
                            :label="item .memberNo"
                            :value="item .memberId"
                          />
                        </el-select>
                      </el-form-item>
                    </template>

                    <!-- 新增操作字段 -->
                    <template v-else>
                      <el-form-item label="会员卡号" prop="memberId">
                        <el-select
                          v-model="formData.memberId"
                          placeholder="请选择会员卡号"
                          clearable
                          filterable
                        >
                          <el-option
                            v-for="item in aioveuMemberOption"
                            :key="item .memberId"
                            :label="item .memberNo"
                            :value="item .memberId"
                          />
                        </el-select>
                      </el-form-item>

                    </template>

                <!-- 充值操作特有字段 -->
                <template v-if="dialog.type === 'recharge'">
                  <el-form-item label="充值金额" prop="amount">
                    <el-input-number v-model="formData.amount" :min="0" />
                  </el-form-item>

                  <el-form-item label="赠送金额" prop="giftAmount">
                    <el-input
                      v-model="formData.giftAmount"
                      placeholder="赠送金额"
                    />
                  </el-form-item>
                </template>

                <!-- 新增/编辑操作字段 -->
                <template v-else>

                        <el-form-item label="充值金额" prop="amount">
                              <el-input
                                  v-model="formData.amount"
                                  placeholder="充值金额"
                              />
                        </el-form-item>

                        <el-form-item label="赠送金额" prop="giftAmount">
                              <el-input
                                  v-model="formData.giftAmount"
                                  placeholder="赠送金额"
                              />
                        </el-form-item>
                </template>

        <!--                <el-form-item label="支付方式" prop="paymentType">-->
        <!--                      <el-input-->
        <!--                          v-model="formData.paymentType"-->
        <!--                          placeholder="支付方式"-->
        <!--                      />-->
        <!--                </el-form-item>-->

                <el-form-item label="支付方式" prop="paymentType">
                  <el-select
                    v-model="formData.paymentType"
                    placeholder="支付方式"
                    clearable
                  >
                    <el-option
                      v-for="item in member_recharge_record_payment_type_Options"
                      :key="Number(item.value)"
                      :label="item.label"
                      :value="Number(item.value)"
                    />
                  </el-select>
                </el-form-item>

                <el-form-item label="充值时间" prop="rechargeTime">
                  <el-date-picker
                    v-model="formData.rechargeTime"
                    type="datetime"
                    placeholder="充值时间"
                    value-format="YYYY-MM-DD HH:mm:ss"
                  />
                </el-form-item>

<!--                <el-form-item label="操作员ID" prop="operatorId">-->
<!--                  <el-input-->
<!--                    v-model="formData.operatorId"-->
<!--                    placeholder="操作员ID"-->
<!--                  />-->
<!--                </el-form-item>-->

                    <el-form-item label="操作员" prop="operatorId">
                      <el-select
                        v-model="formData.operatorId"
                        placeholder="操作员"
                        clearable
                        filterable
                      >
                        <el-option
                          v-for="item in employeeOption"
                          :key="item.employeeId"
                          :label="item.employeeName"
                          :value="item.employeeId"
                        />
                      </el-select>
                    </el-form-item>


                <!--                <el-form-item label="状态" prop="status">-->
                <!--                      <el-input-->
                <!--                          v-model="formData.status"-->
                <!--                          placeholder="状态"-->
                <!--                      />-->
                <!--                </el-form-item>-->

                <el-form-item label="状态" prop="status">
                  <el-select
                    v-model="formData.status"
                    placeholder="状态"
                    clearable
                  >
                    <el-option
                      v-for="item in member_recharge_record_status_Options"
                      :key="Number(item.value)"
                      :label="item.label"
                      :value="Number(item.value)"
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
    name: "AioveuMemberRechargeRecord",
    inheritAttrs: false,
  });

  import AioveuMemberRechargeRecordAPI, { AioveuMemberRechargeRecordPageVO, AioveuMemberRechargeRecordForm, AioveuMemberRechargeRecordPageQuery } from "@/api/aioveuMemberRechargeRecord/aioveu-member-recharge-record";
  import AioveuMemberAPI, { AioveuMemberOptionVO } from "@/api/aioveuMember/aioveu-member";
  // 导入字典值
  import DictAPI,{ DictItemOption } from '@/api/system/dict.api'
  import AioveuEmployeeAPI, {EmployeeOptionVO} from "@/api/aioveuEmployee/aioveu-employee";
  // 新增：选项
  const aioveuMemberOption = ref<AioveuMemberOptionVO[]>([]);
  // 状态选项
  const member_recharge_record_payment_type_Options = ref<DictItemOption[]>([])

  const member_recharge_record_status_Options = ref<DictItemOption[]>([])
  const employeeOption = ref<EmployeeOptionVO[]>([]);
  // 状态字典
  function load_member_recharge_record_payment_type_Options() {
    DictAPI.getDictItems('member_recharge_record_payment_type').then(response => {
      member_recharge_record_payment_type_Options.value = response
    })
  }

  function load_member_recharge_record_status_Options() {
    DictAPI.getDictItems('member_recharge_record_status').then(response => {
      member_recharge_record_status_Options.value = response
    })
    AioveuEmployeeAPI.getAllEmployeeOptions().then(response => {
      employeeOption.value = response
    })
  }

  const queryFormRef = ref();
  const dataFormRef = ref();

  const loading = ref(false);
  const removeIds = ref<number[]>([]);
  const total = ref(0);

  const queryParams = reactive<AioveuMemberRechargeRecordPageQuery>({
    pageNum: 1,
    pageSize: 10,
  });

  // 会员充值记录表格数据
  const pageData = ref<AioveuMemberRechargeRecordPageVO[]>([]);

  // 弹窗
  const dialog = reactive({
    title: "",
    type: " ",// 'recharge', 'add', 'edit'
    visible: false,
  });

  // 会员充值记录表单数据
  const formData = reactive<AioveuMemberRechargeRecordForm>({});

  // 会员充值记录表单校验规则
  const rules = reactive({
                      // rechargeNo: [{ required: true, message: "请输入充值单号", trigger: "blur" }],
                      memberId: [{ required: true, message: "请输入会员ID", trigger: "blur" }],
                      amount: [{ required: true, message: "请输入充值金额", trigger: "blur" }],
                      giftAmount: [{ required: true, message: "请输入赠送金额", trigger: "blur" }],
                      paymentType: [{ required: true, message: "请输入支付方式 ", trigger: "blur" }],
                      rechargeTime: [{ required: true, message: "请输入充值时间", trigger: "blur" }],
                      status: [{ required: true, message: "请输入状态", trigger: "blur" }],
  });

  /** 查询会员充值记录 */
  function handleQuery() {
    loading.value = true;
          AioveuMemberRechargeRecordAPI.getPage(queryParams)
        .then((data) => {
          pageData.value = data.list;
          total.value = data.total;
        })
        .finally(() => {
          loading.value = false;
        });
  }

  /** 重置会员充值记录查询 */
  function handleResetQuery() {
    queryFormRef.value!.resetFields();
    queryParams.pageNum = 1;
    handleQuery();
  }

  /** 行复选框选中记录选中ID集合 */
  function handleSelectionChange(selection: any) {
    removeIds.value = selection.map((item: any) => item.id);
  }

  // 打开充值会员弹窗
  function handleOpenRechargeDialog() {
    console.log('打开充值会员弹窗');
    dialog.title = "会员充值";
    dialog.type = 'recharge'; // 标记为充值操作
    dialog.visible = true;
  }

  /** 打开会员充值记录弹窗 */
  function handleOpenDialog(id?: number) {
    console.log('打开弹窗', id ? '编辑' : '新增');
    if (id) {
      dialog.title = "修改会员充值记录";
      dialog.type = 'edit'; // 标记为编辑操作
            AioveuMemberRechargeRecordAPI.getFormData(id).then((data) => {
        Object.assign(formData, data);
              dialog.visible = true;
      });
    } else {
      dialog.title = "新增会员充值记录";
      dialog.type = 'add'; // 标记为新增操作
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

  /** 提交会员充值记录表单 */
  function handleSubmit() {
    dataFormRef.value.validate((valid: any) => {
      if (valid) {
        loading.value = true;
        const id = formData.id;

        if (dialog.type === 'recharge') {
          // 执行充值操作
          AioveuMemberRechargeRecordAPI.saveAioveuMemberRechargeRecordandexecuteRecharge(formData)
            .then(() => {
              ElMessage.success("充值成功");
              handleCloseDialog();
              handleResetQuery();
            })
            .catch((error: any) => {
              ElMessage.error("充值失败: " + error.message);
            })
            .finally(() => {
              loading.value = false;
            });
        }else {

            if (id) {
              // 编辑记录
                    AioveuMemberRechargeRecordAPI.update(id, formData)
                  .then(() => {
                    ElMessage.success("修改成功");
                    handleCloseDialog();
                    handleResetQuery();
                  })
                  .finally(() => (loading.value = false));
            } else {
              // 新增记录
                    AioveuMemberRechargeRecordAPI.add(formData)
                  .then(() => {
                    ElMessage.success("新增成功");
                    handleCloseDialog();
                    handleResetQuery();
                  })
                  .finally(() => (loading.value = false));
            }
          }
      }

    });
  }

  /** 关闭会员充值记录弹窗 */
  function handleCloseDialog() {
    dialog.visible = false;
    // 关键修复：在关闭弹窗时重置加载状态
    loading.value = false;

    // 延迟重置表单（等待动画完成）
    setTimeout(() => {
      dataFormRef.value.resetFields();
      dataFormRef.value.clearValidate();//是 Element Plus 表单组件提供的一个方法，用于清除表单的验证状态
      //editingId.value = undefined;
      formData.id = undefined;
    }, 300);
  }

  /** 删除会员充值记录 */
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
                AioveuMemberRechargeRecordAPI.deleteByIds(ids)
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
  // 主要修改点：选项加载方法
  function loadAioveuMemberOptionVO() {
    AioveuMemberAPI.getAllMemberNoOptions().then(response => {
      aioveuMemberOption.value = response
    })
  }
  onMounted(() => {
    handleQuery();
    load_member_recharge_record_payment_type_Options()
    load_member_recharge_record_status_Options()
    //在 onMounted钩子中调用了 loadAioveuMemberOptionVO()函数,确保函数被正确使用
    loadAioveuMemberOptionVO();
  });
</script>
