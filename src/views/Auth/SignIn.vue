<template>
	<div class="login-page">
		<div class="overlay">
			<div class="login-container">
				<h2>Đăng Nhập</h2>
				<form @submit.prevent="handleLogin">
					<p v-if="generalError" class="error">{{ generalError }}</p>

					<div class="input-group">
						<label for="identifier">Email/Tên tài khoản</label>
						<input type="text" id="identifier" v-model="identifier" placeholder="Nhập email/Tên tài khoản"
							required />
					</div>
					<div class="input-group">
						<label for="password">Mật khẩu</label>
						<input type="password" id="password" v-model="password" placeholder="Nhập mật khẩu" required />
					</div>
					<div class="options">
						<label>
							<input type="checkbox" v-model="rememberMe" />
							Nhớ mật khẩu
						</label>
						<p class="register">
							<router-link to="/forgot-password">Quên mật khẩu ? </router-link>
						</p>
					</div>
					<button type="submit" class="login-button">Đăng Nhập</button>
				</form>

				<div class="social-login">
					<p>Hoặc đăng nhập với</p>
					<button class="social-button google" @click="handleGoogleOAuthRedirect">
						<i class="fab fa-google"></i> Google
					</button>
				</div>

				<p class="register">
					Chưa có tài khoản? <router-link to="/register">Đăng ký tại đây</router-link>
				</p>
			</div>
		</div>
	</div>
</template>

<script>
import { inject } from 'vue';
import router from '@/scripts/router';
import { readErr } from '@/scripts/logic/common';
import { getGoogleOAuthPath, setUserAuthData, signIn, verifyEmail } from '@/scripts/api/services/authService';

export default {
	data() {
		return {
			loadingSpinner: inject('loadingSpinner'),
			sweetAlert: inject('sweetAlert'),
			identifier: "",
			password: "",
			rememberMe: false,
			googleOAuthPath: getGoogleOAuthPath(),
			generalError: ""
		};
	},
	async mounted() {
		if (router.currentRoute.value.query) {
			let verifiedEmail = router.currentRoute.value.query['email'];
			let token = router.currentRoute.value.query['token'];
			router.replace({ 'query': null });
			if (verifiedEmail && token) {
				try {
					await verifyEmail(verifiedEmail, token);
					await sweetAlert.showSuccess("Xác thực email thành công!");
				}
				catch (error) {
					await sweetAlert.showError('Yêu cầu xác thực email không hợp lệ!');
				}
			}
		}
	},
	methods: {
		async handleLogin() {
			//...
			// remember me
			try {
				this.loadingSpinner.showSpinner();
				const data = await signIn(this.identifier, this.password);
				setUserAuthData(data);
				this.generalError = '';
				this.$emit('authenticated');
				router.push('/');
			} catch (error) {
				this.generalError = readErr(error);
			} finally {
				this.loadingSpinner.hideSpinner();
			}
		},
		handleGoogleOAuthRedirect() {
			window.location.href = this.googleOAuthPath;
		}
	}
};
</script>

<style>
.page-container:has(.login-page) {
	background-color: unset !important;
}
</style>

<style scoped>
.error {
	color: red;
	font-size: 0.8rem;
	margin-top: 0.5rem;
}

.login-page {
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

.login-container {
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

.options {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 1rem;
}

.options label {
	font-size: 0.9rem;
	color: #555;
}

.forgot-password {
	font-size: 0.9rem;
	color: #ff6600;
	text-decoration: none;
}

.forgot-password:hover {
	text-decoration: underline;
}

.login-button {
	width: 100%;
	padding: 0.7rem;
	background-color: #ff6600;
	color: #fff;
	border: none;
	border-radius: 4px;
	font-size: 1rem;
	cursor: pointer;
}

.login-button:hover {
	background-color: #e65c00;
}

.social-login {
	margin-top: 1rem;
}

.social-login p {
	margin-bottom: 0.5rem;
	font-size: 0.9rem;
	color: #555;
}

.social-button {
	width: 48%;
	padding: 0.7rem;
	border: none;
	border-radius: 4px;
	font-size: 0.9rem;
	cursor: pointer;
	margin: 0 1%;
	color: #fff;
}

.social-button.google {
	background-color: #db4437;
}

.social-button:hover {
	opacity: 0.9;
}

.register {
	margin-top: 1rem;
	font-size: 0.9rem;
	color: #555;
}

.register a {
	color: #ff6600;
	text-decoration: none;
}

.register a:hover {
	text-decoration: underline;
}

.terms {
	margin-top: 1rem;
	font-size: 0.8rem;
	color: #777;
}

.terms a {
	color: #ff6600;
	text-decoration: none;
}

.terms a:hover {
	text-decoration: underline;
}
</style>