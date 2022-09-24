const WRTC = {
  /*
  DATA
   */
  eventChannel: new BroadcastChannel('wrtcevents'),
  iceConfig: { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] },
  peerConnections: new Map(),
  logStyle: 'color: #FFF; background-color: #000; padding: 2px; font-weight: bold;',
  /*
  FUNCTIONS
   */
  /***
   * Say hi to wRTC.js!
   */
  sayHi: function () {
    console.log('%cHey!', this.logStyle)
  },
  initiatePeerConnection: function (stream, selfId, remoteId) {
    console.log('%cConnection Init', this.logStyle, 'to', remoteId)
    // Create P2P and set IDs
    const peerConnection = new RTCPeerConnection(this.iceConfig)
    peerConnection.selfId = selfId
    peerConnection.remoteId = remoteId
    peerConnection.candidateCounter = 0
    peerConnection.streamCounter = 0
    // Add tracks if present
    if (stream != null) {
      stream.getTracks().forEach(track => {
        console.debug('%cADD Track for', this.logStyle, remoteId)
        peerConnection.addTrack(track, stream)
      })
    }
    // Listen for connection changes
    peerConnection.addEventListener('connectionstatechange', event => {
      const payload = {
        event: 'connection_change',
        selfId: peerConnection.selfId,
        remoteId: peerConnection.remoteId,
        status: peerConnection.connectionState
      }
      this.eventChannel.postMessage(payload)
    })
    // Listen for new ICE candidates
    peerConnection.addEventListener('icecandidate', event => {
      if (event.candidate) {
        if (!peerConnection.candidates) {
          peerConnection.candidates = []
        }
        peerConnection.candidateCounter += 1
        peerConnection.candidates.push({
          id: peerConnection.candidateCounter,
          candidate: event.candidate
        })
        console.log('%cNew ICE Candidate', this.logStyle, peerConnection.candidateCounter)
        const payload = {
          event: 'new_ice',
          selfId: peerConnection.selfId,
          remoteId: peerConnection.remoteId,
          candidateId: peerConnection.candidateCounter
        }
        this.eventChannel.postMessage(payload)
      }
    })
    peerConnection.addEventListener('track', async (event) => {
      if (event.streams) {
        const [remoteStream] = event.streams
        if (!peerConnection.streams) {
          peerConnection.streams = []
        }
        peerConnection.streamCounter += 1
        peerConnection.streams.push({
          id: peerConnection.streamCounter,
          stream: remoteStream
        })
        const payload = {
          event: 'incoming_track',
          selfId: peerConnection.selfId,
          remoteId: peerConnection.remoteId,
          streamId: peerConnection.streamCounter
        }
        this.eventChannel.postMessage(payload)
      }
    })

    // Save the peer connection (destination as key)
    this.peerConnections.set(remoteId, peerConnection)
  },
  createOffer: async function (remoteId) {
    if (!this.peerConnections.has(remoteId)) return null
    const peerConnection = this.peerConnections.get(remoteId)
    console.log('%cCreating Offer', this.logStyle, 'for', remoteId)
    // Create an offer and set it as the local description
    const offer = await peerConnection.createOffer()
    await peerConnection.setLocalDescription(offer)
    this.peerConnections.set(remoteId, peerConnection)
    /* Generate response payload
    We switch self and remote here since the remote will receive
    and view this offer from their perspective
     */
    const payload = {
      selfId: peerConnection.remoteId,
      remoteId: peerConnection.selfId,
      offer: offer
    }
    return new Promise((resolve) => {
      resolve(payload)
    })
  },
  acceptOffer: async function (selfId, remoteId, offer, stream) {
    console.log('%cAccepting Offer', this.logStyle, 'from', remoteId)
    let peerConnection = this.getPeerConnection(remoteId)
    if (!peerConnection) {
      this.initiatePeerConnection(stream, selfId, remoteId)
      peerConnection = this.getPeerConnection(remoteId)
    }
    await peerConnection.setRemoteDescription(new RTCSessionDescription(offer))
    const answer = await peerConnection.createAnswer()
    await peerConnection.setLocalDescription(answer)
    this.peerConnections.set(remoteId, peerConnection)
    /* Generate response payload
    We switch self and remote here since the remote will receive
    and view this answer from their perspective
     */
    const payload = {
      selfId: peerConnection.remoteId,
      remoteId: peerConnection.selfId,
      answer: answer
    }
    return new Promise((resolve) => {
      resolve(payload)
    })
  },
  acceptAnswer: async function (remoteId, answer) {
    console.log('%cAccepting Answer', this.logStyle, 'from', remoteId)
    const peerConnection = this.getPeerConnection(remoteId)
    if (!peerConnection) return null
    try {
      await peerConnection.setRemoteDescription(
        new RTCSessionDescription(answer)
      )
    } catch (e) {
      console.error(e.message)
    }
    this.peerConnections.set(remoteId, peerConnection)
    return new Promise((resolve) => {
      resolve()
    })
  },
  getPeerConnection: function (remoteId) {
    if (remoteId == null) return null
    if (!this.peerConnections.has(remoteId)) {
      return null
    } else {
      return this.peerConnections.get(remoteId)
    }
  },
  getICECandidate: function (remoteId, candidateId) {
    if (remoteId == null) return null
    if (!this.peerConnections.has(remoteId)) {
      return null
    } else {
      const peerConnection = this.peerConnections.get(remoteId)
      if (!peerConnection.candidates) return null
      for (let i = 0; i < peerConnection.candidates.length; i++) {
        if (peerConnection.candidates[i].id === candidateId) {
          // Return candidate if found
          return peerConnection.candidates[i].candidate
        }
      }
      // If not found, return null
      return null
    }
  },
  setICECandidate: async function (remoteId, candidate) {
    console.log('%cSetting ICE Candidate', this.logStyle, 'from', remoteId)
    if (remoteId == null) return null
    if (!this.peerConnections.has(remoteId)) {
      return null
    } else {
      const peerConnection = this.peerConnections.get(remoteId)
      if (!peerConnection.candidates) {
        peerConnection.candidates = []
      }
      try {
        await peerConnection.addIceCandidate(candidate)
      } catch (e) {
        console.error('Error adding received ice candidate', e)
      }
      this.peerConnections.set(remoteId, peerConnection)
    }
  },
  getStream: function (remoteId, streamId) {
    if (remoteId == null) return null
    if (!this.peerConnections.has(remoteId)) {
      return null
    } else {
      const peerConnection = this.peerConnections.get(remoteId)
      if (!peerConnection.streams) return null
      for (let i = 0; i < peerConnection.streams.length; i++) {
        if (peerConnection.streams[i].id === streamId) {
          // Return candidate if found
          return peerConnection.streams[i].stream
        }
      }
      // If not found, return null
      return null
    }
  }
}
export default WRTC
