import axios from 'axios'
import Web3 from 'web3'

const getAbiDeployedAddress = abi => {
  if (!abi) return ''
  const networks = abi.networks
  return networks[Math.max(...Object.keys(networks))].address
}

export default {
  // Connect to a known web3 provider
  // https://gist.github.com/bitpshr/076b164843f0414077164fe7fe3278d9#file-provider-enable-js
  async connect({ commit, state, dispatch }) {
    let web3Provider = false
    if (typeof window.web3 !== 'undefined') {
      web3Provider = window.web3.currentProvider
      try {
        // Not quite ready yet
        if (web3Provider.enable) await web3Provider.enable()
        // console.log('web3Provider', web3Provider)
        commit('SET_METAMASK', true)
      } catch (e) {
        console.log('e', e)
        commit('SET_METAMASK', false)
      }
    } else if (!state.retried) {
      commit('SET_RETRY', true)
      setTimeout(() => {
        dispatch('connect')
      }, 1000)
    }
    if (state.retried && !web3Provider) {
      web3Provider = new Web3(
        window.web3.givenProvider || `ws://${process.env.RPC_PROVIDER}`
      )
    }
    if (web3Provider) {
      window.web3 = new Web3(web3Provider)
      commit('SET_CONNECTED', true)
      dispatch('setAccountInterval')
      dispatch('mountContract')
    }
  },

  setAccountInterval({ dispatch }) {
    dispatch('checkAccount')
    setInterval(() => {
      dispatch('checkAccount')
    }, 3000)
  },

  checkAccount({ commit, state }) {
    console.log(state.account)
    window.web3.eth.getAccounts((error, accounts) => {
      if (error) console.error(error)
      if (state.account !== accounts[0]) {
        commit('USE_ACCOUNT', accounts[0])
      } else if (!accounts.length) {
        commit('USE_ACCOUNT', null)
      }
    })
  },

  mountContract({ dispatch, commit, state }) {
    if (state.connected) {
      commit('CLEAR_CONTRACT')

      const address = getAbiDeployedAddress(state.abi)
      const contract = new window.web3.eth.Contract(state.abi.abi, address)
      commit('USE_CONTRACT', contract)
    } else {
      setTimeout(() => {
        dispatch('mountContract')
      }, 500)
    }
  },

  async addAsset({ state, commit }, { ref, id }) {
    if (!ref || !state.Contract) return
    return new Promise((resolve, reject) => {
      state.Contract.methods
        .addAsset(ref, id)
        .send({ from: state.account, gas: 42000 })
        .then(e => {
          if (!e) return reject()
          commit('ADD_ASSET', { ref: `${ref}`, id: `${id}` })
          resolve(e)
        })
    })
  },

  async removeAsset({ state, commit }, { ref, id }) {
    if (!ref || !state.Contract) return
    return new Promise((resolve, reject) => {
      state.Contract.methods
        .removeAsset(ref)
        .send({ from: state.account, gas: 42000 })
        .then(e => {
          if (!e) return reject(e)
          commit('REMOVE_ASSET', { ref: `${ref}`, id: `${id}` })
          resolve(e)
        })
    })
  },

  handleLogin: handleLoginEvent,
  sendTransaction: sendTransaction,
  createLyric: createLyric
}

function handleLoginEvent({ commit }, googleUserObj) {
  var auth = googleUserObj.getAuthResponse()
  commit('SET_TOKEN', auth.id_token)

  var params = {
    method: 'GET',
    url: `${process.env.SIGNING_ENDPOINT}/login`,
    headers: {
      Authorization: auth.id_token
    }
  }
  return new Promise(async (resolve, reject) => {
    var accountError
    var response = await axios(params).catch(error => {
      console.log(error)
      accountError = true
      reject(error)
    })
    if (accountError) return
    commit('USE_ACCOUNT', response.data)

    var profile = googleUserObj.getBasicProfile()
    commit('SET_PROFILE', profile.getEmail())
    resolve(response)
  })
}

function sendTransaction({ state }, transaction) {
  var params = {
    method: 'POST',
    url: `${process.env.SIGNING_ENDPOINT}/transact`,
    headers: {
      Authorization: state.idToken
    },
    data: {
      contract: state.Contract._address,
      transaction: transaction.encodeABI()
    }
  }
  console.log(params)
  return new Promise((resolve, reject) => {
    axios(params)
      .then(response => {
        resolve(response)
      })
      .catch(e => {
        console.log(e)
        reject(e)
      })
  })
}

function createLyric({ dispatch, state, commit }, lyric) {
  return new Promise(async (resolve, reject) => {
    var methodBuild = state.Contract.methods.createLyric(
      lyric.parent,
      lyric.content
    )
    var uploadError
    var result = await dispatch('sendTransaction', methodBuild).catch(error => {
      console.log(error)
      uploadError = true
      reject(error)
    })
    if (uploadError) return
    console.log(result)

    commit('SET_LYRIC', lyric)
    resolve(true)
  })
}
