<template>
    <div class="article-container">
        <section class="hero-section">
            <div class="content-wrapper">
                <BlogFilters
                    :tags="['Meditation & Mindfulness', 'Stress & Anxiety', 'Sleep', 'Mental Health', 'Personal Growth']"
                    :currentSort="sortOrder" @search="handleSearch" @tag-click="handleTagClick" @sort="handleSort" />

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
                                <Tag v-for="(tag, index) in article.Tags" :key="index" :text="tag" :color="'Primary'"
                                    @click.native="handleTagClick(tag)" />
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
                    <article class="article-card" v-for="article in articles.slice(0, 4)" :key="article.id">
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
import { ref } from 'vue';
import BlogFilters from './Components/BlogFilters.vue';
import Tag from '@/components/Helper/Tag.vue';
import data from '../../api/data.json';
import { useRouter } from "vue-router";

export default {
    name: 'ArticleList',
    components: {
        BlogFilters,
        Tag
    },
    setup() {
        const router = useRouter();
        const sortOrder = ref('newest');
        const categories = data.BlogList.Categories;
        const featuredArticles = data.BlogList.FeaturedArticles;
        const articles = data.BlogList.Articles;

        const updateQueryParams = (newParams) => {
            const currentQuery = { ...router.currentRoute.value.query };
            const updatedQuery = { ...currentQuery, ...newParams };
            for (const key in updatedQuery) {
                if (!updatedQuery[key]) delete updatedQuery[key];
            }
            router.push({ path: '/search-blogs', query: updatedQuery });
        };

        const handleSearch = (query) => {
            const searchQuery = String(query || '').trim();
            updateQueryParams({ title: searchQuery, tag: null, sort: null });
        };

        const handleTagClick = (tagOrCategory) => {
            if (tagOrCategory.Title) {
                updateQueryParams({ category: tagOrCategory.Id, tag: null, title: null });
            } else {
                updateQueryParams({ tag: tagOrCategory, category: null, title: null });
            }
        };

        const handleSort = (sortBy) => {
            sortOrder.value = sortBy;
            updateQueryParams({ sort: sortOrder.value, title: null, tag: null });
        };

        return {
            categories,
            featuredArticles,
            articles,
            sortOrder,
            handleSearch,
            handleTagClick,
            handleSort,
        };
    },
};
</script>


<style scoped>
.article-container {
    display: flex;
    flex-direction: column;
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

.article-card {
    max-width: 280px;
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
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
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

.sort-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
    margin: 20px 0;
    flex-wrap: wrap;
}

.sort-label {
    font-size: 16px;
    color: #555;
}

.sort-btn {
    padding: 8px 16px;
    font-size: 16px;
    background-color: #fff;
    border: 1px solid #ccc;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.sort-btn.active {
    background-color: #5488c7;
    color: #fff;
    border-color: #5488c7;
}

.sort-btn:hover {
    background-color: #f1f1f1;
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
