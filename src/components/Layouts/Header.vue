<template>
  <!--
    <v-app-bar flat :color="appBarColor" class="px-2" elevation="1">
      <v-app-bar-title class="text-primary font-weight-bold">
        <v-icon color="primary" class="mr-2">mdi-heart-pulse</v-icon>
        Mental Health Roadmap
      </v-app-bar-title>
      <v-spacer></v-spacer>
      
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" variant="text" :color="currentTheme === 'refreshing' ? 'primary' : currentTheme" class="mr-2">
            <v-icon left>mdi-palette</v-icon>
            <span class="d-none d-sm-flex">Theme: {{ formatThemeName(currentTheme) }}</span>
          </v-btn>
        </template>
        <v-list>
          <v-list-item v-for="(theme, index) in availableThemes" :key="index" @click="setTheme(theme.value)">
            <template v-slot:prepend>
              <v-avatar :color="theme.value" size="small"></v-avatar>
            </template>
            <v-list-item-title>{{ theme.name }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      
      <v-btn color="primary" variant="outlined" class="mr-2" prepend-icon="mdi-clipboard-check" @click="startSurvey">
        Take Assessment
      </v-btn>
      <v-btn color="primary" prepend-icon="mdi-account" @click="showStatusPopup = true">
        Update Status
      </v-btn>
    </v-app-bar>-->
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
          <li><router-link class="hovered-link" to="/chat">Cộng Đồng</router-link></li>
          <li><router-link class="hovered-link" to="/faq">FAQ</router-link></li>
        </ul>
      </div>
      <div class="user-actions">
        <NotificationBell v-if="isLoggedIn" id="bell" ref="notificationBell" :isAuthenticated="isLoggedIn" :userId="user.id"/>
        <div v-if="isLoggedIn" class="hovered-link login-btn profile-menu dropdown" @click="toggleProfileMenu" ref="profileMenu">
          <span>Xin chào, {{ user.userName }}</span>
          <img :src="user.avatarUrl" class="user-avatar" alt="User avatar">
          <ul :class="['dropdown-menu', { show: showProfileMenu }]" ref="dropdownMenu">
            <li><router-link to="/profile">Thông tin cá nhân</router-link></li>
            <li><router-link to="/statistics/self-assessment">Thống kê</router-link></li>
            <li><router-link to="/settings">Cài đặt</router-link></li>
            <li v-if="user.role != 1 && user.role != 2" >
              <hr class="menu-divider" />
              <router-link to="/request-advisor">Xét duyệt làm Cố vấn</router-link>
            </li>
            
            <hr class="menu-divider" />
            <li><router-link to="/meetings/schedule">Họp với cố vấn</router-link></li>
            <li><router-link to="/courses/enrolled">Khóa học đã tham gia</router-link></li>

            <li v-if="user.role === 1">
              <hr class="menu-divider" />
              <router-link to="/advisor/edit-profile">Tài khoản cố vấn</router-link>
              <router-link to="/advisor/content">Nội dung cố vấn</router-link>
              <router-link to="/media/manage">Quản lý tài nguyên</router-link>
            </li>
            
            <li v-if="user.role === 2">
              <hr class="menu-divider" />
              <router-link to="/admin">Quản trị viên</router-link>
              <router-link to="/advisor/content">Nội dung quản trị viên</router-link>
              <router-link to="/yogas/manage">Yoga</router-link>
            </li>

            <li>
              <hr class="menu-divider" />
              <button style="width: 100%;" @click="signOut">Đăng xuất</button>
            </li>
          </ul>
        </div>
        <router-link v-else to="/sign-in">
          <div class="text-dark login-btn">Đăng nhập</div>
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
            userName: clientData.fullName || clientData.userName || 'User',
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

    toggleProfileMenu(event) {
      event.stopPropagation();
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
      const profileMenu = this.$refs.profileMenu;
      const dropdown = this.$refs.dropdownMenu;

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
  height: 70px;
  background: linear-gradient(to right, #ffffff, #f8f9fa);
  position: fixed;
  top: 0;
  z-index: 1000;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.05);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.header .navbar {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  height: 70px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 30px;
}

.menu ul {
  display: flex;
  margin-left: 45px;
  gap: 10px;
}

.menu ul li {
  padding: 0 15px;
  cursor: pointer;
  font-size: 15px;
  font-weight: 600;
  line-height: 70px;
  position: relative;
  transition: all 0.3s ease;
}

.menu ul li::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 3px;
  background: linear-gradient(to right, #3b82f6, #2563eb);
  transition: width 0.3s ease;
  border-radius: 2px;
}

.menu ul li:hover::after {
  width: 80%;
}

#bell {
  margin-right: 15px;
  margin-top: 3px;
}

.user-actions {
  display: flex;
  align-items: center;
  gap: 15px;
}

.notification,
.profile-menu {
  position: relative;
  cursor: pointer;
}

.profile-menu {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  border-radius: 25px;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;
  padding: 8px 20px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.2);
}

.profile-menu:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.3);
}

.profile-menu span {
  color: white;
  font-weight: 500;
}

.user-avatar {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid white;
  transition: all 0.3s ease;
}

.profile-menu:hover .user-avatar {
  transform: scale(1.1);
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  z-index: 1000;
  display: block;
  width: 240px;
  padding: 8px 0;
  opacity: 0;
  transform: translateY(-10px);
  transition: opacity 0.2s ease, transform 0.2s ease;
  pointer-events: none;
  visibility: hidden;
}

.dropdown-menu.show {
  opacity: 1;
  transform: translateY(0);
  pointer-events: all;
  visibility: visible;
}

.dropdown-menu li {
  padding: 0;
  font-size: 14px;
  cursor: pointer;
  color: #333;
  transition: all 0.2s ease;
}

.dropdown-menu li a,
.dropdown-menu li button {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  font-size: 14px;
  color: #333;
  text-decoration: none;
  border: none;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
}

.dropdown-menu li a:hover,
.dropdown-menu li button:hover {
  background-color: #f0f7ff;
  color: #3b82f6;
  padding-left: 25px;
}

.menu-divider {
  border: none;
  border-bottom: 1px solid #e8f2ff;
  margin: 8px 0;
}

.login-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  border-radius: 25px;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;
  padding: 8px 20px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.2);
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.3);
}

.hovered-link {
  color: #333;
  transition: all 0.3s ease;
}

.hovered-link:hover {
  color: #3b82f6;
}

@media (max-width: 768px) {
  .menu {
    display: none;
    flex-direction: column;
    background-color: white;
    position: absolute;
    top: 70px;
    left: 0;
    width: 100%;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    padding: 20px 0;
  }

  .menu ul {
    flex-direction: column;
    margin: 0;
    padding: 0;
  }

  .menu ul li {
    padding: 15px 0;
    text-align: center;
    line-height: 1.5;
  }

  .menu ul li::after {
    display: none;
  }

  .navbar {
    padding: 0 20px;
  }

  .menu-toggle {
    display: block !important;
    cursor: pointer;
    font-size: 24px;
    color: #333;
    transition: color 0.3s ease;
  }

  .menu-toggle:hover {
    color: #3b82f6;
  }

  .menu.show {
    display: flex;
  }

  .user-actions {
    gap: 10px;
  }

  .login-btn {
    padding: 6px 15px;
    font-size: 13px;
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

/* Animation for dropdown menu */
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.dropdown-menu {
  animation: none; /* Remove the animation */
}
</style>