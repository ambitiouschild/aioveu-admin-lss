<template>
  <div class="app-container">
    <div class="search-container">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true">
<!--                <el-form-item label="账户ID" prop="id">-->
<!--                      <el-input-->
<!--                          v-model="queryParams.id"-->
<!--                          placeholder="账户ID"-->
<!--                          clearable-->
<!--                          @keyup.enter="handleQuery()"-->
<!--                      />-->
<!--                </el-form-item>-->
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
                  >
                    <el-option
                      v-for="memberOption in aioveuMemberOption"
                      :key="memberOption.memberId"
                      :label="memberOption.memberNo"
                      :value="memberOption.memberId"
                    />
                  </el-select>
                </el-form-item>
<!--                <el-form-item label="账户状态" prop="status">-->
<!--                      <el-input-->
<!--                          v-model="queryParams.status"-->
<!--                          placeholder="账户状态"-->
<!--                          clearable-->
<!--                          @keyup.enter="handleQuery()"-->
<!--                      />-->
<!--                </el-form-item>-->
                    <el-form-item label="账户状态" prop="status">
                      <el-select
                        v-model="queryParams.status"
                        placeholder="账户状态"
                        clearable
                        filterable
                        @keyup.enter="handleQuery()"
                      >
                        <el-option
                          v-for="item in member_account_status_Options"
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
            v-hasPerm="['aioveuMemberAccount:aioveu-member-account:add']"
            type="success"
            @click="handleOpenDialog()"
        >
          <template #icon><Plus /></template>
          新增
        </el-button>
        <el-button
            v-hasPerm="['aioveuMemberAccount:aioveu-member-account:delete']"
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
<!--                        label="账户ID"-->
<!--                        prop="id"-->
<!--                        min-width="150"-->
<!--                        align="center"-->
<!--                    />-->
<!--                    <el-table-column-->
<!--                        key="memberId"-->
<!--                        label="会员ID"-->
<!--                        prop="memberId"-->
<!--                        min-width="150"-->
<!--                        align="center"-->
<!--                    />-->

                    <!--        新增-->
                    <el-table-column
                      key="memberNo"
                      label="会员卡号"
                      prop="memberNo"
                      min-width="150"
                      align="center"
                    />

                    <!--        新增-->
                    <el-table-column
                      key="name"
                      label="会员姓名"
                      prop="name"
                      min-width="150"
                      align="center"
                    />

                    <el-table-column
                        key="cashBalance"
                        label="现金余额"
                        prop="cashBalance"
                        min-width="150"
                        align="center"
                    />
                    <el-table-column
                        key="giftBalance"
                        label="赠送余额"
                        prop="giftBalance"
                        min-width="150"
                        align="center"
                    />
                    <el-table-column
                        key="totalBalance"
                        label="总余额"
                        prop="totalBalance"
                        min-width="150"
                        align="center"
                    />
                    <el-table-column
                        key="lastRechargeTime"
                        label="最后充值时间"
                        prop="lastRechargeTime"
                        min-width="150"
                        align="center"
                    />
<!--                    <el-table-column-->
<!--                        key="status"-->
<!--                        label="账户状态"-->
<!--                        prop="status"-->
<!--                        min-width="150"-->
<!--                        align="center"-->
<!--                    />-->

                    <el-table-column
                      label="账户状态"
                      min-width="150"
                      align="center"
                    >
                      <template #default="scope">
                        <DictLabel v-model="scope.row.status" code="member_account_status" />
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
        <el-table-column fixed="right" label="操作" width="220">
          <template #default="scope">
            <el-button
                v-hasPerm="['aioveuMemberAccount:aioveu-member-account:edit']"
                type="primary"
                size="small"
                link
                @click="handleOpenDialog(scope.row.id)"
            >
              <template #icon><Edit /></template>
              编辑
            </el-button>
            <el-button
                v-hasPerm="['aioveuMemberAccount:aioveu-member-account:delete']"
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

    <!-- 会员充值账户表单弹窗 -->
    <el-dialog
        v-model="dialog.visible"
        :title="dialog.title"
        width="500px"
        @close="handleCloseDialog"
    >
      <el-form ref="dataFormRef" :model="formData" :rules="rules" label-width="100px">
<!--                <el-form-item label="会员ID" prop="memberId">-->
<!--                      <el-input-->
<!--                          v-model="formData.memberId"-->
<!--                          placeholder="会员ID"-->
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

                <el-form-item label="现金余额" prop="cashBalance">
                      <el-input
                          v-model="formData.cashBalance"
                          placeholder="现金余额"
                      />
                </el-form-item>

                <el-form-item label="赠送余额" prop="giftBalance">
                      <el-input
                          v-model="formData.giftBalance"
                          placeholder="赠送余额"
                      />
                </el-form-item>

