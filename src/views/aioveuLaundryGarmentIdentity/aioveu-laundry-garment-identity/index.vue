<template>
  <div class="app-container">
    <div class="search-container">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true">
<!--                <el-form-item label="衣物唯一编码ID" prop="id">-->
<!--                      <el-input-->
<!--                          v-model="queryParams.id"-->
<!--                          placeholder="衣物唯一编码ID"-->
<!--                          clearable-->
<!--                          @keyup.enter="handleQuery()"-->
<!--                      />-->
<!--                </el-form-item>-->
<!--                <el-form-item label="衣物唯一编码" prop="garmentCode">-->
<!--                      <el-input-->
<!--                          v-model="queryParams.garmentCode"-->
<!--                          placeholder="衣物唯一编码"-->
<!--                          clearable-->
<!--                          @keyup.enter="handleQuery()"-->
<!--                      />-->
<!--                </el-form-item>-->

                <el-form-item label="衣物唯一编码" prop="garmentCode">
                  <el-select
                    v-model="queryParams.garmentCode"
                    placeholder="请选择衣物唯一编码"
                    clearable
                    filterable
                    @keyup.enter="handleQuery()"
                  >
                    <el-option
                      v-for="item in laundryGarmentIdentityOption"
                      :key="item.garmentCode"
                      :label="item.garmentCode"
                      :value="item.garmentCode"
                    />
                  </el-select>
                </el-form-item>

<!--                <el-form-item label="关联订单明细" prop="garmentOrderDetailId">-->
<!--                      <el-input-->
<!--                          v-model="queryParams.garmentOrderDetailId"-->
<!--                          placeholder="关联订单明细"-->
<!--                          clearable-->
<!--                          @keyup.enter="handleQuery()"-->
<!--                      />-->
<!--                </el-form-item>-->



                <el-form-item label="订单明细" prop="garmentOrderDetailId">
                  <el-select
                    v-model="queryParams.garmentOrderDetailId"
                    placeholder="请选择订单明细"
                    clearable
                    filterable
                    @keyup.enter="handleQuery()"
                  >
                    <el-option
                      v-for="item in orderItemOption"
                      :key="item.itemId"
                      :label="item.problemDesc"
                      :value="item.itemId"
                    />
                  </el-select>
                </el-form-item>


<!--                <el-form-item label="编码状态" prop="status">-->
<!--                      <el-input-->
<!--                          v-model="queryParams.status"-->
<!--                          placeholder="编码状态"-->
<!--                          clearable-->
<!--                          @keyup.enter="handleQuery()"-->
<!--                      />-->
<!--                </el-form-item>-->

                <el-form-item label="编码状态" prop="status">
                  <el-select
                    v-model="queryParams.status"
                    placeholder="请选择编码状态"
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
            v-hasPerm="['aioveuLaundryGarmentIdentity:aioveu-laundry-garment-identity:add']"
            type="success"
            @click="handleOpenDialog()"
        >
          <template #icon><Plus /></template>
          新增
        </el-button>
        <el-button
            v-hasPerm="['aioveuLaundryGarmentIdentity:aioveu-laundry-garment-identity:delete']"
            type="danger"
            :disabled="removeIds.length === 0"
            @click="handleDelete()"
        >
          <template #icon><Delete /></template>
          删除
        </el-button>

<!--        &lt;!&ndash; 添加扫码按钮 &ndash;&gt;           @click="handQRCodeScan()"-->
        <el-button
          v-hasPerm="['aioveuQRCode:aioveu-QRCode:scan']"
          type="success"

        >
          <template #icon><Plus /></template>
          扫码
        </el-button>

        <!-- 添加单个打印按钮 -->
        <el-button
          v-hasPerm="['aioveuPrint:aioveu-print:print']"
          type="primary"
          @click="handlePrintSingle()"
        >
          <template #icon><Printer /></template>
          单个二维码打印
        </el-button>

        <!-- 添加批量打印按钮 -->
        <el-button
          v-hasPerm="['aioveuPrint:aioveu-print:batchPrint']"
          type="primary"
          :disabled="selectedRows.length === 0"
          @selection-change="handleSelectionChange"
          @click="handlePrintBatch"
        >
          <template #icon><Printer /></template>
          批量二维码打印
        </el-button>

        <!-- 添加水洗唛打印按钮 -->
        <el-button
          v-hasPerm="['aioveuPrint:aioveu-print:CareLabel']"
          type="primary"
          @click="handlePrintCareLabel()"
        >
          <template #icon><Printer /></template>
          水洗唛批量打印
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
                        key="garmentCode"
                        label="衣物唯一编码"
                        prop="garmentCode"
                        min-width="150"
                        align="center"
                    />
