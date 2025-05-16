<template>
  <div class="container py-4">
    <LoadingSpinner ref="loadingSpinner" />
    <h1 class="text-center mb-4">Quản lý nội dung</h1>
    <ul class="nav nav-tabs mb-4 justify-content-center">
      <li class="nav-item" v-for="tab in tabs" :key="tab.id">
        <button class="nav-link" :class="{ active: currentTab === tab.id }" @click="currentTab = tab.id">
          {{ tab.name }}
          <span v-if="tab.count" class="badge bg-danger ms-1">{{ tab.count }}</span>
        </button>
      </li>
    </ul>
    <!-- Courses Tab -->
    <div v-if="currentTab === 'courses'" class="tab-pane fade show active">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h2 class="h4">Khóa học của bạn</h2>
        <router-link to="/courses/create">
          <button class="btn btn-success">Tạo khóa học mới</button>
        </router-link>
      </div>
      <div class="d-flex justify-content-between align-items-center mb-3">
        <select v-model="sortOption" @change="sortCourses" class="form-select w-auto">
          <option value="name-asc">Tên A-Z</option>
          <option value="name-desc">Tên Z-A</option>
          <option value="price-asc">Giá thấp đến cao</option>
          <option value="price-desc">Giá cao đến thấp</option>
        </select>
        <input v-model="searchQuery[currentTab]" placeholder="Tìm kiếm..." class="form-control w-auto"
          style="max-width: 300px;" />
      </div>
      <div class="table-responsive">
        <table class="table table-bordered align-middle">
          <thead class="table-light">
            <tr>
              <th style="width: 80px;" class="text-center">Ảnh</th>
              <th class="col-title fixed-col">Tiêu đề</th>
              <th class="col-level fixed-col text-center">Cấp độ</th>
              <th class="col-price fixed-col text-center">Giá</th>
              <th class="col-status fixed-col text-center">Trạng thái</th>
              <th class="col-actions fixed-col text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in filteredCourses" :key="item.id">
              <td class="text-center">
                <div class="thumb-wrapper ratio-16x9" style="max-width: 100px; margin: auto;">
                  <img :src="item.thumbUrl" :alt="item.title" @error="setDefaultImage" />
                </div>
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
      <Pagination :currentPage="currentPageCourses" style="margin-top: 20px;" :totalPages="totalPagesCourses"
        @GoToPage="changePageCourse" />
    </div>
    <!-- Blogs Tab -->
    <div v-if="currentTab === 'blogs'" class="tab-pane fade show active">
      <div v-if="!isEditingBlog">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h2 class="h4">Blog của bạn</h2>
          <router-link to="/blogs/create">
            <button class="btn btn-success">Tạo bài viết mới</button>
          </router-link>
        </div>
        <div class="d-flex justify-content-between align-items-center mb-3">
          <select v-model="sortOption" @change="sortBlogs" class="form-select w-auto">
            <option value="name-asc">Tên A-Z</option>
            <option value="name-desc">Tên Z-A</option>
          </select>
          <input v-model="searchQuery[currentTab]" placeholder="Tìm kiếm..." class="form-control w-auto"
            style="max-width: 300px;" />
        </div>
        <div class="table-responsive">
          <table class="table table-bordered align-middle">
            <thead class="table-light">
              <tr>
                <th style="width: 80px;" class="text-center">Ảnh</th>
                <th class="col-title fixed-col">Tiêu đề</th>
                <th class="col-tags fixed-col">Thẻ</th>
                <th class="col-status fixed-col">Trạng thái</th>
                <th class="col-actions fixed-col text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in filteredBlogs" :key="item.id">
                <td class="text-center">
                  <div class="thumb-wrapper ratio-16x9" style="max-width: 100px; margin: auto;">
                    <img :src="item.thumb?.url || 'https://placehold.co/160x90'"
                      :alt="item.thumb?.title || 'Default image'" class="img-fluid rounded" @error="setDefaultImage" />
                  </div>
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
        <Pagination :currentPage="currentPageBlogs" style="margin-top: 20px;" :totalPages="totalPagesBlogs"
          @GoToPage="changePageBlog" />
      </div>
    </div>
    <!-- Roadmaps Tab -->
    <div v-if="currentTab === 'roadmaps'" class="tab-pane fade show active">
      <div v-if="!isEditingRoadmap">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h2 class="h4">Lộ trình học</h2>
          <router-link to="/roadmaps/create">
            <button class="btn btn-success">Tạo lộ trình mới</button>
          </router-link>
        </div>
        <div class="d-flex justify-content-between align-items-center mb-3">
          <select v-model="sortOption" @change="sortRoadmaps" class="form-select w-auto">
            <option value="name-asc">Tên A-Z</option>
            <option value="name-desc">Tên Z-A</option>
          </select>
          <input v-model="searchQuery[currentTab]" placeholder="Tìm kiếm..." class="form-control w-auto"
            style="max-width: 300px;" />
        </div>
        <div class="table-responsive">
          <table class="table table-bordered align-middle">
            <thead class="table-light">
              <tr>
                <th class="col-title fixed-col">Tiêu đề</th>
                <th class="col-intro fixed-col">Giới thiệu</th>
                <th class="col-phase fixed-col">Giai đoạn</th>
                <th class="col-actions fixed-col text-center">Thao tác</th>
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
        <Pagination :currentPage="currentPageRoadmaps" style="margin-top: 20px;" :totalPages="totalPagesRoadmaps"
          @GoToPage="changePageRoadmap" />
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
import LoadingSpinner from '@/components/Common/Popup/LoadingSpinner.vue'
import { toast } from "vue3-toastify";

