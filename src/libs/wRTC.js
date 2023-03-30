const WRTC = {
  /*
  DATA
   */
  eventChannel: new BroadcastChannel('wrtcevents'),
  iceConfig: {
    iceServers: [
      { urls: 'stun:stun3.l.google.com:19302' },
      { urls: 'stun:stun4.l.google.com:19302' }
    ]
  },
  peerConnections: new Map(),
  logStyle: 'color: #FFF; background-color: #000; padding: 2px; font-weight: bold;',
  doLog: false,
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
    if (this.peerConnections.has(remoteId)) {
      if (this.doLog) console.log('%cRenegotiating Peer Connection', this.logStyle, 'for', remoteId)
      try {
        // Remove and stop the tracks first to make sure we're not sending stuff without a reason
        this.peerConnections.get(remoteId).getTracks().forEach(function (track) {
          track.enabled = false
          track.stop()
        })
      } catch (e) {
        // Track could not be stopped
      }
    } else {
      if (this.doLog) console.log('%cInitializing Peer Connection', this.logStyle, 'to', remoteId)
    }
    // Create P2P and set IDs
    const peerConnection = new RTCPeerConnection(this.iceConfig)
    peerConnection.selfId = selfId
    peerConnection.remoteId = remoteId
    peerConnection.candidates = []
    peerConnection.candidateCounter = 0
    peerConnection.stream = null
    peerConnection.streamCounter = 0
    peerConnection.iceAvailable = false
    peerConnection.isAccepted = false
    // Add tracks if present
    if (stream != null) {
      stream.getTracks().forEach(track => {
        if (this.doLog) console.debug('%cADD Track for', this.logStyle, remoteId)
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
        if (this.doLog) console.log('%cReached End of Candidates)', this.logStyle, event.candidate)
      }
      peerConnection.iceAvailable = true
      peerConnection.candidateCounter += 1
      peerConnection.candidates.push({
        id: peerConnection.candidateCounter,
        candidate: iceCandidate
      })
      if (this.doLog) console.log('%cNew ICE Candidate Gathered', this.logStyle, iceCandidate)
      if (peerConnection.isAccepted) {
        if (this.doLog) console.log('%c---> Forwarding as Connection was Agreed Upon', this.logStyle)
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
        peerConnection.stream = remoteStream
        const payload = {
          event: 'incoming_track',
          selfId: peerConnection.selfId,
          remoteId: peerConnection.remoteId
        }
        this.eventChannel.postMessage(payload)
      }
    })
    // Renegotiation
    peerConnection.addEventListener('negotiationneeded', () => {
      this.sendNegotiationMessage(peerConnection)
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
    if (this.doLog) console.log('%cCreating Offer for', this.logStyle, remoteId)
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
    let peerConnection = this.getPeerConnection(remoteId)
    if (!peerConnection) {
      if (this.doLog) console.log('%cPeer Connection does not exist yet... Creating it...', this.logStyle)
      this.initiatePeerConnection(stream, selfId, remoteId)
      peerConnection = this.getPeerConnection(remoteId)
    }
    if (!peerConnection.isAccepted) {
      if (this.doLog) console.log('%cAccepting Offer from', this.logStyle, remoteId)
    } else {
      if (this.doLog) console.log('%cAccepting Renegotiated Offer from', this.logStyle, remoteId)
      this.initiatePeerConnection(stream, selfId, remoteId)
      peerConnection = this.getPeerConnection(remoteId)
    }
    await peerConnection.setRemoteDescription(offer)
    const answer = await peerConnection.createAnswer()
    await peerConnection.setLocalDescription(answer)
    if (this.doLog) console.log('%cCreated Answer for', this.logStyle, remoteId)
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
      if (this.doLog) console.log('%cDiscarded Answer (Wrong Recipient)', this.logStyle)
      return false
    }
    if (this.doLog) console.log('%cAccepting Answer from', this.logStyle, remoteId)
    try {
      await peerConnection.setRemoteDescription(answer)
    } catch (e) {
      if (this.doLog) console.debug(e.message)
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
      if (this.doLog) console.log('%cInvalid remoteId while adding ICE candidate', this.logStyle)
      return null
    }
    if (!this.peerConnections.has(remoteId)) {
      if (this.doLog) console.log('%cDiscarding ICE Candidate (Wrong Recipient)', this.logStyle)
      return null
    } else {
      if (this.doLog) console.log('%cSetting ICE Candidate from', this.logStyle, remoteId, candidate)
      const peerConnection = this.peerConnections.get(remoteId)
      try {
        if (candidate) {
          await peerConnection.addIceCandidate(candidate)
        } else {
          if (this.doLog) console.log('%cReceived End of Candidates from remote peer', this.logStyle, remoteId)
          await peerConnection.addIceCandidate(null)
        }
      } catch (e) {
        if (this.doLog) console.debug('Error adding received ice candidate', e)
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
      if (!peerConnection.stream) return null
      if (this.doLog) console.log('%cRetrieving remote streams', this.logStyle)
      return peerConnection.stream
    }
  },
  hangup: function () {
    this.setVideo(false)
    this.setAudio(false)
    for (const peerCon of this.peerConnections.values()) {
      // Stop tracks to free up the resources
      const senderList = peerCon.getSenders()
      senderList.forEach((sender) => {
        sender.track.enabled = false
        sender.track.stop()
      })
      // Close connection
      try {
        peerCon.close()
      } catch (e) {
        // Connection could not be closed (?)
      }
    }
    this.peerConnections = new Map()
    if (this.doLog) console.log('%cHung up!', this.logStyle)
  },
  sendNegotiationMessage: function (peerConnection) {
    if (!peerConnection.isAccepted) return
    const payload = {
      event: 'negotiationneeded',
      selfId: peerConnection.selfId,
      remoteId: peerConnection.remoteId
    }
    this.eventChannel.postMessage(payload)
  },
  setVideo: function (valueBoolean) {
    for (const peerCon of this.peerConnections.values()) {
      const senderList = peerCon.getSenders()
      senderList.forEach((sender) => {
        if (sender.track && sender.track.kind === 'video') {
          sender.track.enabled = valueBoolean
        }
      })
    }
  },
  setAudio: function (valueBoolean) {
    for (const peerCon of this.peerConnections.values()) {
      const senderList = peerCon.getSenders()
      senderList.forEach((sender) => {
        if (sender.track && sender.track.kind === 'audio') {
          sender.track.enabled = valueBoolean
        }
      })
    }
  },
  replaceVideo: function (stream) {
    const [videoTracks] = stream.getVideoTracks()
    for (const peerCon of this.peerConnections.values()) {
      const senderList = peerCon.getSenders()
      senderList.forEach((sender) => {
        if (sender.track && sender.track.kind === 'video') {
          sender.replaceTrack(videoTracks)
            .then(() => {
              sender.track.enabled = true
            })
            .catch(() => {
              this.sendNegotiationMessage(peerCon)
            })
        }
      })
    }
  }
}
export default WRTC
