import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'homePage',
      component: () => import('../views/home/HomePage.vue')
    },
    {
      path: '/assignment',
      name: 'assignment',
      component: () => import('../views/AssignmentAttempt.vue')
    },
    {
      path: '/sign-in',
      name: 'sign.in',
      component: () => import('../views/auth/SignIn.vue')
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    const token = localStorage.getItem('token');
    if (!token) {
      next('/sign-in');
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router
router.beforeEach((to, from, next) => {
//   const publicPages = ['/shop','/'];
//   const adminPages = ['/product'];
//   const authRequired = !publicPages.includes(to.path);
//   const loggedIn = localStorage.getItem('accessToken');
//   if (authRequired && !loggedIn) {
//     next('/');
//   } else {
//     next();
//   }
    next();
});