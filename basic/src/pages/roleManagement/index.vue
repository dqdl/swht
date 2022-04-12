<template>
    <div class="roleManagement">
        <div class="leftBar">
            <blue-title :propValue="'角色名称'" />
            <div class="addRuleBtn">
                <n-space align="baseline">
                    <n-button size="tiny" @click="addRule" type="warning">新增</n-button>
                    <n-button size="tiny" @click="changeRule" type="info">修改</n-button>
                    <n-button size="tiny" @click="deRule" type="error">删除</n-button>
                </n-space>
            </div>
            <div class="roleList">
                <div
                    @click="switchRule(v)"
                    :class="v.code == roleCode ? 'active' : ''"
                    v-for="(v, i) in ruleList"
                    :key="i"
                >
                    <!-- <n-icon size="18">
                        <chevron-forward />
                    </n-icon>-->
                    <span>{{ v.name }}</span>
                    <!-- <div class="roleSwitchBtn">
                        <n-space align="baseline">
                            <n-button @click.stop="changeRule(v)" size="tiny" type="info">修改</n-button>
                            <n-button @click.stop="deRule(v)" size="tiny" type="warning">删除</n-button>
                        </n-space>
                    </div>-->
                </div>
            </div>
        </div>
        <div class="rightContent">
            <blue-title :propValue="'菜单权限'" />
            <div class="roleBtn">
                <n-space>
                    <n-button
                        :disabled="JSON.stringify(menuListData) === JSON.stringify(menuListDataInitial)"
                        @click="preservation"
                        type="info"
                    >保存</n-button>
                    <n-button
                        :disabled="JSON.stringify(menuListData) === JSON.stringify(menuListDataInitial)"
                        @click="reset"
                        type="info"
                    >重置</n-button>
                </n-space>
                <div v-if="(roleDetails as any).notes">角色简介：{{ (roleDetails as any).notes }}</div>
            </div>

            <div class="roleTable">
                <div class="tableHeader">
                    <div style="width:360px;">菜单</div>
                    <div>操作</div>
                </div>
                <div class="ruleIndex">首页</div>
                <div class="roleTableLeft">
                    <menu-list :menuListData="menuListData" />
                </div>
            </div>
        </div>
        <!-- popup_newAdd and popup_form_datails-->
        <n-config-provider :locale="queryInfo.zhCN" :date-locale="queryInfo.dateZhCN">
            <n-modal
                class="custom-card"
                v-model:show="showModal_newAdd"
                preset="card"
                :style="{ width: '400px' }"
                :title="form_details.name"
                size="huge"
                :bordered="false"
                :segmented="false"
            >
                <template #header-extra></template>
                <n-form :model="form_details" ref="formRef" :rules="rules">
                    <n-form-item label="角色名称" path="list.name">
                        <n-input v-model:value="form_details.list.name" clearable />
                    </n-form-item>
                    <n-form-item label="角色介绍" path="list.notes">
                        <n-input type="textarea" v-model:value="form_details.list.notes" clearable />
                    </n-form-item>
                    <n-space>
                        <n-button type="info" @click="ruleSubmit">确认</n-button>
                        <n-button type="info" @click="showModal_newAdd = false">取消</n-button>
                    </n-space>
                </n-form>
            </n-modal>
        </n-config-provider>

        <!-- popup_ delete-->
        <n-modal
            v-model:show="showModal_delete"
            preset="dialog"
            type="error"
            :show-icon="false"
            title="删除"
            :content="delete_content"
            positive-text="确认"
            negative-text="取消"
            @positive-click="submitCallback"
            @negative-click="cancelCallback"
        ></n-modal>
    </div>
</template>

<script lang="ts" setup>
import { provide, ref, reactive, onMounted } from "vue";
// naive_ui
import { zhCN, dateZhCN, useMessage } from 'naive-ui'
import blueTitle from '@components/public/title/index.vue'
import menuList from "./menuList.vue";
import rule from "../../axios/api/roleManagement/index";
// 消息组件
const message = useMessage()
/**
 * 角色列表
 */
/**
 * 角色列表
 */
let ruleList = ref([{
    code: "1",
    createTime: "2020-07-24 08:28:24",
    hasUser: null,
    hold: false,
    name: "超级管理员",
    notes: "--",
    roleCodeList: null,
    updateTime: "2021-01-17 19:28:29",
    valid: 1
}])
// 选中角色code
let roleCode = ref('')
// 选中详情
let roleDetails = ref({})
// 删除修改角色code
let changeRoleCode = ref('')
// 弹框类
// 弹框（表单验证规则）
const rules = {
    list: {
        name: {
            required: true,
            message: '请输入角色名称',
            trigger: ['input', 'blur']
        },
    },
}
// 表单中文展示
let queryInfo = reactive({
    zhCN: zhCN,
    dateZhCN: dateZhCN
})
// 新增详情弹框打开
let showModal_newAdd = ref(false);
// 删除确认弹框
let showModal_delete = ref(false);
// 删除提示内容
const delete_content = ref('确定删除此角色？')
// 新增添加角色详情内容
let form_details = reactive({
    name: "详情",
    list: {
        name: "",
        notes: ""
    }
})
// 新增角色
const addRule = () => {
    showModal_newAdd.value = true
    form_details.name = "新增角色"
    form_details.list.name = ""
    form_details.list.notes = ""
}
// 修改角色
const changeRule = () => {
    let { name, notes, code } = (roleDetails as any).value
    changeRoleCode.value = code
    showModal_newAdd.value = true
    form_details.name = "修改角色"
    form_details.list.name = name
    form_details.list.notes = notes
}
// 获取表单from
const formRef = ref<HTMLElement>();
// 新增修改确认按钮
const ruleSubmit = (e: any) => {
    e.preventDefault()
    const dragDivDom: any = formRef.value;
    dragDivDom.validate((errors: any) => {
        if (!errors) {
            // showModal_newAdd.value = false
            if (form_details.name === "新增角色") {
                rule.addRule(form_details.list).then((res: any) => {
                    let { code } = res
                    if (code == 200) {
                        message.success('新增成功');
                        getList(false);
                        showModal_newAdd.value = false
                    }
                })
            } else {
                let data = { ...form_details.list, code: changeRoleCode.value }
                rule.changeRule(data).then((res: any) => {
                    let { code } = res
                    if (code == 200) {
                        message.success('修改成功');
                        getList(false);
                        showModal_newAdd.value = false
                    }
                })
            }
        } else {
            message.error('请检查输入内容')
        }
    })
}
// 删除角色
const deRule = () => {
    showModal_delete.value = true;
}
// 删除取消
const cancelCallback = () => {
    message.success('取消删除')
}
// 删除确定
const submitCallback = () => {
    rule.delRule([roleCode.value]).then((res: any) => {
        let { code } = res
        if (code == 200) {
            message.success('删除成功');
            getList();
            showModal_newAdd.value = false
        }else{
            message.error(`${res.message}`);
        }
            
    })
}
/**
 * 权限树数据
 * */
