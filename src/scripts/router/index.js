import { createRouter, createWebHistory } from 'vue-router'
import { getUserBearerToken, getRole } from '@/scripts/api/services/authService'

import SignIn from '@/views/Auth/SignIn.vue';
import Register from '@/views/Auth/Register.vue'
import ForgotPassword from '@/views/Auth/ForgotPassword.vue'
import ResetPassword from '@/views/Auth/ResetPassword.vue'

import HomePage from '@/views/HomePage.vue'
import FaqPage from '@/views/FaqPage.vue'
import NotFound from '@/views/404.vue'

import ViewUserProfile from '@/views/Profile/PersonalProfile/ViewUserProfile.vue'
import EditUserProfile from '@/views/Profile/PersonalProfile/EditUserProfile.vue'
import ChangePassword from '@/views/Profile/PersonalProfile/ChangePassword.vue'
import RequestToBeAdvisor from '@/views/Profile/PersonalProfile/RequestToBeAdvisor.vue'
import Settings from '@/views/Profile/Settings.vue'
import SettingUp from '@/views/Profile/SettingUp.vue'
import UserActivity from '@/views/Profile/Statistics/UserActivity.vue'
import SelfAssessmentResult from '@/views/Profile/Statistics/SelfAssessmentResult.vue'
import SubmissionReview from '@/views/Profile/Statistics/SubmissionReview.vue'

import PracticeToolList from '@/views/PracticeTools/PracticeToolList.vue'
import SelfAssessment from '@/views/PracticeTools/SelfAssessment/SelfAssessment.vue'
import DiaryList from '@/views/PracticeTools/Diary/DiaryList.vue'
import DiaryWriting from '@/views/PracticeTools/Diary/DiaryWriting.vue'
import MoodOverview from '@/views/PracticeTools/MoodRecording/MoodOverview.vue'
import EmotionTracking from '@/views/PracticeTools/MoodRecording/EmotionTracking.vue'
import Happy from '@/views/PracticeTools/MoodRecording/MoodCart/Happy.vue'
import Sad from '@/views/PracticeTools/MoodRecording/MoodCart/Sad.vue'
import Angry from '@/views/PracticeTools/MoodRecording/MoodCart/Angry.vue'
import Eager from '@/views/PracticeTools/MoodRecording/MoodCart/Eager.vue'
import Anxiety from '@/views/PracticeTools/MoodRecording/MoodCart/Anxiety.vue'
import MediaResources from '@/views/PracticeTools/MediaResource/MediaResources.vue'
import MusicControl from '@/views/PracticeTools/MediaResource/MusicControl.vue'
import VideoControl from '@/views/PracticeTools/MediaResource/VideoControl.vue'
import MediaControl from '@/views/PracticeTools/MediaResource/MediaControl.vue'
import YogaView from '@/views/PracticeTools/Yoga/YogaCatalog.vue'
import YogaExerciseDetail from '@/views/PracticeTools/Yoga/YogaExerciseDetail.vue'
import YogaPractice from '@/views/PracticeTools/Yoga/YogaPractice.vue'
import YogaOptions from '@/views/PracticeTools/Yoga/YogaOptions.vue';
import YogaPoses from '@/views/PracticeTools/Yoga/YogaPoses.vue';
import YogaPoseDetails from '@/views/PracticeTools/Yoga/YogaPoseDetails.vue';
import HabitTracking from '@/views/PracticeTools/HabitTracking/HabitTracking.vue'

import BlogCatalog from '@/views/Blogs/BlogCatalog.vue'
import BlogDetail from '@/views/Blogs/BlogDetail.vue'
import SearchBlogResult from '@/views/Blogs/SearchBlogResult.vue'

import CourseList from '@/views/Courses/CourseList.vue'
import CourseDetail from '@/views/Courses/CourseDetail.vue'
import LectureDetail from '@/views/Courses/LectureDetail.vue'
import CoursePayment from '@/views/Courses/CoursePayment.vue'
import CoursesEnrolled from '@/views/Courses/CoursesEnrolled.vue'

import CommunityOverview from '@/views/Community/CommunityOverview.vue'
import GroupOverview from '@/views/Community/GroupOverview.vue'
import ViewGroup from '@/views/Community/ViewGroup.vue'
import CreateGroup from '@/views/Community/CreateGroup.vue'
import EditGroup from '@/views/Community/EditGroup.vue'
import ConversationWindow from '@/views/Community/ConversationWindow.vue'
import CallWindow from '@/components/CommunityComponents/CallWindow.vue'

