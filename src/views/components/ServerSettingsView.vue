<template>
  <div id="serverSettings" ref="serverSettings"
       class="background w-full h-full relative
              overflow-x-hidden overflow-y-auto">
    <div class="relative p-2 surface-variant w-full
                flex flex-col justify-center items-center">
      <div class="max-w-screen-sm w-full">
        <div class="flex flex-row justify-between items-center mb-2 background p-1
                    rounded fmt_border sticky top-0 w-full z-50">
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
        <div class="mt-4 p-2 rounded background">
          <p class="headerline mb-1 text-sm">Appearance</p>
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
        <div class="w-full mt-4 grid grid-cols-2 gap-1 background p-2">
          <div>
            <p class="headerline mb-1 text-sm">Roles</p>
            <div class="rounded flex flex-col gap-1">
              <div class="ml-auto fmt_button"
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
                  <p class="font-bold text-sm">{{ role.t }}</p>
                  <template v-if="role.admin">
                    <div class="px-2 py-1 rounded tertiary ml-2">
                      <p class="text-xs font-bold">Admin</p>
                    </div>
                  </template>
                </div>
              </template>
            </div>
          </div>
          <div>
            <p class="headerline mb-1 text-sm">Write Roles</p>
            <div class="rounded flex flex-col gap-1">
              <template v-for="role in chatroom_obj.wrules" :key="role">
                <div class="px-2 py-1 flex items-center surface rounded">
                  <p class="font-bold text-sm">{{ role }}</p>
                </div>
              </template>
            </div>
            <p class="headerline mb-1 text-sm">Read Roles</p>
            <div class="rounded flex flex-col gap-1">
              <template v-for="role in chatroom_obj.rrules" :key="role">
                <div class="px-2 py-1 flex items-center surface rounded">
                  <p class="font-bold text-sm">{{ role }}</p>
                </div>
              </template>
            </div>
          </div>
        </div>
        <div class="mt-4 w-full background background flex flex-col gap-1 p-2">
          <p class="headerline mb-1 text-sm">Channels</p>
          <template v-for="subchat in chatroom_obj.subc" :key="subchat">
            <div :id="subchat.uid + '_subc'"
                 class="flex surface p-2 rounded relative hover_field items-center">
              <template v-if="subchat.type === 'screenshare'">
                <WindowIcon class="h-5 w-5"></WindowIcon>
              </template>
              <template v-else-if="subchat.type === 'webcam'">
                <i class="bi bi-camera-video h-5 w-5 flex items-center justify-center text-lg"></i>
              </template>
              <template v-else>
                <HashtagIcon class="h-5 w-5"></HashtagIcon>
              </template>
              <template v-if="!subchat._isEditing">
                <p class="relative ml-2">{{ subchat.t }}</p>
              </template>
              <template v-else>
                <input type="text"
                       v-model="subchat.t"
                       :id="subchat.t + '_edit'"
                       class="fmt_input relative ml-2">
                <div class="btn_bg_primary ml-2"
                     v-on:click="updateChannel(subchat)">
                  <p class="text-sm font-bold">Submit</p>
                </div>
              </template>
              <div class="absolute right-2 hover:primary hover_show cursor-pointer p-1 rounded"
                   v-on:click="editChannel(subchat)">
                <PencilIcon class="h-5 w-5"></PencilIcon>
              </div>
            </div>
          </template>
        </div>
        <div class="mt-4 p-2 rounded background">
          <p class="headerline mb-1 text-sm">Custom Emotes</p>
          <div class="my-1 w-full flex">
            <div class="fmt_button ml-auto"
                 v-on:click="isBulkUploadingEmotes = true">
              <p class="text-sm">Bulk Upload Emotes</p>
            </div>
          </div>
          <div class="w-full grid grid-cols-2 gap-1">
            <template v-if="emoteList != null">
              <template v-for="emote in emoteList" :key="emote">
                <div class="flex flex-row gap-2 items-center px-2 py-1 surface relative hover_field">
                  <div class="markedView max-w-[64px] w-full">
                    <img :src="emote._url" alt="Image" class="object-contain">
                  </div>
                  <p class="text-sm font-bold">{{ emote._t }}</p>
                  <div class="absolute right-2 fmt_button_danger hover_show"
                       v-on:click="deleteEmote(emote.uid)">
                    <TrashIcon class="h-6 w-6"></TrashIcon>
                  </div>
                </div>
              </template>
            </template>
          </div>
        </div>
        <div class="mt-4 p-2 rounded background border-[1px] border-red-700">
          <p class="headerline mb-1 text-sm">Administration</p>
          <button class="mt-2 fmt_button_danger"
                  v-on:click="generateRSAKeyPair(chatroom_obj.uid,true)">
            <span class="font-bold">Replace Encryption Key</span>
          </button>
        </div>
        <div class="h-24"></div>
      </div>
    </div>
  </div>
  <modal
    v-show="isBulkUploadingEmotes"
    @close="isBulkUploadingEmotes = false">
    <template v-slot:header>
      <p>Custom Emote Bulk Uploading</p>
    </template>
    <template v-slot:body>
      <div class="p-2">
        <label for="bulkFiles">Select Files:</label>
        <br><input type="file" name="bulkFiles" id="bulkFiles" multiple
                   accept="image/jpeg, image/png"
                   v-on:change="handleBulkFilesSelect"
                   class="my-1">
      </div>
      <template v-if="bulkFiles && bulkFiles.length > 0">
        <div class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 px-2 pt-2 pb-32 gap-3">
          <template v-for="(file, ix) in bulkFiles" :key="file">
            <div class="flex flex-col gap-1 surface-variant rounded p-2">
              <div class="max-h-[128px] w-full h-full
                          flex items-center justify-center">
                <img v-if="file.type.includes('image')"
                     class="max-w-[128px] max-h-[128px] mx-auto"
                     v-bind:src="file._base64" :alt="'&nbsp;'"/>
              </div>
              <div class="fmt_button my-1 ml-auto"
                   v-on:click="removeFile(ix)">
                <p>Remove</p>
              </div>
              <p class="text-xs">Original Name:</p>
              <p class="font-bold text-sm mb-2">{{ file.name }}</p>
              <p class="text-xs mt-auto">New Name:</p>
              <input type="text" v-model="file._name"
                     class="fmt_input w-full">
            </div>
          </template>
        </div>
        <div class="fixed bottom-10 right-10 flex flex-col justify-end items-end">
          <div v-if="bulkUploadLeft > 0"
               class="w-full h-10 p-4 flex flex-row gap-6
                      relative items-center background rounded">
            <div class="relative flex items-center justify-center w-fit">
              <div class="absolute h-3 w-3 rounded-full tertiary animate-ping"></div>
              <div class="absolute h-3 w-3 rounded-full primary-light"></div>
            </div>
            <p>Uploading {{ bulkUploadingCurrently }}... {{ bulkUploadLeft }} left</p>
          </div>
          <div class="btn_bg_primary dshadow fmt_border p-4 w-fit"
               v-on:click="bulkUploadEmotes()">
            <p class="font-bold">Upload {{ bulkFiles.length }} Emotes</p>
          </div>
        </div>
      </template>
    </template>
    <template v-slot:footer>
    </template>
  </modal>
