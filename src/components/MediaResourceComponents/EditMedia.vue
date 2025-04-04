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

        <div class="mb-4">
            <label for="mediaTitle" class="form-label fw-semibold">Title</label>
            <input v-model="editedMedia.title" type="text" class="form-control" id="mediaTitle"
                placeholder="Enter title" required />
        </div>

        <div class="mb-4">
            <label for="artistName" class="form-label fw-semibold">Artist Name</label>
            <input v-model="editedMedia.artist" type="text" class="form-control" id="artistName"
                placeholder="Enter artist name" required />
        </div>

        <div class="mb-4">
            <label for="description" class="form-label fw-semibold">Description</label>
            <input v-model="editedMedia.description" type="text" class="form-control" id="description"
                placeholder="Enter description" required />
        </div>

        <div class="d-flex justify-content-between">
            <button type="button" class="btn btn-danger" @click="$emit('cancel')">
                <i class="fas fa-times me-2"></i>Cancel
            </button>
            <button @click="handleEditMedia" class="btn btn-success" :disabled="loading">
                <i class="fas fa-save me-2"></i>Save Changes
            </button>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        media: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            editedMedia: { ...this.media },
            loading: false,
            error: null,
        };
    },
    computed: {
        isFileActive() {
            return !!this.editedMedia.file;
        }
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
            if (file && (file.type === "audio/mpeg" || file.type === "video/mp4")) {
                this.editedMedia.file = file;
                this.editedMedia.title = file.name.replace(/\.(mp3|mp4)$/, "");
                this.error = null;
            } else {
                this.error = "Only MP3 and MP4 files are allowed.";
            }
        },
        async handleEditMedia() {
            if (!this.editedMedia.title || !this.editedMedia.artist || !this.editedMedia.description) {
                this.error = "Please fill all required fields.";
                return;
            }

            this.loading = true;
            this.error = null;

            try {
                const formData = new FormData();
                formData.append("Id", this.editedMedia.id);
                formData.append("ReplacedMedia.Title", this.editedMedia.title);
                formData.append("Description", this.editedMedia.description);
                formData.append("Artist", this.editedMedia.artist);

                if (this.editedMedia.file) {
                    formData.append("ReplacedMedia.File", this.editedMedia.file);
                }

                this.$emit("edit-media", formData);
            } catch (err) {
                this.error = "Failed to update media. Please try again.";
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
