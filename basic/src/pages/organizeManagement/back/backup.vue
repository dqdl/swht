<template>
  <n-message-provider>
    <div class="container">
      <!-- 左侧导航栏 -->
      <div class="leftBar">
        <div class="headTitle">
          <div class="head">
            <img :src="ylymanage"/>
            <span>组织架构</span>
          </div>
        </div>
        <div class="line"></div>
        <div class="searchBar">
          <n-input type="text" v-model:pattern="pattern" size="large" placeholder="请输入部门名称或员工名称">
            <template #suffix>
              <n-icon
                :style="{
                  corsor:'pointer'
                }"
              >
                <SearchSharp />
              </n-icon>
            </template>
          </n-input>
        </div>
        <div class="tree">
          <n-tree 
          block-line 
          cascade 
          checkable 
          :data="dats" 
          default-expand-all
          >
          </n-tree>
        </div>
      </div>

      <div class="rightTable">
        <!-- // 头部控制栏 -->
        <div class="headControl">
          <div class="text">数据列表</div>
          <div class="allCon">
            <div class="Con" v-for="(item, index) of headCon" :key="index">
              <n-button @click="headClick(item.name)" :type="item.type">{{ item.name }}</n-button>
            </div>
          </div>
        </div>
        <div class="footerTable">
          <n-data-table
            ref="table"
            :columns="columns"
            :max-height="1600"
            size="large"
            :bordered="false"
            :data="data"
            :pagination="pagination"
            @on-update:page-size="pageSizeUpdate"
            @update:checked-row-keys="handleCheck"
            :row-key="(row: any) => row.key"
          />
          <!-- 选择下拉框数据 -->
          <div class="selectpagination">
            <span>每页</span>
            <!-- <select name="" id="select_page"  onchange="selectChange(this)">
            <option :value="item" v-for="(item,index) of pagenation " :key="index">{{ item }}</option>
            </select>-->
            <n-space vertical>
              <!-- <n-select v-model:value="value"  :options="options"/> -->
              <n-select
                placeholder
                @update:value="handleUpdateValue"
                v-model:value="value"
                size="medium"
                :options="options"
              />
            </n-space>
            <span>条</span>
            <div>共{{ alldatats }}条</div>
          </div>
        </div>
      </div>
      <!-- 弹出模态框 修改-->
      <n-modal
        class="custom-card"
        v-model:show="showModalPut"
        preset="card"
        :style="bodyStyle"
        :title="form_details.name"
        size="huge"
        :bordered="false"
        :segmented="segmented"
      >
        <template #header-extra></template>
        <n-form :model="form_details" :rules="rules">
          <n-form-item label="用户姓名" path="user.name">
            <n-input v-model:value="form_details.user.name" clearable placeholder="输入姓名" />
          </n-form-item>
          <n-form-item label="用户账号" path="user.account">
            <n-input v-model:value="form_details.user.account" clearable placeholder="输入账号" />
          </n-form-item>
          <n-form-item label="归属部门" path="user.department">
            <n-cascader
              :options="departmentOptions"
              v-model:value="form_details.user.department"
              label-field="label"
              value-field="value"
              children-field="children"
              default-value="test_1_1"
            />
          </n-form-item>
          <n-form-item label="归属职位" path="user.position">
            <n-input v-model:value="form_details.user.position" clearable placeholder="输入职位" />
          </n-form-item>
          <n-form-item label="联系方式" path="user.tel">
            <n-input v-model:value="form_details.user.tel" clearable placeholder="输入联系方式" />
          </n-form-item>
          <n-form-item label="用户角色 " path="user.role">
            <n-select
              placeholder="输入角色"
              v-model:value="form_details.user.role"
              :options="selectOptions"
            />
          </n-form-item>
        </n-form>
        <template #footer>
          <n-space>
            <n-button type="info" @click="getNewAddForm">确认</n-button>
            <n-button type="info" @click="showModalPut = false">取消</n-button>
          </n-space>
        </template>
      </n-modal>
    </div>
  </n-message-provider>
</template>


<script lang="ts" setup>
/**
 *   委员会部门数
 */
import { ref, reactive, watch, computed, onMounted } from "vue"
import { SearchSharp } from '@vicons/ionicons5'
import ylymanage from "@/assets/images/ylymanage.png"
// import listTree from '@components/listTree/listTree.vue'
import { h, defineComponent } from 'vue'
import { NTag, NButton, useMessage, useDialog } from 'naive-ui'
import { zhCN, dateZhCN, NSpace } from 'naive-ui'



const message = useMessage()
// const dialog = useDialog()

