<script setup lang="ts">
import { useAppStore } from '@/store/modules/app';

const appStore = useAppStore();

const sizeOptions = ref([
  { label: '默认', value: 'default' },
  { label: '大型', value: 'large' },
  { label: '小型', value: 'small' }
]);

function handleSizeChange(size: string) {
  appStore.changeSize(size);
  ElMessage.success('切换布局大小成功');
}
import {Check, Plus,Bell, Aim, Link} from "@element-plus/icons-vue";

</script>

<template>
		<div>
		<el-badge :value="12" is-dot>
			<svg-icon icon-class="message" />
		</el-badge>
		</div>

</template>
