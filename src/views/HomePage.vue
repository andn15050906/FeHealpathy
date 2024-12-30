<template>
    <div class="home-container">
        <main class="main-content">
            <section class="hero-section">
                <h1 class="hero-title">{{ HomePage.Title }}</h1>
                <p class="hero-subtitle">{{ HomePage.SubTitle }}</p>
                <div class="cta-buttons">
                    <GlowingButton primaryColor="#4facfe" secondaryColor="#0062fe">{{
                        HomePage.TryIt }}</GlowingButton>
                    <GlowingButton primary-color="transparent" secondary-color="transparent" textColor="#000">{{
                        HomePage.AlreadyHaveAccount }}</GlowingButton>
                </div>
            </section>
            
            <section class="features-section">
                <h2 class="section-title">{{ HomePage.Section1.Title }}</h2>
                <div class="feature-cards">
                    <article class="feature-card">
                        <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/ff2025ec0e7ed8fcde827b280028e0d5f79b1565e32e25e44a5cdc5c118be574?placeholderIfAbsent=true&apiKey=581cb509eedd462787009da53a17f69a"
                            alt="Stress Relief Icon" class="feature-icon" />
                        <h3 class="feature-title">{{ HomePage.Section1.SubTitle }}</h3>
                        <p class="feature-description">{{ HomePage.Section1.Description }}</p>
                        <a href="#learn-more" class="learn-more-link">{{ HomePage.Section1.LearnMore }}</a>
                    </article>

                    <article class="feature-card">
                        <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/d8a46915f1cb450537c2df698c9fd9ac53e17b32b0c129fe00ede90fa3c9c495?placeholderIfAbsent=true&apiKey=581cb509eedd462787009da53a17f69a"
                            alt="Sleep Better Icon" class="feature-icon" />
                        <h3 class="feature-title">{{ HomePage.Section2.Title }}</h3>
                        <p class="feature-description">{{ HomePage.Section2.Description }}</p>
                        <a href="#learn-more" class="learn-more-link">{{ HomePage.Section2.LearnMore }}</a>
                    </article>

                    <article class="feature-card">
                        <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/39bfe16b2c35be4fac9ccd45455efd9b01cf834bd76ff75010fddc3f60dae972?placeholderIfAbsent=true&apiKey=581cb509eedd462787009da53a17f69a"
                            alt="Mindfulness Icon" class="feature-icon" />
                        <h3 class="feature-title">{{ HomePage.Section3.Title }}</h3>
                        <p class="feature-description">{{ HomePage.Section3.Description }}</p>
                        <a href="#learn-more" class="learn-more-link">{{ HomePage.Section3.LearnMore }}</a>
                    </article>
                </div>
            </section>

            <section class="testimonials-section">
                <h2 class="section-title">{{ HomePage.Section4.Title }}</h2>
                <div class="testimonial-cards">
                    <GlowingCard v-for="(testimonial, index) in HomePage.Testimonial.slice(0, 3)" :key="index"
                        class="testimonial-card" primaryColor="#4facfe" secondaryColor="#0062fe">
                        <p class="testimonial-text">{{ testimonial.Text }}</p>
                        <p class="testimonial-author">{{ testimonial.UserText }}</p>
                        <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/d5a98f91b646a7b4cb93d02735f1d1e73d79681afb5f662e1440d344c0c94336?placeholderIfAbsent=true&apiKey=581cb509eedd462787009da53a17f69a"
                            alt="" class="rating-stars" />
                    </GlowingCard>
                </div>
            </section>

            <section class="pricing-section">
                <h2 class="section-title">{{ HomePage.Pricing.Title }}</h2>
                <div class="pricing-options">
                    <button class="pricing-option active" tabindex="0">
                        <div class="pricing-header">
                            <span class="plan-name">{{ HomePage.Pricing.Yearly.Text }}</span>
                            <span class="plan-price">{{ HomePage.Pricing.Yearly.Price }}</span>
                        </div>
                        <div class="pricing-details">
                            <span class="trial-text">{{ HomePage.Pricing.Trial.Text }}</span>
                            <span class="monthly-price">{{ HomePage.Pricing.Trial.Price }}</span>
                        </div>
                    </button>

                    <button class="pricing-option" tabindex="0">
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
                <div style="display: flex; justify-content: center;">
                    <GlowingButton primaryColor="#4facfe" secondaryColor="#0062fe">
                        {{ HomePage.Pricing.Terms.Continue }}
                    </GlowingButton>
                </div>
            </section>
        </main>
    </div>
