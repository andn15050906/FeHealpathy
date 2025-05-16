<template>
    <section class="mood-pattern-hero">
        <div class="content-wrapper">
            <h1 class="hero-title">
                Nâng cao sức khỏe tinh thần của bạn cùng Healpathy
            </h1>
            <h2 class="mood-prompt">Hôm nay bạn cảm thấy thế nào?</h2>
            <router-link to="/mood-cart/happy">
                <button class="join-button" tabindex="0">Tham gia cùng chúng tôi</button>
            </router-link>
        </div>
        <div class="mood-grid">
            <!-- Vui vẻ -->
            <div class="mood-card happy">
                <div class="mood-icon-wrapper">
                    <img loading="lazy"
                        src="https://cdn.builder.io/api/v1/image/assets/TEMP/990d459e86807a6ad4ff81fbf586bb234d66989ae6f4e88c73f4c70c28f5267c?placeholderIfAbsent=true&apiKey=9d54f8198b4f4156bc37a6432537a657"
                        class="mood-icon" alt="Vui vẻ" />
                </div>
            </div>
            <!-- Buồn -->
            <div class="mood-card sad">
                <div class="mood-icon-wrapper">
                    <img loading="lazy"
                        src="https://cdn.builder.io/api/v1/image/assets/TEMP/f5da17250d1078f13adbfd2de8c4c3dc53bb8c93c0a029d60459b4cb4091bbe6?placeholderIfAbsent=true&apiKey=9d54f8198b4f4156bc37a6432537a657"
                        class="mood-icon" alt="Buồn" />
                </div>
            </div>
            <!-- Hào hứng -->
            <div class="mood-card eager">
                <div class="mood-icon-wrapper">
                    <img loading="lazy"
                        src="https://cdn.builder.io/api/v1/image/assets/TEMP/e3ff816f600031f96b3bf75fa2c76bb2ac0a60cc572a49c3ab196222543d81c9?placeholderIfAbsent=true&apiKey=9d54f8198b4f4156bc37a6432537a657"
                        class="mood-icon" alt="Hào hứng" />
                </div>
            </div>
            <!-- Tức giận -->
            <div class="mood-card angry">
                <div class="mood-icon-wrapper">
                    <img loading="lazy"
                        src="https://cdn.builder.io/api/v1/image/assets/TEMP/18a46ba70d2e22dcd7f14d6f252f6cdf532f122c91567146069b4e9b27f2d023?placeholderIfAbsent=true&apiKey=9d54f8198b4f4156bc37a6432537a657"
                        class="mood-icon" alt="Tức giận" />
                </div>
            </div>
            <!-- Lo lắng -->
            <div class="mood-card anxiety">
                <div class="mood-icon-wrapper">
                    <img loading="lazy"
                        src="https://cdn.builder.io/api/v1/image/assets/TEMP/ca79fb5af2e302375e06008c34767d0e50c971b995463146cc44f1d7af0af355?placeholderIfAbsent=true&apiKey=9d54f8198b4f4156bc37a6432537a657"
                        id="anxiety" class="mood-icon" alt="Lo lắng" />
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped>
.mood-pattern-hero {
    width: 72vw;
    border-radius: 24px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background-color: rgba(19, 17, 29, 1);

    padding: 219px 0 0;
}

.content-wrapper {
    align-self: center;
    display: flex;
    width: 100%;
    max-width: 1473px;
    flex-direction: column;
    align-items: center;
    text-align: center;
}

.hero-title {
    color: #fff;
    font-size: 60px;
    font-weight: 700;
    line-height: 92px;
    margin: 0;
}

.mood-prompt {
    color: #dfdfdf;
    font-size: 30px;
    font-weight: 400;
    margin: 40px 0;
    line-height: 1;
}

.join-button {
    border-radius: 100px;
    background-color: #fff;
    width: 259px;
    font-size: 24px;
    color: #000;
    padding: 20px 32px;
    border: none;
    font-weight: 700;
    cursor: pointer;
    /* font-family: inherit; */
}

.join-button:hover {
    background-color: #f5f5f5;
}

.join-button:focus {
    outline: 2px solid #fff;
    outline-offset: 2px;
}

.mood-grid {
    display: flex;
    margin-top: 170px;
    align-items: center;
    gap: 20px;
    justify-content: center;
}

.mood-card {
    background-color: #fff;
    border-radius: 40px 40px 0 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 220px;
    height: 190px;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    position: relative;
    z-index: 1;
}

.mood-card:hover {
    transform: scale(1.15);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
}

.happy {
    background-color: rgba(1, 178, 110, 1);
}

.sad {
    background-color: rgba(1, 114, 234, 1);
}

.eager {
    background-color: rgba(249, 114, 67, 1);
}

.angry {
    background-color: rgba(222, 56, 94, 1);
}

.anxiety {
    background-color: rgba(114, 67, 249, 1);
}

#anxiety {
    margin-top: 20px;
}

.mood-icon-wrapper {
    padding: 15px;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;
}

.mood-icon {
    width: 90px;
    height: auto;
}

@media (max-width: 991px) {
    .mood-pattern-hero {
        padding-top: 100px;
    }

    .hero-title {
        font-size: 40px;
        line-height: 51px;
    }

    .content-wrapper {
        max-width: 100%;
        padding: 0 20px;
    }

    .mood-grid {
        max-width: 100%;
        margin-top: 40px;
        flex-wrap: wrap;
    }

    .join-button {
        padding: 20px;
    }

    .mood-card {
        width: 150px;
        height: 150px;
    }
}
</style>
