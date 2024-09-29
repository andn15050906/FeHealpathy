<template>
    <div class="outer-container">
        <div class="content-wrapper">
            <slot></slot>
        </div>
    </div>
</template>

<script setup>
</script>

<style scoped>
.outer-container {
    min-height: calc(100vh - 180px);
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 60px 20px;
    box-sizing: border-box;
}

.content-wrapper {
    width: 100%;
    max-width: 800px;
    background: #ffffff;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2), 0 4px 12px rgba(0, 0, 0, 0.1);
    border-radius: 20px;
    padding: 30px 40px;
    margin-top: 40px;
    margin-bottom: 60px;
}
</style>