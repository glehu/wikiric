<template>
  <template v-if="knowledgeExists">
    <div class="flex w-full h-full pt-[55px]">
      <div id="sidebar"
           class="active h-[calc(100dvh-55px)] p_sidebar_left bright_bg border-r border-zinc-600 relative">
        <div class="w-full h-[calc(100%-20px)] relative">
          <div class="grid grid-cols-2 m-2 h-[42px]">
            <div class="flex items-center cursor-pointer hover:darkest_bg hover:bg-opacity-50 p-2 rounded-md"
                 v-on:click="$router.back()">
              <div class="h-full mr-2 px-1 rounded-xl text-neutral-300">
                <i class="sb_link_icon bi bi-x-square text-xl"></i>
              </div>
              <div class="font-bold text-neutral-300">
                Exit
              </div>
            </div>
            <div class="flex items-center cursor-pointer hover:darkest_bg hover:bg-opacity-50 p-2 rounded-md"
                 v-on:click="toggleSidebar()">
              <div class="h-full mr-2 px-1 rounded-xl text-neutral-300">
                <i class="sb_link_icon bi bi-caret-left text-xl"></i>
              </div>
              <div class="font-bold text-neutral-300">
                Collapse
              </div>
            </div>
          </div>
          <template v-if="calendarOptions">
            <FullCalendar ref="fullCalendar"
                          :options="calendarOptions"
                          class="w-[calc(100%-20px)] h-[calc(100%-64px)] text-neutral-300"/>
          </template>
        </div>
        <div
          class="p_sidebar_toggler absolute w-6 right-0 top-0 bottom-0 hover:brightest_bg cursor-pointer flex items-center justify-center overflow-hidden"
          v-on:click="toggleSidebar()">
        </div>
      </div>
      <div class="darkest_bg w-[calc(100%-42px)] h-full overflow-hidden">
        <div class="flex m-2 h-[42px] gap-xl-4">
          <div class="flex items-center cursor-pointer hover:dark_bg p-2 rounded-md"
               v-on:click="$router.back()">
            <div class="h-full mr-3 px-1 rounded-xl text-neutral-300 flex items-center">
              <i class="sb_link_icon bi bi-x-square text-xl"></i>
            </div>
            <div class="font-bold text-neutral-300">
              Exit
            </div>
          </div>
          <div class="flex items-center cursor-pointer hover:dark_bg p-2 rounded-md"
               v-on:click="getBoxes()">
            <div class="h-full mr-2 px-1 rounded-xl text-neutral-300">
              <ArrowPathIcon class="h-6 w-6"></ArrowPathIcon>
            </div>
            <div class="font-bold text-neutral-300">
              Reload
            </div>
          </div>
          <div class="flex items-center cursor-pointer hover:dark_bg p-2 rounded-md"
               v-on:click="openSearch()">
            <div class="h-full mr-2 px-1 rounded-xl text-neutral-300">
              <FunnelIcon class="h-6 w-6"></FunnelIcon>
            </div>
            <div class="font-bold text-neutral-300">
              Filter
            </div>
          </div>
          <div class="flex items-center cursor-pointer hover:dark_bg p-2 rounded-md"
               v-on:click="isListView = !isListView">
            <div class="h-full mr-2 px-1 rounded-xl text-neutral-300">
              <template v-if="!isListView">
                <ListBulletIcon class="h-6 w-6"></ListBulletIcon>
              </template>
              <template v-else>
                <ViewColumnsIcon class="h-6 w-6"></ViewColumnsIcon>
              </template>
            </div>
            <div class="font-bold text-neutral-300">
              <template v-if="!isListView">
                List
              </template>
              <template v-else>
                Board
              </template>
            </div>
          </div>
          <div class="pl-4 ml-4 border-l-[2px] border-l-neutral-500"></div>
          <div class="flex items-center cursor-pointer hover:dark_bg rounded-md p-2"
               v-on:click="getBoxes(false, true)">
            <input type="checkbox" id="input_show_unfinished" ref="input_show_unfinished" class="mr-2 cursor-pointer">
            <label for="input_show_unfinished" class="font-bold text-neutral-300 cursor-pointer">Show All</label>
          </div>
        </div>
        <template v-if="!isListView">
          <div id="board"
               class="h-full w-full flex p-1 overflow-x-auto overflow-y-auto fixed prevent-select">
            <template v-if="boxes.length > 0">
              <template v-for="box in boxes" :key="box.box.uid">
                <div class="p_card box_container" style="margin-bottom: 312px !important"
                     :ref="'boxcontainer_' + box.box.uid" :id="'boxcontainer_' + box.box.uid">
                  <div class="p_card_header_section relative text-neutral-300 flex items-center p-2">
                    <Markdown class="p_markdown p_markdown_xl_only font-bold"
                              :source="box.box.t"
                              :plugins="plugins"></Markdown>
                    <div class="ml-auto absolute top-0 right-0 h-full flex items-center">
                      <template v-if="box.tasks">
                        <div class="ml-auto pl-2 font-bold flex items-center cursor-default"
                             :title="'Tasks: ' + box.tasks.length">
                          <InboxIcon class="h-4 w-4 mr-1"></InboxIcon>
                          <p>{{ box.tasks.length }}</p>
                        </div>
                      </template>
                      <Menu as="div" class="relative inline-block text-left">
                        <MenuButton
                          title="Options"
                          class="hover:darkest_bg p-1 ml-2 bg-opacity-50 rounded flex items-center cursor-pointer">
                          <EllipsisVerticalIcon class="h-5 w-5"></EllipsisVerticalIcon>
                        </MenuButton>
                        <transition
                          enter-active-class="transition duration-100 ease-out"
                          enter-from-class="transform scale-95 opacity-0"
                          enter-to-class="transform scale-100 opacity-100"
                          leave-active-class="transition duration-75 ease-in"
                          leave-from-class="transform scale-100 opacity-100"
                          leave-to-class="transform scale-95 opacity-0"
                        >
                          <MenuItems
                            class="p_card_menu_list_medium_p bg-zinc-100"
                          >
                            <div class="px-1 py-1">
                              <MenuItem v-slot="{ active }">
                                <button v-on:click="finishTask(box.box, true)"
                                        :class="[active ? 'p_card_menu_active' : 'text-neutral-900','group p_card_menu_item']">
                                  <TrashIcon
                                    :active="active"
                                    class="mr-2 h-5 w-5"
                                    aria-hidden="true"
                                  />
                                  Delete
                                </button>
                              </MenuItem>
                            </div>
                            <div class="px-1 py-1">
                              <MenuItem v-slot="{ active }">
                                <button
                                  :class="[active ? 'p_card_menu_active' : 'text-neutral-900','group p_card_menu_item']">
                                  <ArrowsPointingOutIcon
                                    :active="active"
                                    class="mr-2 h-5 w-5"
                                    aria-hidden="true"
                                  />
                                  Move
                                </button>
                              </MenuItem>
                            </div>
                          </MenuItems>
                        </transition>
                      </Menu>
                    </div>
                  </div>
                  <div v-if="box.tasks"
                       :id="'box_tasks_guid_' + box.box.uid"
                       :ref="'box_tasks_guid_' + box.box.uid"
                       class="mb-4">
                    <draggable
                      :list="box.tasks"
                      v-bind="dragOptions"
                      @start="drag=true"
                      @end="endDrag"
                      @change="handleDragChange"
                      @move="handleDragMove"
                      ghostClass="ghost"
                      tag="transition-group"
                      filter=".notagger"
                      fallbackTolerance="5"
                      forceFallback="true"
                      fallbackClass="chosen"
                      :component-data="{
                        tag: 'div',
                        type: 'transition-group',
                        name: !drag ? 'flip-list' : null
                      }"
                      item-key="order">
                      <template v-if="drag && box.tasks.length < 1" #header>
                        <div class="m-2 p-2 rounded-md darkest_bg text-center">
                          <span>Drag Here!</span>
                        </div>
                      </template>
                      <template #item="{element}">
                        <div :key="element.uid" class="p-1 task_container"
                             :ref="'taskcontainer_' + element.uid" :id="'taskcontainer_' + element.uid">
                          <div :ref="'task_' + element.uid" :id="'task_' + element.uid"
                               class="p_task">
                            <div class="w-full h-full rounded py-1 px-1" v-on:click="openTask(element)">
                              <template v-if="element.due && element.due !== ''">
                                <div class="due_date">
                                  <CalendarIcon class="w-4 h-4 mr-1"></CalendarIcon>
                                  <div class="text-end">
                                    <p class="text-xs font-bold">
                                      Due {{ getHumanReadableDateText(element.due) }}
                                    </p>
                                    <template v-if="element.duet && element.duet !== ''">
                                      <p class="text-xs font-bold">
                                        Until {{ getHumanReadableDateText(element.duet) }}
                                      </p>
                                    </template>
                                  </div>
                                </div>
                              </template>
                              <template v-if="element.categories">
                                <div class="flex flex-wrap mb-2 items-center w-full overflow-x-hidden">
                                  <template v-for="cat in element.categories" :key="cat">
                                    <div v-if="JSON.parse(cat).category != null"
                                         class="text-neutral-400 border-[1px] border-zinc-600 flex items-center
                                                py-0.5 px-1 rounded mr-1 mb-1 pointer-events-none text-sm darkest_bg">
                                      {{ JSON.parse(cat).category }}
                                    </div>
                                  </template>
                                </div>
                              </template>
                              <Markdown class="p_markdown p_markdown_xl_only
                                               font-bold text-neutral-200 w-full px-1
                                               break-words"
                                        :source="element.t"
                                        :plugins="plugins"></Markdown>
                              <Markdown class="p_markdown p_markdown_xl_only text-neutral-300
                                               text-sm mt-1 w-full px-1"
                                        :source="element.desc"
                                        :plugins="plugins"></Markdown>
                              <template v-if="element.collaborators">
                                <div class="my-4">
                                  <template v-for="collaborator in element.collaborators" :key="collaborator">
                                    <div v-if="collaborator != null"
                                         class="text-neutral-300 flex items-center m-1 pointer-events-none text-sm">
                                      <UserIcon class="h-4 mr-1"></UserIcon>
                                      {{ collaborator.username }}
                                    </div>
                                  </template>
                                </div>
                              </template>
                              <div class="flex mt-6">
                                <div class="ml-auto flex items-center">
                                  <div class="ml-auto flex items-center text-neutral-500 py-0.5 justify-end">
                                    <p class="text-xs ml-1">
                                      {{ element.name }}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <template v-if="element.amountComments && element.recentComment">
                              <Menu as="div" class="absolute bottom-0 left-0">
                                <MenuButton
                                  v-on:click="getRelated(element, false)"
                                  title="Show recent comment"
                                  class="flex mr-auto items-center justify-center p-1 text-neutral-200
                                   hover:text-neutral-100 cursor-pointer rounded hover:darkest_bg">
                                  <ChatBubbleLeftEllipsisIcon class="h-6 w-6 mr-1"></ChatBubbleLeftEllipsisIcon>
                                  <div class="text-start">
                                    <div class="text-xs text-neutral-400">
                                      {{ getHumanReadableDateText(element.recentComment.ts).replace(' ', '&nbsp;') }}
                                    </div>
                                    <div class="text-xs">{{ element.amountComments }}</div>
                                  </div>
                                </MenuButton>
                                <transition
                                  enter-active-class="transition duration-100 ease-out"
                                  enter-from-class="transform scale-95 opacity-0"
                                  enter-to-class="transform scale-100 opacity-100"
                                  leave-active-class="transition duration-75 ease-in"
                                  leave-from-class="transform scale-100 opacity-100"
                                  leave-to-class="transform scale-95 opacity-0"
                                >
                                  <MenuItems
                                    class="p_card_menu_list_big_p darkest_bg notagger"
                                  >
                                    <template v-if="taskRelated.replies == null">
                                      <MenuItem as="div" class="px-3 py-3">
                                        <div class="flex justify-between text-xs text-neutral-400">
                                          <div>{{ element.recentComment.usr }}</div>
                                          <div>{{ getHumanReadableDateText(element.recentComment.ts) }}</div>
                                        </div>
                                        <Markdown
                                          class="p_markdown p_markdown_xl_only text-neutral-300
                                           text-sm mt-1 break-words"
                                          :source="element.recentComment.desc"
                                          :plugins="plugins"></Markdown>
                                      </MenuItem>
                                    </template>
                                    <template v-else>
                                      <template v-for="related in taskRelated.replies" :key="related.uid">
                                        <MenuItem as="div" class="px-3 py-3">
                                          <div class="flex justify-between text-xs text-neutral-400">
                                            <div>{{ related.usr }}</div>
                                            <div>{{ getHumanReadableDateText(related.ts) }}</div>
                                          </div>
                                          <Markdown
                                            class="p_markdown p_markdown_xl_only text-neutral-300
                                             text-sm mt-1 break-words"
                                            :source="related.desc"
                                            :plugins="plugins"></Markdown>
                                        </MenuItem>
                                      </template>
                                    </template>
                                  </MenuItems>
                                </transition>
                              </Menu>
                            </template>
                            <div
                              class="ml-auto absolute top-0 right-0 h-full">
                              <Menu as="div" class="relative inline-block text-left h-full">
                                <MenuButton
                                  title="Options"
                                  class="p_task_overlay hover:bright_bg rounded m-1 p-1 backdrop-blur-3xl flex items-center cursor-pointer">
                                  <SquaresPlusIcon class="h-5 w-5"></SquaresPlusIcon>
                                </MenuButton>
                                <transition
                                  enter-active-class="transition duration-100 ease-out"
                                  enter-from-class="transform scale-95 opacity-0"
                                  enter-to-class="transform scale-100 opacity-100"
                                  leave-active-class="transition duration-75 ease-in"
                                  leave-from-class="transform scale-100 opacity-100"
                                  leave-to-class="transform scale-95 opacity-0"
                                >
                                  <MenuItems
                                    class="p_card_menu_list_medium_p bg-zinc-100"
                                  >
                                    <div class="px-1 py-1">
                                      <MenuItem v-slot="{ active }">
                                        <button v-on:click="finishTask(element)"
                                                :class="[active ? 'p_card_menu_active' : 'text-neutral-900','group p_card_menu_item']">
                                          <CheckIcon
                                            :active="active"
                                            class="mr-2 h-5 w-5"
                                            aria-hidden="true"
                                          />
                                          Finish
                                        </button>
                                      </MenuItem>
                                      <MenuItem v-slot="{ active }">
                                        <button v-on:click="finishTask(element, true)"
                                                :class="[active ? 'p_card_menu_active' : 'text-neutral-900','group p_card_menu_item']">
                                          <TrashIcon
                                            :active="active"
                                            class="mr-2 h-5 w-5"
                                            aria-hidden="true"
                                          />
                                          Delete
                                        </button>
                                      </MenuItem>
                                      <Menu as="div" class="relative inline-block text-left w-full">
                                        <MenuButton
                                          title="Options"
                                          class="items-center cursor-pointer group p_card_menu_item text-neutral-900 hover:text-white hover:dark_bg hover:bg-opacity-60">
                                          <ShareIcon
                                            class="mr-2 h-5 w-5"
                                            aria-hidden="true"
                                          />
                                          Share
                                        </MenuButton>
                                        <transition
                                          enter-active-class="transition duration-100 ease-out"
                                          enter-from-class="transform scale-95 opacity-0"
                                          enter-to-class="transform scale-100 opacity-100"
                                          leave-active-class="transition duration-75 ease-in"
                                          leave-from-class="transform scale-100 opacity-100"
                                          leave-to-class="transform scale-95 opacity-0"
                                        >
                                          <MenuItems class="p_card_menu_list_medium_p dark_bg">
                                            <div class="px-1 py-1">
                                              <div class="pointer-events-none">
                                                <div class="text-neutral-300 group p_card_menu_item font-bold">
                                                  <ChatBubbleLeftRightIcon
                                                    class="mr-2 h-5 w-5"
                                                    aria-hidden="true"
                                                  />
                                                  Clarifier
                                                </div>
                                              </div>
                                            </div>
                                            <div class="px-1 py-1">
                                              <template v-for="group in $store.state.clarifierSessions" :key="group">
                                                <MenuItem v-slot="{ active }" class="mb-1">
                                                  <button v-on:click="showShareTask(group, element)"
                                                          :class="[active ? 'p_card_menu_active' : 'text-neutral-300','group p_card_menu_item p-1']">
                                                    <img class="darkest_bg mr-2"
                                                         style="width: 32px; height: 32px; border-radius: 10px"
                                                         v-bind:src="getImg(group.img,true)"
                                                         :alt="'&nbsp;&nbsp;' + group.title.substring(0,1)"/>
                                                    <div class="text-md">
                                                      {{ group.title }}
                                                    </div>
                                                  </button>
                                                </MenuItem>
                                              </template>
                                            </div>
                                          </MenuItems>
                                        </transition>
                                      </Menu>
                                    </div>
                                    <div class="px-1 py-1">
                                      <MenuItem v-slot="{ active }">
                                        <button
                                          :class="[active ? 'p_card_menu_active' : 'text-neutral-900','group p_card_menu_item']">
                                          <ArrowsPointingOutIcon
                                            :active="active"
                                            class="mr-2 h-5 w-5"
                                            aria-hidden="true"
                                          />
                                          Move
                                        </button>
                                      </MenuItem>
                                    </div>
                                  </MenuItems>
                                </transition>
                              </Menu>
                            </div>
                          </div>
                        </div>
                      </template>
                    </draggable>
                  </div>
                  <div class="relative flex items-center cursor-pointer p-2">
                    <PlusCircleIcon class="h-6 w-6 mx-1 absolute text-neutral-400"></PlusCircleIcon>
                    <div class="p_input p_input_icon text-neutral-400"
                         v-on:click="toggleAndFocusNewTask('taskname_' + box.box.uid)">
                      Add a Task
                    </div>
                  </div>
                  <div :id="'taskname_' + box.box.uid"
                       class="w-full hidden mt-4 p_new_task_disclosure relative p-2">
                    <p class="absolute pt-1 pl-2 text-neutral-400">##</p>
                    <input :id="'taskname_' + box.box.uid + '_input'"
                           type="text"
                           class="p_input w-full font-bold"
                           style="padding-left: 2rem"
                           placeholder="Title"
                           v-model="newTask.name"
                           v-on:keydown="newTaskKeyUp(box.box, 'taskname_' + box.box.uid)">
                    <textarea :id="'taskname_' + box.box.uid + '_desc'"
                              type="text" v-model="newTask.description"
                              rows="1"
                              class="p_input w-full mt-2"
                              placeholder="Description"
                              v-on:keydown="newTaskKeyUp(box.box, 'taskname_' + box.box.uid)"
                              v-on:keyup="auto_grow('taskname_' + box.box.uid + '_desc')"></textarea>
                    <Listbox v-model="newTask.categories" multiple id="newtaskcategories">
                      <div class="relative mt-1">
                        <ListboxButton
                          class="darkest_bg w-full relative cursor-default rounded-lg py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm"
                        >
                          <template v-if="newTask.categories.length > 0">
                            <div class="block truncate font-bold text-neutral-300">
                              {{ newTask.categories.map((cat) => cat.category).join(', ') }}
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
                </div>
              </template>
            </template>
            <div id="new_box" class="p_card" style="margin-right: 312px">
              <div class="p_card_header_section flex relative items-center p-2">
                <PlusCircleIcon class="h-6 w-6 mx-1 absolute"></PlusCircleIcon>
                <input type="text" class="p_input p_input_icon w-full" placeholder="New Box..."
                       v-model="newBox.name"
                       v-on:keydown="newBoxKeyUp">
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <div id="list"
               class="h-full w-full pb-2 pl-2 pr-4 overflow-y-auto fixed">
            <template v-if="boxes.length > 0">
              <table class="w-full table-auto darkest_bg"
                     style="margin-bottom: 312px !important">
                <thead>
                <tr class="text-neutral-300 text-left">
                  <th class="p-2">State</th>
                  <th class="p-2">Title</th>
                  <th class="p-2">Description</th>
                  <th class="p-2">Categories</th>
                  <th class="p-2">Due&nbsp;Date</th>
                  <th class="p-2">Collaborators</th>
                  <th class="p-2 pr-4">Author</th>
                </tr>
                </thead>
                <tbody class="divide-y divide-zinc-500">
                <template v-for="box in boxes" :key="box.box.uid">
                  <tr class="text-neutral-300 z-10 list_boxcontainer my-1"
                      :ref="'list_box_' + box.box.uid" :id="'list_box_' + box.box.uid">
                    <td class="px-2 py-4 sticky top-0 darkest_bg"></td>
                    <td class="px-2 py-4 sticky top-0 darkest_bg"></td>
                    <td class="px-2 py-4 sticky top-0 darkest_bg">
                      <div class="font-bold text-2xl flex items-center justify-between">
                        <p>{{ box.box.t }}</p>
                        <template v-if="box.tasks">
                          <div class="font-bold flex items-center cursor-default ml-4"
                               :title="'Tasks: ' + box.tasks.length">
                            <InboxIcon class="h-5 w-5 mr-2"></InboxIcon>
                            <p>{{ box.tasks.length }}</p>
                          </div>
                        </template>
                      </div>
                    </td>
                    <td class="px-2 py-4 sticky top-0 darkest_bg"></td>
                    <td class="px-2 py-4 sticky top-0 darkest_bg"></td>
                    <td class="px-2 py-4 sticky top-0 darkest_bg"></td>
                    <td class="px-2 py-4 sticky top-0 darkest_bg"></td>
                  </tr>
                  <template v-if="box.tasks">
                    <tr v-for="task in box.tasks" :key="task.uid"
                        :ref="'list_task_' + task.uid" :id="'list_task_' + task.uid"
                        v-on:click="openTask(task)"
                        class="text-neutral-300 cursor-pointer hover:medium_bg
                             z-20 list_taskcontainer dark_bg">
                      <td class="p-2">
                        <template v-if="task.done">
                          <div class="px-1 py-1 rounded bg-green-800 flex w-24 mr-2 items-center">
                            <CheckIcon class="h-4 w-4 mr-1 text-neutral-300"></CheckIcon>
                            <span class="text-xs font-bold text-neutral-300">Done</span>
                          </div>
                        </template>
                        <template v-else>
                          <div class="px-1 py-1 rounded bg-red-800 flex w-24 mr-2 items-center">
                            <Cog6ToothIcon class="h-4 w-4 mr-1 text-neutral-300"></Cog6ToothIcon>
                            <span class="text-xs font-bold text-neutral-300">Progress</span>
                          </div>
                        </template>
                      </td>
                      <td class="p-2 text-neutral-200">{{ task.t }}</td>
                      <td class="p-2">
                        <div class="max-h-10 overflow-hidden text-sm">
                          {{ task.desc }}
                        </div>
                      </td>
                      <template v-if="task.categories">
                        <td class="p-2">
                          <div class="flex flex-wrap items-center">
                            <template v-for="cat in task.categories" :key="cat">
                              <div v-if="JSON.parse(cat).category != null"
                                   class="text-neutral-400 border-[1px] border-zinc-600 flex items-center
                                          py-0.5 px-1 rounded mr-1 mb-1 pointer-events-none text-sm darkest_bg">
                                {{ JSON.parse(cat).category }}
                              </div>
                            </template>
                          </div>
                        </td>
                      </template>
                      <template v-else>
                        <td class="p-2"></td>
                      </template>
                      <template v-if="task.due && task.due !== ''">
                        <td class="p-2 text-sm">{{ getHumanReadableDateText(task.due) }}</td>
                      </template>
                      <template v-else>
                        <td class="p-2 text-neutral-500 text-xs">(No&nbsp;Due&nbsp;Date)</td>
                      </template>
                      <template v-if="task.collaborators">
                        <td class="p-2">
                          <div class="grid grid-cols-1 items-center">
                            <template v-for="collaborator in task.collaborators" :key="collaborator">
                              <div v-if="collaborator != null"
                                   class="text-neutral-200 flex items-center
                                        rounded-lg mb-1 pointer-events-none text-sm w-fit">
                                <UserIcon class="h-4 h-4 mr-1"></UserIcon>
                                {{ collaborator.username }}
                              </div>
                            </template>
                          </div>
                        </td>
                      </template>
                      <template v-else>
                        <td class="p-2 text-neutral-500 text-xs">(No&nbsp;Collaborators)</td>
                      </template>
                      <td class="p-2 text-sm">{{ task.usr }}</td>
                    </tr>
                  </template>
                </template>
                </tbody>
              </table>
            </template>
          </div>
        </template>
        <div class="top-0 right-0 bottom-0 left-0 overflow-hidden flex items-center justify-center
                    absolute z-50 transition-opacity ease-out delay-500"
             :class="{'pointer-events-none opacity-0': !isLoading,
                      'opacity-100 !important': isLoading}">
          <div class="bg-zinc-900 bg-opacity-50 p-2 rounded-md">
            <div class="px-4 py-2 flex items-center">
              <div class="rounded-full h-4 w-4 bg-zinc-600 animate-ping border-2 border-indigo-500"></div>
              <p class="ml-6 text-neutral-200 font-bold animate-pulse">
                Loading Tasks ...
              </p>
            </div>
            <div class="flex items-center cursor-pointer hover:medium_bg
                          p-2 w-full mt-2 rounded"
                 v-on:click="$router.back()">
              <div class="text-neutral-400">
                <p class="text-sm">Taking too long?</p>
                <p>Go Back</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  <template v-else>
    <div class="h-full w-full pt-[55px] bright_bg">
      <div class="px-8 pt-4 pb-8 m-8 dark_bg rounded-md dshadow max-w-screen-lg">
        <div class="text-neutral-300 mb-5 pointer-events-none">
          <span class="text-4xl font-bold">Create new Knowledge Hub</span>
        </div>
        <form class="lg:flex lg:gap-x-4" @submit.prevent="createKnowledge()">
          <div class="text-neutral-300 w-full lg:w-[50%]">
            <label for="title" class="text-2xl">Title</label>
            <br>
            <input type="text" id="title" class="rounded text-xl w-full p-2 bg-zinc-400 bg-opacity-25"
                   required v-model="titleCreation">
            <br>
            <label for="description" class="text-2xl">Description</label>
            <br>
            <textarea type="text" rows="3" id="description"
                      class="rounded text-xl w-full p-2 bg-zinc-400 bg-opacity-25"
                      v-model="descriptionCreation"></textarea>
          </div>
          <div class="text-neutral-300 w-full lg:w-[50%]">
            <label for="keywords" class="text-2xl mr-3">Keywords</label>
            <span class="text-neutral-500">Comma separated</span>
            <br>
            <input type="text" id="keywords" class="rounded text-xl w-full p-2 bg-zinc-400 bg-opacity-25"
                   v-model="keywordsCreation">
            <br>
            <button type="submit"
                    class="mt-6 btn_bg_primary">
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  </template>
  <modal @close="isShowingTask = false; sharing.collaborators = []"
         v-show="isShowingTask">
    <template v-slot:header>
      <div class="h-4 flex items-center text-neutral-400 text-xs">
        <p class="mr-1">{{ showingTask.uid }}</p>
        <i class="bi bi-dot mr-1"></i>
        <p class="mr-1">
          {{ new Date(showingTask.ts).toLocaleString('de-DE').replace(' ', '&nbsp;') }}
        </p>
        <i class="bi bi-dot mr-1"></i>
        <p class="mr-1">{{ showingTask.name }}</p>
      </div>
    </template>
    <template v-slot:body>
      <div class="w-full sm:w-[600px] flex h-full relative">
        <div class="w-[calc(100%-50px)] sm:w-[calc(100%-100px)] h-full mr-1"
             v-if="!isShowingTaskHistory">
          <div class="w-full medium_bg p-2 rounded dshadow">
            <template v-if="showingTask.categories && showingTask.categories.length > 0">
              <div class="flex mb-2 items-center">
                <template v-for="cat in showingTask.categories" :key="cat">
                  <div v-if="JSON.parse(cat).category != null"
                       class="text-neutral-400 border-[1px] border-zinc-600
                              flex items-center py-0.5 px-1 rounded mr-1
                              mb-1 pointer-events-none text-sm darkest_bg">
                    {{ JSON.parse(cat).category }}
                  </div>
                </template>
              </div>
            </template>
            <Markdown class="markedView font-bold text-neutral-200 w-full"
                      :source="showingTask.t"
                      :plugins="plugins"></Markdown>
            <Markdown class="markedView text-neutral-300 w-full"
                      :source="showingTask.desc"
                      :plugins="plugins"></Markdown>
          </div>
          <div class="w-full my-2">
            <label for="task_view_datetime"
                   class="text-neutral-300 text-xs font-bold mb-1">
              Due Date
            </label>
            <div class="flex items-center justify-start">
              <input id="task_view_datetime" type="date" class="p_input" style="color-scheme: dark;"
                     v-model="showingTask.dueDateFormatted">
              <input id="task_view_time" type="time" class="p_input ml-1" style="color-scheme: dark;"
                     v-model="showingTask.dueTimeFormatted">
              <button class="rounded-lg dark_bg hover:darkest_bg py-2 px-2 ml-1 text-xs text-neutral-300"
                      v-on:click="setTaskDueDate()">
                Update
              </button>
            </div>
          </div>
          <div class="w-full my-2">
            <div class="text-neutral-300 text-xs font-bold mb-1 flex">
              <span>Collaborators</span>
            </div>
            <div class="flex items-center justify-start w-full overflow-x-auto pb-1">
              <template v-if="showingTask.collaborators && showingTask.collaborators.length > 0">
                <template v-for="collaborator in showingTask.collaborators" :key="collaborator">
                  <div v-if="collaborator != null"
                       class="text-white flex items-center
                              py-1 px-2 rounded mr-1 mb-1 pointer-events-none text-sm">
                    <UserIcon class="h-4 h-4 mr-1"></UserIcon>
                    {{ collaborator.username }}
                  </div>
                </template>
              </template>
              <template v-else>
                <div class="text-neutral-400 text-xs font-bold pointer-events-none">
                  (No Collaborators)
                </div>
              </template>
            </div>
            <div class="flex w-full items-center">
              <Listbox v-model="sharing.collaborators" multiple id="collabos"
                       class="w-[calc(100%-40px)]">
                <div class="relative my-2">
                  <ListboxButton
                    class="medium_bg w-full relative cursor-default rounded-lg py-2 pl-3
                           pr-10 text-left shadow-md focus:outline-none
                           focus-visible:border-indigo-500 focus-visible:ring-2
                           focus-visible:ring-white focus-visible:ring-opacity-75
                           focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300
                           sm:text-sm"
                  >
                    <template v-if="sharing.collaborators.length > 0">
                      <div class="block truncate font-bold text-neutral-300">
                        {{ sharing.collaborators.map((cat) => cat.usr).join(', ') }}
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
                      class="absolute mt-1 max-h-60 w-full overflow-auto rounded-md dark_bg py-1
                             text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none
                             sm:text-sm"
                    >
                      <ListboxOption
                        v-slot="{ active, selected }"
                        v-for="cat in sharing.members"
                        :key="cat"
                        :value="cat"
                        as="template"
                      >
                        <li
                          :class="[ active ? 'medium_bg' : '',
                                  'relative cursor-pointer select-none py-2 pl-10 pr-4 text-neutral-200' ]">
                          <div
                            :class="[ selected ? 'font-medium' : 'font-normal', 'block truncate' ]">
                            {{ cat.usr }}
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
              <button class="rounded-lg dark_bg hover:darkest_bg py-2.5 px-2 my-2 ml-1 w-[40px]
                             text-xs text-neutral-300"
                      v-on:click="addTaskCollaborators()">
                Add
              </button>
            </div>
          </div>
          <div id="wisdomComments" class="w-full mt-4 py-2 rounded">
            <div class="w-full">
              <textarea type="text" id="input_comment" v-model="showingTaskComment" rows="1"
                        placeholder="Write a comment"
                        class="w-full border-b border-zinc-400 text-neutral-300 bright_bg
                               focus:outline-none px-2 py-1 p_input"
                        v-on:keyup="showingTaskKeyup()"></textarea>
              <div hidden
                   class="p-2 rounded-full hover:medium_bg text-neutral-300 hover:text-white
                          relative right-1 sidebar_button cursor-pointer">
                <Squares2X2Icon class="h-6 w-6"></Squares2X2Icon>
              </div>
            </div>
            <template v-if="!showingTaskRelated.replies || showingTaskRelated.replies.length < 1">
              <div class="flex w-full items-center justify-center py-4">
                <div class="w-full text-neutral-400 pointer-events-none">
                  <CubeTransparentIcon class="h-8 w-8 mx-auto"></CubeTransparentIcon>
                  <p class="text-md font-bold italic w-fit mx-auto">No Comments</p>
                </div>
              </div>
            </template>
            <template v-else>
              <div class="flex items-center mt-4 mb-3 pointer-events-none">
                <ChatBubbleLeftEllipsisIcon class="w-6 h-6 mr-2 text-neutral-300"></ChatBubbleLeftEllipsisIcon>
                <p class="text-neutral-300 font-bold text-sm">
                  {{ showingTaskRelated.replies.length }} {{ commentsText }}:
                </p>
              </div>
              <div v-for="comment in showingTaskRelated.replies" :key="comment.uid"
                   class="mb-2 w-full medium_bg rounded-r-xl rounded-l-lg border-b-2
                          border-r-2 border-b-zinc-500 border-r-zinc-500 comment break-words">
                <Markdown :source="comment.desc"
                          class="text-neutral-300 w-full markedView py-1 px-2"
                          :plugins="plugins"></Markdown>
                <div class="flex w-full">
                  <div
                    class="text-neutral-400 ml-auto dark_bg rounded-br-xl rounded-tl-xl py-1
                           px-2 min-w-[20%] justify-between flex items-center">
                    <p class="text-neutral-500 text-xs mr-2">
                      {{ getHumanReadableDateText(comment.ts) }}</p>
                    <p class="text-sm">{{ comment.name }}</p>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>
        <div v-else class="w-[calc(100%-50px)] sm:w-[calc(100%-100px)] h-full mr-1">
          <table class="w-full h-full divide-y">
            <tr>
              <th>Type</th>
              <th>Author</th>
              <th>Date</th>
            </tr>
            <template v-for="entry in showingTaskHistory" :key="entry">
              <tr class="py-1 mb-1">
                <td class="text-neutral-300">
                  {{ capitalizeFirstLetter(entry.type) }}
                </td>
                <td>
                  {{ entry.usr }}
                </td>
                <td class="text-neutral-400">
                  {{ entry.date.toLocaleString('de-DE').replace(' ', '&nbsp;') }}
                </td>
              </tr>
            </template>
          </table>
        </div>
        <div class="min-w-[50px] sm:min-w-[100px] h-full ml-auto divide-y divide-zinc-500 relative">
          <div class="px-1 pb-1">
            <button v-on:click="finishTask(showingTask)"
                    class="group p_card_menu_item text-neutral-300 hover:text-white hover:dark_bg">
              <CheckIcon
                class="mr-2 h-6 w-6"
                aria-hidden="true"
              />
              <template class="hidden sm:block">
                Finish
              </template>
            </button>
            <button v-on:click="finishTask(showingTask, true)"
                    class="group p_card_menu_item text-neutral-300 hover:text-white hover:dark_bg">
              <TrashIcon
                class="mr-2 h-6 w-6"
                aria-hidden="true"
              />
              <template class="hidden sm:block">
                Delete
              </template>
            </button>
          </div>
          <div class="p-1">
            <Menu as="div" class="relative inline-block text-left w-full">
              <MenuButton
                title="Options"
                class="items-center cursor-pointer group p_card_menu_item text-neutral-300 hover:text-white hover:dark_bg">
                <ShareIcon
                  class="mr-2 h-6 w-6"
                  aria-hidden="true"
                />
                <template class="hidden sm:block">
                  Share
                </template>
              </MenuButton>
              <transition
                enter-active-class="transition duration-100 ease-out"
                enter-from-class="transform scale-95 opacity-0"
                enter-to-class="transform scale-100 opacity-100"
                leave-active-class="transition duration-75 ease-in"
                leave-from-class="transform scale-100 opacity-100"
                leave-to-class="transform scale-95 opacity-0"
              >
                <MenuItems class="p_card_menu_list_medium_p dark_bg">
                  <div class="px-1 py-1">
                    <div class="pointer-events-none">
                      <div class="text-neutral-300 group p_card_menu_item font-bold">
                        <ChatBubbleLeftRightIcon
                          class="mr-2 h-6 w-6"
                          aria-hidden="true"
                        />
                        Clarifier
                      </div>
                    </div>
                  </div>
                  <div class="px-1 py-1">
                    <template v-for="group in $store.state.clarifierSessions" :key="group">
                      <MenuItem v-slot="{ active }" class="mb-1">
                        <button v-on:click="showShareTask(group)"
                                :class="[active ? 'p_card_menu_active' : 'text-neutral-300','group p_card_menu_item p-1']">
                          <img class="darkest_bg mr-2"
                               style="width: 32px; height: 32px; border-radius: 10px"
                               v-bind:src="getImg(group.img,true)"
                               :alt="'&nbsp;&nbsp;' + group.title.substring(0,1)"/>
                          <div class="text-md">
                            {{ group.title }}
                          </div>
                        </button>
                      </MenuItem>
                    </template>
                  </div>
                </MenuItems>
              </transition>
            </Menu>
            <button v-on:click="gotoWisdom(showingTask.uid)"
                    class="group p_card_menu_item text-neutral-300 hover:text-white hover:dark_bg">
              <WindowIcon
                class="mr-2 h-6 w-6"
                aria-hidden="true"
              />
              <template class="hidden sm:block">
                Go&nbsp;To
              </template>
            </button>
          </div>
          <div class="p-1 hidden">
            <button v-on:click="showTaskHistory()"
                    class="group p_card_menu_item text-neutral-300 hover:text-white hover:dark_bg">
              <template v-if="!isShowingTaskHistory">
                <ClockIcon
                  class="mr-2 h-6 w-6"
                  aria-hidden="true"
                />
                <template class="hidden sm:block">
                  History
                </template>
              </template>
              <template v-else>
                <DocumentTextIcon
                  class="mr-2 h-6 w-6"
                  aria-hidden="true"
                />
                <template class="hidden sm:block">
                  Task
                </template>
              </template>
            </button>
          </div>
        </div>
      </div>
    </template>
    <template v-slot:footer>
    </template>
  </modal>
  <template v-if="isSearching">
    <div class="fixed top-[55px] right-1 p_card mt-2"
         style="box-shadow: 0 0 6px 4px rgb(23 23 23 / 1)">
      <div class="p_card_header_section relative text-neutral-300 flex items-center p-2 font-bold w-full">
        <span>Filter</span>
        <i class="bi bi-x-lg ml-auto mr-2 pl-2 hover:text-orange-600 cursor-pointer"
           v-on:click="this.isSearching = false"></i>
      </div>
      <div class="p_card_header_section flex relative items-center p-2">
        <FunnelIcon class="h-6 w-6 mx-1 absolute"></FunnelIcon>
        <input id="search_input"
               type="text" class="p_input p_input_icon w-full" placeholder="Search..."
               v-model="searchQuery"
               v-on:keyup="handleEnter()">
      </div>
      <div class="flex w-full mb-1">
        <button class="rounded-lg dark_bg hover:darkest_bg py-1 px-2 ml-auto mr-2 text-sm text-neutral-400"
                v-on:click="resetSearchResults()">
          Reset
        </button>
      </div>
      <div class="px-10 py-4 mt-2 dark_bg rounded-b">
        <div class="flex items-center justify-between mb-2">
          <label for="filterTitle" class="text-sm text-neutral-400 font-bold">Title</label>
          <input id="filterTitle" type="checkbox" v-model="filters.filterTitle"
                 class="w-6 h-6 accent-neutral-400">
        </div>
        <div class="flex items-center justify-between mb-2">
          <label for="filterKeywords" class="text-sm text-neutral-400 font-bold">Keywords</label>
          <input id="filterKeywords" type="checkbox" v-model="filters.filterKeywords"
                 class="w-6 h-6 accent-neutral-400">
        </div>
        <div class="flex items-center justify-between mb-2">
          <label for="filterDescription" class="text-sm text-neutral-400 font-bold">Description</label>
          <input id="filterDescription" type="checkbox" v-model="filters.filterDescription"
                 class="w-6 h-6 accent-neutral-400">
        </div>
        <div class="flex items-center justify-between">
          <label for="filterAuthor" class="text-sm text-neutral-400 font-bold">Author</label>
          <input id="filterAuthor" type="checkbox" v-model="filters.filterAuthor"
                 class="w-6 h-6 accent-neutral-400">
        </div>
      </div>
    </div>
  </template>
  <modal
    v-show="isSharingTask"
    @close="isSharingTask = false">
    <template v-slot:header>
      <div class="font-bold text-xl pointer-events-none">
        Share with
        <template v-if="sharing.group">{{ sharing.group.title }}</template>
      </div>
    </template>
    <template v-slot:body>
      <div class="w-[80dvw] sm:w-[412px] h-full relative">
        <div class="p-2 darkest_bg rounded-md">
          <div class="text-neutral-400 dark_bg w-full rounded py-1 px-2 mb-2 pointer-events-none">
            Subchatrooms
          </div>
          <template v-if="sharing.chatroom && sharing.chatroom.subc">
            <div class="ml-3">
              <RadioGroup v-model="sharing.selectedSubchat">
                <RadioGroupLabel class="sr-only">Subchatrooms</RadioGroupLabel>
                <div class="space-y-2">
                  <RadioGroupOption
                    as="template"
                    v-for="subchat in sharing.chatroom.subc"
                    :key="subchat"
                    :value="subchat.uid"
                    v-slot="{ active, checked }">
                    <div
                      :class="[active ? 'ring-2 ring-white ring-opacity-20' : '',
                               checked ? 'bg-zinc-300 bg-opacity-20 text-white ' : '']"
                      class="relative flex cursor-pointer rounded-lg px-2 py-1 shadow-md focus:outline-none
                             hover:bg-zinc-500 hover:bg-opacity-20 border-l border-neutral-600">
                      <div class="flex w-full items-center justify-between">
                        <div class="flex items-center">
                          <div class="text-sm">
                            <RadioGroupLabel
                              as="p"
                              class="font-medium flex items-center">
                              <div :class="[checked ? 'text-neutral-300' : 'text-neutral-400']"
                                   class="text-lg">
                                {{ subchat.t }}
                              </div>
                            </RadioGroupLabel>
                            <RadioGroupDescription
                              as="span"
                              class="inline"
                            >
                              <div :class="[checked ? 'text-neutral-500' : 'text-neutral-600']"
                                   class="text-xs">
                                <template v-if="subchat.type">
                                  {{ capitalizeFirstLetter(subchat.type) }}
                                </template>
                                <template v-else>
                                  Text
                                </template>
                              </div>
                            </RadioGroupDescription>
                          </div>
                        </div>
                        <div v-show="checked" class="shrink-0 text-white">
                          <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none">
                            <circle
                              cx="12"
                              cy="12"
                              r="12"
                              fill="#fff"
                              fill-opacity="0.2"
                            />
                            <path
                              d="M7 13l3 3 7-7"
                              stroke="#fff"
                              stroke-width="1.5"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </RadioGroupOption>
                </div>
              </RadioGroup>
            </div>
          </template>
          <template v-else>
            <div class="ml-3 text-neutral-500 animate-bounce">Loading...</div>
          </template>
        </div>
        <textarea type="text" id="share_message" v-model="sharing.message" rows="1"
                  placeholder="Add a message"
                  class="w-full border-b border-neutral-400 text-neutral-300 bright_bg bg-opacity-20 focus:outline-none px-2 py-1 p_input mt-2"
                  v-on:keyup="auto_grow('share_message')"></textarea>
        <div class="mt-2 flex w-full relative">
          <div class="ml-auto">
            <template v-if="sharing.selectedSubchat !== ''">
              <button v-on:click="shareTask()"
                      class="py-2 px-3 rounded dark_bg hover:darkest_bg">
                <span class="font-bold text-sm text-neutral-400">Share Task</span>
              </button>
            </template>
            <template v-else>
              <div class="py-2 px-3 text-neutral-400 text-sm pointer-events-none">
                Choose a Subchat
              </div>
            </template>
          </div>
        </div>
      </div>
    </template>
    <template v-slot:footer>
    </template>
  </modal>
