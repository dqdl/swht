<template>
    <div class="sideTree">
        <n-scrollbar style="max-height: 100%">
            <n-menu
                ref="menuInstRef"
                :expanded-keys="muneActiveArr"
                :options="menuOptions"
                v-model:value="selectedKeyRef"
                :accordion="true"
                :root-indent="20"
                :indent="40"
                @update:expanded-keys="handleFaUpdateValue"
                @update:value="handleUpdateValue"
            />
        </n-scrollbar>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, h } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex';
import bus from '../../util/eventBus'
// 用户管理
import user_m from '../../assets/icon/menu/user_m.png';
// import user_m_a from '../../assets/icon/menu/user_m_a.png';
// 角色管理
import role_m from '../../assets/icon/menu/rule_m.png';
// import role_m_a from '../../assets/icon/menu/role_m_a.png';
// 组织管理
import group_m from '../../assets/icon/menu/group_m.png';
// import group_m_a from '../../assets/icon/menu/group_m_a.png';
// 通用字典管理
import currency_m from '../../assets/icon/menu/currency_m.png';
// import currency_m_a from '../../assets/icon/menu/currency_m_a.png';
// 系统字典管理
import system_m from '../../assets/icon/menu/system_m.png';
// import system_m_a from '../../assets/icon/menu/system_m_a.png';
// 基础信息管理
import basics_m from '../../assets/icon/menu/basics_m.png';
// import basics_m_a from '../../assets/icon/menu/system_m_a.png';
// 日志查询
import log_m from '../../assets/icon/menu/log_m.png';
// import log_m_a from '../../assets/icon/menu/log_m_a.png';

// route
const router: any = useRouter();
let store = useStore()
/**
 * state
 */
let menuOptions = ref([])
// render函数创建图标
let renderIcon = (icon: any) => {
    return () => h("div", { class: "imgIconDiv" }, [
        h("img", { class: "imgIcon", src: icon }),
    ])
}

onMounted(() => {
    let list = store.state.mune.muneList;
    list.forEach((item: any) => {
        item.label === '用户管理' && (item.icon = renderIcon(user_m));
        item.label === '角色管理' && (item.icon = renderIcon(role_m));
        item.label === '组织管理' && (item.icon = renderIcon(group_m));
        // item.label === '通用字典管理' && (item.icon = renderIcon(currency_m));
        // item.label === '系统字典管理' && (item.icon = renderIcon(system_m));
        item.label === '基础信息管理' && (item.icon = renderIcon(basics_m));
        item.label === '字典管理' && (item.icon = renderIcon(system_m));
        item.label === '日志查询' && (item.icon = renderIcon(log_m));
    })
    menuOptions.value = store.state.mune.muneList
})
/**
 * methods
 */
// 菜单激活
// 父级
const muneActiveArr = ref([''])
// 子集
const selectedKeyRef = ref('')
const init = () => {
    let muneActiveKey = sessionStorage.getItem('muneActiveKey');
    let muneActiveArrKey = sessionStorage.getItem('muneActiveArrKey');
    muneActiveKey && (selectedKeyRef.value = muneActiveKey);
    muneActiveArrKey && (muneActiveArr.value = JSON.parse(muneActiveArrKey));
}
init()
// 父级展开
const handleFaUpdateValue = (key: any) => {
    sessionStorage.setItem('muneActiveArrKey', JSON.stringify(key))
    muneActiveArr.value = key
}
// 路由跳转
// 子集展开
const handleUpdateValue = (key: string, item: any) => {
    sessionStorage.setItem('muneActiveKey', key)
    selectedKeyRef.value = key
    item.path && router.push({
        path: item.path,
    });
}
bus.$on('clearMune', () => {
    sessionStorage.setItem('muneActiveArrKey', '')
    sessionStorage.setItem('muneActiveKey', '')
    muneActiveArr.value = []
    selectedKeyRef.value = ''
})


</script>
<style lang="postcss" scoped>
.sideTree {
    width: 250px;
    height: 94%;
    color: #fff !important;
    > div {
        width: 100%;
        font-size: 16px !important;
    }
    ::v-deep(.n-menu) {
        .n-base-icon,
        .n-menu-item-content__arrow {
            color: #fff !important;
        }
        .imgIconDiv {
            width: 22px;
            height: 22px;
            position: relative;
            bottom: 4px;
            .imgIcon {
                width: 100%;
                height: 100%;
            }
        }
        .n-menu-item-content {
            margin: 0 10px;
        }
        .n-menu-item--selected {
            background: linear-gradient(134deg, #65bdff 2%, #1e9fff 96%);
            border-radius: 10px;
            .n-menu-item-content-header {
                color: #fff !important;
            }
        }
        .n-submenu {
            .n-menu-item--selected {
                background: none;
                .n-menu-item-content-header {
                    color: #1e9fff !important;
                }
            }
            .n-menu-item-content--child-active {
                background: linear-gradient(134deg, #65bdff 2%, #1e9fff 96%);
                border-radius: 10px;
                .n-menu-item-content-header {
                    color: #fff !important;
                }
            }
        }
    }
}

.n-menu .n-menu-item.n-menu-item--selected::before {
    background-color: #ffff !important;
}
</style>
