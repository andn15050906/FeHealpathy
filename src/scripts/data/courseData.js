export const courseProgressData = {
  currentCourse: {
    id: "1",
    title: "Khóa học Sức khỏe Tinh thần Cơ bản",
    description: "Học cách quản lý stress và cải thiện sức khỏe tinh thần",
    progress: 65,
    totalLectures: 12,
    completedLectures: 8,
    lastAccessed: "2024-03-20",
    lectures: [
      {
        id: "1",
        title: "Giới thiệu về Sức khỏe Tinh thần",
        duration: 30,
        completed: true,
        type: "video"
      },
      {
        id: "2",
        title: "Hiểu về Stress và Lo âu",
        duration: 45,
        completed: true,
        type: "video"
      },
      {
        id: "3",
        title: "Kỹ thuật Hít thở Cơ bản",
        duration: 20,
        completed: true,
        type: "practice"
      },
      {
        id: "4",
        title: "Thiền định cho Người mới bắt đầu",
        duration: 25,
        completed: true,
        type: "practice"
      },
      {
        id: "5",
        title: "Xây dựng Thói quen Tốt",
        duration: 35,
        completed: true,
        type: "video"
      },
      {
        id: "6",
        title: "Quản lý Thời gian Hiệu quả",
        duration: 40,
        completed: true,
        type: "video"
      },
      {
        id: "7",
        title: "Bài tập Thực hành Hàng ngày",
        duration: 30,
        completed: true,
        type: "practice"
      },
      {
        id: "8",
        title: "Kỹ năng Giao tiếp",
        duration: 45,
        completed: true,
        type: "video"
      },
      {
        id: "9",
        title: "Xây dựng Mối quan hệ Tích cực",
        duration: 35,
        completed: false,
        type: "video"
      },
      {
        id: "10",
        title: "Thực hành Chánh niệm",
        duration: 25,
        completed: false,
        type: "practice"
      },
      {
        id: "11",
        title: "Đối phó với Khó khăn",
        duration: 40,
        completed: false,
        type: "video"
      },
      {
        id: "12",
        title: "Tổng kết và Kế hoạch Tiếp theo",
        duration: 30,
        completed: false,
        type: "video"
      }
    ]
  },
  recentCourses: [
    {
      id: "2",
      title: "Khóa học Yoga Cơ bản",
      progress: 30,
      lastAccessed: "2024-03-19"
    },
    {
      id: "3",
      title: "Khóa học Thiền định Nâng cao",
      progress: 45,
      lastAccessed: "2024-03-18"
    }
  ],
  upcomingLectures: [
    {
      id: "9",
      title: "Xây dựng Mối quan hệ Tích cực",
      scheduledDate: "2024-03-21",
      duration: 35
    },
    {
      id: "10",
      title: "Thực hành Chánh niệm",
      scheduledDate: "2024-03-22",
      duration: 25
    }
  ]
}
