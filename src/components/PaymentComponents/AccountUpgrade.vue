<template>
    <section v-if="!isPremiumUser" class="pricing-section">
        <h2 class="section-title">{{ HomePage.Pricing.Title }}</h2>
        <div class="pricing-options">
            <button class="pricing-option active" @click="handlePurchase(PaymentOptions.Yearly)">
                <div class="pricing-header">
                    <span class="plan-name">{{ HomePage.Pricing.Yearly.Text }}</span>
                    <span class="plan-price">{{ HomePage.Pricing.Yearly.Price }}</span>
                </div>
                <div class="pricing-details">
                    <span class="discounted-text">{{ HomePage.Pricing.Trial.Text }}</span>
                    <span class="discounted-price">{{ HomePage.Pricing.Trial.Price }}</span>
                </div>
            </button>

            <button class="pricing-option" @click="handlePurchase(PaymentOptions.Monthly)">
                <div class="pricing-header">
                    <span class="plan-name">{{ HomePage.Pricing.Monthly.Text }}</span>
                    <span class="plan-price">{{ HomePage.Pricing.Monthly.Price }}</span>
                </div>
            </button>
        </div>
        <p class="pricing-terms">{{ HomePage.Pricing.Terms.Text }}
            <a href="#terms" class="terms-link">{{ HomePage.Pricing.Terms.Title }}</a> |
            <a href="#cancel" class="terms-link">{{ HomePage.Pricing.Terms.CancelText }}</a>
        </p>
    </section>
</template>

<script setup>
import json from '@/scripts/data/data.json';
import { ref } from 'vue';
import { RouterLink } from 'vue-router';
import { toast } from "vue3-toastify";
import { purchasePremium } from "@/scripts/api/services/paymentService";
import { isPremium } from '@/scripts/api/services/authService';

const isPremiumUser = ref(isPremium());
const HomePage = json.HomePage;
const PaymentOptions = {
    Yearly: 0,
    Monthly: 1
}

const handlePurchase = async (paymentOptions) => {
    try {
        const response = await purchasePremium(paymentOptions);
        if (!response?.url) {
            toast.error(
                "Không nhận được URL thanh toán.",
                { duration: 150, position: "bottom-center" }
            );
            return;
        }

        toast.success(
            "Thanh toán thành công.",
            { duration: 150, position: "bottom-center" }
        );
        window.location.href = response.url;
    } catch (error) {
        console.error("Lỗi thanh toán", error);
    }
};
</script>

<style scoped>
.pricing-section {
    text-align: center;
    margin-bottom: 100px;
}

.pricing-options {
    display: flex;
    gap: 16px;
    justify-content: center;
    margin: 32px 0;
}

.pricing-option {
    flex: 1;
    max-width: 300px;
    padding: 20px;
    border: 2px solid #e2e2e2;
    border-radius: 10px;
    background: #fff;
    cursor: pointer;
    text-align: left;
}

.pricing-option.active {
    border-color: #1a3e6f;
}

.pricing-header > span {
    margin: 4px;
}

.plan-name {
    font-size: 17px;
    font-weight: 700;
    color: rgba(0, 0, 0, 0.8);
}

.plan-price {
    font-size: 13px;
    color: rgba(0, 0, 0, 0.8);
}

.discounted-text {
    display: inline-block;
    padding: 6px 12px;
    border-radius: 10px;
    background: #1a3e6f;
    color: #fff;
    font-size: 13px;
    margin-right: 8px;
}

.discounted-price {
    font-size: 17px;
    color: rgba(0, 0, 0, 0.8);
}

.pricing-terms {
    color: rgba(0, 0, 0, 0.6);
    font-size: 13px;
    margin-bottom: 24px;
}

.terms-link {
    color: #000;
    text-decoration: underline;
}
</style>