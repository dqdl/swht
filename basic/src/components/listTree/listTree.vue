<template>
  <div class="tree" v-for="(item,index) of indeoData" :key="index">
    <div :class="{ 'active': !listShow, 'logo': listShow }" @click="openList"></div>
    <span>{{ item.label }}</span>
    <ul class="ullist" v-show="item.children.length > 0 && listShow">
      <li v-for="(item,index) of item.children" :key="index">
        <div :class="{ 'active': !item.flag, 'logo': item.flag }" @click="openListSec(index)"></div>
        <span>{{ item.label }}</span>
        <ul v-show="item.flag">
          <li v-for="(item,index) of item.children" :key="index">{{ item.name }}</li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, watch, PropType } from "vue"
import { Add } from '@vicons/ionicons5'



let props = defineProps({
  dataList: {
    type: Array as PropType<any[]>,
    default: []
  }
})
let listShow = ref(true)
let secControl = ref(false)
let indeoData: any = props.dataList as any
console.log(indeoData,'sad')
const childIndo = ref(props.dataList[0].children as any[])
function openList() {
  listShow.value = !listShow.value
}
function openListSec(index: number) {
  childIndo.value.forEach((item, indx) => {
    if (indx === index) {
      item.flag = !item.flag
    }
  })
}

watch(() => listShow, (prev, next) => {

}, {
  deep: true,
  immediate: true
})

</script>

<style lang="postcss" scoped>
.tree {
  height: 100%;
  width: 100%;
  display: flex;
  margin-left: 40px;
  & > span {
    font-weight: bold;
    font-family: PingFangSC-Regular;
  }
  .logo {
    width: 20px;
    height: 20px;
    background-color: #ffffff;
    border: 2px solid #000000;
    border-radius: 4px;
    cursor: pointer;
    &::after {
      content: "";
      display: inline-block;
      position: relative;
      bottom: 8px;
      font-weight: bold;
      color: #000000;
      width: 13px;
      height: 13px;
      border-bottom: 2px solid #000000;
      left: 1.5px;
    }
  }
  & > .ullist {
    margin-top: 30px;
    margin-left: 50px;
    position: absolute;

    & > :nth-child(4) {
      & > ul {
        position: relative;
        left: -93px;
      }
    }
    & > li {
      display: flex;
      & > .active {
        background-color: #000000;
        width: 20px;
        height: 20px;
        border: 2px solid #000000;
        border-radius: 4px;
        cursor: pointer;
        &::after {
          display: block;
          content: "＋";
          color: #ffffff;
          position: relative;
          margin-top: -5px;
          font-weight: bold;
        }
      }
      & > .logo {
        width: 20px;
        height: 20px;
        background-color: #ffffff;
        border: 2px solid #000000;
        border-radius: 4px;
        cursor: pointer;
        &::after {
          content: "";
          display: inline-block;
          position: relative;
          bottom: 8px;
          font-weight: bold;
          color: #000000;
          width: 13px;
          height: 13px;
          border-bottom: 2px solid #000000;
          left: 1.5px;
        }
      }
      & > span {
        font-weight: bold;
        font-family: PingFangSC-Regular;

      }
      & > ul {
        position: relative;
        margin-top: 20px;
        margin-left: 50px;
        right: 125px;
        & > li {
          margin-top: 2px;
        }
      }
    }
  }
  .active {
    background-color: #000000;
    width: 20px;
    height: 20px;
    border: 2px solid #000000;
    border-radius: 4px;
    cursor: pointer;
    &::after {
      display: block;
      content: "＋";
      color: #ffffff;
      position: relative;
      margin-top: -5px;
      font-weight: bold;
    }
  }
}
</style>