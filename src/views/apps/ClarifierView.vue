<template>
  <div id="clarifier_view_elem"
       class="darkest_bg w-full h-[calc(100%-55px)] absolute top-[55px] overflow-x-hidden overflow-y-auto">
    <div class="wrapper min-h-full w-full">
      <!-- Active Sessions -->
      <div class="col-span-1 md:col-span-2 xl:h-full">
        <div class="row flex justify-center items-center xl:h-full">
          <div class="w-full xl:h-full">
            <div class="text-white p-2 rounded-lg xl:w-full xl:h-full">
              <div class="md:mt-0 xl:flex lg:justify-between w-full xl:h-full lg:gap-x-2">
                <div class="w-full xl:h-full mb-2 p-2 medium_bg rounded-lg">
                  <div class="m-2">
                    <div class="flex items-end justify-between mb-4">
                      <h1 class="font-bold text-3xl text-neutral-300 pointer-events-none">
                        Friends
                      </h1>
                      <button class="px-2 py-1 rounded-md dark_bg hover:darkest_bg"
                              v-on:click="isAddingFriend = true">
                        <span class="text-neutral-300">
                          Add Friend
                        </span>
                      </button>
                    </div>
                  </div>
                  <!-- -->
                  <div class="m-2 divide-y-2 divide-zinc-600">
                    <template v-if="friends && friends.size > 0">
                      <template v-for="friend in friends.values()" :key="friend">
                        <div class="w-full h-20 flex items-center pt-1 my-1">
                          <div v-on:click="joinActive(friend.chatroom.guid)"
                               class="w-full h-20 p-2 cursor-pointer medium_bg text-neutral-300
                                    flex items-center
                                    hover:brightness-125 hover:rounded hover:text-white">
                            <div v-show="hasUnread(friend.chatroom.guid)"
                                 class="flex items-center justify-center ml-2 mr-3">
                              <i class="bi bi-chat-quote-fill z-[500] text-orange-500 text-lg"></i>
                            </div>
                            <div class="w-full">
                              <div class="flex items-center w-full">
                                <div class="font-bold text-neutral-100">
                                  {{ getDirectChatroomName(friend.chatroom.directMessageUsername) }}
                                </div>
                                <div class="ml-auto text-sm">
                                  {{ getHumanReadableDateText(friend.ts) }}
                                </div>
                              </div>
                              <div class="text-neutral-300 h-12 max-h-12 overflow-hidden text-ellipsis break-all">
                                <template v-if="friend.loading">
                                  <div class="p-1 mt-3">
                                    <div class="w-2 h-2 rounded-full bg-neutral-400 animate-ping"></div>
                                  </div>
                                </template>
                                {{ friend.msg }}
                              </div>
                            </div>
                          </div>
                        </div>
                      </template>
                    </template>
                  </div>
                </div>
                <div class="w-full xl:h-full mb-2 p-2 medium_bg rounded-lg">
                  <div class="pointer-events-none m-2 mb-4">
                    <div class="flex items-end justify-between">
                      <h1 class="font-bold text-3xl text-neutral-300">
                        Groups
                      </h1>
                      <div class="text-end text-neutral-300">
                        <h3 class="text-2xl" v-if="hour >= 5 && hour < 10">
                          <i class="bi bi-sunrise-fill p-1"></i>
                        </h3>
                        <h3 class="text-2xl" v-else-if="hour >= 10 && hour < 17">
                          <i class="bi bi-sun-fill p-1"></i>
                        </h3>
                        <h3 class="text-2xl" v-else-if="hour >= 17 && hour < 22">
                          <i class="bi bi-sunset p-1"></i>
                        </h3>
                        <h3 class="text-2xl" v-else-if="hour >= 22 || hour < 5">
                          <i class="bi bi-moon p-1"></i>
                        </h3>
                      </div>
                    </div>
                  </div>
                  <div class="m-2 divide-y-2 divide-zinc-600">
                    <template v-if="$store.state.clarifierSessions && $store.state.clarifierSessions.length > 0">
                      <template v-for="group in $store.state.clarifierSessions" :key="group">
                        <template v-if="group.type !== 'direct'">
                          <div class="flex items-center h-20 pt-1 my-1">
                            <div
                              class="text-neutral-300 h-20 hover:text-white medium_bg
                                   hover:brightness-125 cursor-pointer hover:rounded p-2 w-full"
                              style="display: flex; align-items: center; justify-items: center"
                              v-on:click="joinActive(group.id)">
                              <template v-if="group.img && group.img !== ''">
                                <img class="w-[40px] h-[40px] z-10 rounded-lg"
                                     v-bind:src="getImg(group.img,true)" :alt="getImgAlt(group.title)"/>
                              </template>
                              <template v-else>
                                <div
                                  class="darkest_bg flex items-center justify-center w-[40px] h-[40px] z-10 rounded-lg">
                                  {{ getImgAlt(group.title) }}
                                </div>
                              </template>
                              <h5 class="sb_link_text text-nowrap"
                                  style="margin: 0 0 0 10px; font-weight: bold">
                                &nbsp;{{ group.title }}
                              </h5>
                              <i class="bi bi-shield-lock text-neutral-300"
                                 title="End-to-End Encrypted Group"
                                 style="margin-left: auto; margin-right: 4px"></i>
                            </div>
                            <button class="text-neutral-300 ml-2 h-20 flex items-center justify-center"
                                    title="Remove Group"
                                    v-on:click="removeGroup(group)">
                              <i class="bi bi-x-lg p-2 rounded-xl dark_bg bg-opacity-50
                                    hover:brightness-125"></i>
                            </button>
                          </div>
                        </template>
                      </template>
                    </template>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Join or Create a new Session -->
      <div class="mb-4">
        <div class="row flex justify-center items-center">
          <div class="w-full max-w-xl">
            <div class="text-white mr-4 p-2 rounded-lg">
              <div class="md:mt-0">
                <h1 class="font-bold mb-2 text-3xl text-neutral-300"
                    style="pointer-events: none">
                  Join or Add
                </h1>
                <p style="text-align: justify; text-justify: inter-word; width: 100%; pointer-events: none"
                   class="text-neutral-300">
                  Enter an invite ID to join an existing group or create your own by typing in a name for it.
                </p>
                <input id="input_session"
                       :ref="'input_session'"
                       v-model="input_string"
                       v-on:input="checkInput()"
                       v-on:keyup="checkInput()"
                       placeholder="Invite ID or Name..."
                       class="font-bold px-2 py-1 my-3 dark_bg text-neutral-300 rounded-lg
                              border-2 border-zinc-600 placeholder-neutral-400 w-full text-lg"
                       v-on:keyup.enter="joinOrCreate()">
                <button id="btn_join_session"
                        :ref="'btn_join_session'"
                        disabled
                        class="rounded border-2 border-zinc-600 text-neutral-200 enabled:bg-indigo-600"
                        style="max-height: 6ch; height: 6ch"
                        v-on:click="join()">
                  <span class="font-bold lead">Join</span>
                </button>
                <button id="btn_create_session"
                        :ref="'btn_create_session'"
                        disabled
                        class="rounded border-2 border-zinc-600 text-neutral-200 enabled:bg-indigo-600"
                        style="max-height: 6ch; height: 6ch"
                        v-on:click="create()">
                  <span class="font-bold lead">Create</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <modal @close="isAddingFriend = false"
         v-show="isAddingFriend">
    <template v-slot:header>
      Add Friend
    </template>
    <template v-slot:body>
      <div class="p-4">
        <input type="text" v-model="friendName"
               class="px-2 py-1 medium_bg text-neutral-200"
               placeholder="Username">
        <br>
        <button class="my-2 px-2 py-1 rounded-md dark_bg hover:darkest_bg"
                v-on:click="sendFriendRequest()">
          <span class="text-neutral-300">Send Request</span>
        </button>
      </div>
    </template>
    <template v-slot:footer>
    </template>
  </modal>
