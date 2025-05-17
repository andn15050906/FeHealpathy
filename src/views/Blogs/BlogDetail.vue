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
          <div class="d-flex" style="justify-content: center;">
            <img v-if="section.media" :src="section.media.url" :alt="section.media.title"
              class="img-fluid rounded mb-3" style="max-width: 600px;" />
          </div>
          <p class="text-secondary">{{ section.content }}</p>
        </div>
        <BlogCommentSection :blogId="blog.id" :currentUserId="currentUserId" class="mb-5" />
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
import { getUserProfile } from "@/scripts/api/services/authService";
import apiClient from '@/scripts/api/apiClients';
import { getPagedBlogComments } from "@/scripts/api/services/commentService";

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
      currentUserId: null,
    };
  },
  async created() {
    const userProfile = getUserProfile();
    this.currentUserId = userProfile?.id;
    await this.fetchBlogData();
  },
  methods: {
    async fetchBlogData() {
      try {
        const blogId = this.$route.params.id;
        this.blog = await getBlogById(blogId);

        if (!this.blog) {
          console.error("Không tìm thấy bài viết với ID:", blogId);
        } else {
          if (this.currentUserId)
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
<style scoped>
.container {
  width: 72vw;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.card {
  border-radius: 20px;
  overflow: hidden;
  background: #fff;
  transition: all 0.3s ease;
}

.card-img-top {
  width: 100%;
  height: 400px;
  object-fit: cover;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.card-body {
  padding: 40px;
}

h1 {
  font-size: 2.5rem;
  font-weight: 800;
  color: #1a3e6f;
  line-height: 1.3;
  margin-bottom: 1.5rem;
  font-family: 'Poppins', sans-serif;
  letter-spacing: -0.02em;
}

.badge {
  padding: 8px 16px;
  font-size: 0.9rem;
  font-weight: 500;
  border-radius: 20px;
  background: linear-gradient(135deg, #3b82f6, #60a5fa);
  color: white;
  margin: 0 8px 8px 0;
  transition: all 0.3s ease;
}

.badge:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
}

.btn {
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.btn-primary {
  background: linear-gradient(135deg, #3b82f6, #60a5fa);
  border: none;
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
}

.btn-danger {
  background: linear-gradient(135deg, #ef4444, #f87171);
  border: none;
  color: white;
}

.btn-danger:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2);
}

.mb-5 {
  margin-bottom: 3rem;
}

h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a3e6f;
  margin-bottom: 1.5rem;
  font-family: 'Poppins', sans-serif;
  letter-spacing: -0.01em;
}

.img-fluid {
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.img-fluid:hover {
  transform: scale(1.02);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

.text-secondary {
  color: #4a5568 !important;
  font-size: 1.1rem;
  line-height: 1.8;
  letter-spacing: 0.01em;
}

@media (max-width: 768px) {
  .container {
    width: 100%;
    padding: 0 20px;
  }

  .card-body {
    padding: 20px;
  }

  h1 {
    font-size: 2rem;
  }

  .card-img-top {
    height: 300px;
  }

  .btn {
    padding: 10px 20px;
    font-size: 0.9rem;
  }
}
</style>