</template>

<script>

import {
  ArrowPathIcon,
  ChatBubbleLeftEllipsisIcon,
  CubeTransparentIcon,
  EllipsisVerticalIcon,
  FunnelIcon,
  ListBulletIcon,
  PlusCircleIcon,
  SquaresPlusIcon,
  ViewColumnsIcon
} from '@heroicons/vue/24/outline'
import {
  ArrowsPointingOutIcon,
  ArrowsUpDownIcon,
  CalendarIcon,
  ChatBubbleLeftRightIcon,
  CheckIcon,
  ClockIcon,
  Cog6ToothIcon,
  DocumentTextIcon,
  InboxIcon,
  ShareIcon,
  Squares2X2Icon,
  TrashIcon,
  UserIcon,
  WindowIcon
} from '@heroicons/vue/24/solid'
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  RadioGroup,
  RadioGroupDescription,
  RadioGroupLabel,
  RadioGroupOption
} from '@headlessui/vue'
import Markdown from 'vue3-markdown-it'
import markdownItMermaid from 'markdown-it-mermaid'
import 'highlight.js/styles/hybrid.css'
import mermaid from 'mermaid'
import modal from '../../components/Modal.vue'
import FullCalendar from '@fullcalendar/vue3'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { DateTime } from 'luxon'
import draggable from 'vuedraggable'
import { dbGetDisplayName } from '@/libs/wikistore'

