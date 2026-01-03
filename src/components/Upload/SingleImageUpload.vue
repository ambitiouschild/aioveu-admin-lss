<!-- 单图上传组件 -->
<template>
  <el-upload
    v-model="modelValue"
    class="single-upload"
    list-type="picture-card"
    :show-file-list="false"
    :accept="props.accept"
    :before-upload="handleBeforeUpload"
    :http-request="handleUpload"
    :on-success="onSuccess"
    :on-error="onError"
  >
    <template #default>
<!--      添加加载状态，让用户知道上传进度-->
      <div v-if="loading" class="upload-loading">
        <el-icon class="is-loading"><Loading /></el-icon>
        <span>上传中...</span>
      </div>

<!--      添加大图预览功能-->
<!--      在使用 el-image组件的大图预览功能时，预览背景是空的（透明或白色），导致与底层内容重叠。这通常是由于预览模态框的背景样式问题导致的。-->
      <!-- 优化大图预览功能 -->
<!--      1. v-if="modelValue"-->
<!--      功能: 条件渲染指令-->
<!--      作用: 当modelValue有值时（非空/非假值）才渲染该组件-->
<!--      目的: 避免在没有图片URL时显示空白或错误区域-->
<!--      2. :src="modelValue"-->
<!--      功能: 绑定图片源属性-->
<!--      作用: 将modelValue的值作为图片的URL-->
<!--      目的: 显示指定URL的图片内容-->
<!--      3. :preview-src-list="[modelValue]"-->
<!--      功能: 设置预览图片列表-->
<!--      作用: 接受一个数组作为预览图片集合-->
<!--      目的: 这里只包含当前图片，表示点击后预览当前图片-->
<!--      4. :preview-teleported="false"-->
<!--      功能: 控制预览层的位置-->
<!--      作用:-->
<!--      true(默认): 预览层会附加到body元素-->
<!--      false: 预览层保留在组件所在位置-->
<!--      目的: 控制预览层在DOM中的位置-->
<!--      5. hide-on-click-modal-->
<!--      功能: 点击遮罩层关闭预览-->
<!--      作用: 当用户点击预览时的黑色遮罩层时，自动关闭预览-->
<!--      目的: 提供更便捷的预览关闭方式-->
      <el-image
        v-if="modelValue"
        :src="modelValue"
        :preview-teleported="true"
        hide-on-click-modal
        class="preview-image"
      />

      <!--      删除按钮-->
      <el-icon v-if="modelValue" class="single-upload__delete-btn" @click.stop="handleDelete">
        <CircleCloseFilled />
      </el-icon>
      <!--      添加按钮-->
      <el-icon v-else class="single-upload__add-btn">
        <Plus />
      </el-icon>
    </template>

    <!-- 添加自定义插槽  允许用户自定义上传按钮样式 -->
    <template v-if="$slots.uploadButton" #trigger>
      <slot name="uploadButton"></slot>
    </template>

  </el-upload>
</template>

<script setup lang="ts">
import { UploadRawFile, UploadRequestOptions } from "element-plus";
import FileAPI, { FileInfo } from "@/api/file.api";

// 添加加载状态
const loading = ref(false);


//图片上传与URL转换机制
//  上传流程
// 1.用户选择图片：用户通过上传组件选择本地图片文件
// 2.前端验证：handleBeforeUpload函数验证文件类型和大小
// 3.发送请求：通过handleUpload函数将文件发送到后端
// 4.后端处理：后端接收文件，保存到存储系统（如本地磁盘、云存储等）
// 5.返回URL：后端生成文件的访问URL并返回给前端
// 6.前端更新：前端将返回的URL赋值给modelValue

const props = defineProps({
  /**
   * 请求携带的额外参数
   */
  data: {
    type: Object,
    default: () => {
      return {};
    },
  },
  /**
   * 上传文件的参数名
   */
  name: {
    type: String,
    default: "file",
  },
  /**
   * 最大文件大小（单位：M）
   */
  maxFileSize: {
    type: Number,
    default: 10,
  },

  /**
   * 上传图片格式，默认支持所有图片(image/*)，指定格式示例：'.png,.jpg,.jpeg,.gif,.bmp'
   */
  accept: {
    type: String,
    default: "image/*",
  },

  /**
   * 自定义样式，用于设置组件的宽度和高度等其他样式
   */
  style: {
    type: Object,
    default: () => {
      return {
        width: "150px",
        height: "150px",
      };
    },
  },
});

