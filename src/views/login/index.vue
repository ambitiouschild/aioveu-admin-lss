<template>

  <!-- 登录页面容器 -->
  <div class="login-container">
    <!-- 右侧切换主题、语言按钮  -->
    <div class="action-bar">

      <!-- 主题切换按钮 -->
      <el-tooltip :content="t('login.themeToggle')" placement="bottom">
        <CommonWrapper>
          <DarkModeSwitch />
        </CommonWrapper>
      </el-tooltip>

      <!-- 语言切换按钮 -->
      <el-tooltip :content="t('login.languageToggle')" placement="bottom">
        <CommonWrapper>
          <LangSelect size="text-20px" />
        </CommonWrapper>
      </el-tooltip>
    </div>
    <!-- 登录页主体 -->
    <div flex-1 flex-center>

      <!-- 登录卡片容器 -->
      <div
        class="p-4xl w-full h-auto sm:w-450px border-rd-10px sm:h-680px shadow-[var(--el-box-shadow-light)] backdrop-blur-3px"
      >
        <div w-full flex flex-col items-center>
          <!-- Logo图片 -->
          <!-- 头像在这里导入：从 @/assets/logo.png -->
          <el-image :src="logo" style="width: 84px" />

          <!-- 标题区域 -->
          <!-- 名字和版本号在这里显示：从 defaultSettings 导入 -->
          <h2>
            <el-badge :value="`v ${defaultSettings.version}`" type="success">
              {{ defaultSettings.title }}
            </el-badge>
          </h2>

          <!-- 动态组件切换区域（登录/注册/重置密码） -->
          <transition name="fade-slide" mode="out-in">
            <component :is="formComponents[component]" v-model="component" class="w-90%" />
          </transition>
        </div>
      </div>
      <!-- 登录页底部版权信息 -->
      <el-text size="small" class="py-2.5! fixed bottom-0 text-center">
        Copyright © 2021 - 2025 aioveu.com All Rights Reserved.
        <a href="http://beian.miit.gov.cn/" target="_blank">沪ICP备2025114708号-1</a>
      </el-text>
    </div>
  </div>
</template>

<script setup lang="ts">

// ============ 导入部分 ============

// 头像导入：从本地assets目录导入logo图片
import logo from "@/assets/logo.png";

// 系统配置导入：包含名字(title)和版本号(version)
// 这个文件通常位于 src/settings.ts 或 src/config/settings.ts
import { defaultSettings } from "@/settings";

// 组件导入
import CommonWrapper from "@/components/CommonWrapper/index.vue";
import DarkModeSwitch from "@/components/DarkModeSwitch/index.vue";

// ============ 类型定义 ============
type LayoutMap = "login" | "register" | "resetPwd";


// ============ 初始化 ============
const t = useI18n().t;    // 国际化翻译函数


// ============ 响应式数据 ============

// 当前显示的组件类型，默认为登录组件
const component = ref<LayoutMap>("login"); // 切换显示的组件


// 表单组件映射表
// 使用defineAsyncComponent实现按需加载，优化性能
const formComponents = {
  login: defineAsyncComponent(() => import("./components/Login.vue")),    // 登录组件
  register: defineAsyncComponent(() => import("./components/Register.vue")),   // 注册组件
  resetPwd: defineAsyncComponent(() => import("./components/ResetPwd.vue")),  // 重置密码组件
};
</script>

<style lang="scss" scoped>

/* 登录容器样式 */
.login-container {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;   /* 占满整个视口高度 */
}

/*
  背景层伪元素
  使用::before创建背景层，实现背景图片效果
  z-index: -1 确保背景在内容下方
*/
.login-container::before {
  position: fixed;
  top: 0;
  left: 0;
  z-index: -1;
  width: 100%;
  height: 100%;
  content: "";
  background: url("@/assets/images/login-bg.svg");   /* 背景图片路径 */
  background-position: center center;   /* 背景居中 */
  background-size: cover;   /* 背景图片覆盖整个区域 */
}

/* 操作栏样式（主题/语言切换按钮） */
.action-bar {
  position: fixed;
  top: 10px;
  right: 10px;
  z-index: 10;   /* 确保在最上层 */
  display: flex;
  gap: 8px;   /* 按钮间距 */
  align-items: center;
  justify-content: center;
  font-size: 1.125rem;   /* 18px */

  /* 移动端适配 */
  @media (max-width: 480px) {
    top: 10px;
    right: auto;   /* 取消右侧定位 */
    left: 10px;     /* 改为左侧定位 */
  }

  /* 大屏适配 */
  @media (min-width: 640px) {
    top: 40px;
    right: 40px;
  }
}

/* 组件切换动画效果 */
/* fade-slide 动画类名 */
.fade-slide-leave-active,
.fade-slide-enter-active {
  transition: all 0.3s;    /* 所有属性过渡0.3秒 */
}

/* 新组件进入前的状态 */
.fade-slide-enter-from {
  opacity: 0;      /* 完全透明 */
  transform: translateX(-30px);  /* 从左侧30px进入 */
}

/* 旧组件离开后的状态 */
.fade-slide-leave-to {
  opacity: 0;    /* 完全透明 */
  transform: translateX(30px);   /* 向右侧30px离开 */
}
</style>
