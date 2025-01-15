<template>
  <article class="blog-content">
    <div>
      <div v-html="content"></div>
    </div>
  </article>
</template>

<script>
import MockApi from '@/api/MockApi';

export default {
  name: 'BlogContent',
  data() {
    return {
      content: MockApi.getBlogContent(1)
    }
  },
}
</script>

<style scoped>
.blog-content {
  margin: 0 auto;
  padding: 40px 0;
}

@media (max-width: 1000px) {
  .blog-content {
    padding: 20px;
  }
}
</style>