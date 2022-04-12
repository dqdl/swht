# vscode 需安装插件

- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

- [Volar](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.volar)

- [language-postcss](https://marketplace.visualstudio.com/items?itemName=cpylua.language-postcss)

# 规范

## 1.文件夹与文件的规范

(1)文件夹字母全部小写。

(2)vue 文件首字母大小。

---

# 已安装插件

| 名称       | 版本   | 备注                       |
| :--------- | :----- | :------------------------- |
| vite       | 2.7.2  | [vite 配置说明](#vite配置) |
| vue        | 3.2.25 |                            |
| vue-router | 4.0.12 | [路由说明](#vue-router)    |
| vuex       | 4.0.2  | [状态管理说明](#vuex)      |
| axios      | 0.26.0 | [axios 说明](#axios)       |
| postcss    |        | [postcss 说明](#postcss)   |
| eslint     | 8.9.0  | [eslint 说明](#eslint)     |
| naive-ui   | 2.25.2 | [naive-ui 说明](#naive-ui) |

---

# 插件说明

## vite 配置

- 别名：通过 vite.config.js 进行配置

  vite.config.js

  ```
  resolve: {
  	alias: {
  		'@': '/src',
  		'@components': '/src/components'
  	}
  }
  ```

  tsconfig.json

  ```
  "paths": {
    "@/*": ["src/*"],
    "@components/*": ["src/components/*"]
  }
  ```

## vue-router

- 路由跳转

  代码：

  ```
  // 引入vue-router
  import { useRouter } from 'vue-router'
  const router = useRouter()
  // 跳转到path为/home的页面
  router.push('/riskIdentification')
  ```

- 路由守卫

  路径： /src/router/index.ts

  代码：

  ```
  /**
   * 路由守卫
   */
  router.beforeEach((to, from) => {
      // ...
      // 返回 false 以取消导航
      return true
  })
  ```

## vuex

- vuex 配置

  路径：/src/vuex/index.ts

  代码：

  ```
  // 引入vuex
  import {
      useStore
  } from 'vuex';
  // 获取实例对象
  const store = useStore()
  // 调用vuex，mutations内方法
  store.commit('addCount')
  // 获取state数据
  store.state.count;
  ```

## axios

- 配置文件:配置请求前缀 ip

  路径：/public/config/urlConfig.js

  同时添加 env.d.ts 中

  ```
  declare var urlConfig: {
  url: string,
  };
  ```

- 添加请求

  路径：/src/http/api/api.ts

  get 请求

  ```
  import { request } from "../request";
  request.get(`${urlConfig.url}/video/listVideo`)
  ```

  post 请求

  ```
  import { request } from "../request";
  request.post(`${urlConfig.url}/video/listVideo`)
  ```

## postcss

- 使用插件

  | 名称               | 版本   | 备注 |
  | :----------------- | :----- | :--- |
  | sugarss            | 4.0.1  |      |
  | postcss-preset-env | 7.3.1  |      |
  | postcss-nested     | 5.0.6  |      |
  | postcss-import     | 14.0.2 |      |
  | cssnano            | 14.0.2 |      |

## [eslint](https://juejin.cn/post/7043702363156119565)

- 使用插件

  | 名称                   | 版本   | 备注 |
  | :--------------------- | :----- | :--- |
  | eslint-config-prettier | 8.3.0  |      |
  | eslint-plugin-prettier | 4.0.0  |      |
  | eslint-plugin-vue      | 8.4.1  |      |
  | husky                  | 7.0.4  |      |
  | lint-staged            | 12.3.4 |      |

## [naive-ui](https://www.naiveui.com/zh-CN/os-theme)

- 已安装依赖

  | 名称   | 版本  | 备注 |
  | :----- | :---- | :--- |
  | vfonts | 0.0.3 |      |

- 信息(message)组件

  调用：

  ```
    window.$message.success('测试测试');
  ```
