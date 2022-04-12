<template>
	<div class="toggleSystems">
		<headerVue />
		<hr />
		<div class="systems">
			<div
				v-for="(item, index) of systemList"
				:key="index"
				@click="test(index, item)"
			>
				<div class="pic" :style="'background: url(' + item.imgUrl + ');'" />
			</div>
		</div>
	</div>
</template>
<script lang="ts" setup>
// vue
import { useRouter } from 'vue-router';
import { reactive } from 'vue';
// components
import headerVue from '@/components/header/header.vue';
// images
import images_1 from '../../assets/images/toogleSystems/screen.png';
import images_2 from '../../assets/images/toogleSystems/production.png';
import images_3 from '../../assets/images/toogleSystems/information.png';
import images_4 from '../../assets/images/toogleSystems/basic.png';
import images_5 from '../../assets/images/toogleSystems/environment.png';
const router = useRouter();

const systemList = reactive([
	{
		href: 'javascript:;',
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
const test = (index: number, item: any) => {
	if (index === 2) {
		location.href =
			'http://121.204.146.20:808/managementSystem/safeProduction/#/riskIdentification';
	}
	if (index === 3) {
		router.push('/index');
	}
	if (index === 4) {
		location.href =
			'http://121.204.146.20:808/managementSystem/information/#/enterpriseArchives';
	}
	if (index === 1) {
		window.location.replace(
			'http://121.204.146.20:808/managementSystem/dist/#/coreSystem/userManagement/managementCommittee'
		);
	}
	if (index === 0) {
		window.open(
			'http://121.204.146.20:808/visualizationSystem/dist/#/home',
			'width=' +
				window.screen.availWidth +
				',height=' +
				window.screen.availHeight +
				',top=0,left=0,toolbar=no,menubar=no,scrollbars=no, resizable=no,location=no, status=no'
		);
	}
};
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
		cursor: pointer;
		.pic {
			width: 324px;
			height: 546px;
		}
	}
}
</style>
