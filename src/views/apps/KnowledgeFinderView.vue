<template>
  <div id="knowledgeFinder"
       class="background w-full h-full relative overflow-hidden"
       :class="{'rounded-tl': isoverlay, 'rounded-tr': !isoverlay}">
    <template v-if="knowledgeExists">
      <div class="h-full w-full overflow-y-auto">
        <template v-if="!isViewingWisdom && !isViewingProcess">
          <div class="lg:flex w-full h-fit lg:h-full">
            <div id="knowledgeFinder_sidebar"
                 class="h-full overflow-hidden surface-variant z-10 bshadow
                        lg:w-[clamp(450px,33%,550px)]">
              <div class="h-full relative">
                <div class="py-1">
                  <div class="flex items-center">
                    <div v-on:click="clickedBack()"
                         class="h-full ml-2 p-2 rounded-lg
                                hover:text-orange-500 cursor-pointer flex items-center justify-center">
                      <i class="sb_link_icon bi bi-x-square text-xl"></i>
                    </div>
                    <div class="w-full overflow-x-hidden pr-2">
                      <div class="py-2 pointer-events-none">
                        <div class="text-xl border-l border-gray-300 pl-3 font-bold">
                          <p>{{ this.knowledge.t }}</p>
                        </div>
                        <div class="text-sm border-l border-gray-300 pl-3">
                          <p>{{ this.knowledge.desc }}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="py-1 px-3">
                  <div class="rounded-lg flex items-center relative">
                    <MagnifyingGlassIcon class="w-6 h-6 mx-2  absolute translate-x-1"/>
                    <input id="search-field" type="text"
                           class="fmt_input search-field py-6 pl-10 pr-4 w-full h-8
                                  surface on-surface-text bshadow"
                           placeholder="Search..."
                           v-on:keyup.enter="searchWisdom(); getProcesses()"
                           v-model="queryText">
                  </div>
                  <template class="block">
                    <div style="width: 100%; height: 35px; padding-top: 5px;
                                display: flex; position: relative; align-items: center">
                      <p class="font-bold pointer-events-none">
                        Categories
                      </p>
                      <button class="btn-no-outline"
                              style="position: absolute; right: 0"
                              title="New Category"
                              v-on:click="startAddingCategory()">
                        <i class="bi bi-plus lead orange-hover" style="font-size: 150%"></i>
                      </button>
                    </div>
                    <div class="py-2 flex items-center w-full">
                      <div class="overflow-x-hidden overflow-y-auto pb-2 w-full">
                        <template v-if="knowledge.cats && knowledge.cats.length > 0">
                          <template v-for="category in knowledge.cats" :key="category">
                            <div class="kf_category border-l-[12px]"
                                 :style="{borderColor: category.hex}">
                              <p>{{ category.t.replace(' ', '&nbsp;') }}</p>
                              <template v-if="category.count && category.count > 0">
                                <p class="ml-auto">{{ category.count }}</p>
                              </template>
                              <div class="kf_category_edit w-6 h-6 ml-auto hover:primary
                                          rounded p-1 cursor-pointer"
                                   v-on:click="editCategory(category)">
                                <PencilIcon/>
                              </div>
                            </div>
                          </template>
                        </template>
                        <template v-else>
                          <button class="w-full flex justify-center font-bold text-sm"
                                  v-on:click="startAddingCategory()">
                            <span>No Categories.</span>
                          </button>
                        </template>
                      </div>
                    </div>
                  </template>
                </div>
                <!-- QUICK VIEW -->
                <div class="p-3 lg:absolute lg:bottom-0 lg:w-full">
                  <div class="flex">
                    <button v-on:click="writeWisdom('ask')"
                            class="btn_bg_primary w-1/2">
                      <i class="bi bi-question-lg mr-2"></i>
                      <span>Ask</span>
                    </button>
                    <button v-on:click="writeWisdom('teach')"
                            class="btn_bg_primary w-1/2">
                      <i class="bi bi-lightbulb small mr-2"></i>
                      <span>Teach</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div class="lg:overflow-y-auto overflow-x-hidden h-full
                        lg:w-full">
              <TabGroup as="div" class="w-full">
                <TabList as="div" class="tab-group">
                  <Tab class="w-full" v-slot="{ selected }">
                    <button :class="[
                              'w-full',
                              selected
                              ? 'active_tab fmt_border_top'
                              : 'hover:surface',
                            ]"
                            class="tab"
                            v-on:click="tabSelection = 'knowledge'; getRecentKeywords()">
                      <span>Knowledge</span>
                    </button>
                  </Tab>
                  <Tab class="w-full" v-slot="{ selected }">
                    <button :class="[
                              'w-full',
                              selected
                              ? 'active_tab fmt_border_top'
                              : 'hover:surface',
                            ]"
                            class="tab"
                            v-on:click="tabSelection = 'processes'">
                      <span>Processes</span>
                    </button>
                  </Tab>
                </TabList>
                <TabPanels>
                  <TabPanel id="knowledge_tab" ref="knowledge_tab"
                            class="p-4">
                    <template v-if="emptyState">
                      <div class="">
                        <div class="">
                          <p class="text-xl font-bold mb-2 pointer-events-none">
                            Top Contributors
                          </p>
                          <div class="flex w-full overflow-x-auto mb-2 p-2 gap-x-4">
                            <template v-if="topWriters.contributors && topWriters.contributors.length > 0">
                              <div v-for="author in topWriters.contributors" :key="author.username"
                                   class="rounded-lg overflow-hidden surface">
                                <div class="py-2 px-3 pointer-events-none">
                                  <p class="text-xl">{{ author.name }}</p>
                                </div>
                                <div class="py-1 px-3 pointer-events-none">
                                  <div class="flex items-center">
                                    <BookOpenIcon class="h-6 w-6 mr-2"></BookOpenIcon>
                                    <p class="text-xl">{{ author.wisdomCount }}</p>
                                  </div>
                                </div>
                              </div>
                            </template>
                            <template v-else>
                              <div class="rounded-md px-3">
                                <p class="text-sm italic">
                                  No contributions have been made yet.
                                </p>
                              </div>
                            </template>
                          </div>
                        </div>
                        <div v-if="questions.length > 0" class="">
                          <div class="flex my-2 items-center">
                            <p class="text-xl font-bold pointer-events-none">
                              Recent Questions
                            </p>
                            <button class="ml-4 rounded primary-container
                                           hover:primary px-1 h-fit w-fit"
                                    v-on:click="filterQuestions()">
                              <span class="text-sm font-bold">Show all</span>
                            </button>
                          </div>
                          <div class="flex w-full overflow-x-auto gap-x-2 p-2">
                            <template v-for="task in questions" :key="task.uID">
                              <div class="w-full">
                                <div v-on:click="gotoWisdom(task.result.uid)"
                                     class="w-full rounded-lg cursor-pointer
                                            surface hover:surface-variant
                                      relative min-w-[250px] py-2 px-3">
                                  <div class="flex w-full mb-1 text-sm">
                                    <p>{{ task.name }}</p>
                                    <p class="ml-auto">
                                      {{ getHumanReadableDateText(task.result.ts, true) }}</p>
                                  </div>
                                  <div class=" pointer-events-none">
                                    <p class="font-bold text-lg">{{ task.result.t }}</p>
                                  </div>
                                  <div class=" pointer-events-none
                                        max-h-[11em] overflow-y-hidden">
                                    <div class="flex items-center">
                                      <p class="text-sm">{{ task.result.desc }}</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </template>
                          </div>
                        </div>
                        <p class="text-xl font-bold my-2 pointer-events-none">
                          Keyword Cloud
                        </p>
                        <div
                          class="flex w-[calc(100%-16px)] justify-center items-center mx-2 mt-4 p-2 surface rounded-lg">
                          <div id="d3wordcloud"></div>
                        </div>
                      </div>
                    </template>
                    <template v-if="noResults">
                      <div class="flex w-full justify-center items-center lg:mt-10">
                        <div class="surface rounded-md p-3">
                          <p class="pointer-events-none text-center">No Results for...</p>
                          <p class="text-center my-2">{{ querySubmission }}</p>
                          <p
                            class="pointer-events-none mt-3 text-center
                                   border-t border-t-gray-400 pt-3">
                            Ask a question or teach people!
                          </p>
                          <div class="mt-2">
                            <div class="flex">
                              <button v-on:click="writeWisdom('ask')"
                                      class="btn_bg_primary w-1/2">
                                <i class="bi bi-question-lg mr-2"></i>
                                <span>Ask</span>
                              </button>
                              <button v-on:click="writeWisdom('teach')"
                                      class="btn_bg_primary w-1/2">
                                <i class="bi bi-lightbulb small mr-2"></i>
                                <span>Teach</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </template>
                    <!-- RESULTS -->
                    <template v-if="results.length > 0">
                      <div>
                        <div class="flex items-center gap-x-2">
                          <div class="metaTag pointer-events-none">
                            <p class="text-xs  font-bold">
                              {{ results.length }} results in {{ results.time }} s
                            </p>
                          </div>
                          <p class="pl-1 mb-2 text-xs  font-bold">Sort by:</p>
                          <div class="metaTag cursor-pointer" :class="{active: sort.byRelevance}"
                               v-on:click="sortResults('relevance')">
                            <div class="flex items-center">
                              <FunnelIcon class="h-4 w-4 mr-1"/>
                              <p class="text-xs font-bold">
                                Relevance
                              </p>
                            </div>
                          </div>
                          <div class="metaTag cursor-pointer" :class="{active: sort.byViews}"
                               v-on:click="sortResults('views')">
                            <div class="flex items-center">
                              <EyeIcon class="h-4 w-4 mr-1"/>
                              <p class="text-xs font-bold">
                                Views
                              </p>
                            </div>
                          </div>
                        </div>
                        <template v-for="result in results" :key="result">
                          <VMenu v-on:apply-show="investigate(result.result.uid)"
                                 handle-resize eager-mount instant-move
                                 :arrow-padding="15"
                                 :distance="-15" :flip="true"
                                 :delay="500"
                                 placement="top-end">
                            <div v-on:click="gotoWisdom(result.result.uid)"
                                 class="result cursor-pointer">
                              <div class=" flex items-center text-sm">
                                <template v-if="result.priority === 'highx'">
                                  <SparklesIcon class="w-5 h-5 mr-2"></SparklesIcon>
                                </template>
                                <div class="text-sm">
                                  <p class="">
                                    {{ result.result.usr }}
                                  </p>
                                  <p class="">
                                    {{ getHumanReadableDateText(result.result.ts, true) }}
                                  </p>
                                </div>
                                <div class="pointer-events-none ml-auto flex items-center">
                                  <template v-if="result.result.type === 'lesson'">
                                    <div
                                      class="primary-container px-2 py-0.5 ml-2 min-w-[86px] rounded-md  font-bold">
                                      <p>{{ capitalizeFirstLetter(result.result.type) }}</p>
                                    </div>
                                  </template>
                                  <template v-else-if="result.result.type === 'question'">
                                    <div
                                      class="tertiary-container px-2 py-0.5 ml-2 min-w-[86px] rounded-md  font-bold">
                                      <p>{{ capitalizeFirstLetter(result.result.type) }}</p>
                                    </div>
                                  </template>
                                  <template v-else>
                                    <div class="background px-1 py-0.5 ml-2 min-w-[86px] rounded-md  font-bold">
                                      <p>{{ capitalizeFirstLetter(result.result.type) }}</p>
                                    </div>
                                  </template>
                                </div>
                              </div>
                              <div class="w-full my-2">
                                <div class="flex items-center overflow-hidden
                                     overflow-ellipsis mb-1">
                                  <template v-if="result.result.type === 'task'">
                                    <template v-if="result.result.done">
                                      <div class="px-1 py-1 rounded primary flex w-16 mr-2 items-center">
                                        <CheckIcon class="h-4 w-4 mr-1"></CheckIcon>
                                        <span class="text-xs font-bold">Done</span>
                                      </div>
                                    </template>
                                    <template v-else>
                                      <div class="px-1 py-1 rounded error flex w-16 mr-2 items-center">
                                        <Cog6ToothIcon class="h-4 w-4 mr-1"></Cog6ToothIcon>
                                        <p class="text-xs font-bold">WIP</p>
                                      </div>
                                    </template>
                                  </template>
                                  <p class="text-xl font-bold">
                                    {{ result.result.t }}
                                  </p>
                                </div>
                                <p class="break-words">{{ result.result.desc }}</p>
                              </div>
                              <div class="flex my-2 items-center">
                                <div v-if="result.result.views"
                                     class=" gray-hover flex items-center
                                            px-2 py-1 mr-1 rounded">
                                  <EyeIcon class="w-4 h-4 mr-1"></EyeIcon>
                                  <span class="font-bold text-sm">{{ result.result.views }}</span>
                                </div>
                                <template v-if="result.result && result.result.reacts">
                                  <div class="flex">
                                    <div v-for="reaction in result.result.reacts" :key="reaction.src"
                                         class=" gray-hover flex items-center
                                                px-2 py-1 mr-1 rounded"
                                         :title="reaction.src.toString() + ' reacted to this.'"
                                         :id="'react_' + result.result.uid + '_' + reaction.t">
                                      <HandThumbUpIcon v-if="reaction.t === '+'"
                                                       class="w-4 h-4 mr-1"></HandThumbUpIcon>
                                      <HandThumbDownIcon v-else-if="reaction.t === '-'"
                                                         class="w-4 h-4 mr-1"></HandThumbDownIcon>
                                      <StarIcon v-else-if="reaction.t === '⭐'"
                                                class="w-4 h-4 mr-1"></StarIcon>
                                      <span v-else> {{ reaction.t }} </span>
                                      <span class="font-bold text-sm">{{ reaction.src.length }}</span>
                                    </div>
                                  </div>
                                </template>
                              </div>
                              <div class="flex">
                                <template v-if="result.result.copyContent != null">
                                  <ClipboardIcon
                                    class="w-10 h-8 text-yellow-500 flex items-center px-2
                                           border-2 border-yellow-500 rounded-lg mr-1">
                                  </ClipboardIcon>
                                </template>
                                <template v-for="cat in result.result.cats" :key="cat">
                                  <div v-if="cat.t != null"
                                       class="wisdomCat"
                                       :style="{borderColor: cat.hex}">
                                    {{ cat.t }}
                                  </div>
                                </template>
                              </div>
                            </div>
                            <template #popper>
                              <div class="flex vpopper">
                                <div class="pl-1 pr-3">
                                  <template v-if="related && related.ref">
                                    <button class="btn_small_icon"
                                            v-on:click="gotoWisdom(related.ref.uid)">
                                      <WindowIcon
                                        class="mr-2 h-4 w-4"
                                        aria-hidden="true"
                                      />
                                      <span class="text-xs font-bold">View Source</span>
                                    </button>
                                    <template v-if="related.replies && related.replies.length > 0">
                                      <button class="btn_small_icon"
                                              v-on:click="gotoWisdom(result.result.uid)">
                                        <ChatBubbleLeftEllipsisIcon
                                          class="mr-2 h-4 w-4"
                                          aria-hidden="true"
                                        />
                                        <span class="text-xs font-bold">Comments</span>
                                      </button>
                                    </template>
                                  </template>
                                  <button class="btn_small_icon"
                                          v-on:click="searchWisdom(result.result.usr, false, 'usr')">
                                    <UserIcon
                                      class="mr-2 h-4 w-4"
                                      aria-hidden="true"
                                    />
                                    <span class="text-xs font-bold">Search Author</span>
                                  </button>
                                </div>
                                <div class="max-w-md">
                                  <template v-if="relatedLoading">
                                    <div>
                                      <p class="text-xs font-bold
                                              px-8 py-8 pointer-events-none">
                                        Loading...
                                      </p>
                                    </div>
                                  </template>
                                  <template v-else>
                                    <template v-if="related && related.ref">
                                      <div>
                                        <p class="text-xs font-bold pointer-events-none">
                                          Source Entry:
                                        </p>
                                        <div class="mt-2 p-2 surface rounded
                                                    max-w-[200px] break-all">
                                          <div class="text-sm">
                                            {{ related.ref.usr }}
                                          </div>
                                          <div class="text-lg font-bold">
                                            {{ related.ref.t }}
                                          </div>
                                          <template v-if="related.ref.desc">
                                            <div class="text-sm my-1">
                                              {{ limitTo(related.ref.desc, 100) }}
                                            </div>
                                          </template>
                                          <div class="mt-2 text-xs font-bold px-1 py-0.5
                                                    rounded surface-variant w-fit pointer-events-none">
                                            {{ capitalizeFirstLetter(related.ref.type) }}
                                          </div>
                                        </div>
                                      </div>
                                    </template>
                                    <template v-else>
                                      <div>
                                        <p class="text-xs font-bold px-3 py-2 pointer-events-none">
                                          No source.
                                        </p>
                                      </div>
                                    </template>
                                  </template>
                                </div>
                              </div>
                            </template>
                          </VMenu>
                        </template>
                      </div>
                    </template>
                  </TabPanel>
                  <TabPanel id="processes_tab" ref="processes_tab"
                            class="p-4">
                    <div class="inverse-surface rounded p-3 mb-3">
                      <div class="flex items-center">
                        <BeakerIcon class="min-w-[55px] max-w-[55px] min-h-[55px] max-h-[55px] mr-3"></BeakerIcon>
                        <div>
                          <p class="text-2xl font-bold">Experimental Feature</p>
                          <p class="text-xs max-w-xs text-justify">
                            The "Processes" feature is currently under development and may
                            change rapidly and unexpectedly.
                          </p>
                        </div>
                      </div>
                      <button v-on:click="writeProcess()"
                              class="btn_bg_primary mt-4">
                        <PlusCircleIcon class="w-6 h-6 mr-2"></PlusCircleIcon>
                        <span>Create Process</span>
                      </button>
                    </div>
                    <div class="h-full w-full">
                      <template v-if="processes.length < 1">
                        <div class="flex w-full justify-center items-center lg:mt-10">
                          <div class="surface rounded-md p-3">
                            <p class="pointer-events-none text-center">No Processes for...</p>
                            <p class="text-center my-2">{{ querySubmission }}</p>
                            <p
                              class="pointer-events-none mt-3 text-center border-t border-t-gray-400 pt-3">
                              Start a Process now!
                            </p>
                            <div class="mt-2">
                              <div class="flex">
                                <button v-on:click="writeProcess()"
                                        class="btn_bg_primary">
                                  <PlusCircleIcon class="w-6 h-6 mr-2"></PlusCircleIcon>
                                  <span>Create Process</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </template>
                      <template v-else>
                        <div class="flex items-center gap-x-2">
                          <p class="pl-1 mb-2 text-xs  font-bold">Show:</p>
                          <div class="metaTag cursor-pointer" :class="{active: sort.byRootNodes}"
                               v-on:click="sort.byAllNodes = false; sort.byRootNodes = true">
                            <div class="flex items-center">
                              <FunnelIcon class="h-4 w-4 mr-1"/>
                              <p class="text-xs font-bold">
                                Root Nodes
                              </p>
                            </div>
                          </div>
                          <div class="metaTag cursor-pointer" :class="{active: sort.byAllNodes}"
                               v-on:click="sort.byAllNodes = true; sort.byRootNodes = false">
                            <div class="flex items-center">
                              <EyeIcon class="h-4 w-4 mr-1"/>
                              <p class="text-xs font-bold">
                                All Nodes
                              </p>
                            </div>
                          </div>
                        </div>
                        <template v-for="result in processes" :key="result">
                          <div v-on:click="gotoProcess(result.uid)"
                               v-if="result.root || sort.byAllNodes"
                               class="result cursor-pointer">
                            <div class=" flex items-center text-sm">
                              <div class="text-sm">
                                <p class="">
                                  {{ result.usr }}
                                </p>
                                <p class="">
                                  {{ getHumanReadableDateText(result.ts, true) }}
                                </p>
                              </div>
                            </div>
                            <div class="w-full my-2">
                              <div class="flex items-center overflow-hidden overflow-ellipsis">
                                <p class="text-xl font-bold  mb-2">
                                  {{ result.t }}
                                </p>
                              </div>
                              <p>{{ result.desc }}</p>
                            </div>
                          </div>
                        </template>
                      </template>
                    </div>
                  </TabPanel>
                </TabPanels>
              </TabGroup>
            </div>
          </div>
        </template>
        <template v-else-if="isViewingWisdom">
          <template v-if="wisdomGUID != null && wisdomGUID !== ''">
            <wisdomviewer :isoverlay="true" :srcguid="wisdomGUID" :chatguid="srcguid"
                          @close="wisdomGUID = ''; isViewingWisdom = false; getRecentKeywords"/>
          </template>
        </template>
        <template v-else-if="isViewingProcess">
          <template v-if="processGUID != null && processGUID !== ''">
            <processviewer :isoverlay="true" :srcguid="processGUID" :chatguid="srcguid"
                           @close="processGUID = ''; isViewingProcess = false; getRecentKeywords"/>
          </template>
        </template>
      </div>
    </template>
    <template v-else>
      <template v-if="!isoverlay">
        <div class="pt_nav"></div>
      </template>
      <div class="h-full w-full background">
        <div class="px-8 pt-4 pb-8 m-8 background rounded-md dshadow max-w-screen-lg">
          <div class=" mb-5 pointer-events-none">
            <span class="text-4xl font-bold">Create new Knowledge Hub</span>
          </div>
          <form class="lg:flex lg:gap-x-4" @submit.prevent="createKnowledge()">
            <div class=" w-full lg:w-[50%]">
              <label for="title" class="text-2xl">
                <span>Title</span>
              </label>
              <br>
              <input type="text" id="title" class="fmt_input p-2 w-full text-lg"
                     required v-model="titleCreation">
              <br>
              <label for="description" class="text-2xl">
                <span>Description</span>
              </label>
              <br>
              <textarea type="text" rows="3" id="description"
                        class="fmt_input p-2 w-full text-lg"
                        v-model="descriptionCreation"></textarea>
            </div>
            <div class=" w-full lg:w-[50%]">
              <label for="keywords" class="text-2xl mr-3">
                <span>Keywords</span>
              </label>
              <span class="">Comma separated</span>
              <br>
              <input type="text" id="keywords" class="fmt_input p-2 w-full text-lg"
                     v-model="keywordsCreation">
              <br>
              <button type="submit"
                      class="mt-6 btn_bg_primary">
                <span>Create</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </template>
    <modal @close="isAddingCategory = false"
           v-show="isAddingCategory">
      <template v-slot:header>
        <span class="text-xl font-bold">Category</span>
      </template>
      <template v-slot:body>
        <div class="m-3 flex flex-col gap-1">
          <label for="new_category" class="font-bold">Name:</label>
          <input type="text" id="new_category" v-model="newCategory.t"
                 class="fmt_input"
                 v-on:keyup.enter="addCategory()">
          <label for="new_category_color" class="font-bold">Color:</label>
          <input type="color" id="new_category_color" v-model="newCategory.hex"
                 class="fmt_input"
                 v-on:keyup.enter="addCategory()">
          <button v-on:click="addCategory()"
                  class="mt-3 btn_bg_primary w-full">
            <span>Submit</span>
          </button>
          <button v-on:click="removeCategory()"
                  class="mt-3 fmt_button_danger w-full">
            <span>Remove</span>
          </button>
        </div>
      </template>
      <template v-slot:footer>
      </template>
    </modal>
    <modal @close="isWritingWisdom = false"
           v-show="isWritingWisdom">
      <template v-slot:header>
        <template v-if="isWritingLesson">
          <p>Teach</p>
        </template>
        <template v-else-if="isWritingQuestion">
          <p>Ask</p>
        </template>
      </template>
      <template v-slot:body>
        <div class="flex w-[calc(100dvw-36px)] h-[calc(100dvh-142px)] gap-x-1 px-2 pb-2 overflow-x-hidden">
          <div class="w-full md:w-1/2 relative">
            <div class="mb-1 font-bold rounded pr-2 pb-2 sticky top-0
                        w-full flex items-center justify-end background z-50">
              <button v-on:click="createLesson()"
                      class="mr-2 btn_bg_primary"
                      v-tooltip.top="{
                       content: 'Save changes'
                     }">
                <span>Submit</span>
              </button>
              <button v-on:click="isWritingWisdom = false"
                      class="mr-2 py-2 px-3 hover:dshadow rounded-md surface-variant"
                      v-tooltip.top="{
                       content: 'Discard changes'
                     }">
                <span>Cancel</span>
              </button>
            </div>
            <div class="block lg:flex w-full">
              <div class="lg:w-1/2">
                <label for="wisCategories" class="mt-2 font-bold">
                  <span>Categories:</span>
                </label>
                <br>
                <Listbox v-model="wisCategories" multiple id="wisCategories">
                  <div class="relative mt-1">
                    <ListboxButton
                      class="surface w-full relative cursor-default rounded-lg
                             py-2 pl-3 pr-10 mb-2 text-left shadow-sm focus:outline-none
                             focus-visible:border-indigo-500 focus-visible:ring-2
                             focus-visible:ring-white focus-visible:ring-opacity-75
                             focus-visible:ring-offset-2
                             focus-visible:ring-offset-orange-300 sm:text-sm"
                    >
                      <template v-if="wisCategories.length > 0">
                        <div class="block truncate font-bold">
                          <p>{{ wisCategories.map((cat) => cat.t).join(', ') }}</p>
                        </div>
                      </template>
                      <template v-else>
                        <span class="block truncate font-bold ">Select...</span>
                      </template>
                      <div
                        class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                        <ArrowsUpDownIcon class="h-5 w-5 " aria-hidden="true"/>
                      </div>
                    </ListboxButton>
                    <transition
                      leave-active-class="transition duration-100 ease-in"
                      leave-from-class="opacity-100"
                      leave-to-class="opacity-0">
                      <ListboxOptions
                        class="absolute mt-1 max-h-60 w-full overflow-auto rounded-md surface
                               py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5
                               focus:outline-none sm:text-sm z-50">
                        <ListboxOption
                          v-slot="{ active, selected }"
                          v-for="cat in knowledge.cats"
                          :key="cat"
                          :value="cat"
                          as="template">
                          <li
                            :class="[ active ? 'primary-container' : '',
                                  'relative cursor-pointer select-none py-2 pl-10 pr-4' ]">
                            <div
                              :class="[ selected ? 'font-medium' : 'font-normal', 'block truncate' ]">
                              <p class="border-l-8 pl-2 rounded-l-md"
                                 :style="{borderColor: cat.hex}">
                                {{ cat.t }}
                              </p>
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
                <label for="wisKeywords" class="mt-2 font-bold">Keywords:</label>
                <br>
                <input type="text" id="wisKeywords" v-model="wisKeywords"
                       class="fmt_input surface rounded-md py-2 px-3 mt-1 w-full">
              </div>
            </div>
            <label for="wisTitle" class="font-bold">
              <span>Title:</span>
            </label>
            <input type="text" id="wisTitle" v-model="wisTitle"
                   class="fmt_input surface rounded-md w-full py-2 px-3 mt-1 mb-2">
            <div class="flex items-center">
              <label for="wisDescription" class="font-bold">Description:</label>
              <div class="ml-2 p-1">
                <button class="btn_small_icon"
                        v-on:click="isAddingMedia = true">
                  <DocumentArrowUpIcon
                    class="h-6 w-6 mr-1"
                    aria-hidden="true"
                  />
                  <span>Add File</span>
                </button>
              </div>
            </div>
            <div class="w-full mt-1 h-full no_fmt" id="wisDescriptionEditor" ref="wisDescriptionEditor">
              <textarea type="text" id="wisDescription" v-model="wisDescription"
                        rows="20" class="fmt_input w-full surface py-2 px-3 hidden"></textarea>
            </div>
            <label for="wisCopyContent" class="text-xl mt-2 font-bold">Copy Content:</label>
            <div class="w-full overflow-hidden mt-1">
              <textarea type="text" id="wisCopyContent" v-model="wisCopyContent"
                        rows="5" class="fmt_input w-full surface py-2 px-3"></textarea>
            </div>
          </div>
          <div class="hidden md:block w-1/2">
            <div class="surface rounded-md p-2 mt-1 cursor-not-allowed fmt_border">
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
          <p class=" font-bold">{{ this.uploadFileName }}</p>
          <div class="mt-3 w-full">
            <button class="darkbutton p-2 w-full
                           flex items-center justify-center rounded-full"
                    style="height: 2.5em;
                           border-color: transparent; margin: auto"
                    title="Send"
                    v-on:click="uploadSnippet">
              <span class="font-bold flex on-primary-text">Submit</span>
              <span style="margin-left: 10px"
                    class="c_lightgray text-xs on-primary-text">
                {{ this.uploadFileType }}
              </span>
            </button>
          </div>
        </template>
      </template>
      <template v-slot:footer>
      </template>
    </modal>
    <modal @close="isWritingProcess = false"
           v-show="isWritingProcess">
      <template v-slot:header>
        Create Process
      </template>
      <template v-slot:body>
        <div class="flex min-w-[75vw] w-[50vw] lg:min-w-fit lg:w-[540px]">
          <div class="w-full">
            <label for="processTitle" class="text-xl font-bold">Title:</label>
            <br>
            <input type="text" id="processTitle" ref="processTitle" v-model="processTitle"
                   class="surface rounded-md w-full py-2 px-3">
            <br>
            <label for="processKeywords" class="text-xl mt-2 font-bold">Keywords:</label>
            <br>
            <input type="text" id="processKeywords" v-model="processKeywords"
                   class="surface rounded-md py-2 px-3 w-full">
            <br>
            <label for="processDescription" class="text-xl mt-2 font-bold">Description:</label>
            <br>
            <div class="w-full">
              <textarea type="text" id="processDescription" v-model="processDescription"
                        rows="2" class="w-full surface py-2 px-3"></textarea>
            </div>
            <div class="flex mt-2 mb-4 w-full">
              <div class="mb-3 ml-auto text-black font-bold">
                <button v-on:click="createProcess()"
                        class="mr-2 btn_bg_primary">
                  <span>Create</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template v-slot:footer>
      </template>
    </modal>
  </div>
