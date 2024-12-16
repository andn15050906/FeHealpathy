<template>
    <div class="article-container">
        <section class="hero-section">
            <div class="content-wrapper">
                <div class="article-search-bar-wrapper">
                    <div class="article-search-bar">
                        <SearchBar />
                    </div>
                </div>

                <nav class="category-nav">
                    <Tag :text="'Meditation & Mindfulness'" :color="'red'" />
                    <Tag :text="'Stress & Anxiety'" :color="'red'" />
                    <Tag :text="'Sleep'" :color="'red'" />
                    <Tag :text="'Mental Health'" :color="'red'" />
                    <Tag :text="'Personal Growth'" :color="'red'" />
                </nav>

                <h1 class="featured-heading">New & Featured Articles</h1>

                <div class="featured-articles">
                    <div v-for="(article, index) in featuredArticles" :key="index" class="featured-grid">
                        <div class="featured-main">
                            <a href="#" class="article-link">
                                <img :src="article.Thumb" alt="Featured" class="article-image" loading="lazy" />
                            </a>
                        </div>
                        <div class="article-content">
                            <div class="tag-list">
                                <Tag v-for="(tag, index) in article.Tags" :key="index" :text="tag" :color="'Primary'" />
                            </div>
                            <h2 class="article-title">{{ article.Title }}</h2>
                            <p class="article-excerpt">{{ article.Excerpt }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="category-section" v-for="category in categories" :key="category.Id">
            <div class="content-wrapper">
                <div class="section-header">
                    <h2 class="section-title">{{ category.Title }}</h2>
                    <a href="#" class="view-all">View All</a>
                </div>

                <div class="article-grid">
                    <article class="article-card" v-for="article in articles.splice(0, 4)" :key="article.id">
                        <a :href="article.Link" class="article-link">
                            <img :src="article.Thumb" :alt="article.Title" class="article-image" loading="lazy" />
                        </a>
                        <div class="article-content">
                            <a :href="article.Link" class="article-title">{{ article.Title }}</a>
                            <time class="article-date">{{ article.Date }}</time>
                        </div>
                    </article>
                </div>
            </div>
        </section>
    </div>
</template>

<script>
import SearchBar from '@/components/Helper/SearchBar.vue';
import Tag from '@/components/Helper/Tag.vue';
import data from '../../api/data.json';

export default {
    name: 'ArticleList',
    data() {
        return {
            categories: data.BlogList.Categories,
            featuredArticles: data.BlogList.FeaturedArticles,
            articles: data.BlogList.Articles
        }
    },
    components: {
        SearchBar,
        Tag
    }
}
</script>

<style scoped>
.article-container {
    display: flex;
    flex-direction: column;
    margin-top: 120px;
    margin-bottom: 40px;
}

.hero-section {
    min-height: 780px;
    background: #fff;
}

.article-search-bar-wrapper {
    display: flex;
    justify-content: center;
    margin-bottom: 40px;
}

.article-search-bar {
    width: 800px;
}

.content-wrapper {
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
}

.category-nav {
    display: flex;
    justify-content: center;
    gap: 16px;
    flex-wrap: wrap;
    padding: 0 143px;
}

.featured-heading {
    text-align: center;
    margin-top: 77px;
    font: 700 30px/1 Inter, sans-serif;
    color: #000;
}

.featured-articles {
    margin-top: 44px;
}

.featured-grid {
    display: grid;
    grid-template-columns: 36% 64%;
    gap: 20px;
    margin: 60px;
}

.article-image {
    width: 100%;
    border-radius: 20px;
    aspect-ratio: 1;
    object-fit: cover;
}

.tag-list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.tag {
    padding: 3px 10px;
    border-radius: 100px;
    background: #f3fcff;
    color: #389fe6;
    font: 600 11px/2 Inter, sans-serif;
    text-transform: uppercase;
    letter-spacing: 1.1px;
}

.article-title {
    margin-top: 16px;
    font-size: 24px;
    color: #000;
}

a.article-title {
    text-decoration: none;
}

.article-excerpt {
    margin-top: 10px;
    font: 400 17px/25px Inter, sans-serif;
    color: #000;
}

.article-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(279px, 1fr));
    gap: 20px;
    margin-top: 17px;
}

.article-card {
    padding: 10px;
    display: flex;
    flex-direction: column;
}

.article-date {
    display: block;
    margin-top: 10px;
    font: 400 13px/1 Inter, sans-serif;
    color: #999;
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 48px;
}

.section-title {
    font: 700 30px/1 Inter, sans-serif;
    color: #000;
}

.view-all {
    font: 700 17px/32px Inter, sans-serif;
    color: #555be4;
    text-decoration: none;
}

@media (max-width: 1000px) {
    .category-nav {
        padding: 0 20px;
    }

    .featured-heading {
        margin-top: 40px;
    }

    .featured-grid {
        grid-template-columns: 1fr;
    }

    .article-grid {
        grid-template-columns: 1fr;
    }

    .article-title {
        font-size: 28px;
        line-height: 36px;
    }
}
</style>