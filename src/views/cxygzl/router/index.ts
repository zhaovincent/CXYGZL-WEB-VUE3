import { createRouter, createWebHashHistory,onBeforeRouteLeave , RouteRecordRaw } from "vue-router";



// 静态路由
export const constantRoutes: RouteRecordRaw[] = [


  {
    path: "/flow/group",
    component: () => import("../views/flow/group.vue"),
    meta: { hidden: true },
  },

  {
    path: "/flow/list",
    component: () => import("../views/flow/list.vue"),
    meta: { hidden: true },
  },


  {
    path: "/",
    component: () => import("../../../views/index.vue"),
    meta: { hidden: true },
  },


];

/**
 * 创建路由
 */
const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoutes as RouteRecordRaw[],
  // 刷新时，滚动条位置还原
  scrollBehavior: () => ({ left: 0, top: 0 }),
});

/**
 * 重置路由
 */
//TODO token失效  登录
export function resetRouter() {
  router.replace({ path: "/login" });
}

export default router;
