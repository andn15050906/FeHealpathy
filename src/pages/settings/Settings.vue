<template>
  <div class="settings-container">
    <h1 class="page-title">Settings</h1>
    
    <!-- Theme Settings -->
    <div class="settings-section">
      <h3>Theme</h3>
      <ThemeSwitcher />
    </div>

    <!-- Language Settings -->
    <div class="settings-section">
      <h3>General preferences</h3>
      <LanguageSwitcher />
    </div>

    <!-- Notifications -->
    <div class="settings-section">
      <h3>Notifications</h3>
      <Notifications />
    </div>
  </div>
</template>

<script lang="ts" setup>
import LanguageSwitcher from './language-switcher/LanguageSwitcher.vue'
import ThemeSwitcher from './theme-switcher/ThemeSwitcher.vue'
import Notifications from './notifications/Notifications.vue'
</script>

<style scoped>
.settings-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.settings-section {
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
}
</style>
