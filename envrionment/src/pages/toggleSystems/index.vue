<template>
	<div class="toggleSystems">
		<headerVue />
		<hr />
		<div class="systems">
			<a :href="item.href" v-for="(item, index) of systemList" :key="index">
				<img :src="item.imgUrl" />
			</a>
		</div>
	</div>
</template>
<script lang="ts" setup>
// vue
import { reactive } from 'vue';
// components
import headerVue from '../../components/header/header.vue';
// images
import images_1 from '../../assets/images/toogleSystems/screen.png';
import images_2 from '../../assets/images/toogleSystems/production.png';
import images_3 from '../../assets/images/toogleSystems/information.png';
import images_4 from '../../assets/images/toogleSystems/basic.png';
import images_5 from '../../assets/images/toogleSystems/environment.png';

const systemList = reactive([
	{
		href: 'javascript:;',
		url: 'http://121.204.146.20:808/visualizationSystem/dist/#/home',
		type: '1',
		lable: '大数据可视化系统',
		imgUrl: images_1,
	},
	{
		href: 'javascript:;',
		imgUrl: images_4,
	},
	{
		href: 'javascript:;',
		imgUrl: images_2,
	},
	{
		href: 'javascript:;',
		imgUrl: images_5,
	},
	{
		href: 'javascript:;',
		imgUrl: images_3,
	},
]);
</script>
<style lang="postcss" scoped>
.toggleSystems {
	width: 100%;
	color: #fff;
	> hr {
		width: 100%;
		height: 2px;
		border: none;
		background-color: #999;
	}
	.systems {
		width: 100%;
		height: 100%;
		padding: 230px 0;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
}
</style>
