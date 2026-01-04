import request from "@/utils/request";

const AUTH_BASE_URL = "/aioveu-auth/api/v1/auth";

const AUTH_LOGIN_URL = "/aioveu-auth";

const AUTH_LOGOUT_URL = "/aioveu-lss/api/v1/users";

const AuthAPI = {

  // /** 登录接口*/
  // login(data: LoginFormData) {
  //   const formData = new FormData();
  //   formData.append("username", data.username);
  //   formData.append("password", data.password);
  //   formData.append("captchaId", data.captchaId as string);
  //   formData.append("captchaCode", data.captchaCode as string);
  //   formData.append("grant_type", "password");
  //   return request<any, LoginResult>({
  //     url: `${AUTH_Login_URL}/oauth2/token`,
  //     method: "post",
  //     data: formData,
  //     headers: {
  //       "Content-Type": "multipart/form-data",
  //       Authorization: "Basic bWFsbC1hZG1pbjoxMjM0NTY=", // 客户端信息Base64明文：aioveu-admin:123456
  //
  //       // "Content-Type": "application/x-www-form-urlencoded",  // 必须！
  //       // "Authorization": "Basic YWlvdmV1LWFkbWluOjEyMzQ1Ng==",  // 使用图片中的值
  //
  //     },
  //   });
  // },

  /** 登录接口*/
  login(data: LoginData) {
    const formData = new FormData();
    formData.append("username", data.username);
    formData.append("password", data.password);
    formData.append("captchaKey", data.captchaId as string);
    formData.append("captchaCode", data.captchaCode as string);
    formData.append("grant_type", "password");

    // 正确查看FormData内容的方法
    // console.log("📤 登录请求详情:");
    // console.log("用户名:", data.username);
    // console.log("密码:", "******"); // 不打印实际密码
    // console.log("验证码ID:", data.captchaId);
    // console.log("验证码:", data.captchaCode);
    // console.log("授权类型:", "password");

    // 查看Authorization头
    // const authHeader = "Basic bWFsbC1hZG1pbjoxMjM0NTY=";  // mall-admin:123456
    // console.log("🔑 Authorization头:", authHeader);

    // 解码查看客户端信息
    // try {
    //   const decoded = atob(authHeader.split(" ")[1]);
    //   console.log("🔓 解码后的客户端信息:", decoded); // mall-admin:123456
    // } catch (e) {
    //   console.error("解码失败:", e);
    // }

    return request<any, LoginResult>({
      url: `${AUTH_LOGIN_URL}/oauth2/token`,
      method: "post",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: "Basic bWFsbC1hZG1pbjoxMjM0NTY=", // 客户端信息Base64明文：mall-admin:123456
      },
    }).then(response => {
      // console.log("✅ 登录响应:", response);
      return response;
    }).catch(error => {
      console.error("❌ 登录错误:", error);
      throw error;
    });
  },


  /** 登录接口*/
  // login(data: LoginFormData) {
  //   const formData = new FormData();
  //   formData.append("username", data.username);
  //   formData.append("password", data.password);
  //   formData.append("captchaKey", data.captchaKey);
  //   formData.append("captchaCode", data.captchaCode);
  //   return request<any, LoginResult>({
  //     url: `${AUTH_BASE_URL}/login`,
  //     method: "post",
  //     data: formData,
  //     headers: {
  //       "Content-Type": "multipart/form-data",
  //     },
  //   });
  // },

  /** 刷新 token 接口*/
  refreshToken(refreshToken: string) {
    return request<any, LoginResult>({
      url: `${AUTH_BASE_URL}/refresh-token`,
      method: "post",
      params: { refreshToken },
      headers: {
        Authorization: "no-auth",
      },
    });
  },

  /** 退出登录接口 */
  logout() {
    return request({
      url: `${AUTH_LOGOUT_URL}/logout`,
      method: "delete",
    });
  },

  // /** 获取验证码接口*/
  getCaptcha() {
    return request<any, CaptchaInfo>({
      url: `${AUTH_BASE_URL}/captcha`,
      method: "get",
    });
  },

  /** 获取验证码接口*/
  // getCaptcha() {
  //   return request<any, CaptchaInfo>({
  //     url: `/aioveu-auth/api/v1/auth/captcha`,
  //     method: "get",
  //   });
  // },
};

export default AuthAPI;

/** 登录表单数据 */
export interface LoginFormData {
  /** 用户名 */
  username: string;
  /** 密码 */
  password: string;
  // /** 验证码缓存key */
  // captchaKey: string;

  /**
   * 授权类型
   */
  grant_type?: string;

  /** 验证码缓存key */
  captchaId?: string;

  /** 验证码 */
  captchaCode?: string;
  /** 记住我 */
  rememberMe: boolean;
}

/** 登录响应 */
export interface LoginResult {
  /** 访问令牌 */
  accessToken: string;
  /** 刷新令牌 */
  refreshToken: string;

  /** 访问令牌 */
  access_token: string;
  /** 刷新令牌 */
  refresh_token: string;

  /** 令牌类型 */
  tokenType: string;
  /** 过期时间(秒) */
  expiresIn: number;
}

/** 验证码信息 */
export interface CaptchaInfo {
  /** 验证码缓存key */
  captchaKey: string;

  captchaId: string;

  /** 验证码图片Base64字符串 */
  captchaBase64: string;
}


/**
 * 登录请求参数
 */
export interface LoginData {
  /**
   * 用户名
   */
  username: string;
  /**
   * 密码
   */
  password: string;
  /**
   * 授权类型
   */
  grant_type?: string;
  /**
   * 验证码Code
   */
  captchaCode?: string;
  /**
   * 验证码唯一标识(UUID)
   */
  captchaId?: string;
}
