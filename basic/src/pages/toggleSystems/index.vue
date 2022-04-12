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
import { reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex'
// components
import headerVue from '../../components/header/header.vue';
// images
import images_1 from '../../assets/images/toogleSystems/screen.png'
import images_2 from '../../assets/images/toogleSystems/production.png'
import images_3 from '../../assets/images/toogleSystems/information.png'
import images_4 from '../../assets/images/toogleSystems/basic.png'
import images_5 from '../../assets/images/toogleSystems/environment.png'

const router = useRouter()
let store = useStore()
const state = reactive({
    systemList: []
})
const getSystemList = ((val: any) => {
    return state.systemList.includes((val as never))
})
state.systemList = store.state.mune.systemList
const systemList = reactive([
    {
        href: 'javascript:;',
        url: 'http://121.204.146.20:808/visualizationSystem/dist/#/home',
        type: "1",
        lable: '大数据可视化系统',
        imgUrl: images_1,
    },
    {
        href: 'javascript:;',
        lable: '基础核心支撑系统',
        imgUrl: images_4,
    },
    {
        href: 'javascript:;',
        lable: '安全生产监督系统',
        imgUrl: images_2,
    },
    {
        href: 'javascript:;',
        lable: '智慧环保系统',
        imgUrl: images_5,
    },
    {
        href: 'javascript:;',
        lable: '企业信息管理系统',
        imgUrl: images_3,
    },
])
const test = (index: number, item: any) => {
    if (index === 0) {
        window.open(item.url, 'width=' + (window.screen.availWidth) + ',height=' + (window.screen.availHeight) + ',top=0,left=0,toolbar=no,menubar=no,scrollbars=no, resizable=no,location=no, status=no')
    }
    if (index === 1) {
        router.push('/coreSystem')
    }
    if (index === 2) {
        location.href = 'http://121.204.146.20:808/managementSystem/safeProduction/#/riskIdentification'
    }
    if (index === 3) {
        location.href = 'http://121.204.146.20:808/managementSystem/envrionment/#/enterpriseDetection'
    }
    if (index === 4) {
        location.href = "http://121.204.146.20:808/managementSystem/information/#/enterpriseArchives"
    }
}
computed(() => {

})
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
        justify-content: center;
		cursor: pointer;
		.pic {
			width: 324px;
			height: 546px;
		}
    }
}
</style>