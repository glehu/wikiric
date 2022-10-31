const WRTC = {
  /*
  DATA
   */
  eventChannel: new BroadcastChannel('wrtcevents'),
  iceConfig: {
    iceServers: [
      { url: 'stun:stun3.l.google.com:19302' },
      { url: 'stun:stun4.l.google.com:19302' }
    ]
  },
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
  /***
   * Initiates a Peer to Peer Connection
   * @param stream
   * @param selfId
   * @param remoteId
   */
  initiatePeerConnection: function (stream, selfId, remoteId) {
    console.log('%cConnection Init', this.logStyle, 'to', remoteId)
    // Create P2P and set IDs
    const peerConnection = new RTCPeerConnection(this.iceConfig)
    peerConnection.selfId = selfId
    peerConnection.remoteId = remoteId
    peerConnection.candidates = []
    peerConnection.candidateCounter = 0
    peerConnection.streams = []
    peerConnection.streamCounter = 0
    peerConnection.iceAvailable = false
    peerConnection.isAccepted = false
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
      let iceCandidate = null
      if (event.candidate) {
        iceCandidate = event.candidate
      } else {
        console.log('%cReached End of Candidates)', this.logStyle, event.candidate)
      }
      peerConnection.iceAvailable = true
      peerConnection.candidateCounter += 1
      peerConnection.candidates.push({
        id: peerConnection.candidateCounter,
        candidate: iceCandidate
      })
      console.log('%cNew ICE Candidate Gathered', this.logStyle, iceCandidate)
      if (peerConnection.isAccepted) {
        console.log('%c---> Forwarding as Connection was Agreed Upon', this.logStyle)
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
        peerConnection.streamCounter += 1
        peerConnection.streams.push(remoteStream)
        const payload = {
          event: 'incoming_track',
          selfId: peerConnection.selfId,
          remoteId: peerConnection.remoteId
        }
        this.eventChannel.postMessage(payload)
      }
    })

    // Save the peer connection (destination as key)
    this.peerConnections.set(remoteId, peerConnection)
  },
  /***
   * Creates an Offer
   * @param remoteId
   * @returns {Promise<Object>}
   */
  createOffer: async function (remoteId) {
    if (!this.peerConnections.has(remoteId)) return null
    const peerConnection = this.peerConnections.get(remoteId)
    console.log('%cCreating Offer for', this.logStyle, remoteId)
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
  /***
   * Accepts an Offer and the corresponding Peer to Peer Connection
   * @param selfId
   * @param remoteId
   * @param offer
   * @param stream
   * @returns {Promise<Object>}
   */
  acceptOffer: async function (selfId, remoteId, offer, stream) {
    console.log('%cAccepting Offer from', this.logStyle, remoteId)
    let peerConnection = this.getPeerConnection(remoteId)
    if (!peerConnection) {
      console.log('%cPeer Connection does not exist yet... Creating it...', this.logStyle)
      this.initiatePeerConnection(stream, selfId, remoteId)
      peerConnection = this.getPeerConnection(remoteId)
    }
    await peerConnection.setRemoteDescription(new RTCSessionDescription(offer))
    const answer = await peerConnection.createAnswer()
    await peerConnection.setLocalDescription(answer)
    console.log('%cCreated Answer for', this.logStyle, remoteId)
    peerConnection.isAccepted = true
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
  /***
   * Accepts an Answer and the corresponding Peer to Peer Connection
   * @param remoteId
   * @param answer
   * @returns {Promise<Boolean>}
   */
  acceptAnswer: async function (remoteId, answer) {
    const peerConnection = this.getPeerConnection(remoteId)
    if (!peerConnection) {
      console.log('%cDiscarded Answer (Wrong Recipient)', this.logStyle)
      return false
    }
    console.log('%cAccepting Answer from', this.logStyle, remoteId)
    try {
      await peerConnection.setRemoteDescription(
        new RTCSessionDescription(answer)
      )
    } catch (e) {
      console.error(e.message)
    }
    peerConnection.isAccepted = true
    this.peerConnections.set(remoteId, peerConnection)
    return new Promise((resolve) => {
      resolve(true)
    })
  },
  /***
   * Retrieves a Peer to Peer Connection
   * @param remoteId
   * @returns {null|RTCPeerConnection}
   */
  getPeerConnection: function (remoteId) {
    if (remoteId == null) return null
    if (!this.peerConnections.has(remoteId)) {
      return null
    } else {
      return this.peerConnections.get(remoteId)
    }
  },
  /***
   * Adds an ICE Candidate to a Peer to Peer Connection
   * @param remoteId
   * @param candidate
   * @returns {Promise<null>}
   */
  setICECandidate: async function (remoteId, candidate) {
    if (typeof remoteId === 'undefined' || remoteId === null) {
      console.log('%cInvalid remoteId while adding ICE candidate', this.logStyle)
      return null
    }
    if (!this.peerConnections.has(remoteId)) {
      console.log('%cDiscarding ICE Candidate (Wrong Recipient)', this.logStyle)
      return null
    } else {
      console.log('%cSetting ICE Candidate from', this.logStyle, remoteId, candidate)
      const peerConnection = this.peerConnections.get(remoteId)
      try {
        if (candidate) {
          await peerConnection.addIceCandidate(candidate)
        } else {
          console.log('%cReceived End of Candidates from remote peer', this.logStyle, remoteId)
          await peerConnection.addIceCandidate(null)
        }
      } catch (e) {
        console.error('Error adding received ice candidate', e)
      }
      this.peerConnections.set(remoteId, peerConnection)
    }
  },
  /***
   * Retrieves the remote stream (single or multiple tracks) from a Peer to Peer Connection
   * @param remoteId
   * @returns {null|MediaStream}
   */
  getStream: function (remoteId) {
    if (remoteId == null) return null
    if (!this.peerConnections.has(remoteId)) {
      return null
    } else {
      const peerConnection = this.peerConnections.get(remoteId)
      if (!peerConnection.streams) return null
      console.log('%cRetrieving ' + peerConnection.streams.length + ' remote streams', this.logStyle)
      return peerConnection.streams
    }
  }
}
export default WRTC
