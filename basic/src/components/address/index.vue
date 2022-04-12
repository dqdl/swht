<template>
    <div class="address">
        <n-space>
            <!-- 1111{{ addressStr }} -->
            <span>省</span>
            <n-select
                placeholder="请选择省"
                v-model:value="queryInfo.provinceStr"
                :options="province"
                @update:value="getCity"
                clearable
                :style="{ width: '120px' }"
            />
        </n-space>
        <n-space>
            <span>市</span>
            <n-select
                placeholder="请选择市"
                v-model:value="queryInfo.cityStr"
                :options="city"
                @update:value="getArea"
                clearable
                :style="{ width: '120px' }"
            />
        </n-space>
        <n-space>
            <span>区</span>
            <n-select
                placeholder="请选择区"
                :options="area"
                clearable
                v-model:value="queryInfo.areaStr"
                :style="{ width: '120px' }"
            />
        </n-space>
        <n-input
            v-if="de"
            v-model:value="queryInfo.detailedAddress"
            clearable
            :style="{ width: '330px' }"
            placeholder="请输入具体地址，如街道名+居住地"
        />
    </div>
</template>
<script lang="ts" setup>
import { onMounted, reactive, computed, defineExpose, watch, nextTick } from 'vue';
import addRessJson from './pca-code.json';
const props = defineProps({
    dataAddress: {
        type: String,
        default: ''
    },
    de: {
        type: Boolean,
        default: true
    }
})
// 获取得三级联动数据
let addressStr = () => {
    let str = ''
    if (queryInfo.provinceStr) {
        str = `${queryInfo.provinceStr}-`
    }

    if (queryInfo.cityStr) {
        str = `${queryInfo.provinceStr}-${queryInfo.cityStr}`
    }

    if (queryInfo.areaStr) {
        str = `${queryInfo.provinceStr}-${queryInfo.cityStr}-${queryInfo.areaStr}`
    }

    if (str) {
        if (queryInfo.detailedAddress) {
            str = `${str},${queryInfo.detailedAddress}`
        }
    } else {
        str = queryInfo.detailedAddress
    }
    return str
}
// 重置
let reset = () => {
    queryInfo.provinceStr = ''
    queryInfo.cityStr = ''
    queryInfo.areaStr = ''
    city.length = 0
    area.length = 0
}
const queryInfo: any = reactive({
    provinceStr: '',
    cityStr: '',
    areaStr: '',
    detailedAddress: ''
});
// 省
let province = reactive<any>([])
// 市
let city = reactive<any>([])
// 区
let area = reactive<any>([])
// 获取省
const getProvince = () => {
    province.length = 0
    addRessJson.forEach((item: any) => {
        item.value = item.name
        item.label = item.name
        province.push(item)
    })

}
// 获取市
const getCity = (value: any) => {
    let option: any = []
    for (let i = 0; i < province.length; i++) {
        if (value === province[i].name) {
            option = province[i].cd
            break;
        }
    }
    city.length = 0
    option && option.forEach((item: any) => {
        item.value = item.name
        item.label = item.name
        city.push(item)
    })

    queryInfo.cityStr = ''
    queryInfo.areaStr = ''
}
// 获取区
const getArea = (value: any) => {
    let option: any = []
    for (let i = 0; i < city.length; i++) {
        if (value === city[i].name) {
            option = city[i].cd
            break;
        }
    }
    area.length = 0
    option && option.forEach((item: any) => {
        item.value = item.name
        item.label = item.name
        area.push(item)
    })
    queryInfo.areaStr = ''
}
watch(() => props.dataAddress, (prev) => {
    nextTick(() => {
        if (prev) {
            if (prev.includes(',')) {
                let arr = prev.split(',')
                queryInfo.detailedAddress = arr[1]
                if (arr[0].includes('-')) {
                    let list = arr[0].split('-')
                    list[0] && (queryInfo.provinceStr = list[0]) && getCity(list[0]);
                    list[1] && (queryInfo.cityStr = list[1]) && getArea(list[1]);
                    queryInfo.areaStr = list[2];
                }
            } else {
                if (prev.includes('-')) {
                    let list = prev.split('-')
                    list[0] && (queryInfo.provinceStr = list[0]) && getCity(list[0]);
                    list[1] && (queryInfo.cityStr = list[1]) && getArea(list[1]);
                    queryInfo.areaStr = list[2];
                }
            }
        }
    })
}, {
    deep: true,
    immediate: true
})
onMounted(() => {
    getProvince()
})
defineExpose({
    addressStr,
    reset
})
</script>
<style lang="postcss" scoped>
.address {
    display: flex;
    align-items: center;
    > div {
        display: flex;
        align-items: center;
        margin-right: 30px;
        span {
            margin-right: 10px;
        }
    }
}
</style>