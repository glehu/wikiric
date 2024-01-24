// STORAGE

let _u = null
let _t = null
let _interval = null
let _interval2 = null
// const _endpoint = 'http://localhost:9999/'
// const _wssEndpoint = 'ws://localhost:9999/'
const _endpoint = 'https://wikiric.xyz/'
const _wssEndpoint = 'wss://wikiric.xyz/'
let ws = null
let bc = null

const refreshToken = () => {
  let response = null
  const headers = new Headers()
  headers.set('Authorization', 'Basic ' + _u)
  fetch(
    _endpoint + 'auth/private/signin',
    {
      method: 'get',
      headers: headers
    }
  )
    .then((res) => res.json())
    .then((data) => (response = data))
    .then(() => {
      if (response.httpCode === 200) {
        _t = response.token
        if (_interval) clearInterval(_interval)
        _interval = setInterval(() => {
          refreshToken()
        }, (response.expiresInMs - 60000))
      }
    })
}

const wConnect = () => {
  ws = new WebSocket(_wssEndpoint + 'ws/connector')
  ws.onopen = async () => {
    bc = new BroadcastChannel('connector')
    ws.onmessage = async function (e) {
      try {
        bc.postMessage(JSON.parse(e.data))
      } catch (e) {
      }
    }
    ws.send(_t)
    bc.postMessage('nav_init_notification')
    if (_interval2) clearInterval(_interval2)
    _interval2 = setInterval(() => {
      checkWConnect()
    }, 30000)
    bc.onmessage = event => {
    }
  }
  ws.onclose = () => {
    wConnect()
  }
}

const checkWConnect = () => {
  if (ws.readyState !== WebSocket.OPEN) {
    if (_interval2) clearInterval(_interval2)
    wConnect()
  }
}

// Listen for requests
onmessage = function (e) {
  if (!e.data) return
  const msg = e.data
  if (!msg.action) return
  if (msg.action === 'signup') {
    if (!msg.username || !msg.password || !msg.displayName) return
    _u = msg.u
    let response = null
    const headers = new Headers()
    headers.set(
      'Content-Type', 'application/json'
    )
    fetch(
      _endpoint + 'users/public/signup',
      {
        method: 'post',
        headers: headers,
        body: JSON.stringify({
          email: msg.email,
          username: msg.username,
          displayName: msg.displayName,
          password: msg.password
        })
      }
    )
      .then(() => {
        e.ports[0].postMessage({
          success: true,
          result: ''
        })
        refreshToken()
      })
      .catch((err) => {
        console.log(err)
      })
  } else if (msg.action === 'login') {
    if (!msg.u) return
    _u = msg.u
    let response = null
    const headers = new Headers()
    headers.set('Authorization', 'Basic ' + _u)
    fetch(
      _endpoint + 'auth/private/signin',
      {
        method: 'get',
        headers: headers
      }
    )
      .then((res) => res.json())
      .then((data) => (response = data))
      .then(() => {
        if (response.httpCode === 200) {
          _t = response.token
          e.ports[0].postMessage({
            success: true,
            result: response
          })
          if (_interval) clearInterval(_interval)
          _interval = setInterval(() => {
            refreshToken()
          }, (response.expiresInMs - 60000))
          wConnect()
        }
      })
  } else if (msg.action === 'logout') {
    const headers = new Headers()
    headers.set('Authorization', 'Basic ' + _u)
    fetch(
      _endpoint + 'logout',
      {
        method: 'get',
        headers: headers
      }
    ).then(() => {
      if (_interval) clearInterval(_interval)
    })
  } else if (msg.action.substring(0, 3) === 'api') {
    if (!msg.url || !msg.method || (msg.action !== 'api-http' && !_t)) {
      e.ports[0].postMessage({
        error: new Error('invalid request or unauthorized'),
        success: false,
        errorMessage: 'invalid request or unauthorized'
      })
      return
    }
    const headers = new Headers()
    if (msg.action !== 'api-http') {
      headers.set('Authorization', 'Bearer ' + _t)
    }
    headers.set(
      'Content-Type', 'application/json'
    )
    let config
    if (msg.method === 'get') {
      config = {
        method: msg.method,
        headers: headers
      }
    } else if (msg.method === 'post') {
      if (!msg.body) return
      config = {
        method: msg.method,
        headers: headers,
        body: msg.body
      }
    }
    fetch(
      _endpoint + msg.url,
      config
    )
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed API request (or no response)')
        }
        res.text()
          .then(text => {
            try {
              const data = JSON.parse(text)
              e.ports[0].postMessage({
                success: true,
                result: data
              })
            } catch (err) {
              e.ports[0].postMessage({
                success: true,
                result: text
              })
            }
          })
      })
      .catch((err) => {
        e.ports[0].postMessage({
          error: new Error(err.message),
          success: false,
          errorMessage: err.message
        })
      })
  } else if (msg.action === 'wss_auth') {
    e.ports[0].postMessage({
      success: true,
      t: _t
    })
  } else if (msg.action === 'call') {
    try {
      // ws.send('[c:CALL]' + JSON.stringify({
      //   usernameToCall: msg.usernameToCall,
      //   chatroomGUID: msg.chatroomGUID
      // }))
      ws.send(JSON.stringify({
        act: '[c:CALL]',
        msg: msg.msg,
        pid: msg.chatroomGUID,
        usr: msg.usernameToCall
      }))
      e.ports[0].postMessage({
        success: true
      })
    } catch (e) {
      console.debug(e.message)
      e.ports[0].postMessage({
        success: false
      })
    }
  } else if (msg.action === 'fwd') {
    try {
      // ws.send('[c:FWD]' + JSON.stringify({
      //   username: msg.username,
      //   type: msg.type,
      //   value: msg.value
      // }))
      ws.send(JSON.stringify({
        act: '[c:FWD]',
        typ: msg.typ,
        msg: msg.msg,
        usr: msg.usr
      }))
      e.ports[0].postMessage({
        success: true
      })
    } catch (e) {
      console.debug(e.message)
      e.ports[0].postMessage({
        success: false
      })
    }
  }
}
