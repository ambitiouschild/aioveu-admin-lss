<template>
  <div class="app-container">
    <div class="search-container">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true">
<!--                <el-form-item label="衣物明细ID" prop="id">-->
<!--                      <el-input-->
<!--                          v-model="queryParams.id"-->
<!--                          placeholder="衣物明细ID"-->
<!--                          clearable-->
<!--                          @keyup.enter="handleQuery()"-->
<!--                      />-->
<!--                </el-form-item>-->
<!--                <el-form-item label="订单ID" prop="orderId">-->
<!--                      <el-input-->
<!--                          v-model="queryParams.orderId"-->
<!--                          placeholder="订单ID"-->
<!--                          clearable-->
<!--                          @keyup.enter="handleQuery()"-->
<!--                      />-->
<!--                </el-form-item>-->
                    <el-form-item label="订单号" prop="orderId">
                      <el-select
                        v-model="queryParams.orderId"
                        placeholder="请选择订单号"
                        clearable
                        filterable
                        @keyup.enter="handleQuery()"
                      >
                        <el-option
                          v-for="item in laundryOrderOption"
                          :key="item.orderId"
                          :label="item.orderNo"
                          :value="item.orderId"
                        />
                      </el-select>
                    </el-form-item>


<!--                <el-form-item label="衣物类型ID" prop="clothingTypeId">-->
<!--                      <el-input-->
<!--                          v-model="queryParams.clothingTypeId"-->
<!--                          placeholder="衣物类型ID"-->
<!--                          clearable-->
<!--                          filterable-->
<!--                          @keyup.enter="handleQuery()"-->
<!--                      />-->
<!--                </el-form-item>-->

                    <el-form-item label="衣物类型" prop="clothingTypeId">
                      <el-select
                        v-model="queryParams.clothingTypeId"
                        placeholder="请选择衣物类型"
                        clearable
                        filterable
                        @keyup.enter="handleQuery()"
                      >
                        <el-option
                          v-for="item in laundryClothingTypeOption"
                          :key="item.clothingTypeId"
                          :label="item.clothingTypeName"
                          :value="item.clothingTypeId"
                        />
                      </el-select>
                    </el-form-item>

                <el-form-item label="自定义衣物类型" prop="customType">
                      <el-input
                          v-model="queryParams.customType"
                          placeholder="自定义衣物类型"
                          clearable
                          type="textarea"
                          @keyup.enter="handleQuery()"
                      />
                </el-form-item>
<!--                <el-form-item label="处理状态" prop="processStatus">-->
<!--                      <el-input-->
<!--                          v-model="queryParams.processStatus"-->
<!--                          placeholder="处理状态"-->
<!--                          clearable-->
<!--                          @keyup.enter="handleQuery()"-->
<!--                      />-->
<!--                </el-form-item>-->
                    <el-form-item label="处理状态" prop="processStatus">
                      <el-select
                        v-model="queryParams.processStatus"
                        placeholder="请选择处理状态"
                        clearable
                        filterable
                        @keyup.enter="handleQuery()"
                      >
                        <el-option
                          v-for="item in processStatusOptions"
                          :key="Number(item.value)"
                          :label="item.label"
                          :value="Number(item.value)"
                        />
                      </el-select>
                    </el-form-item>


                <el-form-item label="特殊要求" prop="specialInstruction">
                      <el-input
                          v-model="queryParams.specialInstruction"
                          placeholder="特殊要求"
                          clearable
                          type="textarea"
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
            v-hasPerm="['aioveuLaundryOrderItem:aioveu-laundry-order-item:add']"
            type="success"
            @click="handleOpenDialog()"
        >
          <template #icon><Plus /></template>
          新增
        </el-button>
        <el-button
            v-hasPerm="['aioveuLaundryOrderItem:aioveu-laundry-order-item:delete']"
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
<!--                        label="衣物明细ID"-->
<!--                        prop="id"-->
<!--                        min-width="150"-->
<!--                        align="center"-->
<!--                    />-->
<!--                    <el-table-column-->
<!--                        key="orderId"-->
<!--                        label="订单ID"-->
<!--                        prop="orderId"-->
<!--                        min-width="150"-->
<!--                        align="center"-->
<!--                    />-->

                  <!-- 修改：将所属ID改为所属名称 -->
                      <el-table-column
                        key="orderNo"
                        label="订单号"
                        prop="orderNo"
                        min-width="150"
                        align="center"
                      />