const modelValue = defineModel("modelValue", {
  type: String,
  default: () => "",
});

/**
 * 限制用户上传文件的格式和大小
 */
function handleBeforeUpload(file: UploadRawFile) {
  // 校验文件类型：虽然 accept 属性限制了用户在文件选择器中可选的文件类型，但仍需在上传时再次校验文件实际类型，确保符合 accept 的规则
  const acceptTypes = props.accept.split(",").map((type) => type.trim());

  // 检查文件格式是否符合 accept
  const isValidType = acceptTypes.some((type) => {
    if (type === "image/*") {
      // 如果是 image/*，检查 MIME 类型是否以 "image/" 开头
      return file.type.startsWith("image/");
    } else if (type.startsWith(".")) {
      // 如果是扩展名 (.png, .jpg)，检查文件名是否以指定扩展名结尾
      return file.name.toLowerCase().endsWith(type);
    } else {
      // 如果是具体的 MIME 类型 (image/png, image/jpeg)，检查是否完全匹配
      return file.type === type;
    }
  });

  if (!isValidType) {
    ElMessage.warning(`上传文件的格式不正确，仅支持：${props.accept}`);
    return false;
  }

  // 限制文件大小
  if (file.size > props.maxFileSize * 1024 * 1024) {
    ElMessage.warning("上传图片不能大于" + props.maxFileSize + "M");
    return false;
  }
  return true;
}

/*
 * 上传图片
 */
function handleUpload(options: UploadRequestOptions) {
  return new Promise((resolve, reject) => {
    const file = options.file;

    const formData = new FormData();
    formData.append(props.name, file); // 添加文件

    // 处理附加参数
    Object.keys(props.data).forEach((key) => {
      formData.append(key, props.data[key]);
    });

    FileAPI.upload(formData)
      .then((data) => {
        resolve(data);  // 返回上传结果
      })
      .catch((error) => {
        reject(error);
      });
  });
}

/**
 * 删除图片
 */
function handleDelete() {
  modelValue.value = "";
}

/**
 * 上传成功回调
 *
 * @param fileInfo 上传成功后的文件信息
 */
const onSuccess = (fileInfo: FileInfo) => {
  ElMessage.success("上传成功");
  modelValue.value = fileInfo.url;   // 将返回的URL赋值给模型值
};

/**
 * 上传失败回调  提供更详细的错误信息和重试机制
 */
const onError = (error: any) => {
  console.log("上传失败:", error);
  loading.value = false;

  let errorMessage = "上传失败";

  if (error.response) {
    // 服务器返回的错误
    const status = error.response.status;
    switch(status) {
      case 413:
        errorMessage = "文件过大，请压缩后上传";
        break;
      case 415:
        errorMessage = "不支持的图片格式";
        break;
      case 500:
        errorMessage = "服务器错误，请稍后重试";
        break;
      default:
        errorMessage = `上传失败: ${error.response.data?.message || "未知错误"}`;
    }
  } else if (error.request) {
    // 请求已发出但无响应
    errorMessage = "网络连接失败，请检查网络";
  } else {
    // 其他错误
    errorMessage = error.message || "上传过程中发生错误";
  }
  ElMessage.error(errorMessage);
};

</script>

<style scoped lang="scss">
:deep(.el-upload--picture-card) {
  width: v-bind("props.style.width");
  height: v-bind("props.style.height");
}

.single-upload {
  position: relative;
  width: v-bind("props.style.width");
  height: v-bind("props.style.height");
  overflow: hidden;
  cursor: pointer;
  border: 1px var(--el-border-color) solid;
  border-radius: 5px;

  &:hover {
    border-color: var(--el-color-primary);
  }

  &__delete-btn {
    position: absolute;
    top: 1px;
    right: 1px;
    font-size: 16px;
    color: #ff7901;
    cursor: pointer;
    background: #fff;
    border-radius: 100%;

    :hover {
      color: #ff4500;
    }
  }

}
</style>
