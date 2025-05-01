<template>
    <div>
      <table class="data-table">
        <thead>
          <tr>
            <th v-for="column in columns" :key="column.key">{{ column.title }}</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, index) in paginatedData" :key="index">
            <td v-for="column in columns" :key="column.key">{{ row[column.key] }}</td>
            <td>
              <slot name="actions" :row="row"></slot>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="pagination-info">
        <span>Hiển thị từ {{ startIndex + 1 }} đến {{ endIndex }} trong {{ data.length }} bản ghi</span>
        <div class="pagination-controls">
          <button :disabled="currentPage === 1" @click="currentPage--">Trang trước</button>
          <span class="page-number">{{ currentPage }}</span>
            <button :disabled="currentPage >= totalPages" @click="currentPage++">Trang tiếp</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      data: {
        type: Array,
        required: true,
      },
      columns: {
        type: Array,
        required: true,
      },
    },
    data() {
      return {
        currentPage: 1,
        itemsPerPage: 10,
      };
    },
    computed: {
      totalPages() {
        return Math.ceil(this.data.length / this.itemsPerPage);
      },
      paginatedData() {
        const start = (this.currentPage - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        return this.data.slice(start, end);
      },
      startIndex() {
        return (this.currentPage - 1) * this.itemsPerPage;
      },
      endIndex() {
        return Math.min(this.startIndex + this.itemsPerPage, this.data.length);
      },
    },
  };
  </script>
  
  <style scoped>
  .data-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
  }
  
  .data-table th,
  .data-table td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid #ddd;
  }
  
  .data-table th {
    background-color: #007bff;
    color: white;
  }
  
  .data-table tbody tr:hover {
    background-color: #e9ecef;
  }

  .pagination-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
    padding: 10px;
  }

  .pagination-controls {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .pagination-controls button {
    padding: 5px 10px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  .pagination-controls button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }

  .page-number {
    padding: 5px 10px;
    background-color: #f8f9fa;
    border: 1px solid #dee2e6;
    border-radius: 4px;
  }
  </style>