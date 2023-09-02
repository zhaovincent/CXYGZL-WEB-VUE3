import { createApp } from "vue";
import App from "./App.vue";
import router from "@/router";
import { setupStore } from "@/views/cxygzl/stores/store";
import { setupDirective } from "@/directive";

import "@/permission";

// 本地SVG图标
import "virtual:svg-icons-register";

//日期计算格式化
import moment from 'moment'
// 国际化
import i18n from "@/lang/index";

import { ElLoading } from 'element-plus'

// 设置icon
import installIcon from '@/views/cxygzl/utils/icon'

// 样式
import "element-plus/theme-chalk/dark/css-vars.css";
import "@/styles/index.scss";
import "uno.css";

const app = createApp(App);
// 全局注册 自定义指令(directive)
setupDirective(app);
// 全局注册 状态管理(store)
setupStore(app);

app.use(router)
	.use(installIcon) // 注册全局图标
	.use(i18n).mount("#app");

app.directive("focus", {
  mounted(el) {
    el.focus();
  },
});
app.directive("enterNumber", {
  mounted(el, { value = 100 }, vnode) {
    el = el.nodeName == "INPUT" ? el : el.children[0];
    var RegStr =
      value == 0
        ? `^[\\+\\-]?\\d+\\d{0,0}`
        : `^[\\+\\-]?\\d+\\.?\\d{0,${value}}`;
    el.addEventListener("input", function () {
      el.value = el.value.match(new RegExp(RegStr, "g"));
      el.dispatchEvent(new Event("input"));
    });
  },
});
app.config.globalProperties.$isBlank = function (s?: String) {
  if (s === undefined || s === null || ((typeof s)==='string'&& s.trim().length == 0)) {
    return true;
  }
  return false;
};
app.config.globalProperties.$isNotBlank = function (s?: String) {
  return !this.$isBlank(s);
};
app.config.globalProperties.$isNode = function (obj:any) {
	return this.$isNotBlank(obj)&& this.$isNotBlank(obj.id);

};
app.config.globalProperties.$getRandomId = function () {
  return `cxygzl_${new Date().getTime().toString().substring(5)}${Math.round(
    Math.random() * 9000 + 1000
  )}`;
};

//获取数字的小数点位数
app.config.globalProperties.$getNumberRadixNum = function (s: Number) {
	let strings = s.toString().split(".");
	if(strings.length<=1){
		return 0;
	}
	return strings[1].toString().length;
};
//深拷贝
app.config.globalProperties.$deepCopy = function (s: any) {
  return JSON.parse(JSON.stringify(s));
};
app.config.globalProperties.$moment = moment
