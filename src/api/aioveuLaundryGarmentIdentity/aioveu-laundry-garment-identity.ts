import request from "@/utils/request";

const AIOVEULAUNDRYGARMENTIDENTITY_BASE_URL = "/api/v1/aioveu-laundry-garment-identity";

const AioveuLaundryGarmentIdentityAPI = {
    /** 获取衣物唯一编码分页数据 */
    getPage(queryParams?: AioveuLaundryGarmentIdentityPageQuery) {
        return request<any, PageResult<AioveuLaundryGarmentIdentityPageVO[]>>({
            url: `${AIOVEULAUNDRYGARMENTIDENTITY_BASE_URL}/page`,
            method: "get",
            params: queryParams,
        });
    },
    /**
     * 获取衣物唯一编码表单数据
     *
     * @param id 衣物唯一编码ID
     * @returns 衣物唯一编码表单数据
     */
    getFormData(id: number) {
        return request<any, AioveuLaundryGarmentIdentityForm>({
            url: `${AIOVEULAUNDRYGARMENTIDENTITY_BASE_URL}/${id}/form`,
            method: "get",
        });
    },

    /**
     *  添加衣物唯一编码
     *
     *  @param data 衣物唯一编码表单数据
     */
    add(data: AioveuLaundryGarmentIdentityForm) {
        return request({
            url: `${AIOVEULAUNDRYGARMENTIDENTITY_BASE_URL}`,
            method: "post",
            data,
        });
    },

    /**
     * 更新衣物唯一编码
     *
     * @param id 衣物唯一编码ID
     * @param data 衣物唯一编码表单数据
     */
     update(id: number, data: AioveuLaundryGarmentIdentityForm) {
        return request({
            url: `${AIOVEULAUNDRYGARMENTIDENTITY_BASE_URL}/${id}`,
            method: "put",
            data,
        });
    },

    /**
     * 批量删除衣物唯一编码，多个以英文逗号(,)分割
     *
     * @param ids 衣物唯一编码ID字符串，多个以英文逗号(,)分割
     */
     deleteByIds(ids: string) {
        return request({
            url: `${AIOVEULAUNDRYGARMENTIDENTITY_BASE_URL}/${ids}`,
            method: "delete",
        });
    },

    /**
     *  扫描二维码获取信息  前端摄像头扫描的实现
     *
     *  @param data 二维码扫描请求数据
     */
    scanQRCode(data: QRCodeScanRequest) {


      return request({
        url: `${AIOVEULAUNDRYGARMENTIDENTITY_BASE_URL}/scan`,
        method: "post",
        data,
      });
    },

  /**
   * 获取所有选项列表（用于下拉选择框）
   * @returns 选项列表
   * 因为request函数的类型定义允许第一个类型参数为any，从而绕过了类型检查
   */
  getAllGarmentIdentityOptions() {
    return request<any,AioveuGarmentIdentityOptionVO[]>({
      url: `${AIOVEULAUNDRYGARMENTIDENTITY_BASE_URL}/options`,
      method: "get",
    });
  }

}

export default AioveuLaundryGarmentIdentityAPI;

/** 衣物唯一编码分页查询参数 */
export interface AioveuLaundryGarmentIdentityPageQuery extends PageQuery {
    /** 衣物唯一编码ID */
    id?: number;
    /** 衣物唯一编码(UUID格式) */
    garmentCode?: string;
    /** 关联订单明细 */
    garmentOrderDetailId?: number;
    /** 编码状态 1-已存在-ACTIVE 2-已收回-RETIRED 3-已丢失-LOST */
    status?: number;
}

/** 衣物唯一编码表单对象 */
export interface AioveuLaundryGarmentIdentityForm {
    /** 衣物唯一编码ID */
    id?:  number;
    /** 衣物唯一编码(UUID格式) */
    garmentCode?:  string;
    /** 关联订单明细 */
    garmentOrderDetailId?:  number;
    /** 二维码存储路径 */
    qrCodePath?:  string;
    /** 编码状态 1-已存在-ACTIVE 2-已收回-RETIRED 3-已丢失-LOST */
    status?:  number;
    /** 创建时间 */
    createTime?:  Date;
    /** 更新时间 */
    updateTime?:  Date;
}

/** 衣物唯一编码分页对象 */
export interface AioveuLaundryGarmentIdentityPageVO {
  /** 衣物唯一编码ID */
  id?: number;
    /** 衣物唯一编码(UUID格式) */
    garmentCode?: string;
    /** 关联订单明细 */
    garmentOrderDetailId?: number;
    /** 二维码存储路径 */
    qrCodePath?: string;
    /** 编码状态 1-已存在-ACTIVE 2-已收回-RETIRED 3-已丢失-LOST */
    status?: number;
    /** 创建时间 */
    createTime?: Date;
    /** 更新时间 */
    updateTime?: Date;
}

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

/** 选项VO（用于下拉选择框） */
export interface AioveuGarmentIdentityOptionVO {
  /** 衣物唯一编码ID */
  id: number;
  /** 衣物唯一编码(UUID格式) */
  garmentCode: string;
}
