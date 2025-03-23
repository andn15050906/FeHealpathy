<template>
  <div class="grant-admin">
    <h1>User Management</h1>
    <data-table :data="users" :columns="columns">
      <template v-slot:actions="{ row }">
        <button class="icon-button" @click="openUserDetail(row)" title="View Details">
          <i class="fas fa-eye"></i>
        </button>
        <button class="icon-button" v-if="row.role !== 2" @click="openUpgradeAdmin(row)" title="Upgrade to Admin">
          <i class="fas fa-user-shield"></i>
        </button>
        <button class="icon-button ban" v-if="row.role !== 2" @click="handleBanUser(row)" title="Ban User">
          <i class="fas fa-ban"></i>
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
import DataTable from '@/views/Profile/Admin/DataTable.vue';
import UserDetailPopup from '@/views/Profile/Admin/UserDetailPopup.vue';
import UpgradeAdminPopup from '@/views/Profile/Admin/UpgradeAdminPopup.vue';
import { getUsers } from '@/scripts/api/services/userService';

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
      users: [],
      columns: [
        { title: 'User ID', key: 'id' },
        { title: 'Name', key: 'fullName' },
        { title: 'Email', key: 'email' },
        { title: 'Role', key: 'role' },
      ],
    };
  },
  methods: {
    // Lấy danh sách tất cả users từ API
    async fetchUsers() {
      try {
        const response = await getUsers();
        console.log('Users data:', response.items);
        this.users = response.items;
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    },

    // Mở popup hiển thị chi tiết thông tin user
    openUserDetail(user) {
      console.log('Selected user:', user);
      this.selectedUser = user;
      this.showUserDetail = true;
    },

    // Mở popup xác nhận nâng cấp user lên Admin
    openUpgradeAdmin(user) {
      this.selectedUser = user;
      this.showUpgradeAdmin = true;
    },

    // Xử lý khi xác nhận nâng cấp user lên Admin
    handleUpgradeConfirm(data) {
      console.log('Upgrading user with data:', data);
      const userIndex = this.users.findIndex(u => u.id === data.userId);
      if (userIndex !== -1) {
        this.users[userIndex].role = 'Admin';
      }
    },

    // Xử lý khi click nút ban user
    handleBanUser(user) {
      if (confirm(`Are you sure you want to ban user ${user.fullName}?`)) {
        // TODO: Gọi API ban user
        // 1. Gọi API ban user với user ID
        // 2. Cập nhật trạng thái user trong danh sách
        // 3. Hiển thị thông báo thành công/thất bại
        console.log('Banning user:', user);
      }
    }
  },
  mounted() {
    this.fetchUsers();
    if (!document.querySelector('link[href*="font-awesome"]')) {
      const link = document.createElement('link');
      link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css';
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }
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

.icon-button.ban {
  background-color: #dc3545;
}

.icon-button.ban:hover {
  background-color: #c82333;
}

.icon-button.ban i {
  color: white;
}
</style>
