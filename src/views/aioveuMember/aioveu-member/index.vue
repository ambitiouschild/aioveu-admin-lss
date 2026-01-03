<template>
  <div class="app-container">
    <div class="search-container">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true">
<!--                <el-form-item label="会员ID" prop="id">-->
<!--                      <el-input-->
<!--                          v-model="queryParams.id"-->
<!--                          placeholder="会员ID"-->
<!--                          clearable-->
<!--                          @keyup.enter="handleQuery()"-->
<!--                      />-->
<!--                </el-form-item>-->
                <el-form-item label="会员卡号" prop="memberNo">
                      <el-input
                          v-model="queryParams.memberNo"
                          placeholder="会员卡号"
                          clearable
                          @keyup.enter="handleQuery()"
                      />
                </el-form-item>
                <el-form-item label="会员姓名" prop="name">
                      <el-input
                          v-model="queryParams.name"
                          placeholder="会员姓名"
                          clearable
                          @keyup.enter="handleQuery()"
                      />
                </el-form-item>
                <el-form-item label="手机号" prop="phone">
                      <el-input
                          v-model="queryParams.phone"
                          placeholder="手机号"
                          clearable
                          @keyup.enter="handleQuery()"
                      />
                </el-form-item>
<!--                <el-form-item label="会员等级" prop="levelId">-->
<!--                      <el-input-->
<!--                          v-model="queryParams.levelId"-->
<!--                          placeholder="会员等级"-->
<!--                          clearable-->
<!--                          @keyup.enter="handleQuery()"-->
<!--                      />-->
<!--                </el-form-item>-->

                    <el-form-item label="会员等级" prop="levelId">
                      <el-select
                        v-model="queryParams.levelId"
                        placeholder="请选择会员等级"
                        clearable
                        filterable
                        @keyup.enter="handleQuery()"
                      >
                        <el-option
                          v-for="item in memberLevelOptions"
                          :key="item.id"
                          :label="item.levelName"
                          :value="item.id"
                        />
                      </el-select>
                    </el-form-item>

<!--                <el-form-item label="状态" prop="status">-->
<!--                      <el-input-->
<!--                          v-model="queryParams.status"-->
<!--                          placeholder="状态"-->
<!--                          clearable-->
<!--                          @keyup.enter="handleQuery()"-->
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
                          v-for="item in member_status_Options"
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
            v-hasPerm="['aioveuMember:aioveu-member:add']"
            type="success"
            @click="handleOpenDialog()"
        >
          <template #icon><Plus /></template>
          新增
        </el-button>
        <el-button
            v-hasPerm="['aioveuMember:aioveu-member:delete']"
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
<!--                        label="会员ID"-->
<!--                        prop="id"-->
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
                        key="phone"
                        label="手机号"
                        prop="phone"
                        min-width="150"
                        align="center"
                    />
                    <el-table-column
                        key="idCard"
                        label="身份证号"
                        prop="idCard"
                        min-width="150"
                        align="center"
                    />
<!--                    <el-table-column-->
<!--                        key="levelId"-->
<!--                        label="会员等级"-->
<!--                        prop="levelId"-->
<!--                        min-width="150"-->
<!--                        align="center"-->
<!--                    />-->

                    <el-table-column
                      key="levelName"
                      label="会员等级"
                      prop="levelName"
                      min-width="150"
                      align="center"
                    />

                    <el-table-column
                        key="joinDate"
                        label="入会时间"
                        prop="joinDate"
                        min-width="150"
                        align="center"
                    />
                    <el-table-column
                        key="totalConsumption"
                        label="累计消费金额"
                        prop="totalConsumption"
                        min-width="150"
                        align="center"
                    />
                    <el-table-column
                        key="lastVisit"
                        label="最后到店时间"
                        prop="lastVisit"
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
                        <DictLabel v-model="scope.row.status" code="member_status" />
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
                v-hasPerm="['aioveuMember:aioveu-member:edit']"
                type="primary"
                size="small"
                link
                @click="handleOpenDialog(scope.row.id)"
            >
              <template #icon><Edit /></template>
              编辑
            </el-button>
            <el-button
                v-hasPerm="['aioveuMember:aioveu-member:delete']"
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

    <!-- 会员信息管理表单弹窗 -->
    <el-dialog
        v-model="dialog.visible"
        :title="dialog.title"
        width="500px"
        @close="handleCloseDialog"
    >
      <el-form ref="dataFormRef" :model="formData" :rules="rules" label-width="100px">

