import { get, post } from "@/scripts/api/apiClients";

const API_BASE_URL = "/ActivityLogs";

export const getActivityLogs = async () => {
  return await get(`${API_BASE_URL}`);
};

const addSingleLog = async (content) => {
  return await post(`${API_BASE_URL}`, JSON.stringify([
    { content: JSON.stringify(content)/*, creationTime: null*/ }
  ]));
}

export const logQuestionOfTheDay = async (question, answer) => {
  return await addSingleLog({
    question: question,
    answer: answer
  });
}

// Enums for events
export const getDisplayName = (trackedEvent) => {
  return TRACKED_EVENTS[trackedEvent].displayName;
}

export const TRACKED_EVENTS = Object.freeze({
  QuestionOfTheDay_Answered: { value: 0, label: 'QuestionOfTheDay_Answered', displayName: 'Trả lời câu hỏi hàng ngày' },
  Mood_Updated: { value: 1, label: 'Mood_Updated', displayName: 'Cập nhật tâm trạng' },
  Yoga_Practiced: { value: 2, label: 'Yoga_Practiced', displayName: 'Tập Yoga' },
  Course_Completed: { value: 3, label: 'Course_Completed', displayName: 'Hoàn thành khóa học' },
  Media_Viewed: { value: 4, label: 'Media_Viewed', displayName: 'Nghe nhạc / xem video' },

  General_Activity_Created: { value: 5, label: 'General_Activity_Created', displayName: '' },

  Submission_Created: { value: 6, label: 'Submission_Created', displayName: 'Làm bài khảo sát' },
  Routine_Created: { value: 7, label: 'Routine_Created', displayName: 'Xây dựng thói quen mới' },
  Routine_Updated: { value: 8, label: 'Routine_Updated', displayName: 'Cập nhật tình trạng thói quen' },
  RoutineLog_Created: { value: 9, label: 'RoutineLog_Created', displayName: 'Thêm tiến độ thói quen' },
  RoutineLog_Updated: { value: 10, label: 'RoutineLog_Updated', displayName: 'Cập nhật tiến độ thói quen' },
  DiaryNote_Created: { value: 11, label: 'DiaryNote_Created', displayName: 'Viết nhật kí suy nghĩ' },
  DiaryNote_Updated: { value: 12, label: 'DiaryNote_Updated', displayName: 'Cập nhật nhật kí suy nghĩ' },
    
  Article_Created: { value: 13, label: 'Article_Created', displayName: 'Tạo bài blog' },
  ArticleComment_Created: { value: 14, label: 'ArticleComment_Created', displayName: 'Bình luận về bài blog' },
  ArticleReaction_Created: { value: 15, label: 'ArticleReaction_Created', displayName: 'Thể hiện cảm xúc về bài blog' },
  MediaResource_Created: { value: 16, label: 'MediaResource_Created', displayName: 'Tạo media mới' },

  Conversation_Created: { value: 17, label: 'Conversation_Created', displayName: 'Tạo nhóm trò chuyện mới' },
  Conversation_Joined: { value: 18, label: 'Conversation_Joined', displayName: 'Tham gia vào nhóm trò chuyện' },
  Conversation_Left: { value: 19, label: 'Conversation_Left', displayName: 'Rời nhóm trò chuyện' },
  ChatMessage_Created: { value: 20, label: 'ChatMessage_Created', displayName: 'Gửi tin nhắn' },
  MessageReaction_Created: { value: 21, label: 'MessageReaction_Created', displayName: 'Thể hiện cảm xúc về tin nhắn' },
  Meeting_Created: { value: 22, label: 'Meeting_Created', displayName: 'Tạo cuộc họp mới' },
  Meeting_Joined: { value: 23, label: 'Meeting_Joined', displayName: 'Tham gia cuộc họp' },

  Advisor_Created: { value: 24, label: 'Advisor_Created', displayName: 'Đăng kí trở thành Advisor thành công' },
  Course_Created: { value: 25, label: 'Course_Created', displayName: 'Tạo khóa học mới' },
  Course_Enrolled: { value: 26, label: 'Course_Enrolled', displayName: 'Đăng kí khóa học' },
  Course_Unenrolled: { value: 27, label: 'Course_Unenrolled', displayName: 'Hủy đăng kí khóa học' },
  CourseReview_Created: { value: 28, label: 'CourseReview_Created', displayName: 'Đánh giá về khóa học' },
  LectureComment_Created: { value: 29, label: 'LectureComment_Created', displayName: 'Bình luận về bài giảng' }
});

export const getLinkByEvent = (eventName) => {
    const event = TRACKED_EVENTS[eventName];
    if (event) {
        switch (eventName) {
            case 'Mood_Updated':
                return '/mood-cart'; 
            case 'Course_Completed':
                return '/courses'; 
            case 'Conversation_Joined':
                return '/community'; 
            case 'Yoga_Practiced':
                return '/yoga'; 
            case 'Media_Viewed':
                return '/media-resources'; 
            case 'Submission_Created':
                return '/self-assessment'; 
            case 'Routine_Created':
                return '/habit-tracking'; 
            case 'DiaryNote_Created':
                return '/diary/diary-writing'; 
            case 'Article_Created':
                return '/blogs/create'; 
            case 'Conversation_Created':
                return '/community'; 
            case 'ChatMessage_Created':
                return '/chat'; 
            case 'MessageReaction_Created':
                return '/chat'; 
            case 'Meeting_Created':
                return '/meetings'; 
            case 'Meeting_Joined':
                return '/meetings'; 
            default:
                return '#'; 
        }
    }
    return '#'; 
};