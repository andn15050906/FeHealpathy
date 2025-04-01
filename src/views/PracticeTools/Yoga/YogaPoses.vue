<template>
    <div class="container mt-5">
        <h2 class="mb-4" style="font-weight: bold;">Yoga Poses</h2>
        <div class="row">
            <div class="col-12">
                <div v-for="(pose, index) in yogaPoses" :key="index"
                    class="pose-row d-flex justify-content-between align-items-center mb-3 p-3 shadow-sm hover-row">
                    <div class="d-flex align-items-center">
                        <span class="pose-name">{{ pose.name }}</span>
                    </div>
                    <router-link :to="pose.detailsLink" class="btn btn-outline-primary btn-sm">
                        Details <i class="fas fa-chevron-right ml-1"></i>
                    </router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "YogaMoocList",
    data() {
        return {
            yogaPoses: [
                {
                    name: "Downward Dog",
                    detailsLink: "/yoga/details",
                    modelEmbedUrl:
                        "https://sketchfab.com/models/47ec52a6f51a4a81852c26d063ab67e1/embed"
                },
                {
                    name: "Warrior I",
                    detailsLink: "/yoga/details",
                    modelEmbedUrl:
                        "https://sketchfab.com/models/47ec52a6f51a4a81852c26d063ab67e1/embed"
                },
                {
                    name: "Tree Pose",
                    detailsLink: "/yoga/details",
                    modelEmbedUrl:
                        "https://sketchfab.com/models/47ec52a6f51a4a81852c26d063ab67e1/embed"
                },
                {
                    name: "Cobra Pose",
                    detailsLink: "/yoga/details",
                    modelEmbedUrl:
                        "https://sketchfab.com/models/47ec52a6f51a4a81852c26d063ab67e1/embed"
                },
                {
                    name: "Child's Pose",
                    detailsLink: "/yoga/details",
                    modelEmbedUrl:
                        "https://sketchfab.com/models/47ec52a6f51a4a81852c26d063ab67e1/embed"
                },
                {
                    name: "Seated Forward Bend",
                    detailsLink: "/yoga/details",
                    modelEmbedUrl:
                        "https://sketchfab.com/models/47ec52a6f51a4a81852c26d063ab67e1/embed"
                },
                {
                    name: "Bridge Pose",
                    detailsLink: "/yoga/details",
                    modelEmbedUrl:
                        "https://sketchfab.com/models/47ec52a6f51a4a81852c26d063ab67e1/embed"
                },
                {
                    name: "Camel Pose",
                    detailsLink: "/yoga/details",
                    modelEmbedUrl:
                        "https://sketchfab.com/models/47ec52a6f51a4a81852c26d063ab67e1/embed"
                },
                {
                    name: "Pigeon Pose",
                    detailsLink: "/yoga/details",
                    modelEmbedUrl:
                        "https://sketchfab.com/models/47ec52a6f51a4a81852c26d063ab67e1/embed"
                },
                {
                    name: "Plank Pose",
                    detailsLink: "/yoga/details",
                    modelEmbedUrl:
                        "https://sketchfab.com/models/47ec52a6f51a4a81852c26d063ab67e1/embed"
                }
            ]
        };
    }
};
</script>

<style scoped>
.pose-row {
    background-color: #fff;
    border-radius: 5px;
    transition: background-color 0.3s ease, transform 0.3s ease;
}

.hover-row:hover {
    background-color: #f8f9fa;
    transform: translateY(-3px);
}

.pose-name {
    font-size: 1.5rem;
    font-weight: bold;
}

.mr-3 {
    margin-right: 1rem;
}

.ml-1 {
    margin-left: 0.25rem;
}
</style>