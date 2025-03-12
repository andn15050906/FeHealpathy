<template>
    <div class="moderate-users">
      <h1 class="title">Content Moderation</h1>
  
      <div class="tabs">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          :class="['tab-button', { active: currentTab === tab.id }]"
          @click="currentTab = tab.id"
        >
          {{ tab.name }}
          <span class="badge" v-if="tab.count">{{ tab.count }}</span>
        </button>
      </div>

      <div v-if="currentTab === 'notifications'" class="tab-content">
        <div class="content-header">
          <h2>Pending Notifications</h2>
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Search notifications..."
            class="search-input"
          />
        </div>
        <table class="content-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Creator</th>
              <th>Time</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in notifications" :key="item.id">
              <td>{{ item.id }}</td>
              <td>{{ item.title }}</td>
              <td>{{ item.creator }}</td>
              <td>{{ item.createdAt }}</td>
              <td>
                <span :class="['status-badge', item.status]">
                  {{ item.status }}
                </span>
              </td>
              <td class="action-buttons">
                <button class="btn btn-view" @click="viewContent(item)">
                  <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-approve" @click="approveContent(item)">
                  <i class="fas fa-check"></i>
                </button>
                <button class="btn btn-reject" @click="rejectContent(item)">
                  <i class="fas fa-times"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="currentTab === 'blogs'" class="tab-content">
        <div class="content-header">
          <h2>Pending Blog Posts</h2>
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Search blog posts..."
            class="search-input"
          />
        </div>
        <table class="content-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Author</th>
              <th>Category</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in blogs" :key="item.id">
              <td>{{ item.id }}</td>
              <td>{{ item.title }}</td>
              <td>{{ item.author }}</td>
              <td>{{ item.category }}</td>
              <td>
                <span :class="['status-badge', item.status]">
                  {{ item.status }}
                </span>
              </td>
              <td class="action-buttons">
                <button class="btn btn-view" @click="viewContent(item)">
                  <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-approve" @click="approveContent(item)">
                  <i class="fas fa-check"></i>
                </button>
                <button class="btn btn-reject" @click="rejectContent(item)">
                  <i class="fas fa-times"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Tab Groups -->
      <div v-if="currentTab === 'groups'" class="tab-content">
        <div class="content-header">
          <h2>Pending Groups</h2>
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Search groups..."
            class="search-input"
          />
        </div>
        <table class="content-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Group Name</th>
              <th>Creator</th>
              <th>Members</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in groups" :key="item.id">
              <td>{{ item.id }}</td>
              <td>{{ item.name }}</td>
              <td>{{ item.creator }}</td>
              <td>{{ item.memberCount }}</td>
              <td>
                <span :class="['status-badge', item.status]">
                  {{ item.status }}
                </span>
              </td>
              <td class="action-buttons">
                <button class="btn btn-view" @click="viewContent(item)">
                  <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-approve" @click="approveContent(item)">
                  <i class="fas fa-check"></i>
                </button>
                <button class="btn btn-reject" @click="rejectContent(item)">
                  <i class="fas fa-times"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        currentTab: 'notifications',
        searchQuery: "",
        tabs: [
          { id: 'notifications', name: 'Notifications', count: 5 },
          { id: 'blogs', name: 'Blog Posts', count: 12 },
          { id: 'groups', name: 'Groups', count: 3 }
        ],
        notifications: [
          { 
            id: 1, 
            title: 'System Maintenance Notice', 
            creator: 'Admin', 
            createdAt: '2024-03-15 10:30',
            status: 'pending' 
          },
        ],
        blogs: [
          {
            id: 1,
            title: 'Daily Health Tips',
            author: 'John Smith',
            category: 'Health',
            status: 'pending'
          },
        ],
        groups: [
          {
            id: 1,
            name: 'Sports Community',
            creator: 'Jane Wilson',
            memberCount: 150,
            status: 'pending'
          },
        ]
      };
    },
    methods: {
      viewContent(item) {
        console.log('View details:', item);
      },
      approveContent(item) {
        console.log('Approve:', item);
      },
      rejectContent(item) {
        console.log('Reject:', item);
      }
    },
    mounted() {
      const link = document.createElement('link');
      link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css';
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }
  };
  </script>
  
  <style scoped>
  .moderate-users {
    padding: 20px;
  }
  
  .title {
    margin-bottom: 30px;
    color: #333;
  }

  .tabs {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
  }

  .tab-button {
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-weight: bold;
    background: #f5f5f5;
    color: #666;
    position: relative;
  }

  .tab-button.active {
    background: #007bff;
    color: white;
  }

  .badge {
    position: absolute;
    top: -8px;
    right: -8px;
    background: #dc3545;
    color: white;
    border-radius: 50%;
    padding: 2px 6px;
    font-size: 12px;
  }

  .content-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
  
  .search-input {
    width: 300px;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 5px;
  }
  
  .content-table {
    width: 100%;
    border-collapse: collapse;
    background: white;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
  
  .content-table th,
  .content-table td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid #eee;
  }
  
  .content-table th {
    background: #f8f9fa;
    font-weight: bold;
    color: #333;
  }
  
  .status-badge {
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
  }

  .status-badge.pending {
    background: #fff3cd;
    color: #856404;
  }

  .status-badge.approved {
    background: #d4edda;
    color: #155724;
  }

  .status-badge.rejected {
    background: #f8d7da;
    color: #721c24;
  }
  
  .action-buttons {
    display: flex;
    gap: 5px;
  }
  
  .btn {
    width: 32px;
    height: 32px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s;
  }
  
  .btn:hover {
    transform: translateY(-2px);
  }
  
  .btn-view {
    background: #6c757d;
    color: white;
  }
  
  .btn-approve {
    background: #28a745;
    color: white;
  }
  
  .btn-reject {
    background: #dc3545;
    color: white;
  }
  </style>