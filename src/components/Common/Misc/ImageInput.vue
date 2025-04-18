<template>
    <section class="coverImage-Input relative-position">
        <div class="invalid-file-extension-chip text-center" v-show="isInvalid">
            <v-chip icon="info" class="v-mt-sm" clickable @click="isInvalid = false">
                {{ invalidMessage }}
            </v-chip>
        </div>
        <section class="display-area justify-center" style="display: flex;align-items: center;"
            :class="{ error: hasError }">
            <img style="background-color: red;">
            <div v-if="!hasImage" class="flex column text-weight-bold" style="z-index: 1;">
                <v-btn class="upload-button" color="primary">
                    <label for="coverImage" class="flex cursor-hover">
                        <span style="margin-right: 10px">{{ text["Tải ảnh lên"] }}</span>
                        <i class="fa-solid fa-image"></i>
                    </label>
                </v-btn>
            </div>
            <input required hidden type="file" name="coverImage" id="coverImage"
                accept="image/png, image/jpeg, image/jpg" @input="onInputImage" ref="coverImageInput" />
            <label for="coverImage" v-if="hasImage" class="upload-image" style="height: 100%; width: 100%">
                <v-img v-if="hasImage" :src="imageSrc" loading="lazy" spinner-color="white" ratio="0.778" width="100%"
                    height="100%" />
            </label>
            <v-btn v-if="hasImage && !isEditGroupImage" class="remove-image-button" @click="clearImage">
                <i class="fa-solid fa-xmark"></i>
            </v-btn>
        </section>
    </section>
</template>

<script>
import { FileHelper } from "@/scripts/logic/fileHelper";
import GlobalState from '@/scripts/logic/globalState';
import dict from '@/scripts/data/dictionary';

const inputName = "coverImage";
const invalidFormatMessage = "Yêu cầu định dạng PNG, JPG, JPEG";
const invalidFileSizeMessage = "File ảnh kích thước tối đa 2MB";

export default {
    props: {
        modelValue: {
            required: true,
        },
        presetImageSrc: {
            type: String,
        },
        isEditGroupImage: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            text: {
                "Tải ảnh lên": "Tải ảnh lên",
                // Thêm các text khác nếu cần
            },
            coverImageInput: null,
            imageFile: null,
            imageSrc: null,
            hasImage: false,
            hasError: false,
            isInvalid: false,
            invalidMessage: null,
        };
    },
    mounted() {
        this.coverImageInput = this.$refs.coverImageInput;

        // Tải trước ảnh nếu có đường dẫn
        if (this.presetImageSrc) {
            this.imageSrc = this.presetImageSrc;
            this.hasImage = true;
        }

        // Gửi sự kiện verifyInput chứa instance này để kiểm tra sau
        this.$emit("verifyInput", this);
        if (this.isEditGroupImage)
            this.$refs.coverImageInput.click()
    },
    emits: ["update:modelValue", "verifyInput", "hasChange"],
    methods: {
        onInputImage(event) {
            const uploadImageFile = event.target.files[0];

            if (!uploadImageFile || event.target.value === '') {
                return;
            }

            // Kiểm tra file tải lên có phải là ảnh không
            if (!FileHelper.isImageFile(uploadImageFile)) {
                this.isInvalid = true;
                this.invalidMessage = invalidFormatMessage;
                return;
            }

            // Kiểm tra kích thước file ảnh có vượt quá giới hạn không
            if (FileHelper.isImageFileExceedMaximumSize(uploadImageFile)) {
                this.isInvalid = true;
                this.invalidMessage = invalidFileSizeMessage;
                return;
            }

            // Xem trước ảnh đã tải lên
            this.imageSrc = URL.createObjectURL(uploadImageFile);
            this.imageFile = uploadImageFile;
            this.hasImage = true;
            this.isInvalid = false;
        },
        clearImage() {
            URL.revokeObjectURL(this.imageSrc);
            this.imageFile = null;
            this.imageSrc = null;
            this.hasImage = false;
            this.coverImageInput.value = null;
        },
        emitImageUpdateEvent() {
            // Gửi sự kiện cập nhật file ảnh
            this.$emit("update:modelValue", this.imageFile);
            this.$emit("hasChange", inputName, true);

            this.verifyInput();
        },
        verifyInput() {
            // Nếu không có ảnh thì báo lỗi
            this.hasError = !this.hasImage;
            return !this.hasError;
        },
    },
    watch: {
        imageFile() {
            this.emitImageUpdateEvent();
        },
        isEditGroupImage() {
            if (this.isEditGroupImage === 0) {
                uploadImageFile = null;
                return;
            }
        }
    },
};
</script>

<style scoped>
.coverImage-Input,
.upload-button,
.upload-image,
.remove-image-button {
    --ratio: 0.778;
    --max-width: 100%;
    --primary-700: #53bf94;
    --light-500: #dddddd;
    --dark: #120e36;
    --secondary-700: #dc5834;
    --border-radius: 6.4px;
}

.invalid-file-extension-chip {
    position: absolute;
    z-index: 999;
    top: 0;
    left: 0;
    right: 0;
}

.coverImage-Input {
    max-width: var(--max-width);
}

.coverImage-Input .display-area {
    position: relative;
    max-width: 100%;
    height: 350px;
    border: 2px 2px 0 0 solid var(--light-500);
}

.error {
    color: var(--secondary-700);
    font-weight: bold;
}

.coverImage-Input .display-area.error {
    border-color: var(--secondary-700);
}

.coverImage-Input .display-area .upload-button.v-badge {
    background-color: #53bf94;
    color: var(--dark);
}

.upload-image {
    border-radius: var(--border-radius) var(--border-radius) 0 0 !important;
    overflow: hidden;
}

.upload-image:hover,
.upload-button:hover,
.cursor-hover:hover {
    cursor: pointer;
}

.remove-image-button {
    color: #fff;
    padding: 4px 8px;
    background-color: var(--secondary-700);
    border-radius: 0 4px 0 4px;
    position: absolute;
    top: 0;
    right: 0;
}

.remove-image-button:hover {
    cursor: pointer;
}
</style>