import request from "@/utils/request";

const AIOVEUQRCODE_BASE_URL = "/api/v1/QRCodes";

const AioveuQRCodeAPI = {

  /**
   *  扫描二维码获取信息  前端摄像头扫描的实现
   *
   *  @param data  二维码扫描请求数据
   */
  scanQRCode(data: QRCodeScanRequest) {


    return request({
      url: `${AIOVEUQRCODE_BASE_URL}/scan`,
      method: "post",
      data,
    });
  },

}

export default AioveuQRCodeAPI;

/**  二维码扫描请求数据 */
export interface QRCodeScanRequest {

  /** 二维码内容 （衣物唯一编码） */
  qrContent?:  string;
  /** 扫描者ID（操作员） */
  scannerId?:  number;
  /** 设备信息 */
  deviceInfo?: string;
  /** 扫描位置 */
  location?:  string;
}
