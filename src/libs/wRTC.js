import adapter from 'webrtc-adapter'

const WRTC = {
  /*
  PARAMETERS - Set those before calling initialize()
   */
  worker: null,
  doLog: true,
  doLogVerbose: false,
  selfName: null,
  selfId: null,
  /*
  DATA
   */
  eventChannel: new BroadcastChannel('wrtcevents'),
  connector: new BroadcastChannel('connector'),
  iceConfig: {
    iceServers: [
      { urls: 'stun:stun2.l.google.com:19302' },
      { urls: 'stun:stun3.l.google.com:19302' }
    ]
  },
  peerConnections: new Map(),
  logStyle: 'color: #FFF; background-color: #000; padding: 4px; font-weight: bold;',
  /*
  FUNCTIONS
   */
  /***
   * Say hi to wRTC.js!
   */
  initialize: function () {
    console.log(`%cHey, ${this.selfName}!`, this.logStyle,
      'Running on', adapter.browserDetails.browser, adapter.browserDetails.version)
    // Initialize Connector listener - this is the signaling server!
    this.connector.onmessage = async event => {
      if (event.data.type == null) return
      // Listen for WebRTC related data
      if (event.data.type === 'fwd:wRTC') {
        const payload = JSON.parse(event.data.msg)
        if (payload.remoteId == null) return
        if (payload.description) {
          // Incoming Offer or Answer
          if (this.doLog) {
            console.log(`%cIncoming ${payload.description.type}`, this.logStyle)
          }
          await this.handleIncomingDescription(
            payload.remoteId, payload.remoteName, payload.description
          )
        } else if (payload.candidate) {
          // Incoming ICE candidate
          await this.handleIncomingIce(
            payload.remoteId, payload.candidate
          )
        }
      }
    }
  },
  /***
   * Initiates a Peer to Peer Connection
   * @param {(MediaStream|null)} stream - Outgoing media stream
   * @param {string} selfId - Own ID
   * @param {string} remoteId - Remote ID
   * @param {string} remoteName - Remote username
   * @param {boolean} [createDataChannel=true] - Specifies if a data channel needs to be created
   * @param {boolean} [polite=true] - TBD
   */
  initiatePeerConnection: function (
    stream, selfId, remoteId, remoteName, createDataChannel = true, polite = false
  ) {
    if (selfId == null || remoteId == null || remoteName == null) {
      if (this.doLog) {
        console.log('%cInvalid Configuration', this.logStyle, 'for initiatePeerConnection!')
        if (selfId == null) console.log('---> No selfId!')
        if (remoteId == null) console.log('---> No remoteId!')
        if (remoteName == null) console.log('---> No remoteName!')
        return
      }
    }
    if (this.peerConnections.has(remoteId)) {
      if (this.doLog) {
        console.log('%cRenegotiating Peer Connection', this.logStyle, 'for', remoteName, remoteId)
      }
      try {
        // Remove and stop the tracks first to make sure we're not sending stuff without a reason
        this.hangup(remoteId)
      } catch (e) {
        // Track could not be stopped
      }
    } else {
      if (this.doLog) console.log('%cInitializing Peer Connection', this.logStyle, 'to', remoteName, remoteId)
    }
    // Create and initialize P2P connection
    const peerConnection = new RTCPeerConnection(this.iceConfig)
    peerConnection.selfId = selfId
    peerConnection.remoteId = remoteId
    peerConnection.remoteName = remoteName
    peerConnection.candidates = []
    peerConnection.incomingCandidates = []
    peerConnection.candidateCounter = 0
    peerConnection.stream = null
    peerConnection.streamCounter = 0
    peerConnection.iceAvailable = false
    peerConnection.isAccepted = false
    peerConnection.isMakingOffer = false
    peerConnection.isIgnoringOffer = false
    peerConnection.polite = polite
    // Add tracks if present
    if (stream != null) {
      stream.getTracks().forEach(track => {
        if (this.doLog) {
          console.debug('%cADD TRACK', this.logStyle, 'for', remoteName, remoteId, track.kind)
        }
        peerConnection.addTrack(track, stream)
      })
    }
    // Create data channel if desired
    if (createDataChannel) {
      if (this.doLog) {
        console.debug('%cADD DATA CHANNEL', this.logStyle, 'for', remoteName, remoteId)
      }
      peerConnection.dataChannel = peerConnection.createDataChannel(
        'data',
        {
          negotiated: true,
          id: 0
        })
      const doLog = this.doLog
      const logStyle = this.logStyle
      const eventChannel = this.eventChannel
      peerConnection.dataChannel.addEventListener('open', _ => {
        if (doLog) {
          console.debug('%c(OUT) DATA CHANNEL OPEN', logStyle, 'to', remoteName, remoteId)
        }
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
    peerConnection.addEventListener('connectionstatechange', _ => {
      this.handleConnectionStateChange(peerConnection)
    })
    // Listen for new ICE candidates
    peerConnection.addEventListener('icecandidate', event => {
      this.sendIceMessage(peerConnection, event)
    })
    // Listen for incoming tracks
    peerConnection.addEventListener('track', (event) => {
      this.handleIncomingTrack(peerConnection, event)
    })
    // Renegotiation
    peerConnection.addEventListener('negotiationneeded', async () => {
      await this.sendNegotiationMessage(peerConnection)
    })
    peerConnection.oniceconnectionstatechange = () => {
      if (peerConnection.iceConnectionState === 'failed') {
        if (this.doLog) {
          console.log('%c--> Triggering ICE Restart', this.logStyle)
        }
        peerConnection.restartIce()
      }
    }
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
    if (this.doLog) {
      console.log('%cCreating Offer for', this.logStyle, remoteId)
    }
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
    if (!remoteId) {
      this.peerConnections = new Map()
      if (this.doLog) console.log('%cHung up!', this.logStyle)
    } else {
      this.peerConnections.delete(remoteId)
      if (this.doLog) console.log('%cRemoved a peer connection', this.logStyle, remoteId)
    }
  },
  sendNegotiationMessage: async function (peerConnection) {
    if (this.doLog) {
      console.log('%cNegotiation needed!', this.logStyle)
    }
    try {
      peerConnection.isMakingOffer = true
      await peerConnection.setLocalDescription()
      if (this.doLog) {
        console.log(`%c${peerConnection.localDescription.type}`, this.logStyle, 'created for', peerConnection.remoteName)
      }
      if (peerConnection.localDescription.type === 'answer') {
        peerConnection.isAccepted = true
        await this.addIncomingStoredICE(peerConnection)
      }
      this.worker.execute({
        action: 'fwd',
        username: peerConnection.remoteName,
        type: 'wRTC',
        value: JSON.stringify(
          {
            description: peerConnection.localDescription,
            remoteId: peerConnection.selfId,
            remoteName: this.selfName
          }
        )
      })
    } catch (e) {
      if (this.doLog) {
        console.log('%cRenegotiation Failed!', this.logStyle, e.message)
      }
    } finally {
      peerConnection.isMakingOffer = false
    }
  },
  sendIceMessage: function (peerConnection, iceEvent) {
    if (peerConnection.endReached === true) return
    if (iceEvent.candidate) {
      peerConnection.iceAvailable = true
      if (this.doLog && this.doLogVerbose) {
        console.log('%cNew ICE Candidate Gathered', this.logStyle, iceEvent.candidate)
      }
    } else {
      if (this.doLog) console.log('%cReached End of Candidates)', this.logStyle, iceEvent.candidate)
      peerConnection.endReached = true
      return
    }
    this.worker.execute({
      action: 'fwd',
      username: peerConnection.remoteName,
      type: 'wRTC',
      value: JSON.stringify(
        {
          candidate: iceEvent.candidate,
          remoteId: peerConnection.selfId,
          remoteName: this.selfName
        }
      )
    })
  },
  handleIncomingTrack: function (peerConnection, trackEvent) {
    if (trackEvent.streams) {
      const [remoteStream] = trackEvent.streams
      peerConnection.streamCounter += 1
      peerConnection.stream = remoteStream
      const payload = {
        event: 'incoming_track',
        selfId: peerConnection.selfId,
        remoteId: peerConnection.remoteId
      }
      this.eventChannel.postMessage(payload)
    }
  },
  handleConnectionStateChange: function (peerConnection) {
    const payload = {
      event: 'connection_change',
      selfId: peerConnection.selfId,
      remoteId: peerConnection.remoteId,
      status: peerConnection.connectionState
    }
    this.eventChannel.postMessage(payload)
  },
  async handleIncomingDescription (remoteId, remoteName, description) {
    let peerConnection = this.getPeerConnection(remoteId)
    if (peerConnection == null) {
      this.initiatePeerConnection(
        null, this.selfId, remoteId, remoteName, true, true
      )
      peerConnection = this.getPeerConnection(remoteId)
    }
    if (peerConnection) {
      peerConnection.isIgnoringOffer = !peerConnection.polite && description.type === 'offer' &&
        (peerConnection.isMakingOffer || peerConnection.signalingState !== 'stable')
    }
    if (peerConnection.isIgnoringOffer) {
      return
    }
    await peerConnection.setRemoteDescription(description)
    if (description.type === 'offer') {
      await peerConnection.setLocalDescription()
      peerConnection.isAccepted = true
      if (this.doLog) {
        console.log(`%c${peerConnection.localDescription.type}`, this.logStyle, 'created')
      }
      this.worker.execute({
        action: 'fwd',
        username: peerConnection.remoteName,
        type: 'wRTC',
        value: JSON.stringify(
          {
            description: peerConnection.localDescription,
            remoteId: peerConnection.selfId,
            remoteName: this.selfName
          }
        )
      })
    } else if (description.type === 'answer') {
      peerConnection.isAccepted = true
      await this.addIncomingStoredICE(peerConnection)
    }
  },
  async handleIncomingIce (remoteId, candidate) {
    const peerConnection = this.getPeerConnection(remoteId)
    if (!peerConnection.isAccepted) {
      if (this.doLog) {
        console.log('%c--> Storing ICE', this.logStyle, candidate)
      }
      peerConnection.incomingCandidates.push(
        candidate
      )
    } else {
      await this.addIncomingStoredICE(peerConnection, candidate)
    }
  },
  addIncomingStoredICE: async function (peerConnection, candidate = undefined) {
    if (peerConnection.incomingCandidates.length > 0) {
      try {
        for (let i = 0; i < peerConnection.incomingCandidates.length; i++) {
          if (this.doLog) {
            console.log('%c--> Setting stored ICE', this.logStyle, peerConnection.incomingCandidates[i])
          }
          await peerConnection.addIceCandidate(
            peerConnection.incomingCandidates[i]
          )
        }
        peerConnection.incomingCandidates = []
      } catch (err) {
        if (!peerConnection.isIgnoringOffer) {
          if (this.doLog) {
            console.log('%cERROR addIceCandidate', this.logStyle, err.message)
          }
        }
      }
    }
    if (candidate !== undefined) {
      try {
        if (this.doLog) {
          console.log('%c--> Setting ICE', this.logStyle, candidate)
        }
        await peerConnection.addIceCandidate(
          candidate
        )
      } catch (err) {
        if (!peerConnection.isIgnoringOffer) {
          if (this.doLog) {
            console.log('%cERROR addIceCandidate', this.logStyle, err.message)
          }
        }
      }
    }
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
              if (this.doLog) {
                console.log('%cReplaced track', this.logStyle, kind, peerCon.remoteId)
              }
              sender.track.enabled = true
            })
            .catch(async () => {
              await this.sendNegotiationMessage(peerCon)
            })
        }
      })
    }
  }
}
export default WRTC
