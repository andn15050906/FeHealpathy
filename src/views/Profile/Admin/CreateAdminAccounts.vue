<template>
  <div class="grant-admin">
    <h1>Quản lý tài khoản người dùng</h1>
    <data-table :data="users" :columns="columns">
      <template v-slot:actions="{ row }">
        <button
          class="icon-button"
          @click="openUserDetail(row)"
          title="Xem chi tiết"
        >
          <i class="fas fa-eye"></i>
        </button>
        <button
          class="icon-button"
          v-if="row.role !== 2"
          @click="openUpgradeAdmin(row)"
          title="Nâng cấp thành Admin"
        >
          <i class="fas fa-user-shield"></i>
        </button>
        <button
          class="icon-button ban"
          v-if="row.role !== 2"
          @click="handleBanUser(row)"
          title="Ban người dùng"
        >
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
import DataTable from "@/views/Profile/Admin/DataTable.vue";
import UserDetailPopup from "@/views/Profile/Admin/UserDetailPopup.vue";
import UpgradeAdminPopup from "@/views/Profile/Admin/UpgradeAdminPopup.vue";
import { getUsers } from "@/scripts/api/services/userService";
import { submitUserBanned } from "@/scripts/api/services/notificationService";

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
        { title: "ID", key: "id" },
        { title: "Tên", key: "fullName" },
        { title: "Email", key: "email" },
        { title: "Vai trò", key: "role" },
      ],
    };
  },
  methods: {
    // Lấy danh sách tất cả users từ API
    async fetchUsers() {
      try {
        const response = await getUsers();
        console.log("Dữ liệu người dùng:", response.items);
        this.users = response.items;
      } catch (error) {
        console.error("Lỗi khi tải danh sách người dùng:", error);
      }
    },

    // Mở popup hiển thị chi tiết thông tin user
    openUserDetail(user) {
      console.log("Người dùng đã chọn:", user);
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
      console.log("Nâng cấp người dùng với dữ liệu:", data);
      const userIndex = this.users.findIndex((u) => u.id === data.userId);
      if (userIndex !== -1) {
        this.users[userIndex].role = "Admin";
      }
    },

    // Xử lý khi click nút ban user
    async handleBanUser(user) {
      if (confirm(`Bạn có chắc chắn muốn ban người dùng ${user.fullName}?`)) {
        try {
          // TODO: Gọi API ban user
          // 1. Gọi API ban user với user ID
          // 2. Cập nhật trạng thái user trong danh sách
          // const userIndex = this.users.findIndex((u) => u.id === user.id);
          // if (userIndex !== -1) {
          //   this.users[userIndex].role = "Banned";
          // }
          // 3. Hiển thị thông báo thành công/thất bại
          console.log("Ban người dùng:", user);

          // Send notification ban user
          await submitUserBanned({
            userId: user.id,
            message: "Bạn đã bị cấm do vi phạm chính sách của chúng tôi.",
          });
        } catch (error) {
          console.error("Lỗi khi ban người dùng hoặc gửi thông báo:", error);
        }
      }
    },
  },
  mounted() {
    this.fetchUsers();
    if (!document.querySelector('link[href*="font-awesome"]')) {
      const link = document.createElement("link");
      link.href =
        "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css";
      link.rel = "stylesheet";
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