import Dashboard from '@/views/Profile/Admin/Dashboard.vue'
import ModerateUsers from '@/views/Profile/Admin/ModerateUsers.vue'
import CreateAdminAccounts from '@/views/Profile/Admin/CreateAdminAccounts.vue'
import ModerateUploadedContent from '@/views/Profile/Admin/ModerateUploadedContent.vue'
import ViewReports from '@/views/Profile/Admin/ViewReports.vue'
import ManageSurvey from '@/views/Profile/Admin/ManageSurvey.vue'
import ManageYoga from '@/views/Profile/Admin/ManageYoga.vue'
import CreateYogaLesson from '@/views/Profile/Admin/CreateYoga.vue'

import ManageAdvisorContent from '@/views/Profile/Advisor/Manage/ManageAdvisorContent.vue';
import ViewAdvisor from '@/views/Profile/Advisor/ViewAdvisor.vue'
import EditAdvisor from '@/views/Profile/Advisor/EditAdvisor.vue'
import ScheduleMeeting from '@/views/Meetings/ScheduleMeeting.vue'
import Payment from '@/views/Profile/Advisor/Payment.vue'
import CreateBlog from '@/views/Profile/Advisor/Manage/CreateBlog.vue'
import ManageBlog from '@/views/Profile/Advisor/Manage/ManageBlog.vue'
import UpdateBlog from '@/views/Profile/Advisor/Manage/UpdateBlog.vue'
import ManageCourse from '@/views/Profile/Advisor/Manage/ManageCourse.vue'
import CreateCourse from '@/views/Profile/Advisor/Manage/CreateCourse.vue'
import UpdateCourse from '@/views/Profile/Advisor/Manage/UpdateCourse.vue'
import RoadmapBuilder from '@/views/Profile/Advisor/Manage/RoadmapBuilder.vue'
import UpdateRoadmap from '@/views/Profile/Advisor/Manage/UpdateRoadmap.vue'
import RoadmapProgress from '@/components/RoadmapComponents/RoadmapProgress.vue'
import CreateRoadmap from '@/views/Profile/Advisor/Manage/CreateRoadmap.vue';

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
      /*components: {
        default: HomePage,
        roadmapProgress: RoadmapProgress
      }*/
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
      path: '/forgot-password',
      name: 'forgotPassword',
      component: ForgotPassword
    },
    {
      path: '/change-password',
      name: 'ChangePassword',
      component: ChangePassword
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
      path: '/advisor/edit-profile',
      name: 'editAdvisor',
      component: EditAdvisor,
      meta: { requiresAuth: true, requiresAdvisor: true }
    },
    {
      path: '/meetings/schedule',
      name: 'ScheduleMeeting',
      component: ScheduleMeeting,
      //meta: {requiresAuth: true,title: 'Đặt lịch họp'}
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
      path: '/options/yoga',
      name: 'YogaOptions',
      component: YogaOptions
    },
    {
      path: '/yoga/poses',
      name: 'YogaPoses',
      component: YogaPoses
    },
    {
      path: '/yoga/poses/:id',
      name: 'YogaPoseDetails',
      component: YogaPoseDetails
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
      // not called
      path: '/emotion-tracking',
      name: 'emotionTracking',
      component: EmotionTracking,
      meta: { requiresAuth: true }
    },
    {
      path: '/self-assessment/:id?',
      name: 'SelfAssessment',
      component: SelfAssessment,
      props: true,
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
      path: '/media-resources',
      name: 'MediaResources',
      component: MediaResources,
      meta: { requiresPremium : true }
    },
    {
      path: '/music-library',
      name: 'MusicControl',
      component: MusicControl
    },
    {
      path: '/video-library',
      name: 'VideoControl',
      component: VideoControl
    },
    {
      path: '/media/manage',
      name: 'MediaControl',
      component: MediaControl,
      meta: { requiresAuth: true, requiresAdvisorOrAdmin: true }
    },
    // Practice - Survey
    {
      path: '/surveys',
      name: 'Survey',
      component: ManageSurvey,
      meta: { requiresAuth: true, requiresAdvisorOrAdmin: true }
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
      component: ManageBlog,
      meta: { requiresAuth: true, requiresAdvisorOrAdmin: true }
    },
    {
      path: '/blogs/create',
      name: 'createBlog',
      component: CreateBlog,
      meta: { requiresAuth: true, requiresAdvisorOrAdmin: true }
    },
    {
      path: '/blogs/edit-blog/:id',
      name: 'updateBlog',
      component: UpdateBlog,
      meta: { requiresAuth: true, requiresAdvisorOrAdmin: true },
      props: true
    },
    {
      path: "/blog/:id",
      name: 'blogDetail',
      component: BlogDetail,
      props: true
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
      path: '/courses/enrolled',
      name: 'coursesEnrolled',
      component: CoursesEnrolled
    },
    {
      path: '/courses/manage',
      name: 'manageCourses',
      component: ManageCourse,
      meta: { requiresAuth: true, requiresAdvisor: true }
    },
    {
      path: '/courses/create',
      name: 'createCourse',
      component: CreateCourse,
      // meta: { requiresAuth: true, requiresAdvisor: true }
    },
    {
      path: '/courses/update/:id',
      name: 'updateCourse',
      component: UpdateCourse,
      // meta: { requiresAuth: true, requiresAdvisor: true },
      props: true
    },
    {
      path: '/courses/:id',
      name: 'courseDetail',
      component: CourseDetail,
      meta: { requiresAuth: true },
      props: true
    },
    {
      path: '/lectures/:id',
      name: 'lectureDetail',
      component: LectureDetail,
      meta: { requiresAuth: true },
      props: true
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
    {
      path: '/call',
      name: 'call',
      component: CallWindow,
      meta: { isAppMode: true, requiresAuth: true }
    },

    // Assignment - Old
    /*{
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
    },*/

    // Others
    {
      path: '/payments',
      name: 'Payments',
      component: CoursePayment
    },
    {
      path: '/YogaPractice',
      name: 'YogaPractice',
      component: YogaPractice
    },
    {
      path: '/yogas/manage',
      name: 'ManageYoga',
      meta: { requiresAuth: true, requiresAdvisorOrAdmin: true },
      component: ManageYoga
    },
    {
      path: '/yoga/create',
      name: 'CreateYoga',
      meta: { requiresAuth: true, requiresAdvisorOrAdmin: true },
      component: CreateYogaLesson
    },
    {
      path: '/request-advisor',
      name: 'Request',
      component: RequestToBeAdvisor,
      meta: { requiresAuth: true, requiresMember: true }
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
      name: 'UserActivityResult',
      component: UserActivity
    },
    {
      path: '/statistics/self-assessment',
      name: 'SelfAssessmentResult',
      component: SelfAssessmentResult
    },
    {
      path: '/roadmap-builder',
      name: 'RoadmapBuilder',
      meta: { requiresAuth: true, requiresAdvisorOrAdmin: true },
      component: RoadmapBuilder
    },
    {
      path: '/progress',
      name: 'Progress',
      component: RoadmapProgress
    },
    {
      path: '/roadmaps/create',
      name: 'CreateRoadmap',
      component: CreateRoadmap
    },
    {
      path: '/roadmaps/edit/:id',
      name: 'updateRoadmap',
      component: UpdateRoadmap
    },

    // Advisor
    {
      path: '/advisor/content',
      name: 'ManageAdvisorContent',
      meta: { requiresAuth: true, requiresAdvisorOrAdmin: true },
      component: ManageAdvisorContent,
    },

    // Admin
    {
      path: '/admin',
      name: 'AdminDashboard',
      meta: { requiresAuth: true, requiresAdmin: true },
      component: Dashboard
    },
    {
      path: '/admin/moderate-users',
      name: 'ModerateUsers',
      meta: { requiresAuth: true, requiresAdmin: true },
      component: ModerateUsers
    },
    {
      path: '/admin/create-admin',
      name: 'CreateAdminAccounts',
      meta: { requiresAuth: true, requiresAdmin: true },
      component: CreateAdminAccounts
    },
    {
      path: '/admin/moderate-content',
      name: 'ModerateUploadedContent',
      meta: { requiresAuth: true, requiresAdmin: true },
      component: ModerateUploadedContent
    },
    {
      path: '/admin/view-reports',
      name: 'ViewReports',
      meta: { requiresAuth: true, requiresAdmin: true },
      component: ViewReports
    }

    //
  ]
})

router.beforeEach((to, from, next) => {
  let hasRight = isAuthorized(to);
  if (hasRight)
    next();
  else
    next('/sign-in');
});

const isAuthorized = (to) => {
  if (!to.matched.some(record => record.meta.requiresAuth))
    return true;

  if (!getUserBearerToken())
    return false;

  let role = getRole();
  if (to.matched.some(record => record.meta.requiresAdvisorOrAdmin && !['Advisor', 'Admin'].includes(role)))
    return false;
  if (to.matched.some(record => record.meta.requiresAdvisor) && role != 'Advisor')
    return false;
  if (to.matched.some(record => record.meta.requiresAdmin) && role != 'Admin')
    return false;
  if (to.matched.some(record => record.meta.requiresMember) && role != 'Member')
    return false;
  
  return true;
}

export default router;