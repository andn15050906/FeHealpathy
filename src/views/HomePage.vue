<template>
    <div :class="{ 'home-container': true, 'home-background': isLoggedIn }">
        <div v-if="!isLoggedIn" class="main-content">
            <!-- Phần landing page cho người chưa đăng nhập -->
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
        </div>
        <div v-else class="main-content">
            <!-- Dashboard cho người đã đăng nhập -->
            <v-container>
                <v-row>
                    <v-col cols="12" md="6">
                        <RecommendationCard
                            v-if="dailyMotivation"
                            :content="dailyMotivation.content"
                            :is-motivation="true"
                            :source="dailyMotivation.source"
                        />
                    </v-col>
                    
                    <v-col cols="12" md="6">
                        <RecommendationCard
                            v-if="dailyRecommendation"
                            :content="dailyRecommendation.content"
                            :is-motivation="false"
                            :source="dailyRecommendation.source"
                            @follow-recommendation="followRecommendation"
                            @skip-recommendation="skipRecommendation"
                        />
                    </v-col>
                </v-row>
                
                <!-- Phần lộ trình cá nhân -->
                <!--<v-row>
                    <v-col cols="12">
                        <PersonalRoadmap></PersonalRoadmap>
                    </v-col>
                </v-row>-->
                
                <!-- Should be shown if the user does not have a roadmap-->
                <v-container fluid class="pt-16" style="margin-top: 15px;">
                    <div class="d-flex flex-column md:flex-row md:items-center md:justify-between gap-4 mb-6" style="">
                        <div>
                            <h1 class="text-h4 font-weight-bold text-gray-900">
                            Các lộ trình sức khỏe tinh thần
                            </h1>
                            <p class="text-subtitle-1 text-gray-600 mt-2">
                            Bạn có thể tự chọn lộ trình phù hợp, hoặc để chúng tôi đồng hành cùng bạn tạo nên một hành trình riêng
                            biệt - an toàn, bảo mật và dành riêng cho bạn.
                            </p>
                        </div>
                        <v-btn color="primary" prepend-icon="mdi-leaf" size="large"
                            style="font-weight:600; border-radius: 24px; width: 50%" @click="goToSuggestion">
                            Khám phá lộ trình phù hợp cho bạn </v-btn>
                    </div>
                </v-container>
            </v-container>
        </div>
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
import RecommendationCard from '@/components/Roadmap/RecommendationCard.vue';

export default {
    name: 'HomePage',
    methods: {
        setActivePricing: function () {

        },
        navigateToSettingUp: function (notiId) {
            this.$router.push({ name: 'SettingUp' });
            this.$emit('removeNotification', notiId);
        },
        followRecommendation() {
            // Lưu trạng thái đã làm theo lời khuyên
            this.isFollowingRecommendation = true;
            
            // Chuyển đến trang chi tiết của lời khuyên hoặc hiển thị hướng dẫn
            if (this.dailyRecommendation.actionUrl) {
                this.$router.push(this.dailyRecommendation.actionUrl);
            } else {
                // Hiển thị hướng dẫn trong modal
                // Implement later
            }
        },
        skipRecommendation() {
            // Gọi API để lấy lời khuyên mới
            this.fetchDailyRecommendation();
        },
        async fetchDailyMotivation() {
            // Giả lập API call
            setTimeout(() => {
                this.dailyMotivation = {
                    content: "Mỗi bước nhỏ bạn thực hiện hôm nay đều đưa bạn gần hơn đến mục tiêu sức khỏe tinh thần tốt hơn.",
                    source: "Healpathy"
                };
            }, 500);
        },
        async fetchDailyRecommendation() {
            // Giả lập API call
            setTimeout(() => {
                this.dailyRecommendation = {
                    content: "Dành 5 phút hôm nay để thực hành bài tập thở sâu. Điều này có thể giúp giảm căng thẳng và cải thiện tâm trạng của bạn.",
                    source: "Lộ trình Vượt qua lo âu",
                    actionUrl: "/practice/breathing"
                };
            }, 500);
        },
        goToSuggestion() {
            this.$router.push("/suggest");
        }
    },
    data() {
        return {
            user: null,
            isLoggedIn: false,
            HomePage: json.HomePage,
            dailyMotivation: null,
            dailyRecommendation: null,
            isFollowingRecommendation: false
        }
    },
    components: {
        GlowingButton,
        GlowingCard,
        PersonalRoadmap,
        AccountUpgrade,
        RecommendationCard
    },
    beforeMount() {
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
        
        // Fetch daily motivation and recommendation
        this.fetchDailyMotivation();
        this.fetchDailyRecommendation();
        
        if (!this.user.roadmapId) {
            this.$router.push({ name: 'SettingUp' });
        }
        // handle setting up
        if (this.user.preferences && this.user.preferences.length == 0) {
            let noti = new Noti(
                true, 
                () => { }, 
                "Bạn muốn thiết lập lộ trình mới không?",
                "Đánh giá lại bản thân có thể giúp bạn có một lộ trình phù hợp hơn"
            );
            noti.callback = () => this.navigateToSettingUp(noti.id);
            this.$emit('addNotification', noti);
        }
    }
}
</script>

<style scoped>
.home-container {
    min-height: 100vh;
    background: #fff;
}

.home-background {
    background-image: radial-gradient(circle 369px at -2.9% 12.9%, rgba(247, 234, 163, 1) 0%, rgba(236, 180, 238, 0.56) 46.4%, rgba(163, 203, 247, 1) 100.7%);
    padding: 40px 80px !important;
    margin-top: -30px;
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
    padding: 80px 20px;
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