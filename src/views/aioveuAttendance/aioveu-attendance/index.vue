<template>
  <div class="app-container">
    <div class="search-container">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true">
                <el-form-item label="考勤ID" prop="attendanceId">
                      <el-input
                          v-model="queryParams.attendanceId"
                          placeholder="考勤ID"
                          clearable
                          @keyup.enter="handleQuery()"
                      />
                </el-form-item>
<!--                <el-form-item label="员工姓名" prop="employeeName">-->
<!--                    <el-input-->
<!--                      v-model="queryParams.employeeName"-->
<!--                      placeholder="员工姓名"-->
<!--                      clearable-->
<!--                      @keyup.enter="handleQuery()"-->
<!--                    />-->
<!--                </el-form-item>-->

                <el-form-item label="员工姓名" prop="employeeName">
                  <el-select
                    v-model="queryParams.employeeName"
                    placeholder="员工姓名"
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
                <el-form-item label="日期" prop="date">
                      <el-date-picker
                          class="!w-[240px]"
                          v-model="queryParams.date"
                          type="daterange"
                          range-separator="~"
                          start-placeholder="开始时间"
                          end-placeholder="结束时间"
                          value-format="YYYY-MM-DD"
                      />
                </el-form-item>
<!--                <el-form-item label="上班打卡时间" prop="checkinTime">-->
<!--                      <el-date-picker-->
<!--                          class="!w-[240px]"-->
<!--                          v-model="queryParams.checkinTime"-->
<!--                          type="daterange"-->
<!--                          range-separator="~"-->
<!--                          start-placeholder="开始时间"-->
<!--                          end-placeholder="结束时间"-->
<!--                          value-format="YYYY-MM-DD"-->
<!--                      />-->
<!--                </el-form-item>-->
<!--                <el-form-item label="下班打卡时间" prop="checkoutTime">-->
<!--                      <el-date-picker-->
<!--                          class="!w-[240px]"-->
<!--                          v-model="queryParams.checkoutTime"-->
<!--                          type="daterange"-->
<!--                          range-separator="~"-->
<!--                          start-placeholder="开始时间"-->
<!--                          end-placeholder="结束时间"-->
<!--                          value-format="YYYY-MM-DD"-->
<!--                      />-->
<!--                </el-form-item>-->
                <el-form-item label="工作时长(小时)" prop="workHours">
                      <el-input
                          v-model="queryParams.workHours"
                          placeholder="工作时长(小时)"
                          clearable
                          @keyup.enter="handleQuery()"
                      />
                </el-form-item>
                <el-form-item label="考勤状态" prop="status">
                    <el-select
                      v-model="queryParams.status"
                      placeholder="请选择考勤状态"
                      clearable
                      filterable
                      @keyup.enter="handleQuery()"
                    >
                      <!--  Element UI的选择框默认宽度会根据内容自动调整 -->
                      <!-- 当有filterable属性时，选择框会扩展以容纳输入框-->
                      <el-option
                        v-for="attendance_status in attendance_statusOptions"
                        :key="attendance_status.value"
                        :label="attendance_status.label"
                        :value="attendance_status.value"
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
      <div class="mb-10px">
        <el-button
            v-hasPerm="['aioveuAttendance:aioveu-attendance:add']"
            type="success"
            @click="handleOpenDialog()"
        >
          <template #icon><Plus /></template>
          新增
        </el-button>
        <el-button
            v-hasPerm="['aioveuAttendance:aioveu-attendance:delete']"
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
                        key="attendanceId"
                        label="考勤ID"
                        prop="attendanceId"
                        min-width="150"
                        align="center"
                    />
                    <!-- 修改：将员工ID改为员工姓名 -->
                    <el-table-column
                      key="employeeName"
                      label="员工姓名"
                      prop="employeeName"
                      min-width="150"
                      align="center"
                    />
                    <el-table-column
                        key="date"
                        label="日期"
                        prop="date"
                        min-width="150"
                        align="center"
                    />
                    <el-table-column
                        key="checkinTime"
                        label="上班打卡时间"
                        prop="checkinTime"
                        min-width="150"
                        align="center"
                    />
                    <el-table-column
                        key="checkoutTime"
                        label="下班打卡时间"
                        prop="checkoutTime"
                        min-width="150"
                        align="center"
                    />
                    <el-table-column
                        key="workHours"
                        label="工作时长(小时)"
                        prop="workHours"
                        min-width="150"
                        align="center"
                    />
                    <el-table-column
                      label="考勤状态"
                      min-width="150"
                      align="center"
                    >
                      <!--  <template #default="scope">：使用Vue的插槽(slot)来自定义列的内容 -->
                      <!-- #default：这是Element UI表格列的默认插槽，用于自定义单元格显示内容-->
                      <!-- scope：是一个对象，包含当前行的数据（scope.row）和其他表格信息-->
                      <!--  DictLabel： likely是一个自定义组件，用于根据字典代码和值显示对应的标签文本 -->
                      <!-- v-model="scope.row.status"：双向绑定当前行数据中的status字段值（可能是数字或代码值）-->
                      <template #default="scope">
                        <DictLabel v-model="scope.row.status" code="attendance_status" />
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
                v-hasPerm="['aioveuAttendance:aioveu-attendance:edit']"
                type="primary"
                size="small"
                link
                @click="handleOpenDialog(scope.row.attendanceId)"
            >
              <template #icon><Edit /></template>
              编辑
            </el-button>
            <el-button
                v-hasPerm="['aioveuAttendance:aioveu-attendance:delete']"
                type="danger"
                size="small"
                link
                @click="handleDelete(scope.row.attendanceId)"
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

    <!-- 考勤信息表单弹窗 -->
    <el-dialog
        v-model="dialog.visible"
        :title="dialog.title"
        width="500px"
        @close="handleCloseDialog"
    >
      <el-form ref="dataFormRef" :model="formData" :rules="rules" label-width="100px">

