<template>
	<div class="mapBox">
		<iframe
			ref="mapBox"
			src="/src/components/map/index.html"
			frameborder="0"
			style="width: 620px; height: 500px"
		></iframe>
		<!-- <span @click="surePoint" style="position:absolute;bottom: 50px;left: 50px">确定</span> -->
		<div class="btnList">
			<n-button type="info" @click="surePoint">保存</n-button>
			<n-button type="info" @click="cancelGet">取消</n-button>
		</div>
	</div>
</template>

<script lang="ts" setup>
// vue
import { reactive, ref, h } from 'vue';
import { useRouter } from 'vue-router';
const emit = defineEmits(['getPoint', 'cancelGet']);
const mapBox: any = ref(null);
let point: any = ref('');
const surePoint = () => {
	let str = mapBox.value.contentWindow.point;
	point.value = str ? str : '';
	// debugger
	emit('getPoint', point.value);
};
const cancelGet = () => {
	emit('cancelGet', false);
};
</script>
<style lang="postcss" scoped>
.mapBox {
	width: 600px;
	height: 550px;
	position: relative;
	.btnList {
		position: absolute;
		bottom: 50px;
		left: 50px;
		width: 24%;
		display: flex;
		justify-content: space-between;
	}
}
</style>
