<template>
<div :class="['container', { 'right-panel-active': isSignUp }]">
  <div class="form-container sign-up-container">
    <form @submit.prevent="handleSignUp">
      <h1>New Account</h1>
      <div class="social-container">
        <a href="#" class="social"><i class="fab fa-google-plus-g"></i></a>
      </div>
      <label for="username">Username:</label>
      <input v-model="form.username" type="text" id="username" required />
      <label for="email">Email:</label>
      <input v-model="form.email" type="email" id="email" required />
      <label for="password">Password:</label>
      <input v-model="form.password" type="password" id="password" required />
      <label for="rePassword">Retype Password:</label>
      <input v-model="form.rePassword" type="password" id="rePassword" required />
      <button style="margin-top: 5px;" type="submit">Sign Up</button>

      <div :class="{'error-message': !isSuccess, 'success-message': isSuccess}" v-if="errorMessage">
        {{ errorMessage }}
      </div>
    </form>
  </div>

  <div class="form-container sign-in-container">
    <form @submit.prevent="handleSignIn">
      <h1>Sign in</h1>
      <div class="social-container">
        <a href="#" class="social"><i class="fab fa-google-plus-g"></i></a>
      </div>
      <label>Username or Email:</label>
      <input v-model="identifier" type="text" required />
      <label>Password:</label>
      <input v-model="password" type="password" required />
      <a href="#">Forgot your password?</a>
      <button type="submit">Sign In</button>

      <div class="error-message" v-if="errorMessage && !isSuccess">
        {{ errorMessage }}
      </div>
    </form>
  </div>

  <div class="overlay-container">
    <div class="overlay">
      <div class="overlay-panel overlay-left">
        <h1>Welcome Back!</h1>
        <p>To keep connected with us please login with your personal info</p>
        <button @click="showSignIn" class="ghost" id="signIn">Sign In</button>
      </div>
      <div class="overlay-panel overlay-right">
        <h1>Hello, Friend!</h1>
        <p>Enter your personal details and start journey with us</p>
        <button @click="showSignUp" class="ghost" id="signUp">Sign Up</button>
      </div>
    </div>
  </div>
</div>

</template>
  
<script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { signIn, register } from '../../services/authService.js';

  const form = ref({
    username: '',
    email: '',
    password: '',
    rePassword: ''
  });

  const identifier = ref('');
  const password = ref('');
  const errorMessage = ref('');
  const isSuccess = ref(false);
  const isSignUp = ref(false);
  const router = useRouter();

  const handleSignIn = async () => {
    try {
      const data = await signIn(identifier.value, password.value);
      isSuccess.value = true;
      errorMessage.value = '';
      router.push('/');
    } catch (error) {
      console.error("Sign-in error:", error);
      errorMessage.value = 'Login failed. Please try again.';
      isSuccess.value = false;
    }
  };

  const handleSignUp = async () => {
    if (form.value.password !== form.value.rePassword) {
      errorMessage.value = 'Passwords do not match!';
      isSuccess.value = false;
      return;
    }

    try {
      await register(form.value.username, form.value.email, form.value.password);
      errorMessage.value = 'Registration successful! Please check your email to verify your account.';
      isSuccess.value = true;
      setTimeout(() => router.push('/sign-in'), 2000);
    } catch (error) {
      console.error('Registration error:', error);
      errorMessage.value = 'Registration failed. Please try again.';
      isSuccess.value = false;
    }
  };

  const showSignUp = () => {
    isSignUp.value = true;
  };

  const showSignIn = () => {
    isSignUp.value = false;
  };
</script>


<style scoped>
.error-message {
  color: red;
  margin-top: 10px;
}
.success-message {
  color: green;
  margin-top: 10px;
}
* {
	box-sizing: border-box;
}

body {
  background: #f6f5f7;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  margin: 0;
  font-family: 'Montserrat', sans-serif;
}

h1 {
	font-weight: bold;
	margin: 0;
}

h2 {
	text-align: center;
}

p {
	font-size: 14px;
	font-weight: 100;
	line-height: 20px;
	letter-spacing: 0.5px;
	margin: 20px 0 30px;
}

span {
	font-size: 12px;
}

a {
	color: #333;
	font-size: 14px;
	text-decoration: none;
	margin: 15px 0;
}

button {
	border-radius: 20px;
	border: 1px solid #FF4B2B;
	background-color: #FF4B2B;
	color: #FFFFFF;
	font-size: 12px;
	font-weight: bold;
	padding: 12px 45px;
	letter-spacing: 1px;
	text-transform: uppercase;
	transition: transform 80ms ease-in;
}

button:active {
	transform: scale(0.95);
}

button:focus {
	outline: none;
}

button.ghost {
	background-color: transparent;
	border-color: #FFFFFF;
}

form {
	background-color: #FFFFFF;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	padding: 0 50px;
	height: 100%;
	text-align: center;
}

input {
	background-color: #eee;
	border: none;
	padding: 12px 15px;
	margin: 3px 0;
	width: 100%;
}

.container {
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 14px 28px rgba(0,0,0,0.25), 
              0 10px 10px rgba(0,0,0,0.22);
  position: relative;
  overflow: hidden;
  width: 768px;
  max-width: 100%;
  min-height: 550px;
  margin-top: 200px;
}

.form-container {
	position: absolute;
	top: 0;
	height: 100%;
	transition: all 0.6s ease-in-out;
}

.sign-in-container {
	left: 0;
	width: 50%;
	z-index: 2;
}

.container.right-panel-active .sign-in-container {
	transform: translateX(100%);
}

.sign-up-container {
	left: 0;
	width: 50%;
	opacity: 0;
	z-index: 1;
}

.container.right-panel-active .sign-up-container {
	transform: translateX(100%);
	opacity: 1;
	z-index: 5;
	animation: show 0.6s;
}

@keyframes show {
	0%, 49.99% {
		opacity: 0;
		z-index: 1;
	}
	
	50%, 100% {
		opacity: 1;
		z-index: 5;
	}
}

.overlay-container {
	position: absolute;
	top: 0;
	left: 50%;
	width: 50%;
	height: 100%;
	overflow: hidden;
	transition: transform 0.6s ease-in-out;
	z-index: 100;
}

.container.right-panel-active .overlay-container{
	transform: translateX(-100%);
}

.overlay {
	background: #FF416C;
	background: -webkit-linear-gradient(to right, #FF4B2B, #FF416C);
	background: linear-gradient(to right, #FF4B2B, #FF416C);
	background-repeat: no-repeat;
	background-size: cover;
	background-position: 0 0;
	color: #FFFFFF;
	position: relative;
	left: -100%;
	height: 100%;
	width: 200%;
  	transform: translateX(0);
	transition: transform 0.6s ease-in-out;
}

.container.right-panel-active .overlay {
  	transform: translateX(50%);
}

.overlay-panel {
	position: absolute;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	padding: 0 40px;
	text-align: center;
	top: 0;
	height: 100%;
	width: 50%;
	transform: translateX(0);
	transition: transform 0.6s ease-in-out;
}

.overlay-left {
	transform: translateX(-20%);
}

.container.right-panel-active .overlay-left {
	transform: translateX(0);
}

.overlay-right {
	right: 0;
	transform: translateX(0);
}

.container.right-panel-active .overlay-right {
	transform: translateX(20%);
}

.social-container {
	margin: 20px 0;
}

.social-container a {
	border: 1px solid #DDDDDD;
	border-radius: 50%;
	display: inline-flex;
	justify-content: center;
	align-items: center;
	margin: 0 5px;
	height: 40px;
	width: 40px;
}
</style>
