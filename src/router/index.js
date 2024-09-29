import { createRouter, createWebHistory } from 'vue-router'

import HomePage from '@/components/HomeLayout/HomePage.vue'

import SignIn from '@/views/Auth/SignIn.vue'
import ChangePassword from '@/views/Auth/ChangePassword.vue'
import ForgotPassword from '@/views/Auth/ForgotPassword.vue'
import ResetPassword from '@/views/Auth/ResetPassword.vue'
import Profile from '@/views/Users/Profile.vue'
import CourseList from '@/views/Courses/CourseList.vue'
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
      component: HomePage
    },
    {
      path: '/assignments/create',
      name: 'CreateAssignment',
      component: CreateAssignment
    },
    {
      path: '/assignments/:courseId/manage',
      name: 'ManageAssignments',
      component: ManageAssignments
    },
    {
      path: '/assignments/:id/overview',
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
      component: SignIn
    },
    {
      path: '/courses',
      name: 'coursePage',
      component: CourseList
    },
    {
      path: '/change-password',
      name: 'changePassword',
      component: ChangePassword
    },
    {
      path: '/forgot-password',
      name: 'forgotPassword',
      component: ForgotPassword
    },
    {
      path: '/reset-password/:email/:resetToken',
      name: 'resetPassword',
      component: ResetPassword,
      props: true
    },
    {
      path: '/profile',
      name: 'profilePage',
      component: Profile
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