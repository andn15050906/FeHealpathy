<template>
    <div class="moderate-users">
      <h1 class="title">Advisor Moderation</h1>

      <div class="tabs">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          :class="['tab-button', { active: currentTab === tab.id }]"
          @click="currentTab = tab.id"
        >
          {{ tab.name }}
          <span class="badge" v-if="tab.count">{{ tab.count }}</span>
        </button>
      </div>

      <!-- Courses -->
      <div v-if="currentTab === 'courses'" class="tab-content">
        <div class="content-header">
          <h2>Your Courses</h2>
        </div>
        <router-link to="/courses/create">
          <button type="button" class="btn btn-primary" data-mdb-ripple-init style="width: 150px;height:50px;color: white; margin: auto;background-color: green;">Create A Course</button>
        </router-link>
        <div class="content-header">
          <select  v-model="sortOption" @change="sortCourses" class="form-select" style="width: 200px;">
            <option selected value="name-asc">Name A-Z</option>
            <option value="name-desc">Name Z-A</option>
            <option value="price-asc">Price Low-High</option>
            <option value="price-desc">Price High-Low</option>
          </select>

          <input v-model="searchQuery[currentTab]" placeholder="Search..." class="search-input" />
        </div>
        <table class="content-table">
          <thead>
            <tr>
              <th style="width: 10px;">Thumb</th>
              <th>Title</th>
              <th>Level</th>
              <th>Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in filteredCourses" :key="item.id">
              <td>
                <img v-if="item.thumbUrl" :src="item.thumbUrl" :alt="item.title" class="thumbnail-img"/>
              </td>
              <td>{{ item.title }}</td>
              <td>{{ item.level }}</td>
              <td>{{ item.price }}</td>
              <td>
                <span :class="['status-badge', item.status]">
                  {{ item.status }}
                </span>
              </td>
              <td class="action-buttons">
                <button class="btn btn-approve" @click="editCourse(item.id)">
                  <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-reject" @click="prepareDelete(item, 'courses')">
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <Pagination 
            :currentPage="currentPageCourses" 
            :totalPages="totalPagesCourses" 
            :goToPage="changePageCourse" 
        />
      </div>

      <!-- Blogs -->
      <div v-if="currentTab === 'blogs'" class="tab-content">
        <div v-if="!isEditingBlog">
        <div class="content-header">
          <h2>Your Blogs</h2>
        </div>
        <router-link to="/blogs/create">
        <button type="button" class="btn btn-primary" data-mdb-ripple-init style="width: 150px;height:50px;color: white; margin: auto;background-color: green;">Create A Blog</button>
        </router-link>
        <div class="content-header">
          <select  v-model="sortOption" @change="sortBlogs()" class="form-select" style="width: 200px;">
            <option selected value="name-asc">Name A-Z</option>
            <option value="name-desc">Name Z-A</option>
          </select>

          <input v-model="searchQuery[currentTab]" placeholder="Search..." class="search-input" />
        </div>
        <table class="content-table">
          <thead>
            <tr>
              <th>Thumb</th>
              <th>Title</th>
              <th>Tags</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in filteredBlogs" :key="item.id">
              <td> <img v-if="item.thumb && item.thumb.url" :src="item.thumb.url" :alt="item.thumb.title" class="thumbnail-img"/> </td>
              <td>{{ item.title }}</td>
              <td>{{ item.tags.map(tag => tag.title).join(', ') }}</td>
              <td>
                <span :class="['status-badge', item.status]">
                  {{ item.status }}
                </span>
              </td>
              <td class="action-buttons">
                <button class="btn btn-approve" @click="editBlog(item)">
                  <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-reject" @click="prepareDelete(item, 'blogs')">
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <Pagination 
  :currentPage="currentPageBlogs" 
  :totalPages="totalPagesBlogs" 
  :goToPage="changePageBlog" 