</template>

<script>
import { XMarkIcon, WrenchIcon, HashtagIcon, WindowIcon, TrashIcon } from '@heroicons/vue/24/outline'
import { PencilIcon } from '@heroicons/vue/24/solid'
import modal from '@/components/Modal.vue'

export default {
  name: 'ServerSettingsView',
  components: { modal, TrashIcon, WindowIcon, HashtagIcon, XMarkIcon, WrenchIcon, PencilIcon },
  props: {
    isoverlay: Boolean,
    chatroom: Object
  },
  emits: ['close', 'update'],
  data () {
    return {
      chatroom_obj: {},
      isAddingRole: false,
      isBulkUploadingEmotes: false,
      newRole: {
        t: '',
        admin: false
      },
      bulkFiles: [],
      emotes: null,
      emoteList: [],
      editingChannel: null,
      bulkUploadLeft: 0,
      bulkUploadingCurrently: ''
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
      await this.getCustomEmotes(this.chatroom_obj.uid)
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
    handleBulkFilesSelect: async function (evt, drop = false) {
      evt.stopPropagation()
      evt.preventDefault()
      // Start uploading animation
      this.toggleElement('confirm_settings_loading', 'flex')
      let filesTmp
      const files = []
      if (drop) {
        filesTmp = evt.dataTransfer.files
      } else {
        filesTmp = evt.target.files
      }
      for (let i = 0; i < filesTmp.length; i++) {
        files.push(filesTmp[i])
        files[i]._base64 = await this.getBase64(files[i])
        files[i]._name = files[i].name.split('.')[0]
      }
      this.bulkFiles = files
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
    },
    getCustomEmotes: function (chatID) {
      if (chatID == null) return
      return new Promise((resolve) => {
        this.$Worker.execute({
          action: 'api',
          method: 'get',
          url: 'files/private/chat/' + chatID + '?type=emote'
        }).then((data) => {
          const emotes = data.result.files
          if (emotes.length < 1) {
            this.emotes = new Map()
            this.emoteList = []
            return
          }
          let url
          let md
          let fname
          this.emotes = new Map()
          this.emoteList = []
          for (let i = 0; i < emotes.length; i++) {
            url = this.$store.state.serverIP + '/' + emotes[i].pth
            fname = ':' + emotes[i].t.split('.')[0] + ':'
            // Build Markdown image string
            md = `![${fname}](${url})`
            this.emotes[fname] = md
            // Add to emote list (user prompt)
            emotes[i]._t = fname
            emotes[i]._url = url
            this.emoteList.push(emotes[i])
          }
        })
        .then(() => resolve())
      })
    },
    deleteEmote: function (guid) {
      this.$Worker.execute({
        action: 'api',
        method: 'get',
        url: 'files/private/delete/' + guid
      })
      .then(() => {
        this.getCustomEmotes(this.chatroom_obj.uid)
        this.$notify(
          {
            title: 'Emote Deleted',
            text: '',
            type: 'fmt_notify'
          })
      })
    },
    editChannel: function (subchat) {
      if (this.editingChannel) {
        this.editingChannel._isEditing = false
      }
      subchat._isEditing = true
      this.editingChannel = subchat
      setTimeout(() => {
        const elem = document.getElementById(subchat.t + '_edit')
        elem.focus()
        elem.select()
      }, 0)
    },
    updateChannel: function (subchat) {
      subchat._isEditing = false
      this.editingChannel = null
      this.$Worker.execute({
        action: 'api',
        method: 'post',
        url: 'chat/private/mod/' + subchat.uid,
        body: JSON.stringify({
          type: 'edit',
          field: 't',
          new: subchat.t
        })
      })
      .then(() => {
        this.editingChannel = null
        this.getClarifierMetaData()
      })
      .catch((err) => console.debug(err.message))
    },
    removeFile: function (index) {
      if (index < 0) return
      if (this.bulkFiles == null || index > this.bulkFiles.length) return
      this.bulkFiles.splice(index, 1)
    },
    bulkUploadEmotes: async function () {
      if (!this.bulkFiles || this.bulkFiles.length < 1) return
      this.bulkUploadLeft = this.bulkFiles.length
      for (let i = 0; i < this.bulkFiles.length; i++) {
        this.bulkUploadingCurrently = this.bulkFiles[i]._name
        await this.uploadSnippet(this.bulkFiles[i])
        this.bulkUploadLeft -= 1
      }
      this.bulkFiles = []
      this.isBulkUploadingEmotes = false
      await this.getCustomEmotes(this.chatroom_obj.uid)
      this.$notify(
        {
          title: 'Bulk Upload Completed',
          text: 'Enjoy your emotes!',
          type: 'fmt_notify'
        })
    },
    uploadSnippet: function (file) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const content = JSON.stringify({
            base64: file._base64,
            name: file._name,
            pid: this.chatroom_obj.uid,
            emote: true
          })
          this.$Worker.execute({
            action: 'api',
            method: 'post',
            url: 'files/private/create',
            body: content
          })
          .catch((err) => (console.log(err.message)))
          .finally(() => {
            resolve()
          })
        }, 500)
      })
    }
  }
}
</script>

<style>

</style>
