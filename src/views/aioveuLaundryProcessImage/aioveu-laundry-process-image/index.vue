<template>
  <div class="app-container">
    <div class="search-container">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true">
<!--                <el-form-item label="图片记录ID" prop="id">-->
<!--                      <el-input-->
<!--                          v-model="queryParams.id"-->
<!--                          placeholder="图片记录ID"-->
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
                          v-for="item in orderOption"
                          :key="item.orderId"
                          :label="item.orderNo"
                          :value="item.orderId"
                        />
                      </el-select>
                    </el-form-item>

<!--                <el-form-item label="衣物明细ID" prop="itemId">-->
<!--                      <el-input-->
<!--                          v-model="queryParams.itemId"-->
<!--                          placeholder="衣物明细ID"-->
<!--                          clearable-->
<!--                          @keyup.enter="handleQuery()"-->
<!--                      />-->
<!--                </el-form-item>-->

                    <el-form-item label="衣物明细" prop="itemId">
                      <el-select
                        v-model="queryParams.itemId"
                        placeholder="请选择衣物明细"
                        clearable
                        filterable
                        @keyup.enter="handleQuery()"
                      >
                        <el-option
                          v-for="item in itemOption"
                          :key="item.itemId"
                          :label="item.problemDesc"
                          :value="item.itemId"
                        />
                      </el-select>
                    </el-form-item>

<!--                <el-form-item label="图片类型" prop="imageType">-->
<!--                      <el-input-->
<!--                          v-model="queryParams.imageType"-->
<!--                          placeholder="图片类型"-->
<!--                          clearable-->
<!--                          @keyup.enter="handleQuery()"-->
<!--                      />-->
<!--                </el-form-item>-->

                    <el-form-item label="图片类型" prop="imageType">
                      <el-select
                        v-model="queryParams.imageType"
                        placeholder="图片类型"
                        clearable
                        filterable
                        @keyup.enter="handleQuery()"
                      >
                        <el-option
                          v-for="item in imageTypeOptions"
                          :key="Number(item.value)"
                          :label="item.label"
                          :value="Number(item.value)"
                        />
                      </el-select>
                    </el-form-item>

<!--                <el-form-item label="上传人ID" prop="uploadUser">-->
<!--                      <el-input-->
<!--                          v-model="queryParams.uploadUser"-->
<!--                          placeholder="上传人ID"-->
<!--                          clearable-->
<!--                          @keyup.enter="handleQuery()"-->
<!--                      />-->
<!--                </el-form-item>-->

                <el-form-item label="上传人" prop="uploadUser">
                  <el-select
                    v-model="queryParams.uploadUser"
                    placeholder="上传人"
                    clearable
                    filterable
                    @keyup.enter="handleQuery()"
                  >
                    <el-option
                      v-for="item in employeeOption"
                      :key="item.employeeId"
                      :label="item.employeeName"
                      :value="item.employeeId"
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
            v-hasPerm="['aioveuLaundryProcessImage:aioveu-laundry-process-image:add']"
            type="success"
            @click="handleOpenDialog()"
        >
          <template #icon><Plus /></template>
          新增
        </el-button>
        <el-button
            v-hasPerm="['aioveuLaundryProcessImage:aioveu-laundry-process-image:delete']"
            type="danger"
            :disabled="removeIds.length === 0"
            @click="handleDelete()"
        >
          <template #icon><Delete /></template>
          删除
        </el-button>

        <!-- 添加导入导出按钮 -->
        <el-button
          type="primary"
          @click="handleImportClick"
          v-hasPerm="['aioveuLaundryProcessImage:aioveu-laundry-process-image:import']"
        >
          <template #icon><Upload /></template>
          导入
        </el-button>

        <el-button
          type="primary"
          @click="handleExportClick"
          v-hasPerm="['aioveuLaundryProcessImage:aioveu-laundry-process-image:export']"
        >
          <template #icon><Download /></template>
          导出
        </el-button>

        <el-button
          type="primary"
          @click="handleDownloadTemplate"
          v-hasPerm="['aioveuLaundryProcessImage:aioveu-laundry-process-image:template']"
        >
          <template #icon><Download /></template>
          下载模板
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
<!--                        label="图片记录ID"-->
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

                    <el-table-column
                      key="orderNo"
                      label="订单号"
                      prop="orderNo"
                      min-width="150"
                      align="center"
                    />

