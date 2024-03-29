<template>
  <div id="checkoutAddresses"
       class="h-full w-full md:flex overflow-y-scroll md:overflow-hidden
              justify-evenly pt_nav">
    <div class="md:hidden p-2 flex items-center justify-center">
      <p>{{ $t("checkout.scrollDown") }}</p>
    </div>
    <div id="checkoutItems"
         class="background overflow-hidden w-full h-fit md:h-full bshadow">
      <div class="w-full h-full relative">
        <div class="px-4 py-2 flex surface-variant bshadow">
          <ShoppingCartIcon class="h-8 w-8 mr-4
                                  "/>
          <p class="font-bold text-2xl">
            {{ $t("stores.shoppingCart") }}
          </p>
        </div>
        <div class="flex justify-center
                    mt-2 px-4 py-2 h-full">
          <div class="max-w-[600px] w-full pr-2
                      overflow-y-auto pb-20">
            <div class="pt-2 px-2 h-full overflow-y-auto pb-20">
              <template v-if="$store.state.cart && $store.state.cart.length > 0">
                <div class="cursor-pointer px-1 rounded mb-2 mt-1 ml-1
                            bshadow w-fit surface"
                     v-on:click="$store.commit('clearCart')">
                  <p class="font-bold text-sm">
                    {{ $t("gen.clear") }}
                  </p>
                </div>
                <div class="flex flex-col gap-y-2">
                  <div class="px-4 py-2 mx-1 rounded surface w-fit"
                       style="border: 1px solid var(--md-sys-color-outline-variant)">
                    <p class="font-bold">
                      {{ $t("checkout.orderSummary") }}
                    </p>
                    <table class="table-auto mt-4 min-w-[250px]">
                      <tr>
                        <td><p>Net:</p></td>
                        <td><p class="text-end">
                          {{ ftotalNet }} €
                        </p></td>
                      </tr>
                      <tr>
                        <td><p>VAT:</p></td>
                        <td><p class="text-end">
                          {{ ftotalVAT }} €
                        </p></td>
                      </tr>
                      <tr>
                        <td>
                          <p class="font-bold text-xl">
                            {{ $t("eco.total") }}:
                          </p>
                        </td>
                        <td>
                          <p class="text-end font-bold text-xl">
                            {{ ftotalGross }} €
                          </p>
                        </td>
                      </tr>
                    </table>
                  </div>
                  <div v-for="cartItem in $store.state.cart" :key="cartItem.uid"
                       class="p-2 m-1 rounded surface"
                       style="border: 1px solid var(--md-sys-color-outline-variant)">
                    <p class="font-bold">{{ cartItem.t }}</p>
                    <p class="text-sm">{{ cartItem.desc }}</p>
                    <div v-if="cartItem.tvars && cartItem.tvars.length > 0"
                         class="mt-4">
                      <p class="italic text-sm my-2">
                        {{ $t("gen.variations") }}:
                      </p>
                      <template v-for="variation in cartItem.tvars" :key="variation">
                        <div v-if="variation.vars && variation.vars[0] && variation.vars[0].sval"
                             class="flex gap-x-1">
                          <p>* {{ variation.t }}:</p>
                          <p class="font-bold">
                            {{ variation.vars[0].sval }}
                          </p>
                        </div>
                      </template>
                    </div>
                    <div class="flex gap-x-2 mt-2">
                      <input type="number" min="0" v-model="cartItem.amt"
                             class="w-[5rem] px-3 py-1 rounded
                                    surface-variant text-xl"
                             style="border: 1px solid var(--md-sys-color-outline-variant)">
                      <div>
                        <p class="text-xl font-bold">
                          {{ ((cartItem.net * (cartItem.vatp + 1)) * cartItem.amt).toFixed(2) }} €
                        </p>
                        <div class="flex items-center text-xs gap-x-2">
                          <p class="">
                            {{ cartItem.net.toFixed(2) }} €
                          </p>
                          <p class="">
                            {{ cartItem.vatp.toFixed(2) * 100 }} % {{ $t("eco.vat") }}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div class="cursor-pointer px-1 rounded mb-2 mt-4
                                bshadow w-fit surface"
                         v-on:click="$store.commit('removeFromCart', cartItem); calculate()">
                      <p class="font-bold text-sm">
                        {{ $t("stores.removeFromCart") }}
                      </p>
                    </div>
                  </div>
                </div>
              </template>
              <template v-else>
                <div class="h-full flex items-center justify-center pt-4">
                  <p>{{ $t("gen.emptyState") }}</p>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="surface h-full w-full bshadow">
      <div v-if="showPayment !== true" class="h-full w-full">
        <p class="font-bold text-2xl surface-variant bshadow
                  px-4 py-2">
          Checkout
        </p>
        <div class="flex justify-center
                    mt-2 px-4 py-2 h-full">
          <div class="max-w-[600px] w-full pl-1 pr-2
                      overflow-y-auto pb-20">
            <div ref="shippingAddressContainer"
                 class="flex flex-col gap-y-2">
              <p class="font-bold text-xl mb-2">
                {{ $t("eco.deliveryAddress") }}
              </p>
              <input type="text"
                     class="search-field-enhanced mb-2"
                     :placeholder="$t('address.email')"
                     v-model="order.delivery.email">
              <input type="text"
                     class="search-field-enhanced mb-4"
                     :placeholder="$t('address.phone')"
                     v-model="order.delivery.phone">
              <div class="flex justify-evenly w-full gap-x-2">
                <input type="text"
                       class="search-field-enhanced"
                       :placeholder="$t('address.firstName')"
                       v-model="order.delivery.first">
                <input type="text"
                       class="search-field-enhanced"
                       :placeholder="$t('address.lastName')"
                       v-model="order.delivery.last">
              </div>
              <input type="text"
                     class="search-field-enhanced"
                     :placeholder="$t('address.company')"
                     v-model="order.delivery.company">
              <input type="text"
                     class="search-field-enhanced"
                     :placeholder="$t('address.country')"
                     v-model="order.delivery.country">
              <input type="text"
                     class="search-field-enhanced"
                     :placeholder="$t('address.stateArea')"
                     v-model="order.delivery.stateArea">
              <input type="text"
                     class="search-field-enhanced"
                     :placeholder="$t('address.street')"
                     v-model="order.delivery.street">
              <input type="text"
                     class="search-field-enhanced"
                     :placeholder="$t('address.city')"
                     v-model="order.delivery.city">
              <input type="text"
                     class="search-field-enhanced"
                     :placeholder="$t('address.postcode')"
                     v-model="order.delivery.postcode">
              <div class="flex items-center ml-1 mt-2">
                <input type="checkbox"
                       id="shoppingAsBilling"
                       class="w-4 h-4 mr-2"
                       v-model="shippingAsBilling">
                <label for="shoppingAsBilling"
                       class="cursor-pointer">
                  {{ $t("checkout.sameAsBilling") }}
                </label>
              </div>
            </div>
            <div ref="billingAddressContainer"
                 v-if="shippingAsBilling !== true"
                 class="mt-4 flex flex-col gap-y-2">
              <p class="font-bold text-xl mb-2">
                {{ $t("eco.billingAddress") }}
              </p>
              <input type="text"
                     class="search-field-enhanced mb-2"
                     :placeholder="$t('address.email')"
                     v-model="order.billing.email">
              <input type="text"
                     class="search-field-enhanced mb-4"
                     :placeholder="$t('address.phone')"
                     v-model="order.billing.phone">
              <div class="flex justify-evenly w-full gap-x-2">
                <input type="text"
                       class="search-field-enhanced"
                       :placeholder="$t('address.firstName')"
                       v-model="order.billing.first">
                <input type="text"
                       class="search-field-enhanced"
                       :placeholder="$t('address.lastName')"
                       v-model="order.billing.last">
              </div>
              <input type="text"
                     class="search-field-enhanced"
                     :placeholder="$t('address.company')"
                     v-model="order.billing.company">
              <input type="text"
                     class="search-field-enhanced"
                     :placeholder="$t('address.country')"
                     v-model="order.billing.country">
              <input type="text"
                     class="search-field-enhanced"
                     :placeholder="$t('address.stateArea')"
                     v-model="order.billing.stateArea">
              <input type="text"
                     class="search-field-enhanced"
                     :placeholder="$t('address.street')"
                     v-model="order.billing.street">
              <input type="text"
                     class="search-field-enhanced"
                     :placeholder="$t('address.city')"
                     v-model="order.billing.city">
              <input type="text"
                     class="search-field-enhanced"
                     :placeholder="$t('address.postcode')"
                     v-model="order.billing.postcode">
            </div>
            <div class="w-full flex justify-end mt-4">
              <template v-if="$store.state.cart && $store.state.cart.length > 0">
                <div class="btn_bg_primary font-bold"
                     v-on:click="submitOrder()">
                  <p>{{ $t("checkout.submitOrder") }}</p>
                </div>
              </template>
              <template v-else>
                <div class="px-4 py-2 rounded pointer-events-none
                          border-2 border-neutral-500">
                  <p>{{ $t("gen.emptyState") }}</p>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="h-full w-full">
        <p class="font-bold text-xl lg:text-2xl surface-variant bshadow
                  px-4 py-2">
          {{ $t("eco.payment") }}
        </p>
        <div class="px-4 py-2">
          <p class="mb-4 mt-2 font-bold">
            {{ $t("checkout.confirmation") }}
          </p>
          <p class="mb-4">
            {{ $t("checkout.demand1") }}
            <span class="font-bold">{{ ftotalGross }} €</span>
            {{ $t("checkout.demand2") }}:</p>
          <div class="mb-4 px-4 py-2 rounded surface-variant">
            <template v-if="store != null && store.bank && store.bank.bank">
              <p class="text-sm mb-4">
                {{ $t("checkout.qrHint") }}
              </p>
              <div id="payment_qrcode" class="mb-4"></div>
              <p>Name: {{ store.bank.name }}</p>
              <p>Bank: {{ store.bank.bank }}</p>
              <p>IBAN: {{ store.bank.iban }}</p>
              <p>SWIFT (BIC): {{ store.bank.swift }}</p>
            </template>
            <template v-else>
              <p>{{ $t("checkout.noBank") }}</p>
            </template>
          </div>
          <div class="px-4 py-2 rounded surface-variant">
            <p class=" text-sm">Order ID: {{ orderIdResponse }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ShoppingCartIcon } from '@heroicons/vue/24/solid'
