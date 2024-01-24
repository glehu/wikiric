<template>
  <div id="userViewer" ref="userViewer"
       class="background w-full h-full relative overflow-hidden rounded-tr-lg">
    <div class="relative h-full p-1 surface-variant w-full">
      <div class="rounded-md w-fit right-2 absolute
                  hover:primary p-2 cursor-pointer">
        <div v-on:click="clickedBack()"
             v-tooltip="{ content: 'Exit' }">
          <XMarkIcon class="h-7 w-7"></XMarkIcon>
        </div>
      </div>
      <div class="flex items-center background p-2 rounded">
        <template v-if="user.iurl && user.iurl !== ''">
          <img :src="getImg(user.iurl, true)" alt="?"
               class="sender_avatar_big">
          <template v-if="user.iurla && user.iurla !== ''">
            <img :src="getImg(user.iurla, true)" alt="?"
                 class="sender_avatar_big absolute sender_avatar_animated">
          </template>
        </template>
        <template v-else>
          <UserCircleIcon class="sender_avatar_big">
          </UserCircleIcon>
        </template>
        <div class="w-[80px] h-[80px] min-w-[80px] min-h-[80px]
                    absolute flex items-end justify-end">
          <template v-if="user.online">
            <div class="w-[24px] h-[24px] rounded-full bg-green-500 fmt_border"
                 v-tooltip.top="{ content: 'Online' }"></div>
          </template>
          <template v-else-if="user.recent">
            <div class="w-[24px] h-[24px] rounded-full bg-zinc-900 fmt_border"
                 v-tooltip.top="{ content: 'AFK' }">
              <MoonIcon class="w-full h-full text-orange-400"></MoonIcon>
            </div>
          </template>
          <template v-else>
            <div class="w-[24px] h-[24px] rounded-full bg-zinc-500 fmt_border"
                 v-tooltip.top="{ content: 'Offline' }"></div>
          </template>
        </div>
        <div class="block ml-4">
          <p class="font-bold text-xl">
            {{ user.name }}
          </p>
          <p class="">
            {{ user.usr }}
          </p>
          <p class="mb-2 text-sm">
            Member since {{ user.tsFormat }}
          </p>
          <div title="This member's messages are being End-to-End encrypted"
               class="flex items-center fmt_border px-1 w-fit rounded-md">
            <i class="bi bi-shield-lock-fill" style="margin-right: 1ch"></i>
            <p class="text-xs" style="cursor: default">
              RSA-OAEP
            </p>
          </div>
        </div>
      </div>
      <div class="items-center flex mt-3 background p-2 rounded">
        <template v-if="user.usr === $store.state.username">
          <button class="user_profile_button"
                  v-on:click="isEditingProfile = true">
            <i class="bi bi-pencil mr-2"></i>Edit Profile
          </button>
          <button class="user_profile_button"
                  v-on:click="startTransferring()">
            <span class="flex items-center"><QrCodeIcon class="h-5 w-5 mr-1"></QrCodeIcon>Transfer</span>
          </button>
        </template>
        <template v-else>
          <button class="user_profile_button"
                  v-on:click="gotoDirectMessages(user.usr)">
            <i class="bi bi-send mr-2"></i>Direct Message
          </button>
          <button class="user_profile_button"
                  v-on:click="banMember(user.usr)">
            <i class="bi bi-hammer mr-2"></i>Ban
          </button>
        </template>
      </div>
      <h5 class="mt-3 mb-2 headerline text-sm">Roles</h5>
      <div class="background rounded p-2">
        <div class="gap-1 flex-wrap flex">
          <div v-for="role in user.roles" :key="role"
               class="inverse-surface rounded px-1 py-0.5">
            <i v-show="isEditingRoles" class="bi bi-x-circle-fill orange-hover"
               style="margin-right: 4px"></i>
            <p>{{ role }}</p>
          </div>
          <span class="orange-hover rounded-full mx-1 px-1 flex items-center justify-center"
                v-on:click="addUserRole" title="Add new Role">
          <i class="bi bi-plus-circle"></i>
        </span>
        </div>
      </div>
      <div class="user_role background items-center"
           v-show="isAddingRole" @click.stop>
        <div style="position: relative">
          <i class="bi bi-x-lg lead" style="cursor: pointer; position: absolute; right: 0" title="Close"
             v-on:click="isAddingRole = false"></i>
          <p class="font-bold text-sm">Add a new Role</p>
          <input id="new_role"
                 type="text"
                 class="fmt_input mb-4"
                 v-model="new_role"
                 :placeholder="'Role'"
                 v-on:keyup.enter="commitUserRole">
        </div>
      </div>
      <h5 class="mt-3 mb-2 headerline text-sm">Badges</h5>
      <div class="background rounded p-2">
        <template v-if="user.badges == null || user.badges.length < 1">
          <div style="border: 1px solid rgb(128,128,128); border-radius: 10px; width: 100%; padding: 10%"
               class="text-center items-center pointer-events-none">
            <i class="bi bi-award-fill lead"></i>
            <br>Keep communicating to earn badges!
          </div>
        </template>
        <template v-else>
          <div class="w-full grid grid-cols-2 gap-3 mb-4">
            <div v-for="badge in user.badges" :key="badge.handle"
                 class="text-center rounded-xl border-2 border-zinc-600 py-1 px-2 hover:medium_bg">
              <div class="pointer-events-none">
                <div v-if="badge.handle.startsWith('msg')"
                     style="font-size: 150%">
                  📢
                </div>
                <div v-else-if="badge.handle.startsWith('rt')"
                     style="font-size: 150%">
                  💕
                </div>
                <h5 style="margin: 5px 0 5px 0">
                  {{ badge.title }}
                </h5>
                <div style="font-size: 75%; margin-bottom: 5px">
                  {{ badge.description }}
                </div>
                <span> +{{ badge.xpGain }} xp</span>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
  <modal
    v-show="isEditingProfile"
    @close="isEditingProfile = false">
    <template v-slot:header>
      <h3>Edit Your Profile</h3>
    </template>
    <template v-slot:body>
      <div style="display: flex; margin-bottom: 5px" class="items-center">
        <img :src="getImg(user.iurl, true)" alt="No Picture"
             class="b_darkergray"
             style="width: 100px; height: 100px; border-radius: 100%">
        <div class="block ml-2">
          <h2 class="font-bold text-2xl">
            {{ user.usr }}
          </h2>
          <div title="This member's messages are being End-to-End encrypted"
               style="display: flex; align-items: center">
            <i class="bi bi-shield-lock-fill" style="margin-right: 1ch"></i>
            <p class="c_lightgray" style="cursor: default; font-size: 75%; margin: 0">
              RSA-OAEP
            </p>
          </div>
        </div>
      </div>
      <label for="setProfilePicInput">
        Set a Profile Picture:
      </label>
      <br>
      <input id="setProfilePicInput" type="file"
             accept="image/jpeg, image/png, image/gif"
             v-on:change="setProfilePicture">
    </template>
    <template v-slot:footer>
    </template>
  </modal>
  <modal
    v-show="isTransferring"
    @close="isTransferring = false">
    <template v-slot:header>
      <h2 class="font-bold text-2xl">Transfer</h2>
    </template>
    <template v-slot:body>
      <div class="flex flex-col md:flex-row">
        <div id="transfer_qrcode" class="mx-auto md:mx-0"></div>
        <div class="mt-4 md:mt-0 md:mx-4 background">
          <p class="text-xl">Guide:</p>
          <ol class="list-decimal list-inside text-sm">
            <li>Get the device that you are trying to migrate to.</li>
            <li>Scan the QR Code on the device.</li>
            <li>Wait for the transfer to finish.</li>
          </ol>
          <div class="flex m-4 items-center gap-x-2">
            <div class="relative flex items-center justify-center w-fit">
              <div class="absolute h-3 w-3 rounded-full tertiary animate-ping"></div>
              <div class="absolute h-3 w-3 rounded-full primary-light"></div>
            </div>
            <span class="ms-2">Waiting...</span>
          </div>
        </div>
      </div>
    </template>
    <template v-slot:footer>
    </template>
  </modal>
  <modal
    v-show="isAttemptingBan"
    @close="isAttemptingBan = false">
    <template v-slot:header>
      <h2 class="font-bold text-2xl">Confirm Ban</h2>
    </template>
    <template v-slot:body>
      <div class="p-20 flex flex-col justify-center items-center gap-2">
        <p class="font-bold">Are you sure you want to ban:</p>
        <p class="font-bold my-4">
          <span class="text-3xl">{{ banningUser }}</span>
          <span class="mx-3">aka</span> <span class="text-3xl">{{ banningUserDisplayName }}</span>
        </p>
        <p class="font-bold">
          This action is irreversible thus making {{ banningUser }}
          unable to access this chats resources forever.
        </p>
        <p class="font-bold">Proceed?</p>
        <div class="fmt_button_danger"
             v-on:click="doBanMember()">
          <p class="font-bold">Ban {{ banningUser }}</p>
        </div>
      </div>
    </template>
    <template v-slot:footer>
    </template>
  </modal>
