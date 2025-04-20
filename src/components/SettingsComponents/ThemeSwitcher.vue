<template>
  <div class="theme-switcher">
    <h3 class="section-title">Cài đặt chủ đề</h3>
    <div class="theme-toggle">
      <va-button-toggle v-model="currentTheme" :options="options" color="primary" @change="toggleTheme" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useTheme } from 'vuetify'

const theme = useTheme()
const currentTheme = ref('light')
const options = [
  { label: 'Light', value: 'light' },
  { label: 'Dark', value: 'dark' }
]
const toggleTheme = () => {
  theme.global.name.value = currentTheme.value
  document.body.setAttribute('data-theme', currentTheme.value)
}
onMounted(() => {
  currentTheme.value = theme.global.name.value
})
</script>

<style scoped>
.theme-switcher {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.section-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

</style>
