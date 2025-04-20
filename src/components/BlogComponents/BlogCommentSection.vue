<template>
    <div class="card border-0 shadow-sm mb-5">
        <div class="card-body">
            <h4 class="fw-bold text-dark card-title mb-4">Bình luận</h4>

            <form @submit.prevent="submitComment" class="mb-4">
                <div class="d-flex mb-3">
                    <div class="form-floating flex-grow-1 me-3">
                        <textarea 
                            v-model="newComment" 
                            class="form-control" 
                            :class="{ 'is-invalid': !isCommentValid && newComment.length > 0 }"
                            id="commentInput"
                            placeholder="Hãy chia sẻ cảm nghĩ của bạn về bài viết" 
                            rows="8"
                            :disabled="loading"
                            @input="validateComment"
                        ></textarea>
                        <label for="commentInput">
                            Hãy chia sẻ cảm nghĩ của bạn về bài viết
                        </label>
                        <div class="invalid-feedback">
                            {{ commentError }}
                        </div>
                        <small class="text-muted">
                            {{ newComment.length }}/1000 ký tự
                        </small>
                    </div>
                    <div class="d-flex align-items-end">
                        <button 
                            class="btn btn-primary" 
                            :disabled="loading || !isCommentValid || !newComment.trim()"
                        >
                            <i class="fas fa-paper-plane me-2"></i>
                            Gửi bình luận
                        </button>
                    </div>
                </div>
            </form>

            <div v-if="comments.length">
                <div v-for="comment in comments" :key="comment.id" class="d-flex mb-4">
                    <img :src="comment.avatar" :alt="comment.author" class="rounded-circle me-3" width="48"
                        height="48" />
                    <div class="flex-grow-1">
                        <div class="d-flex justify-content-between align-items-center mb-1">
                            <strong>{{ comment.author }}</strong>
                            <small class="text-muted">{{ formatDate(comment.creationTime) }}</small>
                        </div>

                        <div v-if="editingCommentId === comment.id">
                            <div class="form-floating mb-2">
                                <textarea v-model="editingContent" class="form-control"
                                    placeholder="Chỉnh sửa bình luận" rows="2"></textarea>
                                <label>Chỉnh sửa bình luận</label>
                            </div>
                            <div>
                                <button class="btn btn-sm btn-success me-2" @click="updateComment(comment.id)">
                                    Lưu
                                </button>
                                <button class="btn btn-sm btn-secondary" @click="cancelEdit">
                                    Hủy
                                </button>
                            </div>
                        </div>

                        <div v-else>
                            <p class="mb-2">{{ comment.content }}</p>
                            <div class="d-flex gap-3">
                                <button class="btn btn-link p-0 text-secondary" @click="likeComment(comment)">
                                    <i class="fas fa-thumbs-up me-1"></i>{{ comment.likes }}
                                </button>
                                <span style="display: none">
                                    Current User ID: {{ currentUserId }} ({{ typeof currentUserId }})
                                    Creator ID: {{ comment.creatorId }} ({{ typeof comment.creatorId }})
                                    Is Owner: {{ currentUserId === comment.creatorId }}
                                </span>
                                <template v-if="isCommentOwner(comment)">
                                    <button class="btn btn-link p-0 text-secondary" @click="toggleEditComment(comment)">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button class="btn btn-link p-0 text-danger" @click="confirmDeleteComment(comment.id)">
                                        <i class="fas fa-trash-alt"></i>
                                    </button>
                                </template>
                                {{ console.log('Comment Creator ID:', comment.creatorId) }}
                                {{ console.log('Current User ID:', currentUserId) }}
                            </div>
                        </div>
                    </div>
                </div>

                <button v-if="page < totalPages" class="btn btn-outline-primary w-100" @click="loadMoreComments">
                    Tải thêm bình luận
                </button>
            </div>

            <p v-else class="text-center text-muted">
                Chưa có bình luận nào, hãy là người đầu tiên bình luận!
            </p>
        </div>

        <DeleteConfirmPopup :message="'Bạn có chắc chắn muốn xóa bình luận này?'" :isVisible="isDeletePopupVisible"
            :url="deleteUrl" @confirmDelete="handleDeleteConfirmed" @update:isVisible="isDeletePopupVisible = $event" />
    </div>
</template>

<script>
import dayjs from "dayjs";
import {
    getPagedBlogComments,
    createBlogComment,
    updateComment,
    deleteComment,
    TargetFeedbackEntities
} from "@/scripts/api/services/commentService";
import { getUserById } from "@/scripts/api/services/userService";
import DeleteConfirmPopup from "../Common/Popup/DeleteConfirmPopup.vue";

