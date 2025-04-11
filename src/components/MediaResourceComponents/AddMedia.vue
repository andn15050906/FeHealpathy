<template>
    <form @submit.prevent="handleAddMedia" class="add-media-dropzone p-4 border rounded bg-white">
        <h3 class="mb-4 text-primary">Add New Media</h3>

        <div v-if="error" class="alert alert-danger mb-3">{{ error }}</div>

        <div class="dropzone p-5 text-center border border-dashed rounded mb-4" 
             @dragover.prevent @drop.prevent="handleFileDrop"
             :class="{ 'error-border': errors.file }">
            <p class="m-0 text-muted">
                <i class="fas fa-cloud-upload-alt fa-2x mb-2"></i>
            </p>
            <p class="mb-3">Drag and drop your MP3/MP4 file here or click to select</p>
            <input type="file" accept=".mp3, .mp4" class="d-none" ref="fileInput" @change="handleFileSelect" />
            <button type="button" class="btn btn-outline-primary" @click="triggerFileInput">
                Select File
            </button>
            <div v-if="errors.file" class="text-danger mt-2">{{ errors.file }}</div>
        </div>

        <div class="mb-4">
            <label for="mediaTitle" class="form-label fw-semibold">Media Title <span class="text-danger">*</span></label>
            <input 
                v-model="newMedia.title" 
                type="text" 
                class="form-control" 
                id="mediaTitle" 
                placeholder="Enter media title" 
                required
                :class="{ 'is-invalid': errors.title }"
                @blur="validateTitle"
            />
            <div v-if="errors.title" class="invalid-feedback">{{ errors.title }}</div>
        </div>

        <div class="mb-4">
            <label for="artistName" class="form-label fw-semibold">Artist/Creator Name <span class="text-danger">*</span></label>
            <input 
                v-model="newMedia.artistName" 
                type="text" 
                class="form-control" 
                id="artistName" 
                placeholder="Enter artist/creator name" 
                required
                :class="{ 'is-invalid': errors.artistName }"
                @blur="validateArtistName"
            />
            <div v-if="errors.artistName" class="invalid-feedback">{{ errors.artistName }}</div>
        </div>

        <div class="mb-4">
            <label for="description" class="form-label fw-semibold">Media Description <span class="text-danger">*</span></label>
            <textarea 
                v-model="newMedia.description" 
                class="form-control" 
                id="description" 
                placeholder="Enter media description" 
                required
                rows="3"
                :class="{ 'is-invalid': errors.description }"
                @blur="validateDescription"
            ></textarea>
            <div v-if="errors.description" class="invalid-feedback">{{ errors.description }}</div>
        </div>

        <div class="d-flex justify-content-between">
            <button type="button" class="btn btn-danger" @click="$emit('cancel')">
                <i class="fas fa-times me-2"></i>Cancel
            </button>
            <button 
                type="submit" 
                class="btn btn-success" 
                :disabled="loading || !isFormValid">
                <i class="fas fa-spinner fa-spin me-2" v-if="loading"></i>
                <i class="fas fa-plus me-2" v-else></i>
                Add Media
            </button>
        </div>
    </form>
</template>