/>
</div>
      </div>
      

      <!-- Tab roadmaps -->
      <div v-if="currentTab === 'roadmaps'" class="tab-content">
        <div v-if="!isEditingRoadmap">
        <div class="content-header">
          <h2>Roadmaps</h2>
        </div>
        <router-link to="/roadmaps/create">
        <button type="button" class="btn btn-primary" data-mdb-ripple-init style="width: 150px;height:50px;color: white; margin: auto;background-color: green;">Create A Roadmap</button>
      </router-link>
        <div class="content-header">
          <select  v-model="sortOption" @change="sortRoadmaps()" class="form-select" style="width: 200px;">
            <option selected value="name-asc">Name A-Z</option>
            <option value="name-desc">Name Z-A</option>
          </select>

          <input v-model="searchQuery[currentTab]" placeholder="Search..." class="search-input" />
        </div>
        <table class="content-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Intro</th>
              <th>Phase</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in filteredRoadmaps" :key="item.id">
              <td>{{ item.title }}</td>
              <td>{{ item.introText }}</td>
              <td>{{ item.phases.length }}</td>
              <td class="action-buttons">
                <button class="btn btn-approve" @click="editRoadmap(item)">
                  <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-reject" @click="prepareDelete(item, 'roadmaps')">
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <Pagination 
  :currentPage="currentPageRoadmaps" 
  :totalPages="totalPagesRoadmaps" 
  :goToPage="changePageRoadmap" 
/>
    </div>
    
    </div>
    <UpdateBlog v-if="isEditingBlog" :blogData="selectedBlog"
            @blogUpdated="handleBlogUpdated" />
    <UpdateRoadmap v-if="isEditingRoadmap" :roadmapData="selectedRoadmap"
            @roadmapUpdated="handleRoadmapUpdated" />
    <DeleteConfirmPopup
    :message="deleteMessage"
    :isVisible="showDeletePopup"
    @confirmDelete="confirmDelete"
    @update:isVisible="showDeletePopup = $event"
