import { createRouter, createWebHistory } from 'vue-router'
import { getUserBearerToken } from '@/scripts/api/services/authService'

import HomePage from '@/views/HomePage.vue'
import SignIn from '@/views/Profile/SignIn.vue'
import Register from '@/views/Profile/Register.vue'
import ChangePassword from '@/views/Profile/ChangePassword.vue'
import ForgotPassword from '@/views/Profile/ForgotPassword.vue'
import ResetPassword from '@/views/Profile/ResetPassword.vue'
import EditUserProfile from '@/views/Profile/EditUserProfile.vue'
import ViewUserProfile from '@/views/Profile/ViewUserProfile.vue'
import Settings from '@/views/Profile/Settings/Settings.vue'
import SettingUp from '@/views/Profile/Preferences/SettingUp.vue'

import FaqPage from '@/pages/faq/FaqPage.vue'

import PracticeToolList from '@/views/Practice/PracticeToolList.vue'
import YogaExerciseDetail from '@/views/Practice/Yoga/YogaExerciseDetail.vue'
import YogaView from '@/views/Practice/Yoga/YogaCatalog.vue'
import HabitTracking from '@/views/Practice/HabitTracking/HabitTracking.vue'
import DiaryWriting from '@/views/Practice/Diary/DiaryWriting.vue'
import DiaryList from '@/views/Practice/Diary/DiaryList.vue'
import MoodOverview from '@/views/Practice/MoodRecording/MoodOverview.vue'
import EmotionTracking from '@/views/Practice/MoodRecording/EmotionTracking.vue'
import Happy from '@/views/Practice/MoodRecording/MoodCart/Happy.vue'
import Sad from '@/views/Practice/MoodRecording/MoodCart/Sad.vue'
import Angry from '@/views/Practice/MoodRecording/MoodCart/Angry.vue'
import Eager from '@/views/Practice/MoodRecording/MoodCart/Eager.vue'
import Anxiety from '@/views/Practice/MoodRecording/MoodCart/Anxiety.vue'
import SelfAssessment from '@/views/Practice/SelfAssessment/SelfAssessment.vue'
import MusicControl from '@/views/Practice/MediaResource/MusicControl.vue'
import MediaControl from '@/views/Practice/MediaResource/MediaControl.vue'

import ManageSurvey from '@/views/Admin/ManageSurvey.vue'

import BlogDetail from '@/views/Blogs/BlogDetail.vue'
import CreateBlog from '@/views/Blogs/CreateBlog.vue'
import ManageBlog from '@/views/Blogs/ManageBlog.vue'
import UpdateBlog from '@/views/Blogs/UpdateBlog.vue'
import BlogCatalog from '@/views/Blogs/BlogCatalog.vue'
import SearchBlogResult from '@/views/Blogs/SearchBlogResult.vue'

import CourseList from '@/views/Courses/CourseList.vue'
import ManageCourse from '@/views/Courses/ManageCourse.vue'
import CreateCourse from '@/views/Courses/CreateCourse.vue'
import UpdateCourse from '@/views/Courses/UpdateCourse.vue'

import CreateAssignment from '@/views/Assignments_Old/Create.vue'
import ManageAssignments from '@/views/Assignments_Old/Manage.vue'
import OverviewAssignment from '@/views/Assignments_Old/Overview.vue'
import ReviewAssignment from '@/views/Assignments_Old/Review.vue'
import AttemptAssignment from '@/views/Assignments_Old/Attempt.vue'

import CommunityOverview from '@/views/Community/CommunityOverview.vue'
import GroupOverview from '@/views/Community/GroupOverview.vue'
import ViewGroup from '@/views/Community/ViewGroup.vue'

import PaymentsPage from '@/pages/payments/PaymentsPage.vue'
import UserActivity from '@/views/Statistics/UserActivity.vue'

