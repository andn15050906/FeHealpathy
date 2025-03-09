<template>
    <div class="container">
        <div class="content-wrapper">
            <section class="comments-section">
                <h3 class="section-title">Bình luận</h3>
                <form class="comment-form" @submit.prevent="submitComment">
                    <label for="commentInput" class="visually-hidden">
                        Hãy chia sẻ cảm nghĩ của bạn về bài viết
                    </label>
                    <textarea v-model="newComment" id="commentInput" class="comment-input"
                        placeholder="Hãy chia sẻ cảm nghĩ của bạn về bài viết"
                        aria-label="Hãy chia sẻ cảm nghĩ của bạn về bài viết"></textarea>
                    <button type="submit" class="submit-button" :disabled="loading">Gửi</button>
                </form>
                <!-- <div class="comment-filters">
                    <button class="filter-button active">Hot nhất</button>
                    <button class="filter-button">Mới nhất</button>
                </div> -->
                <div v-if="comments.length > 0" class="comments-list">
    <article v-for="(comment, index) in comments" :key="index" class="comment-item">
        <img :src="comment.avatar" :alt="comment.author" class="avatar" />
        <div class="comment-content">
            <div class="comment-header">
                <div class="comment-author">{{ comment.author }}</div>
                <div class="comment-date">{{ formatDate(comment.creationTime) }}</div>
            </div>

<div v-if="editingCommentId === comment.id" class="edit-comment">
    <textarea
        v-model="editingContent"
        class="comment-input"
        :key="editingCommentId"
    ></textarea>
    <div class="edit-actions">
        <button class="submit-button" @click="updateComment(comment.id)">Lưu</button>
        <button class="cancel-button" @click="editingCommentId = null">Hủy</button>
    </div>
</div>


            <div v-else class="comment-top-row">
                <p class="comment-text">{{ comment.content }}</p>
                <div class="comment-actions">
                    <button class="action-button" @click="toggleEditComment(comment)">✏️</button>
                    <button class="action-button" @click="confirmDeleteComment(comment.id)">🗑️</button>

                </div>
            </div>

            <div class="comment-bottom-row">
                <button class="action-button">
                    👍 <span>{{ comment.likes }}</span>
                </button>
                <button class="action-button">💬 Trả lời</button>
            </div>
        </div>
    </article>
</div>

                <div v-else class="no-comments">
                    <p>Chưa có bình luận nào, hãy là người đầu tiên bình luận!</p>
                </div>

                <button v-if="comments.length > 0 && page < totalPages" class="load-more" @click="loadMoreComments">
                    Tải thêm bình luận
                </button>
            </section>
        </div>
    </div>
    <DeleteConfirmPopup 
    :message="'Bạn có chắc chắn muốn xóa bình luận này?'"
    :isVisible="isDeletePopupVisible"
    :url="deleteUrl"
    @confirmDelete="handleDeleteConfirmed"
    @update:isVisible="isDeletePopupVisible = $event"
/>

</template>

<script>
import { getPagedComments, createComment, updateComment, deleteComment } from "@/scripts/api/services/commentService";
import dayjs from "dayjs";
import { getUserById } from "@/scripts/api/services/userService";
import DeleteConfirmPopup from "../Common/Popup/DeleteConfirmPopup.vue";

