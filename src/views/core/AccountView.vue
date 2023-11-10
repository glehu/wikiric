<template>
  <div class="h-screen w-screen flex justify-center"
       :style="{backgroundImage: 'url('+require('@/assets/'+'account/pexels-dexter-fernandes-2646237.jpg')+')',
       backgroundPosition: 'center top', backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }">
    <div class="w-full flex justify-center p-2 pt-[55px]">
      <div class="w-full overflow-x-hidden overflow-y-auto
                  max-w-screen-xl">
        <div class="p-8 flex flex-col gap-4">
          <p class="font-bold text-4xl">Account</p>
          <div class="flex flex-row flex-wrap gap-4">
            <div class="app-thumb" v-on:click="logout()">
              <ArrowLeftOnRectangleIcon class="w-14 h-14"/>
              <p class="app-text">{{ $t('gen.logout') }}</p>
            </div>
            <div class="app-thumb" v-on:click="gotoPreferences()">
              <Cog6ToothIcon class="w-14 h-14"/>
              <p class="app-text">Cookies</p>
            </div>
            <div class="app-thumb" v-on:click="gotoThirdPartyAccounts()">
              <UserGroupIcon class="w-14 h-14"/>
              <p class="app-text">3rd Party</p>
            </div>
          </div>
          <p class="font-bold text-4xl mt-2">Collaboration</p>
          <div class="flex flex-row flex-wrap gap-4">
            <div class="app-thumb" v-on:click="gotoClarifier()">
              <ChatBubbleLeftRightIcon class="w-14 h-14"/>
              <p class="app-text">{{ $t('gen.chatGroups') }}</p>
            </div>
            <div class="app-thumb" v-on:click="gotoPlanner()">
              <ViewColumnsIcon class="w-14 h-14"/>
              <p class="app-text">Planner</p>
            </div>
            <div class="app-thumb" v-on:click="gotoKnowledge()">
              <BookOpenIcon class="w-14 h-14"/>
              <p class="app-text">{{ $t('gen.knowledge') }}</p>
            </div>
            <div class="app-thumb" v-on:click="gotoOwnClarifier()">
              <UserIcon class="w-14 h-14"/>
              <p class="app-text">Home</p>
            </div>
          </div>
          <p class="font-bold text-4xl mt-2">E-Commerce</p>
          <div class="flex flex-row flex-wrap gap-4">
            <div class="app-thumb" v-on:click="gotoStores()">
              <BuildingStorefrontIcon class="w-14 h-14"/>
              <p class="app-text">{{ $t('gen.stores') }}</p>
            </div>
            <template v-if="ownStore != null">
              <div class="app-thumb" v-on:click="gotoStoreInventory()">
                <CubeIcon class="w-14 h-14"/>
                <p class="app-text">{{ $t('eco.inventory') }}</p>
              </div>
              <div class="app-thumb" v-on:click="gotoStoreOrders()">
                <DocumentDuplicateIcon class="w-14 h-14"/>
                <p class="app-text">{{ $t('eco.commissions') }}</p>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  ChatBubbleLeftRightIcon,
  ArrowLeftOnRectangleIcon,
  Cog6ToothIcon,
  UserGroupIcon,
  CubeIcon,
  DocumentDuplicateIcon,
  BuildingStorefrontIcon,
  ViewColumnsIcon,
  BookOpenIcon,
  UserIcon
} from '@heroicons/vue/24/solid'

export default {
  components: {
    ChatBubbleLeftRightIcon,
    ArrowLeftOnRectangleIcon,
    Cog6ToothIcon,
    UserGroupIcon,
    CubeIcon,
    DocumentDuplicateIcon,
    BuildingStorefrontIcon,
    ViewColumnsIcon,
    BookOpenIcon,
    UserIcon
  },
  data () {
    return {
      ownStore: null
    }
  },
  computed: {
    cartTotal () {
      let total = 0
      for (let i = 0; i < this.$store.state.cart.length; i++) {
        total += (this.$store.state.cart[i].price * this.$store.state.cart[i].amount)
      }
      return total
    }
  },
  mounted () {
    this.getOwnStore()
  },
  methods: {
    isLoggedIn () {
      return this.$store.state.authenticated
    },
    showCart () {
      this.$router.push('/cart')
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
          .finally(() => {
            resolve()
          })
      })
    },
    logout () {
      if (this.isLoggedIn()) {
        this.$store.commit('logOut')
        this.$store.commit('clearCart')
        this.$router.push('/login?redirect=/account')
      }
    },
    gotoPreferences () {
      this.$router.push('/preferences?redirect=/account')
    },
    gotoAPI () {
      this.$router.push('/dev/api')
    },
    gotoInvoices () {
      this.$router.push('/invoices')
    },
    gotoPlanner () {
      this.$router.push('/apps/plannernew?src=' + this.$store.state.ownChatId)
    },
    gotoKnowledge () {
      this.$router.push('/apps/knowledge?cguid=' + this.$store.state.ownChatId)
    },
    gotoOwnClarifier () {
      this.$router.push('/apps/clarifier/wss/' + this.$store.state.ownChatId)
    },
    gotoClarifier () {
      this.$router.push('/apps/clarifier')
    },
    gotoThirdPartyAccounts () {
      this.$router.push('/thirdparty')
    },
    gotoStores () {
      this.$router.push('/stores')
    },
    gotoStoreInventory () {
      this.$router.push('/stores/own/items')
    },
    gotoStoreOrders () {
      this.$router.push('/stores/own/commissions')
    }
  }
}
</script>

<style>

</style>
