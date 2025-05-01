import { get, postForm, patchForm, del } from '@/scripts/api/apiClients';

const API_BASE_URL = '/Comments';

export const TargetFeedbackEntities = Object.freeze({
    ArticleComment: { value: 0, label: 'ArticleComment' },
    LectureComment: { value: 1, label: 'LectureComment' },

    MessageReaction: { value: 2, label: 'MessageReaction' },
    LectureReaction: { value: 3, label: 'LectureReaction' },
    ArticleReaction: { value: 4, label: 'ArticleReaction' },
    
    CreateMessageReaction: { value: 5, label: 'CreateMessageReaction' },
    DeleteMessageReaction: { value: 6, label: 'DeleteMessageReaction' }
});

export const getPagedBlogComments = async (blogId, page = 1, pageSize = 5) => {
    try {
        return await get(`${API_BASE_URL}`, {
            SourceId: blogId,
            TargetEntity: TargetFeedbackEntities.ArticleComment.value,
            page,
            pageSize
        });
    } catch (error) {
        throw error;
    }
};

export const getPagedLectureComments = async (lectureId, page = 1, pageSize = 10) => {
    try {
        return await get(`${API_BASE_URL}`, {
            SourceId: lectureId,
            TargetEntity: TargetFeedbackEntities.LectureComment.value,
            page,
            pageSize
        });
    } catch (error) {
        throw error;
    }
};

export const createBlogComment = async (formData) => {
    try {
        return await postForm(`${API_BASE_URL}`, formData);
    } catch (error) {
        throw error;
    }
};

export const createLectureComment = async (lectureId, content) => {
    try {
        if (!lectureId || !content || typeof content !== "string") {
            throw new Error("LectureId và Content phải là chuỗi hợp lệ.");
        }

        const formData = new FormData();
        formData.append("sourceId", lectureId);
        formData.append("targetEntity", TargetFeedbackEntities.LectureComment.value);
        formData.append("content", content.trim());
        return await postForm(`${API_BASE_URL}`, formData);
    } catch (error) {
        throw error;
    }
};

export const updateComment = async (commentId, newContent) => {
    try {
        if (!commentId || !newContent || typeof newContent !== "string") {
            throw new Error("Id và Content phải là chuỗi hợp lệ.");
        }

        const formData = new FormData();
        formData.append("id", commentId);
        formData.append("content", newContent.trim());
        
        const response = await patchForm(`${API_BASE_URL}`, formData);
        return response;
    } catch (error) {
        throw error;
    }
};

export const updateLectureComment = async (commentId, newContent) => {
    try {
        if (!commentId || !newContent || typeof newContent !== "string") {
            throw new Error("Id và Content phải là chuỗi hợp lệ.");
        }

        const formData = new FormData();
        formData.append("id", commentId);
        formData.append("content", newContent.trim());
        formData.append("targetEntity", TargetFeedbackEntities.LectureComment.value);
        
        const response = await patchForm(`${API_BASE_URL}`, formData);
        return response;
    } catch (error) {
        throw error;
    }
};

// export const deleteComment = async (commentId) => {
//     try {
//         return await del(`${API_BASE_URL}/${commentId}`);
//     } catch (error) {
//         throw error;
//     }
// };

export const deleteArticleComment = async (commentId) => {
    return await del(`/Comments/article/${commentId}`);
};

export const deleteLectureComment = async (commentId) => {
    return await del(`/Comments/lecture/${commentId}`);
};



