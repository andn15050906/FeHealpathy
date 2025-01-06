import { createRouter, createWebHistory } from 'vue-router'

import HomePage from '@/views/HomePage.vue'
import SignIn from '@/views/Profile/SignIn.vue'
import ChangePassword from '@/views/Profile/ChangePassword.vue'
import ForgotPassword from '@/views/Profile/ForgotPassword.vue'
import ResetPassword from '@/views/Profile/ResetPassword.vue'
import CourseList from '@/views/Courses/CourseList.vue'
import CreateAssignment from '@/views/Assignments_Old/Create.vue'
import ManageAssignments from '@/views/Assignments_Old/Manage.vue'
import OverviewAssignment from '@/views/Assignments_Old/Overview.vue'
import ReviewAssignment from '@/views/Assignments_Old/Review.vue'
import AttemptAssignment from '@/views/Assignments_Old/Attempt.vue'
import EditUserProfile from '@/views/Profile/EditUserProfile.vue'
import ViewUserProfile from '@/views/Profile/ViewUserProfile.vue'
import BlogCatalog from '@/views/Blogs/BlogCatalog.vue'
import SearchBlogResult from '@/views/Blogs/SearchBlogResult.vue'
import AboutUs from '@/views/AboutUs/AboutUs.vue'
import PracticeToolList from '@/views/Practice/PracticeToolList.vue'
import YogaExerciseDetail from '@/views/Practice/Yoga/YogaExerciseDetail.vue'
import YogaView from '@/views/Practice/Yoga/YogaCatalog.vue'
import HabitTracking from '@/views/Practice/HabitTracking/HabitTracking.vue'
import CommunityOverview from '@/views/Community/CommunityOverview.vue'
import GroupOverview from '@/views/Community/GroupOverview.vue'
import CreateGroup from '@/views/Community/CreateGroup.vue'
import EditGroup from '@/views/Community/EditGroup.vue'
import ViewGroup from '@/views/Community/ViewGroup.vue'
import BlogDetail from '@/views/Blogs/BlogDetail.vue'
import Register from '@/views/Profile/Register.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomePage
    },
    {
      path: '/blogs',
      name: 'blogCatalog',
      component: BlogCatalog
    },
    {
      path: '/blogs/blogdetail',
      name: 'blogDetail',
      component: BlogDetail
    },
    {
      path: '/search-blogs',
      name: 'searchBlogs',
      component: SearchBlogResult
    },
    {
      path: '/practice',
      name: 'practiceToolList',
      component: PracticeToolList
    },
    {
      path: '/courses',
      name: 'courseList',
      component: CourseList
    },
    {
      path: '/community',
      name: 'communityOverview',
      component: CommunityOverview
    },
    {
      path: '/group/:id',
      name: 'groupOverview',
      component: GroupOverview,
      props: true
    },
    {
      path: '/group/:id/detail',
      name: 'viewGroup',
      component: ViewGroup
    },
    {
      path: '/create-group',
      name: 'createGroup',
      component: CreateGroup
    },
    {
      path: '/edit-group',
      name: 'editGroup',
      component: EditGroup
    },
    {
      path: '/about-us',
      name: 'aboutUs',
      component: AboutUs
    },
    {
      path: '/sign-in',
      name: 'signIn',
      component: SignIn
    },
    {
      path: '/register',
      name: 'register',
      component: Register
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
      name: 'editProfile',
      component: EditUserProfile
    },
    {
      path: '/profile/:id',
      name: 'viewProfile',
      component: ViewUserProfile
    },
    {
      path: '/Practice/Yoga/:id',
      name: 'YogaExerciseDetail',
      component: YogaExerciseDetail
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
      path: '/practice/yoga',
      name: 'yoga',
      component: YogaView
    },
    {
      path: '/practice/habit-tracking',
      name: 'habitTracking',
      component: HabitTracking,
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