<template>
	<div class="warn">
		<div
			class="left"
			:style="{ backgroundColor: `${props.propValue.bgColor}` }"
		>
			<div
				class="circle_outside"
				:style="{ background: `${props.propValue.circleColor}` }"
			></div>
			<div
				class="circle_inside"
				:style="{ background: `${props.propValue.circleColor}` }"
			></div>
			<img :src="warnImage" />
		</div>
		<div
			class="right"
			:style="{ backgroundColor: `${props.propValue.bgColor}` }"
		>
			<p :style="{ color: `${props.propValue.fontColor}` }">
				{{ propValue.title }}
			</p>
			<div :style="{ background: `${props.propValue.gradient}` }">
				<span>{{ propValue.num }}</span>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import warnImage from '../../../assets/images/riskAnalysis/warn.png';
const props = defineProps({
	propValue: {
		type: Object,
		default: () => {
			return {
				title: '重大风险点涉及企业数',
				num: 100,
				bgColor: '#ffe4de',
				circleColor: '#ff4924',
				fontColor: '#e21e00',
				gradient: 'linear-gradient(130deg, #ff9c9c 11%, #ff4022 98%)',
			};
		},
	},
});
</script>

<style lang="postcss" scoped>
.warn {
	width: 321px;
	height: 110px;
	display: flex;
	.left {
		position: relative;
		width: 110px;
		height: 110px;
		border-radius: 50%;
		background: #ffe4de;
		> div,
		> img {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
		}
		> div {
			border-radius: 50%;
		}
		.circle_outside {
			width: 82px;
			height: 82px;
			opacity: 0.3;
			background: #ff4924;
		}
		.circle_inside {
			width: 60px;
			height: 60px;
			background: #ff4924;
		}
	}
	.right {
		width: 266px;
		margin-left: -55px;
		padding-left: 55px;
		padding-top: 18px;
		height: 100%;
		background: #ffe4de;
		border-radius: 0px 10px 10px 0px;
		> p {
			font-family: PingFang SC, PingFang SC-Bold;
			font-weight: 700;
			text-align: left;
			color: #e21e00;
			letter-spacing: 1.6px;
		}
		> div {
			width: 174px;
			height: 37px;
			margin-top: 12px;
			padding-left: 14px;
			background: linear-gradient(130deg, #ff9c9c 11%, #ff4022 98%);
			border-radius: 10px;
			> span {
				font-size: 24px;
				font-family: PingFang SC, PingFang SC-Heavy;
				font-weight: 800;
				text-align: left;
				color: #ffffff;
				letter-spacing: 2.4px;
			}
		}
	}
}
</style>
