<template>
    <v-container class="d-flex justify-center align-center bg-light">
        <v-dialog v-model="showCreationPopup" max-width="600px">
            <v-card class="form-card elevation-3 rounded-borders">
                <v-card-title class="form-top d-flex justify-center align-center py-2"
                    style="justify-content: space-between !important;">
                    <span class="text-h6 font-weight-bold">Tạo mới bài viết</span>
                    <v-btn icon color="grey" class="close-button" @click="showCreationPopup = false">
                        <i class="fa-solid fa-xmark"></i>
                    </v-btn>
                </v-card-title>
                <v-divider></v-divider>

                <v-card-text class="form-header d-flex align-center py-4">
                    <v-avatar size="50" class="mr-3">
                        <v-img :src="userProfile.avatarUrl" alt="User Avatar" />
                    </v-avatar>

                    <div>
                        <div class="username font-weight-bold">{{ userProfile.nickname }}</div>
                    </div>
                </v-card-text>

                <!-- Post Content Input -->
                <v-card-text>
                    <v-textarea v-model="postContent" label="Viết điều bạn muốn chia sẻ" outlined filled dense counter
                        maxlength="500" rows="4" prepend-inner-icon="mdi-pencil"></v-textarea>
                </v-card-text>

                <!-- Image Upload Section -->
                <v-card-text>
                    <div class="d-flex flex-wrap justify-center align-center" @click="triggerFileInput">
                        <div v-for="imageItem in displayImageItemList" :key="imageItem.id"
                            class="uploaded-image-item mx-2 mb-2">
                            <v-img :src="imageItem.src" alt="Uploaded Image" class="preview-image-item"
                                max-height="100px" max-width="100px" />
                        </div>
                        <v-icon v-if="displayImageItemList.length < 4" size="48" color="grey" class="add-photo-icon">
                            mdi-image-plus
                        </v-icon>
                    </div>
                    <input type="file" id="chapterImages" name="chapterImages" accept="image/png, image/jpeg, image/jpg"
                        multiple hidden @change="onInputImage" ref="chapterImageInput" />
                </v-card-text>

                <!-- Submit Button -->
                <v-card-actions class="justify-center py-2">
                    <v-btn color="primary" class="submit-button" :disabled="!postContent.trim() || isSubmitting"
                        :loading="isSubmitting" @click="submitPost">
                        Đăng bài
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>


<script>
import { FileHelper } from "@/scripts/logic/fileHelper";
import { useRoute } from "vue-router";
import GlobalState from '@/scripts/logic/globalState';