<!--                    <el-table-column-->
<!--                        key="itemId"-->
<!--                        label="衣物明细ID"-->
<!--                        prop="itemId"-->
<!--                        min-width="150"-->
<!--                        align="center"-->
<!--                    />-->

                    <el-table-column
                      key="problemDesc"
                      label="衣物明细"
                      prop="problemDesc"
                      min-width="150"
                      align="center"
                    />

<!--                    <el-table-column-->
<!--                        key="imageType"-->
<!--                        label="图片类型"-->
<!--                        prop="imageType"-->
<!--                        min-width="150"-->
<!--                        align="center"-->
<!--                    />-->

                    <el-table-column
                      label="图片类型"
                      min-width="150"
                      align="center"
                    >
                      <template #default="scope">
                        <DictLabel v-model="scope.row.imageType" code="laundry_process_image_image_type" />
                      </template>
                    </el-table-column>

<!--                    <el-table-column-->
<!--                        key="imageUrl"-->
<!--                        label="图片路径"-->
<!--                        prop="imageUrl"-->
<!--                        min-width="250"-->
<!--                        align="center"-->
<!--                    />-->

                    <el-table-column
                      key="imageUrl"
                      label="图片"
                      min-width="250"
                      align="center"
                    >
                      <template #default="scope">
                        <el-image
                          style="width: 80px; height: 80px;"
                          :src="scope.row.imageUrl"
                          :preview-src-list="[scope.row.imageUrl]"
                          fit="cover"
                          lazy
                          :scroll-container="'.el-table__body-wrapper'"
                          :preview-teleported="true"
                          hide-on-click-modal
                        >
                          <template #placeholder>
                            <div class="image-loading">
                              <el-icon><Loading /></el-icon>
                            </div>
                          </template>
                          <template #error>
                            <div class="image-error">
                              <el-icon><Picture /></el-icon>
                              <span>加载失败</span>
                            </div>
                          </template>
                        </el-image>
                      </template>
                    </el-table-column>


<!--                    <el-table-column-->
<!--                        key="uploadUser"-->
<!--                        label="上传人ID"-->
<!--                        prop="uploadUser"-->
<!--                        min-width="150"-->
<!--                        align="center"-->
<!--                    />-->

                    <el-table-column
                      key="uploadUserName"
                      label="上传人"
                      prop="uploadUserName"
                      min-width="150"
                      align="center"
                    />

                    <el-table-column
                        key="description"
                        label="图片描述"
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
                v-hasPerm="['aioveuLaundryProcessImage:aioveu-laundry-process-image:edit']"
                type="primary"
                size="small"
                link
                @click="handleOpenDialog(scope.row.id)"
            >
              <template #icon><Edit /></template>
              编辑
            </el-button>
            <el-button
                v-hasPerm="['aioveuLaundryProcessImage:aioveu-laundry-process-image:delete']"
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

    <!-- 洗衣流程图片记录表单弹窗 -->
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

                    <el-form-item label="订单号" prop="orderId">
                      <el-select
                        v-model="formData.orderId"
                        placeholder="请选择订单号"
                        clearable
                        filterable
                        @change="handleOrderChange"
                      >
                        <el-option
                          v-for="item in orderOption"
                          :key="item.orderId"
                          :label="item.orderNo"
                          :value="item.orderId"
                        />
                      </el-select>
                    </el-form-item>


<!--                <el-form-item label="衣物明细ID" prop="itemId">-->
<!--                      <el-input-->
<!--                          v-model="formData.itemId"-->
<!--                          placeholder="衣物明细ID"-->
<!--                      />-->
<!--                </el-form-item>-->



                      <el-form-item label="衣物明细" prop="itemId">
                        <el-select
                          v-model="formData.itemId"
                          placeholder="请选择衣物明细"
                          clearable
                          filterable
                          :disabled="!formData.orderId"
                        >

                          <el-option
                            v-if="filteredItemOptions.length === 0"
                            disabled
                            label="该订单下无衣物明细"
                            value=""
                          />

                          <el-option
                            v-for="item in filteredItemOptions"
                            :key="item.itemId"
                            :label="item.problemDesc"
                            :value="item.itemId"
                          />
                        </el-select>
                      </el-form-item>