export default {
  name: 'PlannerNewView',
  components: {
    modal,
    Markdown,
    PlusCircleIcon,
    InboxIcon,
    SquaresPlusIcon,
    ArrowPathIcon,
    Menu,
    MenuButton,
    MenuItems,
    MenuItem,
    RadioGroup,
    RadioGroupLabel,
    RadioGroupDescription,
    RadioGroupOption,
    TrashIcon,
    CheckIcon,
    ArrowsPointingOutIcon,
    EllipsisVerticalIcon,
    CubeTransparentIcon,
    ChatBubbleLeftEllipsisIcon,
    Squares2X2Icon,
    Listbox,
    ListboxButton,
    ListboxOptions,
    ListboxOption,
    ArrowsUpDownIcon,
    WindowIcon,
    ClockIcon,
    CalendarIcon,
    UserIcon,
    FunnelIcon,
    DocumentTextIcon,
    ShareIcon,
    ChatBubbleLeftRightIcon,
    FullCalendar,
    ListBulletIcon,
    ViewColumnsIcon,
    Cog6ToothIcon,
    draggable
  },
  data () {
    return {
      drag: false,
      lastDragMove: undefined,
      calendarOptions: null,
      srcGUID: '',
      knowledge: {},
      knowledgeExists: true,
      boxes: [],
      newBox: {
        name: ''
      },
      newTask: {
        name: '',
        description: '',
        categories: []
      },
      inputComment: null,
      isWritingComment: false,
      isShowingTask: false,
      isShowingTaskHistory: false,
      isSharingTask: false,
      showingTask: {},
      showingTaskRelated: [],
      showingTaskComment: '',
      showingTaskHistory: [],
      sharing: {
        group: null,
        chatroom: null,
        selectedSubchat: '',
        message: '',
        members: [],
        collaborators: []
      },
      selection: {
        row: -1,
        col: -1
      },
      isSearching: false,
      isListView: false,
      searchQuery: '',
      filters: {
        filterTitle: true,
        filterKeywords: true,
        filterDescription: true,
        filterAuthor: true
      },
      plugins: [
        {
          plugin: markdownItMermaid
        }
      ],
      results: [],
      taskRelated: [],
      titleCreation: '',
      descriptionCreation: '',
      keywordsCreation: '',
      connector: null,
      isLoading: true
    }
  },
  computed: {
    commentsText: function () {
      if (this.showingTaskRelated.replies != null) {
        if (this.showingTaskRelated.replies.length > 1) {
          return 'Comments'
        } else {
          return 'Comment'
        }
      } else {
        return ''
      }
    },
    dragOptions () {
      return {
        animation: 200,
        group: 'description',
        disabled: false,
        ghostClass: 'ghost'
      }
    }
  },
  mounted () {
    this.renderMermaidInit()
    this.initFunction()
    window.addEventListener('keypress', this.handleDocumentKeypress, false)
    window.addEventListener('keyup', this.handleDocumentKeyUp, false)
    window.addEventListener('keydown', this.handleDocumentKeyDown, false)
  },
  beforeUnmount () {
    window.removeEventListener('keypress', this.handleDocumentKeypress, false)
    window.removeEventListener('keyup', this.handleDocumentKeyUp, false)
    window.removeEventListener('keydown', this.handleDocumentKeyDown, false)
  },
  methods: {
    initFunction: async function () {
      const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop)
      })
      // Whose knowledge are we trying to see?
      const srcGUID = params.src
      if (srcGUID == null) {
        return
      }
      this.srcGUID = srcGUID
      this.inputComment = document.getElementById('input_comment')
      this.inputComment.addEventListener('keydown', this.handleEnter, false)

      const updater = this.updateTaskDueDate
      const opener = this.openTaskFromUID

      this.calendarOptions = {
        plugins: [timeGridPlugin, interactionPlugin],
        initialView: 'timeGridWeek',
        nowIndicator: true,
        editable: true,
        events: [],
        businessHours: {
          daysOfWeek: [1, 2, 3, 4, 5, 6], // 0 would be sunday!
          startTime: '7:00',
          endTime: '19:00'
        },
        eventDrop: function (info) {
          // alert(info.event.title + ' was dropped on ' + info.event.start.toISOString())
          // if (!confirm('is this okay?')) { info.revert() }
          updater(info.event.id, info.event.start, info.event.end)
        },
        eventResize: function (info) {
          // alert(info.event.title + ' end is now ' + info.event.end.toISOString())
          // if (!confirm('is this okay?')) { info.revert() }
          updater(info.event.id, info.event.start, info.event.end)
        },
        eventClick: function (info) {
          opener(info.event.id)
        }
      }
      this.toggleSidebar(true)
      this.getKnowledge(srcGUID).then(() => {
        this.getBoxes()
        if (this.knowledge.mainChatroomGUID) {
          this.getClarifierMetaData(this.knowledge.mainChatroomGUID)
        }
      })
      this.connector = new BroadcastChannel('connector')
      this.connector.onmessage = event => {
        if (event.data.type === 'planner change') {
          this.getBoxes()
        }
      }
    },
    getKnowledge: async function (sessionID) {
      return new Promise((resolve) => {
        this.$Worker.execute({
          action: 'api',
          method: 'get',
          url: 'knowledge/private/chat/' + sessionID
        })
          .then((data) => {
            this.knowledgeExists = true
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
    getBoxes: async function (silent = false, showAll = false) {
      if (!silent) {
        this.isLoading = true
      }
      return new Promise((resolve) => {
        let suffix = ''
        const checkbox = this.$refs.input_show_unfinished
        if (checkbox && (showAll || checkbox.checked)) {
          suffix = '?state=any'
          checkbox.checked = true
        } else {
          suffix = '?state=todo'
          checkbox.checked = false
        }
        this.$Worker.execute({
          action: 'api',
          method: 'get',
          url: 'wisdom/private/tasks/' + this.knowledge.uid + suffix
        })
          .then(async (data) => {
            // Retrieve all boxes and tasks from server response
            this.boxes = data.result.boxes.reverse()
            this.calendarOptions.events = []
            // Iterate over all boxes
            for (let i = 0; i < this.boxes.length; i++) {
              if (this.boxes[i].tasks) {
                // Iterate over all tasks of this box
                for (let j = 0; j < this.boxes[i].tasks.length; j++) {
                  this.boxes[i].tasks[j].name = await dbGetDisplayName(this.boxes[i].tasks[j].usr)
                  if (this.boxes[i].tasks[j].due) {
                    // Add entry to calendar if there's a due date
                    this.calendarOptions.events.push({
                      id: this.boxes[i].tasks[j].uid,
                      title: this.boxes[i].tasks[j].t + ' - ' + this.boxes[i].tasks[j].desc,
                      start: this.boxes[i].tasks[j].due,
                      end: this.boxes[i].tasks[j].duet
                    })
                  }
                }
              }
            }
            // Draw Mermaid content in tasks
            this.renderMermaid()
            resolve()
          })
          .catch((err) => {
            console.debug(err.message)
          })
          .finally(() => {
            this.isLoading = false
          })
      })
    },
    newBoxKeyUp: function () {
      if (event.key === 'Enter') {
        if (event.shiftKey) return
        if (this.newBox.name.trim() !== '') {
          this.createBox()
        }
      }
    },
    newTaskKeyUp: async function (box, id = '') {
      const ev = event
      if (ev.repeat) return
      if (ev.key === 'Enter') {
        if (ev.shiftKey) return
        if (this.newTask.name.trim() !== '') {
          await this.createTask(box)
          if (ev.ctrlKey && id !== '') {
            this.toggleAndFocusNewTask(id)
          } else {
            document.activeElement.blur()
          }
        }
      }
    },
    createBox: async function () {
      const categories = []
      const payload = {
        t: this.newBox.name,
        desc: '',
        pid: this.knowledge.uid,
        keys: '',
        copy: '',
        cats: categories,
        type: 'box',
        row: 0
      }
      const bodyPayload = JSON.stringify(payload)
      return new Promise((resolve) => {
        this.$Worker.execute({
          action: 'api',
          method: 'post',
          url: 'wisdom/private/create',
          body: bodyPayload
        })
          .then(() => {
            this.newBox.name = ''
            this.getBoxes()
          })
          .then(() => resolve)
          .catch((err) => {
            console.debug(err.message)
            this.noResults = true
          })
      })
    },
    createTask: async function (box, taskUpdate = false) {
      let categories = []
      let payload = {}
      if (!taskUpdate) {
        for (let i = 0; i < this.newTask.categories.length; i++) {
          categories.push(this.newTask.categories[i])
        }
        payload = {
          t: this.newTask.name,
          desc: this.newTask.description,
          pid: this.knowledge.uid,
          keys: this.newTask.name,
          copy: '',
          cats: categories,
          type: 'task',
          row: 0.0,
          ref: box.uid
        }
      } else if (taskUpdate) {
        categories = []
        if (this.showingTask.categories) {
          for (let i = 0; i < this.showingTask.categories.length; i++) {
            categories.push(this.showingTask.categories[i])
          }
        }
        let combinedDateTime = ''
        if (this.showingTask.dueDateFormatted) {
          combinedDateTime = this.showingTask.dueDateFormatted
        }
        if (this.showingTask.dueTimeFormatted) {
          // If there was no date set, assume the current date was meant and set it accordingly
          if (combinedDateTime === '') {
            combinedDateTime = new Date().toISOString().split('T')[0]
            this.showingTask.due = combinedDateTime
          }
          // Add time either way
          combinedDateTime += 'T' + this.showingTask.dueTimeFormatted
        } else {
          if (combinedDateTime !== '') {
            combinedDateTime += 'T00:00:00Z'
            this.showingTask.dueTimeFormatted = '00:00'
          }
        }
        payload = {
          t: this.showingTask.t,
          desc: this.showingTask.desc,
          pid: this.knowledge.uid,
          keys: this.newTask.name,
          copy: '',
          cats: categories,
          type: 'task',
          rowIndex: 0,
          ref: this.showingTask.ref,
          dueDate: combinedDateTime
        }
      }
      const bodyPayload = JSON.stringify(payload)
      return new Promise((resolve) => {
        this.$Worker.execute({
          action: 'api',
          method: 'post',
          url: 'wisdom/private/create',
          body: bodyPayload
        })
          .then(() => {
            this.getBoxes()
            this.newTask.name = ''
            this.newTask.description = ''
            this.newTask.categories = []
            this.hideNewTaskInputs()
            this.moveToSelectedTask()
          })
          .then(() => resolve())
          .catch((err) => {
            console.debug(err.message)
            this.noResults = true
          })
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
    toggleAndFocusNewTask: function (id, display = 'block') {
      this.hideNewTaskInputs()
      this.toggleElement(id, display)
      const elem = document.getElementById(id)
      const input = document.getElementById(id + '_input')
      if (elem.style.display !== 'hidden') {
        input.focus()
        input.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        })
      } else {
        input.blur()
      }
    },
    auto_grow: function (id) {
      const elem = document.getElementById(id)
      elem.style.height = '32px' // Default
      elem.style.height = (elem.scrollHeight) + 'px' // Grow if scrollHeight > 0
    },
    finishTask: async function (task, doDelete = false) {
      if (task == null) return
      let endpoint = 'finish'
      if (doDelete) endpoint = 'delete'
      return new Promise((resolve) => {
        this.$Worker.execute({
          action: 'api',
          method: 'get',
          url: 'wisdom/private/' + endpoint + '/' + task.uid
        })
          .then(() => {
            if (this.isShowingTask) this.isShowingTask = false
            this.getBoxes()
            this.resetLastSelection()
          })
          .then(() => resolve)
          .catch((err) => {
            this.$notify(
              {
                title: 'Error!',
                text: 'Maybe you aren\'t the owner or a collaborator of this entry?',
                type: 'error'
              })
            console.debug(err.message)
          })
      })
    },
    hideNewTaskInputs: function () {
      const elements = document.getElementsByClassName('p_new_task_disclosure')
      for (let i = 0; i < elements.length; i++) {
        elements[i].style.display = 'none'
      }
    },
    gotoWisdom: function (id) {
      if (id == null) return
      this.$router.push('/apps/knowledge/' + id + '?src=' + this.srcGUID)
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
    openTaskFromUID: function (guid) {
      let done = false
      if (this.boxes.length < 1) return
      for (let i = 0; i < this.boxes.length; i++) {
        if (done) break
        if (this.boxes[i].tasks.length < 1) continue
        for (let j = 0; j < this.boxes[i].tasks.length; j++) {
          if (this.boxes[i].tasks[j].uid === guid) {
            this.openTask(this.boxes[i].tasks[j])
            done = true
            break
          }
        }
      }
    },
    openTask: async function (task) {
      if (!task.uid) return
      if (this.drag) return
      const tTask = task
      if (tTask.due) {
        try {
          const lDT = DateTime.fromISO(tTask.due)
          tTask.dueDateFormatted = lDT.toISODate()
          tTask.dueTimeFormatted = lDT.toLocaleString(DateTime.TIME_24_WITH_SECONDS)
        } catch (e) {
          console.debug(e.message)
          tTask.dueDateFormatted = ''
          tTask.dueTimeFormatted = ''
        }
      }
      tTask.name = await dbGetDisplayName(tTask.usr)
      this.showingTask = tTask
      this.showingTask.replies = []
      this.isShowingTask = true
      this.isShowingTaskHistory = false
      this.renderMermaid()
      await this.getRelated(task)
      this.renderMermaid()
    },
    getRelated: async function (task, showingTask = true) {
      this.showingTaskRelated = []
      this.taskRelated = []
      return new Promise((resolve) => {
        this.$Worker.execute({
          action: 'api',
          method: 'get',
          url: 'wisdom/private/investigate/' + task.uid
        })
          .then(async (data) => {
            if (data.result.replies != null && data.result.replies.length > 0) {
              for (let i = 0; i < data.result.replies.length; i++) {
                data.result.replies[i].name = await dbGetDisplayName(data.result.replies[i].usr)
              }
            }
            if (showingTask) {
              this.showingTaskRelated = data.result
            } else {
              this.taskRelated = data.result
            }
          })
          .then(() => {
            resolve()
          })
          .catch((err) => {
            console.debug(err.message)
          })
      })
    },
    handleEnter: async function () {
      const ev = event
      if (ev.repeat) return
      if (ev.key === 'Enter') {
        if (ev.shiftKey) return
        ev.preventDefault()
        if (this.isShowingTask) {
          await this.submitComment()
        } else if (this.isSearching) {
          await this.searchWisdom()
        }
      }
    },
    submitComment: async function () {
      if (!this.isWritingComment) {
        this.isWritingComment = true
        await this.postComment()
      }
    },
    postComment: async function () {
      if (this.showingTaskComment.trim() === '') return
      const payload = {
        t: '',
        desc: this.showingTaskComment.trim(),
        ref: this.showingTask.uid,
        keys: '',
        pid: this.knowledge.uid,
        type: 'reply'
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
            this.getRelated(this.showingTask)
            this.resetValues()
            setTimeout(() => {
              this.inputComment.blur()
              this.auto_grow('input_comment')
            }, 0)
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
      this.showingTaskComment = ''
    },
    toggleSidebar: function (initial = false) {
      if (!initial) {
        this.$store.commit('togglePlannerCalendar')
      }
      const sidebarActive = this.$store.getters.isPlannerCalendarOpen()
      const sidebarElem = document.getElementById('sidebar')
      if (!sidebarElem) return
      if (sidebarActive && !sidebarElem.classList.contains('active')) {
        sidebarElem.classList.add('active')
        const calendarApi = this.$refs.fullCalendar.getApi()
        calendarApi.updateSize()
        return
      }
      if (!sidebarActive) {
        sidebarElem.classList.remove('active')
      }
    },
    handleDocumentKeypress: function (event) {
      if (event.key === '[') {
        if (document.activeElement && document.activeElement.classList.contains('p_input')) return
        event.preventDefault()
        this.toggleSidebar()
      }
    },
    handleDocumentKeyUp: async function (event) {
      const ev = event
      if (ev.key === 'Escape') {
        ev.preventDefault()
        this.hideNewTaskInputs()
        if (!this.isShowingTask) {
          this.isSearching = false
        }
        this.isShowingTask = false
        this.isSharingTask = false
        document.activeElement.blur()
        document.body.focus()
        this.sharing.collaborators = []
        this.moveToSelectedTask()
      } else if (ev.key === 't') {
        if (this.isShowingTask) return
        if (document.activeElement && document.activeElement.classList.contains('p_input')) return
        if (!this.isTaskSelectionInitial()) {
          if (!this.boxes[this.selection.row]) return
          ev.preventDefault()
          this.toggleAndFocusNewTask('taskname_' + this.boxes[this.selection.row].box.uid)
        }
      } else if (ev.key === 'c') {
        if (!this.isShowingTask) return
        if (document.activeElement && document.activeElement.classList.contains('p_input')) return
        ev.preventDefault()
        const elem = document.getElementById('input_comment')
        if (elem) elem.focus()
      } else if (ev.key === 'r') {
        if (this.isShowingTask) return
        if (document.activeElement && document.activeElement.classList.contains('p_input')) return
        ev.preventDefault()
        await this.getBoxes()
        this.renderMermaid()
      } else if (ev.key === 'f') {
        if (this.isShowingTask) return
        if (document.activeElement && document.activeElement.classList.contains('p_input')) return
        ev.preventDefault()
        this.openSearch()
      } else if (ev.key === 'h') {
        if (!this.isShowingTask) return
        if (document.activeElement && document.activeElement.classList.contains('p_input')) return
        ev.preventDefault()
        this.showTaskHistory()
      } else if (ev.key === 'l') {
        if (this.isShowingTask) return
        if (document.activeElement && document.activeElement.classList.contains('p_input')) return
        this.isListView = !this.isListView
      }
    },
    handleDocumentKeyDown: function (event) {
      const ev = event
      if (ev.key === 'Enter') {
        if (this.isShowingTask) return
        if (document.activeElement && document.activeElement.classList.contains('p_input')) return
        ev.preventDefault()
        if (!this.isTaskSelectionInitial()) {
          if (!this.boxes[this.selection.row] ||
            !this.boxes[this.selection.row].tasks ||
            !this.boxes[this.selection.row].tasks[this.selection.col]) {
            return
          }
          this.openTask(this.boxes[this.selection.row].tasks[this.selection.col])
        }
      } else if (ev.key === 'ArrowUp' || ev.key === 'ArrowRight' || ev.key === 'ArrowDown' || ev.key === 'ArrowLeft') {
        if (this.isShowingTask) return
        if (document.activeElement && document.activeElement.classList.contains('p_input')) return
        // Prevent scrolling with arrow keys
        ev.preventDefault()
        this.hideNewTaskInputs()
        if (ev.key === 'ArrowUp') {
          this.moveTaskSelection('up')
        } else if (ev.key === 'ArrowRight') {
          this.moveTaskSelection('right')
        } else if (ev.key === 'ArrowDown') {
          this.moveTaskSelection('down')
        } else if (ev.key === 'ArrowLeft') {
          this.moveTaskSelection('left')
        }
      }
    },
    moveTaskSelection: function (direction) {
      if (this.boxes.length < 1 || !this.boxes[0].tasks) {
        this.selection.row = -1
        this.selection.col = -1
        return
      }
      if (direction === 'up') {
        this.moveAndMarkTask(0, -1)
      } else if (direction === 'right') {
        this.moveAndMarkTask(1, 0)
      } else if (direction === 'down') {
        this.moveAndMarkTask(0, 1)
      } else if (direction === 'left') {
        this.moveAndMarkTask(-1, 0)
      }
    },
    moveAndMarkTask: function (xPlus, yPlus) {
      let isInitial = false
      if (this.isTaskSelectionInitial()) {
        isInitial = true
        this.selection.row = 0
        this.selection.col = 0
        xPlus = 0
        yPlus = 0
      }
      let xPos = this.selection.row + xPlus
      let yPos = this.selection.col + yPlus
      // Check if what we're going to move to exists
      let tBox = this.boxes[xPos]
      // Return if the box does not exist
      if (!tBox) return
      if (!tBox.tasks) {
        tBox = null
        let xPosTemp = xPos
        while (!tBox) {
          xPosTemp += xPlus
          tBox = this.boxes[xPosTemp]
          // Return if there are no other boxes available
          if (!tBox) return
          if (!tBox.tasks) {
            tBox = null
            continue
          }
          xPos = xPosTemp
        }
      }
      let tTask = tBox.tasks[yPos]
      // Check if there is a task at the specified coordinates
      if (!tTask) {
        if (yPos < 0) return
        // If there are tasks but the specified Y position was too high, set it to the highest possible
        yPos = tBox.tasks.length - 1
        tTask = tBox.tasks[yPos]
      }
      // Now check if the task is visible
      let taskElem = document.getElementById('taskcontainer_' + tTask.uid)
      if (!taskElem || taskElem.style.display === 'none') {
        // Task is invisible or does not exist -> Check for others in this column
        tTask = null
        let yPosTemp = yPos
        let yIncrease = yPlus
        if (yIncrease === 0) {
          if (yPosTemp > 0) {
            yIncrease = -1
          } else {
            yIncrease = 1
          }
        }
        while (!tTask) {
          yPosTemp += yIncrease
          tTask = tBox.tasks[yPosTemp]
          // Return if there are no other tasks available
          if (!tTask) {
            // If we're moving sideways anyway try to skip to the next box
            if (isInitial) xPlus = 1
            if (xPlus !== 0) this.moveAndMarkTask(xPlus + xPlus, yPlus)
            return
          }
          taskElem = document.getElementById('taskcontainer_' + tTask.uid)
          if (taskElem.style.display === 'none') {
            tTask = null
            continue
          }
          yPos = yPosTemp
        }
      }
      // Reset previous task's active class
      const id = 'task_' + this.boxes[this.selection.row].tasks[this.selection.col].uid
      const elemOld = document.getElementById(id)
      if (elemOld) {
        elemOld.classList.remove('active')
      }
      // Now change to new position
      this.selection.row = xPos
      this.selection.col = yPos
      this.moveToSelectedTask(true)
    },
    isTaskSelectionInitial: function () {
      return (this.selection.row === -1 && this.selection.col === -1)
    },
    setTaskDueDate: function () {
      this.updateTaskDueDate(this.showingTask.uid)
    },
    updateTaskDueDate: function (guid, start, end) {
      if (start == null || start === '') {
        let combinedDateTime = ''
        if (this.showingTask.dueDateFormatted) {
          combinedDateTime = this.showingTask.dueDateFormatted
        }
        // Get current timezone offset
        const o = DateTime.now()
        let c = ''
        if (o.isOffsetFixed && o.offset === 0) {
          c += 'Z'
        } else if (o.o < 0) {
          c += '-'
          c += this.padStart(Math.trunc(-o.o / 60))
          c += ':'
          c += this.padStart(Math.trunc(-o.o % 60))
        } else {
          c += '+'
          c += this.padStart(Math.trunc(o.o / 60))
          c += ':'
          c += this.padStart(Math.trunc(o.o % 60))
        }
        // Attach time
        if (this.showingTask.dueTimeFormatted) {
          // If there was no date set, assume the current date was meant and set it accordingly
          if (combinedDateTime === '') {
            combinedDateTime = new Date().toISOString().split('T')[0]
            this.showingTask.due = combinedDateTime
          }
          // Add time either way
          combinedDateTime += 'T' + this.showingTask.dueTimeFormatted
          // Add seconds if missing
          if (this.showingTask.dueTimeFormatted.length === 5) {
            combinedDateTime += ':00'
          }
          // Add timezone offset
          combinedDateTime += c
        } else {
          if (combinedDateTime !== '') {
            combinedDateTime += 'T00:00:00' + c
            this.showingTask.dueTimeFormatted = '00:00'
          }
        }
        start = combinedDateTime
      } else {
        start = start.toISOString()
      }
      return new Promise((resolve) => {
        // Create reminder (wikiric periodic action)
        const recipients = []
        recipients.push({ usr: this.$store.state.username })
        this.$Worker.execute({
          action: 'api',
          method: 'post',
          url: 'wisdom/private/reminder/' + guid,
          body: JSON.stringify({
            t: this.showingTask.t,
            desc: this.showingTask.desc,
            due: start,
            recipients: recipients
          })
        })
        if (end) {
          this.$Worker.execute({
            action: 'api',
            method: 'post',
            url: 'wisdom/private/mod/' + guid,
            body: JSON.stringify({
              type: 'edit',
              field: 'due',
              new: start
            })
          })
            .then(() => {
              this.$Worker.execute({
                action: 'api',
                method: 'post',
                url: 'wisdom/private/mod/' + guid,
                body: JSON.stringify({
                  type: 'edit',
                  field: 'dueEnd',
                  new: end.toISOString()
                })
              })
                .then(() => {
                  this.getBoxes()
                })
                .then(() => resolve())
                .catch((err) => {
                  console.debug(err.message)
                })
            })
        } else {
          this.$Worker.execute({
            action: 'api',
            method: 'post',
            url: 'wisdom/private/mod/' + guid,
            body: JSON.stringify({
              type: 'edit',
              field: 'due',
              new: start
            })
          })
            .then(() => {
              this.getBoxes()
            })
            .then(() => resolve())
            .catch((err) => {
              console.debug(err.message)
            })
        }
      })
    },
    padStart: function (input, n = 2) {
      const isNeg = input < 0
      let padded
      if (isNeg) {
        padded = '-' + ('' + -input).padStart(n, '0')
      } else {
        padded = ('' + input).padStart(n, '0')
      }
      return padded
    },
    searchWisdom: async function () {
      this.resetLastSelection()
      this.selection.row = -1
      this.selection.col = -1
      this.results = []
      let filterOverrideArgs = ''
      if (this.filters.filterTitle) filterOverrideArgs += 'title,'
      if (this.filters.filterKeywords) filterOverrideArgs += 'keys,'
      if (this.filters.filterDescription) filterOverrideArgs += 'desc,'
      if (this.filters.filterAuthor) filterOverrideArgs += 'usr,'
      const payload = {
        query: this.searchQuery,
        type: 'task',
        fields: filterOverrideArgs
      }
      return new Promise((resolve) => {
        if (this.searchQuery === '' || this.searchQuery === '.') {
          this.resetSearchResults()
          resolve()
          return
        }
        this.setVisibilityOfBoxesAndTasks('none')
        this.$Worker.execute({
          action: 'api',
          method: 'post',
          url: 'wisdom/private/query/' + this.knowledge.uid,
          body: JSON.stringify(payload)
        })
          .then((data) => {
            const parsedData = data.result
            if (parsedData.tasks && parsedData.tasks.length > 0) {
              this.addResults(parsedData.tasks, 'task')
            }
          })
          .then(() => {
            // Make tasks visible if they are part of the search results
            let elem
            for (let i = 0; i < this.results.length; i++) {
              // Display box
              if (!this.isListView) {
                elem = document.getElementById('boxcontainer_' + this.results[i].result.ref)
              } else {
                elem = document.getElementById('list_box_' + this.results[i].result.ref)
              }
              if (elem) elem.style.display = ''
              // Display task
              if (!this.isListView) {
                elem = document.getElementById('taskcontainer_' + this.results[i].result.uid)
              } else {
                elem = document.getElementById('list_task_' + this.results[i].result.uid)
              }
              if (elem) elem.style.display = ''
            }
          })
          .then(() => resolve())
          .catch((err) => {
            console.debug(err.message)
          })
      })
    },
    addResults: function (results, type) {
      let entry
      console.log(results)
      for (let i = 0; i < results.length; i++) {
        results[i].t = this.formatTitle(results[i].t)
        entry = {
          priority: 'high',
          type: type,
          result: results[i]
        }
        this.results.push(entry)
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
    openSearch: function () {
      this.isSearching = true
      setTimeout(() => {
        const elem = document.getElementById('search_input')
        elem.focus()
      }, 0)
    },
    resetSearchResults: function () {
      this.searchQuery = ''
      this.filters.filterTitle = true
      this.filters.filterKeywords = true
      this.filters.filterDescription = true
      this.filters.filterAuthor = true
      this.setVisibilityOfBoxesAndTasks('')
    },
    moveToSelectedTask (setActive = false) {
      if (this.selection.row === -1 || this.selection.col === -1) return
      // Set active class for currently selected tasks
      const idContainer = 'taskcontainer_' + this.boxes[this.selection.row].tasks[this.selection.col].uid
      const id = 'task_' + this.boxes[this.selection.row].tasks[this.selection.col].uid
      const elemContainer = document.getElementById(idContainer)
      const elem = document.getElementById(id)
      if (elemContainer) {
        elemContainer.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        })
      }
      if (elem && setActive) {
        elem.classList.add('active')
      }
    },
    showTaskHistory: function () {
      this.isShowingTaskHistory = !this.isShowingTaskHistory
      this.showingTaskHistory = []
      let elem
      for (let i = 0; i < this.showingTask.history.length; i++) {
        elem = JSON.parse(this.showingTask.history[i])
        elem.date = new Date(parseInt(elem.date, 16) * 1000)
        this.showingTaskHistory.unshift(elem)
      }
    },
    capitalizeFirstLetter: function ([first, ...rest], locale = navigator.language) {
      return first === undefined ? '' : first.toLocaleUpperCase(locale) + rest.join('')
    },
    showingTaskKeyup: function () {
      this.handleEnter()
      this.auto_grow('input_comment')
    },
    resetLastSelection: function () {
      if (!this.isTaskSelectionInitial()) {
        const id = 'task_' + this.boxes[this.selection.row].tasks[this.selection.col].uid
        const elemOld = document.getElementById(id)
        if (elemOld) {
          elemOld.classList.remove('active')
        }
        this.selection.row = -1
        this.selection.col = -1
      }
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
    showShareTask: function (group, taskOverride = null) {
      if (taskOverride) {
        this.showingTask = taskOverride
      }
      this.sharing.chatroom = null
      this.sharing.group = group
      this.isSharingTask = true
      this.getClarifierMetaData(group.id)
    },
    getClarifierMetaData: function (sessionID) {
      if (sessionID == null || sessionID === 'undefined') {
        this.$notify(
          {
            title: 'Invalid Group GUID',
            text: '',
            type: 'error'
          })
        return
      }
      return new Promise((resolve) => {
        this.$Worker.execute({
          action: 'api',
          method: 'get',
          url: 'chat/private/get/' + sessionID
        })
          .then((data) => {
            this.sharing.chatroom = data.result
          })
          .then(resolve())
          .catch((err) => console.debug(err.message))
      })
    },
    shareTask: async function () {
      const message = {
        message: this.sharing.message,
        guid: this.showingTask.uid
      }
      const prefix = '[c:TASK]'
      const bodyPayload = {
        uniChatroomGUID: this.sharing.selectedSubchat,
        text: prefix + JSON.stringify(message)
      }
      return new Promise((resolve) => {
        this.$Worker.execute({
          action: 'api',
          method: 'post',
          url: 'm5/addmessage',
          body: JSON.stringify(bodyPayload)
        })
          .then(() => {
            this.sharing.message = ''
            this.sharing.selectedSubchat = ''
            this.sharing.chatroom = null
            this.sharing.group = null
            this.isSharingTask = false
          })
          .then(() => resolve)
          .catch((err) => {
            console.debug(err.message)
          })
      })
    },
    setVisibilityOfBoxesAndTasks: function (display = '') {
      let elements
      // Boxes
      if (!this.isListView) {
        elements = document.getElementsByClassName('box_container')
      } else {
        elements = document.getElementsByClassName('list_boxcontainer')
      }
      for (let i = 0; i < elements.length; i++) {
        elements[i].style.display = display
      }
      // Tasks
      if (!this.isListView) {
        elements = document.getElementsByClassName('task_container')
      } else {
        elements = document.getElementsByClassName('list_taskcontainer')
      }
      for (let i = 0; i < elements.length; i++) {
        elements[i].style.display = display
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
    addTaskCollaborators: function () {
      if (this.sharing.collaborators.length < 1) return
      const payload = {
        collaborators: []
      }
      for (let i = 0; i < this.sharing.collaborators.length; i++) {
        payload.collaborators.push({
          username: this.sharing.collaborators[i].usr,
          roles: [],
          add: true
        })
      }
      return new Promise((resolve) => {
        this.$Worker.execute({
          action: 'api',
          method: 'post',
          url: 'm7/modifycollab/' + this.showingTask.uid,
          body: JSON.stringify(payload)
        })
          .then(() => {
            this.sharing.collaborators = []
          })
          .then(() => (
            this.getBoxes()
          ))
          .then(() => (
            this.$notify(
              {
                title: 'Success',
                text: 'Collaborator(s) submitted.',
                type: 'info'
              })
          ))
          .then(() => resolve)
          .catch((err) => {
            console.debug(err.message)
          })
      })
    },
    preventDefaultFun: function (event) {
      event.preventDefault()
    },
    createKnowledge: async function () {
      const payload = {
        mainChatroomGUID: this.srcGUID,
        title: this.titleCreation,
        description: this.descriptionCreation,
        keywords: this.keywordsCreation,
        isPrivate: true
      }
      return new Promise((resolve) => {
        this.$Worker.execute({
          action: 'api',
          method: 'post',
          url: 'm7/create',
          body: JSON.stringify(payload)
        })
          .then(() => {
            this.knowledgeExists = true
            if (this.srcguid) this.getKnowledge(this.srcguid)
          })
          .then(() => resolve())
          .catch((err) => console.debug(err.message))
      })
    },
    handleDragChange: function (e) {
      const prefix = 'box_tasks_guid_'
      if (e.added) {
        // Moved to another box!
        console.log(e.added.element.uid, 'MOVED to index', e.added.newIndex,
          'for new box', this.lastDragMove.to.parentElement.id.substring(prefix.length))
        // Set new rowIndex and boxGUID for this task!
        this.moveTask(e.added.element.uid, e.added.newIndex,
          this.lastDragMove.to.parentElement.id.substring(prefix.length))
      } else if (e.moved) {
        // Moved inside current box.
        console.log(e.moved.element.uid, 'MOVED to index', e.moved.newIndex)
        // Set new rowIndex for this task!
        this.moveTask(e.moved.element.uid, e.moved.newIndex,
          this.lastDragMove.to.parentElement.id.substring(prefix.length))
      }
    },
    handleDragMove: function (e) {
      this.lastDragMove = e
    },
    moveTask: function (taskGUID, newRowIndex, boxGUID) {
      for (const i in this.boxes) {
        if (this.boxes[i].box.uid === boxGUID) {
          if (this.boxes[i].tasks && this.boxes[i].tasks.length > 1) {
            if (newRowIndex > 0) {
              // rowIndex != 0 so compare the tasks before and after
              const rowIndexTaskBefore = this.boxes[i].tasks[newRowIndex - 1].row
              if (this.boxes[i].tasks.length - 1 > newRowIndex) {
                const rowIndexTaskAfter = this.boxes[i].tasks[newRowIndex + 1].row
                newRowIndex = Math.floor((rowIndexTaskBefore + rowIndexTaskAfter) / 2)
              } else {
                newRowIndex = rowIndexTaskBefore + 20000
              }
            } else {
              // rowIndex = 0 so just look at the second task if it exists
              newRowIndex = Math.floor(this.boxes[i].tasks[1].row / 2)
            }
          } else {
            // First task => Set it to 0
            newRowIndex = 20000
          }
        }
      }
      if (newRowIndex <= 1) {
        newRowIndex = 0.5
      }
      console.log('New Row Index:', newRowIndex)
      const payload = {
        row: newRowIndex,
        toId: boxGUID
      }
      const bodyPayload = JSON.stringify(payload)
      return new Promise((resolve) => {
        this.$Worker.execute({
          action: 'api',
          method: 'post',
          url: 'wisdom/private/move/' + taskGUID,
          body: bodyPayload
        })
          .then(() => {
            this.getBoxes()
          })
          .then(() => resolve())
          .catch((err) => {
            console.debug(err.message)
            this.noResults = true
          })
      })
    },
    endDrag: function () {
      setTimeout(() => (this.drag = false), 100)
    }
  }
}
</script>

<style>

/* Coloring / Shape */
.p_card {
  @apply bright_bg rounded text-neutral-300;
}

/* Sizing */
.p_card {
  @apply min-w-[256px] max-w-[256px] h-fit m-1;
}

.p_input {
  @apply rounded py-1 px-3 dark_bg hover:darkest_bg focus:darkest_bg placeholder-neutral-400;
}

.p_input_icon {
  @apply pl-8;
}

.p_card_header_section {
  @apply min-h-[36px];
}

.p_task_overlay {
  opacity: 0;
}

.p_task:hover .p_task_overlay {
  opacity: 1;
}

.p_card_menu_active {
  @apply darkest_bg bg-opacity-60 text-white font-bold;
}

.p_card_menu_item {
  @apply flex w-full items-center rounded-md px-1 py-2 text-sm;
}

.p_card_menu_list_medium_p {
  @apply absolute right-0 mt-2 w-56 origin-top-right divide-y divide-zinc-400 rounded-md
  shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10;
}

.p_card_menu_list_big_p {
  @apply absolute mt-2 w-80 divide-y divide-zinc-400 border-[1px] border-zinc-400
  shadow-zinc-900 shadow-2xl rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10;
}

.p_markdown p {
  @apply mb-4;
}

.p_markdown p:last-child {
  @apply m-0;
}

.p_markdown a {
  @apply underline;
}

.p_markdown ul {
  @apply list-disc list-inside mb-2;
}

.p_markdown ol {
  @apply list-decimal list-inside mb-3;
}

.p_markdown pre {
  @apply mb-2;
}

.p_markdown table {
  @apply mb-4;
}

.p_markdown th, .p_markdown td {
  @apply p-2 border border-zinc-600;
}

.p_markdown tr {
  @apply hover:dark_bg;
}

.p_markdown_xl_only h1,
.p_markdown_xl_only h2,
.p_markdown_xl_only h3,
.p_markdown_xl_only h4,
.p_markdown_xl_only h5 {
  @apply text-xl mb-2 !important;
}

.p_markdown h1 {
  @apply text-5xl mb-2;
}

.p_markdown h2 {
  @apply text-4xl mb-2;
}

.p_markdown h3 {
  @apply text-3xl mb-2;
}

.p_markdown h4 {
  @apply text-2xl mb-2;
}

.p_markdown h5 {
  @apply text-xl mb-2;
}

.p_markdown h6 {
  @apply text-lg;
}

.sidebar_tooltip {
  @apply absolute translate-x-16 -translate-y-9 opacity-0 font-bold pointer-events-none hidden lg:block;
}

.sidebar_button:hover {
  @apply medium_bg;
}

.sidebar_button:hover .sidebar_tooltip {
  @apply opacity-100;
}

.p_sidebar_left {
  @apply w-7 overflow-x-hidden;
}

.p_sidebar_left > .p_sidebar_toggler {
  @apply bright_bg hover:brightest_bg;
}

.p_sidebar_left.active {
  @apply min-w-[95dvw] max-w-[95dvw];
}

.p_sidebar_left.active > .p_sidebar_toggler {
  background-color: unset;
  @apply hover:bright_bg;
}

.p_task.active,
.p_taskshadow.active {
  box-shadow: 0 0 0 2px white;
}

.p_task:hover,
.p_taskshadow:hover {
  box-shadow: 0 0 0 2px white;
}

.p_task {
  @apply mb-1 mx-1 w-[calc(100%-0.5rem)] medium_bg rounded
  flex items-center relative cursor-pointer
  dshadow;
}

#board {
  scrollbar-width: none;
}

/* Works on Chrome, Edge, and Safari */
#board::-webkit-scrollbar {
  display: none;
}

.fc .fc-timegrid-day.fc-day-today {
  @apply bg-white bg-opacity-20;
}

.fc .fc-timegrid-day.fc-day-today .fc-timegrid-day-number {
  @apply text-neutral-100 font-bold;
}

.fc .fc-timegrid-day {
  @apply hover:bg-white hover:bg-opacity-10 rounded-md;
}

.fc .fc-timegrid {
  @apply rounded-md darkest_bg p-2 mx-2;
}

.fc .fc-toolbar.fc-header-toolbar {
  @apply pl-4 pr-2 py-2 mx-2 mb-2 darkest_bg rounded-md;
}

.fc-theme-standard td, .fc-theme-standard th {
  @apply border-zinc-600;
}

.fc-theme-standard .fc-scrollgrid {
  @apply border-none;
}

.fc .fc-timegrid-day-number {
  text-decoration: none;
  @apply text-neutral-300 cursor-default;
}

.fc .fc-toolbar-title {
  @apply cursor-default;
}

.fc .fc-scroller {
  scrollbar-color: transparent transparent !important;
}

.fc .fc-scroller::-webkit-scrollbar-track {
  background-color: transparent !important;
}

.fc .fc-scroller::-webkit-scrollbar-thumb {
  background-color: transparent !important;
}

.fc .fc-v-event {
  @apply bg-blue-900 border-blue-700 px-1 py-0.5;
}

.fc .fc-event-title {
  @apply text-neutral-300 text-sm font-bold;
}

.ghost {
  @apply m-2 brightest_bg border-2 border-zinc-200 rounded;
}

.ghost * {
  @apply opacity-0;
}

.chosen {
  @apply opacity-100 -rotate-3;
}

.due_date {
  @apply flex items-center text-neutral-300 p-2 mt-1 mx-1 mb-2
  bg-orange-700 bg-opacity-25 justify-between rounded
  border-[1px] border-orange-800;
}

</style>
