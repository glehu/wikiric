<template>
  <div style="min-height: 100vh" class="b_darkergray">
    <div id="sidebar" class="sidebar"
         style="height: 100vh; z-index: 1000">
      <div class="header-margin" style="box-shadow: none"></div>
      <div style="height: calc(100vh - 60px)" class="b_darkgray sidebar_bg">
        <!-- #### Tools #### -->
        <div style="height: 180px; overflow-x: clip; position: relative">
          <div style="width: 100%; height: 35px; padding-top: 5px">
            <span class="sb_link_text c_lightgray">Menu</span>
          </div>
          <button class="sb_toggler btn-no-outline" v-on:click="toggleSidebar">
            <i class="bi bi-list c_lightgray"></i>
          </button>
          <ul class="nav_list list-unstyled" style="color: white">
            <li>
              <div class="sb_link" v-on:click="this.$router.push('/apps/clarifier')">
                <div class="c_lightgray orange-hover">
                  <i class="sb_link_icon bi bi-arrow-return-left"></i>
                  <span class="sb_link_text">Exit</span>
                </div>
                <span class="sidebar_tooltip">Exit</span>
              </div>
            </li>
            <li v-on:click="isViewingSessionSettings = true">
              <div class="sb_link">
                <div class="c_lightgray orange-hover">
                  <i class="sb_link_icon bi bi-tools"></i>
                  <span class="sb_link_text">Settings</span>
                </div>
                <span class="sidebar_tooltip">Settings</span>
              </div>
            </li>
            <li>
              <div class="sb_link">
                <div class="c_lightgray orange-hover">
                  <i class="sb_link_icon bi bi-archive"></i>
                  <span class="sb_link_text">Files</span>
                </div>
                <span class="sidebar_tooltip">Files</span>
              </div>
            </li>
          </ul>
        </div>
        <hr class="c_lightgray" style="margin: auto; width: 75%">
        <!-- #### CHANNELS #### -->
        <div id="channel_section" class="channel_section b_darkgray"
             style="height: calc(100% - 60px - 100px); width: 100%; z-index: 4;
                    color: white; overflow-y: auto; overflow-x: clip; padding-top: 10px; padding-bottom: 20px">
          <div style="width: 100%; height: 35px; padding-top: 5px">
            <span class="sb_link_text c_lightgray">
              Channels&nbsp;-&nbsp;{{ this.$store.state.clarifierSessions.length }}
            </span>
          </div>
          <div v-for="session in this.$store.state.clarifierSessions" :key="session"
               class="channel_link"
               style="position: relative; padding-left: 8px; font-weight: bold; font-size: 125%">
            <a class="fw-bold text-white orange-hover" style="text-decoration: none"
               :href="'/apps/clarifier/wss/' + JSON.parse(session).id">
              <div class="c_lightgray orange-hover">
                <i v-if="JSON.parse(session).id === clarifierUniChatroom.guid"
                   class="bi bi-dot"
                   style="position: absolute; left: -18px; top: -5px; font-size: 200%; color: forestgreen">
                </i>
                <i class="bi bi-circle-fill"
                   style="font-size: 180%; color: transparent"></i>
                <img class="b_darkergray"
                     style="width: 40px; height: 40px; position: absolute; left: 6px; top: 8px;
                   border-radius: 10px"
                     v-bind:src="getImg(JSON.parse(session).img)"
                     :alt="'&nbsp;' + JSON.parse(session).title.substring(0,1)"/>
                <span class="sb_link_text text-nowrap"
                      style="padding-left: 10px; position: absolute; bottom: 10px">
                &nbsp;{{ JSON.parse(session).title }}
              </span>
              </div>
            </a>
            <span class="channel_tooltip">{{ JSON.parse(session).title }}</span>
          </div>
        </div>
      </div>
    </div>
    <div id="sidebar2" class="sidebar2">
      <div class="header-margin" style="box-shadow: none"></div>
      <div style="height: calc(100vh - 60px); position: relative; padding-left: 23px"
           class="b_darkergray">
        <!-- #### CHANNELS #### -->
        <div style="width: 100%; height: 35px; padding-top: 5px">
          <span class="fw-bold c_lightgray">Rooms</span>
        </div>
        <div style="height: calc(100% - 35px); overflow-y: scroll; overflow-x: clip"
             class="c_lightgray">
          <div style="display: flex; align-items: center; padding-left: 20px; width: 90%; border-radius: 10px"
               class="b_darkgray">
            <span style="font-size: 150%">#</span>
            <span style="padding-left: 20px">General</span>
          </div>
          <div style="padding: 10px">
            <button class="text-white btn-no-outline"
                    title="Invite"
                    v-on:click="createSubchatroom">
              <i class="bi bi-plus lead orange-hover c_lightgray" style="font-size: 150%"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="clarifier_chatroom" style="display: flex; height: 100%; overflow-y: clip; overflow-x: clip"
         v-on:click="closeModals">
      <div id="chat_section" class="chat_section b_darkergray" style="width: 100%; height: 100%">
        <div class="header-margin" style="box-shadow: none"></div>
        <!-- #### CHAT HEADER #### -->
        <div class="align-items-center b_darkergray chat_header">
          <span style="margin-left: 10px">{{ clarifierUniChatroom.t }}</span>
          <button class="btn-no-outline member_section_toggler"
                  title="Show Members"
                  v-on:click="toggleMemberSidebar">
            <i class="bi bi-people-fill"></i>
          </button>
        </div>
        <!-- #### MESSAGES #### -->
        <div id="messages_section"
             class="messages_section"
             style="overflow-y: auto; overflow-x: clip;
             height: calc(100vh - 60px - 50px - 34px);
             padding-top: 10px; padding-bottom: 20px;
             display: flex; flex-direction: column-reverse">
          <div v-for="msg in messages" :key="msg"
               style="color: white; padding-left: 15px; padding-right: 25px; padding-bottom: 15px">
            <!-- Chat Avatar and Date-->
            <div style="position: relative;">
              <i v-if="JSON.parse(msg).src.startsWith('_server')" class="sender_avatar bi bi-broadcast"></i>
              <i v-else class="sender_avatar bi bi-person-circle"></i>
              <span class="orange-hover" style="font-weight: bold">{{ JSON.parse(msg).src.split('@')[0] }}</span>
              <span style="color: gray; font-size: 80%; padding-left: 10px">
                  {{ new Date(JSON.parse(msg).ts).toLocaleString('de-DE').replace(' ', '&nbsp;') }}
                </span>
            </div>
            <!-- #### LOGIN NOTIFICATION MESSAGE #### -->
            <template v-if="JSON.parse(msg).msg.startsWith('[s:RegistrationNotification]')">
              <div class="serverMessage"
                   style="text-wrap: normal; word-wrap: break-word; padding-left: 42px">
                {{ JSON.parse(msg).msg.substring(28) }}
              </div>
            </template>
            <!-- #### CLIENT GIF MESSAGE #### -->
            <div v-else-if="JSON.parse(msg).msg.startsWith('[c:GIF]')">
              <div style="padding-left: 42px">
                <img :src="JSON.parse(msg).msg.substring(7)" :alt="JSON.parse(msg).msg.substring(7)" loading="lazy">
                <br>
                <div>
                  <img src="../../assets/giphy/PoweredBy_200px-Black_HorizText.png" alt="Powered By GIPHY"
                       style="max-width: 100px; width: 100px"/>
                </div>
              </div>
            </div>
            <!-- #### CLIENT MESSAGE #### -->
            <div v-else style="width: 100%; position: relative">
              <span class="clientMessage"
                    style="text-wrap: normal; word-wrap: break-word; padding-left: 42px">
                {{ JSON.parse(msg).msg }}
              </span>
            </div>
          </div>
        </div>
        <!-- #### USER INPUT FIELD #### -->
        <div class="align-bottom" style="display: inline-flex; width: 100%">
          <div style="width: 100%; padding-left: 2ch; padding-right: 2ch; position: relative">
            <textarea id="new_comment"
                      class="new_comment b_gray"
                      type="text"
                      style="position: absolute; bottom: 0; left: 10px;
                      width: calc(100% - 115px);
                      padding-top: 0.30em; padding-bottom: 0.4em; padding-left: 1ch;
                      color: white; border-color: transparent; border-radius: 1em;
                      resize: none; overflow: hidden;
                      height: 2.5em; min-height: 2.5em;"
                      v-model="new_message"
                      :placeholder="'Message to ' + clarifierUniChatroom.t"
                      v-on:input="auto_grow('new_comment')"
                      v-on:click="hideAllSidebars">
            </textarea>
            <button class="btn-outline-light b_gray"
                    style="position: absolute; bottom: 0; right: 15px;
                    width: 40px; height: 2.5em; margin-left: 1ch;
                    border-color: transparent; border-radius: 1em"
                    title="Search on GIPHY"
                    v-on:click="toggleSelectingGIF">
              <span class="fw-bold">GIF</span>
            </button>
            <button class="btn-outline-light b_gray"
                    style="position: absolute; bottom: 0; right: 60px;
                    width: 40px; height: 2.5em; margin-left: 1ch;
                    border-color: transparent; border-radius: 1em"
                    title="Send"
                    v-on:click="addMessage">
              <span class="fw-bold"><i class="bi bi-send"></i></span>
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- #### MEMBERS #### -->
    <div id="member_section" class="member_section b_darkgray"
         style="color: white; z-index: 11; position: absolute; right: 0;
         height: 100vh; overflow-y: auto; overflow-x: clip">
      <div class="header-margin" style="box-shadow: none"></div>
      <div style="width: 100%; height: 35px; padding-top: 5px">
        <span class="fw-bold member_count c_lightgray" style="padding-left: 20px">
          Members&nbsp;-&nbsp;{{ this.members.length }}
        </span>
        <button class="btn-no-outline member_section_toggler"
                title="Hide Members"
                v-on:click="toggleMemberSidebar">
          <i class="bi bi-eye-slash-fill"></i>
        </button>
      </div>
      <div style="padding: 5px">
        <div v-for="usr in clarifierUniChatroom.members" :key="usr"
             style="padding-left: 10px; padding-bottom: 10px; position: relative"
             class="user_badge"
             v-on:click="showUserProfile(JSON.parse(usr))">
          <i class="bi bi-person-circle"
             style="font-size: 200%; padding-right: 10px">
          </i>
          <span style="font-weight: bold; position: absolute; padding-top: 0.7em">
            {{ JSON.parse(usr).usr.split('@')[0] }}
          </span>
        </div>
        <div style="padding-left: 10px">
          <button class="text-white btn-no-outline"
                  title="Invite"
                  v-on:click="invite()">
            <i class="bi bi-person-plus lead orange-hover c_lightgray" style="font-size: 150%"></i>
          </button>
          <span class="tooltip-mock-destination" :class="{'show':showInviteCopied}">Copied!</span>
        </div>
      </div>
    </div>
  </div>
  <!-- #### USER PROFILE #### -->
  <div class="user_profile b_gray" style="overflow: hidden"
       v-show="isViewingUserProfile" @click.stop>
    <div style="position: relative; padding-top: 10px">
      <i class="bi bi-x-lg lead" style="cursor: pointer; position:absolute; right: 0" title="Close"
         v-on:click="hideUserProfile"></i>
      <div style="display: flex">
        <i class="bi bi-person-circle" style="font-size: 300%; margin-right: 10px"></i>
        <h2 class="fw-bold" style="padding-top: 20px"> {{ this.viewedUserProfile.usr.split('@')[0] }}</h2>
      </div>
      <!-- #### MEMBER ROLES #### -->
      <hr class="c_lightgray">
      <div style="display: flex; flex-wrap: wrap">
        <div v-for="role in this.viewedUserProfile.roles" :key="role"
             class="b_purple"
             style="border-radius: 5px; padding: 0 4px 4px 4px; margin-right: 1ch; margin-bottom: 1ch">
          <i v-show="isEditingRoles" class="bi bi-x-circle-fill orange-hover" style="margin-right: 4px"></i>
          <span>{{ JSON.parse(role).name.replace(' ', '&nbsp;') }}</span>
        </div>
        <span style="border-radius: 2rem; margin-right: 1em" class="orange-hover"
              v-on:click="addUserRole" title="Add new Role">
          <i class="bi bi-plus-circle"></i>
        </span>
      </div>
      <!-- #### ROLE ADDER #### -->
      <div class="user_role b_darkergray align-items-center"
           style="overflow: hidden; border: 2px solid black; border-radius: 20px;
                  padding-top: 2ch; padding-bottom: 2ch;"
           v-show="isAddingRole" @click.stop>
        <div style="position: relative">
          <i class="bi bi-x-lg lead" style="cursor: pointer; position: absolute; right: 0" title="Close"
             v-on:click="isAddingRole = false"></i>
          <h4 class="fw-bold">Add a new Role</h4>
          <input id="new_role"
                 type="text"
                 class="fw-bold b_darkergray"
                 style="height: 4ch; padding-left: 1ch; color: white; width: calc(100% - 1ch);
             border: 1px solid white; border-radius: 10px"
                 v-model="new_role"
                 :placeholder="'Role'"
                 v-on:keyup.enter="commitUserRole">
        </div>
      </div>
      <hr class="c_lightgray">
    </div>
  </div>
  <!-- #### GIF SELECTION #### -->
  <div class="giphygrid b_gray" style="overflow: hidden" v-show="isSelectingGIF" @click.stop>
    <div style="width: 100%; position: absolute; bottom: 10px">
      <input id="gif_query"
             type="text"
             class="fw-bold b_darkergray"
             style="height: 4ch; padding-left: 1ch; color: white; border: none"
             v-model="gif_query_string"
             :placeholder="'Search for GIFs on GIPHY'"
             v-on:keyup.enter="getGIFSelection(gif_query_string)">
      <img src="../../assets/giphy/PoweredBy_200px-Black_HorizText.png" alt="Powered By GIPHY"
           style="width: 125px; padding-left: 10px"/>
    </div>
    <div style="height: 85%; width: 100%; overflow-x: clip; overflow-y: scroll; margin-top: 2ch" class="b_darkergray">
      <div v-for="gif in gifSelection" :key="gif"
           style="padding-top: 10px; padding-left: 10px; display: inline-flex"
           v-on:click="this.addMessagePar('[c:GIF]' + gif.images.fixed_height.url, true)">
        <img :src="gif.images.fixed_height.url" alt="Loading" class="selectableGIF"
             style="width: 155px; height: 155px">
      </div>
    </div>
  </div>
  <!-- #### Settings #### -->
  <div class="session_settings b_gray shadow" style="overflow: hidden"
       v-show="isViewingSessionSettings" @click.stop>
    <div style="position: relative; padding-top: 10px; width: 100%">
      <i class="bi bi-x-lg lead" style="cursor: pointer; position:absolute; right: 0" title="Close"
         v-on:click="hideSessionSettings"></i>
      <h2 class="fw-bold">Session Settings</h2>
      <div style="display: flex; width: 100%; margin-bottom: 10px">
        <img class="b_darkergray" style="min-width: 80px; width: 80px; min-height: 80px; height: 80px;
             border-radius: 20px"
             v-bind:src="clarifierUniChatroom.img" :alt="'&nbsp;'"/>
        <div class="drop_zone" id="drop_zone">Upload a picture!</div>
      </div>
      <input type="file" class="file_input" id="files" name="files[]"
             style="width: 100%"
             multiple v-on:change="handleFileSelect"/>
      <div id="confirm_settings_loading" class="ms-3 mt-3" style="display: none">
        <span class="spinner-grow spinner-grow-sm text-info" role="status" aria-hidden="true"></span>
        <span class="jetb ms-2">Uploading...</span>
      </div>
      <hr class="c_lightgray">
    </div>
  </div>
