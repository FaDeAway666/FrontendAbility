import Vue from 'vue'
import Vuex from '../Vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        count: 0,
        msg: 'This is a Vuex demo'
    },
    getters: {
        getReverseMsg: state => {
            return state.msg.reverse()
        }
    },
    mutations: {
        addCount: (state, status) => {
            state.count = state.count + status
        }
    },
    actions: {
        asyncAddCount: (context, payload) => {
            setTimeout(() => {
                context.commit('addCount', payload)
            }, 2000);
        }
    }
})