<template>
  <div class="container py-4">
    <h1 class="text-center mb-4">Advisor Moderation</h1>
    <ul class="nav nav-tabs mb-4 justify-content-center">
      <li class="nav-item" v-for="tab in tabs" :key="tab.id">
        <button class="nav-link" :class="{ active: currentTab === tab.id }" @click="currentTab = tab.id">
          {{ tab.name }}
          <span v-if="tab.count" class="badge bg-danger ms-1">{{ tab.count }}</span>
        </button>
      </li>
    </ul>
    <div v-if="currentTab === 'courses'" class="tab-pane fade show active">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h2 class="h4">Your Courses</h2>
        <router-link to="/courses/create">
          <button class="btn btn-success">Create A Course</button>
        </router-link>
      </div>
      <div class="d-flex justify-content-between align-items-center mb-3">
        <select v-model="sortOption" @change="sortCourses" class="form-select w-auto">
          <option value="name-asc">Name A-Z</option>
          <option value="name-desc">Name Z-A</option>
          <option value="price-asc">Price Low-High</option>
          <option value="price-desc">Price High-Low</option>
        </select>
        <input v-model="searchQuery[currentTab]" placeholder="Search..." class="form-control w-auto"
          style="max-width: 300px;" />
      </div>
      <div class="table-responsive">
        <table class="table table-bordered align-middle">
          <thead class="table-light">
            <tr>
              <th style="width: 80px;" class="text-center">Thumb</th>
              <th class="col-title fixed-col">Title</th>
              <th class="col-level fixed-col text-center">Level</th>
              <th class="col-price fixed-col text-center">Price</th>
              <th class="col-status fixed-col text-center">Status</th>
              <th class="col-actions fixed-col text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in filteredCourses" :key="item.id">
              <td class="text-center">
                <img v-if="item.thumbUrl" :src="item.thumbUrl" :alt="item.title" class="img-fluid rounded"
                  style="max-width: 100px;" />
              </td>
              <td class="col-title fixed-col" :title="item.title">{{ item.title }}</td>
              <td class="col-level fixed-col text-center" :title="item.level">{{ item.level }}</td>
              <td class="col-price fixed-col text-center" :title="item.price">{{ item.price }}</td>
              <td class="col-status fixed-col text-center" :title="item.status">
                <span :class="['badge', getStatusClass(item.status)]">{{ item.status }}</span>
              </td>
              <td class="col-actions fixed-col text-center">
                <button class="btn btn-outline-primary btn-sm me-1" @click="editCourse(item.id)">
                  <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-outline-danger btn-sm" @click="prepareDelete(item, 'courses')">
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <Pagination :currentPage="currentPageCourses" :totalPages="totalPagesCourses" :goToPage="changePageCourse" />
    </div>
    <!-- Blogs Tab -->
    <div v-if="currentTab === 'blogs'" class="tab-pane fade show active">
      <div v-if="!isEditingBlog">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h2 class="h4">Your Blogs</h2>
          <router-link to="/blogs/create">
            <button class="btn btn-success">Create A Blog</button>
          </router-link>
        </div>
        <div class="d-flex justify-content-between align-items-center mb-3">
          <select v-model="sortOption" @change="sortBlogs" class="form-select w-auto">
            <option value="name-asc">Name A-Z</option>
            <option value="name-desc">Name Z-A</option>
          </select>
          <input v-model="searchQuery[currentTab]" placeholder="Search..." class="form-control w-auto"
            style="max-width: 300px;" />
        </div>
        <div class="table-responsive">
          <table class="table table-bordered align-middle">
            <thead class="table-light">
              <tr>
                <th style="width: 80px;" class="text-center">Thumb</th>
                <th class="col-title fixed-col">Title</th>
                <th class="col-tags fixed-col">Tags</th>
                <th class="col-status fixed-col">Status</th>
                <th class="col-actions fixed-col text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in filteredBlogs" :key="item.id">
                <td class="text-center">
                  <img v-if="item.thumb && item.thumb.url" :src="item.thumb.url" :alt="item.thumb.title"
                    class="img-fluid rounded" style="max-width: 100px;" />
                </td>
                <td class="col-title fixed-col" :title="item.title">{{ item.title }}</td>
                <td class="col-tags fixed-col">
                  <div class="d-flex flex-wrap gap-1">
                    <span v-for="tag in item.tags" :key="tag.id" class="badge bg-info text-dark">
                      {{ tag.title }}
                    </span>
                  </div>
                </td>
                <td class="col-status fixed-col text-center" :title="item.status">
                  <span :class="['badge', getStatusClass(item.status)]">{{ item.status }}</span>
                </td>
                <td class="col-actions fixed-col text-center">
                  <button class="btn btn-outline-primary btn-sm me-1" @click="editBlog(item)">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button class="btn btn-outline-danger btn-sm" @click="prepareDelete(item, 'blogs')">
                    <i class="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <Pagination :currentPage="currentPageBlogs" :totalPages="totalPagesBlogs" :goToPage="changePageBlog" />
      </div>
    </div>
    <!-- Roadmaps Tab -->
    <div v-if="currentTab === 'roadmaps'" class="tab-pane fade show active">
      <div v-if="!isEditingRoadmap">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h2 class="h4">Roadmaps</h2>
          <router-link to="/roadmaps/create">
            <button class="btn btn-success">Create A Roadmap</button>
          </router-link>
        </div>
        <div class="d-flex justify-content-between align-items-center mb-3">
          <select v-model="sortOption" @change="sortRoadmaps" class="form-select w-auto">
            <option value="name-asc">Name A-Z</option>
            <option value="name-desc">Name Z-A</option>
          </select>
          <input v-model="searchQuery[currentTab]" placeholder="Search..." class="form-control w-auto"
            style="max-width: 300px;" />
        </div>
        <div class="table-responsive">
          <table class="table table-bordered align-middle">
            <thead class="table-light">
              <tr>
                <th class="col-title fixed-col">Title</th>
                <th class="col-intro fixed-col">Intro</th>
                <th class="col-phase fixed-col">Phase</th>
                <th class="col-actions fixed-col text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in filteredRoadmaps" :key="item.id">
                <td class="col-title fixed-col" :title="item.title">{{ item.title }}</td>
                <td class="col-intro fixed-col" :title="item.introText">{{ item.introText }}</td>
                <td class="col-phase fixed-col text-center" :title="item.phases.length">{{ item.phases.length }}</td>
                <td class="col-actions fixed-col text-center">
                  <button class="btn btn-outline-primary btn-sm me-1" @click="editRoadmap(item)">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button class="btn btn-outline-danger btn-sm" @click="prepareDelete(item, 'roadmaps')">
                    <i class="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <Pagination :currentPage="currentPageRoadmaps" :totalPages="totalPagesRoadmaps" :goToPage="changePageRoadmap" />
      </div>
    </div>
    <UpdateBlog v-if="isEditingBlog" :blogData="selectedBlog" @blogUpdated="handleBlogUpdated" />
    <UpdateRoadmap v-if="isEditingRoadmap" :roadmapData="selectedRoadmap" @roadmapUpdated="handleRoadmapUpdated" />
    <DeleteConfirmPopup :message="deleteMessage" :isVisible="showDeletePopup" @confirmDelete="confirmDelete"
      @update:isVisible="showDeletePopup = $event" />
  </div>
