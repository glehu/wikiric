<template>
  <div id="clarifier_chatroom_view_elem"
       class="darkest_bg w-full h-full absolute overflow-hidden">
    <div class="fixed top-0 left-0 w-full h-full">
      <div id="sidebar" ref="sidebar"
           class="sidebar darkest_bg darkergray-on-small h-full relative top-[55px]"
           style="z-index: 100">
        <div style="height: calc(100% - 55px)"
             class="sidebar_bg">
          <div style="height: 140px; overflow-x: clip; position: relative">
            <div style="width: 100%; height: 35px; padding-top: 10px">
              <span class="sb_link_text c_lightgray nopointer">Menu</span>
            </div>
            <button class="sb_toggler btn-no-outline" v-on:click="toggleSidebar()">
              <i class="bi bi-caret-right c_lightgray"></i>
            </button>
            <ul class="nav_list list-unstyled"
                style="color: white; margin-top: 5px">
              <li>
                <div class="sb_link" v-on:click="disconnect(); this.$router.push('/apps/clarifier')">
                  <div class="c_lightgray orange-hover"
                       v-tooltip.right="{
                         content: 'Exit',
                         disabled: sidebar.active,
                       }">
                    <i class="sb_link_icon bi bi-x-square"></i>
                    <span class="sb_link_text">Exit</span>
                  </div>
                </div>
              </li>
              <li style="opacity: 0.5">
                <div class="sb_link nopointer">
                  <div class="c_lightgray">
                    <i class="sb_link_icon bi bi-tools"></i>
                    <span class="sb_link_text">Settings</span>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <div style="width: 100%; position: relative; z-index: 3"
               class="sb_fold">
            <hr class="c_lightgray"
                style="width: 75%; margin: auto auto 10px;">
            <span class="sb_link_text c_lightgray nopointer">
            Activity&nbsp;-&nbsp;{{ $store.state.clarifierSessions.length }}
          </span>
          </div>
          <div id="channel_section" class="channel_section overflow-y-auto overflow-x-hidden"
               style="height: calc(100% - 55px - 100px); z-index: 4;
                      padding-bottom: 20px; margin-top: 10px">
            <div v-for="group in $store.state.clarifierSessions" :key="group"
                 class="channel_link"
                 style="position: relative; font-weight: bold">
              <a class="font-bold text-white orange-hover" style="text-decoration: none"
                 v-on:click="connectToGroup(group.id)"
                 v-tooltip.right="{
                   content: group.title,
                   disabled: sidebar.active,
                 }">
                <div class="c_lightgray orange-hover"
                     style="height: 50px; display: flex; align-items: center;">
                  <div style="width: 50px; height: 100%; position: relative;
                            display: flex; align-items: center; justify-content: center;">
                    <div v-if="group.id === chatroom.guid"
                         style="position: absolute; height: 40px; width: 5px; left: 0; z-index: 5"
                         class="brightest_bg rounded-r">
                    </div>
                    <div :id="group.id + '_notify'"
                         class="hidden bg-orange-500 rounded-r"
                         style="position: absolute; height: 40px; width: 5px; left: 0; z-index: 5">
                      <div class="hidden">{{ hasUnread(group.id) }}</div>
                    </div>
                    <template v-if="group.img && group.img !== ''">
                      <img class="w-[40px] h-[40px] z-10 rounded-lg ml-[5px]"
                           v-bind:src="getImg(group.img,true)" :alt="getImgAlt(group.title)"/>
                    </template>
                    <template v-else>
                      <div class="medium_bg flex items-center justify-center
                                  w-[40px] h-[40px] z-10 rounded-lg ml-[5px]">
                        {{ getImgAlt(group.title) }}
                      </div>
                    </template>
                  </div>
                  <span class="sb_link_text text-nowrap"
                        style="position: absolute; left: 36px;">
                  {{ group.title }}
                </span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div id="sidebar2" ref="sidebar2"
           style="margin-top: 55px"
           class="sidebar2 medium_bg lg:rounded-tl">
        <div class="h-full relative">
          <div class="c_lightgray px-2 h-full overflow-x-hidden overflow-y-auto">
            <div style="height: 50px; align-items: center; display: flex">
              <div id="home_subc" class="subchat dark_bg"
                   v-on:click="gotoSubchat(null, false)">
                <i id="home_notify"
                   class="absolute -translate-x-4
                          w-[6px] h-[28px] rounded-r-full
                          z-50 bg-orange-500 hidden">
                  <span class="hidden">{{ hasUnread(getSession(), true) }}</span>
                </i>
                <HomeIcon class="h-5 w-5"></HomeIcon>
                <span class="relative left-[20px]">Home</span>
              </div>
            </div>
            <template v-if="canShowSidebar">
              <div style="width: 100%; height: 35px; padding-top: 5px">
                <p class="px-2 font-bold c_lightgray nopointer">Apps</p>
              </div>
              <template v-if="this.chatroom.rank > 1">
                <div class="w-full text-neutral-300">
                  <template v-if="this.chatroom.rank > 3">
                    <div class="subchat w-full flex items-center"
                         v-on:click="gotoStudio()">
                      <RectangleGroupIcon class="h-5 w-5"></RectangleGroupIcon>
                      <span class="relative left-[20px]">Studio</span>
                    </div>
                  </template>
                  <template v-if="this.chatroom.rank > 3">
                    <div class="subchat w-full flex items-center"
                         v-on:click="gotoPlanner()">
                      <ViewColumnsIcon class="h-5 w-5"></ViewColumnsIcon>
                      <span class="relative left-[20px]">Planner</span>
                    </div>
                  </template>
                  <template v-if="this.chatroom.rank > 2">
                    <div class="subchat w-full flex items-center">
                      <div v-on:click="setOverlay('knowledgefinder')" class="w-full flex items-center">
                        <BookOpenIcon class="h-5 w-5"></BookOpenIcon>
                        <span class="relative left-[20px]">Knowledge</span>
                      </div>
                      <div class="ml-auto p-2 translate-x-2 shadow-hover
                                  rounded-r hover:bg-indigo-600"
                           v-on:click="createProcess()"
                           v-tooltip.top="{ content: 'Quick Note' }">
                        <DocumentTextIcon class="h-5 w-5"></DocumentTextIcon>
                      </div>
                    </div>
                  </template>
                </div>
              </template>
              <div class="subchat w-full flex items-center"
                   v-on:click="showFiles()">
                <FolderIcon class="h-5 w-5"></FolderIcon>
                <span class="relative left-[20px]">Files</span>
              </div>
              <div style="width: 100%; height: 35px; padding-top: 5px"
                   class="px-2 flex relative items-center justify-between">
                <span class="font-bold c_lightgray nopointer">Subchats</span>
                <button class="text-white btn-no-outline translate-x-0.5"
                        v-tooltip.top="{ content: 'New Subchat' }"
                        v-on:click="showNewSubchatWindow">
                  <i class="bi bi-plus lead orange-hover c_lightgray"
                     style="font-size: 150%"></i>
                </button>
              </div>
              <template v-for="subchat in chatroom.subChatrooms" :key="subchat">
                <div :id="subchat.guid + '_subc'"
                     class="subchat"
                     style="display: flex"
                     v-on:click="gotoSubchat(subchat.guid)">
                  <i :id="subchat.guid + '_notify'"
                     class="absolute -translate-x-4
                          w-[6px] h-[28px] rounded-r-full
                          z-50 bg-orange-500 hidden">
                    <span class="hidden">{{ hasUnread(subchat.guid) }}</span>
                  </i>
                  <template v-if="subchat.type === 'screenshare'">
                    <WindowIcon class="h-5 w-5"></WindowIcon>
                  </template>
                  <template v-else-if="subchat.type === 'webcam'">
                    <i class="bi bi-camera-video h-5 w-5 flex items-center justify-center text-lg"></i>
                  </template>
                  <template v-else>
                    <HashtagIcon class="h-5 w-5"></HashtagIcon>
                  </template>
                  <span class="relative left-[20px]">{{ subchat.t }}</span>
                </div>
                <template v-if="subchat._subMembers">
                  <div v-for="subMember in subchat._subMembers" :key="subMember"
                       class="flex items-center pl-3.5 ml-3.5 border-l-[4px] border-neutral-900">
                    <div class="text-sm pt-1">{{ subMember.usr }}</div>
                  </div>
                </template>
              </template>
            </template>
            <template v-else>
              <div class="w-full p-4 text-neutral-300">
                <button class="w-full flex items-center justify-center
                               border border-zinc-600 rounded
                               px-3 py-2 dark_bg hover:darkest_bg"
                        v-on:click="directCall()">
                  <PhoneIcon class="min-w-[20px] min-h-[20px] max-w-[20px] max-h-[20px] mr-4"></PhoneIcon>
                  <span class="text-sm">Call {{ chatroom.t }}</span>
                </button>
              </div>
            </template>
          </div>
        </div>
      </div>
      <div id="clarifier_chatroom" :ref="'clarifier_chatroom'"
           class="clarifier_chatroom flex overflow-clip mt-[55px]"
           v-on:click="closeModals()">
        <template v-if="overlayType === 'msg'">
          <div id="chat_section"
               class="chat_section w-full h-full overflow-clip
                      medium_bg rounded-tl-lg lg:rounded-tl-none lg:rounded-tr-lg">
            <div class="chat_header medium_bg">
              <div
                style="width: calc(100% - 130px); overflow-x: clip; display: flex; font-size: 80%; align-items: center">
                <div style="margin-left: 10px"
                     class="orange-hover text-neutral-200"
                     v-on:click="gotoSubchat(null, false)">
                  {{ chatroom.t }}
                </div>
                <div v-if="isSubchat === true" class="nopointer">
                  <span style="margin-left: 10px"><i class="bi bi-caret-right text-neutral-200"></i></span>
                  <span style="margin-left: 10px" class="text-neutral-200">{{ currentSubchat.t }}</span>
                </div>
                <div v-if="isStreamingVideo"
                     id="stream_nav"
                     class="text-xl flex items-center ml-6">
                  <h2 class="font-bold text-neutral-300">
                    {{ streamDuration }}
                  </h2>
                </div>
                <div v-else>
                  <template v-if="chatroom.type === 'direct'">
                    <button class="w-full flex lg:hidden items-center justify-center
                                   border border-zinc-600 rounded ml-6
                                   p-1 dark_bg hover:darkest_bg"
                            v-on:click="directCall()">
                      <PhoneIcon class="min-w-[20px] min-h-[20px] max-w-[20px] max-h-[20px]"></PhoneIcon>
                    </button>
                  </template>
                </div>
              </div>
              <button class="btn-no-outline c_lightgray"
                      style="position: absolute; right: 90px"
                      title="Show Settings"
                      v-on:click="toggleSessionSettings()">
                <i class="sb_link_icon bi bi-wrench orange-hover" style="height: 25px; width: 25px"></i>
              </button>
              <button class="btn-no-outline c_lightgray member_section_toggler"
                      style="position: absolute; right: 50px"
                      title="Show Subchats"
                      v-on:click="toggleSidebar2()">
                <i class="sb_link_icon bi bi-chat-square-dots orange-hover"
                   style="height: 25px; width: 25px"></i>
              </button>
              <button class="btn-no-outline c_lightgray member_section_toggler"
                      style="position: absolute; right: 10px"
                      title="Show Members"
                      v-on:click="toggleMemberSidebar()">
                <i class="bi bi-people orange-hover" style="height: 25px; width: 25px"></i>
              </button>
            </div>
            <div v-if="canShowVideoElements"
                 id="conference_container" ref="conference_container"
                 style="width: calc(100% - 350px);
                        height: calc(100% - 50px - 80px);
                        position: absolute; left: 350px;
                        padding: 0"
                 class="c_lightgray darkest_bg rounded-bl-md">
              <div class="w-full h-[calc(100%-55px)] flex">
                <div style="position: relative; top: 0; left: 0;
                            width: 100%;
                            aspect-ratio: 16 / 9"
                     class="flex">
                  <template v-if="!isStreamingVideo">
                    <div class="flex pointer-events-none absolute w-full h-full items-center justify-center
                                darkest_bg z-30">
                      <i class="bi bi-camera-video-off lead"></i>
                      <p style="margin: 0 0 0 10px;
                              padding-left: 10px;
                              border-left: 1px solid rgba(174, 174, 183, 0.25)">
                        STREAM OFFLINE
                      </p>
                    </div>
                  </template>
                  <template v-if="currentSubchat.type === 'screenshare'">
                    <video id="screenshare_video" autoplay playsinline muted
                           class="conference_media_element"
                           style="width: 100%; height: 100%"></video>
                  </template>
                  <template v-else-if="currentSubchat.type === 'webcam' || params">
                    <div id="conference_grid" ref="conference_grid"
                         class="grid w-full overflow-hidden"
                         style="grid-template-columns: repeat(auto-fit, minmax(min(300px, 100%), 1fr));">
                      <div class="relative overflow-hidden w-full h-full">
                        <div class="flex w-full h-full items-center justify-center
                                      absolute top-0 left-0">
                          <user-circle-icon class="w-8 h-8 text-neutral-100 mr-2"></user-circle-icon>
                          <p class="text-lg text-neutral-100 font-bold">
                            {{ $store.state.username }}
                          </p>
                        </div>
                        <video id="screenshare_video"
                               autoplay playsinline muted
                               class="w-full h-full max-w-full max-h-full conference_media_element
                                          absolute z-10"></video>
                        <video id="screenshare_video_alternate"
                               autoplay playsinline muted controls
                               class="absolute top-0 left-0 w-full h-full max-w-full max-h-full
                                      conference_media_element hidden"></video>
                        <p class="absolute top-0 left-0 text-sm bg-zinc-900 bg-opacity-75 p-0.5 z-20">
                          {{ $store.state.username }}
                        </p>
                      </div>
                      <template v-for="peerCon in remotePeerConnections" :key="peerCon.remoteId">
                        <div :id="'screenshare_container_' + peerCon.remoteId"
                             hidden
                             class="relative overflow-hidden w-full h-full">
                          <div class="flex w-full h-full items-center justify-center
                                      absolute top-0 left-0">
                            <template v-if="peerCon.iurl && peerCon.iurl !== ''">
                              <img :src="getImg(peerCon.iurl, true)" alt="?"
                                   class="sender_avatar">
                              <template v-if="peerCon.iurla && peerCon.iurla !== ''">
                                <img :src="getImg(peerCon.iurla, true)" alt="?"
                                     class="sender_avatar absolute hidden sender_avatar_animated">
                              </template>
                            </template>
                            <template v-else>
                              <UserCircleIcon class="w-8 h-8 text-neutral-100 mr-2 sender_avatar"></UserCircleIcon>
                            </template>
                            <p class="text-lg text-neutral-100 font-bold">
                              {{ getUserFromId(peerCon.remoteId) }}
                            </p>
                          </div>
                          <video :id="'screenshare_video_' + peerCon.remoteId"
                                 autoplay playsinline
                                 class="w-full h-full max-w-full max-h-full conference_media_element
                                          absolute z-10"></video>
                          <audio :id="'screenshare_audio_' + peerCon.remoteId"
                                 autoplay controls
                                 class="absolute bottom-0 left-0 conference_media_element
                                          m-2 w-full h-[32px] rounded-none"></audio>
                          <p class="absolute top-0 left-0 text-sm bg-zinc-900 bg-opacity-75 p-0.5 z-20">
                            {{ getUserFromId(peerCon.remoteId) }}
                          </p>
                        </div>
                      </template>
                    </div>
                  </template>
                </div>
                <div v-if="!isStreamingVideo && (currentSubchat.type === 'screenshare')"
                     style="position: absolute; top: 10px; right: 10px" class="text-end">
                  <button v-on:click="startCall()"
                          class="gray-hover c_lightgray px-3 py-2"
                          style="position: relative;
                             margin-left: 20px; margin-top: 10px;
                             border: 1px solid #ff5d37;
                             border-radius: 10px;">
                    Group Meeting
                  </button>
                  <br>
                  <template v-for="user in this.members" :key="user">
                    <template v-if="user.id !== userId">
                      <button v-on:click="startCall(user.id)"
                              class="gray-hover c_lightgray px-3 py-2"
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
              <div class="w-full h-[55px] flex items-center justify-center gap-x-4">
                <template v-if="isStreamingVideo">
                  <button v-on:click="stopScreenshare()"
                          v-tooltip.top="{ content: 'Hang Up' }"
                          class="p-2 border border-red-500 rounded-md gray-hover">
                    <PhoneXMarkIcon class="h-8 w-8 text-red-500"></PhoneXMarkIcon>
                  </button>
                  <template v-if="peerStreamOutgoingConstraints.video">
                    <template v-if="peerStreamOutgoingPreferences.video">
                      <button class="p-2 border border-zinc-400 rounded-md gray-hover"
                              v-tooltip.top="{ content: 'Turn Off Camera' }"
                              v-on:click="callStartOrMuteVideo()">
                        <VideoCameraIcon class="h-8 w-8 text-neutral-400"></VideoCameraIcon>
                      </button>
                    </template>
                    <template v-else>
                      <button class="p-2 border border-zinc-400 rounded-md gray-hover"
                              v-tooltip.top="{ content: 'Turn On Camera' }"
                              v-on:click="callStartOrMuteVideo()">
                        <div class="relative">
                          <VideoCameraIcon class="h-8 w-8 text-neutral-400"></VideoCameraIcon>
                          <XMarkIcon class="h-8 w-8 text-neutral-200 stroke-2 absolute top-0 left-0.5"></XMarkIcon>
                          <XMarkIcon class="h-8 w-8 text-zinc-900 stroke-2 absolute top-0 left-0"></XMarkIcon>
                        </div>
                      </button>
                    </template>
                  </template>
                  <template v-else>
                    <button class="p-2 border border-zinc-400 rounded-md gray-hover"
                            v-tooltip.top="{ content: 'Enable Camera' }"
                            v-on:click="callSetUserMedia({video: true, audio: undefined})">
                      <div class="relative">
                        <VideoCameraIcon class="h-8 w-8 text-neutral-400"></VideoCameraIcon>
                        <XMarkIcon class="h-8 w-8 text-neutral-200 stroke-2 absolute top-0 left-0.5"></XMarkIcon>
                        <XMarkIcon class="h-8 w-8 text-zinc-900 stroke-2 absolute top-0 left-0"></XMarkIcon>
                      </div>
                    </button>
                  </template>
                  <template v-if="peerStreamOutgoingPreferences.audio">
                    <button class="p-2 border border-zinc-400 rounded-md gray-hover relative"
                            v-tooltip.top="{ content: 'Turn Off Microphone' }"
                            v-on:click="callStartOrMuteAudio()">
                      <MicrophoneIcon class="h-8 w-8 text-neutral-400"></MicrophoneIcon>
                    </button>
                  </template>
                  <template v-else>
                    <button class="p-2 border border-zinc-400 rounded-md gray-hover"
                            v-tooltip.top="{ content: 'Turn On Microphone' }"
                            v-on:click="callStartOrMuteAudio()">
                      <div class="relative">
                        <MicrophoneIcon class="h-8 w-8 text-neutral-400"></MicrophoneIcon>
                        <XMarkIcon class="h-8 w-8 text-neutral-200 stroke-2 absolute top-0 left-0.5"></XMarkIcon>
                        <XMarkIcon class="h-8 w-8 text-zinc-900 stroke-2 absolute top-0 left-0"></XMarkIcon>
                      </div>
                    </button>
                  </template>
                  <template v-if="!isSharingScreen">
                    <button v-tooltip.top="{ content: 'Share Screen' }"
                            class="p-2 border border-zinc-400 rounded-md gray-hover"
                            v-on:click="callStartOrStopScreenshare()">
                      <WindowIcon class="h-8 w-8 text-neutral-400"></WindowIcon>
                    </button>
                  </template>
                  <template v-else>
                    <button v-tooltip.top="{ content: 'Stop Sharing' }"
                            class="p-2 border border-green-500 rounded-md gray-hover"
                            v-on:click="callStartOrStopScreenshare()">
                      <WindowIcon class="h-8 w-8 text-green-600"></WindowIcon>
                    </button>
                  </template>
                </template>
                <template v-else>
                  <template v-if="currentSubchat.type === 'webcam' || params">
                    <button class="p-2 border border-zinc-500 rounded-md text-neutral-300 hover:dark_bg"
                            v-tooltip.top="{ content: 'Audio Call' }"
                            v-on:click="startCall(undefined, {video: false, audio: true})">
                      <PhoneIcon class="h-8 w-8"></PhoneIcon>
                    </button>
                    <button class="p-2 border border-zinc-500 rounded-md text-neutral-300 hover:dark_bg"
                            v-tooltip.top="{ content: 'Video Call' }"
                            v-on:click="startCall(undefined, {video: true, audio: true})">
                      <VideoCameraIcon class="h-8 w-8"></VideoCameraIcon>
                    </button>
                  </template>
                </template>
              </div>
            </div>
            <div id="messages_container" ref="messages_container"
                 class="h-[calc(100%-130px)] max-h-[calc(100%-130px)] overflow-hidden
                        bright_bg lg:rounded-tl-lg">
              <div id="messages_section" ref="messages_section"
                   class="messages_section relative flex h-full
                          overflow-y-auto overflow-x-hidden"
                   style="flex-direction: column-reverse">
                <div id="init_loading" style="display: none">
                  <span class="spinner-border c_orange" role="status" aria-hidden="true"></span>
                  <span class="ms-2 font-bold c_lightgray">Initializing...</span>
                </div>
                <div id="loading" style="display: none">
                  <span class="spinner-border c_orange" role="status" aria-hidden="true"></span>
                  <span class="ms-2 font-bold c_lightgray">Connecting...</span>
                </div>
                <template v-for="msg in messages" :key="msg.guid">
                  <div class="message" :id="msg.guid">
                    <template v-if="msg.separator === true">
                      <div class="headerline pointer-events-none">
                        <span class="text-xs text-neutral-300">
                          {{ getHumanReadableDateText(msg.ts, false, true) }}
                        </span>
                      </div>
                    </template>
                    <template v-if="msg.header === true">
                      <div style="height: 30px"
                           class="mt-2 relative flex items-center">
                        <template v-if="msg.src.startsWith('_server')">
                          <SignalIcon class="sender_avatar translate-y-[10px]"></SignalIcon>
                        </template>
                        <template v-else>
                          <template v-if="msg.iurl && msg.iurl !== ''">
                            <img :src="getImg(msg.iurl, true)" alt="?"
                                 class="sender_avatar translate-y-[10px]">
                            <template v-if="msg.iurla && msg.iurla !== ''">
                              <img :src="getImg(msg.iurla, true)" alt="?"
                                   class="sender_avatar translate-y-[10px] absolute hidden sender_avatar_animated">
                            </template>
                          </template>
                          <template v-else>
                            <UserCircleIcon class="sender_avatar translate-y-[10px]">
                            </UserCircleIcon>
                          </template>
                        </template>
                        <div class="orange-hover text-neutral-200 ml-[10px]"
                             style="font-weight: bold"
                             @click.stop="showUserProfileFromName(msg.src)">
                          {{ msg.src }}
                        </div>
                        <div class="flex gap-x-2 text-neutral-400 text-xs ml-3">
                          <div style="pointer-events: none">
                            <template v-if="!msg.isDraft">
                              {{ getHumanReadableDateText(msg.ts, true) }}
                            </template>
                            <template v-else>
                              <p class="font-bold">Sending...</p>
                            </template>
                          </div>
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
                            <div style="pointer-events: none" class="ms-1">
                              {{ msg.mType }}
                            </div>
                          </template>
                          <template v-if="msg.mType === 'Task'">
                            <div class="ms-1 c_orange h-4 w-4 inline-flex items-center justify-center"
                                 title="Planner Task">
                              <ViewColumnsIcon class="h-full w-full"/>
                            </div>
                          </template>
                        </div>
                      </div>
                    </template>
                    <div class="message_body">
                      <div style="min-width: 42px; max-width: 42px">
                        <template v-if="msg.header === false">
                          <div class="msg_time" style="pointer-events: none">
                            {{ getSimpleTime(msg.ts) }}
                          </div>
                        </template>
                      </div>
                      <template v-if="msg.tagActive === true">
                        <div style="position: absolute; height: 100%; width: 5px; left: 0;
                                    border-radius: 5px; z-index: 5; box-shadow: 0 0 15px 0 #ff5d37"
                             class="b_orange">
                        </div>
                      </template>
                      <div v-if="msg.mType !== 'CryptError' && !msg.src.startsWith('_server')"
                           class="msg_options gap-x-2">
                        <div class="darkest_bg rounded gap-x-4 flex px-2 py-1">
                          <button title="Reply" class="orange-hover"
                                  v-on:click="replyToMessage(msg)">
                            <i class="bi bi-reply-fill text-inherit"></i>
                          </button>
                          <template v-if="msg.editable === true">
                            <template v-if="!msg.mIsFile">
                              <button title="Edit" class="orange-hover"
                                      v-on:click="editMessage(msg)">
                                <i class="bi bi-pencil-fill text-inherit"></i>
                              </button>
                            </template>
                            <button title="Remove" class="orange-hover"
                                    v-on:click="editMessage(msg, true)">
                              <i class="bi bi-trash-fill text-inherit"></i>
                            </button>
                          </template>
                        </div>
                        <div class="darkest_bg rounded gap-x-4 flex px-2 py-1">
                          <button title="Upvote" class="orange-hover"
                                  v-on:click="reactToMessage(msg, '+')">
                            <i class="bi bi-hand-thumbs-up text-inherit"></i>
                          </button>
                          <button title="Downvote" class="orange-hover"
                                  v-on:click="reactToMessage(msg, '-')">
                            <i class="bi bi-hand-thumbs-down text-inherit"></i>
                          </button>
                        </div>
                        <div class="darkest_bg rounded gap-x-4 flex px-2 py-1">
                          <button title="Awesome!" class="orange-hover"
                                  v-on:click="reactToMessage(msg, '⭐')">
                            <i class="bi bi-star-fill text-inherit"></i>
                          </button>
                        </div>
                        <div class="darkest_bg rounded gap-x-4 flex px-2 py-1">
                          <button title="Create Wisdom" class="orange-hover"
                                  v-on:click="createWisdomForMessage(msg)">
                            <i class="bi bi-book-half text-inherit"></i>
                          </button>
                        </div>
                      </div>
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
                          <table class="table-auto leaderboard-table text-start"
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
                      <template v-else-if="msg.mType === 'GIF'">
                        <div class="clientMessage">
                          <img :src="msg.msgURL"
                               :alt="msg.msg"
                               :style="{maxWidth: mediaMaxWidth}"
                               style="cursor: zoom-in"
                               v-on:click="showImage(msg.msgURL)">
                          <br>
                          <div>
                            <img src="../../assets/giphy/PoweredBy_200px-Black_HorizText.png"
                                 alt="Powered By GIPHY"
                                 style="width: 100px"/>
                          </div>
                        </div>
                      </template>
                      <template v-else-if="msg.mType === 'Image'">
                        <div>
                          <img :src="msg.msgURL"
                               :alt="msg.msg"
                               class="clientMessage"
                               :style="{maxWidth: mediaMaxWidth}"
                               style="cursor: zoom-in"
                               v-on:click="showImage(msg.msgURL)">
                        </div>
                      </template>
                      <template v-else-if="msg.mType === 'Audio'">
                        <div class="clientMessage">
                          <p class="pointer-events-none text-sm rounded-md mb-2
                                    text-neutral-200 font-bold">
                            {{ msg.fileName }}
                          </p>
                          <audio controls preload="auto"
                                 class="uploadFileSnippet">
                            <source :src="msg.msgURL">
                            Your browser does not support playing audio.
                          </audio>
                        </div>
                      </template>
                      <template v-else-if="msg.mType === 'Joke'">
                        <p class="clientMessage">
                          {{ msg.msg }}
                        </p>
                      </template>
                      <template v-else-if="msg.mType === 'Task'">
                        <taskcontainer :message="msg.msg"
                                       class="clientMessage"/>
                      </template>
                      <template v-else-if="msg.mType === 'Reply'">
                        <div>
                          <div class="text-neutral-400 border-l-8 border-l-zinc-800">
                            <div class="w-fit rounded-tr-md dark_bg py-1 pr-2">
                              <p class="text-xs font-bold text-neutral-300 pointer-events-none">
                                {{ getHumanReadableDateText(msg.source.time, true) }}
                              </p>
                            </div>
                            <div class="p-2">
                              <Markdown :id="'rsr_' + msg.guid"
                                        class="py-1 px-2 w-fit mb-1 clientMessage markedView"
                                        :source="msg.source.msg"
                                        :breaks="true"
                                        :plugins="plugins"
                                        :style="{maxWidth: mediaMaxWidth}"/>
                            </div>
                            <div class="w-fit rounded-tr-md dark_bg py-1 pr-2">
                              <p class="text-xs text-neutral-300 font-bold pointer-events-none">
                                Reply to {{ msg.source.src }}:
                              </p>
                            </div>
                          </div>
                          <Markdown :id="'msg_' + msg.guid"
                                    class="clientMessage markedView w-fit"
                                    :source="msg.msg"
                                    :breaks="true"
                                    :plugins="plugins"/>
                        </div>
                      </template>
                      <template v-else-if="msg.mType.includes('File')">
                        <div class="clientMessage">
                          <a :href="msg.msgURL"
                             download
                             v-tooltip.top="{content: 'Download File'}">
                            <div class="my-1 cursor-pointer w-fit
                                        flex items-center gap-x-2 btn_bg_primary">
                              <template v-if="msg.mType === 'TextFile'">
                                <DocumentTextIcon class="h-6 w-6"></DocumentTextIcon>
                              </template>
                              <template v-else>
                                <FolderArrowDownIcon class="h-6 w-6"></FolderArrowDownIcon>
                              </template>
                              <p class="pointer-events-none text-sm text-neutral-200 font-bold">
                                {{ msg.fileName }}
                              </p>
                            </div>
                          </a>
                        </div>
                      </template>
                      <template v-else>
                        <Markdown :id="'msg_' + msg.guid"
                                  class="clientMessage markedView"
                                  :source="msg.msg"
                                  :breaks="true"
                                  :plugins="plugins"/>
                      </template>
                    </div>
                    <div v-if="msg.reacts && msg.reacts.length > 0"
                         style="display: flex; margin: 5px 0 10px 50px">
                      <div v-for="reaction in msg.reacts" :key="reaction.src"
                           style="display: flex; padding: 2px 4px 2px 4px; margin-right: 4px; border-radius: 5px"
                           class="darkest_bg c_lightgray gray-hover"
                           :title="reaction.src.toString() + ' reacted to this message.'"
                           v-on:click="reactToMessage(msg, reaction.t)"
                           :id="'react_' + msg.guid + '_' + reaction.t">
                        <i v-if="reaction.t === '+'"
                           class="bi bi-hand-thumbs-up" style="margin-right: 2px"></i>
                        <i v-else-if="reaction.t === '-'"
                           class="bi bi-hand-thumbs-down" style="margin-right: 2px"></i>
                        <span v-else> {{ reaction.t }} </span>
                        {{ reaction.src.length }}
                      </div>
                    </div>
                    <div :id="'edit_' + msg.guid" class="hidden w-full justify-center">
                      <div class="text-sm p-2 darkest_bg rounded mt-2 mb-1 text-center flex items-center">
                        <div class="ml-2 mr-4 text-neutral-400 pointer-events-none">
                          <template v-if="isEditingMessage">Edit</template>
                          <template v-else-if="isReplyingToMessage">Reply</template>
                        </div>
                        <div class="flex py-1 px-2 medium_bg rounded">
                          <div v-on:click="this.addMessage()" class="text-white cursor-pointer mr-1 font-bold">
                            [Enter]
                          </div>
                          <div class="mr-1 text-neutral-300 pointer-events-none">to save,</div>
                          <div v-on:click="this.resetEditing(); this.resetReplying()"
                               class="text-white cursor-pointer mr-1 font-bold">
                            [Esc]
                          </div>
                          <span class="text-neutral-300 pointer-events-none">to cancel.</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
              </div>
            </div>
            <div v-if="isTaggingUser"
                 class="user_tagger c_lightgray"
                 style="padding: 10px; position: absolute; z-index: 100">
              <p class="pointer-events-none mb-2">Tag a member:</p>
              <div v-for="(usr, index) in this.members" :key="usr"
                   :id="'usertagger_' + index"
                   class="gray-hover relative flex items-center mb-1"
                   :class="{'active_gray': index === this.tagIndex}"
                   v-on:click="tagUserProfile(usr)">
                <template v-if="usr.taggable === true">
                  <div class="px-1 flex items-center">
                    <i class="bi bi-at"
                       style="font-size: 200%">
                    </i>
                    <span style="font-weight: bold; margin-left: 5px"> {{ usr.usr }} </span>
                  </div>
                </template>
              </div>
            </div>
            <div v-if="isSelectingImgflipTemplate"
                 class="imgflip_selector c_lightgray"
                 style="padding: 10px; position: absolute; z-index: 100">
              <p class="pointer-events-none mb-2">Select an Imgflip meme template:</p>
              <template v-for="(template, index) in this.imgflipSelection" :key="template">
                <div v-if="template.selectable !== false"
                     :id="'templateselector_' + index"
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
                 class="imgflip_selector c_lightgray"
                 style="padding: 10px; position: absolute; z-index: 100; overflow: hidden">
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
                    <div class="c_darkgray ms-2 font-bold"
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
                     style="width: auto; height: calc(90vh - 70px - 80px); position: absolute; top: 55px; left: 0">
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
                              class="font-bold draggable_meme_text border-2 border-black"></textarea>
                  </div>
                </div>
              </template>
              <template v-else-if="isFillingImgflipTemplate.mode === 'top-bottom'">
                <input id="imgflip_topText"
                       style="bottom: 80px; background-color: rgba(255, 255, 255, 0.5);"
                       class="text-center font-bold imgflip_text"
                       placeholder="Top Text">
                <input id="imgflip_bottomText"
                       style="bottom: 10px; background-color: rgba(255, 255, 255, 0.5);"
                       class="text-center font-bold imgflip_text"
                       placeholder="Bottom Text"
                       v-on:keyup.enter="submitImgflipMeme">
              </template>
            </div>
            <div id="input_container" ref="input_container"
                 class="bright_bg input_section" v-if="overlayType === 'msg'">
              <button class="c_lightgray text-center scroll_to_bottom orange-hover"
                      id="scroll_to_bottom"
                      v-on:click="scrollToBottom">
                <i class="bi bi-arrow-down"></i>
                Click to jump to the newest messages
                <i class="bi bi-arrow-down"></i>
              </button>
              <div style="bottom: 0; left: 10px; opacity: 1"
                   class="scroll_to_bottom flex items-center px-1 overflow-clip">
                <template v-if="userActivity.length > 0">
                  <ChartBarIcon class="h-3 w-3 text-neutral-300"></ChartBarIcon>
                  <div class="flex items-center divide-x divide-zinc-800">
                    <template v-for="user in userActivity" :key="user">
                      <div class="px-2">
                  <span class="text-neutral-300 cursor-pointer hover:text-white font-normal"
                        @click.stop="showUserProfileFromName(user.user)">
                    {{ user.user }}
                  </span>
                      </div>
                    </template>
                  </div>
                </template>
                <template v-if="userActivityIdle.length > 0">
                  <EyeIcon class="h-3 w-3 text-neutral-400"></EyeIcon>
                  <div class="flex items-center divide-x divide-zinc-800">
                    <template v-for="user in userActivityIdle" :key="user">
                      <div class="px-2">
                  <span class="text-neutral-400 cursor-pointer hover:text-white font-normal"
                        @click.stop="showUserProfileFromName(user.user)">
                    {{ user.user }}
                  </span>
                      </div>
                    </template>
                  </div>
                </template>
              </div>
              <textarea id="new_comment" ref="new_comment"
                        class="new_comment medium_bg py-2 px-3 placeholder-neutral-400"
                        type="text"
                        v-model="new_message"
                        maxlength="5000"
                        :placeholder="'Message to ' + chatroom.t"></textarea>
              <button id="send_image_button"
                      class="message_button send_image_button medium_bg hover:brightness-200
                             flex justify-center items-center"
                      style="position: absolute; right: 50px; border-radius: 0"
                      title="Send Files"
                      v-on:click="toggleUploadingSnippet">
                <DocumentArrowUpIcon class="text-neutral-300 h-6 w-6"></DocumentArrowUpIcon>
              </button>
              <button class="message_button medium_bg hover:brightness-200 flex justify-center items-center"
                      style="position: absolute; right: 10px; border-radius: 0 6px 6px 0"
                      title="Search on GIPHY"
                      v-on:click="toggleSelectingGIF">
                <GifIcon class="text-neutral-300 h-8 w-6"></GifIcon>
              </button>
            </div>
          </div>
        </template>
        <template v-else-if="overlayType === 'knowledgefinder'"
                  class="h-[calc(100%-55px)] w-full translate-y-[55px] overflow-clip
                         darkest_bg lg:rounded-xl sm:border-[1px] sm:border-[rgba(174,174,183,0.25)]">
          <knowledgefinder :isoverlay="true" :srcguid="getSession()"
                           @close="setOverlay('msg'); prepareInputField()"/>
        </template>
      </div>
      <div id="member_section" style="margin-top: 55px"
           class="member_section darkest_bg">
        <div style="width: 100%; height: 50px; display: flex; align-items: center">
        <span class="font-bold member_count c_lightgray nopointer"
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
               class="user_badge px-2 py-1 relative flex items-center"
               v-on:click="showUserProfile(usr)">
            <template v-if="usr.iurl && usr.iurl !== ''">
              <img :src="getImg(usr.iurl, true)" alt="?"
                   class="sender_avatar">
              <template v-if="usr.iurla && usr.iurla !== ''">
                <img :src="getImg(usr.iurla, true)" alt="?"
                     class="sender_avatar absolute hidden sender_avatar_animated">
              </template>
            </template>
            <template v-else>
              <UserCircleIcon class="sender_avatar"></UserCircleIcon>
            </template>
            <div class="w-[40px] h-[40px] absolute flex items-end justify-end">
              <template v-if="usr.online">
                <div class="w-[13px] h-[13px] rounded-full bg-green-500 border-2 border-zinc-900"
                     v-tooltip.top="{ content: 'Online' }"></div>
              </template>
              <template v-else-if="usr.recent">
                <div class="w-[13px] h-[13px] rounded-full bg-zinc-900 border-2 border-zinc-900"
                     v-tooltip.top="{ content: 'AFK' }">
                  <MoonIcon class="w-full h-full text-orange-400"></MoonIcon>
                </div>
              </template>
              <template v-else>
                <div class="w-[13px] h-[13px] rounded-full bg-zinc-600 border-2 border-zinc-900"
                     v-tooltip.top="{ content: 'Offline' }"></div>
              </template>
            </div>
            <div class="font-bold ml-3">
              <template v-if="usr.active">
                <span class="text-neutral-300">{{ usr.usr }}</span>
              </template>
              <template v-else>
                <span class="text-neutral-500">{{ usr.usr }}</span>
              </template>
            </div>
          </div>
          <div class="px-4 pt-2 flex">
            <button class="text-neutral-300 btn-no-outline"
                    title="Invite"
                    v-on:click="invite()">
              <UserPlusIcon class="w-[24px] h-[24px]"></UserPlusIcon>
            </button>
            <span class="tooltip-mock-destination" :class="{'show':showInviteCopied}">Copied!</span>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="user_profile overflow-x-hidden overflow-y-auto"
       v-show="isViewingUserProfile" @click.stop>
    <div class="relative h-full">
      <i class="bi bi-x-lg lead orange-hover"
         style="cursor: pointer; position:absolute; right: 0" title="Close"
         v-on:click="hideAllWindows()"></i>
      <div class="flex items-center">
        <template v-if="viewedUserProfile.iurl && viewedUserProfile.iurl !== ''">
          <img :src="getImg(viewedUserProfile.iurl, true)" alt="?"
               class="sender_avatar_big">
          <template v-if="viewedUserProfile.iurla && viewedUserProfile.iurla !== ''">
            <img :src="getImg(viewedUserProfile.iurla, true)" alt="?"
                 class="sender_avatar_big absolute sender_avatar_animated">
          </template>
        </template>
        <template v-else>
          <UserCircleIcon class="sender_avatar_big">
          </UserCircleIcon>
        </template>
        <div class="w-[80px] h-[80px] absolute flex items-end justify-end">
          <template v-if="viewedUserProfile.online">
            <div class="w-[24px] h-[24px] rounded-full bg-green-500 border-2 border-zinc-900"
                 v-tooltip.top="{ content: 'Online' }"></div>
          </template>
          <template v-else-if="viewedUserProfile.recent">
            <div class="w-[24px] h-[24px] rounded-full bg-zinc-900 border-2 border-zinc-900"
                 v-tooltip.top="{ content: 'AFK' }">
              <MoonIcon class="w-full h-full text-orange-400"></MoonIcon>
            </div>
          </template>
          <template v-else>
            <div class="w-[24px] h-[24px] rounded-full bg-zinc-500 border-2 border-zinc-900"
                 v-tooltip.top="{ content: 'Offline' }"></div>
          </template>
        </div>
        <div class="block ml-2">
          <h2 class="font-bold text-2xl">
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
      <div class="items-center flex mt-3">
        <template v-if="viewedUserProfile.usr === $store.state.username">
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
                  v-on:click="gotoDirectMessages(viewedUserProfile.usr)">
            <i class="bi bi-send mr-2"></i>Direct Message
          </button>
          <button class="user_profile_button">
            <i class="bi bi-arrow-bar-left mr-2"></i>Kick
          </button>
          <button class="user_profile_button">
            <i class="bi bi-hammer mr-2"></i>Ban
          </button>
        </template>
      </div>
      <h5 class="c_lightgray mt-3 mb-2 headerline text-sm">Roles</h5>
      <div style="display: flex; flex-wrap: wrap">
        <div v-for="role in this.viewedUserProfile.roles" :key="role"
             class="dark_bg"
             style="border-radius: 5px; padding: 0 6px 4px 6px; margin-right: 1ch; margin-bottom: 1ch">
          <i v-show="isEditingRoles" class="bi bi-x-circle-fill orange-hover"
             style="margin-right: 4px"></i>
          <span class="text-neutral-400">{{ JSON.parse(role).name.replace(' ', '&nbsp;') }}</span>
        </div>
        <span style="border-radius: 2rem; margin-right: 1em" class="orange-hover"
              v-on:click="addUserRole" title="Add new Role">
          <i class="bi bi-plus-circle"></i>
        </span>
      </div>
      <div class="user_role b_darkergray items-center"
           v-show="isAddingRole" @click.stop>
        <div style="position: relative">
          <i class="bi bi-x-lg lead" style="cursor: pointer; position: absolute; right: 0" title="Close"
             v-on:click="isAddingRole = false"></i>
          <h4 class="font-bold">Add a new Role</h4>
          <input id="new_role"
                 type="text"
                 class="font-bold b_darkergray my-4"
                 style="height: 4ch; padding-left: 1ch; color: white; width: calc(100% - 1ch);
                        border: 1px solid white; border-radius: 10px"
                 v-model="new_role"
                 :placeholder="'Role'"
                 v-on:keyup.enter="commitUserRole">
        </div>
      </div>
      <template v-if="chatroom.rank > 1">
        <h5 class="c_lightgray mt-3 mb-2 headerline text-sm">Badges</h5>
        <template v-if="this.viewedUserProfile.badges == null || this.viewedUserProfile.badges.length < 1">
          <div style="border: 1px solid gray; border-radius: 10px; width: 100%; padding: 10%"
               class="c_lightgray text-center items-center pointer-events-none">
            <i class="bi bi-award-fill lead"></i>
            <br>Keep communicating to earn badges!
          </div>
        </template>
        <template v-else>
          <div class="w-full grid grid-cols-2 gap-3 mb-4">
            <div v-for="badge in this.viewedUserProfile.badges" :key="badge.handle"
                 class="c_lightgray text-center rounded-xl border-2 border-zinc-600 py-1 px-2 hover:medium_bg">
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
      <div style="display: flex; margin-bottom: 5px" class="items-center">
        <img :src="getImg(this.viewedUserProfile.iurl, true)" alt="No Picture"
             class="b_darkergray"
             style="width: 100px; height: 100px; border-radius: 100%">
        <div class="block ml-2">
          <h2 class="font-bold text-2xl">
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
      <label for="setProfilePicInput">
        Set a Profile Picture:
      </label>
      <br>
      <input id="setProfilePicInput" type="file" multiple v-on:change="setProfilePicture">
    </template>
    <template v-slot:footer>
    </template>
  </modal>
  <div class="giphygrid medium_bg p-3 h-full"
       style="overflow: hidden" v-show="isViewingGIFSelection" @click.stop>
    <div style="height: calc(100% - 50px); width: 100%; overflow-x: clip; overflow-y: auto"
         class="b_darkergray rounded-lg">
      <div v-for="gif in gifSelection" :key="gif"
           style="padding-top: 10px; padding-left: 10px; display: inline-flex"
           v-on:click="this.sendSelectedGIF(gif.images.fixed_height.url)">
        <img :src="gif.images.fixed_height.url" alt="Loading" class="selectableGIF"
             style="width: 100%; max-height: 150px">
      </div>
    </div>
    <div style="width: 100%; height: 50px"
         class="flex items-center">
      <input id="gif_query"
             type="text"
             class="font-bold b_darkergray rounded-lg px-2 py-1"
             style="height: 34px; color: white; border: none"
             v-model="gif_query_string"
             :placeholder="'Search on GIPHY'"
             v-on:keyup.enter="getGIFSelection(gif_query_string)">
      <img src="../../assets/giphy/PoweredBy_200px-Black_HorizText.png" alt="Powered By GIPHY"
           style="width: 90px; height: 10px" class="ml-2"/>
    </div>
  </div>
  <div class="session_settings medium_bg shadow"
       style="overflow-x: hidden; overflow-y: auto"
       v-show="isViewingSessionSettings" @click.stop>
    <div style="position: relative; width: 100%">
      <i class="bi bi-x-lg lead orange-hover"
         style="cursor: pointer; position:absolute; right: 0" title="Close"
         v-on:click="hideAllWindows()"></i>
      <h2 class="font-bold nopointer text-xl mb-2">Group Settings</h2>
      <div style="display: flex; width: 100%; margin-bottom: 10px">
        <template v-if="chatroom.imgGUID && chatroom.imgGUID !== ''">
          <img class="w-[80px] h-[80px] z-10 rounded-lg"
               v-bind:src="getImg(chatroom.imgGUID,true)" :alt="getImgAlt(chatroom.t)"/>
        </template>
        <template v-else>
          <div class="medium_bg flex items-center justify-center w-[80px] h-[80px] z-10 rounded-lg">
            {{ getImgAlt(chatroom.t) }}
          </div>
        </template>
        <div class="drop_zone" style="margin-left: 10px" id="drop_zone" :ref="'drop_zone'"
             v-on:drop="handleFileSelectDrop()" v-on:dragover="handleDragOver()">
          Upload a picture!
        </div>
      </div>
      <input type="file" class="file_input" id="files" name="files[]"
             style="width: 100%"
             multiple v-on:change="handleFileSelect"/>
      <div id="confirm_settings_loading" class="ml-3 mt-3" style="display: none">
        <span class="spinner-border c_orange" role="status" aria-hidden="true"></span>
        <span class="jetb ms-2">Uploading...</span>
      </div>
      <h4 class="text-neutral-300 font-bold text-lg nopointer mt-2">
        Reward Program
      </h4>
      <p style="font-size: 75%" class="c_lightgray mb-3">
        Communicate to unlock powerful upgrades for your group!
      </p>
      <div style="display: flex; align-items: center"
           class="c_lightgray mb-2">
        <span class="b_purple font-bold nopointer"
              style="border-radius: 5px; padding: 0 4px 4px 4px;
                     margin-right: 5px">
          Rank {{ chatroom.rank }}
        </span>
        <span class="b_purple font-bold nopointer"
              style="border-radius: 5px; padding: 0 4px 4px 4px;
                     margin-right: 5px">
          {{ chatroom.rankDescription }}
        </span>
        <button class="btn font-bold golden-hover golden-hover-glow"
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
        <div class="flex gap-1 mb-1" style="width: 100%">
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
              <br><span class="font-bold">Badges</span>
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
              <br><span class="font-bold">Knowledge</span>
            </div>
          </template>
          <div style="border: 2px dotted gray; border-radius: 10px; padding: 20px"
               class="text-center">
            <i class="bi bi-question"></i>
            <br><span>T.B.A.</span>
          </div>
        </div>
      </div>
      <div class="mt-2 p-2 rounded dark_bg">
        <h4 class="text-neutral-300 font-bold text-lg nopointer">
          Restoration
        </h4>
        <button class="mt-2 rounded bg-red-700 hover:bg-red-900 font-bold text-black p-2"
                v-on:click="generateRSAKeyPair(getChatGUID(),true)">
          Replace Encryption Key
        </button>
      </div>
    </div>
  </div>
  <modal
    v-show="isViewingNewSubchat"
    @close="hideAllWindows()">
    <template v-slot:header>
      New Subchat
    </template>
    <template v-slot:body>
      <div class="new_subchat" style="overflow: hidden; padding: 5px">
        <div class="relative w-full">
          <label for="new_subchat_name" class="font-bold lead c_lightgray">Name:</label>
          <input v-model="new_subchat_name"
                 id="new_subchat_name" type="text"
                 class="mt-2 b_darkergray text-white p-2 px-3 border-none w-full rounded-md">
          <label class="font-bold lead mt-4 c_lightgray" style="width: 100%">Create:</label>
          <button v-on:click="createSubchatroom('text')"
                  id="new_subchat_type_text" class="btn darkbutton mt-2 text-neutral-400"
                  style="width: 100%; text-align: left; display: flex;
                         align-items: center; border-radius: 10px">
            <span style="font-size: 200%"><i class="bi bi-hash"></i></span>
            <div class="ml-3">
              <span class="text-neutral-300">Text Subchat</span>
              <br>
              <span class="text-neutral-400 text-xs">Write messages and send files.</span>
            </div>
          </button>
          <button v-on:click="createSubchatroom('webcam')"
                  id="new_subchat_type_webcam" class="btn darkbutton mt-2 text-neutral-400"
                  style="width: 100%; text-align: left; display: flex;
                         align-items: center; border-radius: 10px">
            <span style="font-size: 200%"><i class="bi bi-camera-video"></i></span>
            <div class="ml-3">
              <span class="text-neutral-300">Conference Subchat</span>
              <br>
              <span class="text-neutral-400 text-xs">Meet up, talk and video chat with others.</span>
            </div>
          </button>
        </div>
      </div>
    </template>
    <template v-slot:footer>
    </template>
  </modal>
  <div class="session_settings shadow" style="overflow-x: hidden; overflow-y: auto"
       v-show="isUploadingSnippet" @click.stop>
    <div style="position: relative; padding-top: 10px; width: 100%">
      <i class="bi bi-x-lg lead" style="cursor: pointer; position:absolute; right: 0" title="Close"
         v-on:click="closeUploadingSnippet()"></i>
      <h2 class="font-bold text-2xl mb-4">File Upload</h2>
      <template v-if="uploadFileType !== ''">
        <div style="display: flex; width: 100%; margin-bottom: 10px; margin-top: 5px"
             class="markedView max-w-[400px]">
          <img v-if="uploadFileType.includes('image')"
               class="uploadFileSnippet"
               v-bind:src="uploadFileBase64" :alt="'&nbsp;'"/>
          <audio v-else-if="uploadFileType.includes('audio')"
                 controls preload="auto"
                 class="uploadFileSnippet">
            <source :src="uploadFileBase64" :type="uploadFileType">
            Your browser does not support playing audio.
          </audio>
          <template v-else-if="uploadFileType.includes('zip')">
            <FolderArrowDownIcon class="h-10 w-10"></FolderArrowDownIcon>
          </template>
          <template v-else-if="uploadFileType.includes('text')">
            <DocumentTextIcon class="h-10 w-10"></DocumentTextIcon>
          </template>
          <template v-else-if="uploadFileType.includes('pdf')">
            <DocumentTextIcon class="h-10 w-10"></DocumentTextIcon>
          </template>
        </div>
      </template>
      <template v-if="uploadFileBase64 === ''">
        <div class="drop_zone mb-2" id="snippet_drop_zone" :ref="'snippet_drop_zone'"
             v-on:drop="handleUploadImageSelectDrop()" v-on:dragover="handleDragOver()">
          Drop a file here!
        </div>
        <input type="file" class="file_input" id="snippet_files" :ref="'snippet_files'" name="files[]"
               v-on:drop="handleUploadImageSelectDrop()" v-on:dragover="handleDragOver()"
               style="width: 100%"
               multiple v-on:change="handleUploadFileSelect"/>
      </template>
      <div id="confirm_snippet_loading" class="ml-2 my-2" style="display: none">
        <span class="animate-spin c_orange" role="status" aria-hidden="true"></span>
        <span class="jetb ms-2">Uploading...</span>
      </div>
      <template v-if="uploadFileBase64 !== ''">
        <p class="text-neutral-300 font-bold">{{ this.uploadFileName }}</p>
        <div class="mt-3 w-full">
          <button class="darkbutton text-white p-2 w-full
                         flex items-center justify-center rounded-full"
                  style="height: 2.5em; border-color: transparent;
                         margin: auto"
                  title="Send"
                  v-on:click="addMessage">
            <span class="font-bold flex"><i class="bi bi-send mr-2"></i>Submit</span>
            <span style="margin-left: 10px" class="c_lightgray text-xs"> {{ this.uploadFileType }}</span>
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
    v-show="isTransferring"
    @close="hideAllWindows()">
    <template v-slot:header>
      <h2 class="font-bold text-2xl">Transfer</h2>
    </template>
    <template v-slot:body>
      <div class="md:flex">
        <div id="transfer_qrcode"></div>
        <div class="mt-4 md:mt-0 md:mx-4">
          <p class="text-xl">Guide:</p>
          <ol class="list-decimal list-inside">
            <li>Get the device that you are trying to migrate to.</li>
            <li>Scan the QR Code on the device.</li>
            <li>Wait for the transfer to finish.</li>
          </ol>
          <div class="flex mt-4 items-center">
            <span class="spinner-border c_orange" role="status" aria-hidden="true"></span>
            <span class="ml-2 font-bold c_lightgray">Waiting...</span>
          </div>
        </div>
      </div>
    </template>
    <template v-slot:footer>
    </template>
  </modal>
  <template v-if="isViewingProcess">
    <template v-if="processGUID != null && processGUID !== ''">
      <div class="session_settings h-full w-full">
        <processviewer :isoverlay="true" :srcguid="processGUID" :chatguid="chatroom?.guid"
                       @close="processGUID = ''; isViewingProcess = false"/>
      </div>
    </template>
  </template>
  <template v-if="isViewingFiles">
    <div class="session_settings h-full w-full">
      <fileviewer :isoverlay="true" :chatguid="chatroom?.guid"
                  @close="isViewingFiles = false"/>
    </div>
  </template>
  <modal
    v-show="isViewingImage"
    @close="isViewingImage = false">
    <template v-slot:header>
    </template>
    <template v-slot:body>
      <div class="h-[75vh] w-full flex justify-center">
        <img :src="viewingImageURL" alt="No Content"
             style="object-fit: contain"
             class="h-full w-full">
      </div>
    </template>
    <template v-slot:footer>
    </template>
  </modal>