export default {
    name: "BlogCommentSection",
    components: {
        DeleteConfirmPopup
    },
    props: ["blogId"],
    computed: {
    deleteUrl() {
        return this.commentToDelete ? `/api/Comments/${this.commentToDelete}` : "";
    }
},
    data() {
        return {
            comments: [],
            newComment: "",
            loading: false,
            page: 1,
            pageSize: 5,
            totalPages: 1,
            editingCommentId: null, 
            editingContent: "", 
            isDeletePopupVisible: false, 
            commentToDelete: null,
        };
    },
    async mounted() {
        await this.fetchComments();
    },
    methods: {
        async fetchComments() {
    try {
        const response = await getPagedComments(this.blogId, this.page, this.pageSize);

        if (response.items && Array.isArray(response.items)) {
            const newComments = await Promise.all(
                response.items.map(async (comment) => {
                    try {
                        const userInfo = await getUserById(comment.creatorId);
                        return {
                            ...comment,
                            author: userInfo.fullName || "Người dùng ẩn danh",
                            avatar: userInfo.avatarUrl || "default-avatar.jpg",
                        };
                    } catch (error) {
                        console.error("🚨 Lỗi khi lấy thông tin người dùng:", error);
                        return {
                            ...comment,
                            author: "Người dùng ẩn danh",
                            avatar: "default-avatar.jpg",
                        };
                    }
                })
            );

            this.comments = this.page === 1 ? newComments : [...this.comments, ...newComments];

            this.totalPages = response.totalPages || 1;
        }
    } catch (error) {
        console.error("🚨 Lỗi khi tải bình luận:", error);
    }
}
,

        toggleEditComment(comment) {
            this.editingCommentId = comment.id;
            this.editingContent = comment.content;
        },

        async updateComment(commentId) {
    if (!this.editingContent || typeof this.editingContent !== "string" || !this.editingContent.trim()) {
        console.error("🚨 Lỗi: Nội dung bình luận không hợp lệ!");
        alert("Nội dung bình luận không được để trống.");
        return;
    }

    try {
        console.log("📡 Gửi cập nhật bình luận:", this.editingContent);

        await updateComment(commentId, this.editingContent.trim());

        this.comments = this.comments.map(comment =>
            comment.id === commentId ? { ...comment, content: this.editingContent } : comment
        );

        this.editingCommentId = null;
        this.editingContent = "";
    } catch (error) {
        console.error("🚨 Lỗi khi cập nhật bình luận:", error.response?.data || error.message);
        alert("Không thể cập nhật bình luận. Vui lòng thử lại!");
    }
}



,

        confirmDeleteComment(commentId) {
    this.commentToDelete = commentId;
    this.isDeletePopupVisible = true;
}
,

        async handleDeleteConfirmed(confirm) {
            if (confirm && this.commentToDelete) {
                try {
                    await deleteComment(this.commentToDelete);

                    this.comments = this.comments.filter(comment => comment.id !== this.commentToDelete);
                } catch (error) {
                    console.error("🚨 Lỗi khi xóa bình luận:", error);
                }
            }
            this.isDeletePopupVisible = false;
        },

        async submitComment() {
            if (!this.newComment.trim()) return;

            this.loading = true;

            try {
                const formData = new FormData();
                formData.append("SourceId", this.blogId);
                formData.append("content", this.newComment);

                console.log("📡 Gửi dữ liệu:", Object.fromEntries(formData));

                const response = await createComment(formData);
                console.log("✅ Phản hồi từ API:", response);

                this.newComment = "";
                this.page = 1;
                await this.fetchComments();
            } catch (error) {
                console.error("🚨 Lỗi khi gửi bình luận:", error);
            } finally {
                this.loading = false;
            }
        },

        async loadMoreComments() {
    if (this.page >= this.totalPages) return;

    this.page += 1;
    await this.fetchComments();
}
,

        formatDate(dateString) {
            return dayjs(dateString).format("DD/MM/YYYY");
        }
    }
};
</script>


<style scoped>
.container {
    background: #fff;
    display: flex;
    flex-direction: column;
    align-items: center;
}


.comment-top-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
    margin-top: 5px;
}

.comment-text {
    flex: 1;
    font-size: 14px;
    color: #333;
    margin: 0;
}

.comment-bottom-row {
    display: flex;
    gap: 10px;
}

.comment-actions {
    display: flex;
    gap: 8px;
}

.action-button {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 14px;
    padding: 4px;
    color: #666;
}

.action-button:hover {
    color: #007aff;
}

