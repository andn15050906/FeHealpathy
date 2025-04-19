import { get, post } from "@/scripts/api/apiClients";

const API_BASE_URL = "/ActivityLogs";

export const getActivityLogs = async (queryParams = {}) => {
  return await get(`${API_BASE_URL}`, queryParams);
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

export const logYogaPracticed = async (id) => {
    return await addSingleLog({
        event: TRACKED_EVENTS.Yoga_Practiced.label,
        id: id
    });
}

export const logCourseCompleted = async (id) => {
    return await addSingleLog({
        event: TRACKED_EVENTS.Course_Completed.label,
        id: id
    });
}

export const logMediaViewed = async (id) => {
    return await addSingleLog({
        event: TRACKED_EVENTS.Media_Viewed.label,
        id: id
    });
}

export const logArticleRead = async (id) => {
    return await addSingleLog({
        event: TRACKED_EVENTS.Article_Read.label,
        id: id
    });
}

// Enums for events
export const getDisplayName = (trackedEvent) => {
  return TRACKED_EVENTS[trackedEvent].displayName;
}

export const TRACKED_EVENTS = Object.freeze({
  QuestionOfTheDay_Answered: { value: 0, label: 'QuestionOfTheDay_Answered', displayName: 'Trả lời câu hỏi hàng ngày', entity: 'ActivityLog' },
  Mood_Updated: { value: 1, label: 'Mood_Updated', displayName: 'Cập nhật tâm trạng', entity: 'Mood' },
  Yoga_Practiced: { value: 2, label: 'Yoga_Practiced', displayName: 'Tập Yoga', entity: 'Yoga' },
  Course_Completed: { value: 3, label: 'Course_Completed', displayName: 'Hoàn thành khóa học', entity: 'Course' },
  Media_Viewed: { value: 4, label: 'Media_Viewed', displayName: 'Nghe nhạc / xem video', entity: 'MediaResource' },

  General_Activity_Created: { value: 5, label: 'General_Activity_Created', displayName: '', entity: 'ActivityLog' },

  Submission_Created: { value: 6, label: 'Submission_Created', displayName: 'Làm bài khảo sát', entity: 'Survey' },
  Routine_Created: { value: 7, label: 'Routine_Created', displayName: 'Xây dựng thói quen mới', entity: 'Routine' },
  Routine_Updated: { value: 8, label: 'Routine_Updated', displayName: 'Cập nhật tình trạng thói quen', entity: 'Routine' },
  RoutineLog_Created: { value: 9, label: 'RoutineLog_Created', displayName: 'Thêm tiến độ thói quen', entity: 'RoutineLog' },
  RoutineLog_Updated: { value: 10, label: 'RoutineLog_Updated', displayName: 'Cập nhật tiến độ thói quen', entity: 'RoutineLog' },
  DiaryNote_Created: { value: 11, label: 'DiaryNote_Created', displayName: 'Viết nhật kí suy nghĩ', entity: 'DiaryNote' },
  DiaryNote_Updated: { value: 12, label: 'DiaryNote_Updated', displayName: 'Cập nhật nhật kí suy nghĩ', entity: 'DiaryNote' },
    
  Article_Created: { value: 13, label: 'Article_Created', displayName: 'Tạo bài blog', entity: 'Article' },
  ArticleComment_Created: { value: 14, label: 'ArticleComment_Created', displayName: 'Bình luận về bài blog', entity: 'ArticleComment' },
  ArticleReaction_Created: { value: 15, label: 'ArticleReaction_Created', displayName: 'Thể hiện cảm xúc về bài blog', entity: 'ArticleReaction' },
  MediaResource_Created: { value: 16, label: 'MediaResource_Created', displayName: 'Tạo media mới', entity: 'MediaResource' },

  Conversation_Created: { value: 17, label: 'Conversation_Created', displayName: 'Tạo nhóm trò chuyện mới', entity: 'Conversation' },
  Conversation_Joined: { value: 18, label: 'Conversation_Joined', displayName: 'Tham gia vào nhóm trò chuyện', entity: 'Conversation' },
  Conversation_Left: { value: 19, label: 'Conversation_Left', displayName: 'Rời nhóm trò chuyện', entity: 'Conversation' },
  ChatMessage_Created: { value: 20, label: 'ChatMessage_Created', displayName: 'Gửi tin nhắn', entity: 'ChatMessage' },
  MessageReaction_Created: { value: 21, label: 'MessageReaction_Created', displayName: 'Thể hiện cảm xúc về tin nhắn', entity: 'MessageReaction' },
  Meeting_Created: { value: 22, label: 'Meeting_Created', displayName: 'Tạo cuộc họp mới', entity: 'Meeting' },
  Meeting_Joined: { value: 23, label: 'Meeting_Joined', displayName: 'Tham gia cuộc họp', entity: 'Meeting' },

  Advisor_Created: { value: 24, label: 'Advisor_Created', displayName: 'Đăng kí trở thành Advisor thành công', entity: 'Advisor' },
  Course_Created: { value: 25, label: 'Course_Created', displayName: 'Tạo khóa học mới', entity: 'Course' },
  Course_Enrolled: { value: 26, label: 'Course_Enrolled', displayName: 'Đăng kí khóa học', entity: 'Course' },
  Course_Unenrolled: { value: 27, label: 'Course_Unenrolled', displayName: 'Hủy đăng kí khóa học', entity: 'Course' },
  CourseReview_Created: { value: 28, label: 'CourseReview_Created', displayName: 'Đánh giá về khóa học', entity: 'CourseReview' },
  LectureComment_Created: { value: 29, label: 'LectureComment_Created', displayName: 'Bình luận về bài giảng', entity: 'LectureComment' },

  Article_Read: { value: 30, label: 'Article_Read', displayName: 'Đọc bài viết', entity: 'Article' }
});

export const ENTITY_TYPES = Object.freeze({
    Course: { en: 'Course', vi: 'Khóa học' },
    MediaResource: { en: 'MediaResource', vi: 'Video / bản nhạc' },
    Article: { en: 'Article', vi: 'Bài blog' },
    Conversation: { en: 'Conversation', vi: 'Nhóm chat' },
    Survey: { en: 'Survey', vi: 'Bài khảo sát' }
});

export function getEntityTypeByEventLabel(label) {
    for (const event in TRACKED_EVENTS) {
        if (TRACKED_EVENTS[event].label === label) {
            for (const entity in ENTITY_TYPES) {
                if (ENTITY_TYPES[entity].en == TRACKED_EVENTS[event].entity)
                    return entity;
            }
            return null;
        }
    }
    return null;
}

export function getDisplayNameByEventLabel(label) {
    for (const event in TRACKED_EVENTS) {
        if (TRACKED_EVENTS[event].label === label) {
            return TRACKED_EVENTS[event].displayName;
        }
    }
    return '';
}

export const getLinkByEventLabel = (label) => {
    const event = TRACKED_EVENTS[label];
    if (event) {
        switch (label) {
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

export const getLinkByObjectId = (label, entityObj) => {
    const event = TRACKED_EVENTS[label];
    if (!entityObj)
        entityObj = { id: '' }

    if (event) {
        switch (label) {
            case 'Mood_Updated':
                return '/mood-cart'; 
            case 'Course_Completed':
                return `/courses/${entityObj.id ?? ''}`; 
            case 'Conversation_Joined':
                return '/community'; 
            case 'Yoga_Practiced':
                return `/yoga/poses/${entityObj.id ?? ''}`; 
            case 'Media_Viewed':
                return `/media-resources?id=${entityObj.id ?? ''}`; 
            case 'Submission_Created':
                return `/self-assessment/${entityObj.id ?? ''}`; 
            case 'Routine_Created':
                return '/habit-tracking'; 
            case 'DiaryNote_Created':
                return '/diary/diary-writing'; 
            case 'Article_Created':
                return '/blogs/create'; 
            case 'Conversation_Created':
                return `/community?id=${entityObj ?? ''}`; 
            case 'ChatMessage_Created':
                if (entityObj.id)
                    return `/chat?conversationId=${entityObj.id ?? ''}`;
                return `/chat?id=${entityObj.id ?? ''}`;
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
}