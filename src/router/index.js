import { resetPassword } from '@/services/authService';
import { createRouter, createWebHistory } from 'vue-router'
import CreateAssignment from '@/views/Assignments/Create.vue'
import ManageAssignments from '@/views/Assignments/Manage.vue'
import OverviewAssignment from '@/views/Assignments/Overview.vue'
import ReviewAssignment from '@/views/Assignments/Review.vue'
import AttemptAssignment from '@/views/Assignments/Attempt.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'homePage',
      component: () => import('../components/HomeLayout/HomePage.vue')
    },
    {
      path: '/assignments/create',
      name: 'CreateAssignment',
      component: CreateAssignment
    },
    {
      path: '/assignments/manage',
      name: 'ManageAssignments',
      component: ManageAssignments
    },
    {
      path: '/assignments/overview',
      name: 'OverviewAssignment',
      component: OverviewAssignment
    },
    {
      path: '/assignments/:assignmentId/review/:submissionId',
      name: 'ReviewAssignment',
      component: ReviewAssignment,
    },
    {
      path: '/assignments/:id/attempt',
      name: 'AttemptAssignment',
      component: AttemptAssignment
    },
    {
      path: '/sign-in',
      name: 'signinPage',
      component: () => import('../views/auth/SignIn.vue')
    },
    {
      path: '/courses',
      name: 'coursePage',
      component: () => import('../views/Courses/CourseList.vue')
    },
    {
      path: '/change-password',
      name: 'changePassword',
      component: () => import('../views/Auth/ChangePassword.vue')
    },
    {
      path: '/forgot-password',
      name: 'forgotPassword',
      component: () => import('../views/auth/ForgotPassword.vue')
    },
    {
      path: '/reset-password/:email/:resetToken',
      name: 'resetPassword',
      component: () => import('../views/Auth/ResetPassword.vue'),
      props: true
    },{
      path: '/profile',
      name: 'profilePage',
      component: () => import('../views/Users/Profile.vue')
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

export default router;