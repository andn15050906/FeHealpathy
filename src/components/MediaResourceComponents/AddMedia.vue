<template>
    <div class="add-media p-4 border rounded shadow-sm bg-white">
        <h3 class="mb-4 text-primary border-bottom pb-2">Thêm Tài Nguyên Mới</h3>
        <form @submit.prevent="openSaveDialog">
            <div class="dropzone p-5 text-center border rounded mb-4" :class="{
                'border-primary': isFileActive,
                'border-dashed': !isFileActive,
                'bg-light': !isFileActive
            }" @dragover.prevent @drop.prevent="handleFileDrop" @click="triggerFileInput">
                <div v-if="!newMedia.file">
                    <i class="fas fa-cloud-upload-alt fa-3x mb-3 text-secondary"></i>
                    <p class="mb-3">Kéo và thả file MP3/MP4 vào đây hoặc nhấp để chọn</p>
                    <button type="button" class="btn btn-outline-primary px-4" @click="triggerFileInput">
                        Chọn tệp
                    </button>
                </div>
                <div v-else class="py-3">
                    <i :class="newMedia.type === 'audio' ? 'fas fa-file-audio fa-3x text-success' : 'fas fa-file-video fa-3x text-success'"
                        class="mb-3"></i>
                    <p class="h5 mb-1 text-primary">{{ newMedia.file.name }}</p>
                    <p class="text-muted mb-2">{{ (newMedia.file.size / (1024 * 1024)).toFixed(2) }} MB</p>
                    <button type="button" class="btn btn-sm btn-outline-secondary" @click.stop="newMedia.file = null">
                        Đổi tệp
                    </button>
                </div>
                <input type="file" accept=".mp3, .mp4" class="d-none" ref="fileInput" @change="handleFileSelect" />
                <div v-if="errors.file" class="text-danger mt-2 small">
                    <i class="fas fa-exclamation-circle"></i> {{ errors.file }}
                </div>
            </div>

            <div class="mb-4">
                <label for="mediaTitle" class="form-label fw-semibold">
                    Tiêu đề <span class="text-danger">*</span>
                </label>
                <div class="input-group has-validation">
                    <span class="input-group-text bg-light">
                        <i class="fas fa-heading"></i>
                    </span>
                    <input v-model="newMedia.title" type="text" class="form-control" id="mediaTitle"
                        placeholder="Nhập tiêu đề tài nguyên" :class="{ 'is-invalid': errors.title }" @input="validateTitle"
                        required />
                    <div class="invalid-feedback">{{ errors.title }}</div>
                </div>
                <small class="text-muted">3-100 ký tự</small>
            </div>

            <div class="mb-4">
                <label for="artistName" class="form-label fw-semibold">
                    Tên Tác Giả <span class="text-danger">*</span>
                </label>
                <div class="input-group has-validation">
                    <span class="input-group-text bg-light">
                        <i class="fas fa-user"></i>
                    </span>
                    <input v-model="newMedia.artistName" type="text" class="form-control" id="artistName"
                        placeholder="Nhập tên tác giả" :class="{ 'is-invalid': errors.artistName }"
                        @input="validateArtistName" required />
                    <div class="invalid-feedback">{{ errors.artistName }}</div>
                </div>
                <small class="text-muted">2-50 ký tự</small>
            </div>

            <div class="mb-4">
                <label for="description" class="form-label fw-semibold">
                    Mô tả <span class="text-danger">*</span>
                </label>
                <div class="input-group has-validation">
                    <span class="input-group-text bg-light">
                        <i class="fas fa-align-left"></i>
                    </span>
                    <textarea v-model="newMedia.description" class="form-control" id="description"
                        placeholder="Nhập mô tả tài nguyên" :class="{ 'is-invalid': errors.description }"
                        @input="validateDescription" rows="3" required></textarea>
                    <div class="invalid-feedback">{{ errors.description }}</div>
                </div>
                <small class="text-muted">10-500 ký tự</small>
            </div>

            <div class="d-flex justify-content-between mt-4 pt-3 border-top">
                <button class="btn btn-outline-danger px-4" @click="openCancelDialog">
                    <i class="fas fa-times me-2"></i>Hủy bỏ
                </button>
                <button class="btn btn-success px-4" :disabled="loading || !isFormValid">
                    <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                    <i v-else class="fas fa-plus me-2"></i>
                    {{ loading ? 'Đang xử lý...' : 'Thêm Tài Nguyên' }}
                </button>
            </div>
        </form>

        <CancelConfirmPopup :message="cancelMessage" :isVisible="showCancelConfirm" @confirmCancel="handleCancelConfirm"
            @update:isVisible="showCancelConfirm = $event" />
        <SaveConfirmPopUp :message="saveMessage" :isVisible="showSaveConfirm" @confirmSave="handleSaveConfirm"
            @update:isVisible="showSaveConfirm = $event" />
    </div>
</template>

<script>
import CancelConfirmPopup from "../Common/Popup/CancelConfirmPopup.vue";
import SaveConfirmPopUp from "../Common/Popup/SaveConfirmPopUp.vue";

