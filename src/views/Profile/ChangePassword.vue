<template>
  <div class="change-password-container">
    <h2>Đổi Mật Khẩu</h2>
    <form @submit.prevent="handleChangePassword">
      <div class="form-group">
        <label>Mật khẩu hiện tại</label>
        <input type="password" v-model="currentPassword" required placeholder="Nhập mật khẩu hiện tại"/>
      </div>
      <div class="form-group">
        <label>Mật khẩu mới</label>
        <input type="password" v-model="newPassword" required placeholder="Nhập mật khẩu mới"/>
      </div>
      <div class="form-group">
        <label>Xác nhận mật khẩu mới</label>
        <input type="password" v-model="confirmPassword" required placeholder="Nhập lại mật khẩu mới"/>
      </div>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      <p v-if="successMessage" class="success">{{ successMessage }}</p>
      <button type="submit" :disabled="loading">
        {{ loading ? "Đang cập nhật..." : "Đổi mật khẩu" }}
      </button>
    </form>
  </div>
</template>

<script>
import { ref } from "vue";
import { changePassword } from "@/services/userService";

export default {
  setup() {
    const currentPassword = ref("");
    const newPassword = ref("");
    const confirmPassword = ref("");
    const loading = ref(false);
    const errorMessage = ref("");
    const successMessage = ref("");

    const handleChangePassword = async () => {
      if (newPassword.value !== confirmPassword.value) {
        errorMessage.value = "Mật khẩu mới và xác nhận không khớp";
        return;
      }

      loading.value = true;
      errorMessage.value = "";
      successMessage.value = "";

      const requestData = {
        CurrentPassword: currentPassword.value,
        NewPassword: newPassword.value
      };

      console.log("🟡 Dữ liệu gửi đi:", requestData);

      try {
        const response = await changePassword(currentPassword.value, newPassword.value);
        console.log("🟢 Dữ liệu trả về:", response);
        successMessage.value = "Đổi mật khẩu thành công!";
      } catch (error) {
        console.error("🔴 Lỗi khi gọi API:", error.response?.data || error.message);
        errorMessage.value = error.response?.data?.message || "Có lỗi xảy ra!";
      } finally {
        loading.value = false;
      }
    };

    return {
      currentPassword,
      newPassword,
      confirmPassword,
      handleChangePassword,
      loading,
      errorMessage,
      successMessage,
    };
  },
};
</script>

<style scoped>
.change-password-container {
  max-width: 400px;
  margin: 50px auto;
  padding: 30px;
  border-radius: 15px;
  background: linear-gradient(135deg, #ffffff, #e3f2fd);
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
  text-align: center;
}
h2 {
  text-align: center;
  color: #007bff;
  font-size: 24px;
  margin-bottom: 20px;
}
.form-group {
  margin-bottom: 20px;
}
label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  color: #333;
}
input {
  width: 100%;
  padding: 12px;
  border: 2px solid #ddd;
  border-radius: 10px;
  font-size: 16px;
  transition: border 0.3s, box-shadow 0.3s;
}
input:focus {
  border-color: #007bff;
  outline: none;
  box-shadow: 0 0 8px rgba(0, 123, 255, 0.5);
}
button {
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #007bff, #0056b3);
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 18px;
  transition: background 0.3s, transform 0.2s;
}
button:hover {
  background: linear-gradient(135deg, #0056b3, #004494);
  transform: scale(1.05);
}
button:disabled {
  background: #ccc;
  cursor: not-allowed;
}
.error {
  color: red;
  font-weight: bold;
  font-size: 14px;
}
.success {
  color: green;
  font-weight: bold;
  font-size: 14px;
}
</style>
