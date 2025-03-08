<template>
  <div class="grant-admin">
    <h1>User Management</h1>
    <data-table :data="users" :columns="columns">
      <template v-slot:actions="{ row }">
        <button class="icon-button" @click="openUserDetail(row)" title="View Details">
          <i class="fas fa-eye"></i>
        </button>
        <button class="icon-button" v-if="row.role !== 'Admin'" @click="openUpgradeAdmin(row)" title="Upgrade to Admin">
          <i class="fas fa-user-shield"></i>
        </button>
      </template>
    </data-table>

    <user-detail-popup
      :show="showUserDetail"
      :user="selectedUser"
      @close="showUserDetail = false"
    />

    <upgrade-admin-popup
      :show="showUpgradeAdmin"
      :user="selectedUser"
      @close="showUpgradeAdmin = false"
      @confirm="handleUpgradeConfirm"
    />
  </div>
</template>

<script>
import DataTable from '@/views/Admin/DataTable.vue';
import UserDetailPopup from '@/views/Admin/UserDetailPopup.vue';
import UpgradeAdminPopup from '@/views/Admin/UpgradeAdminPopup.vue';

export default {
  components: {
    DataTable,
    UserDetailPopup,
    UpgradeAdminPopup,
  },
  data() {
    return {
      showUserDetail: false,
      showUpgradeAdmin: false,
      selectedUser: null,
      users: [
        { id: 1, name: 'Nguyễn Văn A', email: 'a@example.com', role: 'Member' },
        { id: 2, name: 'Trần Thị B', email: 'b@example.com', role: 'Member' },
        { id: 3, name: 'Lê Văn C', email: 'c@example.com', role: 'Admin' },
        { id: 4, name: 'Phạm Thị D', email: 'd@example.com', role: 'Member' },
        { id: 5, name: 'Hoàng Văn E', email: 'e@example.com', role: 'Member' },
        { id: 6, name: 'Đỗ Thị F', email: 'f@example.com', role: 'Member' },
        { id: 7, name: 'Ngô Văn G', email: 'g@example.com', role: 'Member' },
        { id: 8, name: 'Vũ Thị H', email: 'h@example.com', role: 'Member' },
        { id: 9, name: 'Đặng Văn I', email: 'i@example.com', role: 'Member' },
        { id: 10, name: 'Bùi Thị K', email: 'k@example.com', role: 'Member' },
        { id: 11, name: 'Lý Văn L', email: 'l@example.com', role: 'Member' },
        { id: 12, name: 'Mai Thị M', email: 'm@example.com', role: 'Member' },
      ],
      columns: [
        { title: 'User ID', key: 'id' },
        { title: 'Name', key: 'name' },
        { title: 'Email', key: 'email' },
        { title: 'Role', key: 'role' },
      ],
    };
  },
  methods: {
    openUserDetail(user) {
      this.selectedUser = user;
      this.showUserDetail = true;
    },
    openUpgradeAdmin(user) {
      this.selectedUser = user;
      this.showUpgradeAdmin = true;
    },
    handleUpgradeConfirm(data) {
      console.log('Upgrading user with data:', data);
      const userIndex = this.users.findIndex(u => u.id === data.userId);
      if (userIndex !== -1) {
        this.users[userIndex].role = 'Admin';
      }
    }
  },
  mounted() {
    const link = document.createElement('link');
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  },
};
</script>

<style scoped>
.grant-admin {
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

h1 {
  color: #333;
}

.icon-button {
  width: 40px;
  height: 40px;
  margin-right: 10px;
  padding: 8px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  background-color: #007bff;
  color: white;
  transition: all 0.3s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.icon-button:hover {
  background-color: #0056b3;
  transform: translateY(-2px);
}

.icon-button i {
  font-size: 1.2rem;
}

.icon-button .fa-eye {
  color: white;
}

.icon-button .fa-user-shield {
  color: #00ff00;
}
</style>
