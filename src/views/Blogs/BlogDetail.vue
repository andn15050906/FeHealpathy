<template>
  <div class="blog-layout">
    <main class="main-content">
      <HeroImg />
      <BlogMeta />
      <div style="display: flex;">
        <BlogContent />
      </div>
    </main>
    <ScrollToTop />
  </div>
</template>

<script>
import HeroImg from '../../components/Helper/HeroImg.vue'
import BlogMeta from '../../components/BlogComponents/BlogMeta.vue'
import BlogContent from '../../components/BlogComponents/BlogContent.vue'
import ScrollToTop from '../../components/Misc/ScrollToTop.vue'

export default {
  name: 'BlogLayout',
  components: {
    HeroImg,
    BlogMeta,
    BlogContent,
    ScrollToTop
  }
}
</script>

<style scoped>
.blog-layout {
  background-color: #fff;
  min-height: 100vh;
  display: flex;
  flex-direction: column;

  width: 70%;
}

.main-content {
  flex: 1;
}
</style>