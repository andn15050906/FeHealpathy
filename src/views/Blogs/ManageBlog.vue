<template>
    <div class="blog-management">
      <h1 class="title">📝 Quản Lý Blog</h1>
      <div class="header-actions">
        <router-link to="/blogs/create">
      <button class="create-blog-btn btn" @click="createBlog">✅ Tạo Blog</button>
    </router-link>
    </div>
      <div class="blog-list">
        <div class="blog-item" v-for="blog in blogs" :key="blog.id">
          <img src="data:image/jpeg;base64,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" alt="Blog Thumbnail" class="thumbnail" />
          <div class="blog-details">
            <h2 class="blog-title">{{ blog.title }}</h2>
            <p class="blog-date">Ngày đăng: {{ formattedDate(blog.creationTime) }}</p>
            <div class="actions">
              <button class="btn view" @click="viewBlog(blog)">👁️ Xem</button>
              <button class="btn edit" @click="editBlog(blog)">✏️ Sửa</button>
              <button class="btn delete" @click="deleteBlog(blog.id)">🗑️ Xóa</button>
            </div>
          </div>
        </div>
      </div>
  
      <p v-if="blogs.length === 0" class="no-blogs">Chưa có blog nào được đăng!</p>
    </div>
  </template>
  
  <script>
import moment from 'moment';
import { getPagedArticles, deleteArticle } from '@/services/blogService';
  export default {
    name: "BlogManagement",
    data() {
      return {
        blogs: [],
      };
    },
    methods: {
      viewBlog(blog) {
        alert(`Xem blog: ${blog.title}`);
        
      },
      editBlog(blog) {
        alert(`Sửa blog: ${blog.title}`);
      },
      formattedDate(value) {
        return moment(String(value)).format('MM/DD/YYYY hh:mm')
    },
      async fetchBlogs(){
        this.loading = true;
            this.errorMessage = "";
            try {
              const data = await getPagedArticles();
              console.log('data', data);
            if (data.length === 0) {
              this.blogs = [];
              this.errorMessage = "No blogs found.";
            } else {
              this.blogs = data.items;
            }
            } catch (error) {
              this.errorMessage = "Failed to fetch blogs. Please try again.";
              console.error(error);
            } finally {
              this.loading = false;
          }
      },
      async deleteBlog(blogId) {
      if (confirm("Bạn có chắc chắn muốn xóa blog này không?")) {
        try {
          await deleteArticle(blogId);
          alert("Blog đã được xóa thành công.");
          this.fetchBlogs();
        } catch (error) {
          alert("Lỗi khi xóa blog. Vui lòng thử lại.");
          console.error(error);
        }
      }
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
    width: 100px;
    height: 100px;
    object-fit: cover;
    border-radius: 10px;
    margin-right: 20px;
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
  