const Wikiricrypt = {
  decryptPayload: async function (encryptedMessageObj, userId, key) {
    let decryptedMessage
    const encryptionPrefix = '[c:MSG<ENCR]'
    if (encryptedMessageObj.msg.startsWith(encryptionPrefix)) {
      encryptedMessageObj = JSON.parse(encryptedMessageObj.msg.substring(12))
      for (let i = 0; i < encryptedMessageObj.keys.length; i++) {
        const keyPair = encryptedMessageObj.keys[i]
        if (keyPair.id === userId) {
          // Step 1: Decrypt the RSA encrypted AES key
          const decipherRSA = this.base64ToArrayBuffer(keyPair.key)
          const decryptedRSA = await this.decryptMessageRSA(decipherRSA, key)
          const aesPayload = JSON.parse(decryptedRSA)
          const decipherAES = this.base64ToArrayBuffer(encryptedMessageObj.message)
          const aesKey = await this.importSecretKey(await this.base64ToArrayBuffer(aesPayload.key))
          // Step 2: Decrypt the AES encrypted message
          decryptedMessage = await this.decryptMessageAES(
            decipherAES,
            aesKey,
            this.base64ToArrayBuffer(aesPayload.iv))
        }
      }
    } else {
      decryptedMessage = encryptedMessageObj.msg
    }
    return new Promise((resolve) => {
      resolve(decryptedMessage)
    })
  },
  base64ToArrayBuffer: function (base64) {
    const binaryString = window.atob(base64)
    const len = binaryString.length
    const bytes = new Uint8Array(len)
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }
    return bytes.buffer
  },
  decryptMessageRSA: async function (content, keyPair) {
    const privKey = await this.importRSAPrivKey(keyPair.priv)
    const decrypted = await window.crypto.subtle.decrypt(
      {
        name: 'RSA-OAEP'
      },
      privKey,
      content
    )
    return new TextDecoder().decode(decrypted)
  },
  importRSAPrivKey: function (pem) {
    // fetch the part of the PEM string between header and footer
    const pemHeader = '-----BEGIN PRIVATE KEY-----'
    const pemFooter = '-----END PRIVATE KEY-----'
    const pemContents = pem.substring(pemHeader.length, pem.length - pemFooter.length)
    // base64 decode the string to get the binary data
    const binaryDerString = window.atob(pemContents)
    // convert from a binary string to an ArrayBuffer
    const binaryDer = this.stringToArrayBuffer(binaryDerString)
    return window.crypto.subtle.importKey(
      'pkcs8',
      binaryDer,
      {
        name: 'RSA-OAEP',
        hash: 'SHA-384'
      },
      true,
      ['decrypt']
    )
  },
  decryptMessageAES: async function (content, key, iv) {
    const decrypted = await window.crypto.subtle.decrypt(
      {
        name: 'AES-CBC',
        iv: iv
      },
      key,
      content
    )
    return new TextDecoder().decode(decrypted)
  },
  stringToArrayBuffer: function (str) {
    const buf = new ArrayBuffer(str.length)
    const bufView = new Uint8Array(buf)
    for (let i = 0, strLen = str.length; i < strLen; i++) {
      bufView[i] = str.charCodeAt(i)
    }
    return buf
  },
  importSecretKey: function (rawKey) {
    return window.crypto.subtle.importKey(
      'raw',
      rawKey,
      'AES-CBC',
      true,
      ['encrypt', 'decrypt']
    )
  }
}
export default Wikiricrypt
