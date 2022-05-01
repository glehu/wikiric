<template>
  <div style="min-height: 100vh" class="b_darkergray">
    <div id="sidebar" class="sidebar b_darkgray"
         style="height: 100vh; z-index: 1000">
      <div style="height: 240px; overflow-x: clip; position: relative">
        <div class="header-margin" style="box-shadow: none"></div>
        <div style="width: 100%; height: 35px; padding-top: 5px">
          <span class="sb_link_text" style="color: white">Menu</span>
        </div>
        <button class="sb_toggler btn-no-outline" v-on:click="toggleSidebar">
          <i class="bi bi-list"></i>
        </button>
        <ul class="nav_list list-unstyled" style="color: white">
          <li>
            <div class="sb_link orange-hover" v-on:click="this.$router.push('/apps/clarifier')">
              <i class="sb_link_icon bi bi-arrow-return-left"></i>
              <span class="sb_link_text">Exit</span>
            </div>
          </li>
          <li>
            <div class="sb_link orange-hover">
              <i class="sb_link_icon bi bi-tools"></i>
              <span class="sb_link_text">Settings</span>
            </div>
          </li>
          <li>
            <div class="sb_link orange-hover">
              <i class="sb_link_icon bi bi-archive"></i>
              <span class="sb_link_text">Files</span>
            </div>
          </li>
        </ul>
      </div>
      <!-- #### CHANNELS #### -->
      <div id="channel_section" class="channel_section b_darkergray"
           style="height: calc(100% - 60px - 180px); width: 100%; z-index: 4;
           color: white; overflow-y: auto; overflow-x: clip;
           padding-top: 10px; padding-bottom: 20px">
        <div v-for="session in this.$store.state.clarifierSessions" :key="session"
             style="padding-left: 8px">
          <div style="font-weight: bold; font-size: 125%">
            <a class="fw-bold text-white orange-hover" style="text-decoration: none"
               :href="'/apps/clarifier/wss/' + JSON.parse(session).id">
                <span class="orange-hover" style="position: relative">
                  <i v-if="JSON.parse(session).id === clarifierUniChatroom.guid"
                     class="bi bi-three-dots-vertical" style="position: absolute; left: -13px; top: -8px"></i>
                  <i class="bi bi-circle-fill"
                     style="font-size: 175%">
                  </i>
                  <span class="sb_link_text text-nowrap"
                        style="padding-left: 5px; position: absolute; bottom: 5px">
                    &nbsp;{{ JSON.parse(session).title }}
                  </span>
                </span>
            </a>
          </div>
        </div>
      </div>
    </div>
    <div class="clarifier_chatroom" style="display: flex; height: 100%; overflow-y: clip; overflow-x: clip"
         v-on:click="closeModals">
      <div id="chat_section" class="chat_section b_darkblue" style="width: 100%; height: 100%">
        <div class="header-margin" style="box-shadow: none"></div>
        <!-- #### CHAT HEADER #### -->
        <div style="width: 100%; height: 35px; background-color: #143b92; box-shadow: 0 0 5px 5px black;
          font-weight: bold; font-size: 125%; color: white; padding-left: 10px"
             class="justify-content-center align-items-center">
          <span>{{ clarifierUniChatroom.t }}</span>
          <button class="btn-no-outline member_section_toggler"
                  title="Show Members"
                  v-on:click="toggleMemberSidebar">
            <i class="bi bi-people-fill"></i>
          </button>
        </div>
        <!-- #### MESSAGES #### -->
        <div id="messages_section"
             class="messages_section"
             style="overflow-y: auto; overflow-x: clip; z-index: 2;
             height: calc(100vh - 70px - 7ch);
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
                <img :src="JSON.parse(msg).msg.substring(7)" :alt="JSON.parse(msg).msg.substring(7)">
                <br>
                <div>
                  <img src="../../assets/giphy/PoweredBy_200px-Black_HorizText.png" alt="Powered By GIPHY"
                       style="width: 100px"/>
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
                      class="new_comment"
                      type="text"
                      style="position: absolute; bottom: 0; left: 10px;
                      width: calc(100% - 75px);
                      padding-top: 0.30em; padding-bottom: 0.4em; padding-left: 1ch;
                      color: white; background-color: #143b92; border-color: transparent;
                      border-radius: 1em;
                      resize: none; overflow: hidden;
                      height: 2.5em; min-height: 2.5em;"
                      v-model="new_message"
                      :placeholder="'Message to ' + clarifierUniChatroom.t"
                      v-on:input="auto_grow('new_comment')"
                      v-on:click="hideAllSidebars">
            </textarea>
            <button class="btn-outline-light"
                    style="position: absolute; bottom: 0; right: 15px; width: 5ch; height: 2.5em; margin-left: 1ch;
                    background-color: #143b92; border-color: transparent; border-radius: 1em"
                    title="Search on GIPHY"
                    v-on:click="toggleSelectingGIF">
              <span class="fw-bold">GIF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- #### MEMBERS #### -->
    <div id="member_section" class="member_section b_darkergray"
         style="color: white; z-index: 4; position: absolute; right: 0;
           height: 100vh; overflow-y: auto; overflow-x: clip">
      <div class="header-margin" style="box-shadow: none"></div>
      <div style="width: 100%; height: 35px; padding-top: 5px">
        <span style="color: white; padding-left: 20px"> Members&nbsp;-&nbsp;{{ this.members.length }}</span>
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
        <div class="mt-2 ms-1" style="padding: 1ch">
          <button class="text-white btn-no-outline"
                  title="Invite"
                  v-on:click="invite()">
            <i class="bi bi-envelope-plus lead"></i>
          </button>
          <span class="tooltip-mock-destination" :class="{'show':showInviteCopied}">Copied!</span>
        </div>
      </div>
    </div>
  </div>
  <!-- #### GIF SELECTION #### -->
  <div class="giphygrid b_purple" style="overflow: hidden" v-show="isSelectingGIF" @click.stop>
    <div style="width: 100%; margin-top: 66vh; position: absolute">
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
        <img :src="gif.images.fixed_height.url" alt=":(" class="selectableGIF"
             style="width: 155px; height: 155px">
      </div>
    </div>
  </div>
  <!-- #### USER PROFILE #### -->
  <div class="user_profile b_darkgray" style="overflow: hidden"
       v-show="isViewingUserProfile" @click.stop>
    <div style="position: relative; padding-top: 10px">
      <i class="bi bi-x-lg lead" style="cursor: pointer; position:absolute; right: 0" title="Close"
         v-on:click="hideUserProfile"></i>
      <div style="display: flex">
        <i class="bi bi-person-circle"></i>
        <h2 class="fw-bold"> {{ this.viewedUserProfile.usr.split('@')[0] }}</h2>
      </div>
      <!-- #### MEMBER ROLES #### -->
      <hr class="c_gray">
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
      <hr class="c_gray">
    </div>
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
</template>

