<template>
  <div>

    <!-- 登录标题 -->
    <h3 text-center m-0 mb-20px>{{ t("login.login") }}</h3>

    <!-- 登录表单 -->
    <!-- 表单引用，用于表单验证和方法调用 -->
    <!-- 表单数据绑定 -->
    <!-- 表单验证规则 -->
    <!-- 表单项大小 -->
    <!-- 防止规则变更时立即验证 -->
    <el-form
      ref="loginFormRef"
      :model="loginFormData"
      :rules="loginRules"
      size="large"
      :validate-on-rule-change="false"
    >
      <!-- 用户名输入框 -->
      <!-- prop属性对应验证规则中的字段名 -->
      <el-form-item prop="username">
        <!-- trim修饰符自动去除首尾空格 -->
        <!-- 国际化占位符 -->
        <el-input
          v-model.trim="loginFormData.username"
          :placeholder="t('login.username')">

          <!-- 输入框前缀图标 -->
          <template #prefix>
            <el-icon><User /></el-icon>
          </template>

        </el-input>
      </el-form-item>

      <!-- 密码输入框，包含大写锁定提示 -->
      <!-- 根据大写锁定状态显示提示 -->
      <el-tooltip
        :visible="isCapsLock"
        :content="t('login.capsLock')"
        placement="right"
      >
        <el-form-item prop="password">

          <!-- 密码类型，显示为圆点 -->
          <!-- 显示密码可见性切换按钮 -->
          <!-- 按键抬起时检查大写锁定 -->
          <!-- 回车键触发登录 -->
          <el-input
            v-model.trim="loginFormData.password"
            :placeholder="t('login.password')"
            type="password"
            show-password
            @keyup="checkCapsLock"
            @keyup.enter="handleLoginSubmit"
          >
            <template #prefix>
              <el-icon><Lock /></el-icon>
            </template>
          </el-input>
        </el-form-item>
      </el-tooltip>


      <!-- 验证码输入框 -->
      <el-form-item prop="captchaCode">
        <!-- 使用flex布局 -->
        <div flex>

          <!-- 验证码输入部分 -->
          <!-- 回车键触发登录 -->
          <el-input
            v-model.trim="loginFormData.captchaCode"
            :placeholder="t('login.captchaCode')"
            @keyup.enter="handleLoginSubmit"
          >

            <!-- 自定义验证码图标 -->
            <template #prefix>
              <div class="i-svg:captcha" />
            </template>
          </el-input>

          <!-- 验证码图片区域 -->
          <!-- 鼠标指针样式 -->
          <!-- 固定高度和宽度 -->
          <!-- 居中显示，左边距10px -->
          <!-- 点击刷新验证码 -->
          <div
            cursor-pointer
            h="[40px]" w="[120px]"
            flex-center ml-10px
            @click="getCaptcha">

            <!-- 加载状态显示加载图标 -->
            <el-icon v-if="codeLoading" class="is-loading">
              <Loading />
            </el-icon>

            <!-- 正常状态显示验证码图片 -->
            <!-- 图片自适应容器 -->
            <!-- 圆角边框 -->
            <!-- 内边距 -->
            <!-- 内阴影边框 -->
            <!-- 验证码图片base64数据 -->
            <!-- 图片alt文本 -->
            <img
              v-else
              object-cover
              border-rd-4px
              p-1px
              shadow="[0_0_0_1px_var(--el-border-color)_inset]"
              :src="captchaBase64"
              alt="code"
            />
          </div>
        </div>
      </el-form-item>


      <!-- 记住我和忘记密码区域 -->
      <!-- 左右分布布局 -->
      <div class="flex-x-between w-full">
        <!-- 记住我复选框 -->
        <el-checkbox v-model="loginFormData.rememberMe">
          {{ t("login.rememberMe") }}
        </el-checkbox>

        <!-- 忘记密码链接 -->
        <!-- 点击切换到重置密码表单 -->
        <el-link
          type="primary"
          underline="never"
          @click="toOtherForm('resetPwd')">
          {{ t("login.forgetPassword") }}
        </el-link>
      </div>

      <!-- 登录按钮 -->
      <!-- 加载状态显示loading -->
      <!-- 宽度100% -->
      <!-- 点击触发登录 -->
      <el-form-item>
        <el-button
          :loading="loading"
          type="primary"
          class="w-full"
          @click="handleLoginSubmit"
        >
          {{ t("login.login") }}
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 注册提示区域 -->
    <!-- 居中对齐，间距10px -->
    <div flex-center gap-10px>
      <el-text size="default">{{ t("login.noAccount") }}</el-text>
      <!-- 点击切换到注册表单 -->
      <el-link
        type="primary"
        underline="never"
        @click="toOtherForm('register')"
      >
        {{ t("login.reg") }}
      </el-link>
    </div>

    <!-- 第三方登录 -->
    <div class="third-party-login">
     <!-- 分割线 -->
      <div class="divider-container">
        <div class="divider-line"></div>
        <span class="divider-text">{{ t("login.otherLoginMethods") }}</span>
        <div class="divider-line"></div>
      </div>


      <!-- 第三方登录图标 -->
      <div class="flex-center gap-x-5 w-full text-[var(--el-text-color-secondary)]">
        <!-- 微信登录 -->
        <CommonWrapper>
          <div text-20px class="i-svg:wechat" />
        </CommonWrapper>

        <!-- QQ登录 -->
        <CommonWrapper>
          <div text-20px cursor-pointer class="i-svg:qq" />
        </CommonWrapper>

        <!-- GitHub登录 -->
        <CommonWrapper>
          <div text-20px cursor-pointer class="i-svg:github" />
        </CommonWrapper>

        <!-- Gitee登录 -->
        <CommonWrapper>
          <div text-20px cursor-pointer class="i-svg:gitee" />
        </CommonWrapper>
      </div>

    </div>

  </div>