<!--                    <el-table-column-->
<!--                        key="clothingTypeId"-->
<!--                        label="衣物类型ID"-->
<!--                        prop="clothingTypeId"-->
<!--                        min-width="150"-->
<!--                        align="center"-->
<!--                    />-->

                    <el-table-column
                      key="clothingTypeName"
                      label="衣物类型"
                      prop="clothingTypeName"
                      min-width="150"
                      align="center"
                    />


                    <el-table-column
                        key="customType"
                        label="自定义衣物类型"
                        prop="customType"
                        min-width="150"
                        align="center"
                    />
                    <el-table-column
                        key="problemDesc"
                        label="问题描述"
                        prop="problemDesc"
                        min-width="150"
                        align="center"
                    />
                    <el-table-column
                        key="price"
                        label="价格"
                        prop="price"
                        min-width="150"
                        align="center"
                    />
<!--                    <el-table-column-->
<!--                        key="processStatus"-->
<!--                        label="处理状态"-->
<!--                        prop="processStatus"-->
<!--                        min-width="150"-->
<!--                        align="center"-->
<!--                    />-->

                    <el-table-column
                      label="处理状态"
                      min-width="150"
                      align="center"
                    >
                      <template #default="scope">
                        <DictLabel v-model="scope.row.processStatus" code="laundry_order_item_process_status" />
                      </template>
                    </el-table-column>

                    <el-table-column
                        key="specialInstruction"
                        label="特殊要求"
                        prop="specialInstruction"
                        min-width="150"
                        align="center"
                    />
<!--                    <el-table-column-->
<!--                        key="startTime"-->
<!--                        label="开始处理时间"-->
<!--                        prop="startTime"-->
<!--                        min-width="150"-->
<!--                        align="center"-->
<!--                    />-->
<!--                    <el-table-column-->
<!--                        key="endTime"-->
<!--                        label="完成处理时间"-->
<!--                        prop="endTime"-->
<!--                        min-width="150"-->
<!--                        align="center"-->
<!--                    />-->
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
                v-hasPerm="['aioveuLaundryOrderItem:aioveu-laundry-order-item:edit']"
                type="primary"
                size="small"
                link
                @click="handleOpenDialog(scope.row.id)"
            >
              <template #icon><Edit /></template>
              编辑
            </el-button>
            <el-button
                v-hasPerm="['aioveuLaundryOrderItem:aioveu-laundry-order-item:delete']"
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

    <!-- 洗衣订单衣物明细表单弹窗 -->
    <el-dialog
        v-model="dialog.visible"
        :title="dialog.title"
        width="500px"
        @close="handleCloseDialog"
    >
      <el-form ref="dataFormRef" :model="formData" :rules="rules" label-width="100px">
<!--                <el-form-item label="订单ID" prop="orderId">-->
<!--                      <el-input-->
<!--                          v-model="formData.orderId"-->
<!--                          placeholder="订单ID"-->
<!--                      />-->
<!--                </el-form-item>-->

        <!-- 编辑特有字段 -->
        <template v-if="dialog.type === 'edit'">
                <el-form-item label="订单号" prop="orderId">
                  <el-select
                    v-model="formData.orderId"
                    placeholder="请选择订单号"
                    clearable
                    filterable
                    disabled
                  >
                    <template #prefix>
                      <el-icon><lock /></el-icon>
                    </template>
                    <el-option
                      v-for="item in laundryOrderOption"
                      :key="item .orderId"
                      :label="item .orderNo"
                      :value="item .orderId"
                    />
                  </el-select>
                </el-form-item>
        </template>

        <!-- 新增操作字段 -->
        <template v-else>
          <el-form-item label="订单号" prop="orderId">
            <el-select
              v-model="formData.orderId"
              placeholder="请选择订单号"
              clearable
              filterable
            >
              <el-option
                v-for="item in laundryOrderOption"
                :key="item .orderId"
                :label="item .orderNo"
                :value="item .orderId"
              />
            </el-select>
          </el-form-item>
        </template>

