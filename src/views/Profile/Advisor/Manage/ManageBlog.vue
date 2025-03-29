<template>
  <div v-if="!isEditingBlog">
    <div class="blog-management">
      <h1 class="title"><i class="fas fa-edit"></i> Blog Management</h1>
      <div class="header-actions">
        <router-link to="/blogs/create">
          <button class="btn btn-success create-blog-btn">
            <i class="fas fa-plus"></i> Create Blog
          </button>
        </router-link>
      </div>
      <div class="blog-list">
        <div class="card blog-item mb-3" v-for="blog in blogs" :key="blog.id">
          <div class="row g-0 h-100">
            <div class="col-md-3 d-flex">
              <img :src="blog.thumb?.url || 'https://placehold.co/16x9'" :alt="blog.title"
                class="img-fluid rounded thumbnail" />
            </div>
            <div class="col-md-9">
              <div class="card-body blog-details d-flex flex-column h-100">
                <h5 class="card-title blog-title">{{ blog.title }}</h5>
                <p class="card-text blog-date text-muted">
                  <small>Published: {{ formattedDate(blog.creationTime) }}</small>
                </p>
                <div class="actions mt-auto">
                  <button class="btn btn-warning edit me-2" @click="editBlog(blog)">
                    <i class="fas fa-pencil-alt"></i> Edit
                  </button>
                  <button class="btn btn-danger delete" @click="openDeletePopup(blog)">
                    <i class="fas fa-trash-alt"></i> Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <p v-if="blogs.length === 0" class="no-blogs alert alert-info text-center">No blogs have been published yet!</p>
    </div>
  </div>
  <UpdateBlog v-if="isEditingBlog" :blogData="selectedBlog" @blogUpdated="handleBlogUpdated" />

  <DeleteConfirmPopup :message="'Delete this blog?'" :isVisible="isDeletePopupVisible"
    @confirmDelete="handleDeleteConfirm" @update:isVisible="isDeletePopupVisible = $event" />
</template>

<script>
import moment from 'moment';
import { getPagedArticles, deleteArticle } from '@/scripts/api/services/blogService';
import UpdateBlog from './UpdateBlog.vue';
import DeleteConfirmPopup from '@/components/Common/Popup/DeleteConfirmPopup.vue';
export default {
  components: { UpdateBlog, DeleteConfirmPopup },
  name: "BlogManagement",
  data() {
    return {
      blogs: [],
      isEditingBlog: false,
      selectedBlog: null,
      isDeletePopupVisible: false,
      blogToDelete: null,
    };
  },
  methods: {
    formattedDate(value) {
      return moment(String(value)).format('MM/DD/YYYY hh:mm')
    },
    async fetchBlogs() {
      try {
        const data = await getPagedArticles();
        if (data.items && data.items.length > 0) {
          this.blogs = data.items;
          console.log(data);
        } else {
          this.blogs = [];
          this.errorMessage = "No blogs yet!";
        }
      } catch (error) {
        this.blogs = [];
        this.errorMessage = "Error loading blog data. Please try again.";
        console.error(error);
      } finally {
        this.loading = false;
      }
    },

    openDeletePopup(blog) {
      this.blogToDelete = blog;
      this.isDeletePopupVisible = true;
    },

    async handleDeleteConfirm(confirm) {
      if (confirm && this.blogToDelete) {
        try {
          await deleteArticle(this.blogToDelete.id);
          this.fetchBlogs();
        } catch (error) {
          alert("Error deleting blog. Please try again.");
          console.error(error);
        } finally {
          this.isDeletePopupVisible = false;
          this.blogToDelete = null;
        }
      } else {
        this.isDeletePopupVisible = false;
      }
    },
    editBlog(blog) {
      this.selectedBlog = blog;
      this.isEditingBlog = true;
    },
    handleBlogUpdated() {
      this.isEditingBlog = false;
      this.selectedBlog = null;
    },
  },
  mounted() {
    this.fetchBlogs();
  }
};
</script>

<style scoped>
.blog-management {
  max-width: 100%;
  background: #fff;
  border-radius: 10px;
  padding: 20px 30px;
}

.title {
  text-align: center;
  font-size: 2rem;
  color: #333;
  margin-bottom: 20px;
}

.header-actions {
  text-align: center;
  margin-bottom: 20px;
}

.create-blog-btn {
  font-weight: 500;
}

.blog-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.blog-item {
  transition: transform 0.2s;
  display: flex;
}

.blog-item:hover {
  transform: translateY(-3px);
}

.thumbnail {
  height: 100%;
  width: 100%;
  object-fit: cover;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

.blog-title {
  font-weight: bold;
  color: #333;
}

.no-blogs {
  padding: 15px;
  margin-top: 20px;
}

.card-body {
  height: 100%;
}

.row {
  height: 100%;
}
</style>