<template>
	<div class="login">
		<img src="@/assets/images/login/bg.png" style="width:100%;height:100%;" />
		<!-- <swiper
			:autoplay="swiper_options.autoplay"
			:loop="swiper_options.loop"
			:speed="swiper_options.speed"
			:pagination="swiper_options.pagination"
			:navigation="swiper_options.navigation"
			direction="vertical"
		>
			<swiper-slide>
				<img src="@/assets/images/login/bg.png" />
			</swiper-slide>
			<swiper-slide>
				<img src="@/assets/images/login/bg.png" />
			</swiper-slide>
	
			<div class="swiper-login-button">
				<div class="swiper-button-prev"></div>
				<div style="height: 32px"></div>
				<div style="height: 32px"></div>
		
				<div class="swiper-button-next"></div>
			</div>
		</swiper> -->
		<div class="login_content">
			<div class="login_content_title">
				<img src="@/assets/images/login/title_logo.png" />
				<span>绍武市经济开发区CIM智慧园区</span>
			</div>
			<router-view></router-view>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';
import SwiperCore, { Autoplay, Pagination, Navigation } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
SwiperCore.use([Autoplay, Pagination, Navigation]);
let swiper_options = reactive({
	autoplay: {
		disableOnInteraction: true,
		delay: 4000,
	},
	speed: 500,
	loop: true,
	navigation: {
		nextEl: '.swiper-button-next',
		prevEl: '.swiper-button-prev',
	},
	pagination: {
		clickable: true,
		left: 40,
	},
});
</script>
<style lang="postcss" scoped>
.login {
	.swiper {
		height: 100%;
		width: 100%;
		:deep(.swiper-pagination) {
			left: 40px;
			.swiper-pagination-bullet {
				width: 10px;
				height: 10px;
			}
			.swiper-pagination-bullet-active {
				width: 14px;
				height: 14px;
				position: relative;
				right: 2px;
				background-color: #1e9fff;
			}
		}
		.swiper-slide {
			height: 100%;
			width: 100%;
			img {
				height: 100%;
				width: 100%;
			}
		}
		.swiper-login-button {
			width: 38px;
			position: absolute;
			left: 25px;
			top: 50%;
			z-index: 99;
			transform: translateY(-50%);
			.swiper-button-prev::after,
			.swiper-button-next::after {
				content: '';
			}
			.swiper-button-prev {
				position: static;
				margin: 0;
				width: 38px;
				height: 38px;
				background: url('@/assets/images/login/slide_top.png') no-repeat;
			}
			.swiper-button-next {
				position: static;
				width: 38px;
				height: 38px;
				margin: 0;
				background: url('@/assets/images/login/slide_bottom.png') no-repeat;
			}
		}
	}
	height: 100%;
	width: 100%;
	/* background: url("@/assets/images/login/bg.png") no-repeat; */
	background-size: 100% 100%;
	.login_content {
		position: absolute;
		z-index: 99;
		top: 76px;
		right: 80px;
		.login_content_title {
			margin-bottom: 24px;
			margin-left: 40px;
			display: flex;
			align-items: center;
			span {
				margin-left: 14px;
				font-size: 28px;
				letter-spacing: 8px;
				background: linear-gradient(135deg, #e9f4ff 0%, #b1c5d8 100%);
				font-weight: bold;
				font-style: italic;
				-webkit-background-clip: text;
				-webkit-text-fill-color: transparent;
			}
		}
	}
}
</style>