<!--                <el-form-item label="图片类型" prop="imageType">-->
<!--                      <el-input-->
<!--                          v-model="formData.imageType"-->
<!--                          placeholder="图片类型"-->
<!--                      />-->
<!--                </el-form-item>-->

                    <el-form-item label="图片类型" prop="imageType">
                      <el-select
                        v-model="formData.imageType"
                        placeholder="请选择图片类型"
                        clearable
                        filterable
                      >
                        <el-option
                          v-for="item in imageTypeOptions"
                          :key="Number(item.value)"
                          :label="item.label"
                          :value="Number(item.value)"
                        />
                      </el-select>
                    </el-form-item>


<!--                <el-form-item label="图片路径" prop="imageUrl">-->
<!--                      <el-input-->
<!--                          v-model="formData.imageUrl"-->
<!--                          placeholder="图片路径"-->
<!--                      />-->
<!--                </el-form-item>-->

                <el-form>
                  <el-form-item label="单图上传">
                    <SingleImageUpload
                      v-model="formData.imageUrl"
                      :maxFileSize="5"
                      accept=".jpg,.jpeg,.png"
                      :style="{ width: '200px', height: '200px' }"
                      @upload-success="handleUploadSuccess"
                    />
                    <div >
                      最大图片大小：5MB，支持格式：JPG、JPEG、PNG
                    </div>
                  </el-form-item>

                </el-form>

<!--                <el-form-item label="上传人ID" prop="uploadUser">-->
<!--                      <el-input-->
<!--                          v-model="formData.uploadUser"-->
<!--                          placeholder="上传人ID"-->
<!--                      />-->
<!--                </el-form-item>-->

                    <el-form-item label="上传人" prop="uploadUser">
                      <el-select
                        v-model="formData.uploadUser"
                        placeholder="请选择上传人"
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

                <el-form-item label="图片描述" prop="description">
                      <el-input
                          v-model="formData.description"
                          placeholder="图片描述"
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

    <!-- 添加导入导出弹窗（使用PageContent组件） 在模板中，
    组件名应该使用 PascalCase（大驼峰）命名。但是，我们使用的组件名是 page-content（短横线命名）。
    我们可以通过 ESLint 配置忽略这个规则，或者修改组件名为 PascalCase。
    但是，由于我们引入的组件名就是 PageContent（在导入时已经使用 PascalCase），在模板中使用 <PageContent>即可。-->
<!--    <PageContent-->
<!--      ref="pageContentRef"-->
<!--      :content-config="pageContentConfig"-->
<!--      style="display: none;"-->
<!--    />-->

    <!--问题出在 PageContent 组件的初始化上。该组件在初始化时可能会执行一些操作（如数据请求或 DOM 操作），这些操作可能会影响页面的渲染性能，尤其是在隐藏状态下。    -->
    <!-- 修改 PageContent 组件渲染方式 -->
    <div v-if="showPageContent" style="display: none;">
      <PageContent
        ref="pageContentRef"
        :content-config="pageContentConfig"
      />
    </div>


  </div>
</template>

