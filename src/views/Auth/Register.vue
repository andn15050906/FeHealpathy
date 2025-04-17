<template>
  <div class="register-page">
    <div class="overlay">
      <div class="register-container">
        <h2>Đăng Ký Tài Khoản</h2>
        <form @submit.prevent="handleRegister">
          <p v-if="generalError" class="error">{{ generalError }}</p>

          <div class="input-group">
            <label for="username">Tên tài khoản</label>
            <input type="text" id="username" v-model="username" placeholder="Nhập tài khoản của bạn" required />
          </div>

          <div class="input-group">
            <label for="email">Email</label>
            <input type="email" id="email" v-model="email" placeholder="Nhập địa chỉ email của bạn" required />
          </div>

          <div class="input-group">
            <label for="password">Mật khẩu</label>
            <input type="password" id="password" v-model="password" placeholder="Nhập mật khẩu của bạn" required />
            <p v-if="passwordError" class="error">{{ passwordError }}</p>
          </div>

          <div class="input-group">
            <label for="retype-password">Nhập lại mật khẩu</label>
            <input type="password" id="retype-password" v-model="retypePassword" placeholder="Nhập lại mật khẩu của bạn"
              required />
            <p v-if="retypePasswordError" class="error">{{ retypePasswordError }}</p>
          </div>

          <button type="submit" class="register-button">Đăng ký</button>
        </form>

        <p class="login">
          Đã có tài khoản rồi? <router-link to="/sign-in">Đăng nhập tại đây</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, inject } from 'vue';
import { useRouter } from 'vue-router';
import { register } from '@/scripts/api/services/authService';

export default {
  setup() {
    const router = useRouter();
    const loadingSpinner = inject('loadingSpinner');

    const username = ref("");
    const email = ref("");
    const password = ref("");
    const retypePassword = ref("");
    const passwordError = ref("");
    const retypePasswordError = ref("");
    const generalError = ref("");

    const validatePassword = () => {
      const minLength = 6;
      const hasUpperCase = /[A-Z]/.test(password.value);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password.value);

      if (password.value.length < minLength) {
        passwordError.value = "Mật khẩu phải có ít nhất 6 ký tự.";
        return false;
      } else if (!hasUpperCase) {
        passwordError.value = "Mật khẩu phải có ít nhất một chữ in hoa.";
        return false;
      } else if (!hasSpecialChar) {
        passwordError.value = "Mật khẩu phải có ít nhất một ký tự đặc biệt.";
        return false;
      } else {
        passwordError.value = "";
        return true;
      }
    };

    const validateRetypePassword = () => {
      if (passwordError.value) {
        retypePasswordError.value = "";
        generalError.value = "";
        return true;
      }
      if (password.value !== retypePassword.value) {
        retypePasswordError.value = "Mật khẩu không khớp.";
        generalError.value = "";
        return false;
      }
      return true;
    };

    const validateEmail = () => {
      const emailPattern = /^[^\s@]+@[^\s@]+\.com$/;
      if (!emailPattern.test(email.value)) {
        generalError.value = "Email phải kết thúc bằng .com";
        return false;
      }
      generalError.value = "";
      return true;
    };

    const handleRegister = async () => {
      const isPasswordValid = validatePassword();
      const isRetypePasswordValid = validateRetypePassword();
      const isEmailValid = validateEmail();

      if (isPasswordValid && isRetypePasswordValid && isEmailValid) {
        try {
          if (loadingSpinner) {
            loadingSpinner.showSpinner();
          }
          await register(username.value, email.value, password.value);
          retypePasswordError.value = "";
          generalError.value = 'Đăng ký thành công';
          setTimeout(() => router.push({ name: 'signIn' }), 2000);
        } catch (error) {
          if (error.response?.status === 409) {
            const errorMessage = error.response?.data?.message || error.response?.data;
            if (errorMessage?.toLowerCase().includes('email')) {
              generalError.value = "Email này đã được đăng ký";
            } else {
              generalError.value = "Tên tài khoản này đã được sử dụng";
            }
          } else if (error.response?.data?.errors) {
            let errors = error.response.data.errors;
            for (let key in errors) {
              if (errors[key][0].startsWith('400')) {
                retypePasswordError.value = "";
                generalError.value = errors[key][0].substring(5);
                break;
              }
            }
          } else {
            generalError.value = 'Lỗi kết nối. Vui lòng kiểm tra kết nối và thử lại.';
          }
        } finally {
          if (loadingSpinner) {
            loadingSpinner.hideSpinner();
          }
        }
      }
    };

    return {
      username,
      email,
      password,
      retypePassword,
      passwordError,
      retypePasswordError,
      generalError,
      handleRegister
    };
  }
};
</script>

<style>
.page-container:has(.register-page) {
  background-color: unset !important;
}
</style>

<style scoped>
.register-page {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.overlay {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.register-container {
  width: 400px;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  border-radius: 8px;
  backdrop-filter: blur(10px);
}

.logo {
  width: 150px;
  margin-bottom: 1rem;
}

h2 {
  margin-bottom: 1.5rem;
  color: #333;
}

.input-group {
  margin-bottom: 1rem;
  text-align: left;
}

.input-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #555;
  font-size: 0.9rem;
}

.input-group input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.error {
  color: red;
  font-size: 0.8rem;
  margin-top: 0.5rem;
}

.register-button {
  width: 100%;
  padding: 0.7rem;
  background-color: #ff6600;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
}

.register-button:hover {
  background-color: #e65c00;
}

.login {
  margin-top: 1rem;
  font-size: 0.9rem;
  color: #555;
}

.login a {
  color: #ff6600;
  text-decoration: none;
}

.login a:hover {
  text-decoration: underline;
}
</style>

