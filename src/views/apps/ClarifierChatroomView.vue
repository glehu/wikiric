<template>
  <div style="min-height: 100vh" class="darkergray">
    <div class="clarifier_chatroom" style="display: flex; height: 100%; overflow-y: clip; overflow-x: clip">
      <div id="channel_section" class="channel_section darkgray"
           style="height: 100vh; min-width: 250px; z-index: 4">
        <div class="header-margin" style="box-shadow: none"></div>
        <div
          style="color: white; overflow-y: auto; overflow-x: clip;">
          <div v-for="session in this.$store.state.clarifierSessions" :key="session">
            <div class="darkergray"
                 style="font-weight: bold; font-size: 125%; padding: 10px;">
              <a class="fw-bold text-white orange-hover" style="text-decoration: none"
                 :href="'/apps/clarifier/wss/' + JSON.parse(session).id">
                <span class="orange-hover">{{ JSON.parse(session).title }}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div id="chat_section" class="chat_section darkblue" style="width: 100%; height: 100%; z-index: 2">
        <div class="header-margin" style="box-shadow: none"></div>
        <!-- #### CHAT HEADER #### -->
        <div style="width: 100%; height: 35px; background-color: #143b92; box-shadow: 0 0 5px 5px black;"
        class="justify-content-center align-items-center">
          <div style="font-weight: bold; font-size: 125%; color: white;">
            <button class="btn-no-outline ms-1"
                    title="Go back"
                    v-on:click="this.$router.push('/apps/clarifier')">
              <i class="bi bi-arrow-left-circle orange-hover"></i>
            </button>
            {{ clarifierUniChatroom.title }}
          </div>
        </div>
        <!-- #### MESSAGES #### -->
        <div id="messages_section"
             class="messages_section"
             style="overflow-y: auto; overflow-x: clip;
             height: calc(100vh - 35px - 60px - 7ch);
             padding-top: 10px;
             display: flex; flex-direction: column-reverse">
          <div v-for="msg in messages" :key="msg"
               style="color: white; padding-left: 25px; padding-right: 25px; padding-bottom: 25px">
            <!-- #### CLIENT GIF MESSAGE #### -->
            <div v-if="JSON.parse(msg).message.startsWith('[c:GIF]')">
              <div style="padding-bottom: 0; margin-bottom: 0; display: block">
                <span class="orange-hover" style="font-weight: bold">
                  {{ JSON.parse(msg).from }}
                </span>
                <span style="color: gray; font-size: 80%; padding-left: 1ch">
                  {{ new Date(JSON.parse(msg).timestamp).toLocaleString('de-DE').replace(' ', '&nbsp;') }}
                </span>
              </div>
              <img :src="JSON.parse(msg).message.substring(7)" :alt="JSON.parse(msg).message.substring(7)">
              <br>
              <div>
                <img src="../../assets/giphy/PoweredBy_200px-Black_HorizText.png" alt="Powered By GIPHY"
                     style="width: 100px"/>
              </div>
            </div>
            <!-- #### LOGIN NOTIFICATION MESSAGE #### -->
            <div v-else-if="JSON.parse(msg).message.startsWith('[s:LoginNotification]')">
              <!--<span class="serverMessage">{{ JSON.parse(msg).message.substring(21) }}</span>-->
            </div>
            <!-- #### CLIENT MESSAGE #### -->
            <div v-else style="width: 100%; text-wrap: normal; word-wrap: break-word">
              <div style="padding-bottom: 0; margin-bottom: 0; display: block">
                <span class="orange-hover" style="font-weight: bold">
                  {{ JSON.parse(msg).from }}
                </span>
                <span style="color: gray; font-size: 80%; padding-left: 1ch">
                  {{ new Date(JSON.parse(msg).timestamp).toLocaleString('de-DE').replace(' ', '&nbsp;') }}
                </span>
              </div>
              <span class="clientMessage">{{ JSON.parse(msg).message }}</span>
            </div>
          </div>
        </div>
        <!-- #### USER INPUT FIELD #### -->
        <div class="align-bottom" style="display: inline-flex; height: 7ch; width: 100%">
          <div style="width: 100%; padding-left: 2ch; padding-right: 2ch">
            <input id="new_comment"
                   class="new_comment"
                   type="text"
                   style="width: calc(100% - 10ch - 2ch); height: 5ch; padding-left: 1ch; color: white;
                   background-color: #143b92; border-color: transparent; border-radius: 1em"
                   v-model="new_message"
                   :placeholder="'Message to ' + clarifierUniChatroom.title"
                   v-on:keyup.enter="addMessage()">
            <button class="btn-outline-light" style="width: 5ch; height: 5ch; margin-left: 1ch;
                    background-color: #143b92; border-color: transparent; border-radius: 1em"
                    title="Search on GIPHY"
                    v-on:click="toggleSelectingGIF">
              <span class="fw-bold">GIF</span>
            </button>
            <button class="btn-outline-light" style="width: 5ch; height: 5ch; margin-left: 1ch;
                    background-color: #143b92; border-color: transparent; border-radius: 1em"
                    title="Send the message"
                    v-on:click="addMessage">
              <i class="bi bi-send"></i>
            </button>
          </div>
        </div>
      </div>
      <!-- #### MEMBERS #### -->
      <div id="member_section" class="member_section darkgray"
           style="color: white; z-index: 4;
           height: 100vh; overflow-y: auto; overflow-x: clip;
           min-width: 200px">
        <div class="header-margin" style="box-shadow: none"></div>
        <div style="padding: 10px">
          <div v-for="usr in clarifierUniChatroom.members" :key="usr"
               style="padding: 1ch"
               class="user_badge"
               v-on:click="showUserProfile(JSON.parse(usr))">
            <i class="bi bi-person-badge-fill"></i> {{ JSON.parse(usr).username.split('@')[0] }}
          </div>
          <div class="mt-2" style="padding: 1ch">
            <span>
              <button class="text-white btn-no-outline"
                      title="Invite"
                      v-on:click="invite()">
                <i class="bi bi-envelope-plus lead"></i>
              </button>
              <span class="tooltip-mock-destination" :class="{'show':showInviteCopied}">Copied!</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- #### GIF SELECTION #### -->
  <div class="giphygrid purple" style="overflow: hidden" v-show="isSelectingGIF" @click.stop>
    <div style="width: 100%; margin-top: 68vh; position: absolute">
      <input id="gif_query"
             type="text"
             class="fw-bold darkergray"
             style="height: 4ch; padding-left: 1ch; color: white; border: none"
             v-model="gif_query_string"
             :placeholder="'Search for GIFs on GIPHY'"
             v-on:keyup.enter="getGIFSelection(gif_query_string)">
      <img src="../../assets/giphy/PoweredBy_200px-Black_HorizText.png" alt="Powered By GIPHY"
           style="width: 125px; padding-left: 10px"/>
    </div>
    <div style="height: 88%; width: 100%; overflow-x: clip; overflow-y: scroll; margin-top: 1ch" class="darkergray">
      <div v-for="gif in gifSelection" :key="gif"
           style="padding-top: 10px; padding-left: 10px; display: inline-flex"
           v-on:click="this.addMessagePar('[c:GIF]' + gif.images.fixed_height.url, true)">
        <img :src="gif.images.fixed_height.url" alt=":(" class="selectableGIF"
             style="width: 155px; height: 155px">
      </div>
    </div>
  </div>
  <div class="user_profile darkgray" style="overflow: hidden" v-show="isViewingUserProfile" @click.stop>
    <div style="width: 100%" class="text-end mt-2">
      <i class="bi bi-x-lg lead" style="cursor: pointer; margin-top: 2ch" title="Close"
         v-on:click="hideUserProfile"></i>
    </div>
    <h2 class="fw-bold"> {{ this.viewedUserProfile.username.split('@')[0] }}</h2>
    <div style="margin-top: 30px; display: flex; flex-wrap: wrap">
      <div v-for="role in this.viewedUserProfile.roles" :key="role"
           class="purple"
           style="border-radius: 10px; padding: 0.5ch; margin-right: 1ch; margin-bottom: 1ch;">
        {{ JSON.parse(role).name.replace(' ', '&nbsp;') }}
      </div>
      <span style="border-radius: 2rem; padding: 1ch; margin-right: 1ch" class="orange-hover"
            v-on:click="addUserRole">
      <i class="bi bi-plus-circle"></i>
    </span>
    </div>
  </div>
  <div class="user_role darkgray align-items-center"
       style="overflow: hidden; border: 2px solid black; border-radius: 20px;
       padding-top: 2ch; padding-bottom: 2ch;"
       v-show="isAddingRole" @click.stop>
    <div style="width: 100%" class="text-end mt-2">
      <i class="bi bi-x-lg lead" style="cursor: pointer; margin-top: 2ch" title="Close"
         v-on:click="isAddingRole = false"></i>
    </div>
    <h3 class="fw-bold">Add a new Role</h3>
    <input id="new_role"
           type="text"
           class="fw-bold darkergray"
           style="height: 4ch; padding-left: 1ch; color: white; border: none"
           v-model="new_role"
           :placeholder="'Role'"
           v-on:keyup.enter="commitUserRole">
  </div>
