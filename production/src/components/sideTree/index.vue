<template>
    <div class="sideTree">
        <n-menu
            :options="menuOptions"
            :default-expand-all="true"
            :root-indent="20"
            :indent="40"
            @update:value="handleUpdateValue"
        />
    </div>
</template>

<script lang="ts" setup>
// vue
import { reactive, h } from 'vue'
import { useRouter } from 'vue-router'

// naive-ui
import { NIcon } from 'naive-ui'
import {
    Umbrella as Umbrella,
    BulbSharp as BulbSharp,
    ShieldCheckmark as ShieldCheckmark,
    Person as Person,
    Folder as Folder,
} from '@vicons/ionicons5'
// 渲染icon
function renderIcon(icon: any) {
    return () => h(NIcon, null, { default: () => h(icon) })
}
// route
const router: any = useRouter();
/**
 * state
 */
const menuOptions = reactive([
    {
        label: '风险管控',
        key: 'Risk control',
        icon: renderIcon(Umbrella),
        disabled: false,
        children: [
            {
                label: '风险点',
                key: 'Risk point',
                path: '/riskPoint',
            },
            {
                label: '风险点监控',
                key: 'Risk point monitoring',
                path: '/riskPointControl',
            },
            {
                label: '风险清单',
                key: 'Risk list',
                path:'/RiskList'
            },
            {
                label: '风险统计分析',
                key: 'Risk statistical analysis',
                path: '/riskAnalysis'
            },
            {
                label: '风险值配置',
                key: 'Var allocation',
            },
        ]
    },
    {
        label: '两重大一重点',
        key: 'Two major and one key',
        icon: renderIcon(BulbSharp),
        children: [
            {
                label: '保护野生动物',
                key: 'protect-wild-animals'
            }
        ]
    },
    {
        label: '安全监管',
        key: 'Safety supervision',
        icon: renderIcon(ShieldCheckmark),
        children: [
            {
                label: '鱼和熊掌不可兼得',
                key: 'can-not'
            }
        ]
    },
    {
        label: '安全巡检',
        key: 'Safety patrol inspection',
        icon: renderIcon(Person),
        children: [
            {
                label: '鱼和熊掌不可兼得',
                key: 'can-no'
            }
        ]
    },
    {
        label: '知识库',
        key: 'knowledge base',
        icon: renderIcon(Folder),
        children: [
            {
                label: '鱼和熊掌不可兼得',
                key: 'can-n'
            }
        ]
    },
])
/**
 * methods
 */
const handleUpdateValue = (key: string, item: any) => {
    console.log('key =>', key)
    console.log('item =>', item)
    item.path && router.push({
        path: item.path,
    });
}

</script>
<style lang="postcss" scoped>
.sideTree {
    width: 250px;
    height: calc(100% - 80px);
    color: #fff !important;
    > div {
        width: 100%;
        font-size: 16px;
    }
}
</style>
