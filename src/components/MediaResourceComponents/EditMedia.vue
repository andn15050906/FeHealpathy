<template>
    <div class="edit-media p-4 border rounded shadow-sm bg-white">
        <h3 class="mb-4 text-primary border-bottom pb-2">Edit Media</h3>

        <div class="dropzone p-5 text-center border rounded mb-4" :class="{
            'border-primary': isFileActive,
            'border-dashed': !isFileActive,
            'bg-light': !isFileActive
        }" @dragover.prevent @drop.prevent="handleFileDrop" @click="triggerFileInput">
            <div v-if="!editedMedia.file">
                <i class="fas fa-cloud-upload-alt fa-3x mb-3 text-secondary"></i>
                <p class="mb-3">Drag and drop your MP3/MP4 file here or click to select</p>
                <button class="btn btn-outline-primary px-4">
                    Select File
                </button>
            </div>

            <div v-else class="py-3">
                <i class="fas fa-file-audio fa-3x mb-3 text-success"></i>
                <p class="h5 mb-1 text-primary">{{ editedMedia.file.name }}</p>
                <p class="text-muted mb-2">{{ (editedMedia.file.size / (1024 * 1024)).toFixed(2) }} MB</p>
                <button class="btn btn-sm btn-outline-secondary" @click.stop="editedMedia.file = null">
                    Change File
                </button>
            </div>

            <input type="file" accept=".mp3,.mp4" class="d-none" ref="fileInput" @change="handleFileSelect" />
            <div v-if="validationErrors.file" class="text-danger mt-2 small">
                <i class="fas fa-exclamation-circle"></i> {{ validationErrors.file }}
            </div>
        </div>

        <div class="mb-4">
            <label for="mediaTitle" class="form-label fw-semibold">Title</label>
            <div class="input-group has-validation">
                <span class="input-group-text bg-light">
                    <i class="fas fa-heading"></i>
                </span>
                <input v-model="editedMedia.title" type="text" class="form-control"
                    :class="{ 'is-invalid': validationErrors.title }" id="mediaTitle" placeholder="Enter title"
                    @input="validateTitle" required />
                <div class="invalid-feedback">
                    {{ validationErrors.title }}
                </div>
            </div>
            <small class="text-muted">3-100 characters</small>
        </div>

        <div class="mb-4">
            <label for="artistName" class="form-label fw-semibold">Artist Name</label>
            <div class="input-group has-validation">
                <span class="input-group-text bg-light">
                    <i class="fas fa-user"></i>
                </span>
                <input v-model="editedMedia.artist" type="text" class="form-control"
                    :class="{ 'is-invalid': validationErrors.artist }" id="artistName" placeholder="Enter artist name"
                    @input="validateArtist" required />
                <div class="invalid-feedback">
                    {{ validationErrors.artist }}
                </div>
            </div>
            <small class="text-muted">2-50 characters</small>
        </div>

        <div class="mb-4">
            <label for="description" class="form-label fw-semibold">Description</label>
            <div class="input-group has-validation">
                <span class="input-group-text bg-light">
                    <i class="fas fa-align-left"></i>
                </span>
                <textarea v-model="editedMedia.description" class="form-control"
                    :class="{ 'is-invalid': validationErrors.description }" id="description"
                    placeholder="Enter description" @input="validateDescription" rows="3" required></textarea>
                <div class="invalid-feedback">
                    {{ validationErrors.description }}
                </div>
            </div>
            <small class="text-muted">10-500 characters</small>
        </div>

        <div class="d-flex justify-content-between mt-4 pt-3 border-top">
            <button class="btn btn-outline-danger px-4" @click="openCancelDialog">
                <i class="fas fa-times me-2"></i>Cancel
            </button>
            <button @click="openSaveDialog" class="btn btn-success px-4" :disabled="loading || !isValidForm">
                <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                <i v-else class="fas fa-save me-2"></i>
                {{ loading ? 'Saving...' : 'Save Changes' }}
            </button>
        </div>

        <div v-if="!isValidForm && Object.values(validationErrors).some(v => v)"
            class="mt-3 p-2 bg-danger-subtle text-danger rounded">
            <i class="fas fa-exclamation-triangle me-2"></i>
            Please fix the validation errors before saving
        </div>

        <CancelConfirmPopup :message="cancelMessage" :isVisible="showCancelConfirm"
            @confirmCancel="handleCancelConfirm" @update:isVisible="showCancelConfirm = $event" />

        <SaveConfirmPopUp :message="saveMessage" :isVisible="showSaveConfirm" @confirmSave="handleSaveConfirm"
            @update:isVisible="showSaveConfirm = $event" />
    </div>
</template>

<script>
import CancelConfirmPopup from "../Common/Popup/CancelConfirmPopup.vue";
import SaveConfirmPopUp from "../Common/Popup/SaveConfirmPopUp.vue";

