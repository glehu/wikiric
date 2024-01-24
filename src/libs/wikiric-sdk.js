import Wikiricrypt from './wikiricrypt'

/**
 * # The official wikiric SDK
 *
 * ---
 *
 * ## Features
 *
 * This SDK provides easy access to the chat functionality.
 *
 * - Easy login
 * - Easy chat session creation
 * - Automatic chat session authorization
 * - Decryption of incoming E2E encrypted messages
 * - Sending of messages
 *
 * ## Private Key
 *
 * To get the private key which is needed to connect to a chat group
 * you need to open the targeted chat group, click on your profile and then on "Transfer".
 * On the bottom side of the modal you will see the button to copy the private Key.
 *
 * ## Code
 *
 * Quick Start Copy&Paste Template:
 *
 * ```js
 * // 1. Get token
 * await this.sdk.login('changeThisUsername', 'changeThisPassword')
 * // 2. Connect to chat group
 * this.sdk.connect('changeThisChatGroupUUID', 'changeThisPrivateKey')
 * // 3. Listen to incoming messages
 * const events = new BroadcastChannel('wikiricsdk')
 * events.onmessage = event => {
 *   console.log('SDK', event.data)
 * }
 * ```
 *
 * @type {{_processRawMessage: ((function(*): Promise<void>)|*), eventChannel: module:worker_threads.BroadcastChannel, _token: string, sendMessage: ((function(String): boolean)|*), _key: null, login: (function(String, String): Promise<unknown>), _isBanned: boolean, _isAuthorized: boolean, _websocketState: string, _websocket: null, _username: string, connect: wikiricSDK.connect, _wcrypt: {decryptMessageRSA: (function(*, *): Promise<string>), decryptMessageAES: (function(*, *, *): Promise<string>), decryptPayload: (function(*, *, *): Promise<unknown>), stringToArrayBuffer: (function(*): ArrayBuffer), importRSAPrivKey: (function(*): Promise<CryptoKey>), base64ToArrayBuffer: (function(*): ArrayBuffer), importSecretKey: (function(*): Promise<CryptoKey>)}}}
 */
const wikiricSDK = {
  // Broadcast Channel for external use
  eventChannel: new BroadcastChannel('wikiricsdk'), // Internal variables
  _username: '',
  _token: '',
  _key: null,
  _websocket: null,
  _websocketState: 'CLOSED',
  _isAuthorized: false,
  _isBanned: false,
  _wcrypt: Wikiricrypt,
  /**
   * Authorizes a user and retrieves a JWT token
   *
   * Example call:
   *
   * ```
   * await WikiricSDK.login('usr', 'pass')
   * ```
   * @param {String} username
   * @param {String} password
   * @returns {Promise<Boolean>}
   */
  login: async function (username, password) {
    const _u = window.btoa(username + ':' + password)
    this._username = username
    return new Promise((resolve, reject) => {
      let response = null
      const headers = new Headers()
      headers.set('Authorization', 'Basic ' + _u)
      fetch('https://wikiric.xyz/auth/private/signin', {
        method: 'get',
        headers: headers
      })
      .then((res) => res.json())
      .then((data) => (response = data))
      .then(() => {
        if (response.httpCode === 200) {
          this._token = response.token
          resolve(true)
        } else {
          reject(Error('401'))
        }
      })
    })
  },
  /**
   * Creates a wikiric chat session for the provided sessionID and privateKey
   * and optionally a queryString e.g. "?sub=channelID" to be able to connect to channels.
   *
   * The chat session automatically gets authorized, so you can just listen to this SDKs event channel.
   * @param {String} sessionID
   * @param {String} privateKey
   * @param {String} queryString
   */
  connect: function (sessionID, privateKey, queryString = '') {
    this._key = {
      id: sessionID,
      priv: privateKey
    }
    this._websocket = new WebSocket('wss://wikiric.xyz/ws/chat/' + sessionID + queryString)
    this._websocketState = 'CLOSED'
    this._websocket.onopen = async () => {
      this._websocket.onmessage = (event) => {
        const message = event.data
        if (message.substring(0, 8) === '[s:wlcm]') {
          this._isAuthorized = true
        } else if (message.substring(0, 10) === '[s:banned]') {
          this._isAuthorized = false
          this._isBanned = true
        } else {
          this._processRawMessage(message)
        }
      }
      this._websocket.send(this._token)
      this._websocketState = 'OPEN'
    }
    this._websocket.onclose = async () => {
      this._websocket = null
      this._websocketState = 'CLOSED'
      this._isAuthorized = false
    }
  },
  /**
   * Sends a message to the wikiric chat session.
   *
   * Returns true if the message was sent, otherwise it will return false
   * @param {String} text
   * @returns {boolean}
   */
  sendMessage: function (text) {
    if (this._websocketState === 'OPEN' && this._websocket != null && this._isAuthorized && !this._isBanned) {
      this._websocket.send(text)
      return true
    } else {
      return false
    }
  },
  _processRawMessage: async function (message) {
    // Is the message encrypted?
    const encryptionPrefix = '[c:MSG<ENCR]'
    message = JSON.parse(message)
    if (message.msg.startsWith(encryptionPrefix)) {
      message.isEncrypted = true
      try {
        message.msg = await this._wcrypt.decryptPayload(message, this._username, this._key)
        if (message.msg == null) {
          message.msg = 'The message could not be decrypted.'
          message.mType = 'CryptError'
          message.apiResponse = false
          message.decryptionFailed = true
          message.reacts = []
        }
        message.decryptionFailed = false
      } catch (e) {
        message.msg = 'The message could not be decrypted.'
        message.mType = 'CryptError'
        message.apiResponse = false
        message.decryptionFailed = true
        message.reacts = []
      }
    }
    this.eventChannel.postMessage(message)
  }
}
export default wikiricSDK
