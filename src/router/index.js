import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/core/HomeView.vue'
import store from '../store'
import { Base64 } from 'js-base64'

const routes = [
  {
    path: '/',
    name: 'WMore Than A Dream',
    component: Home
  },
  {
    path: '/about',
    name: 'WAbout',
    component: () => import('../views/info/AboutView.vue')
  },
  {
    path: '/login',
    name: 'WLogin',
    component: () => import('../views/forms/LoginView')
  },
  {
    path: '/register',
    name: 'WRegister',
    component: () => import('../views/forms/RegisterView')
  },
  {
    path: '/account',
    name: 'WAccount',
    component: () => import('../views/core/AccountView'),
    meta: {
      logout: true,
      requiresAuth: true
    }
  },
  {
    path: '/songs',
    name: 'WSongs',
    component: () => import('../views/core/SongFinderView'),
    meta: { requiresAuth: true }
  },
  {
    path: '/apps/clarifier',
    name: 'WClarifier',
    component: () => import('../views/apps/ClarifierView'),
    meta: { requiresAuth: true }
  },
  {
    path: '/apps/clarifier/wss/:id',
    name: 'WClarifierSession',
    component: () => import('../views/apps/ClarifierChatroomView'),
    meta: { requiresAuth: true }
  },
  {
    path: '/shopold',
    name: 'WShop',
    component: () => import('../views/core/ShopView.vue')
  },
  {
    path: '/cart',
    name: 'WCart',
    component: () => import('../views/core/CartView.vue')
  },
  {
    path: '/preferences',
    name: 'WPreferences',
    component: () => import('../views/settings/UserPreferencesView.vue')
  },
  {
    path: '/dev/mockingbird',
    name: 'WMockingbird',
    component: () => import('../views/dev/api/MockingbirdView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/dev/theme',
    name: 'WTheme',
    component: () => import('../views/dev/ThemeView.vue')
  },
  {
    path: '/invoices',
    name: 'WInvoices',
    component: () => import('../views/core/InvoicesView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/submissions/artist',
    name: 'WE1: Becoming one of us',
    component: () => import('../views/forms/ArtistSubmissionView')
  },
  {
    path: '/vision',
    name: 'WVision',
    component: () => import('../views/info/VisionView')
  },
  {
    path: '/thirdparty',
    name: 'WThird Party Accounts',
    component: () => import('../views/settings/ThirdPartyAccounts.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/apps/knowledge',
    name: 'WKnowledge Finder',
    component: () => import('../views/apps/KnowledgeFinderView'),
    meta: { requiresAuth: true }
  },
  {
    path: '/apps/plannernew',
    name: 'WPlanner',
    component: () => import('../views/apps/PlannerNewView'),
    meta: { requiresAuth: true }
  },
  {
    path: '/apps/knowledge/:id',
    name: 'WKnowledge',
    component: () => import('../views/apps/KnowledgeView'),
    meta: { requiresAuth: true }
  },
  {
    path: '/apps/editor/process/:id',
    name: 'WProcess Editor',
    component: () => import('../views/apps/ProcessEditorView'),
    meta: { requiresAuth: true }
  },
  {
    path: '/apps/process/:id',
    name: 'WProcess',
    component: () => import('../views/apps/ProcessView'),
    meta: { requiresAuth: true }
  },
  {
    path: '/apps/studio',
    name: 'WStudio',
    component: () => import('../views/apps/StudioView'),
    meta: { requiresAuth: true }
  },
  {
    path: '/redirect',
    name: 'WRedirect',
    component: () => import('../views/info/RedirectView')
  },
  {
    path: '/stores',
    name: 'WStore Finder',
    component: () => import('../views/core/StoreFinderView.vue')
  },
  {
    path: '/store/:id',
    name: 'WShop',
    component: () => import('../views/core/StoreNewView.vue')
  },
  {
    path: '/checkout/:id',
    name: 'WCheckout',
    component: () => import('../views/core/StoreCheckoutView.vue')
  },
  {
    path: '/stores/own/items',
    name: 'WStore Inventory',
    component: () => import('../views/core/StoreInventoryView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/stores/own/commissions',
    name: 'WStore Commissions',
    component: () => import('../views/core/StoreCommissionsView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/apps/sandbox',
    name: 'WSandbox',
    component: () => import('../views/apps/SandboxView.vue')
  },
  // ERROR HANDLING ROUTES --- MUST BE AT THE BOTTOM ---
  {
    path: '/bsod',
    name: 'WBSOD',
    component: () => import('../views/errors/BSOD')
  },
  // 404 NOT FOUND ERROR PAGE --- MUST BE AT THE VERY BOTTOM ---
  {
    path: '/:pathMatch(.*)*',
    name: 'W404 Shadow Realms',
    component: () => import('../views/errors/NotFoundErrorPageView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  strict: true,
  sensitive: true,
  scrollBehavior (to, from, savedPosition) {
    // always scroll to top
    return { top: 0 }
  }
})

router.beforeEach((to, from, next) => {
  // If the route requires authentication and the user is not authenticated, show log-in screen
  document.title = to.name.substring(1)
  if ((to.matched.some(record => record.meta.requiresAuth)) && (to.name !== 'WLogin' && !store.state.authenticated)) {
    next({
      path: '/login',
      query: {
        redirect: to.fullPath
      }
    })
  } else {
    // Only show preferences if we're not going to the Preferences or About page
    if ((to.name !== 'WPreferences' && to.name !== 'WAbout') && !store.state.cookieAllowance) {
      next({
        path: '/preferences',
        query: {
          redirect: to.fullPath
        }
      })
    } else {
      // Handle Planner Route and fill in the path depending on the user logged in
      if (
        to.fullPath === '/planner' ||
        to.fullPath === '/apps/planner' ||
        to.fullPath === '/apps/planner/' ||
        to.fullPath === '/apps/planner/_user'
      ) {
        next({
          path: '/apps/planner/' + encodeURIComponent(
            Base64.encode((store.state.username).split('').reverse().join('')))
        })
      } else {
        // #### Any Other Route
        next()
      }
    }
  }
})

export default router
