import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'homePage',
      component: () => import('../components/HomeLayout/HomePage.vue')
    },
    {
      path: '/assignment',
      name: 'assignmentPage',
      component: () => import('../views/Assignment/AssignmentAttempt.vue')
    },
    {
      path: '/sign-in',
      name: 'signinPage',
      component: () => import('../views/Auth/SignIn.vue')
    },
    {
      path: '/courses',
      name: 'coursePage',
      component: () => import('../views/Courses/CourseList.vue')
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
  // const publicPages = ['/','/sign-in','/courses'];
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