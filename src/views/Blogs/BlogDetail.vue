<template>
  <div class="blog-detail">
    <button class="back-button" @click="goBack">← Quay lại</button>
    <h1 class="title">Start the new year on the right foot with 'Just One Step' — a 30-day New Year Reset for your wellbeing</h1>
    <p class="category">Meditation & Mindfulness</p>
    <HeroImg />

    <div class="actions">
      <button @click="likeExercise" class="btn like">Like</button>
      <button @click="shareExercise" class="btn share">Share</button>
    </div>
    <div class="divider"></div>
    <div class="blogmeta">
      <p>
        <BlogMeta />
      </p>
    </div>
    <div class="divider"></div>
    <div class="blogdescription">
      <ul>
        <BlogDescription />
      </ul>
    </div>
    <div class="divider"></div>
    <div class="blogcomment">
      <ul>
        <BlogComment />
      </ul>
    </div>
    <div class="divider"></div>
    <div class="blogrelated">
      <ul>
        <BlogRelated />
      </ul>
    </div>
  </div>
</template>

<script>
import HeroImg from '../../components/Helper/HeroImg.vue'
import BlogMeta from '../../components/BlogComponents/BlogMeta.vue'
import ScrollToTop from '../../components/Misc/ScrollToTop.vue'
import BlogRelated from '@/components/BlogComponents/BlogRelated.vue'
import BlogComment from '@/components/BlogComponents/BlogComment.vue';
import BlogDescription from '@/components/BlogComponents/BlogDescription.vue';

export default {
  name: "BlogDetail",
  methods: {
    goBack() {
      this.$router.go(-1);
    },
  },
  components: {
    HeroImg,
    BlogMeta,
    BlogRelated,
    BlogComment,
    BlogDescription,
    ScrollToTop
  }
};
</script>

<style scoped>
.blog-detail {
  font-family: "Poppins", Arial, sans-serif;
  line-height: 1.8;
  margin: 60px auto;
  max-width: 900px;
  color: #333;
}

.title {
  font-size: 2.5em;
  margin-bottom: 10px;
  text-align: center;
  color: #4caf50;
}

.category {
  color: #777;
  margin-bottom: 20px;
  text-align: center;
  font-style: italic;
}

.video-container {
  margin-bottom: 20px;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.video {
  width: 100%;
  height: 400px;
}

.actions {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 20px;
}

.btn {
  padding: 10px 25px;
  border: none;
  border-radius: 25px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
}

.btn:hover {
  transform: translateY(-2px);
}

.like {
  background-color: #ff6868;
  color: white;
}

.like:hover {
  background-color: #ff4d4d;
}

.share {
  background-color: #68a0ff;
  color: white;
}

.share:hover {
  background-color: #4d8cff;
}

.divider {
  border-top: 1px solid #ddd;
  margin: 30px 0;
}

.blogmeta,
.blogdescription,
.blogcomment,
.blogrelated {
  background-color: #f9f9f9;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.exercise-item:hover {
  transform: scale(1.05);
}

</style>


<!-- <template>
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
</style> -->
