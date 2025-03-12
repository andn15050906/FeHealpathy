<template>
  <div class="">
    <div v-if="!isEditingBlog">
      <div class="blog-management">
      <h1 class="title">📝 Quản Lý Blog</h1>
      <div class="header-actions">
        <router-link to="/blogs/create">
      <button class="create-blog-btn btn" @click="createBlog">✅ Tạo Blog</button>
    </router-link>
    </div>
      <div class="blog-list">
        <div class="blog-item" v-for="blog in blogs" :key="blog.id">
          <img :src="blog.thumb?.url || 'https://placehold.co/16x9'" 
     :alt="blog.title" class="thumbnail" />

          <div class="blog-details">
            <h2 class="blog-title">{{ blog.title }}</h2>
            <p class="blog-date">Ngày đăng: {{ formattedDate(blog.creationTime) }}</p>
            <div class="actions">
              <button class="btn edit" @click="editBlog(blog)">✏️ Sửa</button>
              <button class="btn delete" @click="openDeletePopup(blog)">🗑️ Xóa</button>
            </div>
          </div>
        </div>
      </div>
  
      <p v-if="blogs.length === 0" class="no-blogs">Chưa có blog nào được đăng!</p>
      </div>
    </div>
        <UpdateBlog v-if="isEditingBlog" :blogData="selectedBlog"
            @blogUpdated="handleBlogUpdated" />
        
            <DeleteConfirmPopup 
            :message="'Delete this blog?'" 
            :isVisible="isDeletePopupVisible" 
            @confirmDelete="handleDeleteConfirm"
            @update:isVisible="isDeletePopupVisible = $event"
    />
  </div>
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
            this.errorMessage = "Chưa có blog nào!";
          }
          } catch (error) {
            this.blogs = [];
            this.errorMessage = "Lỗi khi tải dữ liệu blog. Vui lòng thử lại.";
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
          alert("Lỗi khi xóa blog. Vui lòng thử lại.");
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
  body {
    font-family: 'Arial', sans-serif;
    background-color: #f4f4f9;
    margin: 0;
    padding: 0;
  }
  
  .blog-management {
    max-width: 900px;
    margin: 20px auto;
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
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
  background-color: #28a745;
  color: #fff;
  border: none;
  padding: 10px 15px;
  font-size: 16px;
  cursor: pointer;
  border-radius: 5px;
  margin-bottom: 20px;
}

.create-blog-btn:hover {
  background-color: #218838;
}

.blog-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}


  .blog-item {
    display: flex;
    align-items: center;
    padding: 15px;
    background: #fafafa;
    border-radius: 10px;
    border: 1px solid #ddd;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }
  
  .thumbnail {
    height: 100px;
    object-fit: cover;
    border-radius: 10px;
    margin-right: 20px;
    width: 20%;
    aspect-ratio: 16 / 9;
    object-fit: cover;
  }
  
  .blog-details {
    flex: 1;
  }
  
  .blog-title {
    font-size: 1.2rem;
    margin: 0;
    color: #333;
  }
  
  .blog-date {
    font-size: 0.9rem;
    color: #888;
    margin: 5px 0;
  }
  
  .actions {
    display: flex;
    gap: 10px;
  }
  
  .btn {
    padding: 8px 12px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 0.9rem;
    font-weight: bold;
  }
  
  .btn.view {
    background: #007bff;
    color: white;
  }
  
  .btn.edit {
    background: #ffc107;
    color: white;
  }
  
  .btn.delete {
    background: #dc3545;
    color: white;
  }
  
  .no-blogs {
    text-align: center;
    color: #888;
    font-size: 1rem;
  }

  </style>

  
  