const menuListData = ref([])
// 未操作权限初始数据（用于还原角色权限初始状态）
const menuListDataInitial = ref([])
provide('giveSunzi', menuListData)
// 获取角色
const getList = async (isRefresh: boolean = true) => {
    let data: any = await rule.getRuleList()
    if (data.code == 200) {
        ruleList.value = data.data;
        isRefresh && (roleCode.value = data.data[0].code)
        isRefresh && (roleDetails.value = data.data[0])
    }
    // 是否只是更新角色列表
    isRefresh && getMune(roleCode.value)
}
// 获取权限
const getMune = (val: any) => {
    menuListData.value = []
    let data = {
        roleCode: val,
        type: 3
    }
    rule.getRuleMune(data).then((res) => {
        let list: any = dataHandle(res.data)
        menuListDataInitial.value = JSON.parse(JSON.stringify(list));
        menuListData.value = list;
    })
}
//切换角色
const switchRule = (val: any) => {
    roleCode.value = val.code
    roleDetails.value = val
    getMune(roleCode.value)
}
// 递归处理树形数据
const dataHandle = (list: Array<any>, num?: number) => {
    list.map((item) => {
        item.open = true
        item.raw == 1 ? item.ischeck = true : item.ischeck = false;
        if (item.children && item.children.length > 0) {
            dataHandle(item.children, 1)
        }
        if (item.permissionList && item.permissionList.length > 0) {
            dataHandle(item.permissionList, 2)
        }
        return item
    })
    return list
}
// 当前角色权限列表
let menuCodeList: Array<String> = [];
// 递归处理保存数据修改当前权限
const changeJurisdiction = (val: any) => {
    val.forEach((item: any) => {
        if (item.children && item.children.length > 0) {
            changeJurisdiction(item.children)
        }
        if (item.permissionList && item.permissionList.length > 0) {
            changeJurisdiction(item.permissionList)
        }
        if (item.ischeck) {
            menuCodeList.push(item.code)
        }
    })
}
// 保存修改
const preservation = () => {
    menuCodeList = []
    changeJurisdiction(menuListData.value)
    let data = {
        roleCode: roleCode.value,
        menuCodeList
    }
    rule.changeRuleMune(data).then((res: any) => {
        if (res.code == 200) {
            message.success('修改成功')
        } else {
            console.log(res)
        }
    })
}
// 还原修改
const reset = () => {
    if (JSON.stringify(menuListData.value) === JSON.stringify(menuListDataInitial.value)) {
        return
    }
    menuListData.value = [];
    menuListData.value = JSON.parse(JSON.stringify(menuListDataInitial.value));
}
onMounted(() => {
    getList()
})

</script>

<style lang="postcss" scoped>
.roleManagement {
    height: 100%;
    display: flex;
    .leftBar {
        width: 375px;
        background: #fff;
        font-size: 18px;
        position: relative;
        .addRuleBtn {
            position: absolute;
            top: 10px;
            right: 10px;
        }
        .roleMtitle {
            display: flex;
            align-items: center;
            span {
                margin-left: 10px;
            }
            border-bottom: 1px solid #6bbffd;
            padding-bottom: 10px;
        }
        .roleList {
            padding-left: 10px;
            padding-right: 50px;
            > div {
                height: 46px;
                line-height: 46px;
                display: flex;
                align-items: center;
                margin: 16px 0;
                padding-left: 36px;
                position: relative;
            }
            .active {
                border: 1px solid #68bdff;
                background-color: #68bdff;
                color: #fff;
                border-radius: 10px;
            }
            .roleSwitchBtn {
                position: absolute;
                right: 10px;
            }
        }
    }
    .rightContent {
        margin-left: 20px;
        width: 100%;
        flex: 1;
        background-color: #fff;
        .roleBtn {
            display: flex;
            justify-content: space-between;
            margin: 30px 20px 0 20px;
        }
        .roleTable {
            padding-top: 26px;
            margin: 0px 20px;
            height: calc(100% - 78px);
            .tableHeader {
                padding-left: 10px;
                display: flex;
                height: 50px;
                line-height: 50px;
                background: #eaf2f7;
            }
            .ruleIndex {
                padding-left: 10px;
                height: 50px;
                line-height: 50px;
                border-bottom: 1px solid #ccc;
            }
            .roleTableLeft {
                height: calc(100% - 200px);
                overflow-y: scroll;
                position: relative;
            }
        }
    }
}
</style>