</template>

<script>
import { Base64 } from 'js-base64'

export default {
  data () {
    return {
      clarifierUniChatroom: {},
      connection: null,
      messages: [],
      currentPage: 0,
      pageSize: 20,
      extraSkipCount: 0,
      lazyLoadingStatus: 'idle',
      members: [],
      new_message: '',
      gif_query_string: '',
      new_role: '',
      gifSelection: [],
      showInviteCopied: false,
      // Conditions
      isSelectingGIF: false,
      isViewingUserProfile: false,
      isViewingSessionSettings: false,
      isAddingRole: false,
      isEditingRoles: false,
      //
      lastKeyPressed: '',
      viewedUserProfile: {
        id: -1,
        usr: '',
        roles: []
      }
    }
  },
  created () {
    this.serverLogin()
    this.connection = new WebSocket('wss://wikiric.xyz/clarifier/' + this.getSession())
    this.connection.onopen = () => {
      this.connection.send(this.$store.state.token)
      // Subscribe to notifications
      this.subscribeFCM(this.getSession())
    }
  },
  mounted () {
    this.connection.onmessage = (event) => {
      this.showMessage(event.data)
    }
    this.getClarifierMetaData()
    this.getClarifierMessages()
    window.addEventListener('resize', this.resizeCanvas, false)
    document.getElementById('messages_section').addEventListener('scroll', this.checkScroll, false)
    this.resizeCanvas()
    setTimeout(() => this.initFunction(), 0)
  },
  methods: {
    initFunction: function () {
      const newCommentInput = document.getElementById('new_comment')
      newCommentInput.addEventListener('keydown', this.handleEnter, false)
      newCommentInput.focus()
      const dropZone = document.getElementById('drop_zone')
      dropZone.addEventListener('dragover', this.handleDragOver, false)
      dropZone.addEventListener('drop', this.handleFileSelectDrop, false)
    },
    serverLogin: function () {
      if (this.$store.state.username === undefined || this.$store.state.username === '') return
      const headers = new Headers()
      headers.set(
        'Authorization',
        'Basic ' + Base64.encode(this.$store.state.username + ':' + this.$store.state.password)
      )
      fetch(
        this.$store.state.serverIP + '/login',
        {
          method: 'get',
          headers: headers
        }
      )
        .then((res) => res.json())
        .then((data) => (this.loginResponse = JSON.parse(data.contentJson)))
        .then(this.processLogin)
        .catch((err) => this.$notify(
          {
            title: 'Unable to Login',
            text: err.message,
            type: 'error'
          }))
    },
    processLogin: function () {
      if (this.loginResponse.httpCode === 200) {
        this.$store.commit('setServerToken', this.loginResponse.token)
      }
    },
    subscribeFCM: function (uniChatroomGUID) {
      const headers = new Headers()
      headers.set('Authorization', 'Bearer ' + this.$store.state.token)
      const content = JSON.stringify({
        fcmToken: this.$store.state.fcmToken
      })
      fetch(
        this.$store.state.serverIP + '/api/m5/subscribe/' + uniChatroomGUID,
        {
          method: 'post',
          headers: headers,
          body: content
        }
      )
        .catch((err) => console.error(err.message))
    },
    showMessage: function (msg) {
      this.messages.unshift(msg)
      this.extraSkipCount++
      if ((JSON.parse(msg).msg).includes('[s:RegistrationNotification]')) {
        this.getClarifierMetaData()
      }
    },
    addMessage: function () {
      if (this.new_message.trim() === '') {
        this.new_message = ''
        return
      }
      // GIF Lookup?
      if (this.new_message.toLowerCase().startsWith('/gif ')) {
        this.getGIF(this.new_message.substring(4))
        this.new_message = ''
        this.focusComment(true)
        setTimeout(() => this.auto_grow('new_comment'), 0)
        return
      }
      // Handle normal message
      this.connection.send(this.new_message)
      this.new_message = ''
      this.focusComment(true)
      setTimeout(() => this.auto_grow('new_comment'), 0)
    },
    focusComment: function (instantly = false) {
      const input = document.getElementById('new_comment')
      if (instantly) {
        input.focus()
      } else {
        setTimeout(() => input.focus(), 0)
      }
    },
    addMessagePar: function (text, closeGIFSelection = false) {
      this.connection.send(text)
      if (closeGIFSelection) this.isSelectingGIF = false
    },
    getClarifierMetaData: function () {
      this.clarifierUniChatroom = {}
      const headers = new Headers()
      headers.set('Authorization', 'Bearer ' + this.$store.state.token)
      fetch(
        this.$store.state.serverIP + '/api/m5/getchatroom/' + this.getSession(),
        {
          method: 'get',
          headers: headers
        }
      )
        .then((res) => res.json())
        .then((data) => (this.clarifierUniChatroom = data))
        .then(() => (this.processMetaDataResponse()))
        .catch((err) => console.error(err.message))
    },
    processMetaDataResponse: function () {
      this.$store.commit('addClarifierSession', {
        id: this.clarifierUniChatroom.guid,
        title: this.clarifierUniChatroom.t,
        img: this.getImg(this.clarifierUniChatroom.img)
      })
      this.members = this.clarifierUniChatroom.members
      document.title = this.clarifierUniChatroom.t
    },
    getClarifierMessages: function (lazyLoad = false) {
      let pageIndex = this.currentPage
      if (lazyLoad === true) {
        this.lazyLoadingStatus = 'request'
        pageIndex++
      }
      this.clarifierUniChatroom.messages = []
      const headers = new Headers()
      headers.set('Authorization', 'Bearer ' + this.$store.state.token)
      const parameters =
        '?pageIndex=' + pageIndex +
        '&pageSize=' + this.pageSize +
        '&skip=' + this.extraSkipCount
      fetch(
        this.$store.state.serverIP + '/api/m5/getmessages/' + this.getSession() + parameters,
        {
          method: 'get',
          headers: headers
        }
      )
        .then((res) => res.json())
        .then((data) => (this.processMessagesResponse(data, lazyLoad)))
        .catch((err) => console.error(err.message))
    },
    processMessagesResponse: function (data, lazyLoad = false) {
      if (data.messages === undefined) {
        if (lazyLoad) this.lazyLoadingStatus = 'idle'
        return
      }
      if (data.messages.length === 0) {
        if (lazyLoad) this.lazyLoadingStatus = 'done'
        return
      }
      let pageIndex = this.currentPage
      if (lazyLoad) pageIndex++
      if (pageIndex === 0) {
        this.messages = data.messages
      } else {
        data.messages.forEach(element => this.messages.push(element))
      }
      if (lazyLoad) {
        this.currentPage++
        this.lazyLoadingStatus = 'idle'
      }
    },
    getSession: function (full = false) {
      let session
      if (full === false) {
        session = this.$route.params.id
      } else {
        session = window.location.href
      }
      return session
    },
    invite: function () {
      this.showInviteCopied = true
      navigator.clipboard.writeText(this.getSession(true))
      setTimeout(() => {
        this.showInviteCopied = false
      }, 1000)
    },
    getGIF: function (text) {
      fetch(
        'https://api.giphy.com/v1/gifs/translate?api_key=EHAGwfjtKbbjdR92RAiVNgZyIlQSpUHU&s=' + text,
        {
          method: 'get'
        }
      )
        .then((res) => res.json())
        .then((data) => (this.addMessagePar('[c:GIF]' + data.data.images.fixed_height.url)))
        .catch((err) => console.error(err.message))
    },
    getGIFSelection: function (text) {
      fetch(
        'https://api.giphy.com/v1/gifs/search?api_key=EHAGwfjtKbbjdR92RAiVNgZyIlQSpUHU&q=' + text,
        {
          method: 'get'
        }
      )
        .then((res) => res.json())
        .then((data) => (this.gifSelection = data.data))
        .catch((err) => console.error(err.message))
    },
    toggleSelectingGIF: function () {
      this.isSelectingGIF = !this.isSelectingGIF
      if (this.isSelectingGIF) {
        const gifInput = document.getElementById('gif_query')
        setTimeout(() => gifInput.focus(), 0)
      }
      if (this.isSelectingGIF) {
        this.hideUserProfile()
        this.hideSessionSettings()
      }
    },
    showUserProfile: function (user) {
      this.isSelectingGIF = false
      this.isViewingSessionSettings = false
      this.isViewingUserProfile = true
      this.viewedUserProfile = user
    },
    addUserRole: function () {
      this.isAddingRole = true
      const roleInput = document.getElementById('new_role')
      setTimeout(() => roleInput.focus(), 0)
    },
    commitUserRole: function () {
      const headers = new Headers()
      headers.set('Authorization', 'Bearer ' + this.$store.state.token)
      const content = JSON.stringify({
        member: this.viewedUserProfile.usr,
        role: this.new_role
      })
      this.hideUserProfile()
      fetch(
        this.$store.state.serverIP + '/api/m5/addrole/' + this.getSession(),
        {
          method: 'post',
          headers: headers,
          body: content
        }
      )
        .then(() => this.getClarifierMetaData())
        .catch((err) => console.error(err.message))
    },
    hideUserProfile: function () {
      this.isViewingUserProfile = false
      this.isAddingRole = false
      this.new_role = ''
    },
    hideSessionSettings: function () {
      this.isViewingSessionSettings = false
    },
    toggleSidebar: function () {
      document.getElementById('sidebar').classList.toggle('active')
      const memberSidebar = document.getElementById('member_section')
      if (memberSidebar.classList.contains('active')) memberSidebar.classList.remove('active')
    },
    toggleMemberSidebar: function () {
      document.getElementById('member_section').classList.toggle('active')
      const sidebar = document.getElementById('sidebar')
      if (sidebar.classList.contains('active')) sidebar.classList.remove('active')
    },
    auto_grow: function (id) {
      // if (this.lastKeyPressed === 'Enter') return
      const elem = document.getElementById(id)
      elem.style.height = '2.5em'
      elem.style.height = (elem.scrollHeight) + 'px'
    },
    resizeCanvas: function () {
      if (window.innerWidth >= 992) {
        this.showSidebar()
        this.showSidebar2()
        this.showMemberSidebar()
      } else {
        this.hideSidebar()
        this.hideSidebar2()
        this.hideMemberSidebar()
      }
    },
    showSidebar: function () {
      const sidebar = document.getElementById('sidebar')
      if (!sidebar.classList.contains('active')) sidebar.classList.add('active')
    },
    hideSidebar: function () {
      const sidebar = document.getElementById('sidebar')
      if (sidebar.classList.contains('active')) sidebar.classList.remove('active')
    },
    showSidebar2: function () {
      const sidebar = document.getElementById('sidebar2')
      if (!sidebar.classList.contains('active')) sidebar.classList.add('active')
    },
    hideSidebar2: function () {
      const sidebar = document.getElementById('sidebar2')
      if (sidebar.classList.contains('active')) sidebar.classList.remove('active')
    },
    showMemberSidebar: function () {
      const memberSidebar = document.getElementById('member_section')
      if (!memberSidebar.classList.contains('active')) memberSidebar.classList.add('active')
    },
    hideMemberSidebar: function () {
      const memberSidebar = document.getElementById('member_section')
      if (memberSidebar.classList.contains('active')) memberSidebar.classList.remove('active')
    },
    hideAllSidebars: function () {
      if (window.innerWidth < 992) {
        this.hideSidebar()
        this.hideMemberSidebar()
      }
      this.isSelectingGIF = false
    },
    handleEnter: function () {
      if (event.code === 'Enter') {
        event.preventDefault()
        this.addMessage()
      }
    },
    closeModals: function () {
      this.hideUserProfile()
    },
    handleFileSelectDrop: function (evt) {
      this.handleFileSelect(evt, true)
    },
    handleFileSelect: function (evt, drop = false) {
      evt.stopPropagation()
      evt.preventDefault()

      this.toggleElement('confirm_settings_loading', 'flex')

      let files
      if (drop) {
        files = evt.dataTransfer.files
      } else {
        files = evt.target.files
      }
      this.setSessionImage(files[0])
    },
    handleDragOver: function (evt) {
      evt.stopPropagation()
      evt.preventDefault()
      evt.dataTransfer.dropEffect = 'copy'
    },
    getImg: function (string) {
      const img = string
      if (img === '') {
        return ''
      } else {
        return img
      }
    },
    getBase64: function (file) {
      return new Promise(function (resolve, reject) {
        const reader = new FileReader()
        reader.onload = function () {
          resolve(reader.result)
        }
        reader.onerror = reject
        reader.readAsDataURL(file)
      })
    },
    setSessionImage: function (image) {
      const headers = new Headers()
      headers.set('Authorization', 'Bearer ' + this.$store.state.token)
      const url = this.$store.state.serverIP + '/api/m5/setimage/' + this.getSession()
      let base64String = ''
      const promise = this.getBase64(image)
      const updateFun = this.getClarifierMetaData
      const disableLoadingFun = this.toggleSettingsLoading
      promise
        .then(function (result) {
          base64String = result
          const content = JSON.stringify({
            imageBase64: base64String
          })
          fetch(
            url,
            {
              method: 'post',
              headers: headers,
              body: content
            }
          )
            .then(() => (updateFun()))
            .then(() => (disableLoadingFun()))
            .catch((err) => console.error(err.message))
        })
    },
    toggleElement: function (id, display = 'block') {
      const explanation = document.getElementById(id)
      if (explanation.style.display === display) {
        explanation.style.display = 'none'
      } else {
        explanation.style.display = display
      }
    },
    toggleSettingsLoading: function () {
      this.toggleElement('confirm_settings_loading', 'flex')
    },
    checkScroll: function () {
      const el = document.getElementById('messages_section')
      if ((el.scrollHeight - el.clientHeight) - (el.scrollTop * -1) < 50) {
        if (this.lazyLoadingStatus === 'idle') {
          this.lazyLoadingStatus = 'start'
          this.lazyLoadMessages()
        }
      }
    },
    lazyLoadMessages: function () {
      this.getClarifierMessages(true)
    },
    createSubchatroom: function () {
      /*
      const headers = new Headers()
      headers.set('Authorization', 'Bearer ' + this.$store.state.token)
      fetch(
        this.$store.state.serverIP + '/api/m5/createchatroom?parent=' + this.getSession(),
        {
          method: 'post',
          headers: headers,
          body: JSON.stringify({
            title: 'subtest'
          })
        }
      )
        .then((res) => res.json())
        .then((data) => (this.$router.push('/apps/clarifier/wss/' + data.guid)))
        .catch((err) => console.log(err.message))
       */
    }
  }
}
</script>

