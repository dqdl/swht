<template>
	<div class="safe_grade">
		<div>安全级别</div>
		<div>
			<div :class="props.level > 0 ? 'active' : ''"></div>
			<div :class="props.level > 1 ? 'active' : ''"></div>
			<div :class="props.level > 2 ? 'active' : ''"></div>
			<!-- <div :class="props.level > 3 ? 'active' : ''"></div> -->
		</div>
	</div>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue';
interface Props {
	level: number;
}
const props = withDefaults(defineProps<Props>(), {
	level: 0,
});
</script>

<style lang="postcss" scoped>
.safe_grade {
	position: absolute;
	bottom: -34px;
	right: 0;
	color: #77d1ff;
	font-size: 16px;
	display: flex;
	align-items: center;
	> div:nth-child(1) {
		margin-right: 10px;
	}
	> div:nth-child(2) {
		display: flex;
		div {
			margin-right: 6px;
			width: 34px;
			height: 12px;
			text-align: center;
			transform: skewX(-25deg);
			border: 1px solid #77d1ff;
		}
		.active {
			background: #77d1ff;
		}
	}
}
</style>
