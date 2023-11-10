<template>
  <div id="knowledgeViewer" ref="knowledgeViewer"
       class="bright_bg w-full h-full relative overflow-hidden rounded-tr-lg">
    <div class="flex h-full w-full">
      <div id="sidebar"
           class="h-full min-w-[40px] max-w-[40px] flex-col
                  items-center overflow-y-auto ml-2 hidden lg:flex">
        <div class="text-neutral-300 h-full">
          <div class="sidebar_button rounded-xl medium_bg">
            <div v-on:click="clickedBack()"
                 v-tooltip.right="{
                       content: 'Exit'
                     }"
                 class="cursor-pointer hover:text-neutral-200 p-2 my-2">
              <XMarkIcon class="h-6 w-6"></XMarkIcon>
            </div>
          </div>
          <div class="my-2 border-y border-neutral-700">
            <div class="sidebar_button rounded-xl">
              <div v-on:click="reactToMessage(wisdom, '+')"
                   v-tooltip.right="{
                       content: 'Upvote'
                     }"
                   class="cursor-pointer hover:text-neutral-200 p-2 my-2">
                <HandThumbUpIcon class="h-6 w-6"></HandThumbUpIcon>
              </div>
            </div>
            <div class="sidebar_button rounded-xl">
              <div v-on:click="reactToMessage(wisdom, '-')"
                   v-tooltip.right="{
                       content: 'Downvote'
                     }"
                   class="cursor-pointer hover:text-neutral-200 p-2 my-2">
                <HandThumbDownIcon class="h-6 w-6"></HandThumbDownIcon>
              </div>
            </div>
            <div class="sidebar_button rounded-xl">
              <div v-on:click="reactToMessage(wisdom, '⭐')"
                   v-tooltip.right="{
                       content: 'Wow!'
                     }"
                   class="cursor-pointer hover:text-neutral-200 p-2 my-2">
                <StarIcon class="h-6 w-6"></StarIcon>
              </div>
            </div>
            <div class="sidebar_button rounded-xl">
              <div v-on:click="shareWisdom(wisdom)"
                   class="cursor-pointer hover:text-neutral-200 p-2 my-2"
                   v-tooltip.right="{
                       content: 'Share'
                     }">
                <ShareIcon class="h-6 w-6"></ShareIcon>
              </div>
            </div>
          </div>
          <template v-if="wisdom.copyContent && wisdom.copyContent !== ''">
            <div v-on:click="copy(wisdom.copyContent)"
                 v-tooltip.right="{
                       content: 'QuickCopy'
                     }"
                 class="cursor-pointer hover:text-neutral-200 p-2 my-2
                        sidebar_button rounded-xl">
              <ClipboardIcon class="h-6 w-6"></ClipboardIcon>
            </div>
          </template>
        </div>
      </div>
      <div id="main" ref="wisdom"
           class="h-full w-full flex justify-center overflow-y-auto pb-10
                  overflow-x-hidden mr-2 pr-1">
        <div class="h-fit w-full max-w-[1000px] px-3">
          <div id="sidebar_small"
               class="w-full py-2 block lg:hidden">
            <div class="text-neutral-300 h-full flex items-center">
              <div class="sidebar_button rounded-xl medium_bg">
                <div v-on:click="clickedBack()"
                     v-tooltip.bottom="{
                       content: 'Exit'
                     }"
                     class="cursor-pointer hover:text-neutral-200 p-2 mx-2">
                  <XMarkIcon class="h-6 w-6"></XMarkIcon>
                </div>
              </div>
              <div class="flex mx-2">
                <div class="sidebar_button rounded-xl">
                  <div v-on:click="reactToMessage(wisdom, '+')"
                       v-tooltip.bottom="{
                       content: 'Upvote'
                     }"
                       class="cursor-pointer hover:text-neutral-200 p-2 mx-2">
                    <HandThumbUpIcon class="h-6 w-6"></HandThumbUpIcon>
                  </div>
                </div>
                <div class="sidebar_button rounded-xl">
                  <div v-on:click="reactToMessage(wisdom, '-')"
                       v-tooltip.bottom="{
                       content: 'Downvote'
                     }"
                       class="cursor-pointer hover:text-neutral-200 p-2 mx-2">
                    <HandThumbDownIcon class="h-6 w-6"></HandThumbDownIcon>
                  </div>
                </div>
                <div class="sidebar_button rounded-xl">
                  <div v-on:click="reactToMessage(wisdom, '⭐')"
                       v-tooltip.bottom="{
                       content: 'Wow!'
                     }"
                       class="cursor-pointer hover:text-neutral-200 p-2 mx-2">
                    <StarIcon class="h-6 w-6"></StarIcon>
                  </div>
                </div>
                <div class="sidebar_button rounded-xl">
                  <div v-on:click="shareWisdom(wisdom)"
                       class="cursor-pointer hover:text-neutral-200 p-2 mx-2"
                       v-tooltip.bottom="{
                       content: 'Share'
                     }">
                    <ShareIcon class="h-6 w-6"></ShareIcon>
                  </div>
                </div>
              </div>
              <template v-if="wisdom.copyContent && wisdom.copyContent !== ''">
                <div v-on:click="copy(wisdom.copyContent)"
                     v-tooltip.bottom="{
                       content: 'QuickCopy'
                     }"
                     class="cursor-pointer hover:text-neutral-200 p-2 mx-2
                        sidebar_button rounded-xl">
                  <ClipboardIcon class="h-6 w-6"></ClipboardIcon>
                </div>
              </template>
            </div>
          </div>
          <div id="taskstart" class="flex mb-2 items-center pt-3">
            <TagIcon class="text-neutral-300 h-5 w-5 mr-2"></TagIcon>
            <template v-if="wisdom.cats && wisdom.cats.length > 0">
              <template v-for="cat in wisdom.cats" :key="cat">
                <div v-if="cat != null"
                     class="text-neutral-400 border-[1px] border-zinc-600 flex items-center
                            py-0.5 px-1 rounded mr-1 mb-1 pointer-events-none text-sm darkest_bg">
                  {{ cat }}
                </div>
              </template>
            </template>
            <template v-else>
              <div class="text-neutral-400 text-xs pointer-events-none">
                (No Categories)
              </div>
            </template>
          </div>
          <div class="text-neutral-300 mb-4 flex items-center">
            <div class="flex items-center gap-x-2">
              <div class="font-bold pointer-events-none">
                <template v-if="wisdom.type === 'lesson'">
                  <div class="px-1 py-0.5 inline-flex rounded-md bg-indigo-800 text-neutral-300">
                    {{ capitalizeFirstLetter(wisdom.type) }}
                  </div>
                </template>
                <template v-else-if="wisdom.type === 'question'">
                  <div class="px-1 py-0.5 inline-flex rounded-md bg-orange-800 text-neutral-300">
                    {{ capitalizeFirstLetter(wisdom.type) }}
                  </div>
                </template>
                <template v-else>
                  <div class="px-1 py-0.5 inline-flex rounded-md dark_bg text-neutral-300">
                    {{ capitalizeFirstLetter(wisdom.type) }}
                  </div>
                </template>
              </div>
              <template v-if="wisdom.type === 'task'">
                <template v-if="wisdom.done">
                  <div class="px-2 py-1 rounded bg-green-800 flex w-fit pointer-events-none">
                    <CheckIcon class="h-4 w-4 mr-1 text-neutral-300"></CheckIcon>
                    <span class="text-xs font-bold text-neutral-300">Done</span>
                  </div>
                </template>
                <template v-else>
                  <div class="px-2 py-1 rounded bg-red-800 flex w-fit pointer-events-none">
                    <Cog6ToothIcon class="h-4 w-4 mr-1 text-neutral-300"></Cog6ToothIcon>
                    <span class="text-xs font-bold text-neutral-300">W.I.P.</span>
                  </div>
                </template>
              </template>
              <div v-if="wisdom.views && wisdom.views > 0"
                   class="flex items-center p-1 text-neutral-300
                          hover:text-white">
                <EyeIcon class="w-5 h-5 mr-1"></EyeIcon>
                <span class="font-bold text-sm">{{ wisdom.views }}</span>
              </div>
              <template v-if="wisdom.reacts && wisdom.reacts.length > 0">
                <div class="flex">
                  <div v-for="reaction in wisdom.reacts" :key="reaction.src"
                       class="flex items-center p-1 mr-1 text-neutral-300
                              cursor-pointer hover:text-white"
                       :title="reaction.src.toString() + ' reacted to this.'"
                       v-on:click="reactToMessage(wisdom, reaction.t)"
                       :id="'react_' + wisdom.uid + '_' + reaction.t">
                    <HandThumbUpIcon v-if="reaction.t === '+'"
                                     class="w-5 h-5 mr-1"></HandThumbUpIcon>
                    <HandThumbDownIcon v-else-if="reaction.t === '-'"
                                       class="w-5 h-5 mr-1"></HandThumbDownIcon>
                    <StarIcon v-else-if="reaction.t === '⭐'"
                              class="w-5 h-5 mr-1"></StarIcon>
                    <span v-else> {{ reaction.t }} </span>
                    <span class="font-bold text-sm">{{ reaction.src.length }}</span>
                  </div>
                </div>
              </template>
              <template v-else>
                <div class="text-neutral-400 text-xs pointer-events-none">
                  (Unrated)
                </div>
              </template>
              <template v-if="related.replies && related.replies.length > 0">
                <div class="flex items-center p-1 text-neutral-300 cursor-pointer hover:text-white"
                     v-on:click="gotoComments()"
                     title="Go to Comments">
                  <ChatBubbleLeftEllipsisIcon class="h-6 w-6 mr-1"></ChatBubbleLeftEllipsisIcon>
                  {{ related.replies.length }}
                </div>
              </template>
              <template v-else>
                <div class="text-neutral-400 text-xs pointer-events-none">
                  (No Comments)
                </div>
              </template>
            </div>
          </div>
          <div class="xl:hidden dark_bg p-2 mb-2 w-fit rounded-md">
            <p class="m-0 text-neutral-200">{{ wisdom.name }}</p>
            <p class="m-0 text-sm text-neutral-300">
              {{ getHumanReadableDateText(wisdom.ts, true, true) }}
            </p>
          </div>
          <template v-if="wisdom.type === 'question' && wisdom.done !== true">
            <div class="w-full">
              <p class="mt-2 mb-4 p-2 border-l-8 border-l-orange-600 bg-orange-900
                        text-neutral-200 text-sm rounded w-fit">
                This question is unanswered (or at least not yet confirmed)!
                <br>Help by submitting a comment, providing useful information on this topic.
              </p>
            </div>
          </template>
          <div v-if="wisdom.type === 'question' && wisdom.done === true"
               v-on:click="gotoComments()"
               class="flex w-full items-center cursor-pointer my-2">
            <p
              class="px-1 py-0.5 border-2 border-emerald-600 text-neutral-200 bg-emerald-900
                     font-bold rounded-md w-fit">
              Answered
            </p>
            <div class="text-neutral-400 ml-2 text-xs">(Click to scroll to the answer)</div>
          </div>
          <template v-if="related.ref">
            <div class="text-neutral-400 border-l-8 border-l-zinc-800
                        overflow-hidden rounded-tl-md">
              <div class="w-fit rounded-r-md dark_bg py-1 pr-2">
                <p class="text-xs font-bold text-neutral-300 pointer-events-none">
                  Source Entry:
                </p>
              </div>
              <div class="my-2 ml-2 p-2 medium_bg rounded">
                <template v-if="related.ref.t && related.ref.t.length > 0">
                  <Markdown class="markedView"
                            :source="'# ' + related.ref.t"
                            :plugins="plugins"></Markdown>
                </template>
                <template v-else>
                  <Markdown v-if="related.ref.desc && related.ref.desc.length > 0"
                            class="markedView"
                            :source="related.ref.desc.substring(0, 100)"
                            :plugins="plugins"></Markdown>
                </template>
                <Disclosure v-slot="{ open }" v-if="related.ref.desc && related.ref.desc.length > 0">
                  <DisclosureButton
                    class="my-2 flex w-full justify-between rounded-lg px-2 py-1 dark_bg hover:darkest_bg
                         focus:outline-none focus-visible:ring focus-visible:ring-neutral-500
                         focus-visible:ring-opacity-75"
                  >
                    <div class="text-neutral-300 text-sm w-full">
                      <template v-if="open">
                        <div>Show less</div>
                      </template>
                      <template v-else>
                        <div>Show all</div>
                      </template>
                    </div>
                    <ChevronUpIcon
                      :class="open ? 'rotate-180 transform' : ''"
                      class="h-5 w-5 text-neutral-400"
                    />
                  </DisclosureButton>
                  <transition
                    enter-active-class="transition duration-100 ease-out"
                    enter-from-class="transform scale-95 opacity-0"
                    enter-to-class="transform scale-100 opacity-100"
                    leave-active-class="transition duration-75 ease-out"
                    leave-from-class="transform scale-100 opacity-100"
                    leave-to-class="transform scale-95 opacity-0"
                  >
                    <DisclosurePanel>
                      <div class="p-2">
                        <Markdown class="markedView"
                                  :source="related.ref.desc"
                                  :plugins="plugins"></Markdown>
                      </div>
                    </DisclosurePanel>
                  </transition>
                </Disclosure>
              </div>
              <div class="w-fit rounded-tr-md dark_bg py-1 pr-2">
                <p class="text-xs text-neutral-300 font-bold pointer-events-none">
                  {{ capitalizeFirstLetter(wisdom.type) }} to {{ related.ref.name }}'s {{ capitalizeFirstLetter(related.ref.type) }}:
                </p>
              </div>
            </div>
          </template>
          <div id="wisdom_content" ref="wisdom_content"
               class="medium_bg p-2 rounded-tr rounded-b dshadow">
            <div class="flex">
              <template v-if="wisdom.t">
                <Markdown class="markedView"
                          :source="'# ' + wisdom.t"
                          :plugins="plugins"></Markdown>
              </template>
              <template v-else>
                <p class="text-neutral-400">(No Title)</p>
              </template>
              <div v-on:click="editWisdom(wisdom)"
                   class="p-2 cursor-pointer flex items-center text-neutral-200 w-fit ml-auto mr-1 hover:text-white
                          hover:bg-neutral-800 rounded"
                   v-tooltip.left="{
                       content: 'Edit'
                     }">
                <PencilSquareIcon class="h-6 w-6"></PencilSquareIcon>
              </div>
            </div>
            <hr class="mb-3 mt-1">
            <!-- Main Content -->
            <template v-if="wisdom.desc">
              <Markdown class="markedView break-words"
                        :source="wisdom.desc"
                        :plugins="plugins"></Markdown>
            </template>
            <template v-else>
              <p class="text-neutral-400">(No Description)</p>
            </template>
          </div>
          <!-- Related Tasks -->
          <div class="w-full mt-5">
            <template v-if="related.tasks && related.tasks.length > 0">
              <Disclosure v-slot="{ open }">
                <DisclosureButton
                  class="my-2 flex w-full justify-between rounded-lg px-2 py-1 dark_bg hover:darkest_bg
                         focus:outline-none focus-visible:ring focus-visible:ring-neutral-500
                         focus-visible:ring-opacity-75"
                >
                  <div class="text-neutral-300 text-sm flex justify-between w-full">
                    <div>Related Tasks</div>
                    <div class="font-bold mr-2">{{ related.tasks.length }}</div>
                  </div>
                  <ChevronUpIcon
                    :class="open ? 'rotate-180 transform' : ''"
                    class="h-5 w-5 text-neutral-400"
                  />
                </DisclosureButton>
                <transition
                  enter-active-class="transition duration-100 ease-out"
                  enter-from-class="transform scale-95 opacity-0"
                  enter-to-class="transform scale-100 opacity-100"
                  leave-active-class="transition duration-75 ease-out"
                  leave-from-class="transform scale-100 opacity-100"
                  leave-to-class="transform scale-95 opacity-0"
                >
                  <DisclosurePanel>
                    <div class="w-full grid gap-y-3 gap-x-2 grid-cols-2 xl:grid-cols-3 dark_bg rounded p-2">
                      <div v-for="task in related.tasks" :key="task.uID"
                           v-on:click="fetchData(task.uid)"
                           class="medium_bg p-2 text-neutral-400 w-full rounded cursor-pointer hover:brightness-125 relative">
                        <div class="flex w-full mb-1 text-xs text-neutral-400">
                          <p>{{ task.name }}</p>
                        </div>
                        <div class="text-neutral-300 py-1 pointer-events-none">
                          <p class="font-bold break-words overflow-hidden">{{ task.t }}</p>
                        </div>
                        <div
                          class="text-neutral-300 py-1 pointer-events-none max-h-[11em] overflow-y-hidden">
                          <div class="flex items-center">
                            <p class="text-sm break-words overflow-hidden">{{ task.desc }}</p>
                          </div>
                        </div>
                        <template v-if="task.done">
                          <div class="px-1 py-1 rounded bg-green-800 flex w-24 mr-2 items-center">
                            <CheckIcon class="h-4 w-4 mr-1 text-neutral-300"></CheckIcon>
                            <span class="text-xs font-bold text-neutral-300">Done</span>
                          </div>
                        </template>
                        <template v-else>
                          <div class="px-1 py-1 rounded bg-red-800 flex w-24 mr-2 items-center">
                            <Cog6ToothIcon class="h-4 w-4 mr-1 text-neutral-300"></Cog6ToothIcon>
                            <span class="text-xs font-bold text-neutral-300">W.I.P.</span>
                          </div>
                        </template>
                      </div>
                    </div>
                  </DisclosurePanel>
                </transition>
              </Disclosure>
            </template>
            <template v-if="relatedSearch && relatedSearch.length > 0">
              <Disclosure v-slot="{ open }">
                <DisclosureButton
                  class="my-2 flex w-full justify-between rounded-lg px-2 py-1 dark_bg hover:darkest_bg
                         focus:outline-none focus-visible:ring focus-visible:ring-neutral-500
                         focus-visible:ring-opacity-75"
                >
                  <div class="text-neutral-300 text-sm flex justify-between w-full">
                    <div>Related Entries</div>
                    <div class="font-bold mr-2">{{ relatedSearch.length }}</div>
                  </div>
                  <ChevronUpIcon
                    :class="open ? 'rotate-180 transform' : ''"
                    class="h-5 w-5 text-neutral-400"
                  />
                </DisclosureButton>
                <transition
                  enter-active-class="transition duration-100 ease-out"
                  enter-from-class="transform scale-95 opacity-0"
                  enter-to-class="transform scale-100 opacity-100"
                  leave-active-class="transition duration-75 ease-out"
                  leave-from-class="transform scale-100 opacity-100"
                  leave-to-class="transform scale-95 opacity-0"
                >
                  <DisclosurePanel>
                    <div class="w-full grid gap-y-3 gap-x-2 grid-cols-2 xl:grid-cols-3 dark_bg rounded p-2">
                      <div v-for="task in relatedSearch" :key="task.uID"
                           v-on:click="fetchData(task.result.uid)"
                           class="medium_bg p-2 text-neutral-400 w-full rounded cursor-pointer hover:brightness-125 relative">
                        <template v-if="task.priority !== 'high'">
                          <div
                            class="absolute top-0 left-0 bottom-0 right-0 darkest_bg bg-opacity-50 hover:bg-opacity-0"></div>
                        </template>
                        <div class="flex w-full mb-1 text-xs text-neutral-300 items-center">
                          <template v-if="task.priority === 'high'">
                            <SparklesIcon class="w-4 h-4 mr-2 text-amber-600"></SparklesIcon>
                          </template>
                          <div>
                            <p>{{ task.name }}</p>
                            <p class="text-neutral-400">{{ getHumanReadableDateText(task.result.ts) }}</p>
                          </div>
                        </div>
                        <div class="text-neutral-300 py-1 pointer-events-none">
                          <p class="font-bold break-words overflow-hidden">{{ task.result.t }}</p>
                        </div>
                        <div
                          class="text-neutral-300 py-1 pointer-events-none max-h-[11em] overflow-y-hidden">
                          <div class="flex items-center">
                            <p class="text-sm break-words overflow-hidden">{{ task.result.desc }}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </DisclosurePanel>
                </transition>
              </Disclosure>
            </template>
          </div>
          <!-- Comments/Answers -->
          <div id="wisdomComments" class="w-full">
            <template v-if="wisdom.type === 'question'">
              <template v-if="!related.answers || related.answers.length < 1">
                <div class="flex w-full items-center justify-center py-4">
                  <div class="w-full text-neutral-400 pointer-events-none">
                    <CubeTransparentIcon class="h-8 w-8 mx-auto"></CubeTransparentIcon>
                    <p class="text-md font-bold italic w-fit mx-auto text-neutral-400">No Answer</p>
                  </div>
                </div>
              </template>
              <template v-else>
                <div class="flex items-center mt-2 pt-2 mb-2 pointer-events-none">
                  <p class="text-neutral-300 text-xl font-bold">
                    Answer:
                  </p>
                </div>
                <div v-for="comment in related.answers" :key="comment.uID"
                     class="border-l-8 border-l-emerald-600 pl-4">
                  <div class="mb-2 w-full dark_bg rounded-r-xl rounded-l-lg border-b-2
                            border-r-2 border-b-zinc-600 border-r-zinc-600 comment">
                    <div v-if="comment.reacts" class="px-2 pt-2 flex">
                      <div v-for="reaction in comment.reacts" :key="reaction.src"
                           class="flex items-center p-1 mr-1 text-neutral-400 cursor-pointer hover:text-white"
                           :title="reaction.src.toString() + ' reacted to this.'"
                           v-on:click="reactToMessage(comment, reaction.t)"
                           :id="'react_' + comment.uid + '_' + reaction.t">
                        <HandThumbUpIcon v-if="reaction.t === '+'"
                                         class="w-5 h-5 mr-1"></HandThumbUpIcon>
                        <HandThumbDownIcon v-else-if="reaction.t === '-'"
                                           class="w-5 h-5 mr-1"></HandThumbDownIcon>
                        <StarIcon v-else-if="reaction.t === '⭐'"
                                  class="w-5 h-5 mr-1"></StarIcon>
                        <span v-else> {{ reaction.t }} </span>
                        {{ reaction.src.length }}
                      </div>
                    </div>
                    <Markdown :source="comment.desc"
                              class="text-neutral-300 w-full markedView py-3 px-3"
                              :plugins="plugins"></Markdown>
                    <div class="flex w-full">
                      <div class="flex text-neutral-400 ml-auto mr-2 comment_react">
                        <div class="sidebar_button rounded-xl">
                          <div v-on:click="reactToMessage(comment, '+')"
                               class="cursor-pointer hover:text-neutral-200 p-2">
                            <HandThumbUpIcon class="h-6 w-6"></HandThumbUpIcon>
                          </div>
                        </div>
                        <div class="sidebar_button rounded-xl">
                          <div v-on:click="reactToMessage(comment, '-')"
                               class="cursor-pointer hover:text-neutral-200 p-2">
                            <HandThumbDownIcon class="h-6 w-6"></HandThumbDownIcon>
                          </div>
                        </div>
                        <div class="sidebar_button rounded-xl">
                          <div v-on:click="reactToMessage(comment, '⭐')"
                               class="cursor-pointer hover:text-neutral-200 p-2">
                            <StarIcon class="h-6 w-6"></StarIcon>
                          </div>
                        </div>
                      </div>
                      <div
                        class="text-neutral-400 dark_bg rounded-br-xl rounded-tl-xl py-1 px-2 min-w-[20%] justify-between flex items-center">
                        <p class="text-neutral-400 text-xs mr-2">
                          {{ getHumanReadableDateText(comment.ts, true) }}</p>
                        <p class="">{{ comment.name }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </template>
            <div class="w-full relative mt-4 pt-4">
              <div
                class="p-2 rounded-full hover:darkest_bg text-neutral-400 hover:text-neutral-200 absolute right-0 sidebar_button cursor-pointer -translate-y-1 flex mx-1">
                <Squares2X2Icon
                  class="h-6 w-6"></Squares2X2Icon>
                <div class="ml-auto translate-y-2.5">
                  <div class="sidebar_tooltip text-neutral-400">Preview</div>
                </div>
              </div>
              <textarea type="text" id="input_comment" ref="input_comment" v-model="wisComment" rows="1"
                        class="w-[calc(100%-50px)] border-b border-zinc-500 text-neutral-200 medium_bg
                               focus:outline-none px-2 py-1"
                        v-on:keyup="auto_grow"></textarea>
            </div>
            <label for="input_comment"
                   class="text-neutral-300">
              Write a comment
            </label>
            <template v-if="!related.replies || related.replies.length < 1">
              <div class="flex w-full items-center justify-center py-4">
                <div class="w-full text-neutral-400 pointer-events-none">
                  <CubeTransparentIcon class="h-8 w-8 mx-auto"></CubeTransparentIcon>
                  <p class="text-md font-bold italic w-fit mx-auto text-neutral-400">No Comments</p>
                </div>
              </div>
            </template>
            <template v-else>
              <div id="comments_anchor" class="flex items-center mt-8 mb-2 pointer-events-none">
                <ChatBubbleLeftEllipsisIcon class="w-5 h-5 mr-2 text-neutral-300"></ChatBubbleLeftEllipsisIcon>
                <p class="text-neutral-300">
                  {{ related.replies.length }} {{ commentsText }}:
                </p>
              </div>
              <template v-for="comment in related.replies" :key="comment.uID">
                <div class="mb-2 w-full medium_bg rounded-r-xl rounded-l-lg border-b-2
                            border-r-2 border-b-zinc-500 border-r-zinc-500 comment">
                  <div v-if="comment.reacts" class="px-2 pt-2 flex">
                    <div v-for="reaction in comment.reacts" :key="reaction.src"
                         class="flex items-center p-1 mr-1 text-neutral-400 cursor-pointer hover:text-white"
                         :title="reaction.src.toString() + ' reacted to this.'"
                         v-on:click="reactToMessage(comment, reaction.t)"
                         :id="'react_' + comment.uid + '_' + reaction.t">
                      <HandThumbUpIcon v-if="reaction.t === '+'"
                                       class="w-5 h-5 mr-1"></HandThumbUpIcon>
                      <HandThumbDownIcon v-else-if="reaction.t === '-'"
                                         class="w-5 h-5 mr-1"></HandThumbDownIcon>
                      <StarIcon v-else-if="reaction.t === '⭐'"
                                class="w-5 h-5 mr-1"></StarIcon>
                      <span v-else> {{ reaction.t }} </span>
                      {{ reaction.src.length }}
                    </div>
                  </div>
                  <Markdown :source="comment.desc"
                            class="text-neutral-300 w-full markedView py-3 px-3"
                            :plugins="plugins"></Markdown>
                  <div class="flex w-full">
                    <div class="flex text-neutral-400 ml-auto mr-2 comment_react">
                      <div class="sidebar_button rounded-xl">
                        <div v-on:click="reactToMessage(comment, '+')"
                             class="cursor-pointer hover:text-neutral-200 p-2">
                          <HandThumbUpIcon class="h-6 w-6"></HandThumbUpIcon>
                        </div>
                      </div>
                      <div class="sidebar_button rounded-xl">
                        <div v-on:click="reactToMessage(comment, '-')"
                             class="cursor-pointer hover:text-neutral-200 p-2">
                          <HandThumbDownIcon class="h-6 w-6"></HandThumbDownIcon>
                        </div>
                      </div>
                      <div class="sidebar_button rounded-xl">
                        <div v-on:click="reactToMessage(comment, '⭐')"
                             class="cursor-pointer hover:text-neutral-200 p-2">
                          <StarIcon class="h-6 w-6"></StarIcon>
                        </div>
                      </div>
                    </div>
                    <div
                      class="text-neutral-400 dark_bg rounded-br-xl rounded-tl-xl py-1 px-2 min-w-[20%] justify-between flex items-center">
                      <p class="text-neutral-400 text-xs mr-2">
                        {{ getHumanReadableDateText(comment.ts, true) }}</p>
                      <p class="text-sm">{{ comment.name }}</p>
                    </div>
                  </div>
                </div>
                <template
                  v-if="wisdom.type === 'question' && wisdom.done !== true && wisdom.usr === $store.state.username">
                  <div class="mb-4 mt-1 w-full flex">
                    <button v-on:click="finishQuestion(wisdom, comment)"
                            class="text-neutral-100 border-2 border-emerald-500 bg-emerald-800 hover:bg-emerald-900
                                   rounded-lg px-1 py-0.5 font-bold ml-auto transition-colors
                                   flex items-center justify-center">
                      <CheckIcon class="w-5 h-5 mr-1"></CheckIcon>
                      <span>Mark as Answer</span>
                    </button>
                  </div>
                </template>
              </template>
            </template>
          </div>
        </div>
      </div>
      <div id="rightbar"
           class="max-h-[calc(100%-30px)] w-[350px] hidden xl:flex xl:flex-col
                  overflow-hidden rounded-b-xl">
        <div class="rounded-l-xl text-neutral-300 p-2 mt-2 medium_bg">
          <div class="border-none mb-2 pointer-events-none">
            <div class="text-neutral-300 text-xs pr-2 font-bold">Author</div>
            <div class="text-sm mb-2">{{ wisdom.name }}</div>
            <div class="text-neutral-300 text-xs pr-2 font-bold">Source</div>
            <div class="text-sm mb-2">{{ knowledge.t }}</div>
            <div class="text-neutral-300 text-xs pr-2 font-bold">Date</div>
            <div class="text-sm">{{ getHumanReadableDateText(wisdom.ts, true, true) }}</div>
          </div>
          <template v-if="!$store.getters.hasSeenWisdomTutorial()">
            <div id="wisdomTutorial"
                 class="rounded-xl relative my-4 text-neutral-300">
              <div class="darkest_bg rounded-t-xl p-2">
                <XMarkIcon v-on:click="dismissTutorial()"
                           class="h-6 w-6 absolute top-2 right-2
                                  hover:text-white cursor-pointer
                                  hover:bright_bg rounded-xl">
                </XMarkIcon>
                <div class="font-bold ml-1">Hey!</div>
              </div>
              <div class="dark_bg rounded-b-xl p-3 text-sm text-justify">
                Welcome to the the new Wisdom Viewer, now with less distraction!
                <br><br>
                Find out about how things work, rate articles and enjoy the power of
                <span class="font-bold">QuickCopy</span>.
                <br><br>
                By the way... you can now collaborate with others! Comment on their wisdom to share your experiences
                and/or opinions!
              </div>
            </div>
          </template>
        </div>
        <ul ref="contentLinks"
            class="rounded-l-xl text-neutral-300 pl-2 py-2 mt-2 medium_bg
                     overflow-y-auto h-fit max-h-full w-full max-w-[350px]">
          <div class="dark_bg p-1 pr-0 rounded-tl-md">
            <span class="pl-2 text-xs font-bold text-neutral-300">Contents</span>
          </div>
          <div class="border-l-4 border-l-indigo-800 h-2 w-4"></div>
          <li v-for="contentLink in contentLinksArr" :key="contentLink"
              :id="'link_' + contentLink.link"
              class="flex items-center border-l-4 pl-1"
              :class="{ 'border-l-indigo-800': contentLink.active, 'border-l-zinc-800': !contentLink.active }">
            <div v-for="level in contentLink.level" :key="level"
                 class="min-w-[1.5rem] h-full flex items-start justify-center">
              <div v-if="level === '|'"
                   class="h-1 w-1 rounded-full dark_bg"></div>
            </div>
            <a :href="contentLink.link"
               class="text-neutral-300 text-sm py-0.5 px-1 rounded
                      hover:bg-indigo-800 border-[2px] border-transparent hover:border-indigo-600">
              {{ contentLink.t }}
            </a>
          </li>
          <div class="border-l-4 border-l-zinc-800 h-1 w-1 rounded-b-full"></div>
        </ul>
      </div>
    </div>
  </div>
  <!-- EDIT MODAL -->
  <modal @close="isWritingLesson = false"
         v-show="isWritingLesson">
    <template v-slot:header>
      Edit
    </template>
    <template v-slot:body>
      <div class="flex w-[95dvw] max-h-[full] gap-x-2">
        <div class="w-full md:w-1/2">
          <div class="md:hidden flex mt-2 w-full">
            <div class="mb-3 text-black font-bold bg-zinc-800 rounded p-2
                        w-full flex items-center justify-end">
              <button v-on:click="editLesson()"
                      class="mr-2 btn_bg_primary"
                      v-tooltip.top="{
                       content: 'Save changes'
                     }">
                Submit
              </button>
              <button v-on:click="isWritingLesson = false"
                      class="mr-2 py-2 px-3 border-2 border-zinc-500 rounded-md hover:bg-zinc-800
                             text-neutral-200 bg-zinc-700"
                      v-tooltip.top="{
                       content: 'Discard changes'
                     }">
                Cancel
              </button>
              <button v-on:click="deleteLesson()"
                      class="py-2 px-3 border-2 border-red-600 rounded-md bg-red-900 hover:bg-red-800
                             text-neutral-200"
                      v-tooltip.top="{
                       content: 'Delete entry'
                     }">
                Delete
              </button>
            </div>
          </div>
          <label for="wisTitle" class="text-xl font-bold">Title:</label>
          <br>
          <input type="text" id="wisTitle" v-model="wisTitle"
                 class="medium_bg rounded-md w-full py-2 px-3 mt-1 text-neutral-200">
          <br>
          <div class="block lg:flex w-full">
            <div class="lg:w-1/2">
              <label for="wisCategories" class="text-xl mt-2 font-bold">Categories:</label>
              <br>
              <Listbox v-model="wisCategories" multiple id="wisCategories">
                <div class="relative mt-1">
                  <ListboxButton
                    class="medium_bg w-full relative cursor-default rounded-lg py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm"
                  >
                    <template v-if="wisCategories.length > 0">
                      <div class="block truncate font-bold text-neutral-300">
                        {{ wisCategories.map((cat) => cat.category).join(', ') }}
                      </div>
                    </template>
                    <template v-else>
                      <span class="block truncate font-bold text-neutral-400">Select...</span>
                    </template>
                    <div
                      class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                      <ArrowsUpDownIcon class="h-5 w-5 text-neutral-400" aria-hidden="true"/>
                    </div>
                  </ListboxButton>
                  <transition
                    leave-active-class="transition duration-100 ease-in"
                    leave-from-class="opacity-100"
                    leave-to-class="opacity-0">
                    <ListboxOptions
                      class="absolute mt-1 max-h-60 w-full overflow-auto rounded-md dark_bg py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                    >
                      <ListboxOption
                        v-slot="{ active, selected }"
                        v-for="cat in knowledge.categories"
                        :key="cat"
                        :value="cat"
                        as="template"
                      >
                        <li
                          :class="[ active ? 'bg-gray-700' : '',
                                  'relative cursor-pointer select-none py-2 pl-10 pr-4 text-neutral-200' ]">
                          <div
                            :class="[ selected ? 'font-medium' : 'font-normal', 'block truncate' ]">
                            {{ cat.category }}
                          </div>
                          <div
                            v-if="selected"
                            class="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                            <CheckIcon class="h-5 w-5" aria-hidden="true"/>
                          </div>
                        </li>
                      </ListboxOption>
                    </ListboxOptions>
                  </transition>
                </div>
              </Listbox>
            </div>
            <div class="lg:w-3/5 lg:ml-3">
              <label for="wisKeywords" class="text-xl mt-2 font-bold">Keywords:</label>
              <br>
              <input type="text" id="wisKeywords" v-model="wisKeywords"
                     class="medium_bg rounded-md py-2 px-3 mt-1 w-full text-neutral-200">
            </div>
          </div>
          <div class="flex items-baseline mt-2">
            <label for="wisDescription" class="text-xl font-bold">Description:</label>
            <div class="ml-2 p-1">
              <button class="btn_small_icon text-neutral-200"
                      v-on:click="isAddingMedia = true">
                <DocumentArrowUpIcon
                  class="h-6 w-6 mr-1"
                  aria-hidden="true"
                />
                Add File
              </button>
            </div>
          </div>
          <div class="w-full mt-1">
            <textarea type="text" id="wisDescription" v-model="wisDescription" ref="wisDescription"
                      rows="20" class="w-full medium_bg py-2 px-3 text-neutral-200"></textarea>
          </div>
          <br>
          <label for="wisCopyContent" class="text-xl mt-2 font-bold">Copy Content:</label>
          <br>
          <div class="w-full overflow-hidden mt-1">
            <textarea type="text" id="wisCopyContent" v-model="wisCopyContent"
                      rows="5" class="w-full medium_bg py-2 px-3 text-neutral-200"></textarea>
          </div>
        </div>
        <div class="hidden md:block w-1/2">
          <label class="text-xl font-bold pointer-events-none">Preview:</label>
          <br>
          <div class="flex mt-1 w-full">
            <div class="text-black font-bold bg-zinc-800 p-4 rounded-md w-full
                        flex items-center justify-end mb-4">
              <button v-on:click="editLesson()"
                      class="mr-2 btn_bg_primary"
                      v-tooltip.top="{
                       content: 'Save changes'
                     }">
                Submit
              </button>
              <button v-on:click="isWritingLesson = false"
                      class="mr-2 py-2 px-3 border-2 border-zinc-500 rounded-md hover:bg-zinc-800
                             text-neutral-200 bg-zinc-700"
                      v-tooltip.top="{
                       content: 'Discard changes'
                     }">
                Cancel
              </button>
              <button v-on:click="deleteLesson()"
                      class="py-2 px-3 border-2 border-red-600 rounded-md bg-red-900 hover:bg-red-800
                             text-neutral-200"
                      v-tooltip.top="{
                       content: 'Delete entry'
                     }">
                Delete
              </button>
            </div>
          </div>
          <div class="medium_bg rounded-md p-2 mt-1 cursor-not-allowed">
            <Markdown :source="'# ' + wisTitle" class="w-full markedView" :plugins="plugins"></Markdown>
            <Markdown :source="wisDescription" class="w-full mt-4 markedView" :plugins="plugins"></Markdown>
          </div>
        </div>
      </div>
    </template>
    <template v-slot:footer>
    </template>
  </modal>
  <modal
    v-show="isAddingMedia"
    @close="cancelAddMedia">
    <template v-slot:header>
      Add File
    </template>
    <template v-slot:body>
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
      <input type="file" class="file_input" id="process_add_media" :ref="'process_add_media'" name="files[]"
             style="width: 100%"
             multiple v-on:change="handleUploadFileSelect"/>
      <template v-if="uploadFileBase64 !== ''">
        <p class="text-neutral-300 font-bold">{{ this.uploadFileName }}</p>
        <div class="mt-3 w-full">
          <button class="darkbutton text-white p-2 w-full
                           flex items-center justify-center rounded-full"
                  style="height: 2.5em;
                           border-color: transparent; margin: auto"
                  title="Send"
                  v-on:click="uploadSnippet">
            <span class="font-bold flex"><i class="bi bi-send mr-2"></i>Submit</span>
            <span style="margin-left: 10px" class="c_lightgray text-xs"> {{ this.uploadFileType }}</span>
          </button>
        </div>
      </template>
    </template>
    <template v-slot:footer>
    </template>
  </modal>