<!--                <el-form-item label="衣物类型ID" prop="clothingTypeId">-->
<!--                      <el-input-->
<!--                          v-model="formData.clothingTypeId"-->
<!--                          placeholder="衣物类型ID"-->
<!--                      />-->
<!--                </el-form-item>-->

                <el-form-item label="衣物类型" prop="clothingTypeId">
                  <el-select
                    v-model="formData.clothingTypeId"
                    placeholder="衣物类型"
                    clearable
                    filterable
                  >
                    <el-option
                      v-for="item in laundryClothingTypeOption"
                      :key="item.clothingTypeId"
                      :label="item.clothingTypeName"
                      :value="item.clothingTypeId"
                    />
                  </el-select>
                </el-form-item>

                <el-form-item label="自定义类型" prop="customType">
                      <el-input
                          v-model="formData.customType"
                          placeholder="自定义衣物类型"
                          type="textarea"
                      />
                </el-form-item>

                <el-form-item label="问题描述" prop="problemDesc">
                      <el-input
                          v-model="formData.problemDesc"
                          placeholder="问题描述"
                          type="textarea"
                      />
                </el-form-item>

                <el-form-item label="价格" prop="price">
                      <el-input
                          v-model="formData.price"
                          placeholder="价格"
                      />
                </el-form-item>

<!--                <el-form-item label="处理状态" prop="processStatus">-->
<!--                      <el-input-->
<!--                          v-model="formData.processStatus"-->
<!--                          placeholder="处理状态"-->
<!--                      />-->
<!--                </el-form-item>-->

                <el-form-item label="处理状态" prop="processStatus">
                  <el-select
                    v-model="formData.processStatus"
                    placeholder="处理状态"
                    clearable
                    filterable
                  >
                    <el-option
                      v-for="item in processStatusOptions"
                      :key="Number(item.value)"
                      :label="item.label"
                      :value="Number(item.value)"
                    />
                  </el-select>
                </el-form-item>

                <el-form-item label="特殊要求" prop="specialInstruction">
                      <el-input
                          v-model="formData.specialInstruction"
                          placeholder="特殊要求"
                          type="textarea"
                      />
                </el-form-item>

<!--                <el-form-item label="开始处理时间" prop="startTime">-->
<!--                      <el-date-picker-->
<!--                          v-model="formData.startTime"-->
<!--                          type="datetime"-->
<!--                          placeholder="开始处理时间"-->
<!--                          value-format="YYYY-MM-DD HH:mm:ss"-->
<!--                      />-->
<!--                </el-form-item>-->

