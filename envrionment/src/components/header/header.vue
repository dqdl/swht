<!--
 * @Author: liyuan
 * @Date: 2022-01-15 10:45:03
 * @LastEditors: Liyuan
 * @LastEditTime: 2022-01-20 15:11:56
 * @FilePath: \swyqxt\basic\src\components\header\header.vue
-->
/* * @Author: hdw * @Date: 2022-01-11 17:34:29 * @Last Modified by:
mikey.zhaopengkey.zhaopeng * @Last Modified time: 2022-02-10 15:06:066 */
<template>
	<div class="header">
		<div class="left">
			<n-gradient-text :gradient="{ from: '#E9F4FF', to: '#B1C5D8' }">邵武市经济开发区CIM智慧园区</n-gradient-text>
			<!-- <n-dropdown trigger="click" :options="options">
                <n-button>></n-button>
			</n-dropdown>-->
		</div>
		<div class="right">
			<div class="nowTime">
				<n-gradient-text :gradient="{ from: '#E9F4FF', to: '#B1C5D8' }">
					{{
						nowTime
					}}
				</n-gradient-text>
			</div>
			<div class="weather">
				<p></p>
				<p>
					<span>多云</span>
					<span>14℃</span>
				</p>
			</div>
			<div class="code">
				<span @click="showBigCode"></span>
			</div>
			<div class="rightH">
				<div>
					<n-gradient-text :gradient="{ from: '#E9F4FF', to: '#B1C5D8' }">
						<div @click="goToggle">首页</div>
						<!-- <n-icon color="#E9F4FF">
                            <chevron-down-outline />
						</n-icon>-->
						<img @click="clickImg" class="fade-mune-img" src="../../assets/images/header/buttom.png" />
					</n-gradient-text>
					<transition name="fade-choice">
						<div v-if="muneShow" class="fade-mune">
							<div>大数据可视化系统</div>
							<div class="active">基础核心支撑系统</div>
							<div>系统菜单</div>
							<div>安全生产监督系统</div>
							<div>智慧环保系统</div>
							<div>企业信息管理系统</div>
						</div>
					</transition>
				</div>
			</div>
			<div class="rightD">
				<n-dropdown :options="userMenu">
					<n-gradient-text :gradient="{ from: '#E9F4FF', to: '#B1C5D8' }">
						欢迎您！{{ user.username }}
						<n-icon color="#E9F4FF">
							<chevron-down-outline />
						</n-icon>
					</n-gradient-text>
				</n-dropdown>
			</div>
			<div class="rightR">
				<n-gradient-text :gradient="{ from: '#E9F4FF', to: '#B1C5D8' }" @click="logout">退出</n-gradient-text>
			</div>
		</div>
		<transition name="fade-choice">
			<div v-if="bigCodeState" class="bigcode" ref="bigCode">
				<p ref="bigCodep">掌上通APP下载</p>
				<span></span>
			</div>
		</transition>
		<n-modal v-model:show="showPersonal">
			<div>
				<div class="personbox">
					<span class="closePerson" @click="closePersonal">×</span>
					<PersonalPage @getemits="getemits"></PersonalPage>
				</div>
			</div>
		</n-modal>
	</div>