<script>
export default {
  data () {
    return {
      clarifierUniChatroom: {},
      connection: null,
      messages: [],
      members: [],
      new_message: '',
      gif_query_string: '',
      new_role: '',
      gifSelection: [],
      showInviteCopied: false,
      // Conditions
      isSelectingGIF: false,
      isViewingUserProfile: false,
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
    this.connection = new WebSocket('wss://wikiric.xyz/clarifier/' + this.getSession())
    this.connection.onopen = () => {
      this.connection.send(this.$store.state.token)
      // Subscribe to notifications
      this.subscribeFCM(this.getSession())
    }
    this.connection.onmessage = (event) => {
      this.showMessage(event.data)
    }
  },
  mounted () {
    this.getClarifierMetaData()
    window.addEventListener('resize', this.resizeCanvas, false)
    this.resizeCanvas()
    document.getElementById('new_comment').addEventListener('keydown', this.handleEnter, false)
  },
  methods: {
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
      if ((JSON.parse(msg).msg).includes('[s:RegistrationNotification]')) {
        this.getClarifierMetaData(false)
      }
    },
    addMessage: function () {
      if (this.new_message.trim() === '') {
        this.new_message = ''
        return
      }
      // GIF Lookup?
      if (this.new_message.toLowerCase().startsWith('gif ')) {
        this.getGIF(this.new_message.substring(3))
        this.new_message = ''
        return
      }
      // Handle normal message
      this.connection.send(this.new_message)
      this.new_message = ''
    },
    addMessagePar: function (text, closeGIFSelection = false) {
      this.connection.send(text)
      if (closeGIFSelection) this.isSelectingGIF = false
    },
    getClarifierMetaData: function (updateMessages = true) {
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
        .then(() => (this.processResponse(updateMessages)))
        .catch((err) => console.error(err.message))
    },
    processResponse: function (updateMessages) {
      this.$store.commit('addClarifierSession', {
        id: this.clarifierUniChatroom.guid,
        title: this.clarifierUniChatroom.t
      })
      if (updateMessages) {
        this.messages = this.clarifierUniChatroom.messages.reverse()
      }
      this.members = this.clarifierUniChatroom.members
    },
    getSession: function () {
      return this.$route.params.id
    },
    invite: function () {
      this.showInviteCopied = true
      navigator.clipboard.writeText(this.getSession())
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
      if (this.isSelectingGIF) this.hideUserProfile()
    },
    showUserProfile: function (user) {
      this.isSelectingGIF = false
      this.isViewingUserProfile = true
      this.viewedUserProfile = user
    },
    addUserRole: function () {
      this.isAddingRole = true
      const roleInput = document.getElementById('new_role')
      setTimeout(() => roleInput.focus(), 0)
    },
    commitUserRole: function () {
      this.hideUserProfile()
      const headers = new Headers()
      headers.set('Authorization', 'Bearer ' + this.$store.state.token)
      const content = JSON.stringify({
        member: this.viewedUserProfile.usr,
        role: this.new_role
      })
      this.new_role = ''
      fetch(
        this.$store.state.serverIP + '/api/m5/addrole/' + this.getSession(),
        {
          method: 'post',
          headers: headers,
          body: content
        }
      )
        .then(() => this.getClarifierMetaData(false))
        .catch((err) => console.error(err.message))
    },
    hideUserProfile: function () {
      this.isViewingUserProfile = false
      this.isAddingRole = false
      this.new_role = ''
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
      if (this.lastKeyPressed === 'Enter') return
      const elem = document.getElementById(id)
      elem.style.height = '2.5em'
      elem.style.height = (elem.scrollHeight) + 'px'
    },
    resizeCanvas: function () {
      if (window.innerWidth >= 992) {
        this.showSidebar()
        this.showMemberSidebar()
      } else {
        this.hideSidebar()
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
    showMemberSidebar: function () {
      const memberSidebar = document.getElementById('member_section')
      if (!memberSidebar.classList.contains('active')) memberSidebar.classList.add('active')
    },
    hideMemberSidebar: function () {
      const memberSidebar = document.getElementById('member_section')
      if (memberSidebar.classList.contains('active')) memberSidebar.classList.remove('active')
    },
    hideAllSidebars: function () {
      this.hideSidebar()
      this.hideMemberSidebar()
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
  background-color: #293139;
}

.c_darkgray {
  color: #293139;
}

.b_darkergray {
  background-color: #101010;
}

.c_darkergray {
  color: #101010;
}

.b_gray {
  background-color: #b1a8b9;
}

.c_gray {
  color: #b1a8b9;
}

.b_orange {
  background-color: #ff5d37;
}

.c_orange {
  color: #ff5d37;
}

@media only screen and (min-width: 992px) {
  .giphygrid {
    transform: translateX(15vw);
  }

  .user_profile {
    transform: translateX(15vw);
  }

  .user_role {
    transform: translateX(15vw);
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
  transform: translateY(-60%);
}

.tooltip-mock-destination {
  margin-left: 1ch;
  color: #ffff;
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

.giphygrid {
  position: fixed;
  z-index: 1001;
  top: 10vh;
  left: calc(50% - 200px);
  color: white;
  width: 400px;
  height: 75vh;
  padding: 5px 20px;
  border-radius: 20px;
}

.user_profile {
  position: fixed;
  z-index: 1001;
  top: 10vh;
  left: calc(50% - 150px);
  color: white;
  width: 300px;
  height: 75vh;
  padding: 5px 20px;
  border-radius: 20px;
}

.user_role {
  position: fixed;
  z-index: 1001;
  top: calc(50% - 100px);
  left: calc(50% - 125px);
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

.member_section {
  width: 0;
  overflow-x: clip;
  transition: ease-in-out all 0.2s;
}

.sidebar.active {
  width: 250px;
}

.member_section.active {
  width: 250px;
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
}

@media only screen and (min-width: 992px) {
  .sb_toggler {
    display: none;
  }

  .member_section_toggler {
    display: none;
  }

  .clarifier_chatroom {
    width: calc(100% - 250px - 250px);
    left: 250px;
  }
}

.sb_toggler {
  position: absolute;
  width: 30px;
  right: 12px;
  top: 60px;
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
  padding-left: 20px;
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

</style>
