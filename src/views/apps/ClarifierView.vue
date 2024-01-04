<template>
  <div id="clarifier_view_elem"
       class="background w-full h-[calc(100%-50px)] absolute
              top_nav overflow-y-auto md:overflow-hidden">
    <div class="flex items-center px-2 h-24 w-full gap-2">
      <button class="flex items-center justify-center hover:primary
                     flex-col gap-2 h-20 w-28 fmt_border rounded-md"
              v-on:click="openFriendRequest()">
        <UserPlusIcon class="w-7 h-7"/>
        <span class="text-sm">
          Add Friend
        </span>
      </button>
      <button class="flex items-center justify-center hover:primary
                     flex-col gap-2 h-20 w-28 fmt_border rounded-md"
              v-on:click="openJoin()">
        <ArrowRightOnRectangleIcon class="w-7 h-7"/>
        <span class="text-sm">
            Join Group
          </span>
      </button>
      <button class="flex items-center justify-center hover:primary
                     flex-col gap-2 h-20 w-28 fmt_border rounded-md"
              v-on:click="openCreate()">
        <PlusIcon class="w-7 h-7"/>
        <span class="text-sm">
            Create Group
          </span>
      </button>
    </div>
    <div class="wrapper h-[calc(100%-6rem)] w-full md:grid-cols-3">
      <!-- Active Sessions -->
      <div class="col-span-1 md:col-span-2 xl:h-full">
        <div class="row flex justify-center items-center md:h-full">
          <div class="w-full md:h-full">
            <div class="px-2 rounded-lg md:w-full md:h-full">
              <div class="md:mt-0 md:flex md:justify-between w-full md:h-full md:gap-x-2">
                <div class="w-full md:h-full mb-2 p-2 surface rounded-lg
                            md:overflow-x-hidden md:overflow-y-auto">
                  <div class="m-2">
                    <div class="flex items-start justify-between">
                      <h1 class="font-bold text-3xl pointer-events-none">
                        Friends
                      </h1>
                    </div>
                  </div>
                  <!-- -->
                  <div class="m-2 mt-3">
                    <template v-if="friends && friends.size > 0">
                      <template v-for="friend in friends.values()" :key="friend">
                        <div class="w-full h-20 flex items-center pt-1 my-2">
                          <div v-on:click="joinActive(friend.chatroom.uid)"
                               class="w-full h-20 p-2 cursor-pointer fmt_border
                                      flex items-center hover:background rounded">
                            <div v-show="hasUnread(friend.chatroom.uid)"
                                 class="flex items-center justify-center ml-2 mr-3">
                              <i class="bi bi-chat-quote-fill z-[500] text-orange-500 text-lg"></i>
                            </div>
                            <div class="w-full">
                              <div class="flex items-center w-full">
                                <div class="font-bold">
                                  {{ friend.display }}
                                </div>
                                <div class="ml-auto text-sm">
                                  {{ getHumanReadableDateText(friend.ts) }}
                                </div>
                              </div>
                              <div class="h-12 max-h-12 overflow-hidden text-ellipsis break-all">
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
                <div class="w-full md:h-full mb-2 p-2 surface rounded-lg
                            md:overflow-x-hidden md:overflow-y-auto">
                  <div class="pointer-events-none m-2">
                    <div class="flex items-end justify-between">
                      <h1 class="font-bold text-3xl">
                        Groups
                      </h1>
                      <div class="text-end">
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
                  <div class="m-2 flex flex-col gap-y-2 mt-4">
                    <template v-if="$store.state.clarifierSessions && $store.state.clarifierSessions.length > 0">
                      <template v-for="group in $store.state.clarifierSessions" :key="group">
                        <template v-if="group.type !== 'dm' && group.type !== 'home'">
                          <div class="flex items-center h-20">
                            <div class="h-full
                                        surface rounded overflow-hidden
                                        hover:background cursor-pointer
                                        fmt_border w-full relative
                                        flex items-center justify-center"
                                 v-on:click="joinActive(group.id)">
                              <div class="absolute w-full h-full overflow-hidden
                                          brightness-75 flex">
                                <template v-if="group.banner && group.banner !== ''">
                                  <img class="object-cover object-center w-full"
                                       v-bind:src="getImg(group.banner,true)"
                                       :alt="getImgAlt(group.t)"/>
                                </template>
                              </div>
                              <template v-if="group.img && group.img !== ''">
                                <div class="flex items-center p-1 pr-4 h-full">
                                  <img class="w-[48px] h-[48px] z-10 rounded-lg ml-1"
                                       v-bind:src="getImg(group.img,true)" :alt="getImgAlt(group.title)"/>
                                  <div class="surface z-10 ml-4 px-1 rounded flex items-center">
                                    <p class="text-nowrap text-lg font-bold">
                                      {{ group.title }}
                                    </p>
                                  </div>
                                </div>
                              </template>
                              <template v-else>
                                <div class="flex items-center h-full p-1">
                                  <div class="surface-variant flex items-center justify-center
                                              w-[48px] h-[48px] z-10 rounded-lg ml-1">
                                    {{ getImgAlt(group.title) }}
                                  </div>
                                  <p class="text-nowrap z-10 text-xl font-bold
                                            rounded ml-4 px-2">
                                    {{ group.title }}
                                  </p>
                                </div>
                              </template>
                              <i class="bi bi-shield-lock z-10 surface px-1 py-0.5 rounded"
                                 title="End-to-End Encrypted Group"
                                 style="margin-left: auto; margin-right: 8px"></i>
                            </div>
                            <button class="ml-2 h-10 w-10 flex items-center justify-center"
                                    title="Remove Group"
                                    v-on:click="removeGroup(group)">
                              <i class="bi bi-x-lg p-2 w-full h-full rounded-xl
                                        hover:error">
                              </i>
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
    </div>
  </div>
  <modal @close="isJoiningOrCreating = false; input_string = ''"
         v-show="isJoiningOrCreating">
    <template v-slot:header>
      <template v-if="isJoining">Join a group</template>
      <template v-else-if="isCreating">Create a new group</template>
    </template>
    <template v-slot:body>
      <div class="mb-4 p-4">
        <div class="row flex justify-center items-center">
          <div class="w-full max-w-xl">
            <p class="mb-4 p-4">
              <template v-if="isJoining">
                Enter a valid invite ID to join a group!
              </template>
              <template v-else-if="isCreating">
                Enter a name for your new group to get started!
              </template>
            </p>
            <input id="input_session"
                   :ref="'input_session'"
                   v-model="input_string"
                   v-on:input="checkInput()"
                   placeholder="Type something!"
                   class="fmt_input w-full mb-4"
                   v-on:keyup.enter="joinOrCreate()">
            <button id="btn_join_session"
                    :ref="'btn_join_session'"
                    disabled
                    class="rounded enabled:primary"
                    style="max-height: 6ch; height: 6ch"
                    v-if="isJoining"
                    v-on:click="join()">
              <span class="font-bold lead">Join</span>
            </button>
            <button id="btn_create_session"
                    :ref="'btn_create_session'"
                    disabled
                    class="rounded enabled:primary"
                    style="max-height: 6ch; height: 6ch"
                    v-if="isCreating"
                    v-on:click="create()">
              <span class="font-bold lead">Create</span>
            </button>
          </div>
        </div>
      </div>
    </template>
    <template v-slot:footer>
    </template>
  </modal>
  <modal @close="isAddingFriend = false"
         v-show="isAddingFriend">
    <template v-slot:header>
      Add Friend
    </template>
    <template v-slot:body>
      <div class="flex flex-col w-full max-w-[300px] p-4">
        <input type="text" v-model="friendName"
               ref="frequestUsr"
               class="fmt_input"
               placeholder="Username">
        <textarea v-model="friendMsg"
                  name="frequestMsg" id="frequestMsg" rows="3"
                  class="my-1 fmt_input"
                  placeholder="Message (optional)"></textarea>
        <button class="btn_bg_primary mt-4"
                v-on:click="sendFriendRequest()">
          <span class="">Send Request</span>
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