export default {
    data() {
        return {
            userProfile: GlobalState.getUserProfile(),
            showCreationPopup: true,
            imageLastPosition: 0,
            displayImageItemList: [],
            totalImageSizes: 0,
            maxImageSizes: 32 * 1024 * 1024,
            privacy: { label: "Công khai", value: 1 }, // Default to "Công khai"
            postContent: "",
            files: [],
            isSubmitting: false, // New property to handle loading state
            groupId: useRoute().params.id
        };
    },
    props: {
        isGroupPost: {
            type: Boolean,
            default: false
        },
        isPublicGroup: {
            type: Boolean,
            default: false
        }

    },
    methods: {
        async submitPost() {
            if (!this.postContent.trim()) {
                this.$q.notify({
                    type: "negative",
                    message: "Nội dung bài viết không được để trống.",
                });
                return;
            }

            this.isSubmitting = true; // Set loading state

            const postDetail = {
                title: this.postContent.trim(),
                allowComment: true,
                publicLevel: this.privacy.value,
                attachedMedia: this.displayImageItemList.map((item) => item.imageFile),
                groupId: this.isGroupPost ? this.groupId : null
            };

            try {
                let response = null;
                if (this.isGroupPost) {
                    response = await CreateGroupPostHandler.CreatePostAsync(postDetail);
                } else
                    response = await CreateUserPostHandler.CreatePostAsync(postDetail);

                if (response.isSuccess) {
                    this.$q.notify({
                        type: "positive",
                        message: "Bài viết đã được đăng thành công!",
                    });

                    // Reset form fields
                    this.postContent = "";
                    this.displayImageItemList = [];

                    this.$emit("createPostSuccess");

                } else {
                    this.$q.notify({
                        type: "negative",
                        message: "Đăng bài không thành công. Vui lòng thử lại.",
                    });
                }
            } catch (error) {
                this.$q.notify({
                    type: "negative",
                    message: "Có lỗi xảy ra khi đăng bài.",
                });
                console.error("Submit post error:", error);
            } finally {
                this.isSubmitting = false; // Reset loading state
            }
        },

        onInputImage(event) {
            const uploadImageFiles = Array.from(event.target.files);

            if (!uploadImageFiles) {
                return;
            }

            // Check if adding these images exceeds the limit
            if (this.displayImageItemList.length + uploadImageFiles.length > 4) {
                this.$q.notify({
                    type: "negative",
                    message: "Bạn chỉ có thể tải lên tối đa 4 hình ảnh.",
                });
                return;
            }

            for (const imageFile of uploadImageFiles) {
                // Validate if the file is an image
                if (!imageFile.type.startsWith("image/")) {
                    this.$q.notify({
                        type: "negative",
                        message: "Tệp không phải là hình ảnh hợp lệ.",
                    });
                    continue;
                }

                // Generate unique ID for the image
                const randomString = StringHelper.generateSecureRandomString(6);
                const imageId = `img_${randomString}_${imageFile.lastModified}`;
                const imageName = imageFile.name;
                const imageSrc = URL.createObjectURL(imageFile);

                // Create image item object
                const imageItem = new PostImageItem(
                    imageId,
                    this.imageLastPosition,
                    imageName,
                    imageSrc,
                    imageFile
                );

                // Add the item to the display list
                this.displayImageItemList.push(imageItem);
                this.imageLastPosition++;
            }

            // Reset the input value to allow re-upload of the same file
            this.$refs.chapterImageInput.value = null;

            // Emit the update event if needed
            this.emitUpdateModelValue();
        },
    },
    watch: {
        showCreationPopup: function (value) {
            if (!value) {
                this.$emit("closePopup");
            }
        },
    },
};
</script>

<style scoped>
.bg-light {
    background-color: #f9f9f9;
}

.form-card {
    max-width: 500px;
    width: 100%;
    background: #fff;
    border-radius: 12px;
    overflow: hidden;
}

.form-top {
    color: #120E36;
    width: 100%;
    padding: 12px;
    font-size: 16px;
    transition: transform 0.2s ease;
    border-bottom: 1px solid rgb(225, 222, 222);
}

.image-upload-container {
    height: auto;
    min-height: 140px;
    width: 100%;
    background: #fafafa;
    border: 2px dashed #ddd;
    border-radius: 8px;
    padding: 16px;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.image-upload-container:hover {
    background: #f1f8e9;
}

.uploaded-image-item {
    position: relative;
}

.preview-image-item {
    max-width: 100px;
    max-height: 100px;
    object-fit: cover;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.cursor-pointer {
    cursor: pointer;
}

.form-header {
    background: white;
    border-bottom: 1px solid white;
}

.username {
    font-size: 16px;
    font-weight: 500;
    color: #120E36;
}

.privacy-select {
    color: #120E36;
    background-color: #e0e0e0;
    font-size: 14px;
}

.post-input {
    font-size: 14px;
}

.image-upload-container {
    height: 140px;
    background: #fafafa;
    border: 2px dashed #ddd;
    border-radius: 8px;
    padding: 16px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.image-upload-container:hover {
    background: #f1f8e9;
}

.image-uploader {
    width: 100%;
}

.submit-button {
    margin: 20px;
    color: white;
    background-color: #120E36;
    width: 100%;
    padding: 12px;
    border-radius: 8px;
    font-size: 16px;
    transition: transform 0.2s ease;
}

.submit-button:disabled {
    background: #ccc !important;
    cursor: not-allowed;
}

.hover-scale:hover {
    transform: scale(1.02);
}

.hover-text:hover {
    text-decoration: underline;
}
</style>