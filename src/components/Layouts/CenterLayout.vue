<template>
  <div :class="['outer-container', layoutMode]">
    <div :style="wrapperStyle">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  layoutMode: {
    type: String,
    default: 'full-width'
  }
});

const wrapperStyle = computed(() => {
  if (props.layoutMode === 'full-width') {
    return {
      width: '100%',
      maxWidth: 'none',
      boxShadow: 'none',
      borderRadius: '0'
    };
  }
  return {
    width: '100%',
    maxWidth: '800px',
    background: '#ffffff',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2), 0 4px 12px rgba(0, 0, 0, 0.1)',
    borderRadius: '20px',
    padding: '30px 40px',
    marginTop: '40px',
    marginBottom: '60px'
  };
});
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

.outer-container.centered {
  display: flex;
  justify-content: center;
  align-items: center;
}

.outer-container.full-width {
  padding: 0;
  justify-content: flex-start;
  align-items: flex-start;
}
</style>