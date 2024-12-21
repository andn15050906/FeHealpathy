<template>
    <div class="search-results-container">
        <BlogFilters
            :tags="['Meditation & Mindfulness', 'Stress & Anxiety', 'Sleep', 'Mental Health', 'Personal Growth']"
            :currentSort="currentSort" @search="handleSearch" @tag-click="handleTagClick" @sort="handleSort" />

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
                        <div class="article-tags">
                            <span v-for="tag in article.Tags" :key="tag" class="article-tag"
                                @click="handleTagClick(tag)">
                                {{ tag }}
                            </span>
                        </div>
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
import BlogFilters from './Components/BlogFilters.vue';

export default {
    name: 'SearchBlogResult',
    components: {
        BlogFilters
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
            const { title, tag, category } = this.$route.query;
            const searchTerm = title ? title.trim().toLowerCase() : "";
            const selectedTag = tag ? tag.trim().toLowerCase() : null;
            const selectedCategory = category ? category.trim().toLowerCase() : null;

            const allArticles = [...this.featuredArticles, ...this.articles];

            let filteredArticles = allArticles.filter(article => {
                const matchesTitle = searchTerm
                    ? article.Title.trim().toLowerCase().includes(searchTerm)
                    : true;

                const matchesTag = selectedTag
                    ? article.Tags.some(t => t.trim().toLowerCase() === selectedTag)
                    : true;

                const matchesCategory = selectedCategory
                    ? article.Tags.some(t => t.trim().toLowerCase() === selectedCategory)
                    : true;

                return matchesTitle && matchesTag && matchesCategory;
            });

            let filteredCategories = this.categories.filter(categoryItem => {
                console.log('category', this.categories)
                return selectedCategory
                    ? categoryItem.Id.toLowerCase() === selectedCategory
                    : true;
            });

            return {
                articles: filteredArticles
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
    display: block;
    margin-top: 10px;
    font: 400 13px/1 Inter, sans-serif;
    color: #999;
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

.article-tags {
    margin-top: 10px;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.article-tag {
    padding: 5px 10px;
    font-size: 12px;
    background-color: #f2f2f2;
    border-radius: 5px;
    cursor: pointer;
    color: #007bff;
    transition: background-color 0.3s;
}

.article-tag:hover {
    background-color: #e0e0e0;
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