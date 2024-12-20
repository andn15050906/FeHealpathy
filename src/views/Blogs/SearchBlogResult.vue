<template>
    <div class="search-results-container">
        <h1 class="search-results-heading">Kết quả tìm kiếm</h1>

        <div v-if="filteredResults.articles.length === 0" class="no-results">
            <p>Không tìm thấy kết quả nào.</p>
        </div>

        <div v-else>
            <div class="articles-list">
                <div v-for="article in filteredResults.articles" :key="article.id" class="article-card">
                    <a :href="article.Link" class="article-link">
                        <img :src="article.Thumb" :alt="article.Title" class="article-image" />
                    </a>
                    <div class="article-content">
                        <a :href="article.Link" class="article-title">{{ article.Title }}</a>
                        <time class="article-date">{{ article.Date }}</time>
                    </div>
                </div>
            </div>

            <div class="categories-list">
                <div v-for="category in filteredResults.categories" :key="category.Id" class="category-card">
                    <a :href="category.Link" class="category-link">
                        <span class="category-title">{{ category.Title }}</span>
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import data from '../../api/data.json';

export default {
    name: 'SearchBlogResult',
    mounted() {
        console.log("Route query params:", this.$route.query);
    },
    data() {
        return {
            featuredArticles: data.BlogList.FeaturedArticles,
            articles: data.BlogList.Articles,
            categories: data.BlogList.Categories,
            query: this.$route.query,
        };
    },
    computed: {
        filteredResults() {
            const { title, tag } = this.$route.query;
            const searchTerm = title ? title.trim().toLowerCase() : "";

            let filteredArticles = this.articles.filter(article => {
                const normalizedTitle = article.Title.trim().toLowerCase();
                const matchesTitle = normalizedTitle.includes(searchTerm);
                const matchesTag = tag ? article.Tags.some(t => t.toLowerCase() === tag.toLowerCase()) : true;
                return matchesTitle && matchesTag;
            });

            return {
                articles: filteredArticles,
            };
        }
    }
};
</script>


<style scoped>
.search-results-container {
    margin-top: 60px;
    padding: 0 20px;
}

.search-results-heading {
    font-size: 28px;
    font-weight: bold;
    margin-bottom: 20px;
}

.no-results {
    text-align: center;
    font-size: 18px;
}

.articles-list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(279px, 1fr));
    gap: 20px;
}

.article-card {
    padding: 10px;
    display: flex;
    flex-direction: column;
}

.article-title {
    margin-top: 16px;
    font-size: 24px;
    color: #000;
}

a.article-title {
    text-decoration: none;
}

.article-image {
    width: 100%;
    border-radius: 10px;
    object-fit: cover;
}

.article-date {
    margin-top: 5px;
    font-size: 14px;
    color: #666;
}

.categories-list {
    margin-top: 40px;
}

.category-card {
    padding: 10px;
}

.category-title {
    font-size: 20px;
    color: #000;
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