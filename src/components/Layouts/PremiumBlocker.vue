<template>
  <div v-if="!isPremium">
    <div class="premium-alert">
      <h2 class="hero-title">Nội dung Premium</h2>
      <p>Bạn cần tài khoản premium để truy cập nội dung này.</p>
    </div>
    <AccountUpgrade></AccountUpgrade>
  </div>
</template>

<script>
import AccountUpgrade from '@/components/PaymentComponents/AccountUpgrade.vue';

export default {
  props: {
    isPremium: {
      type: Boolean,
      required: false
    }
  },
  components: {
    AccountUpgrade
  },
  methods: {
    redirectToUpgrade() {
      this.$router.push('/profile');
    }
  },
};
</script>

<style scoped>
.premium-alert {
  text-align: center;
  margin-bottom: 120px;
}

.hero-title {
  color: #1a3e6f;
  font-size: 47px;
  line-height: 2;
  margin-bottom: 16px;
}
</style>