export default {
    name: "EditMedia",
    components: {
        CancelConfirmPopup,
        SaveConfirmPopUp,
    },
    props: {
        media: {
            type: Object,
            required: true,
            validator: (value) => {
                return value && typeof value === 'object' &&
                    'id' in value &&
                    'title' in value &&
                    'artist' in value &&
                    'description' in value;
            }
        },
    },
    data() {
        return {
            editedMedia: { ...this.media },
            loading: false,
            validationErrors: {
                title: '',
                artist: '',
                description: '',
                file: ''
            },
            showCancelConfirm: false,
            showSaveConfirm: false,
            cancelMessage: "Are you sure you want to cancel? Your changes will not be saved.",
            saveMessage: "Do you want to save changes?"
        };
    },
    computed: {
        isFileActive() {
            return !!this.editedMedia.file;
        },
        isValidForm() {
            return !this.validationErrors.title &&
                !this.validationErrors.artist &&
                !this.validationErrors.description &&
                !this.validationErrors.file &&
                this.editedMedia.title &&
                this.editedMedia.artist &&
                this.editedMedia.description;
        }
    },
    methods: {
        validateTitle() {
            if (!this.editedMedia.title) {
                this.validationErrors.title = 'Title is required';
                return false;
            }
            if (this.editedMedia.title.length < 3) {
                this.validationErrors.title = 'Title must be at least 3 characters';
                return false;
            }
            if (this.editedMedia.title.length > 100) {
                this.validationErrors.title = 'Title must not exceed 100 characters';
                return false;
            }
            this.validationErrors.title = '';
            return true;
        },
        validateArtist() {
            if (!this.editedMedia.artist) {
                this.validationErrors.artist = 'Artist name is required';
                return false;
            }
            if (this.editedMedia.artist.length < 2) {
                this.validationErrors.artist = 'Artist name must be at least 2 characters';
                return false;
            }
            if (this.editedMedia.artist.length > 50) {
                this.validationErrors.artist = 'Artist name must not exceed 50 characters';
                return false;
            }
            this.validationErrors.artist = '';
            return true;
        },
        validateDescription() {
            if (!this.editedMedia.description) {
                this.validationErrors.description = 'Description is required';
                return false;
            }
            if (this.editedMedia.description.length < 10) {
                this.validationErrors.description = 'Description must be at least 10 characters';
                return false;
            }
            if (this.editedMedia.description.length > 500) {
                this.validationErrors.description = 'Description must not exceed 500 characters';
                return false;
            }
            this.validationErrors.description = '';
            return true;
        },
        validateFile(file) {
            if (!file) {
                this.validationErrors.file = '';
                return true;
            }
            const maxSize = 50 * 1024 * 1024; // 50MB
            const allowedTypes = ['audio/mpeg', 'video/mp4'];
            const allowedExtensions = ['.mp3', '.mp4'];
            const fileExtension = file.name.toLowerCase().slice((file.name.lastIndexOf(".") - 1 >>> 0) + 2);
            if (!allowedExtensions.includes(`.${fileExtension}`)) {
                this.validationErrors.file = 'Only MP3 and MP4 files are allowed';
                return false;
            }
            if (!allowedTypes.includes(file.type)) {
                this.validationErrors.file = 'Invalid file type';
                return false;
            }
            if (file.size > maxSize) {
                this.validationErrors.file = 'File size must not exceed 50MB';
                return false;
            }
            this.validationErrors.file = '';
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
                this.editedMedia.file = file;
                this.editedMedia.title = file.name.replace(/\.(mp3|mp4)$/, "");
                this.validateTitle();
            }
        },
        openCancelDialog() {
            this.showCancelConfirm = true;
        },
        openSaveDialog() {
            const isTitleValid = this.validateTitle();
            const isArtistValid = this.validateArtist();
            const isDescriptionValid = this.validateDescription();
            if (isTitleValid && isArtistValid && isDescriptionValid) {
                this.showSaveConfirm = true;
            }
        },
        handleCancelConfirm(confirm) {
            if (confirm) {
                this.$emit("cancel");
            }
            this.showCancelConfirm = false;
        },
        handleSaveConfirm(confirm) {
            if (confirm) {
                this.performSave();
            }
            this.showSaveConfirm = false;
        },
        performSave() {
            this.loading = true;
            try {
                const formData = new FormData();
                formData.append("Id", this.editedMedia.id);
                formData.append("ReplacedMedia.Title", this.editedMedia.title);
                formData.append("Description", this.editedMedia.description);
                formData.append("Artist", this.editedMedia.artist);
                if (this.editedMedia.file) {
                    formData.append("ReplacedMedia.File", this.editedMedia.file);
                }

                console.log("FormData:", this.editedMedia.title);

                this.$emit("edit-media", formData);
            } catch (err) {
            } finally {
                this.loading = false;
            }
        }
    }
};
</script>

<style scoped>
.edit-media {
    background-color: #fdfdfd;
    border-radius: 12px;
    margin: 0 auto;
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
