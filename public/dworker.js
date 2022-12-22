// STORAGE

let _u = null
let _t = null
let _interval = null
const _endpoint = 'https://wikiric.xyz/'

const refreshToken = () => {
  let response = null
  const headers = new Headers()
  headers.set('Authorization', 'Basic ' + _u)
  fetch(
    _endpoint + 'login',
    {
      method: 'get',
      headers: headers
    }
  )
    .then((res) => res.json())
    .then((data) => (response = JSON.parse(data.contentJson)))
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

// Listen for requests
onmessage = function (e) {
  if (!e.data) return
  const msg = e.data
  if (!msg.action) return
  if (msg.action === 'signup') {
    if (!msg.u || !msg.uRaw || !msg.username) return
    _u = msg.u
    let response = null
    const headers = new Headers()
    headers.set(
      'Content-Type', 'application/json'
    )
    fetch(
      _endpoint + '/register',
      {
        method: 'post',
        headers: headers,
        body: JSON.stringify({
          email: msg.uRaw.split(':')[0],
          username: msg.username,
          password: msg.uRaw.split(':')[1]
        })
      }
    )
      .then((res) => res.json())
      .then((data) => (response = data))
      .then(() => {
        if (response.success) {
          e.ports[0].postMessage({
            success: true,
            result: response
          })
          refreshToken()
        }
      })
  } else if (msg.action === 'login') {
    if (!msg.u) return
    _u = msg.u
    let response = null
    const headers = new Headers()
    headers.set('Authorization', 'Basic ' + _u)
    fetch(
      _endpoint + 'login',
      {
        method: 'get',
        headers: headers
      }
    )
      .then((res) => res.json())
      .then((data) => (response = JSON.parse(data.contentJson)))
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
  } else if (msg.action === 'api') {
    if (!msg.url || !msg.method) return
    const headers = new Headers()
    headers.set('Authorization', 'Bearer ' + _t)
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
      _endpoint + 'api/' + msg.url,
      config
    )
      .then((res) => {
        res.json()
          .then((data) => {
            e.ports[0].postMessage({
              success: true,
              result: data
            })
          })
          .catch((err) => {
            e.ports[0].postMessage({
              success: true,
              errorMessage: err.message
            })
          })
      })
  } else if (msg.action === 'wss_auth') {
    e.ports[0].postMessage({
      success: true,
      t: _t
    })
  }
}