<script setup lang="ts">
  import { FileInfo } from "@/api/file.api";

  defineOptions({
    name: "AioveuLaundryProcessImage",
    inheritAttrs: false,
  });

  import AioveuLaundryProcessImageAPI, { AioveuLaundryProcessImagePageVO, AioveuLaundryProcessImageForm, AioveuLaundryProcessImagePageQuery } from "@/api/aioveuLaundryProcessImage/aioveu-laundry-process-image";
  import AioveuLaundryOrderAPI, {AioveuLaundryOrderOptionVO} from "@/api/aioveuLaundryOrder/aioveu-laundry-order";
  import AioveuLaundryOrderItemAPI, {AioveuLaundryOrderItemOption} from "@/api/aioveuLaundryOrderItem/aioveu-laundry-order-item";
  import AioveuEmployeeAPI, {EmployeeOptionVO} from "@/api/aioveuEmployee/aioveu-employee";
  import DictAPI,{ DictItemOption } from '@/api/system/dict.api'



  // 单图
  // const picUrl = ref("https://minio.aioveu.com/aioveu/20250810/352485413d814dee87d9b7160dfe916e.png");
  // const picUrls = ref(["https://minio.aioveu.com/aioveu/20250810/352485413d814dee87d9b7160dfe916e.png",
  //   "https://minio.aioveu.com/aioveu/20250810/352485413d814dee87d9b7160dfe916e.png"]);


  const handleUploadSuccess = (fileInfo: FileInfo) => {
    console.log('上传成功:', fileInfo);
  };

  const queryFormRef = ref();
  const dataFormRef = ref();

  const loading = ref(false);
  const removeIds = ref<number[]>([]);
  const total = ref(0);

  const imageTypeOptions = ref<DictItemOption[]>([])
  // 新增：选项
  const orderOption = ref<AioveuLaundryOrderOptionVO[]>([]);  // 新增：选项

  // 所有的衣物明细选项
  const itemOption = ref<AioveuLaundryOrderItemOption[]>([]);

  // 过滤后的衣物明细选项
  const filteredItemOptions = ref<AioveuLaundryOrderItemOption[]>([]);



  const employeeOption = ref<EmployeeOptionVO[]>([]);

  // 加载选项
  function loadOptions() {
    AioveuLaundryOrderAPI.getAllLaundryOrderOptions().then(response => {
      orderOption.value = response
    })
    AioveuLaundryOrderItemAPI.getAllLaundryOrderItemOptions().then(response => {
      itemOption.value = response
    })
    AioveuEmployeeAPI.getAllEmployeeOptions().then(response => {
      employeeOption.value = response
    })
    DictAPI.getDictItems('laundry_process_image_image_type').then(response => {
      imageTypeOptions.value = response
    })
  }

  // 添加处理订单变化的方法
  function handleOrderChange(orderId: number | undefined) {
    // // 重置衣物明细选择
    // formData.itemId = undefined;

    if (!orderId) {
      // 如果没有选择订单，显示所有明细
      filteredItemOptions.value = [...itemOption.value];
    } else {
      // 获取选中的订单号
      const selectedOrder = orderOption.value.find(order => order.orderId === orderId);


      if (selectedOrder) {
        const orderNo = selectedOrder.orderNo;

        // 过滤出描述中包含订单号的明细
        filteredItemOptions.value = itemOption.value.filter(
          item => item.problemDesc.includes(orderNo)
        );
        console.log(`筛选订单号: ${orderNo}, 匹配到 ${filteredItemOptions.value.length} 个明细`);
      } else {
        // 如果没有找到对应的订单，则清空明细选项
        filteredItemOptions.value = [];
      }

    }
  }

  const queryParams = reactive<AioveuLaundryProcessImagePageQuery>({
    pageNum: 1,
    pageSize: 10,
  });

  // 洗衣流程图片记录表格数据
  const pageData = ref<AioveuLaundryProcessImagePageVO[]>([]);

  // 弹窗
  const dialog = reactive({
    title: "",
    type: " ",// 'recharge', 'add', 'edit'
    visible: false,
  });

  // 洗衣流程图片记录表单数据
  const formData = reactive<AioveuLaundryProcessImageForm>({});

  // 洗衣流程图片记录表单校验规则
  const rules = reactive({
                      orderId: [{ required: true, message: "请输入订单ID", trigger: "blur" }],
                      imageType: [{ required: true, message: "请输入图片类型", trigger: "blur" }],
                      imageUrl: [{ required: true, message: '请上传图片', trigger: 'change' }
    ]
  });

  /** 查询洗衣流程图片记录 */
  function handleQuery() {
    loading.value = true;
          AioveuLaundryProcessImageAPI.getPage(queryParams)
        .then((data) => {
          pageData.value = data.list;
          total.value = data.total;
        })
        .finally(() => {
          loading.value = false;
        });
  }

  /** 重置洗衣流程图片记录查询 */
  function handleResetQuery() {
    queryFormRef.value!.resetFields();
    queryParams.pageNum = 1;
    handleQuery();
  }

  /** 行复选框选中记录选中ID集合 */
  function handleSelectionChange(selection: any) {
    removeIds.value = selection.map((item: any) => item.id);
  }

