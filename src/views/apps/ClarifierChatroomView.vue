<template>
  <div style="min-height: 100vh" class="b_darkergray">
    <div id="sidebar" class="sidebar"
         style="height: 100vh; z-index: 1000">
      <div class="header-margin" style="box-shadow: none"></div>
      <div style="height: calc(100vh - 60px)" class="b_darkgray sidebar_bg">
        <!-- #### Tools #### -->
        <div style="height: 140px; overflow-x: clip; position: relative">
          <div style="width: 100%; height: 35px; padding-top: 10px">
            <span class="sb_link_text c_lightgray nopointer">Menu</span>
          </div>
          <button class="sb_toggler btn-no-outline" v-on:click="toggleSidebar">
            <i class="bi bi-list c_lightgray"></i>
          </button>
          <ul class="nav_list list-unstyled"
              style="color: white; margin-top: 5px">
            <li>
              <div class="sb_link" v-on:click="this.$router.push('/apps/clarifier')">
                <div class="c_lightgray orange-hover">
                  <i class="sb_link_icon bi bi-x-square"></i>
                  <span class="sb_link_text">Exit</span>
                </div>
                <span class="sidebar_tooltip">Exit</span>
              </div>
            </li>
            <li>
              <div class="sb_link">
                <div class="c_lightgray orange-hover">
                  <i class="sb_link_icon bi bi-tools"></i>
                  <span class="sb_link_text">Settings</span>
                </div>
                <span class="sidebar_tooltip">Settings</span>
              </div>
            </li>
          </ul>
        </div>
        <hr class="c_lightgray" style="margin: auto; width: 75%">
        <!-- #### GROUPS #### -->
        <div id="channel_section" class="channel_section b_darkgray"
             style="height: calc(100% - 60px - 100px); width: 100%; z-index: 4;
                    color: white; overflow-y: auto; overflow-x: clip; padding-top: 10px; padding-bottom: 20px">
          <div style="width: 100%; padding-top: 5px"
               class="sb_fold">
            <span class="sb_link_text c_lightgray nopointer">
              Groups&nbsp;-&nbsp;{{ this.$store.state.clarifierSessions.length }}
            </span>
          </div>
          <div v-for="session in this.$store.state.clarifierSessions" :key="session"
               class="channel_link"
               style="position: relative; padding-left: 8px; font-weight: bold; font-size: 125%">
            <a class="fw-bold text-white orange-hover" style="text-decoration: none"
               :href="'/apps/clarifier/wss/' + JSON.parse(session).id">
              <div class="c_lightgray orange-hover">
                <i v-if="JSON.parse(session).id === chatroom.guid"
                   class="bi bi-dot"
                   style="position: absolute; left: -18px; top: -5px; font-size: 200%; color: forestgreen">
                </i>
                <i class="bi bi-circle-fill"
                   style="font-size: 180%; color: transparent"></i>
                <img class="b_darkergray"
                     style="width: 40px; height: 40px; position: absolute; left: 6px; top: 8px;
                   border-radius: 10px"
                     v-bind:src="getImg(JSON.parse(session).img,true)"
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
        <!-- #### SUBCHATS #### -->
        <div style="height: calc(100% - 35px); overflow-y: scroll; overflow-x: clip"
             class="c_lightgray">
          <div style="height: 50px; border-bottom: 2px solid rgba(174, 174, 183, 0.25);
                      align-items: center; display: flex">
            <div :id="this.getSession() + '_subc'" class="subchat orange-hover"
                 v-on:click="gotoSubchat(this.getSession(), false)">
              <span style="font-size: 150%">#</span>
              <span style="padding-left: 10px">General</span>
            </div>
          </div>
          <div style="width: 100%; height: 35px; padding-top: 5px;
                      display: flex; position: relative; align-items: center">
            <span class="fw-bold c_lightgray">Subchats</span>
            <button class="text-white btn-no-outline"
                    style="position: absolute; right: 0"
                    title="New Subchat"
                    v-on:click="showNewSubchatWindow">
              <i class="bi bi-plus lead orange-hover c_lightgray" style="font-size: 150%"></i>
            </button>
          </div>
          <div v-for="subchat in this.chatroom.subChatrooms" :key="subchat"
               :id="JSON.parse(subchat).guid + '_subc'"
               class="subchat orange-hover"
               style="display: flex"
               v-on:click="gotoSubchat(JSON.parse(subchat).guid)">
            <span style="font-size: 150%">#</span>
            <span style="padding-left: 10px">{{ JSON.parse(subchat).t }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="clarifier_chatroom" style="display: flex; height: 100%; overflow-y: clip; overflow-x: clip"
         v-on:click="closeModals">
      <div id="chat_section" class="chat_section b_darkergray" style="width: 100%; height: 100%">
        <div class="header-margin" style="box-shadow: none"></div>
        <!-- #### CHAT HEADER #### -->
        <div class="align-items-center b_darkergray chat_header" style="width: 100%">
          <div style="width: calc(100% - 130px); overflow-x: clip; display: flex; font-size: 80%"
               class="nopointer">
            <span style="margin-left: 10px">{{ chatroom.t }}</span>
            <div v-if="isSubchat === true">
              <span style="margin-left: 10px"><i class="bi bi-caret-right"></i></span>
              <span style="margin-left: 10px">{{ currentSubchat.t }}</span>
            </div>
          </div>
          <button class="btn-no-outline c_lightgray"
                  style="position: absolute; right: 90px"
                  title="Show Settings"
                  v-on:click="isViewingSessionSettings = true">
            <i class="sb_link_icon bi bi-wrench orange-hover"></i>
          </button>
          <button class="btn-no-outline c_lightgray member_section_toggler"
                  style="position: absolute; right: 50px"
                  title="Show Subchats"
                  v-on:click="toggleSidebar2">
            <i class="sb_link_icon bi bi-chat-square-dots orange-hover"></i>
          </button>
          <button class="btn-no-outline c_lightgray member_section_toggler"
                  style="position: absolute; right: 10px"
                  title="Show Members"
                  v-on:click="toggleMemberSidebar">
            <i class="bi bi-people orange-hover"></i>
          </button>
        </div>
        <!-- #### MESSAGES #### -->
        <div id="messages_section"
             class="messages_section"
             style="overflow-y: auto; overflow-x: clip;
             height: calc(100vh - 60px - 50px - 34px);
             padding-bottom: 30px;
             display: flex; flex-direction: column-reverse">
          <template v-for="msg in messages" :key="msg.uID">
            <div class="message">
              <!-- Chat Avatar and Date-->
              <template v-if="msg.header === true">
                <div style="position: relative">
                  <i v-if="msg.src.startsWith('_server')" class="sender_avatar bi bi-broadcast"></i>
                  <i v-else class="sender_avatar bi bi-person-circle"></i>
                  <span class="orange-hover"
                        style="font-weight: bold">
                {{ msg.src.split('@')[0] }}
                </span>
                  <span style="color: gray; font-size: 80%; padding-left: 10px">
                    {{ msg.time.toLocaleString('de-DE').replace(' ', '&nbsp;') }}
                </span>
                </div>
              </template>
              <!-- #### LOGIN NOTIFICATION MESSAGE #### -->
              <template v-if="msg.msg.startsWith('[s:RegistrationNotification]')">
                <div class="serverMessage">
                  {{ msg.msg.substring(28).trim() }}
                </div>
              </template>
              <!-- #### CLIENT GIF MESSAGE #### -->
              <template v-else-if="msg.msg.startsWith('[c:GIF]')">
                <div style="padding-left: 42px">
                  <img :src="msg.msg.substring(7)"
                       :alt="msg.msg.substring(7)"
                       loading="lazy"
                       style="max-width: 300px">
                  <br>
                  <div>
                    <img src="../../assets/giphy/PoweredBy_200px-Black_HorizText.png" alt="Powered By GIPHY"
                         style="width: 100px"/>
                  </div>
                </div>
              </template>
              <!-- #### CLIENT IMAGE (SnippetBase) #### -->
              <template v-else-if="msg.msg.startsWith('[c:IMG]')">
                <div style="padding-left: 42px">
                  <img :src="msg.msg.substring(7)"
                       :alt="msg.msg.substring(7)"
                       loading="lazy"
                       style="max-width: 300px"
                       v-on:click="openURL(msg.msg.substring(7))">
                </div>
              </template>
              <!-- #### CLIENT AUDIO (SnippetBase) #### -->
              <template v-else-if="msg.msg.startsWith('[c:AUD]')">
                <div style="padding-left: 42px">
                  <audio controls preload="auto"
                         class="uploadFileSnippet">
                    <source :src="msg.msg.substring(7)">
                    Your browser does not support playing audio.
                  </audio>
                </div>
              </template>
              <!-- #### CLIENT MESSAGE #### -->
              <div v-else style="width: 100%; position: relative">
                <span class="clientMessage">
                  {{ msg.msg }}
                </span>
              </div>
            </div>
          </template>
        </div>
        <!-- #### USER INPUT FIELD #### -->
        <div class="align-bottom" style="display: inline-flex; width: 100%">
          <div style="width: 100%; position: relative">
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
                      :placeholder="'Message to ' + chatroom.t"
                      v-on:input="auto_grow"
                      v-on:click="hideAllSidebars">
            </textarea>
            <button id="send_image_button"
                    class="btn-outline-light send_image_button"
                    style="position: absolute; bottom: 0; right: 105px;
                    width: 40px; height: 2.5em; margin-left: 1ch;
                    border-color: transparent; border-radius: 1em; background-color: transparent"
                    title="Send Files"
                    v-on:click="toggleUploadingSnippet">
              <span class="fw-bold"><i class="bi bi-plus-circle"></i></span>
            </button>
            <button class="btn-outline-light b_gray"
                    style="position: absolute; bottom: 0; right: 60px;
                    width: 40px; height: 2.5em; margin-left: 1ch;
                    border-color: transparent; border-radius: 1em"
                    title="Send"
                    v-on:click="addMessage">
              <span class="fw-bold"><i class="bi bi-send"></i></span>
            </button>
            <button class="btn-outline-light b_gray"
                    style="position: absolute; bottom: 0; right: 15px;
                    width: 40px; height: 2.5em; margin-left: 1ch;
                    border-color: transparent; border-radius: 1em"
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
         style="color: white; z-index: 11; position: absolute; right: 0;
         border-left: 2px solid rgba(174, 174, 183, 0.25);
         height: 100vh; overflow-y: auto; overflow-x: clip">
      <div class="header-margin" style="box-shadow: none"></div>
      <div style="width: 100%; height: 35px; padding-top: 5px">
        <span class="fw-bold member_count c_lightgray nopointer" style="padding-left: 20px">
          Members&nbsp;-&nbsp;{{ this.members.length }}
        </span>
        <button class="btn-no-outline member_section_toggler c_lightgray"
                style="position: absolute; right: 10px"
                title="Hide Members"
                v-on:click="toggleMemberSidebar">
          <i class="bi bi-eye-slash-fill orange-hover"></i>
        </button>
      </div>
      <div style="padding: 5px">
        <div v-for="usr in chatroom.members" :key="usr"
             style="padding-left: 10px; position: relative; display: flex; align-items: center"
             class="user_badge"
             v-on:click="showUserProfile(JSON.parse(usr))">
          <i class="bi bi-person-circle"
             style="font-size: 200%">
          </i>
          <span style="font-weight: bold; margin-left: 10px">
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
         v-on:click="hideAllWindows()"></i>
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
  <div class="giphygrid b_gray" style="overflow: hidden" v-show="isViewingGIFSelection" @click.stop>
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
         v-on:click="hideAllWindows()"></i>
      <h2 class="fw-bold">Session Settings</h2>
      <div style="display: flex; width: 100%; margin-bottom: 10px">
        <img class="b_darkergray" style="min-width: 80px; width: 80px; min-height: 80px; height: 80px;
             border-radius: 20px"
             v-bind:src="getImg(chatroom.imgGUID, true)" :alt="'&nbsp;'"/>
        <div class="drop_zone" style="margin-left: 10px" id="drop_zone">Upload a picture!</div>
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
  <!-- #### New Subchat #### -->
  <div class="new_subchat b_gray shadow" style="overflow: hidden"
       v-show="isViewingNewSubchat" @click.stop>
    <div style="position: relative; padding-top: 10px; width: 100%">
      <i class="bi bi-x-lg lead" style="cursor: pointer; position:absolute; right: 0" title="Close"
         v-on:click="hideAllWindows()"></i>
      <h2 class="fw-bold">New Subchat</h2>
      <hr class="c_lightgray">
      <label for="new_subchat_name" class="fw-bold lead c_lightgray">Name:</label>
      <input v-model="new_subchat_name"
             id="new_subchat_name" type="text"
             class="mt-2 b_darkergray text-white p-2 ps-3"
             style="width: 100%; border: none; border-radius: 20px">
      <label class="fw-bold lead mt-4 c_lightgray" style="width: 100%">Create:</label>
      <button v-on:click="createSubchatroom"
              id="new_subchat_type_text" class="btn darkbutton mt-2"
              style="color: white; width: 100%; text-align: left; display: flex; align-items: center; border-radius: 10px">
        <span style="font-size: 200%">#</span>
        <span class="ms-2">
          <span>Text Subchat</span>
          <br>
          <span class="c_lightgray" style="font-size: 80%; font-weight: bold">Messages, GIFs and Files...</span>
        </span>
      </button>
    </div>
  </div>
  <!-- #### File Upload (SnippetBase) #### -->
  <div class="session_settings b_gray shadow" style="overflow-x: hidden; overflow-y: scroll"
       v-show="isUploadingSnippet" @click.stop>
    <div style="position: relative; padding-top: 10px; width: 100%">
      <i class="bi bi-x-lg lead" style="cursor: pointer; position:absolute; right: 0" title="Close"
         v-on:click="closeUploadingSnippet()"></i>
      <h2 class="fw-bold">File Upload</h2>
      <template v-if="uploadFileType !== ''">
        <div style="display: flex; width: 100%; margin-bottom: 10px; margin-top: 5px">
          <img v-if="uploadFileType.includes('image')"
               class="uploadFileSnippet"
               v-bind:src="uploadFileBase64" :alt="'&nbsp;'"/>
          <audio v-else-if="uploadFileType.includes('audio')"
                 controls preload="auto"
                 class="uploadFileSnippet">
            <source :src="uploadFileBase64" :type="uploadFileType">
            Your browser does not support playing audio.
          </audio>
        </div>
      </template>
      <template v-if="uploadFileBase64 === ''">
        <hr class="c_lightgray">
        <div class="drop_zone" id="snippet_drop_zone" style="margin-bottom: 10px">Drop a file here!</div>
        <input type="file" class="file_input" id="snippet_files" name="files[]"
               style="width: 100%"
               multiple v-on:change="handleUploadFileSelect"/>
      </template>
      <div id="confirm_snippet_loading" class="ms-3 mt-3" style="display: none">
        <span class="spinner-grow spinner-grow-sm text-info" role="status" aria-hidden="true"></span>
        <span class="jetb ms-2">Uploading...</span>
      </div>
      <hr class="c_lightgray">
      <div style="width: 100%; display: flex; align-items: center; justify-items: center">
        <button class="btn-outline-light darkbutton text-white"
                style="width: 90%; height: 2.5em; border-color: transparent; border-radius: 1em; margin: auto"
                title="Send"
                v-on:click="addMessage">
          <span class="fw-bold"><i class="bi bi-send"></i> Submit</span>
          <span style="margin-left: 10px" class="c_lightgray"> {{ this.uploadFileType }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { Base64 } from 'js-base64'

export default {
  props: {
    parsed: Object
  },
  data () {
    return {
      chatroom: {},
      subchats: [],
      isSubchat: false,
      currentSubchat: {},
      connection: null,
      // Messages and pagination
      messages: [],
      currentPage: 0,
      pageSize: 20,
      extraSkipCount: 0,
      lazyLoadingStatus: 'idle',
      members: [],
      new_message: '',
      last_message: {},
      gif_query_string: '',
      new_role: '',
      gifSelection: [],
      showInviteCopied: false,
      new_subchat_name: '',
      sendImageButton: null,
      inputField: null,
      uploadFileBase64: '',
      uploadFileType: '',
      // Conditions
      isViewingGIFSelection: false,
      isViewingUserProfile: false,
      isViewingSessionSettings: false,
      isAddingRole: false,
      isEditingRoles: false,
      isViewingNewSubchat: false,
      isUploadingSnippet: false,
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
  },
  mounted () {
    window.addEventListener('resize', this.resizeCanvas, false)
    document.getElementById('messages_section').addEventListener('scroll', this.checkScroll, false)
    this.resizeCanvas()
    setTimeout(() => this.initFunction(), 0)
  },
  methods: {
    initFunction: function () {
      // Generate new token just in case
      this.serverLogin()
      // Are we connecting to a subchat?
      const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop)
      })
      const subchatGUID = params.sub
      if (subchatGUID) {
        this.getClarifierMetaData(this.getSession())
        this.gotoSubchat(subchatGUID)
      } else {
        // Connect to the session
        this.connect()
      }
      // Add message input field events
      const newCommentInput = document.getElementById('new_comment')
      newCommentInput.addEventListener('keydown', this.handleEnter, false)
      newCommentInput.focus()
      // Add dropzone events (settings -> image upload)
      const dropZone = document.getElementById('drop_zone')
      dropZone.addEventListener('dragover', this.handleDragOver, false)
      dropZone.addEventListener('drop', this.handleFileSelectDrop, false)
      const dropZoneSnippet = document.getElementById('snippet_drop_zone')
      dropZoneSnippet.addEventListener('dragover', this.handleDragOver, false)
      dropZoneSnippet.addEventListener('drop', this.handleUploadImageSelectDrop, false)
      this.sendImageButton = document.getElementById('send_image_button')
      this.inputField = document.getElementById('new_comment')
    },
    connect: function (sessionID = this.getSession(), isSubchat = false) {
      this.resetStats()
      this.isSubchat = isSubchat
      // Connect to the chat
      this.connection = new WebSocket('wss://wikiric.xyz/clarifier/' + sessionID)
      this.connection.onopen = () => {
        this.connection.send(this.$store.state.token)
        // Subscribe to notifications
        this.subscribeFCM(sessionID, isSubchat)
      }
      this.connection.onmessage = (event) => {
        this.showMessage(event.data)
      }
      // Get metadata and messages
      this.getClarifierMetaData(sessionID, isSubchat)
      this.getClarifierMessages(false, sessionID)
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
      const message = this.processRawMessage(msg)
      this.messages.unshift(message)
      this.extraSkipCount++
      if ((message.msg).includes('[s:RegistrationNotification]')) {
        this.getClarifierMetaData()
      }
    },
    addMessage: function () {
      const isUploadingSnippet = this.isUploadingSnippet === true && this.uploadFileBase64 !== ''
      if (this.new_message.trim() === '') {
        this.new_message = ''
        if (isUploadingSnippet !== true) return
      }
      // GIF Lookup?
      if (this.new_message.toLowerCase().startsWith('/gif ')) {
        this.getGIF(this.new_message.substring(4))
        this.new_message = ''
        this.focusComment(true)
        setTimeout(() => this.auto_grow('new_comment'), 0)
        return
      }
      // Image Snippet Upload?
      if (isUploadingSnippet === true) {
        this.uploadSnippet()
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
      if (text !== '') this.connection.send(text)
      if (closeGIFSelection) this.isViewingGIFSelection = false
    },
    getClarifierMetaData: function (sessionID = this.getSession(), isSubchat = false) {
      const headers = new Headers()
      headers.set('Authorization', 'Bearer ' + this.$store.state.token)
      fetch(
        this.$store.state.serverIP + '/api/m5/getchatroom/' + sessionID,
        {
          method: 'get',
          headers: headers
        }
      )
        .then((res) => res.json())
        .then((data) => {
          if (isSubchat === false) {
            this.chatroom = data
          }
          // UI Stuff
          setTimeout(() => {
            document.getElementById(this.getSession() + '_subc').classList.remove('active')
            const previousGUID = this.currentSubchat.guid
            if (previousGUID != null) {
              document.getElementById(previousGUID + '_subc').classList.remove('active')
            }
            // Set current subchat
            this.currentSubchat = data
            document.getElementById(this.currentSubchat.guid + '_subc').classList.toggle('active')
          }, 0)
        })
        .then(() => (this.processMetaDataResponse(isSubchat)))
        .catch((err) => console.error(err.message))
    },
    processMetaDataResponse: function (isSubchat = false) {
      if (isSubchat === false) {
        this.$store.commit('addClarifierSession', {
          id: this.chatroom.guid,
          title: this.chatroom.t,
          img: this.getImg(this.chatroom.imgGUID)
        })
      }
      this.members = this.chatroom.members
      document.title = this.chatroom.t
    },
    getClarifierMessages: function (lazyLoad = false, sessionID) {
      let pageIndex = this.currentPage
      if (lazyLoad === true) {
        this.lazyLoadingStatus = 'request'
        pageIndex++
      }
      const headers = new Headers()
      headers.set('Authorization', 'Bearer ' + this.$store.state.token)
      const parameters =
        '?pageIndex=' + pageIndex +
        '&pageSize=' + this.pageSize +
        '&skip=' + this.extraSkipCount
      fetch(
        this.$store.state.serverIP + '/api/m5/getmessages/' + sessionID + parameters,
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
      // Add messages to stack
      if (pageIndex === 0) {
        // Initial loading
        this.messages = []
        data.messages.reverse().forEach(element => this.messages.unshift(this.processRawMessage(element)))
      } else {
        // Lazy loading
        const tempArray = []
        data.messages.reverse().forEach(element => tempArray.unshift(this.processRawMessage(element)))
        tempArray.forEach(element => this.messages.push(element))
      }
      if (lazyLoad) {
        this.currentPage++
        this.lazyLoadingStatus = 'idle'
      }
    },
    processRawMessage: function (msg) {
      // Deserialize
      const message = JSON.parse(msg)
      // Process timestamp
      message.time = new Date(message.ts)
      /* Do we have to add a message header?
      Don't add a header (avatar, name) if the last message came from the same source and similar time
       */
      message.header = true
      if (this.last_message.src === message.src) {
        // If the sources are identical, check if the time was similar
        let timeDiff = message.time.getTime() - this.last_message.time.getTime()
        timeDiff = (Math.abs((timeDiff) / 1000) / 60)
        // If the message is 5 minutes or older put the message header
        message.header = timeDiff >= 5
      }
      this.last_message = message
      return message
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
      this.hideAllWindows()
      this.isViewingGIFSelection = !this.isViewingGIFSelection
      if (this.isViewingGIFSelection) {
        const gifInput = document.getElementById('gif_query')
        setTimeout(() => gifInput.focus(), 0)
      }
    },
    toggleUploadingSnippet: function () {
      this.hideAllWindows()
      this.isUploadingSnippet = !this.isUploadingSnippet
    },
    showNewSubchatWindow: function () {
      this.hideAllWindows()
      this.isViewingNewSubchat = true
      const subchatName = document.getElementById('new_subchat_name')
      setTimeout(() => subchatName.focus(), 0)
    },
    showUserProfile: function (user) {
      this.hideAllWindows()
      this.isViewingUserProfile = true
      this.viewedUserProfile = user
    },
    hideAllWindows: function () {
      this.isViewingUserProfile = false
      this.isViewingGIFSelection = false
      this.isUploadingSnippet = false
      this.hideSessionSettings()
      this.hideNewSubchatWindow()
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
    hideNewSubchatWindow: function () {
      this.isViewingNewSubchat = false
      this.new_subchat_name = ''
    },
    toggleSidebar: function () {
      document.getElementById('sidebar').classList.toggle('active')
      const memberSidebar = document.getElementById('member_section')
      memberSidebar.classList.remove('active')
    },
    toggleSidebar2: function () {
      document.getElementById('sidebar2').classList.toggle('active')
      const memberSidebar = document.getElementById('member_section')
      memberSidebar.classList.remove('active')
    },
    toggleMemberSidebar: function () {
      document.getElementById('member_section').classList.toggle('active')
      const sidebar = document.getElementById('sidebar')
      sidebar.classList.remove('active')
    },
    auto_grow: function () {
      this.sendImageButton.classList.toggle('active', (this.new_message !== '')) // Inverted
      this.inputField.style.height = '2.5em'
      this.inputField.style.height = (this.inputField.scrollHeight) + 'px'
    },
    resizeCanvas: function () {
      if (window.innerWidth >= 1100) {
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
      if (window.innerWidth < 1100) {
        this.hideSidebar()
        this.hideSidebar2()
        this.hideMemberSidebar()
      }
      this.isViewingGIFSelection = false
    },
    handleEnter: function () {
      if (event.code === 'Enter') {
        event.preventDefault()
        this.addMessage()
      }
    },
    closeModals: function () {
      this.hideUserProfile()
      this.hideNewSubchatWindow()
    },
    handleFileSelectDrop: function (evt) {
      this.handleFileSelect(evt, true)
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
    handleUploadImageSelectDrop: function (evt) {
      this.handleUploadFileSelect(evt, true)
    },
    handleUploadFileSelect: async function (evt, drop = false) {
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
      this.toggleElement('confirm_snippet_loading', 'flex')
    },
    handleDragOver: function (evt) {
      evt.stopPropagation()
      evt.preventDefault()
      evt.dataTransfer.dropEffect = 'copy'
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
      const elem = document.getElementById(id)
      if (elem.style.display === display) {
        elem.style.display = 'none'
      } else {
        elem.style.display = display
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
      this.getClarifierMessages(true, this.currentSubchat.guid)
    },
    createSubchatroom: function () {
      if (this.new_subchat_name.trim() === '') {
        this.new_subchat_name = ''
        return
      }
      const headers = new Headers()
      headers.set('Authorization', 'Bearer ' + this.$store.state.token)
      const mainSessionGUID = this.getSession()
      fetch(
        this.$store.state.serverIP + '/api/m5/createchatroom?parent=' + mainSessionGUID,
        {
          method: 'post',
          headers: headers,
          body: JSON.stringify({
            title: this.new_subchat_name.trim()
          })
        }
      )
        .then((res) => res.json())
        .then((data) => (this.gotoSubchat(data.guid)))
        .then(() => (this.getClarifierMetaData(mainSessionGUID)))
        .then(() => (this.hideNewSubchatWindow()))
        .catch((err) => console.error(err.message))
    },
    gotoSubchat: function (subchatGUID, subchatMode = true) {
      if (!subchatGUID) return
      if (subchatMode) {
        this.$router.replace({
          path: '/apps/clarifier/wss/' + this.getSession(),
          query: { sub: subchatGUID }
        })
      } else {
        this.$router.replace({
          path: '/apps/clarifier/wss/' + this.getSession()
        })
      }
      this.disconnect()
      this.connect(subchatGUID, subchatMode)
      this.hideAllSidebars()
    },
    disconnect: function () {
      if (this.connection == null) return
      this.connection.close()
    },
    resetStats: function () {
      // Reset session specific stats
      this.currentPage = 0
      this.extraSkipCount = 0
      this.lazyLoadingStatus = 'idle'
      this.last_message = {}
    },
    uploadSnippet: function () {
      this.toggleElement('confirm_snippet_loading', 'flex')
      const headers = new Headers()
      headers.set('Authorization', 'Bearer ' + this.$store.state.token)
      const content = JSON.stringify({
        type: this.uploadFileType,
        payload: this.uploadFileBase64
      })
      fetch(
        this.$store.state.serverIP + '/api/m6/create',
        {
          method: 'post',
          headers: headers,
          body: content
        }
      )
        .then((res) => res.json())
        .then((data) => (this.processUploadSnippetResponse(data)))
        .catch((err) => (this.handleUploadSnippetError(err.message)))
    },
    handleUploadSnippetError: function (errorMessage = '') {
      this.toggleElement('confirm_snippet_loading', 'flex')
      console.error(errorMessage)
      this.$notify(
        {
          title: 'Image not uploaded',
          text: 'An Error occurred while uploading the file.',
          type: 'error'
        })
    },
    processUploadSnippetResponse: function (response) {
      if (response.httpCode !== 201) {
        this.handleUploadSnippetError()
        return
      }
      let prefix = '[c:IMG]'
      if (this.uploadFileType.includes('audio')) prefix = '[c:AUD]'
      // Add the link as a message, so it shows up in the chat
      this.addMessagePar(prefix + this.$store.state.serverIP + '/m6/get/' + response.guid)
      // Post the new_message content in case the user has written a comment
      this.addMessagePar(this.new_message)
      this.uploadFileBase64 = ''
      this.uploadFileType = ''
      this.new_message = ''
      this.toggleElement('confirm_snippet_loading', 'flex')
      this.hideAllWindows()
      this.auto_grow()
    },
    openURL: function (url) {
      window.open(url, '_blank').focus()
    },
    closeUploadingSnippet: function () {
      this.hideAllWindows()
      this.uploadFileBase64 = ''
      this.uploadFileType = ''
    }
  }
}
</script>

<style scoped>

.b_purple {
  background-color: #68349b;
}

.c_purple {
  color: #68349b;
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
.session_settings,
.new_subchat {
  position: fixed;
  z-index: 1001;
  bottom: 58px;
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
  text-wrap: normal;
  word-wrap: break-word;
  margin-left: 42px;
  padding: 8px;
  background-color: #192129;
  border-radius: 20px;
  text-align: center;
  color: #aeaeb7;
  font-weight: bold;
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
  opacity: 0;
  width: 0;
  height: 100vh;
  position: fixed;
  z-index: 999;
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
  border-right: 2px solid rgba(174, 174, 183, 0.25);
  opacity: 1;
}

.sidebar.active ~ .sidebar2.active {
  left: 250px;
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

@media only screen and (max-width: 1099px) {
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

@media only screen and (min-width: 1100px) {
  .sb_toggler {
    display: none;
  }

  .member_section_toggler {
    pointer-events: none;
    opacity: 0.5;
  }

  .clarifier_chatroom {
    width: calc(100% - 750px);
    left: 500px;
  }

  .sidebar.active .sidebar_bg {
    border-radius: 0 140px 0 0;
  }

  .user_profile,
  .giphygrid,
  .session_settings,
  .new_subchat {
    transform: translateX(-250px);
  }
}

.sb_toggler {
  position: absolute;
  width: 30px;
  right: 11px;
  top: 4px;
  color: white;
  font-size: 150%;
}

.member_section_toggler {
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

.sb_fold {
  height: 0;
  transition: ease-in-out height 0.2s;
}

.sidebar.active .sb_link_text {
  opacity: 1;
}

.sidebar.active .sb_fold {
  height: 35px;
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
  text-align: center;
  color: #bbb;
  width: 100%;
  cursor: default;
}

.drop_zone:hover {
  color: #ff5d37;
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
  border-bottom: 2px solid rgba(174, 174, 183, 0.25)
}

.subchat {
  display: flex;
  align-items: center;
  padding-left: 20px;
  width: 90%;
  border-radius: 10px;
  cursor: pointer;
}

.subchat.active {
  background-color: #192129;
}

.subchat.active span {
  color: white;
}

.nopointer {
  pointer-events: none;
}

.darkbutton {
  background-color: #192129;
}

.darkbutton:hover {
  background-color: #101010;
}

.message {
  color: white;
  padding: 5px 25px 5px 15px;
}

.message:hover {
  background-color: #1c1c1c;
}

.clientMessage {
  text-wrap: normal;
  word-wrap: break-word;
  padding-left: 42px
}

.send_image_button.active {
  pointer-events: none;
  opacity: 0;
  transition: ease all 0.2s;
}

.uploadFileSnippet {
  min-width: 50px;
  max-width: 90%;
  min-height: 50px;
  max-height: 250px;
  margin: auto;
}

</style>
