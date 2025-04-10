<template>
  <div class="container my-2">
    <div v-if="blog" class="card border-0 shadow-sm">
      <img v-if="blog.thumb" :src="blog.thumb.url" :alt="blog.thumb.title" class="card-img-top" />
      <div class="card-body">
        <h1 class="fw-bold text-center mb-4 text-dark">{{ blog.title }}</h1>
        <div class="mb-3 text-center">
          <span v-for="tag in blog.tags" :key="tag.id" class="badge bg-secondary me-1">
            #{{ tag.title }}
          </span>
        </div>
        <div class="d-flex justify-content-center gap-3 mb-4">
          <!--<button @click="likeBlog" class="btn btn-danger">
            <i class="fas fa-thumbs-up me-2"></i>
            Likes ({{ likes }})
          </button>-->
          <button @click="shareBlog" class="btn btn-primary">
            <i class="fas fa-share-alt me-2"></i>
            Share
          </button>
        </div>
        <div v-for="(section, index) in sortedSections" :key="index" class="mb-5">
          <h2 class="h5 fw-bold mb-3">{{ section.header }}</h2>
          <img v-if="section.media" :src="section.media.url" :alt="section.media.title"
            class="img-fluid rounded mb-3" />
          <p class="text-secondary">{{ section.content }}</p>
        </div>
        <BlogCommentSection :blogId="blog.id" class="mb-5" />
        <BlogRelatedItems />
      </div>
      <ScrollToTop />
    </div>
    <p v-else class="text-center">Đang tải...</p>
  </div>
</template>

<script>
import ScrollToTop from "@/components/Common/Misc/ScrollToTop.vue";
import BlogRelatedItems from "@/components/BlogComponents/BlogRelatedItems.vue";
import BlogCommentSection from "@/components/BlogComponents/BlogCommentSection.vue";
import { getBlogById } from "@/scripts/api/services/blogService";
import { logArticleRead } from "@/scripts/api/services/activityLogService";

export default {
  components: {
    ScrollToTop,
    BlogRelatedItems,
    BlogCommentSection,
  },
  data() {
    return {
      blog: null,
      likes: 0,
    };
  },
  async created() {
    await this.fetchBlogData();
  },
  methods: {
    async fetchBlogData() {
      try {
        const blogId = this.$route.params.id;
        this.blog = await getBlogById(blogId);

        if (!this.blog) {
          console.error("Không tìm thấy bài viết với ID:", blogId);
        }
        else {
          logArticleRead(blogId);
        }

        this.loading = false;
      } catch (error) {
        console.error(error);
      }
    },
    likeBlog() {
      this.likes += 1;
    },
    shareBlog() {
      navigator.clipboard.writeText(window.location.href);
      alert(`Đã sao chép link bài viết: ${window.location.href}`);
    },
  },
  computed: {
    sortedSections() {
      return [...(this.blog?.sections || [])].sort((a, b) => {
        const numA = parseInt(a.header.match(/^\d+/)?.[0] || "0", 10);
        const numB = parseInt(b.header.match(/^\d+/)?.[0] || "0", 10);
        return numA - numB;
      });
    },
  },
};
</script>