<!--                <el-form-item label="会员ID" prop="id">-->
<!--                  <el-input-->
<!--                    v-model="formData.id"-->
<!--                    placeholder="会员ID"-->
<!--                    disabled-->
<!--                  >-->
<!--                    <template #prefix>-->
<!--                      <el-icon><lock /></el-icon>-->
<!--                    </template>-->
<!--                  </el-input>-->
<!--                </el-form-item>-->

<!--                <el-form-item label="会员卡号" prop="memberNo">-->
<!--                      <el-input-->
<!--                          v-model="formData.memberNo"-->
<!--                          placeholder="会员卡号"-->
<!--                      />-->
<!--                </el-form-item>-->


                <el-form-item label="会员姓名" prop="name">
                      <el-input
                          v-model="formData.name"
                          placeholder="会员姓名"
                      />
                </el-form-item>

                <el-form-item label="手机号" prop="phone">
                      <el-input
                          v-model="formData.phone"
                          placeholder="手机号"
                      />
                </el-form-item>

                <el-form-item label="身份证号" prop="idCard">
                      <el-input
                          v-model="formData.idCard"
                          placeholder="身份证号"
                      />
                </el-form-item>

<!--                <el-form-item label="会员等级" prop="levelId">-->
<!--                      <el-input-->
<!--                          v-model="formData.levelId"-->
<!--                          placeholder="会员等级"-->
<!--                      />-->
<!--                </el-form-item>-->

                    <el-form-item label="会员等级" prop="levelId">
                      <el-select
                        v-model="formData.levelId"
                        placeholder="请选择会员等级"
                        clearable
                        filterable
                      >
                        <el-option
                          v-for="item in memberLevelOptions"
                          :key="item .id"
                          :label="item .levelName"
                          :value="item .id"
                        />
                      </el-select>
                    </el-form-item>


