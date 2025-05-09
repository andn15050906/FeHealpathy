<template>
  <div class="withdrawal-container" v-if="isVisible">
    <v-card-actions class="justify-end action-section">
      <v-btn text class="cancel-btn" @click="close">Hủy</v-btn>
    </v-card-actions>
    <h2>Yêu cầu rút tiền</h2>
    <form class="withdrawal-form" @submit.prevent="submitForm">
      <div class="form-group">
        <label for="accountNumber">Số tài khoản</label>
        <input
          id="accountNumber"
          v-model="accountNumber"
          required
          placeholder="Nhập số tài khoản"
        />
      </div>
      <div class="form-group">
        <label for="accountName">Tên tài khoản</label>
        <input
          id="accountName"
          v-model="accountName"
          required
          placeholder="Nhập tên chủ tài khoản"
        />
      </div>
      <div class="form-group">
        <label for="bank">Ngân hàng</label>
        <input
          id="bank"
          v-model="selectedBank"
          required
          placeholder="Nhập tên ngân hàng"
        />
        <!--<select id="bank" v-model="selectedBank" required>
          <option value="" disabled>Chọn ngân hàng</option>
          <option v-for="bank in banks" :key="bank.code" :value="bank.code">
            {{ bank.shortName }} - {{ bank.name }}
          </option>
        </select>-->
      </div>
      <button class="submit-btn" type="submit">Gửi yêu cầu</button>
    </form>
  </div>
</template>

<script>
import { inject } from 'vue';

export default {
  data() {
    return {
      isVisible: true,
      accountNumber: '',
      accountName: '',
      selectedBank: '',
      banks: [],
			sweetAlert: inject('sweetAlert')
    };
  },
  props: {
    close:  {
        type: Function,
        required: false
    }
  },
  methods: {
    submitForm() {
      this.isVisible = false;
      this.sweetAlert.showSuccess("Đã gửi yêu cầu rút tiền, hãy chờ admin phê duyệt!");
      this.close();
    },
  },
};
</script>

<style scoped>
.withdrawal-container {
  max-width: 500px;
  padding: 32px 24px 24px 24px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.08), 0 1.5px 4px rgba(0,0,0,0.06);
  text-align: center;
}

.withdrawal-container h2 {
  margin-bottom: 24px;
  color: #1976d2;
  font-weight: 700;
}

.withdrawal-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.form-group {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.form-group label {
  margin-bottom: 6px;
  font-weight: 500;
  color: #333;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 15px;
  transition: border 0.2s;
  background: #fafbfc;
}

.form-group input:focus,
.form-group select:focus {
  border-color: #1976d2;
  outline: none;
  background: #fff;
}

.submit-btn {
  margin-top: 10px;
  width: 100%;
  padding: 12px 0;
  background: linear-gradient(90deg, #1976d2 60%, #42a5f5 100%);
  color: #fff;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(25, 118, 210, 0.08);
  transition: background 0.2s, box-shadow 0.2s;
}

.submit-btn:hover {
  background: linear-gradient(90deg, #1565c0 60%, #1976d2 100%);
  box-shadow: 0 4px 16px rgba(25, 118, 210, 0.15);
}
</style>
