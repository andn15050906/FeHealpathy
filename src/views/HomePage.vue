<template>
    <div class="home-container">
        <main v-if="!isLoggedIn" class="main-content">
            <section class="hero-section">
                <h1 class="hero-title">{{ HomePage.Title }}</h1>
                <p class="hero-subtitle">{{ HomePage.SubTitle }}</p>
                <div class="cta-buttons">
                    <GlowingButton primaryColor="#4facfe" secondaryColor="#0062fe">
                        <RouterLink :to="'register'" class="link">{{ HomePage.TryIt }}</RouterLink>
                    </GlowingButton>
                    <GlowingButton primary-color="transparent" secondary-color="transparent" textColor="#000">
                        <RouterLink :to="'sign-in'" class="link-dark">{{ HomePage.AlreadyHaveAccount }}</RouterLink>
                    </GlowingButton>
                </div>
            </section>

            <section class="features-section">
                <h2 class="section-title">{{ HomePage.Section1.Title }}</h2>
                <div class="feature-cards">
                    <article class="feature-card">
                        <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/d8a46915f1cb450537c2df698c9fd9ac53e17b32b0c129fe00ede90fa3c9c495?placeholderIfAbsent=true&apiKey=581cb509eedd462787009da53a17f69a"
                            alt="Sleep Better Icon" class="feature-icon" />
                        <h3 class="feature-title">{{ HomePage.Section1.SubTitle }}</h3>
                        <p class="feature-description">{{ HomePage.Section1.Description }}</p>
                        <RouterLink :to="'practice'" class="learn-more-link">{{ HomePage.Section1.LearnMore }}
                        </RouterLink>
                    </article>

                    <article class="feature-card">
                        <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/39bfe16b2c35be4fac9ccd45455efd9b01cf834bd76ff75010fddc3f60dae972?placeholderIfAbsent=true&apiKey=581cb509eedd462787009da53a17f69a"
                            alt="Mindfulness Icon" class="feature-icon" />
                        <h3 class="feature-title">{{ HomePage.Section2.Title }}</h3>
                        <p class="feature-description">{{ HomePage.Section2.Description }}</p>
                        <RouterLink :to="'courses'" class="learn-more-link">{{ HomePage.Section1.LearnMore }}
                        </RouterLink>
                    </article>

                    <article class="feature-card">
                        <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/ff2025ec0e7ed8fcde827b280028e0d5f79b1565e32e25e44a5cdc5c118be574?placeholderIfAbsent=true&apiKey=581cb509eedd462787009da53a17f69a"
                            alt="Stress Relief Icon" class="feature-icon" />
                        <h3 class="feature-title">{{ HomePage.Section3.Title }}</h3>
                        <p class="feature-description">{{ HomePage.Section3.Description }}</p>
                        <RouterLink :to="'practice'" class="learn-more-link">{{ HomePage.Section1.LearnMore }}
                        </RouterLink>
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
            <AccountUpgrade></AccountUpgrade>
        </main>
        <main v-if="isLoggedIn" class="main-content home-background">
            <PersonalRoadmap></PersonalRoadmap>
        </main>
    </div>
</template>

<script>
import router from '@/scripts/router';
import json from '@/scripts/data/data.json'
import { Noti } from '@/scripts/types/models';
import { getUserProfile, setUserAuthData } from '@/scripts/api/services/authService';
import GlowingCard from '@/components/Common/GlowingCard.vue';
import GlowingButton from '@/components/Common/GlowingButton.vue';
import PersonalRoadmap from '@/components/RoadmapComponents/PersonalRoadmap.vue';
import AccountUpgrade from '@/components/PaymentComponents/AccountUpgrade.vue';

export default {
    name: 'HomePage',
    methods: {
        setActivePricing: function () {

        },
        navigateToSettingUp: function (notiId) {
            this.$router.push({ name: 'SettingUp' });
            this.$emit('removeNotification', notiId);
        }
    },
    data() {
        return {
            user: null,
            isLoggedIn: false,
            HomePage: json.HomePage
        }
    },
    components: {
        GlowingButton,
        GlowingCard,
        PersonalRoadmap,
        AccountUpgrade
    },
    mounted() {
        // handle auth
        if (router.currentRoute.value.query) {
            var externalUser = router.currentRoute.value.query['external_redirect'];
            if (externalUser) {
                function toCamelCase(key, value) {
                    if (value && typeof value === 'object'){
                        for (var k in value) {
                        if (/^[A-Z]/.test(k) && Object.hasOwnProperty.call(value, k)) {
                            value[k.charAt(0).toLowerCase() + k.substring(1)] = value[k];
                            delete value[k];
                        }
                        }
                    }
                    return value;
                }

                setUserAuthData({
                    User: JSON.parse(externalUser, toCamelCase)
                });
				this.$emit('authenticated');
            }

            this.$router.replace({ path: '/', query: {} });
        }
        this.user = getUserProfile();

        if (!this.user)
            return;

        this.isLoggedIn = true;
        if (!this.user.roadmapId) {
            this.$router.push({ name: 'SettingUp' });
        }
        // handle setting up
        if (this.user.preferences && this.user.preferences.length == 0) {
            let noti = new Noti(true, () => { }, "Mind setting up your profile?", "Set up your profile for better experience");
            noti.callback = () => this.navigateToSettingUp(noti.id);
            this.$emit('addNotification', noti);
        }
    }
}
</script>

<style scoped>
.home-container {
    background: #fff;
}

.home-background {
    background-image: radial-gradient(circle 369px at -2.9% 12.9%, rgba(247, 234, 163, 1) 0%, rgba(236, 180, 238, 0.56) 46.4%, rgba(163, 203, 247, 1) 100.7%);
    padding: 40px 80px !important;
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

.link {
    color: #fff;
    text-decoration: none;
}

.link-dark {
    color: #000;
    text-decoration: none;
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

@media (max-width: 991px) {
    .hero-title {
        font-size: 40px;
    }
}
</style>