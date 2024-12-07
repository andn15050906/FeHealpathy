<template>
  <div class="header">
    <div class="navbar">
      <div class="logo">
        <router-link class="text-dark" to="/">
          <img src="../../../public/assets/images/logo.png" alt="Logo">
        </router-link>
      </div>
      <div class="menu">
        <ul>
          <li><router-link class="text-dark" to="/">Home</router-link></li>
          <li><router-link class="text-dark" to="/courses">Courses</router-link></li>
          <li><router-link class="text-dark" to="/group">Learning Groups</router-link></li>
          <li><router-link class="text-dark" to="/contact">Contact</router-link></li>
        </ul>
      </div>
      <div class="user-actions">
        <div v-if="isLoggedIn" class="text-dark login-btn profile dropdown" @click="toggleProfileMenu">
          <span>{{ user.name }}</span>
          <i @click.stop="signOut" title="Logout"><font-awesome-icon icon="sign-out-alt" class="logout-icon" /></i>
          <ul class="dropdown-menu" v-if="showProfileMenu">
            <li v-if="user.role === 'Admin'"><router-link to="/admin">Admin View</router-link></li>
            <li v-if="user.role === 'Instructor'"><router-link to="/instructor">Instructor View</router-link></li>
            <li><router-link to="/profile">Profile</router-link></li>
            <li><router-link to="/enrolled-courses">Enrolled Courses</router-link></li>
          </ul>
        </div>
        <router-link v-else to="/sign-in">
          <div class="text-dark login-btn">Login</div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { getClientInfo } from '@/services/userService';
import { signOut } from '@/services/authService';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
// import { getNotifications, updateNotification } from '@/services/notificationService';

library.add(faSignOutAlt);

export default {
  data() {
    return {
      isLoggedIn: false,
      user: {
        name: '',
        role: ''
      },
      // notifications: [],
      // showNotifications: false,
      showProfileMenu: false
    };
  },

  async mounted() {
    await this.fetchUserProfile();
    // await this.fetchNotifications();
  },

  components: {
    'font-awesome-icon': FontAwesomeIcon,
  },

  methods: {
    async fetchUserProfile() {
      try {
        const clientData = await getClientInfo();
        console.log('clientData:', clientData);

        if (clientData) {
          this.isLoggedIn = true;
          this.user = { name: clientData.userName || 'User', role: clientData.role || 'Learner' };
          console.log('User Info:', this.user);
        } else {
          console.log('User not logged in or invalid status');
        }
      } catch (error) {
        console.error('Error fetching user status:', error);
      }
    },

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
    toggleProfileMenu() {
      this.showProfileMenu = !this.showProfileMenu;
    },
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

    async signOut() {
      try {
        await signOut();

        this.isLoggedIn = false;
        this.user = { name: '', role: '' };

        await this.$router.push('/sign-in');
      } catch (error) {
        console.error('Error signing out:', error);
      }
    },
  }
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

.logo img {
  max-height: 40px;
}

.menu ul {
  display: flex;
}

.menu ul li {
  padding: 0 15px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  line-height: 60px;
}

.user-actions {
  display: flex;
  align-items: center;
}

.notification,
.profile {
  position: relative;
  margin-left: 10px;
  cursor: pointer;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  background: white;
  list-style: none;
  padding: 10px;
  border: 1px solid #ccc;
}

.dropdown-menu li {
  padding: 5px 10px;
}

.login-btn {
  display: flex;
  /* Đổi sang flex để dễ dàng căn chỉnh */
  align-items: center;
  /* Canh giữa biểu tượng và tên */
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  border-radius: 20px;
  /* Bo góc */
  background-color: #f3ef51;
  /* Màu nền */
  padding: 5px 20px;
  transition: background-color 0.3s;
}

.login-btn:hover {
  background-color: #e0dc42;
  /* Hiệu ứng hover */
}

.logout-icon {
  margin-left: 10px;
  /* Cách một khoảng nhỏ bên trái */
  font-size: 16px;
  /* Kích thước biểu tượng */
  cursor: pointer;
  color: #000;
  /* Màu sắc biểu tượng */
}

.logout-icon:hover {
  color: #ff0000;
  /* Đổi màu khi hover vào biểu tượng */
}
</style>
