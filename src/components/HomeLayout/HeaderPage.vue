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
        <!-- Check if user is logged in -->
        <div v-if="isLoggedIn">
          <div class="notification dropdown" @click="toggleNotifications">
            <i class="fa fa-bell"></i>
            <ul class="dropdown-menu" v-if="showNotifications">
              <li v-for="(notification, index) in notifications" :key="index">
                {{ notification.message }}
              </li>
            </ul>
          </div>
          <div class="profile dropdown" @click="toggleProfileMenu">
            {{ user.name }}
            <ul class="dropdown-menu" v-if="showProfileMenu">
              <li v-if="user.role === 'Admin'"><router-link to="/admin">Admin View</router-link></li>
              <li v-if="user.role === 'Instructor'"><router-link to="/instructor">Instructor View</router-link></li>
              <li><router-link to="/profile">Profile</router-link></li>
              <li><router-link to="/enrolled-courses">Enrolled Courses</router-link></li>
              <li><router-link to="/sign-out">Sign Out</router-link></li>
            </ul>
          </div>
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
import { getNotifications, updateNotification } from '@/services/notificationService'; 

export default {
  data() {
    return {
      isLoggedIn: false,
      user: {
        name: '',
        role: ''
      },
      notifications: [],
      showNotifications: false,
      showProfileMenu: false
    };
  },
  async mounted() {
    await this.checkUserStatus();
    await this.fetchNotifications();
  },
  methods: {
    async checkUserStatus() {
      try {
        const clientData = await getClientInfo();
        if (clientData.isLoggedIn) {
          this.isLoggedIn = true;
          this.user = { name: clientData.name, role: clientData.role };
          // this.notifications = clientData.notifications;
        }
      } catch (error) {
        console.error('Error fetching user status:', error);
      }
    },
    async fetchNotifications() {
      try {
        if (this.isLoggedIn) {
          const notifications = await getNotifications(this.user.id); 
          this.notifications = notifications;
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    },
    toggleNotifications() {
      this.showNotifications = !this.showNotifications;
      if (this.showNotifications) {
        this.markNotificationsAsRead();
      }
    },
    toggleProfileMenu() {
      this.showProfileMenu = !this.showProfileMenu;
    },
    async markNotificationsAsRead() {
      try {
        for (const notification of this.notifications) {
          if (notification.status === 'unread') {
            await updateNotification(notification.id, 'read');
          }
        }
        await this.fetchNotifications();
      } catch (error) {
        console.error('Error marking notifications as read:', error);
      }
    }
  }
};
</script>

<style scoped>
*{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Nunito', sans-serif;
}

a{
    text-decoration: none;
}

ul{
    list-style: none;
}

.header{
    width: 100%;
    height: 80px;
    background-color: #fff;
    position: fixed;
    top: 0;
}

.header .navbar{
    width: 100%;
    height: 80px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: absolute;
    margin-top: 30px;
}

.logo img{
    margin-left: 100px;
}

.menu ul li{
    display: inline-block;
    padding: 0 25px;
    cursor: pointer;
    font-size: 19px;
    font-weight: 700;
    line-height: 80px;
    align-items: center;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 100px;
  height: 100%;
}

.user-actions {
  display: flex;
  align-items: center;
}

.notification, .profile {
  position: relative;
  margin-left: 15px;
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

.login-btn{
    display: block;
    font-size: 19px;
    font-weight: 700;
    cursor: pointer;
    border-radius: 30px;
    background-color: #f3ef51;
    padding: 8px 40px;
    margin-right: 100px;
}
</style>
