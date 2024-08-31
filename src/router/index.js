import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'test',
      component: () => import('../views/AssignmentAttempt.vue')
    },
  ]
})

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