onMounted(() => {
  document.getElementById("select_page")?.addEventListener('change', (evt: any) => {
    console.log(evt, 'asdas')
  })

})
// 默认分页数
let pagenation: any = ref('8')

function handleUpdateValue(value: any, option: any) {
  console.log(value)
  console.log(option.label)
  pagenation.value = computed(() => {
    return Number(option.label)
  })
}

const form_details = reactive({
  name: '新增',
  user: {
    name: '',
    account: "",
    department: '',
    position: '',
    role: '',
    tel: '',
    key: ''
  },
})

let pattern: any = ref('')

const rules = {
  user: {
    name: {
      required: true,
      message: '请输入姓名',
      trigger: ['input', 'blur']
    },
    account: {
      required: true,
      message: '请输入账号',
      trigger: ['input', 'blur']
    }
  },
}

const queryInfo = reactive({
  zhCN: zhCN,
  dateZhCN: dateZhCN,
  name: '',
  time: [0, Date.now()],
  role: '',
  department: ''
})

// department
const departmentOptions = reactive(
  [
    {
      label: 'test_1',
      value: 'test_1',
      children: [
        {
          label:
            "test_1_1",
          value:
            "test_1_1",
        },
        {
          label: "test_1_2",
          value: "test_1_2",
          disabled: true
        },
        {
          label: "test_1_3",
          value: "test_1_3",
        },


      ]
    },
    {
      label: "test_2",
      value: "test_2",
      children: [
        {
          label: "test_2_1",
          value: "test_2_1",
        },
        {
          label: "test_2_2",
          value: "test_2_2",
        },
        {
          label: "test_2_3",
          value: "test_2_3",
        },
      ]
    }
  ]
)

// role
const selectOptions = reactive(
  [
    {
      label: '超级管理员',
      value: '超级管理员'
    },
    {
      label: '普通人员',
      value: '普通人员'
    },
  ]
)

// 模态框
let showModalAdd = ref(false)
let showModalPut = ref(false)
let showModalDel = ref(false)


// 新增弹框 - 点击确认
function getNewAddForm() {
  showModalPut.value = false
  console.log(form_details)  // 新增的详情信息
  switch (form_details.name) {
    case "新增":
      createData.push({
        key: createData.length,
        name: (createData.length + 1).toString(),
        age: form_details.user.name,
        address: form_details.user.account,
        tags: Array.from(form_details.user.department.split(',')),
        position: form_details.user.position,
        phone: form_details.user.tel,
        role: form_details.user.role,
        actions: [{
          key: '详情',
          index: createData.length + 1,
        }, {
          key: '删除',
          index: createData.length + 1,
        }]
      })
      console.log(createData, 'sa788')
      message.success('新增成功')
      break;
    case "删除":
      break;
    case "修改":
      console.log(form_details, 'deleasasda')  // 修改的详情信息
      for (let i = 0; i < createData.length; i++) {
        if (i == Number(form_details.user.key)) {
          createData[i] = {
            key: Number(form_details.user.key),
            name: Number(form_details.user.key),
            age: form_details.user.name,
            address: form_details.user.account,
            tags: Array.from(form_details.user.department.split(',')),
            position: form_details.user.position,
            phone: form_details.user.tel,
            role: form_details.user.role,
            actions: [{
              key: '详情',
              index: Number(form_details.user.key)
            }, {
              key: '删除',
              index: Number(form_details.user.key)
            }]
          }
        }
      }
      break;
    default:
      break;
  }
}

let bodyStyle = {
  width: '1000px',
  height: '800px'
}
let segmented = {
  content: 'soft',
  footer: 'soft'
}

let value = ref('8')
let options = [
  {
    label: "8",
    value: 'song0',
  },
  {
    label: '10',
    value: 'song1'
  },
  {
    label: '12',
    value: 'song2'
  },
]

