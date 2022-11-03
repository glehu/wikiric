<template>
  <div style="height: 100vh" class="b_darkergray"
       :style="{
                backgroundImage: 'url('+require('@/assets/'+'account/BigBlur.webp')+')',
                backgroundPosition: 'center center', backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }">
    <div class="bg-neutral-900 bg-opacity-70 fixed top-0 left-0 w-full h-full">
      <div id="sidebar" class="sidebar"
           style="height: 100vh; z-index: 1000">
        <div class="header-margin" style="box-shadow: none"></div>
        <div style="height: calc(100vh - 60px)"
             class="sidebar_bg">
          <!-- #### Tools #### -->
          <div style="height: 140px; overflow-x: clip; position: relative">
            <div style="width: 100%; height: 35px; padding-top: 10px">
              <span class="sb_link_text c_lightgray nopointer">Menu</span>
            </div>
            <button class="sb_toggler btn-no-outline" v-on:click="toggleSidebar">
              <i class="bi bi-caret-right c_lightgray"></i>
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
              <li style="opacity: 0.5">
                <div class="sb_link nopointer">
                  <div class="c_lightgray">
                    <i class="sb_link_icon bi bi-tools"></i>
                    <span class="sb_link_text">Settings</span>
                  </div>
                  <span class="sidebar_tooltip">Settings</span>
                </div>
              </li>
            </ul>
          </div>
          <!-- #### GROUPS #### -->
          <div style="width: 100%; position: relative; z-index: 3"
               class="sb_fold">
            <hr class="c_lightgray"
                style="width: 75%; margin: auto auto 10px;">
            <span class="sb_link_text c_lightgray nopointer">
            Groups&nbsp;-&nbsp;{{ this.$store.state.clarifierSessions.length }}
          </span>
          </div>
          <div id="channel_section" class="channel_section"
               style="height: calc(100% - 60px - 100px); width: 100%; z-index: 4;
                    color: white; overflow-y: auto; overflow-x: clip;
                    padding-bottom: 20px; margin-top: 10px">
            <div v-for="group in this.$store.state.clarifierSessions" :key="group"
                 class="channel_link"
                 style="position: relative; font-weight: bold; font-size: 125%">
              <a class="fw-bold text-white orange-hover" style="text-decoration: none"
                 :href="'/apps/clarifier/wss/' + group.id">
                <div class="c_lightgray orange-hover"
                     style="height: 50px; display: flex; align-items: center;">
                  <div style="width: 50px; height: 100%; position: relative;
                            display: flex; align-items: center; justify-content: center;">
                    <div v-if="group.id === chatroom.guid"
                         style="position: absolute; height: 20px; width: 5px; left: 0;
                            border-radius: 5px;
                            background-color: forestgreen; z-index: 5">
                    </div>
                    <img class="b_darkergray"
                         style="border-radius: 10px; margin-left: 1px;
                              width: 40px; height: 40px; z-index: 6"
                         v-bind:src="getImg(group.img,true)"
                         :alt="'&nbsp;&nbsp;' + group.title.substring(0,1)"/>
                  </div>
                  <span class="sb_link_text text-nowrap"
                        style="position: absolute; left: 36px;">
                  {{ group.title }}
                </span>
                </div>
              </a>
              <span class="channel_tooltip">{{ group.title }}</span>
            </div>
          </div>
        </div>
      </div>
      <div id="sidebar2" style="margin-top: 60px"
           class="sidebar2 border-l border-l-[rgba(174,174,183,0.25)] bg-neutral-900 bg-opacity-60">
        <div style="height: calc(100vh - 60px); position: relative; padding-left: 23px">
          <!-- #### SUBCHATS #### -->
          <div style="height: calc(100% - 120px); overflow-y: auto; overflow-x: clip"
               class="c_lightgray">
            <div style="height: 50px; align-items: center; display: flex">
              <div :id="this.getSession() + '_subc'" class="subchat orange-hover"
                   v-on:click="gotoSubchat(this.getSession(), false)">
                <i v-show="hasUnread(this.getSession())" :id="this.getSession() + '_notify'"
                   class="bi bi-chat-quote-fill" style="position: absolute; left: 20px"></i>
                <span style="font-size: 150%"><i class="bi bi-hash"></i></span>
                <span style="padding-left: 10px">General</span>
              </div>
            </div>
            <div style="width: 100%; height: 35px; padding-top: 5px;
                      display: flex; position: relative; align-items: center">
              <span class="fw-bold c_lightgray nopointer">Subchats</span>
              <button class="text-white btn-no-outline"
                      style="position: absolute; right: 20px"
                      title="New Subchat"
                      v-on:click="showNewSubchatWindow">
                <i class="bi bi-plus lead orange-hover c_lightgray" style="font-size: 150%"></i>
              </button>
            </div>
            <div v-for="subchat in this.chatroom.subChatrooms" :key="subchat"
                 :id="subchat.guid + '_subc'"
                 class="subchat orange-hover"
                 style="display: flex"
                 v-on:click="gotoSubchat(subchat.guid)">
              <i v-show="hasUnread(subchat.guid)" :id="subchat.guid + '_notify'"
                 class="bi bi-chat-quote-fill" style="position: absolute; left: 20px"></i>
              <span v-if="subchat.type === 'screenshare'"
                    style="font-size: 150%"><i class="bi bi-window-fullscreen"></i></span>
              <span v-else-if="subchat.type === 'webcam'"
                    style="font-size: 150%"><i class="bi bi-camera-video"></i></span>
              <span v-else style="font-size: 150%"><i class="bi bi-hash"></i></span>
              <span style="padding-left: 10px">{{ subchat.t }}</span>
            </div>
            <!-- #### Clarifier Rank Benefits ####-->
            <template v-if="this.chatroom.rank > 1">
              <div style="width: calc(100% - 20px);
                        position: absolute; bottom: 20px;
                        border: 1px solid rgba(174, 174, 183, 0.25);
                        border-radius: 20px 0 0 20px">
                <template v-if="this.chatroom.rank > 3">
                  <div style="height: 40px"
                       class="subchat w-full flex items-center orange-hover"
                       v-on:click="this.$router.push('/apps/plannernew?src=' + this.getSession())">
                    <ViewColumnsIcon class="h-5 w-5"></ViewColumnsIcon>
                    <span style="padding-left: 10px">Planner</span>
                  </div>
                </template>
                <template v-if="this.chatroom.rank > 2">
                  <div style="height: 40px"
                       class="subchat w-full flex items-center orange-hover"
                       v-on:click="this.$router.push('/apps/knowledge?src=' + this.getSession())">
                    <BookOpenIcon class="h-5 w-5"></BookOpenIcon>
                    <span style="padding-left: 10px">Knowledge</span>
                  </div>
                </template>
                <div style="height: 40px"
                     class="subchat w-full flex items-center orange-hover"
                     v-on:click="isViewingBadges = true">
                  <TrophyIcon class="h-5 w-5"></TrophyIcon>
                  <span style="padding-left: 10px">Badges</span>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
      <div class="clarifier_chatroom"
           style="display: flex; height: 100%; overflow-y: clip; overflow-x: clip"
           v-on:click="closeModals">
        <div id="chat_section" class="chat_section h-full w-full mt-[60px] overflow-hidden bg-neutral-900">
          <!-- #### CHAT HEADER #### -->
          <div class="chat_header bg-neutral-900">
            <div
              style="width: calc(100% - 130px); overflow-x: clip; display: flex; font-size: 80%; align-items: center">
              <div style="margin-left: 10px"
                   class="orange-hover"
                   v-on:click="gotoSubchat(this.getSession(), false)">
                {{ chatroom.t }}
              </div>
              <div v-if="isSubchat === true" class="nopointer">
                <span style="margin-left: 10px"><i class="bi bi-caret-right"></i></span>
                <span v-if="currentSubchat.type === 'screenshare'"
                      style="margin-left: 10px">
                <i class="bi bi-window-fullscreen"></i>
              </span>
                <span v-else-if="currentSubchat.type === 'webcam'"
                      style="margin-left: 10px">
                <i class="bi bi-camera-video"></i>
              </span>
                <span v-else style="margin-left: 10px">
                <i class="bi bi-hash"></i>
              </span>
                <span style="margin-left: 10px">{{ currentSubchat.t }}</span>
              </div>
              <div v-if="isStreamingVideo"
                   id="stream_nav"
                   class="text-xl flex items-center ml-6">
                <h2 class="fw-bold text-neutral-300">
                  {{ streamDuration }}
                </h2>
                <button v-on:click="stopScreenshare"
                        class="btn btn-sm gray-hover c_lightgray ml-6"
                        style="border: 1px solid rgba(255,0,0,0.5);
                             border-radius: 10px;">
                  <span style="font-weight: bold">Hang Up</span>
                </button>
              </div>
            </div>
            <button class="btn-no-outline c_lightgray"
                    style="position: absolute; right: 90px"
                    title="Show Settings"
                    v-on:click="toggleSessionSettings">
              <i class="sb_link_icon bi bi-wrench orange-hover" style="height: 25px; width: 25px"></i>
            </button>
            <button class="btn-no-outline c_lightgray member_section_toggler"
                    style="position: absolute; right: 50px"
                    title="Show Subchats"
                    v-on:click="toggleSidebar2">
              <i class="sb_link_icon bi bi-chat-square-dots orange-hover"
                 style="height: 25px; width: 25px"></i>
            </button>
            <button class="btn-no-outline c_lightgray member_section_toggler"
                    style="position: absolute; right: 10px"
                    title="Show Members"
                    v-on:click="toggleMemberSidebar">
              <i class="bi bi-people orange-hover" style="height: 25px; width: 25px"></i>
            </button>
          </div>
          <div v-if="this.isSubchat === true &&
                     (this.currentSubchat.type === 'screenshare' || this.currentSubchat.type === 'webcam')"
               style="width: calc(100% - 350px);
                      height: calc(100vh - 60px - 50px - 80px);
                      position: absolute; left: 350px;
                      border-bottom: 1px solid rgba(174, 174, 183, 0.25);
                      padding: 0;
                      display: flex"
               class="c_lightgray">
            <div style="position: relative; top: 0; left: 0;
                        width: 100%;
                        aspect-ratio: 16 / 9"
                 class="b_darkergray flex">
              <div v-if="!isStreamingVideo"
                   class="d-flex"
                   style="pointer-events: none;
                          position: absolute;
                          width: 100%; height: 100%;
                          align-items: center; justify-content: center;
                          background-color: rgba(19,19,19,0.75)">
                <i class="bi bi-camera-video-off lead"></i>
                <p style="margin: 0 0 0 10px;
                        padding-left: 10px;
                        border-left: 1px solid rgba(174, 174, 183, 0.25)">
                  OFFLINE
                  <br>
                  <span style="font-size: 75%">
                  Start sharing or wait for
                  <br>somebody to start the stream.
                </span>
                </p>
              </div>
              <template v-if="currentSubchat.type === 'screenshare'">
                <video id="screenshare_video" muted autoplay playsinline
                       style="width: 100%; height: 100%"></video>
              </template>
              <template v-else-if="currentSubchat.type === 'webcam'">
                <video id="screenshare_video" muted autoplay playsinline
                       style="width: 50%; height: 100%"></video>
                <video id="screenshare_video_remote" muted autoplay playsinline
                       style="width: 50%; height: 100%"></video>
              </template>
            </div>
            <div v-if="!isStreamingVideo && (this.currentSubchat.type === 'webcam')"
                 style="position: absolute; bottom: 10px; left: 0"
                 class="text-end flex items-center justify-center w-full text-neutral-400">
              <div class="p-2 text-neutral-400 gray-hover"
                   v-on:click="startScreenshare(undefined, {video: false, audio: true})">
                <PhoneIcon class="h-8 w-8"></PhoneIcon>
              </div>
              <div class="p-2 text-neutral-400 gray-hover"
                   v-on:click="startScreenshare(undefined, {video: true, audio: false})">
                <VideoCameraIcon class="h-8 w-8"></VideoCameraIcon>
              </div>
            </div>
            <div v-if="!isStreamingVideo && (this.currentSubchat.type === 'screenshare')"
                 style="position: absolute; top: 10px; right: 10px" class="text-end">
              <button v-on:click="startScreenshare()"
                      class="btn btn-sm gray-hover
                           c_lightgray"
                      style="position: relative;
                             margin-left: 20px; margin-top: 10px;
                             border: 1px solid #ff5d37;
                             border-radius: 10px;">
                Group Meeting
              </button>
              <br>
              <template v-for="user in this.members" :key="user">
                <template v-if="user.id !== userId">
                  <button v-on:click="startScreenshare(user.id)"
                          class="btn btn-sm gray-hover
                           c_lightgray"
                          style="position: relative;
                           margin-left: 20px; margin-top: 10px;
                           border: 1px solid rgba(174, 174, 183, 0.25);
                           border-radius: 10px;">
                    Call {{ user.usr }}
                  </button>
                  <br>
                </template>
              </template>
            </div>
          </div>
          <!-- #### MESSAGES #### -->
          <div id="messages_section"
               class="messages_section bg-neutral-900 relative"
               style="overflow-y: auto; overflow-x: clip;
                    height: calc(100vh - 60px - 50px - 80px);
                    display: flex; flex-direction: column-reverse">
            <div id="init_loading" style="display: none">
              <span class="spinner-border c_orange" role="status" aria-hidden="true"></span>
              <span class="ms-2 fw-bold c_lightgray">Initializing...</span>
            </div>
            <div id="loading" style="display: none">
              <span class="spinner-border c_orange" role="status" aria-hidden="true"></span>
              <span class="ms-2 fw-bold c_lightgray">Connecting...</span>
            </div>
            <template v-for="msg in messages" :key="msg.gUID">
              <div class="message" :id="msg.gUID">
                <!-- Chat Avatar and Date-->
                <template v-if="msg.header === true">
                  <div style="position: relative;
                            display: flex;
                            height: 30px;
                            align-items: center"
                       class="mt-2">
                    <i v-if="msg.src.startsWith('_server')" class="sender_avatar bi bi-broadcast"></i>
                    <i v-else class="sender_avatar bi bi-person-circle"></i>
                    <template v-if="msg.iurl !== ''">
                      <img :src="getImg(msg.iurl, true)" alt="?"
                           class="b_darkergray"
                           style="width: 42px; height: 42px; border-radius: 100%;
                                position: absolute; top: 8px; left: -7px">
                    </template>
                    <span class="orange-hover text-neutral-200"
                          style="font-weight: bold"
                          @click.stop="showUserProfileFromName(msg.src)">
                    {{ msg.src }}
                  </span>
                    <div style="color: gray; font-size: 80%; padding-left: 10px">
                    <span style="pointer-events: none">
                      {{ msg.time.toLocaleString('de-DE').replace(' ', '&nbsp;') }}
                    </span>
                      <template v-if="msg.isEncrypted === true">
                        <i v-if="msg.decryptionFailed === false" class="bi bi-shield-lock ms-1"
                           title="Decrypted Message"></i>
                        <i v-else class="bi bi-exclamation-triangle-fill ms-1"
                           title="Decryption Error Occurred"></i>
                      </template>
                      <template v-if="msg.tagActive === true">
                        <i class="bi bi-at ms-1 c_orange" title="You got tagged!"></i>
                      </template>
                      <template v-if="msg.apiResponse === true">
                        <i class="bi bi-gear ms-1 c_orange" title="API Response"></i>
                        <span style="pointer-events: none" class="ms-1">
                        {{ msg.mType }}
                      </span>
                      </template>
                    </div>
                  </div>
                </template>
                <div class="message_body" style="width: 100%; display: flex; position: relative">
                  <div style="min-width: 42px; max-width: 42px">
                    <template v-if="msg.header === false">
                      <div class="msg_time" style="pointer-events: none">
                        {{ msg.time.toLocaleTimeString('de-DE').substring(0, 5).replace(' ', '&nbsp;') }}
                      </div>
                    </template>
                  </div>
                  <template v-if="msg.tagActive === true">
                    <div style="position: absolute; height: 100%; width: 5px; left: -15px;
                       border-radius: 5px; z-index: 5; box-shadow: 0 0 15px 0 #ff5d37"
                         class="b_orange">
                    </div>
                  </template>
                  <!-- #### MESSAGE OPTIONS #### -->
                  <div v-if="msg.mType !== 'CryptError' && !msg.src.startsWith('_server')" class="msg_options">
                    <div class="b_darkgray rounded mr-1">
                      <!--
                      <button title="Reply" class="btn btn-sm c_lightgray orange-hover">
                        <i class="bi bi-reply-fill"></i>
                      </button>
                      -->
                      <template v-if="msg.editable === true">
                        <button title="Edit" class="btn btn-sm c_lightgray orange-hover"
                                v-on:click="editMessage(msg)">
                          <i class="bi bi-pencil-fill"></i>
                        </button>
                        <button title="Remove" class="btn btn-sm c_lightgray orange-hover"
                                v-on:click="editMessage(msg, true)">
                          <i class="bi bi-trash-fill"></i>
                        </button>
                      </template>
                    </div>
                    <div class="b_darkgray rounded mr-1">
                      <button title="Upvote" class="btn btn-sm c_lightgray orange-hover"
                              v-on:click="reactToMessage(msg, '+')">
                        <i class="bi bi-hand-thumbs-up"></i>
                      </button>
                      <button title="Downvote" class="btn btn-sm c_lightgray orange-hover"
                              v-on:click="reactToMessage(msg, '-')">
                        <i class="bi bi-hand-thumbs-down"></i>
                      </button>
                    </div>
                    <div class="b_darkgray rounded mr-1">
                      <button title="Awesome!" class="btn btn-sm c_lightgray orange-hover"
                              v-on:click="reactToMessage(msg, '⭐')">
                        <i class="bi bi-star-fill"></i>
                      </button>
                    </div>
                  </div>
                  <!-- #### LOGIN NOTIFICATION MESSAGE #### -->
                  <template v-if="msg.mType === 'RegistrationNotification'">
                    <div class="serverMessage">
                      {{ msg.msg.trim() }}
                    </div>
                  </template>
                  <template v-else-if="msg.mType === 'CryptError'">
                    <div class="serverMessage">
                      {{ msg.msg.trim() }}
                    </div>
                  </template>
                  <template v-else-if="msg.mType === 'Leaderboard'">
                    <div class="serverMessage" style="height: fit-content">
                      <h4 style="font-weight: normal; border-radius: 15px; padding: 5px; margin-bottom: 10px"
                          class="b_darkergray nopointer">
                        <i class="bi bi-award"></i>
                        Leaderboard
                        <i class="bi bi-award"></i>
                      </h4>
                      <table class="table-borderless leaderboard-table text-start"
                             style="width: 100%; height: 100%; padding: 5px">
                        <tr style="pointer-events: none;
                                 height: 2ch;
                                 border-bottom: 1px solid #7e7d7d">
                          <th>Username</th>
                          <th>Messages</th>
                          <th>Rating</th>
                        </tr>
                        <tr v-for="member in JSON.parse(msg.msg)" :key="member"
                            style="font-weight: normal">
                          <td>{{ member.username }}</td>
                          <td>{{ member.messages }}</td>
                          <td>{{ member.totalRating }}</td>
                        </tr>
                      </table>
                      <div style="font-size: 75%; margin: 20px 10px 10px 10px;
                                font-style: italic; opacity: 0.5"
                           class="nopointer">
                        - Thank you for participating -
                      </div>
                    </div>
                  </template>
                  <!-- #### CLIENT GIF MESSAGE #### -->
                  <template v-else-if="msg.mType === 'GIF'">
                    <div class="clientMessage">
                      <img :src="msg.msg" :alt="msg.msg"
                           :style="{maxWidth: mediaMaxWidth}">
                      <br>
                      <div>
                        <img src="../../assets/giphy/PoweredBy_200px-Black_HorizText.png"
                             alt="Powered By GIPHY"
                             style="width: 100px"/>
                      </div>
                    </div>
                  </template>
                  <!-- #### CLIENT IMAGE (SnippetBase) #### -->
                  <template v-else-if="msg.mType === 'Image'">
                    <div class="clientMessage">
                      <img :src="msg.msg"
                           :alt="msg.msg"
                           style="cursor: zoom-in"
                           :style="{maxWidth: mediaMaxWidth}"
                           v-on:click="openURL(msg.msg)">
                    </div>
                  </template>
                  <!-- #### CLIENT AUDIO (SnippetBase) #### -->
                  <template v-else-if="msg.mType === 'Audio'">
                    <div class="clientMessage">
                      <audio controls preload="auto"
                             class="uploadFileSnippet">
                        <source :src="msg.msg">
                        Your browser does not support playing audio.
                      </audio>
                    </div>
                  </template>
                  <!-- #### CLIENT MESSAGE #### -->
                  <template v-else-if="msg.mType === 'Joke'">
                    <p class="clientMessage">
                      {{ msg.msg }}
                    </p>
                  </template>
                  <!-- #### CLIENT MESSAGE #### -->
                  <template v-else>
                    <Markdown :id="'msg_' + msg.gUID"
                              class="clientMessage"
                              :source="msg.msg"
                              :breaks="true"
                              :plugins="plugins"/>
                  </template>
                </div>
                <div v-if="msg.reacts.length > 0"
                     style="display: flex; margin: 10px 0 0 42px">
                  <div v-for="reaction in msg.reacts" :key="reaction.src"
                       style="display: flex; padding: 2px 4px 2px 4px; margin-right: 4px; border-radius: 5px"
                       class="b_darkgray c_lightgray gray-hover"
                       :title="reaction.src.toString() + ' reacted to this message.'"
                       v-on:click="reactToMessage(msg, reaction.t)"
                       :id="'react_' + msg.gUID + '_' + reaction.t">
                    <i v-if="reaction.t === '+'"
                       class="bi bi-hand-thumbs-up" style="margin-right: 2px"></i>
                    <i v-else-if="reaction.t === '-'"
                       class="bi bi-hand-thumbs-down" style="margin-right: 2px"></i>
                    <span v-else> {{ reaction.t }} </span>
                    {{ reaction.src.length }}
                  </div>
                </div>
                <div :id="'edit_' + msg.gUID" class="hidden w-full justify-center">
                  <div class="text-sm p-2 bg-neutral-900 rounded mt-2 mb-1 text-center flex items-center">
                    <div class="ml-2 mr-4 text-neutral-400 pointer-events-none">
                      Edit
                    </div>
                    <div class="flex py-1 px-2 bg-blue-600 bg-opacity-20 rounded">
                      <div v-on:click="this.addMessage()" class="text-white cursor-pointer mr-1 font-bold">
                        [Enter]
                      </div>
                      <div class="mr-1 text-neutral-300 pointer-events-none">to save,</div>
                      <div v-on:click="this.resetEditing()" class="text-white cursor-pointer mr-1 font-bold">
                        [Esc]
                      </div>
                      <span class="text-neutral-300 pointer-events-none">to cancel.</span>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </div>
          <!-- #### USER INPUT FIELD #### -->
          <div style="display: inline-flex;
                      width: 100%;
                      min-height: 80px;
                      position: relative;
                      bottom: 0;
                      padding-bottom: 20px;
                      flex-direction: column-reverse"
               class="bg-neutral-900">
            <button class="c_lightgray text-center scroll_to_bottom orange-hover"
                    id="scroll_to_bottom"
                    v-on:click="scrollToBottom">
              <i class="bi bi-arrow-down"></i>
              Click to jump to the newest messages
              <i class="bi bi-arrow-down"></i>
            </button>
            <div style="bottom: 0; left: 10px; opacity: 1"
                 class="scroll_to_bottom flex items-center px-1 overflow-hidden">
              <template v-if="userActivity.length > 0">
                <ChartBarIcon class="h-3 w-3 text-neutral-400"></ChartBarIcon>
                <div class="flex items-center divide-x divide-neutral-600">
                  <template v-for="user in userActivity" :key="user">
                    <div class="px-2">
                  <span class="text-neutral-400 cursor-pointer hover:text-white font-normal"
                        @click.stop="showUserProfileFromName(user.user)">
                    {{ user.user }}
                  </span>
                    </div>
                  </template>
                </div>
              </template>
              <template v-if="userActivityIdle.length > 0">
                <EyeIcon class="h-3 w-3 text-neutral-500"></EyeIcon>
                <div class="flex items-center divide-x divide-neutral-600">
                  <template v-for="user in userActivityIdle" :key="user">
                    <div class="px-2">
                  <span class="text-neutral-500 cursor-pointer hover:text-white font-normal"
                        @click.stop="showUserProfileFromName(user.user)">
                    {{ user.user }}
                  </span>
                    </div>
                  </template>
                </div>
              </template>
            </div>
            <div v-if="isTaggingUser"
                 class="user_tagger b_gray c_lightgray"
                 style="padding: 10px; position: relative; z-index: 100">
              <h6 style="pointer-events: none">Tag a member:</h6>
              <div v-for="(usr, index) in this.members" :key="usr"
                   class="gray-hover"
                   :class="{'active_gray': index === this.tagIndex}"
                   style="position: relative; display: flex; align-items: center"
                   v-on:click="tagUserProfile(usr)">
                <template v-if="usr.taggable === true">
                  <i class="bi bi-at"
                     style="font-size: 200%">
                  </i>
                  <span style="font-weight: bold; margin-left: 5px"> {{ usr.usr }} </span>
                </template>
              </div>
            </div>
            <div v-if="isSelectingImgflipTemplate"
                 class="imgflip_selector b_gray c_lightgray"
                 style="padding: 10px; position: relative; z-index: 100">
              <h6 style="pointer-events: none">Select an Imgflip meme template:</h6>
              <template v-for="(template, index) in this.imgflipSelection" :key="template">
                <div v-if="template.selectable !== false"
                     class="gray-hover mb-3"
                     :class="{'active_gray': index === this.tagIndex}"
                     style="position: relative; display: flex; align-items: center"
                     v-on:click="selectImgflipTemplate(template)">
                  <img :src="template.url" alt="Loading" class="selectableGIF"
                       style="width: 100px; max-height: 100px">
                  <p style="margin-left: 10px; font-size: 75%">
                    {{ template.name }}
                  </p>
                </div>
              </template>
            </div>
            <div v-if="isFillingImgflipTemplate.active"
                 class="imgflip_selector b_gray c_lightgray"
                 style="padding: 10px; position: relative; z-index: 100; overflow: hidden">
              <div class="imgflip_toolbar b_darkergray"
                   style="display: flex; width: fit-content; align-items: center; padding: 5px;
                        border-radius: 12px">
                <button id="imgflip_toolbar_boxtools_toggler"
                        title="Box Mode"
                        class="btn b_darkgray gray-hover c_lightgray"
                        style="border-radius: 10px"
                        v-on:click="toggleImgflipBoxMode">
                  <i class="bi bi-pencil" style="font-size: 125%;"></i>
                </button>
                <div id="imgflip_toolbar_boxtools"
                     style="display: flex; opacity: 0; transition: 0.5s ease opacity">
                  <template v-if="this.isFillingImgflipTemplate.mode === 'boxes'">
                    <div class="c_darkgray ms-2 fw-bold"
                         style="font-size: 150%; pointer-events: none">
                      |
                    </div>
                    <button title="Add Text Box"
                            class="btn b_darkgray gray-hover c_lightgray ms-2"
                            style="border-radius: 10px"
                            v-on:click="addImgflipTextBox()">
                      <i class="bi bi-plus-lg" style="font-size: 125%;"></i>
                    </button>
                    <button title="Reset"
                            class="btn b_darkgray gray-hover c_lightgray ms-2"
                            style="border-radius: 10px"
                            disabled>
                      <i class="bi bi-arrow-counterclockwise" style="font-size: 125%;"></i>
                    </button>
                    <button title="Send"
                            class="btn golden-hover golden-hover c_lightgray ms-2"
                            style="border-radius: 10px"
                            v-on:click="sendImgflipBoxes()">
                      <i class="bi bi-send text-black"
                         style="font-size: 125%;">
                      </i>
                    </button>
                    <p style="margin: 0"></p>
                  </template>
                </div>
              </div>
              <br>
              <img id="imgflip_meme"
                   :src="this.imgflip_template.url" alt="Loading" class="selectableGIF"
                   style="width: auto; height: calc(90vh - 70px - 80px); border-radius: 10px;
                        transition: 0.3s ease all;">
              <template v-if="this.isFillingImgflipTemplate.mode === 'boxes'">
                <div id="meme_boxes_container"
                     style="width: auto; height: calc(90vh - 70px - 80px); position: absolute; top: 60px; left: 0">
                  <div v-for="box in this.isFillingImgflipTemplate.boxes" :key="box.id"
                       :id="'imgflip_draggableText_' + box.id + '_div'"
                       class="imgflip_text"
                       style="top: 100px; left: 10px; font-size: 100%; height: 50px; width: 150px">
                    <div :id="'imgflip_draggableText_' + box.id + '_div_anchor'"
                         class="draggable_meme_text_anchor"
                         style="font-family: Arial, sans-serif; text-shadow: none">
                      <i class="bi bi-arrows-move" style="font-size: 75%; color: black"></i>
                    </div>
                    <textarea :id="'imgflip_draggableText_' + box.id" rows="1" cols="8"
                              class="fw-bold draggable_meme_text border-2 border-black"></textarea>
                  </div>
                </div>
              </template>
              <template v-else-if="isFillingImgflipTemplate.mode === 'top-bottom'">
                <input id="imgflip_topText"
                       style="bottom: 80px; background-color: rgba(255, 255, 255, 0.5);"
                       class="text-center fw-bold imgflip_text"
                       placeholder="Top Text">
                <input id="imgflip_bottomText"
                       style="bottom: 10px; background-color: rgba(255, 255, 255, 0.5);"
                       class="text-center fw-bold imgflip_text"
                       placeholder="Bottom Text"
                       v-on:keyup.enter="submitImgflipMeme">
              </template>
            </div>
            <textarea id="new_comment"
                      class="new_comment b_darkgray py-2 px-3"
                      type="text"
                      v-model="new_message"
                      maxlength="5000"
                      :placeholder="'Message to ' + chatroom.t"
                      v-on:keyup="auto_grow"
                      v-on:click="hideAllSidebars"></textarea>
            <button id="send_image_button"
                    class="message_button send_image_button b_darkgray hover:brightness-200 flex justify-center items-center"
                    style="position: absolute; right: 50px; border-radius: 0"
                    title="Send Files"
                    v-on:click="toggleUploadingSnippet">
              <DocumentArrowUpIcon class="text-neutral-300 h-6 w-6"></DocumentArrowUpIcon>
            </button>
            <button class="message_button b_darkgray hover:brightness-200 flex justify-center items-center"
                    style="position: absolute; right: 10px; border-radius: 0 6px 6px 0"
                    title="Search on GIPHY"
                    v-on:click="toggleSelectingGIF">
              <GifIcon class="text-neutral-300 h-8 w-6"></GifIcon>
            </button>
          </div>
        </div>
      </div>
      <!-- #### MEMBERS #### -->
      <div id="member_section" style="margin-top: 60px"
           class="member_section">
        <div style="width: 100%; height: 50px;
                  border-bottom: 1px solid rgba(174, 174, 183, 0.25);
                  display: flex; align-items: center">
        <span class="fw-bold member_count c_lightgray nopointer"
              style="padding-left: 20px">
          Members&nbsp;-&nbsp;{{ getMemberCount() }}
        </span>
          <button class="btn-no-outline member_section_toggler c_lightgray"
                  style="position: absolute; right: 10px"
                  title="Hide Members"
                  v-on:click="toggleMemberSidebar">
            <i class="bi bi-eye-slash-fill orange-hover"></i>
          </button>
        </div>
        <div style="padding: 5px">
          <div v-for="usr in this.mainMembers" :key="usr"
               style="padding-left: 10px; position: relative; display: flex; align-items: center"
               class="user_badge"
               v-on:click="showUserProfile(usr)">
            <i class="bi bi-person-circle"
               style="font-size: 200%">
            </i>
            <template v-if="usr.iurl != null">
              <img :src="getImg(usr.iurl, true)" alt="?"
                   class="b_darkergray"
                   style="width: 40px; height: 40px; border-radius: 100%;
                                position: absolute; top: 4px; left: 6px">
            </template>
            <span style="font-weight: bold; margin-left: 14px">
            {{ usr.usr }}
          </span>
          </div>
          <div style="padding-left: 15px; display: flex">
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
  </div>
  <!-- #### USER PROFILE #### -->
  <div class="user_profile b_darkgray" style="overflow-x: hidden; overflow-y: auto"
       v-show="isViewingUserProfile" @click.stop>
    <div style="position: relative; padding-top: 10px; height: 100%">
      <i class="bi bi-x-lg lead orange-hover"
         style="cursor: pointer; position:absolute; right: 0" title="Close"
         v-on:click="hideAllWindows()"></i>
      <div style="display: flex; align-items: center">
        <i class="bi bi-person-circle" style="font-size: 400%; margin-right: 15px"></i>
        <template v-if="viewedUserProfile.iurl != null">
          <img :src="getImg(viewedUserProfile.iurl, true)" alt="?"
               class="b_darkergray"
               style="width: 75px; height: 75px; border-radius: 100%;
                                position: absolute; top: 20px; left: -5px">
        </template>
        <div style="display: block">
          <h2 class="fw-bold text-2xl">
            {{ viewedUserProfile.usr }}
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
      <div class="items-center flex">
        <template v-if="viewedUserProfile.usr === this.$store.state.username">
          <button class="c_lightgray gray-hover py-1 px-2"
                  v-on:click="isEditingProfile = true">
            <i class="bi bi-pencil mr-2"></i>Edit Profile
          </button>
          <button class="c_lightgray gray-hover py-1 px-2"
                  v-on:click="startTransferring()">
            <span class="flex items-center"><QrCodeIcon class="h-5 w-5 mr-1"></QrCodeIcon>Transfer</span>
          </button>
        </template>
        <template v-else>
          <button class="c_lightgray gray-hover py-1 px-2">
            <i class="bi bi-arrow-bar-left mr-2"></i>Kick
          </button>
          <button class="c_lightgray gray-hover py-1 px-2">
            <i class="bi bi-hammer mr-2"></i>Ban
          </button>
        </template>
      </div>
      <!-- #### MEMBER ROLES #### -->
      <hr class="c_lightgray my-2">
      <div style="display: flex; flex-wrap: wrap">
        <div v-for="role in this.viewedUserProfile.roles" :key="role"
             class="b_purple"
             style="border-radius: 5px; padding: 0 4px 4px 4px; margin-right: 1ch; margin-bottom: 1ch">
          <i v-show="isEditingRoles" class="bi bi-x-circle-fill orange-hover"
             style="margin-right: 4px"></i>
          <span>{{ JSON.parse(role).name.replace(' ', '&nbsp;') }}</span>
        </div>
        <span style="border-radius: 2rem; margin-right: 1em" class="orange-hover"
              v-on:click="addUserRole" title="Add new Role">
          <i class="bi bi-plus-circle"></i>
        </span>
      </div>
      <!-- #### ROLE ADDER #### -->
      <div class="user_role b_darkergray align-items-center"
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
      <template v-if="chatroom.rank > 1">
        <h5 class="c_lightgray mt-2 mb-1">Badges:</h5>
        <template v-if="this.viewedUserProfile.badges == null || this.viewedUserProfile.badges.length < 1">
          <div style="border: 1px solid gray; border-radius: 10px; width: 100%; padding: 10%"
               class="c_lightgray text-center align-items-center">
            <i class="bi bi-award-fill lead"></i>
            <br>Keep communicating to earn badges!
          </div>
        </template>
        <template v-else>
          <div class="w-full grid grid-cols-2 gap-3 mb-4">
            <div v-for="badge in this.viewedUserProfile.badges" :key="badge.handle"
                 class="c_lightgray text-center rounded-xl border-2 border-slate-600 py-1 px-2 hover:bg-slate-800">
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
      </template>
    </div>
  </div>
  <modal
    v-show="isEditingProfile"
    @close="isEditingProfile = false">
    <template v-slot:header>
      <h3>Edit Your Profile</h3>
    </template>
    <template v-slot:body>
      <div style="display: flex; margin-bottom: 5px">
        <img :src="getImg(this.viewedUserProfile.iurl, true)" alt="No Picture"
             class="b_darkergray"
             style="width: 100px; height: 100px; border-radius: 100%">
        <h2 class="fw-bold text-white"
            style="margin: 0 0 0 10px">
          {{ this.viewedUserProfile.usr }}
        </h2>
      </div>
      <label for="setProfilePicInput">
        Set a Profile Picture:
      </label>
      <br>
      <input id="setProfilePicInput" type="file" multiple v-on:change="setProfilePicture">
    </template>
    <template v-slot:footer>
    </template>
  </modal>
  <!-- #### GIF SELECTION #### -->
  <div class="giphygrid b_darkgray p-3"
       style="overflow: hidden" v-show="isViewingGIFSelection" @click.stop>
    <div style="height: calc(100% - 50px); width: 100%; overflow-x: clip; overflow-y: auto;"
         class="b_darkergray rounded-lg">
      <div v-for="gif in gifSelection" :key="gif"
           style="padding-top: 10px; padding-left: 10px; display: inline-flex"
           v-on:click="this.sendSelectedGIF(gif.images.fixed_height.url)">
        <img :src="gif.images.fixed_height.url" alt="Loading" class="selectableGIF"
             style="width: 150px; max-height: 150px">
      </div>
    </div>
    <div style="width: 100%; height: 50px"
         class="flex items-center">
      <input id="gif_query"
             type="text"
             class="fw-bold b_darkergray rounded-lg px-2 py-1"
             style="height: 34px; color: white; border: none"
             v-model="gif_query_string"
             :placeholder="'Search on GIPHY'"
             v-on:keyup.enter="getGIFSelection(gif_query_string)">
      <img src="../../assets/giphy/PoweredBy_200px-Black_HorizText.png" alt="Powered By GIPHY"
           style="width: 90px; height: 10px" class="ml-2"/>
    </div>
  </div>
  <!-- #### Settings #### -->
  <div class="session_settings b_darkgray shadow"
       style="overflow-x: hidden; overflow-y: auto"
       v-show="isViewingSessionSettings" @click.stop>
    <div style="position: relative; padding-top: 10px; width: 100%">
      <i class="bi bi-x-lg lead orange-hover"
         style="cursor: pointer; position:absolute; right: 0" title="Close"
         v-on:click="hideAllWindows()"></i>
      <h2 class="fw-bold nopointer text-xl mb-2">Session Settings</h2>
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
        <span class="spinner-border c_orange" role="status" aria-hidden="true"></span>
        <span class="jetb ms-2">Uploading...</span>
      </div>
      <hr class="c_lightgray my-2">
      <h4 class="c_lightgray fw-bold text-lg nopointer">
        Reward Program
      </h4>
      <p style="margin: 0; font-size: 75%" class="c_lightgray mb-3">
        Communicate to unlock powerful upgrades for your Clarifier group!
      </p>
      <div style="display: flex; align-items: center"
           class="c_lightgray mb-2">
        <span class="b_purple fw-bold nopointer"
              style="border-radius: 5px; padding: 0 4px 4px 4px;
                     margin-right: 5px">
          Rank {{ chatroom.rank }}
        </span>
        <span class="b_purple fw-bold nopointer"
              style="border-radius: 5px; padding: 0 4px 4px 4px;
                     margin-right: 5px">
          {{ chatroom.rankDescription }}
        </span>
        <button class="btn fw-bold golden-hover golden-hover-glow"
                style="border-radius: 5px; padding: 0 6px 4px 4px"
                v-on:click="upgradeChatroom()">
          <i class="bi bi-lightning-charge-fill"></i>
          Upgrade to Rank {{ chatroom.rank + 1 }}
        </button>
      </div>
      <div class="c_lightgray nopointer mb-2">
        Benefits:
      </div>
      <div style="overflow-y: auto; font-size: 75%"
           class="c_lightgray">
        <div class="d-flex gap-1 mb-1" style="width: 100%">
          <template v-if="chatroom.rank < 2">
            <div style="border: 2px solid gray; border-radius: 10px; padding: 20px"
                 class="text-center">
              <i class="bi bi-lock"></i>
              <br><span>Badges</span>
            </div>
          </template>
          <template v-else>
            <div style="border: 2px solid rebeccapurple; border-radius: 10px; padding: 20px"
                 class="text-center">
              <i class="bi bi-award-fill lead"></i>
              <br><span class="fw-bold">Badges</span>
            </div>
          </template>
          <template v-if="chatroom.rank < 3">
            <div style="border: 2px solid gray; border-radius: 10px; padding: 20px"
                 class="text-center">
              <i class="bi bi-lock"></i>
              <br><span>Knowledge</span>
            </div>
          </template>
          <template v-else>
            <div style="border: 2px solid rebeccapurple; border-radius: 10px; padding: 20px"
                 class="text-center">
              <i class="bi bi-book-half lead"></i>
              <br><span class="fw-bold">Knowledge</span>
            </div>
          </template>
          <div style="border: 2px dotted gray; border-radius: 10px; padding: 20px"
               class="text-center">
            <i class="bi bi-question"></i>
            <br><span>T.B.A.</span>
          </div>
        </div>
      </div>
    </div>
  </div>
  <modal
    v-show="isViewingNewSubchat"
    @close="hideAllWindows()">
    <template v-slot:header>
      <h2 class="fw-bold">New Subchat</h2>
    </template>
    <template v-slot:body>
      <!-- #### New Subchat #### -->
      <div class="new_subchat" style="overflow: hidden; padding: 5px">
        <div style="position: relative; padding-top: 10px; width: 100%">
          <label for="new_subchat_name" class="fw-bold lead c_lightgray">Name:</label>
          <input v-model="new_subchat_name"
                 id="new_subchat_name" type="text"
                 class="mt-2 b_darkergray text-white p-2 ps-3"
                 style="width: 100%; border: none; border-radius: 20px">
          <label class="fw-bold lead mt-4 c_lightgray" style="width: 100%">Create:</label>
          <button v-on:click="createSubchatroom('text')"
                  id="new_subchat_type_text" class="btn darkbutton mt-2"
                  style="color: white; width: 100%; text-align: left; display: flex;
                         align-items: center; border-radius: 10px">
            <span style="font-size: 200%"><i class="bi bi-hash"></i></span>
            <div class="ms-3">
              <span>Text Subchat</span>
              <br>
              <span class="c_lightgray" style="font-size: 80%; font-weight: bold">Write messages and send files.</span>
            </div>
          </button>
          <button v-on:click="createSubchatroom('screenshare')"
                  id="new_subchat_type_screenshare" class="btn darkbutton mt-2"
                  style="color: white; width: 100%; text-align: left; display: flex;
                         align-items: center; border-radius: 10px">
            <span style="font-size: 200%"><i class="bi bi-window-fullscreen"></i></span>
            <div class="ms-3">
              <span>Screenshare Subchat</span>
              <br>
              <span class="c_lightgray" style="font-size: 80%; font-weight: bold">Share your screen for others.</span>
            </div>
          </button>
          <button v-on:click="createSubchatroom('webcam')"
                  id="new_subchat_type_webcam" class="btn darkbutton mt-2"
                  style="color: white; width: 100%; text-align: left; display: flex;
                         align-items: center; border-radius: 10px">
            <span style="font-size: 200%"><i class="bi bi-camera-video"></i></span>
            <div class="ms-3">
              <span>Webcam Subchat</span>
              <br>
              <span class="c_lightgray" style="font-size: 80%; font-weight: bold">Video call with others.</span>
            </div>
          </button>
        </div>
      </div>
    </template>
    <template v-slot:footer>
    </template>
  </modal>
  <!-- #### File Upload (SnippetBase) #### -->
  <div class="session_settings b_gray shadow" style="overflow-x: hidden; overflow-y: auto"
       v-show="isUploadingSnippet" @click.stop>
    <div style="position: relative; padding-top: 10px; width: 100%">
      <i class="bi bi-x-lg lead" style="cursor: pointer; position:absolute; right: 0" title="Close"
         v-on:click="closeUploadingSnippet()"></i>
      <h2 class="fw-bold text-2xl mb-4">File Upload</h2>
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
        <div class="drop_zone mb-2" id="snippet_drop_zone">Drop a file here!</div>
        <input type="file" class="file_input" id="snippet_files" name="files[]"
               style="width: 100%"
               multiple v-on:change="handleUploadFileSelect"/>
      </template>
      <div id="confirm_snippet_loading" class="ml-2 my-2" style="display: none">
        <span class="spinner-border c_orange" role="status" aria-hidden="true"></span>
        <span class="jetb ms-2">Uploading...</span>
      </div>
      <template v-if="uploadFileBase64 !== ''">
        <div style="width: 100%; display: flex; align-items: center; justify-items: center">
          <button class="btn-outline-light darkbutton text-white"
                  style="width: 90%; height: 2.5em; border-color: transparent;
                         border-radius: 1em; margin: auto"
                  title="Send"
                  v-on:click="addMessage">
            <span class="fw-bold"><i class="bi bi-send mr-2"></i>Submit</span>
            <span style="margin-left: 10px" class="c_lightgray"> {{ this.uploadFileType }}</span>
          </button>
        </div>
      </template>
    </div>
  </div>
  <modal
    v-show="isModalVisible"
    @close="closeModal">
    <template v-slot:header>
      <span style="font-weight: bold">
        <i class="bi bi-shield-lock-fill"
           style="margin-right: 10px; font-size: 200%"></i>
        RSA-OAEP End-to-End Encryption
      </span>
    </template>
    <template v-slot:body>
      <div style="display: flex; width: 100%;
                  text-align: center;">
        <h2>Your messages are safe here.</h2>
      </div>
      <div style="display: flex; width: 100%;
                  justify-content: space-around;
                  font-size: 300%">
        <i class="bi bi-chat-text"></i>
        -
        <i class="bi bi-lock"></i>
        -
        <i class="bi bi-wifi"></i>
      </div>
      <div style="display: flex; width: 100%;
                  justify-content: space-around; font-size: 80%;
                  margin-top: 20px">
        <p style="max-width: 45%">
          Every Message and GIF sent is End-to-End encrypted,
          before even leaving your device.</p>
        <p style="max-width: 45%">
          All data is being transmitted over a secure websocket
          connection to the server.</p>
      </div>
      <div style="width: 100%; padding: 10px; text-align: left">
        Message Encryption
        <br>Encryption Tye: AES-CBC
        <br>Key Size: 256
      </div>
      <div style="width: 100%; padding: 10px; text-align: right">
        AES Key Encryption
        <br>Encryption Tye: RSA-OAEP
        <br>Key Size: 2048
        <br>Hash-Algorithm: SHA-384
      </div>
      <div style="width: 100%; padding: 10px; text-align: center;
                  font-size: 80%">
        Every Message gets AES-CBC encoded, before the AES keys
        get RSA-OAEP encrypted for each recipient.
      </div>
    </template>
    <template v-slot:footer>
      Happy Chatting!
    </template>
  </modal>
  <modal
    v-show="isViewingBadges"
    @close="hideAllWindows()">
    <template v-slot:header>
      <h2 class="fw-bold">Badge Hub</h2>
      <div style="display: flex; align-items: center; margin: 0 40px 0 40px"
           class="c_lightgray mb-2">
        <div class="b_purple fw-bold nopointer"
             style="border-radius: 5px; padding: 0 4px 4px 4px;
                    margin-right: 5px">
          Rank {{ chatroom.rank }}
        </div>
        <div class="b_purple fw-bold nopointer"
             style="border-radius: 5px; padding: 0 4px 4px 4px;
                    margin-right: 5px">
          {{ chatroom.rankDescription }}
        </div>
      </div>
    </template>
    <template v-slot:body>
      <div>
        <h5 class="c_lightgray">Actions:</h5>
        <button class="btn c_lightgray b_darkergray gray-hover"
                v-on:click="distributeBadges()">
          Distribute Badges
        </button>
      </div>
    </template>
    <template v-slot:footer>
    </template>
  </modal>
  <modal
    v-show="isTransferring"
    @close="hideAllWindows()">
    <template v-slot:header>
      <h2 class="fw-bold text-2xl">Transfer</h2>
    </template>
    <template v-slot:body>
      <div class="md:flex">
        <div id="transfer_qrcode"><!--AutoGeneratedQRCodes--></div>
        <div class="mt-4 md:mt-0 md:mx-4">
          <p class="text-xl">Guide:</p>
          <ol class="list-decimal list-inside">
            <li>Get the device that you are trying to migrate to.</li>
            <li>Scan the QR Code on the device.</li>
            <li>Wait for the transfer to finish.</li>
          </ol>
          <div class="flex mt-4 items-center">
            <span class="spinner-border c_orange" role="status" aria-hidden="true"></span>
            <span class="ml-2 fw-bold c_lightgray">Waiting...</span>
          </div>
        </div>
      </div>
    </template>
    <template v-slot:footer>
    </template>
  </modal>
