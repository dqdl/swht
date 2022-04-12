<template>
    <div class="card_container">
        <div class="line"></div>
        <div class="head"></div>
        <div class="name">{{ da.age }}</div>
        <div class="dashline"></div>
        <div class="phone">电话: {{ da.phone }}</div>
        <div class="department">
            <p>{{ da.tags }}</p>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { defineComponent,Ref, ref, reactive, PropType, watch, computed } from "vue"
const props: any = defineProps({
    data: Object as PropType<{}>
})

let tempData:Ref<any> = ref()
watch(()=>props.data,(prev,next)=>{
    if(prev){
        tempData.value = prev
    }
},{
    immediate:true,
    deep:true
})
const da =  computed(()=>{
    return tempData.value
}) 
</script>

<style lang="postcss" scoped>
.card_container {
    width: 460px;
    height: 146px;
    background: #ffffff;
    border-radius: 10px;
    position: relative;
    & > .line {
        width: 1px;
        height: 50px;
        border: 4px solid #b7d0e9;
        position: absolute;
        margin-top: 50px;
        background-color: #b7d0e9;
        border-radius: 10px;
    }
    & > .head {
        width: 88px;
        height: 88px;
        background: #e1e8fa;
        border-radius: 50%;
        position: absolute;
        top: 29px;
        left: 30px;
    }
    & > .department {
        width: 110px;
        height: 40px;
        opacity: 0.73;
        background: #b7d0e9;
        border-radius: 0px 10px 0px 10px;
        position: absolute;
        top: 0px;
        left: 350px;
        text-overflow: ellipsis;
        overflow: hidden;
        &>p{
            height: 20px;
            font-size: 14px;
            font-family: PingFang SC, PingFang SC-Medium;
            font-weight: 500;
            text-align: left;
            color: #5f7d9c;
            letter-spacing: 1.4px;
            position: absolute;
            top: 10px;
            left: 17px;
        }
    }
    & > .dashline {
        width: 287px;
        height: 1px;
        border: 1px dashed #b7d0e9;
        position: absolute;
        top: 72px;
        left: 142.5px;
    }
    & > .name {
        height: 22px;
        font-size: 16px;
        font-family: PingFang SC, PingFang SC-Medium;
        font-weight: 500;
        text-align: left;
        color: #000000;
        letter-spacing: 1.6px;
        position: absolute;
        top: 36px;
        left: 142px;
    }
    & > .phone {
        width: 176px;
        height: 22px;
        font-size: 16px;
        font-family: PingFang SC, PingFang SC-Medium;
        font-weight: 500;
        text-align: left;
        color: #000000;
        letter-spacing: 1.6px;
        position: absolute;
        top: 88px;
        left: 142px;
    }
}
</style>