</template>
<script lang="ts" setup>
import { h, reactive, ref, onUnmounted } from 'vue';
import { useStore } from 'vuex';
import { NIcon, useDialog, useMessage } from 'naive-ui';
import {
	PersonCircleOutline as UserIcon,
	Pencil as EditIcon,
	LogOutOutline as LogoutIcon,
	Keypad,
	ChevronDownOutline
} from '@vicons/ionicons5';
import router from '../../router';
import { loginHome } from '../../http/api/login/index';
import PersonalPage from '@/view/personalCenter/index.vue';
// const message = useMessage()
const dialog = useDialog();
let store = useStore();
const showPersonal: any = ref(false);
const showDropdownRef = ref(false);
const bigCode: any = ref(null);
let bigCodeState: any = ref(false);
const options: any = ref([
	{
		label: '大数据可视化系统',
		key: 'data-sys',
		disabled: true,
	},
	{
		label: '基础支撑系统',
		key: 'base-sys',
	},
]);
const renderIcon = (icon: any) => {
	return () => {
		return h(NIcon, null, {
			default: () => h(icon),
		});
	};
};
const getemits = (str: string) => {
	showPersonal.value = false;
};
const handleClick = () => {
	showDropdownRef.value = !showDropdownRef.value;
};
let user = reactive({
	username: '园区管理员',
});
(function () {
	loginHome.login.getUserInfo().then((res: any) => {
		user.username = res.data.account;
		res.data && window.sessionStorage.setItem('name', res.data.name);
	});
})();
let nowTime: any = ref(''); // 时间
const formatDate = () => {
	let date = new Date();
	let year = date.getFullYear(); // 年
	let month = date.getMonth() + 1; // 月
	let day = date.getDate(); // 日

	let hour: any = date.getHours(); // 时
	hour = hour < 10 ? '0' + hour : hour; // 如果只有一位，则前面补零
	let minute: any = date.getMinutes(); // 分
	minute = minute < 10 ? '0' + minute : minute; // 如果只有一位，则前面补零
	let second: any = date.getSeconds(); // 秒
	second = second < 10 ? '0' + second : second; // 如果只有一位，则前面补零
	nowTime.value = `${year}年${month}月${day}日   ${hour}:${minute}:${second} `;
};
let muneShow: any = ref(false)
const clickImg = () => {
	muneShow.value = !muneShow.value
}
let dateTime: any = ref(null);
dateTime.value = setInterval(() => {
	formatDate();
}, 200);
onUnmounted(() => {
	clearInterval(dateTime.value);
});
let userMenu = reactive([
	{
		label: '个人中心',
		key: 'profile',
		icon: renderIcon(UserIcon),
		props: {
			onClick: () => {
				// message.success('Good!')
				// router.push({
				//     path: "/personal"
				// })
				showPersonal.value = true;
			},
		},
	},
	// {
	//     label: '编辑用户资料',
	//     key: 'editProfile',
	//     icon: renderIcon(EditIcon)
	// },
	// {
	//     label: '修改密码',
	//     key: 'logout',
	//     icon: renderIcon(Keypad)
	// }
]);

const logout = () => {
	dialog.warning({
		title: '警告',
		content: '是否退出登录？',
		positiveText: '确定',
		negativeText: '不确定',
		onPositiveClick: () => {
			router.push('/login');
			window.sessionStorage.clear();
			store.commit('user/UPDATE_LOGIN', false);
			// message.success('退出确定')
			// let data = {
			//     token: window.sessionStorage.getItem('token')
			// }
			// Login.logout(data).then(res => {
			//     router.push({
			//         path: "/login"
			//     })
			//     window.sessionStorage.clear();
			//     store.commit("user/UPDATE_LOGIN", false);
			//     message.success('退出确定')
			// })
		},
		onNegativeClick: () => {
			// message.error('不确定')
		},
	});
};
const goToggle = () => {
	router.push({
		path: '/toggle',
	});
};
const closePersonal = () => {
	showPersonal.value = false;
};

const showBigCode = () => {
	bigCodeState.value = !bigCodeState.value;
};
</script>
<style lang="postcss" scoped>
@import url("./header.postcss");
.fade-mune {
	width: 200px;
	height: 230px;
	background-color: rgb(242, 242, 242);
	position: absolute;
	top: 80px;
	transform: translate(40px, 0);
	div {
		line-height: 36px;
		padding: 0 20px;
	}
	.active {
		background-color: aqua;
	}
}
.fade-mune-img {
	position: absolute;
	width: 26px;
	top: 0;
	right: -30px;
	height: 26px;
}
.fade-choice-enter-active {
	animation: fade-choice-in 0.2s;
}
.fade-choice-leave-active {
	animation: fade-choice-out 0.2s;
}
@keyframes fade-choice-in {
	0% {
		height: 0;
	}

	100% {
		height: 230px;
	}
}

@keyframes fade-choice-out {
	0% {
		height: 230px;
	}

	100% {
		height: 0;
	}
}
</style>
