<template>
    <div class="home-container">
        <main class="main-content">
            <section class="hero-section">
                <h1 class="hero-title">{{ HomePage.Title }}</h1>
                <p class="hero-subtitle">{{ HomePage.SubTitle }}</p>
                <div class="cta-buttons">
                    <button class="primary-button">{{ HomePage.TryIt }}</button>
                    <button class="secondary-button">{{ HomePage.AlreadyHaveAccount }}</button>
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
                    <article class="testimonial-card">
                        <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/cb345c283f9a7c8a9a29683bd155b2c4107ab62f7ca96b78530877123fa6c23a?placeholderIfAbsent=true&apiKey=581cb509eedd462787009da53a17f69a"
                            alt="User Avatar" class="testimonial-avatar" />
                        <p class="testimonial-text">{{ HomePage.Testimonial[0].Text }}</p>
                        <p class="testimonial-author">{{ HomePage.Testimonial[0].UserText }}</p>
                        <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/d5a98f91b646a7b4cb93d02735f1d1e73d79681afb5f662e1440d344c0c94336?placeholderIfAbsent=true&apiKey=581cb509eedd462787009da53a17f69a"
                            alt="" class="rating-stars" />
                    </article>

                    <article class="testimonial-card">
                        <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/4db67621847e30780caf32be0777537ed3be10d4865ce5d94cbe61a5ef9e6ae6?placeholderIfAbsent=true&apiKey=581cb509eedd462787009da53a17f69a"
                            alt="User Avatar" class="testimonial-avatar" />
                        <p class="testimonial-text">{{ HomePage.Testimonial[1].Text }}</p>
                        <p class="testimonial-author">{{ HomePage.Testimonial[1].UserText }}</p>
                        <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/6135b90f63f73038b068fb7844a97eff52f9b4db9fe0153b9838a6d68bf9e264?placeholderIfAbsent=true&apiKey=581cb509eedd462787009da53a17f69a"
                            alt="" class="rating-stars" />
                    </article>

                    <article class="testimonial-card">
                        <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/b44add15ef1af971bbbfb03a11a21ccae33b90f450a4adc2f881d70e9e7e44df?placeholderIfAbsent=true&apiKey=581cb509eedd462787009da53a17f69a"
                            alt="User Avatar" class="testimonial-avatar" />
                        <p class="testimonial-text">{{ HomePage.Testimonial[2].Text }}</p>
                        <p class="testimonial-author">{{ HomePage.Testimonial[2].UserText }}</p>
                        <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/31ff5de254f9a6044ea93b4a03af46e5fe7921712ac61eda7f3ed0993cd8f995?placeholderIfAbsent=true&apiKey=581cb509eedd462787009da53a17f69a"
                            alt="" class="rating-stars" />
                    </article>
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
                <button class="primary-button">{{ HomePage.Pricing.Terms.Continue }}</button>
            </section>
        </main>

        <!--<footer class="main-footer">
            <div class="footer-content">
                <div class="footer-links">
                    <div class="footer-column">
                        <h4 class="footer-title">Company</h4>
                        <nav class="footer-nav">
                            <a href="#about" class="footer-link">About</a>
                            <a href="#careers" class="footer-link">Careers</a>
                            <a href="#press" class="footer-link">Press</a>
                            <a href="#blog" class="footer-link">Blog</a>
                            <a href="#instructors" class="footer-link">Meet our Instructors</a>
                            <a href="#science" class="footer-link">Calm Science</a>
                        </nav>
                    </div>

                    <div class="footer-column">
                        <h4 class="footer-title">Offers</h4>
                        <nav class="footer-nav">
                            <a href="#buy-gift" class="footer-link">Buy a Gift</a>
                            <a href="#redeem-gift" class="footer-link">Redeem a Gift</a>
                            <a href="#family" class="footer-link">Family Plan</a>
                            <a href="#health" class="footer-link">Calm Health</a>
                            <a href="#business" class="footer-link">Calm Business</a>
                        </nav>
                    </div>

                    <div class="footer-column">
                        <h4 class="footer-title">Help</h4>
                        <nav class="footer-nav">
                            <a href="#faq" class="footer-link">FAQ</a>
                            <a href="#contact" class="footer-link">Contact Us</a>
                            <a href="#terms" class="footer-link">Terms</a>
                            <a href="#privacy" class="footer-link">Privacy Policy</a>
                            <a href="#ccpa" class="footer-link">CCPA Notice</a>
                            <a href="#privacy-choices" class="footer-link privacy-choices">
                                Your Privacy Choices
                                <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/587cf2f017f26d85da76c35f00a3e413c50d36c4f5de90b6f08442917fda15a0?placeholderIfAbsent=true&apiKey=581cb509eedd462787009da53a17f69a"
                                    alt="" class="privacy-icon" />
                            </a>
                            <a href="#cookies" class="footer-link">Cookies</a>
                            <a href="#accessibility" class="footer-link">Accessibility Statement</a>
                        </nav>
                    </div>
                </div>
                <p class="copyright">Copyright © 2024 Calm. All rights reserved</p>
            </div>
        </footer>-->
    </div>
</template>

<script>
import json from '../api/data.json'

export default {
    name: 'HomePage',
    data() {
        return {
            HomePage: json.HomePage
        }
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

.primary-button {
    background: linear-gradient(180deg,
            rgb(36, 119, 170) 0%,
            rgb(100, 97, 224) 100%);
    color: #fff;
    border: none;
    border-radius: 100px;
    padding: 14px 29px;
    font-weight: 700;
    font-size: 17px;
    cursor: pointer;
}

.secondary-button {
    background: transparent;
    color: #383838;
    border: 1px solid rgba(0, 0, 0, 0.2);
    border-radius: 100px;
    padding: 14px 29px;
    font-weight: 700;
    font-size: 17px;
    cursor: pointer;
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
    font-size: 22px;
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