<template>
    <div :class="isReplyComment ? 'comment-container' : ''">
        <v-card class="user-infor py-4">
            <v-avatar size="56">
                <v-img :src="comment.avatar" alt="User avatar" />
                <v-badge color="teal" overlap>
                    <v-icon size="14">mdi-check</v-icon>
                </v-badge>
            </v-avatar>
            <div class="ml-4">
                <div class="user-name font-weight-bold">{{ comment.username }}</div>
                <div class="post-time">({{ comment.postDate }})</div>
            </div>
            <v-btn v-if="comment.isAuthor" color="red" small>Author</v-btn>
            <v-spacer></v-spacer>

            <v-menu v-if="comment.isCommentAuthor" offset-y>
                <template #activator="{ on, attrs }">
                    <v-btn icon v-bind="attrs" v-on="on">
                        <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                </template>
                <v-list>
                    <v-list-item @click="isEdit = !isEdit">
                        <v-list-item-title>Edit</v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="isDelete = !isDelete">
                        <v-list-item-title>Delete</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>
        </v-card>

        <v-card-text v-show="!isEdit">
            {{ editCommentProps.oldComment }}
        </v-card-text>

        <div v-if="isEdit" @keydown="handleKeydown" class="mb-3">
            <comment-input-field :commentId="props.comment.id" :isUpdate="editCommentProps.isUpdate"
                :oldComment="editCommentProps.oldComment" @editComment="editCommentHandler" />
        </div>

        <v-divider></v-divider>

        <div v-if="isReply" class="px-4 py-2">
            <comment-input-field :isReply="editCommentProps.isReply" :parent-comment-id="props.comment.id"
                @replyComment="onReplyCommentCreate" />
        </div>

        <div v-show="isShowReplyComment" class="px-4 py-2">
            <!-- Uncomment when child comment loader is implemented -->
            <!-- <child-comment-loader
          :key="reloadKey"
          :parentCommentId="props.comment.id"
          @removeReplyComment="onReplyCommentDelete"
        /> -->
        </div>

        <popup-login-required :open="openLoginPopup" />
        <confirm-popup v-if="isDelete" message="Do you want to delete this comment?" @popupClick="popupClickHandler" />
    </div>
</template>

<script setup>
import { ref } from "vue";
import CommentInputField from "@/components/CommentComponents/CommentInputField.vue";
import ConfirmPopup from "@/components/Common/Popup/ConfirmPopup.vue";

const props = defineProps({
    comment: {
        type: Object,
        default: () => ({
            id: "",
            avatar: "https://cdn.quasar.dev/img/boy-avatar.png",
            username: "username",
            postDate: "today",
            content: "Sample comment content here.",
            likeCount: 0,
            totalReplies: 0,
            isAuthor: false,
            isCommentAuthor: false,
            isLiked: false,
        }),
    },
    isReplyComment: {
        type: Boolean,
        default: false,
    },
});

const isShowReplyComment = ref(false);
const isReply = ref(false);
const isEdit = ref(false);
const isDelete = ref(false);
const isLike = ref(props.comment.isLiked);
const likeCount = ref(props.comment.likeCount);
const reloadKey = ref(0);
const openLoginPopup = ref(false);

const editCommentProps = {
    isUpdate: true,
    isReply: true,
    oldComment: props.comment.content,
};

function handleKeydown(event) {
    if (event.key === "Escape") {
        isEdit.value = false;
    }
}

function popupClickHandler(isDeleteClicked) {
    if (isDeleteClicked) {
        deleteComment();
    } else {
        isDelete.value = false;
    }
}

async function deleteComment() {
    console.log(`Deleting comment with ID: ${props.comment.id}`);
}

function editCommentHandler(newComment) {
    isEdit.value = false;
    editCommentProps.oldComment = newComment;
}
</script>

<style scoped>
.comment-container {
    margin: 0 20px;
}

.user-infor {
    display: flex;
    align-items: center;
    column-gap: 0.4rem;
}

.user-name {
    font-weight: bold;
}

.post-time {
    font-size: 0.9rem;
    color: gray;
}
</style>