</template>

<script>
import modal from '../../components/Modal.vue'
import wisdomviewer from '../../views/apps/KnowledgeView'
import processviewer from '../../views/apps/ProcessView'
import Markdown from 'vue3-markdown-it'
import 'highlight.js/styles/hybrid.css'
import {
  BookOpenIcon,
  ChatBubbleLeftEllipsisIcon,
  ClipboardIcon,
  DocumentArrowUpIcon,
  DocumentTextIcon,
  FolderArrowDownIcon,
  MagnifyingGlassIcon
} from '@heroicons/vue/24/outline'
import {
  ArrowsUpDownIcon,
  BeakerIcon,
  CheckIcon,
  Cog6ToothIcon,
  EyeIcon,
  FunnelIcon,
  HandThumbDownIcon,
  HandThumbUpIcon,
  PlusCircleIcon,
  SparklesIcon,
  StarIcon,
  UserIcon,
  WindowIcon,
  PencilIcon
} from '@heroicons/vue/24/solid'
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels
} from '@headlessui/vue'
import * as d3 from 'd3'
import * as d3Cloud from 'd3-cloud'
import { DateTime } from 'luxon'
import markdownItMermaid from 'markdown-it-mermaid'
import mermaid from 'mermaid'
import { dbGetDisplayName } from '@/libs/wikistore'
import { Compartment, EditorState } from '@codemirror/state'
import { basicSetup } from 'codemirror'
import { EditorView, keymap } from '@codemirror/view'
import { indentWithTab } from '@codemirror/commands'
import { markdown } from '@codemirror/lang-markdown'
import { languages } from '@codemirror/language-data'

