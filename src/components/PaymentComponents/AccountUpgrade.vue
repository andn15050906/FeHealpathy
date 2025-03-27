<template>
    <section class="pricing-section">
        <h2 class="section-title">{{ HomePage.Pricing.Title }}</h2>
        <div class="pricing-options">
            <button class="pricing-option active">
                <div class="pricing-header">
                    <span class="plan-name">{{ HomePage.Pricing.Yearly.Text }}</span>
                    <span class="plan-price">{{ HomePage.Pricing.Yearly.Price }}</span>
                </div>
                <div class="pricing-details">
                    <span class="trial-text">{{ HomePage.Pricing.Trial.Text }}</span>
                    <span class="monthly-price">{{ HomePage.Pricing.Trial.Price }}</span>
                </div>
            </button>

            <button class="pricing-option">
                <div class="pricing-header">
                    <span class="plan-name">{{ HomePage.Pricing.Monthly.Text }}</span>
                    <span class="plan-price">{{ HomePage.Pricing.Monthly.Text }}</span>
                </div>
            </button>
        </div>
        <p class="pricing-terms">{{ HomePage.Pricing.Terms.Text }}
            <a href="#terms" class="terms-link">{{ HomePage.Pricing.Terms.Title }}</a> |
            <a href="#cancel" class="terms-link">{{ HomePage.Pricing.Terms.CancelText }}</a>
        </p>
    </section>
</template>

<script>
import json from '@/scripts/data/data.json';

export default {
    name: 'AccountUpgrade',
    data() {
        return {
            HomePage: json.HomePage
        }
    }
}
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

.trial-text {
    display: inline-block;
    padding: 6px 12px;
    border-radius: 10px;
    background: #1a3e6f;
    color: #fff;
    font-size: 13px;
}

.monthly-price {
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