export default {
  emits: ['authenticated', 'addNotification', 'removeNotification'],
  components: { Pagination, DeleteConfirmPopup, UpdateBlog, UpdateRoadmap, LoadingSpinner },
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
        { id: 'courses', name: 'Khóa học', count: 0 },
        { id: 'blogs', name: 'Blog', count: 0 },
        { id: 'roadmaps', name: 'Lộ trình', count: 0 }
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
      pageSize: 10,
    }
  },
  methods: {
    setDefaultImage(event) {
      const fallbackUrl = 'https://placehold.co/160x90';
      if (event.target.src !== fallbackUrl) {
        event.target.src = fallbackUrl;
      }
    },
    editBlog(blog) {
      if (blog && blog.id) {
        this.$router.push({
          name: 'updateBlog',
          params: { id: blog.id }
        });
      }
    },
    editCourse(id) {
      this.$router.push({ name: 'updateCourse', params: { id } })
    },
    editRoadmap(roadmap) {
      if (roadmap && roadmap.id) {
        this.$router.push({
          name: 'updateRoadmap',
          params: { id: roadmap.id }
        });
      }
    },
    handleBlogUpdated() {
      this.isEditingBlog = false
      this.selectedBlog = null
      toast.success("Blog updated successfully!");
      this.fetchBlogs()
    },
    handleRoadmapUpdated() {
      this.isEditingRoadmap = false
      this.selectedRoadmap = null
      toast.success("Roadmap updated successfully!");
      this.fetchRoadmaps()
    },
    prepareDelete(item, type) {
      this.selectedItem = item
      this.selectedItemType = type
      this.deleteMessage = `Bạn có chắc chắn muốn xóa "${item.title}"?`
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
          this.$refs.loadingSpinner.showSpinner();
          switch (this.selectedItemType) {
            case 'courses':
              await deleteCourse(this.selectedItem.id);
              toast.success("Khóa học đã được xóa thành công!");
              break;
            case 'blogs':
              await deleteArticle(this.selectedItem.id);
              toast.success("Bài viết đã được xóa thành công!");
              break;
            case 'roadmaps':
              await deleteRoadmap(this.selectedItem.id);
              toast.success("Lộ trình đã được xóa thành công!");
              break;
          }

          await Promise.all([
            this.fetchCourses(),
            this.fetchBlogs(),
            this.fetchRoadmaps()
          ]);
        } catch (error) {
          toast.error("Không thể xóa nội dung. Vui lòng thử lại.");
        } finally {
          this.$refs.loadingSpinner.hideSpinner();
        }
      }
      this.showDeletePopup = false;
    },
    async fetchBlogs() {
      try {
        this.$refs.loadingSpinner.showSpinner();
        const params = { pageIndex: this.currentPageBlogs - 1, pageSize: this.pageSize, creatorId: this.currentUserId };
        console.log(params)
        const response = await getPagedArticles(params);
        this.blogs = response.items || [];
        this.totalPagesBlogs = Math.ceil(response.totalCount / this.pageSize);
        this.tabs.find(tab => tab.id === 'blogs').count = response.totalCount;
        this.sortBlogs();
      } catch {
        this.blogs = [];
      } finally {
        this.$refs.loadingSpinner.hideSpinner();
      }
    },
    async fetchRoadmaps() {
      try {
        this.$refs.loadingSpinner.showSpinner();
        const params = { pageIndex: this.currentPageRoadmaps - 1, pageSize: this.pageSize, creatorId: this.currentUserId };
        const response = await getRoadmaps(params);
        this.roadmaps = response.items || [];
        this.totalPagesRoadmaps = Math.ceil(response.totalCount / this.pageSize);
        this.tabs.find(tab => tab.id === 'roadmaps').count = response.totalCount;
        this.sortRoadmaps();
      } catch {
        this.roadmaps = [];
      } finally {
        this.$refs.loadingSpinner.hideSpinner();
      }
    },
    async fetchCourses() {
      try {
        this.$refs.loadingSpinner.showSpinner();
        const params = { pageIndex: this.currentPageCourses - 1, pageSize: this.pageSize, creatorId: this.currentUserId };
        const response = await getCourses(params);
        this.courses = response.items || [];
        this.totalPagesCourses = Math.ceil(response.totalCount / this.pageSize);
        this.tabs.find(tab => tab.id === 'courses').count = response.totalCount;
        this.sortCourses();
      } catch {
        this.courses = [];
      } finally {
        this.$refs.loadingSpinner.hideSpinner();
      }
    },
    getStatusClass(status) {
      if (status === 'pending') return 'bg-warning text-dark'
      if (status === 'approved') return 'bg-success'
      if (status === 'rejected') return 'bg-danger'
      return 'bg-secondary'
    },
    handleBlogCreated() {
      toast.success("Bài viết đã được tạo thành công!");
      this.fetchBlogs();
    },
    handleCourseCreated() {
      toast.success("Khóa học đã được tạo thành công!");
      this.fetchCourses();
    },
    handleRoadmapCreated() {
      toast.success("Lộ trình đã được tạo thành công!");
      this.fetchRoadmaps();
    }
  },
  computed: {
    currentUserId() {
      return JSON.parse(localStorage.getItem('userProfile')).id;
    },
    filteredCourses() {
      return this.courses.filter(item => item.title.toLowerCase().includes(this.searchQuery.courses.toLowerCase()))
    },
    filteredBlogs() {
      return this.blogs.filter(item => item.title.toLowerCase().includes(this.searchQuery.blogs.toLowerCase()))
    },
    filteredRoadmaps() {
      return this.roadmaps.filter(item => item.title.toLowerCase().includes(this.searchQuery.roadmaps.toLowerCase()))
    }
  },
  mounted() {
    const link = document.createElement('link')
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css'
    link.rel = 'stylesheet'
    document.head.appendChild(link)

    this.$refs.loadingSpinner.showSpinner();
    Promise.all([
      this.fetchBlogs(),
      this.fetchCourses(),
      this.fetchRoadmaps()
    ]).finally(() => {
      this.$refs.loadingSpinner.hideSpinner();
    });
  }
}
</script>


<style scoped>
.container {
  width: 72vw;
}
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

.ratio-16x9 {
  position: relative;
  width: 100%;
  padding-top: 56.25%;
  /* 16:9 ratio */
  overflow: hidden;
  border-radius: 0.5rem;
  background-color: #f0f0f0;
}

.ratio-16x9 img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>