<!--                <el-form-item label="总余额" prop="totalBalance">-->
<!--                      <el-input-->
<!--                          v-model="formData.totalBalance"-->
<!--                          placeholder="总余额"-->
<!--                      />-->
<!--                </el-form-item>-->

                <el-form-item label="总余额" prop="totalBalance">
                  <el-input
                    v-model="formData.totalBalance"
                    placeholder="总余额"
                    disabled
                  >
                    <template #prefix>
                      <el-icon><lock /></el-icon>
                    </template>
                  </el-input>
                </el-form-item>

                <el-form-item label="最后充值时间" prop="lastRechargeTime">
                      <el-date-picker
                          v-model="formData.lastRechargeTime"
                          type="datetime"
                          placeholder="最后充值时间"
                          value-format="YYYY-MM-DD HH:mm:ss"
                      />
                </el-form-item>

<!--                <el-form-item label="账户状态" prop="status">-->
<!--                      <el-input-->
<!--                          v-model="formData.status"-->
<!--                          placeholder="账户状态"-->
<!--                      />-->
<!--                </el-form-item>-->

                <el-form-item label="账户状态" prop="status">
                  <el-select
                    v-model="formData.status"
                    placeholder="账户状态"
                    clearable
                  >
                    <el-option
                      v-for="item in member_account_status_Options"
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
    name: "AioveuMemberAccount",
    inheritAttrs: false,
  });

  import AioveuMemberAccountAPI, { AioveuMemberAccountPageVO, AioveuMemberAccountForm, AioveuMemberAccountPageQuery } from "@/api/aioveuMemberAccount/aioveu-member-account";

  import AioveuMemberAPI, { AioveuMemberOptionVO } from "@/api/aioveuMember/aioveu-member";

  // 导入字典值
  import DictAPI,{ DictItemOption } from '@/api/system/dict.api'

  // 新增：选项
  const aioveuMemberOption = ref<AioveuMemberOptionVO[]>([]);

  // 状态选项
  const member_account_status_Options = ref<DictItemOption[]>([])

  // 状态字典
  function load_member_account_status_Options() {
    DictAPI.getDictItems('member_account_status').then(response => {
      member_account_status_Options.value = response
    })
  }

  const queryFormRef = ref();
  const dataFormRef = ref();

  const loading = ref(false);
  const removeIds = ref<number[]>([]);
  const total = ref(0);

  const queryParams = reactive<AioveuMemberAccountPageQuery>({
    pageNum: 1,
    pageSize: 10,
  });

  // 会员充值账户表格数据
  const pageData = ref<AioveuMemberAccountPageVO[]>([]);

  // 弹窗
  const dialog = reactive({
    title: "",
    visible: false,
    type: " ",// 'recharge', 'add', 'edit'
  });

  // 会员充值账户表单数据
  const formData = reactive<AioveuMemberAccountForm>({});

  // 会员充值账户表单校验规则
  const rules = reactive({
                      memberId: [{ required: true, message: "请输入会员ID", trigger: "blur" }],
                      cashBalance: [{ required: true, message: "请输入现金余额", trigger: "blur" }],
                      giftBalance: [{ required: true, message: "请输入赠送余额", trigger: "blur" }],
                      status: [{ required: true, message: "请输入账户状态(0-冻结 1-正常)", trigger: "blur" }],
  });

  /** 查询会员充值账户 */
  function handleQuery() {
    loading.value = true;
          AioveuMemberAccountAPI.getPage(queryParams)
        .then((data) => {
          pageData.value = data.list;
          total.value = data.total;
        })
        .finally(() => {
          loading.value = false;
        });
  }

  /** 重置会员充值账户查询 */
  function handleResetQuery() {
    queryFormRef.value!.resetFields();
    queryParams.pageNum = 1;
    handleQuery();
  }

  /** 行复选框选中记录选中ID集合 */
  function handleSelectionChange(selection: any) {
    removeIds.value = selection.map((item: any) => item.id);
  }

  /** 打开会员充值账户弹窗 */
  function handleOpenDialog(id?: number) {
    // dialog.visible = true;
    if (id) {
      dialog.title = "修改会员充值账户";
      dialog.type = 'edit'; // 标记为编辑操作
            AioveuMemberAccountAPI.getFormData(id).then((data) => {
        Object.assign(formData, data);
              //先准备数据，再显示弹窗
              dialog.visible = true;
      });
    } else {
      dialog.title = "新增会员充值账户";
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

  /** 提交会员充值账户表单 */
  function handleSubmit() {
    dataFormRef.value.validate((valid: any) => {
      if (valid) {
        loading.value = true;
        const id = formData.id;
        if (id) {
                AioveuMemberAccountAPI.update(id, formData)
              .then(() => {
                ElMessage.success("修改成功");
                handleCloseDialog();
                handleResetQuery();
              })
              .finally(() => (loading.value = false));
        } else {
                AioveuMemberAccountAPI.add(formData)
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

  /** 关闭会员充值账户弹窗 */
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

  /** 删除会员充值账户 */
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
                AioveuMemberAccountAPI.deleteByIds(ids)
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
    load_member_account_status_Options()
    //在 onMounted钩子中调用了 loadAioveuMemberOptionVO()函数,确保函数被正确使用
    loadAioveuMemberOptionVO();
  });
</script>