import * as QRCode from 'easyqrcodejs'

export default {
  name: 'Store Checkout',
  components: { ShoppingCartIcon },
  data () {
    return {
      orderIdResponse: '',
      showPayment: false,
      shippingAsBilling: true,
      totalNet: 0.0,
      totalVAT: 0.0,
      totalGross: 0.0,
      ftotalNet: '',
      ftotalVAT: '',
      ftotalGross: '',
      order: {
        delivery: {
          email: '',
          first: '',
          last: '',
          company: '',
          country: '',
          stateArea: '',
          street: '',
          number: '',
          floor: '',
          city: '',
          postcode: '',
          phone: ''
        },
        billing: {
          email: '',
          first: '',
          last: '',
          company: '',
          country: '',
          stateArea: '',
          street: '',
          number: '',
          floor: '',
          city: '',
          postcode: '',
          phone: ''
        },
        pid: '',
        items: []
      },
      store: null
    }
  },
  mounted () {
    this.initFunction()
  },
  beforeUnmount () {
    if (this.showPayment === true) {
      this.$store.commit('clearCart')
    }
  },
  methods: {
    initFunction: async function () {
      this.order.pid = this.$route.params.id
      this.calculate()
      this.getStore(this.order.pid)
    },
    formatCurrency: function (number) {
      const formatted = parseInt(number.toString()).toLocaleString()
      return formatted + '.' + number.toFixed(2).split('.')[1]
    },
    submitOrder: function () {
      // Attach cart items
      let cartItem
      for (let i = 0; i < this.$store.state.cart.length; i++) {
        cartItem = this.$store.state.cart[i]
        // Push
        this.order.items.push({
          amt: cartItem.amt,
          vars: structuredClone(cartItem.tvars),
          itemId: cartItem.uid,
          t: cartItem.t
        })
      }
      // Shipping and/or Billing
      if (this.shippingAsBilling) {
        this.order.billing = structuredClone(this.order.delivery)
      }
      console.log(this.order)
      return new Promise((resolve) => {
        this.$Worker.execute({
          action: 'api-http',
          method: 'post',
          url: 'stores/public/order/' + this.order.pid,
          body: JSON.stringify(this.order)
        })
          .then((data) => {
            this.orderIdResponse = data.result
            this.showPayment = true
            this.$notify(
              {
                title: 'Order Submitted',
                text: '',
                type: 'fmt_notify'
              })
          })
          .then(() => {
            if (this.store && this.store.bank && this.store.bank.iban) {
              // Build EPC-QR-Code for easy payment
              setTimeout(() => {
                const elem = document.getElementById('payment_qrcode')
                while (elem.firstChild) {
                  elem.firstChild.remove()
                }
                const orderIDClean = this.orderIdResponse.replaceAll('-', '')
                const payload =
                  'BCD\r\n' + // 1
                  '002\r\n' + // 2
                  '1\r\n' + // 3
                  'SCT\r\n' + // 4
                  this.store.bank.swift + '\r\n' + // 5
                  this.store.bank.name + '\r\n' + // 6
                  this.store.bank.iban + '\r\n' + // 7
                  'EUR' + this.totalGross.toFixed(2) + '\r\n' + // 8
                  '\r\n' + // 9
                  '\r\n' + // 10
                  orderIDClean + '\r\n' + // 11
                  'Powered by wikiric' // 12
                const qr = new QRCode(elem, {
                  text: payload,
                  quietZone: 10,
                  quietZoneColor: 'rgba(255,255,255,1)',
                  correctLevel: QRCode.CorrectLevel.M
                })
                if (qr) {
                  console.debug(qr)
                }
              }, 1000)
            }
          })
          .then(() => {
            resolve()
          })
          .catch((err) => {
            console.log(err.message)
          })
      })
    },
    getStore: function (id) {
      return new Promise((resolve) => {
        this.$Worker.execute({
          action: 'api-http',
          method: 'get',
          url: 'stores/public/get/' + id
        })
          .then((data) => {
            this.store = data.result
          })
          .then(() => resolve())
          .catch((err) => {
            this.store = null
            console.debug(err.message)
          })
      })
    },
    calculate: function () {
      this.totalNet = 0.0
      this.totalVAT = 0.0
      this.totalGross = 0.0
      let cartItem
      if (this.$store.state.cart && this.$store.state.cart.length > 0) {
        console.log(this.$store.state.cart)
        // Calculate values
        for (let i = 0; i < this.$store.state.cart.length; i++) {
          cartItem = this.$store.state.cart[i]
          this.totalNet += (cartItem.net * cartItem.amt)
          this.totalVAT += ((cartItem.net * cartItem.amt) * cartItem.vatp)
          this.totalGross += ((cartItem.net * (cartItem.vatp + 1)) * cartItem.amt)
        }
        // Convert to locale numbers (commas, dots etc.)
        this.ftotalNet = this.formatCurrency(this.totalNet)
        this.ftotalVAT = this.formatCurrency(this.totalVAT)
        this.ftotalGross = this.formatCurrency(this.totalGross)
      }
    }
  }
}
</script>

<style>

.search-field {
  @apply rounded-md overflow-hidden w-full;
  resize: none;
}

.search-field-enhanced {
  @apply search-field fmt_input
  py-4 px-4 w-full
  h-6 background;
}

td p {
  @apply pr-2;
}

</style>
