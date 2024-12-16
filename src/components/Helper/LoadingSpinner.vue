<template>
    <div v-if="show" class="spinner-container">
        <div class="spinner"></div>
    </div>
</template>

<script>
export default {
    name: 'LoadingSpinner',
    data() {
        return {
            show: false,
        };
    },
    methods: {
        showSpinner() {
            this.show = true;
        },
        hideSpinner() {
            this.show = false;
        },
    },
};
</script>

<style scoped>
.spinner-container {
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.15);
    z-index: 9999;
}

.spinner {
    width: 60px;
    height: 60px;
    border: 8px solid rgba(0, 0, 0, 0.1);
    border-top: 8px solid #dc3545;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}
</style>