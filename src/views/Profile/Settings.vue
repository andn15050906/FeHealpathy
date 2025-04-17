<template>
  <div class="settings-page">
    <div class="settings-main">
      <h1 class="page-title">Tùy chỉnh cài đặt</h1>
      <div class="settings-group">
        <ThemeSwitcher />
      </div>
      <div class="settings-group">
        <LanguageSwitcher />
      </div>
      <div class="settings-group">
        <Notifications />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import ThemeSwitcher from '../../components/SettingsComponents/ThemeSwitcher.vue'
import LanguageSwitcher from '../../components/SettingsComponents/LanguageSwitcher.vue'
import Notifications from '../../components/SettingsComponents/NotificationSettings.vue'
</script>

<style scoped>
.settings-page {
  display: flex;
  gap: 24px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}
.settings-main {
  flex: 1;
}
.page-title {
  font-size: 24px;
  margin-bottom: 24px;
}
.settings-group {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
