<template>

  <!-- 页面容器，使用 Element Plus 的 app-container 样式 -->
  <div class="app-container">

    <!-- Element Plus 的栅格布局系统 :gutter="10": 列间距为 10px -->
    <el-row :gutter="10">
      <!--
        左侧列：商品分类树
        :span="14": 在大屏幕下占 14/24 的宽度
        :xs="24": 在超小屏幕（手机）下占 24/24（全宽）
      -->

      <el-col :span="14" :xs="24">

        <!-- 卡片组件，用于包裹分类树 shadow="always": 始终显示阴影效果-->
        <el-card class="box-card" shadow="always">
          <!--  卡片头部插槽  使用 svg-icon 组件显示菜单图标-->

          <template #header>
            <svg-icon icon-class="menu" />  <!-- 图标组件 -->
            商品分类    <!-- 标题 -->
          </template>

          <!--Category 组件：商品分类树组件 ref="categoryRef": 组件引用，可以通过 this.$refs.categoryRef 访问组件实例
            @category-click="handleCategoryClick": 监听分类点击事件-->

          <Category ref="categoryRef" @category-click="handleCategoryClick" />
        </el-card>
      </el-col>

      <!--
          右侧列：规格属性管理
          :span="10": 在大屏幕下占 10/24 的宽度
          :xs="24": 在超小屏幕下占 24/24（全宽）
       -->
      <el-col :span="10" :xs="24">

        <!--
            卡片组件，用于包裹规格属性管理区域
        -->
        <el-card class="box-card" shadow="always">
          <template #header>
            <!--
              卡片头部插槽
              显示当前选中分类的名称
            -->
            <svg-icon icon-class="menu" />
            <!--
              显示当前选中分类的名称
              如果未选择分类，显示" 规格属性"
              如果选择了分类，显示"分类名称 规格属性"
            -->
            {{ category.name }} 规格属性
          </template>
          <!--
              Attribute 组件：商品规格管理组件
              ref="specificationRef": 组件引用
              :attributeType="1": 传递属性类型，1 表示商品规格
              :category="category": 传递当前选中的分类信息
          -->
          <Attribute
            ref="specificationRef"
            :attributeType="1"
            :category="category"
          />
          <!--
              Attribute 组件：商品属性管理组件
              ref="attributeRef": 组件引用
              :attributeType="2": 传递属性类型，2 表示商品属性
              :category="category": 传递当前选中的分类信息
          -->
          <Attribute
            ref="attributeRef"
            :attributeType="2"
            :category="category"
          />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>


<!--
  商品分类及规格属性管理页面组件
  功能：商品分类管理的主页面，包含分类树和对应的规格属性管理
  页面结构：左右分栏布局
    左侧：商品分类树（可进行增删改查）
    右侧：选中分类的规格和属性管理
-->

<!--
  defineOptions: Vue 3.3+ 的编译宏，用于设置组件选项
  name: 组件名称，用于开发工具显示和 keep-alive 缓存
  inheritAttrs: 是否继承非 prop 的属性（如 class、style 等）
-->

<script setup lang="ts">
defineOptions({
  name: "Category",    // 组件名称
  inheritAttrs: false,  // 不自动继承父组件传递的非 prop 属性
});

// 响应式状态管理
const state = reactive({

  // 当前选中的商品分类信息
  category: {
    id: undefined,  // 分类ID
    name: "",        // 分类名称
    childrenLen: 0,     // 子分类数量
  },
});

// 将响应式状态解构为ref，方便在模板中使用
const { category } = toRefs(state);


/**
 * 处理分类点击事件
 * 当左侧分类树中的分类被点击时触发
 * @param categoryRow - 点击的分类节点数据
 */
function handleCategoryClick(categoryRow: any) {

  // 如果有选中分类，更新当前选中的分类信息
  if (categoryRow) {
    state.category = {
      id: categoryRow.id,   // 分类ID
      name: categoryRow.name,   // 分类名称
      childrenLen: categoryRow.children.length,  // 子分类数量
    };
  } else {

    // 如果没有选中分类（如取消选择），重置分类信息
    state.category = {
      id: undefined,
      name: "",
      childrenLen: 0,
    };
  }
}
</script>




<!--
  注意：没有 <style> 部分
  样式可能通过以下方式处理：
  1. 在全局样式文件中定义
  2. 在父组件中定义
  3. 通过 Element Plus 的类名应用默认样式
-->

<!--
  响应式设计说明：
  1. 在大屏幕（桌面端）：左侧分类树占 14/24，右侧规格属性占 10/24
  2. 在超小屏幕（手机端）：左右两侧都占 24/24（垂直堆叠）
  3. 通过 el-row 和 el-col 实现响应式布局
-->

<!--组件详细说明
1. 组件作用
这是一个商品分类和规格属性的管理页面，采用左右分栏布局：
左侧：显示商品分类树，可进行增删改查操作
右侧：根据左侧选中的分类，显示和管理对应的商品规格和属性
2. 核心功能
分类管理：通过 Category 组件管理商品分类树
规格管理：通过 Attribute 组件管理商品规格（如颜色、尺寸）
属性管理：通过 Attribute 组件管理商品属性（如材质、产地）
数据联动：选择不同分类时，右侧自动切换显示对应的规格属性
3. 组件通信流程
用户点击左侧分类树
↓
Category 组件发射 category-click 事件
↓
handleCategoryClick 函数接收事件
↓
更新当前选中的分类信息 (state.category)
↓
通过 props 传递给右侧的 Attribute 组件
↓
Attribute 组件根据分类 ID 加载对应的规格/属性数据
4. 响应式设计
桌面端：左右分栏，14:10 的比例
移动端：垂直堆叠，上下排列
通过 Element Plus 的栅格系统实现：
:span="14": 在中等及以上屏幕占 14/24
:xs="24": 在超小屏幕（<768px）占 24/24
5. 状态管理
state.category = {
id: undefined,      // 分类ID，用于查询对应的规格属性
name: "",           // 分类名称，用于显示在右侧标题
childrenLen: 0,     // 子分类数量，可能用于控制某些操作权限
}
6. 组件交互
1.用户在左侧分类树中点击某个分类
2.触发 handleCategoryClick函数，更新当前选中分类
3.右侧两个 Attribute 组件接收新的分类信息
4.Attribute 组件根据分类ID加载对应的数据
5.用户可以管理该分类下的规格和属性
7. 注意事项
未选择分类时：右侧显示"规格属性"，但可能禁用编辑功能
子组件通信：通过 ref 可以访问子组件实例和方法
数据同步：当左侧分类变化时，右侧数据会自动刷新
性能考虑：通过 props 传递数据，避免不必要的重新渲染
8. 扩展性
可以添加更多的属性管理组件
可以添加分类的批量操作功能
可以添加分类的拖拽排序功能
可以添加分类的导入导出功能
9. 用户体验
清晰的视觉分层：分类树在左，详情在右
实时反馈：点击分类立即显示对应的规格属性
响应式设计：适配不同屏幕尺寸
明确的标题：显示当前操作的是哪个分类
这个组件是商品分类管理系统的核心页面，提供了直观的分类管理和对应的属性配置界面。-->