export default {
    name: "AddMedia",
    components: {
        CancelConfirmPopup,
        SaveConfirmPopUp
    },
    data() {
        return {
            newMedia: {
                title: "",
                artistName: "",
                description: "",
                url: "",
                file: null,
                type: ""
            },
            loading: false,
            error: null,
            errors: {
                title: "",
                artistName: "",
                description: "",
                file: "",
                url: ""
            },
            showCancelConfirm: false,
            showSaveConfirm: false,
            cancelMessage: "Bạn có chắc chắn muốn hủy? Mọi thay đổi sẽ bị mất.",
            saveMessage: "Bạn có muốn thêm tài nguyên này không?"
        };
    },
    computed: {
        isFileActive() {
            return !!this.newMedia.file;
        },
        isFormValid() {
            return (
                !Object.values(this.errors).some(err => err) &&
                this.newMedia.title &&
                this.newMedia.artistName &&
                this.newMedia.description &&
                this.newMedia.file
            );
        }
    },
    methods: {
        validateTitle() {
            if (!this.newMedia.title.trim()) {
                this.errors.title = "Vui lòng nhập tiêu đề";
                return false;
            }
            if (this.newMedia.title.length < 3) {
                this.errors.title = "Tiêu đề phải có ít nhất 3 ký tự";
                return false;
            }
            if (this.newMedia.title.length > 100) {
                this.errors.title = "Tiêu đề không được quá 100 ký tự";
                return false;
            }
            this.errors.title = "";
            return true;
        },
        validateArtistName() {
            if (!this.newMedia.artistName.trim()) {
                this.errors.artistName = "Vui lòng nhập tên tác giả";
                return false;
            }
            if (this.newMedia.artistName.length < 2) {
                this.errors.artistName = "Tên tác giả phải có ít nhất 2 ký tự";
                return false;
            }
            if (this.newMedia.artistName.length > 50) {
                this.errors.artistName = "Tên tác giả không được quá 50 ký tự";
                return false;
            }
            this.errors.artistName = "";
            return true;
        },
        validateDescription() {
            if (!this.newMedia.description.trim()) {
                this.errors.description = "Vui lòng nhập mô tả";
                return false;
            }
            if (this.newMedia.description.length < 10) {
                this.errors.description = "Mô tả phải có ít nhất 10 ký tự";
                return false;
            }
            if (this.newMedia.description.length > 500) {
                this.errors.description = "Mô tả không được quá 500 ký tự";
                return false;
            }
            this.errors.description = "";
            return true;
        },
        validateFile(file) {
            if (!file) {
                this.errors.file = "Vui lòng chọn file";
                return false;
            }
            const maxSize = 50 * 1024 * 1024;
            const allowedTypes = ["audio/mpeg", "video/mp4"];
            const allowedExtensions = /\.(mp3|mp4)$/i;
            if (!allowedExtensions.test(file.name)) {
                this.errors.file = "Chỉ chấp nhận file MP3 và MP4";
                return false;
            }
            if (!allowedTypes.includes(file.type)) {
                this.errors.file = "Định dạng file không hợp lệ";
                return false;
            }
            if (file.size > maxSize) {
                this.errors.file = "Kích thước file không được vượt quá 50MB";
                return false;
            }
            this.errors.file = "";
            return true;
        },
        triggerFileInput() {
            this.$refs.fileInput.click();
        },
        handleFileDrop(event) {
            const file = event.dataTransfer.files[0];
            if (this.validateFile(file)) {
                this.processFile(file);
            }
        },
        handleFileSelect(event) {
            const file = event.target.files[0];
            if (this.validateFile(file)) {
                this.processFile(file);
            }
        },
        processFile(file) {
            if (file && this.validateFile(file)) {
                this.newMedia.file = file;
                this.newMedia.title = file.name.replace(/\.(mp3|mp4)$/i, "");
                this.newMedia.type = file.type.startsWith("audio") ? "audio" : "video";
            }
        },
        openCancelDialog() {
            this.showCancelConfirm = true;
        },
        openSaveDialog() {
            const validTitle = this.validateTitle();
            const validArtist = this.validateArtistName();
            const validDesc = this.validateDescription();
            const validFile = this.validateFile(this.newMedia.file);
            if (validTitle && validArtist && validDesc && validFile) {
                this.showSaveConfirm = true;
            }
        },
        handleCancelConfirm(confirm) {
            if (confirm) {
                this.resetForm();
                this.$emit("cancel");
            }
            this.showCancelConfirm = false;
        },
        handleSaveConfirm(confirm) {
            if (confirm) {
                this.handleAddMedia();
            }
            this.showSaveConfirm = false;
        },
        async handleAddMedia() {
            this.loading = true;
            try {
                const formData = new FormData();
                formData.append("Title", this.newMedia.title);
                formData.append("Description", this.newMedia.description);
                formData.append("Artist", this.newMedia.artistName);
                formData.append("Media.Title", this.newMedia.title);
                formData.append("Media.Type", this.newMedia.type);
                formData.append("Media.File", this.newMedia.file);

                this.$emit("add-media", formData);
            } catch (err) {
                this.error = "Không thể thêm tài nguyên. Vui lòng thử lại.";
                console.error("Lỗi thêm tài nguyên:", err);
            } finally {
                this.loading = false;
                this.resetForm();
            }
        },
        resetForm() {
            this.newMedia = {
                title: "",
                artistName: "",
                description: "",
                url: "",
                file: null,
                type: ""
            };
            this.error = null;
            this.errors = {
                title: "",
                artistName: "",
                description: "",
                file: "",
                url: ""
            };
        }
    }
};
</script>

<style scoped>
.add-media {
    background-color: #fdfdfd;
    border-radius: 12px;
}

.dropzone {
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    min-height: 180px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.dropzone:hover {
    background-color: #f0f7ff !important;
    border-color: #0d6efd !important;
}

.border-dashed {
    border-style: dashed !important;
    border-width: 2px !important;
}

.input-group-text {
    width: 42px;
    justify-content: center;
}

textarea.form-control {
    resize: vertical;
    min-height: 100px;
}

.btn {
    font-weight: 500;
    transition: all 0.2s;
}

.btn-success {
    background-color: #198754;
}

.btn-success:hover {
    background-color: #157347;
}
</style>