<template>
  <div class="app-container">
    <div class="search-container">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true">
<!--                <el-form-item label="联系人ID" prop="id">-->
<!--                      <el-input-->
<!--                          v-model="queryParams.id"-->
<!--                          placeholder="联系人ID"-->
<!--                          clearable-->
<!--                          @keyup.enter="handleQuery()"-->
<!--                      />-->
<!--                </el-form-item>-->
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

<!--                <el-form-item label="联系人姓名" prop="name">-->
<!--                      <el-input-->
<!--                          v-model="queryParams.name"-->
<!--                          placeholder="联系人姓名"-->
<!--                          clearable-->
<!--                          @keyup.enter="handleQuery()"-->
<!--                      />-->
<!--                </el-form-item>-->

                <el-form-item label="联系人姓名" prop="name">
                  <el-select
                    v-model="queryParams.name"
                    placeholder="联系人姓名"
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

                <el-form-item label="手机号码" prop="mobile">
                      <el-input
                          v-model="queryParams.mobile"
                          placeholder="手机号码"
                          clearable
                          @keyup.enter="handleQuery()"
                      />
                </el-form-item>
                <el-form-item label="电子邮箱" prop="email">
                      <el-input
                          v-model="queryParams.email"
                          placeholder="电子邮箱"
                          clearable
                          @keyup.enter="handleQuery()"
                      />
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
            v-hasPerm="['aioveuContact:aioveu-contact:add']"
            type="success"
            @click="handleOpenDialog()"
        >
          <template #icon><Plus /></template>
          新增
        </el-button>
        <el-button
            v-hasPerm="['aioveuContact:aioveu-contact:delete']"
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
<!--                        label="联系人ID"-->
<!--                        prop="id"-->
<!--                        min-width="150"-->
<!--                        align="center"-->
<!--                    />-->
                    <el-table-column
                      key="customerName"
                      label="客户"
                      prop="customerName"
                      min-width="150"
                      align="center"
                    />
                    <el-table-column
                        key="name"
                        label="联系人姓名"
                        prop="name"
                        min-width="150"
                        align="center"
                        fixed="left"
                    />
                    <el-table-column
                        key="position"
                        label="职位"
                        prop="position"
                        min-width="150"
                        align="center"
                    />
                    <el-table-column
                        key="department"
                        label="部门"
                        prop="department"
                        min-width="150"
                        align="center"
                    />
                    <el-table-column
                        key="mobile"
                        label="手机号码"
                        prop="mobile"
                        min-width="150"
                        align="center"
                    />
                    <el-table-column
                        key="phone"
                        label="办公电话"
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
                        key="wechat"
                        label="微信号"
                        prop="wechat"
                        min-width="150"
                        align="center"
                    />
                    <el-table-column
                      label="是否是主要联系人"
                      min-width="150"
                      align="center"
                    >
                      <template #default="scope">
                        <DictLabel v-model="scope.row.isPrimary" code="contact_is_primary" />
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="性别"
                      min-width="150"
                      align="center"
                    >
                      <template #default="scope">
                        <DictLabel v-model="scope.row.gender" code="gender" />
                      </template>
                    </el-table-column>
                    <el-table-column
                        key="birthday"
                        label="生日"
                        prop="birthday"
                        min-width="150"
                        align="center"
                    />
                    <el-table-column
                        key="hobbies"
                        label="兴趣爱好"
                        prop="hobbies"
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
                v-hasPerm="['aioveuContact:aioveu-contact:edit']"
                type="primary"
                size="small"
                link
                @click="handleOpenDialog(scope.row.id)"
            >
              <template #icon><Edit /></template>
              编辑
            </el-button>
            <el-button
                v-hasPerm="['aioveuContact:aioveu-contact:delete']"
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

    <!-- 客户联系人表单弹窗 -->
    <el-dialog
        v-model="dialog.visible"
        :title="dialog.title"
        width="500px"
        @close="handleCloseDialog"
    >
      <el-form ref="dataFormRef" :model="formData" :rules="rules" label-width="100px">

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

                <el-form-item label="联系人姓名" prop="name">
                      <el-input
                          v-model="formData.name"
                          placeholder="联系人姓名"
                      />
                </el-form-item>

                <el-form-item label="职位" prop="position">
                      <el-input
                          v-model="formData.position"
                          placeholder="职位"
                      />
                </el-form-item>

                <el-form-item label="部门" prop="department">
                      <el-input
                          v-model="formData.department"
                          placeholder="部门"
                      />
                </el-form-item>

                <el-form-item label="手机号码" prop="mobile">
                      <el-input
                          v-model="formData.mobile"
                          placeholder="手机号码"
                      />
                </el-form-item>

                <el-form-item label="办公电话" prop="phone">
                      <el-input
                          v-model="formData.phone"
                          placeholder="办公电话"
                      />
                </el-form-item>

                <el-form-item label="电子邮箱" prop="email">
                      <el-input
                          v-model="formData.email"
                          placeholder="电子邮箱"
                      />
                </el-form-item>

                <el-form-item label="微信号" prop="wechat">
                      <el-input
                          v-model="formData.wechat"
                          placeholder="微信号"
                      />
                </el-form-item>

                <el-form-item label="主联系人" prop="isPrimary">
                  <el-select
                    v-model="formData.isPrimary"
                    placeholder="主联系人"
                    clearable
                  >
                    <el-option
                      v-for="item in isPrimaryOptions"
                      :key="Number(item.value)"
                      :label="item.label"
                      :value="Number(item.value)"
                    />
                  </el-select>
                </el-form-item>

                <el-form-item label="性别" prop="gender">
                  <el-select
                    v-model="formData.gender"
                    placeholder="性别"
                    clearable
                  >
                    <el-option
                      v-for="item in genderOptions"
                      :key="Number(item.value)"
                      :label="item.label"
                      :value="Number(item.value)"
                    />
                  </el-select>
                </el-form-item>

                <el-form-item label="生日" prop="birthday">
                      <el-date-picker
                          class="!w-[240px]"
                          v-model="formData.birthday"
                          type="date"
                          placeholder="生日"
                          value-format="YYYY-MM-DD"
                      />
                </el-form-item>

                <el-form-item label="兴趣爱好" prop="hobbies">
                      <el-input
                          v-model="formData.hobbies"
                          placeholder="兴趣爱好"
                      />
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
    name: "AioveuContact",
    inheritAttrs: false,
  });

  import AioveuContactAPI, { AioveuContactPageVO, AioveuContactForm, AioveuContactPageQuery ,ContactOptionVO } from "@/api/aioveuContact/aioveu-contact";
  // 导入字典值
  import DictAPI,{ DictItemOption } from '@/api/system/dict.api'
  import AioveuCustomerAPI, {CustomerOptionVO} from "@/api/aioveuCustomer/aioveu-customer";
  const queryFormRef = ref();
  const dataFormRef = ref();

  const loading = ref(false);
  const removeIds = ref<number[]>([]);
  const total = ref(0);

  const queryParams = reactive<AioveuContactPageQuery>({
    pageNum: 1,
    pageSize: 10,
  });

  // 客户联系人表格数据
  const pageData = ref<AioveuContactPageVO[]>([]);

  // 弹窗
  const dialog = reactive({
    title: "",
    visible: false,
  });


  // 选项
  const isPrimaryOptions = ref<DictItemOption[]>([])

  // 选项
  const genderOptions = ref<DictItemOption[]>([])

  const contactOptions = ref<ContactOptionVO[]>([]);

  const customerOptions = ref<CustomerOptionVO[]>([]);


  // 客户联系人表单数据
  const formData = reactive<AioveuContactForm>({});

  // 客户联系人表单校验规则
  const rules = reactive({
                      customerName: [{ required: true, message: "请输入客户", trigger: "blur" }],
                      name: [{ required: true, message: "请输入联系人姓名", trigger: "blur" }],
                      isPrimary: [{ required: true, message: "请输入是否是主要联系人：0-否，1-是", trigger: "blur" }],
  });

  /** 查询客户联系人 */
  function handleQuery() {
    loading.value = true;
          AioveuContactAPI.getPage(queryParams)
        .then((data) => {
          pageData.value = data.list;
          total.value = data.total;
        })
        .finally(() => {
          loading.value = false;
        });
  }

  /** 重置客户联系人查询 */
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
  const editingContactId = ref<number | undefined>(undefined);

  /** 打开客户联系人弹窗 */
  function handleOpenDialog(id?: number) {


    editingContactId.value = id; // 保存ID

    if (id) {
      dialog.title = "修改客户联系人";
            AioveuContactAPI.getFormData(id).then((data) => {
        Object.assign(formData, data);
              dialog.visible = true;
      });
    } else {
      dialog.title = "新增客户联系人";

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

  /** 提交客户联系人表单 */
  function handleSubmit() {
    dataFormRef.value.validate((valid: any) => {
      if (valid) {
        loading.value = true;
        const id = editingContactId.value; // 使用存储的ID
        if (id) {
                AioveuContactAPI.update(id, formData)
              .then(() => {
                ElMessage.success("修改成功");
                handleCloseDialog();
                handleResetQuery();
              })
              .finally(() => (loading.value = false));
        } else {
                AioveuContactAPI.add(formData)
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

  /** 关闭客户联系人弹窗 */
  function handleCloseDialog() {
    dialog.visible = false;

    // 关键修复：在关闭弹窗时重置加载状态
    loading.value = false;
    // 延迟重置表单（等待动画完成）
    setTimeout(() => {
    dataFormRef.value.resetFields();
    dataFormRef.value.clearValidate();

    // 清除编辑ID
    editingContactId.value = undefined;
    }, 300);
  }

  /** 删除客户联系人 */
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
                AioveuContactAPI.deleteByIds(ids)
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
    DictAPI.getDictItems('contact_is_primary').then(response => {
      isPrimaryOptions.value = response
    })

    DictAPI.getDictItems('gender').then(response => {
      genderOptions.value = response
    })
  }

  function loadContactOptions() {
    AioveuContactAPI.getAllContactOptions().then(response => {
      contactOptions.value = response
    })
  }

  // 加载选项
  function loadCustomerOptions() {
    AioveuCustomerAPI.getAllCustomerOptions().then(response => {
      customerOptions.value = response
    })
  }


  onMounted(() => {
    handleQuery();
    loadOptions()
    loadContactOptions();
    loadCustomerOptions();
  });
</script>
