<template>
    <div>
        <div class="post-container">
            <v-card v-for="post in posts" :key="post.Id" class="mb-4 mt-6 post-card">
                <v-card-title class="d-flex align-center justify-space-between">
                    <div class="d-flex align-center">
                        <v-avatar>
                            <v-img :src="post.Creator.Avatar" alt="User Avatar" />
                        </v-avatar>
                        <div class="ml-4">
                            <div class="font-weight-bold post-username">{{ post.Creator.UserName }}</div>
                            <div class="post-meta d-flex align-center">
                                <span class="post-date">{{ post.CreatedAt }}</span>
                                <i class="fa-solid fa-user-group"></i>
                            </div>
                        </div>
                    </div>
                    <!-- Bug here -->
                    <v-menu v-if="post.Creator == 1" offset-y>
                        <template #activator="{ attrs, on }">
                            <v-btn icon v-bind="attrs" v-on="on">
                                <i class="fa-solid fa-ellipsis-vertical"></i>
                            </v-btn>
                        </template>
                        <v-list>
                            <v-list-item @click="confirmRemovePost(post)">
                                <i class="fa-solid fa-xmark"></i>
                                <v-list-item-title>Xóa bài viết</v-list-item-title>
                            </v-list-item>
                        </v-list>
                    </v-menu>
                </v-card-title>

                <v-card-text>
                    <div class="post-content">{{ post.Content }}</div>
                </v-card-text>

                <v-card-text v-if="post.Medias.length > 0">
                    <div class="media-grid d-flex flex-wrap">
                        <div v-for="media in post.Medias" :key="media.fileName" class="media-item">
                            <v-img @click="openImage(post.Medias, media.fileName)" :src="media.storageUrl"
                                class="media-image" :alt="media.fileName" max-height="150" max-width="150" contain />
                        </div>
                    </div>
                </v-card-text>
                <v-divider style="margin: 0; color: rgba(0, 0, 0, 0.5)" />
                <v-card-actions class="justify-around">
                    <v-btn :color="hasLikedPost ? 'primary' : 'default'" @click="likePost(post.id)">
                        <i class="fa-solid fa-thumbs-up"></i>
                        <span>{{ post.LikeCount }}</span>
                    </v-btn>
                    <v-btn @click="openComments(post.id, post.isOpenComment)">
                        <i class="fa-solid fa-comment"></i>
                        <span>Bình luận</span>
                    </v-btn>
                </v-card-actions>

                <v-card-text v-show="post.isOpenComment">
                    <CommentLoader :post-id="String(post.id)" :is-allow-comment="true" />
                </v-card-text>
            </v-card>
        </div>

        <v-dialog v-model="dialog" max-width="90%">
            <v-carousel cycle :model-value="slide" hide-delimiters show-arrows height="500">
                <v-carousel-item v-for="img in postImg" :key="img.fileName" :value="img.fileName">
                    <v-img :src="img.storageUrl" alt="Image" class="fill-height" />
                </v-carousel-item>
            </v-carousel>
            <template #append>
                <v-btn icon small class="close-dialog-btn" @click="dialog = false">
                    <i class="fa-solid fa-xmark"></i>
                </v-btn>
            </template>
        </v-dialog>
    </div>
</template>


<script setup>
import { ref, watch } from 'vue';
import CommentLoader from '@/components/CommentComponents/CommentLoader.vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

const props = defineProps({
    groupPosts: {
        type: Array,
        required: true,
    },
});

const posts = ref(props.groupPosts);
const dialog = ref(false);
const slide = ref('1')
const postImg = ref([]);
const hasLikedPost = ref(false);

const openImage = (files, startFile) => {
    postImg.value = files;
    dialog.value = true
    slide.value = startFile
}
watch(
    () => props.groupPosts,
    () => {
        posts.value = props.groupPosts;
    }
)
const likePost = async (postId) => {
    /*try {
        const response = (await LikePostHandler.LikeUnlikePostAsync(postId, true)).responseBody;
        if (response.isLikeRequest) {
            posts.value.find((post) => post.id === postId).totalLikes += 1;
            posts.value.find((post) => post.id === postId).hasLikedPost = true;
        }
        else if (!response.isLikeRequest) {
            posts.value.find((post) => post.id === postId).totalLikes -= 1;
            posts.value.find((post) => post.id === postId).hasLikedPost = false;
        }
        // else {
        //     throw new Error('Failed to like post');
        // }
    } catch (error) {
        console.error("Error liking post:", error);
    }*/
}
const confirmRemovePost = (post) => {
    Dialog.create({
        title: 'Confirm',
        message: `Bạn chắc chắn muốn xóa bài viết?`,
        ok: {
            label: 'Chắc chắn',
            color: 'negative',
        },
        cancel: {
            label: 'Xem đã',
        },
    }).onOk(async () => {
        await removePost(post.id);
    });
};

const removePost = async (postId) => {
    try {
        const response = await RemoveUserPostHandler.RemoveUserPostAsync(postId, true);
        if (response) {
            posts.value = posts.value.filter((post) => post.id !== postId);
            Notify.create({
                type: 'positive',
                message: 'Xóa bài đăng thành công.',
            });
        } else {
            throw new Error('Không thể xóa bài đăng.');
        }
    } catch (error) {
        console.error("Không thể xóa bài đăng :", error);
        Notify.create({
            type: 'negative',
            message: 'Không thể xóa bài đăng. Vui lòng thử lại sau.',
        });
    }
};

const openComments = (postId, isOpenComment) => {
    posts.value.find((post) => post.id === postId).isOpenComment = !isOpenComment
}
</script>

<style scoped>
/* General Container Styles */
.post-container {
    max-width: 800px;
    margin: 0 auto;
}

/* Card Styles */
.post-card {
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.post-username {
    font-size: 16px;
    font-weight: bold;
}

.post-meta {
    font-size: 12px;
    color: gray;
    display: flex;
    align-items: center;
}

.post-date {
    margin-right: 4px;
    color: #666;
}

.post-content {
    font-size: 14px;
    color: #333;
}

/* Media Grid Styles */
.media-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    /* 2 items per row */
    gap: 16px;
    justify-content: center;
    align-items: stretch;
    /* Ensures items have consistent height */
}

.media-item {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    height: 350px;
    /* Uniform height */
}

.media-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    /* Maintain aspect ratio */
    border-radius: 8px;
}

/* Button Styles */
.q-btn span {
    margin-left: 8px;
    font-size: 14px;
    color: gray;
}

@media (min-width: 600px) {
    .q-dialog__inner--minimized>div {
        max-width: 50vw !important;
    }
}
</style>