//components
import NotFound from '@/components/Layouts/404.vue'
import DailyQuestion from '@/components/NotificationComponents/DailyQuestion.vue'
import Calendar from '@/components/Common/Misc/Calendar.vue'
import CreateGroup from '@/components/GroupComponents/CreateGroup.vue'
import EditGroup from '@/components/GroupComponents/EditGroup.vue'
import CreateSurvey from '@/components/SurveyComponents/CreateSurvey.vue'
import EditSurvey from '@/components/SurveyComponents/EditSurvey.vue'
import ConversationWindow from '@/components/CommunityComponents/ConversationWindow.vue'
import YogaPractice from '@/views/Practice/Yoga/YogaPractice.vue'
import Request from '@/views/Profile/Advisor/Request.vue'
import PersonalRoadmap from '@/views/Profile/Preferences/PersonalRoadmap.vue'
import SubmissionReview from '@/views/Profile/Statistics/SubmissionReview.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/NotFound',
      name: 'NotFound',
      component: NotFound
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/NotFound'
    },
    {
      path: '/',
      name: 'Home',
      component: HomePage
    },
    {
      path: '/faq',
      name: 'FAQ',
      component: FaqPage
    },

    // Auth
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
      component: ChangePassword,
      meta: { requiresAuth: true }
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
      component: EditUserProfile,
      meta: { requiresAuth: true }
    },
    {
      path: '/profile/:id',
      name: 'viewProfile',
      component: ViewUserProfile
    },
    {
      path: '/settings',
      name: 'Settings',
      component: Settings,
      meta: { requiresAuth: true }
    },
    {
      path: '/setting-up',
      name: 'SettingUp',
      component: SettingUp,
      meta: { requiresAuth: true }
    },
    // End of Auth

    // Practice
    {
      path: '/practice',
      name: 'practiceToolList',
      component: PracticeToolList
    },
    // Practice - Yoga
    {
      path: '/yoga',
      name: 'yogaView',
      component: YogaView
    },
    {
      path: '/yoga/:id',
      name: 'YogaExerciseDetail',
      component: YogaExerciseDetail
    },
    // Practice - Mood
    {
      path: '/mood-cart',
      name: 'moodOverview',
      component: MoodOverview
    },
    {
      path: '/mood-cart/happy',
      name: 'happyCart',
      component: Happy
    },
    {
      path: '/mood-cart/sad',
      name: 'sadCart',
      component: Sad
    },
    {
      path: '/mood-cart/angry',
      name: 'angryCart',
      component: Angry
    },
    {
      path: '/mood-cart/eager',
      name: 'eagerCart',
      component: Eager
    },
    {
      path: '/mood-cart/anxiety',
      name: 'anxietyCart',
      component: Anxiety
    },
    // Practice - Diary
    {
      path: '/diary/diary-list',
      name: 'diaryList',
      component: DiaryList,
      meta: { requiresAuth: true }
    },
    {
      path: '/diary/diary-writing/:id?/:title?',
      name: 'DiaryWriting',
      component: DiaryWriting,
      props: true,
      meta: { requiresAuth: true }
    },
    // End of diary
    {
      path: '/daily-question',
      name: 'dailyQuestion',
      component: DailyQuestion,
      meta: { requiresAuth: true }
    },
    {
      // not called
      path: '/emotion-tracking',
      name: 'emotionTracking',
      component: EmotionTracking,
      meta: { requiresAuth: true }
    },
    {
      path: '/self-assessment',
      name: 'SelfAssessment',
      component: SelfAssessment,
      meta: { requiresAuth: true }
    },
    {
      path: '/habit-tracking',
      name: 'habitTracking',
      component: HabitTracking,
      meta: { requiresAuth: true }
    },
    // Practice - Media Resources
    {
      path: '/media-library',
      name: 'MusicControl',
      component: MusicControl
    },
    {
      path: '/media/manage',
      name: 'MediaControl',
      component: MediaControl
    },
    // Practice - Survey
    {
      path: '/survey',
      name: 'Survey',
      component: ManageSurvey,
      meta: { requiresAuth: true }
    },
    // End of Practice

    // Article
    {
      path: '/blogs',
      name: 'blogCatalog',
      component: BlogCatalog
    },
    {
      path: '/blogs/manage',
      name: 'manageBlogs',
      component: ManageBlog
    },
    {
      path: '/blogs/create',
      name: 'createBlog',
      component: CreateBlog,
      meta: { requiresAuth: true }
    },
    {
      path: '/blogs/edit-blog/:id',
      name: 'updateBlog',
      component: UpdateBlog,
      meta: { requiresAuth: true },
      props: true
    },
    {
      path: '/blogs/:id',
      name: 'blogDetail',
      component: BlogDetail
    },
    {
      path: '/blogs/search',
      name: 'searchBlogs',
      component: SearchBlogResult
    },

    // Course
    {
      path: '/courses',
      name: 'courseList',
      component: CourseList
    },
    {
      path: '/courses/manage',
      name: 'manageCourses',
      component: ManageCourse,
      meta: { requiresAuth: true }
    },
    {
      path: '/courses/create',
      name: 'createCourse',
      component: CreateCourse,
      meta: { requiresAuth: true }
    },
    {
      path: '/courses/update',
      name: 'updateCourse',
      component: UpdateCourse,
      meta: { requiresAuth: true }
    },
    /* /:id */
    /* ? considering /search */
    // End of Course

    // Community
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
      component: CreateGroup,
      meta: { requiresAuth: true }
    },
    {
      path: '/group/:id/edit',
      name: 'editGroup',
      component: EditGroup,
      meta: { requiresAuth: true }
    },
    {
      path: '/chat',
      name: 'chat',
      component: ConversationWindow,
      meta: { requiresAuth: true }
    },

    // Assignment - Old
    {
      path: '/assignments/create',
      name: 'CreateAssignment',
      component: CreateAssignment,
      meta: { requiresAuth: true }
    },
    {
      path: '/assignments/:courseId/manage',
      name: 'ManageAssignments',
      component: ManageAssignments,
      meta: { requiresAuth: true }
    },
    {
      path: '/assignments/:id/overview',
      name: 'OverviewAssignment',
      component: OverviewAssignment,
      meta: { requiresAuth: true }
    },
    {
      path: '/assignments/:assignmentId/review/:submissionId',
      name: 'ReviewAssignment',
      component: ReviewAssignment,
      meta: { requiresAuth: true }
    },
    {
      path: '/assignments/:id/attempt',
      name: 'AttemptAssignment',
      component: AttemptAssignment,
      meta: { requiresAuth: true }
    },

    // Others
    {
      path: '/payments',
      name: 'Payments',
      component: PaymentsPage
    },
    {
      path: '/calendar',
      name: 'Calendar',
      component: Calendar
    },
    {
      path: '/YogaPractice',
      name: 'YogaPractice',
      component: YogaPractice
    },
    {
      path: '/request',
      name: 'Request',
      component: Request
    },
    {
      path: '/roadmap',
      name: 'PersonalRoadmap',
      component: PersonalRoadmap
    },
    {
      path: '/submissions-review/:id',
      name: 'SubmissionReview',
      component: SubmissionReview,
      props: true,
      meta: { requiresAuth: true }
    },
    {
      path: '/statistics/user-activity',
      name: 'UserActivity',
      component: UserActivity
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    const token = getUserBearerToken();
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