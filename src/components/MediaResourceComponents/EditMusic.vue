<template>
    <form @submit.prevent="handleEditMusic" class="edit-music p-4 border rounded bg-white">
        <h3 class="mb-4 text-primary">Edit Music</h3>

        <div class="dropzone p-5 text-center border border-dashed rounded mb-4" @dragover.prevent
            @drop.prevent="handleFileDrop">
            <p class="m-0 text-muted">
                <i class="fas fa-cloud-upload-alt fa-2x mb-2"></i>
            </p>
            <p class="mb-3">Drag and drop your MP3 file here or click to select</p>
            <input type="file" accept=".mp3" class="d-none" ref="fileInput" @change="handleFileSelect" />
            <button class="btn btn-outline-primary" @click="triggerFileInput" :disabled="isUrlActive">
                Select File
            </button>
        </div>

        <div class="mb-4">
            <label for="musicUrl" class="form-label fw-semibold">Or Enter Music URL</label>
            <input v-model="editedMusic.media.url" type="text" class="form-control" id="musicUrl"
                placeholder="Enter music URL" :disabled="isFileActive" @input="handleUrlInput" />
        </div>

        <div class="mb-4">
            <label for="musicTitle" class="form-label fw-semibold">Music Title</label>
            <input v-model="editedMusic.title" type="text" class="form-control" id="musicTitle"
                placeholder="Enter music title" required />
        </div>

        <div class="mb-4">
            <label for="artistName" class="form-label fw-semibold">Artist Name</label>
            <input v-model="editedMusic.artist" type="text" class="form-control" id="artistName"
                placeholder="Enter artist name" required />
        </div>

        <div class="mb-4">
            <label for="description" class="form-label fw-semibold">Music Description</label>
            <input v-model="editedMusic.description" type="text" class="form-control" id="description"
                placeholder="Enter music description" required />
        </div>

        <div class="d-flex justify-content-between">
            <button class="btn btn-danger" @click="$emit('cancel')">
                <i class="fas fa-times me-2"></i>Cancel
            </button>
            <button class="btn btn-success" :disabled="loading">
                <i class="fas fa-save me-2"></i>Save Changes
            </button>
        </div>
    </form>
</template>

<script>

export default {
    props: {
        music: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            editedMusic: { ...this.music },
            loading: false,
            error: null,
        };
    },
    computed: {
        isFileActive() {
            return !!this.editedMusic.media.file;
        },
        isUrlActive() {
            return !!this.editedMusic.media.url;
        },
    },
    methods: {
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
            if (file && file.type === "audio/mpeg") {
                this.editedMusic.media.file = file;
                this.editedMusic.media.url = "";
                this.editedMusic.title = file.name.replace(".mp3", "");
                this.error = null;
            } else {
                this.error = "Only MP3 files are allowed.";
            }
        },
        handleUrlInput() {
            if (this.editedMusic.url) {
                this.editedMusic.file = null;
            }
        },
        async handleEditMusic() {
            if (!this.editedMusic.title || !this.editedMusic.artist || !this.editedMusic.description) {
                this.error = "Please fill all required fields.";
                return;
            }

            if (!this.editedMusic.media.file && !this.editedMusic.media.url) {
                this.error = "Please upload an MP3 file or provide a valid URL.";
                return;
            }

            this.loading = true;
            this.error = null;

            try {
                const formData = new FormData();
                formData.append("Id", this.editedMusic.id);
                formData.append("Description", this.editedMusic.description);
                formData.append("Artist", this.editedMusic.artist);
                formData.append("ReplacedMedia.Title", this.editedMusic.title);

                if (this.editedMusic.media.file) {
                    formData.append("ReplacedMedia.File", this.editedMusic.media.file);
                }

                if (this.editedMusic.media.url) {
                    formData.append("ReplacedMedia.Url", this.editedMusic.media.url);
                }

                this.$emit("edit-music", formData);
            } catch (err) {
                this.error = "Failed to update music. Please try again.";
            } finally {
                this.loading = false;
            }
        },
    },
};
</script>

<style scoped>
.edit-music {
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