<!--                    <el-table-column-->
<!--                        key="garmentOrderDetailId"-->
<!--                        label="关联订单明细"-->
<!--                        prop="garmentOrderDetailId"-->
<!--                        min-width="150"-->
<!--                        align="center"-->
<!--                    />-->

                    <el-table-column
                      key="itemProblemDesc"
                      label="关联订单明细问题描述"
                      prop="itemProblemDesc"
                      min-width="150"
                      align="center"
                    />

<!--                    <el-table-column-->
<!--                        key="qrCodePath"-->
<!--                        label="二维码存储路径"-->
<!--                        prop="qrCodePath"-->
<!--                        min-width="150"-->
<!--                        align="center"-->
<!--                    />-->
                        <!-- 修改后的图片列 -->
                        <el-table-column
                          key="qrCodePath"
                          label="二维码图片"
                          min-width="250"
                          align="center"
                        >
                          <template #default="scope">
                            <el-image
                              style="width: 80px; height: 80px;"
                              :src="scope.row.qrCodePath"
                              :preview-src-list="[scope.row.qrCodePath]"
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
<!--                        key="status"-->
<!--                        label="编码状态"-->
<!--                        prop="status"-->
<!--                        min-width="150"-->
<!--                        align="center"-->
<!--                    />-->

                    <el-table-column
                      label="编码状态"
                      min-width="150"
                      align="center"
                    >
                      <template #default="scope">
                        <DictLabel v-model="scope.row.status" code="laundry_garment_identity_status" />
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
                v-hasPerm="['aioveuLaundryGarmentIdentity:aioveu-laundry-garment-identity:edit']"
                type="primary"
                size="small"
                link
                @click="handleOpenDialog(scope.row.id)"
            >
              <template #icon><Edit /></template>
              编辑
            </el-button>
            <el-button
                v-hasPerm="['aioveuLaundryGarmentIdentity:aioveu-laundry-garment-identity:delete']"
                type="danger"
                size="small"
                link
                @click="handleDelete(scope.row.id)"
            >
              <template #icon><Delete /></template>
              删除
            </el-button>

            <!-- 添加单个打印按钮 -->
            <el-button
              v-hasPerm="['aioveuPrint:aioveu-print:print']"
              type="primary"
              size="small"
              link
              @click="handlePrintSingle(scope.row.garmentCode)"
            >
              <template #icon><Printer /></template>
              单个打印
            </el-button>

            <!-- 添加水洗唛打印按钮 -->
            <el-button
              v-hasPerm="['aioveuPrint:aioveu-print:CareLabel']"
              type="primary"
              size="small"
              link
              @click="handlePrintSingleCareLabel(scope.row.garmentCode)"
            >
              <template #icon><Printer /></template>
              水洗唛打印
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

        <!-- 添加打印任务列表 -->
        <div class="print-jobs" >
          <h3>打印任务</h3>

          <template v-if="printJobs.length > 0">
          <el-table :data="printJobs" size="small">
            <el-table-column prop="printId" label="任务ID" />
            <el-table-column prop="status" label="状态">
              <template #default="scope">
                <el-tag :type="statusTagType(scope.row.status)">
                  {{ formatStatus(scope.row.status) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="total" label="数量" />
            <el-table-column prop="createTime" label="创建时间" />
            <el-table-column label="操作">
              <template #default="scope">
                <el-button
                  size="small"
                  @click="viewPrintPreview(scope.row.printId)"
                  :disabled="scope.row.status !== 'GENERATED'"
                >
                  预览
                </el-button>
                <el-button
                  size="small"
                  type="danger"
                  @click="cancelPrintJob(scope.row.printId)"
                  :disabled="scope.row.status !== 'PENDING' && scope.row.status !== 'PROCESSING'"
                >
                  取消
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>

          <template v-else>
            <div class="no-jobs">
              <el-empty description="暂无打印任务" />
              <p>点击"单个打印"或"批量打印"按钮创建新任务</p>
            </div>
          </template>

        </div>

<!--      Element Plus 的 el-table组件有一个内置功能：当表格内容高度超过一定值时，会在表格的右下角显示一个返回顶部的按钮。这个按钮是自动出现的，不需要额外添加代码。-->
<!--      这里没有显式设置 show-overflow-tooltip或 scrollbar-always-on属性，所以 Element Plus 使用了默认行为。-->

    </el-card>

    <!-- 衣物唯一编码表单弹窗 -->
    <el-dialog
        v-model="dialog.visible"
        :title="dialog.title"
        width="500px"
        @close="handleCloseDialog"
    >
      <el-form ref="dataFormRef" :model="formData" :rules="rules" label-width="100px">
<!--                <el-form-item label="衣物唯一编码ID" prop="id">-->
<!--                      <el-input-->
<!--                          v-model="formData.id"-->
<!--                          placeholder="衣物唯一编码ID"-->
<!--                      />-->
<!--                </el-form-item>-->

<!--                <el-form-item label="衣物唯一编码" prop="garmentCode">-->
<!--                      <el-input-->
<!--                          v-model="formData.garmentCode"-->
<!--                          placeholder="衣物唯一编码"-->
<!--                      />-->
<!--                </el-form-item>-->

<!--                <el-form-item label="关联订单明细" prop="garmentOrderDetailId">-->
<!--                      <el-input-->
<!--                          v-model="formData.garmentOrderDetailId"-->
<!--                          placeholder="关联订单明细"-->
<!--                      />-->
<!--                </el-form-item>-->

                <el-form-item label="关联订单" prop="garmentOrderDetailId">
                  <el-select
                    v-model="formData.garmentOrderDetailId"
                    placeholder="请选择关联订单明细"
                    clearable
                    filterable
                    style="width: 100%"
                  >
                    <!-- 添加空选项提示 -->
                    <el-option v-if="orderItemOption.length === 0" disabled label="暂无数据" value="" />

                    <el-option
                      v-for="item in orderItemOption"
                      :key="item.itemId"
                      :label="item.problemDesc"
                      :value="item.itemId"
                    />
                  </el-select>
                </el-form-item>

<!--                <el-form-item label="二维码存储路径" prop="qrCodePath">-->
<!--                      <el-input-->
<!--                          v-model="formData.qrCodePath"-->
<!--                          placeholder="二维码存储路径"-->
<!--                      />-->
<!--                </el-form-item>-->

<!--                <el-form-item label="编码状态" prop="status">-->
<!--                      <el-input-->
<!--                          v-model="formData.status"-->
<!--                          placeholder="编码状态"-->
<!--                      />-->
<!--                </el-form-item>-->

                <el-form-item label="编码状态" prop="status">
                  <el-select
                    v-model="formData.status"
                    placeholder="请选择编码状态"
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


<!--                <el-form-item label="创建时间" prop="createTime">-->
<!--                      <el-date-picker-->
<!--                          v-model="formData.createTime"-->
<!--                          type="datetime"-->
<!--                          placeholder="创建时间"-->
<!--                          value-format="YYYY-MM-DD HH:mm:ss"-->
<!--                      />-->
<!--                </el-form-item>-->

<!--                <el-form-item label="更新时间" prop="updateTime">-->
<!--                      <el-date-picker-->
<!--                          v-model="formData.updateTime"-->
<!--                          type="datetime"-->
<!--                          placeholder="更新时间"-->
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

    <!-- 打印预览对话框 -->
    <el-dialog
      v-model="printPreviewVisible"
      :title="printPreviewTitle"
      width="80%"
      top="5vh"
      destroy-on-close
    >

      <!-- 在打印预览对话框中添加配置选项 -->
      <div class="print-config">
        <el-form :inline="true" label-width="100px">

          <!-- 通用配置 -->
          <el-form-item label="份数">
            <el-input-number
              v-model="copies"
              :min="1"
              :max="10" />
          </el-form-item>
          <el-form-item label="纸张大小">
            <el-select v-model="paperSize">
              <el-option label="A4" value="A4" />
              <el-option label="A5" value="A5" />
              <el-option label="Letter" value="letter" />
            </el-select>
          </el-form-item>
          <el-form-item label="方向">
            <el-select v-model="orientation">
              <el-option label="纵向" value="portrait" />
              <el-option label="横向" value="landscape" />
            </el-select>
          </el-form-item>
          <el-form-item label="显示信息">
            <el-switch v-model="showInfo" />
          </el-form-item>

          <!-- 水洗唛特有配置 -->
          <el-form-item label="显示洗涤图标" v-if="currentPrintType === 'CARE_LABEL'">
            <el-switch v-model="showWashingSymbols" />
          </el-form-item>

          <el-form-item label="显示材质成分" v-if="currentPrintType === 'CARE_LABEL'">
            <el-switch v-model="showMaterial" />
          </el-form-item>

          <el-form-item label="显示原产国" v-if="currentPrintType === 'CARE_LABEL'">
            <el-switch v-model="showCountryOfOrigin" />
          </el-form-item>


        </el-form>
      </div>

      <div class="print-preview-container">
        <iframe
          v-if="printPreviewUrl"
          :src="printPreviewUrl"
          class="print-preview-frame"
          frameborder="0"
        ></iframe>

        <!-- 添加水洗唛预览占位符 -->
        <div v-else-if="currentPrintType === 'CARE_LABEL'" class="care-label-preview-placeholder">
          <div class="care-label-preview">
            <div class="care-label-header">
              <div class="care-logo">LOGO</div>
              <div class="brand-name">品牌名称</div>
            </div>

            <div class="care-content">
              <div class="material"><strong>成分:</strong> 100%棉</div>
              <div class="symbols">
                <span>🛁30</span>
                <span>🚫△</span>
                <span>♨️·</span>
              </div>
              <div class="instructions">最高洗涤温度30度，不可漂白，中温熨烫，不可干洗，悬挂晾干</div>
            </div>

            <div class="origin">产地: 中国</div>
          </div>
        </div>






        <div v-else class="print-preview-loading">
          <el-icon class="is-loading"><Loading /></el-icon>
          <span>加载预览中...</span>
        </div>
      </div>


      <template #footer>
        <div class="dialog-footer">
          <el-button @click="printPreviewVisible = false">取消</el-button>
          <el-button
            type="primary"
            @click="printDocument(currentPrintId)"
            :disabled="!isPreviewReady"
          >
            打印
          </el-button>
        </div>
      </template>
    </el-dialog>

  </div>
</template>



<script setup lang="ts">

  import { Auth } from "@/utils/auth";

  defineOptions({
    name: "AioveuLaundryGarmentIdentity",
    inheritAttrs: false,
  });

  import AioveuLaundryGarmentIdentityAPI, { AioveuLaundryGarmentIdentityPageVO, AioveuLaundryGarmentIdentityForm, AioveuLaundryGarmentIdentityPageQuery ,AioveuGarmentIdentityOptionVO} from "@/api/aioveuLaundryGarmentIdentity/aioveu-laundry-garment-identity";
  import AioveuLaundryOrderItemAPI, { AioveuLaundryOrderItemOption } from "@/api/aioveuLaundryOrderItem/aioveu-laundry-order-item"

  // 导入打印服务API
  import AioveuPrintAPI from "@/api/aioveuPrint/aioveu-print";
  import axios from 'axios';

  // 添加配置选项
  const copies = ref(1);
  const paperSize = ref('A4');
  const orientation = ref('portrait');
  const showInfo = ref(true);

  // 在组件中添加以下变量和方法
  const printPreviewVisible = ref(false);
  const printPreviewUrl = ref("");
  const selectedRows = ref<any[]>([]);

  // 添加打印任务管理
  const printJobs = ref<any[]>([]);

  // 存储轮询定时器的Map
  const pollingTimers = new Map<string, NodeJS.Timeout>();

  // 存储当前打印任务ID
  const currentPrintId = ref<string>('');

  // 水洗唛特有配置
  const showWashingSymbols = ref(true);
  const showMaterial = ref(true);
  const showCountryOfOrigin = ref(true);
  const currentPrintType = ref(''); // 当前打印类型

  // 计算属性：检查当前任务状态是否为 GENERATED
  const isPreviewReady  = computed(() => {
    if (!currentPrintId.value) return false;

    const job = printJobs.value.find(j => j.printId === currentPrintId.value);

    // 允许在 GENERATED 状态时打印
    return job?.status === 'GENERATED' || job?.status === 'COMPLETED';
  });

  const formatStatus = (status: string) => {
    const statusMap: Record<string, string> = {
      PENDING: '任务已创建，等待处理',
      GENERATING: '正在生成打印内容',
      GENERATED: '打印内容已生成，可预览',

      //打印任务
      PRINTING: '用户已发送打印指令',
      PROCESSING: '正在打印',
      COMPLETED: '打印成功完成',
      FAILED: '打印失败',
      CANCELLED: '任务已取消'
    };
    return statusMap[status] || status;
  };

  // 计算打印预览标题
  const printPreviewTitle = computed(() => {
    if (currentPrintType.value === 'QR_CODE') {
      return '二维码打印预览';
    } else if (currentPrintType.value === 'RECEIPT') {
      return '小票打印预览';
    } else if (currentPrintType.value === 'CARE_LABEL') {
      return '水洗唛打印预览';
    }
    return '打印预览';
  });

  // 定义 Element Plus 标签类型  Element Plus 的 el-tag组件有一个严格类型的 type属性
  type TagType = 'success' | 'primary' | 'warning' | 'info' | 'danger';

  // 状态标签类型 - 修复类型错误
  const statusTagType = (status: string): TagType => {
    const typeMap: Record<string, TagType> = {
      PENDING: 'info',
      GENERATING: 'warning',
      GENERATED: 'success',

      //打印任务
      PRINTING: 'primary',
      PROCESSING: 'warning',
      COMPLETED: 'success',
      FAILED: 'danger',
      CANCELLED: 'info'
    };
    return typeMap[status] || 'info';  // 默认返回'info'
  };


  // 单个打印
  const handlePrintSingle = ( garmentCode ?: string) => {
    let code: string | undefined;

    console.log("开始单个打印");
    if (garmentCode) {
      // 如果传入了 garmentCode，直接使用
      code = garmentCode;
    } else if (selectedRows.value.length > 0) {
      // 否则，使用选中的第一行的 garmentCode
      code = selectedRows.value[0].garmentCode;
    }

    if (!code) {
      ElMessage.warning("请选择一条记录进行打印");
      return;
    }

    // 在打印请求中添加配置
    const request = {
      qrCode: code,
      template: "standard", // 使用标准模板
      printType: "QR_CODE",
      copies: copies.value,
      paperSize: paperSize.value,
      orientation: orientation.value,
      showInfo: showInfo.value
    };

    // 在打印方法中，移除立即打开预览对话框的代码
    //修复打印任务弹窗未显示的问题
    // printPreviewVisible.value = true;
    // printPreviewUrl.value = "";

    AioveuPrintAPI.printSingleQrCode(request)
      .then(response => {
        if (response.success) {
          console.log("打印成功，添加到任务列表");
          printPreviewUrl.value = response.previewUrl;
          console.log("打印预览访问:", printPreviewUrl.value);
          console.log("任务ID:", response.printId);

          currentPrintType.value = request.printType;

          // 在打印方法中添加到任务列表
          printJobs.value.push({
            printId: response.printId,
            status: 'PENDING',
            total: 1,
            createTime: new Date().toLocaleString()
          });
          console.log("当前任务列表:", printJobs.value);

          // 启动状态轮询
          startPrintStatusPolling(response.printId);

        } else {
          ElMessage.error(`打印失败: ${response.message}`);
          printPreviewVisible.value = false;
        }
      })
      .catch(error => {
        ElMessage.error(`请求失败: ${error.message}`);
        printPreviewVisible.value = false;
      });
  };


  // 水洗唛打印
  const handlePrintCareLabel = () => {
    if (selectedRows.value.length === 0) {
      ElMessage.warning("请选择要打印的记录");
      return;
    }

    // 提取 garmentCode
    const qrCodes = selectedRows.value.map(row => row.garmentCode);

    // 在打印请求中添加配置
    const request = {
      qrCodes: qrCodes,
      printType: "CARE_LABEL", // 指定打印类型为水洗唛
      template: "care_label", // 使用水洗唛模板
      copies: copies.value,
      paperSize: paperSize.value,
      orientation: orientation.value,
      showInfo: showInfo.value
    };

    printPreviewVisible.value = true;
    printPreviewUrl.value = "";

    AioveuPrintAPI.printCareLabel(request)
      .then(response => {
        if (response.success) {
          printPreviewUrl.value = response.previewUrl;

          // 添加到任务列表
          printJobs.value.push({
            printId: response.printId,
            status: 'PENDING',
            total: qrCodes.length,
            createTime: new Date().toLocaleString()
          });
          startPrintStatusPolling(response.printId);

          // 调用预览方法
          viewPrintPreview(response.printId);

        } else {
          ElMessage.error(`水洗唛打印失败: ${response.message}`);
          printPreviewVisible.value = false;
        }
      })
      .catch(error => {
        ElMessage.error(`请求失败: ${error.message}`);
        printPreviewVisible.value = false;
      });
  };

  // 单个水洗唛打印（操作列中的按钮）
  const handlePrintSingleCareLabel = (garmentCode: string) => {
    // 在打印请求中添加配置
    const request = {
      qrCodes: [garmentCode],
      printType: "CARE_LABEL", // 指定打印类型为水洗唛
      template: "care_label", // 使用水洗唛模板
      copies: copies.value,
      paperSize: paperSize.value,
      orientation: orientation.value,
      showInfo: showInfo.value
    };

    printPreviewVisible.value = true;
    printPreviewUrl.value = "";

    AioveuPrintAPI.printCareLabel(request)
      .then(response => {
        if (response.success) {
          printPreviewUrl.value = response.previewUrl;

          // 添加到任务列表
          printJobs.value.push({
            printId: response.printId,
            status: 'PENDING',
            total: 1,
            createTime: new Date().toLocaleString()
          });
          startPrintStatusPolling(response.printId);

          // 调用预览方法
          viewPrintPreview(response.printId);

        } else {
          ElMessage.error(`水洗唛打印失败: ${response.message}`);
          printPreviewVisible.value = false;
        }
      })
      .catch(error => {
        ElMessage.error(`请求失败: ${error.message}`);
        printPreviewVisible.value = false;
      });
  };




  // 批量打印
  const handlePrintBatch = () => {
    if (selectedRows.value.length === 0) {
      ElMessage.warning("请选择要打印的记录");
      return;
    }

    // 提取 garmentCode
    const aqrCodes = selectedRows.value.map(row => row.garmentCode);

    // 在打印请求中添加配置
    const request = {
      qrCodes: aqrCodes,
      printType: "QR_CODE",
      template: "batch", // 使用批量模板
      copies: copies.value,
      paperSize: paperSize.value,
      orientation: orientation.value,
      showInfo: showInfo.value
    };

    printPreviewVisible.value = true;
    printPreviewUrl.value = "";

    AioveuPrintAPI.printBatchQrCodes(request)
      .then(response => {
        if (response.success) {
          printPreviewUrl.value = response.previewUrl;

          // 在打印方法中添加到任务列表
          printJobs.value.push({
            printId: response.printId,
            status: 'PENDING',
            total: 1,
            createTime: new Date().toLocaleString()
          });
          startPrintStatusPolling(response.printId);

          // 调用预览方法
          viewPrintPreview(response.printId);

        } else {
          ElMessage.error(`批量打印失败: ${response.message}`);
          printPreviewVisible.value = false;
        }
      })
      .catch(error => {
        ElMessage.error(`请求失败: ${error.message}`);
        printPreviewVisible.value = false;
      });
  };

  // 更新任务状态
  const startPrintStatusPolling = (printId: string) => {
    // ...轮询逻辑...

    // 清除已有的轮询
    if (pollingTimers.has(printId)) {
      clearInterval(pollingTimers.get(printId));
      pollingTimers.delete(printId);
    }

    // 启动新轮询
    const timer = setInterval(() => {
      console.log(`轮询任务状态，任务ID: ${printId}`);

      AioveuPrintAPI.getPrintStatus(printId)
        .then(response => {

          console.log(`任务状态响应:`, response);

          // 使用 response.data 而不是 response
          // 使用 response.data.code 判断请求是否成功
          if (response.aioveuPrintStatus) {
            const status = response; // 实际数据在 data 属性中

            // 更新任务状态
            const jobIndex = printJobs.value.findIndex(j => j.printId === printId);
            if (jobIndex !== -1) {
              printJobs.value[jobIndex].status = status.aioveuPrintStatus;
              printJobs.value[jobIndex].errorMessage = status.errorMessage;

              // 任务完成通知
              // 内容生成完成时自动打开预览
              // 如果任务完成或失败，停止轮询
              if (status.aioveuPrintStatus === 'GENERATED') {
                clearInterval(timer);
                pollingTimers.delete(printId);
                viewPrintPreview(printId); // 确保调用预览方法
                ElMessage.success("打印内容已生成");
              } else if (status.aioveuPrintStatus === 'FAILED' || status.aioveuPrintStatus === 'CANCELLED') {
                // // 如果任务完成或失败，停止轮询
                clearInterval(timer);
                pollingTimers.delete(printId);
                ElMessage.error("打印任务失败");
              }else if (status.aioveuPrintStatus === 'COMPLETED') {

                // // 如果任务完成，停止轮询
                clearInterval(timer);
                pollingTimers.delete(printId);
                ElMessage.error("打印任务完成");

              }

            }

          }
        })
        .catch(error => {
          console.error('获取打印状态失败', error);
          clearInterval(timer);
          pollingTimers.delete(printId);
        });
    }, 2000); // 每2秒轮询一次

    pollingTimers.set(printId, timer);

  };


  // 查看预览 （使用 Blob URL）
  const viewPrintPreview =  async (printId: string) => {
    try {

      console.log(`开始加载预览，任务ID: ${printId}`)

      // 存储当前打印任务ID
      currentPrintId.value = printId;

      // 打开预览对话框
      printPreviewVisible.value = true;
      printPreviewUrl.value = "";




      // 获取基础 URL  // 获取基础 URL - 添加默认值
      // const baseURL = import.meta.env.VITE_APP_API_URL || 'http://localhost:8888';
      // const url = `${baseURL}/api/v1/aioveu-print/preview/${printId}`;

      // 使用相对路径（推荐）
      const url = `/prod-api/api/v1/aioveu-print/preview/${printId}`;
      console.log("请求预览URL:", url);


      // 检查token是否存在
      // 获取 token
      const accessToken = Auth.getAccessToken();
      console.log("请求预览token:", accessToken);
      if (!accessToken) {
        ElMessage.warning("请先登录");
        // router.push('/login');
        return;
      }

      // 获取预览内容
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}` , // 修复这里：使用变量而不是字符串
          "Content-Type": "application/json" // 确保内容类型正确
        },
        responseType: 'blob' // 获取 Blob 类型响应
      });

      console.log("响应状态:", response.status);
      console.log("响应类型:", response.headers['content-type']);

      // 创建 Blob URL
      const blob = new Blob([response.data], { type: 'text/html' });
      const blobUrl = URL.createObjectURL(blob);

      printPreviewUrl.value = blobUrl;

      // // 在 iframe 加载完成后检查内容
      // const iframe = document.querySelector('.print-preview-frame') as HTMLIFrameElement;
      // if (iframe) {
      //   iframe.onload = () => {
      //     const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
      //     if (iframeDoc) {
      //       const bodyContent = iframeDoc.body.innerHTML;
      //
      //       // 检查是否是预览内容
      //       const isPreviewContent = bodyContent.includes('衣物二维码') ||
      //         bodyContent.includes('garmentCode');
      //
      //       if (!isPreviewContent) {
      //         console.error("返回了非预览内容:", bodyContent.substring(0, 500));
      //
      //         // 检查是否是登录页
      //         if (bodyContent.includes('登录') || bodyContent.includes('login')) {
      //           ElMessage.error("认证过期，请重新登录");
      //           // router.push('/login');
      //         }
      //         // 检查是否是首页
      //         else if (bodyContent.includes('首页') || bodyContent.includes('dashboard')) {
      //           ElMessage.error("后端返回了首页内容，请检查预览接口实现");
      //         }
      //         // 检查是否是错误页
      //         else if (bodyContent.includes('error') || bodyContent.includes('错误')) {
      //           ElMessage.error("后端返回了错误页面");
      //         }
      //         else {
      //           ElMessage.error("获取预览失败，返回了非预览内容");
      //         }
      //
      //         // 不再关闭弹窗
      //         // printPreviewVisible.value = false;
      //       }
      //     }
      //   };
      // }

    } catch (error:any) {
      console.error('加载预览失败', error);
      ElMessage.error('加载预览失败');
      printPreviewVisible.value = false;

      if (error.response) {
        console.error('响应状态:', error.response.status);
        console.error('响应头:', error.response.headers);

        // 尝试解析错误响应
        if (error.response.data instanceof Blob) {
          const errorText = await new Response(error.response.data).text();
          console.error('错误响应内容:', errorText);

          // 显示错误信息
          if (errorText) {
            ElMessage.error(`错误: ${errorText}`);
          }
        } else {
          console.error('响应数据:', error.response.data);
          ElMessage.error(`错误: ${error.response.data?.message || error.response.statusText}`);
        }
      }

    }


    // printPreviewUrl.value = `http://localhost:8989/api/v1/aioveu-print/preview/${printId}`;
    // http://localhost:8989/api/v1/aioveu-print/preview/PRINT202510180007
  };

  // 取消任务
  const cancelPrintJob = (printId: string) => {
    // 调用API取消任务
    ElMessageBox.confirm('确定要取消此打印任务吗?', '取消打印', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      // 调用API取消任务（假设有取消API）
      AioveuPrintAPI.cancelPrintJob(printId)
        .then(response => {
          if (response.aioveuPrintStatus) {
            // 更新任务状态
            const jobIndex = printJobs.value.findIndex(j => j.printId === printId);
            if (jobIndex !== -1) {
              printJobs.value[jobIndex].status = 'CANCELLED';
            }

            // 停止轮询
            if (pollingTimers.has(printId)) {
              clearInterval(pollingTimers.get(printId));
              pollingTimers.delete(printId);
            }

            ElMessage.success('打印任务已取消');
          } else {
            ElMessage.error(`取消失败: ${response.errorMessage}`);
          }
        })
        .catch(error => {
          ElMessage.error(`请求失败: ${error.message}`);
        });
    }).catch(() => {
      // 用户取消操作
    });
  };



  // 打印文档
  const printDocument = (printId: string) => {
    const iframe = document.querySelector('.print-preview-frame') as HTMLIFrameElement;
    if (iframe && iframe.contentWindow) {



      // 实际执行打印  // 直接调用打印功能
      iframe.contentWindow.print();

      // 更新任务状态为打印中
      const jobIndex = printJobs.value.findIndex(j => j.printId === printId);
      if (jobIndex !== -1) {
        printJobs.value[jobIndex].status = 'PRINTING';
      }

      // 调用打印API
      AioveuPrintAPI.execute(printId)
        .then(() => {  // 移除 response 参数

          // 后端接口已完成更新任务状态为已打印
          if (jobIndex !== -1) {
            printJobs.value[jobIndex].status = 'COMPLETED';
          }

          ElMessage.success("打印成功");
        })
        .catch(error => {
          console.error('打印失败', error);
          ElMessage.error('打印失败');

          // 更新任务状态为失败
          if (jobIndex !== -1) {
            printJobs.value[jobIndex].status = 'FAILED';
            printJobs.value[jobIndex].errorMessage = error.message;
          }
        });

    } else {
      ElMessage.error("无法调用打印功能");
    }
  };


  // 导入字典值API
  import DictAPI,{ DictItemOption } from '@/api/system/dict.api'

  const queryFormRef = ref();
  const dataFormRef = ref();

  const loading = ref(false);
  const removeIds = ref<number[]>([]);
  const total = ref(0);

  // 新增：选项
  const laundryGarmentIdentityOption = ref<AioveuGarmentIdentityOptionVO[]>([]);

  // 新增：选项
  const orderItemOption = ref<AioveuLaundryOrderItemOption[]>([]);

  // 字典选项
  const statusOptions = ref<DictItemOption[]>([])


  // 加载选项
  function loadOptions() {

    // 加载选项
    AioveuLaundryGarmentIdentityAPI.getAllGarmentIdentityOptions().then(response => {
      laundryGarmentIdentityOption.value = response
    })

    // 加载选项
    AioveuLaundryOrderItemAPI.getAllLaundryOrderItemOptions().then(response => {
      orderItemOption.value = response
    })

    // 加载字典
    DictAPI.getDictItems('laundry_garment_identity_status').then(response => {
      statusOptions.value = response
    })

  }


  const queryParams = reactive<AioveuLaundryGarmentIdentityPageQuery>({
    pageNum: 1,
    pageSize: 10,
  });

  // 衣物唯一编码表格数据
  const pageData = ref<AioveuLaundryGarmentIdentityPageVO[]>([]);

  // 弹窗
  const dialog = reactive({
    title: "",
    visible: false,
  });

  // 衣物唯一编码表单数据
  const formData = reactive<AioveuLaundryGarmentIdentityForm>({});

  // 衣物唯一编码表单校验规则
  const rules = reactive({
                      garmentOrderDetailId: [{ required: true, message: "请输入关联订单明细", trigger: "blur" }],
                      status: [{ required: true, message: "请输入编码状态", trigger: "blur" }],
  });

  /** 查询衣物唯一编码 */
  function handleQuery() {
    loading.value = true;
          AioveuLaundryGarmentIdentityAPI.getPage(queryParams)
        .then((data) => {
          pageData.value = data.list;
          total.value = data.total;
        })
        .finally(() => {
          loading.value = false;
        });
  }

  /** 重置衣物唯一编码查询 */
  function handleResetQuery() {
    queryFormRef.value!.resetFields();
    queryParams.pageNum = 1;
    handleQuery();
  }

  /** 行复选框选中记录选中ID集合 */
  function handleSelectionChange(selection: any) {
    removeIds.value = selection.map((item: any) => item.id);
    // 存储整个行对象，而不仅仅是 garmentCode
    selectedRows.value = selection;
  }

  /** 打开衣物唯一编码弹窗 */
  function handleOpenDialog(id?: number) {
    // dialog.visible = true;
    if (id) {
      dialog.title = "修改衣物唯一编码";
            AioveuLaundryGarmentIdentityAPI.getFormData(id).then((data) => {
        Object.assign(formData, data);

              //先准备数据，再显示弹窗
              dialog.visible = true;

      });
    } else {
      dialog.title = "新增衣物唯一编码";
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

  /** 提交衣物唯一编码表单 */
  function handleSubmit() {
    dataFormRef.value.validate((valid: any) => {
      if (valid) {
        loading.value = true;
        const id = formData.id;
        if (id) {
                AioveuLaundryGarmentIdentityAPI.update(id, formData)
              .then(() => {
                ElMessage.success("修改成功");
                handleCloseDialog();
                handleResetQuery();
              })
              .finally(() => (loading.value = false));
        } else {
                AioveuLaundryGarmentIdentityAPI.add(formData)
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

  /** 关闭衣物唯一编码弹窗 */
  function handleCloseDialog() {
    dialog.visible = false;
    dataFormRef.value.resetFields();
    dataFormRef.value.clearValidate();
    formData.id = undefined;
  }

  /** 删除衣物唯一编码 */
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
                AioveuLaundryGarmentIdentityAPI.deleteByIds(ids)
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
    //在 onMounted钩子中调用了 loadOptions()函数,确保函数被正确使用
    loadOptions();
  });
</script>

<style scoped>
.print-preview-container {
  height: 70vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.print-preview-frame {
  width: 100%;
  height: 100%;
  border: none;
}

.print-preview-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  font-size: 16px;
  color: #606266;
}

.print-preview-loading .el-icon {
  font-size: 24px;
}
.print-jobs {
  margin-top: 20px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  padding: 20px;
  background-color: #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.print-jobs h3 {
  margin-top: 0;
  margin-bottom: 15px;
  font-size: 18px;
  color: #303133;
  font-weight: bold;
  border-bottom: 1px solid #ebeef5;
  padding-bottom: 10px;
}

.no-jobs {
  padding: 30px;
  text-align: center;
  color: #909399;
  background-color: #f8f8f9;
  border-radius: 4px;
}

.no-jobs .el-empty {
  padding: 20px;
}

.no-jobs p {
  margin-top: 10px;
  font-size: 14px;
  color: #606266;
}


/* 水洗唛打印预览样式 */
.care-label-preview {
  font-family: Arial, sans-serif;
  width: 80mm;
  height: 50mm;
  border: 1px solid #ccc;
  padding: 5mm;
  box-sizing: border-box;
  background-color: white;
}

.care-label-header {
  display: flex;
  align-items: center;
  margin-bottom: 3mm;
}

.care-logo {
  width: 15mm;
  height: 15mm;
  margin-right: 3mm;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 10px;
}

.brand-name {
  font-weight: bold;
  font-size: 12px;
}

.care-content {
  margin-bottom: 2mm;
}

.material {
  margin-bottom: 1mm;
  font-size: 10px;
}

.symbols {
  display: flex;
  gap: 2mm;
  margin: 2mm 0;
  font-size: 14px;
}

.instructions {
  font-size: 9px;
  line-height: 1.3;
}

.origin {
  position: absolute;
  bottom: 2mm;
  right: 3mm;
  font-size: 9px;
}


</style>
