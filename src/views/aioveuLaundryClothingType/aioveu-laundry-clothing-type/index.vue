<template>
  <div class="app-container">
    <div class="search-container">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true">
<!--                <el-form-item label="衣物类型ID" prop="id">-->
<!--                      <el-input-->
<!--                          v-model="queryParams.id"-->
<!--                          placeholder="衣物类型ID"-->
<!--                          clearable-->
<!--                          @keyup.enter="handleQuery()"-->
<!--                      />-->
<!--                </el-form-item>-->
                <el-form-item label="类型代码" prop="typeCode">
                      <el-input
                          v-model="queryParams.typeCode"
                          placeholder="类型代码"
                          clearable
                          @keyup.enter="handleQuery()"
                      />
                </el-form-item>
                <el-form-item label="类型名称" prop="typeName">
                      <el-input
                          v-model="queryParams.typeName"
                          placeholder="类型名称"
                          clearable
                          @keyup.enter="handleQuery()"
                      />
                </el-form-item>
<!--                <el-form-item label="衣物类别" prop="category">-->
<!--                      <el-input-->
<!--                          v-model="queryParams.category"-->
<!--                          placeholder="衣物类别"-->
<!--                          clearable-->
<!--                          @keyup.enter="handleQuery()"-->
<!--                      />-->
<!--                </el-form-item>-->
                    <el-form-item label="衣物类别" prop="category">
                      <el-select
                        v-model="queryParams.category"
                        placeholder="衣物类别"
                        clearable
                        filterable
                        @keyup.enter="handleQuery()"
                      >
                        <el-option
                          v-for="item in categoryOptions"
                          :key="Number(item.value)"
                          :label="item.label"
                          :value="Number(item.value)"
                        />
                      </el-select>
                    </el-form-item>

                <el-form-item label="特殊处理要求" prop="specialRequirements">
                      <el-input
                          v-model="queryParams.specialRequirements"
                          placeholder="特殊处理要求"
                          clearable
                          @keyup.enter="handleQuery()"
                      />
                </el-form-item>
<!--                <el-form-item label="是否精细衣物" prop="isDelicate">-->
<!--                      <el-input-->
<!--                          v-model="queryParams.isDelicate"-->
<!--                          placeholder="是否精细衣物"-->
<!--                          clearable-->
<!--                          @keyup.enter="handleQuery()"-->
<!--                      />-->
<!--                </el-form-item>-->
                    <el-form-item label="是否精细衣物" prop="isDelicate">
                      <el-select
                        v-model="queryParams.isDelicate"
                        placeholder="是否精细衣物"
                        clearable
                        filterable
                        @keyup.enter="handleQuery()"
                      >
                        <el-option
                          v-for="item in isDelicateOptions"
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
            v-hasPerm="['aioveuLaundryClothingType:aioveu-laundry-clothing-type:add']"
            type="success"
            @click="handleOpenDialog()"
        >
          <template #icon><Plus /></template>
          新增
        </el-button>
        <el-button
            v-hasPerm="['aioveuLaundryClothingType:aioveu-laundry-clothing-type:delete']"
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
<!--                        label="衣物类型ID"-->
<!--                        prop="id"-->
<!--                        min-width="150"-->
<!--                        align="center"-->
<!--                    />-->
                    <el-table-column
                        key="typeCode"
                        label="类型代码"
                        prop="typeCode"
                        min-width="150"
                        align="center"
                    />
                    <el-table-column
                        key="typeName"
                        label="类型名称"
                        prop="typeName"
                        min-width="150"
                        align="center"
                    />
<!--                    <el-table-column-->
<!--                        key="category"-->
<!--                        label="衣物类别"-->
<!--                        prop="category"-->
<!--                        min-width="150"-->
<!--                        align="center"-->
<!--                    />-->

                    <el-table-column
                      label="衣物类别"
                      min-width="150"
                      align="center"
                    >
                      <template #default="scope">
                        <DictLabel v-model="scope.row.category" code="laundry_clothing_type_category" />
                      </template>
                    </el-table-column>

                    <el-table-column
                        key="basePrice"
                        label="基础价格"
                        prop="basePrice"
                        min-width="150"
                        align="center"
                    />
                    <el-table-column
                        key="processingTime"
                        label="标准处理时间(分钟)"
                        prop="processingTime"
                        min-width="150"
                        align="center"
                    />
                    <el-table-column
                        key="specialRequirements"
                        label="特殊处理要求"
                        prop="specialRequirements"
                        min-width="150"
                        align="center"
                    />
