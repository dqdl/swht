import { createStore } from 'vuex';
import user from './modules/user';
import mune from './modules/mune';
import postArticle from './modules/postArticle';

const store = createStore({
	state: {},
	mutations: {},
	modules: { user, mune, postArticle },
});

export default store;
