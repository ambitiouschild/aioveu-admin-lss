import request from "@/utils/request";

const AIOVEUPRINT_BASE_URL = "/api/v1/aioveu-print";

const AioveuPrintAPI = {
  /** 单个二维码打印 */
  printSingleQrCode(data:AioveuPrintRequest) {
    return request<any, AioveuPrintResponse> ({
      url: `${AIOVEUPRINT_BASE_URL}/single`,
      method: "post",
      data,
    });
  },

  /** 水洗唛打印 */
  printCareLabel(data:AioveuPrintRequest) {
    return request<any, AioveuPrintResponse> ({
      url: `${AIOVEUPRINT_BASE_URL}/CareLabel`,
      method: "post",
      data,
    });
  },

  /** 小票打印 */
  printReceipt(data:AioveuPrintRequest) {
    return request<any, AioveuPrintResponse> ({
      url: `${AIOVEUPRINT_BASE_URL}/Receipt`,
      method: "post",
      data,
    });
  },



  /**
   * 批量二维码打印

   */
  printBatchQrCodes(data:AioveuPrintRequest) {
    return request<any, AioveuPrintResponse>({
      url: `${AIOVEUPRINT_BASE_URL}/batch`,
      method: "post",
      data,
    });
  },

  /**
   *  获取打印预览
   *
   */
  getPrintPreview(printId: string) {
    return request({
      url: `${AIOVEUPRINT_BASE_URL}/preview/${printId}"`,
      method: "get",
      responseType: 'text'
    });
  },

  /**
   * 获取打印状态
   *
   */
  getPrintStatus(printId: string) {
    return request<any ,AioveuPrintStatusVO>({
      url: `${AIOVEUPRINT_BASE_URL}/status/${printId}`,
      method: "get",
    });
  },
  /**
   * 取消打印任务
   *
   */
  cancelPrintJob(printId: string) {
    return request<any , AioveuPrintStatusVO>({
      url: `${AIOVEUPRINT_BASE_URL}/cancel/${printId}`,
      method: "put",
    });
  },

  /**
   * 执行打印任务
   *
   */
  execute(printId: string) {
    return request<any , AioveuPrintResponse>({
      url: `${AIOVEUPRINT_BASE_URL}/execute/${printId}`,
      method: "post",
    });
  },



}

export default AioveuPrintAPI;

/** 打印请求参数 */
export interface AioveuPrintRequest{
  /** 单个二维码 */
  qrCode?: string;
  /** 批量二维码列表 */
  qrCodes?: string[];
  /** 打印模板 */
  template?: string;
  /** 打印份数 */
  copies?: number;
  /** 纸张大小 (A4, A5, 标签纸等) */
  paperSize?: string;
  /** 是否显示衣物信息 */
  showInfo?: boolean;
  /** 是否显示logo */
  showLogo?: boolean;
  /** 打印方向 (portrait, landscape) */
  orientation?: string;
}

/**
 * 打印响应
 */
export interface AioveuPrintResponse {
  success: boolean;
  message: string;
  printId: string;
  total: number;
  previewUrl: string;
}


/**
 * 打印状态
 */
export interface AioveuPrintStatusVO {
  printId: string;
  aioveuPrintStatus: string;  // 或者是一个枚举
  startTime: string;
  endTime: string;
  errorMessage: string;
  total: number;
}





