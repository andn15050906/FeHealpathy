<template>
    <form @submit.prevent="handleAddMusic" class="add-music-dropzone p-4 border rounded bg-white">
        <h3 class="mb-4 text-primary">Add New Music</h3>

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
            <input v-model="newMusic.url" type="text" class="form-control" id="musicUrl" placeholder="Enter music URL"
                :disabled="isFileActive" @input="handleUrlInput" />
        </div>

        <div class="mb-4">
            <label for="musicTitle" class="form-label fw-semibold">Music Title</label>
            <input v-model="newMusic.title" type="text" class="form-control" id="musicTitle"
                placeholder="Enter music title" required />
        </div>

        <div class="mb-4">
            <label for="artistName" class="form-label fw-semibold">Artist Name</label>
            <input v-model="newMusic.artistName" type="text" class="form-control" id="artistName"
                placeholder="Enter artist name" required />
        </div>

        <div class="mb-4">
            <label for="description" class="form-label fw-semibold">Music Description</label>
            <input v-model="newMusic.description" type="text" class="form-control" id="description"
                placeholder="Enter music description" required />
        </div>

        <div class="d-flex justify-content-between">
            <button class="btn btn-danger" @click="$emit('cancel')">
                <i class="fas fa-times me-2"></i>Cancel
            </button>
            <button class="btn btn-success" :disabled="loading">
                <i class="fas fa-plus me-2"></i>Add Music
            </button>
        </div>
    </form>
</template>

<script>
export default {
    data() {
        return {
            newMusic: {
                title: "",
                artistName: "",
                description: "",
                url: "",
                file: null,
            },
            loading: false,
            error: null,
        };
    },
    computed: {
        isFileActive() {
            return !!this.newMusic.file;
        },
        isUrlActive() {
            return !!this.newMusic.url;
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
                this.newMusic.file = file;
                this.newMusic.url = "";
                this.newMusic.title = file.name.replace(".mp3", "");
                this.error = null;
            } else {
                this.error = "Only MP3 files are allowed.";
            }
        },
        handleUrlInput() {
            if (this.newMusic.url) {
                this.newMusic.file = null;
            }
        },
        async handleAddMusic() {
            if (!this.newMusic.title || !this.newMusic.artistName || !this.newMusic.description) {
                this.error = "Please fill all required fields.";
                return;
            }

            if (!this.newMusic.file && !this.newMusic.url) {
                this.error = "Please upload an MP3 file or provide a valid URL.";
                return;
            }

            this.loading = true;
            this.error = null;

            try {
                const formData = new FormData();
                formData.append("Description", this.newMusic.description);
                formData.append("Artist", this.newMusic.artistName);
                formData.append("Media.Title", this.newMusic.title);

                if (this.newMusic.file) {
                    formData.append("Media.File", this.newMusic.file);
                }

                if (this.newMusic.url) {
                    formData.append("Media.Url", this.newMusic.url);
                }

                this.$emit("add-music", formData);
                this.newMusic = { title: "", artistName: "", description: "", url: "", file: null };
            } catch (err) {
                this.error = "Failed to add music. Please try again.";
            } finally {
                this.loading = false;
            }
        }
    },
};
</script>

<style scoped>
.add-music-dropzone {
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