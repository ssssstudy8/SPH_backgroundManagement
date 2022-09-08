import {
  login,
  logout,
  getInfo
} from '@/api/user'
import {
  getToken,
  setToken,
  removeToken
} from '@/utils/auth'
import {
  anyRoutes,
  asyncRoutes,
  resetRouter,
  constantRoutes
} from '@/router'
import router from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    routes: [],
    buttons: [],
    roles: [],
    //对比之后，项目中已有的异步路由，与服务器返回的标记信息进行对比最终需要展示的路由
    resultAsyncRoutes: [],
    resultAllRoutes: []
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  //存储用户信息
  SET_USERINFO: (state, userInfo) => {
    state.name = userInfo.name
    state.avatar = userInfo.avatar
    state.routes = userInfo.routes
    state.buttons = userInfo.buttons
    state.roles = userInfo.roles
  },
  //最终计算出的异步路由
  SET_RESULTASYNCROUTES: (state, asyncRoutes) => {
    //保存当前用户的异步路由
    state.resultAsyncRoutes = asyncRoutes
    //计算当前用户需要展示所有路由
    state.resultAllRoutes = constantRoutes.concat(state.resultAsyncRoutes, anyRoutes)
    //给路由器添加新的路由
    router.addRoutes(state.resultAllRoutes)
  }
}


//定义一个函数，两个数组对比，对比出当前用户到底显示哪些异步路由
const computedAsyncRoutes = (asyncRoutes, routes) => {
  return asyncRoutes.filter(item => {
    //没有元素返回-1
    if (routes.indexOf(item.name) != -1) {
      //递归
      if (item.children && item.children.length) {
        item.children = computedAsyncRoutes(item.children, routes)
      }
      return true
    }
  })
}



const actions = {
  // user login
  async login({
    commit
  }, userInfo) {
    const {
      username,
      password
    } = userInfo
    const result = await login({
      username: username.trim(),
      password: password
    })
    if (result.code === 20000) {
      commit('SET_TOKEN', result.data.token)
      setToken(result.data.token)
      return 'ok'
    } else {
      return Promise.reject(new Error('fail'))
    }
  },

  //获取用户信息
  getInfo({
    commit,
    state
  }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const {
          data
        } = response
        commit('SET_USERINFO', data)
        commit('SET_RESULTASYNCROUTES', computedAsyncRoutes(asyncRoutes, data.routes))
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({
    commit,
    state
  }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({
    commit
  }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
