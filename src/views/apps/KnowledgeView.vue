<template>
  <div id="knowledgeViewer"
       class="bg-zinc-800 w-full h-full absolute overflow-hidden rounded-tr-lg border-r-2 border-r-zinc-900">
    <div class="flex h-full w-full">
      <div id="sidebar"
           class="h-full min-w-[40px] max-w-[40px] flex flex-col items-center overflow-y-auto ml-2">
        <div class="text-neutral-400 h-full">
          <div class="sidebar_button rounded-xl">
            <div v-on:click="clickedBack()"
                 class="cursor-pointer text-red-600 hover:text-red-500 p-2 my-2">
              <XMarkIcon class="h-6 w-6"></XMarkIcon>
            </div>
            <div class="sidebar_tooltip">Exit</div>
          </div>
          <div class="my-2 border-y border-neutral-700">
            <div class="sidebar_button rounded-xl">
              <div v-on:click="reactToMessage(wisdom, '+')"
                   class="cursor-pointer hover:text-neutral-200 p-2 my-2">
                <HandThumbUpIcon class="h-6 w-6"></HandThumbUpIcon>
              </div>
              <div class="sidebar_tooltip">Upvote</div>
            </div>
            <div class="sidebar_button rounded-xl">
              <div v-on:click="reactToMessage(wisdom, '-')"
                   class="cursor-pointer hover:text-neutral-200 p-2 my-2">
                <HandThumbDownIcon class="h-6 w-6"></HandThumbDownIcon>
              </div>
              <div class="sidebar_tooltip">Downvote</div>
            </div>
            <div class="sidebar_button rounded-xl">
              <div v-on:click="reactToMessage(wisdom, '⭐')"
                   class="cursor-pointer hover:text-neutral-200 p-2 my-2">
                <StarIcon class="h-6 w-6"></StarIcon>
              </div>
              <div class="sidebar_tooltip">Wow!</div>
            </div>
          </div>
          <div v-if="wisdom.copyContent != null"
               class="sidebar_button rounded-xl">
            <div v-on:click="copy(wisdom.copyContent)"
                 class="cursor-pointer hover:text-neutral-200 p-2 my-2">
              <ClipboardIcon class="h-6 w-6"></ClipboardIcon>
            </div>
            <div class="sidebar_tooltip">QuickCopy</div>
          </div>
        </div>
      </div>
      <div id="main" class="h-full w-full flex justify-center overflow-y-auto pb-10 overflow-x-hidden mr-2 pr-1">
        <div class="h-fit w-full max-w-[1000px] px-3">
          <div id="taskstart" class="flex mb-2 items-center pt-3">
            <TagIcon class="text-neutral-400 h-5 w-5 mr-2"></TagIcon>
            <template v-if="wisdom.categories">
              <template v-for="cat in wisdom.categories" :key="cat">
                <div v-if="JSON.parse(cat).category != null"
                     class="text-neutral-400 flex items-center py-0.5 px-1.5 rounded mr-1 pointer-events-none text-sm font-bold"
                     style="border: 1px solid #424242">
                  {{ JSON.parse(cat).category }}
                </div>
              </template>
            </template>
            <template v-else>
              <div class="text-neutral-600 text-xs pointer-events-none">
                (No Categories)
              </div>
            </template>
          </div>
          <div class="text-neutral-400 mb-4 flex items-center">
            <div class="flex pointer-events-none items-center">
              <div class="mr-2 pr-2 border-r border-neutral-700 font-bold">
                <template v-if="wisdom.type === 'lesson'">
                  <div class="px-1 py-0.5 inline-flex rounded-md bg-indigo-800 text-neutral-300">
                    {{ capitalizeFirstLetter(wisdom.type) }}
                  </div>
                </template>
                <template v-else-if="wisdom.type === 'question'">
                  <div class="px-1 py-0.5 mr-1 inline-flex rounded-md bg-orange-800 text-neutral-300">
                    {{ capitalizeFirstLetter(wisdom.type) }}
                  </div>
                </template>
                <template v-else>
                  {{ capitalizeFirstLetter(wisdom.type) }}
                </template>
              </div>
              <p> {{ wisdom.author }} </p>
            </div>
            <template v-if="wisdom.reacts != null">
              <div class="flex ml-5">
                <div v-for="reaction in wisdom.reacts" :key="reaction.src"
                     class="flex items-center p-1 mr-1 text-neutral-400 cursor-pointer hover:text-white"
                     :title="JSON.parse(reaction).src.toString() + ' reacted to this.'"
                     v-on:click="reactToMessage(wisdom, JSON.parse(reaction).t)"
                     :id="'react_' + wisdom.gUID + '_' + JSON.parse(reaction).t">
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
              <div class="text-neutral-600 text-xs ml-5 pointer-events-none">
                (Unrated)
              </div>
            </template>
            <template v-if="related.comments != null">
              <div class="flex ml-4 items-center p-1 text-neutral-400 cursor-pointer hover:text-white"
                   v-on:click="gotoComments()"
                   title="Go to Comments">
                <ChatBubbleLeftEllipsisIcon class="h-6 w-6 mr-1"></ChatBubbleLeftEllipsisIcon>
                {{ related.comments.length }}
              </div>
            </template>
            <template v-else>
              <div class="text-neutral-600 text-xs ml-4 pointer-events-none">
                (No Comments)
              </div>
            </template>
          </div>
          <template v-if="wisdom.type === 'question' && wisdom.finished !== true">
            <div class="w-full">
              <div class="ml-2 my-2 p-2 border-l-4 border-l-orange-600 bg-orange-800 bg-opacity-25 text-neutral-300">
                This question is unanswered (or at least not yet confirmed)!
                <br>Help by submitting a comment, providing useful information on this topic.
              </div>
            </div>
          </template>
          <div v-if="wisdom.type === 'question' && wisdom.finished === true"
               v-on:click="gotoComments()"
               class="flex w-full items-center cursor-pointer">
            <div
              class="px-1 py-0.5 border-2 border-emerald-700 text-emerald-500 font-bold rounded-md w-fit">
              Answered
            </div>
            <div class="text-neutral-400 ml-2 text-sm">(Click to see the answer)</div>
          </div>
          <div class="flex">
            <template v-if="this.wisdom.t">
              <Markdown class="markedView text-neutral-300 font-bold"
                        :source="'# ' + wisdom.t"
                        :plugins="plugins"></Markdown>
            </template>
            <template v-else>
              <div class="text-neutral-500">(No Title)</div>
            </template>
            <div v-on:click="editWisdom(wisdom)"
                 class="p-2 cursor-pointer flex items-center text-neutral-400 w-fit ml-auto mr-1 hover:text-white">
              <PencilSquareIcon class="h-6 w-6"></PencilSquareIcon>
            </div>
          </div>
          <hr class="text-neutral-700 opacity-100 mb-3 mt-1">
          <!-- Main Content -->
          <template v-if="wisdom.desc">
            <Markdown class="markedView text-neutral-400"
                      :source="wisdom.desc"
                      :plugins="plugins"></Markdown>
          </template>
          <template v-else>
            <div class="text-neutral-500">(No Description)</div>
          </template>
          <!-- Related Tasks -->
          <div class="w-full mt-5">
            <template v-if="related.tasks">
              <Disclosure v-slot="{ open }">
                <DisclosureButton
                  class="my-2 flex w-full justify-between rounded-lg px-2 py-1 bg-zinc-700 hover:bg-zinc-600 focus:outline-none focus-visible:ring focus-visible:ring-neutral-500 focus-visible:ring-opacity-75"
                >
                  <div class="text-neutral-400 text-sm flex justify-between w-full">
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
                    <div class="w-full grid gap-y-3 gap-x-2 grid-cols-2 xl:grid-cols-3 bg-zinc-700 rounded p-2">
                      <div v-for="task in related.tasks" :key="task.uID"
                           v-on:click="fetchData(task.gUID)"
                           class="bg-zinc-900 p-2 text-neutral-400 w-full rounded cursor-pointer hover:brightness-125 relative">
                        <div class="flex w-full mb-1 text-xs text-neutral-400">
                          <p>{{ task.author }}</p>
                          <p class="ml-auto">
                            {{ getHumanReadableDateText(new Date(parseInt(task.cdate, 16) * 1000)) }}
                          </p>
                        </div>
                        <div class="text-neutral-300 py-1 pointer-events-none">
                          <p class="font-bold">{{ task.t }}</p>
                        </div>
                        <div
                          class="text-neutral-300 py-1 pointer-events-none max-h-[11em] overflow-y-hidden">
                          <div class="flex items-center">
                            <p class="text-sm">{{ task.desc }}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </DisclosurePanel>
                </transition>
              </Disclosure>
            </template>
            <template v-if="relatedSearch">
              <Disclosure v-slot="{ open }">
                <DisclosureButton
                  class="my-2 flex w-full justify-between rounded-lg px-2 py-1 bg-zinc-700 hover:bg-zinc-600 focus:outline-none focus-visible:ring focus-visible:ring-neutral-500 focus-visible:ring-opacity-75"
                >
                  <div class="text-neutral-400 text-sm flex justify-between w-full">
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
                    <div class="w-full grid gap-y-3 gap-x-2 grid-cols-2 xl:grid-cols-3 bg-zinc-700 rounded p-2">
                      <div v-for="task in relatedSearch" :key="task.uID"
                           v-on:click="fetchData(task.result.gUID)"
                           class="bg-zinc-900 p-2 text-neutral-400 w-full rounded cursor-pointer hover:brightness-125 relative">
                        <template v-if="task.priority !== 'high'">
                          <div
                            class="absolute top-0 left-0 bottom-0 right-0 bg-neutral-900 bg-opacity-50 hover:bg-opacity-0"></div>
                        </template>
                        <div class="flex w-full mb-1 text-xs text-neutral-400">
                          <template v-if="task.priority === 'high'">
                            <SparklesIcon class="w-4 h-4 mr-2 text-amber-600"></SparklesIcon>
                          </template>
                          <p>{{ task.result.author }}</p>
                          <p class="ml-auto">{{ getHumanReadableDateText(new Date(task.result.cdate)) }}</p>
                        </div>
                        <div class="text-neutral-300 py-1 pointer-events-none">
                          <p class="font-bold">{{ task.result.t }}</p>
                        </div>
                        <div
                          class="text-neutral-300 py-1 pointer-events-none max-h-[11em] overflow-y-hidden">
                          <div class="flex items-center">
                            <p class="text-sm">{{ task.result.desc }}</p>
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
              <template v-if="related.answers == null">
                <div class="flex w-full items-center justify-content-center py-4">
                  <div class="w-full text-neutral-600 pointer-events-none">
                    <CubeTransparentIcon class="h-8 w-8 mx-auto"></CubeTransparentIcon>
                    <p class="text-md font-bold italic w-fit mx-auto">No Answer</p>
                  </div>
                </div>
              </template>
              <template v-else>
                <div class="flex items-center mt-2 pt-2 mb-2 pointer-events-none">
                  <p class="text-emerald-500 text-xl font-bold">
                    Answer:
                  </p>
                </div>
                <div v-for="comment in related.answers" :key="comment.uID"
                     class="border-l-4 border-l-emerald-600 pl-4">
                  <div class="mb-2 w-full bg-neutral-800 bg-opacity-60 rounded-r-xl rounded-l-lg border-b-2
                            border-r-2 border-b-neutral-700 border-r-neutral-700 comment">
                    <div v-if="comment.reacts" class="px-2 pt-2 flex">
                      <div v-for="reaction in comment.reacts" :key="reaction.src"
                           class="flex items-center p-1 mr-1 text-neutral-400 cursor-pointer hover:text-white"
                           :title="JSON.parse(reaction).src.toString() + ' reacted to this.'"
                           v-on:click="reactToMessage(comment, JSON.parse(reaction).t)"
                           :id="'react_' + comment.gUID + '_' + JSON.parse(reaction).t">
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
                      <div class="flex text-neutral-500 ml-auto mr-2 comment_react">
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
                        class="text-neutral-400 bg-neutral-700 bg-opacity-40 rounded-br-xl rounded-tl-xl py-1 px-2 min-w-[20%] justify-content-between flex items-center">
                        <p class="text-neutral-500 text-xs mr-2">
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
                class="p-2 rounded-full hover:bg-neutral-700 text-neutral-500 hover:text-neutral-200 absolute right-0 sidebar_button cursor-pointer -translate-y-1 flex mx-1">
                <Squares2X2Icon
                  class="h-6 w-6"></Squares2X2Icon>
                <div class="ml-auto translate-y-2.5">
                  <div class="sidebar_tooltip text-neutral-400">Preview</div>
                </div>
              </div>
              <textarea type="text" id="input_comment" v-model="wisComment" rows="1"
                        class="w-[calc(100%-50px)] border-b border-zinc-500 text-neutral-300 bg-zinc-900 focus:outline-none px-2 py-1"
                        v-on:keyup="auto_grow"></textarea>
            </div>
            <label for="input_comment"
                   class="text-neutral-500">
              Write a comment
            </label>
            <template v-if="related.comments == null">
              <div class="flex w-full items-center justify-content-center py-4">
                <div class="w-full text-neutral-500 pointer-events-none">
                  <CubeTransparentIcon class="h-8 w-8 mx-auto"></CubeTransparentIcon>
                  <p class="text-md font-bold italic w-fit mx-auto">No Comments</p>
                </div>
              </div>
            </template>
            <template v-else>
              <div class="flex items-center mt-4 mb-2 pointer-events-none">
                <ChatBubbleLeftEllipsisIcon class="w-6 h-6 mr-2 text-neutral-500"></ChatBubbleLeftEllipsisIcon>
                <p class="text-neutral-400">
                  {{ related.comments.length }} {{ commentsText }}:
                </p>
              </div>
              <template v-for="comment in related.comments" :key="comment.uID">
                <div class="mb-2 w-full bg-zinc-700 bg-opacity-60 rounded-r-xl rounded-l-lg border-b-2
                            border-r-2 border-b-zinc-700 border-r-zinc-700 comment">
                  <div v-if="comment.reacts" class="px-2 pt-2 flex">
                    <div v-for="reaction in comment.reacts" :key="reaction.src"
                         class="flex items-center p-1 mr-1 text-neutral-400 cursor-pointer hover:text-white"
                         :title="JSON.parse(reaction).src.toString() + ' reacted to this.'"
                         v-on:click="reactToMessage(comment, JSON.parse(reaction).t)"
                         :id="'react_' + comment.gUID + '_' + JSON.parse(reaction).t">
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
                    <div class="flex text-neutral-500 ml-auto mr-2 comment_react">
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
                      class="text-neutral-400 bg-neutral-700 bg-opacity-40 rounded-br-xl rounded-tl-xl py-1 px-2 min-w-[20%] justify-content-between flex items-center">
                      <p class="text-neutral-500 text-xs mr-2">
                        {{ getHumanReadableDateText(comment.cdate, true) }}</p>
                      <p class="">{{ comment.author }}</p>
                    </div>
                  </div>
                </div>
                <template
                  v-if="wisdom.type === 'question' && wisdom.finished !== true && wisdom.author === this.$store.state.username">
                  <div class="mb-4 mt-1 w-full flex">
                    <button v-on:click="finishQuestion(wisdom, comment)"
                            class="text-emerald-700 hover:text-black border-2 border-emerald-700 hover:bg-emerald-700
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
        <div class="rounded-xl text-neutral-300 p-2 mr-2 mt-2 bg-zinc-700">
          <table class="border-none mb-2 pointer-events-none">
            <tr>
              <th class="text-neutral-400 text-xs pr-2">Author</th>
              <td class="text-sm">{{ wisdom.author }}</td>
            </tr>
            <tr>
              <th class="text-neutral-400 text-xs pr-2">Source</th>
              <td class="text-sm">{{ knowledge.t }}</td>
            </tr>
            <tr>
              <th class="text-neutral-400 text-xs pr-2">Date</th>
              <td class="text-sm">{{ getHumanReadableDateText(new Date(wisdom.cdate), true) }}</td>
            </tr>
          </table>
          <template v-if="!this.$store.getters.hasSeenWisdomTutorial()">
            <div id="wisdomTutorial"
                 class="rounded-xl relative my-4 text-neutral-300">
              <div class="bg-slate-700 rounded-t-xl p-2">
                <XMarkIcon v-on:click="dismissTutorial()"
                           class="h-6 w-6 absolute top-2 right-2 hover:text-white cursor-pointer hover:bg-neutral-600 rounded-xl">
                </XMarkIcon>
                <div class="font-bold ml-1">Hey!</div>
              </div>
              <div class="bg-slate-800 rounded-b-xl p-3 text-sm text-justify">
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
      <div class="flex w-[90vw]" style="max-height: 90vh">
        <div class="w-full pr-12 md:pr-0 md:w-1/2">
          <label for="wisTitle" class="text-xl font-bold">Title:</label>
          <br>
          <input type="text" id="wisTitle" v-model="wisTitle"
                 class="bg-neutral-900 rounded-xl w-full py-2 px-3">
          <br>
          <div class="block lg:flex w-full">
            <div class="lg:w-1/2">
              <label for="wisCategories" class="text-xl mt-2 font-bold">Categories:</label>
              <br>
              <Listbox v-model="wisCategories" multiple id="wisCategories">
                <div class="relative mt-1">
                  <ListboxButton
                    class="bg-neutral-900 w-full relative cursor-default rounded-lg py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm"
                  >
                    <template v-if="wisCategories.length > 0">
                      <div class="block truncate font-bold text-neutral-300">
                        {{ wisCategories.map((cat) => cat.category).join(', ') }}
                      </div>
                    </template>
                    <template v-else>
                      <span class="block truncate font-bold text-neutral-500">Select...</span>
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
                      class="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-neutral-800 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
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
            <div class="md:w-3/5 lg:ml-3">
              <label for="wisKeywords" class="text-xl mt-2 font-bold">Keywords:</label>
              <br>
              <input type="text" id="wisKeywords" v-model="wisKeywords"
                     class="bg-neutral-900 rounded-xl py-2 px-3 w-full">
            </div>
          </div>
          <label for="wisDescription" class="text-xl mt-2 font-bold">Description:</label>
          <br>
          <textarea type="text" id="wisDescription" v-model="wisDescription" rows="20"
                    class="bg-neutral-900 rounded-xl w-full py-2 px-3"></textarea>
          <br>
          <label for="wisCopyContent" class="text-xl mt-2 font-bold">Copy Content:</label>
          <br>
          <textarea type="text" id="wisCopyContent" v-model="wisCopyContent" rows="5"
                    class="bg-neutral-900 rounded-xl w-full py-2 px-3"></textarea>
        </div>
        <div class="hidden md:block w-[46%] ml-2">
          <p class="text-xl font-bold pointer-events-none">Preview:</p>
          <div class="bg-neutral-900 rounded-xl p-2 cursor-not-allowed">
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
import {
  ChatBubbleLeftEllipsisIcon,
  ClipboardIcon,
  CubeTransparentIcon,
  HandThumbDownIcon,
  HandThumbUpIcon,
  PencilSquareIcon,
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
import { ArrowsUpDownIcon, CheckIcon, ChevronUpIcon, SparklesIcon, Squares2X2Icon } from '@heroicons/vue/24/solid'

export default {
  name: 'KnowledgeView',
  props: {
    isoverlay: Boolean,
    srcguid: String,
    chatguid: String
  },
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
    SparklesIcon
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
        lessons: []
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
  emits: ['close'],
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
      const input = document.getElementById('input_comment')
      input.addEventListener('keydown', this.handleEnter, false)
      this.inputComment = document.getElementById('input_comment')
      this.auto_grow()
      // Set window height
      const mainDiv = document.getElementById('knowledgeViewer')
      if (mainDiv) {
        if (!this.isoverlay) {
          mainDiv.classList.add('pt-[60px]')
        } else {
          mainDiv.classList.remove('pt-[60px]')
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
            this.wisGUID = this.wisdom.gUID
            resolve()
          })
          .catch((err) => {
            console.error(err.message)
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
                  this.related.comments[i].cdate = new Date(
                    parseInt(this.related.comments[i].cdate, 16) * 1000)
                }
              }
              if (this.related.answers) {
                for (let i = 0; i < this.related.answers.length; i++) {
                  this.related.answers[i].cdate = new Date(
                    parseInt(this.related.answers[i].cdate, 16) * 1000)
                }
              }
            } else {
              if (data.tasks) {
                this.related.tasks = []
                for (let i = 0; i < data.tasks.length; i++) {
                  if (data.tasks[i].gUID !== this.wisdom.gUID) {
                    data.tasks[i].t = this.formatTitle(data.tasks[i].t)
                    this.related.tasks.push(data.tasks[i])
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
            console.error(err.message)
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
          url: 'm7/react/' + wisdom.gUID,
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
            console.error(err.message)
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
        knowledgeGUID: this.knowledge.gUID,
        keywords: this.wisKeywords,
        copyContent: this.wisCopyContent,
        categories: categories
      }
      const bodyPayload = JSON.stringify(payload)
      const extension = '?guid=' + this.wisGUID
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
            console.error(err.message)
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
            console.error(err.message)
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
      this.wisGUID = wisdom.gUID
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
            console.error(err.message)
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
      if (event.key === 'Enter') {
        if (event.shiftKey) return
        event.preventDefault()
        this.submitComment()
      }
    },
    submitComment: function () {
      if (!this.isWritingComment) {
        this.postComment(this.wisComment)
      } else {
        this.postComment(this.wisDescription, this.wisTitle)
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
            console.error(err.message)
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
          url: 'm7/search/' + this.knowledge.gUID,
          body: JSON.stringify(payload)
        })
          .then((data) => {
            const parsedData = data.result
            if (parsedData.first != null) {
              for (let i = 0; i < parsedData.first.length; i++) {
                if (parsedData.first[i].wisdom.gUID !== this.wisdom.gUID) {
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
                if (parsedData.second[i].wisdom.gUID !== this.wisdom.gUID) {
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
                if (parsedData.third[i].wisdom.gUID !== this.wisdom.gUID) {
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
            console.error(err.message)
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
    getHumanReadableDateText: function (date, withTime = false) {
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
    finishQuestion: async function (wisdom, comment) {
      if (wisdom == null) return
      return new Promise((resolve) => {
        this.$Worker.execute({
          action: 'api',
          method: 'get',
          url: 'm7/finish/' + wisdom.gUID + '?answer=' + comment.gUID
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
            console.error(err.message)
          })
      })
    }
  }
}
</script>

<style>

.markedView p {
  @apply mb-4;
}

.markedView a {
  @apply underline;
}

.markedView ul {
  @apply list-disc list-inside mb-2;
}

.markedView ol {
  @apply list-decimal list-inside mb-2;
}

.markedView pre {
  @apply mb-2;
}

.markedView table {
  @apply mb-4;
}

.markedView th, .markedView td {
  @apply p-2 border border-slate-700;
}

.markedView tr {
  @apply hover:bg-neutral-800;
}

.markedView h1 {
  @apply text-3xl my-8 font-bold;
}

.markedView h2 {
  @apply text-2xl my-6 font-bold;
}

.markedView h3 {
  @apply text-xl my-4 font-bold;
}

.markedView h4 {
  @apply text-xl my-2 font-bold;
}

.markedView h5 {
  @apply text-lg my-2 font-bold;
}

.markedView h6 {
  @apply text-lg my-1 font-bold;
}

.markedView p code {
  @apply py-0.5 px-1 rounded-md mx-1 font-bold bg-neutral-700 text-neutral-400 my-2;
}

.markedView hr {
  @apply my-6 h-[4px] w-full;
}

.markedView > :last-child {
  @apply mb-0 !important;
}

.markedView > :first-child {
  @apply mt-0 !important;
}

.sidebar_tooltip {
  @apply absolute translate-x-12 -translate-y-12 opacity-0 font-bold pointer-events-none;
}

.sidebar_button:hover {
  @apply bg-neutral-700;
}

.sidebar_button:hover .sidebar_tooltip {
  @apply opacity-100 py-2 px-3 rounded bg-neutral-800;
}

.comment .comment_react {
  @apply opacity-0;
}

.comment:hover .comment_react {
  @apply opacity-100;
}

</style>
