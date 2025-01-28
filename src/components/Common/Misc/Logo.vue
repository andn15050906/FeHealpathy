<template>
    <router-link to="/" class="logo-link" :style="{ height: height + 'px' }">
        <img loading="lazy" src="../../../../public/assets/images/logo.png" alt="Logo" class="logo" />
    </router-link>
</template>

<script>
export default {
    name: 'Logo',
    props: {
        height: Number
    }
}
</script>

<style scoped>
.logo-link {
    display: flex;
    align-items: center;
}

.logo-link img {
    height: 100%;
}
</style>