<template>
  <div class="app-container">
    <div class="search-container">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true">
                <el-form-item label="岗位ID" prop="positionId">
                      <el-input
                          v-model="queryParams.positionId"
                          placeholder="岗位ID"
                          clearable
                          @keyup.enter="handleQuery()"
                      />
                </el-form-item>
<!--                <el-form-item label="岗位名称" prop="positionName">-->
<!--                      <el-input-->
<!--                          v-model="queryParams.positionName"-->
<!--                          placeholder="岗位名称"-->
<!--                          clearable-->
<!--                          @keyup.enter="handleQuery()"-->
<!--                      />-->
<!--                </el-form-item>-->

                <el-form-item label="岗位名称" prop="positionName">
                  <el-select
                    v-model="queryParams.positionName"
                    placeholder="岗位名称"
                    clearable
                    filterable
                    @keyup.enter="handleQuery()"
                  >
                    <el-option
                      v-for="position in positionOptions"
                      :key="position.positionId"
                      :label="position.positionName"
                      :value="position.positionName"
                    />
                  </el-select>
                </el-form-item>
        <!-- 修改：将所属部门ID改为所属部门名称 -->
                <el-form-item label="所属部门" prop="deptId">
                    <el-select
                      v-model="queryParams.deptId"
                      placeholder="请选择部门"
                      clearable
                      filterable
                      @keyup.enter="handleQuery()"
                    >
                      <!-- 遍历部门选项列表 -->
                      <!-- 使用部门ID作为唯一键，确保高效渲染 -->
                      <!-- 显示部门名称作为选项标签 -->
                      <!-- 使用部门ID作为选项值 -->
                      <el-option
                        v-for="dept in deptOptions"
                        :key="dept.deptId"
                        :label="dept.deptName"
                        :value="dept.deptId"
                      />
                    </el-select>
                </el-form-item>

                <el-form-item label="职级(1-10)" prop="positionLevel">
                  <el-select
                    v-model="queryParams.positionLevel"
                    placeholder="职级(1-10)"
                    clearable
                    filterable
                    @keyup.enter="handleQuery()"
                  >
                    <el-option
                      v-for="item in positionLevelOptions"
                      :key="Number(item.value)"
                      :label="item.label"
                      :value="Number(item.value)"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="岗位描述" prop="description">
                      <el-input type="textarea"
                                v-model="queryParams.description"
                                placeholder="岗位描述"
                      />
                </el-form-item>
<!--                <el-form-item label="创建时间" prop="createTime">-->
<!--                      <el-date-picker-->
<!--                          v-model="queryParams.createTime"-->
<!--                          type="datetime"-->
<!--                          placeholder="创建时间"-->
<!--                          value-format="YYYY-MM-DD HH:mm:ss"-->
<!--                      />-->
<!--                </el-form-item>-->
<!--                <el-form-item label="更新时间" prop="updateTime">-->
<!--                      <el-date-picker-->
<!--                          v-model="queryParams.updateTime"-->
<!--                          type="datetime"-->
<!--                          placeholder="更新时间"-->
<!--                          value-format="YYYY-MM-DD HH:mm:ss"-->
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
      <div class="mb-10px">
        <el-button
            v-hasPerm="['aioveuPosition:aioveu-position:add']"
            type="success"
            @click="handleOpenDialog()"
        >
          <template #icon><Plus /></template>
          新增
        </el-button>
        <el-button
            v-hasPerm="['aioveuPosition:aioveu-position:delete']"
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
                    <el-table-column
                        key="positionId"
                        label="岗位ID"
                        prop="positionId"
                        min-width="150"
                        align="center"
                    />
                    <el-table-column
                        key="positionName"
                        label="岗位名称"
                        prop="positionName"
                        min-width="150"
                        align="center"
                    />
        <!-- 修改：将所属部门ID改为所属部门名称 -->
                    <el-table-column
                      key="deptName"
                      label="所属部门"
                      prop="deptName"
                      min-width="150"
                      align="center"
                    />
                    <el-table-column
                      label="职级(1-10)"
                      min-width="150"
                      align="center"
                    >
                      <template #default="scope">
                        <DictLabel v-model="scope.row.positionLevel" code="position_level" />
                      </template>
                    </el-table-column>
                    <el-table-column
                        key="description"
                        label="岗位描述"
                        prop="description"
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
                v-hasPerm="['aioveuPosition:aioveu-position:edit']"
                type="primary"
                size="small"
                link
                @click="handleOpenDialog(scope.row.positionId)"
            >
              <template #icon><Edit /></template>
              编辑
            </el-button>
            <el-button
                v-hasPerm="['aioveuPosition:aioveu-position:delete']"
                type="danger"
                size="small"
                link
                @click="handleDelete(scope.row.positionId)"
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

    <!-- 公司岗位信息表单弹窗 -->
    <el-dialog
        v-model="dialog.visible"
        :title="dialog.title"
        width="500px"
        @close="handleCloseDialog"
    >
      <el-form ref="dataFormRef" :model="formData" :rules="rules" label-width="100px">
                <el-form-item label="岗位名称" prop="positionName">
                      <el-input
                          v-model="formData.positionName"
                          placeholder="岗位名称"
                      />
                </el-form-item>
