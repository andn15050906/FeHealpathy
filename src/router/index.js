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
import PracticeToolList from '@/views/Practice/PracticeToolList.vue'
import YogaExerciseDetail from '@/views/Practice/Yoga/YogaExerciseDetail.vue'
import YogaView from '@/views/Practice/Yoga/YogaCatalog.vue'
import HabitTracking from '@/views/Practice/HabitTracking/HabitTracking.vue'
import CommunityOverview from '@/views/Community/CommunityOverview.vue'
import GroupOverview from '@/views/Community/GroupOverview.vue'
import ViewGroup from '@/views/Community/ViewGroup.vue'
import SelfAssessment from '@/views/Practice/SelfAssessment.vue'
import MusicControl from '@/views/Music_Player/MusicControl.vue'
import NotFound from '@/components/Layouts/404.vue'
import Settings from '@/views/Profile/Settings/Settings.vue'
import SettingUp from '@/views/Profile/Preferences/SettingUp.vue'
import FaqPage from '@/pages/faq/FaqPage.vue'
import PaymentsPage from '@/pages/payments/PaymentsPage.vue'
import MoodOverview from '@/views/MoodRecording/MoodOverview.vue'
import Happy from '@/views/MoodRecording/MoodCart/Happy.vue'
import Sad from '@/views/MoodRecording/MoodCart/Sad.vue'
import Angry from '@/views/MoodRecording/MoodCart/Angry.vue'
import Eager from '@/views/MoodRecording/MoodCart/Eager.vue'
import Anxiety from '@/views/MoodRecording/MoodCart/Anxiety.vue'
import DiaryWriting from '@/views/MoodRecording/Diary/DiaryWriting.vue'
import DiaryList from '@/views/MoodRecording/Diary/DiaryList.vue'
import EmotionTracking from '@/views/MoodRecording/EmotionTracking.vue'
import DailyQuestion from '@/components/NotificationComponents/DailyQuestion.vue'
import BlogDetail from '@/views/Blogs/BlogDetail.vue'
import Register from '@/views/Profile/Register.vue'
import CreateBlog from '@/views/Blogs/CreateBlog.vue'
import ManageBlog from '@/views/Blogs/ManageBlog.vue'
import UpdateBlog from '@/views/Blogs/UpdateBlog.vue'
import ManageCourse from '@/views/Courses/ManageCourse.vue'
import CreateCourse from '@/views/Courses/CreateCourse.vue'
import UpdateCourse from '@/views/Courses/UpdateCourse.vue'
import Calendar from '@/components/Calendar/Calendar.vue'
import CreateGroup from '@/components/GroupComponents/CreateGroup.vue'
import EditGroup from '@/components/GroupComponents/EditGroup.vue'
import CreateSurvey from '@/components/SurveyComponents/CreateSurvey.vue'
import EditSurvey from '@/components/SurveyComponents/EditSurvey.vue'
import MediaControl from '@/views/MediaResource/MediaControl.vue'
import ManageSurvey from '@/views/Admin/ManageSurvey.vue'

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
      path: '/blogs',
      name: 'blogCatalog',
      component: BlogCatalog
    },
    {
      path: '/blogs/create',
      name: 'createBlog',
      component: CreateBlog
    },
    {
      path: '/blogs/manage',
      name: 'manageBlog',
      component: ManageBlog
    },
    {
      path: '/blogs/update',
      name: 'updateBlog',
      component: UpdateBlog
    },
    {
      path: '/blogs/:id',
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
      path: '/courses/create',
      name: 'createCourse',
      component: CreateCourse
    },
    {
      path: '/courses/manage',
      name: 'manageCourse',
      component: ManageCourse
    },
    {
      path: '/courses/update',
      name: 'updateCourse',
      component: UpdateCourse
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
      path: '/faq',
      name: 'FAQ',
      component: FaqPage
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
      path: '/practice/yoga',
      name: 'yoga',
      component: YogaView
    },
    {
      path: '/Practice/Yoga/:id',
      name: 'YogaExerciseDetail',
      component: YogaExerciseDetail
    },
    {
      path: '/mood',
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
    {
      path: '/diary/diary-writing/:id?/:title?',
      name: 'DiaryWriting',
      component: DiaryWriting,
      props: true
    },
    {
      path: '/diary/diary-list',
      name: 'diaryList',
      component: DiaryList
    },
    {
      path: '/daily-question',
      name: 'dailyQuestion',
      component: DailyQuestion
    },
    {
      path: '/emotion-tracking',
      name: 'emotionTracking',
      component: EmotionTracking
    },
    {
      path: '/self-assessment',
      name: 'SelfAssessment',
      component: SelfAssessment
    },
    {
      path: '/habit-tracking',
      name: 'habitTracking',
      component: HabitTracking,
    },
    {
      path: '/create-group',
      name: 'createGroup',
      component: CreateGroup,
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
      path: '/habit-tracking',
      name: 'habitTracking',
      component: HabitTracking,
    },
    {
      path: '/media-library',
      name: 'MusicControl',
      component: MusicControl
    },
    {
      path: '/settings',
      name: 'Settings',
      component: Settings
    },
    {
      path: '/setting-up',
      name: 'SettingUp',
      component: SettingUp
    },
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
      path: '/media-resource',
      name: 'MediaControl',
      component: MediaControl
    },
    {
      path: '/survey',
      name: 'Survey',
      component: ManageSurvey
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
