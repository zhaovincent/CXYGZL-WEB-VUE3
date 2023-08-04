/*
 * @Date: 2022-08-25 14:13:11
 * @LastEditors: StavinLi 495727881@qq.com
 * @LastEditTime: 2023-05-24 15:00:32
 * @FilePath: /Workflow-Vue3/src/store/index.js
 */
import {defineStore} from "pinia";
import {FormConfigUserVO, FormVO} from "@/api/form/types";

var adminList: FormConfigUserVO[] = reactive([])

export const useFlowStore = defineStore("flow", {
	state: () => {
		return {
			step3:{

			},
			step1: {
				logo: "",

				name: "",
				flowId: "",
				groupId: undefined,
				admin: adminList,
				remark: "",
			},
			step2: [] as FormVO[],
		};
	},
	actions: {
		setStep3(p: any) {
			this.step3 = p;
		},
		setStep2(p: FormVO[]) {
			this.step2 = p;
		},
	},
});