</template>

<script>
import Wikiricrypt from '@/libs/wikiricrypt'
import modal from '../../components/Modal.vue'

export default {
  name: 'WClarifier',
  components: {
    modal
  },
  data () {
    return {
      input_string: '',
      join_type: '',
      time: '',
      hour: 0,
      friends: new Map(),
      wcrypt: null,
      isAddingFriend: false,
      friendName: ''
    }
  },
  created () {
    this.wcrypt = Wikiricrypt
    this.getFriends()
  },
  mounted () {
    setTimeout(() => this.initFunction(), 0)
  },
  methods: {
    initFunction: function () {
      this.getTime()
      setInterval(this.getTime, 1000)
    },
    create: function () {
      let guid
      this.$Worker.execute({
        action: 'api',
        method: 'post',
        url: 'm5/createchatroom',
        body: JSON.stringify({
          title: this.input_string,
          type: 'text'
        })
      })
        .then((data) => (guid = data.result.guid))
        .then(() => (this.$router.push('/apps/clarifier/wss/' + guid)))
        .catch((err) => console.log(err.message))
    },
    getImg: function (imgGUID, get = false) {
      if (imgGUID === '') {
        return ''
      } else {
        let ret = imgGUID
        if (get) ret = this.$store.state.serverIP + '/m6/get/' + imgGUID
        return ret
      }
    },
    getImgAlt: function (title) {
      if (!title || title === '') {
        return '?'
      } else {
        return title.substring(0, 2)
      }
    },
    join: function () {
      this.$router.push('/apps/clarifier/wss/' + this.input_string)
    },
    joinActive: function (id) {
      this.$router.push('/apps/clarifier/wss/' + id)
    },
    removeGroup: function (session) {
      this.$store.commit('removeClarifierSession', session)
    },
    checkInput: function () {
      const createBtn = document.getElementById('btn_create_session')
      const joinBtn = document.getElementById('btn_join_session')
      createBtn.disabled = true
      if (createBtn.classList.contains('active')) createBtn.classList.remove('active')
      if (this.input_string.length > 0) {
        createBtn.disabled = false
        if (!createBtn.classList.contains('active')) createBtn.classList.add('active')
        this.join_type = 'create'
      }
      /*
      000000000011111111112222222222333333
      012345678901234567890123456789012345
      76f7fdc1-b699-4551-bb39-3719a25f23f3
       */
      joinBtn.disabled = true
      if (joinBtn.classList.contains('active')) joinBtn.classList.remove('active')
      if ((this.input_string.length === 36) &&
        (this.input_string.substring(8, 9) === '-') &&
        (this.input_string.substring(13, 14) === '-') &&
        (this.input_string.substring(18, 19) === '-') &&
        (this.input_string.substring(23, 24) === '-')) {
        joinBtn.disabled = false
        if (!joinBtn.classList.contains('active')) joinBtn.classList.add('active')
        this.join_type = 'join'
        createBtn.disabled = true
        if (createBtn.classList.contains('active')) createBtn.classList.remove('active')
      }
    },
    joinOrCreate: function () {
      if (this.join_type === 'join') {
        this.join()
      } else {
        this.create()
      }
    },
    getTime: function () {
      const today = new Date()
      const hours = today.getHours()
      this.time = hours.toString().padStart(2, '0') +
        ':' + today.getMinutes().toString().padStart(2, '0') +
        ':' + today.getSeconds().toString().padStart(2, '0')
      this.hour = hours
    },
    getFriends: function () {
      this.$Worker.execute({
        action: 'api',
        method: 'get',
        url: 'm5/direct/.*'
      })
        .then(async (data) => {
          if (data.result && data.result.chatrooms && data.result.chatrooms.length > 0) {
            this.friends = new Map()
            // Iterate over all direct chatrooms
            for (let i = 0; i < data.result.chatrooms.length; i++) {
              this.friends.set(data.result.chatrooms[i], {
                chatroom: data.result.chatrooms[i],
                msg: '',
                loading: true
              })
              this.processFriend(data, i)
                .then((result) => {
                  if (result.chatroom) {
                    this.friends.set(result.chatroom, result)
                  }
                })
            }
          } else {
            this.friends = new Map()
          }
        })
        .catch((err) => console.debug(err.message))
    },
    processFriend: async function (data, i) {
      let userId = 'none'
      // Iterate over all members of a single direct chatroom
      // We do this to figure out the user ID for decryption
      for (let j = 0; j < data.result.chatrooms[i].members.length; j++) {
        const member = JSON.parse(data.result.chatrooms[i].members[j])
        if (member.usr === this.$store.state.username) {
          userId = member.id
          break
        }
      }
      const lastMessage = await this.getLastMessage(data.result.chatrooms[i].guid)
      if (lastMessage.src !== '_server') {
        const key = await this.$store.getters.getClarifierKeyPair(data.result.chatrooms[i].guid)
        if (key != null) {
          try {
            const decryptedMessage = await this.wcrypt.decryptPayload(lastMessage, userId, key)
            return {
              chatroom: data.result.chatrooms[i],
              msg: lastMessage.src + ': ' + decryptedMessage.substring(0, 100).trim(),
              ts: new Date(lastMessage.ts)
            }
          } catch (e) {
            return {
              chatroom: data.result.chatrooms[i],
              msg: '',
              ts: new Date(lastMessage.ts)
            }
          }
        } else {
          return {
            chatroom: data.result.chatrooms[i],
            msg: ''
          }
        }
      } else {
        return {
          chatroom: data.result.chatrooms[i],
          msg: ''
        }
      }
    },
    getDirectChatroomName: function (username) {
      if (username == null) return ''
      return username
        .replaceAll('|' + this.$store.state.username + '|', '||')
        .replaceAll('|', ' ').replaceAll('  ', ' ').trim()
    },
    getLastMessage: function (guid) {
      return new Promise((resolve) => {
        const parameters = '?pageIndex=0&pageSize=1&skip=0'
        let message
        this.$Worker.execute({
          action: 'api',
          method: 'get',
          url: 'm5/getmessages/' + guid + parameters
        })
          .then((data) => (message = JSON.parse(data.result.messages[0])))
          .then(() => (
            this.$store.commit('addClarifierTimestampNew', {
              id: guid,
              ts: Math.floor(new Date(message.ts).getTime())
            })
          ))
          .then(() => (resolve(message)))
      })
    },
    hasUnread: function (guid) {
      if (guid === null) {
        return false
      }
      const timestamp = this.$store.getters.getTimestamp(guid)
      if (timestamp == null) return false
      const lastMessageTS = timestamp.tsNew
      if (lastMessageTS == null || lastMessageTS <= 0) {
        return false
      }
      let lastReadTS = timestamp.tsRead
      if (lastReadTS == null) lastReadTS = 0
      return lastReadTS < lastMessageTS
    },
    getHumanReadableDateText: function (date, withTime = false) {
      if (date == null) return ''
      const date2 = new Date()
      const diffTime = Math.abs(date2 - date)
      let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      if (date.getDate() === date2.getDate() &&
        date.getMonth() === date2.getMonth() &&
        date.getFullYear() === date2.getFullYear()) {
        diffDays = 0
      }
      let suffix = ''
      if (withTime) {
        suffix = ', ' + date.toLocaleTimeString('de-DE')
      }
      if (diffDays === 0) {
        return 'Today' + suffix
      } else if (diffDays === 1) {
        return 'Yesterday' + suffix
      } else if (diffDays === 2) {
        return '2 days ago' + suffix
      } else {
        return date.toLocaleDateString('de-DE') + suffix
      }
    },
    sendFriendRequest: function () {
      const username = this.friendName.trim()
      if (username === '') return
      this.$Worker.execute({
        action: 'api',
        method: 'get',
        url: 'm2/befriend/' + username
      })
        .then((data) => {
          console.log(data)
          this.isAddingFriend = false
          this.friendName = ''
          this.getNotifications()
          this.$notify(
            {
              title: 'Request Sent!',
              text: 'Waiting for approval.',
              type: 'info'
            })
        })
        .catch((err) => {
          console.debug(err.message)
        })
    },
    getNotifications: function () {
      this.$Worker.execute({
        action: 'api',
        method: 'get',
        url: 'm8/notifications'
      })
        .then((data) => {
          console.log(data)
        })
        .catch((err) => {
          console.debug(err.message)
        })
    }
  }
}
</script>

<style scoped>

.b_darkergray {
  @apply darkest_bg;
}

.c_darkergray {
  @apply text-neutral-900;
}

.b_darkgray {
  @apply bg-gray-800;
}

.c_darkgray {
  @apply text-neutral-800;
}

.b_gray {
  @apply bg-gray-700;
}

.c_gray {
  @apply text-neutral-700;
}

.c_lightgray {
  @apply text-neutral-400;
}

.b_orange {
  background-color: #ff5d37;
}

.c_orange {
  color: #ff5d37;
}

.wrapper {
  display: grid;
  gap: 0.5em;
  grid-auto-rows: minmax(100px, auto);
  grid-template-columns: repeat(1, 1fr);
}

#header_margin {
  min-height: 80px
}

@media only screen and (min-width: 768px) {
  .wrapper {
    grid-template-columns: repeat(3, 1fr);
  }
}

.orange-hover:hover {
  color: #ff5d37;
  cursor: pointer;
}

#btn_join_session,
#btn_create_session {
  padding: 0;
  min-width: 65px;
  width: 25%;
  opacity: 0.45;
  transition: ease-in-out all 0.5s;
}

#btn_join_session.active,
#btn_create_session.active {
  opacity: 1;
  width: 75%;
}

</style>