</template>

<script>
import modal from '../../components/Modal.vue'
import Markdown from 'vue3-markdown-it'
import markdownItMermaid from 'markdown-it-mermaid'
import 'highlight.js/styles/hybrid.css'
import mermaid from 'mermaid'
import { DateTime } from 'luxon'
import {
  ChatBubbleLeftEllipsisIcon,
  ClipboardIcon,
  CubeTransparentIcon,
  DocumentArrowUpIcon,
  DocumentTextIcon,
  FolderArrowDownIcon,
  HandThumbDownIcon,
  HandThumbUpIcon,
  PencilSquareIcon,
  ShareIcon,
  StarIcon,
  TagIcon,
  XMarkIcon,
  EyeIcon
} from '@heroicons/vue/24/outline'
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions
} from '@headlessui/vue'
import {
  ArrowsUpDownIcon,
  CheckIcon,
  ChevronUpIcon,
  Cog6ToothIcon,
  SparklesIcon,
  Squares2X2Icon
} from '@heroicons/vue/24/solid'
import { dbGetDisplayName } from '@/libs/wikistore'

export default {
  name: 'KnowledgeView',
  props: {
    isoverlay: Boolean,
    srcguid: String,
    chatguid: String
  },
  emits: ['close'],
  components: {
    DocumentTextIcon,
    FolderArrowDownIcon,
    DocumentArrowUpIcon,
    modal,
    Markdown,
    ClipboardIcon,
    HandThumbUpIcon,
    HandThumbDownIcon,
    StarIcon,
    XMarkIcon,
    TagIcon,
    Listbox,
    ListboxButton,
    ListboxOptions,
    ListboxOption,
    CheckIcon,
    ArrowsUpDownIcon,
    PencilSquareIcon,
    CubeTransparentIcon,
    Squares2X2Icon,
    ChatBubbleLeftEllipsisIcon,
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
    ChevronUpIcon,
    SparklesIcon,
    ShareIcon,
    Cog6ToothIcon,
    EyeIcon
  },
  data () {
    return {
      // Wisdom Creation
      wisTitle: '',
      wisDescription: '',
      wisKeywords: '',
      wisCopyContent: '',
      wisCategories: [],
      wisGUID: '',
      isWritingWisdom: false,
      isWritingLesson: false,
      isEditingWisdom: false,
      isWritingComment: false,
      // ---
      srcguidOverride: '',
      knowledge: {},
      wisdom: {
        type: ''
      },
      contentLinks: new Map(),
      contentLinksArr: [],
      currentHeaders: new Map(),
      related: {
        answers: [],
        comments: [],
        tasks: [],
        questions: [],
        lessons: [],
        srcWisdom: null
      },
      relatedSearch: [],
      wisComment: '',
      inputComment: null,
      isAddingMedia: false,
      uploadFileName: '',
      uploadFileType: '',
      uploadFileBase64: '',
      plugins: [
        {
          plugin: markdownItMermaid
        }
      ]
    }
  },
  mounted () {
    this.fetchData()
    this.initFunction()
  },
  computed: {
    commentsText: function () {
      if (this.related.replies != null) {
        if (this.related.replies.length > 1) {
          return 'Comments'
        } else {
          return 'Comment'
        }
      } else {
        return ''
      }
    }
  },
  methods: {
    fetchData: async function (guidOverride = '') {
      document.getElementById('taskstart').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
      this.srcguidOverride = guidOverride
      await this.getWisdom()
      await this.getRelated()
      if (this.wisdom.type === 'task') {
        await this.getRelated(this.wisdom.ref, true)
      }
      // Whose knowledge are we trying to see?
      let knowledgeGUID
      if (!this.isoverlay) {
        const params = new Proxy(new URLSearchParams(window.location.search), {
          get: (searchParams, prop) => searchParams.get(prop)
        })
        knowledgeGUID = params.src
      } else {
        knowledgeGUID = this.chatguid
      }
      if (knowledgeGUID != null) {
        const knowledge = await this.getKnowledge(knowledgeGUID)
        if (knowledge != null) {
          this.knowledge = knowledge
        }
      }
      await this.getRelatedSearch()
      return new Promise((resolve) => {
        resolve()
      })
    },
    initFunction: async function () {
      this.renderMermaidInit()
      const input = this.$refs.input_comment
      input.addEventListener('keydown', this.handleEnter, false)
      this.inputComment = input
      this.auto_grow()
      // Scroll event
      this.$refs.wisdom.onscroll = this.throttle(() => this.handleScroll())
      // Set window padding
      const mainDiv = this.$refs.knowledgeViewer
      if (mainDiv) {
        if (!this.isoverlay) {
          mainDiv.classList.add('pt-[55px]')
        } else {
          mainDiv.classList.remove('pt-[55px]')
        }
      }
    },
    getWisdom: async function () {
      return new Promise((resolve) => {
        let guid
        if (this.srcguidOverride === '') {
          if (!this.isoverlay) {
            guid = this.$route.params.id
          } else {
            guid = this.srcguid
          }
        } else {
          guid = this.srcguidOverride
        }
        this.$Worker.execute({
          action: 'api',
          method: 'get',
          url: 'wisdom/private/get/' + guid
        })
          .then(async (data) => {
            this.wisdom = data.result
            // Cut away all hashtags and whitespace at the front
            this.wisdom.t = this.formatTitle(this.wisdom.t)
            this.wisGUID = this.wisdom.uid
            // Reactions
            if (this.wisdom.reacts != null) {
              for (let i = this.wisdom.reacts.length - 1; i >= 0; i--) {
                if (this.wisdom.reacts[i].src.length === 0) {
                  this.wisdom.reacts.splice(i, 1)
                }
              }
            } else {
              this.wisdom.reacts = []
            }
            // Display name
            let dName = await dbGetDisplayName(this.wisdom.usr)
            if (dName == null) {
              dName = this.wisdom.usr
            }
            this.wisdom.name = dName
          })
          .then(() => {
            this.buildContentLinks()
          })
          .then(() => resolve())
          .catch((err) => {
            console.debug(err.message)
          })
      })
    },
    getRelated: async function (guidOverride = '', onlyTasks = false) {
      return new Promise((resolve) => {
        let guid
        if (this.srcguidOverride === '') {
          if (!this.isoverlay) {
            guid = this.$route.params.id
          } else {
            guid = this.srcguid
          }
        } else {
          guid = this.srcguidOverride
        }
        if (guidOverride !== '') guid = guidOverride
        this.$Worker.execute({
          action: 'api',
          method: 'get',
          url: 'wisdom/private/investigate/' + guid
        })
          .then(async (data) => {
            if (!onlyTasks) {
              this.related = data.result
              let dName
              if (this.related.replies) {
                for (let i = 0; i < this.related.replies.length; i++) {
                  this.related.replies[i].ts = DateTime.fromISO(this.related.replies[i].ts)
                  dName = await dbGetDisplayName(this.related.replies[i].usr)
                  if (dName == null) {
                    dName = this.related.replies[i].usr
                  }
                  this.related.replies[i].name = dName
                }
              }
              if (this.related.answers) {
                for (let i = 0; i < this.related.answers.length; i++) {
                  this.related.answers[i].ts = DateTime.fromISO(this.related.answers[i].ts)
                  dName = await dbGetDisplayName(this.related.answers[i].usr)
                  if (dName == null) {
                    dName = this.related.answers[i].usr
                  }
                  this.related.answers[i].name = dName
                }
              }
              if (this.related.ref) {
                this.related.ref.ts = DateTime.fromISO(this.related.ref.ts)
                dName = await dbGetDisplayName(this.related.ref.usr)
                if (dName == null) {
                  dName = this.related.ref.usr
                }
                this.related.ref.name = dName
              }
            } else {
              if (data.result.tasks) {
                this.related.tasks = []
                let dName
                for (let i = 0; i < data.result.tasks.length; i++) {
                  if (data.result.tasks[i].uid !== this.wisdom.uid) {
                    data.result.tasks[i].t = this.formatTitle(data.result.tasks[i].t)
                    data.result.tasks[i].ts = DateTime.fromISO(data.result.tasks[i].ts)
                    dName = await dbGetDisplayName(data.result.tasks[i].usr)
                    if (dName == null) {
                      dName = data.result.tasks[i].usr
                    }
                    data.result.tasks[i].name = dName
                    this.related.tasks.push(data.result.tasks[i])
                  }
                }
              }
            }
          })
          .then(() => {
            this.renderMermaid()
            resolve()
          })
          .catch((err) => {
            console.debug(err.message)
          })
      })
    },
    reactToMessage: async function (wisdom, t) {
      const payload = JSON.stringify({
        reaction: t
      })
      return new Promise((resolve) => {
        this.$Worker.execute({
          action: 'api',
          method: 'post',
          url: 'wisdom/private/react/' + wisdom.uid,
          body: payload
        })
          .then(() => {
            this.getRelated()
            this.$notify(
              {
                title: 'Feedback sent to the server.',
                text: 'Thanks!',
                type: 'info'
              })
          })
          .then(() => resolve)
          .catch((err) => {
            console.debug(err.message)
          })
      })
    },
    copy: function (parameter) {
      navigator.clipboard.writeText(parameter)
      this.$notify(
        {
          title: 'Quick Copy Done!',
          text: 'CTRL-V to paste.',
          type: 'info'
        })
    },
    capitalizeFirstLetter: function ([first, ...rest], locale = navigator.language) {
      return first === undefined ? '' : first.toLocaleUpperCase(locale) + rest.join('')
    },
    dismissTutorial: function () {
      const elem = document.getElementById('wisdomTutorial')
      if (elem) {
        elem.remove()
      }
      this.$store.commit('setWisdomTutorialSeen', true)
    },
    editLesson: async function () {
      const categories = []
      for (let i = 0; i < this.wisCategories.length; i++) {
        categories.push(this.wisCategories[i])
      }
      this.wisdom.t = this.wisTitle
      this.wisdom.desc = this.wisDescription
      this.wisdom.keys = this.wisKeywords
      this.wisdom.copy = this.wisCopyContent
      this.wisdom.cats = categories
      return new Promise((resolve) => {
        this.$Worker.execute({
          action: 'api',
          method: 'post',
          url: 'wisdom/private/edit/' + this.wisGUID,
          body: JSON.stringify(this.wisdom)
        })
          .then(() => {
            this.resetValues()
            this.getWisdom()
          })
          .then(() => {
            this.getRelatedSearch()
          })
          .then(() => resolve)
          .catch((err) => {
            console.debug(err.message)
          })
      })
    },
    deleteLesson: async function () {
      if (this.wisGUID == null || this.wisGUID === '') return
      return new Promise((resolve) => {
        this.$Worker.execute({
          action: 'api',
          method: 'get',
          url: 'wisdom/private/delete/' + this.wisGUID
        })
          .then(() => {
            this.resetValues()
            this.$notify(
              {
                title: 'Wisdom deleted.',
                text: '',
                type: 'info'
              })
            this.$router.back()
          })
          .then(() => resolve())
          .catch((err) => {
            this.$notify(
              {
                title: 'Error!',
                text: 'Maybe you aren\'t the owner of the Wisdom.',
                type: 'error'
              })
            console.debug(err.message)
          })
      })
    },
    editWisdom: function (wisdom) {
      this.wisTitle = ''
      this.wisDescription = ''
      this.wisKeywords = ''
      this.wisCopyContent = ''
      this.wisCategories = []
      this.wisGUID = ''
      this.isWritingWisdom = true
      this.isWritingLesson = true
      this.isEditingWisdom = true
      // Defaults
      this.wisTitle = wisdom.t
      this.wisDescription = wisdom.desc
      this.wisKeywords = wisdom.keys
      if (wisdom.cats != null && wisdom.cats.length > 0) {
        for (let i = 0; i < wisdom.cats.length; i++) {
          this.wisCategories.push(wisdom.cats[i])
        }
      }
      this.wisCopyContent = wisdom.copyContent
      this.wisGUID = wisdom.uid
      this.renderMermaid()
      setTimeout(() => {
        this.$refs.wisDescription.style.height = (this.$refs.wisDescription.scrollHeight) + 'px'
        this.$refs.wisDescription.onkeyup = this.auto_grow_wisDescription
      }, 1000)
    },
    getKnowledge: async function (sessionID) {
      return new Promise((resolve) => {
        this.$Worker.execute({
          action: 'api',
          method: 'get',
          url: 'knowledge/private/chat/' + sessionID
        })
          .then((data) => {
            this.knowledge = data.result
            resolve()
          })
          .catch((err) => {
            console.debug(err.message)
            this.knowledgeExists = false
          })
      })
    },
    renderMermaidInit: function () {
      setTimeout(() => {
        mermaid.initialize({
          startOnLoad: true,
          theme: 'dark'
        })
        setTimeout(() => {
          mermaid.init()
        }, 0)
      }, 0)
    },
    renderMermaid: function () {
      setTimeout(() => {
        mermaid.init()
      }, 0)
    },
    handleEnter: function () {
      if (event.repeat) return
      if (event.key === 'Enter') {
        if (event.shiftKey) return
        event.preventDefault()
        this.submitComment()
      }
    },
    submitComment: function () {
      if (!this.isWritingComment) {
        this.isWritingComment = true
        this.postComment(this.wisComment)
      }
    },
    postComment: async function (comment, title = '') {
      if (comment.trim() === '') return
      const payload = {
        t: title,
        desc: comment.trim(),
        ref: this.wisGUID,
        keys: '',
        type: 'reply',
        pid: this.knowledge.uid
      }
      const bodyPayload = JSON.stringify(payload)
      return new Promise((resolve) => {
        this.$Worker.execute({
          action: 'api',
          method: 'post',
          url: 'wisdom/private/reply',
          body: bodyPayload
        })
          .then(() => {
            this.getRelated()
            this.resetValues()
            this.$notify(
              {
                title: 'Comment submitted.',
                text: 'Thanks for your contribution!',
                type: 'info'
              })
            setTimeout(() => {
              this.inputComment.blur()
              this.auto_grow()
            }, 0)
          })
          .then(() => {
            if (this.wisdom.type === 'task') {
              this.getRelated(this.wisdom.ref, true)
            }
          })
          .then(() => resolve())
          .catch((err) => {
            console.debug(err.message)
          })
          .finally(() => {
            this.isWritingComment = false
          })
      })
    },
    resetValues: function () {
      this.wisTitle = ''
      this.wisDescription = ''
      this.wisKeywords = ''
      this.wisCopyContent = ''
      this.wisCategories = []
      this.wisComment = ''
      this.isWritingWisdom = false
      this.isWritingLesson = false
      this.isEditingWisdom = false
    },
    auto_grow: function () {
      this.inputComment.style.height = '36px' // Default
      this.inputComment.style.height = (this.inputComment.scrollHeight) + 'px' // Grow if scrollHeight > 0
      // this.mainContent.style.bottom = (this.inputComment.scrollHeight - 40) + 'px'
    },
    auto_grow_wisDescription: function () {
      this.$refs.wisDescription.style.height = (this.$refs.wisDescription.scrollHeight) + 'px'
    },
    gotoComments: function () {
      document.getElementById('wisdomComments').scrollIntoView({ behavior: 'smooth' })
    },
    clickedBack: function () {
      if (!this.isoverlay) {
        this.$router.back()
      } else {
        this.$emit('close')
      }
    },
    getRelatedSearch: async function (substitute = null, entryType = '') {
      const keywords = this.wisdom.keywords ?? ''
      const title = this.wisdom.t ?? ''
      if ((!keywords || keywords.length < 1) && (!title || title.length < 1)) {
        return
      }
      // Reset results
      this.relatedSearch = []
      // Build queryString
      let queryString = keywords.replaceAll(',', ' ') + ' ' + title
      // Remove dangerous Regex wildcards
      queryString = queryString.replaceAll('.', '')
      queryString = queryString.replaceAll('?', '')
      const payload = {
        query: substitute ?? queryString.trim(),
        type: entryType
      }
      return new Promise((resolve) => {
        this.$Worker.execute({
          action: 'api',
          method: 'post',
          url: 'wisdom/private/query/' + this.knowledge.uid,
          body: JSON.stringify(payload)
        })
          .then((data) => {
            const parsedData = data.result
            if (parsedData.first != null) {
              for (let i = 0; i < parsedData.first.length; i++) {
                if (parsedData.first[i].wisdom.uid !== this.wisdom.uid) {
                  parsedData.first[i].wisdom.t = this.formatTitle(parsedData.first[i].wisdom.t)
                  this.relatedSearch.push({
                    priority: 'high',
                    result: parsedData.first[i].wisdom
                  })
                }
              }
            }
            if (parsedData.second != null) {
              for (let i = 0; i < parsedData.second.length; i++) {
                if (parsedData.second[i].wisdom.uid !== this.wisdom.uid) {
                  parsedData.second[i].wisdom.t = this.formatTitle(parsedData.second[i].wisdom.t)
                  this.relatedSearch.push({
                    priority: 'medium',
                    result: parsedData.second[i].wisdom
                  })
                }
              }
            }
            /*
            if (parsedData.third != null) {
              for (let i = 0; i < parsedData.third.length; i++) {
                if (parsedData.third[i].wisdom.uid !== this.wisdom.uid) {
                  parsedData.third[i].wisdom.t = this.formatTitle(parsedData.third[i].wisdom.t)
                  this.relatedSearch.push({
                    priority: 'low',
                    result: parsedData.third[i].wisdom
                  })
                }
              }
            }
             */
            this.relatedSearch.time = parsedData.time / 1000
          })
          .then(() => {
            setTimeout(() => {
              mermaid.init()
            }, 0)
          })
          .then(() => resolve())
          .catch((err) => {
            console.debug(err.message)
          })
      })
    },
    formatTitle: function (title) {
      if (!title || title.length < 1) return ''
      if (title.startsWith('#')) {
        let cutUntil = 0
        for (let i = 0; i < title.length; i++) {
          if (title.substring(i, i + 1) === '#') {
            cutUntil++
          }
        }
        return title.substring(cutUntil).trim()
      } else {
        return title
      }
    },
    getHumanReadableDateText: function (date, withTime = true, fullDate = false) {
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
            returnString = start.toLocaleString(DateTime.DATE_FULL) + suffix
          }
      }
      return returnString
    },
    finishQuestion: async function (wisdom, comment) {
      if (wisdom == null) return
      return new Promise((resolve) => {
        this.$Worker.execute({
          action: 'api',
          method: 'get',
          url: 'wisdom/private/accept/' + comment.uid
        })
          .then(() => {
            this.getWisdom()
          })
          .then(() => {
            this.getRelated()
          })
          .then(() => resolve())
          .catch((err) => {
            this.$notify(
              {
                title: 'Error!',
                text: 'Maybe you aren\'t the owner or a collaborator of this question?',
                type: 'error'
              })
            console.debug(err.message)
          })
      })
    },
    shareWisdom: function (wisdom) {
      if (wisdom == null) return
      navigator.clipboard.writeText('https://wikiric.netlify.app/apps/knowledge/' + wisdom.uid)
      this.$notify(
        {
          title: 'Link Copied!',
          text: '',
          type: 'info'
        })
    },
    addToTextArea: function (id, text) {
      if (text == null || text === '') return
      const textarea = document.getElementById(id)
      if (textarea == null) return
      const startPosition = textarea.selectionStart
      const endPosition = textarea.selectionEnd

      textarea.value = `${textarea.value.substring(
        0,
        startPosition
      )}${text}${textarea.value.substring(
        endPosition,
        textarea.value.length
      )}`

      this.wisDescription = textarea.value
    },
    handleUploadFileSelect: async function (evt, drop = false) {
      if (!evt) return
      evt.stopPropagation()
      evt.preventDefault()
      let files
      if (drop) {
        files = evt.dataTransfer.files
      } else {
        files = evt.target.files
      }
      this.uploadFileBase64 = await this.getBase64(files[0])
      this.uploadFileType = files[0].type
      this.uploadFileName = files[0].name
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
    cancelAddMedia: function () {
      this.isAddingMedia = false
      this.uploadFileType = ''
      this.uploadFileName = ''
      this.uploadFileBase64 = ''
    },
    uploadSnippet: function () {
      const content = JSON.stringify({
        base64: this.uploadFileBase64,
        name: this.uploadFileName
      })
      this.$Worker.execute({
        action: 'api',
        method: 'post',
        url: 'files/private/create',
        body: content
      })
        .then((data) => (this.processUploadSnippetResponse(data.result)))
        .catch((err) => (this.handleUploadSnippetError(err.message)))
    },
    handleUploadSnippetError: function (errorMessage = '') {
      console.debug(errorMessage)
      this.$notify(
        {
          title: 'File Not Uploaded',
          text: 'An Error occurred while uploading the file.',
          type: 'error'
        })
    },
    processUploadSnippetResponse: async function (response) {
      const contentURL = this.$store.state.serverIP + '/files/public/get/' + response
      let prefix
      if (this.uploadFileType.includes('image')) {
        prefix = '!'
      } else {
        prefix = '\n\n'
      }
      let filename = this.uploadFileName
      if (filename == null || filename === '') filename = 'Snippet'
      let text = prefix + '[' + filename + '](' + contentURL + ')'
      if (prefix === '!') {
        text = '\n\n' + text + '\n\n'
      }
      setTimeout(() => {
        this.addToTextArea('wisDescription', text)
        this.renderMermaid()
      }, 0)
      this.cancelAddMedia()
    },
    buildContentLinks: function () {
      this.contentLinks = new Map()
      if (!this.wisdom || !this.wisdom.desc) {
        return
      }
      const headers = [...this.wisdom.desc.matchAll(/^#+.*/gm)]
      if (headers.length < 1) {
        return
      }
      let header
      let headerLink
      let headerNumber
      let linkLevel
      // Title
      if (this.wisdom.t && this.wisdom.t !== '') {
        linkLevel = this.getLinkLevel(this.wisdom.t)
        header = this.wisdom.t.replace(/^#+/g, '')
        headerLink = this.convertToLink(header)
        this.contentLinks.set(headerLink, {
          title: header.trim(),
          link: headerLink,
          level: linkLevel,
          active: false
        })
      }
      // Description
      const counter = new Map()
      for (let i = 0; i < headers.length; i++) {
        linkLevel = this.getLinkLevel(headers[i].toString())
        header = headers[i].toString().replace(/^#+/g, '')
        headerLink = this.convertToLink(header)
        if (counter.has(headerLink)) {
          headerNumber = counter.get(headerLink)
          counter.set(headerLink, counter.get(headerLink) + 1)
          headerLink = `${headerLink}-${headerNumber}`
        } else {
          counter.set(headerLink, 1)
        }
        this.contentLinks.set(headerLink, {
          t: header.trim(),
          link: headerLink,
          level: linkLevel,
          active: false
        })
      }
      this.contentLinksArr = Array.from(this.contentLinks, function (item) {
        return item[1]
      })
    },
    convertToLink: function (header) {
      if (!header || header === '') {
        return ''
      }
      header = header.trim()
      header = header.replace(/\s+/g, '-')
      header = header.toLowerCase()
      header = encodeURIComponent(header)
      return '#' + header
    },
    /**
     * Returns the link level (# lvl 0, ## lvl 1, ### lvl 2, etc.)
     * @param {string} header
     * @returns {Array}
     */
    getLinkLevel: function (header) {
      if (!header || header === '' || typeof header !== 'string') {
        return []
      }
      const length = header.length
      const level = []
      let levelCounter = 0
      let sub
      for (let i = 0; i < length; i++) {
        sub = header.substring(i, i + 1)
        if (sub === '#') {
          levelCounter += 1
          if (levelCounter > 1) {
            level.push(' ')
          }
        } else if (sub === ' ' || sub.match(/\w/g)) {
          break
        }
      }
      if (level.length > 0) {
        level[level.length - 1] = '|'
      }
      return level
    },
    throttle: function (callback, limit = 100) {
      let waiting = false
      return function () {
        if (!waiting) {
          callback.apply(this, arguments)
          waiting = true
          setTimeout(function () {
            waiting = false
          }, limit)
        }
      }
    },
    handleScroll: function () {
      const headers = this.$refs.wisdom_content.querySelectorAll('h1, h2, h3, h4, h5, h6')
      let offsetTop
      for (let i = headers.length - 1; i >= 0; i--) {
        offsetTop = headers[i].getBoundingClientRect().top - 80
        if (offsetTop < 0) {
          if (!this.currentHeaders.has(headers[i])) {
            this.currentHeaders.set(headers[i], true)
            const tmp = this.contentLinks.get(`#${headers[i].id}`)
            if (tmp) {
              tmp.active = true
              this.contentLinks.set(`#${headers[i].id}`, tmp)
              document.getElementById(`link_#${headers[i].id}`).scrollIntoView({
                block: 'center'
              })
            }
          }
        } else {
          if (this.currentHeaders.has(headers[i])) {
            this.currentHeaders.delete(headers[i])
            const tmp = this.contentLinks.get(`#${headers[i].id}`)
            if (tmp) {
              tmp.active = false
              this.contentLinks.set(`#${headers[i].id}`, tmp)
              document.getElementById(`link_#${headers[i].id}`).scrollIntoView({
                block: 'center'
              })
            }
          }
        }
      }
    }
  }
}
</script>

<style>

.sidebar_tooltip {
  @apply absolute translate-x-12 -translate-y-12 opacity-0 font-bold pointer-events-none;
}

.sidebar_button:hover {
  @apply dark_bg;
}

.sidebar_button:hover .sidebar_tooltip {
  @apply opacity-100 py-2 px-3 rounded darkest_bg border-2 border-zinc-600 z-[800];
}

.comment .comment_react {
  @apply opacity-0;
}

.comment:hover .comment_react {
  @apply opacity-100;
}

</style>
