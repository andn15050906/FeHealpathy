<template>
    <div>
        <div class="row mt-4">
            <div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-3" v-for="(mood, index) in moods" :key="index">
                <div class="card shadow border-0 folder-card" @click="$emit('select-mood', index)">
                    <div class="card-body text-center">
                        <i :class="mood.icon + ' fa-4x mb-3'"></i>
                        <h5 class="card-title text-truncate">
                            {{ mood.name }} ({{ mood.files.length }} files)
                        </h5>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    props: {
        moods: {
            type: Array,
            required: true,
        },
    },
    methods: {
        addMood(newMood) {
            this.$emit("add-mood", newMood);
        },
    },
};
</script>

<style scoped>
.folder-card {
    transition: transform 0.2s, box-shadow 0.2s;
    cursor: pointer;
}

.folder-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

.card-title {
    font-size: 1rem;
    font-weight: 500;
}
</style>