</template>

<script>
import { getPagedArticles, deleteArticle } from '@/scripts/api/services/blogService'
import { getCourses, deleteCourse } from '@/scripts/api/services/courseService'
import { getRoadmaps, deleteRoadmap } from '@/scripts/api/services/roadmapService'
import Pagination from '@/components/Common/Pagination.vue'
import UpdateBlog from './UpdateBlog.vue'
import UpdateRoadmap from './UpdateRoadmap.vue'
import DeleteConfirmPopup from '@/components/Common/Popup/DeleteConfirmPopup.vue'
export default {
  emits: ['authenticated', 'addNotification', 'removeNotification'],
  components: { Pagination, DeleteConfirmPopup, UpdateBlog, UpdateRoadmap },
  data() {
    return {
      isEditingBlog: false,
      selectedBlog: null,
      isEditingRoadmap: false,
      selectedRoadmap: null,
      sortOption: 'name-asc',
      showDeletePopup: false,
      selectedItem: null,
      selectedItemType: '',
      deleteMessage: '',
      searchQuery: { courses: '', blogs: '', roadmaps: '' },
      currentTab: 'courses',
      tabs: [
        { id: 'courses', name: 'Courses', count: 0 },
        { id: 'blogs', name: 'Blogs', count: 0 },
        { id: 'roadmaps', name: 'Roadmaps', count: 0 }
      ],
      courses: [],
      blogs: [],
      roadmaps: [],
      currentPageCourses: 1,
      totalPagesCourses: 1,
      currentPageBlogs: 1,
      totalPagesBlogs: 1,
      currentPageRoadmaps: 1,
      totalPagesRoadmaps: 1,
      pageSize: 20,
    }
  },
  methods: {
    editBlog(blog) {
      if (blog) {
        this.selectedBlog = blog
        this.isEditingBlog = true
      }
    },
    editCourse(id) {
      this.$router.push({ name: 'updateCourse', params: { id } })
    },
    editRoadmap(roadmap) {
      if (roadmap) {
        this.selectedRoadmap = roadmap
        this.isEditingRoadmap = true
      }
    },
    handleBlogUpdated() {
      this.isEditingBlog = false
      this.selectedBlog = null
    },
    handleRoadmapUpdated() {
      this.isEditingRoadmap = false
      this.selectedRoadmap = null
      this.fetchRoadmaps()
    },
    prepareDelete(item, type) {
      this.selectedItem = item
      this.selectedItemType = type
      this.deleteMessage = `Are you sure you want to delete "${item.title}"?`
      this.showDeletePopup = true
    },
    changePageCourse(page) {
      if (page >= 1 && page <= this.totalPagesCourses) {
        this.currentPageCourses = page
        this.$nextTick(() => this.fetchCourses())
      }
    },
    changePageBlog(page) {
      if (page >= 1 && page <= this.totalPagesBlogs) {
        this.currentPageBlogs = page
        this.$nextTick(() => this.fetchBlogs())
      }
    },
    changePageRoadmap(page) {
      if (page >= 1 && page <= this.totalPagesRoadmaps) {
        this.currentPageRoadmaps = page
        this.$nextTick(() => this.fetchRoadmaps())
      }
    },
    sortCourses() {
      if (this.sortOption === 'name-asc') {
        this.courses.sort((a, b) => a.title.localeCompare(b.title))
      } else if (this.sortOption === 'name-desc') {
        this.courses.sort((a, b) => b.title.localeCompare(a.title))
      } else if (this.sortOption === 'price-asc') {
        this.courses.sort((a, b) => a.price - b.price)
      } else if (this.sortOption === 'price-desc') {
        this.courses.sort((a, b) => b.price - a.price)
      }
    },
    sortBlogs() {
      if (this.sortOption === 'name-asc') {
        this.blogs.sort((a, b) => a.title.localeCompare(b.title))
      } else if (this.sortOption === 'name-desc') {
        this.blogs.sort((a, b) => b.title.localeCompare(a.title))
      }
    },
    sortRoadmaps() {
      if (this.sortOption === 'name-asc') {
        this.roadmaps.sort((a, b) => a.title.localeCompare(b.title))
      } else if (this.sortOption === 'name-desc') {
        this.roadmaps.sort((a, b) => b.title.localeCompare(a.title))
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
          console.error('Error deleting content:', error)
          //... other alert
          alert('Failed to delete the content.')
        }
      }
      this.showDeletePopup = false
    },
    async fetchBlogs() {
      try {
        const params = { pageIndex: this.currentPageBlogs - 1, pageSize: this.pageSize };
        const response = await getPagedArticles(params);

        this.blogs = (response.items || []).filter(blog => blog.creatorId === this.currentUserId);
          //... double check
        this.totalPagesBlogs = Math.ceil(this.blogs.length / this.pageSize);

        const blogTab = this.tabs.find(tab => tab.id === 'blogs');
        if (blogTab) {
          blogTab.count = this.blogs.length;
        }

        this.sortBlogs();
      } catch (error) {
        console.error('Error fetching blogs:', error);
        this.blogs = [];
      }
    },
    async fetchRoadmaps() {
      try {
        const params = { pageIndex: this.currentPageRoadmaps - 1, pageSize: this.pageSize };
        const response = await getRoadmaps(params);

        this.roadmaps = (response.items || []).filter(roadmap => roadmap.creatorId === this.currentUserId);
        //... double check
        this.totalPagesRoadmaps = Math.ceil(this.roadmaps.length / this.pageSize);

        const roadmapTab = this.tabs.find(tab => tab.id === 'roadmaps');
        if (roadmapTab) {
          roadmapTab.count = this.roadmaps.length;
        }

        this.sortRoadmaps();
      } catch (error) {
        console.error('Error fetching roadmaps:', error);
        this.roadmaps = [];
      }
    },
    async fetchCourses() {
      try {
        const params = { pageIndex: this.currentPageCourses - 1, pageSize: this.pageSize };
        const response = await getCourses(params);

        this.courses = (response.items || []).filter(course => course.creatorId === this.currentUserId);
        //... double check
        this.totalPagesCourses = Math.ceil(this.courses.length / this.pageSize);

        const courseTab = this.tabs.find(tab => tab.id === 'courses');
        if (courseTab) {
          courseTab.count = this.courses.length;
        }

        this.sortCourses();
      } catch (error) {
        console.error('Error fetching courses:', error);
        this.courses = [];
      }
    },
    getStatusClass(status) {
      if (status === 'pending') return 'bg-warning text-dark'
      if (status === 'approved') return 'bg-success'
      if (status === 'rejected') return 'bg-danger'
      return 'bg-secondary'
    }
  },
  computed: {
    currentUserId() => JSON.parse(localStorage.getItem('userProfile'))?.id,
    filteredCourses = () => this.courses.filter(item => item.title.toLowerCase().includes(this.searchQuery.courses.toLowerCase())),
    filteredBlogs = () => this.blogs.filter(item => item.title.toLowerCase().includes(this.searchQuery.blogs.toLowerCase())),
    filteredRoadmaps = () => this.roadmaps.filter(item => item.title.toLowerCase().includes(this.searchQuery.roadmaps.toLowerCase()))
  },
  mounted() {
    const link = document.createElement('link')
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css'
    link.rel = 'stylesheet'
    document.head.appendChild(link)
    this.fetchBlogs()
    this.fetchCourses()
    this.fetchRoadmaps()
  }
}
</script>

<style scoped>
.nav-tabs .nav-link {
  font-weight: 500;
}

.table {
  margin-bottom: 0;
  table-layout: fixed;
}

.fixed-col {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.col-title {
  width: 200px;
}

.col-level {
  width: 100px;
}

.col-price {
  width: 80px;
}

.col-status {
  width: 100px;
  text-align: center;
}

.col-actions {
  width: 80px;
}

.col-tags {
  width: 200px;
}

.col-intro {
  width: 250px;
}

.col-phase {
  width: 80px;
  text-align: center;
}
</style>