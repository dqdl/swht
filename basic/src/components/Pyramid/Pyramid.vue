<template>
    <div id="root" :style="{
        width: '100%',
        height: '100%'
    }"></div>
</template>

<script lang="ts" setup>
import { nextTick, onMounted, Ref, PropType, ref, reactive, watch } from "vue"
import * as echarts from 'echarts';


let option: any
let myChart: any

const emits = defineEmits(['nodeTypes'])


function serOption(data: any) {
    // console.log(data,'s');
    var chartDom = document.getElementById('root');
    myChart = echarts.init(chartDom as HTMLElement);
    function init(data: any) {
        myChart.setOption(
            (option = {
                tooltip: {
                    trigger: 'item',
                    formatter: function (name: any) {
                        return name.name
                    },
                    triggerOn: 'mousemove'
                },
                series: [
                    {
                        type: 'tree',
                        data: data,
                        left: '2%',
                        right: '2%',
                        top: '16%',
                        bottom: '20%',
                        symbol: 'rect', // 标记的图形
                        symbolSize: [80, 40], // 标记的宽高
                        smooth: true,
                        symbolOffset: [],
                        symbolKeepAspect: true,
                        orient: 'vertical',
                        initialTreeDepth: 3,// 默认开启层级
                        expandAndCollapse: true, // 是否全部展开
                        label: {
                            position: 'inside',
                            rotate: 0,
                            verticalAlign: 'middle',
                            align: 'center',
                            fontSize: 16,
                            formatter: function (name: any) {
                                let sname: any = name.name
                                if (!sname) return '';
                                if (sname.length > 4) {
                                    sname = sname.slice(0, 4) + '...';
                                    return sname
                                }
                            },

                        },
                        leaves: {
                            label: {
                                position: 'inside',
                                rotate: 0,
                                verticalAlign: 'middle',
                                align: 'center'
                            }
                        },
                        itemStyle: {
                            borderDashOffset: 5,
                            borderColor: "",
                            borderWidth: 2
                        },
                        animationDurationUpdate: 500
                    }
                ]
            })
        );
    }
    init(data)
    option && myChart.setOption(option);
    myChart.on('click', function (evt: any) {
        const { data } = evt
        console.log(123232323,data)
        emits('nodeTypes', data)
    })
}

interface Obj {
    name: string,
    children: any[]
}

let props: any = defineProps({
    data: {
        type: Object as PropType<Obj>
    },
    id: {
        type: String,
        default: 'root'
    }
})
// let ids: any = ref('')
// let id: = props.id 

// 递归遍历Tree
function dirTree(tree: any[]) {
    return tree.map((item: any) => {
        item.name = item.name.length > 8 ? item.name.slice(0, 8) + '...' : item.name
        item.itemStyle = {
            // color:"",
        }
        item.label = {
            // show:true,
            // backgroundColor:'#fff'
        }
        if (item.children.length > 0 && item.children) {
            dirTree(item.children)
        }
        return item
    })
}




watch(() => props.data, (prev) => {
    if (prev) {
        console.log(prev, 'oo');
        // let datas = dirTree(prev)
        // console.log(datas,'lll');
        nextTick(() => {
            serOption(prev)

        })
    }
}, {
    deep: true,
    immediate: true
})

</script>

<style lang="postcss" scoped>
</style>