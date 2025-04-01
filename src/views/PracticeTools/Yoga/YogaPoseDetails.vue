<template>
    <div class="container pose-details mt-5">
        <div class="mb-3">
            <router-link to="/yoga/poses" class="btn btn-outline-secondary">
                <i class="fas fa-arrow-left mr-2"></i>Back to Poses
            </router-link>
        </div>
        <h2 class="text-center mb-4" style="font-weight: bold;">{{ poseName }}</h2>
        <div class="text-center mb-4">
            <button class="btn btn-outline-secondary mr-2" :class="{ active: selectedOption === 'model' }"
                @click="selectOption('model')">
                <i class="fas fa-cube mr-1"></i> 3D Model
            </button>
            <button class="btn btn-outline-secondary" :class="{ active: selectedOption === 'video' }"
                @click="selectOption('video')">
                <i class="fas fa-video mr-1"></i> Video
            </button>
        </div>
        <div class="embed-responsive mb-4">
            <iframe class="embed-responsive-item" :src="currentEmbedUrl" frameborder="0"
                allow="autoplay; fullscreen; vr" mozallowfullscreen="true" webkitallowfullscreen="true"></iframe>
        </div>
        <div class="card shadow-sm p-3 mb-4">
            <h4 style="font-weight: 600;">Exercise Description</h4>
            <p>
                Yoga offers many benefits for physical, mental, and overall health. Yoga exercises help improve
                flexibility, reduce stress, and enhance quality of life.
            </p>
        </div>
        <div class="card shadow-sm p-3 mb-4">
            <h4 style="font-weight: 600;">Equipment Required</h4>
            <ul class="list-unstyled mb-0">
                <li><i class="fas fa-check-circle text-success"></i> No equipment required</li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    name: "YogaPoseDetails",
    data() {
        return {
            poseName: "Downward Dog",
            modelEmbedUrl: "https://sketchfab.com/models/47ec52a6f51a4a81852c26d063ab67e1/embed",
            videoEmbedUrl: "https://www.youtube.com/embed/v7AYKMP6rOE",
            selectedOption: "model"
        };
    },
    computed: {
        currentEmbedUrl() {
            return this.selectedOption === "model" ? this.modelEmbedUrl : this.videoEmbedUrl;
        }
    },
    methods: {
        selectOption(option) {
            this.selectedOption = option;
        }
    }
};
</script>

<style scoped>
.pose-details {
    margin: 0 auto;
    padding: 0 15px;
}

iframe {
    width: 100%;
    height: 600px;
    border: none;
}

.embed-responsive {
    border-radius: 5px;
}

.btn.active {
    background-color: #6c757d;
    color: white;
}

.mr-1 {
    margin-right: 0.25rem;
}

.mr-2 {
    margin-right: 0.5rem;
}
</style>