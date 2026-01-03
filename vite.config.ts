import vue from "@vitejs/plugin-vue";
import { type ConfigEnv, loadEnv, defineConfig } from "vite";

import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";

import mockDevServerPlugin from "vite-plugin-mock-dev-server";

import UnoCSS from "unocss/vite";
import { resolve } from "path";
import { name, version, engines, dependencies, devDependencies } from "./package.json";

// 平台的名称、版本、运行所需的 node 版本、依赖、构建时间的类型提示
const __APP_INFO__ = {
  pkg: { name, version, engines, dependencies, devDependencies },
  buildTimestamp: Date.now(),
};

const pathSrc = resolve(__dirname, "src");

// Vite配置  https://cn.vitejs.dev/config
export default defineConfig(({ mode }: ConfigEnv) => {

  // 根据当前模式加载环境变量
  //这样配置后，Vite会根据您运行的命令自动加载对应的环境变量文件，确保开发、测试、生产环境使用正确的API配置。
  //Vite会根据启动命令自动区分开发（dev）和构建（prod）模式。在Vite中，模式（mode）是通过命令行指定的
  //在您的配置中，您已经通过 defineConfig的函数形式获取了 mode，并根据它加载了对应的环境变量。这样，您就可以根据不同的模式使用不同的配置。
  //这样，当您以开发模式启动时，Vite会加载 .env.development中的变量；当您构建生产版本时，会加载 .env.production中的变量。
  //您还在配置中使用了 isProduction变量来根据模式设置不同的构建选项（如压缩和去除console等），这进一步利用了模式的区别。
  //启动命令                             模式（mode）   说明
  // vite或 npm run dev               development   开发模式
  //vite build或 npm run build        production    生产模式
  //vite --mode test                  test         测试模式

  //您的配置已经正确实现了根据启动命令自动区分开发和生产模式。Vite 的 mode参数会准确反映您运行的命令，从而加载对应的环境变量文件和配置。
  const env = loadEnv(mode, process.cwd());     // 加载对应模式的环境变量   Vite 会根据 mode自动加载对应的环境变量文件
  const isProduction = mode === "production";              // 判断是否为生产模式

  return {
    resolve: {
      alias: {
        "@": pathSrc,
      },
    },
    css: {
      preprocessorOptions: {
        // 定义全局 SCSS 变量
        scss: {
          api: "modern-compiler",
          additionalData: `@use "@/styles/variables.scss" as *;`,
        },
      },
    },
    //Vite服务器的配置，目的是在开发时代理某些API请求到线上后端接口
    //根据当前模式加载环境变量
    server: {
      // 开发模式才启用代理和自动打开浏览器
      host: "0.0.0.0",  //服务器主机设置为"0.0.0.0"以便可以通过本地IP访问（例如同一局域网内的设备访问）
      port: +env.VITE_APP_PORT, //端口来自环境变量VITE_APP_PORT，并使用+转换为数字
      open: true,            //设置open: true，表示启动服务器时自动打开浏览器    // 生产模式不自动打开浏览器
      proxy: {
        // 只在开发模式配置代理
        // 代理 /dev-api 的请求
        [env.VITE_APP_BASE_API]: {       //代理配置中，我们使用一个动态的键（来自环境变量VITE_APP_BASE_API）作为要代理的路径前缀。 例如，如果VITE_APP_BASE_API是"/dev-api"，那么所有以/dev-api开头的请求都会被代理。
          changeOrigin: true,            //changeOrigin: true，改变请求头中的host为目标URL的host，用于解决跨域问题。
          // 代理目标地址：https://api.youlai.tech

          // target: env.VITE_APP_API_URL,       //target: 代理的目标地址，来自环境变量VITE_APP_API_URL，例如"https://api.aioveu.com
          target:  'http://localhost:9999',  // 必须是网关地址
          //rewrite: 重写路径，这里使用一个函数，将路径中的VITE_APP_BASE_API部分替换为空字符串。

          //1.计算机A - Vite 配置, rewrite，去除/dev-api ，因为计算机B的Nginx已经去除处理路径/dev-api
          //例如，请求路径为"/dev-api/user"，经过重写后变成"/user"，然后会与目标地址拼接成"https://api.aioveu.com/user
          // rewrite: (path) => path.replace(new RegExp("^" + env.VITE_APP_BASE_API), ""),

          rewrite: (path) =>
            path.replace(new RegExp("^" + env.VITE_APP_BASE_API), ""),

          //2. 计算机A - Vite 配置, 不需要rewrite，保留/dev-api ，因为计算机B的Nginx已经处理路径/dev-api
          // rewrite: (path) => path, // 保持原路径

          secure: false, // 如果是HTTPS且证书不受信任

          //跨域问题: 代理配置解决了开发时的跨域问题
          //计算机A（前端开发） -> 请求发送到计算机B的Nginx（计算机B的域名或IP）的/dev-api -> 计算机B的Nginx将请求代理到本地后端服务（127.0.0.1:8989）
          //修改计算机A的Vite配置，将target设置为计算机B的域名或IP（包括端口，如果Nginx监听的是80或443则端口可以省略），并且不要重写路径（或者重写路径为/dev-api，因为计算机B的Nginx需要这个路径）。
        },
        //在微信小程序中，发布后的小程序请求后端不需要在前端代码中设置代理。微信小程序的前端代码（运行在微信客户端中）会直接请求你配置的服务器域名。
        // 因此，你需要在微信小程序后台配置服务器域名，而不是在前端代码中设置代理。
        //微信小程序发布后，网络请求完全依赖微信后台的域名配置，前端代码不需要也不能设置代理，只需要使用配置好的合法域名即可。
      },
    },
    plugins: [
      vue(),
      env.VITE_MOCK_DEV_SERVER === "true" ? mockDevServerPlugin() : null,
      UnoCSS(),
      // API 自动导入
      AutoImport({
        // 导入 Vue 函数，如：ref, reactive, toRef 等
        imports: ["vue", "@vueuse/core", "pinia", "vue-router", "vue-i18n"],
        resolvers: [
          // 导入 Element Plus函数，如：ElMessage, ElMessageBox 等
          ElementPlusResolver({ importStyle: "sass" }),
        ],
        eslintrc: {
          enabled: false,
          filepath: "./.eslintrc-auto-import.json",
          globalsPropValue: true,
        },
        vueTemplate: true,
        // 导入函数类型声明文件路径 (false:关闭自动生成)
        dts: false,
        // dts: "src/types/auto-imports.d.ts",
      }),
      // 组件自动导入
      Components({
        resolvers: [
          // 导入 Element Plus 组件
          ElementPlusResolver({ importStyle: "sass" }),
        ],
        // 指定自定义组件位置(默认:src/components)
        dirs: ["src/components", "src/**/components"],
        // 导入组件类型声明文件路径 (false:关闭自动生成)
        dts: false,
        // dts: "src/types/components.d.ts",
      }),
    ],
    // 预加载项目必需的组件
    optimizeDeps: {
      include: [
        "vue",
        "vue-router",
        "element-plus",
        "pinia",
        "axios",
        "@vueuse/core",
        "codemirror-editor-vue3",
        "default-passive-events",
        "exceljs",
        "path-to-regexp",
        "echarts/core",
        "echarts/renderers",
        "echarts/charts",
        "echarts/components",
        "vue-i18n",
        "nprogress",
        "sortablejs",
        "qs",
        "path-browserify",
        "@stomp/stompjs",
        "@element-plus/icons-vue",
        "element-plus/es",
        "element-plus/es/locale/lang/en",
        "element-plus/es/locale/lang/zh-cn",
        "element-plus/es/components/alert/style/index",
        "element-plus/es/components/avatar/style/index",
        "element-plus/es/components/backtop/style/index",
        "element-plus/es/components/badge/style/index",
        "element-plus/es/components/base/style/index",
        "element-plus/es/components/breadcrumb-item/style/index",
        "element-plus/es/components/breadcrumb/style/index",
        "element-plus/es/components/button/style/index",
        "element-plus/es/components/card/style/index",
        "element-plus/es/components/cascader/style/index",
        "element-plus/es/components/checkbox-group/style/index",
        "element-plus/es/components/checkbox/style/index",
        "element-plus/es/components/col/style/index",
        "element-plus/es/components/color-picker/style/index",
        "element-plus/es/components/config-provider/style/index",
        "element-plus/es/components/date-picker/style/index",
        "element-plus/es/components/descriptions-item/style/index",
        "element-plus/es/components/descriptions/style/index",
        "element-plus/es/components/dialog/style/index",
        "element-plus/es/components/divider/style/index",
        "element-plus/es/components/drawer/style/index",
        "element-plus/es/components/dropdown-item/style/index",
        "element-plus/es/components/dropdown-menu/style/index",
        "element-plus/es/components/dropdown/style/index",
        "element-plus/es/components/empty/style/index",
        "element-plus/es/components/form-item/style/index",
        "element-plus/es/components/form/style/index",
        "element-plus/es/components/icon/style/index",
        "element-plus/es/components/image-viewer/style/index",
        "element-plus/es/components/image/style/index",
        "element-plus/es/components/input-number/style/index",
        "element-plus/es/components/input-tag/style/index",
        "element-plus/es/components/input/style/index",
        "element-plus/es/components/link/style/index",
        "element-plus/es/components/loading/style/index",
        "element-plus/es/components/menu-item/style/index",
        "element-plus/es/components/menu/style/index",
        "element-plus/es/components/message-box/style/index",
        "element-plus/es/components/message/style/index",
        "element-plus/es/components/notification/style/index",
        "element-plus/es/components/option/style/index",
        "element-plus/es/components/pagination/style/index",
        "element-plus/es/components/popover/style/index",
        "element-plus/es/components/progress/style/index",
        "element-plus/es/components/radio-button/style/index",
        "element-plus/es/components/radio-group/style/index",
        "element-plus/es/components/radio/style/index",
        "element-plus/es/components/row/style/index",
        "element-plus/es/components/scrollbar/style/index",
        "element-plus/es/components/select/style/index",
        "element-plus/es/components/skeleton-item/style/index",
        "element-plus/es/components/skeleton/style/index",
        "element-plus/es/components/step/style/index",
        "element-plus/es/components/steps/style/index",
        "element-plus/es/components/sub-menu/style/index",
        "element-plus/es/components/switch/style/index",
        "element-plus/es/components/tab-pane/style/index",
        "element-plus/es/components/table-column/style/index",
        "element-plus/es/components/table/style/index",
        "element-plus/es/components/tabs/style/index",
        "element-plus/es/components/tag/style/index",
        "element-plus/es/components/text/style/index",
        "element-plus/es/components/time-picker/style/index",
        "element-plus/es/components/time-select/style/index",
        "element-plus/es/components/timeline-item/style/index",
        "element-plus/es/components/timeline/style/index",
        "element-plus/es/components/tooltip/style/index",
        "element-plus/es/components/tree-select/style/index",
        "element-plus/es/components/tree/style/index",
        "element-plus/es/components/upload/style/index",
        "element-plus/es/components/watermark/style/index",
      ],
    },
    // 构建配置
    build: {
      chunkSizeWarningLimit: 2000, // 消除打包大小超过500kb警告
      // 生产模式才启用压缩和优化
      minify: isProduction ? "terser" : false, // 只在生产环境启用压缩
      terserOptions: isProduction
        ? {
            compress: {
              keep_infinity: true, // 防止 Infinity 被压缩成 1/0，这可能会导致 Chrome 上的性能问题
              drop_console: true, // 生产环境去除 console.log, console.warn, console.error 等
              drop_debugger: true, // 生产环境去除 debugger
              pure_funcs: ["console.log", "console.info"], // 移除指定的函数调用
            },
            format: {
              comments: false, // 删除注释
            },
          }
        : {},
      rollupOptions: {
        output: {
          // manualChunks: {
          //   "vue-i18n": ["vue-i18n"],
          // },
          // 用于从入口点创建的块的打包输出格式[name]表示文件名,[hash]表示该文件内容hash值
          entryFileNames: "js/[name].[hash].js",
          // 用于命名代码拆分时创建的共享块的输出命名
          chunkFileNames: "js/[name].[hash].js",
          // 用于输出静态资源的命名，[ext]表示文件扩展名
          assetFileNames: (assetInfo: any) => {
            const info = assetInfo.name.split(".");
            let extType = info[info.length - 1];
            // console.log('文件信息', assetInfo.name)
            if (/\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/i.test(assetInfo.name)) {
              extType = "media";
            } else if (/\.(png|jpe?g|gif|svg)(\?.*)?$/.test(assetInfo.name)) {
              extType = "img";
            } else if (/\.(woff2?|eot|ttf|otf)(\?.*)?$/i.test(assetInfo.name)) {
              extType = "fonts";
            }
            return `${extType}/[name].[hash].[ext]`;
          },
        },
      },
    },
    define: {
      __APP_INFO__: JSON.stringify(__APP_INFO__),
    },
  };
});
