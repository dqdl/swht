<template>
    <div class="muneList" v-for="(v, i) in menuListData" :key="v.code">
        <div v-if="v.name" class="table">
            <div class="left">
                <div>
                    <n-icon @click="clickOpen(v)" v-if="v.children && v.open" size="16">
                        <caret-down-sharp />
                    </n-icon>
                    <n-icon @click="clickOpen(v)" v-if="v.children && !v.open" size="16">
                        <caret-forward />
                    </n-icon>
                    <n-checkbox
                        @update:checked="allChange(v)"
                        :value="v.name"
                        v-model:checked="v.ischeck"
                        style="margin-left: 4px;"
                    >{{ v.name }}</n-checkbox>
                </div>
            </div>
            <div class="ruleCont" v-if="v.permissionList && v.permissionList.length > 0">
                <n-checkbox
                    :disabled="!v.ischeck"
                    v-for="(item, key) in v.permissionList"
                    v-model:checked="item.ischeck"
                    :value="item.name"
                    :key="item.code"
                    style="margin-right: 10px;"
                >
                    {{
                        item.name
                    }}
                </n-checkbox>
            </div>
        </div>
        <div class="leftBorder"></div>
        <trans>
            <div class="leftTitle" v-if="v.open && v.children && v.children.length > 0">
                <menuList :menuListData="v.children"></menuList>
            </div>
        </trans>
    </div>
</template>

<script lang="ts" setup>
import trans from "./transition";
import {
    CaretDownSharp, CaretForward
} from '@vicons/ionicons5';
import {
    inject, defineProps, nextTick
} from "vue";
let mData: any = inject('giveSunzi');
const props = defineProps({
    menuListData: {
        type: Array as () => Array<any>,
        required: true,
        default: () => []
    },
})
function allChange(v: any) {
    // 处理父级
    v.parentMenuCode && setParentChecked(v.parentMenuCode)
    // 处理子级
    setChildChecked(v, v.ischeck)
}
// 父递归处理子数据
let setChildChecked = (e: any, sign: boolean) => {
    e.ischeck = !sign
    if (e.children && e.children.length > 0) {
        for (let i = 0; i < e.children.length; i++) {
            e.children[i].ischeck = sign
            setChildChecked(e.children[i], e.children[i].ischeck)
        }
    }
}
// 子递归处理父数据
let setParentChecked = (id: any, v?: Array<any>) => {
    nextTick(() => {
        let list: Array<any> = v || mData.value;
        let parent: any = {};
        let checked: boolean = true;
        list.forEach((item: any) => {
            if (item.code === id) {
                parent = item
            } else {
                item.children && setParentChecked(id, item.children)
            }
        });
        if (parent && parent.parentMenuCode) {
            let list = parent.children.filter((val: any) => {
                if (val.ischeck) {
                    return val
                }
            })
            list.length > 0 ? checked = true : checked = false
            parent.ischeck = checked
            setParentChecked(parent.parentMenuCode)
        }
    })
}
// let setParentChecked = (id: any, v?: Array<any>) => {
//     nextTick(() => {
//         let list: Array<any> = v || mData.value;
//         let parent: any = {};
//         let checked: boolean = true;
//         list.forEach((item: any) => {
//             if (item.code === id) {
//                 parent = item
//             } else {
//                 item.children && setParentChecked(id, item.children)
//             }
//         });
//         if (parent && parent.parentMenuCode) {
//             parent.children.forEach((val: any) => {
//                 if (!val.ischeck) {
//                     checked = false
//                 }
//             })
//             parent.ischeck = checked
//             setParentChecked(parent.parentMenuCode)
//         }
//     })
// }
const clickOpen = (val: any) => {
    val.open = !val.open
}
</script>

<style lang="postcss" scoped>
.muneList {
    transition: all 1s linear;
    overflow: hidden;
    background-color: #fff;
}
.table {
    display: flex;

    .left {
        width: 360px;
        height: 60px;
        display: flex;
        align-items: center;
    }

    .ruleCont {
        height: 60px;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        position: absolute;
        left: 360px;
    }
}

.leftBorder {
    border-bottom: 1px solid #ccc;
    width: 100%;
    position: absolute;
    left: 0;
}
.leftTitle {
    padding-left: 24px;
}
</style>