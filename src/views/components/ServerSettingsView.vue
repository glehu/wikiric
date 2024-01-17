<template>
  <div id="serverSettings" ref="serverSettings"
       class="background w-full h-full relative
              overflow-x-hidden overflow-y-auto">
    <div class="relative p-2 surface-variant w-full
                flex flex-col justify-center items-center">
      <div class="max-w-screen-sm">
        <div class="flex flex-row justify-between items-center mb-2 background p-1
                  rounded fmt_border">
          <div class="flex items-center gap-2 ml-1">
            <WrenchIcon class="h-7 w-7"/>
            <p class="font-bold">Server Settings</p>
          </div>
          <div class="rounded-md w-fit
                    hover:primary p-2 cursor-pointer"
               v-on:click="clickedBack()"
               v-tooltip="{ content: 'Exit' }">
            <XMarkIcon class="h-7 w-7"></XMarkIcon>
          </div>
        </div>
        <div class="w-full background rounded">
          <template v-if="chatroom_obj.burl && chatroom_obj.burl !== ''">
            <div class="rounded-t w-full max-h-[128px] overflow-hidden flex">
              <img class="object-cover object-center w-full"
                   v-bind:src="getImg(chatroom_obj.burl,true)"
                   :alt="getImgAlt(chatroom_obj.t)"/>
            </div>
          </template>
          <div class="flex gap-x-3">
            <template v-if="chatroom_obj.iurl && chatroom_obj.iurl !== ''">
              <div class="w-[96px] h-[96px] flex items-center
                        justify-center z-10 rounded surface-variant m-2">
                <img class="w-[96px] h-[96px] z-10 rounded-lg"
                     v-bind:src="getImg(chatroom_obj.iurl,true)"
                     :alt="getImgAlt(chatroom_obj.t)"/>
              </div>
            </template>
            <template v-else>
              <div class="w-[96px] h-[96px] flex items-center
                        justify-center z-10 rounded surface-variant m-2">
            <span class="">
              {{ getImgAlt(chatroom_obj.t) }}
            </span>
              </div>
            </template>
            <div class="mt-2">
              <h1 class="text-xl font-bold">{{ chatroom_obj.t }}</h1>
              <p class="text-sm">
                Created: {{ chatroom_obj.ts }}
              </p>
            </div>
          </div>
        </div>
        <p class="headerline mt-4 mb-1 text-sm">Appearance</p>
        <div class="p-2 rounded background">
          <p class="font-bold">Change Image</p>
          <input type="file" class="file_input w-full" id="files"
                 accept="image/jpeg, image/png"
                 v-on:change="handleFileSelect"/>
          <p class="mt-2 font-bold">Change Banner</p>
          <input type="file" class="file_input w-full" id="filesBanner"
                 accept="image/jpeg, image/png"
                 v-on:change="handleFileSelectBanner"/>
          <div id="confirm_settings_loading" class="ml-3 mt-3" style="display: none">
            <span class="spinner-border c_orange" role="status" aria-hidden="true"></span>
            <span class="jetb ms-2">Uploading...</span>
          </div>
        </div>
        <p class="headerline mt-4 mb-1 text-sm">Roles</p>
        <div class="p-2 rounded background flex flex-col gap-1">
          <div class="w-fit ml-auto fmt_border px-1 py-0.5 rounded-md mb-1
                    hover:primary cursor-pointer"
               v-on:click="isAddingRole = true">
            <span class="text-sm">Add Role</span>
          </div>
          <template v-if="isAddingRole">
            <div class="my-2 w-full flex flex-col gap-1 surface-variant p-2 fmt_border">
              <label for="new_role" class="text-sm">New Role:</label>
              <input type="text" name="new_role"
                     id="new_role"
                     class="fmt_input"
                     v-model="newRole.t">
              <div class="p-1 flex items-center cursor-pointer hover:primary rounded-md w-fit">
                <input type="checkbox"
                       id="input_show_unfinished"
                       ref="input_show_unfinished"
                       class="mr-2 cursor-pointer"
                       v-model="newRole.admin">
                <label for="input_show_unfinished"
                       class="font-bold text-sm cursor-pointer">
                  Admin Rights
                </label>
              </div>
              <div class="btn_bg_primary my-2 w-fit ml-auto"
                   v-on:click="submitRole()">
                <span class="text-sm">Submit</span>
              </div>
            </div>
          </template>
          <template v-for="role in chatroom_obj.roles" :key="role">
            <div class="px-2 py-1 flex items-center surface rounded">
              <p class="font-bold">{{ role.t }}</p>
              <template v-if="role.admin">
                <div class="px-2 py-1 rounded tertiary ml-2">
                  <p class="text-xs font-bold">Admin</p>
                </div>
              </template>
            </div>
          </template>
        </div>
        <p class="headerline mt-4 mb-1 text-sm">Write Roles</p>
        <div class="p-2 rounded background flex flex-col gap-1">
          <template v-for="role in chatroom_obj.wrules" :key="role">
            <div class="px-2 py-1 flex items-center surface rounded">
              <p class="font-bold">{{ role }}</p>
            </div>
          </template>
        </div>
        <p class="headerline mt-4 mb-1 text-sm">Read Roles</p>
        <div class="p-2 rounded background flex flex-col gap-1">
          <template v-for="role in chatroom_obj.rrules" :key="role">
            <div class="px-2 py-1 flex items-center surface rounded">
              <p class="font-bold">{{ role }}</p>
            </div>
          </template>
        </div>
        <p class="headerline mt-4 mb-1 text-sm">Administration</p>
        <div class="p-2 rounded background border-[1px] border-red-700">
          <p class="font-bold text-lg nopointer">
            Restoration
          </p>
          <button class="mt-2 fmt_button_danger"
                  v-on:click="generateRSAKeyPair(chatroom_obj.uid,true)">
            <span class="font-bold">Replace Encryption Key</span>
          </button>
        </div>
        <div class="h-24"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { XMarkIcon, WrenchIcon } from '@heroicons/vue/24/outline'