import {
  ArrowRightOnRectangleIcon
} from '@heroicons/vue/24/solid'

import {
  PlusIcon,
  UserPlusIcon
} from '@heroicons/vue/24/outline'

export default {
  name: 'WClarifier',
  components: {
    modal,
    ArrowRightOnRectangleIcon,
    PlusIcon,
    UserPlusIcon
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
      isJoiningOrCreating: false,
      isJoining: false,
      isCreating: false,
      friendName: '',
      friendMsg: ''
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
        url: 'chat/private/create',
        body: JSON.stringify({
          t: this.input_string,
          type: 'text'
        })
      })
      .then((data) => (guid = data.result))
      .then(() => (this.$router.push('/apps/clarifier/wss/' + guid)))
      .catch((err) => console.log(err.message))
    },
    getImg: function (imgGUID, get = false) {
      if (imgGUID === '') {
        return ''
      } else {
        let ret = imgGUID
        if (get) ret = this.$store.state.serverIP + '/' + imgGUID
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
      if (this.isJoining) {
        const joinBtn = document.getElementById('btn_join_session')
        if (this.input_string.length > 0) {
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
        }
      } else if (this.isCreating) {
        const createBtn = document.getElementById('btn_create_session')
        createBtn.disabled = true
        if (createBtn.classList.contains('active')) createBtn.classList.remove('active')
        if (this.input_string.length > 0) {
          createBtn.disabled = false
          if (!createBtn.classList.contains('active')) createBtn.classList.add('active')
          this.join_type = 'create'
        }
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
        url: 'chat/private/users/friends'
      })
      .then(async (data) => {
        if (data.result && data.result.friends && data.result.friends.length > 0) {
          this.friends = new Map()
          // Iterate over all friends and their DM groups
          for (let i = 0; i < data.result.friends.length; i++) {
            this.friends.set(data.result.friends[i].chat.uid, {
              display: data.result.friends[i].friend.name,
              chatroom: data.result.friends[i],
              msg: '',
              loading: true
            })
            this.processFriend(data, i)
            .then((result) => {
              if (result.chatroom) {
                this.friends.set(result.chatroom.uid, result)
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
      const entry = data.result.friends[i]
      const lastMessage = entry.msg
      const userId = this.$store.state.username
      console.log(lastMessage)
      if (lastMessage.usr !== '_server') {
        const key = await this.$store.getters.getClarifierKeyPair(entry.chat.uid)
        if (key != null) {
          try {
            const decryptedMessage = await this.wcrypt.decryptPayload(lastMessage, userId, key)
            return {
              display: entry.friend.name,
              chatroom: entry.chat,
              msg: lastMessage.usr + ': ' + decryptedMessage.substring(0, 100).trim(),
              ts: new Date(lastMessage.ts)
            }
          } catch (e) {
            return {
              display: entry.friend.name,
              chatroom: entry.chat,
              msg: '',
              ts: new Date(lastMessage.ts)
            }
          }
        } else {
          return {
            display: entry.friend.name,
            chatroom: entry.chat,
            msg: ''
          }
        }
      } else {
        return {
          display: entry.friend.name,
          chatroom: entry.chat,
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
      // if (guid === null) {
      //   return false
      // }
      // const timestamp = this.$store.getters.getTimestamp(guid)
      // if (timestamp == null) return false
      // const lastMessageTS = timestamp.tsNew
      // if (lastMessageTS == null || lastMessageTS <= 0) {
      //   return false
      // }
      // let lastReadTS = timestamp.tsRead
      // if (lastReadTS == null) lastReadTS = 0
      // return lastReadTS < lastMessageTS
      return false
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
      const payload = {
        usr: username,
        msg: this.friendMsg.trim()
      }
      this.$Worker.execute({
        action: 'api',
        method: 'post',
        url: 'users/private/befriend',
        body: JSON.stringify(payload)
      })
      .then((data) => {
        console.log(data)
        this.isAddingFriend = false
        this.friendName = ''
        this.friendMsg = ''
        this.getNotifications()
        this.$notify(
          {
            title: 'Request Sent!',
            text: 'Waiting for approval.',
            type: 'fmt_notify'
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
        url: 'notification/private/read'
      })
      .then((data) => {
        console.log(data)
      })
      .catch((err) => {
        console.debug(err.message)
      })
    },
    openJoin: function () {
      this.isJoiningOrCreating = true
      this.isJoining = true
      this.isCreating = false
      setTimeout(() => {
        this.$refs.input_session.focus()
      }, 0)
    },
    openCreate: function () {
      this.isJoiningOrCreating = true
      this.isJoining = false
      this.isCreating = true
      setTimeout(() => {
        this.$refs.input_session.focus()
      }, 0)
    },
    openFriendRequest: function () {
      this.isAddingFriend = true
      setTimeout(() => {
        this.$refs.frequestUsr.focus()
      }, 0)
    }
  }
}
</script>

<style scoped>

.b_darkergray {
  @apply darkest_bg;
}

.b_darkgray {
  @apply bg-gray-800;
}

.b_gray {
  @apply bg-gray-700;
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