</template>

<script>
import { MoonIcon, QrCodeIcon, UserCircleIcon } from '@heroicons/vue/24/solid'
import { XMarkIcon } from '@heroicons/vue/24/outline'
import * as QRCode from 'easyqrcodejs'
import modal from '@/components/Modal.vue'
import { dbGetDisplayName } from '@/libs/wikistore'

export default {
  name: 'UserView',
  props: {
    isoverlay: Boolean,
    chatroom: Object,
    user: Object
  },
  emits: ['close', 'update'],
  components: { modal, XMarkIcon, QrCodeIcon, UserCircleIcon, MoonIcon },
  data () {
    return {
      isTransferring: false,
      isEditingProfile: false,
      isEditingRoles: false,
      isAddingRole: false,
      isAttemptingBan: false,
      new_role: '',
      banningUser: '',
      banningUserDisplayName: ''
    }
  },
  mounted () {
    this.initFunction()
  },
  methods: {
    initFunction: async function () {
      // Set window padding
      const mainDiv = this.$refs.userViewer
      if (mainDiv) {
        if (!this.isoverlay) {
          mainDiv.classList.add('pt_nav')
        } else {
          mainDiv.classList.remove('pt_nav')
        }
      }
    },
    clickedBack: function () {
      if (!this.isoverlay) {
        this.$router.back()
      } else {
        this.$emit('close')
      }
    },
    getImg: function (imgGUID, get = false) {
      if (imgGUID == null || imgGUID === '') {
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
    startTransferring: function () {
      this.isTransferring = true
      setTimeout(() => {
        const elem = document.getElementById('transfer_qrcode')
        while (elem.firstChild) {
          elem.firstChild.remove()
        }
        const qrCodePayload = this.$store.state.serverIP +
          '/apps/clarifier/transfer' +
          '?guid=' + this.chatroom.uid +
          '&who=' + this.$store.state.username
        const qrCode = new QRCode(elem, {
          text: qrCodePayload,
          quietZone: 10,
          quietZoneColor: 'rgba(255,255,255,1)'
        })
        if (qrCode) {
          console.debug(qrCode)
        }
      }, 0)
    },
    setProfilePicture: async function (evt) {
      evt.stopPropagation()
      evt.preventDefault()
      const base64 = await this.getBase64(evt.target.files[0])
      const url = 'chat/private/self/mod/' + this.chatroom.uid
      await this.$Worker.execute({
        action: 'api',
        method: 'post',
        url: url,
        body: JSON.stringify({
          type: 'edit',
          field: 'iurl',
          new: base64
        })
      })
      .then(() => {
        if (this.isoverlay) {
          this.isEditingProfile = false
          this.$emit('update')
        }
      })
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
    gotoDirectMessages: async function (username) {
      this.hideAllWindows()
      // First check if there is already a direct message server
      let foundDirect = false
      let newId = ''
      this.$Worker.execute({
        action: 'api',
        method: 'get',
        url: 'm5/direct/' + username + '?all=true'
      })
      .then((data) => {
        if (data.result.chatrooms && data.result.chatrooms.length > 0) {
          foundDirect = true
          newId = data.result.chatrooms[0].uid
          this.connectToGroup(newId, true)
        }
      })
      .then(() => {
        if (foundDirect) return
        this.sendFriendRequest(username)
      })
      .catch((err) => {
        console.debug(err.message)
        if (foundDirect) return
        this.sendFriendRequest(username)
      })
    },
    banMember: async function (username) {
      this.isAttemptingBan = true
      this.banningUser = username
      this.banningUserDisplayName = await dbGetDisplayName(username)
    },
    doBanMember: function () {
      const username = this.banningUser
      this.banningUser = ''
      this.isAttemptingBan = false
      this.$Worker.execute({
        action: 'api',
        method: 'get',
        url: 'chat/private/users/ban/' + this.chatroom.uid + '?usr=' + username
      })
      .then(() => {
        this.$notify(
          {
            title: 'User Banned!',
            text: '',
            type: 'fmt_notify'
          })
      })
      .catch((e) => {
        if (e) {
          this.$notify(
            {
              title: 'Error!',
              text: 'Maybe you do not have the rights to ban?',
              type: 'fmt_notify'
            })
        }
      })
    },
    setUserBadges: function (response) {
      this.viewedUserProfile.badges = []
      if (response.length > 0) {
        let badge
        for (let i = 0; i < response.length; i++) {
          badge = JSON.parse(response[i])
          this.viewedUserProfile.badges.push(badge)
        }
      }
    },
    addUserRole: function () {
      this.isAddingRole = true
      const roleInput = document.getElementById('new_role')
      setTimeout(() => roleInput.focus(), 0)
    },
    commitUserRole: function () {
      const content = JSON.stringify({
        member: this.viewedUserProfile.usr,
        role: this.new_role
      })
      this.$Worker.execute({
        action: 'api',
        method: 'post',
        url: 'm5/addrole/' + this.getSession(),
        body: content
      })
      .then(() => this.hideUserProfile())
      .then(() => this.getClarifierMetaData(this.getSession(), false, true))
      .catch((err) => console.debug(err.message))
    }
  }
}
</script>

<style>

.user_role {
  @apply rounded-lg overflow-hidden p-2;
}

</style>