//------------------------------------------------------------------------

  import PageContent from '@/components/CURD/PageContent.vue';

  // 创建PageContent组件的引用
  const pageContentRef = ref();

  // 控制 PageContent 组件显示
  const showPageContent = ref(false);


  //我们不需要在页面上显示PageContent组件的表格内容，因此我们可以通过样式控制只显示其弹窗部分。
  //为了确保组件的功能正常，我们仍然需要将其渲染在DOM中，只是不显示其表格内容。我们可以通过样式控制隐藏其表格内容，只保留弹窗功能。
  //更简单的方式是：我们不需要在页面上显示PageContent组件的任何内容，只需要它的弹窗功能。因此，我们可以将其隐藏（display:none），然后通过ref调用它的方法打开弹窗。
  //能会担心隐藏组件是否会影响弹窗的显示。实际上，弹窗是挂载在body上的，所以即使组件隐藏了，弹窗仍然会正常显示。
  //我们保持之前的方案：隐藏PageContent组件，然后通过ref调用它的方法打开导入导出弹窗。
  //建议保持隐藏，因为弹窗是独立于组件的，不会受到影响。

  // 配置PageContent组件 - 使用更安全的配置
  const pageContentConfig = ref({
    pk: 'id',
    permPrefix: 'aioveuLaundryProcessImage',

    // 添加一个空的列配置以满足类型要求
    cols: [],

    // // 只需要配置导入导出相关功能  // 使用正确的工具栏按钮配置
    // toolbar: [
    //   { name: 'import', text: '导入', perm: 'import' },
    //   { name: 'export', text: '导出', perm: 'export' }
    // ],

    toolbar: ['import', 'export'] as any, // 使用类型断言

    // 数据请求方法（用于导出）
    indexAction: async () => {
      // 返回空数据，避免初始化时调用API
      return {
        list: [],
        total: 0
      };
    },

    // 导出方法
    exportAction: async (params: any) => {
      return AioveuLaundryProcessImageAPI.exportData(params);
    },

    // 导入方法
    importAction: async (file: File) => {
      return AioveuLaundryProcessImageAPI.importData(file);
    },

    // 导入模板下载
    importTemplate: '/api/aioveu-laundry-process-image/import-template',

    // 隐藏表格内容
    hideTable: true

  });

  // 处理导入点击
  const handleImportClick = () => {
    // 确保组件已加载
    if (!showPageContent.value) {
      showPageContent.value = true;
      // 等待组件渲染完成
      setTimeout(() => {
        if (pageContentRef.value) {
          pageContentRef.value.handleOpenImportModal();
        }
      }, 100);
    } else if (pageContentRef.value) {
      pageContentRef.value.handleOpenImportModal();
    }
  };

  // 处理导出点击
  const handleExportClick = () => {
    // 确保组件已加载
    if (!showPageContent.value) {
      showPageContent.value = true;
      // 等待组件渲染完成
      setTimeout(() => {
        if (pageContentRef.value) {
          pageContentRef.value.handleOpenExportsModal(queryParams);
        }
      }, 100);
    } else if (pageContentRef.value) {
      pageContentRef.value.handleOpenExportsModal(queryParams);
    }
  };

  // 下载导入模板
  const handleDownloadTemplate = async () => {
    try {
      const response = await AioveuLaundryProcessImageAPI.downloadTemplate();

      // 创建下载链接
      const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = '洗衣流程图片记录模板.xlsx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      ElMessage.error('模板下载失败');
      console.error('模板下载错误:', error);
    }
  };
  //------------------------------------------------------------------------
  /** 打开洗衣流程图片记录弹窗 */
  function handleOpenDialog(id?: number) {
    // dialog.visible = true;
    if (id) {
      dialog.title = "修改洗衣流程图片记录";
            AioveuLaundryProcessImageAPI.getFormData(id).then((data) => {
        Object.assign(formData, data);

              // 根据已有的订单ID初始化过滤选项
              if (formData.orderId) {
                handleOrderChange(formData.orderId);
              }

        dialog.type = 'edit'; // 标记为编辑操作
              //先准备数据，再显示弹窗
              dialog.visible = true;
      });
    } else {
      dialog.title = "新增洗衣流程图片记录";
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

  /** 提交洗衣流程图片记录表单 */
  function handleSubmit() {
    dataFormRef.value.validate((valid: any) => {
      if (valid) {
        loading.value = true;
        const id = formData.id;
        if (id) {
                AioveuLaundryProcessImageAPI.update(id, formData)
              .then(() => {
                ElMessage.success("修改成功");
                handleCloseDialog();
                handleResetQuery();
              })
              .finally(() => (loading.value = false));
        } else {
                AioveuLaundryProcessImageAPI.add(formData)
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

  /** 关闭洗衣流程图片记录弹窗 */
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

  /** 删除洗衣流程图片记录 */
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
                AioveuLaundryProcessImageAPI.deleteByIds(ids)
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

    // 延迟加载 PageContent 组件，避免影响页面渲染
    setTimeout(() => {
      showPageContent.value = true;
    }, 500);

  });
</script>
