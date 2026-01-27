import type { NavigationGuardNext, RouteLocationNormalized, RouteRecordRaw } from "vue-router";
import NProgress from "@/utils/nprogress";
import { Auth } from "@/utils/auth";
import router from "@/router";
import { usePermissionStore, useUserStore } from "@/store";
import { ROLE_ROOT } from "@/constants";

// 路由生成锁，防止重复生成
let isGeneratingRoutes = false;


//    // 路由守卫
export function setupPermission() {

  // 白名单路由 - 不需要登录就能访问的页面
  const whiteList = ["/login"];

  router.beforeEach(async (to, from, next) => {
    NProgress.start();  // 显示页面加载进度条
    console.log("🚀 路由守卫已触发 Route guard triggered:", { to: to.path, from: from.path });

    const isLoggedIn = Auth.isLoggedIn();   // 检查用户是否已登录

    if (isLoggedIn) {
      console.log("✅ 用户已经登录 User is logged in");

      // 如果已登录但访问登录页，重定向到首页
      if (to.path === "/login") {
        console.log("🔄 重定向到首页 Redirecting from login to home");
        next({ path: "/" });   // 跳转到首页
        return;   // ❌ 这里缺少 NProgress.done()，可能导致进度条不消失
      }

      // 处理已登录用户的路由访问
      await handleAuthenticatedUser(to, from, next);
    } else {
      console.log("❌ 用户未登录 User not logged in");

      // 未登录用户的处理
      if (whiteList.includes(to.path)) {
        next();  // 白名单页面允许访问
      } else {
        redirectToLogin(to, next);   // 重定向到登录页
        NProgress.done();   // 关闭进度条
      }
    }
  });

  // 后置守卫，确保进度条关闭
  router.afterEach((to, from) => {
    console.log("✅ 路线导航已完成 Route navigation completed:", { to: to.path, from: from.path });
    NProgress.done();    // 确保进度条关闭
  });
}

/**
 * 处理已登录用户的路由访问
 */
async function handleAuthenticatedUser(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  const permissionStore = usePermissionStore();  // 权限store
  const userStore = useUserStore();   // 用户store

  try {
    // 检查用户信息是否存在
    if (!userStore.userInfo.username) {
      console.log("🔄 用户信息未找到，正在获取中 User info not found, fetching...");
      await userStore.getUserInfo();  // 获取用户信息
    }

    // 检查路由是否已生成
    if (!permissionStore.routesLoaded) {
      console.log("🔄 路由未加载，正在生成 Routes not loaded, generating...");

      // 防止重复生成路由
      if (isGeneratingRoutes) {
        console.log("⏳ 路由已生成，正在等待 Routes already generating, waiting...");
        // 等待当前路由生成完成
        await waitForRoutesGeneration(permissionStore);
      } else {
        await generateAndAddRoutes(permissionStore);    // 生成并添加动态路由
      }

      // 路由生成完成后，重新导航到目标路由
      console.log("🔄 路由生成完成，重新导航到目标路由 Routes generated, redirecting to:", to.path);

      // ❌❌❌ 关键问题在这里！❌❌❌
      // 问题1: replace: true 会替换历史记录，可能导致路由历史混乱
      // 问题2: 重新导航可能会导致循环
      // 问题3: 在异步操作中使用 next() 后没有 return，可能导致代码继续执行
      next({ ...to, replace: true });  // ❌ 这行导致页面不显示！
      return;  // ✅ 这里应该 return，防止继续执行
    }

    // 路由已加载，检查路由是否存在
    if (to.matched.length === 0) {
      console.log("❌ 未找到路由，重定向到404 Route not found, redirecting to 404");
      next("/404");
      return;
    }

    // 动态设置页面标题
    const title = (to.params.title as string) || (to.query.title as string);
    if (title) {
      to.meta.title = title;  // 设置页面标题
    }

    console.log("✅ 已授予路由访问权限 Route access granted:", to.path);
    next();
  } catch (error) {
    console.error("❌ 路由保护错误 Route guard error:", error);

    // 出错时重置状态并重定向到登录页
    await resetUserStateAndRedirect(to, next);
  }
}

/**
 * 生成并添加动态路由
 */
async function generateAndAddRoutes(permissionStore: any) {
  isGeneratingRoutes = true;  // 设置生成锁

  try {
    console.log("🔧 生成动态路由 Generating dynamic routes...");
    const dynamicRoutes = await permissionStore.generateRoutes();  // 生成动态路由

    // 添加路由到路由器
    dynamicRoutes.forEach((route: RouteRecordRaw) => {
      router.addRoute(route);   // 添加路由
    });

    console.log("✅ 生成和添加的所有动态路由 All dynamic routes generated and added");
  } finally {
    isGeneratingRoutes = false;  // 释放生成锁
  }
}

/**
 * 等待路由生成完成
 */
async function waitForRoutesGeneration(permissionStore: any): Promise<void> {
  return new Promise((resolve) => {
    const checkInterval = setInterval(() => {
      if (!isGeneratingRoutes && permissionStore.routesLoaded) {
        clearInterval(checkInterval);   // 清除定时器
        resolve();    // 完成等待
      }
    }, 50); // 每50ms检查一次

    // 超时保护，最多等待5秒
    setTimeout(() => {
      clearInterval(checkInterval);   // 清除定时器
      console.warn("⚠️ Routes generation timeout");
      resolve();  // 超时也完成
    }, 5000);
  });
}

/**
 * 重置用户状态并重定向到登录页
 */
async function resetUserStateAndRedirect(to: RouteLocationNormalized, next: NavigationGuardNext) {
  try {
    await useUserStore().resetAllState();  // 重置用户状态
    redirectToLogin(to, next);   // 重定向到登录页
  } catch (resetError) {
    console.error("❌ 重置用户状态失败 Failed to reset user state:", resetError);
    // 强制跳转到登录页
    next("/login");
  } finally {
    NProgress.done();  // 确保进度条关闭
  }
}

/**
 * 重定向到登录页
 */
function redirectToLogin(to: RouteLocationNormalized, next: NavigationGuardNext) {
  const params = new URLSearchParams(to.query as Record<string, string>);
  const queryString = params.toString();
  const redirect = queryString ? `${to.path}?${queryString}` : to.path;

  console.log("🔄 使用重定向重定向登录 Redirecting to login with redirect:", redirect);
  next(`/login?redirect=${encodeURIComponent(redirect)}`);  // 跳转到登录页
}

/** 判断是否有权限 */
export function hasAuth(value: string | string[], type: "button" | "role" = "button") {
  const { roles, perms } = useUserStore().userInfo;  // 获取用户角色和权限

  // 超级管理员 拥有所有权限
  if (type === "button" && roles.includes(ROLE_ROOT)) {
    return true;
  }

  const auths = type === "button" ? perms : roles;   // 根据类型选择权限或角色
  return typeof value === "string"
    ? auths.includes(value)   // 单个权限检查
    : value.some((perm) => auths.includes(perm));  // 多个权限检查
}