.edit-comment {
    margin-top: 10px;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.edit-actions {
    display: flex;
    gap: 8px;
    margin-top: 5px;
}

/* .submit-button, .cancel-button {
    background: #007aff;
    color: white;
    border: none;
    padding: 5px 10px;
    border-radius: 5px;
    cursor: pointer;
} */

/* .cancel-button {
    background: #ddd;
    color: #333;
} */

/* .submit-button:hover {
    background: #005ecb;
} */

/* .cancel-button:hover {
    background: #bbb;
} */
/* test */
.content-wrapper {
    width: 1110px;
    max-width: 100%;
    display: flex;
    flex-direction: column;
}

.section-title {
    color: #1b1b1b;
    font: 700 18px/1.2 Roboto, sans-serif;
    margin-bottom: 10px;
}

.articles-grid {
    margin-top: 10px;
}

.articles-row {
    display: flex;
    gap: 20px;
}

.article-card {
    flex: 1;
    border-radius: 4px;
    background: #fff;
    box-shadow: 0 2px 4px rgba(27, 27, 27, 0.075);
    border: 1px solid rgba(27, 27, 27, 0.125);
}

.card-content {
    padding: 20px;
}

.article-title {
    color: #0b1a33;
    font: 400 18px/24px Roboto, sans-serif;
    margin-bottom: 8px;
}

.author-name {
    color: #5488c7;
    font: 400 14px/1.6 Roboto, sans-serif;
    display: block;
    margin-bottom: 4px;
}

.read-time {
    color: #9b9b9b;
    font: 400 13px/1.6 Roboto, sans-serif;
}

.engagement-stats {
    display: flex;
    align-items: center;
    gap: 15px;
    margin-top: 5px;
}

.stat-item {
    display: flex;
    align-items: center;
    gap: 4px;
    color: #9b9b9b;
    font: 400 14px/2 Roboto, sans-serif;
}

.stat-icon {
    width: 14px;
    height: 14px;
    object-fit: contain;
}

.stat-group {
    display: flex;
    align-items: center;
    gap: 4px;
}

.stat-icons {
    display: flex;
    flex-direction: column;
}

.pagination {
    display: flex;
    gap: 8px;
    margin: 8px auto;
}

.page-dot {
    width: 8px;
    height: 8px;
    border-radius: 8px;
    background: #000;
    border: none;
    padding: 0;
    cursor: pointer;
}

.page-dot.active {
    background: #007aff;
}

.comments-section {
    margin-top: 32px;
    border-radius: 3px;
    background: rgba(255, 255, 255, 0.002);
    box-shadow: 0 10px 15px -3px rgba(47, 181, 250, 0.05);
    border: 1px solid #ebeef5;
    padding: 41px;
    max-width: 100%;
}

.comment-form {
    display: flex;
    gap: 20px;
    padding: 16px 12px 35px 0;
}

.comment-input {
    flex: 1;
    border: 1px solid #ebeef5;
    border-radius: 4px;
    padding: 12px;
    font: 400 14px/2 'Noto Sans', sans-serif;
    resize: vertical;
}

.submit-button, .cancel-button {
    /* padding: 4px 8px;
    border-radius: 5px;
    border: none;
    background: none;
    color: #161616;
    font: 400 14px/2 'Noto Sans', sans-serif; */
    cursor: pointer;
}

.comment-filters {
    display: flex;
    gap: 12px;
    margin-bottom: 16px;
}

.filter-button {
    background: none;
    border: none;
    padding: 0;
    font: 400 14px/2 'Noto Sans', sans-serif;
    color: #161616;
    cursor: pointer;
}

.filter-button.active {
    color: #4299e1;
}

.comments-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.comment-item {
    display: flex;
    gap: 16px;
}

.avatar {
    width: 48px;
    height: 48px;
    border-radius: 24px;
    object-fit: cover;
}

.comment-content {
    flex: 1;
}

.comment-header {
    gap: 8px;
    align-items: center;
}

.comment-author {
    font: 700 14px/2 'Noto Sans', sans-serif;
    color: #161616;
}

.comment-date {
    font: 400 13px 'Noto Sans', sans-serif;
    color: rgba(113, 128, 150, 0.75);
}

.comment-text {
    font: 400 14px/22px 'Noto Sans', sans-serif;
    color: #161616;
    margin-bottom: 0;
}

.comment-actions {
    display: flex;
    gap: 1px;
}

.action-button {
    display: flex;
    align-items: center;
    background: none;
    border: none;
    padding: 0;
    color: rgba(113, 128, 150, 0.75);
    font: 400 14px/2 'Noto Sans', sans-serif;
    cursor: pointer;
}

.action-icon {
    width: 17px;
    height: 17px;
}

.load-more {
    width: 100%;
    text-align: center;
    padding: 9px 0;
    border-top: 1px solid #e2e8f0;
    background: none;
    border: none;
    color: #161616;
    font: 700 14px/2 'Noto Sans', sans-serif;
    cursor: pointer;
    margin-top: 16px;
}

.visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
}

.no-comments {
    text-align: center;
    font-style: italic;
    color: #888;
    margin-top: 10px;
}

@media (max-width: 991px) {
    .container {
        padding: 0 20px 100px;
    }

    .articles-row {
        flex-direction: column;
    }

    .comments-section {
        padding: 20px;
    }

    .comment-form {
        flex-direction: column;
    }
}
</style>