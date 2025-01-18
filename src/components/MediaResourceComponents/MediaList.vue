<template>
    <div>
        <div v-if="!showAddMusic && !showEditMusic">
            <h3 class="p-2">{{ mood.name }} - File List</h3>
            <button class="btn btn-primary mb-3" @click="toggleAddMusic">
                <i class="fas fa-plus me-1"></i> Add Music
            </button>
            <ul class="list-group mt-3">
                <li v-for="(file, index) in mood.files" :key="index"
                    class="list-group-item d-flex justify-content-between align-items-center">
                    <span><strong>{{ file.name }}</strong> <i>{{ file.url }}</i></span>
                    <div>
                        <button class="btn btn-secondary btn-sm" @click="editMusic(file, index)">
                            <i class="fas fa-edit me-1"></i> Edit
                        </button>
                        <button class="btn btn-danger btn-sm mx-2" @click="handleDelete(index)">
                            <i class="fas fa-trash me-1"></i> Delete
                        </button>
                    </div>
                </li>
            </ul>
            <button class="btn btn-secondary mt-3" @click="$emit('back')">
                <i class="fas fa-arrow-left me-1"></i> Back
            </button>
        </div>
        <AddMusic v-if="showAddMusic" @add-music="addMusic" @cancel="toggleAddMusic" />
        <EditMusic v-if="showEditMusic" :music="selectedMusic" @edit-music="updateMusic" @cancel="toggleEditMusic" />
    </div>
</template>

<script>
import AddMusic from './AddMusic.vue';
import EditMusic from './EditMusic.vue';

export default {
    components: {
        AddMusic,
        EditMusic,
    },
    props: {
        mood: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            showAddMusic: false,
            showEditMusic: false,
            selectedMusic: null,
            selectedMusicIndex: null,
        };
    },
    methods: {
        toggleAddMusic() {
            this.showAddMusic = !this.showAddMusic;
        },
        toggleEditMusic() {
            this.showEditMusic = !this.showEditMusic;
        },
        addMusic(newMusic) {
            this.mood.files.push(newMusic);
            this.showAddMusic = false;
        },
        editMusic(music, index) {
            this.selectedMusic = { ...music };
            this.selectedMusicIndex = index;
            this.showEditMusic = true;
        },
        updateMusic(updatedMusic) {
            if (this.selectedMusicIndex !== null) {
                this.$set(this.mood.files, this.selectedMusicIndex, updatedMusic);
            }
            this.showEditMusic = false;
        },
        handleDelete(index) {
            this.$emit("delete-file", index);
        },
    },
};
</script>

<style scoped>
.list-group-item {
    font-size: 0.9rem;
}
</style>