</template>


<script setup lang="ts">
// ============ 导入部分 ============
import type { FormInstance } from "element-plus";   // Element Plus表单类型
import { LocationQuery, RouteLocationRaw, useRoute } from "vue-router";   // Vue Router相关
import { useI18n } from "vue-i18n";   // 国际化
import AuthAPI, { type LoginFormData } from "@/api/auth.api";   // 认证API和类型定义
import router from "@/router";        // 路由实例
import { useUserStore } from "@/store";     // Pinia用户状态管理
import CommonWrapper from "@/components/CommonWrapper/index.vue";       // 通用包装组件
import { Auth } from "@/utils/auth";       // 认证工具类


// ============ 初始化部分 ============
const { t } = useI18n();            // 国际化函数
const userStore = useUserStore();          // 用户状态管理实例
const route = useRoute();      // 当前路由信息


// ============ 生命周期 ============
// 组件挂载时获取验证码
onMounted(() => getCaptcha());


// ============ 响应式数据定义 ============
const loginFormRef = ref<FormInstance>();          // 表单引用，用于调用表单方法
const loading = ref(false);                   // 登录按钮加载状态
// 是否大写锁定
const isCapsLock = ref(false);           // 大写锁定状态
// 验证码图片Base64字符串
const captchaBase64 = ref();            // 验证码图片Base64数据
// 记住我
const rememberMe = Auth.getRememberMe();           // 从本地存储获取"记住我"状态



// ============ 登录表单数据 ============
const loginFormData = ref<LoginFormData>({
  username: "admin",                 // 用户名，带默认值
  password: "123456",                // 密码，带默认值
  captchaId: "",                   // 验证码密钥（后端返回）
  captchaCode: "",                   // 用户输入的验证码
  rememberMe,                 // 记住我状态
});


// ============ 计算属性 ============
// 表单验证规则（使用计算属性支持国际化）
const loginRules = computed(() => {
  return {
    username: [
      {
        required: true,                       // 必填验证
        trigger: "blur",                         // 触发时机：失去焦点
        message: t("login.message.username.required"),   // 国际化错误消息
      },
    ],
    password: [
      {
        required: true,
        trigger: "blur",
        message: t("login.message.password.required"),
      },
      {
        min: 6,                               // 最小长度验证
        message: t("login.message.password.min"),
        trigger: "blur",
      },
    ],
    captchaCode: [
      {
        required: true,
        trigger: "blur",
        message: t("login.message.captchaCode.required"),
      },
    ],
  };
});


// ============ 方法定义 ============


// 获取验证码
const codeLoading = ref(false);

/**
 * 获取验证码图片
 * 从服务器获取验证码图片和对应的密钥
 */

function getCaptcha() {

  console.log("🔄 开始获取验证码...");

  codeLoading.value = true;           // 开始加载
  AuthAPI.getCaptcha()
    .then((data) => {

      console.log("✅ 验证码API响应数据:", data);

      loginFormData.value.captchaId = data.captchaId;       // 保存验证码密钥
      captchaBase64.value = data.captchaBase64;


      console.log("✅ 验证码数据:", captchaBase64.value);
      console.log("✅ 验证码数据已更新，准备渲染");
      // 保存验证码图片
    })
    .finally(() => (codeLoading.value = false));     // 结束加载
}

