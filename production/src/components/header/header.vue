/*
 * @Author: hdw 
 * @Date: 2022-01-11 17:34:29 
 * @Last Modified by: hdw
 * @Last Modified time: 2022-01-11 17:37:04
 */
<template>
    <div class="header">
        <div class="left">
            <n-gradient-text :gradient="{ from: '#E9F4FF', to: '#B1C5D8' }">邵武市经济开发区CIM智慧园区</n-gradient-text>
        </div>
        <div class="right">
            <div class="rightH">
                <n-gradient-text :gradient="{ from: '#E9F4FF', to: '#B1C5D8' }">首页</n-gradient-text>
            </div>
            <div class="rightD">
                <n-dropdown :options="userMenu">
                    <n-gradient-text :gradient="{ from: '#E9F4FF', to: '#B1C5D8' }">
                        欢迎您！{{ user.username }}
                        <n-icon color="#E9F4FF">
                            <chevron-down-outline />
                        </n-icon>
                    </n-gradient-text>
                </n-dropdown>
            </div>
            <div class="rightR">
                <n-gradient-text :gradient="{ from: '#E9F4FF', to: '#B1C5D8' }">退出</n-gradient-text>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import {
    h, reactive,
    ref
} from 'vue'
import { NIcon } from 'naive-ui'
import {
    PersonCircleOutline as UserIcon,
    Pencil as EditIcon,
    LogOutOutline as LogoutIcon,
    Keypad, ChevronDownOutline
} from '@vicons/ionicons5'
const renderIcon = (icon: any) => {
    return () => {
        return h(NIcon, null, {
            default: () => h(icon)
        })
    }
}
let user = reactive({
    username: "园区管理员"
})
let userMenu = reactive(
    [
        {
            label: '个人中心',
            key: 'profile',
            icon: renderIcon(UserIcon)
        },
        {
            label: '编辑用户资料',
            key: 'editProfile',
            icon: renderIcon(EditIcon)
        },
        {
            label: '修改密码',
            key: 'logout',
            icon: renderIcon(Keypad)
        }
    ]
)
</script>
<style lang='postcss' scoped>
@import "./header.postcss";
</style>