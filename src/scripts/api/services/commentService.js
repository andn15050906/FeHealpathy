import { get, postForm, patchForm, del } from '@/scripts/api/apiClients';

const API_BASE_URL = '/Comments';

export const getPagedComments = async (blogId, page = 1, pageSize = 5) => {
    try {
        return await get(`${API_BASE_URL}`, {
            SourceId: blogId,
            page,
            pageSize
        });
    } catch (error) {
        console.error("🚨 Lỗi khi lấy danh sách bình luận:", error);
        throw error;
    }
};



export const createComment = async (commentData) => {
    try {
        return await postForm(`${API_BASE_URL}`, commentData);
    } catch (error) {
        console.error("🚨 Lỗi khi tạo bình luận:", error);
        throw error;
    }
};


export const updateComment = async (commentId, newContent) => {
    try {
        if (!commentId || !newContent || typeof newContent !== "string") {
            console.error("🚨 Lỗi: Dữ liệu không hợp lệ!", { commentId, newContent });
            throw new Error("Id và Content phải là chuỗi hợp lệ.");
        }

        // Tạo FormData theo yêu cầu API
        const formData = new FormData();
        formData.append("id", commentId);
        formData.append("content", newContent.trim()); // Loại bỏ khoảng trắng thừa

        console.log("📡 Gửi PATCH request đến API với FormData:", Object.fromEntries(formData));

        const response = await patchForm(`${API_BASE_URL}`, formData);
        return response;
    } catch (error) {
        console.error("🚨 Lỗi khi cập nhật bình luận:", error.response?.data || error.message);
        console.error("🔍 Chi tiết lỗi:", error.response?.data?.errors); // Kiểm tra lỗi cụ thể
        throw error;
    }
};


export const deleteComment = async (commentId) => {
    try {
        return await del(`${API_BASE_URL}/${commentId}`);
    } catch (error) {
        console.error("🚨 Lỗi khi xóa bình luận:", error);
        throw error;
    }
};