</template>

<script>
// Own
import modal from '../../components/Modal.vue'
import taskcontainer from '../../components/TaskContainer.vue'
import knowledgefinder from '../../views/apps/KnowledgeFinderView'
import processviewer from '../../views/apps/ProcessView'
import fileviewer from '../../views/apps/FileExplorerView'
import WRTC from '@/libs/wRTC'
// External
import Markdown from 'vue3-markdown-it'
import markdownItMermaid from 'markdown-it-mermaid'
import mermaid from 'mermaid'
import 'highlight.js/styles/base16/google-dark.css'
import * as QRCode from 'easyqrcodejs'
import { DateTime } from 'luxon'
// Icons
import {
  ChartBarIcon,
  EyeIcon,
  GifIcon,
  MicrophoneIcon,
  MoonIcon,
  PhoneIcon,
  PhoneXMarkIcon,
  QrCodeIcon,
  UserCircleIcon,
  VideoCameraIcon
} from '@heroicons/vue/24/solid'
import {
  BookOpenIcon,
  DocumentArrowUpIcon,
  DocumentTextIcon,
  FolderArrowDownIcon,
  FolderIcon,
  HashtagIcon,
  HomeIcon,
  RectangleGroupIcon,
  SignalIcon,
  UserPlusIcon,
  ViewColumnsIcon,
  WindowIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline'

export default {
  props: {
    parsed: Object
  },
  components: {
    modal,
    taskcontainer,
    knowledgefinder,
    Markdown,
    PhoneIcon,
    VideoCameraIcon,
    MicrophoneIcon,
    XMarkIcon,
    DocumentArrowUpIcon,
    GifIcon,
    DocumentTextIcon,
    FolderArrowDownIcon,
    QrCodeIcon,
    ViewColumnsIcon,
    BookOpenIcon,
    ChartBarIcon,
    EyeIcon,
    HashtagIcon,
    WindowIcon,
    HomeIcon,
    SignalIcon,
    UserCircleIcon,
    UserPlusIcon,
    MoonIcon,
    PhoneXMarkIcon,
    processviewer,
    fileviewer,
    FolderIcon,
    RectangleGroupIcon
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
      peerStreamOutgoing: null,
      peerStreamOutgoingConstraints: {
        video: false,
        audio: false
      },
      peerStreamOutgoingPreferences: {
        video: false,
        audio: true
      },
      peerStreamScreenshare: null,
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
      remotePeerConnections: [],
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
      uploadFileName: '',
      messageEditing: {},
      messageReplyingTo: {},
      imgflip_template: {},
      mediaMaxWidth: 'clamp(200px, 100%, 400px)',
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
      isReplyingToMessage: false,
      isTaggingUser: false,
      isSelectingImgflipTemplate: false,
      isFillingImgflipTemplate: {
        active: false,
        mode: 'top-bottom',
        boxes: []
      },
      isStreamingVideo: false,
      isEditingProfile: false,
      isTransferring: false,
      canShowSidebar: true,
      isViewingProcess: false,
      isViewingFiles: false,
      isViewingImage: false,
      // Etc
      overlayType: 'msg',
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
      sidebar: {
        active: true
      },
      params: false,
      processGUID: '',
      viewingImageURL: '',
      knowledge: {},
      knowledgeExists: false,
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
    const bc = new BroadcastChannel('connector')
    bc.onmessage = event => {
      if (event.data.type === 'online') {
        if (this.mainMembers.length <= 0) return
        for (let i = 0; i < this.mainMembers.length; i++) {
          if (this.mainMembers[i].usr === event.data.srcUsername) {
            this.mainMembers[i].online = true
          }
        }
      } else if (event.data.type === 'fwd:subchat_join') {
        const payload = JSON.parse(event.data.msg)
        this.notifyJoinedSubchat(payload.guid, payload.user)
      } else if (event.data.type === 'fwd:subchat_leave') {
        const payload = JSON.parse(event.data.msg)
        this.notifyJoinedSubchat(payload.guid, payload.user, false, true)
      }
    }
  },
  beforeUnmount () {
    clearInterval(this.timer)
    clearInterval(this.timerIdle)
    this.disconnect()
  },
  computed: {
    canShowVideoElements () {
      if (this.params) {
        return true
      }
      if (this.isSubchat === true) {
        if (this.currentSubchat.type === 'screenshare' || this.currentSubchat.type === 'webcam') {
          return true
        }
      } else if (this.chatroom.type === 'direct') {
        if (this.isStreamingVideo) {
          return true
        }
      }
      return false
    },
    isSharingScreen () {
      return this.peerStreamScreenshare != null
    }
  },
  methods: {
    closeModal: function () {
      this.isModalVisible = false
      this.$store.commit('setE2EncryptionSeen', true)
    },
    initFunction: async function () {
      this.$store.commit('setLastClarifierGUID', this.$route.params.id)
      // this.toggleElement('init_loading', 'flex')
      window.addEventListener('resize', this.resizeCanvas, false)
      this.resizeCanvas()
      document.addEventListener('keydown', this.handleGlobalKeyEvents, false)
      // Set message section with its scroll event
      this.$refs.messages_section.onscroll = this.checkScroll
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
      // #### #### #### #### #### #### #### #### #### #### #### #### #### ####
      // Are we connecting to a subchat?
      const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop)
      })
      const subchatGUID = params.sub
      this.params = params.call
      // this.toggleElement('init_loading', 'flex')
      if (subchatGUID != null) {
        this.$store.commit('setLastClarifierSubGUID', subchatGUID)
        await this.getClarifierMetaData(this.getSession(), false, true)
        await this.gotoSubchat(subchatGUID)
      } else {
        this.$store.commit('setLastClarifierSubGUID', 'none')
        // Connect to the session
        await this.connect()
      }
      this.getKnowledge(this.getSession())
      // #### #### #### #### #### #### #### #### #### #### #### #### #### ####
      this.isModalVisible = !this.$store.getters.hasSeenE2ENotification()
    },
    getKnowledge: async function (sessionID) {
      return new Promise((resolve) => {
        this.$Worker.execute({
          action: 'api',
          method: 'get',
          url: 'm7/get?src=' + sessionID + '&from=clarifier'
        })
          .then((data) => {
            this.knowledgeExists = true
            this.knowledge = data.result
            // if (this.knowledge.categories != null) {
            //   for (let i = 0; i < this.knowledge.categories.length; i++) {
            //     this.knowledge.categories[i] = JSON.parse(this.knowledge.categories[i])
            //   }
            // }
            resolve()
          })
          .catch((err) => {
            console.debug(err.message)
            this.knowledgeExists = false
          })
      })
    },
    setUpWRTC: function () {
      if (this.wRTC.selfId && this.wRTC.selfId === this.userId) return
      // Initialize wRTC.js
      this.wRTC = WRTC
      this.wRTC.initialize(
        this.$Worker, this.$store.state.username, this.userId, true, false, true)
      // Create BroadcastChannel to listen to wRTC events!
      const eventChannel = new BroadcastChannel('wrtcevents')
      eventChannel.onmessage = event => {
        this.handleWRTCEvent(event)
      }
    },
    handleWRTCEvent: async function (event) {
      if (!event || !event.data) return
      if (event.data.event === 'incoming_track') {
        setTimeout(() => {
          let videoElem
          let audioElem
          let container
          if (this.currentSubchat.type === 'screenshare') {
            videoElem = document.getElementById('screenshare_video')
          } else if (this.currentSubchat.type === 'webcam' || this.params) {
            videoElem = document.getElementById('screenshare_video_' + event.data.remoteId)
            audioElem = document.getElementById('screenshare_audio_' + event.data.remoteId)
            container = document.getElementById('screenshare_container_' + event.data.remoteId)
            if (!videoElem || !audioElem || !container) return
            container.style.display = 'block'
          }
          const remoteStream = this.wRTC.getStream(event.data.remoteId)
          let hasVideo = false
          let hasAudio = false
          remoteStream.getTracks().forEach(track => {
            if (track.kind === 'audio') hasAudio = true
            if (track.kind === 'video') hasVideo = true
          })
          // Show remote tracks
          if (hasVideo) {
            if (!videoElem.srcObject || videoElem.srcObject !== remoteStream) {
              videoElem.srcObject = remoteStream
            }
            videoElem.setAttribute('controls', '')
            audioElem.srcObject = null
            audioElem.removeAttribute('controls')
          } else {
            videoElem.srcObject = null
            if (hasAudio) {
              if (!audioElem.srcObject || audioElem.srcObject !== remoteStream) {
                audioElem.srcObject = remoteStream
              }
              audioElem.setAttribute('controls', '')
            } else {
              audioElem.srcObject = null
            }
          }
          // ---
          if (!this.isStreamingVideo) {
            this.isStreamingVideo = true
            this.streamStartTime = Math.floor(Date.now() / 1000)
            this.startTimeCounter()
            this.enterCinemaMode()
          }
        }, 500)
      } else if (event.data.event === 'connection_change') {
        if (event.data.status === 'connected') {
          // Check if we need to replace any tracks
          if (this.currentSubchat.type === 'screenshare') {
            await this.callSetDisplayMedia()
          }
          if (this.currentSubchat.type === 'webcam' || this.params) {
            await this.callSetUserMedia()
          }
          if (this.isSharingScreen) {
            await this.callStartOrStopScreenshare(false, true)
          }
        }
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
        } else if (this.isReplyingToMessage === true) {
          this.resetReplying()
        } else {
          this.hideAllWindows()
        }
        this.focusComment()
      } else {
        if (document.activeElement.id === 'new_comment') {
          // User has pressed a key whilst being in the input field
          this.shareActivity()
        }
      }
    },
    handleFirebaseEvent: function (event) {
      if (event.data.notification.body.includes(this.$store.state.username + ' has sent a message.')) return
      if (event.data.data.subchatGUID != null && event.data.data.subchatGUID.length > 0) {
        const destId = event.data.data.subchatGUID
        const originId = event.data.data.dlDest.substring(20)
        if (!this.$route.fullPath.includes(destId)) {
          this.$store.commit('addClarifierTimestampNew', {
            id: originId,
            ts: new Date().getTime()
          })
          this.$store.commit('addClarifierTimestampNew', {
            id: destId,
            ts: new Date().getTime()
          })
          setTimeout(() => {
            const notify = document.getElementById(destId + '_notify')
            if (notify != null) {
              notify.style.opacity = '1'
              notify.style.display = 'block'
            }
          }, 1000)
          if (!this.$route.fullPath.includes(originId)) {
            setTimeout(() => {
              const notify = document.getElementById(originId + '_notify')
              if (notify != null) {
                notify.style.opacity = '1'
                notify.style.display = 'block'
              }
            }, 1000)
          }
        }
      } else {
        let destId = event.data.data.dlDest.substring(20)
        if (this.$route.fullPath.includes('sub=') || !this.$route.fullPath.includes(destId)) {
          this.$store.commit('addClarifierTimestampNew', {
            id: destId,
            ts: new Date().getTime()
          })
          if (destId === this.getSession()) destId = 'home'
          setTimeout(() => {
            const notify = document.getElementById(destId + '_notify')
            if (notify != null) {
              notify.style.opacity = '1'
              notify.style.display = 'block'
            }
          }, 0)
        }
      }
    },
    connect: async function (sessionID = this.getSession(), isSubchat = false, novisual = false) {
      return new Promise((resolve) => {
        this.resetStats()
        this.isSubchat = isSubchat
        // Connect to the chat
        this.connection = new WebSocket('wss://wikiric.xyz/clarifier/' + sessionID)
        // Websocket OPEN
        this.connection.onopen = async () => {
          this.websocketState = 'OPEN'
          let auth = await this.$Worker.execute({
            action: 'wss_auth'
          })
          this.connection.send(auth.t)
          auth = null
          // Subscribe to notifications
          this.subscribeFCM(sessionID, isSubchat)
          // Generate Key Pair
          const gTmp = this.getChatGUID()
          await this.generateRSAKeyPair(gTmp)
          setTimeout(() => {
            // Get metadata and messages
            this.getClarifierMetaData(sessionID, isSubchat, novisual)
              .then(() => this.getClarifierMessages(false, sessionID))
              .then(() => this.prepareInputField())
              .then(() => // Websocket incoming frames
                (
                  this.connection.onmessage = (event) => {
                    this.showMessage(event.data)
                  }
                ))
              .then(() => {
                this.scrollToBottom()
                this.setUpWRTC()
                this.wRTC.doPause()
              })
              .then(() => {
                if (this.currentSubchat.type === 'webcam' || this.params) {
                  this.wRTC.doUnpause()
                  this.startCall(undefined, {
                    video: undefined,
                    audio: undefined
                  })
                  this.notifyJoinedSubchat(this.currentSubchat.guid, this.$store.state.username, true)
                } else if (this.currentSubchat.type === 'screenshare') {
                  this.wRTC.doUnpause()
                }
              })
              .then(resolve)
          }, 0)
        }
        // Websocket CLOSE
        this.connection.onclose = async () => {
          // if (this.websocketState === 'SWITCHING') {}
        }
      })
    },
    subscribeFCM: function (uniChatroomGUID) {
      const content = JSON.stringify({
        fcmToken: this.$store.state.fcmToken
      })
      this.$Worker.execute({
        action: 'api',
        method: 'post',
        url: 'm5/subscribe/' + uniChatroomGUID,
        body: content
      }).catch((err) => console.debug(err.message))
    },
    showMessage: async function (msg) {
      // This function gets called upon receiving a message via the websocket connection
      const message = await this.processRawMessage(msg)
      if (message.mType == null) return
      // Check if message was sent from this device
      const indexTmp = this.messages.findIndex(
        element => element.isDraft && element.src === this.$store.state.username && element.msg === message.msg
      )
      if (indexTmp > -1) {
        message.header = this.messages[indexTmp].header
        message.separator = this.messages[indexTmp].separator
        message.iurl = this.messages[indexTmp].iurl
        message.iurla = this.messages[indexTmp].iurla
        this.messages[indexTmp] = message
        return
      }
      // Continue
      if (message.mType === 'EditNotification') {
        const response = JSON.parse(message.msg)
        if (response.uniMessageGUID == null) return
        const index = this.messages.findIndex(msg => msg.guid === response.uniMessageGUID)
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
            console.debug(e.message)
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
        const index = this.messages.findIndex(msg => msg.guid === response.uniMessageGUID)
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
          console.debug(e.message)
        }
        return
      }
      const distanceToBottom = (this.$refs.messages_section.scrollTop * -1)
      if (distanceToBottom < 100) {
        this.scrollToBottom(false)
      }
      this.removeUserFromActivity(message.src)
      this.extraSkipCount++
      const index = this.messages.indexOf(message.msg)
      if (index > -1) {
        // Message found -> declare sent
      } else {
        // Message not found -> add to messages
        this.messages.unshift(message)
      }
      if (message.mType === 'RegistrationNotification') {
        setTimeout(() => {
          this.getClarifierMetaData()
        }, 2500)
      }
      setTimeout(() => {
        mermaid.init()
      }, 0)
    },
    addMessage: async function () {
      this.$store.commit('addClarifierTimestampRead', {
        id: this.getChatGUID(),
        ts: new Date().getTime()
      })
      if (this.isEditingMessage === true) {
        let editPayloadMessage
        if (this.new_message !== '') {
          editPayloadMessage = '[c:MSG<ENCR]' +
            await this.encryptPayload(this.new_message)
        } else {
          editPayloadMessage = ''
        }
        const payload = JSON.stringify({
          uniMessageGUID: this.messageEditing.guid,
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
      // Leaderboard?
      if (this.new_message.toLowerCase().startsWith('/leaderboard')) {
        this.addMessagePar('[c:CMD]/leaderboard')
        this.new_message = ''
        this.focusComment(true)
        setTimeout(() => this.auto_grow(), 0)
        return
      }
      // Reply?
      if (this.isReplyingToMessage) {
        await this.sendReply()
        this.focusComment(true)
        setTimeout(() => this.auto_grow(), 0)
        return
      }
      // Handle normal message
      const messageContent = this.new_message.substring(0, 5000)
      const encryptedMessage = await this.encryptPayload(messageContent)
      // Pre-Display message
      this.messages.unshift(
        await this.processRawMessage(JSON.stringify({
          ts: DateTime.now().toISO(),
          src: this.$store.state.username,
          msg: '[c:MSG<ENCR]' + encryptedMessage,
          isDraft: true
        }))
      )
      // Send message to server
      if (this.connection.readyState !== 1) return
      this.connection.send('[c:MSG<ENCR]' + encryptedMessage)
      // Post-Message Actions
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
      if (!this.inputField) return
      if (instantly) {
        this.inputField.focus()
      } else {
        setTimeout(() => this.inputField.focus(), 0)
      }
    },
    addMessagePar: function (text, closeGIFSelection = false) {
      if (!this.connection) return
      if (this.connection.readyState !== 1) return
      if (text !== '') this.connection.send(text)
      if (closeGIFSelection) this.isViewingGIFSelection = false
    },
    getClarifierMetaData: async function (sessionID = this.getSession(), isSubchat = false, novisual = false) {
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
        this.$Worker.execute({
          action: 'api',
          method: 'get',
          url: 'm5/getchatroom/' + sessionID
        })
          .then((data) => {
            let tmpElem
            // Remove active flag
            if (!novisual && this.chatroom.type !== 'direct') {
              if (this.chatroom.guid != null) {
                tmpElem = document.getElementById('home_subc')
                if (tmpElem) tmpElem.classList.remove('active')
              }
              if (this.currentSubchat.guid != null) {
                tmpElem = document.getElementById(this.currentSubchat.guid + '_subc')
                if (tmpElem) tmpElem.classList.remove('active')
              }
            }
            // Set new chatroom or subchat + active flag
            if (!isSubchat) {
              this.chatroom = data.result
              if (this.chatroom.subChatrooms != null) {
                // Parse JSON serialized subchats for performance
                for (let i = 0; i < this.chatroom.subChatrooms.length; i++) {
                  this.chatroom.subChatrooms[i] = JSON.parse(this.chatroom.subChatrooms[i])
                  if (this.chatroom.subChatrooms[i].type === 'webcam') {
                    this.getActiveMembers(this.chatroom.subChatrooms[i].guid, true)
                  }
                }
              }
              if (!novisual && (this.chatroom.type === undefined || this.chatroom.type !== 'direct')) {
                tmpElem = document.getElementById('home_subc')
                if (tmpElem) {
                  tmpElem.classList.toggle('active', true)
                }
              }
            } else {
              this.currentSubchat = data.result
              if (!novisual && this.chatroom.type !== 'direct') {
                tmpElem = document.getElementById(this.currentSubchat.guid + '_subc')
                if (tmpElem) tmpElem.classList.toggle('active', true)
              }
            }
          })
          .then(() => (
            setTimeout(() => {
              this.processMetaDataResponse(isSubchat).then(() => resolve())
            }, 0)
          ))
          .catch((err) => console.debug(err.message))
      })
    },
    processMetaDataResponse: async function (isSubchat = false) {
      const chatElem = this.$refs.clarifier_chatroom
      if (this.chatroom.type === 'direct') {
        // chatElem.classList.add('clarifier_chatroom_big')
        this.chatroom.t = this.chatroom.directMessageUsername
          .replaceAll('|' + this.$store.state.username + '|', '||')
          .replaceAll('|', ' ').replaceAll('  ', ' ').trim()
      } else {
        chatElem.classList.remove('clarifier_chatroom_big')
      }
      this.canShowSidebar = this.chatroom.type !== 'direct'
      if (isSubchat === false) {
        this.currentSubchat.type = 'text'
        this.$store.commit('addClarifierSession', {
          id: this.chatroom.guid,
          title: this.chatroom.t,
          img: this.getImg(this.chatroom.imgGUID),
          type: this.chatroom.type
        })
        if (this.isSubchat === false) {
          this.$store.commit('addClarifierTimestampRead', {
            id: this.chatroom.guid,
            ts: new Date().getTime()
          })
          setTimeout(() => {
            const notify = document.getElementById('home_notify')
            if (notify != null) {
              notify.style.opacity = '0'
              notify.style.display = 'none'
            }
          }, 1000)
          setTimeout(() => {
            const notify = document.getElementById(this.chatroom.guid + '_notify')
            if (notify != null) {
              notify.style.opacity = '0'
              notify.style.display = 'none'
            }
          }, 1000)
        }
        this.members = []
        // Parse JSON serialized users for performance
        if (this.chatroom.members) {
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
        setTimeout(() => {
          const notify = document.getElementById(this.currentSubchat.guid + '_notify')
          if (notify != null) {
            notify.style.opacity = '0'
            notify.style.display = 'none'
          }
        }, 1000)
        // Parse JSON serialized users for performance and determine current user's ID
        this.members = []
        this.remotePeerConnections = []
        for (let i = 0; i < this.currentSubchat.members.length; i++) {
          this.members[i] = JSON.parse(this.currentSubchat.members[i])
          this.members[i].taggable = true
          if (this.members[i].usr === this.$store.state.username) {
            this.userId = this.members[i].id
          } else {
            this.remotePeerConnections.push({
              remoteId: this.members[i].id,
              iurl: this.members[i].iurl,
              iurla: this.members[i].iurla
            })
          }
        }
      }
      const messagesSection = this.$refs.messages_section
      if (this.currentSubchat.type === 'screenshare' || this.currentSubchat.type === 'webcam' || this.params) {
        messagesSection.style.width = '350px'
        this.mediaMaxWidth = 'clamp(200px, 100%, 255px)'
      } else {
        this.peerType = 'idle'
        this.isStreamingVideo = false
        this.streamStartTime = ''
        this.streamDuration = ''
        this.exitCinemaMode()
        messagesSection.style.width = 'initial'
        this.mediaMaxWidth = 'clamp(200px, 100%, 400px)'
      }
      document.title = this.chatroom.t
      if (this.isSubchat) {
        document.title += ' - ' + this.currentSubchat.t
      }
      let sessionID
      if (isSubchat) {
        sessionID = this.getSessionSub()
      } else {
        sessionID = this.getSession()
      }
      await this.getActiveMembers(sessionID)
    },
    getClarifierMessages: async function (lazyLoad = false, sessionID) {
      if (sessionID == null) {
        sessionID = this.getSession()
      }
      let pageIndex = this.currentPage
      if (lazyLoad === true) {
        this.lazyLoadingStatus = 'request'
        pageIndex++
      }
      const parameters =
        '?pageIndex=' + pageIndex +
        '&pageSize=' + this.pageSize +
        '&skip=' + this.extraSkipCount
      this.$Worker.execute({
        action: 'api',
        method: 'get',
        url: 'm5/getmessages/' + sessionID + parameters
      })
        .then((data) => {
          this.processMessagesResponse(data.result, lazyLoad)
        })
        .catch((err) => console.debug(err.message))
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
        messagesTemp.forEach(element => this.messages.push(element))
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
    processRawMessage: async function (msg, draft = false) {
      if (msg.substring(0, 6) === '[c:SC]') {
        const tmp = msg.substring(6)
        if (tmp.substring(0, 10) === '[activity]') {
          this.receiveActivity(tmp.substring(10))
        } else if (tmp.substring(0, 8) === '[online]') {
          this.setActiveMembers([tmp.substring(8)])
        } else if (tmp.substring(0, 9) === '[offline]') {
          // Set offline user status and remove him from all activity
          this.setActiveMembers([tmp.substring(9)], false)
          this.removeUserFromActivity(tmp.substring(9))
          this.removeUserFromIdle(tmp.substring(9))
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
      message.time = DateTime.fromISO(message.ts)
      // Process reserved keywords
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
        message.apiResponse = true
        message.mIsFile = true
        message.msg = message.msg.substring(7)
      } else if (message.msg.includes('[c:AUD]') === true) {
        message.mType = 'Audio'
        message.apiResponse = true
        message.mIsFile = true
        message.msg = message.msg.substring(7)
      } else if (message.msg.includes('[c:TASK]') === true) {
        message.mType = 'Task'
        message.apiResponse = true
        message.msg = message.msg.substring(8)
      } else if (message.msg.includes('[c:REPLY]') === true) {
        message.mType = 'Reply'
        message.msg = message.msg.substring(9)
      } else if (message.msg.includes('[c:TXT]') === true) {
        message.mType = 'TextFile'
        message.apiResponse = true
        message.mIsFile = true
        message.msg = message.msg.substring(7)
      } else if (message.msg.includes('[c:ZIP]') === true) {
        message.mType = 'ZipFile'
        message.apiResponse = true
        message.mIsFile = true
        message.msg = message.msg.substring(7)
      } else if (message.msg.includes('[c:FIL]') === true) {
        message.mType = 'File'
        message.apiResponse = true
        message.mIsFile = true
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
      if (message.src === '_server' || message.apiResponse !== true) {
        if (this.last_message.src === message.src) {
          // If the sources are identical, check if the time was similar
          let timeDiff = message.time.toMillis() - this.last_message.time.toMillis()
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
            // Animated pictures!!!
            if (this.mainMembers[ix].iurl != null) {
              message.iurla = this.mainMembers[ix].iurla
            }
          }
        }
      }
      // Do we need to add a separator since a new day began?
      message.seperator = false
      const msgDay = message.time.day
      const msgMonth = message.time.month
      const msgYear = message.time.year
      if (this.last_message) {
        if (msgYear > this.last_message.msgYear ||
          msgMonth > this.last_message.msgMonth ||
          msgDay > this.last_message.msgDay) {
          // Put the separator!
          message.separator = true
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
      if (message.mIsFile || message.mType === 'GIF') {
        try {
          const tmp = JSON.parse(message.msg)
          message.msg = tmp.msg
          message.msgURL = tmp.url
          message.fileName = tmp.fileName
        } catch (e) {
          console.debug('File Message Parsing Error')
        }
      } else if (message.mType === 'Reply') {
        try {
          const tmp = JSON.parse(message.msg)
          message.msg = tmp.reply
          message.source = tmp.src
        } catch (e) {
          console.debug('Reply Message Parsing Error')
        }
      }
      message.tagActive = message.msg.includes('@' + this.$store.state.username) === true
      if (!draft) {
        // Set this message as the last that was processed
        this.last_message = message
        this.last_message.msgDay = msgDay
        this.last_message.msgMonth = msgMonth
        this.last_message.msgYear = msgYear
      }
      return new Promise((resolve) => {
        resolve(message)
      })
    },
    getSession: function (full = false) {
      let session
      if (full === false) {
        session = this.$store.getters.getLastClarifierGUID()
        if (session == null || session.length < 30) {
          session = this.$route.params.id
          if (session == null) {
            this.$router.push('/bsod?reason=' + 'Invalid Chatroom GUID @ getSession')
          }
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
        .then(async (data) => {
          const imgURL = data.data.images.fixed_height.url
          const payload = {
            msg: '![Giphy GIF](' + imgURL + ')',
            url: imgURL
          }
          this.addMessagePar('[c:GIF][c:MSG<ENCR]' +
            await this.encryptPayload(JSON.stringify(payload))
          )
        })
        .catch((err) => console.debug(err.message))
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
        .catch((err) => console.debug(err.message))
    },
    sendSelectedGIF: async function (url) {
      const payload = {
        msg: '![Giphy GIF](' + url + ')',
        url: url
      }
      this.addMessagePar('[c:GIF][c:MSG<ENCR]' +
        await this.encryptPayload(JSON.stringify(payload)), true
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
        .catch((err) => console.debug(err.message))
    },
    getImgFlipSelection: function () {
      const headers = new Headers()
      // headers.append('pragma', 'no-cache')
      // headers.append('cache-control', 'no-cache')
      // headers.append('Access-Control-Allow-Origin', 'https://api.imgflip.com')
      fetch(
        'https://api.imgflip.com/get_memes',
        {
          method: 'get',
          cache: 'no-cache',
          headers
        }
      )
        .then((res) => res.json())
        .then((data) => (this.imgflipSelection = data.data.memes))
        .catch((err) => console.debug(err.message))
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
        .catch((err) => console.debug(err.message))
    },
    handleImgflipSubmissionResponse: async function (response) {
      if (response.success !== true) {
        return
      }
      const payload = {
        msg: '![Imgflip](' + response.data.url + ')',
        url: response.data.url
      }
      this.addMessagePar('[c:IMG][c:MSG<ENCR]' + await this.encryptPayload(JSON.stringify(payload)))
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
      this.isViewingFiles = false
      this.isViewingImage = false
      this.isTaggingUser = false
      this.isSelectingImgflipTemplate = false
      this.isFillingImgflipTemplate.active = false
      this.isTransferring = false
      this.imgflip_template = {}
      this.viewingImageURL = ''
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
      this.handleSidebarToggle(this.$refs.sidebar, true)
    },
    toggleSidebar2: function () {
      this.handleSidebarToggle(this.$refs.sidebar2)
    },
    toggleMemberSidebar: function () {
      this.handleSidebarToggle(document.getElementById('member_section'))
    },
    handleSidebarToggle: function (element, setSidebarVariable = false) {
      if (element.classList.contains('active')) {
        if (window.innerWidth >= 1025) this.showSidebar2()
        element.classList.remove('active')
        if (setSidebarVariable) this.sidebar.active = false
      } else {
        this.hideSidebar2()
        element.classList.add('active')
        if (setSidebarVariable) this.sidebar.active = true
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
      this.$refs.messages_section.style.bottom = (this.inputField.scrollHeight - 40) + 'px'
    },
    resizeCanvas: function () {
      if (window.innerWidth >= 1025) {
        this.hideSidebar()
        this.showSidebar2()
        this.showMemberSidebar()
      } else {
        this.hideSidebar()
        this.hideSidebar2()
        this.hideMemberSidebar()
      }
    },
    showSidebar: function () {
      const sidebar = this.$refs.sidebar
      if (!sidebar) return
      if (!sidebar.classList.contains('active')) {
        sidebar.classList.add('active')
        this.sidebar.active = true
      }
    },
    hideSidebar: function () {
      const sidebar = this.$refs.sidebar
      if (!sidebar) return
      sidebar.classList.remove('active')
      this.sidebar.active = false
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
      if (window.innerWidth < 1025 || force === true) {
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
            const tmpElem = document.getElementById('usertagger_' + this.tagIndex)
            if (tmpElem) {
              tmpElem.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
              })
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
            const tmpElem = document.getElementById('templateselector_' + this.tagIndex)
            if (tmpElem) {
              tmpElem.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
              })
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
          const tmpElem = document.getElementById('usertagger_' + this.tagIndex)
          if (tmpElem) {
            tmpElem.scrollIntoView({
              behavior: 'smooth',
              block: 'center'
            })
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
          const tmpElem = document.getElementById('templateselector_' + this.tagIndex)
          if (tmpElem) {
            tmpElem.scrollIntoView({
              behavior: 'smooth',
              block: 'center'
            })
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
      const msg = document.getElementById(this.messageEditing.guid)
      if (msg != null) msg.style.backgroundColor = ''
      const editElem = document.getElementById('edit_' + this.messageEditing.guid)
      if (editElem != null) editElem.style.display = 'none'
      this.isEditingMessage = false
      this.messageEditing = {}
      this.new_message = ''
      setTimeout(() => {
        this.auto_grow()
        this.focusComment(true)
      }, 0)
    },
    resetReplying: function () {
      if (this.isReplyingToMessage !== true) {
        return
      }
      const msg = document.getElementById(this.messageReplyingTo.guid)
      if (msg != null) msg.style.backgroundColor = ''
      const editElem = document.getElementById('edit_' + this.messageReplyingTo.guid)
      if (editElem != null) editElem.style.display = 'none'
      this.isReplyingToMessage = false
      this.messageReplyingTo = {}
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
      const url = 'm5/setmemberimage/' + this.getSession()
      const updateFun = this.getClarifierMetaData
      const getMessagesFun = this.getClarifierMessages
      const content = JSON.stringify({
        imageBase64: base64,
        username: this.$store.state.username
      })
      this.$Worker.execute({
        action: 'api',
        method: 'post',
        url: url,
        body: content
      })
        .then(() => (updateFun()))
        .then(() => (getMessagesFun()))
        .then(() => (this.hideAllWindows()))
        .then(() => (
          this.$notify(
            {
              title: 'Done!',
              text: 'User profile picture updated.',
              type: 'info'
            })
        ))
    },
    handleUploadImageSelectDrop: function (evt) {
      this.handleUploadFileSelect(evt, true)
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
    handleDragOver: function (evt) {
      if (!evt) return
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
    setSessionImage: async function (image) {
      const url = 'm5/setimage/' + this.getSession()
      const base64String = await this.getBase64(image)
      const updateFun = this.getClarifierMetaData
      const disableLoadingFun = this.toggleSettingsLoading
      const content = JSON.stringify({
        imageBase64: base64String
      })
      this.$Worker.execute({
        action: 'api',
        method: 'post',
        url: url,
        body: content
      })
        .then(() => (updateFun()))
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
    checkScroll: function () {
      if (this.websocketState !== 'OPEN') return
      const distanceToBottom = (this.$refs.messages_section.scrollTop * -1)
      const distanceToTop = this.$refs.messages_section.scrollHeight -
        this.$refs.messages_section.clientHeight - distanceToBottom
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
      if (this.websocketState !== 'OPEN') return
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
      const mainSessionGUID = this.getSession()
      let response
      this.$Worker.execute({
        action: 'api',
        method: 'post',
        url: 'm5/createchatroom?parent=' + mainSessionGUID,
        body: content
      })
        .then((data) => (response = data.result))
        .then(() => this.getClarifierMetaData(mainSessionGUID, false, true))
        .then(() => this.gotoSubchat(response.guid))
        .catch((err) => console.debug(err.message))
    },
    gotoSubchat: async function (subchatGUID, subchatMode = true) {
      if (subchatGUID == null) {
        subchatGUID = this.getSession()
      }
      this.disconnect()
      this.websocketState = 'SWITCHING'
      this.lazyLoadingStatus = 'switching'
      if (subchatMode === true) {
        this.$store.commit('setLastClarifierSubGUID', subchatGUID)
        await this.$router.replace({
          path: '/apps/clarifier/wss/' + this.getSession(),
          query: { sub: subchatGUID }
        })
      } else {
        this.$store.commit('setLastClarifierSubGUID', 'none')
        await this.$router.replace({
          path: '/apps/clarifier/wss/' + subchatGUID // Previously getSession()
        })
      }
      this.hideAllSidebars()
      await this.connect(subchatGUID, subchatMode)
      this.lazyLoadingStatus = 'idle'
      return new Promise((resolve) => {
        resolve()
      })
    },
    disconnect: function () {
      this.setTimestampRead()
      this.messages = []
      this.resetStats()
      this.websocketState = 'CLOSED'
      if (this.currentSubchat && this.currentSubchat.type === 'webcam') {
        this.notifyJoinedSubchat(this.currentSubchat.guid, this.$store.state.username, true, true)
      }
      if (this.connection == null) return
      this.addMessagePar('[c:SC]' + '[offline]' + this.$store.state.username)
      this.connection.close()
    },
    setTimestampRead: function () {
      let notify
      if (!this.isSubchat) {
        this.$store.commit('addClarifierTimestampRead', {
          id: this.getSession(),
          ts: new Date().getTime()
        })
        notify = document.getElementById('home_notify')
      } else {
        this.$store.commit('addClarifierTimestampRead', {
          id: this.currentSubchat.guid,
          ts: new Date().getTime()
        })
        notify = document.getElementById(this.currentSubchat.guid + '_notify')
      }
      if (notify != null) {
        notify.style.opacity = '0'
        notify.style.display = 'hidden'
      }
    },
    resetStats: function () {
      // Reset session specific stats
      this.isSubchat = false
      this.currentPage = 0
      this.extraSkipCount = 0
      this.lazyLoadingStatus = 'idle'
      this.last_message = {}
      this.userActivity = []
      this.userActivityIdle = []
      this.overlayType = 'msg'
    },
    uploadSnippet: function () {
      this.toggleElement('confirm_snippet_loading', 'flex')
      const content = JSON.stringify({
        type: this.uploadFileType,
        payload: this.uploadFileBase64,
        name: this.uploadFileName,
        chatroomGUID: this.chatroom.guid
      })
      this.$Worker.execute({
        action: 'api',
        method: 'post',
        url: 'm6/create',
        body: content
      })
        .then((data) => (this.processUploadSnippetResponse(data.result)))
        .catch((err) => (this.handleUploadSnippetError(err.message)))
        .finally(() => (this.toggleElement('confirm_snippet_loading', 'flex')))
    },
    handleUploadSnippetError: function (errorMessage = '') {
      this.toggleElement('confirm_snippet_loading', 'flex')
      console.debug(errorMessage)
      this.$notify(
        {
          title: 'File Not Uploaded',
          text: 'An Error occurred while uploading the file.',
          type: 'error'
        })
    },
    getChatGUID: function () {
      let chatGUID = this.getSessionSub()
      if (this.chatroom.type === 'direct' || chatGUID === 'none') {
        chatGUID = this.getSession()
      }
      return chatGUID
    },
    processUploadSnippetResponse: async function (response) {
      if (response.httpCode !== 201) {
        this.handleUploadSnippetError()
        return
      }
      const contentURL = this.$store.state.serverIP + '/m6/get/' + response.guid
      let prefix
      if (this.uploadFileType.includes('audio')) {
        prefix = '[c:AUD]'
      } else if (this.uploadFileType.includes('image')) {
        prefix = '[c:IMG]'
      } else if (this.uploadFileType.includes('text')) {
        prefix = '[c:TXT]'
      } else if (this.uploadFileType.includes('compressed')) {
        prefix = '[c:ZIP]'
      } else {
        prefix = '[c:FIL]'
      }
      // Add the link as a message, so it shows up in the chat
      const payload = JSON.stringify({
        msg: '![Snippet](' + contentURL + ')',
        url: contentURL,
        fileName: this.uploadFileName
      })
      this.addMessagePar(prefix + '[c:MSG<ENCR]' +
        await this.encryptPayload(payload)
      )
      this.uploadFileBase64 = ''
      this.uploadFileType = ''
      this.uploadFileName = ''
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
        uniMessageGUID: msg.guid,
        type: t
      })
      this.addMessagePar('[c:REACT<JSON]' + payload)
    },
    createWisdomForMessage: function (msg) {
      if (!this.knowledgeExists) {
        this.$notify(
          {
            title: 'No Knowledge created!',
            text: 'Please click on Knowledge to create one.',
            type: 'error'
          })
        return
      }
      const payload = {
        title: '',
        description: msg.msg.trim(),
        knowledgeGUID: this.knowledge.guid,
        keywords: 'msg message',
        copyContent: '',
        categories: []
      }
      // Lesson (teach) or Question (ask)?
      const endpoint = 'teach'
      // Create entry on the backend
      const bodyPayload = JSON.stringify(payload)
      return new Promise((resolve) => {
        this.$Worker.execute({
          action: 'api',
          method: 'post',
          url: 'm7/' + endpoint,
          body: bodyPayload
        })
          .then((data) => {
            const guid = data.result
            this.$router.push('/apps/knowledge/' + guid + '?src=' + this.getSession())
          })
          .then(() => resolve())
          .catch((err) => {
            console.debug(err.message)
          })
      })
    },
    editMessage: function (msg, remove = false) {
      if (remove === true) {
        const payload = JSON.stringify({
          uniMessageGUID: msg.guid,
          newContent: ''
        })
        this.addMessagePar('[c:EDIT<JSON]' + payload)
      } else {
        this.resetEditing()
        this.resetReplying()
        this.isEditingMessage = true
        this.messageEditing = msg
        this.new_message = msg.msg
        this.focusComment(true)
        setTimeout(() => {
          this.auto_grow()
          document.getElementById(msg.guid).style.backgroundColor = '#71717A'
          const editElem = document.getElementById('edit_' + this.messageEditing.guid)
          if (editElem != null) editElem.style.display = 'flex'
        }, 0)
      }
    },
    replyToMessage: function (msg) {
      this.resetReplying()
      this.resetEditing()
      this.isReplyingToMessage = true
      this.messageReplyingTo = msg
      this.focusComment(true)
      setTimeout(() => {
        this.auto_grow()
        document.getElementById(msg.guid).style.backgroundColor = '#71717A'
        const editElem = document.getElementById('edit_' + this.messageReplyingTo.guid)
        if (editElem != null) editElem.style.display = 'flex'
      }, 0)
    },
    sendReply: async function () {
      if (!this.isReplyingToMessage || this.messageReplyingTo === {}) return
      const payload = await this.encryptPayload(
        JSON.stringify({
          src: this.messageReplyingTo,
          reply: this.new_message
        }))
      this.resetReplying()
      this.addMessagePar('[c:REPLY][c:MSG<ENCR]' + payload)
      this.new_message = ''
    },
    getMemberCount: function () {
      if (this.mainMembers != null) {
        return this.mainMembers.length
      } else {
        return 0
      }
    },
    scrollToBottom: function (focusInput = true) {
      this.$refs.messages_section.scrollTop = 0
      if (focusInput) this.focusComment(true)
    },
    hasUnread: function (guid, isHome = false) {
      let hasUnread = false
      if (guid === null) {
        guid = this.getSession()
      }
      this.$store.getters.getTimestamp(guid)
        .then((timestamp) => {
          if (timestamp == null) return false
          const lastMessageTS = timestamp.tsNew
          if (lastMessageTS == null || lastMessageTS <= 0) {
            return false
          }
          let lastReadTS = timestamp.tsRead
          if (lastReadTS == null) lastReadTS = 0
          hasUnread = lastReadTS < lastMessageTS
        })
        .finally(() => {
          if (hasUnread) {
            let elemId = guid + '_notify'
            if (isHome) elemId = 'home_notify'
            setTimeout(() => {
              const notify = document.getElementById(elemId)
              if (notify != null) {
                notify.style.opacity = '1'
                notify.style.display = 'block'
              }
            }, 0)
          }
        })
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
      const updateFun = this.getClarifierMetaData
      const getMessagesFun = this.getClarifierMessages
      return new Promise((resolve) => {
        this.$Worker.execute({
          action: 'api',
          method: 'post',
          url: 'm5/pubkey/' + uniChatroomGUID,
          body: content
        })
          .then(() => (updateFun()))
          .then(() => (getMessagesFun()))
          .then(() => {
            if (force === true) {
              this.$notify(
                {
                  title: 'Encryption Key Replaced',
                  text: '',
                  type: 'info'
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
      const keyPair = await this.$store.getters.getClarifierKeyPair(this.getChatGUID())
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
    getEmptyStream: function (width = 640, height = 480, dummyText = null) {
      const silence = () => {
        const ctx = new AudioContext()
        const oscillator = ctx.createOscillator()
        const dst = oscillator.connect(ctx.createMediaStreamDestination())
        oscillator.start()
        return Object.assign(dst.stream.getAudioTracks()[0], { enabled: false })
      }
      const black = () => {
        const canvas = Object.assign(document.createElement('canvas'), {
          width,
          height
        })
        const ctx = canvas.getContext('2d')
        // Set black background
        ctx.fillStyle = 'rgb(24, 24, 27)'
        ctx.fillRect(0, 0, width, height)
        // Write text if specified
        if (dummyText) {
          ctx.fillStyle = 'white'
          ctx.textAlign = 'center'
          ctx.font = 'bold 24px \'Open Sans\''
          ctx.fillText(dummyText, width / 2, height / 2)
        }
        const stream = canvas.captureStream()
        return Object.assign(stream.getVideoTracks()[0], { enabled: true })
      }
      return new MediaStream([black(width, height), silence()])
    },
    startCall: async function (userId, constraints = null) {
      // Retrieve media stream
      await this.callSetUserMedia(constraints)
      this.peerStreamOutgoingPreferences = constraints
      this.isStreamingVideo = true
      // Go into distraction free cinema mode
      this.enterCinemaMode()
      // Start the count-up timer
      this.streamStartTime = Math.floor(Date.now() / 1000)
      this.startTimeCounter()
      // Create peer to peer connections
      await this.createOutgoingPeerConnections(userId)
    },
    stopScreenshare: function () {
      this.wRTC.hangup()
      this.stopOutgoingStreamTracks()
      // Remove content from all video elements
      const videoElems = document.getElementsByClassName('conference_media_element')
      if (videoElems) {
        [...videoElems].forEach((element) => {
          element.srcObject = null
          element.removeAttribute('controls')
        })
      }
      this.peerType = 'idle'
      this.isStreamingVideo = false
      this.streamStartTime = ''
      this.streamDuration = ''
      // Revert styling changes
      this.exitCinemaMode()
      const queryObj = {}
      const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop)
      })
      if (params.sub) queryObj.sub = params.sub
      if (params.query) queryObj.query = params.query
      this.$router.replace({
        query: queryObj
      })
      this.params = false
      if (this.chatroom.type === 'direct') {
        const messagesSection = this.$refs.messages_section
        messagesSection.style.width = '100%'
      }
    },
    stopOutgoingStreamTracks: function () {
      if (this.peerStreamOutgoingConstraints.audio) this.wRTC.setAudio(false)
      if (this.peerStreamOutgoingConstraints.video) this.wRTC.setVideo(false)
      if (this.isSharingScreen) this.callStartOrStopScreenshare(true)
      if (this.peerStreamOutgoing) {
        this.peerStreamOutgoing.getTracks().forEach(function (track) {
          track.enabled = false
          track.stop()
        })
        this.peerStreamOutgoing = null
      } else {
        // No tracks found?
      }
    },
    callSetDisplayMedia: async function () {
      const constraintsT = {
        video: {
          cursor: 'always'
        },
        audio: false // See further down
      }
      let stream
      if (!this.peerStreamOutgoing || this.peerStreamOutgoingConstraints !== constraintsT) {
        stream = await navigator.mediaDevices.getDisplayMedia(constraintsT)
        this.peerStreamOutgoing = stream
      } else {
        stream = this.peerStreamOutgoing
      }
      // this.wRTC.replaceTrack(stream, 'audio') // TODO: Figure out how to send two audio tracks
      this.wRTC.replaceTrack(stream, 'video')
      return new Promise((resolve) => {
        resolve()
      })
    },
    callSetUserMedia: async function (constraints = null) {
      let constraintsT
      if (constraints) {
        constraintsT = constraints
        // If video or audio is undefined, replace with preferences
        if (constraintsT.video === undefined) {
          constraintsT.video = this.peerStreamOutgoingPreferences.video
        }
        if (constraintsT.audio === undefined) {
          constraintsT.audio = this.peerStreamOutgoingPreferences.audio
        }
        this.peerStreamOutgoingPreferences = constraintsT
      } else {
        // Defaults to preferences if no constraints were provided
        constraintsT = this.peerStreamOutgoingPreferences
      }
      let stream
      // Get user media if there is no stream or constraints have changed
      if (!this.peerStreamOutgoing || this.peerStreamOutgoingConstraints !== constraintsT) {
        if (constraintsT.video || constraintsT.audio) {
          stream = await navigator.mediaDevices.getUserMedia(constraintsT)
        } else {
          stream = null
        }
        this.stopOutgoingStreamTracks()
        this.peerStreamOutgoing = stream
        this.wRTC.addStreamTracks(stream)
      } else {
        stream = this.peerStreamOutgoing
        this.wRTC.addStreamTracks(stream)
      }
      if (constraintsT.audio) {
        this.wRTC.replaceTrack(stream, 'audio')
      }
      if (constraintsT.video) {
        this.wRTC.replaceTrack(stream, 'video')
        // Set local stream
        const videoElem = document.getElementById('screenshare_video')
        videoElem.srcObject = stream
      }
      // Write back the constraints
      this.peerStreamOutgoingConstraints = constraintsT
      return new Promise((resolve) => {
        resolve()
      })
    },
    callStartOrMuteVideo: function (override = null) {
      this.peerStreamOutgoingPreferences.video = override ?? !this.peerStreamOutgoingPreferences.video
      if (this.peerStreamOutgoingPreferences.video) {
        if (!this.peerStreamOutgoing || !this.peerStreamOutgoingConstraints.video) {
          this.callSetUserMedia({
            video: true,
            audio: undefined
          })
        } else {
          this.wRTC.replaceTrack(this.peerStreamOutgoing, 'video')
          const videoElem = document.getElementById('screenshare_video')
          videoElem.srcObject = this.peerStreamOutgoing
        }
      } else {
        this.wRTC.setVideo(this.peerStreamOutgoingPreferences.video)
        const videoElem = document.getElementById('screenshare_video')
        videoElem.srcObject = null
      }
    },
    callStartOrMuteAudio: function (override = null) {
      this.peerStreamOutgoingPreferences.audio = override ?? !this.peerStreamOutgoingPreferences.audio
      this.wRTC.setAudio(this.peerStreamOutgoingPreferences.audio)
    },
    callStartOrStopScreenshare: async function (forceStop = false, forceStart = false) {
      if (!forceStop && (forceStart || !this.isSharingScreen)) {
        // Turn on screen sharing
        if (!this.isSharingScreen) {
          const constraintsT = {
            video: {
              cursor: 'always'
            },
            audio: true
          }
          this.peerStreamScreenshare = await navigator.mediaDevices.getDisplayMedia(constraintsT)
        }
        if (this.peerStreamOutgoingConstraints.video) {
          // Disable video to save bandwidth while transmitting screen
          this.callStartOrMuteVideo(false)
        } else {
          this.wRTC.addStreamTracks(this.peerStreamScreenshare, 'video')
        }
        this.wRTC.replaceTrack(this.peerStreamScreenshare, 'video')
        let videoElem = document.getElementById('screenshare_video_alternate')
        videoElem.srcObject = this.peerStreamScreenshare
        videoElem.style.display = 'block'
        videoElem = document.getElementById('screenshare_video')
        videoElem.style.display = 'none'
      } else {
        if (!this.peerStreamScreenshare) return
        // Turn off screen sharing
        this.peerStreamScreenshare.getTracks().forEach((track) => {
          track.stop()
        })
        this.peerStreamScreenshare = null
        let videoElem = document.getElementById('screenshare_video_alternate')
        videoElem.srcObject = this.peerStreamScreenshare
        videoElem.style.display = 'none'
        if (this.peerStreamOutgoingConstraints.video && this.peerStreamOutgoingPreferences.video) {
          // Enable webcam again if it was active before
          this.wRTC.replaceTrack(this.peerStreamOutgoing, 'video')
          this.peerStreamOutgoingPreferences.video = true
          videoElem = document.getElementById('screenshare_video')
          videoElem.style.display = 'block'
          videoElem.srcObject = this.peerStreamOutgoing
        } else {
          const videoElem = document.getElementById('screenshare_video')
          videoElem.style.display = 'block'
          videoElem.srcObject = null
        }
      }
      return new Promise((resolve) => {
        resolve()
      })
    },
    enterCinemaMode: function () {
      const chat = document.getElementById('chat_section')
      if (chat) {
        chat.style.position = 'fixed'
        chat.style.top = '0px'
        chat.style.left = '0'
        chat.style.height = '100%'
        chat.style.zIndex = '9999'
      }
      const sidebar = document.getElementById('sidebar')
      if (sidebar) sidebar.style.display = 'none'
      const sidebar2 = document.getElementById('sidebar2')
      if (sidebar2) sidebar2.style.display = 'none'
      const members = document.getElementById('member_section')
      if (members) members.style.display = 'none'
      const nav = document.getElementById('global_nav')
      if (nav) nav.style.display = 'none'
    },
    exitCinemaMode: function () {
      const chat = document.getElementById('chat_section')
      if (chat) {
        chat.style.position = 'initial'
        chat.style.top = 'initial'
        chat.style.left = 'initial'
        chat.style.height = 'initial'
        chat.style.zIndex = 'initial'
      }
      const sidebar = document.getElementById('sidebar')
      if (sidebar) sidebar.style.display = 'initial'
      const sidebar2 = document.getElementById('sidebar2')
      if (sidebar2) sidebar2.style.display = 'initial'
      const members = document.getElementById('member_section')
      if (members) members.style.display = 'initial'
      const nav = document.getElementById('global_nav')
      if (nav) nav.style.display = 'initial'
    },
    startTimeCounter: function () {
      if (!this.isStreamingVideo) return
      const now = Math.floor(Date.now() / 1000)
      const diff = now - this.streamStartTime
      let m = Math.floor(diff / 60)
      let s = Math.floor(diff % 60)
      m = this.padTime(m)
      s = this.padTime(s)
      this.streamDuration = m + ':' + s
      setTimeout(this.startTimeCounter, 1000)
    },
    padTime: function (i) {
      if (i < 10) {
        i = '0' + i
      }
      return i
    },
    getUserFromId: function (userId) {
      if (this.members.length < 1) return null
      for (let i = 0; i < this.members.length; i++) {
        if (this.members[i].id === userId) {
          return this.members[i].usr
        }
      }
    },
    createOutgoingPeerConnections: async function (userId) {
      const calleeList = []
      const activeMap = new Map()
      if (userId) {
        calleeList.push(userId)
      } else {
        // If no userId is provided, add everybody active except the current user as a callee
        const guid = this.currentSubchat.guid
        const actives = await this.$Worker.execute({
          action: 'api',
          method: 'get',
          url: 'm5/activemembers/' + guid
        })
        for (let i = 0; i < actives.result.members.length; i++) {
          activeMap.set(actives.result.members[i], true)
        }
        let isActive = false
        for (let i = 0; i < this.members.length; i++) {
          isActive = activeMap.has(this.members[i].usr)
          if (this.members[i].id !== this.userId && isActive) {
            calleeList.push(this.members[i].id)
          }
        }
      }
      // Create a WebRTC Peer to Peer Connection for each callee
      let remoteName
      for (let i = 0; i < calleeList.length; i++) {
        remoteName = this.getUserFromId(calleeList[i])
        this.wRTC.initiatePeerConnection(this.peerStreamOutgoing, this.userId, calleeList[i], remoteName)
      }
    },
    makeElementDraggable: function (element) {
      let pos1 = 0
      let pos2 = 0
      let pos3 = 0
      let pos4 = 0
      const elem = document.getElementById(element.id + '_anchor')
      if (elem) {
        elem.onmousedown = dragMouseDown
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
      const content = JSON.stringify({
        toRank: this.chatroom.rank + 1
      })
      this.$Worker.execute({
        action: 'api',
        method: 'post',
        url: 'm5/upgrade/' + this.getSession(),
        body: content
      })
        .then(() => this.getClarifierMetaData(this.getSession(), false, true))
        .then(() => this.markActiveSubchat())
        .catch((err) => console.debug(err.message))
    },
    getBadges: function (username) {
      this.$Worker.execute({
        action: 'api',
        method: 'get',
        url: 'm2/badges/get/' + username
      })
        .then((data) => (this.setUserBadges(data.result)))
        .catch((err) => console.debug(err.message))
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
    shareActivity: function () {
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
    receiveActivity: function (username) {
      // Check and set online status
      this.setActiveMembers([username])
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
    receiveIdle: function (username) {
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
    clearActivity: function () {
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
    clearActivityIdle: function () {
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
    },
    getActiveMembers: async function (uniChatroomGUID, subchatMemberMode = false) {
      if (!uniChatroomGUID) return
      this.$Worker.execute({
        action: 'api',
        method: 'get',
        url: 'm5/activemembers/' + uniChatroomGUID
      })
        .then((data) => {
          for (let i = 0; i < this.mainMembers.length; i++) {
            this.mainMembers[i].active = (this.mainMembers[i].usr === this.$store.state.username)
          }
          this.setActiveMembers(data.result.members, true, subchatMemberMode, uniChatroomGUID)
          if (!subchatMemberMode) {
            this.getOnlineUsers()
          }
        })
        .finally(() => {
          if (!subchatMemberMode) {
            setTimeout(() => {
              this.addMessagePar('[c:SC]' + '[online]' + this.$store.state.username)
            }, 0)
          }
        })
    },
    setActiveMembers: function (members, override = true, subchatMemberMode = false, subchatGUID = null) {
      if (!members) return
      if (subchatMemberMode) {
        if (subchatGUID == null) return
        for (let i = 0; i < members.length; i++) {
          this.notifyJoinedSubchat(subchatGUID, members[i])
        }
        return
      }
      const dict = new Map()
      for (let i = 0; i < members.length; i++) {
        dict[members[i]] = true
      }
      for (let i = 0; i < this.mainMembers.length; i++) {
        if (this.mainMembers[i].usr === this.$store.state.username) {
          this.mainMembers[i].active = true
        } else {
          if (dict[this.mainMembers[i].usr]) {
            this.mainMembers[i].active = override
          }
        }
      }
    },
    getOnlineUsers: function () {
      const payload = {
        usernames: []
      }
      for (let i = 0; i < this.mainMembers.length; i++) {
        this.mainMembers[i].online = (this.mainMembers[i].usr === this.$store.state.username)
        payload.usernames.push(this.mainMembers[i].usr)
      }
      this.$Worker.execute({
        action: 'api',
        method: 'post',
        url: 'm2/online',
        body: JSON.stringify(payload)
      })
        .then((data) => {
          const dict = new Map()
          if (!data.result.users) return
          for (let i = 0; i < data.result.users.length; i++) {
            dict[data.result.users[i].username] = {
              online: data.result.users[i].online,
              recent: data.result.users[i].recent,
              lastActivity: data.result.users[i].lastActivity
            }
          }
          for (let i = 0; i < this.mainMembers.length; i++) {
            if (dict[this.mainMembers[i].usr]) {
              this.mainMembers[i].online = dict[this.mainMembers[i].usr].online
              this.mainMembers[i].recent = dict[this.mainMembers[i].usr].recent
            }
          }
        })
    },
    setOverlay: function (type) {
      this.hideAllWindows()
      this.hideAllSidebars()
      if (this.overlayType === type) {
        this.overlayType = 'msg'
      } else {
        this.overlayType = type
      }
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
            newId = data.result.chatrooms[0].guid
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
    connectToGroup: function (chatroomId, novisual = false) {
      this.$store.commit('setLastClarifierGUID', chatroomId)
      this.$store.commit('setLastClarifierSubGUID', 'none')
      this.$router.push({
        path: '/apps/clarifier/wss/' + chatroomId
      })
      this.mainMembers = []
      this.members = []
      this.disconnect()
      this.connect(chatroomId, false, novisual)
    },
    prepareInputField: function (tries = 0) {
      if (tries > 10) return
      setTimeout(() => {
        this.inputField = this.$refs.new_comment
        if (!this.inputField) {
          this.prepareInputField(++tries)
        }
        // Set message section with its scroll event
        this.$refs.messages_section.onscroll = this.checkScroll
        // Remove event listeners first to avoid having multiple
        this.inputField.removeEventListener('keydown', this.handleEnter, false)
        this.inputField.removeEventListener('input', this.handleCommentInput, false)
        this.inputField.removeEventListener('click', this.hideAllSidebars, false)
        this.inputField.removeEventListener('keyup', this.auto_grow, false)
        // Add event listeners
        this.inputField.addEventListener('keydown', this.handleEnter, false)
        this.inputField.addEventListener('input', this.handleCommentInput, false)
        this.inputField.addEventListener('click', this.hideAllSidebars, false)
        this.inputField.addEventListener('keyup', this.auto_grow, false)
        // Focus
        this.focusComment()
      }, 0)
    },
    getHumanReadableDateText: function (date, withTime = false, fullDate = false) {
      const time = DateTime.fromISO(date).toLocaleString(DateTime.TIME_24_SIMPLE)
      const start = DateTime.fromISO(DateTime.fromISO(date).toISODate())
      const end = DateTime.fromISO(DateTime.now().toISODate())
      const diffDays = Math.ceil(end.diff(start) / (1000 * 60 * 60 * 24))
      let suffix = ''
      if (withTime) {
        suffix = ', ' + time
      }
      let returnString
      switch (diffDays) {
        case -5:
          returnString = 'In 5 days' + suffix
          break
        case -4:
          returnString = 'In 4 days' + suffix
          break
        case -3:
          returnString = 'In 3 days' + suffix
          break
        case -2:
          returnString = 'In 2 days' + suffix
          break
        case -1:
          returnString = 'Tomorrow' + suffix
          break
        case 0:
          returnString = 'Today' + suffix
          break
        case 1:
          returnString = 'Yesterday' + suffix
          break
        case 2:
          returnString = '2 days ago' + suffix
          break
        default:
          if (!fullDate) {
            returnString = start.toLocaleString(DateTime.DATE_MED) + suffix
          } else {
            returnString = start.toLocaleString(DateTime.DATE_HUGE) + suffix
          }
      }
      return returnString
    },
    gotoPlanner: function () {
      this.$router.push('/apps/plannernew?src=' + this.getSession())
    },
    gotoStudio: function () {
      this.$router.push('/apps/studio?src=' + this.getSession())
    },
    getSimpleTime: function (ts) {
      return DateTime.fromISO(ts).toLocaleString(DateTime.TIME_SIMPLE)
    },
    sendFriendRequest: function (name) {
      const username = name.trim()
      if (username === '') return
      this.$Worker.execute({
        action: 'api',
        method: 'get',
        url: 'm2/befriend/' + username
      })
        .then(() => {
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
    directCall: function () {
      this.$Worker.execute({
        action: 'call',
        usernameToCall: this.chatroom.t,
        chatroomGUID: this.chatroom.guid
      })
      this.params = true
      this.startCall()
      const messagesSection = this.$refs.messages_section
      messagesSection.style.width = '350px'
      this.mediaMaxWidth = 'clamp(200px, 100%, 255px)'
    },
    createProcess: async function () {
      return new Promise((resolve) => {
        // Retrieve knowledge
        let knowledge
        this.$Worker.execute({
          action: 'api',
          method: 'get',
          url: 'm7/get?src=' + this.chatroom.guid + '&from=clarifier'
        }).then((data) => {
          knowledge = data.result
          // Create process
          const payload = {
            title: 'Quick Notes',
            description: '',
            keywords: 'quick,notes,chat',
            knowledgeGUID: knowledge.guid
          }
          this.$Worker.execute({
            action: 'api',
            method: 'post',
            url: 'm9/create',
            body: JSON.stringify(payload)
          }).then((data) => {
            this.processGUID = data.result
            this.isViewingProcess = true
          })
            .then(() => resolve())
            .catch((err) => {
              console.debug(err.message)
            })
        })
      })
    },
    showFiles: function () {
      this.isViewingFiles = true
    },
    showImage: function (url) {
      if (!url) return
      this.isViewingImage = true
      this.viewingImageURL = url
    },
    notifyJoinedSubchat (guid, user, forward = false, leave = false) {
      this.chatroom.subChatrooms.forEach((value) => {
        if (value.guid === guid) {
          if (!value._subMembers || !Array.isArray(value._subMembers)) {
            value._subMembers = []
          } else {
            const index = value._subMembers.findIndex(value => value.usr === user)
            if (index !== -1) {
              if (!leave) {
                return
              } else {
                value._subMembers.splice(index, 1)
              }
            }
          }
          if (!leave) {
            value._subMembers.push({
              usr: user
            })
          }
          if (forward) {
            if (this.mainMembers.length <= 0) return
            for (let i = 0; i < this.mainMembers.length; i++) {
              if (this.mainMembers[i].online && this.mainMembers[i].usr !== this.$store.state.username) {
                let type
                if (!leave) {
                  type = 'subchat_join'
                } else {
                  type = 'subchat_leave'
                }
                this.$Worker.execute({
                  action: 'fwd',
                  username: this.mainMembers[i].usr,
                  type: type,
                  value: JSON.stringify({
                    user: user,
                    guid: guid
                  })
                })
              }
            }
          }
        }
      })
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
  @apply darkest_bg;
}

.c_darkergray {
  @apply text-neutral-900;
}

.b_darkgray {
  @apply bg-slate-700;
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
  @apply text-neutral-300;
}

.b_orange {
  background-color: #ff5d37;
}

.c_orange {
  color: #ff5d37;
}

.user_badge:hover {
  transition: 0.1s ease-in-out;
  @apply text-white cursor-pointer rounded-xl bg-zinc-500 bg-opacity-50;
}

.user_badge:hover .sender_avatar_animated {
  @apply block;
}

.tooltip-mock-destination.show {
  opacity: 1;
  transition: 0.5s;
  transform: translateY(0);
}

.tooltip-mock-destination {
  margin-left: 1ch;
  display: inline-block;
  font-size: 16px;
  font-weight: bold;
  width: auto;
  opacity: 0;
  transform: translateY(10px);
  @apply text-neutral-200;
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
  @apply bright_bg rounded-md;
  cursor: pointer;
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
  z-index: 800;
  bottom: 80px;
  right: 12px;
  color: white;
  @apply rounded-lg darkest_bg p-4 w-[400px] max-w-[calc(100dvw-24px)] max-h-[calc(100%-200px)];
}

.user_role {
  color: white;
  width: 250px;
  padding: 5px 20px;
  overflow: hidden;
  @apply rounded-lg;
}

.serverMessage {
  text-wrap: normal;
  word-wrap: break-word;
  @apply dark_bg rounded-r-lg rounded-bl-lg p-3 my-2 text-lg font-bold italic text-neutral-300;
  text-align: center;
}

.header-margin {
  min-height: 55px;
  box-shadow: 0 0 5px 5px black;
  z-index: 3;
  position: relative;
}

.input_section {
  display: inline-flex;
  width: 100%;
  min-height: 80px;
  position: absolute;
  bottom: 0;
  padding-bottom: 20px;
  flex-direction: column-reverse;
}

.new_comment {
  position: relative;
  left: 10px;
  color: white;
  border-color: transparent;
  border-radius: 6px 0 0 6px;
  resize: none;
  overflow-x: hidden;
  overflow-y: auto;
  @apply h-[40px] min-h-[40px] max-h-[calc(100%-150px)] w-[calc(100%-100px)];
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
  @apply h-[calc(100%-55px)];
}

.channel_section::-webkit-scrollbar {
  display: none;
}

.channel_section {
  -ms-overflow-style: none;
  scrollbar-width: none;
  @apply text-neutral-200;
}

.sidebar {
  position: fixed;
  width: 55px;
  transition: ease-in-out all 0.2s;
}

.sidebar2 {
  opacity: 0;
  width: 0;
  height: calc(100% - 55px);
  position: fixed;
  z-index: 90;
  top: 0;
  left: 55px;
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
  z-index: 100;
  position: absolute;
  right: 0;
  height: calc(100% - 55px);
  opacity: 0;
  transition: ease-in-out all 0.2s;
}

.sidebar.active {
  width: 250px;
}

.sidebar2.active {
  width: 250px;
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

.sidebar_tooltip,
.channel_tooltip {
  opacity: 0;
  pointer-events: none;
}

.sb_link:hover .sidebar_tooltip,
.channel_link:hover .channel_tooltip {
  @apply opacity-100 py-2 px-3 rounded darkest_bg border-2 border-zinc-600 z-[800];
}

@media only screen and (max-width: 1024px) {
  .clarifier_chatroom {
    width: calc(100% - 55px);
    left: 55px;
  }

  .sidebar.active .clarifier_chatroom {
    width: calc(100% - 250px);
    left: 250px;
  }

  .sidebar.active, .sidebar2.active, .member_section.active {
    @apply backdrop-blur-xl darkest_bg bg-opacity-75;
  }

  .darkergray-on-small {
    @apply darkest_bg border-r-neutral-700;
  }

  .darkergray-on-small.active {
    @apply border-r;
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

@media only screen and (min-width: 1025px) {
  .member_section_toggler {
    pointer-events: none;
    opacity: 0.5;
  }

  .clarifier_chatroom {
    width: calc(100% - 555px);
    left: 305px;
  }

  .clarifier_chatroom_big {
    width: calc(100% - 555px);
    left: 305px;
    border-left: 1px solid rgba(174, 174, 183, 0.25);
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

.sender_avatar_big,
.sender_avatar {
  @apply rounded-full overflow-hidden;
}

.sender_avatar {
  @apply w-[40px] h-[40px];
}

.sender_avatar_big {
  @apply w-[80px] h-[80px];
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
  height: 50px;
  font-weight: bold;
  font-size: 125%;
  color: white;
  display: flex;
  z-index: 10;
  position: relative;
  @apply w-full pl-2;
  align-items: center;
}

.subchat {
  display: flex;
  align-items: center;
  cursor: pointer;
  width: 100%;
  height: 36px;
  @apply px-2 rounded text-neutral-300 relative;
}

.subchat:hover {
  @apply bg-zinc-500 bg-opacity-50 text-neutral-100;
}

.subchat.active {
  @apply bg-zinc-500 bg-opacity-75 text-white;
}

.nopointer {
  pointer-events: none;
}

.darkbutton {
  @apply darkest_bg px-2 py-2;
}

.darkbutton:hover {
  @apply bg-black;
}

.message {
  padding: 0 15px 0 10px;
  @apply text-neutral-200 my-[1px];
}

.message:hover {
  @apply brightest_bg bg-opacity-25;
}

.message:hover .sender_avatar_animated {
  @apply block;
}

.msg_options {
  height: 30px;
  position: absolute;
  right: 42px;
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
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  @apply text-neutral-300 text-xs;
}

.message:hover .msg_time,
.message:hover .msg_options {
  opacity: 1;
}

.clientMessage {
  word-wrap: break-word;
  position: relative;
  max-width: calc(100% - 42px);
  margin: 0 !important;
  @apply text-neutral-200 rounded-r-lg rounded-bl-lg px-2 py-1 medium_bg;
}

.send_image_button.active {
  pointer-events: none;
  opacity: 0;
  transition: ease all 0.2s;
}

.uploadFileSnippet {
  min-width: 50px;
  max-width: 100%;
  min-height: 50px;
  max-height: calc(100% - 10rem);
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
  bottom: 55px;
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
  @apply rounded-md p-0 dark_bg;
  position: absolute;
  bottom: 80px;
  left: 10px;
  width: calc(100% - 20px);
  font-weight: bold;
  transition: 0.3s opacity;
  max-height: calc(100% - 55px - 50px - 80px - 10px);
  overflow-y: auto;
  overflow-x: hidden;
}

#init_loading,
#loading {
  min-width: 100%;
  min-height: 100%;
  align-items: center;
  justify-content: center;
  z-index: 999
}

.imgflip_text {
  width: calc(100% - 330px);
  height: 55px;
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

.clientMessage img {
  @apply my-2;
}

.headerline {
  overflow: hidden;
  text-align: center;
}

.headerline:before,
.headerline:after {
  @apply bg-zinc-500;
  content: "";
  display: inline-block;
  height: 1px;
  position: relative;
  vertical-align: middle;
  width: 50%;
}

.headerline:before {
  right: 0.5em;
  margin-left: -50%;
}

.headerline:after {
  left: 0.5em;
  margin-right: -50%;
}

.user_profile_button {
  @apply text-neutral-300 rounded medium_bg py-1 px-2 mr-1 hover:brightness-90;
}

.message_body {
  @apply w-full relative flex pl-[10px];
}

.shadow-hover:hover {
  box-shadow: 0 0 0 1px rgb(128, 128, 128);
}

</style>
