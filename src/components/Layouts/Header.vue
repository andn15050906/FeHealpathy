<template>
  <div class="header">
    <div class="navbar">
      <Logo :height="40" />
      <div class="menu">
        <ul>
          <li><router-link class="hovered-link" to="/">Home</router-link></li>
          <li><router-link class="hovered-link" to="/practice">Practice</router-link></li>
          <li><router-link class="hovered-link" to="/blogs">Blogs</router-link></li>
          <li><router-link class="hovered-link" to="/courses">Courses</router-link></li>
          <li><router-link class="hovered-link" to="/community">Community</router-link></li>
          <li><router-link class="hovered-link" to="/about-us">About us</router-link></li>
        </ul>
      </div>
      <div class="user-actions">
        <div v-if="isLoggedIn" class="hovered-link login-btn profile dropdown" @click="toggleProfileMenu">
  <span>{{ user.name }}</span>
  <ul v-if="showProfileMenu" class="dropdown-menu">
    <li><router-link to="/profile">Thông tin cá nhân</router-link></li>
    <hr class="menu-divider" />
    <li><router-link to="/change-password">Đổi mật khẩu</router-link></li>
    <hr class="menu-divider" />

    <li v-if="user.role === 'Learner' || user.role === 'Instructor'"><router-link to="/enrolled-course">Khóa học đã mua</router-link></li>
    <li v-if="user.role === 'Instructor'"><router-link to="/courses">Quản lý khóa học</router-link></li>
    <li v-if="user.role === 'Admin'"><router-link to="/admin">Admin</router-link></li>
    <hr v-if="['Learner', 'Instructor', 'Admin'].includes(user.role)" class="menu-divider" />

    <li>
      <button @click="signOut">Đăng xuất</button>
    </li>
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
import Logo from '../Helper/Logo.vue';

export default {
  data() {
    return {
      isLoggedIn: false,
      user: {
        name: '',
        role: ''
      },
      showProfileMenu: false
    };
  },

  async mounted() {
    await this.fetchUserProfile();
    document.addEventListener('click', this.handleClickOutside);
  },

  beforeDestroy() {
    document.removeEventListener('click', this.handleClickOutside);
  },

  methods: {
    async fetchUserProfile() {
    try {
      const clientData = await getClientInfo();
      if (clientData) {
        this.isLoggedIn = true;
        this.user = {
          name: clientData.userName || 'User',
          role: clientData.role || 'Learner',
        };
      } else {
        console.log('User not logged in or invalid status');
      }
    } catch (error) {
      console.error('Error fetching user status:', error);
    }
  },

    toggleProfileMenu() {
      this.showProfileMenu = !this.showProfileMenu;
    },

    async signOut() {
      try {
        await signOut();
        this.isLoggedIn = false;
        this.user = { name: '', role: '' };
        this.$router.push('/sign-in');
      } catch (error) {
        console.error('Error signing out:', error);
      }
    },

    handleClickOutside(event) {
      const dropdown = this.$el.querySelector('.dropdown-menu');
      const profileMenu = this.$el.querySelector('.profile');
      
      if (profileMenu && !profileMenu.contains(event.target) && dropdown && !dropdown.contains(event.target)) {
        this.showProfileMenu = false;
      }
    }
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
}

.menu ul li {
  padding: 0 25px;
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
  left: -50px;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  display: block;
  width: max-content;
}

.dropdown-menu li {
  padding: 0;
  font-size: 14px;
  cursor: pointer;
  color: #333;
  transition: background-color 0.2s;
}

.menu-divider {
  border: none;
  border-bottom: 1px solid #ccc;
  margin: 5px 0;
}

.dropdown-menu li:hover {
  background-color: #f3f3f3;
}


.dropdown-menu li a,
.dropdown-menu li button {
  display: block;
  padding: 10px 20px;
  font-size: 14px;
  color: #333;
  text-decoration: none;
  border: none; /* Xóa viền mặc định của button */
  text-align: left; /* Canh trái nội dung */
  cursor: pointer; /* Con trỏ chuột dạng click */
  transition: background-color 0.2s;
}

.dropdown-menu li a:hover,
.dropdown-menu li button:hover {
  background-color: #f3f3f3;
}

.login-btn {
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  border-radius: 20px;
  background-color: #f3ef51;
  padding: 5px 20px;
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
</style>