<!--                <el-form-item label="员工姓名" prop="employeeName">-->
<!--                  <el-input-->
<!--                    v-model="formData.employeeName"-->
<!--                    placeholder="员工姓名"-->
<!--                  />-->
<!--                </el-form-item>-->

                <el-form-item label="员工姓名" prop="employeeName">
                  <el-select
                    v-model="formData.employeeName"
                    placeholder="员工姓名"
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

                <el-form-item label="日期" prop="date">
                      <el-date-picker
                          class="!w-[240px]"
                          v-model="formData.date"
                          type="date"
                          placeholder="日期"
                          value-format="YYYY-MM-DD"
                      />
                </el-form-item>

                <el-form-item label="上班打卡时间" prop="checkinTime">
                      <el-date-picker
                          class="!w-[240px]"
                          v-model="formData.checkinTime"
                          type="datetime"
                          placeholder="上班打卡时间"
                          value-format="YYYY-MM-DD HH:mm:ss"
                      />
                </el-form-item>

                <el-form-item label="下班打卡时间" prop="checkoutTime">
                      <el-date-picker
                          class="!w-[240px]"
                          v-model="formData.checkoutTime"
                          type="datetime"
                          placeholder="下班打卡时间"
                          value-format="YYYY-MM-DD HH:mm:ss"
                      />
                </el-form-item>

                <el-form-item label="工作时长" prop="workHours">
                      <el-input
                          v-model="formData.workHours"
                          placeholder="工作时长(小时)"
                      />
                </el-form-item>

                <el-form-item label="考勤状态" prop="status">
                  <dict v-model="formData.status" code="attendance_status" />
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
    name: "AioveuAttendance",
    inheritAttrs: false,
  });

  import AioveuAttendanceAPI, { AioveuAttendancePageVO, AioveuAttendanceForm, AioveuAttendancePageQuery } from "@/api/aioveuAttendance/aioveu-attendance";

  // 新增：导入部门API
  import AioveuEmployeeAPI, { EmployeeOptionVO } from "@/api/aioveuEmployee/aioveu-employee";

  // 导入字典值
  import DictAPI,{ DictItemOption } from '@/api/system/dict.api'

  const queryFormRef = ref();
  const dataFormRef = ref();

  const loading = ref(false);
  const removeIds = ref<number[]>([]);
  const total = ref(0);

  const queryParams = reactive<AioveuAttendancePageQuery>({
    pageNum: 1,
    pageSize: 10,
  });

  // 考勤状态选项
  const attendance_statusOptions = ref<DictItemOption[]>([])

  // 加载考勤状态字典
  function loadattendance_status() {
    DictAPI.getDictItems('attendance_status').then(response => {
      attendance_statusOptions.value = response
    })
  }

  // 新增：员工选项
  const employeeOptions = ref<EmployeeOptionVO[]>([]);

  // 考勤信息表格数据
  const pageData = ref<AioveuAttendancePageVO[]>([]);

  // 弹窗
  const dialog = reactive({
    title: "",
    visible: false,
  });

  // 考勤信息表单数据
  const formData = reactive<AioveuAttendanceForm>({});

  // 考勤信息表单校验规则
  const rules = reactive({
                      employeeName: [{ required: true, message: "请输入员工", trigger: "blur" }],
                      date: [{ required: true, message: "请输入日期", trigger: "blur" }],
                      workHours: [{ required: true, message: "请输入工作时长(小时)", trigger: "blur" }],
                      status: [{ required: true, message: "请输入考勤状态", trigger: "blur" }],
  });

  /** 查询考勤信息 */
  function handleQuery() {
    loading.value = true;
          AioveuAttendanceAPI.getPage(queryParams)
        .then((data) => {
          pageData.value = data.list;
          total.value = data.total;
        })
        .finally(() => {
          loading.value = false;
        });
  }

  /** 重置考勤信息查询 */
  function handleResetQuery() {
    queryFormRef.value!.resetFields();
    queryParams.pageNum = 1;
    handleQuery();
  }

  /** 行复选框选中记录选中ID集合 */
  function handleSelectionChange(selection: AioveuAttendancePageVO[]) {
    removeIds.value = selection
      .map(item => item.attendanceId)
      .filter((attendanceId): attendanceId is number => attendanceId !== undefined && attendanceId !== null) as number[];
  }

  // 在组件中添加一个变量存储当前编辑的ID
  const editingAttendanceId = ref<number | undefined>(undefined);

  /** 打开考勤信息弹窗 */
  function handleOpenDialog(attendanceId?: number) {

    editingAttendanceId.value = attendanceId; // 保存ID

    if (attendanceId) {
      dialog.title = "修改考勤信息";
            AioveuAttendanceAPI.getFormData(attendanceId).then((data) => {
        Object.assign(formData, data);
              dialog.visible = true;
      });
    } else {
      dialog.title = "新增考勤信息";

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

  /** 提交考勤信息表单 */
  function handleSubmit() {
    dataFormRef.value.validate((valid: any) => {
      if (valid) {
        loading.value = true;
        const id = editingAttendanceId.value; // 使用存储的ID
        if (id) {
                AioveuAttendanceAPI.update(id, formData)
              .then(() => {
                ElMessage.success("修改成功");
                handleCloseDialog();
                handleResetQuery();
              })
              .finally(() => (loading.value = false));
        } else {
                AioveuAttendanceAPI.add(formData)
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

  /** 关闭考勤信息弹窗 */
  function handleCloseDialog() {
    dialog.visible = false;
    // 关键修复：在关闭弹窗时重置加载状态
    loading.value = false;
    // 延迟重置表单（等待动画完成）
    setTimeout(() => {
    dataFormRef.value.resetFields();
    dataFormRef.value.clearValidate();
    // 清除编辑ID
    editingAttendanceId.value = undefined;
    }, 300);
  }

  /** 删除考勤信息 */
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
                AioveuAttendanceAPI.deleteByIds(ids)
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

  // 主要修改点：列表加载方法
  function loadEmployees() {
    loading.value = true;
    AioveuEmployeeAPI.getAllEmployeeOptions()
      .then(response => {
        // 确保响应数据是数组类型
        if (Array.isArray(response)) {
          // 转换数据类型：确保employeeId是数字
          employeeOptions.value = response.map(employee => ({
            employeeId: Number(employee.employeeId),
            employeeName: employee.employeeName
          }));
        } else {
          // 处理非数组响应
          console.error("员工列表响应格式错误:", response);
          ElMessage.error("员工列表格式错误");
        }
      })
      .catch(error => {
        console.error("加载员工列表失败:", error);
        ElMessage.error("加载员工列表失败");
      })
      .finally(() => {
        loading.value = false;
      });
  }

  onMounted(() => {
    handleQuery();
    //在 onMounted钩子中调用了 loadEmployees()函数,确保函数被正确使用
    loadEmployees();

    loadattendance_status();
  });
</script>
