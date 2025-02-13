<template>
    <div class="input-container" :class="isReply ? 'reply' : ''">
        <v-input autogrow class="q-pa-md" v-model="comment" borderless="" dense="dense" />
        <div>
            <div>
                <div>
                    <v-btn flat round dense icon="emoji_emotions" size=".9rem">
                        <v-menu>
                            <emoji-picker @onIconSelected="onEmojiSelected"></emoji-picker>
                        </v-menu>
                    </v-btn>
                </div>
            </div>
            <v-btn round dense icon="send" size=".5rem" color="primary" padding=".6rem" @click="sendComment(user)">
            </v-btn>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { useRoute } from "vue-router";
import EmojiPicker from "@/components/CommentComponents/EmojiPicker.vue";
import GlobalState from "@/scripts/logic/globalState";

const route = useRoute();
const isDirectlyComment = ref(true);
const props = defineProps({
    postId: {
        type: Number,
        default: 1232131232
    },
    parentCommentId: {
        type: String,
        required: false,
        default: "0",
    },
    commentId: {
        type: String,
        required: false,
    },
    isUpdate: {
        type: Boolean,
        required: false,
        default: false,
    },
    isReply: {
        type: Boolean,
        required: false,
        default: false,
    },
    oldComment: {
        type: String,
        required: false,
        default: "",
    },
    isGroupPost: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(["createComment", "editComment", "replyComment"]);
const comment = ref(props.oldComment);
const openLoginPopup = ref(false);

function onEmojiSelected(emoji) {
    comment.value += emoji;
}

async function sendComment() {
    if (GlobalState.isAuth()) {
        if (comment.value.match(/^\s*$/) == null) {
            comment.value = comment.value.trim();
            if (props.isUpdate) {
                const response = await updatePostCommentApi(
                    comment.value,
                    props.commentId
                )
                if (response.isSuccess) {
                    emit("editComment", comment.value);
                }

            } else {
                if (props.isReply) {
                    isDirectlyComment.value = false;
                    emit("replyComment", comment.value);
                } else {
                    if (route.path.includes("/post") || route.path == ("/social")) {
                        const response = await createPostCommentApi(
                            comment.value,
                            props.postId,
                            false
                        )
                        if (response.responseBody.commentId != -1) {
                            NotificationHelper.notifySuccess("Tạo bình luận thành công")
                            comment.value = "";
                            emit("createComment");
                        } else NotificationHelper.notifyError("Đã có lỗi xảy ra!")
                    }
                    else {
                        const response = await createPostCommentApi(
                            comment.value,
                            props.postId,
                            true
                        )
                        if (response.responseBody.commentId != -1) {
                            NotificationHelper.notifySuccess("Tạo bình luận thành công")
                            comment.value = "";
                            emit("createComment");
                        } else NotificationHelper.notifyError("Đã có lỗi xảy ra!")
                    }
                }
            }
        }
    } else {
        openLoginPopup.value = !openLoginPopup.value;
    }
}
</script>
<style scoped>
.input-container {
    justify-content: center;
    align-items: center;
    gap: 1rem;
    border: 1px solid #120e36;
    border-radius: 7px;
}

.reply {
    margin: 0 0 0 30px;
}
</style>