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
  doLog: true,
  doLogVerbose: false,
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
   * @param createDataChannel
   */
  initiatePeerConnection: function (stream, selfId, remoteId, createDataChannel = true) {
    if (this.peerConnections.has(remoteId)) {
      if (this.doLog) console.log('%cRenegotiating Peer Connection', this.logStyle, 'for', remoteId)
      try {
        // Remove and stop the tracks first to make sure we're not sending stuff without a reason
        this.hangup(remoteId)
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
        if (this.doLog) console.debug('%cADD Track for', this.logStyle, remoteId, track.kind)
        peerConnection.addTrack(track, stream)
      })
    }
    // Create data channel if desired
    if (createDataChannel) {
      if (this.doLog) console.debug('%cADD DATA CHANNEL for', this.logStyle, remoteId)
      peerConnection.dataChannel = peerConnection.createDataChannel('data', { negotiated: true, id: 0 })
      const doLog = this.doLog
      const logStyle = this.logStyle
      const eventChannel = this.eventChannel
      peerConnection.dataChannel.addEventListener('open', _ => {
        if (doLog) console.debug('%c(OUT) DATA CHANNEL OPEN to', logStyle, remoteId)
        const payload = {
          event: 'datachannel_open',
          selfId: peerConnection.selfId,
          remoteId: peerConnection.remoteId
        }
        eventChannel.postMessage(payload)
        peerConnection.dataChannel.addEventListener('message', e => {
          const payload = {
            event: 'datachannel_message',
            selfId: peerConnection.selfId,
            remoteId: peerConnection.remoteId,
            message: e.data
          }
          eventChannel.postMessage(payload)
        })
      })
    }
    // Listen for connection changes
    /*
    peerConnection.addEventListener('ondatachannel', event => {
      if (this.doLog) console.debug('%c(IN) DATA CHANNEL OPEN to', this.logStyle, remoteId)
      peerConnection.dataChannel = event.channel
      peerConnection.dataChannel.addEventListener('onmessage', e => {
        const payload = {
          event: 'datachannel_message',
          selfId: peerConnection.selfId,
          remoteId: peerConnection.remoteId,
          message: e.data
        }
        this.eventChannel.postMessage(payload)
      })
    })
     */
    // Listen for connection changes
    peerConnection.addEventListener('connectionstatechange', _ => {
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
      if (peerConnection.endReached === true) return
      let iceCandidate = null
      if (event.candidate) {
        iceCandidate = event.candidate
        if (this.doLog && this.doLogVerbose) {
          console.log('%cNew ICE Candidate Gathered', this.logStyle, iceCandidate)
        }
      } else {
        if (this.doLog) console.log('%cReached End of Candidates)', this.logStyle, event.candidate)
        peerConnection.endReached = true
      }
      peerConnection.iceAvailable = true
      peerConnection.candidateCounter += 1
      peerConnection.candidates.push({
        id: peerConnection.candidateCounter,
        candidate: iceCandidate
      })
      if (peerConnection.isAccepted) {
        if (this.doLog && this.doLogVerbose) {
          console.log('%c---> Forwarding as Connection was Agreed Upon', this.logStyle)
        }
        const payload = {
          event: 'new_ice',
          selfId: peerConnection.selfId,
          remoteId: peerConnection.remoteId,
          candidateId: peerConnection.candidateCounter
        }
        this.eventChannel.postMessage(payload)
      }
    })
    // Listen for incoming tracks
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
      if (this.doLog && this.doLogVerbose) {
        console.log('%cSetting ICE Candidate from', this.logStyle, remoteId, candidate)
      }
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
  hangup: function (remoteId = null) {
    this.setVideo(false)
    this.setAudio(false)
    for (const peerCon of this.peerConnections.values()) {
      if (!remoteId || peerCon.remoteId === remoteId) {
        // Stop tracks to free up the resources
        const senderList = peerCon.getSenders()
        senderList.forEach((sender) => {
          if (sender.track) {
            sender.track.enabled = false
            sender.track.stop()
          }
        })
        // Close connection
        try {
          setTimeout(() => {
            peerCon.close()
          }, 1000)
        } catch (e) {
          // Connection could not be closed (?)
        }
      }
    }
    this.peerConnections = new Map()
    if (!remoteId) {
      if (this.doLog) console.log('%cHung up!', this.logStyle)
    } else {
      if (this.doLog) console.log('%cRemoved a peer connection', this.logStyle, remoteId)
    }
  },
  sendNegotiationMessage: function (peerConnection) {
    if (!peerConnection.isAccepted) return
    if (this.doLog) console.log('%cNegotiation needed!', this.logStyle)
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
  replaceTrack: function (stream, kind) {
    if (!stream || !kind) return
    const [videoTracks] = stream.getVideoTracks()
    for (const peerCon of this.peerConnections.values()) {
      const senderList = peerCon.getSenders()
      senderList.forEach((sender) => {
        if (sender.track && sender.track.kind === kind) {
          sender.replaceTrack(videoTracks)
            .then(() => {
              if (this.doLog) console.debug('%cReplaced track', this.logStyle, kind, peerCon.remoteId)
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
