<template>
    <div @submit.prevent="handleEditMedia" class="edit-media p-4 border rounded bg-white">
        <h3 class="mb-4 text-primary">Edit Media</h3>

        <div class="dropzone p-5 text-center border border-dashed rounded mb-4" @dragover.prevent
            @drop.prevent="handleFileDrop">
            <p class="m-0 text-muted">
                <i class="fas fa-cloud-upload-alt fa-2x mb-2"></i>
            </p>
            <p class="mb-3">Drag and drop your MP3/MP4 file here or click to select</p>
            <input type="file" accept=".mp3,.mp4" class="d-none" ref="fileInput" @change="handleFileSelect" />
            <button class="btn btn-outline-primary" @click="triggerFileInput">
                Select File
            </button>
        </div>

        <div v-if="editedMedia.file" class="mt-2 text-center">
            <p class="mb-1">Selected file:</p>
            <p class="text-primary mb-0">{{ editedMedia.file.name }}</p>
            <small class="text-muted">
                {{ (editedMedia.file.size / (1024 * 1024)).toFixed(2) }} MB
            </small>
        </div>

        <div class="mb-4">
            <label for="mediaTitle" class="form-label fw-semibold">Title</label>
            <input v-model="editedMedia.title" 
                   type="text" 
                   class="form-control" 
                   :class="{ 'is-invalid': validationErrors.title }"
                   id="mediaTitle"
                   placeholder="Enter title" 
                   @blur="validateTitle"
                   required />
        </div>

        <div class="mb-4">
            <label for="artistName" class="form-label fw-semibold">Artist Name</label>
            <input v-model="editedMedia.artist" 
                   type="text" 
                   class="form-control" 
                   :class="{ 'is-invalid': validationErrors.artist }"
                   id="artistName"
                   placeholder="Enter artist name" 
                   @blur="validateArtist"
                   required />
        </div>

        <div class="mb-4">
            <label for="description" class="form-label fw-semibold">Description</label>
            <input v-model="editedMedia.description" 
                   type="text" 
                   class="form-control" 
                   :class="{ 'is-invalid': validationErrors.description }"
                   id="description"
                   placeholder="Enter description" 
                   @blur="validateDescription"
                   required />
        </div>

        <div class="d-flex justify-content-between">
            <button type="button" class="btn btn-danger" @click="$emit('cancel')">
                <i class="fas fa-times me-2"></i>Cancel
            </button>
            <button @click="handleEditMedia" 
                    class="btn btn-success" 
                    :disabled="loading || !isValidForm">
                <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                <i v-else class="fas fa-save me-2"></i>
                {{ loading ? 'Saving...' : 'Save Changes' }}
            </button>
        </div>
    </div>
</template>

<script>
import { toast } from "vue3-toastify";

export default {
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
            }
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
                   !this.validationErrors.file;
        }
    },
    methods: {
        showError(message) {
            toast.error(message, {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "colored"
            });
        },

        showSuccess(message) {
            toast.success(message, {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 3000,
                theme: "colored"
            });
        },

        validateTitle() {
            if (!this.editedMedia.title) {
                this.validationErrors.title = 'Title is required';
                this.showError('Title is required');
                return false;
            }
            if (this.editedMedia.title.length < 3) {
                this.validationErrors.title = 'Title must be at least 3 characters';
                this.showError('Title must be at least 3 characters');
                return false;
            }
            if (this.editedMedia.title.length > 100) {
                this.validationErrors.title = 'Title must not exceed 100 characters';
                this.showError('Title must not exceed 100 characters');
                return false;
            }
            this.validationErrors.title = '';
            return true;
        },

        validateArtist() {
            if (!this.editedMedia.artist) {
                this.validationErrors.artist = 'Artist name is required';
                this.showError('Artist name is required');
                return false;
            }
            if (this.editedMedia.artist.length < 2) {
                this.validationErrors.artist = 'Artist name must be at least 2 characters';
                this.showError('Artist name must be at least 2 characters');
                return false;
            }
            if (this.editedMedia.artist.length > 50) {
                this.validationErrors.artist = 'Artist name must not exceed 50 characters';
                this.showError('Artist name must not exceed 50 characters');
                return false;
            }
            this.validationErrors.artist = '';
            return true;
        },

        validateDescription() {
            if (!this.editedMedia.description) {
                this.validationErrors.description = 'Description is required';
                this.showError('Description is required');
                return false;
            }
            if (this.editedMedia.description.length < 10) {
                this.validationErrors.description = 'Description must be at least 10 characters';
                this.showError('Description must be at least 10 characters');
                return false;
            }
            if (this.editedMedia.description.length > 500) {
                this.validationErrors.description = 'Description must not exceed 500 characters';
                this.showError('Description must not exceed 500 characters');
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
                this.showError('Only MP3 and MP4 files are allowed');
                return false;
            }

            if (!allowedTypes.includes(file.type)) {
                this.validationErrors.file = 'Invalid file type';
                this.showError('Invalid file type');
                return false;
            }

            if (file.size > maxSize) {
                this.validationErrors.file = 'File size must not exceed 50MB';
                this.showError('File size must not exceed 50MB');
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
            }
        },

        async handleEditMedia() {
            const isTitleValid = this.validateTitle();
            const isArtistValid = this.validateArtist();
            const isDescriptionValid = this.validateDescription();

            if (!isTitleValid || !isArtistValid || !isDescriptionValid) {
                return;
            }

            this.loading = true;

            try {
                const formData = new FormData();
                formData.append("Id", this.editedMedia.id);
                formData.append("Title", this.editedMedia.title);
                formData.append("ReplacedMedia.Title", this.editedMedia.file ? this.editedMedia.file.name.replace(/\.(mp3|mp4)$/, "") : this.editedMedia.title);
                formData.append("Description", this.editedMedia.description);
                formData.append("Artist", this.editedMedia.artist);

                if (this.editedMedia.file) {
                    formData.append("ReplacedMedia.File", this.editedMedia.file);
                }

                this.$emit("edit-media", formData);
                this.showSuccess("Media updated successfully");
            } catch (err) {
                this.showError("Failed to update media. Please try again.");
            } finally {
                this.loading = false;
            }
        },
    },
};
</script>

<style scoped>
.edit-media {
    background-color: #fdfdfd;
    border-radius: 12px;
}

.dropzone {
    cursor: pointer;
    transition: background-color 0.3s ease-in-out;
}

.dropzone:hover {
    background-color: #f8f9fa;
}

.border-dashed {
    border-style: dashed !important;
}
</style>
