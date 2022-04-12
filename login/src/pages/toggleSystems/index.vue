<template>
    <div class="toggleSystems">
        <headerVue />
        <hr />
        <div class="systems">
            <a
                :href="item.href"
                v-for="(item,index) of systemList"
                :key="index"
                @click="test(index)"
            >
                <img :src="item.imgUrl" />
            </a>
        </div>
    </div>
</template>
<script lang="ts" setup>
// vue
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
// components
import headerVue from '../../components/header/header.vue';
// images
import images_1 from '../../assets/images/toogleSystems/screen.png'
import images_2 from '../../assets/images/toogleSystems/production.png'
import images_3 from '../../assets/images/toogleSystems/information.png'
import images_4 from '../../assets/images/toogleSystems/basic.png'
import images_5 from '../../assets/images/toogleSystems/environment.png'

const router = useRouter()
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
        href: '../../../system/swyqxt_production/index.html',
        imgUrl: images_2,
    },
    {
        href: '../../../system/swyqxt_environment/index.html',
        imgUrl: images_5,
    },
    {
        href: '../../../system/swyqxt_information/index.html',
        imgUrl: images_3,
    },
])
const test = (index: number) => {
    console.log(index)
    if (index === 1) {
        router.push('/index')
    }
}
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