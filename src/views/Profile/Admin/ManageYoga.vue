<template>
  <div v-if="!isEditingYoga" class="py-4">
    <div class="card-body">
      <h1 class="text-center mb-4"><i class="fas fa-spa"></i> Yoga Management</h1>
      <div class="text-center mb-3">
        <router-link :to="{ name: 'CreateYoga' }">
          <button class="btn btn-success">
            <i class="fas fa-plus-circle"></i> Create A Yoga Lesson
          </button>
        </router-link>
      </div>

      <p v-if="isLoading" class="text-center">Loading data...</p>

      <div v-if="!isLoading">
        <div v-if="yogas.length" class="list-group">
          <div v-for="yoga in yogas" :key="yoga.id" class="list-group-item d-flex align-items-center">
            <img :src="yoga.thumbUrl || 'https://placehold.co/150x100'" :alt="yoga.title" class="rounded me-3"
              width="150" height="100">
            <div class="flex-grow-1">
              <h5>{{ yoga.title }}</h5>
              <p class="text-muted">Date: {{ formattedDate(yoga.creationTime) }}</p>
            </div>
            <div>
              <button class="btn btn-warning me-2" @click="editYoga(yoga)">
                <i class="fas fa-edit"></i> Update
              </button>
              <button class="btn btn-danger" @click="openDeletePopup(yoga)">
                <i class="fas fa-trash"></i> Delete
              </button>
            </div>
          </div>
        </div>
        <p v-else class="text-center text-muted">No yoga lessons available!</p>
      </div>
    </div>

    <Pagination :currentPage="currentPage" :totalPages="totalPages" @GoToPage="changePage" />
  </div>

  <UpdateYoga v-if="isEditingYoga" :yogaData="selectedYoga" @yogaUpdated="handleYogaUpdated" />
  <DeleteConfirmPopup :message="'Are you sure you want to delete this yoga lesson?'" :isVisible="isDeletePopupVisible"
    @confirmDelete="handleDeleteConfirm" @update:isVisible="isDeletePopupVisible = $event" />
</template>

<script>
import moment from 'moment';
import { getCourses, deleteCourse } from '@/scripts/api/services/courseService';
import UpdateYoga from './UpdateYoga.vue';
import DeleteConfirmPopup from '@/components/Common/Popup/DeleteConfirmPopup.vue';
import Pagination from '@/components/Common/Pagination.vue';

export default {
  components: { UpdateYoga, DeleteConfirmPopup, Pagination },
  name: "ManageYoga",
  data() {
    return {
      yogas: [],
      currentPage: 1,
      itemsPerPage: 20,
      totalPages: 1,
      totalCount: 0,
      isLoading: false,
      isEditingYoga: false,
      selectedYoga: null,
      isDeletePopupVisible: false,
      yogaToDelete: null,
    };
  },
  methods: {
    async handleDeleteConfirm(confirm) {
      if (confirm && this.yogaToDelete) {
        try {
          await deleteCourse(this.yogaToDelete.id);
          this.fetchYogas();
        } catch (error) {
          alert("Error deleting yoga lesson. Please try again.");
        } finally {
          this.isDeletePopupVisible = false;
          this.yogaToDelete = null;
        }
      } else {
        this.isDeletePopupVisible = false;
      }
    },
    formattedDate(value) {
      return moment(String(value)).format('MM/DD/YYYY hh:mm');
    },
    async fetchYogas() {
      try {
        this.isLoading = true;
        this.yogas = [];
        const params = { pageIndex: this.currentPage - 1, pageSize: this.itemsPerPage };
        const data = await getCourses(params);

        if (data.items) {
          this.yogas = data.items;
          this.totalCount = data.totalCount;
          this.totalPages = data.pageCount;
        } else {
          this.yogas = [];
          this.totalCount = 0;
          this.totalPages = 1;
        }
      } catch (error) {
        console.error("Error fetching yoga lessons:", error);
        this.yogas = [];
        this.totalCount = 0;
        this.totalPages = 1;
      } finally {
        this.isLoading = false;
      }
    },
    changePage(page) {
      if (page !== this.currentPage && page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
        this.yogas = [];
        this.fetchYogas();
      }
    },
  },
  mounted() {
    this.fetchYogas();
  }
};
</script>

<style scoped>
.list-group-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.btn.active {
  background-color: #007bff;
  color: white;
}
</style>