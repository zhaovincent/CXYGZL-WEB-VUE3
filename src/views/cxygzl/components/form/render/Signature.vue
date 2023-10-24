<script setup lang="ts">

import {onMounted,ref} from "vue";

const dialogTableVisible=ref(false);

const show=(title1)=>{

  title.value=title1;

  dialogTableVisible.value=true;

}


defineExpose({show});




const handleClearSign = () => {
  ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);
};


import {Delete} from "@element-plus/icons-vue";
import {uploadFileApi} from "../../../api/file";
import {createSignatureRecord} from "../../../api/signatureRecord";

// 绘制起点
let startX = 0,
    startY = 0;
let ctx: CanvasRenderingContext2D;

const canvas = ref();

const onEventStart = (event: MouseEvent | TouchEvent) => {
  [startX, startY] = getOffset(event);
  painting = true;
};


const onEventMove = (event: MouseEvent | TouchEvent) => {
  if (painting) {
    // 鼠标/触摸 移动时，保存 移动点相对 被触发dom的左、上 距离
    const [endX, endY] = getOffset(event);
    paint(startX, startY, endX, endY, ctx);

    // 每次绘制 或 清除结束后，起点要重置为上次的终点
    startX = endX;
    startY = endY;
  }
};

const onEventEnd = () => {
  if (painting) {
    painting = false; // 停止绘制
  }
};

// 正在绘制中，用来控制 move 和 end 事件
let painting = false;

// 获取触发点相对被触发dom的左、上角距离
const getOffset = (event: MouseEvent | TouchEvent) => {
  let offset: [number, number];
  if ((event as MouseEvent).offsetX) {
    // pc端
    const { offsetX, offsetY } = event as MouseEvent;
    offset = [offsetX, offsetY];
  } else {
    // 移动端
    const { top, left } = canvas.value.getBoundingClientRect();
    const offsetX = (event as TouchEvent).touches[0].clientX - left;
    const offsetY = (event as TouchEvent).touches[0].clientY - top;
    offset = [offsetX, offsetY];
  }

  return offset;
};
// canvas 画图
function paint(
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    ctx: CanvasRenderingContext2D
) {
  ctx.beginPath();
  ctx.globalAlpha = 1;
  ctx.lineWidth = 2;
  ctx.strokeStyle = "#000";
  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);
  ctx.closePath();
  ctx.stroke();
}

const opened=()=>{
  ctx = canvas.value.getContext("2d") as CanvasRenderingContext2D;

}
const close=()=>{
  handleClearSign();
}

const title=ref('')

onMounted(() => {





});
// 转为file格式，可传递给后端
const dataURLtoFile = (dataurl: string, filename: string) => {
  const arr: string[] = dataurl.split(",");
  if (!arr.length) return;
  const mime = arr[0]?.match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
};
const isCanvasBlank = (canvas: HTMLCanvasElement) => {
  const blank = document.createElement("canvas"); //系统获取一个空canvas对象
  blank.width = canvas.width;
  blank.height = canvas.height;
  return canvas.toDataURL() == blank.toDataURL(); //比较值相等则为空
};
const handleToFile = async () => {
  if (isCanvasBlank(canvas.value)) {
    ElMessage({
      type: "warning",
      message: "当前签名文件为空",
    });
    return;
  }
  const file = dataURLtoFile(canvas.value.toDataURL(), "签名.png");
  if (!file){
    return;
  }
  const { data } = await uploadFileApi(file);


  console.log("签名图片:",data)

		await  createSignatureRecord({url:data})

  dialogTableVisible.value=false;

  //通知父组件
  emits("signSuccess", data);


};
let emits = defineEmits(['signSuccess']);

const confirm=()=>{
  handleToFile()
}

</script>

<template>
  <el-dialog :width="940" v-model="dialogTableVisible"  @close="close" :title="title" @opened="opened">

          <div style="position: relative">
            <canvas
                style="border: 1px solid lightgrey"
                ref="canvas"
                height="400"
                width="900"
                @mousedown="onEventStart"
                @mousemove.stop.prevent="onEventMove"
                @mouseup="onEventEnd"
                @touchstart="onEventStart"
                @touchmove.stop.prevent="onEventMove"
                @touchend="onEventEnd"
            >
            </canvas>
            <el-button style="position: absolute;bottom: 20px;right: 10px; " type="primary" :icon="Delete" text size="small" @click="handleClearSign">
                清除
            </el-button>
          </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogTableVisible = false">取消</el-button>
        <el-button type="primary" @click="confirm">
          确认
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped lang="less">

</style>