<!--                <el-form-item label="会员等级" prop="levelName">-->
<!--                  <el-input-->
<!--                    v-model="formData.levelName"-->
<!--                    placeholder="会员等级"-->
<!--                  />-->
<!--                </el-form-item>-->

                <el-form-item label="入会时间" prop="joinDate">
                      <el-date-picker
                          v-model="formData.joinDate"
                          type="datetime"
                          placeholder="入会时间"
                          value-format="YYYY-MM-DD HH:mm:ss"
                      />
                </el-form-item>

                <el-form-item label="累计消费金额" prop="totalConsumption">
                      <el-input
                          v-model="formData.totalConsumption"
                          placeholder="累计消费金额"
                      />
                </el-form-item>

                <el-form-item label="最后到店时间" prop="lastVisit">
                      <el-date-picker
                          v-model="formData.lastVisit"
                          type="datetime"
                          placeholder="最后到店时间"
                          value-format="YYYY-MM-DD HH:mm:ss"
                      />
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
                          v-for="item in member_status_Options"
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
    name: "AioveuMember",
    inheritAttrs: false,
  });

  import AioveuMemberAPI, { AioveuMemberPageVO, AioveuMemberForm, AioveuMemberPageQuery } from "@/api/aioveuMember/aioveu-member";
  import AioveuMemberLevelAPI, {AioveuMemberLevelOptionsVO} from "@/api/aioveuMemberLevel/aioveu-member-level";
  // 导入字典值
  import DictAPI,{ DictItemOption } from '@/api/system/dict.api'

  // 状态选项
  const member_status_Options = ref<DictItemOption[]>([])
  const memberLevelOptions = ref<AioveuMemberLevelOptionsVO[]>([]);

  // 状态字典
  function load_member_status_Options() {
    DictAPI.getDictItems('member_status').then(response => {
      member_status_Options.value = response
    })

    AioveuMemberLevelAPI.getAllMemberLevelsOptions().then(response => {
      memberLevelOptions.value = response
    })

  }

  const queryFormRef = ref();
  const dataFormRef = ref();

  const loading = ref(false);
  const removeIds = ref<number[]>([]);
  const total = ref(0);

  const queryParams = reactive<AioveuMemberPageQuery>({
    pageNum: 1,
    pageSize: 10,
  });

  // 会员信息管理表格数据
  const pageData = ref<AioveuMemberPageVO[]>([]);

  // 弹窗
  const dialog = reactive({
    title: "",
    type: " ",// 'recharge', 'add', 'edit'
    visible: false,
  });

  // 会员信息管理表单数据
  const formData = reactive<AioveuMemberForm>({});

  // 会员信息管理表单校验规则
  const rules = reactive({
                      // memberNo: [{ required: true, message: "请输入会员卡号", trigger: "blur" }],
                      name: [{ required: true, message: "请输入会员姓名", trigger: "blur" }],
                      phone: [{ required: true, message: "请输入手机号", trigger: "blur" }],
                      levelId: [{ required: true, message: "请输入会员等级", trigger: "blur" }],
  });

  /** 查询会员信息管理 */
  function handleQuery() {
    loading.value = true;
          AioveuMemberAPI.getPage(queryParams)
        .then((data) => {
          pageData.value = data.list;
          total.value = data.total;
        })
        .finally(() => {
          loading.value = false;
        });
  }

  /** 重置会员信息管理查询 */
  function handleResetQuery() {
    queryFormRef.value!.resetFields();
    queryParams.pageNum = 1;
    handleQuery();
  }

  /** 行复选框选中记录选中ID集合 */
  function handleSelectionChange(selection: any) {
    removeIds.value = selection.map((item: any) => item.id);
  }

  // const editingId = ref<number | undefined>(undefined);

  /** 打开会员信息管理弹窗 */
  function handleOpenDialog(id?: number) {
    // editingId.value = id; // 保存ID
    if (id) {
      dialog.title = "修改会员信息管理";
      dialog.type = 'edit'; // 标记为编辑操作
            AioveuMemberAPI.getFormData(id).then((data) => {
        Object.assign(formData, data);
              //先准备数据，再显示弹窗
              dialog.visible = true;
      });
    } else {
      dialog.title = "新增会员信息管理";
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

  /** 提交会员信息管理表单 */
  function handleSubmit() {
    dataFormRef.value.validate((valid: any) => {
      if (valid) {
        loading.value = true;
        // const id = editingId.value;
        const id = formData.id;
        if (id) {
                AioveuMemberAPI.update(id, formData)
              .then(() => {
                ElMessage.success("修改成功");
                handleCloseDialog();
                handleResetQuery();
              })
              .finally(() => (loading.value = false));
        } else {
                AioveuMemberAPI.add(formData)
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

  /** 关闭会员信息管理弹窗 */
  function handleCloseDialog() {
    dialog.visible = false;
    // 关键修复：在关闭弹窗时重置加载状态
    loading.value = false;
    // 延迟重置表单（等待动画完成）
    setTimeout(() => {
      dataFormRef.value.resetFields();
      dataFormRef.value.clearValidate();
      // editingId.value = undefined;
    }, 3);
  }

  /** 删除会员信息管理 */
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
                AioveuMemberAPI.deleteByIds(ids)
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
    load_member_status_Options()
  });
</script>
