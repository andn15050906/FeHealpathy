<template>
  <div class="blog-detail-container">
    <h1 class="blog-title" v-if="blog">{{ blog.title }}</h1>
    <p v-else>Đang tải...</p>


    <div v-if="blog && blog.thumb" class="hero-image">
    <img :src="blog.thumb.url" :alt="blog.thumb.title" />
</div>


    <div v-if="blog && blog.tags" class="keywords">
      <span v-for="tag in blog.tags" :key="tag.id" class="tag">#{{ tag.title }}</span>
    </div>

    <div class="actions">
      <button @click="likeBlog" class="btn like">
        👍 Thích ({{ likes }})
      </button>
      <button @click="shareBlog" class="btn share">
        📤 Chia sẻ
      </button>
    </div>

    <div  v-if="blog && blog.sections && blog.sections.length" class="blog-content">
      <div v-for="(section, index) in sortedSections" :key="index" class="section">
        <h2 class="section-title">{{ section.header }}</h2>
        <div v-if="section.media" class="section-image">
          <img :src="section.media.url" :alt="section.media.title" />
        </div>
        <p class="section-text">{{ section.content }}</p>
      </div>
    </div>

    <div class="divider"></div>

    <BlogCommentSection v-if="blog" :blogId="blog.id" />

    <div class="divider"></div>

    <BlogRelatedItems v-if="blog" :currentBlogId="blog.id" />

    <ScrollToTop />
  </div>
</template>

<script>
import ScrollToTop from "@/components/Common/Misc/ScrollToTop.vue";
import BlogRelatedItems from "@/components/BlogComponents/BlogRelatedItems.vue";
import BlogCommentSection from "@/components/BlogComponents/BlogCommentSection.vue";
import { getBlogById } from "@/scripts/api/services/blogService";

export default {
  components: {
    ScrollToTop,
    BlogRelatedItems,
    BlogCommentSection,
  },
  data() {
    return {
      blog: null,
      loading: true,
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

        this.loading = false;
      } catch (error) {
        console.error("Lỗi khi tải blog:", error);
        this.loading = false;
      }
    },
    likeBlog() {
      this.likes += 1;
    },
    shareBlog() {
      const url = window.location.href;
      navigator.clipboard.writeText(url);
      alert("📢 Đã sao chép link bài viết: " + url);
    },
  },
  computed: {
  sortedSections() {
    return [...this.blog.sections].sort((a, b) => {
      const numA = parseInt(a.header.match(/^\d+/)?.[0] || "0", 10);
      const numB = parseInt(b.header.match(/^\d+/)?.[0] || "0", 10);
      return numA - numB;
    });
  }
}
};
</script>

<style scoped>
/* 📌 Bố cục tổng thể */
.blog-detail-container {
  font-family: "Poppins", sans-serif;
  line-height: 1.8;
  margin: 40px auto;
  max-width: 800px;
  color: #333;
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

/* 📌 Tiêu đề bài viết */
.blog-title {
  font-size: 2.8em;
  font-weight: bold;
  text-align: center;
  color: #2d3436;
  margin: 30px 0 20px 0;
}

/* 📌 Ảnh đại diện blog */
.hero-image img {
  width: 100%;
  max-height: 450px;
  object-fit: cover;
  border-radius: 10px;
  display: block;
  margin: 0 auto;
}

/* 📌 Tags (dưới ảnh đại diện) */
.keywords {
  text-align: center;
  margin: 20px 0;
  font-size: 10px;
}

.tag {
  display: inline-block;
  background: #f3f3f3;
  color: #555;
  padding: 6px 12px;
  border-radius: 15px;
  font-size: 0.9em;
  margin-right: 5px;
}

/* 📌 Nút Like & Share */
.actions {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 20px;
}

.btn {
  padding: 12px 20px;
  border: none;
  border-radius: 25px;
  font-size: 1em;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s, transform 0.2s;
}

.btn:hover {
  transform: translateY(-2px);
}

/* Like */
.like {
  background-color: #ff6868;
  color: white;
}

.like:hover {
  background-color: #ff4d4d;
}

/* Share */
.share {
  background-color: #68a0ff;
  color: white;
}

.share:hover {
  background-color: #4d8cff;
}

/* 📌 Nội dung bài viết */
.blog-content {
  margin-top: 20px;
}

/* 📌 Tiêu đề từng phần */
.section-title {
  font-size: 1.8em;
  font-weight: bold;
  color: #2c3e50;
  margin-top: 30px;
}

/* 📌 Ảnh từng phần */
.section-image img {
  display: block;
  width: 100%;
  max-height: 350px;
  object-fit: cover;
  margin: 10px auto;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* 📌 Nội dung từng phần */
.section-text {
  font-size: 1.1em;
  color: #444;
  line-height: 1.8;
  margin-top: 15px;
  white-space: pre-line;
}

/* 📌 Ngăn cách giữa các phần */
.divider {
  border-top: 1px solid #ddd;
  margin: 30px 0;
}

/* 📌 Căn chỉnh bình luận & bài viết liên quan */
.blogcomment, .blogrelated {
  margin-top: 30px;
  padding: 15px;
  border-radius: 10px;
  background: #f9f9f9;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}
</style>
