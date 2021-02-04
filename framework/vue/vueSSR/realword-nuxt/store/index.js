const cookieparser = process.server ? require('cookieparser') : undefined

// 注册state，使用函数return的形式
export const state = () => {
  return {
    user: null
  }
}

// 注册mutations
export const mutations = {
  setUser (state, user) {
    state.user = user
  }
}

// 注册actions
export const actions = {
  /**
   * 服务端渲染初始化时执行的方法
   */
  nuxtServerInit ( { commit } , { req } ) {
    let user = null

    // 如果请求头里有cookie，说明有登录状态
    if (req.headers.cookie) {
      const parsed = cookieparser.parse(req.headers.cookie)
      try {
        user = JSON.parse(parsed.user)
        // 将cookie转化为对象存入到store当中
        commit('setUser', user)
      } catch (e) {}
    }
  }
}