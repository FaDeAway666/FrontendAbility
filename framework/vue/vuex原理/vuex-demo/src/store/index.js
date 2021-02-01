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
            let reverse = state.msg.split('').reverse()
            return reverse.join('')
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