/>
</template>

  <script>
  import { getPagedArticles, deleteArticle } from '@/scripts/api/services/blogService';
  import { getCourses, deleteCourse } from '@/scripts/api/services/courseService';
  import { getRoadmaps, deleteRoadmap } from '@/scripts/api/services/roadmapService';
  import Pagination from '@/components/Common/Pagination.vue';
  import UpdateBlog from './UpdateBlog.vue';
  import UpdateRoadmap from './UpdateRoadmap.vue';
  import DeleteConfirmPopup from '@/components/Common/Popup/DeleteConfirmPopup.vue';
  export default {
    emits: ['authenticated', 'addNotification', 'removeNotification'],
    components: { Pagination, DeleteConfirmPopup, UpdateBlog, UpdateRoadmap },
    data() {
      return {
        blogs: [],
        isEditingBlog: false,
        selectedBlog: null,
        isEditingRoadmap: false,
        selectedRoadmap: null,
        isDeletePopupVisible: false,
        blogToDelete: null,
        sortOption: 'name-asc',
        showDeletePopup: false,
        selectedItem: null,
        selectedItemType: '',
        deleteMessage: ''  ,
        searchQuery: {
            courses: '',
            blogs: '',
            roadmaps: ''
        },
        currentTab: 'courses',
        tabs: [
          { id: 'courses', name: 'Courses', count: 0 },
          { id: 'blogs', name: 'Blogs', count: 0 },
          { id: 'roadmaps', name: 'Roadmaps', count: 0 }
        ],
        courses: [],
        blogs: [],
        roadmaps: [],
        //pagination
        currentPageCourses: 1,
        totalPagesCourses: 1,

        currentPageBlogs: 1,
        totalPagesBlogs: 1,

        currentPageRoadmaps: 1,
        totalPagesRoadmaps: 1,

    pageSize: 20,
      };
    },
methods: {
  editBlog(blog) {
    if (blog) {
      this.selectedBlog = blog;
      this.isEditingBlog = true;
    } else {
      console.error("Error: blog data is undefined.");
      this.isEditingBlog = false;
    }
  },
  editCourse(id) {
    this.$router.push({ name: 'updateCourse', params: { id } });
  },
  editRoadmap(roadmap) {
    if (roadmap) {
      this.selectedRoadmap = roadmap;
      this.isEditingRoadmap = true;
    } else {
      console.error("Error: blog data is undefined.");
      this.isEditingRoadmap = false;
    }
  },
  handleBlogUpdated() {
    this.isEditingBlog = false;
    this.selectedBlog = null;
  },
  handleRoadmapUpdated() {
    this.isEditingRoadmap = false;
    this.selectedRoadmap = null;
    this.fetchRoadmaps();
  },
  prepareDelete(item, type) {
    this.selectedItem = item;
    this.selectedItemType = type;
    this.deleteMessage = `Are you sure you want to delete "${item.title}"?`;
    this.showDeletePopup = true;
  },
  changePageCourse(page) {
    if (page >= 1 && page <= this.totalPagesCourses) {
        this.currentPageCourses = page;
        this.$nextTick(() => this.fetchCourses());
    }
},
changePageBlog(page) {
  if (page >= 1 && page <= this.totalPagesBlogs) {
    this.currentPageBlogs = page;
    this.$nextTick(() => this.fetchBlogs());
  }
},

changePageRoadmap(page) {
  if (page >= 1 && page <= this.totalPagesRoadmaps) {
    this.currentPageRoadmaps = page;
    this.$nextTick(() => this.fetchRoadmaps());
  }
},
sortCourses() {
    if (this.sortOption === 'name-asc') {
      this.courses.sort((a, b) => a.title.localeCompare(b.title));
    } else if (this.sortOption === 'name-desc') {
      this.courses.sort((a, b) => b.title.localeCompare(a.title));
    } else if (this.sortOption === 'price-asc') {
      this.courses.sort((a, b) => a.price - b.price);
    } else if (this.sortOption === 'price-desc') {
      this.courses.sort((a, b) => b.price - a.price);
    }
  },
sortBlogs() {
  if (this.sortOption === 'name-asc') {
    this.blogs.sort((a, b) => a.title.localeCompare(b.title)); 
  } else if (this.sortOption === 'name-desc') {
    this.blogs.sort((a, b) => b.title.localeCompare(a.title));
  }
}
,
sortRoadmaps() {
  if (this.sortOption === 'name-asc') {
    this.roadmaps.sort((a, b) => a.title.localeCompare(b.title)); 
  } else if (this.sortOption === 'name-desc') {
    this.roadmaps.sort((a, b) => b.title.localeCompare(a.title));
  }
},
async fetchBlogs() {
  try {
    const params = {
      pageIndex: this.currentPageBlogs - 1,
      pageSize: this.pageSize
    };
    const response = await getPagedArticles(params);
    this.blogs = Array.isArray(response.items) ? response.items : [];
    this.totalPagesBlogs = response.pageCount;
    const blogTab = this.tabs.find(tab => tab.id === 'blogs');
    if (blogTab) {
      blogTab.count = response.totalCount;
    }
    this.sortBlogs();
    console.log(response);
  } catch (error) {
    console.error('Error fetching blogs:', error);
    this.blogs = [];
  }
},
async confirmDelete(confirm) {
    if (confirm) {
      try {
        switch (this.selectedItemType) {
          case 'courses':
            await deleteCourse(this.selectedItem.id);
            break;
          case 'blogs':
            await deleteArticle(this.selectedItem.id);
            break;
          case 'roadmaps':
            await deleteRoadmap(this.selectedItem.id);
            break;
        }
        
        this.fetchCourses();
        this.fetchBlogs();
        this.fetchRoadmaps();
      } catch (error) {
        console.error('Error deleting content:', error);
        alert('Failed to delete the content.');
      }
    }
    this.showDeletePopup = false;
  },
async fetchRoadmaps() {
  try {
    const params = {
      pageIndex: this.currentPageRoadmaps - 1,
      pageSize: this.pageSize
    };
    const response = await getRoadmaps(params);
    this.roadmaps = Array.isArray(response.items) ? response.items : [];
    this.totalPagesRoadmaps = response.pageCount;
    const roadmapTab = this.tabs.find(tab => tab.id === 'roadmaps');
    if (roadmapTab) {
      roadmapTab.count = response.totalCount;
    }
    this.sortRoadmaps();
    console.log(response);
  } catch (error) {
    console.error('Error fetching roadmaps:', error);
    this.roadmaps = [];
  }
},
async fetchCourses() {
    try {
        console.log("Fetching courses for page:", this.currentPage);

        const params = {
            pageIndex: this.currentPageCourses - 1,
            pageSize: this.pageSize
        };

        console.log("Request Params:", params);

        const response = await getCourses(params);

        console.log("API Response:", response);

        this.courses = response.items || [];
        this.totalPagesCourses = response.pageCount;

        const courseTab = this.tabs.find(tab => tab.id === 'courses');
        if (courseTab) {
            courseTab.count = response.totalCount;
        }
        this.sortCourses();
    } catch (error) {
        console.error('Error fetching courses:', error);
        this.courses = [];
    }
  }
  ,
    },
    computed: {
        filteredCourses() {
            return this.courses.filter(item => 
            item.title.toLowerCase().includes(this.searchQuery.courses.toLowerCase())
        );
    },
        filteredBlogs() {
            return this.blogs.filter(item => 
            item.title.toLowerCase().includes(this.searchQuery.blogs.toLowerCase())
        );
    },
        filteredRoadmaps() {
            return this.roadmaps.filter(item => 
            item.title.toLowerCase().includes(this.searchQuery.roadmaps.toLowerCase())
        );
    }
},

    mounted() {
      const link = document.createElement('link');
      link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css';
      link.rel = 'stylesheet';
      document.head.appendChild(link);
      this.fetchBlogs();
      this.fetchCourses();
      this.fetchRoadmaps();
    }
  };
  </script>

  <style scoped>
  
  .moderate-users {
    padding: 20px;
  }
  
  .title {
    margin-bottom: 30px;
    color: #333;
  }

  .tabs {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
  }

  .tab-button {
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-weight: bold;
    background: #f5f5f5;
    color: #666;
    position: relative;
  }

  .tab-button.active {
    background: #007bff;
    color: white;
  }

  .badge {
    position: absolute;
    top: -8px;
    right: -8px;
    background: #dc3545;
    color: white;
    border-radius: 50%;
    padding: 2px 6px;
    font-size: 12px;
  }

  .content-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
  
  .search-input {
    width: 300px;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 5px;
  }
  
  .content-table {
    width: 100%;
    border-collapse: collapse;
    background: white;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
  
  .content-table th,
  .content-table td,
  .content-table tr {
    padding: 12px;
    text-align: left;
  }
  
  .content-table th {
    background: #f8f9fa;
    font-weight: bold;
    color: #333;
  }
  
  .status-badge {
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
  }

  .status-badge.pending {
    background: #fff3cd;
    color: #856404;
  }

  .status-badge.approved {
    background: #d4edda;
    color: #155724;
  }

  .status-badge.rejected {
    background: #f8d7da;
    color: #721c24;
  }
  
  .action-buttons {
    display: flex;
    gap: 5px;
  }
  
  .btn {
    width: 32px;
    height: 32px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s;
  }
  
  .btn:hover {
    transform: translateY(-2px);
  }
  
  .btn-view {
    background: #6c757d;
    color: white;
  }
  
  .btn-approve {
    background: #28a745;
    color: white;
  }
  
  .btn-reject {
    background: #dc3545;
    color: white;
  }

  .thumbnail-img {
  width: 100px;
  height: auto;
  aspect-ratio: 16 / 9;
  object-fit: cover;
  border-radius: 5px;
}

.content-table th,
.content-table td {
  padding: 12px;
  text-align: left;
  vertical-align: top;
}

.content-table tr {
  border-bottom: 1px solid #eee;
}


</style>