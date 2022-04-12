<template>
	<div class="barChart" @mouseenter="stopTooltip" @mouseleave="activeTooltip">
		<div :id="idName" class="roundCake" :style="{ ...demoStyle }"></div>
	</div>
</template>
<script lang="ts">
import {
	defineComponent,
	reactive,
	onMounted,
	nextTick,
	onUnmounted,
	inject,
	ref,
	computed,
	watch,
} from 'vue';
// import { number } from '_echarts@5.2.0@echarts';
import * as echarts from 'echarts';
interface domeStyleType {
	width: string;
	height: string;
}
export default defineComponent({
	props: {
		// id名
		idName: {
			type: String,
			default: 'barChart',
		},
		// 宽度
		width: Number,
		// 高度
		height: Number,
		xData: {
			type: Array,
			// eslint-disable-next-line vue/require-valid-default-prop
			default: ['一', '二', '三', '四'],
		},
		style: {
			type: Object,
			// eslint-disable-next-line vue/require-valid-default-prop
			default: {
				fontColor: '#fff',
				fontSize: 16,
				provideNumber: 4,
				animate: 0, // 动画延迟时间
			},
		},
		legend: {
			type: Array,
			// eslint-disable-next-line vue/require-valid-default-prop
			default: [],
		},
		yFontSize: {
			//y轴的字体大小
			type: [Number, String],
		},
		data: {
			type: Array,
			// eslint-disable-next-line vue/require-valid-default-prop
			default: [
				{
					name: '枪机',
					barWidth: 10,
					data: [10, 10, 10, 10],
					type: 'bar',
					itemStyle: {
						color: '#b7aa47',
					},
				},
				{
					name: '球机',
					barWidth: 10,
					data: [10, 10, 10, 10],
					type: 'bar',
					itemStyle: {
						color: '#4299cf',
					},
				},
			],
		},
	},

	setup(props: any) {
		// let echarts: any = inject('ec'); //引入
		let myEcharts: any = ref(null);
		let timer: any = ref(null);
		//柱状图标题
		// console.log(props);

		let chartTitle: [] = props.legend || [];
		// console.log(chartTitle,777);

		const demoStyle = computed(() => {
			let value: domeStyleType = {
				width: '800px',
				height: '400px',
			};
			if (typeof props.width === 'number') {
				value.width = props.width + 'px';
			}
			if (typeof props.height === 'number') {
				value.height = props.height + 'px';
			}
			return value;
		});
		let datas = computed(() => {
			let data = props.data.length ? props.data : [20, 30];
			for (let i = 0; i < data.length; i++) {
				data[i].animationDelay = props.style.animate ? props.style.animate : 0;
				data[i].animationEasing = 'cubicInOut';
			}
			if (props.style.barBackground) {
				for (let i = 0; i < data.length; i++) {
					data[i].showBackground = true;
					data[i].backgroundStyle = {};
					data[i].backgroundStyle.color = props.style.barBackgroundColor
						? props.style.barBackgroundColor
						: 'rgba(110, 193, 244, 0.1)';
				}
			}
			// console.log(data);

			return data;
		});
		let option: any = ref({
			grid: {
				top: props.style.top ? props.style.top : '5%',
				bottom: props.style.top ? props.style.bottom : '5%',
				left: props.style.top ? props.style.left : '5%',
				right: props.style.top ? props.style.right : '0%',
			},
			tooltip: {
				show: true,
				trigger: 'axis',
			},
			legend: {
				data: chartTitle,
				right: 5,
				itemWidth: 24,
				itemHeight: 24,
				borderRadius: 0,
				textStyle: {
					color: '#c7edff', // 文字的颜色。
					fontStyle: 'normal', // 文字字体的风格。
					fontWeight: 'normal', // 文字字体的粗细。 'normal' 'bold'  'bolder' 'lighter'  100 | 200 | 300 | 400...
					fontFamily: 'sans-serif', // 文字的字体系列。
					fontSize: 16, // 文字的字体大小。
					lineHeight: 25, // 行高。
				},
			},
			xAxis: {
				type: 'category',
				axisLine: {
					lineStyle: {
						color: 'rgba(22,88,103,0.2)', //更改坐标轴颜色
					},
				},
				axisLabel: {
					show: true,
					interval: 'auto',
					rotate: props.style.rotate ? props.style.rotate : 0,
					color: '#000', // 更改坐标轴文字颜色
					fontSize: 14, // 更改坐标轴文字大小
					lineHeight: props.style.lineHeight ? props.style.lineHeight : 14,
					// formatter: (value: any) => {
					// 	if (props.style.xTextVertical) {
					// 		return value.split('').join('\n');
					// 	} else {
					// 		return value;
					// 	}
					// },
					formatter: (params: any) => {
						if (props.style.xTextVertical) {
							return params.split('').join('\n');
						} else {
							var newParamsName = ''; // 最终拼接成的字符串
							var paramsNameNumber = params.length; // 实际标签的个数
							var provideNumber = props.style.provideNumber
								? props.style.provideNumber
								: 4; // 每行能显示的字的个数
							var rowNumber = Math.ceil(paramsNameNumber / provideNumber); // 换行的话，需要显示几行，向上取整
							/**
							 * 判断标签的个数是否大于规定的个数， 如果大于，则进行换行处理 如果不大于，即等于或小于，就返回原标签
							 */
							// 条件等同于rowNumber>1
							if (paramsNameNumber > provideNumber) {
								/** 循环每一行,p表示行 */
								for (var p = 0; p < rowNumber; p++) {
									var tempStr = ''; // 表示每一次截取的字符串
									var start = p * provideNumber; // 开始截取的位置
									var end = start + provideNumber; // 结束截取的位置
									// 此处特殊处理最后一行的索引值
									if (p == rowNumber - 1) {
										// 最后一次不换行
										tempStr = params.substring(start, paramsNameNumber);
									} else {
										// 每一次拼接字符串并换行
										tempStr = params.substring(start, end) + '\n';
									}
									newParamsName += tempStr; // 最终拼成的字符串
								}
							} else {
								// 将旧标签的值赋给新标签
								newParamsName = params;
							}
							//将最终的字符串返回
							return newParamsName;
						}
					},
				},
				data: props.xData,
			},
			yAxis: {
				type: 'value',
				name: props.style.yTitle ? props.style.yTitle : '',
				nameTextStyle: {
					color: '#000',
					fontSize: 16,
					align: 'center',
					lineHeight: 46,
				},
				axisLine: {
					show: false,
					lineStyle: {
						color: 'rgba(22,88,103,0.2)', //更改坐标轴颜色
					},
				},
				axisLabel: {
					show: true,
					color: '#000', // 更改坐标轴文字颜色
					fontSize: props.yFontSize ? props.yFontSize : 16, // 更改坐标轴文字大小
					left: 2,
				},
				splitLine: {
					show: true,
					lineStyle: {
						color: 'rgba(22,88,103,0.2)',
						width: 2,
					},
				},
			},
			series: datas.value,
		});
		const setOption = () => {
			if (!myEcharts.value) {
				let barCahrt: HTMLDivElement = document.getElementById(
					props.idName as string
				) as HTMLDivElement;
				myEcharts.value = echarts.init(barCahrt);
			}

			// console.log(props.idName);

			// console.log(option);
			myEcharts.value.setOption(option.value);
		};
		onMounted(() => {
			nextTick(() => {
				setOption();
				// activeTooltip();
			});
		});
		const activeTooltip = () => {
			let index = 0;
			timer.value = setInterval(() => {
				myEcharts.value.dispatchAction({
					type: 'showTip',
					seriesIndex: 0,
					dataIndex: index,
				});
				index++;
				if (index > props.xData.length - 1) {
					index = 0;
				}
			}, 2000);
		};
		const stopTooltip = () => {
			clearInterval(timer.value);
			timer.value = null;
		};
		watch(
			() => props.xData,
			(newValue, oldValue) => {
				if (oldValue) {
					option.value.xAxis.data = props.xData;
					setOption();

					// console.log('更新的值', option.value.xAxis.data, props.xData);
				}
			}
		);
		onUnmounted(() => {
			stopTooltip();
			echarts.dispose(myEcharts.value);
			myEcharts.value = null;
		});
		return {
			demoStyle,
			activeTooltip,
			stopTooltip,
		};
	},
});
</script>
<style lang="postcss" scoped>
.barChart {
	pointer-events: all;
}
</style>
