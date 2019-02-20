export default {
  SET_METAMASK(state, bool) {
    state.metamask = bool
  },
  SET_RETRY(state, bool) {
    state.retried = bool
  },
  SET_CONNECTED(state, bool) {
    state.connected = bool
  },
  CLEAR_ACCOUNT(state) {
    state.account = null
  },
  USE_ACCOUNT(state, account) {
    state.account = account
  },
  USE_CONTRACT(state, contract) {
    state.Contract = contract
  },
  CLEAR_CONTRACT(state) {
    state.Contract = null
  },
  USE_ABI(state, abi) {
    state.abi = abi
  },
  ADD_ASSET(state, item) {
    const arr = state.items
    arr.push(item)
    state.items = arr
  },
  REMOVE_ASSET(state, item) {
    const arr = state.items
    let idx

    state.items.forEach((i, id) => {
      if (i.ref === item.ref && i.id === item.id) idx = id
    })

    if (idx) {
      arr.splice(idx, 1)
      state.items = arr
    }
  },
  SET_TOKEN: setIdToken,
  SET_PROFILE: setProfile,
  SET_LYRIC: setLyric,
  UPDATE_BALANCE: updateBalance
}

function setProfile(state, email) {
  state.profile = {
    email: email
  }
}
function setIdToken(state, idToken) {
  state.idToken = idToken
}
function setLyric(state, lyric) {
  state.lyrics.push(lyric)
}
function updateBalance(state, balance) {
  state.balance = Number(balance)
}
