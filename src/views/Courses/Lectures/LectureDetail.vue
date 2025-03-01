<template>
  <div class="lecture-detail-container">
    <div class="lecture-header">
      <h1>{{ lecture.title }}</h1>
      <p class="lecture-meta">
        🕒 Created: {{ formatDate(lecture.creationTime) }} • 🖋️ Last Updated:
        {{ formatDate(lecture.lastModificationTime) }}
      </p>
    </div>

    <div class="lecture-content">
      <p>{{ lecture.content }}</p>
    </div>

    <div class="lecture-materials" v-if="lecture.materials.length">
      <h2>📎 Attached Materials</h2>
      <div class="material-grid">
        <div
          v-for="(material, index) in lecture.materials"
          :key="index"
          class="material-card"
        >
          <template v-if="isImage(material.url)">
            <img
              :src="material.url"
              :alt="material.title"
              class="material-image"
            />
          </template>
          <template v-else-if="isVideo(material.url)">
            <video controls :src="material.url" class="material-video"></video>
          </template>
          <template v-else>
            <a :href="material.url" target="_blank" class="material-link">
              📄 {{ material.title }} ({{ material.type }})
            </a>
            <button
              class="btn-download"
              @click="downloadFile(material.url, material.title)"
            >
              ⬇️ Download
            </button>
          </template>
        </div>
      </div>
    </div>

    <button class="btn-back" @click="goBack">⬅️ Back to Course</button>
  </div>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";

export default {
  name: "LectureDetail",
  setup() {
    const router = useRouter();

    const lecture = ref({
      title: "Introduction to Vue.js",
      content:
        "Vue.js is a progressive JavaScript framework used for building user interfaces...",
      creationTime: "2025-03-01T10:00:00Z",
      lastModificationTime: "2025-03-15T14:30:00Z",
      materials: [
        {
          url: "https://via.placeholder.com/600x350",
          title: "Sample Image",
          type: "Image",
        },
        {
          url: "https://www.w3schools.com/html/mov_bbb.mp4",
          title: "Sample Video",
          type: "Video",
        },
        {
          url: "https://example.com/sample.pdf",
          title: "Sample PDF",
          type: "Document",
        },
      ],
    });

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    };

    const isImage = (url) => /\.(jpg|jpeg|png|gif)$/i.test(url);

    const isVideo = (url) => /\.(mp4|webm|ogg)$/i.test(url);

    const downloadFile = (url, filename) => {
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      link.click();
    };

    const goBack = () => {
      router.push("/courses-detail");
    };

    return {
      lecture,
      formatDate,
      isImage,
      isVideo,
      downloadFile,
      goBack,
    };
  },
};
</script>

<style scoped>
.lecture-detail-container {
  max-width: 1100px;
  margin: auto;
  background: white;
  padding: 50px;
  border-radius: 12px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
  min-height: 85vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.lecture-header {
  text-align: center;
  margin-bottom: 30px;
}

.lecture-header h1 {
  font-size: 30px;
  margin-bottom: 10px;
  color: #333;
}

.lecture-meta {
  font-size: 16px;
  color: #777;
}

.lecture-content {
  font-size: 20px;
  line-height: 1.8;
  margin-bottom: 50px;
  color: #444;
  text-align: center;
  max-width: 900px;
}

.lecture-materials {
  margin-top: 50px;
  width: 100%;
  text-align: center;
}

.lecture-materials h2 {
  font-size: 24px;
  color: #222;
  margin-bottom: 30px;
}

.material-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 25px;
  width: 100%;
  justify-content: center;
}

.material-card {
  background: #f9f9f9;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.2s ease;
}

.material-card:hover {
  transform: translateY(-5px);
}

.material-image {
  width: 100%;
  max-height: 220px;
  object-fit: cover;
  border-radius: 10px;
}

.material-video {
  width: 100%;
  height: 220px;
  border-radius: 10px;
}

.material-link {
  display: inline-block;
  padding: 12px;
  background: #007bff;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  font-weight: bold;
  margin-bottom: 12px;
  transition: background 0.3s ease;
}

.material-link:hover {
  background: #0056b3;
}

.btn-download {
  display: inline-block;
  width: 100%;
  padding: 12px;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  transition: background 0.3s ease;
}

.btn-download:hover {
  background: #218838;
}

.btn-back {
  display: block;
  width: 250px;
  margin: 50px auto 0;
  padding: 15px;
  background: #ff9800;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  transition: background 0.3s ease;
}

.btn-back:hover {
  background: #e68900;
}

@media (max-width: 768px) {
  .material-grid {
    grid-template-columns: 1fr;
  }

  .lecture-content {
    font-size: 18px;
  }

  .lecture-detail-container {
    padding: 30px;
  }
}
</style>