<style scoped>

.b_purple {
  background-color: #8844dd;
}

.c_purple {
  color: #8844dd;
}

.b_darkblue {
  background-color: #041830;
}

.c_darkblue {
  color: #041830;
}

.b_darkgray {
  background-color: #192129;
}

.c_darkgray {
  color: #192129;
}

.b_darkergray {
  background-color: #101010;
}

.c_darkergray {
  color: #101010;
}

.b_gray {
  background-color: #293139;
}

.c_gray {
  color: #293139;
}

.c_lightgray {
  color: #aeaeb7;
}

.b_orange {
  background-color: #ff5d37;
}

.c_orange {
  color: #ff5d37;
}

@media only screen and (min-width: 992px) {
  .user_profile,
  .giphygrid,
  .session_settings {
    transform: translateX(-250px);
  }
}

.user_badge:hover {
  transition: 0.2s ease-in-out;
  border-radius: 1em;
  background-color: #ff5d37;
  color: white;
  cursor: pointer;
}

.tooltip-mock-destination.show {
  opacity: 1;
  transition: 0.5s;
  transform: translateY(-30%);
}

.tooltip-mock-destination {
  margin-left: 1ch;
  color: #aeaeb7;
  display: inline-block;
  font-size: 16px;
  font-weight: bold;
  width: auto;
  opacity: 0;
  transform: translateY(0);
}