let createData: any = reactive([
  {
    key: 0,
    name: '1',
    age: 'asda',
    address: 'New York No. 1 Lake Park',
    tags: ['nice', 'developer'],
    position: "向空间站",
    phone: "138XXXXXX098",
    role: "用户",
    actions: [{
      key: '详情',
      index: "1"
    }, {
      key: '删除',
      index: '1'
    }]
  },
  {
    key: 1,
    name: '2',
    age: 'asda',
    address: 'London No. 1 Lake Park',
    tags: ['wow'],
    position: "向空间站",
    phone: "138XXXXXX098",
    role: "用户",
    actions: [{
      key: '详情',
      index: "2"
    }, {
      key: '删除',
      index: '2'
    }]

  },
  {
    key: 2,
    name: '3',
    age: 'asda',

    address: 'Sidney No. 1 Lake Park',
    tags: ['cool', 'teacher'],
    position: "向空间站",
    phone: "138XXXXXX098",
    role: "用户",
    actions: [{
      key: '详情',
      index: "3"
    }, {
      key: '删除',
      index: '3'
    }]
  },
  {
    key: 3,
    name: '4',
    age: 'asda',
    address: 'Sidney No. 1 Lake Park',
    tags: ['cool', 'teacher'],
    position: "向空间站",
    phone: "138XXXXXX098",
    role: "用户",
    actions: [{
      key: '详情',
      index: "4"
    }, {
      key: '删除',
      index: '4'
    }]
  },
  {
    key: 4,
    name: '5',
    age: 'asda',
    address: 'Sidney No. 1 Lake Park',
    tags: ['cool', 'teacher'],
    position: "向空间站",
    phone: "138XXXXXX098",
    role: "用户",
    actions: [{
      key: '详情',
      index: "5"
    }, {
      key: '删除',
      index: '5'
    }]
  },
  {
    key: 5,
    name: '6',
    age: 'asda',
    address: 'Sidney No. 1 Lake Park',
    tags: ['cool', 'teacher'],
    position: "向空间站",
    phone: "138XXXXXX098",
    role: "用户",
    actions: [{
      key: '详情',
      index: "6"
    }, {
      key: '删除',
      index: '6'
    }]
  },
  {
    key: 6,
    name: '7',
    age: 'asda',
    address: 'Sidney No. 1 Lake Park',
    tags: ['cool', 'teacher'],
    position: "向空间站",
    phone: "138XXXXXX098",
    role: "用户",
    actions: [{
      key: '详情',
      index: "7"
    }, {
      key: '删除',
      index: '7'
    }]
  },
  {
    key: 7,
    name: '8',
    age: 'asda',
    address: 'Sidney No. 1 Lake Park',
    tags: ['cool', 'teacher'],
    position: "向空间站",
    phone: "138XXXXXX098",
    role: "用户",
    actions: [{
      key: '详情',
      index: "8"
    }, {
      key: '删除',
      index: '8'
    }]

  },
  {
    key: 8,
    name: '9',
    age: 'asda',
    address: 'Sidney No. 1 Lake Park',
    tags: ['cool', 'teacher'],
    position: "向空间站",
    phone: "138XXXXXX098",
    role: "用户",
    actions: [{
      key: '详情',
      index: "9"
    }, {
      key: '删除',
      index: '9'
    }]

  },
  {
    key: 9,
    name: '10',
    age: 'asda',
    address: 'Sidney No. 1 Lake Park',
    tags: ['cool', 'teacher'],
    position: "向空间站",
    phone: "138XXXXXX098",
    role: "用户",
    actions: [{
      key: '详情',
      index: "10"
    }, {
      key: '删除',
      index: '10'
    }]

  },
  {
    key: 10,
    name: '11',
    age: 'asda',
    address: 'Sidney No. 1 Lake Park',
    tags: ['cool', 'teacher'],
    position: "向空间站",
    phone: "138XXXXXX098",
    role: "用户",
    actions: [{
      key: '详情',
      index: "11"
    }, {
      key: '删除',
      index: '11'
    }]
  }
])
// 总共的条数
let alldatats = ref(createData.length)
/**
 * selectChange事件
 */
function selectChange(evt: any) {
  console.log(evt, 'evteete')
}
/**
 * pageSize 改变时触发的回调函数
 */
function pageSizeUpdate(evt: any) {
  console.log(evt, 'sef')
}
/**
 * headClick
 */

/**
 * 选中的列改变时的回调函数
 */
function colomnKeys(keys: any) {
  console.log(keys)
}

// 选中的列
const checkedRowKeys = ref([])
let index: any = ref([])


function handleCheck(row: any) {  // 处理
  console.log(row, 'wwewe')
  index.value = row  // 下标
}

