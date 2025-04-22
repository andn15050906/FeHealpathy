<template>
  <div class="blog-meta">
    <div class="author-section">
      <img :src="BlogMeta.Author.AvatarUrl" alt="Ảnh đại diện tác giả" class="author-avatar" />
      <div class="author-info">
        <h3 class="author-name">{{ BlogMeta.Author.Name }}</h3>
        <span class="author-handle">{{ BlogMeta.Author.Handle }}</span>
        <button class="follow-button">{{ BlogMeta.FollowButtonText }}</button>
      </div>
    </div>

    <div class="post-stats">
      <div class="stat-group">
        <span class="stat-item" v-for="(stat, index) in BlogMeta.Stats" :key="index">
          <img :src="stat.icon" alt="" />
          {{ stat.value }}
        </span>
      </div>
    </div>
    <h1 class="post-title">{{ BlogMeta.Post.Title }}</h1>
    <div class="post-meta">
      <span class="post-date">{{ BlogMeta.Post.Meta }}</span>
    </div>
  </div>
</template>

<script>
import data from '../../scripts/data/data.json';

export default {
  name: 'BlogMeta',
  data() {
    return {
      BlogMeta: data.BlogMeta
    };
  },
};
</script>

<style scoped>
.blog-meta {
  margin-bottom: 40px;
}

.author-section {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
}

.author-avatar {
  width: 45px;
  height: 45px;
  border-radius: 50%;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 5px;
}

.author-name {
  color: #5488c7;
  font: 700 14px/24px Roboto, sans-serif;
  margin: 0;
}

.author-handle {
  color: #9b9b9b;
  font: 400 14px/2 Roboto, sans-serif;
}

.follow-button {
  border-radius: 3px;
  background: #fff;
  color: #606266;
  font: 500 12px/1 Roboto, sans-serif;
  padding: 6px 16px;
  border: 1px solid #dcdfe6;
  cursor: pointer;
}

.post-stats {
  margin-bottom: 20px;
}

.stat-group {
  display: flex;
  gap: 15px;
  color: #9b9b9b;
  font: 400 14px/24px Roboto, sans-serif;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.stat-item img {
  width: 14px;
  height: 14px;
}

.post-title {
  color: #1b1b1b;
  font: 700 40px/48px Roboto, sans-serif;
  margin: 0 0 20px;
}

.post-meta {
  color: #9b9b9b;
  font: 400 14px/1.6 Roboto, sans-serif;
}

@media (max-width: 991px) {
  .post-title {
    font-size: 32px;
    line-height: 1.2;
  }
}
</style>