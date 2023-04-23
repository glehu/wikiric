<template>
  <div id="knowledgeViewer" ref="knowledgeViewer"
       class="bright_bg w-full h-full relative overflow-hidden rounded-tr-lg">
    <div class="flex h-full w-full">
      <div id="sidebar"
           class="h-full min-w-[40px] max-w-[40px] flex flex-col
                  items-center overflow-y-auto ml-2">
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
      <div id="main"
           class="h-full w-full flex justify-center overflow-y-auto pb-10
                  overflow-x-hidden mr-2 pr-1">
        <div class="h-fit w-full max-w-[1000px] px-3">
          <div id="taskstart" class="flex mb-2 items-center pt-3">
            <TagIcon class="text-neutral-300 h-5 w-5 mr-2"></TagIcon>
            <template v-if="wisdom.categories && wisdom.categories.length > 0">
              <template v-for="cat in wisdom.categories" :key="cat">
                <div v-if="JSON.parse(cat).category != null"
                     class="text-neutral-400 border-[1px] border-zinc-600 flex items-center
                            py-0.5 px-1 rounded mr-1 mb-1 pointer-events-none text-sm darkest_bg">
                  {{ JSON.parse(cat).category }}
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
                <template v-if="wisdom.finished">
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
              <template v-if="wisdom.reacts && wisdom.reacts.length > 0">
                <div class="flex">
                  <div v-for="reaction in wisdom.reacts" :key="reaction.src"
                       class="flex items-center p-1 mr-1 text-neutral-300 cursor-pointer hover:text-white"
                       :title="JSON.parse(reaction).src.toString() + ' reacted to this.'"
                       v-on:click="reactToMessage(wisdom, JSON.parse(reaction).t)"
                       :id="'react_' + wisdom.guid + '_' + JSON.parse(reaction).t">
                    <HandThumbUpIcon v-if="JSON.parse(reaction).t === '+'"
                                     class="w-6 h-6 mr-1"></HandThumbUpIcon>
                    <HandThumbDownIcon v-else-if="JSON.parse(reaction).t === '-'"
                                       class="w-6 h-6 mr-1"></HandThumbDownIcon>
                    <StarIcon v-else-if="JSON.parse(reaction).t === '⭐'"
                              class="w-6 h-6 mr-1"></StarIcon>
                    <span v-else> {{ JSON.parse(reaction).t }} </span>
                    {{ JSON.parse(reaction).src.length }}
                  </div>
                </div>
              </template>
              <template v-else>
                <div class="text-neutral-400 text-xs pointer-events-none">
                  (Unrated)
                </div>
              </template>
              <template v-if="related.comments && related.comments.length > 0">
                <div class="flex items-center p-1 text-neutral-300 cursor-pointer hover:text-white"
                     v-on:click="gotoComments()"
                     title="Go to Comments">
                  <ChatBubbleLeftEllipsisIcon class="h-6 w-6 mr-1"></ChatBubbleLeftEllipsisIcon>
                  {{ related.comments.length }}
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
            <p class="m-0 text-neutral-200">{{ wisdom.author }}</p>
            <p class="m-0 text-sm text-neutral-300">
              {{ getHumanReadableDateText(wisdom.cdate, true, true) }}
            </p>
          </div>
          <template v-if="wisdom.type === 'question' && wisdom.finished !== true">
            <div class="w-full">
              <p class="mt-2 mb-4 p-2 border-l-4 border-l-orange-600 bg-orange-800 bg-opacity-50 text-neutral-300">
                This question is unanswered (or at least not yet confirmed)!
                <br>Help by submitting a comment, providing useful information on this topic.
              </p>
            </div>
          </template>
          <div v-if="wisdom.type === 'question' && wisdom.finished === true"
               v-on:click="gotoComments()"
               class="flex w-full items-center cursor-pointer my-2">
            <p
              class="px-1 py-0.5 border-2 border-emerald-600 text-neutral-200 bg-emerald-900
                     font-bold rounded-md w-fit">
              Answered
            </p>
            <div class="text-neutral-400 ml-2 text-xs">(Click to scroll to the answer)</div>
          </div>
          <template v-if="related.srcWisdom">
            <div class="text-neutral-400 border-l-8 border-l-zinc-800">
              <div class="w-fit rounded-tr-md dark_bg py-1 pr-2">
                <p class="text-xs font-bold text-neutral-300 pointer-events-none">
                  Source Entry:
                </p>
              </div>
              <div class="my-2 ml-2 p-2 medium_bg rounded">
                <template v-if="related.srcWisdom.t && related.srcWisdom.t.length > 0">
                  <Markdown class="markedView"
                            :source="'# ' + related.srcWisdom.t"
                            :plugins="plugins"></Markdown>
                </template>
                <template v-else>
                  <Markdown v-if="related.srcWisdom.desc && related.srcWisdom.desc.length > 0"
                            class="markedView"
                            :source="related.srcWisdom.desc.substring(0, 100)"
                            :plugins="plugins"></Markdown>
                </template>
                <Disclosure v-slot="{ open }" v-if="related.srcWisdom.desc && related.srcWisdom.desc.length > 0">
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
                                  :source="related.srcWisdom.desc"
                                  :plugins="plugins"></Markdown>
                      </div>
                    </DisclosurePanel>
                  </transition>
                </Disclosure>
              </div>
              <div class="w-fit rounded-tr-md dark_bg py-1 pr-2">
                <p class="text-xs text-neutral-300 font-bold pointer-events-none">
                  Reply to {{ related.srcWisdom.author }}:
                </p>
              </div>
            </div>
          </template>
          <div class="medium_bg p-2 rounded-tr rounded-b">
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
                   class="p-2 cursor-pointer flex items-center text-neutral-400 w-fit ml-auto mr-1 hover:text-white">
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
                           v-on:click="fetchData(task.guid)"
                           class="medium_bg p-2 text-neutral-400 w-full rounded cursor-pointer hover:brightness-125 relative">
                        <div class="flex w-full mb-1 text-xs text-neutral-400">
                          <p>{{ task.author }}</p>
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
                        <template v-if="task.finished">
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
                           v-on:click="fetchData(task.result.guid)"
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
                            <p>{{ task.result.author }}</p>
                            <p class="text-neutral-400">{{ getHumanReadableDateText(task.result.cdate) }}</p>
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
                           :title="JSON.parse(reaction).src.toString() + ' reacted to this.'"
                           v-on:click="reactToMessage(comment, JSON.parse(reaction).t)"
                           :id="'react_' + comment.guid + '_' + JSON.parse(reaction).t">
                        <HandThumbUpIcon v-if="JSON.parse(reaction).t === '+'"
                                         class="w-6 h-6 mr-1"></HandThumbUpIcon>
                        <HandThumbDownIcon v-else-if="JSON.parse(reaction).t === '-'"
                                           class="w-6 h-6 mr-1"></HandThumbDownIcon>
                        <StarIcon v-else-if="JSON.parse(reaction).t === '⭐'"
                                  class="w-6 h-6 mr-1"></StarIcon>
                        <span v-else> {{ JSON.parse(reaction).t }} </span>
                        {{ JSON.parse(reaction).src.length }}
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
                          {{ getHumanReadableDateText(comment.cdate, true) }}</p>
                        <p class="">{{ comment.author }}</p>
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
            <template v-if="!related.comments || related.comments.length < 1">
              <div class="flex w-full items-center justify-center py-4">
                <div class="w-full text-neutral-400 pointer-events-none">
                  <CubeTransparentIcon class="h-8 w-8 mx-auto"></CubeTransparentIcon>
                  <p class="text-md font-bold italic w-fit mx-auto text-neutral-400">No Comments</p>
                </div>
              </div>
            </template>
            <template v-else>
              <div class="flex items-center mt-8 mb-2 pointer-events-none">
                <ChatBubbleLeftEllipsisIcon class="w-6 h-6 mr-2 text-neutral-300"></ChatBubbleLeftEllipsisIcon>
                <p class="text-neutral-300">
                  {{ related.comments.length }} {{ commentsText }}:
                </p>
              </div>
              <template v-for="comment in related.comments" :key="comment.uID">
                <div class="mb-2 w-full medium_bg rounded-r-xl rounded-l-lg border-b-2
                            border-r-2 border-b-zinc-500 border-r-zinc-500 comment">
                  <div v-if="comment.reacts" class="px-2 pt-2 flex">
                    <div v-for="reaction in comment.reacts" :key="reaction.src"
                         class="flex items-center p-1 mr-1 text-neutral-400 cursor-pointer hover:text-white"
                         :title="JSON.parse(reaction).src.toString() + ' reacted to this.'"
                         v-on:click="reactToMessage(comment, JSON.parse(reaction).t)"
                         :id="'react_' + comment.guid + '_' + JSON.parse(reaction).t">
                      <HandThumbUpIcon v-if="JSON.parse(reaction).t === '+'"
                                       class="w-6 h-6 mr-1"></HandThumbUpIcon>
                      <HandThumbDownIcon v-else-if="JSON.parse(reaction).t === '-'"
                                         class="w-6 h-6 mr-1"></HandThumbDownIcon>
                      <StarIcon v-else-if="JSON.parse(reaction).t === '⭐'"
                                class="w-6 h-6 mr-1"></StarIcon>
                      <span v-else> {{ JSON.parse(reaction).t }} </span>
                      {{ JSON.parse(reaction).src.length }}
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
                        {{ getHumanReadableDateText(comment.cdate, true) }}</p>
                      <p class="text-sm">{{ comment.author }}</p>
                    </div>
                  </div>
                </div>
                <template
                  v-if="wisdom.type === 'question' && wisdom.finished !== true && wisdom.author === $store.state.username">
                  <div class="mb-4 mt-1 w-full flex">
                    <button v-on:click="finishQuestion(wisdom, comment)"
                            class="text-emerald-500 hover:text-black border-2 border-emerald-500 hover:bg-emerald-700
                                   rounded-lg px-1 py-0.5 font-bold ml-auto transition-colors">
                      Mark as Answer
                    </button>
                  </div>
                </template>
              </template>
            </template>
          </div>
        </div>
      </div>
      <div id="rightbar"
           class="h-full w-[350px] overflow-y-auto hidden xl:block">
        <div class="rounded-l-xl text-neutral-300 p-2 mt-2 dark_bg">
          <div class="border-none mb-2 pointer-events-none">
            <div class="text-neutral-400 text-xs pr-2 font-bold">Author</div>
            <div class="text-sm mb-2">{{ wisdom.author }}</div>
            <div class="text-neutral-400 text-xs pr-2 font-bold">Source</div>
            <div class="text-sm mb-2">{{ knowledge.t }}</div>
            <div class="text-neutral-400 text-xs pr-2 font-bold">Date</div>
            <div class="text-sm">{{ getHumanReadableDateText(wisdom.cdate, true, true) }}</div>
          </div>
          <template v-if="!$store.getters.hasSeenWisdomTutorial()">
            <div id="wisdomTutorial"
                 class="rounded-xl relative my-4 text-neutral-300">
              <div class="bg-neutral-700 rounded-t-xl p-2">
                <XMarkIcon v-on:click="dismissTutorial()"
                           class="h-6 w-6 absolute top-2 right-2 hover:text-white cursor-pointer hover:bright_bg rounded-xl">
                </XMarkIcon>
                <div class="font-bold ml-1">Hey!</div>
              </div>
              <div class="bg-neutral-800 rounded-b-xl p-3 text-sm text-justify">
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
      <div class="flex w-[90dvw] max-h-[90dvh] gap-x-4 px-2">
        <div class="w-full md:w-1/2">
          <label for="wisTitle" class="text-xl font-bold">Title:</label>
          <br>
          <input type="text" id="wisTitle" v-model="wisTitle"
                 class="medium_bg rounded-md w-full py-2 px-3 text-neutral-200">
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
                     class="medium_bg rounded-md py-2 px-3 w-full text-neutral-200">
            </div>
          </div>
          <label for="wisDescription" class="text-xl mt-2 font-bold">Description:</label>
          <br>
          <div class="w-full">
            <textarea type="text" id="wisDescription" v-model="wisDescription"
                      rows="20" class="w-full medium_bg py-2 px-3 text-neutral-200"></textarea>
          </div>
          <br>
          <div class="block md:hidden flex mt-2 w-full">
            <div class="mb-3 ml-auto text-black font-bold">
              <button v-on:click="editLesson()"
                      class="mr-2 py-2 px-5 border-2 border-gray-300 rounded-lg
                             bg-gray-200 hover:bg-gray-400">
                Submit
              </button>
              <button v-on:click="deleteLesson()"
                      class="py-2 px-3 border-2 border-red-700 rounded-lg bg-red-700 hover:bg-red-900">
                Delete
              </button>
            </div>
          </div>
          <br>
          <label for="wisCopyContent" class="text-xl mt-2 font-bold">Copy Content:</label>
          <br>
          <div class="rounded-md w-full overflow-hidden">
            <textarea type="text" id="wisCopyContent" v-model="wisCopyContent"
                      rows="5" class="w-full medium_bg py-2 px-3"></textarea>
          </div>
        </div>
        <div class="hidden md:block w-1/2">
          <p class="text-xl font-bold pointer-events-none">Preview:</p>
          <div class="medium_bg rounded-md p-2 cursor-not-allowed">
            <Markdown :source="'# ' + wisTitle" class="w-full markedView" :plugins="plugins"></Markdown>
            <Markdown :source="wisDescription" class="w-full mt-4 markedView" :plugins="plugins"></Markdown>
          </div>
          <div class="flex mt-2 mb-4 w-full">
            <div class="mb-3 ml-auto text-black font-bold">
              <button v-on:click="editLesson()"
                      class="mr-2 py-2 px-5 border-2 border-gray-300 rounded-lg bg-gray-200 hover:bg-gray-400">
                Submit
              </button>
              <button v-on:click="deleteLesson()"
                      class="py-2 px-3 border-2 border-red-700 rounded-lg bg-red-700 hover:bg-red-900">
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
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
  HandThumbDownIcon,
  HandThumbUpIcon,
  PencilSquareIcon,
  ShareIcon,
  StarIcon,
  TagIcon,
  XMarkIcon
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

