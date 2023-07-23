import adapter from 'webrtc-adapter'

const WRTC = {
  /*
  PARAMETERS - Set those before calling initialize()
   */
  pause: false,
  worker: null,
  doLog: true,
  doLogVerbose: false,
  selfName: null,
  selfId: null,
  dummyStream: null,
  /*
  DATA
   */
  eventChannel: new BroadcastChannel('wrtcevents'),
  connector: new BroadcastChannel('connector'),
  iceConfig: {
    iceServers: [
      {
        urls: [
          'stun:wikiric.xyz:3478'
        ]
      },
      {
        urls: 'turn:wikiric.xyz:3478',
        username: 'wikiturnric',
        credential: 'turnipricwiki'
      }
    ],
    iceCandidatePoolSize: 10
  },
  peerConnections: new Map(),
  logStyle: 'color: #FFF; background-color: #000; padding: 4px; font-weight: bold;',
  /*
  FUNCTIONS
   */
  /***
   * Initialize wRTC.js
   * @param worker - WorkerRic instance
   * @param {string} selfName - Your username
   * @param {string} selfId - Your user ID
   * @param {boolean} [doLog=true] - Enables simple logging
   * @param {boolean} [doLogVerbose=false] - Enables extensive logging
   * @param {boolean} [pause=false] - If true, ignores new incoming connection attempts
   * @param {MediaStream|null} [dummyStream=null] - Dummy video stream to be used on new connections prior to real media
   */
  initialize: function (
    worker,
    selfName,
    selfId,
    doLog = true,
    doLogVerbose = false,
    pause = false,
    dummyStream = null
  ) {
    // ### Check
    if (worker == null || selfName == null || selfId == null) {
      console.log('%cERROR while initializing', this.logStyle,
        'worker, selfName and selfId are mandatory!')
    }
    // ### Initialize wRTC ###
    this.pause = pause
    this.worker = worker
    this.selfName = selfName
    this.selfId = selfId
    this.doLog = doLog
    this.doLogVerbose = doLogVerbose
    this.dummyStream = dummyStream
    // ###
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
   * @param {boolean} [polite=false] - TBD
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
      // try {
      // Remove and stop the tracks first to make sure we're not sending stuff without a reason
      // this.hangup(remoteId)
      // catch (e) {
      // Track could not be stopped
      // }
    } else {
      if (this.doLog) {
        if (!polite) console.log('%cIMPOLITELY Initializing Peer Connection >:(', this.logStyle, 'to', remoteName, remoteId)
        if (polite) console.log('%cPOLITELY Initializing Peer Connection O:)', this.logStyle, 'to', remoteName, remoteId)
      }
      this.peerConnections.set(remoteId, new RTCPeerConnection(this.iceConfig))
      // If no stream was provided, the connection attempt must have been a remote one -> Notify
      if (stream == null) {
        const payload = {
          event: 'peer_init',
          selfId: this.selfId,
          remoteId: remoteId
        }
        this.eventChannel.postMessage(payload)
        if (this.dummyStream) {
          stream = this.dummyStream
          if (this.doLog) {
            console.log('%cDummy stream used', this.logStyle, 'for', remoteName, remoteId)
          }
        }
      }
    }
    // Create and initialize P2P connection
    const peerConnection = this.peerConnections.get(remoteId)
    peerConnection.selfId = selfId
    peerConnection.remoteId = remoteId
    peerConnection.remoteName = remoteName
    peerConnection.candidates = []
    peerConnection.incomingCandidates = []
    peerConnection.candidateCounter = 0
    peerConnection.stream = null
    peerConnection.streamCounter = 0
    peerConnection.iceAvailable = false
    peerConnection.isAccepted = true // TODO: Check if needed to be true
    peerConnection.isMakingOffer = false
    peerConnection.isIgnoringOffer = false
    peerConnection.polite = polite
    peerConnection.hasStream = false
    // Add tracks if present
    if (stream != null) {
      // if (peerConnection.hasStream === false) {
      // peerConnection.hasStream = true
      let sCount = 1
      stream.getTracks().forEach(track => {
        if (this.doLog) {
          console.debug(`%cADD TRACK ${sCount}`, this.logStyle, 'for', remoteName, remoteId, track.kind)
          sCount++
        }
        peerConnection.addTrack(track, stream)
      })
      // } else {
      //   this.replaceTrack(stream, 'audio')
      //   this.replaceTrack(stream, 'video')
      // }
    }
    // Create data channel if desired
    if (createDataChannel && !peerConnection.dataChannel) {
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
        peerConnection.dataChannel.send(`HEY from ${this.selfName}!`)
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
    this.peerConnections.set(remoteId, peerConnection)
  },
  doPause: function () {
    this.pause = true
    if (this.doLog) {
      console.log('%cPaused', this.logStyle)
    }
  },
  doUnpause: function () {
    this.pause = false
    if (this.doLog) {
      console.log('%cUnpaused', this.logStyle)
    }
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
    if (remoteId == null || !this.peerConnections.has(remoteId)) {
      return null
    }
    const peerConnection = this.peerConnections.get(remoteId)
    if (!peerConnection.stream) return null
    if (this.doLog) console.log('%cRetrieving remote stream', this.logStyle, peerConnection.remoteName)
    return peerConnection.stream
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
      peerConnection.endReached = false
      await peerConnection.setLocalDescription()
      if (this.doLog) {
        console.log(`%c${peerConnection.localDescription.type}`, this.logStyle, 'created for', peerConnection.remoteName)
      }
      if (peerConnection.localDescription.type === 'answer') {
        peerConnection.isAccepted = true
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
    }
  },
  sendIceMessage: function (peerConnection, iceEvent) {
    let candidate = iceEvent.candidate
    if (candidate && candidate.candidate !== '') {
      peerConnection.iceAvailable = true
      if (this.doLog && this.doLogVerbose) {
        console.log('%cICE Candidate sent', this.logStyle, candidate)
      }
    } else {
      if (this.doLog) console.log('%cEnd of Candidates sent', this.logStyle, candidate)
      peerConnection.endReached = true
      candidate = { candidate: '' }
    }
    this.worker.execute({
      action: 'fwd',
      username: peerConnection.remoteName,
      type: 'wRTC',
      value: JSON.stringify(
        {
          candidate: candidate,
          remoteId: peerConnection.selfId,
          remoteName: this.selfName
        }
      )
    })
  },
  handleIncomingTrack: function (peerConnection, trackEvent) {
    if (trackEvent.streams) {
      trackEvent.track.onunmute = () => {
        // const [remoteStream] = trackEvent.streams
        const remoteStream = trackEvent.streams[0]
        peerConnection.streamCounter += 1
        peerConnection.stream = remoteStream
        const payload = {
          event: 'incoming_track',
          selfId: peerConnection.selfId,
          remoteId: peerConnection.remoteId
        }
        this.eventChannel.postMessage(payload)
      }
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
    if (this.doLog) {
      console.log(`%c${peerConnection.connectionState}`,
        this.logStyle, peerConnection.remoteName)
    }
    if (peerConnection.connectionState === 'failed') {
      if (this.doLog) {
        console.log('%c--> Triggering ICE Restart', this.logStyle)
      }
      peerConnection.restartIce()
    }
  },
  async handleIncomingDescription (remoteId, remoteName, description) {
    console.log('INC DSC: ' + remoteId)
    let peerConnection = this.getPeerConnection(remoteId)
    if (peerConnection == null) {
      if (this.pause) {
        if (this.doLog) {
          console.log('%cPAUSE Ignored offer', this.logStyle)
        }
        return
      }
      this.initiatePeerConnection(
        null, this.selfId, remoteId, remoteName, true, true
      )
      peerConnection = this.getPeerConnection(remoteId)
    }
    const offerCollision = description.type === 'offer' &&
      (peerConnection.isMakingOffer || peerConnection.signalingState !== 'stable')
    peerConnection.isIgnoringOffer = !peerConnection.polite && offerCollision
    if (peerConnection.isIgnoringOffer) {
      if (this.doLog) {
        console.log('%cIgnored description', this.logStyle, peerConnection.remoteName)
      }
      return
    }
    try {
      if (this.doLog) {
        console.log(`%cRemote ${description.type}`, this.logStyle, 'set from', peerConnection.remoteName)
      }
      await peerConnection.setRemoteDescription(description)
    } catch (e) {
      console.debug(e.message)
    }
    if (description.type === 'offer') {
      peerConnection.isMakingOffer = false
      await peerConnection.setLocalDescription()
      peerConnection.isAccepted = true
      if (this.doLog) {
        console.log('%cOffer accepted:', this.logStyle, peerConnection.remoteName)
      }
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
      peerConnection.isMakingOffer = false
      peerConnection.isAccepted = true
      if (this.doLog) {
        console.log('%cAnswer accepted:', this.logStyle, peerConnection.remoteName)
      }
    }
  },
  async handleIncomingIce (remoteId, candidate) {
    const peerConnection = this.getPeerConnection(remoteId)
    if (!peerConnection.isAccepted) {
      if (this.doLog && this.doLogVerbose) {
        console.log('%c--> Storing ICE', this.logStyle, candidate)
      }
      peerConnection.incomingCandidates.push(
        candidate
      )
    } else {
      if (this.doLog && this.doLogVerbose) {
        console.log('%c--> Incoming ICE', this.logStyle, candidate)
      }
      await this.addIncomingStoredICE(peerConnection, candidate)
    }
  },
  addIncomingStoredICE: async function (peerConnection, candidate = undefined) {
    // const pCon = peerConnection.incomingCandidates
    // peerConnection.incomingCandidates = []
    // if (pCon.length > 0) {
    //   try {
    //     for (let i = 0; i < pCon.length; i++) {
    //       if (this.doLog && this.doLogVerbose) {
    //         console.log('%c--> Setting stored ICE', this.logStyle, pCon[i])
    //       }
    //       await peerConnection.addIceCandidate(pCon[i])
    //     }
    //   } catch (err) {
    //     if (!peerConnection.isIgnoringOffer) {
    //       if (this.doLog) {
    //         console.log('%cERROR addIceCandidate', this.logStyle, err.message)
    //       }
    //     }
    //   }
    // }
    if (candidate !== undefined) {
      try {
        if (this.doLog && this.doLogVerbose) {
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
    const [videoTracks] = stream.getTracks()
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
              this.sendNegotiationMessage(peerCon)
            })
        }
      })
    }
  },
  addStreamTracks: function (stream) {
    if (stream) {
      for (const peerConnection of this.peerConnections.values()) {
        let sCount = 1
        stream.getTracks().forEach(track => {
          if (this.doLog) {
            console.debug(`%cADD TRACK ${sCount}`,
              this.logStyle, 'for', peerConnection.remoteName,
              peerConnection.remoteId, track.kind)
            sCount++
          }
          try {
            peerConnection.addTrack(track, stream)
          } catch (e) {
            console.debug(e.message)
          }
        })
      }
    }
  }
}
export default WRTC
