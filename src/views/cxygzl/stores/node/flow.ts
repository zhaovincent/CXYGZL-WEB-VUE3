/*
 * @Date: 2022-08-25 14:13:11
 * @LastEditors: StavinLi 495727881@qq.com
 * @LastEditTime: 2023-05-24 15:00:32
 * @FilePath: /Workflow-Vue3/src/store/index.js
 */
import {defineStore} from "pinia";
import {FormConfigUserVO, FormVO} from "@/api/form/types";


export const useFlowStore = defineStore("flow", {
	state: () => {
		return {
			step1: {
				logo: "",
				name: "",
				flowId: "",
				groupId: undefined,
				admin: reactive([]),
				rangeList: reactive([]),
				remark: "",
			},
			step3:{

			},
			step2: [] as FormVO[],
			step4: {
				frontCheck: {
					enable: false,
					url: '',
					header: [
						// {
						// 	field: '',
						// 	valueMode: true,
						// 	value: ''
						// }
					],
					body: [
						// {
						// 	field: '',
						// 	valueMode: true,
						// 	value: ''
						// }
					]
				},
				frontNotify: {
					enable: false,
					url: '',
					header: [
						// {
						// 	field: '',
						// 	valueMode: true,
						// 	value: ''
						// }
					],
					body: [
						// {
						// 	field: '',
						// 	valueMode: true,
						// 	value: ''
						// }
					],
					result: [
						// {
						// 	field: '',
						// 	valueMode: true,
						// 	value: ''
						// }
					]
				},
				backNotify: {
					enable: false,
					url: '',
					header: [
						// {
						// 	field: '',
						// 	valueMode: true,
						// 	value: ''
						// }
					],
					body: [
						// {
						// 	field: '',
						// 	valueMode: true,
						// 	value: ''
						// }
					],
					result: [
						// {
						// 	field: '',
						// 	valueMode: true,
						// 	value: ''
						// }
					]
				}
			}
		};
	},
	actions: {
		setStep2(p: FormVO[]) {
			this.step2 = p;
		},
		setStep4(p: any) {
			this.step4 = p;
		},
		setStep3(p: any) {
			this.step3 = p;
		},
		addStep4OneLine(key1, key2) {
			this.step4[key1][key2].push({
				field: '',
				valueMode: true,
				value: ''
			})
		},
		delStep4OneLine(key1, key2, index) {
			this.step4[key1][key2].splice(index, 1)
		},
		clearStep4Value(key1, key2, index) {
			this.step4[key1][key2][index].value = '';
		}
	},
});