</template>

<script>
// Own
import modal from '../../components/Modal.vue'
import WRTC from '@/webrtc/wRTC'
// External
import { Base64 } from 'js-base64'
import Markdown from 'vue3-markdown-it'
import markdownItMermaid from 'markdown-it-mermaid'
import mermaid from 'mermaid'
import 'highlight.js/styles/base16/google-dark.css'
import * as QRCode from 'easyqrcodejs'
// Icons
import { ChartBarIcon, EyeIcon, GifIcon, PhoneIcon, QrCodeIcon, VideoCameraIcon } from '@heroicons/vue/24/solid'
import { BookOpenIcon, DocumentArrowUpIcon, TrophyIcon, ViewColumnsIcon } from '@heroicons/vue/24/outline'

export default {
  props: {
    parsed: Object
  },
  components: {
    modal,
    Markdown,
    PhoneIcon,
    VideoCameraIcon,
    DocumentArrowUpIcon,
    GifIcon,
    QrCodeIcon,
    ViewColumnsIcon,
    TrophyIcon,
    BookOpenIcon,
    ChartBarIcon,
    EyeIcon
  },
  data () {
    return {
      chatroom: {},
      subchats: [],
      isSubchat: false,
      userId: null,
      currentSubchat: {},
      connection: null,
      peerType: 'idle',
      peerStreamOutgoing: {},
      websocketState: 'CLOSED',
      tagIndex: 0,
      streamStartTime: '',
      streamDuration: '',
      wRTC: {},
      // Messages and pagination
      messages: [],
      currentPage: 0,
      pageSize: 50,
      extraSkipCount: 0,
      lazyLoadingStatus: 'idle',
      mainMembers: [],
      members: [],
      new_message: '',
      last_message: {},
      gif_query_string: '',
      new_role: '',
      gifSelection: [],
      imgflipSelection: [],
      showInviteCopied: false,
      new_subchat_name: '',
      inputField: null,
      message_section: null,
      uploadFileBase64: '',
      uploadFileType: '',
      messageEditing: {},
      imgflip_template: {},
      mediaMaxWidth: '300px',
      // Conditions
      isModalVisible: false,
      isViewingGIFSelection: false,
      isViewingUserProfile: false,
      isViewingSessionSettings: false,
      isAddingRole: false,
      isEditingRoles: false,
      isViewingNewSubchat: false,
      isUploadingSnippet: false,
      isEditingMessage: false,
      isTaggingUser: false,
      isSelectingImgflipTemplate: false,
      isFillingImgflipTemplate: {
        active: false,
        mode: 'top-bottom',
        boxes: []
      },
      isViewingBadges: false,
      isStreamingVideo: false,
      isEditingProfile: false,
      isTransferring: false,
      //
      lastKeyPressed: '',
      viewedUserProfile: {
        id: -1,
        usr: '',
        roles: []
      },
      userActivity: [],
      userActivityIdle: [],
      timer: null,
      timerIdle: null,
      plugins: [
        {
          plugin: markdownItMermaid
        }
      ]
    }
  },
  created () {
  },
  mounted () {
    setTimeout(() => this.initFunction(), 0)
  },
  beforeUnmount () {
    clearInterval(this.timer)
    clearInterval(this.timerIdle)
  },
  methods: {
    closeModal: function () {
      this.isModalVisible = false
      this.$store.commit('setE2EncryptionSeen', true)
    },
    initFunction: async function () {
      this.setUpWRTC()
      this.$store.commit('setLastClarifierGUID', this.$route.params.id)
      this.isModalVisible = !this.$store.getters.hasSeenE2ENotification()
      this.toggleElement('init_loading', 'flex')
      window.addEventListener('resize', this.resizeCanvas, false)
      this.resizeCanvas()
      // Save elements to gain performance boost by avoiding too many lookups
      this.inputField = document.getElementById('new_comment')
      this.message_section = document.getElementById('messages_section')
      // #### #### #### #### #### #### #### #### #### #### #### #### #### ####
      // Generate new token just in case
      await this.serverLogin()
      console.debug('initFunction->getClarifierMetaData (INIT)', this.getSession())
      await this.getClarifierMetaData(this.getSession(), false, true)
      // Are we connecting to a subchat?
      const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop)
      })
      const subchatGUID = params.sub
      this.toggleElement('init_loading', 'flex')
      if (subchatGUID != null) {
        this.$store.commit('setLastClarifierSubGUID', subchatGUID)
        console.debug('initFunction->getClarifierMetaData (SUB PREP)', this.getSession())
        await this.getClarifierMetaData(this.getSession(), false, true)
        console.debug('initFunction->gotoSubchat', subchatGUID)
        await this.gotoSubchat(subchatGUID)
      } else {
        this.$store.commit('setLastClarifierSubGUID', 'none')
        // Connect to the session
        console.debug('initFunction->connect', this.getSession())
        await this.connect()
      }
      // #### #### #### #### #### #### #### #### #### #### #### #### #### ####
      // Set message section with its scroll event
      this.message_section.addEventListener('scroll', this.checkScroll, false)
      // Add message input field events
      this.inputField.addEventListener('keydown', this.handleEnter, false)
      document.addEventListener('keydown', this.handleGlobalKeyEvents, false)
      this.inputField.addEventListener('input', this.handleCommentInput, false)
      this.inputField.focus()
      // Add dropzone events (settings -> image upload)
      const dropZone = document.getElementById('drop_zone')
      dropZone.addEventListener('dragover', this.handleDragOver, false)
      dropZone.addEventListener('drop', this.handleFileSelectDrop, false)
      const dropZoneSnippet = document.getElementById('snippet_drop_zone')
      dropZoneSnippet.addEventListener('dragover', this.handleDragOver, false)
      dropZoneSnippet.addEventListener('drop', this.handleUploadImageSelectDrop, false)
      const dropFilesZoneSnippet = document.getElementById('snippet_files')
      dropFilesZoneSnippet.addEventListener('dragover', this.handleDragOver, false)
      dropFilesZoneSnippet.addEventListener('drop', this.handleUploadImageSelectDrop, false)
      // Broadcast channels to listen to firebase cloud messaging notifications
      const bc = new BroadcastChannel('dlChannel')
      bc.onmessage = event => {
        this.handleFirebaseEvent(event)
      }
      const bcNotify = new BroadcastChannel('dlChannelNotify')
      bcNotify.onmessage = event => {
        this.handleFirebaseEvent(event)
      }
      // Add event for clipboard pasting
      document.onpaste = (event) => {
        const items = (event.clipboardData ?? event.originalEvent.clipboardData)
          .items
        for (const item of items) {
          if (item.kind === 'file') {
            const blob = item.getAsFile()
            const reader = new FileReader()
            reader.onload = (event) => {
              this.isUploadingSnippet = true
              this.uploadFileType = blob.type
              this.uploadFileBase64 = event.target.result
            }
            reader.readAsDataURL(blob)
          }
        }
      }
      this.timer = setInterval(this.clearActivity, 1000)
      this.timerIdle = setInterval(this.clearActivityIdle, 1000)
    },
    setUpWRTC: function () {
      // Initialize wRTC.js
      this.wRTC = WRTC
      this.wRTC.sayHi() // :D
      // Create BroadcastChannel to listen to wRTC events!
      const eventChannel = new BroadcastChannel('wrtcevents')
      eventChannel.onmessage = event => {
        this.handleWRTCEvent(event)
      }
    },
    handleWRTCEvent: async function (event) {
      if (!event || !event.data) return
      if (event.data.event === 'connection_change') {
        console.log('%c' + event.data.status, this.wRTC.logStyle)
      }
      if (event.data.event === 'new_ice') {
        const candidateId = event.data.candidateId
        const peerConnection = await this.wRTC.getPeerConnection(event.data.remoteId)
        for (let i = 0; i < peerConnection.candidates.length; i++) {
          if (peerConnection.candidates[i].id === candidateId) {
            const candidatePayload = {
              selfId: peerConnection.remoteId,
              remoteId: this.userId,
              candidate: peerConnection.candidates[i].candidate
            }
            console.log('%cSending renegotiated Candidate', this.wRTC.logStyle, peerConnection.candidates[i].candidate)
            this.addMessagePar('[c:SC]' + '[C]' + JSON.stringify(candidatePayload))
            break
          }
        }
      }
      if (event.data.event === 'incoming_track') {
        this.isStreamingVideo = true
        this.streamStartTime = Math.floor(Date.now() / 1000)
        this.startTimeCounter()
        this.enterCinemaMode()
        const remoteStream = this.wRTC.getStream(event.data.remoteId)[0]
        let videoElem
        if (this.currentSubchat.type === 'screenshare') {
          videoElem = document.getElementById('screenshare_video')
        } else if (this.currentSubchat.type === 'webcam') {
          videoElem = document.getElementById('screenshare_video_remote')
        }
        videoElem.srcObject = remoteStream
        videoElem.setAttribute('controls', '')
      }
      return new Promise((resolve) => {
        resolve()
      })
    },
    handleGlobalKeyEvents: function (event) {
      const ev = event
      if (ev.key === 'Escape') {
        if (this.isEditingMessage === true) {
          this.resetEditing()
        } else {
          this.hideAllWindows()
        }
        this.focusComment()
      } else {
        if (document.activeElement.id === 'new_comment') {
          // User has pressed a key whilst being in the input field
          this.shareActivity(ev)
        }
      }
    },
    handleFirebaseEvent: function (event) {
      if (event.data.data.subchatGUID != null) {
        const destId = event.data.data.subchatGUID
        if (!this.$route.fullPath.includes(destId)) {
          this.$store.commit('addClarifierTimestampNew', {
            id: event.data.data.subchatGUID,
            ts: new Date().getTime()
          })
          const notify = document.getElementById(destId + '_notify')
          if (notify != null) {
            setTimeout(() => {
              notify.style.opacity = '1'
              notify.style.display = 'block'
            }, 0)
          }
        }
      } else {
        const destId = event.data.data.dlDest.substring(20)
        if (this.$route.fullPath.includes('sub=')) {
          this.$store.commit('addClarifierTimestampNew', {
            id: destId,
            ts: new Date().getTime()
          })
          const notify = document.getElementById(destId + '_notify')
          if (notify != null) {
            setTimeout(() => {
              notify.style.opacity = '1'
              notify.style.display = 'block'
            }, 0)
          }
        }
      }
    },
    connect: async function (sessionID = this.getSession(), isSubchat = false) {
      console.debug('connect', sessionID, isSubchat)
      this.toggleElement('loading', 'flex')
      this.resetStats()
      // Generate Key Pair
      await this.generateRSAKeyPair(this.getChatGUID())
      return new Promise((resolve) => {
        this.isSubchat = isSubchat
        // Connect to the chat
        this.connection = new WebSocket('wss://wikiric.xyz/clarifier/' + sessionID)
        // Websocket OPEN
        this.connection.onopen = () => {
          this.websocketState = 'OPEN'
          this.connection.send(this.$store.state.token)
          // Subscribe to notifications
          this.subscribeFCM(sessionID, isSubchat)
        }
        // Websocket CLOSE
        this.connection.onclose = async () => {
          if (this.websocketState === 'SWITCHING') {
            // If we're switching to another channel, don't try to revive!
            // return
          }
        }
        // Websocket incoming frames
        this.connection.onmessage = (event) => {
          this.showMessage(event.data)
        }
        // Get metadata and messages
        console.debug('connect->getClarifierMetaData', sessionID, isSubchat)
        this.getClarifierMetaData(sessionID, isSubchat)
          .then(() => this.getClarifierMessages(false, sessionID))
          .then(() => this.toggleElement('loading', 'flex'))
          .then(resolve)
      })
    },
    serverLogin: function () {
      return new Promise((resolve) => {
        if (this.$store.state.email === undefined || this.$store.state.email === '') return
        const headers = new Headers()
        headers.set(
          'Authorization',
          'Basic ' + Base64.encode(this.$store.state.email + ':' + this.$store.state.password)
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
          .then(resolve)
          .catch((err) => this.$notify(
            {
              title: 'Unable to Login',
              text: err.message,
              type: 'error'
            }))
      })
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
    showMessage: async function (msg) {
      const message = await this.processRawMessage(msg)
      if (message.mType == null) return
      if (message.mType === 'EditNotification') {
        const response = JSON.parse(message.msg)
        if (response.uniMessageGUID == null) return
        const index = this.messages.findIndex(msg => msg.gUID === response.uniMessageGUID)
        if (response.newContent !== '') {
          // Edit message
          try {
            this.messages[index].msg = await this.decryptPayload(
              JSON.parse(response.newContent.substring(12))
            )
            this.removeUserFromActivity(this.messages[index].src)
            setTimeout(() => {
              mermaid.init()
            }, 0)
          } catch (e) {
            console.error(e.message)
          }
        } else {
          // Delete message
          this.messages.splice(index, 1)
        }
        // Reset the edit background
        this.resetEditing()
        return
      }
      if (message.mType === 'ReactNotification') {
        const response = JSON.parse(message.msg)
        if (response.uniMessageGUID == null) return
        const index = this.messages.findIndex(msg => msg.gUID === response.uniMessageGUID)
        // Edit message
        try {
          // Check if message already contains a reaction of this type
          if (this.messages[index].reacts.length > 0) {
            for (let i = 0; i < this.messages[index].reacts.length; i++) {
              if (this.messages[index].reacts[i].t === response.type) {
                // We found the reaction... do we need to add or remove it?
                if (response.isRemove === false) {
                  // Add reaction
                  this.messages[index].reacts[i].src.push(response.from)
                  setTimeout(() => {
                    const elem = document.getElementById(
                      'react_' + response.uniMessageGUID + '_' + response.type)
                    elem.style.display = 'initial'
                    document.getElementById('react_' + response.uniMessageGUID + '_' + response.type).title =
                      this.messages[index].reacts[i].src.toString() + ' reacted to this message.'
                  }, 0)
                } else {
                  // Remove reaction
                  this.messages[index].reacts[i].src = this.removeValuesFromArray(
                    this.messages[index].reacts[i].src,
                    response.from
                  )
                  if (this.messages[index].reacts[i].src.length > 0) {
                    setTimeout(() => {
                      document.getElementById('react_' + response.uniMessageGUID + '_' + response.type).title =
                        this.messages[index].reacts[i].src.toString() + ' reacted to this message.'
                    }, 0)
                  } else {
                    const elem = document.getElementById(
                      'react_' + response.uniMessageGUID + '_' + response.type)
                    elem.style.display = 'none'
                  }
                }
                return
              }
            }
          }
          if (response.isRemove === false) {
            this.messages[index].reacts.push({
              src: [response.from],
              t: response.type
            })
            setTimeout(() => {
              const elem = document.getElementById(
                'react_' + response.uniMessageGUID + '_' + response.type)
              elem.style.display = 'initial'
              document.getElementById('react_' + response.uniMessageGUID + '_' + response.type).title =
                response.from + ' reacted to this message.'
            }, 0)
          }
        } catch (e) {
          console.error(e.message)
        }
        return
      }
      const distanceToBottom = (this.message_section.scrollTop * -1)
      if (distanceToBottom < 50) {
        this.scrollToBottom(false)
      }
      this.removeUserFromActivity(message.src)
      this.messages.unshift(message)
      this.extraSkipCount++
      if (message.mType === 'RegistrationNotification') {
        this.getClarifierMetaData()
      }
      setTimeout(() => {
        mermaid.init()
      }, 0)
    },
    addMessage: async function () {
      if (this.isEditingMessage === true) {
        let editPayloadMessage
        if (this.new_message !== '') {
          editPayloadMessage = '[c:MSG<ENCR]' +
            await this.encryptPayload(this.new_message)
        } else {
          editPayloadMessage = ''
        }
        const payload = JSON.stringify({
          uniMessageGUID: this.messageEditing.gUID,
          newContent: editPayloadMessage
        })
        this.addMessagePar('[c:EDIT<JSON]' + payload)
        this.focusComment(true)
        setTimeout(() => {
          this.auto_grow()
          this.resetEditing()
        }, 0)
        return
      }
      this.scrollToBottom()
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
        setTimeout(() => this.auto_grow(), 0)
        return
      }
      // Joke Lookup?
      if (this.new_message.toLowerCase().startsWith('/joke')) {
        this.getRandomJoke(this.new_message.substring(5))
        this.new_message = ''
        this.focusComment(true)
        setTimeout(() => this.auto_grow(), 0)
        return
      }
      // Image Snippet Upload?
      if (isUploadingSnippet === true) {
        this.uploadSnippet()
        this.focusComment(true)
        setTimeout(() => this.auto_grow(), 0)
        return
      }
      // Top Flip?
      if (this.new_message.toLowerCase().startsWith('/topflip')) {
        let params = ''
        if (this.new_message.toLowerCase().includes('-d')) params += '-d'
        this.addMessagePar('[c:CMD]/topflip' + params)
        this.new_message = ''
        this.focusComment(true)
        setTimeout(() => this.auto_grow(), 0)
        return
      }
      // Statistics?
      if (this.new_message.toLowerCase().startsWith('/stats')) {
        this.addMessagePar('[c:CMD]/stats')
        this.new_message = ''
        this.focusComment(true)
        setTimeout(() => this.auto_grow(), 0)
        return
      }
      // Help?
      if (this.new_message.toLowerCase().startsWith('/help')) {
        this.addMessagePar('[c:CMD]/help')
        this.new_message = ''
        this.focusComment(true)
        setTimeout(() => this.auto_grow(), 0)
        return
      }
      // Help?
      if (this.new_message.toLowerCase().startsWith('/leaderboard')) {
        this.addMessagePar('[c:CMD]/leaderboard')
        this.new_message = ''
        this.focusComment(true)
        setTimeout(() => this.auto_grow(), 0)
        return
      }
      // Handle normal message
      const messageContent = this.new_message.substring(0, 5000)
      const encryptedMessage = await this.encryptPayload(messageContent)
      this.connection.send('[c:MSG<ENCR]' + encryptedMessage)
      this.new_message = ''
      this.focusComment(true)
      setTimeout(() => this.auto_grow(), 0)
      this.isTaggingUser = false
    },
    encryptPayload: async function (messageContent) {
      const aesKey = await this.generateAESKey()
      const iv = this.generateIvAES()
      const cipher = await this.encryptMessageAES(messageContent, aesKey, iv)
      const encryptedMessage = this.arrayBufferToBase64(cipher)
      // Encrypt AES key + iv for each participant with RSA encryption
      const aesPayload = {
        key: this.arrayBufferToBase64(await this.exportAESKey(aesKey)),
        iv: this.arrayBufferToBase64(iv)
      }
      const keyArray = []
      for (const user of this.members) {
        if (user.pem != null && user.pem !== '') {
          const pubKey = await this.importRSAPubKey(user.pem)
          const cipher2 = await this.encryptMessageRSA(JSON.stringify(aesPayload), pubKey)
          const encrypted2 = this.arrayBufferToBase64(cipher2)
          keyArray.unshift({
            id: user.id,
            key: encrypted2
          })
        }
      }
      return new Promise((resolve) => {
        const encryptedMessageObj = JSON.stringify({
          keys: keyArray,
          message: encryptedMessage
        })
        resolve(encryptedMessageObj)
      })
    },
    decryptPayload: async function (encryptedMessageObj) {
      let decryptedMessage
      for (let i = 0; i < encryptedMessageObj.keys.length; i++) {
        const keyPair = encryptedMessageObj.keys[i]
        if (keyPair.id === this.userId) {
          // Step 1: Decrypt the RSA encrypted AES key
          const decipherRSA = this.base64ToArrayBuffer(keyPair.key)
          const decryptedRSA = await this.decryptMessageRSA(decipherRSA)
          const aesPayload = JSON.parse(decryptedRSA)
          const decipherAES = this.base64ToArrayBuffer(encryptedMessageObj.message)
          const aesKey = await this.importSecretKey(await this.base64ToArrayBuffer(aesPayload.key))
          // Step 2: Decrypt the AES encrypted message
          decryptedMessage = await this.decryptMessageAES(
            decipherAES,
            aesKey,
            this.base64ToArrayBuffer(aesPayload.iv))
        }
      }
      return new Promise((resolve) => {
        resolve(decryptedMessage)
      })
    },
    focusComment: function (instantly = false) {
      if (instantly) {
        this.inputField.focus()
      } else {
        setTimeout(() => this.inputField.focus(), 0)
      }
    },
    addMessagePar: function (text, closeGIFSelection = false) {
      if (text !== '') this.connection.send(text)
      if (closeGIFSelection) this.isViewingGIFSelection = false
    },
    getClarifierMetaData: function (sessionID = this.getSession(), isSubchat = false, novisual = false) {
      if (sessionID == null || sessionID === 'undefined') {
        this.$notify(
          {
            title: 'Invalid Group GUID',
            text: 'Please re-enter current Group to fix this.',
            type: 'error'
          })
        return
      }
      return new Promise((resolve) => {
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
            // Remove active flag
            if (!novisual) {
              if (this.chatroom.guid != null) {
                document.getElementById(this.chatroom.guid + '_subc')
                  .classList.remove('active')
              }
              if (this.currentSubchat.guid != null) {
                document.getElementById(this.currentSubchat.guid + '_subc')
                  .classList.remove('active')
              }
            }
            // Set new chatroom or subchat + active flag
            if (!isSubchat) {
              this.chatroom = data
              if (this.chatroom.subChatrooms != null) {
                // Parse JSON serialized subchats for performance
                for (let i = 0; i < this.chatroom.subChatrooms.length; i++) {
                  this.chatroom.subChatrooms[i] = JSON.parse(this.chatroom.subChatrooms[i])
                }
              }
              if (!novisual) {
                document.getElementById(this.chatroom.guid + '_subc')
                  .classList.toggle('active')
              }
            } else {
              this.currentSubchat = data
              if (!novisual) {
                document.getElementById(this.currentSubchat.guid + '_subc')
                  .classList.toggle('active')
              }
            }
          })
          .then(() => (this.processMetaDataResponse(isSubchat)))
          .then(resolve)
          .catch((err) => console.error(err.message))
      })
    },
    processMetaDataResponse: async function (isSubchat = false) {
      if (isSubchat === false) {
        this.currentSubchat.type = 'text'
        this.$store.commit('addClarifierSession', {
          id: this.chatroom.guid,
          title: this.chatroom.t,
          img: this.getImg(this.chatroom.imgGUID)
        })
        this.$store.commit('addClarifierTimestampRead', {
          id: this.chatroom.guid,
          ts: new Date().getTime()
        })
        const notify = document.getElementById(this.chatroom.guid + '_notify')
        if (notify != null) {
          notify.style.opacity = '0'
          notify.style.display = 'none'
        }
        if (this.isSubchat === false) {
          this.members = []
          // Parse JSON serialized users for performance
          for (let i = 0; i < this.chatroom.members.length; i++) {
            // Main Members
            this.mainMembers[i] = JSON.parse(this.chatroom.members[i])
            this.mainMembers[i].taggable = true
            // Current Members
            this.members[i] = this.mainMembers[i]
            this.members[i].taggable = true
            if (this.members[i].usr === this.$store.state.username) {
              this.userId = this.members[i].id
            }
          }
        }
      } else {
        this.$store.commit('addClarifierTimestampRead', {
          id: this.currentSubchat.guid,
          ts: new Date().getTime()
        })
        const notify = document.getElementById(this.currentSubchat.guid + '_notify')
        if (notify != null) {
          notify.style.opacity = '0'
          notify.style.display = 'none'
        }
        // Parse JSON serialized users for performance and determine current user's ID
        this.members = []
        for (let i = 0; i < this.currentSubchat.members.length; i++) {
          this.members[i] = JSON.parse(this.currentSubchat.members[i])
          this.members[i].taggable = true
          if (this.members[i].usr === this.$store.state.username) {
            this.userId = this.members[i].id
          }
        }
      }
      const messagesSection = document.getElementById('messages_section')
      if (this.currentSubchat.type === 'screenshare' || this.currentSubchat.type === 'webcam') {
        messagesSection.style.width = '350px'
        messagesSection.style.borderRight = '2px solid rgba(174, 174, 183, 0.25)'
        this.mediaMaxWidth = '260px'
      } else {
        messagesSection.style.width = 'initial'
        messagesSection.style.borderRight = 'initial'
        this.mediaMaxWidth = '300px'
      }
      document.title = this.chatroom.t
      if (this.isSubchat) {
        document.title += ' - ' + this.currentSubchat.t
      }
    },
    getClarifierMessages: function (lazyLoad = false, sessionID) {
      if (sessionID == null) {
        sessionID = this.getSession()
      }
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
    processMessagesResponse: async function (data, lazyLoad = false) {
      if (data.messages == null) {
        if (lazyLoad) this.lazyLoadingStatus = 'idle'
        return
      }
      if (data.messages.length === 0) {
        // No more messages can be loaded
        if (lazyLoad) this.lazyLoadingStatus = 'done'
        return
      }
      let pageIndex = this.currentPage
      if (lazyLoad) pageIndex++
      // Add messages to stack
      if (pageIndex === 0) {
        // Initial loading
        this.messages = []
        const messagesTemp = []
        for (const element of data.messages.reverse()) {
          messagesTemp.unshift(await this.processRawMessage(element))
        }
        for (const element of messagesTemp) {
          this.messages.push(element)
        }
      } else {
        // Lazy loading
        const tempArray = []
        for (const element of data.messages.reverse()) {
          tempArray.unshift(await this.processRawMessage(element))
        }
        tempArray.forEach(element => this.messages.push(element))
      }
      if (lazyLoad) {
        this.currentPage++
        this.lazyLoadingStatus = 'idle'
      }
      setTimeout(() => {
        mermaid.initialize({
          startOnLoad: true,
          theme: 'dark'
        })
      }, 0)
      setTimeout(() => {
        mermaid.init()
      }, 0)
    },
    processRawMessage: async function (msg) {
      if (msg.substr(0, 6) === '[c:SC]') {
        // Incoming ActionTrigger message (former Screen Share Payload)
        const tmp = msg.substr(6)
        if (tmp.substring(0, 3) === '[A]') {
          // Offer
          const rtcOffer = JSON.parse(tmp.substring(3))
          if (rtcOffer.selfId === this.userId) {
            let approval
            if (this.isStreamingVideo === false) {
              if (this.currentSubchat.type === 'screenshare') {
                approval = confirm('Incoming Screen Share. Join?')
              } else if (this.currentSubchat.type === 'webcam') {
                approval = confirm('Incoming Video Call. Join?')
              }
            } else {
              // Don't prompt user more than once!
              approval = true
            }
            if (approval) {
              let stream = null
              if (this.currentSubchat.type === 'webcam') {
                try {
                  const streamLocal = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: false
                  })
                  const videoElem = document.getElementById('screenshare_video')
                  videoElem.srcObject = streamLocal
                  videoElem.setAttribute('controls', '')
                  if (streamLocal) stream = streamLocal
                } catch (e) {
                  console.error(e.message)
                }
              }
              await this.acceptWebRTCOffer(rtcOffer, stream)
            }
          }
        } else if (tmp.substring(0, 3) === '[B]') {
          // Answer
          // if (this.peerType === 'caller') {
          const rtcAnswer = JSON.parse(tmp.substring(3))
          await this.acceptWebRTCAnswer(rtcAnswer)
          // }
        } else if (tmp.substring(0, 3) === '[C]') {
          // ICE Candidates
          const rtcCandidatePayload = JSON.parse(tmp.substring(3))
          if (rtcCandidatePayload.selfId === this.userId) {
            await this.setICECandidate(rtcCandidatePayload)
          }
        } else if (tmp.substring(0, 3) === '[D]') {
          // ICE Candidates
          const payload = JSON.parse(tmp.substring(3))
          const peerConnection = await this.wRTC.getPeerConnection(payload.remoteId)
          if (peerConnection && peerConnection.candidates) {
            for (let i = 0; i < peerConnection.candidates.length; i++) {
              const candidatePayload = {
                selfId: payload.remoteId,
                remoteId: this.userId,
                candidate: peerConnection.candidates[i].candidate
              }
              console.log('%cSending gathered Candidate', this.wRTC.logStyle, peerConnection.candidates[i].candidate)
              this.addMessagePar('[c:SC]' + '[C]' + JSON.stringify(candidatePayload))
            }
          }
        } else if (tmp.substring(0, 10) === '[activity]') {
          this.receiveActivity(tmp.substring(10))
        }
        return new Promise((resolve) => {
          resolve('')
        })
      }
      // Deserialize
      const message = JSON.parse(msg)
      message.mType = 'Text'
      message.apiResponse = false
      // Process timestamp
      message.time = new Date(message.ts)
      if (message.msg.includes('[s:EditNotification]') === true && message.src === '_server') {
        message.mType = 'EditNotification'
        message.msg = message.msg.substring(20)
      } else if (message.msg.includes('[s:ReactNotification]') === true && message.src === '_server') {
        message.mType = 'ReactNotification'
        message.msg = message.msg.substring(21)
      } else if (message.msg.includes('[s:RegistrationNotification]') === true && message.src === '_server') {
        message.mType = 'RegistrationNotification'
        message.msg = message.msg.substring(28)
      } else if (message.msg.includes('[s:Leaderboard]') === true && message.src === '_server') {
        message.mType = 'Leaderboard'
        message.msg = message.msg.substring(15)
      } else if (message.msg.includes('[c:GIF]') === true) {
        message.mType = 'GIF'
        message.apiResponse = true
        message.msg = message.msg.substring(7)
      } else if (message.msg.includes('[c:JOKE]') === true) {
        message.mType = 'Joke'
        message.apiResponse = true
        message.msg = message.msg.substring(8)
      } else if (message.msg.includes('[c:IMG]') === true) {
        message.mType = 'Image'
        message.msg = message.msg.substring(7)
      } else if (message.msg.includes('[c:AUD]') === true) {
        message.mType = 'Audio'
        message.msg = message.msg.substring(7)
      }
      // Reactions
      if (message.reacts != null) {
        for (let i = 0; i < message.reacts.length; i++) {
          message.reacts[i] = JSON.parse(message.reacts[i])
        }
      } else {
        message.reacts = []
      }
      /* Do we have to add a message header?
      Don't add a header (avatar, name) if the last message came from the same source and similar time
       */
      message.header = true
      if (message.apiResponse !== true) {
        if (this.last_message.src === message.src) {
          // If the sources are identical, check if the time was similar
          let timeDiff = message.time.getTime() - this.last_message.time.getTime()
          timeDiff = (Math.abs((timeDiff) / 1000) / 60)
          // If the message is 3 minutes or older put the message header
          message.header = timeDiff >= 3
        }
      }
      if (message.header === true) {
        message.iurl = ''
        // Check for profile picture
        const ix = this.mainMembers.findIndex(member => member.usr === message.src)
        if (ix !== -1) {
          if (this.mainMembers[ix].iurl != null) {
            message.iurl = this.mainMembers[ix].iurl
          }
        }
      }
      /* Are we allowed to edit this message?
      Only allow the user to edit his own messages, not the ones of others
       */
      message.editable = (message.src === this.$store.state.username)
      // Is the message encrypted?
      const encryptionPrefix = '[c:MSG<ENCR]'
      if (message.msg.startsWith(encryptionPrefix)) {
        message.isEncrypted = true
        try {
          message.msg = await this.decryptPayload(
            JSON.parse(message.msg.substring(12))
          )
          if (message.msg == null) {
            message.msg = 'The message could not be decrypted.'
            message.mType = 'CryptError'
            message.apiResponse = false
            message.decryptionFailed = true
            message.reacts = []
          }
          message.decryptionFailed = false
        } catch (e) {
          message.msg = 'The message could not be decrypted.'
          message.mType = 'CryptError'
          message.apiResponse = false
          message.decryptionFailed = true
          message.reacts = []
        }
      }
      message.tagActive = message.msg.includes('@' + this.$store.state.username) === true
      this.last_message = message
      return new Promise((resolve) => {
        resolve(message)
      })
    },
    getSession: function (full = false) {
      let session
      if (full === false) {
        session = this.$store.getters.getLastClarifierGUID()
        if (session == null || session.length < 30) {
          this.$router.push('/bsod?reason=' + 'Invalid Chatroom GUID')
        }
        return session
      } else {
        return window.location.href
      }
    },
    getSessionSub: function () {
      let session = this.$store.getters.getLastClarifierSubGUID()
      if (session == null || session.length < 30) {
        session = 'none'
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
        .then(async (data) => (
          this.addMessagePar('[c:GIF][c:MSG<ENCR]' +
            await this.encryptPayload(data.data.images.fixed_height.url)
          ))
        )
        .catch((err) => console.error(err.message))
    },
    getRandomJoke: function (text) {
      let url = 'https://api.humorapi.com/jokes/random?api-key=d47f7eca7f694765adc6389f6ce17ba9'
      if (text != null && text !== '') {
        url += '&include-tags=' + text.trim()
      }
      fetch(
        url,
        {
          method: 'get'
        }
      )
        .then((res) => res.json())
        .then(async (data) => {
          if (data.joke != null) {
            this.addMessagePar('[c:JOKE][c:MSG<ENCR]' +
              await this.encryptPayload(data.joke)
            )
          } else {
            this.$notify(
              {
                title: 'No Joke :(',
                text: 'There was no response... maybe the quota is used up?',
                type: 'error'
              })
          }
        })
        .catch((err) => console.error(err.message))
    },
    sendSelectedGIF: async function (url) {
      this.addMessagePar('[c:GIF][c:MSG<ENCR]' +
        await this.encryptPayload(url), true
      )
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
    getImgFlipSelection: function () {
      fetch(
        'https://api.imgflip.com/get_memes',
        {
          method: 'get'
        }
      )
        .then((res) => res.json())
        .then((data) => (this.imgflipSelection = data.data.memes))
        .catch((err) => console.error(err.message))
    },
    submitImgflipMeme: function (boxes = []) {
      const url = 'https://api.imgflip.com/caption_image'
      const textOne = document.getElementById('imgflip_topText')
      const textTwo = document.getElementById('imgflip_bottomText')
      let details
      if (boxes.length > 0) {
        details = {
          template_id: this.imgflip_template.id,
          username: this.$store.state.imgFlipUsername,
          password: this.$store.state.imgFlipPassword,
          font: 'impact',
          max_font_size: 100,
          boxes: boxes
        }
      } else {
        if (textOne.value == null && textTwo.value == null) return
        details = {
          template_id: this.imgflip_template.id,
          username: this.$store.state.imgFlipUsername,
          password: this.$store.state.imgFlipPassword,
          text0: textOne.value,
          text1: textTwo.value,
          font: 'impact',
          max_font_size: 100
        }
      }
      let formBody = []
      for (const property in details) {
        const encodedKey = encodeURIComponent(property)
        if (encodedKey !== 'boxes') {
          const encodedValue = encodeURIComponent(details[property])
          formBody.push(encodedKey + '=' + encodedValue)
        } else {
          let box
          for (let i = 0; i < boxes.length; i++) {
            box = boxes[i]
            formBody.push(encodedKey + '[' + i + '][text]=' + box.text)
            formBody.push(encodedKey + '[' + i + '][x]=' + box.x)
            formBody.push(encodedKey + '[' + i + '][y]=' + box.y)
            formBody.push(encodedKey + '[' + i + '][width]=' + box.width)
            formBody.push(encodedKey + '[' + i + '][height]=' + box.height)
          }
        }
      }
      formBody = formBody.join('&')
      let response
      fetch(
        url,
        {
          method: 'post',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
          },
          body: formBody
        }
      )
        .then((res) => res.json())
        .then((data) => (response = data))
        .then(() => this.handleImgflipSubmissionResponse(response))
        .then(() => {
          this.isFillingImgflipTemplate.active = false
          this.isFillingImgflipTemplate.boxes = []
          this.isFillingImgflipTemplate.mode = 'top-bottom'
          this.imgflip_template = {}
          textOne.value = ''
          textTwo.value = ''
          this.focusComment()
        })
        .catch((err) => console.error(err.message))
    },
    handleImgflipSubmissionResponse: async function (response) {
      if (response.success !== true) {
        return
      }
      this.addMessagePar('[c:IMG][c:MSG<ENCR]' + await this.encryptPayload(response.data.url))
    },
    toggleSelectingGIF: function () {
      const wasShowing = this.isViewingGIFSelection
      this.hideAllWindows()
      this.isViewingGIFSelection = !wasShowing
      if (this.isViewingGIFSelection) {
        const gifInput = document.getElementById('gif_query')
        setTimeout(() => gifInput.focus(), 0)
      }
    },
    toggleUploadingSnippet: function () {
      const wasShowing = this.isUploadingSnippet
      this.hideAllWindows()
      this.isUploadingSnippet = !wasShowing
    },
    toggleSessionSettings: function () {
      const wasShowing = this.isViewingSessionSettings
      this.hideAllWindows()
      this.isViewingSessionSettings = !wasShowing
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
      if (this.chatroom.rank > 1) {
        // Does the user have badges?
        this.getBadges(user.usr)
      }
    },
    tagUserProfile: function (user) {
      this.isTaggingUser = false
      if (user == null || user.usr == null) {
        return
      }
      for (let i = this.new_message.length - 1; i >= 0; i--) {
        if (this.new_message.substring(i, i + 1) === '@') {
          let j = i + 1
          for (j; j < this.new_message.length; j++) {
            if (this.new_message.substring(j, j + 1) === ' ') {
              break
            }
          }
          this.new_message = this.new_message.substring(0, i + 1) + user.usr + ' ' + this.new_message.substring(j)
        }
      }
      this.focusComment(true)
    },
    selectImgflipTemplate: function (template) {
      this.isSelectingImgflipTemplate = false
      if (template == null || template.id == null) {
        return
      }
      for (let i = this.new_message.length - 1; i >= 0; i--) {
        if (this.new_message.substring(i, i + 5) === '/flip') {
          let j = i + 6
          for (j; j < this.new_message.length; j++) {
            if (this.new_message.substring(j, j + 1) === ' ') {
              break
            }
          }
          this.imgflip_template = template
          this.new_message = ''
          this.isFillingImgflipTemplate.active = true
          this.isFillingImgflipTemplate.mode = 'top-bottom'
          setTimeout(() => {
            document.getElementById('imgflip_topText').focus()
            const img = document.getElementById('imgflip_meme')
            if (img.clientWidth > img.clientHeight) {
              img.style.width = 'calc(100% - 20px)'
              img.style.height = 'auto'
            }
          }, 50)
        }
      }
      this.focusComment(true)
    },
    hideAllWindows: function () {
      this.isViewingUserProfile = false
      this.isViewingGIFSelection = false
      this.isUploadingSnippet = false
      this.isTaggingUser = false
      this.isSelectingImgflipTemplate = false
      this.isFillingImgflipTemplate.active = false
      this.isViewingBadges = false
      this.isTransferring = false
      this.imgflip_template = {}
      this.hideUserProfile()
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
        .then(() => this.getClarifierMetaData(this.getSession(), false, true))
        .catch((err) => console.error(err.message))
    },
    hideUserProfile: function () {
      this.isViewingUserProfile = false
      this.isAddingRole = false
      this.new_role = ''
      this.isEditingProfile = false
    },
    hideSessionSettings: function () {
      this.isViewingSessionSettings = false
    },
    hideNewSubchatWindow: function () {
      this.isViewingNewSubchat = false
      this.new_subchat_name = ''
    },
    toggleSidebar: function () {
      this.handleSidebarToggle(document.getElementById('sidebar'))
    },
    toggleSidebar2: function () {
      this.handleSidebarToggle(document.getElementById('sidebar2'))
    },
    toggleMemberSidebar: function () {
      this.handleSidebarToggle(document.getElementById('member_section'))
    },
    handleSidebarToggle: function (element) {
      if (element.classList.contains('active')) {
        element.classList.remove('active')
      } else {
        this.hideAllSidebars(true)
        element.classList.add('active')
      }
    },
    auto_grow: function () {
      this.inputField.style.height = '40px' // Default
      this.inputField.style.height = (this.inputField.scrollHeight) + 'px' // Grow if scrollHeight > 0
      if (this.inputField.style.height !== '40px') {
        this.inputField.style.borderRadius = '6px 6px 0 6px'
      } else {
        this.inputField.style.borderRadius = '6px 0 0 6px'
      }
      this.message_section.style.bottom = (this.inputField.scrollHeight - 40) + 'px'
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
      if (!sidebar) return
      if (!sidebar.classList.contains('active')) sidebar.classList.add('active')
    },
    hideSidebar: function () {
      const sidebar = document.getElementById('sidebar')
      if (!sidebar) return
      if (sidebar.classList.contains('active')) sidebar.classList.remove('active')
    },
    showSidebar2: function () {
      const sidebar = document.getElementById('sidebar2')
      if (!sidebar) return
      if (!sidebar.classList.contains('active')) sidebar.classList.add('active')
    },
    hideSidebar2: function () {
      const sidebar = document.getElementById('sidebar2')
      if (!sidebar) return
      if (sidebar.classList.contains('active')) sidebar.classList.remove('active')
    },
    showMemberSidebar: function () {
      const memberSidebar = document.getElementById('member_section')
      if (!memberSidebar) return
      if (!memberSidebar.classList.contains('active')) memberSidebar.classList.add('active')
    },
    hideMemberSidebar: function () {
      const memberSidebar = document.getElementById('member_section')
      if (!memberSidebar) return
      if (memberSidebar.classList.contains('active')) memberSidebar.classList.remove('active')
    },
    hideAllSidebars: function (force = false) {
      if (window.innerWidth < 1100 || force === true) {
        this.hideSidebar()
        this.hideSidebar2()
        this.hideMemberSidebar()
      }
      this.isViewingGIFSelection = false
    },
    handleEnter: function () {
      if (event.key === 'Enter') {
        if (this.isTaggingUser === true) {
          event.preventDefault()
          this.tagUserProfile(this.members[this.tagIndex])
        } else if (this.isSelectingImgflipTemplate === true) {
          event.preventDefault()
          this.selectImgflipTemplate(this.imgflipSelection[this.tagIndex])
        } else if (this.isFillingImgflipTemplate.active === true) {
          event.preventDefault()
          this.submitImgflipMeme()
        } else {
          if (event.shiftKey) return
          event.preventDefault()
          this.addMessage()
        }
      } else if (event.key === 'ArrowUp') {
        if (this.new_message !== '') {
          if (this.isTaggingUser === true) {
            event.preventDefault()
            if (this.tagIndex > 0) {
              for (let ii = this.tagIndex - 1; ii >= 0; ii--) {
                if (this.members[ii].taggable === true) {
                  this.tagIndex--
                  if (this.members[this.tagIndex].taggable !== true) {
                    for (let i = this.tagIndex; i > 0; i--) {
                      if (this.members[this.tagIndex].taggable !== true) {
                        this.tagIndex--
                      } else {
                        break
                      }
                    }
                  }
                  break
                }
              }
            } else {
              this.tagIndex = 0
            }
          } else if (this.isSelectingImgflipTemplate === true) {
            event.preventDefault()
            if (this.tagIndex > 0) {
              for (let ii = this.tagIndex - 1; ii >= 0; ii--) {
                if (this.imgflipSelection[ii].selectable !== false) {
                  this.tagIndex--
                  if (this.imgflipSelection[this.tagIndex].selectable === false) {
                    for (let i = this.tagIndex; i > 0; i--) {
                      if (this.imgflipSelection[this.tagIndex].selectable === false) {
                        this.tagIndex--
                      } else {
                        break
                      }
                    }
                  }
                  break
                }
              }
            } else {
              this.tagIndex = 0
            }
          }
        } else {
          // Empty message => Edit last message
          event.preventDefault()
          this.editOwnLastMessage()
        }
      } else if (event.key === 'ArrowDown') {
        if (this.isTaggingUser === true) {
          event.preventDefault()
          if (this.tagIndex < this.members.length - 1) {
            for (let ii = this.tagIndex + 1; ii <= this.members.length - 1; ii++) {
              if (this.members[ii].taggable === true) {
                this.tagIndex++
                if (this.members[this.tagIndex].taggable !== true) {
                  for (let i = this.tagIndex; i < this.members.length - 1; i++) {
                    if (this.members[this.tagIndex].taggable !== true) {
                      this.tagIndex++
                    } else {
                      break
                    }
                  }
                }
                break
              }
            }
          } else {
            this.tagIndex = this.members.length - 1
          }
        } else if (this.isSelectingImgflipTemplate === true) {
          event.preventDefault()
          if (this.tagIndex < this.imgflipSelection.length - 1) {
            for (let ii = this.tagIndex + 1; ii <= this.imgflipSelection.length - 1; ii++) {
              if (this.imgflipSelection[ii].selectable !== false) {
                this.tagIndex++
                if (this.imgflipSelection[this.tagIndex].selectable === false) {
                  for (let i = this.tagIndex; i < this.imgflipSelection.length - 1; i++) {
                    if (this.imgflipSelection[this.tagIndex].selectable === false) {
                      this.tagIndex++
                    } else {
                      break
                    }
                  }
                }
                break
              }
            }
          } else {
            this.tagIndex = this.imgflipSelection.length - 1
          }
        }
      }
    },
    handleCommentInput: function () {
      // Check for @ to prompt user for tagging a person
      if (this.new_message.substring(this.new_message.length - 1) === '@') {
        this.isTaggingUser = true
        this.tagIndex = 0
      } else {
        // Hide the tagging window if there is no @ present
        if (this.isTaggingUser === true && !this.new_message.includes('@')) {
          this.isTaggingUser = false
        }
      }
      if (this.isTaggingUser === true) {
        for (let i = this.new_message.length - 1; i >= 0; i--) {
          if (this.new_message.substring(i, i + 1) === '@') {
            let string = ''
            for (let j = i + 1; j < this.new_message.length; j++) {
              if (this.new_message.substring(j, j + 1) === ' ') {
                this.isTaggingUser = false
                return
              }
              string += this.new_message.substring(j, j + 1).toUpperCase()
            }
            for (let k = 0; k < this.members.length; k++) {
              this.members[k].taggable = string === '' ||
                this.members[k].usr.toUpperCase().includes(string)
            }
            for (let k = 0; k < this.members.length; k++) {
              if (this.members[k].taggable === true) {
                this.tagIndex = k
                break
              }
            }
            break
          }
        }
      }
      // Check for /flip to prompt user for selecting a meme template
      if (this.new_message.substring(this.new_message.length - 5) === '/flip') {
        this.isSelectingImgflipTemplate = true
        this.tagIndex = 0
        this.getImgFlipSelection()
      } else {
        // Hide the tagging window if there is no @ present
        if (this.isSelectingImgflipTemplate === true && !this.new_message.includes('/flip')) {
          this.isSelectingImgflipTemplate = false
        }
      }
      if (this.isSelectingImgflipTemplate === true) {
        for (let i = this.new_message.length - 1; i >= 0; i--) {
          if (this.new_message.substring(i, i + 6) === '/flip ') {
            let string = ''
            for (let j = i + 6; j < this.new_message.length; j++) {
              string += this.new_message.substring(j, j + 1).toUpperCase()
            }
            for (let k = 0; k < this.imgflipSelection.length; k++) {
              this.imgflipSelection[k].selectable = string === '' ||
                this.imgflipSelection[k].name.toUpperCase().includes(string)
            }
            for (let k = 0; k < this.imgflipSelection.length; k++) {
              if (this.imgflipSelection[k].selectable === true) {
                this.tagIndex = k
                break
              }
            }
            break
          }
        }
      }
    },
    resetEditing: function () {
      if (this.isEditingMessage !== true) {
        return
      }
      const msg = document.getElementById(this.messageEditing.gUID)
      if (msg != null) msg.style.backgroundColor = ''
      const editElem = document.getElementById('edit_' + this.messageEditing.gUID)
      if (editElem != null) editElem.style.display = 'none'
      this.isEditingMessage = false
      this.messageEditing = {}
      this.new_message = ''
      setTimeout(() => {
        this.auto_grow()
        this.focusComment(true)
      }, 0)
    },
    editOwnLastMessage: function () {
      for (let i = 0; i < this.messages.length; i++) {
        if (this.messages[i].editable === true) {
          this.editMessage(this.messages[i])
          return
        }
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
    setProfilePicture: async function (evt) {
      evt.stopPropagation()
      evt.preventDefault()
      const file = evt.target.files[0]
      const base64 = await this.getBase64(file)
      const headers = new Headers()
      headers.set('Authorization', 'Bearer ' + this.$store.state.token)
      const url = this.$store.state.serverIP + '/api/m5/setmemberimage/' + this.getSession()
      const updateFun = this.getClarifierMetaData
      const getMessagesFun = this.getClarifierMessages
      const content = JSON.stringify({
        imageBase64: base64,
        username: this.$store.state.username
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
        .then(() => (getMessagesFun()))
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
      if (imgGUID == null || imgGUID === '') {
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
      const distanceToBottom = (this.message_section.scrollTop * -1)
      const distanceToTop = this.message_section.scrollHeight -
        this.message_section.clientHeight - distanceToBottom
      // If we're scrolling up, show that we're seeing older messages
      if (distanceToBottom > 0) {
        document.getElementById('scroll_to_bottom').style.opacity = '1'
      } else {
        document.getElementById('scroll_to_bottom').style.opacity = '0'
      }
      // If we're 100px from the top, start loading new messages
      if (distanceToTop < 100) {
        if (this.lazyLoadingStatus === 'idle') {
          this.lazyLoadingStatus = 'start'
          this.lazyLoadMessages()
        }
      }
    },
    lazyLoadMessages: function () {
      this.getClarifierMessages(true, this.getChatGUID())
    },
    createSubchatroom: async function (subchatType) {
      if (this.new_subchat_name.trim() === '') {
        this.new_subchat_name = ''
        return
      }
      const content = JSON.stringify({
        title: this.new_subchat_name.trim(),
        type: subchatType
      })
      this.hideNewSubchatWindow()
      const headers = new Headers()
      headers.set('Authorization', 'Bearer ' + this.$store.state.token)
      const mainSessionGUID = this.getSession()
      let response
      fetch(
        this.$store.state.serverIP + '/api/m5/createchatroom?parent=' + mainSessionGUID,
        {
          method: 'post',
          headers: headers,
          body: content
        }
      )
        .then((res) => res.json())
        .then((data) => (response = data))
        .then(() => this.getClarifierMetaData(mainSessionGUID, false, true))
        .then(() => this.gotoSubchat(response.guid))
        .catch((err) => console.error(err.message))
    },
    gotoSubchat: async function (subchatGUID, subchatMode = true) {
      console.debug('gotoSubchat->connect')
      if (subchatGUID == null) return
      this.websocketState = 'SWITCHING'
      this.lazyLoadingStatus = 'switching'
      if (subchatMode === true) {
        this.$store.commit('setLastClarifierSubGUID', subchatGUID)
        console.debug('gotoSubchat->connect as SUBCHAT', subchatGUID, subchatMode)
        await this.$router.replace({
          path: '/apps/clarifier/wss/' + this.getSession(),
          query: { sub: subchatGUID }
        })
      } else {
        this.$store.commit('setLastClarifierSubGUID', 'none')
        console.debug('gotoSubchat->connect as GENERAL', subchatGUID, subchatMode)
        await this.$router.replace({
          path: '/apps/clarifier/wss/' + this.getSession()
        })
      }
      this.disconnect()
      this.messages = []
      await this.serverLogin()
      this.hideAllSidebars()
      await this.connect(subchatGUID, subchatMode)
      this.lazyLoadingStatus = 'idle'
      this.inputField.focus()
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
          title: 'File Not Uploaded',
          text: 'An Error occurred while uploading the file.',
          type: 'error'
        })
    },
    getChatGUID: function () {
      let chatGUID = this.getSessionSub()
      if (chatGUID === 'none') {
        chatGUID = this.getSession()
      }
      return chatGUID
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
    },
    reactToMessage: function (msg, t) {
      const payload = JSON.stringify({
        uniMessageGUID: msg.gUID,
        type: t
      })
      this.addMessagePar('[c:REACT<JSON]' + payload)
    },
    editMessage: function (msg, remove = false) {
      if (remove === true) {
        const payload = JSON.stringify({
          uniMessageGUID: msg.gUID,
          newContent: ''
        })
        this.addMessagePar('[c:EDIT<JSON]' + payload)
      } else {
        this.isEditingMessage = true
        this.messageEditing = msg
        this.new_message = msg.msg
        this.focusComment(true)
        setTimeout(() => {
          this.auto_grow()
          document.getElementById(msg.gUID).style.backgroundColor = '#192129'
          const editElem = document.getElementById('edit_' + this.messageEditing.gUID)
          if (editElem != null) editElem.style.display = 'flex'
        }, 0)
      }
    },
    getMemberCount: function () {
      if (this.mainMembers != null) {
        return this.mainMembers.length
      } else {
        return 0
      }
    },
    getAddMessageTitle: function () {
      if (this.isEditingMessage === true) {
        return 'Edit Message'
      } else {
        return 'Send Message'
      }
    },
    scrollToBottom: function (focusInput = true) {
      this.message_section.scrollTop = 0
      if (focusInput) this.focusComment(true)
    },
    hasUnread: function (guid) {
      if (guid == null) return false
      const timestamp = this.$store.getters.getTimestamp(guid)
      if (timestamp == null) return false
      let lastMessageTS = timestamp.tsNew
      if (lastMessageTS == null) lastMessageTS = 0
      let lastReadTS = timestamp.tsRead
      if (lastReadTS == null) lastReadTS = 0
      return lastReadTS < lastMessageTS
    },
    generateRSAKeyPair: async function (uniChatroomGUID) {
      if (uniChatroomGUID == null || uniChatroomGUID === '') return
      // Check if we already have a PrivKey for this chat GUID
      const clarifierKeyPair = this.$store.getters.getClarifierKeyPair(this.getChatGUID())
      if (clarifierKeyPair != null) return false
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
        id: this.getChatGUID(),
        priv: await this.exportRSAPrivKey(keyPair.privateKey)
      })
      const headers = new Headers()
      headers.set('Authorization', 'Bearer ' + this.$store.state.token)
      const content = JSON.stringify({
        pubKeyPEM: await this.exportRSAPubKey(keyPair.publicKey)
      })
      return new Promise((resolve) => {
        fetch(
          this.$store.state.serverIP + '/api/m5/pubkey/' + uniChatroomGUID,
          {
            method: 'post',
            headers: headers,
            body: content
          }
        )
          .then(resolve)
          .catch((err) => console.error(err.message))
      })
    },
    arrayBufferToString: function (buf) {
      return String.fromCharCode.apply(null, new Uint8Array(buf))
    },
    stringToArrayBuffer: function (str) {
      const buf = new ArrayBuffer(str.length)
      const bufView = new Uint8Array(buf)
      for (let i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i)
      }
      return buf
    },
    exportAESKey: async function (key) {
      const exported = await window.crypto.subtle.exportKey(
        'raw',
        key
      )
      return new Uint8Array(exported)
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
    importSecretKey: function (rawKey) {
      return window.crypto.subtle.importKey(
        'raw',
        rawKey,
        'AES-CBC',
        true,
        ['encrypt', 'decrypt']
      )
    },
    importRSAPrivKey: function (pem) {
      // fetch the part of the PEM string between header and footer
      const pemHeader = '-----BEGIN PRIVATE KEY-----'
      const pemFooter = '-----END PRIVATE KEY-----'
      const pemContents = pem.substring(pemHeader.length, pem.length - pemFooter.length)
      // base64 decode the string to get the binary data
      const binaryDerString = window.atob(pemContents)
      // convert from a binary string to an ArrayBuffer
      const binaryDer = this.stringToArrayBuffer(binaryDerString)
      return window.crypto.subtle.importKey(
        'pkcs8',
        binaryDer,
        {
          name: 'RSA-OAEP',
          hash: 'SHA-384'
        },
        true,
        ['decrypt']
      )
    },
    importRSAPubKey: async function (pem) {
      const pemHeader = '-----BEGIN PUBLIC KEY-----'
      const pemFooter = '-----END PUBLIC KEY-----'
      const pemContents = pem.substring(pemHeader.length, pem.length - pemFooter.length)
      const binaryDerString = window.atob(pemContents)
      const binaryDer = this.stringToArrayBuffer(binaryDerString)
      return await window.crypto.subtle.importKey(
        'spki',
        binaryDer,
        {
          name: 'RSA-OAEP',
          hash: 'SHA-384'
        },
        true,
        ['encrypt']
      )
    },
    generateAESKey: async function () {
      return await window.crypto.subtle.generateKey(
        {
          name: 'AES-CBC',
          length: 256
        },
        true,
        ['encrypt', 'decrypt']
      )
    },
    encodeStringUInt: function (content) {
      return new TextEncoder().encode(content)
    },
    encryptMessageRSA: async function (content, pubKey) {
      const encoded = this.encodeStringUInt(content)
      return await window.crypto.subtle.encrypt(
        {
          name: 'RSA-OAEP'
        },
        pubKey,
        encoded
      )
    },
    decryptMessageRSA: async function (content) {
      const keyPair = this.$store.getters.getClarifierKeyPair(this.getChatGUID())
      const privKey = await this.importRSAPrivKey(keyPair.priv)
      const decrypted = await window.crypto.subtle.decrypt(
        {
          name: 'RSA-OAEP'
        },
        privKey,
        content
      )
      return new TextDecoder().decode(decrypted)
    },
    encryptMessageAES: async function (content, key, iv) {
      const encoded = this.encodeStringUInt(content)
      return await window.crypto.subtle.encrypt(
        {
          name: 'AES-CBC',
          iv: iv
        },
        key,
        encoded
      )
    },
    decryptMessageAES: async function (content, key, iv) {
      const decrypted = await window.crypto.subtle.decrypt(
        {
          name: 'AES-CBC',
          iv: iv
        },
        key,
        content
      )
      return new TextDecoder().decode(decrypted)
    },
    generateIvAES: function () {
      return window.crypto.getRandomValues(new Uint8Array(16))
    },
    arrayBufferToBase64: function (buffer) {
      let binary = ''
      const bytes = new Uint8Array(buffer)
      const len = bytes.byteLength
      for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i])
      }
      return window.btoa(binary)
    },
    base64ToArrayBuffer: function (base64) {
      const binaryString = window.atob(base64)
      const len = binaryString.length
      const bytes = new Uint8Array(len)
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i)
      }
      return bytes.buffer
    },
    startScreenshare: async function (userId, constraints = null) {
      if (this.isStreamingVideo) {
        this.$notify(
          {
            title: 'Not Available',
            text: 'There is already a stream going on.',
            type: 'error'
          })
        return
      }
      try {
        // Ask for screen sharing permission + prompt user to select screen
        let stream = null
        if (this.currentSubchat.type === 'screenshare') {
          const constraintsT = {
            video: {
              cursor: 'always'
            },
            audio: true
          }
          stream = await navigator.mediaDevices.getDisplayMedia(constraintsT)
        } else if (this.currentSubchat.type === 'webcam') {
          let constraintsT
          if (constraints) {
            constraintsT = constraints
          } else {
            constraintsT = {
              video: true,
              audio: true
            }
          }
          stream = await navigator.mediaDevices.getUserMedia(constraintsT)
        }
        const videoElem = document.getElementById('screenshare_video')
        videoElem.srcObject = stream
        videoElem.setAttribute('controls', '')
        this.isStreamingVideo = true
        this.peerType = 'caller'
        this.peerStreamOutgoing = stream
        await this.createOutgoingPeerConnections(stream, userId)
        // Go into distraction free cinema mode
        this.enterCinemaMode()
        // Start the count-up timer
        this.streamStartTime = Math.floor(Date.now() / 1000)
        this.startTimeCounter()
      } catch (err) {
        console.error('Error: ' + err)
      }
    },
    stopScreenshare: function () {
      const videoElem = document.getElementById('screenshare_video')
      videoElem.srcObject = null
      videoElem.removeAttribute('controls')
      const videoElem2 = document.getElementById('screenshare_video_remote')
      if (videoElem2 != null) {
        videoElem2.srcObject = null
        videoElem2.removeAttribute('controls')
      }
      if (this.peerType === 'caller') {
        this.peerStreamOutgoing.getTracks().forEach(function (track) {
          track.stop()
        })
      }
      this.peerType = 'idle'
      this.isStreamingVideo = false
      this.streamStartTime = ''
      this.streamDuration = ''
      // Revert styling changes
      this.exitCinemaMode()
    },
    enterCinemaMode: function () {
      const chat = document.getElementById('chat_section')
      chat.style.position = 'fixed'
      chat.style.top = '0'
      chat.style.left = '0'
      chat.style.zIndex = '9999'
      const sidebar = document.getElementById('sidebar')
      sidebar.style.display = 'none'
      const sidebar2 = document.getElementById('sidebar2')
      sidebar2.style.display = 'none'
      const members = document.getElementById('member_section')
      members.style.display = 'none'
    },
    exitCinemaMode: function () {
      const chat = document.getElementById('chat_section')
      chat.style.position = 'initial'
      chat.style.top = 'initial'
      chat.style.left = 'initial'
      chat.style.zIndex = 'initial'
      const sidebar = document.getElementById('sidebar')
      sidebar.style.display = 'initial'
      const sidebar2 = document.getElementById('sidebar2')
      sidebar2.style.display = 'initial'
      const members = document.getElementById('member_section')
      members.style.display = 'initial'
    },
    startTimeCounter: function () {
      const now = Math.floor(Date.now() / 1000)
      const diff = now - this.streamStartTime
      let m = Math.floor(diff / 60)
      let s = Math.floor(diff % 60)
      m = this.padTime(m)
      s = this.padTime(s)
      this.streamDuration = m + ':' + s
      if (this.isStreamingVideo) {
        setTimeout(this.startTimeCounter, 1000)
      }
    },
    padTime: function (i) {
      if (i < 10) {
        i = '0' + i
      }
      return i
    },
    acceptWebRTCOffer: async function (payload, stream) {
      if (this.peerType === 'caller') {
        return
      } else {
        this.peerType = 'callee'
      }
      const answer = await this.wRTC.acceptOffer(payload.selfId, payload.remoteId, payload.offer, stream)
      if (answer.answer) {
        this.addMessagePar('[c:SC]' + '[B]' + JSON.stringify(answer))
      }
    },
    acceptWebRTCAnswer: async function (payload) {
      const accepted = await this.wRTC.acceptAnswer(payload.remoteId, payload.answer)
      if (!accepted) return
      const resp = {
        selfId: payload.remoteId,
        remoteId: payload.selfId
      }
      console.debug('%cAccepted Answer... sending and triggering ICE on REMOTE', this.wRTC.logStyle)
      this.addMessagePar('[c:SC]' + '[D]' + JSON.stringify(resp))
      const peerConnection = await this.wRTC.getPeerConnection(payload.remoteId)
      if (peerConnection.candidates) {
        for (let i = 0; i < peerConnection.candidates.length; i++) {
          const candidatePayload = {
            selfId: peerConnection.remoteId,
            remoteId: this.userId,
            candidate: peerConnection.candidates[i].candidate
          }
          console.log('%cSending Candidate', this.wRTC.logStyle, peerConnection.candidates[i].candidate)
          this.addMessagePar('[c:SC]' + '[C]' + JSON.stringify(candidatePayload))
        }
      }
    },
    setICECandidate: async function (payload) {
      await this.wRTC.setICECandidate(payload.remoteId, payload.candidate)
    },
    createOutgoingPeerConnections: async function (stream, userId) {
      const calleeList = []
      if (userId) {
        calleeList.push(userId)
      } else {
        // If no userId is provided, add everybody except the current user as a Callee
        for (let i = 0; i < this.members.length; i++) {
          if (this.members[i].id !== this.userId) {
            calleeList.push(this.members[i].id)
          }
        }
      }
      // Create a WebRTC Peer to Peer Connection for each callee
      let offer = null
      for (let i = 0; i < calleeList.length; i++) {
        this.wRTC.initiatePeerConnection(stream, this.userId, calleeList[i])
        offer = await this.wRTC.createOffer(calleeList[i])
        if (offer.offer) {
          this.addMessagePar('[c:SC]' + '[A]' + JSON.stringify(offer))
        }
      }
    },
    makeElementDraggable: function (element) {
      let pos1 = 0
      let pos2 = 0
      let pos3 = 0
      let pos4 = 0
      if (document.getElementById(element.id + '_anchor')) {
        document.getElementById(element.id + '_anchor').onmousedown = dragMouseDown
      } else {
        element.onmousedown = dragMouseDown
      }

      function dragMouseDown (e) {
        e = e || window.event
        e.preventDefault()
        pos3 = e.clientX
        pos4 = e.clientY
        document.onmouseup = closeDragElement
        document.onmousemove = elementDrag
      }

      function elementDrag (e) {
        e = e || window.event
        e.preventDefault()
        pos1 = pos3 - e.clientX
        pos2 = pos4 - e.clientY
        pos3 = e.clientX
        pos4 = e.clientY
        element.style.top = (element.offsetTop - pos2) + 'px'
        element.style.left = (element.offsetLeft - pos1) + 'px'
      }

      function closeDragElement () {
        document.onmouseup = null
        document.onmousemove = null
      }
    },
    toggleImgflipBoxMode: function () {
      if (this.isFillingImgflipTemplate.mode === 'top-bottom') {
        this.isFillingImgflipTemplate.mode = 'boxes'
        this.isFillingImgflipTemplate.boxes = [{
          text: '',
          id: 0
        }]
        setTimeout(() => {
          const toggler = document.getElementById('imgflip_toolbar_boxtools_toggler')
          toggler.classList.add('disabled')
          // Increase template size and center it
          const img = document.getElementById('imgflip_meme')
          const boxContainer = document.getElementById('meme_boxes_container')
          if (img.clientWidth > img.clientHeight) {
            img.style.width = 'calc(100% - 20px)'
            img.style.height = 'auto'
            boxContainer.style.width = 'calc(100% - 20px)'
            boxContainer.style.height = 'auto'
          } else {
            const marginLeft = 'calc(50% - ' + (img.clientWidth / 2).toString() + 'px)'
            img.style.marginLeft = marginLeft
            boxContainer.style.marginLeft = marginLeft
          }
          // Show controls
          document.getElementById('imgflip_toolbar_boxtools').style.opacity = '1'
          // Make the default input draggable
          const defaultTextarea = document.getElementById('imgflip_draggableText_0_div')
          defaultTextarea.value = ''
          this.makeElementDraggable(defaultTextarea)
        }, 0)
      } else {
        this.isFillingImgflipTemplate.mode = 'top-bottom'
      }
    },
    addImgflipTextBox: function () {
      if (this.isFillingImgflipTemplate.mode !== 'boxes') return
      const boxContainer = document.getElementById('meme_boxes_container')
      if (boxContainer == null) return
      const boxId = this.isFillingImgflipTemplate.boxes.length
      this.isFillingImgflipTemplate.boxes.push({
        text: '',
        id: boxId
      })
      setTimeout(() => {
        // Make the input draggable
        const defaultTextarea = document.getElementById('imgflip_draggableText_' + boxId + '_div')
        defaultTextarea.value = ''
        this.makeElementDraggable(defaultTextarea)
      }, 0)
    },
    sendImgflipBoxes: function () {
      // Original template dimensions
      const widthOriginal = this.imgflip_template.width
      const heightOriginal = this.imgflip_template.height
      // Scaled template dimensions
      const img = document.getElementById('imgflip_meme')
      const width = img.clientWidth
      const height = img.clientHeight
      // Get scaling factors
      const widthFactor = widthOriginal / width
      const heightFactor = heightOriginal / height
      // Create Imgflip compatible boxes array
      let box
      let boxDom
      let boxDivDom
      let xPos
      let yPos
      let widthScaled
      let heightScaled
      const boxes = []
      for (let i = 0; i < this.isFillingImgflipTemplate.boxes.length; i++) {
        box = this.isFillingImgflipTemplate.boxes[i]
        boxDom = document.getElementById('imgflip_draggableText_' + box.id)
        boxDivDom = document.getElementById('imgflip_draggableText_' + box.id + '_div')
        xPos = Math.floor((parseInt(boxDivDom.style.left, 10) * widthFactor))
        yPos = Math.floor((parseInt(boxDivDom.style.top, 10) * heightFactor))
        widthScaled = Math.floor(boxDivDom.clientWidth * widthFactor)
        heightScaled = Math.floor(boxDivDom.clientHeight * heightFactor)
        if (boxDom.value !== '') {
          boxes.push({
            text: boxDom.value.trim(),
            x: xPos,
            y: yPos,
            width: widthScaled,
            height: heightScaled
          })
        }
      }
      this.submitImgflipMeme(boxes)
    },
    removeValuesFromArray: function (array, value) {
      let i = 0
      while (i < array.length) {
        if (array[i] === value) {
          array.splice(i, 1)
        } else {
          ++i
        }
      }
      return array
    },
    upgradeChatroom: function () {
      const headers = new Headers()
      headers.set('Authorization', 'Bearer ' + this.$store.state.token)
      const content = JSON.stringify({
        toRank: this.chatroom.rank + 1
      })
      fetch(
        this.$store.state.serverIP + '/api/m5/upgrade/' + this.getSession(),
        {
          method: 'post',
          headers: headers,
          body: content
        }
      )
        .then(() => this.getClarifierMetaData(this.getSession(), false, true))
        .then(() => this.markActiveSubchat())
        .catch((err) => console.error(err.message))
    },
    distributeBadges: function () {
      const headers = new Headers()
      headers.set('Authorization', 'Bearer ' + this.$store.state.token)
      fetch(
        this.$store.state.serverIP + '/api/m2/badges/set/' + this.getSession(),
        {
          method: 'get',
          headers: headers
        }
      )
        .then(() => this.getClarifierMetaData(this.getSession(), false, true))
        .then(() => this.markActiveSubchat())
        .catch((err) => console.error(err.message))
    },
    getBadges: function (username) {
      const headers = new Headers()
      headers.set('Authorization', 'Bearer ' + this.$store.state.token)
      fetch(
        this.$store.state.serverIP + '/api/m2/badges/get/' + username,
        {
          method: 'get',
          headers: headers
        }
      )
        .then((res) => res.json())
        .then((data) => (this.setUserBadges(data)))
        .catch((err) => console.error(err.message))
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
    markActiveSubchat: function () {
      if (!this.isSubchat) {
        document.getElementById(this.chatroom.guid + '_subc')
          .classList.toggle('active', true)
      } else {
        document.getElementById(this.currentSubchat.guid + '_subc')
          .classList.toggle('active', true)
      }
    },
    showUserProfileFromName: function (username) {
      for (let i = 0; i < this.mainMembers.length; i++) {
        if (this.mainMembers[i].usr === username) {
          this.showUserProfile(this.mainMembers[i])
        }
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
          '?guid=' + this.chatroom.guid +
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
    shareActivity (ev) {
      let found = false
      if (this.userActivity.length > 0) {
        // Check if activity was previously shared already
        for (let i = 0; i < this.userActivity.length; i++) {
          if (this.userActivity[i].user === this.$store.state.username) {
            // How long ago did we share?
            const dateThen = this.userActivity[i].date
            const dateNow = new Date()
            const seconds = (dateNow.getTime() - dateThen.getTime()) / 1000
            if (seconds < 5) return
            // Update if it was more than 10 seconds ago
            this.userActivity[i].date = new Date()
            found = true
          }
        }
      }
      this.addMessagePar('[c:SC]' + '[activity]' + this.$store.state.username)
      if (!found) {
        this.removeUserFromIdle(this.$store.state.username)
        this.userActivity.unshift({
          user: this.$store.state.username,
          date: new Date()
        })
      }
    },
    receiveActivity (username) {
      let found = false
      if (this.userActivity.length > 0) {
        // Check if activity was previously shared
        for (let i = 0; i < this.userActivity.length; i++) {
          if (this.userActivity[i].user === username) {
            // Update
            this.userActivity[i].date = new Date()
            found = true
          }
        }
      }
      if (!found) {
        this.removeUserFromIdle(username)
        this.userActivity.unshift({
          user: username,
          date: new Date()
        })
      }
    },
    receiveIdle (username) {
      let found = false
      if (this.userActivityIdle.length > 0) {
        // Check if activity was previously shared
        for (let i = 0; i < this.userActivityIdle.length; i++) {
          if (this.userActivityIdle[i].user === username) {
            // Update
            this.userActivityIdle[i].date = new Date()
            found = true
          }
        }
      }
      if (!found) {
        this.userActivityIdle.unshift({
          user: username,
          date: new Date()
        })
      }
    },
    clearActivity () {
      for (let i = this.userActivity.length; i > 0; i--) {
        const dateThen = this.userActivity[i - 1].date
        const dateNow = new Date()
        const seconds = (dateNow.getTime() - dateThen.getTime()) / 1000
        if (seconds > 10) {
          this.receiveIdle(this.userActivity[i - 1].user)
          this.userActivity.splice(i - 1, 1)
        }
      }
    },
    clearActivityIdle () {
      for (let i = this.userActivityIdle.length; i > 0; i--) {
        const dateThen = this.userActivityIdle[i - 1].date
        const dateNow = new Date()
        const seconds = (dateNow.getTime() - dateThen.getTime()) / 1000
        if (seconds > (60 * 5)) {
          this.userActivityIdle.splice(i - 1, 1)
        }
      }
    },
    removeUserFromActivity: function (username) {
      if (this.userActivity.length < 1) return
      // Check if activity was previously shared already
      for (let i = 0; i < this.userActivity.length; i++) {
        if (this.userActivity[i].user === username) {
          this.receiveIdle(this.userActivity[i].user)
          this.userActivity.splice(i, 1)
          break
        }
      }
    },
    removeUserFromIdle: function (username) {
      if (this.userActivityIdle.length < 1) return
      // Check if activity was previously shared already
      for (let i = 0; i < this.userActivityIdle.length; i++) {
        if (this.userActivityIdle[i].user === username) {
          this.userActivityIdle.splice(i, 1)
          break
        }
      }
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

.b_darkergray {
  @apply bg-neutral-900;
}

.c_darkergray {
  @apply text-neutral-900;
}

.b_darkgray {
  @apply bg-slate-700;
}

.c_darkgray {
  @apply text-gray-800;
}

.b_gray {
  @apply bg-gray-700;
}

.c_gray {
  @apply text-gray-700;
}

.c_lightgray {
  @apply text-neutral-300;
}

.b_orange {
  background-color: #ff5d37;
}

.c_orange {
  color: #ff5d37;
}

.user_badge:hover {
  transition: 0.1s ease;
  @apply text-white cursor-pointer rounded-xl bg-neutral-300 bg-opacity-20;
}

.tooltip-mock-destination.show {
  opacity: 1;
  transition: 0.5s;
  transform: translateY(0);
}

.tooltip-mock-destination {
  margin-left: 1ch;
  color: #aeaeb7;
  display: inline-block;
  font-size: 16px;
  font-weight: bold;
  width: auto;
  opacity: 0;
  transform: translateY(10px);
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

.gray-hover:hover,
.active_gray {
  @apply bg-gray-800;
  cursor: pointer;
  border-radius: 10px;
}

.golden-hover {
  background-color: darkgoldenrod;
}

.golden-hover:hover {
  background-color: gold;
  cursor: pointer;
  box-shadow: #FFF 0 -1px 4px, #ff0 0 -2px 10px, #ff9931 0 -10px 20px, #9f7900 0 -18px 40px, 5px 5px 15px 5px rgba(0, 0, 0, 0);
}

.selectableGIF:hover {
  cursor: grab;
}

.user_profile,
.giphygrid,
.session_settings {
  position: fixed;
  z-index: 1001;
  bottom: 80px;
  right: 16px;
  color: white;
  max-width: calc(100vw - 32px);
  width: 400px;
  max-height: calc(100vh - 200px);
  height: 100%;
  padding: 5px 20px;
  border-radius: 20px;
}

.user_role {
  z-index: 1001;
  color: white;
  width: 250px;
  padding: 5px 20px;
  overflow: hidden;
  border: 2px solid black;
  border-radius: 20px;
}

.serverMessage {
  text-wrap: normal;
  word-wrap: break-word;
  padding: 8px;
  @apply bg-slate-700;
  border-radius: 20px;
  text-align: center;
  color: #aeaeb7;
  font-weight: bold;
  width: 100%;
}

.header-margin {
  min-height: 60px;
  box-shadow: 0 0 5px 5px black;
  z-index: 3;
  position: relative;
}

.new_comment {
  position: absolute;
  left: 10px;
  width: calc(100% - 100px);
  color: white;
  border-color: transparent;
  border-radius: 6px 0 0 6px;
  resize: none;
  overflow-x: hidden;
  overflow-y: auto;
  height: 40px;
  min-height: 40px;
  max-height: calc(100vh - 150px);
}

.new_comment:focus {
  outline: none;
}

.new_comment_info {
  position: absolute;
  bottom: 0;
  left: 10px;
  color: white;
  overflow: hidden;
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
  width: 55px;
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
  overflow-y: auto;
  color: white;
  z-index: 1000;
  position: absolute;
  right: 0;
  border-left: 1px solid rgba(174, 174, 183, 0.25);
  height: 100vh;
  opacity: 0;
  transition: ease-in-out all 0.2s;
}

.sidebar.active {
  width: 250px;
}

.sidebar2.active {
  width: 250px;
  border-right: 1px solid rgba(174, 174, 183, 0.25);
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
  transition: 0.1s ease opacity;
}

.member_section.active .member_count,
.member_section.active .user_badge {
  opacity: 1;
}

.sidebar_tooltip {
  position: fixed;
  left: 55px;
  transform: translateY(-36px);
  opacity: 0;
  pointer-events: none;
}

.channel_tooltip {
  position: fixed;
  left: 54px;
  transform: translateY(-47px);
  opacity: 0;
  pointer-events: none;
}

@media only screen and (max-width: 1099px) {
  .clarifier_chatroom {
    width: calc(100% - 55px);
    left: 55px;
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
    border-radius: 10px;
  }

  .sidebar.active, .sidebar2.active, .member_section.active {
    @apply backdrop-blur-xl bg-neutral-900 bg-opacity-75;
  }
}

.sidebar.active .sidebar_tooltip {
  display: none;
}

.sidebar.active .channel_tooltip {
  display: none;
}

.sidebar_bg {
  border-radius: 0 20px 0 0;
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
  .session_settings {
    transform: translateX(-250px);
  }
}

.sb_toggler {
  position: absolute;
  width: 100%;
  right: 0;
  top: 4px;
  color: white;
  font-size: 150%;
}

.member_section_toggler {
}

.sb_link {
  height: 35px;
  max-height: 35px;
  padding: 13px;
  margin-bottom: 10px;
  font-weight: bold;
  font-size: 125%;
}

.sb_link_icon {
  width: 50px;
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
  box-shadow: 0 20px 10px -15px #111;
  font-weight: bold;
  font-size: 125%;
  color: white;
  padding-left: 10px;
  display: flex;
  z-index: 10;
  position: relative;
  border-bottom: 1px solid rgba(174, 174, 183, 0.25);
  align-items: center;
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
  @apply bg-slate-700
}

.subchat.active span {
  color: white;
}

.nopointer {
  pointer-events: none;
}

.darkbutton {
  @apply bg-gray-800;
}

.darkbutton:hover {
  @apply bg-black;
}

.message {
  color: white;
  padding: 2px 25px 2px 15px;
}

.message:hover {
  background-color: rgba(38, 38, 38, 0.2);
}

.msg_options {
  height: 30px;
  position: absolute;
  right: 0;
  transform: translateY(-30px);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-items: center;
  justify-content: space-around;
  opacity: 0;
}

.msg_time {
  opacity: 0;
  color: gray;
  font-size: 80%;
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center
}

.message:hover .msg_time,
.message:hover .msg_options {
  opacity: 1;
}

.clientMessage {
  word-wrap: break-word;
  position: relative;
  width: calc(100% - 42px);
  margin: 0 !important;
  @apply text-neutral-300;
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

.message_button {
  width: 40px;
  height: 40px;
  border-color: transparent;
  border-radius: 1em
}

.btn-no-fx,
.btn-no-fx:focus {
  outline: none !important;
  border: none;
}

.scroll_to_bottom {
  position: absolute;
  bottom: 60px;
  height: 20px;
  width: calc(100% - 20px);
  border-radius: 20px;
  padding: 0;
  font-size: 75%;
  font-weight: bold;
  opacity: 0;
  transition: 0.3s opacity
}

.user_tagger,
.imgflip_selector {
  position: absolute;
  bottom: 60px;
  left: 10px;
  width: calc(100% - 20px);
  border-radius: 20px;
  padding: 0;
  font-weight: bold;
  transition: 0.3s opacity;
  max-height: calc(90vh - 70px);
  overflow-y: auto;
  overflow-x: hidden;
}

#init_loading,
#loading {
  min-width: 100%;
  min-height: 100%;
  align-items: center;
  justify-content: center;
  z-index: 9999
}

.imgflip_text {
  width: calc(100% - 330px);
  height: 60px;
  position: absolute;
  left: 320px;
  text-transform: uppercase;
  font-size: 200%;
  font-family: Impact, Arial, sans-serif;
  color: white;
  text-shadow: -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000;
  background: transparent;
  border: none
}

.wrapper {
  display: grid;
  gap: 50px;
  grid-auto-rows: minmax(100px, auto);
  grid-template-columns: repeat(1, 1fr);
}

/* Small devices (portrait tablets and large phones, 765px and up) */
@media only screen and (min-width: 992px) {
  .wrapper {
    grid-template-columns: repeat(2, 1fr);
  }
}

.draggable_meme_text {
  resize: both;
  background-color: rgba(255, 255, 255, 0.5);
  font-size: 50px;
  font-family: Impact, Arial, sans-serif;
  color: white;
  text-shadow: -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000;
  padding-left: 10px
}

.draggable_meme_text_anchor {
  width: 20px;
  height: 20px;
  background-color: white;
  cursor: move;
  border: 1px solid black;
  display: flex;
  align-items: center;
  justify-content: center
}

/* Leaderboard 1st Place */
.leaderboard-table tr:nth-child(2) {
  color: gold;
  border-bottom: 2px solid gold;
}

/* Leaderboard 2nd Place */
.leaderboard-table tr:nth-child(3) {
  color: silver;
  border-bottom: 2px solid silver;
}

/* Leaderboard 3rd Place */
.leaderboard-table tr:nth-child(4) {
  color: saddlebrown;
  border-bottom: 2px solid saddlebrown;
}

</style>

<style>

.clientMessage p {
  @apply mb-4;
}

.clientMessage p:last-child {
  @apply m-0;
}

.clientMessage table {
  @apply mb-4;
}

.clientMessage th, .clientMessage td {
  @apply p-2 border border-slate-700;
}

.clientMessage tr {
  @apply hover:bg-neutral-800;
}

.clientMessage ul {
  @apply list-disc list-inside mb-2;
}

.clientMessage ol {
  @apply list-decimal list-inside mb-2;
}

.clientMessage pre {
  @apply mb-2;
}

.clientMessage a {
  @apply underline;
}

.clientMessage h1 {
  @apply text-4xl mb-2;
}

.clientMessage h2 {
  @apply text-3xl mb-2;
}

.clientMessage h3 {
  @apply text-2xl mb-2;
}

.clientMessage h4 {
  @apply text-xl mb-2;
}

.clientMessage h5 {
  @apply text-lg mb-2;
}

</style>
