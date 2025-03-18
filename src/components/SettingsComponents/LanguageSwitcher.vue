<template>
  <div class="language-switcher">
    <h3 class="section-title">Language Settings</h3>
    <div class="language-select">
      <v-select v-model="model" :items="options" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
type LanguageMap = Record<string, string>
const { locale } = useI18n()
const languageCodes: LanguageMap = { en: 'English', vn: 'Tiếng Việt' }
const languageName: LanguageMap = Object.fromEntries(Object.entries(languageCodes).map(([k, v]) => [v, k]))
const options = Object.values(languageCodes)
const model = computed({
  get() {
    return languageCodes[locale.value]
  },
  set(value) {
    locale.value = languageName[value]
  }
})
</script>

<style scoped>
.language-switcher {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.section-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.language-label {
  font-size: 14px;
  color: #333;
}

.language-select {
  width: 220px;
}

.v-select {
  width: 100%;
}
</style>