<!--                <el-form-item label="所属部门" prop="deptName">-->
<!--                  <el-input-->
<!--                    v-model="formData.deptName"-->
<!--                    placeholder="所属部门"-->
<!--                  />-->
<!--                </el-form-item>-->

                <el-form-item label="所属部门" prop="deptName">
                  <el-select
                    v-model="formData.deptName"
                    placeholder="请选择部门"
                    clearable
                    filterable
                    @keyup.enter="handleQuery()"
                  >
                    <!-- 遍历部门选项列表 -->
                    <!-- 使用部门ID作为唯一键，确保高效渲染 -->
                    <!-- 显示部门名称作为选项标签 -->
                    <!-- 使用部门ID作为选项值 -->
                    <el-option
                      v-for="dept in deptOptions"
                      :key="dept.deptId"
                      :label="dept.deptName"
                      :value="dept.deptName"
                    />
                  </el-select>
                </el-form-item>


                <el-form-item label="职级" prop="positionLevel">
                  <el-select
                    v-model="formData.positionLevel"
                    placeholder="职级"
                    clearable
                  >
                    <el-option
                      v-for="item in positionLevelOptions"
                      :key="Number(item.value)"
                      :label="item.label"
                      :value="Number(item.value)"
                    />
                  </el-select>
                </el-form-item>

                <el-form-item label="岗位描述" prop="description">
                      <el-input type="textarea"
                                v-model="formData.description"
                                placeholder="岗位描述"
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
    name: "AioveuPosition",
    inheritAttrs: false,
  });

  import AioveuPositionAPI, { AioveuPositionPageVO, AioveuPositionForm, AioveuPositionPageQuery ,PositionOptionVO} from "@/api/aioveuPosition/aioveu-position";
  // 新增：导入部门API
  import AioveuDepartmentAPI, { DeptOptionVO } from "@/api/aioveuDepartment/aioveu-department";
  // 导入字典值
  import DictAPI,{ DictItemOption } from '@/api/system/dict.api'
  const queryFormRef = ref();
  const dataFormRef = ref();

  const loading = ref(false);
  const removeIds = ref<number[]>([]);
  const total = ref(0);

  // 新增：部门选项
  const deptOptions = ref<DeptOptionVO[]>([]);
  const positionOptions = ref<PositionOptionVO[]>([]);

  const queryParams = reactive<AioveuPositionPageQuery>({
    pageNum: 1,
    pageSize: 10,
  });

  // 公司岗位信息表格数据
  const pageData = ref<AioveuPositionPageVO[]>([]);

  // 弹窗
  const dialog = reactive({
    title: "",
    visible: false,
  });

  // 选项
  const positionLevelOptions = ref<DictItemOption[]>([])

  // 公司岗位信息表单数据
  const formData = reactive<AioveuPositionForm>({
    /** 岗位名称 */
    positionName:  '',
    /** 所属部门ID */
    deptId:  undefined,
    deptName:'',
    /** 职级(1-10) */
    positionLevel:  undefined,
    /** 岗位描述 */
    description:  undefined


  });

  // 公司岗位信息表单校验规则
  const rules = reactive({
                      positionName: [{ required: true, message: "请输入岗位名称", trigger: "blur" }],
    deptName: [{ required: true, message: "请输入部门名称", trigger: "blur" }],
  });

  /** 查询公司岗位信息 */
  function handleQuery() {
    loading.value = true;
          AioveuPositionAPI.getPage(queryParams)
        .then((data) => {
          pageData.value = data.list;
          total.value = data.total;
        })
        .finally(() => {
          loading.value = false;
        });
  }

  /** 重置公司岗位信息查询 */
  function handleResetQuery() {
    queryFormRef.value!.resetFields();
    queryParams.pageNum = 1;
    handleQuery();
  }

  /** 行复选框选中记录选中ID集合 */
  function handleSelectionChange(selection: AioveuPositionPageVO[]) {
    removeIds.value = selection
      .map(item => item.positionId)
      .filter((positionId): positionId is number => positionId !== undefined && positionId !== null) as number[];
  }

  // 在组件中添加一个变量存储当前编辑的positionId
  const editingpositionId = ref<number | undefined>(undefined);

  /** 打开公司岗位信息弹窗 */
  function handleOpenDialog(positionId?: number) {

    editingpositionId.value = positionId; // 保存员工ID

    if (positionId) {
      dialog.title = "修改公司岗位信息";
            AioveuPositionAPI.getFormData(positionId).then((data) => {
        Object.assign(formData, data);
              //先准备数据，再显示弹窗
              dialog.visible = true;
      });
    } else {
      dialog.title = "新增公司岗位信息";
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

  /** 提交公司岗位信息表单 */
  function handleSubmit() {
    dataFormRef.value.validate((valid: any) => {
      if (valid) {
        loading.value = true;
        const id = editingpositionId.value; // 使用存储的positionId
        if (id) {
                AioveuPositionAPI.update(id, formData)
              .then(() => {
                ElMessage.success("修改成功");
                handleCloseDialog();
                handleResetQuery();
              }) //在API调用结束时重置加载状态
              .finally(() => (loading.value = false));
        } else {
                AioveuPositionAPI.add(formData)
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

  /** 关闭公司岗位信息弹窗 */
  function handleCloseDialog() {
    dialog.visible = false;
    // 关键修复：重置加载状态
    loading.value = false;

    // 延迟重置表单（等待动画完成）
    setTimeout(() => {
    dataFormRef.value.resetFields();
    dataFormRef.value.clearValidate();
    editingpositionId.value = undefined; // 清除positionId
    }, 300);
  }

  /** 删除公司岗位信息 */
  function handleDelete(positionId?: number) {
    const ids = [positionId || removeIds.value].join(",");
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
                AioveuPositionAPI.deleteByIds(ids)
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


// 主要修改点：部门列表加载方法
// 后端返回数据，它是一个直接的对象数组，没有嵌套在data属性下。但是，在我们的请求封装中（可能是使用了axios或类似的库），
// 响应数据通常会被包裹在一个包含data属性的对象中。因此，我们需要检查后端的实际响应结构是否与前端期望的一致。
//如果后端返回的是直接数组，那么在前端请求库的拦截器中可能已经将响应数据放在了response.data中。因此，前端代码中通过response.data获取数据是正确的。

//但是，用户提供的后端返回数据示例是一个数组，而我们在代码中期望response.data也是一个数组。所以，如果后端返回的是直接数组，那么response.data就是这个数组。
  // 主要修改点：部门列表加载方法
  function loadDepartments() {
    loading.value = true;
    AioveuDepartmentAPI.getAllDepartmentOptions()
      .then(response => {
        // 确保响应数据是数组类型
        if (Array.isArray(response)) {
          // 转换数据类型：确保deptId是数字
          deptOptions.value = response.map(dept => ({
            deptId: Number(dept.deptId),
            deptName: dept.deptName
          }));
        } else {
          // 处理非数组响应
          console.error("部门列表响应格式错误:", response);
          ElMessage.error("部门列表格式错误");
        }
      })
      .catch(error => {
        console.error("加载部门列表失败:", error);
        ElMessage.error("加载部门列表失败");
      })
      .finally(() => {
        loading.value = false;
      });
  }

  // 加载字典
  function loadPositionLevelOptions() {
    DictAPI.getDictItems('position_level').then(response => {
      positionLevelOptions.value = response
    })
  }

  function loadPositionOptions() {
    AioveuPositionAPI.getAllPositionOptions().then(response => {
      positionOptions.value = response
    })
  }

  onMounted(() => {
    handleQuery();
    //在 onMounted钩子中调用了 loadDepartments()函数,确保函数被正确使用
    loadDepartments();
    loadPositionLevelOptions();
    loadPositionOptions();
  });
</script>
