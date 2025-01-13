<script lang="ts" setup>
</script>

<template>
  <div class="flex flex-col justify-center items-center h-screen bg-[var(--va-background-secondary)]">

    <div class="flex flex-col items-center gap-6 px-4 my-8 text-center">
    
      <h1 class="va-h1 sm:text-5xl text-4xl">Page not found</h1>

      <p>
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>

      <RouterLink to="/" class="va-button va-button--primary">
        Go to homepage
      </RouterLink>

    </div>
    
  </div>
</template>

<style>
html, body {
  height: 100%;
  margin: 0;
}

.h-screen {
  height: 100vh; 
}

.flex {
  display: flex;
}

.flex-col {
  flex-direction: column;
}

.justify-center {
  justify-content: center;
}

.items-center {
  align-items: center;
}

.text-center {
  text-align: center;
}

.va-button {
  text-align: center;
  padding: 0.5rem 1rem; 
}

.gap-6 {
  gap: 1.5rem; 
}

.my-8 {
  margin-top: 2rem;
  margin-bottom: 2rem;
}

.px-4 {
  padding-left: 1rem;
  padding-right: 1rem;
}
</style>
