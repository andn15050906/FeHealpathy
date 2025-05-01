<template>
  <div class="header">
    <div class="navbar">
      <Logo :height="40" />
      <button class="menu-toggle" @click="toggleMenu">☰</button>
      <div class="menu">
        <ul>
          <li><router-link class="hovered-link" to="/">Trang Chủ</router-link></li>
          <li><router-link class="hovered-link" to="/practice">Công Cụ</router-link></li>
          <li><router-link class="hovered-link" to="/blogs">Bài Viết</router-link></li>
          <li><router-link class="hovered-link" to="/courses">Khóa Học</router-link></li>
          <li><router-link class="hovered-link" to="/community">Cộng Đồng</router-link></li>
          <li><router-link class="hovered-link" to="/faq">FAQ</router-link></li>
        </ul>
      </div>
      <div class="user-actions">
        <NotificationBell v-if="isLoggedIn" id="bell" ref="notificationBell" :isAuthenticated="isLoggedIn" :userId="user.id"/>
        <div v-if="isLoggedIn" class="hovered-link login-btn profile-menu dropdown" @click="toggleProfileMenu">
          <span>Xin chào, {{ user.userName }}</span>
          <img :src="user.avatarUrl" class="user-avatar" alt="User avatar">
          <ul v-if="showProfileMenu" class="dropdown-menu">
            <li><router-link to="/profile">Thông tin cá nhân</router-link></li>
            <li><router-link to="/statistics/self-assessment">Thống Kê</router-link></li>
            <li><router-link to="/settings">Cài Đặt</router-link></li>
            
            <hr class="menu-divider" />
            <li><router-link to="/meetings/schedule">Họp Với Cố Vấn</router-link></li>
            <li><router-link to="/courses/enrolled">Các Khóa Học Đã Tham Gia</router-link></li>

            <li v-if="user.role != 1 && user.role != 2" >
              <hr class="menu-divider" />
              <router-link to="/request-advisor">Xét Duyệt Làm Cố Vấn</router-link>
            </li>

            <li v-if="user.role === 1">
              <hr class="menu-divider" />
              <router-link to="/advisor/edit-profile">Quản Lý Thông Tin Cố Vấn</router-link>
              <router-link to="/advisor/content">Quản Lý Nội Dung Cố Vấn</router-link>
              <router-link to="/media/manage">Quản Lý Tài Nguyên</router-link>
            </li>
            
            <li v-if="user.role === 2">
              <hr class="menu-divider" />
              <router-link to="/admin">Quản Trị Viên</router-link>
              <router-link to="/advisor/content">Quản Lý Nội Dung Cố Vấn</router-link>
              <router-link to="/yogas/manage">Yoga</router-link>
            </li>

            <li>
              <hr class="menu-divider" />
              <button style="width: 100%;" @click="signOut">Đăng Xuất</button>
            </li>
          </ul>
        </div>
        <router-link v-else to="/sign-in">
          <div class="text-dark login-btn">Đăng Nhập</div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { getUserProfile, signOut } from '@/scripts/api/services/authService';
import Logo from '@/components/Common/Misc/Logo.vue';
// import { getNotifications, updateNotification } from '@/scripts/api/services/notificationService';
import NotificationBell from "@/components/NotificationComponents/NotificationBell.vue";

