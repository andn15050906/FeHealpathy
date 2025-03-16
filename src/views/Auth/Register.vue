<template>
  <div class="register-page">
    <div class="overlay">
      <div class="register-container">
        <h2>Register</h2>
        <form @submit.prevent="handleRegister">
          <p v-if="generalError" class="error">{{ generalError }}</p>

          <div class="input-group">
            <label for="username">Username</label>
            <input type="text" id="username" v-model="username" placeholder="Enter your username" required />
          </div>

          <div class="input-group">
            <label for="email">Email Address</label>
            <input type="email" id="email" v-model="email" placeholder="Enter your email address" required />
          </div>

          <div class="input-group">
            <label for="password">Password</label>
            <input type="password" id="password" v-model="password" placeholder="Enter your password" required />
            <p v-if="passwordError" class="error">{{ passwordError }}</p>
          </div>

          <div class="input-group">
            <label for="retype-password">Retype Password</label>
            <input type="password" id="retype-password" v-model="retypePassword" placeholder="Retype your password"
              required />
            <p v-if="retypePasswordError" class="error">{{ retypePasswordError }}</p>
          </div>

          <button type="submit" class="register-button">Register</button>
        </form>

        <p class="login">
          Already have an account? <router-link to="/sign-in">Log in here</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { inject } from 'vue';
import { register } from '@/scripts/api/services/authService';
import { useRouter } from 'vue-router';

const router = useRouter();
const loadingSpinner = inject('loadingSpinner');

export default {
  data() {
    return {
			loadingSpinner: loadingSpinner,
      username: "",
      email: "",
      password: "",
      retypePassword: "",
      passwordError: "",
      retypePasswordError: "",
      generalError: ""
    };
  },
  methods: {
    validatePassword() {
      const minLength = 6;
      const hasUpperCase = /[A-Z]/.test(this.password);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(this.password);

      if (this.password.length < minLength) {
        this.passwordError = "Password must be at least 6 characters long.";
        return false;
      } else if (!hasUpperCase) {
        this.passwordError = "Password must include at least one uppercase letter.";
        return false;
      } else if (!hasSpecialChar) {
        this.passwordError = "Password must include at least one special character.";
        return false;
      } else {
        this.passwordError = "";
        return true;
      }
    },
    validateRetypePassword() {
      if (this.passwordError) {
        this.retypePasswordError = "";
        this.generalError = "";
        return true;
      }
      if (this.password !== this.retypePassword) {
        this.retypePasswordError = "Passwords do not match.";
        this.generalError = "";
        return false;
      }
      return true;
    },
    async handleRegister() {
      const isPasswordValid = this.validatePassword();
      const isRetypePasswordValid = this.validateRetypePassword();

      if (isPasswordValid && isRetypePasswordValid) {
        try {
          this.loadingSpinner.showSpinner();
          await register(this.username, this.email, this.password);
          this.retypePasswordError = "";
          this.generalError = 'Registration successful! Please check your email to verify your account.';
          setTimeout(() => router.push({ name: 'signIn' }), 2000);
        } catch (error) {
          let errors = error.response.data.errors;
          console.log(errors);
          for (let key in errors) {
            if (errors[key][0].startsWith('400')) {
              this.retypePasswordError = "";
              this.generalError = errors[key][0].substring(5);
              break;
            }
          }
          //this.generalError = 'Registration failed. Please try again.';
        }
        finally {
				  this.loadingSpinner.hideSpinner();
        }
      }
    },
  },
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