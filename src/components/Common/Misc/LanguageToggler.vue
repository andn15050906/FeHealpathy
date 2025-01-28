<template>
    <button class="language-selector" @click="toggleLang">
        <img :src="selectedLang.icon" alt="alt" class="lang-icon" />
        <span>{{ selectedLang.lang }}</span>
    </button>
</template>

<script>
const langProps = [
    { lang: 'en', icon: '/assets/images/en-flag-32x48.png' },
    { lang: 'vi', icon: '/assets/images/vi-flag-32x48.png' }
];

export default {
    name: 'LanguageToggler',
    data() {
        return {
            selectedLang: langProps[0]
        }
    },
    methods: {
        toggleLang() {
            this.selectedLang = JSON.stringify(this.selectedLang) == JSON.stringify(langProps[0])
                ? langProps[1]
                : langProps[0];
        }
    }
}
</script>

<style scoped>
.language-selector span {
    width: 20px;
}
</style>