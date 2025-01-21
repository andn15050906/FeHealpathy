<template>
  <div class="theme-switcher">
    <va-button-toggle
      v-model="currentTheme"
      :options="options"
      color="primary"
      @change="toggleTheme"
    />
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
  margin: 10px 0;
  display: flex;
  justify-content: center;
}
</style>
