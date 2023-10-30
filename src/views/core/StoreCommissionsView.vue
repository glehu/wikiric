<template>
  <div class="flex w-full h-full pt-[55px] justify-center">
    <div class="max-w-screen-xl w-full bright_bg
                rounded-t overflow-x-hidden
                overflow-y-auto">
      <div class="px-4 py-3 medium_bg bshadow z-10">
        <p class="text-3xl font-bold text-neutral-300">
          {{ $t("eco.commissions") }}
        </p>
      </div>
      <div class="pt-2 z-0 relative">
        <template v-if="ownStore != null">
          <div class="w-full h-full p-2 pb-16">
            <div class="rounded medium_bg w-fit mx-2 mb-4
                        overflow-hidden dshadow">
              <div class="px-3 py-1 dark_bg">
                <div class="">
                  <p class="font-bold text-xl">
                    {{ ownStore.t }}
                  </p>
                  <p class="text-sm text-neutral-400">
                    {{ ownStore.desc }}
                  </p>
                </div>
              </div>
            </div>
            <div class="rounded medium_bg w-fit mx-2 mb-4
                      overflow-hidden dshadow">
              <template v-if="orders && orders.length < 1">
                <div class="flex items-center dark_bg px-3 py-1 cursor-default">
                  <p class="text-neutral-300">
                    {{ $t("commissions.none") }}
                  </p>
                </div>
              </template>
              <template v-else>
                <div class="flex items-center dark_bg px-3 py-1 cursor-default">
                  <p class="text-neutral-300">
                    {{ orders.length }} {{ $t("commissions.listed") }}
                  </p>
                </div>
                <p class="text-sm text-neutral-300 px-3 py-1 my-2 cursor-default">
                  {{ $t("commissions.desc") }}
                </p>
                <p class="text-sm text-neutral-300 px-3 py-1 my-2 cursor-default">
                  {{ $t("commissions.btnReportDesc") }}
                </p>
                <div class="grid grid-cols-1 gap-y-2 w-[175px] my-4">
                  <div class="px-3 py-1 dark_bg hover:darkest_bg
                              rounded-r cursor-pointer
                              border-b-[2px] border-r-[2px]
                              border-indigo-500"
                       v-on:click="generateReport()">
                    <p class="px-2 py-1 text-sm font-bold text-neutral-300">
                      {{ $t("commissions.btnReport") }}
                    </p>
                  </div>
                </div>
              </template>
            </div>
            <template v-if="orders && orders.length > 0">
              <div class="m-2 flex flex-col gap-y-4">
                <template v-for="order in orders" :key="order">
                  <div class="px-3 py-2 rounded medium_bg overflow-hidden">
                    <div class="flex items-center gap-x-2">
                      <DocumentTextIcon
                        class="w-12 h-12 text-neutral-300"/>
                      <div>
                        <p class="font-bold text-xl mb-1">
                          {{ getHumanReadableDateText(order.ts) }}
                        </p>
                        <p class="text-neutral-400 text-xs">
                          OrderID: {{ order.uid }}
                        </p>
                      </div>
                    </div>
                    <div class="flex gap-2 my-2 flex-wrap">
                      <table class="ftable h-fit"
                             style="margin-bottom: 0 !important">
                        <tr>
                          <td>{{ $t("eco.billing") }}:</td>
                          <td>
                            <p class="px-2 py-1 rounded dark_bg">
                              {{ $t("orderState." + order.bstate) }}
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td>{{ $t("eco.delivery") }}:</td>
                          <td>
                            <p class="px-2 py-1 rounded dark_bg">
                              {{ $t("orderState." + order.dstate) }}
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td>{{ $t("eco.commission") }}:</td>
                          <td>
                            <p class="px-2 py-1 rounded dark_bg">
                              {{ $t("orderState." + order.state) }}
                            </p>
                          </td>
                        </tr>
                      </table>
                      <div class="flex py-2 dark_bg w-fit
                                  items-center border-[1px]
                                  border-neutral-500
                                  flex-col px-4 justify-center">
                        <p class="text-3xl font-bold text-green-500">
                          + {{ order.net }} €
                        </p>
                        <p class="text-neutral-400 text-sm">
                          {{ order.gross }} € {{ $t("eco.withVat") }}
                        </p>
                      </div>
                      <div class="py-2 flex flex-wrap gap-x-4 gap-y-4">
                        <div class="w-fit">
                          <p class="font-bold px-3 py-1 rounded dark_bg text-neutral-300">
                            {{ $t("eco.delivery") }}
                          </p>
                          <div class="p-2">
                            <p>{{ order.delivery.companyName }}</p>
                            <p>{{ order.delivery.first }} {{ order.delivery.last }}</p>
                            <p>{{ order.delivery.country }}</p>
                            <p>{{ order.delivery.stateName }}</p>
                            <p>{{ order.delivery.postcode }} {{ order.delivery.city }}</p>
                            <p>{{ order.delivery.street }}</p>
                          </div>
                        </div>
                        <div class="w-fit">
                          <p class="font-bold px-3 py-1 rounded dark_bg text-neutral-300">
                            {{ $t("eco.billing") }}
                          </p>
                          <div class="p-2">
                            <p>{{ order.billing.companyName }}</p>
                            <p>{{ order.billing.first }} {{ order.billing.last }}</p>
                            <p>{{ order.billing.country }}</p>
                            <p>{{ order.billing.stateName }}</p>
                            <p>{{ order.billing.postcode }} {{ order.billing.city }}</p>
                            <p>{{ order.billing.street }}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="flex items-end my-4">
                      <div class="p-2 bright_bg flex gap-2
                                  rounded-md h-fit dshadow
                                  text-sm font-bold">
                        <div class="order_btn"
                             v-on:click="markPayment()">
                          <p>
                            {{ $t("eco.payment") }}
                          </p>
                        </div>
                        <div class="order_btn"
                             v-on:click="markDelivery()">
                          <p>
                            {{ $t("eco.delivery") }}
                          </p>
                        </div>
                        <div class="order_btn"
                             v-on:click="attemptStateChange(
                               order.uid, 'commission')">
                          <p>
                            {{ $t("gen.finish") }}
                          </p>
                        </div>
                        <div class="order_btn_danger"
                             v-on:click="attemptCancel(order.uid)">
                          <p>
                            {{ $t("gen.cancel") }}
                          </p>
                        </div>
                      </div>
                    </div>
                    <template v-if="order.items && order.items.length > 0">
                      <table class="ftable w-full"
                             style="margin-bottom: 0 !important">
                        <tr>
                          <th>#</th>
                          <th class="text-sm">
                            {{ $t("gen.amount") }}
                          </th>
                          <th class="text-sm">
                            {{ $t("gen.desc") }}
                          </th>
                          <th class="text-sm">
                            {{ $t("eco.total") }}
                          </th>
                        </tr>
                        <template v-for="(item, index) in order.items"
                                  :key="item">
                          <tr>
                            <td>
                              <p class="text-neutral-400">
                                {{ index + 1 }}
                              </p>
                            </td>
                            <td>
                              <p class="text-center text-lg">
                                {{ item.amt }}
                              </p>
                            </td>
                            <td>
                              <div class="p-2">
                                <p class="font-bold">
                                  {{ item.t }}
                                </p>
                                <div v-if="item.vars && item.vars.length > 0"
                                     class="mt-2">
                                  <template v-for="variation in item.vars" :key="variation">
                                    <div v-if="variation.vars && variation.vars[0] && variation.vars[0].sval"
                                         class="mt-2">
                                      <p>{{ variation.t }}</p>
                                      <p class="font-bold text-sm ml-2">
                                        * {{ variation.vars[0].sval }}
                                      </p>
                                    </div>
                                  </template>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div class="flex-col">
                                <p class="p-2 medium_bg rounded mt-1 text-end">
                                  {{ formatCurrency(item.net) }} €
                                </p>
                                <p class="p-2 text-end">
                                  {{ formatCurrency(item.net * (1 + item.vatp)) }} €
                                  <br>{{ $t("eco.withVat") }}
                                </p>
                              </div>
                            </td>
                          </tr>
                        </template>
                      </table>
                    </template>
                  </div>
                </template>
              </div>
            </template>
          </div>
        </template>
      </div>
    </div>
  </div>
  <modal
    v-show="isViewingReport"
    @close="isViewingReport = false">
    <template v-slot:header>
      View Report
    </template>
    <template v-slot:body>
      <template v-if="report && report.items && report.items.length > 0">
        <div class="mb-2 p-2 w-full rounded darkest_bg">
          <div class="hover:medium_bg w-fit px-2 py-1
                      rounded cursor-pointer"
               v-on:click="copyReport()">
            <p>
              {{ $t("gen.copyAsText") }}
              <span class="tooltip-mock-destination"
                    :class="{'show':showReportCopied,'hidden':!showReportCopied}">
                {{ $t("conf.copied") }}
              </span>
            </p>
          </div>
        </div>
        <table class="ftable w-[90vw] max-w-[750px]"
               style="margin-bottom: 0 !important">
          <tr>
            <th>#</th>
            <th>{{ $t("gen.amount") }}</th>
            <th>{{ $t("gen.desc") }}</th>
            <th>{{ $t("eco.total") }}</th>
          </tr>
          <template v-for="(item, index) in report.items"
                    :key="item">
            <tr>
              <td><span class="text-neutral-400">
                                {{ index + 1 }}
                              </span></td>
              <td><p class="text-center text-lg">
                {{ item.amt }}
              </p></td>
              <td>
                <div>
                  <p class="font-bold">
                    {{ item.t }}
                  </p>
                  <div v-if="item.vars && item.vars.length > 0"
                       class="mt-4">
                    <div>
                      <template v-for="variation in item.vars" :key="variation">
                        <p class="mt-2">
                          ({{ variation.nval }} x) {{ variation.t }}
                        </p>
                        <template v-for="subVariation in variation.vars" :key="subVariation">
                          <div v-if="subVariation && subVariation.sval"
                               class="text-sm">
                            <p class="font-bold ml-2">
                              * {{ subVariation.sval }}
                            </p>
                          </div>
                        </template>
                      </template>
                    </div>
                  </div>
                </div>
              </td>
              <td>
                <div class="flex-col">
                  <p class="p-2 medium_bg rounded mt-1 text-end">
                    {{ formatCurrency(item.net) }} €
                  </p>
                  <p class="p-2 text-end">
                    {{ formatCurrency(item.net * (1 + item.vatp)) }} €
                    <br>{{ $t("eco.withVat") }}
                  </p>
                </div>
              </td>
            </tr>
          </template>
        </table>
      </template>
    </template>
    <template v-slot:footer>
    </template>
  </modal>
  <modal
    v-show="isAttemptingCancel"
    @close="isAttemptingCancel = false">
    <template v-slot:header>
      {{ $t("gen.cancel") }}
    </template>
    <template v-slot:body>
      <div class="p-8">
        <p class="font-bold text-lg">
          {{ $t("gen.really") }} {{ $t("gen.cancel") }}?
        </p>
        <div class="order_btn_danger my-4"
             v-on:click="markCancel()">
          <p class="text-center font-bold">
            {{ $t("gen.cancel") }}
          </p>
        </div>
      </div>
    </template>
    <template v-slot:footer>
    </template>
  </modal>
  <modal
    v-show="isAttemptingStateChange"
    @close="isAttemptingStateChange = false">
    <template v-slot:header>
      <p>
        {{ $t("eco." + stateChange) }}
      </p>
    </template>
    <template v-slot:body>
      <div class="p-8">
        <template v-if="stateChange === 'commission'">
          <div class="order_btn my-4"
               v-on:click="markFinish()">
            <p class="text-center font-bold">
              {{ $t("gen.finish") }}
            </p>
          </div>
        </template>
      </div>
    </template>
    <template v-slot:footer>
    </template>
  </modal>