<!--                    <el-table-column-->
<!--                        key="isDelicate"-->
<!--                        label="是否精细衣物"-->
<!--                        prop="isDelicate"-->
<!--                        min-width="150"-->
<!--                        align="center"-->
<!--                    />-->

                    <el-table-column
                      label="是否精细衣物"
                      min-width="150"
                      align="center"
                    >
                      <template #default="scope">
                        <DictLabel v-model="scope.row.isDelicate" code="laundry_clothing_type_is_delicate" />
                      </template>
                    </el-table-column>

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
                          <DictLabel v-model="scope.row.status" code="laundry_clothing_type_status" />
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
                v-hasPerm="['aioveuLaundryClothingType:aioveu-laundry-clothing-type:edit']"
                type="primary"
                size="small"
                link
                @click="handleOpenDialog(scope.row.id)"
            >
              <template #icon><Edit /></template>
              编辑
            </el-button>
            <el-button
                v-hasPerm="['aioveuLaundryClothingType:aioveu-laundry-clothing-type:delete']"
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

    <!-- 衣物类型表单弹窗 -->
    <el-dialog
        v-model="dialog.visible"
        :title="dialog.title"
        width="500px"
        @close="handleCloseDialog"
    >
      <el-form ref="dataFormRef" :model="formData" :rules="rules" label-width="100px">
<!--                <el-form-item label="类型代码" prop="typeCode">-->
<!--                      <el-input-->
<!--                          v-model="formData.typeCode"-->
<!--                          placeholder="类型代码"-->
<!--                      />-->
<!--                </el-form-item>-->

                <el-form-item label="类型名称" prop="typeName">
                      <el-input
                          v-model="formData.typeName"
                          placeholder="类型名称"
                      />
                </el-form-item>

<!--                <el-form-item label="衣物类别" prop="category">-->
<!--                      <el-input-->
<!--                          v-model="formData.category"-->
<!--                          placeholder="衣物类别"-->
<!--                      />-->
<!--                </el-form-item>-->

                    <el-form-item label="衣物类别" prop="category">
                      <el-select
                        v-model="formData.category"
                        placeholder="衣物类别"
                        clearable
                        filterable
                      >
                        <el-option
                          v-for="item in categoryOptions"
                          :key="Number(item.value)"
                          :label="item.label"
                          :value="Number(item.value)"
                        />
                      </el-select>
                    </el-form-item>


                <el-form-item label="基础价格" prop="basePrice">
                      <el-input
                          v-model="formData.basePrice"
                          placeholder="基础价格"
                      />
                </el-form-item>

                <el-form-item label="处理时间" prop="processingTime" >
                      <el-input
                          v-model="formData.processingTime"
                          placeholder="标准处理时间(分钟)"
                      />
                </el-form-item>

                <el-form-item label="特殊处理要求" prop="specialRequirements">
                      <el-input
                          v-model="formData.specialRequirements"
                          placeholder="特殊处理要求"
                          type="textarea"
                      />
                </el-form-item>