</template>

<script>
export default {
  data () {
    return {
      clarifierUniChatroom: {},
      connection: null,
      messages: [],
      new_message: '',
      gif_query_string: '',
      new_role: '',
      gifSelection: [],
      showInviteCopied: false,
      isSelectingGIF: false,
      isViewingUserProfile: false,
      isAddingRole: false,
      viewedUserProfile: {
        id: -1,
        username: '',
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
  },
  methods: {
    subscribeFCM: function (uniChatroomGUID) {
      const headers = new Headers()
      headers.set('Authorization', 'Bearer ' + this.$store.state.token)
      const content = JSON.stringify({
        fcmToken: this.$store.state.fcmToken
      })
      console.log(content)
      fetch(
        this.$store.state.serverIP + '/api/m5/subscribe/' + uniChatroomGUID,
        {
          method: 'post',
          headers: headers,
          body: content
        }
      )
        .catch((err) => console.log(err.message))
    },
    showMessage: function (msg) {
      this.messages.unshift(msg)
      if ((JSON.parse(msg).message).includes('[s:LoginNotification]')) {
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
        .catch((err) => console.log(err.message))
    },
    processResponse: function (updateMessages) {
      this.$store.commit('addClarifierSession', {
        id: this.clarifierUniChatroom.chatroomGUID,
        title: this.clarifierUniChatroom.title
      })
      if (updateMessages) {
        this.messages = this.clarifierUniChatroom.messages.reverse()
      }
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
        .catch((err) => console.log(err.message))
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
        .catch((err) => console.log(err.message))
    },
    toggleSelectingGIF: function () {
      this.isSelectingGIF = !this.isSelectingGIF
      if (this.isSelectingGIF) this.hideUserProfile()
    },
    showUserProfile: function (user) {
      this.isSelectingGIF = false
      this.isViewingUserProfile = true
      this.viewedUserProfile = user
    },
    addUserRole: function () {
      this.isAddingRole = true
    },
    commitUserRole: function () {
      this.isAddingRole = false
      const headers = new Headers()
      headers.set('Authorization', 'Bearer ' + this.$store.state.token)
      const content = JSON.stringify({
        member: this.viewedUserProfile.username,
        role: this.new_role
      })
      console.log(content)
      fetch(
        this.$store.state.serverIP + '/api/m5/addrole/' + this.getSession(),
        {
          method: 'post',
          headers: headers,
          body: content
        }
      )
        .then((res) => res.json())
        .then((data) => console.log(data))
        .catch((err) => console.log(err.message))
      this.new_role = ''
    },
    hideUserProfile: function () {
      this.isViewingUserProfile = false
      this.isAddingRole = false
    }
  }
}
</script>

<style scoped>

.purple {
  background-color: #8844dd;
}

.darkblue {
  background-color: #041830;
}

.darkgray {
  background-color: #293139;
}

.darkergray {
  background-color: #101010;
}

.gray {
  background-color: #b1a8b9;
}

.orange {
  background-color: #ff5d37;
}

@media only screen and (max-width: 991px) {
  .channel_section {
    display: none;
  }
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

@media only screen and (max-width: 1150px) {
  .member_section {
    display: none;
  }
}

.user_badge:hover {
  transition: 0.5s ease-in-out;
  border-radius: 1em;
  background-color: #ff5d37;
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
  box-sizing: border-box;
}

.user_profile {
  position: fixed;
  z-index: 1001;
  top: 10vh;
  left: calc(50% - 200px);
  color: white;
  width: 400px;
  height: 75vh;
  padding: 5px 20px;
  box-sizing: border-box;
}

.user_role {
  position: fixed;
  z-index: 1001;
  top: calc(50% - 100px);
  left: calc(50% - 150px);
  color: white;
  width: 300px;
  padding: 5px 20px;
  box-sizing: border-box;
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

* {
  scrollbar-width: thin;
  scrollbar-color: gray #101010;
}

/* Works on Chrome, Edge, and Safari */
*::-webkit-scrollbar {
  width: 12px;
}

*::-webkit-scrollbar-track {
  background: #101010;
}

*::-webkit-scrollbar-thumb {
  background-color: gray;
  border-radius: 20px;
  border: 3px solid #101010;
}

</style>
