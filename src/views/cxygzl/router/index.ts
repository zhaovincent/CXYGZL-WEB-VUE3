import { createRouter, createWebHashHistory,onBeforeRouteLeave , RouteRecordRaw } from "vue-router";



// 静态路由
export const constantRoutes: RouteRecordRaw[] = [


  {
    path: "/flow/group",
    component: () => import("../views/flow/group.vue"),
    meta: { hidden: true },
  },

  {
    path: "/system/message",
    component: () => import("../views/system/message/index.vue"),
    meta: { hidden: true },
  },
  {
    path: "/system/prop",
    component: () => import("../views/system/prop/index.vue"),
    meta: { hidden: true },
  },

  {
    path: "/flow/list",
    component: () => import("../views/flow/list.vue"),
    meta: { hidden: true },
  },

  {
    path: "/flow/create",
    component: () => import("../views/flow/create.vue"),
    meta: { hidden: true },
  },
  {
    path: "/task/pending",
    component: () => import("../views/task/pending.vue"),
    meta: { hidden: true },
  },

  {
    path: "/task/cc",
    component: () => import("../views/task/cc.vue"),
    meta: { hidden: true },
  },
  {
    path: "/task/completed",
    component: () => import("../views/task/completed.vue"),
    meta: { hidden: true },
  },

  {
    path: "/task/started",
    component: () => import("../views/task/started.vue"),
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



export default router;