export default {
  name: 'KnowledgeView',
  props: {
    isoverlay: Boolean,
    srcguid: String,
    chatguid: String
  },
  emits: ['close'],
  components: {
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
    Cog6ToothIcon
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
      if (this.related.comments != null) {
        if (this.related.comments.length > 1) {
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
        await this.getRelated(this.wisdom.srcWisdomUID + '?type=uid', true)
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
          url: 'm7/learn/' + guid
        })
          .then((data) => {
            this.wisdom = data.result
            // Cut away all hashtags and whitespace at the front
            this.wisdom.t = this.formatTitle(this.wisdom.t)
            this.wisGUID = this.wisdom.guid
            resolve()
          })
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
          url: 'm7/investigate/' + guid
        })
          .then((data) => {
            if (!onlyTasks) {
              this.related = data.result
              if (this.related.comments) {
                for (let i = 0; i < this.related.comments.length; i++) {
                  this.related.comments[i].cdate = DateTime.fromISO(this.related.comments[i].cdate)
                }
              }
              if (this.related.answers) {
                for (let i = 0; i < this.related.answers.length; i++) {
                  this.related.answers[i].cdate = DateTime.fromISO(this.related.answers[i].cdate)
                }
              }
              if (this.related.srcWisdom) {
                this.related.srcWisdom.cdate = DateTime.fromISO(this.related.srcWisdom.cdate)
              }
            } else {
              if (data.result.tasks) {
                this.related.tasks = []
                for (let i = 0; i < data.result.tasks.length; i++) {
                  if (data.result.tasks[i].guid !== this.wisdom.guid) {
                    data.result.tasks[i].t = this.formatTitle(data.result.tasks[i].t)
                    data.result.tasks[i].cdate = DateTime.fromISO(data.result.tasks[i].cdate)
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
        src: [],
        t: t
      })
      return new Promise((resolve) => {
        this.$Worker.execute({
          action: 'api',
          method: 'post',
          url: 'm7/react/' + wisdom.guid,
          body: payload
        })
          .then(() => {
            this.getWisdom()
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
        categories.push(JSON.stringify(this.wisCategories[i]))
      }
      const payload = {
        title: this.wisTitle,
        description: this.wisDescription,
        knowledgeGUID: this.knowledge.guid,
        keywords: this.wisKeywords,
        copyContent: this.wisCopyContent,
        categories: categories
      }
      const bodyPayload = JSON.stringify(payload)
      const extension = '?guid=' + this.wisGUID + '&mode=edit'
      return new Promise((resolve) => {
        this.$Worker.execute({
          action: 'api',
          method: 'post',
          url: 'm7/teach' + extension,
          body: bodyPayload
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
          url: 'm7/delete/' + this.wisGUID
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
      this.wisKeywords = wisdom.keywords
      if (wisdom.categories != null && wisdom.categories.length > 0) {
        for (let i = 0; i < wisdom.categories.length; i++) {
          this.wisCategories.push(JSON.parse(wisdom.categories[i]))
        }
      }
      this.wisCopyContent = wisdom.copyContent
      this.wisGUID = wisdom.guid
      this.renderMermaid()
    },
    getKnowledge: async function (sessionID) {
      return new Promise((resolve) => {
        this.$Worker.execute({
          action: 'api',
          method: 'get',
          url: 'm7/get?src=' + sessionID + '&from=clarifier'
        })
          .then((data) => {
            this.knowledge = data.result
            if (this.knowledge.categories != null) {
              for (let i = 0; i < this.knowledge.categories.length; i++) {
                this.knowledge.categories[i] = JSON.parse(this.knowledge.categories[i])
              }
            }
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
        title: title,
        description: comment.trim(),
        wisdomGUID: this.wisGUID,
        keywords: ''
      }
      const bodyPayload = JSON.stringify(payload)
      return new Promise((resolve) => {
        this.$Worker.execute({
          action: 'api',
          method: 'post',
          url: 'm7/reply',
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
              this.getRelated(this.wisdom.srcWisdomUID + '?type=uid', true)
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
        entryType: entryType
      }
      return new Promise((resolve) => {
        this.$Worker.execute({
          action: 'api',
          method: 'post',
          url: 'm7/search/' + this.knowledge.guid,
          body: JSON.stringify(payload)
        })
          .then((data) => {
            const parsedData = data.result
            if (parsedData.first != null) {
              for (let i = 0; i < parsedData.first.length; i++) {
                if (parsedData.first[i].wisdom.guid !== this.wisdom.guid) {
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
                if (parsedData.second[i].wisdom.guid !== this.wisdom.guid) {
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
                if (parsedData.third[i].wisdom.guid !== this.wisdom.guid) {
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
          url: 'm7/finish/' + wisdom.guid + '?answer=' + comment.guid
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
      navigator.clipboard.writeText('https://wikiric.netlify.app/apps/knowledge/' + wisdom.guid)
      this.$notify(
        {
          title: 'Link Copied!',
          text: '',
          type: 'info'
        })
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
