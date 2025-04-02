<template>
    <div class="container pose-details" v-if="pose">
        <div class="mb-3">
            <router-link to="/yoga/poses" class="btn btn-outline-secondary">
                <i class="fas fa-arrow-left mr-2"></i>Back to Poses
            </router-link>
        </div>
        <h2 class="text-center mb-2" style="font-weight: bold;">{{ pose.name }}</h2>
        <p class="text-center mute mb-4">{{ pose.level }}</p>

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
        <div class="pose-details-info d-flex flex-column gap-3">
            <div class="card shadow p-4">
                <h4 class="text-dark fw-bold mb-3">Exercise Description</h4>
                <p class="text-muted">{{ pose.description }}</p>
            </div>
            <div class="card shadow p-4">
                <h4 class="text-dark fw-bold mb-3">Equipment Required</h4>
                <ul class="list-unstyled mb-0">
                    <li class="d-flex align-items-center">
                        <i class="fas fa-check-circle text-success me-2"></i>
                        <span class="text-muted">{{ pose.equipmentRequirement }}</span>
                    </li>
                </ul>
            </div>
        </div>
    </div>
    <div v-else class="text-center mt-5">
        <p>Loading pose details...</p>
    </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { getPagedYogaPoses } from "../../../scripts/api/services/yogaService";

export default {
    name: "YogaPoseDetails",
    setup() {
        const route = useRoute();
        const pose = ref(null);
        const selectedOption = ref("model");

        const currentEmbedUrl = computed(() => {
            if (!pose.value) return "";
            return selectedOption.value === "model" ? pose.value.embeddedUrl : pose.value.videoUrl;
        });

        const selectOption = (option) => {
            selectedOption.value = option;
        };

        const loadPoseDetails = async () => {
            try {
                const id = route.params.id;
                console.log("Pose ID:", id);
                const response = await getPagedYogaPoses({ Id: id });
                console.log("Pose Details Response:", response.items);
                if (response.items && response.items.length > 0) {
                    pose.value = response.items[0];
                }
            } catch (error) {
                console.error("Error loading pose details:", error);
            }
        };

        onMounted(() => {
            loadPoseDetails();
        });

        return { pose, selectedOption, currentEmbedUrl, selectOption };
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

.pose-details-info {
    max-width: 100%;
    margin: 0 auto;
}

.card {
    border-radius: 10px;
    border: none;
}

.fw-bold {
    font-weight: bold;
}

.text-muted {
    font-size: 1rem;
    line-height: 1.6;
}
</style>