<!--                <el-form-item label="完成处理时间" prop="endTime">-->
<!--                      <el-date-picker-->
<!--                          v-model="formData.endTime"-->
<!--                          type="datetime"-->
<!--                          placeholder="完成处理时间"-->
<!--                          value-format="YYYY-MM-DD HH:mm:ss"-->
<!--                      />-->
<!--                </el-form-item>-->

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
    name: "AioveuLaundryOrderItem",
    inheritAttrs: false,
  });

  import AioveuLaundryOrderItemAPI, { AioveuLaundryOrderItemPageVO, AioveuLaundryOrderItemForm, AioveuLaundryOrderItemPageQuery } from "@/api/aioveuLaundryOrderItem/aioveu-laundry-order-item";
  import AioveuLaundryOrderAPI, {AioveuLaundryOrderOptionVO} from "@/api/aioveuLaundryOrder/aioveu-laundry-order";
  import AioveuLaundryClothingTypeAPI, {AioveuLaundryClothingTypeOptionVO} from "@/api/aioveuLaundryClothingType/aioveu-laundry-clothing-type";

  // 导入字典值
  import DictAPI,{ DictItemOption } from '@/api/system/dict.api'

  // 状态选项
  const processStatusOptions = ref<DictItemOption[]>([])

  // 状态字典
  function loadDict() {
    DictAPI.getDictItems('laundry_order_item_process_status').then(response => {
      processStatusOptions.value = response
    })
  }

  const queryFormRef = ref();
  const dataFormRef = ref();

  const loading = ref(false);
  const removeIds = ref<number[]>([]);
  const total = ref(0);

  // 新增：选项
  const laundryClothingTypeOption = ref<AioveuLaundryClothingTypeOptionVO[]>([]);

  // 加载选项
  function loadOptions() {
    AioveuLaundryClothingTypeAPI.getAllLaundryClothingTypeOptions().then(response => {
      laundryClothingTypeOption.value = response
    })
  }

  const queryParams = reactive<AioveuLaundryOrderItemPageQuery>({
    pageNum: 1,
    pageSize: 10,
  });

  // 新增：选项
  const laundryOrderOption = ref<AioveuLaundryOrderOptionVO[]>([]);

  // 加载选项
  function loadLaundryOrderOptions() {
    AioveuLaundryOrderAPI.getAllLaundryOrderOptions().then(response => {
      laundryOrderOption.value = response
    })
  }

  // 洗衣订单衣物明细表格数据
  const pageData = ref<AioveuLaundryOrderItemPageVO[]>([]);

  // 弹窗
  const dialog = reactive({
    title: "",
    type: " ",// 'recharge', 'add', 'edit'
    visible: false,
  });

  // 洗衣订单衣物明细表单数据
  const formData = reactive<AioveuLaundryOrderItemForm>({});

  // 洗衣订单衣物明细表单校验规则
  const rules = reactive({
                      orderId: [{ required: true, message: "请输入订单ID", trigger: "blur" }],
                      clothingTypeId: [{ required: true, message: "请输入衣物类型ID", trigger: "blur" }],
                      price: [{ required: true, message: "请输入价格", trigger: "blur" }],
                      processStatus: [{ required: true, message: "请输入处理状态 1-待处理-pending,2-洗涤中-washing,3-烘干中-drying,4-熨烫中-ironing,5-质检中-quality_check,6-已完成-finished,7-问题衣物-problem", trigger: "blur" }],
  });

  /** 查询洗衣订单衣物明细 */
  function handleQuery() {
    loading.value = true;
          AioveuLaundryOrderItemAPI.getPage(queryParams)
        .then((data) => {
          pageData.value = data.list;
          total.value = data.total;
        })
        .finally(() => {
          loading.value = false;
        });
  }

  /** 重置洗衣订单衣物明细查询 */
  function handleResetQuery() {
    queryFormRef.value!.resetFields();
    queryParams.pageNum = 1;
    handleQuery();
  }

  /** 行复选框选中记录选中ID集合 */
  function handleSelectionChange(selection: any) {
    removeIds.value = selection.map((item: any) => item.id);
  }

  /** 打开洗衣订单衣物明细弹窗 */
  function handleOpenDialog(id?: number) {
    // dialog.visible = true;
    if (id) {
      dialog.title = "修改洗衣订单衣物明细";
      dialog.type = 'edit'; // 标记为编辑操作
            AioveuLaundryOrderItemAPI.getFormData(id).then((data) => {
        Object.assign(formData, data);
              //先准备数据，再显示弹窗
              dialog.visible = true;
      });
    } else {
      dialog.title = "新增洗衣订单衣物明细";
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

  /** 提交洗衣订单衣物明细表单 */
  function handleSubmit() {
    dataFormRef.value.validate((valid: any) => {
      if (valid) {
        loading.value = true;
        const id = formData.id;
        if (id) {
                AioveuLaundryOrderItemAPI.update(id, formData)
              .then(() => {
                ElMessage.success("修改成功");
                handleCloseDialog();
                handleResetQuery();
              })
              .finally(() => (loading.value = false));
        } else {
                AioveuLaundryOrderItemAPI.add(formData)
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

  /** 关闭洗衣订单衣物明细弹窗 */
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

  /** 删除洗衣订单衣物明细 */
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
                AioveuLaundryOrderItemAPI.deleteByIds(ids)
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
    loadLaundryOrderOptions()
    loadOptions()
    loadDict()
  });
</script>