</template>

<script>
import { DateTime } from 'luxon'
import { DocumentTextIcon } from '@heroicons/vue/24/solid'
import modal from '@/components/Modal.vue'
import { toRaw } from 'vue'

export default {
  name: 'StoreInventoryView',
  components: {
    modal,
    DocumentTextIcon
  },
  data () {
    return {
      ownStore: null,
      orders: [],
      isAttemptingStateChange: false,
      isAttemptingCancel: false,
      isViewingReport: false,
      stateChange: '',
      showReportCopied: false,
      report: null,
      currentOrderId: ''
    }
  },
  mounted () {
    this.initFunction()
  },
  methods: {
    initFunction: async function () {
      await this.getOwnStore()
      await this.getOrders()
    },
    getOwnStore: function () {
      return new Promise((resolve) => {
        this.$Worker.execute({
          action: 'api',
          method: 'get',
          url: 'stores/private/get'
        })
          .then((data) => {
            this.ownStore = data.result
          })
          .catch((err) => {
            this.ownStore = null
            console.debug(err.message)
          })
          .finally(() => resolve())
      })
    },
    getOrders: function () {
      return new Promise((resolve) => {
        this.$Worker.execute({
          action: 'api',
          method: 'get',
          url: 'orders/private/commissions'
        })
          .then((data) => {
            for (let i = 0; i < data.result.orders.length; i++) {
              data.result.orders[i].gross = this.formatCurrency(
                data.result.orders[i].gross)
              data.result.orders[i].net = this.formatCurrency(
                data.result.orders[i].net)
            }
            this.orders = data.result.orders
            console.log(this.orders)
          })
          .catch((err) => {
            console.debug(err.message)
          })
          .finally(() => resolve())
      })
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
    formatCurrency: function (number) {
      const formatted = parseInt(number.toString()).toLocaleString()
      return formatted + '.' + number.toFixed(2).split('.')[1]
    },
    getItemCountText: function (count) {
      if (count === 1) {
        return 'Item'
      } else {
        return 'Items'
      }
    },
    generateReport: function () {
      return new Promise((resolve) => {
        this.$Worker.execute({
          action: 'api',
          method: 'get',
          url: 'orders/private/possum?summary=combinations'
        })
          .then((data) => {
            console.log(data.result)
            this.report = data.result
            this.isViewingReport = true
          })
          .finally(() => {
            resolve()
          })
      })
    },
    copyReport: function () {
      if (this.report == null) return
      let text = 'Order Report ' + DateTime.now().toLocaleString() + '\n\n'
      text += '---\n\n'
      let pos
      let vari
      let sub
      for (const posTmp in this.report.items) {
        pos = toRaw(this.report.items[posTmp])
        text += pos.amt.toFixed(0) + ' x ' + pos.t + '\n'
        for (const varTmp in pos.vars) {
          vari = toRaw(pos.vars[varTmp])
          text += '\t* (' + vari.nval.toFixed(0) + ' x)\n'
          for (const subTmp in vari.vars) {
            sub = toRaw(pos.vars[varTmp].vars[subTmp])
            text += '\t\t- ' + sub.sval + '\n'
          }
          text += '\n'
        }
        text += '\n'
      }
      text = text.trim()
      text += '\n\n---\n'
      this.showReportCopied = true
      navigator.clipboard.writeText(text)
      setTimeout(() => {
        this.showReportCopied = false
        text = ''
      }, 1000)
    },
    attemptStateChange: function (orderId, stateType) {
      this.currentOrderId = orderId
      this.stateChange = stateType
      this.isAttemptingStateChange = true
      this.isAttemptingCancel = false
    },
    markPayment: function () {
    },
    markDelivery: function () {
    },
    markFinish: function () {
      if (this.currentOrderId === '') return
      return new Promise((resolve) => {
        this.$Worker.execute({
          action: 'api',
          method: 'get',
          url: 'orders/private/cancel/' + this.currentOrderId
        })
          .then(() => {
            this.isAttemptingStateChange = false
            this.currentOrderId = ''
            this.getOrders()
          })
          .catch((err) => {
            console.debug(err.message)
          })
          .finally(() => resolve())
      })
    },
    attemptCancel: function (orderId) {
      this.currentOrderId = orderId
      this.isAttemptingCancel = true
    },
    markCancel: function () {
      if (this.currentOrderId === '') return
      return new Promise((resolve) => {
        this.$Worker.execute({
          action: 'api',
          method: 'get',
          url: 'orders/private/cancel/' + this.currentOrderId
        })
          .then(() => {
            this.isAttemptingCancel = false
            this.currentOrderId = ''
            this.getOrders()
          })
          .catch((err) => {
            console.debug(err.message)
          })
          .finally(() => resolve())
      })
    }
  },
  computed: {}
}
</script>

<style>

.search-field {
  color: white;
  border-radius: 10px;
  resize: none;
  overflow: hidden;
  width: 100%;
}

.store_item_edit_overlay {
  opacity: 0;
}

.store_item:hover .store_item_edit_overlay {
  opacity: 1;
}

.ftable {
  @apply table dark_bg;
}

.ftable tr {
}

.ftable th,
.ftable td {
  @apply px-2 py-1 border-[1px] border-neutral-500;
}

.order_btn {
  @apply p-2 medium_bg hover:darkest_bg rounded
  border-[1px] border-neutral-500
  cursor-pointer;
}

.order_btn_danger {
  @apply p-2 bg-red-900 hover:darkest_bg rounded
  border-[1px] border-red-600
  cursor-pointer;
}

</style>
