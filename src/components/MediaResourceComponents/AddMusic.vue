<template>
    <div class="add-music-dropzone p-3 border rounded">
        <h5 class="mb-3">Add New Music</h5>
        <div
            class="dropzone p-4 text-center border border-dashed rounded mb-3"
            @dragover.prevent
            @drop.prevent="handleFileDrop"
        >
            <p class="m-0"><i class="fas fa-cloud-upload-alt fa-2x"></i></p>
            <p>Drag and drop your MP3 file here or click to select</p>
            <input type="file" accept=".mp3" class="d-none" ref="fileInput" @change="handleFileSelect" />
            <button class="btn btn-outline-primary" @click="triggerFileInput">Select File</button>
        </div>
        <form @submit.prevent="handleAddMusic">
            <div class="mb-3">
                <label for="musicName" class="form-label">Music Name</label>
                <input v-model="newMusic.name" type="text" class="form-control" id="musicName" placeholder="Enter music name" required />
            </div>
            <div class="mb-3">
                <label for="musicUrl" class="form-label">Music URL</label>
                <input v-model="newMusic.url" type="text" class="form-control" id="musicUrl" placeholder="Enter music URL" required />
            </div>
            <div class="mb-3">
                <label for="fileUrl" class="form-label">File URL</label>
                <input v-model="newMusic.fileUrl" type="text" class="form-control" id="fileUrl" placeholder="Enter file URL (e.g., cloud storage)" required />
            </div>
            <div class="d-flex justify-content-between">
                <button class="btn btn-danger" @click="$emit('cancel')">
                    <i class="fas fa-times me-1"></i> Cancel
                </button>
                <button class="btn btn-success">
                    <i class="fas fa-plus me-1"></i> Add Music
                </button>
            </div>
        </form>
    </div>
</template>

<script>
export default {
    data() {
        return {
            newMusic: {
                name: "",
                url: "",
                fileUrl: "",
            },
        };
    },
    methods: {
        triggerFileInput() {
            this.$refs.fileInput.click();
        },
        handleFileDrop(event) {
            const file = event.dataTransfer.files[0];
            if (file && file.type === "audio/mpeg") {
                this.newMusic.name = file.name;
                this.newMusic.fileUrl = URL.createObjectURL(file);
            } else {
            }
        },
        handleFileSelect(event) {
            const file = event.target.files[0];
            if (file && file.type === "audio/mpeg") {
                this.newMusic.name = file.name;
                this.newMusic.fileUrl = URL.createObjectURL(file);
            } else {
            }
        },
        handleAddMusic() {
            if (this.newMusic.name.trim() && this.newMusic.url.trim() && this.newMusic.fileUrl.trim()) {
                this.$emit("add-music", { ...this.newMusic });
                this.newMusic = { name: "", url: "", fileUrl: "" };
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