export default {
  data() {
    return {
      isLoggedIn: false,
      user: {
        userName: '',
        role: '',
        avatarUrl: ''
      },
      //cập nhật data vào methods
      // notifications: [],
      // showNotifications: false,
      showProfileMenu: false
    };
  },

  components: {
    Logo,
    NotificationBell
  },

  async mounted() {
    await this.fetchUserProfile();
    // await this.fetchNotifications();
    document.addEventListener('click', this.handleClickOutside);
  },

  beforeDestroy() {
    document.removeEventListener('click', this.handleClickOutside);
  },

  methods: {
    async fetchUserProfile() {
      try {
        const clientData = await getUserProfile();
        if (clientData) {
          this.isLoggedIn = true;
          this.user = {
            id: clientData.id,
            userName: clientData.userName || 'User',
            role: clientData.role || 'Member',
            avatarUrl: clientData.avatarUrl || 'src/img/8f1ca2029e2efceebd22fa05cca423d7.jpg' // Lấy avatar từ profile hoặc dùng ảnh mặc định
          };
        }
        console.log("Vai trò người dùng:", this.user.role);
      } catch (error) {
          console.error('Lỗi khi lấy trạng thái người dùng:', error);
      }
    },

    toggleMenu() {
      this.menuVisible = !this.menuVisible;
      const menu = this.$el.querySelector('.menu');
      if (menu) {
        menu.classList.toggle('show', this.menuVisible);
      }
    },

    toggleProfileMenu() {
      this.showProfileMenu = !this.showProfileMenu;
    },

    async signOut() {
      try {
        await signOut();
				this.$emit('authenticated', false);
        this.isLoggedIn = false;
        this.user = { name: '', role: '', avatarUrl: '' };
        this.$router.push({ name: 'signIn' });
      } catch (error) {
        console.error('Lỗi khi đăng xuất:', error);
      }
    },

    handleClickOutside(event) {
      const dropdown = this.$el.querySelector('.dropdown-menu');
      const profileMenu = this.$el.querySelector('.profile-menu');

      if (profileMenu && !profileMenu.contains(event.target) && dropdown && !dropdown.contains(event.target)) {
        this.showProfileMenu = false;
      }
    }

    // async fetchNotifications() {
    //   try {
    //     if (this.isLoggedIn) {
    //       const notifications = await getNotifications(this.user.id);
    //       this.notifications = notifications;
    //     }
    //   } catch (error) {
    //     console.error('Error fetching notifications:', error);
    //   }
    // },
    // toggleNotifications() {
    //   this.showNotifications = !this.showNotifications;
    //   if (this.showNotifications) {
    //     this.markNotificationsAsRead();
    //   }
    // },

    // async markNotificationsAsRead() {
    //   try {
    //     for (const notification of this.notifications) {
    //       if (notification.status === 'unread') {
    //         await updateNotification(notification.id, 'read');
    //       }
    //     }
    //     await this.fetchNotifications();
    //   } catch (error) {
    //     console.error('Error marking notifications as read:', error);
    //   }
    // },
  },

  props: {
    isAuthenticated: {
      type: Boolean,
      required: true,
    },
  },
  
};

</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Nunito', sans-serif;
}

a {
  text-decoration: none;
}

ul {
  list-style: none;
}

.header {
  width: 100%;
  height: 60px;
  background-color: #fff;
  position: fixed;
  top: 0;
  z-index: 1000;
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}

.header .navbar {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}

.menu ul {
  display: flex;
  margin-left: 45px;
}

.menu ul li {
  padding: 0 25px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  line-height: 60px;
}

#bell {
  margin-right: 10px;
  margin-top: 3px;
}

.user-actions {
  display: flex;
  align-items: center;
}

.notification,
.profile-menu {
  position: relative;
  margin-left: 10px;
  cursor: pointer;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  display: block;
  width: max-content;
  left: 0;
  width: 100%;
}

.dropdown-menu li {
  padding: 0;
  font-size: 14px;
  cursor: pointer;
  color: #333;
  transition: background-color 0.2s;
}

.dropdown-menu li a,
.dropdown-menu li button {
  display: block;
  padding: 10px 20px;
  font-size: 14px;
  color: #333;
  text-decoration: none;
  border: none;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.2s;
}

.dropdown-menu li a:hover,
.dropdown-menu li button:hover {
  background-color: #f3f3f3;
}

.menu-divider {
  border: none;
  border-bottom: 1px solid #ccc;
  margin: 5px 0;
}
.login-btn {
  display: flex;
  align-items: center;
  gap: 10px; 
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  border-radius: 20px;
  background-color: #f3ef51;
  padding: 5px 15px 5px 20px;
  transition: background-color 0.3s;
}

.login-btn:hover {
  background-color: #e0dc42;
}

.logout-icon {
  margin-left: 10px;
  font-size: 16px;
  cursor: pointer;
  color: #000;
}

.logout-icon:hover {
  color: #ff0000;
}

.hovered-link {
  color: #000;
}

.hovered-link:hover {
  opacity: 1;
  color: #3db83b;
}

.user-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  object-fit: cover;
  margin-left: auto;
}

@media (max-width: 768px) {
  .menu {
    display: none;
    flex-direction: column;
    background-color: #f8f9fa;
    position: absolute;
    top: 60px;
    left: 0;
    width: 100%;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .menu ul {
    flex-direction: column;
    padding: 10px 0;
  }

  .menu ul li {
    margin: 10px 0;
    text-align: center;
  }

  .navbar {
    flex-wrap: wrap;
  }

  .menu-toggle {
    display: block !important;
    cursor: pointer;
    font-size: 24px;
  }

  .menu.show {
    display: flex;
  }
}

.menu-toggle {
  display: none;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
}

.menu-toggle:focus {
  outline: none;
}

</style>