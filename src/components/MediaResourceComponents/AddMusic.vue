<template>
    <div class="add-music-dropzone p-3 border rounded">
        <h5 class="mb-3">Add New Music</h5>
        <div class="dropzone p-4 text-center border border-dashed rounded mb-3" @dragover.prevent
            @drop.prevent="handleFileDrop">
            <p class="m-0"><i class="fas fa-cloud-upload-alt fa-2x"></i></p>
            <p>Drag and drop your MP3 file here or click to select</p>
            <input type="file" accept=".mp3" class="d-none" ref="fileInput" @change="handleFileSelect" />
            <button class="btn btn-outline-primary" @click="triggerFileInput">Select File</button>
        </div>
        <form @submit.prevent="handleAddMusic">
            <div class="mb-3">
                <label for="musicTitle" class="form-label">Music Title</label>
                <input v-model="newMusic.title" type="text" class="form-control" id="musicTitle"
                    placeholder="Enter music title" required />
            </div>
            <div class="mb-3">
                <label for="artistName" class="form-label">Artist Name</label>
                <input v-model="newMusic.artistName" type="text" class="form-control" id="artistName"
                    placeholder="Enter artist name" required />
            </div>
            <div class="mb-3">
                <label for="description" class="form-label">Music Description</label>
                <input v-model="newMusic.description" type="text" class="form-control" id="description"
                    placeholder="Enter description" required />
            </div>
            <div class="mb-3">
                <label for="musicUrl" class="form-label">Music URL</label>
                <input v-model="newMusic.url" type="text" class="form-control" id="musicUrl"
                    placeholder="Enter music URL" required />
            </div>
            <div class="d-flex justify-content-between">
                <button class="btn btn-danger" @click="$emit('cancel')">
                    <i class="fas fa-times me-1"></i> Cancel
                </button>
                <button class="btn btn-success" :disabled="loading">
                    <i class="fas fa-plus me-1"></i> Add Music
                </button>
            </div>
        </form>
        <div v-if="error" class="text-danger mt-2">{{ error }}</div>
    </div>
</template>

<script>
import { createMediaResource } from "../../services/mediaResourcesService";

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
                this.newMusic.title = file.name.replace(".mp3", "");
                this.newMusic.url = `${this.newMusic.title}`;
                this.error = null;
            } else {
                this.error = "Only MP3 files are allowed.";
            }
        },
        async handleAddMusic() {
            if (!this.newMusic.title || !this.newMusic.artistName || !this.newMusic.description || !this.newMusic.file || !this.newMusic.url) {
                this.error = "Please fill all fields and upload an MP3 file.";
                return;
            }

            this.loading = true;
            this.error = null;

            try {
                const formData = new FormData();
                formData.append("Description", this.newMusic.description);
                formData.append("Artist", this.newMusic.artistName);
                formData.append("Media.Title", this.newMusic.title);
                formData.append("Media.Url", this.newMusic.url);
                formData.append("Media.File", this.newMusic.file);

                const response = await createMediaResource(formData);
                console.log("Response from API:", response);
                this.$emit("add-music", response);
                this.newMusic = { title: "", artistName: "", description: "", url: "", file: null };
            } catch (err) {
                this.error = "Failed to add music. Please try again.";
            } finally {
                this.loading = false;
            }
        },
    },
};
</script>

<style scoped>
.add-music-dropzone {
    background-color: #f9f9f9;
}

.dropzone {
    cursor: pointer;
    transition: background-color 0.2s;
}

.dropzone:hover {
    background-color: #f1f1f1;
}

.border-dashed {
    border-style: dashed !important;
}
</style>