</template>

<script>
import GlowingCard from '@/components/Common/GlowingCard.vue';
import GlowingButton from '@/components/Common/GlowingButton.vue';
import json from '../api/data.json'

export default {
    name: 'HomePage',
    data() {
        return {
            HomePage: json.HomePage
        }
    },
    components: {
        GlowingButton,
        GlowingCard
    }
}
</script>

<style scoped>
.home-container {
    background: #fff;
}

.main-header {
    background: linear-gradient(rgb(23, 98, 147) 0%, rgba(23, 98, 147, 0.337) 71%, rgba(23, 98, 147, 0) 100%);
    padding: 20px 40px;
}

.nav-menu {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
}

.logo {
    height: 40px;
    width: auto;
}

.nav-links,
.auth-links {
    display: flex;
    align-items: center;
    gap: 20px;
}

.nav-link {
    color: #fff;
    text-decoration: none;
    font-weight: 700;
    font-size: 17px;
}

.main-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 40px 20px;
}

.hero-section {
    text-align: center;
    margin-bottom: 100px;
}

.hero-title {
    color: #1a3e6f;
    font-size: 47px;
    line-height: 2;
    margin-bottom: 16px;
}

.hero-subtitle {
    color: rgba(0, 0, 0, 0.8);
    font-size: 22px;
    line-height: 1.3;
    margin-bottom: 36px;
}

.cta-buttons {
    display: flex;
    gap: 12px;
    justify-content: center;
}

.features-section {
    margin-bottom: 100px;
}

.section-title {
    color: #1a3e6f;
    font-size: 34px;
    line-height: 60px;
    text-align: center;
    margin-bottom: 40px;
}

.feature-cards {
    display: flex;
    gap: 48px;
    justify-content: center;
    flex-wrap: wrap;
}

.feature-card {
    flex: 1;
    min-width: 240px;
    max-width: 350px;
}

.feature-icon {
    width: 54px;
    height: 54px;
}

.feature-title {
    font-size: 30px;
    line-height: 2;
    color: rgba(0, 0, 0, 0.8);
    margin: 39px 0 9px;
}

.feature-description {
    font-size: 17px;
    line-height: 2;
    color: rgba(0, 0, 0, 0.8);
    margin-bottom: 22px;
}

.learn-more-link {
    color: rgba(0, 0, 0, 0.8);
    text-decoration: none;
    font-weight: 500;
    font-size: 17px;
}

.testimonials-section {
    margin-bottom: 100px;
}

.testimonial-cards {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    height: 436.5px;
}

.testimonial-card {
    flex: 1;
    min-width: 240px;
    max-width: 350px;
    padding: 40px 32px;
    border-radius: 20px;

    background: linear-gradient(rgb(36, 119, 170) 0%, rgb(100, 97, 224) 100%);
    color: rgb(255, 255, 255);
    height: 100%;
    text-align: left;

    margin: 10px;
}

.testimonial-avatar {
    width: 65px;
    height: 65px;
    border-radius: 50%;
}

.testimonial-text {
    font-size: 16px;
    line-height: 2;
    color: #fff;
    margin: 17px 0;
}

.testimonial-author {
    color: rgba(255, 255, 255, 0.8);
    font-size: 17px;
    margin-bottom: 13px;
}

.rating-stars {
    width: 136px;
    height: 24px;
}

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

.main-footer {
    background: #1b2250;
    padding: 48px 80px;
    color: #fff;
}

.footer-content {
    max-width: 1200px;
    margin: 0 auto;
}

.footer-links {
    display: flex;
    gap: 48px;
    flex-wrap: wrap;
    margin-bottom: 48px;
}

.footer-column {
    flex: 1;
    min-width: 240px;
}

.footer-title {
    font-size: 17px;
    font-weight: 500;
    margin-bottom: 20px;
}

.footer-nav {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.footer-link {
    color: #fff;
    text-decoration: none;
    font-size: 15px;
}

.privacy-choices {
    display: flex;
    align-items: center;
    gap: 8px;
}

.privacy-icon {
    width: 40px;
    height: 14px;
}

.copyright {
    text-align: center;
    font-size: 14px;
}

@media (max-width: 991px) {
    .main-header {
        padding: 20px;
    }

    .nav-menu {
        flex-direction: column;
        gap: 20px;
    }

    .hero-title {
        font-size: 40px;
    }

    .main-footer {
        padding: 48px 20px;
    }

    .footer-links {
        gap: 40px;
    }
}
</style>