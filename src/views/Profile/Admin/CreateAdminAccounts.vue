<template>
  <div class="container py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1 class="h2 mb-0 d-flex align-items-center">
        <UserCog class="me-2" :size="28" />
        Quản lý tài khoản người dùng
      </h1>
    </div>

    <div class="card">
      <div class="card-body">
        <data-table :data="users" :columns="columns">
          <template v-slot:actions="{ row }">
            <div class="d-flex gap-2">
              <button class="btn btn-outline-primary btn-sm d-flex align-items-center" @click="openUserDetail(row)"
                title="Xem chi tiết">
                <Eye :size="16" />
              </button>
              <button v-if="row.role !== 2" class="btn btn-outline-success btn-sm d-flex align-items-center"
                @click="openUpgradeAdmin(row)" title="Nâng cấp thành Admin">
                <Shield :size="16" />
              </button>
              <button v-if="row.role !== 2" class="btn btn-outline-danger btn-sm d-flex align-items-center"
                @click="openBanConfirmation(row)" title="Ban người dùng">
                <Ban :size="16" />
              </button>
            </div>
          </template>
        </data-table>
      </div>
    </div>

    <user-detail-popup :show="showUserDetail" :user="selectedUser" @close="showUserDetail = false" />

    <upgrade-admin-popup :show="showUpgradeAdmin" :user="selectedUser" @close="showUpgradeAdmin = false"
      @confirm="handleUpgradeConfirm" />

    <SaveConfirmPopUp :message="banConfirmMessage" :is-visible="showBanConfirm" @confirm-save="handleBanConfirm"
      @update:is-visible="showBanConfirm = $event" />
  </div>
</template>

<script>
import { Eye, Shield, Ban, UserCog } from 'lucide-vue-next'
import DataTable from "@/views/Profile/Admin/DataTable.vue"
import UserDetailPopup from "@/views/Profile/Admin/UserDetailPopup.vue"
import UpgradeAdminPopup from "@/views/Profile/Admin/UpgradeAdminPopup.vue"
import SaveConfirmPopUp from '../../../components/Common/Popup/SaveConfirmPopUp.vue'
import { getUsers } from "@/scripts/api/services/userService"
import { submitUserBanned } from "@/scripts/api/services/notificationService"

export default {
  name: 'CreateAdminAccounts',
  components: {
    DataTable,
    UserDetailPopup,
    UpgradeAdminPopup,
    SaveConfirmPopUp,
    Eye,
    Shield,
    Ban,
    UserCog
  },
  data() {
    return {
      showUserDetail: false,
      showUpgradeAdmin: false,
      showBanConfirm: false,
      selectedUser: null,
      banConfirmMessage: '',
      users: [],
      columns: [
        { title: "Tên", key: "fullName" },
        { title: "Email", key: "email" },
        { title: "Vai trò", key: "role" },
      ],
    }
  },
  methods: {
    async fetchUsers() {
      try {
        const response = await getUsers()
        this.users = response.items.filter(_ => _.id != '00000000-0000-0000-0000-000000000001')
      } catch (error) {
        console.error("Lỗi khi tải danh sách người dùng:", error)
      }
    },
    openUserDetail(user) {
      this.selectedUser = user
      this.showUserDetail = true
    },
    openUpgradeAdmin(user) {
      this.selectedUser = user
      this.showUpgradeAdmin = true
    },
    handleUpgradeConfirm(data) {
      const userIndex = this.users.findIndex((u) => u.id === data.userId)
      if (userIndex !== -1) {
        this.users[userIndex].role = "Admin"
      }
    },
    openBanConfirmation(user) {
      this.selectedUser = user
      this.banConfirmMessage = `Bạn có chắc chắn muốn ban người dùng ${user.fullName}?`
      this.showBanConfirm = true
    },
    async handleBanConfirm(confirmed) {
      if (confirmed && this.selectedUser) {
        try {
          await submitUserBanned({
            userId: this.selectedUser.id,
            message: "Bạn đã bị cấm do vi phạm chính sách của chúng tôi.",
          })
        } catch (error) {
          console.error("Lỗi khi ban người dùng hoặc gửi thông báo:", error)
        }
      }
      this.selectedUser = null
    },
  },
  mounted() {
    this.fetchUsers()
  },
}
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: auto;
}

.card {
  border: none;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
}

.btn {
  transition: all 0.15s ease-in-out;
}

.btn:hover {
  transform: translateY(-1px);
}
</style>