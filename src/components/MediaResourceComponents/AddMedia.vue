<template>
    <form @submit.prevent="handleAddMedia" class="add-media-dropzone p-4 border rounded bg-white">
        <h3 class="mb-4 text-primary">Add New Media</h3>

        <div class="dropzone p-5 text-center border border-dashed rounded mb-4" @dragover.prevent @drop.prevent="handleFileDrop">
            <p class="m-0 text-muted">
                <i class="fas fa-cloud-upload-alt fa-2x mb-2"></i>
            </p>
            <p class="mb-3">Drag and drop your MP3/MP4 file here or click to select</p>
            <input type="file" accept=".mp3, .mp4" class="d-none" ref="fileInput" @change="handleFileSelect" />
            <button class="btn btn-outline-primary" @click="triggerFileInput" :disabled="isUrlActive">
                Select File
            </button>
        </div>

        <div class="mb-4">
            <label for="mediaUrl" class="form-label fw-semibold">Or Enter Media URL</label>
            <input v-model="newMedia.url" type="text" class="form-control" id="mediaUrl" placeholder="Enter media URL"
                :disabled="isFileActive" @input="handleUrlInput" />
        </div>

        <div class="mb-4">
            <label for="mediaTitle" class="form-label fw-semibold">Media Title</label>
            <input v-model="newMedia.title" type="text" class="form-control" id="mediaTitle" placeholder="Enter media title" required />
        </div>

        <div class="mb-4">
            <label for="artistName" class="form-label fw-semibold">Artist/Creator Name</label>
            <input v-model="newMedia.artistName" type="text" class="form-control" id="artistName" placeholder="Enter artist/creator name" required />
        </div>

        <div class="mb-4">
            <label for="description" class="form-label fw-semibold">Media Description</label>
            <input v-model="newMedia.description" type="text" class="form-control" id="description" placeholder="Enter media description" required />
        </div>

        <div class="d-flex justify-content-between">
            <button class="btn btn-danger" @click="$emit('cancel')">
                <i class="fas fa-times me-2"></i>Cancel
            </button>
            <button class="btn btn-success" :disabled="loading">
                <i class="fas fa-plus me-2"></i>Add Media
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
                type: "" // 'audio' or 'video'
            },
            loading: false,
            error: null,
        };
    },
    computed: {
        isFileActive() {
            return !!this.newMedia.file;
        },
        isUrlActive() {
            return !!this.newMedia.url;
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
            if (file && (file.type === "audio/mpeg" || file.type === "video/mp4")) {
                this.newMedia.file = file;
                this.newMedia.url = "";
                this.newMedia.title = file.name.replace(/\.(mp3|mp4)$/, "");
                this.newMedia.type = file.type.startsWith("audio") ? "audio" : "video";
                this.error = null;
            } else {
                this.error = "Only MP3 or MP4 files are allowed.";
            }
        },
        handleUrlInput() {
            if (this.newMedia.url) {
                this.newMedia.file = null;
            }
        },
        async handleAddMedia() {
            if (!this.newMedia.title || !this.newMedia.artistName || !this.newMedia.description) {
                this.error = "Please fill all required fields.";
                return;
            }

            if (!this.newMedia.file && !this.newMedia.url) {
                this.error = "Please upload an MP3/MP4 file or provide a valid URL.";
                return;
            }

            this.loading = true;
            this.error = null;

            try {
                const formData = new FormData();
                formData.append("Description", this.newMedia.description);
                formData.append("Artist", this.newMedia.artistName);
                formData.append("Media.Title", this.newMedia.title);
                formData.append("Media.Type", this.newMedia.type);

                if (this.newMedia.file) {
                    formData.append("Media.File", this.newMedia.file);
                }

                if (this.newMedia.url) {
                    formData.append("Media.Url", this.newMedia.url);
                }
                for (let pair of formData.entries()) {
                console.log(pair[0], pair[1]);
            }
                this.$emit("add-media", formData);
                this.newMedia = { title: "", artistName: "", description: "", url: "", file: null, type: "" };
            } catch (err) {
                this.error = "Failed to add media. Please try again.";
            } finally {
                this.loading = false;
            }
        }
    },
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
</style>
