/*
 * @Date: 2022-08-25 14:13:11
 * @LastEditors: StavinLi 495727881@qq.com
 * @LastEditTime: 2023-05-24 15:00:32
 * @FilePath: /Workflow-Vue3/src/store/index.js
 */
import { defineStore } from 'pinia';

export const useStore = defineStore('store', {
  state: () => ({

    promoterDrawer: false,

    approverDrawer: false,
    triggerDrawer: false,
    delayDrawer: false,
    subProcessDrawer: false,
    approverConfigData: {},
    subProcessConfigData: {},
    triggerConfigData: {},
    delayConfigData: {},
    starterConfigData: {},
    copyerDrawer: false,
    copyerConfig1: {},
    conditionDrawer: false,
    conditionsConfig1: {
      conditionNodes: [],
    },
  }),
  actions: {


    setPromoter(payload) {
      this.promoterDrawer = payload
    },
    setSubProcess(payload) {
      this.subProcessDrawer = payload
    },

    setApprover(payload) {
      this.approverDrawer = payload
    },
    setTrigger(payload) {
      this.triggerDrawer = payload
    },
    setDelay(payload) {
      this.delayDrawer = payload
    },
    setApproverConfig(payload) {
      this.approverConfigData = payload
    },
    setSubProcessConfig(payload) {
      this.subProcessConfigData = payload
    },
    setDelayConfig(payload) {
      this.delayConfigData = payload
    },
    setTriggerConfig(payload) {
      this.triggerConfigData = payload
    },
    setStarterConfig(payload) {
      this.starterConfigData = payload
    },
    setCopyer(payload) {
      this.copyerDrawer = payload
    },
    setCopyerConfig(payload) {
      this.copyerConfig1 = payload
    },
    setCondition(payload) {
      this.conditionDrawer = payload
    },
    setConditionsConfig(payload) {
      this.conditionsConfig1 = payload
    },
  }
})
