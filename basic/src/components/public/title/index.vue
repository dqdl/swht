                                                                  
<template>
    <div class="riskAnaylsisTitle">
        <div class="textInfo">{{ propValue }}</div>
    </div>
</template>

<script lang="ts" setup>
const props = defineProps({
    propValue: {
        type: String,
        default: () => '风险统计分析'
    }
})
</script>

<style lang="postcss" scoped>
.riskAnaylsisTitle {
    width: 100%;
    border-bottom: 1px solid #d9e3ed;
    .textInfo {
        width: 230px;
        height: 52px;
        padding-left: 20px;
        line-height: 52px;
        color: #0092ff;
        font-size: 18px;
        font-weight: 700;
        letter-spacing: 1.8px;
        font-family: PingFang SC, PingFang SC-Bold;
        background-image: url("../../../assets/images/riskAnalysis/title_bg.png");
        background-size: 100% 100%;
    }
}
</style>