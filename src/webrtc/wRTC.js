const WRTC = {
  configuration: { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] },
  peerConnections: new Map(),
  streams: new Map(),
  logStyle: 'color: #FFF; background-color: #000; padding: 2px; font-weight: bold;',
  sayHi: function () {
    console.log('%cHey!', this.logStyle)
  },
  initiateOutgoingPeerConnection: function (stream, callerId, calleeId) {
    console.log('%cINIT Outgoing Call', this.logStyle)
    const peerConnection = new RTCPeerConnection(this.configuration)
    peerConnection.callerId = callerId
    peerConnection.calleeId = calleeId
    if (stream != null) {
      stream.getTracks().forEach(track => {
        console.debug('%cADD Track for', this.logStyle, calleeId)
        peerConnection.addTrack(track, stream)
      })
    }
    peerConnection.addEventListener('connectionstatechange', event => {
      if (peerConnection.connectionState === 'connected') {
        console.log('wRTC', '>>> Connection Established')
        dispatchEvent(new CustomEvent('connection_made', {
          bubbles: true,
          payload: { get: () => 'ESTABLISHED' }
        }))
      } else {
        console.log('wRTC', 'Connection Change:', peerConnection.connectionState)
      }
    })
    peerConnection.addEventListener('icecandidate', event => {
      if (event.candidate) {
        const payload = {
          callerId: peerConnection.callerId,
          calleeId: peerConnection.calleeId,
          candidate: event.candidate
        }
        dispatchEvent(new CustomEvent('new_ice', {
          bubbles: true,
          payload: { get: () => payload }
        }))
      }
    })
    // Destination as key
    this.peerConnections.set(calleeId, peerConnection)
  },
  initiateIncomingPeerConnection: function (callerId, calleeId) {
    console.debug('wRTC', 'INIT Incoming Call')
    const peerConnection = new RTCPeerConnection(this.configuration)
    peerConnection.callerId = callerId
    peerConnection.calleeId = calleeId
    // Source as key
    this.peerConnections.set(callerId, peerConnection)
  }
}
export default WRTC