function headClick(evt: string) {
  console.log(evt, 'sada')
  switch (evt) {
    case "修改":
      if (!index.value.length) {
        message.info(
          '请先选中某一行',
          {
            duration: 1000
          }
        )
      } else if (index.value.length > 1) {
        message.info(
          '不可批量修改',
          {
            duration: 1000
          }
        )
      } else {
        showModalPut.value = true
        console.log(index.value[0], 'sad1231231')
        let s = createData.filter((item: any, indx: any) => {
          return indx === index.value[0]
        })
        console.log(s, 'ssasda')
        form_details.name = "修改"
        form_details.user.name = s[0].age  // 姓名
        form_details.user.account = s[0].address // 账号
        form_details.user.department = s[0].tags.toString() // 部门
        form_details.user.position = s[0].position // 职位
        form_details.user.tel = s[0].phone // 联系方式
        form_details.user.role = s[0].role // 角色
        form_details.user.key = index.value[0] // key
        console.log(form_details, 'sa')
      }
      break;
    case "新增":
      showModalPut.value = true
      form_details.name = "新增"
      form_details.user.name = ''  // 姓名
      form_details.user.account = '' // 账号
      form_details.user.department = '' // 部门
      form_details.user.position = '' // 职位
      form_details.user.tel = '' // 联系方式
      form_details.user.role = '' // 角色
      form_details.user.key = '' // key
      break;
    case "删除":
      console.log(index.value)
      if (!index.value.length) {
        message.info(
          '请先选中某一行',
          {
            duration: 3000
          }
        )
      } else if (index.value.length > 1) {
        message.info(
          '不可批量删除',
          {
            duration: 3000
          }
        )
      } else {
        showModalPut.value = false
        form_details.name = "删除"
        createData = createData.filter((item: any, indx: number) => {
          return indx !== index.value[0]
        })
        console.log(createData, '4545')
        message.success('删除成功')
      }
      break;
    default:
      break;
  }
}

let dats = reactive([
  {
    label: "福建邵武医药有限公司",
    key: "1",
    children: [
      {
        label: "企业组织数",
        key: "3",
        children: [
          {
            label: "总经理办公室",
            key: "4",
            flag: false,
            children: [

            ]
          },
          {
            label: "厂长办公室",
            key: "5",
            flag: false,
            children: [

            ]
          },
          {
            label: "行政中心",
            key: "113",
            flag: false,
            children: []
          },
          {
            label: "营销中心",
            key: "114",
            flag: false,
            children: []
          },
          {
            label: "产品与交互中心",
            key: "115",
            flag: false,
            children: []
          }
        ]
      }
    ]
  }
])

let headCon = reactive<any>([
  {
    name: "修改",
    color: "",
    type: 'info'
  },
  {
    name: "新增",
    color: "",
    type: 'warning'

  },
  {
    name: "删除",
    color: "",
    type: 'error'
  }
])

const createColumns = () => {
  return [
    {
      type: 'selection',
      //   disabled (row, index) {
      //   return row.name === 'Edward King 3'
      // }
      options: [
        'all',
        'none',
        {
          // label: "",
          // key: '',
          onSelect: (pageData: any) => {
            console.log(pageData, 'pageDatapageData')
            checkedRowKeys.value = pageData
          }
        }

      ]
    },
    {
      title: '序号',
      key: 'name',
      align: 'center'
    },
    {
      title: '用户姓名',
      key: 'age',
      align: 'center'
    },
    {
      title: '用户账号',
      key: 'address',
      align: 'center'
    },
    {
      title: '归属部门',
      key: 'tags',
      align: 'center'
    },
    {
      title: '职位',
      key: 'position',
      align: 'center'
    },
    {
      title: '联系方式',
      key: 'phone',
      align: 'center'
    },
    {
      title: '用户角色',
      key: 'role',
      align: 'center'
    },
    {
      key: 'actions',
      render(row: any) {
        const tags = row.actions.map((item: any) => {
          const { key, index } = item
          return h(
            NButton,{
                    justify: "end"
                },
            {
              size: 'small',
              type: 'info',
              style: {
                'margin-right': 6 + 'px',
                'background-color': '#0486FE',
              },
              onClick: () => actions(item)
            }
          )
        })
        return tags
      }
    },
  ]
}
// 控制操作的行为
function actions(info: any) {
  console.log(info, 'sad')
  switch (info.key) {
    case "详情":
      showModalPut.value = true
      for (let i = 0; i < createData.length; i++) {
        if (i === Number(info.index) - 1) {
          console.log(createData[i], '213123')
          form_details.name = "详情"
          form_details.user.name = createData[i].age  // 姓名
          form_details.user.account = createData[i].address // 账号
          form_details.user.department = createData[i].tags.toString() // 部门
          form_details.user.position = createData[i].position // 职位
          form_details.user.tel = createData[i].phone // 联系方式
          form_details.user.role = createData[i].role // 角色
          form_details.user.key = index.value[0] // key
        }
      }
      break;
    case "删除":
      showModalPut.value = false
      createData = createData.filter((item: any, index: number) => {
        return index !== Number(info.index) - 1
      })
      console.log(createData, '454343')
      createData && message.info("删除成功!")
      break;
    default:
      break;
  }
}






// 创建数据
let data = createData

let columns = createColumns()
// 分页  共多少页
let pagination = {
  pageSize: Number(pagenation.value)
}

let tableData = reactive([

])


</script>

<style lang="postcss" scoped>
@import "../scss/NumberOfEnterpriseOrganizations.scss";
</style>