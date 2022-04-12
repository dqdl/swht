
<template>
    <div class="riskAnalysis">
        <div class="top">
            <toptitle :prop-value="'风险管控'" />
            <div class="warnList">
                <warn v-for="(item,index) of warnList" :key="item.title" :prop-value="item" />
            </div>
        </div>
        <div class="bottom">
            <div class="left">
                <toptitle :prop-value="'风险点统计情况'" />
            </div>
            <div class="right">
                <toptitle :prop-value="'风险点企业统计'" />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
// components
import toptitle from '../../components/risk_Analysis/title/index.vue'
import warn from '../../components/risk_Analysis/warn/index.vue'
// vue
import { reactive } from 'vue';
/**
 * state
 */
const warnList = reactive([
    {
        title: '重大风险点涉及企业数',
        num: 100,
        bgColor: '#ffe4de',
        circleColor: '#ff4924',
        fontColor: '#e21e00',
        gradient: 'linear-gradient(130deg, #ff9c9c 11%, #ff4022 98%)'
    },
    {
        title: '较大风险点涉及企业数',
        num: 100,
        bgColor: '#fff0de',
        circleColor: '#ff9924',
        fontColor: '#EB7E00',
        gradient: 'linear-gradient(130deg, #ffcc91 11%, #ff9924 98%)'
    },
    {
        title: '一般风险点涉及企业数',
        num: 100,
        bgColor: '#fff6d9',
        circleColor: '#ffc400',
        fontColor: '#F2A900',
        gradient: 'linear-gradient(130deg,#ffe282 11%, #ffc400 98%)'
    },
    {
        title: '低风险点涉及企业数',
        num: 100,
        bgColor: '#e0f2ff',
        circleColor: '#32a8ff',
        fontColor: '#0086E8',
        gradient: 'linear-gradient(130deg,#6fc2ff 11%, #1c9cfa 98%)'
    },
])
</script>

<style lang="postcss" scoped>
.riskAnalysis {
    width: 100%;
    .top {
        width: 100%;
        height: 250px;
        margin-bottom: 30px;
        border-radius: 10px;
        background-color: #fff;
        .warnList {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 44px 20px;
        }
    }
    .bottom {
        width: 100%;
        height: 650px;
        display: flex;
        > div {
            border-radius: 10px;
            background-color: #fff;
        }
        .left {
            width: 512px;
            height: 100%;
            margin-right: 30px;
        }
        .right {
            width: 1048px;
            height: 100%;
        }
    }
}
</style>