/**
 * 登录提交处理
 * 1. 表单验证 → 2. 执行登录 → 3. 获取用户信息 → 4. 路由跳转
 */
async function handleLoginSubmit() {
  try {
    // 1. 表单验证
    const valid = await loginFormRef.value?.validate();
    if (!valid) return;     // 验证失败则停止执行

    loading.value = true;        // 开始登录加载状态

    // 2. 执行登录（调用Pinia action）
    console.log("2. 执行登录（调用Pinia action）");
    console.log("loginFormData:{}", loginFormData.value);
    await userStore.login(loginFormData.value);

    // 3. 获取用户信息（包含用户角色，用于路由生成）
    console.log("3. 获取用户信息（包含用户角色，用于路由生成）");
    await userStore.getUserInfo();

    // 4. 登录成功，让路由守卫处理跳转逻辑
    // 解析重定向目标（从路由查询参数或默认路径）
    console.log("4. 登录成功，让路由守卫处理跳转逻辑");

    const redirect = resolveRedirectTarget(route.query);
    console.log("登陆成功 🎉 Login successful, target redirect:", redirect);

    // 通过替换当前路由触发路由守卫，让守卫处理后续的路由生成和跳转
    // 通过replace方式跳转，触发路由守卫的后续处理
    await router.replace(redirect);

    // 5. 记住我功能已实现，根据用户选择决定token的存储方式:
    // - 选中"记住我": token存储在localStorage中，浏览器关闭后仍然有效
    // - 未选中"记住我": token存储在sessionStorage中，浏览器关闭后失效
  } catch (error) {
    // 6. 统一错误处理
    getCaptcha(); // 刷新验证码
    console.error("登录失败:", error);
  } finally {
    loading.value = false;   // 结束加载状态
  }
}

/**
 * 解析重定向目标
 * 安全处理重定向路径，防止开放重定向漏洞
 * @param query 路由查询参数
 * @returns 标准化后的路由地址
 */
function resolveRedirectTarget(query: LocationQuery): RouteLocationRaw {
  // 默认跳转路径
  const defaultPath = "/";   // 默认跳转首页

  // 获取原始重定向路径
  const rawRedirect = (query.redirect as string) || defaultPath;

  try {

    console.log("使用Vue Router解析路径，确保路径合法性");
    const resolved = router.resolve(rawRedirect);

    return {
      path: resolved.path,    // 解析后的路径
      query: resolved.query,   // 解析后的查询参数
    };
  } catch {

    console.log("7. 异常处理：返回安全路径");
    return { path: defaultPath };
  }
}

/**
 * 检查大写锁定状态
 * 在密码输入时显示大写锁定提示
 *
 * @param event 键盘事件
 */
function checkCapsLock(event: KeyboardEvent) {
  // 防止浏览器密码自动填充时报错
  console.log("安全检查：确保是KeyboardEvent实例（避免浏览器自动填充时的异常）");
  if (event instanceof KeyboardEvent) {
    isCapsLock.value = event.getModifierState("CapsLock");
  }
}
// ============ 组件通信 ============
const emit = defineEmits(["update:modelValue"]);


/**
 * 切换到其他表单（注册/重置密码）
 * 通过事件通知父组件切换当前显示的form类型
 *
 * @param type 表单类型：'register' | 'resetPwd'
 */
function toOtherForm(type: "register" | "resetPwd") {

  console.log("切换到其他表单（注册/重置密码）：",type);
  emit("update:modelValue", type);
}
</script>

<style lang="scss" scoped>

/* 第三方登录样式 */
.third-party-login {
  .divider-container {
    display: flex;
    align-items: center;
    margin: 20px 0;  /* 上下边距 */

    .divider-line {
      flex: 1;   /* 弹性填充 */
      height: 1px;
      /* 渐变分割线：透明 → 边框色 → 透明 */
      background: linear-gradient(to right, transparent, var(--el-border-color-light), transparent);
    }

    .divider-text {
      padding: 0 16px;   /* 左右内边距 */
      font-size: 12px;  /* 小号字体 */
      color: var(--el-text-color-regular);
      white-space: nowrap;    /* 不换行 */
    }
  }
}
</style>