export default {
  name: 'KnowledgeFinderView',
  props: {
    isoverlay: Boolean,
    srcguid: String
  },
  emits: ['close'],
  components: {
    DocumentArrowUpIcon,
    DocumentTextIcon,
    FolderArrowDownIcon,
    modal,
    wisdomviewer,
    processviewer,
    Markdown,
    Listbox,
    ListboxButton,
    ListboxOptions,
    ListboxOption,
    TabGroup,
    TabList,
    Tab,
    TabPanels,
    TabPanel,
    CheckIcon,
    ArrowsUpDownIcon,
    MagnifyingGlassIcon,
    ClipboardIcon,
    SparklesIcon,
    HandThumbUpIcon,
    HandThumbDownIcon,
    StarIcon,
    BookOpenIcon,
    Cog6ToothIcon,
    BeakerIcon,
    PlusCircleIcon,
    WindowIcon,
    ChatBubbleLeftEllipsisIcon,
    UserIcon,
    EyeIcon,
    FunnelIcon,
    PencilIcon
  },
  data () {
    return {
      sourceID: '',
      params: null,
      chatGUID: '',
      source: '',
      knowledgeExists: true,
      knowledge: {
        t: '',
        desc: ''
      },
      // Knowledge Creation
      titleCreation: '',
      descriptionCreation: '',
      keywordsCreation: '',
      // Wisdom Creation
      wisTitle: '',
      wisDescription: '',
      wisKeywords: '',
      wisCopyContent: '',
      wisCategories: [],
      wisGUID: '',
      // Process Creation
      processTitle: '',
      processDescription: '',
      processKeywords: '',
      // Etc.
      newCategory: {
        t: '',
        hex: ''
      },
      oldCategory: '',
      isAddingCategory: false,
      isWritingWisdom: false,
      isWritingLesson: false,
      isWritingQuestion: false,
      isEditingWisdom: false,
      isWritingProcess: false,
      queryText: '',
      querySubmission: '',
      emptyState: true,
      noResults: false,
      results: [],
      processes: [],
      topWriters: [],
      questions: [],
      isViewingWisdom: false,
      isViewingProcess: false,
      wisdomGUID: '',
      processGUID: '',
      tabSelection: 'knowledge',
      related: null,
      relatedFrom: '',
      relatedLoading: false,
      isAddingMedia: false,
      uploadFileName: '',
      uploadFileType: '',
      uploadFileBase64: '',
      sort: {
        byRelevance: true,
        byViews: false,
        byRootNodes: true,
        byAllNodes: false
      },
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
    this.initFunction()
  },
  watch: {
    srcguid: function () {
      this.initFunction()
    }
  },
  methods: {
    initFunction: async function () {
      // Get URL parameters
      // Set window height
      const mainDiv = document.getElementById('knowledgeFinder')
      if (mainDiv) {
        if (!this.isoverlay) {
          mainDiv.classList.add('pt_nav')
        } else {
          mainDiv.classList.remove('pt_nav')
        }
      }
      // Focus search field
      const input = document.getElementById('search-field')
      if (input) input.focus()
      await this.setupChatAndKnowledge()
      // Did we already search for something?
      const queryText = this.$route.query.query
      if (queryText != null) {
        this.queryText = queryText
        await this.searchWisdom()
      } else {
        await this.getRecentKeywords()
      }
      this.getTopContributors(this.sourceID)
      this.getRecentCategories()
      this.getRecentQuestions()
      this.getProcesses('.')
    },
    setupChatAndKnowledge: async function () {
      // Whose knowledge are we trying to see? Return if there is no source
      let fromChat = false
      let srcGUID = this.srcguid
      if (srcGUID == null || srcGUID === '') {
        srcGUID = this.$route.query.cguid
        this.chatGUID = srcGUID
      }
      if (srcGUID != null) {
        fromChat = true
        const chatroom = await this.getClarifierChatroom(srcGUID)
        if (chatroom != null) {
          this.source = chatroom.t
        }
      } else {
        srcGUID = this.$route.query.kguid
        if (!srcGUID) return
      }
      this.sourceID = srcGUID
      const knowledge = await this.getKnowledge(srcGUID, fromChat)
      if (knowledge != null) {
        this.knowledge = knowledge
      }
    },
    getClarifierChatroom: async function (sessionID) {
      if (!sessionID) return
      return new Promise((resolve) => {
        this.$Worker.execute({
          action: 'api',
          method: 'get',
          url: 'chat/private/get/' + sessionID
        }).then((data) => resolve(data.result))
        .catch((err) => console.debug(err.message))
      })
    },
    getKnowledge: async function (guid, fromChat = false) {
      if (!guid) return
      return new Promise((resolve) => {
        let url
        if (fromChat) {
          url = 'knowledge/private/chat/'
        } else {
          url = 'knowledge/private/get/'
        }
        this.$Worker.execute({
          action: 'api',
          method: 'get',
          url: url + guid
        }).then((data) => {
          this.knowledgeExists = true
          this.knowledge = data.result
          resolve()
        })
        .catch((err) => {
          if (err.message) this.knowledgeExists = false
        })
      })
    },
    createKnowledge: async function () {
      const payload = {
        pid: this.srcguid,
        t: this.titleCreation,
        desc: this.descriptionCreation,
        keys: this.keywordsCreation
      }
      return new Promise((resolve) => {
        this.$Worker.execute({
          action: 'api',
          method: 'post',
          url: 'knowledge/private/create',
          body: JSON.stringify(payload)
        })
        .then((data) => {
          this.knowledgeExists = true
          this.getKnowledge(data.result, false)
        })
        .then(() => resolve())
        .catch((err) => console.debug(err.message))
      })
    },
    addCategory: async function (doRemove = false, silent = false) {
      // Remove old category in case name was changed
      if (!doRemove && this.newCategory.t !== this.oldCategory) {
        const tmp = this.newCategory.t
        this.newCategory.t = this.oldCategory
        await this.addCategory(true, true)
        this.newCategory.t = tmp
      }
      return new Promise((resolve) => {
        let delPar = ''
        if (doRemove) {
          delPar = '?del=true'
        }
        this.$Worker.execute({
          action: 'api',
          method: 'post',
          url: 'knowledge/private/cats/mod/' + this.knowledge.uid + delPar,
          body: JSON.stringify(this.newCategory)
        })
        .catch((err) => console.debug(err.message))
        .finally(() => {
          if (!silent) {
            this.newCategory = ''
            this.knowledgeExists = true
            this.isAddingCategory = false
          }
          this.setupChatAndKnowledge()
          resolve()
        })
      })
    },
    removeCategory: function () {
      this.addCategory(true)
    },
    searchWisdom: async function (substitute = null, questionsOnly = false, fields = '') {
      if (!questionsOnly) {
        this.results = []
        this.emptyState = false
      }
      const original = this.querySubmission
      this.querySubmission = substitute ?? this.queryText
      if (this.querySubmission == null || this.querySubmission === '') {
        this.emptyState = true
        this.noResults = false
        const queryObj = {}
        // Keep some parameters
        if (this.$route.query.kguid) queryObj.kguid = this.$route.query.kguid
        if (this.$route.query.cguid) queryObj.cguid = this.$route.query.cguid
        if (this.$route.query.sub) queryObj.sub = this.$route.query.sub
        // Replace current router state
        this.$router.replace({
          query: queryObj
        })
        await this.getTopContributors()
        await this.getRecentKeywords()
        await this.getRecentCategories()
        await this.getRecentQuestions()
        return
      }
      const entryType = this.extractEntryType()
      const state = this.extractEntryState()
      const payload = {
        query: this.querySubmission,
        type: entryType,
        state: state,
        fields: fields
      }
      return new Promise((resolve) => {
        this.$Worker.execute({
          action: 'api',
          method: 'post',
          url: 'wisdom/private/query/' + this.knowledge.uid,
          body: JSON.stringify(payload)
        })
        .then((data) => {
          if (!questionsOnly) this.noResults = false
          let tmpNoResults = true
          const parsedData = data.result
          this.results.time = parsedData.respTime
          // Prepare category color map
          const catColors = new Map()
          if (this.knowledge.cats) {
            for (let i = 0; i < this.knowledge.cats.length; i++) {
              catColors[this.knowledge.cats[i].t] = this.knowledge.cats[i].hex
            }
          }
          // Add results to list
          if (parsedData.lessons && parsedData.lessons.length > 0) {
            tmpNoResults = false
            this.addResults(parsedData.lessons, 'lesson', questionsOnly, catColors)
          }
          if (parsedData.tasks && parsedData.tasks.length > 0) {
            tmpNoResults = false
            this.addResults(parsedData.tasks, 'task', questionsOnly, catColors)
          }
          if (parsedData.answers && parsedData.answers.length > 0) {
            tmpNoResults = false
            this.addResults(parsedData.answers, 'answer', questionsOnly, catColors)
          }
          if (parsedData.questions && parsedData.questions.length > 0) {
            tmpNoResults = false
            this.addResults(parsedData.questions, 'question', questionsOnly, catColors)
          }
          if (parsedData.replies && parsedData.replies.length > 0) {
            tmpNoResults = false
            this.addResults(parsedData.replies, 'reply', questionsOnly, catColors)
          }
          if (parsedData.boxes && parsedData.boxes.length > 0) {
            tmpNoResults = false
            this.addResults(parsedData.boxes, 'box', questionsOnly, catColors)
          }
          if (parsedData.misc && parsedData.misc.length > 0) {
            tmpNoResults = false
            this.addResults(parsedData.misc, 'misc', questionsOnly, catColors)
          }
          if (!questionsOnly) this.noResults = tmpNoResults
        })
        .then(() => resolve())
        .catch((err) => {
          console.debug(err.message)
          if (!questionsOnly) this.noResults = true
        })
        .finally(() => {
          if (this.results.length > 0) {
            if (this.sort.byRelevance) this.results.sort(this.compareRelevance)
            if (this.sort.byViews) this.results.sort(this.compareViews)
          }
          if (substitute) this.querySubmission = original
          if (!questionsOnly) {
            const queryObj = {
              query: this.querySubmission
            }
            if (this.$route.query.kguid) queryObj.kguid = this.$route.query.kguid
            if (this.$route.query.cguid) queryObj.cguid = this.$route.query.cguid
            if (this.$route.query.sub) queryObj.sub = this.$route.query.sub
            this.$router.replace({
              query: queryObj
            })
          }
        })
      })
    },
    addResults: async function (results, type, questionsOnly, catColors) {
      let entry
      for (let i = 0; i < results.length; i++) {
        results[i].t = this.formatTitle(results[i].t)
        // Replace username with display name
        let dName = await dbGetDisplayName(results[i].usr)
        if (dName == null) {
          dName = results[i].usr
        }
        // Replace category colors with knowledge category colors if present
        if (results[i].cats) {
          let clr = ''
          for (let j = 0; j < results[i].cats.length; j++) {
            clr = catColors[results[i].cats[j].t]
            if (clr && clr !== '') {
              results[i].cats[j].hex = clr
            }
          }
        }
        // Add entry to list
        entry = {
          priority: 'high',
          type: type,
          result: results[i],
          name: dName
        }
        if (type !== 'process') {
          if (questionsOnly) {
            this.questions.push(entry)
          } else {
            this.results.push(entry)
          }
        } else {
          this.processes.push(entry)
        }
      }
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
    createLesson: async function () {
      const categories = []
      for (let i = 0; i < this.wisCategories.length; i++) {
        categories.push(this.wisCategories[i])
      }
      let keywordSuffix = ''
      if (this.isWritingQuestion && !this.wisKeywords.includes('question')) {
        if (this.wisKeywords !== '') this.wisKeywords += ','
        keywordSuffix = 'question'
      }
      // Lesson (teach) or Question (ask)?
      let type = 'lesson'
      if (this.isWritingQuestion) type = 'question'
      const payload = {
        type: type,
        t: this.wisTitle,
        desc: this.wisDescription,
        pid: this.knowledge.uid,
        keys: this.wisKeywords + keywordSuffix,
        copy: this.wisCopyContent,
        cats: categories
      }
      // Create entry on the backend
      const bodyPayload = JSON.stringify(payload)
      return new Promise((resolve) => {
        this.$Worker.execute({
          action: 'api',
          method: 'post',
          url: 'wisdom/private/create',
          body: bodyPayload
        })
        .then(() => {
          this.resetWriting()
        })
        .then(() => resolve)
        .catch((err) => {
          console.debug(err.message)
          this.noResults = true
        })
      })
    },
    writeWisdom: function (type = 'lesson') {
      this.wisTitle = ''
      this.wisDescription = ''
      this.wisKeywords = ''
      this.wisCopyContent = ''
      this.wisCategories = []
      this.wisGUID = ''
      this.isWritingWisdom = true
      if (type === 'lesson' || type === 'teach') {
        this.isWritingLesson = true
        this.isWritingQuestion = false
      }
      if (type === 'question' || type === 'ask') {
        this.isWritingQuestion = true
        this.isWritingLesson = false
      }
      this.isEditingWisdom = false
      // Defaults
      this.wisTitle = this.capitalizeFirstLetter(this.queryText).trim()
      this.showDescriptionCodeMirror()
    },
    resetWriting: function () {
      this.wisTitle = ''
      this.wisDescription = ''
      this.wisKeywords = ''
      this.wisCopyContent = ''
      this.wisCategories = []
      this.wisGUID = ''
      this.isWritingWisdom = false
      this.isWritingLesson = false
      this.isWritingQuestion = false
      this.isEditingWisdom = false
    },
    capitalizeFirstLetter: function ([first, ...rest], locale = navigator.language) {
      return first === undefined ? '' : first.toLocaleUpperCase(locale) + rest.join('')
    },
    getTopContributors: async function () {
      return new Promise((resolve) => {
        this.$Worker.execute({
          action: 'api',
          method: 'get',
          url: 'wisdom/private/contributors/' + this.knowledge.uid
        })
        .then(async (data) => {
          this.topWriters = data.result
          let dName
          for (let i = 0; i < this.topWriters.contributors.length; i++) {
            dName = await dbGetDisplayName(this.topWriters.contributors[i].usr)
            if (dName == null) {
              dName = this.topWriters.contributors[i].usr
            }
            this.topWriters.contributors[i].name = dName
          }
        })
        .catch((err) => {
          console.debug(err.message)
        })
        .finally(() => resolve())
      })
    },
    gotoWisdom: function (id) {
      if (id == null) return
      if (!this.isoverlay) {
        if (this.srcguid) {
          this.$router.push('/apps/knowledge/' + id + '?src=' + this.srcguid)
        } else {
          this.$router.push('/apps/knowledge/' + id)
        }
      } else {
        this.isViewingWisdom = true
        this.wisdomGUID = id
      }
    },
    gotoProcess: function (id) {
      if (id == null) return
      if (!this.isoverlay) {
        if (this.srcguid) {
          this.$router.push('/apps/process/' + id + '?src=' + this.srcguid)
        } else if (this.chatGUID) {
          this.$router.push('/apps/process/' + id + '?cguid=' + this.chatGUID)
        } else {
          this.$router.push('/apps/process/' + id)
        }
      } else {
        this.isViewingProcess = true
        this.processGUID = id
      }
    },
    wordCloud: function (text, {
      size = group => group.length, // Given a grouping of words, returns the size factor for that word
      word = d => d, // Given an item of the data array, returns the word
      marginTop = 4, // top margin, in pixels
      marginRight = 4, // right margin, in pixels
      marginBottom = 4, // bottom margin, in pixels
      marginLeft = 4, // left margin, in pixels
      width = 600, // outer width, in pixels
      height = 300, // outer height, in pixels
      maxWords = 100, // maximum number of words to extract from the text
      fontFamily = 'Open Sans', // font family
      fontScale = 16, // base font size
      padding = 4, // amount of padding between the words (in pixels)
      rotate = 0, // a constant or function to rotate the words
      invalidation // when this promise resolves, stop the simulation
    } = {}) {
      const words = typeof text === 'string' ? text.split(/\W+/g) : Array.from(text)

      const data = d3.rollups(words, size, w => w)
      .sort(([, a], [, b]) => d3.descending(a, b))
      .slice(0, maxWords)
      .map(([key, size]) => ({
        text: word(key),
        size: size
      }))

      const svg = d3.create('svg')
      .attr('viewBox', [0, 0, width, height])
      .attr('width', width)
      .attr('font-family', fontFamily)
      .attr('text-anchor', 'middle')
      .attr('style', 'max-width: 100%; height: auto; height: intrinsic; font-weight: bold; font-style: italic;')

      const g = svg.append('g').attr('transform', `translate(${marginLeft},${marginTop})`)
      const vueInstance = this
      const cloud = d3Cloud()
      .size([width - marginLeft - marginRight, height - marginTop - marginBottom])
      .words(data)
      .padding(padding)
      .rotate(rotate)
      .font(fontFamily)
      .fontSize(d => (Math.sqrt(d.size) * fontScale))
      .on('word', ({
                     size,
                     x,
                     y,
                     rotate,
                     text
                   }) => {
        g.append('text')
        .attr('font-size', size)
        .attr('fill', 'var(--md-sys-color-on-surface)')
        .attr('transform', `translate(${x},${y}) rotate(${rotate})`)
        .text(text)
        .on('click', function () {
          vueInstance.searchWisdom(text, false, 'keys')
        })
        .attr('class', 'cursor-pointer')
        .on('mouseover', function () {
          d3.select(this).transition()
          .duration('100')
          .attr('fill', 'var(--md-sys-color-primary)')
        })
        .on('mouseout', function () {
          d3.select(this).transition()
          .duration('200')
          .attr('fill', 'var(--md-sys-color-on-surface)')
        })
      })

      cloud.start()
      invalidation && invalidation.then(() => cloud.stop())
      return svg.node()
    },
    getRecentKeywords: async function () {
      return new Promise((resolve) => {
        this.$Worker.execute({
          action: 'api',
          method: 'get',
          url: 'wisdom/private/meta/' + this.knowledge.uid + '?type=keys'
        })
        .then((data) => {
          let keywords = []
          if (data.result.keys) keywords = data.result.keys
          const svg = this.wordCloud(keywords)
          const myNode = document.getElementById('d3wordcloud')
          while (myNode.lastElementChild) {
            myNode.removeChild(myNode.lastElementChild)
          }
          myNode.appendChild(svg)
        })
        .catch((err) => {
          console.debug(err.message)
        })
        .finally(() => resolve())
      })
    },
    getRecentCategories: async function () {
      return new Promise((resolve) => {
        this.$Worker.execute({
          action: 'api',
          method: 'get',
          url: 'm7/categorylist/' + this.knowledge.uid
        })
        .then((data) => {
          if (!data.result.categories) return
          if (this.knowledge && this.knowledge.categories) {
            for (let i = 0; i < data.result.categories.length; i++) {
              const category = data.result.categories[i]
              for (let j = 0; j < this.knowledge.categories.length; j++) {
                if (this.knowledge.categories[j].category === category.category) {
                  this.knowledge.categories[j].count = category.count
                }
              }
            }
          }
        })
        .catch((err) => {
          console.debug(err.message)
        })
        .finally(() => resolve())
      })
    },
    startAddingCategory: function () {
      this.newCategory = {
        t: '',
        hex: window.getComputedStyle(document.documentElement)
        .getPropertyValue('--md-sys-color-tertiary')
      }
      this.isAddingCategory = true
      setTimeout(() => {
        const input = document.getElementById('new_category')
        input.focus()
      }, 0)
    },
    editCategory: function (category) {
      this.newCategory = category
      this.oldCategory = category.t
      this.isAddingCategory = true
      setTimeout(() => {
        const input = document.getElementById('new_category')
        input.focus()
      }, 0)
    },
    clickedBack: function () {
      if (!this.isoverlay) {
        this.$router.back()
      } else {
        this.$emit('close')
      }
    },
    getHumanReadableDateText: function (date, withTime = true) {
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
          returnString = start.toISODate() + suffix
      }
      return returnString
    },
    getRecentQuestions: async function () {
      this.questions = []
      return new Promise((resolve) => {
        this.searchWisdom('type:question state:false question', true)
        .then(() => resolve())
      })
    },
    getProcesses: async function (substitute = null) {
      this.processes = []
      return new Promise((resolve) => {
        const entryType = this.extractEntryType()
        const payload = {
          query: substitute ?? this.querySubmission,
          type: entryType
        }
        this.$Worker.execute({
          action: 'api',
          method: 'post',
          url: 'process/private/query/' + this.knowledge.uid,
          body: JSON.stringify(payload)
        })
        .then((data) => {
          // Retrieve all boxes and tasks from server response
          this.processes = data.result.processes
        })
        .then(() => resolve())
        .catch((err) => {
          console.debug(err.message)
        })
      })
    },
    writeProcess: function () {
      this.isWritingProcess = true
      this.processTitle = this.queryText.trim().replaceAll('#', '')
      setTimeout(() => {
        this.$refs.processTitle.focus()
      }, 0)
    },
    createProcess: async function () {
      if (this.processTitle.trim() === '' && this.processDescription.trim() === '' && this.processKeywords.trim() === '') {
        return
      }
      return new Promise((resolve) => {
        const payload = {
          t: this.processTitle.trim(),
          desc: this.processDescription.trim(),
          keys: this.processKeywords.trim(),
          pid: this.knowledge.uid
        }
        this.$Worker.execute({
          action: 'api',
          method: 'post',
          url: 'process/private/create',
          body: JSON.stringify(payload)
        }).then((data) => {
          this.isWritingProcess = false
          this.processTitle = ''
          this.processDescription = ''
          this.processKeywords = ''
          this.gotoProcess(data.result)
        })
        .then(() => resolve())
        .catch((err) => {
          console.debug(err.message)
        })
      })
    },
    filterQuestions: function () {
      this.searchWisdom('question type:q state:false')
    },
    investigate: function (guid) {
      if (this.relatedFrom === guid) return true
      this.relatedFrom = guid
      this.related = null
      this.relatedLoading = true
      this.$Worker.execute({
        action: 'api',
        method: 'get',
        url: 'wisdom/private/investigate/' + guid
      })
      .then((data) => {
        this.related = data.result
        this.relatedLoading = false
      })
      .finally(() => {
        return true
      })
      return true
    },
    limitTo: function (string, length) {
      if (string.length <= length) {
        return string
      } else {
        return string.substring(0, length) + '...'
      }
    },
    addToTextArea: function (id, text) {
      if (text == null || text === '') return
      const textarea = document.getElementById(id)
      if (textarea == null) return
      const startPosition = this.cm.state.selection.main.head
      const endPosition = this.cm.state.selection.main.head
      textarea.value = `${textarea.value.substring(
        0,
        startPosition
      )}${text}${textarea.value.substring(
        endPosition,
        textarea.value.length
      )}`
      this.wisDescription = textarea.value
      this.showDescriptionCodeMirror()
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
      const contentURL = this.$store.state.serverIP + '/files/public/get/' + response.trim()
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
    sortResults: function (type) {
      if (type === 'relevance') {
        this.sort.byRelevance = true
        this.sort.byViews = false
        this.results.sort(this.compareRelevance)
      } else if (type === 'views') {
        this.sort.byRelevance = false
        this.sort.byViews = true
        this.results.sort(this.compareViews)
      }
    },
    compareRelevance: function (a, b) {
      return b.result.accuracy - a.result.accuracy
    },
    compareViews: function (a, b) {
      return b.result.views - a.result.views
    },
    extractEntryType: function () {
      let entryType = ''
      // Are we looking for a specific wisdom type?
      // Extract the type using regex, looking for the pattern: "type:<userInput>"
      if (/type:\w+/g.test(this.querySubmission)) {
        // If found, extract the type by splitting away the prefix "type:"
        try {
          const entryTypeTmp = this.querySubmission.match(/type:\w+/g)[0].split(':')[1]
          entryType = entryTypeTmp
          if (entryTypeTmp === 'ask' || entryTypeTmp === 'q') entryType = 'question'
          if (entryTypeTmp === 'ans' || entryTypeTmp === 'a') entryType = 'answer'
          if (entryTypeTmp === 'teach' || entryTypeTmp === 'l') entryType = 'lesson'
          if (entryTypeTmp === 'todo' || entryTypeTmp === 't') entryType = 'task'
          if (entryTypeTmp === 'reply' || entryTypeTmp === 'c') entryType = 'reply'
          if (entryTypeTmp === 'box' || entryTypeTmp === 'b') entryType = 'box'
          if (entryTypeTmp === 'process' || entryTypeTmp === 'p') entryType = 'process'
        } catch (e) {
          console.debug(e.message)
        }
      }
      return entryType
    },
    extractEntryState: function () {
      let state = ''
      // Are we looking for a specific wisdom finished state?
      if (/state:\w+/g.test(this.querySubmission)) {
        try {
          const stateTmp = this.querySubmission.match(/state:\w+/g)[0].split(':')[1]
          state = stateTmp
          if (stateTmp === 'done' || stateTmp === 'finished' || stateTmp === 'closed') state = 'true'
          if (stateTmp === 'todo' || stateTmp === 'unfinished' || stateTmp === 'open') state = 'false'
        } catch (e) {
          console.debug(e.message)
        }
      }
      return state
    },
    showDescriptionCodeMirror: function () {
      setTimeout(() => {
        if (this.cm == null) {
          const elem = document.getElementById('wisDescriptionEditor')
          if (elem == null) {
            return
          }
          const tabSize = new Compartment()
          const updateWisDescription = EditorState.transactionExtender.of(tr => {
            if (!tr.docChanged) return null
            this.wisDescription = tr.newDoc.toString()
          })
          const state = EditorState.create({
            doc: this.wisDescription,
            extensions: [
              basicSetup,
              tabSize.of(EditorState.tabSize.of(4)),
              keymap.of([indentWithTab]),
              markdown({ codeLanguages: languages }),
              updateWisDescription,
              EditorView.lineWrapping
            ]
          })
          const view = new EditorView({
            state,
            parent: elem
          })
          if (view == null) return
          this.cm = view
        } else {
          this.cm.dispatch({
            changes: { from: 0, to: this.cm.state.doc.length, insert: this.wisDescription }
          })
        }
      }, 0)
    }
  }
}
</script>

<style>

.search-field {
  border-radius: 10px;
  resize: none;
  overflow: hidden;
  width: 100%;
}

.gray-hover:hover {
  @apply medium_bg ;
  cursor: pointer;
  border-radius: 10px;
}

.kf_category {
  @apply font-bold text-xs background cursor-default
  mb-1 flex items-center text-center px-3 rounded-md h-8;
}

.result {
  @apply mb-2 relative px-3 py-3 rounded surface;
}

.result:hover {
  @apply dshadow;
}

.tab-group {
  @apply flex w-full justify-between gap-1;
}

.tab {
  @apply p-2 w-full text-center bshadow surface-variant;
}

.active_tab {
  @apply background shadow-none;
}

.active_tab * {
  @apply font-bold;
}

.cm-editor {
  @apply w-full h-full fmt_border overflow-hidden;
  background-color: var(--md-sys-color-surface-light);
}

.kf_category_edit {
  @apply hidden;
}

.kf_category:hover .kf_category_edit {
  @apply block;
}

</style>