.btn-no-outline {
  background-color: transparent;
  border: none;
}

.btn-no-outline:hover, .btn-no-outline:focus {
  outline: none;
}

.orange-hover:hover {
  color: #ff5d37;
  cursor: pointer;
}

.selectableGIF:hover {
  cursor: grab;
}

.user_profile,
.giphygrid,
.session_settings {
  position: fixed;
  z-index: 1001;
  bottom: 52px;
  right: 16px;
  color: white;
  width: 400px;
  max-width: 95vw;
  height: 75vh;
  padding: 5px 20px;
  border-radius: 20px;
}

.user_role {
  z-index: 1001;
  color: white;
  width: 250px;
  padding: 5px 20px;
}

.serverMessage {
  color: #ff5d37
}

.header-margin {
  min-height: 60px;
  box-shadow: 0 0 5px 5px black;
  z-index: 3;
  position: relative;
}

.new_comment:focus {
  outline: none;
}

.clarifier_chatroom {
  position: absolute;
  height: 100%;
}

.channel_section::-webkit-scrollbar {
  display: none;
}

.channel_section {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.sidebar {
  position: fixed;
  width: 50px;
  overflow-x: clip;
  transition: ease-in-out all 0.2s;
}

.sidebar2 {
  width: 0;
  height: 100vh;
  position: fixed;
  z-index: 1000;
  top: 0;
  left: 50px;
  overflow-x: clip;
  transition: ease-in-out all 0.2s;
}

.sidebar_bg {
  transition: ease-in-out all 0.2s;
}

.member_section {
  width: 0;
  overflow-x: clip;
  opacity: 0;
  transition: ease-in-out all 0.2s;
}

.sidebar.active {
  width: 250px;
}

.sidebar2.active {
  width: 250px;
  border-right: 1px solid rgba(174, 174, 183, 0.25);
}

.sidebar.active ~ .sidebar2.active {
  left: 250px;
}

.sidebar.active .sidebar_bg {
  border-radius: 0 50px 0 0;
}

.member_section.active {
  width: 250px;
  opacity: 1;
}

.member_count,
.user_badge {
  opacity: 0;
  transition: ease-in-out opacity 0.3s;
}

.member_section.active .member_count,
.member_section.active .user_badge {
  opacity: 1;
}

.sidebar_tooltip {
  position: fixed;
  left: 58px;
  transform: translateY(-36px);
  opacity: 0;
  pointer-events: none;
}

.channel_tooltip {
  position: fixed;
  left: 58px;
  transform: translateY(-47px);
  opacity: 0;
  pointer-events: none;
}

@media only screen and (max-width: 991px) {
  .clarifier_chatroom {
    width: calc(100% - 50px);
    left: 50px;
  }

  .sidebar.active .clarifier_chatroom {
    width: calc(100% - 250px);
    left: 250px;
  }

  .sb_link:hover .sidebar_tooltip,
  .channel_link:hover .channel_tooltip {
    opacity: 1;
    background-color: #192129;
    padding: 5px 10px 5px 10px;
    border-radius: 20px;
    transition: ease-in-out opacity 0.2s;
  }
}

.sidebar.active .sidebar_tooltip {
  display: none;
}

.sidebar.active .channel_tooltip {
  display: none;
}

@media only screen and (min-width: 992px) {
  .sb_toggler {
    display: none;
  }

  .member_section_toggler {
    display: none;
  }

  .clarifier_chatroom {
    width: calc(100% - 750px);
    left: 500px;
  }
}

.sb_toggler {
  position: absolute;
  width: 30px;
  right: 12px;
  top: 0;
  color: white;
  font-size: 150%;
}

.member_section_toggler {
  position: absolute;
  color: white;
  right: 10px
}

.sb_link {
  height: 35px;
  max-height: 35px;
  padding: 10px;
  margin-bottom: 10px;
  font-weight: bold;
  font-size: 125%;
}

.sb_link_icon {
  width: 30px;
  max-width: 30px;
  padding-left: 5px;
}

.sb_link_text {
  position: absolute;
  font-weight: bold;
  padding-left: 23px;
  opacity: 0;
  transition: ease-in-out opacity 0.2s;
}

.sidebar.active .sb_link_text {
  opacity: 1;
}

.sender_avatar {
  font-size: 200%;
  padding-right: 10px;
  position: relative;
  top: 15px
}

.drop_zone {
  border: 2px dashed #bbb;
  -moz-border-radius: 5px;
  -webkit-border-radius: 5px;
  border-radius: 5px;
  padding: 25px;
  margin-left: 10px;
  text-align: center;
  color: #bbb;
  width: 100%;
}

.chat_header {
  width: 100%;
  height: 50px;
  box-shadow: 0 0 10px 5px black;
  font-weight: bold;
  font-size: 125%;
  color: white;
  padding-left: 10px;
  display: flex;
  padding-bottom: 4px;
  z-index: 10;
  position: relative;
  border-bottom: 1px solid rgba(174, 174, 183, 0.25)
}

</style>
