<template>
  <div class="app-container">
    <div class="search-container">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true">
<!--                <el-form-item label="会员等级ID" prop="id">-->
<!--                      <el-input-->
<!--                          v-model="queryParams.id"-->
<!--                          placeholder="会员等级ID"-->
<!--                          clearable-->
<!--                          @keyup.enter="handleQuery()"-->
<!--                      />-->
<!--                </el-form-item>-->
                <el-form-item label="等级名称" prop="levelName">
                      <el-input
                          v-model="queryParams.levelName"
                          placeholder="等级名称"
                          clearable
                          @keyup.enter="handleQuery()"
                      />
                </el-form-item>
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
            v-hasPerm="['aioveuMemberLevel:aioveu-member-level:add']"
            type="success"
            @click="handleOpenDialog()"
        >
          <template #icon><Plus /></template>
          新增
        </el-button>
        <el-button
            v-hasPerm="['aioveuMemberLevel:aioveu-member-level:delete']"
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
<!--                        label="会员等级ID"-->
<!--                        prop="id"-->
<!--                        min-width="150"-->
<!--                        align="center"-->
<!--                    />-->
                    <el-table-column
                        key="levelName"
                        label="等级名称"
                        prop="levelName"
                        min-width="150"
                        align="center"
                    />
                    <el-table-column
                        key="minAmount"
                        label="最低消费额"
                        prop="minAmount"
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
                        key="benefits"
                        label="权益描述"
                        prop="benefits"
                        min-width="200"
                        align="center"
                    />
                    <el-table-column
                        key="status"
                        label="状态"
                        prop="status"
                        min-width="150"
                        align="center"
                    >
                      <template #default="scope">
                        <DictLabel v-model="scope.row.status" code="member_level_status" />
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
                v-hasPerm="['aioveuMemberLevel:aioveu-member-level:edit']"
                type="primary"
                size="small"
                link
                @click="handleOpenDialog(scope.row.id)"
            >
              <template #icon><Edit /></template>
              编辑
            </el-button>
            <el-button
                v-hasPerm="['aioveuMemberLevel:aioveu-member-level:delete']"
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

    <!-- 会员等级表单弹窗 -->
    <el-dialog
        v-model="dialog.visible"
        :title="dialog.title"
        width="500px"
        @close="handleCloseDialog"
    >
      <el-form ref="dataFormRef" :model="formData" :rules="rules" label-width="100px">


<!--                <el-form-item label="会员等级ID" prop="id">-->
<!--                  <el-input-->
<!--                    v-model="formData.id"-->
<!--                    placeholder="会员等级ID"-->
<!--                    disabled-->
<!--                  >-->
<!--                    <template #prefix>-->
<!--                      <el-icon><lock /></el-icon>-->
<!--                    </template>-->
<!--                  </el-input>-->
<!--                </el-form-item>-->


                <el-form-item label="等级名称" prop="levelName">
                      <el-input
                          v-model="formData.levelName"
                          placeholder="等级名称"
                      />
                </el-form-item>

                <el-form-item label="最低消费额" prop="minAmount">
                      <el-input
                          v-model="formData.minAmount"
                          placeholder="最低消费额"
                      />
                </el-form-item>

                <el-form-item label="折扣率" prop="discount">
                      <el-input
                          v-model="formData.discount"
                          placeholder="折扣率"
                      />
                </el-form-item>

                <el-form-item label="权益描述" prop="benefits">
                      <el-input
                          v-model="formData.benefits"
                          placeholder="权益描述"
                          type="textarea"
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
    name: "AioveuMemberLevel",
    inheritAttrs: false,
  });

  import AioveuMemberLevelAPI, { AioveuMemberLevelPageVO, AioveuMemberLevelForm, AioveuMemberLevelPageQuery } from "@/api/aioveuMemberLevel/aioveu-member-level";

  // 导入字典值
  import DictAPI,{ DictItemOption } from '@/api/system/dict.api'

  // 状态选项
  const statusOptions = ref<DictItemOption[]>([])

  // 状态字典
  function loadstatusOptions() {
    DictAPI.getDictItems('member_level_status').then(response => {
      statusOptions.value = response
    })
  }


  const queryFormRef = ref();
  const dataFormRef = ref();

  const loading = ref(false);
  const removeIds = ref<number[]>([]);
  const total = ref(0);

  const queryParams = reactive<AioveuMemberLevelPageQuery>({
    pageNum: 1,
    pageSize: 10,
  });

  // 会员等级表格数据
  const pageData = ref<AioveuMemberLevelPageVO[]>([]);

  // 弹窗
  const dialog = reactive({
    title: "",
    visible: false,
  });

  // 会员等级表单数据
  const formData = reactive<AioveuMemberLevelForm>({});

  // 会员等级表单校验规则
  const rules = reactive({
                      levelName: [{ required: true, message: "请输入等级名称", trigger: "blur" }],
                      minAmount: [{ required: true, message: "请输入最低消费额", trigger: "blur" }],
                      discount: [{ required: true, message: "请输入折扣率", trigger: "blur" }],
                      status: [{ required: true, message: "请输入状态(0-禁用 1-启用)", trigger: "blur" }],
  });

  /** 查询会员等级 */
  function handleQuery() {
    loading.value = true;
          AioveuMemberLevelAPI.getPage(queryParams)
        .then((data) => {
          pageData.value = data.list;
          total.value = data.total;
        })
        .finally(() => {
          loading.value = false;
        });
  }

  /** 重置会员等级查询 */
  function handleResetQuery() {
    queryFormRef.value!.resetFields();
    queryParams.pageNum = 1;
    handleQuery();
  }

  /** 行复选框选中记录选中ID集合 */
  function handleSelectionChange(selection: any) {
    removeIds.value = selection.map((item: any) => item.id);
  }

  /** 打开会员等级弹窗 */
  function handleOpenDialog(id?: number) {
    // dialog.visible = true;
    if (id) {
      dialog.title = "修改会员等级";
            AioveuMemberLevelAPI.getFormData(id).then((data) => {
        Object.assign(formData, data);

              //先准备数据，再显示弹窗
              dialog.visible = true;

      });
    } else {
      dialog.title = "新增会员等级";

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

  /** 提交会员等级表单 */
  function handleSubmit() {
    dataFormRef.value.validate((valid: any) => {
      if (valid) {
        loading.value = true;
        const id = formData.id;
        if (id) {
                AioveuMemberLevelAPI.update(id, formData)
              .then(() => {
                ElMessage.success("修改成功");
                handleCloseDialog();
                handleResetQuery();
              })
              .finally(() => (loading.value = false));
        } else {
                AioveuMemberLevelAPI.add(formData)
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

  /** 关闭会员等级弹窗 */
  function handleCloseDialog() {
    dialog.visible = false;
    dataFormRef.value.resetFields();
    dataFormRef.value.clearValidate();
    formData.id = undefined;
  }

  /** 删除会员等级 */
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
                AioveuMemberLevelAPI.deleteByIds(ids)
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
    loadstatusOptions()
  });
</script>