<!--                <el-form-item label="是否精细" prop="isDelicate">-->
<!--                      <el-input-->
<!--                          v-model="formData.isDelicate"-->
<!--                          placeholder="是否精细衣物"-->
<!--                      />-->
<!--                </el-form-item>-->

                    <el-form-item label="是否精细" prop="isDelicate">
                      <el-select
                        v-model="formData.isDelicate"
                        placeholder="是否精细衣物"
                        clearable
                        filterable
                      >
                        <el-option
                          v-for="item in isDelicateOptions"
                          :key="Number(item.value)"
                          :label="item.label"
                          :value="Number(item.value)"
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
                        filterable
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
    name: "AioveuLaundryClothingType",
    inheritAttrs: false,
  });

  import AioveuLaundryClothingTypeAPI, { AioveuLaundryClothingTypePageVO, AioveuLaundryClothingTypeForm, AioveuLaundryClothingTypePageQuery } from "@/api/aioveuLaundryClothingType/aioveu-laundry-clothing-type";
  // 导入字典值
  import DictAPI,{ DictItemOption } from '@/api/system/dict.api'
  const queryFormRef = ref();
  const dataFormRef = ref();

  const loading = ref(false);
  const removeIds = ref<number[]>([]);
  const total = ref(0);

  const queryParams = reactive<AioveuLaundryClothingTypePageQuery>({
    pageNum: 1,
    pageSize: 10,
  });

  // 衣物类型表格数据
  const pageData = ref<AioveuLaundryClothingTypePageVO[]>([]);
  // 状态选项
  const isDelicateOptions = ref<DictItemOption[]>([])
  const categoryOptions = ref<DictItemOption[]>([])
  const statusOptions = ref<DictItemOption[]>([])


  // 状态字典
  function loadOptions() {
    DictAPI.getDictItems('laundry_clothing_type_is_delicate').then(response => {
      isDelicateOptions.value = response
    })

    DictAPI.getDictItems('laundry_clothing_type_category').then(response => {
      categoryOptions.value = response
    })

    DictAPI.getDictItems('laundry_clothing_type_status').then(response => {
      statusOptions.value = response
    })

  }

  // 弹窗
  const dialog = reactive({
    title: "",
    visible: false,
  });

  // 衣物类型表单数据
  const formData = reactive<AioveuLaundryClothingTypeForm>({});

  // 衣物类型表单校验规则
  const rules = reactive({
                      typeCode: [{ required: true, message: "请输入类型代码", trigger: "blur" }],
                      typeName: [{ required: true, message: "请输入类型名称", trigger: "blur" }],
                      category: [{ required: true, message: "请输入衣物类别", trigger: "blur" }],
                      processingTime: [{ required: true, message: "请输入标准处理时间(分钟)", trigger: "blur" }],
                      isDelicate: [{ required: true, message: "请输入是否精细衣物", trigger: "blur" }],
                      status: [{ required: true, message: "请输入状态(0-停用 1-启用)", trigger: "blur" }],
  });

  /** 查询衣物类型 */
  function handleQuery() {
    loading.value = true;
          AioveuLaundryClothingTypeAPI.getPage(queryParams)
        .then((data) => {
          pageData.value = data.list;
          total.value = data.total;
        })
        .finally(() => {
          loading.value = false;
        });
  }

  /** 重置衣物类型查询 */
  function handleResetQuery() {
    queryFormRef.value!.resetFields();
    queryParams.pageNum = 1;
    handleQuery();
  }

  /** 行复选框选中记录选中ID集合 */
  function handleSelectionChange(selection: any) {
    removeIds.value = selection.map((item: any) => item.id);
  }

  /** 打开衣物类型弹窗 */
  function handleOpenDialog(id?: number) {
    // dialog.visible = true;
    if (id) {
      dialog.title = "修改衣物类型";
            AioveuLaundryClothingTypeAPI.getFormData(id).then((data) => {
        Object.assign(formData, data);
              //先准备数据，再显示弹窗
              dialog.visible = true;
      });
    } else {
      dialog.title = "新增衣物类型";
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

  /** 提交衣物类型表单 */
  function handleSubmit() {
    dataFormRef.value.validate((valid: any) => {
      if (valid) {
        loading.value = true;
        const id = formData.id;
        if (id) {
                AioveuLaundryClothingTypeAPI.update(id, formData)
              .then(() => {
                ElMessage.success("修改成功");
                handleCloseDialog();
                handleResetQuery();
              })
              .finally(() => (loading.value = false));
        } else {
                AioveuLaundryClothingTypeAPI.add(formData)
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

  /** 关闭衣物类型弹窗 */
  function handleCloseDialog() {
    dialog.visible = false;
    dataFormRef.value.resetFields();
    dataFormRef.value.clearValidate();
    formData.id = undefined;
  }

  /** 删除衣物类型 */
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
                AioveuLaundryClothingTypeAPI.deleteByIds(ids)
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
    loadOptions()
  });
</script>