<script>
export default {
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
            }
        };
    },
    computed: {
        isFileActive() {
            return !!this.newMedia.file;
        },
        isUrlActive() {
            return !!this.newMedia.url;
        },
        isFormValid() {
            return !Object.values(this.errors).some(error => error !== "") &&
                   this.newMedia.title &&
                   this.newMedia.artistName &&
                   this.newMedia.description &&
                   this.newMedia.file;
        }
    },
    methods: {
        validateTitle() {
            if (!this.newMedia.title.trim()) {
                this.errors.title = "Title is required";
                return false;
            }
            if (this.newMedia.title.length > 100) {
                this.errors.title = "Title must be less than 100 characters";
                return false;
            }
            this.errors.title = "";
            return true;
        },
        validateArtistName() {
            if (!this.newMedia.artistName.trim()) {
                this.errors.artistName = "Artist/Creator name is required";
                return false;
            }
            if (this.newMedia.artistName.length > 50) {
                this.errors.artistName = "Artist name must be less than 50 characters";
                return false;
            }
            this.errors.artistName = "";
            return true;
        },
        validateDescription() {
            if (!this.newMedia.description.trim()) {
                this.errors.description = "Description is required";
                return false;
            }
            if (this.newMedia.description.length > 500) {
                this.errors.description = "Description must be less than 500 characters";
                return false;
            }
            this.errors.description = "";
            return true;
        },
        validateUrl(url) {
            if (!url) return true; // URL is optional if file is provided
            try {
                new URL(url);
                const isMediaUrl = url.match(/\.(mp3|mp4)$/i) || 
                                 url.includes('youtube.com') || 
                                 url.includes('youtu.be') ||
                                 url.includes('vimeo.com');
                if (!isMediaUrl) {
                    this.errors.url = "URL must be a valid media link (MP3, MP4, YouTube, or Vimeo)";
                    return false;
                }
                this.errors.url = "";
                return true;
            } catch {
                this.errors.url = "Please enter a valid URL";
                return false;
            }
        },
        validateFile(file) {
            if (!file) return true; // File is optional if URL is provided
            
            const maxSize = 100 * 1024 * 1024; // 100MB
            if (file.size > maxSize) {
                this.errors.file = "File size must be less than 100MB";
                return false;
            }

            if (!file.type.match(/^(audio\/mpeg|video\/mp4)$/)) {
                this.errors.file = "Only MP3 or MP4 files are allowed";
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
            this.processFile(file);
        },
        handleFileSelect(event) {
            const file = event.target.files[0];
            this.processFile(file);
        },
        processFile(file) {
            if (this.validateFile(file)) {
                this.newMedia.file = file;
                this.newMedia.url = "";
                this.newMedia.title = file.name.replace(/\.(mp3|mp4)$/i, "");
                this.newMedia.type = file.type.startsWith("audio") ? "audio" : "video";
                this.error = null;
            }
        },
        handleUrlInput() {
            if (this.newMedia.url) {
                this.newMedia.file = null;
                this.validateUrl(this.newMedia.url);
            }
        },
        async handleAddMedia() {
            // Validate all fields
            const isValidTitle = this.validateTitle();
            const isValidArtist = this.validateArtistName();
            const isValidDesc = this.validateDescription();
            const isValidFile = this.validateFile(this.newMedia.file);

            if (!isValidTitle || !isValidArtist || !isValidDesc || !isValidFile) {
                return;
            }

            if (!this.newMedia.file) {
                this.error = "Please upload a file";
                return;
            }

            this.loading = true;
            this.error = null;

            try {
                const formData = new FormData();
                formData.append("Title", this.newMedia.title);
                formData.append("Description", this.newMedia.description);
                formData.append("Artist", this.newMedia.artistName);
                formData.append("Media.Title", this.newMedia.file.name.replace(/\.(mp3|mp4)$/i, ""));
                formData.append("Media.Type", this.newMedia.type);
                formData.append("Media.File", this.newMedia.file);

                this.$emit("add-media", formData);
                this.resetForm();
            } catch (err) {
                this.error = "Failed to add media. Please try again.";
                console.error("Add media error:", err);
            } finally {
                this.loading = false;
            }
        },
        determineMediaType() {
            if (this.newMedia.url) {
                if (this.newMedia.url.match(/\.(mp3)$/i)) return "audio";
                if (this.newMedia.url.match(/\.(mp4)$/i)) return "video";
                if (this.newMedia.url.includes('youtube.com') || this.newMedia.url.includes('youtu.be')) return "video";
                if (this.newMedia.url.includes('vimeo.com')) return "video";
            }
            return "video"; // default to video
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
.add-media-dropzone {
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

.error-border {
    border-color: #dc3545 !important;
}

.invalid-feedback {
    display: block;
}

textarea {
    min-height: 100px;
}
</style>
