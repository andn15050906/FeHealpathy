<template>
    <div class="edit-music p-3 border rounded">
        <h5 class="mb-3">Edit Music</h5>
        <form @submit.prevent="handleEditMusic">
            <div class="mb-3">
                <label for="musicName" class="form-label">Music Name</label>
                <input v-model="editedMusic.name" type="text" class="form-control" id="musicName"
                    placeholder="Enter music name" required />
            </div>
            <div class="mb-3">
                <label for="musicUrl" class="form-label">Music URL</label>
                <input v-model="editedMusic.url" type="text" class="form-control" id="musicUrl"
                    placeholder="Enter music URL" required />
            </div>
            <div class="mb-3">
                <label for="fileUrl" class="form-label">File URL</label>
                <input v-model="editedMusic.fileUrl" type="text" class="form-control" id="fileUrl"
                    placeholder="Enter file URL (e.g., cloud storage)" required />
            </div>
            <div class="d-flex justify-content-between">
                <button class="btn btn-danger" @click="$emit('cancel')">
                    <i class="fas fa-times me-1"></i> Cancel
                </button>
                <button class="btn btn-success">
                    <i class="fas fa-save me-1"></i> Save Changes
                </button>
            </div>
        </form>
    </div>
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
            editedMusic: { ...this.music }, // Clone the original music object to avoid direct mutation
        };
    },
    methods: {
        handleEditMusic() {
            this.$emit("edit-music", { ...this.editedMusic });
        },
    },
};
</script>

<style scoped>
.edit-music {
    background-color: #f9f9f9;
}
</style>