export default {
    name: "BlogCommentSection",
    components: { DeleteConfirmPopup },
    props: {
        blogId: { type: [String, Number], required: true },
        currentUserId: { type: [String, Number], required: true }
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
            isCommentValid: false,
            commentError: '',
            commentRules: {
                minLength: 2,
                maxLength: 1000
            }
        };
    },
    computed: {
        deleteUrl() {
            return this.commentToDelete ? `/api/Comments/${this.commentToDelete}` : "";
        },
    },
    async mounted() {
        await this.fetchComments();
    },
    methods: {
        async fetchComments() {
            try {
                const response = await getPagedBlogComments(
                    this.blogId,
                    this.page,
                    this.pageSize
                );
                const items = response.items || [];

                const detailed = await Promise.all(
                    items.map(async (c) => {
                        try {
                            const user = await getUserById(c.creatorId);
                            return {
                                ...c,
                                author: user.fullName || "Ẩn danh",
                                avatar: user.avatarUrl || "/default-avatar.jpg",
                            };
                        } catch {
                            return { ...c, author: "Ẩn danh", avatar: "/default-avatar.jpg" };
                        }
                    })
                );

                this.comments =
                    this.page === 1 ? detailed : [...this.comments, ...detailed];
                this.totalPages = response.totalPages || 1;
            } catch (e) {
                console.error('Lỗi khi tải bình luận:', e);
            }
        },
        validateComment() {
            const comment = this.newComment.trim();
            
            if (!comment) {
                this.commentError = 'Vui lòng nhập nội dung bình luận';
                this.isCommentValid = false;
                return;
            }

            if (comment.length < this.commentRules.minLength) {
                this.commentError = `Bình luận phải có ít nhất ${this.commentRules.minLength} ký tự`;
                this.isCommentValid = false;
                return;
            }

            if (comment.length > this.commentRules.maxLength) {
                this.commentError = `Bình luận không được vượt quá ${this.commentRules.maxLength} ký tự`;
                this.isCommentValid = false;
                return;
            }

            if (!/\S/.test(comment)) {
                this.commentError = 'Bình luận không thể chỉ chứa khoảng trắng';
                this.isCommentValid = false;
                return;
            }

            this.commentError = '';
            this.isCommentValid = true;
        },
        async submitComment() {
            if (!this.isCommentValid) return;
            
            this.loading = true;
            try {
                const formData = new FormData();
                formData.append(`SourceId`, this.blogId);
                formData.append(`Content`, this.newComment.trim());
                formData.append(`TargetEntity`, TargetFeedbackEntities.ArticleComment.value);
                await createBlogComment(formData);
                this.newComment = "";
                this.page = 1;
                await this.fetchComments();
            } catch (error) {
                console.error('Lỗi khi gửi bình luận:', error);
            } finally {
                this.loading = false;
            }
        },
        likeComment(comment) {
            comment.likes += 1;
        },
        toggleEditComment(comment) {
            this.editingCommentId = comment.id;
            this.editingContent = comment.content;
        },
        cancelEdit() {
            this.editingCommentId = null;
            this.editingContent = "";
        },
        async updateComment(commentId) {
            if (!this.editingContent.trim()) return;
            try {
                await updateComment(commentId, this.editingContent.trim());
                const idx = this.comments.findIndex((c) => c.id === commentId);
                if (idx !== -1) {
                    this.comments[idx].content = this.editingContent.trim();
                }
                this.cancelEdit();
            } catch (error) {
                console.error('Lỗi khi cập nhật bình luận:', error);
            }
        },
        formatDate(date) {
            return dayjs(date).format('DD/MM/YYYY HH:mm');
        },
        isCommentOwner(comment) {
            return String(comment.creatorId) === String(this.currentUserId);
        },
        confirmDeleteComment(commentId) {
            this.commentToDelete = commentId;
            this.isDeletePopupVisible = true;
        },
        async handleDeleteConfirmed() {
            try {
                await deleteComment(this.commentToDelete);
                this.comments = this.comments.filter(c => c.id !== this.commentToDelete);
                this.commentToDelete = null;
            } catch (error) {
                console.error('Lỗi khi xóa bình luận:', error);
            }
        },
        async loadMoreComments() {
            if (this.page < this.totalPages) {
                this.page++;
                await this.fetchComments();
            }
        },
    },
};
</script>

<style scoped>
#commentInput {
    height: 150px !important;
}

.invalid-feedback {
    display: block;
    margin-top: 0.25rem;
}
</style>