export default {
  name: 'ServerSettingsView',
  components: { XMarkIcon, WrenchIcon },
  props: {
    isoverlay: Boolean,
    chatroom: Object
  },
  emits: ['close', 'update'],
  data () {
    return {
      chatroom_obj: {},
      isAddingRole: false,
      newRole: {
        t: '',
        admin: false
      }
    }
  },
  mounted () {
    this.initFunction()
  },
  methods: {
    initFunction: async function () {
      this.chatroom_obj = this.chatroom
      // Set window padding
      const mainDiv = this.$refs.serverSettings
      if (mainDiv) {
        if (!this.isoverlay) {
          mainDiv.classList.add('pt_nav')
        } else {
          mainDiv.classList.remove('pt_nav')
        }
      }
      this.getClarifierMetaData()
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
    setSessionImage: async function (image, isBanner = false) {
      const base64 = await this.getBase64(image)
      const disableLoadingFun = this.toggleSettingsLoading
      let fieldType = 'iurl'
      if (isBanner) fieldType = 'burl'
      this.$Worker.execute({
        action: 'api',
        method: 'post',
        url: 'chat/private/mod/' + this.chatroom_obj.uid,
        body: JSON.stringify({
          type: 'edit',
          field: fieldType,
          new: base64
        })
      })
      .then(() => {
        this.getClarifierMetaData()
      })
      .catch((err) => console.debug(err.message))
      .finally(() => (disableLoadingFun()))
    },
    toggleElement: function (id, display = 'block') {
      const elem = document.getElementById(id)
      if (!elem) return
      if (elem.style.display === display) {
        elem.style.display = 'none'
      } else {
        elem.style.display = display
      }
    },
    toggleSettingsLoading: function () {
      this.toggleElement('confirm_settings_loading', 'flex')
    },
    handleFileSelect: function (evt, drop = false) {
      evt.stopPropagation()
      evt.preventDefault()
      // Start uploading animation
      this.toggleElement('confirm_settings_loading', 'flex')
      let files
      if (drop) {
        files = evt.dataTransfer.files
      } else {
        files = evt.target.files
      }
      this.setSessionImage(files[0])
    },
    handleFileSelectBanner: function (evt, drop = false) {
      evt.stopPropagation()
      evt.preventDefault()
      // Start uploading animation
      this.toggleElement('confirm_settings_loading', 'flex')
      let files
      if (drop) {
        files = evt.dataTransfer.files
      } else {
        files = evt.target.files
      }
      this.setSessionImage(files[0], true)
    },
    handleUploadFileSelect: async function (evt, drop = false) {
      if (!evt) return
      evt.stopPropagation()
      evt.preventDefault()
      // Start uploading animation
      this.toggleElement('confirm_snippet_loading', 'flex')
      let files
      if (drop) {
        files = evt.dataTransfer.files
      } else {
        files = evt.target.files
      }
      this.uploadFileBase64 = await this.getBase64(files[0])
      this.uploadFileType = files[0].type
      this.uploadFileName = files[0].name
      this.toggleElement('confirm_snippet_loading', 'flex')
    },
    generateRSAKeyPair: async function (uniChatroomGUID, force = false) {
      if (uniChatroomGUID == null || uniChatroomGUID === '') return
      // Check if we already have a PrivKey for this chat GUID
      const clarifierKeyPair = await this.$store.getters.getClarifierKeyPair(uniChatroomGUID)
      if (force === false && clarifierKeyPair != null) return false
      // Generate key pair
      const keyPair = await window.crypto.subtle.generateKey(
        {
          name: 'RSA-OAEP',
          modulusLength: 2048,
          publicExponent: new Uint8Array([1, 0, 1]),
          hash: 'SHA-384'
        },
        true,
        ['encrypt', 'decrypt']
      )
      this.$store.commit('setClarifierKeyPair', {
        id: uniChatroomGUID,
        priv: await this.exportRSAPrivKey(keyPair.privateKey)
      })
      const content = JSON.stringify({
        pubKeyPEM: await this.exportRSAPubKey(keyPair.publicKey)
      })
      return new Promise((resolve) => {
        this.$Worker.execute({
          action: 'api',
          method: 'post',
          url: 'chat/private/pubkey/' + uniChatroomGUID,
          body: content
        })
        .then(() => {
          if (force) {
            this.$emit('update')
          }
        })
        .then(() => {
          if (force === true) {
            this.$notify(
              {
                title: 'Encryption Key Replaced',
                text: '',
                type: 'fmt_notify'
              })
          }
        })
        .then(resolve)
        .catch((err) => console.debug(err.message))
      })
    },
    arrayBufferToString: function (buf) {
      return String.fromCharCode.apply(null, new Uint8Array(buf))
    },
    exportRSAPrivKey: async function (key) {
      const exported = await window.crypto.subtle.exportKey(
        'pkcs8',
        key
      )
      const exportedAsString = this.arrayBufferToString(exported)
      const exportedAsBase64 = window.btoa(exportedAsString)
      return '-----BEGIN PRIVATE KEY-----\n' + exportedAsBase64 + '-----END PRIVATE KEY-----'
    },
    exportRSAPubKey: async function (key) {
      const exported = await window.crypto.subtle.exportKey(
        'spki',
        key
      )
      const exportedAsString = this.arrayBufferToString(exported)
      const exportedAsBase64 = window.btoa(exportedAsString)
      return '-----BEGIN PUBLIC KEY-----\n' + exportedAsBase64 + '\n-----END PUBLIC KEY-----'
    },
    getClarifierMetaData: function () {
      this.$Worker.execute({
        action: 'api',
        method: 'get',
        url: 'chat/private/get/' + this.chatroom_obj.uid
      })
      .then((data) => {
        this.chatroom_obj = data.result
      })
    },
    submitRole: function () {
      this.$Worker.execute({
        action: 'api',
        method: 'post',
        url: 'chat/private/roles/mod/' + this.chatroom_obj.uid,
        body: JSON.stringify(this.newRole)
      })
      .then(() => {
        this.getClarifierMetaData()
        this.isAddingRole = false
        this.newRole = ''
      })
      .catch((err) => console.debug(err.message))
    }
  }
}
</script>

<style>

</style>
