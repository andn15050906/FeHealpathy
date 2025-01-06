<template>
    <div class="register-page">
      <div class="overlay">
        <div class="register-container">
          <img src="https://via.placeholder.com/150" alt="Himalayan Institute Logo" class="logo" />
          <h2>Register</h2>
          <form @submit.prevent="handleRegister">
            <div class="input-group">
              <label for="username">Username</label>
              <input
                type="text"
                id="username"
                v-model="username"
                placeholder="Enter your username"
                required
              />
            </div>
  
            <div class="input-group">
              <label for="email">Email Address</label>
              <input
                type="email"
                id="email"
                v-model="email"
                placeholder="Enter your email address"
                required
              />
            </div>
  
            <div class="input-group">
              <label for="password">Password</label>
              <input
                type="password"
                id="password"
                v-model="password"
                placeholder="Enter your password"
                required
              />
              <p v-if="passwordError" class="error">{{ passwordError }}</p>
            </div>
  
            <div class="input-group">
              <label for="retype-password">Retype Password</label>
              <input
                type="password"
                id="retype-password"
                v-model="retypePassword"
                placeholder="Retype your password"
                required
              />
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
  export default {
    data() {
      return {
        username: "",
        email: "",
        password: "",
        retypePassword: "",
        passwordError: "",
        retypePasswordError: "",
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
        if (this.password !== this.retypePassword) {
          this.retypePasswordError = "Passwords do not match.";
          return false;
        } else {
          this.retypePasswordError = "";
          return true;
        }
      },
      handleRegister() {
        const isPasswordValid = this.validatePassword();
        const isRetypePasswordValid = this.validateRetypePassword();
  
        if (isPasswordValid && isRetypePasswordValid) {
          alert("Registration successful!");
        }
      },
    },
  };
  </script>
  
  <style scoped>
  /* General page styles */
  .register-page {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background: url("https://images2.thanhnien.vn/528068263637045248/2024/12/26/2-yoga-17351951346981130268528.jpg") no-repeat center center/cover;
    position: relative;
  }
  
  .overlay {
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.1);
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
  