export const roadmapSteps = [
  {
    id: 1,
    title: "Nhận biết bản thân",
    completed: true,
    icon: "mdi-eye-outline",
  },
  {
    id: 2,
    title: "Tìm kiếm sự hỗ trợ",
    completed: true,
    icon: "mdi-hand-heart-outline",
  },
  {
    id: 3,
    title: "Xây dựng thói quen lành mạnh",
    completed: false,
    active: true,
    icon: "mdi-sprout-outline",
  },
  {
    id: 4,
    title: "Phát triển chiến lược đối phó",
    completed: false,
    icon: "mdi-brain",
  },
  {
    id: 5,
    title: "Duy trì sức khỏe tinh thần",
    completed: false,
    icon: "mdi-heart-pulse",
  },
]

// Roadmap list data
export const mentalHealthRoadmaps = [
  {
    id: "1",
    title: "Vượt qua lo âu",
    description: "Học cách nhận biết và vượt qua các triệu chứng lo âu phổ biến",
    steps: 5,
    category: "anxiety",
    featured: true,
    completionRate: 78,
    image: "/images/anxiety.jpg",
  },
  {
    id: "2",
    title: "Xây dựng sự tự tin",
    description: "Phát triển sự tự tin và khả năng đối mặt với thử thách mới",
    steps: 4,
    category: "confidence",
    featured: true,
    completionRate: 85,
    image: "/images/confidence.jpg",
  },
  {
    id: "3",
    title: "Kiểm soát cảm xúc",
    description: "Học cách nhận biết và điều chỉnh cảm xúc tiêu cực",
    steps: 3,
    category: "emotions",
    featured: false,
    completionRate: 62,
    image: "/images/emotions.jpg",
  },
  {
    id: "4",
    title: "Cân bằng công việc - cuộc sống",
    description: "Tạo sự cân bằng giữa công việc và cuộc sống cá nhân",
    steps: 4,
    category: "work-life",
    featured: false,
    completionRate: 70,
    image: "/images/balance.jpg",
  },
  {
    id: "5",
    title: "Giấc ngủ chất lượng",
    description: "Phương pháp giúp ngủ ngon và sâu giấc",
    steps: 3,
    category: "sleep",
    featured: false,
    completionRate: 90,
    image: "/images/sleep.jpg",
  },
]

// Detailed roadmap data
export const roadmapDetails = {
  1: {
    id: "1",
    title: "Vượt qua lo âu",
    description: "Học cách nhận biết và vượt qua các triệu chứng lo âu phổ biến",
    progress: 0,
    introText: [
      "Lộ trình này được thiết kế dựa trên các phương pháp đã được chứng minh hiệu quả trong việc hỗ trợ sức khỏe tinh thần.",
      "Trong quá trình này, bạn sẽ học cách nhận diện những suy nghĩ tiêu cực, thách thức chúng và thay thế bằng những suy nghĩ tích cực hơn.",
      "Mỗi bước trong lộ trình sẽ cung cấp cho bạn các công cụ và kỹ thuật thực tế để cải thiện sức khỏe tinh thần.",
    ],
    phases: [
      {
        id: "1",
        title: "Nhận diện vấn đề",
        description: "Nhận biết các triệu chứng lo âu và hiểu nguồn gốc của chúng",
        videoUrl: "/videos/phase1.mp4",
        exerciseCount: 2,
        completed: false,
        current: true,
        themeColor: "indigo",
      },
      {
        id: "2",
        title: "Giảm nhẹ tức thì",
        description: "Học các kỹ thuật thư giãn nhanh để giảm lo âu trong tình huống khẩn cấp",
        videoUrl: "/videos/phase2.mp4",
        audioUrl: "/audio/relaxation.mp3",
        exerciseCount: 3,
        completed: false,
        current: false,
        themeColor: "teal",
      },
      {
        id: "3",
        title: "Ổn định tâm trí",
        description: "Thực hành chánh niệm và các bài tập thiền để ổn định tâm trí",
        videoUrl: "/videos/phase3.mp4",
        audioUrl: "/audio/meditation.mp3",
        exerciseCount: 4,
        completed: false,
        current: false,
        themeColor: "purple",
      },
      {
        id: "4",
        title: "Đối mặt với vấn đề",
        description: "Phát triển chiến lược để đối mặt với các tình huống gây lo âu",
        videoUrl: "/videos/phase4.mp4",
        exerciseCount: 5,
        completed: false,
        current: false,
        themeColor: "blue",
      },
      {
        id: "5",
        title: "Duy trì và phát triển",
        description: "Xây dựng kế hoạch duy trì lâu dài và tiếp tục phát triển",
        videoUrl: "/videos/phase5.mp4",
        exerciseCount: 3,
        completed: false,
        current: false,
        themeColor: "green",
      },
    ],
  },
  2: {
    id: "2",
    title: "Xây dựng sự tự tin",
    description: "Phát triển sự tự tin và khả năng đối mặt với thử thách mới",
    progress: 0,
    introText: [
      "Lộ trình này giúp bạn xây dựng sự tự tin từ bên trong, dựa trên các nguyên tắc tâm lý học tích cực.",
      "Bạn sẽ học cách nhận diện và vượt qua những rào cản tự tạo, phát triển tư duy tích cực và xây dựng hình ảnh bản thân mạnh mẽ.",
      "Mỗi bước trong lộ trình đều cung cấp các bài tập thực hành để bạn có thể áp dụng ngay vào cuộc sống hàng ngày.",
    ],
    phases: [
      {
        id: "1",
        title: "Nhận diện niềm tin giới hạn",
        description: "Xác định những niềm tin tiêu cực đang cản trở sự tự tin của bạn",
        videoUrl: "/videos/confidence-phase1.mp4",
        exerciseCount: 3,
        completed: false,
        current: true,
        themeColor: "indigo",
      },
      {
        id: "2",
        title: "Xây dựng tư duy tích cực",
        description: "Phát triển cách nhìn tích cực về bản thân và khả năng của mình",
        videoUrl: "/videos/confidence-phase2.mp4",
        exerciseCount: 4,
        completed: false,
        current: false,
        themeColor: "teal",
      },
      {
        id: "3",
        title: "Vượt qua nỗi sợ thất bại",
        description: "Học cách đối mặt với thất bại và biến nó thành cơ hội học hỏi",
        videoUrl: "/videos/confidence-phase3.mp4",
        exerciseCount: 3,
        completed: false,
        current: false,
        themeColor: "purple",
      },
      {
        id: "4",
        title: "Xây dựng hình ảnh bản thân mạnh mẽ",
        description: "Phát triển hình ảnh bản thân tích cực và vững vàng",
        videoUrl: "/videos/confidence-phase4.mp4",
        exerciseCount: 4,
        completed: false,
        current: false,
        themeColor: "blue",
      },
    ],
  },
}

// Detailed phase data
export const phaseDetails = {
  "1": {
    "1": {
      id: "1",
      roadmapId: "1",
      title: "Nhận diện triệu chứng lo âu",
      description: "Học cách nhận biết các dấu hiệu và triệu chứng của lo âu",
      themeColor: "indigo",
      introduction:
        "Bước đầu tiên để vượt qua lo âu là nhận diện và thừa nhận vấn đề. Trong phase này, bạn sẽ học cách nhận biết các triệu chứng lo âu, hiểu nguồn gốc của chúng và tác động của chúng đến cuộc sống hàng ngày của bạn.",
      videoUrl: "/videos/phase1.mp4",
      tips: [
        {
          title: "Lắng nghe cơ thể",
          content: "Chú ý đến các phản ứng thể chất như tim đập nhanh, khó thở, hoặc căng cơ",
          icon: "mdi-heart-pulse",
        },
        {
          title: "Ghi chú hàng ngày",
          content: "Ghi lại các triệu chứng và tình huống gây lo âu để nhận diện mẫu hình",
          icon: "mdi-notebook",
        },
      ],
      actions: [
        {
          id: "1-1",
          title: "Nhật ký triệu chứng",
          description: "Ghi lại các triệu chứng lo âu bạn gặp phải trong ngày",
          duration: "10 phút",
          completed: false,
          required: true,
          moodTags: ["Tự nhận thức", "Theo dõi triệu chứng"],
        },
        {
          id: "1-2",
          title: "Đánh giá mức độ lo âu",
          description: "Đánh giá mức độ lo âu của bạn trên thang điểm từ 1-10",
          duration: "5 phút",
          completed: false,
          required: true,
          moodTags: ["Đo lường", "Tự đánh giá"],
        },
        {
          id: "1-3",
          title: "Xác định yếu tố kích hoạt",
          description: "Nhận diện các tình huống hoặc suy nghĩ gây ra lo âu",
          duration: "15 phút",
          completed: false,
          required: false,
          moodTags: ["Phân tích", "Nhận thức"],
        },
      ],
      canSkip: false,
      requireConfirmation: false,
      nextPhaseId: "2",
      completionCriteria: [
        {
          title: "Nhận diện triệu chứng",
          description: "Bạn có thể nhận diện được các triệu chứng lo âu của mình",
        },
        {
          title: "Hiểu nguồn gốc",
          description: "Bạn hiểu được nguồn gốc của lo âu và các yếu tố kích hoạt",
        },
        {
          title: "Áp dụng kỹ thuật",
          description: "Bạn đã thử và áp dụng được ít nhất một kỹ thuật giảm lo âu",
        },
      ],
      resources: [
        { title: "Hiểu về lo âu và các triệu chứng", url: "/docs/anxiety-symptoms" },
        { title: "Kỹ thuật thở để giảm lo âu", url: "/docs/breathing-techniques" },
        { title: "Nhận diện và thách thức suy nghĩ tiêu cực", url: "/docs/negative-thoughts" },
      ],
    },
    "2": {
      id: "2",
      roadmapId: "1",
      title: "Giảm nhẹ tức thì",
      description: "Học các kỹ thuật thư giãn nhanh để giảm lo âu trong tình huống khẩn cấp",
      themeColor: "teal",
      introduction:
        "Sau khi đã nhận diện vấn đề, phase tiếp theo là học các kỹ thuật giảm nhẹ tức thì. Những kỹ thuật này sẽ giúp bạn đối phó với các tình huống gây lo âu và giảm triệu chứng ngay lập tức khi chúng xuất hiện.",
      videoUrl: "/videos/phase2.mp4",
      tips: [
        {
          title: "Thực hành thường xuyên",
          content: "Các kỹ thuật thở và thư giãn hiệu quả hơn khi được thực hành thường xuyên",
          icon: "mdi-repeat",
        },
        {
          title: "Tìm không gian yên tĩnh",
          content: "Nếu có thể, hãy tìm một nơi yên tĩnh để thực hành các kỹ thuật này",
          icon: "mdi-meditation",
        },
      ],
      actions: [
        {
          id: "2-1",
          title: "Kỹ thuật thở 4-7-8",
          description: "Hít vào trong 4 giây, giữ 7 giây, và thở ra trong 8 giây",
          duration: "5 phút",
          completed: false,
          required: true,
          moodTags: ["Giảm nhẹ nhanh", "Kiểm soát hơi thở"],
        },
        {
          id: "2-2",
          title: "Thư giãn cơ bắp tiến triển",
          description: "Căng và thả lỏng từng nhóm cơ để giảm căng thẳng",
          duration: "10 phút",
          completed: false,
          required: false,
          moodTags: ["Thư giãn cơ thể", "Giảm căng thẳng"],
        },
        {
          id: "2-3",
          title: "Kỹ thuật neo đậu 5-4-3-2-1",
          description: "Sử dụng 5 giác quan để kéo bạn trở lại hiện tại",
          duration: "5 phút",
          completed: false,
          required: true,
          moodTags: ["Chánh niệm", "Tập trung"],
        },
      ],
      canSkip: true,
      requireConfirmation: false,
      nextPhaseId: "3",
      completionCriteria: [
        {
          title: "Thực hành thiền định",
          description: "Bạn đã thực hành thiền định ít nhất 3 lần một tuần",
        },
        {
          title: "Xây dựng thói quen",
          description: "Bạn đã bắt đầu xây dựng ít nhất một thói quen tích cực mới",
        },
        {
          title: "Áp dụng kỹ thuật",
          description: "Bạn đã áp dụng các kỹ thuật đối phó khi gặp tình huống lo âu",
        },
      ],
      resources: [
        { title: "Hướng dẫn thiền định cho người mới bắt đầu", url: "/docs/meditation-guide" },
        { title: "Xây dựng thói quen tích cực", url: "/docs/positive-habits" },
        { title: "Kỹ thuật đối phó với lo âu", url: "/docs/coping-techniques" },
      ],
    },
    "3": {
      id: "3",
      roadmapId: "1",
      title: "Ổn định tâm trí",
      description: "Thực hành chánh niệm và các bài tập thiền để ổn định tâm trí",
      themeColor: "purple",
      introduction:
        "Suy nghĩ tiêu cực thường là nguyên nhân chính gây ra lo âu. Trong phase này, bạn sẽ học cách nhận diện, thách thức và thay đổi các mẫu suy nghĩ tiêu cực để giảm lo âu và cải thiện sức khỏe tinh thần.",
      videoUrl: "/videos/phase3.mp4",
      tips: [
        {
          title: "Tìm bằng chứng",
          content: "Khi có suy nghĩ tiêu cực, hãy tìm bằng chứng ủng hộ và phản bác nó",
          icon: "mdi-scale-balance",
        },
        {
          title: "Đặt câu hỏi",
          content: "Hỏi bản thân: 'Điều tồi tệ nhất có thể xảy ra là gì? Khả năng xảy ra là bao nhiêu?'",
          icon: "mdi-help-circle",
        },
        {
          title: "Thay thế suy nghĩ",
          content: "Thực hành thay thế suy nghĩ tiêu cực bằng suy nghĩ cân bằng hơn",
          icon: "mdi-swap-horizontal",
        },
      ],
      actions: [
        {
          id: "3-1",
          title: "Nhật ký suy nghĩ",
          description: "Ghi lại các suy nghĩ tiêu cực và tác động của chúng",
          duration: "15 phút",
          completed: false,
          required: true,
          moodTags: ["Nhận thức", "Phân tích"],
        },
        {
          id: "3-2",
          title: "Nhận diện lỗi suy nghĩ",
          description: "Học cách nhận diện các lỗi suy nghĩ phổ biến như suy nghĩ nhị nguyên, đọc suy nghĩ",
          duration: "10 phút",
          completed: false,
          required: true,
          moodTags: ["Nhận thức", "Tư duy phản biện"],
        },
        {
          id: "3-3",
          title: "Thực hành tái cấu trúc nhận thức",
          description: "Thách thức và thay đổi suy nghĩ tiêu cực thành cân bằng hơn",
          duration: "20 phút",
          completed: false,
          required: false,
          moodTags: ["Thay đổi suy nghĩ", "Tích cực hóa"],
        },
      ],
      canSkip: false,
      requireConfirmation: false,
      nextPhaseId: "4",
      completionCriteria: [
        {
          title: "Thực hành chánh niệm",
          description: "Bạn đã thực hành chánh niệm ít nhất 5 phút mỗi ngày",
        },
        {
          title: "Nhận biết suy nghĩ",
          description: "Bạn có thể nhận biết suy nghĩ tiêu cực khi chúng xuất hiện",
        },
        {
          title: "Ổn định tâm trí",
          description: "Bạn có thể ổn định tâm trí khi cảm thấy lo âu",
        },
      ],
      resources: [
        { title: "Hướng dẫn thực hành chánh niệm", url: "/docs/mindfulness-guide" },
        { title: "Kỹ thuật thiền cho người mới bắt đầu", url: "/docs/meditation-beginners" },
        { title: "Ổn định tâm trí trong cuộc sống hàng ngày", url: "/docs/daily-mindfulness" },
      ],
    },
    "4": {
      id: "4",
      roadmapId: "1",
      title: "Đối mặt với vấn đề",
      description: "Phát triển chiến lược để đối mặt với các tình huống gây lo âu",
      themeColor: "blue",
      introduction:
        "Đối mặt với vấn đề là một bước quan trọng trong việc vượt qua lo âu. Trong phase này, bạn sẽ học cách phát triển các chiến lược để đối mặt với các tình huống gây lo âu và xây dựng sự tự tin.",
      videoUrl: "/videos/phase4.mp4",
      tips: [
        {
          title: "Tiếp cận từng bước",
          content: "Chia nhỏ các tình huống khó khăn thành các bước nhỏ hơn, dễ quản lý hơn",
          icon: "mdi-stairs",
        },
        {
          title: "Thực hành thường xuyên",
          content: "Đối mặt thường xuyên với các tình huống gây lo âu sẽ giúp giảm phản ứng lo âu theo thời gian",
          icon: "mdi-repeat",
        },
      ],
      actions: [
        {
          id: "4-1",
          title: "Xây dựng thang đo lo âu",
          description: "Tạo danh sách các tình huống gây lo âu từ nhẹ đến nặng",
          duration: "15 phút",
          completed: false,
          required: true,
          moodTags: ["Lập kế hoạch", "Tự nhận thức"],
        },
        {
          id: "4-2",
          title: "Thực hành đối mặt",
          description: "Đối mặt với một tình huống gây lo âu nhẹ từ thang đo của bạn",
          duration: "30 phút",
          completed: false,
          required: true,
          moodTags: ["Đối mặt", "Xây dựng sự tự tin"],
        },
        {
          id: "4-3",
          title: "Phản ánh và điều chỉnh",
          description: "Đánh giá trải nghiệm đối mặt và điều chỉnh chiến lược nếu cần",
          duration: "10 phút",
          completed: false,
          required: false,
          moodTags: ["Phản ánh", "Học hỏi"],
        },
      ],
      canSkip: false,
      requireConfirmation: false,
      nextPhaseId: "5",
      completionCriteria: [
        {
          title: "Xây dựng thang đo",
          description: "Bạn đã xây dựng thang đo các tình huống gây lo âu",
        },
        {
          title: "Đối mặt với tình huống",
          description: "Bạn đã đối mặt với ít nhất một tình huống gây lo âu",
        },
        {
          title: "Áp dụng kỹ thuật",
          description: "Bạn đã áp dụng các kỹ thuật đã học để đối phó với tình huống",
        },
      ],
      resources: [
        { title: "Kỹ thuật đối mặt với lo âu", url: "/docs/facing-anxiety" },
        { title: "Xây dựng sự tự tin", url: "/docs/building-confidence" },
        { title: "Chiến lược đối phó với tình huống khó khăn", url: "/docs/coping-strategies" },
      ],
    },
    "5": {
      id: "5",
      roadmapId: "1",
      title: "Đánh giá & Duy trì",
      description: "Đánh giá tiến độ và xây dựng kế hoạch duy trì lâu dài",
      themeColor: "green",
      introduction:
        "Phase cuối cùng tập trung vào việc đánh giá tiến độ của bạn và xây dựng kế hoạch duy trì lâu dài. Bạn sẽ xem xét những gì đã học được, đánh giá sự tiến bộ và phát triển chiến lược để duy trì những kỹ năng mới.",
      videoUrl: "/videos/phase5.mp4",
      tips: [
        {
          title: "Ghi nhận tiến bộ",
          content: "Dành thời gian để ghi nhận và ăn mừng những tiến bộ bạn đã đạt được",
          icon: "mdi-trophy",
        },
        {
          title: "Xây dựng thói quen",
          content: "Tích hợp các kỹ thuật bạn đã học vào thói quen hàng ngày",
          icon: "mdi-calendar-check",
        },
      ],
      actions: [
        {
          id: "5-1",
          title: "Đánh giá tiến độ",
          description: "Xem lại nhật ký và đánh giá sự tiến bộ của bạn",
          duration: "20 phút",
          completed: false,
          required: true,
          moodTags: ["Đánh giá", "Phản ánh"],
        },
        {
          id: "5-2",
          title: "Xây dựng kế hoạch duy trì",
          description: "Phát triển kế hoạch để duy trì và tiếp tục cải thiện",
          duration: "30 phút",
          completed: false,
          required: true,
          moodTags: ["Lập kế hoạch", "Duy trì"],
        },
        {
          id: "5-3",
          title: "Xác định nguồn hỗ trợ",
          description: "Xác định các nguồn hỗ trợ để giúp bạn duy trì tiến độ",
          duration: "15 phút",
          completed: false,
          required: false,
          moodTags: ["Hỗ trợ", "Kết nối"],
        },
      ],
      canSkip: false,
      requireConfirmation: false,
      nextPhaseId: null,
      completionCriteria: [
        {
          title: "Đánh giá tiến độ",
          description: "Bạn đã đánh giá tiến độ của mình trong toàn bộ lộ trình",
        },
        {
          title: "Xây dựng kế hoạch",
          description: "Bạn đã xây dựng kế hoạch duy trì lâu dài",
        },
        {
          title: "Xác định nguồn hỗ trợ",
          description: "Bạn đã xác định các nguồn hỗ trợ để giúp duy trì tiến độ",
        },
      ],
      resources: [
        { title: "Duy trì tiến bộ dài hạn", url: "/docs/maintaining-progress" },
        { title: "Phòng ngừa tái phát", url: "/docs/relapse-prevention" },
        { title: "Xây dựng lối sống cân bằng", url: "/docs/balanced-lifestyle" },
      ],
    },
  },
}

// Mental profile data
export const mentalProfileData = {
  userType: "Người đi làm",
  stressSource: "Công việc",
  improvementGoal: "Cân bằng công việc - cuộc sống",
  stressLevel: 65,
  depressionRisk: 40,
  emotionalIndex: [
    { date: "2023-05-05", value: 65 },
    { date: "2023-05-06", value: 58 },
    { date: "2023-05-07", value: 72 },
    { date: "2023-05-08", value: 68 },
    { date: "2023-05-09", value: 75 },
  ],
}

// Recommendation data
export const recommendationData = [
  {
    content:
      "Hãy dành 5 phút mỗi ngày để thực hành hít thở sâu. Điều này sẽ giúp giảm căng thẳng và cải thiện tập trung.",
    isMotivation: false,
    source: "TS. Nguyễn An Tâm, Chuyên gia tâm lý",
  },
  {
    content:
      "Mỗi ngày hãy ghi lại 3 điều bạn biết ơn. Thói quen này sẽ giúp bạn tập trung vào những điều tích cực trong cuộc sống.",
    isMotivation: false,
    source: "Nghiên cứu về Tâm lý học Tích cực",
  },
  {
    content: "Hãy nhớ rằng, mỗi bước nhỏ đều quan trọng. Bạn không cần phải hoàn hảo, chỉ cần tiến bộ mỗi ngày.",
    isMotivation: true,
    source: "",
  },
  {
    content: "Thử thách không phải để đánh bại bạn, mà để giúp bạn khám phá sức mạnh bên trong mình.",
    isMotivation: true,
    source: "",
  },
]

// Suggestion data
export const suggestionData = {
  userTypeOptions: [
    { text: "Học sinh", value: "student" },
    { text: "Sinh viên", value: "university" },
    { text: "Người đi làm", value: "worker" },
    { text: "Người cao tuổi", value: "elderly" },
    { text: "Khác", value: "other" },
  ],
  issueOptions: {
    student: [
      { text: "Áp lực học tập, thi cử", value: "study_pressure" },
      { text: "Bị bắt nạt hoặc cô lập ở trường", value: "bullying" },
      { text: "Không có bạn thân", value: "no_close_friend" },
      { text: "Mâu thuẫn với cha mẹ", value: "parent_conflict" },
      { text: "Mất động lực", value: "no_motivation" },
    ],
    university: [
      { text: "Lo lắng về tương lai", value: "future_worry" },
      { text: "Mất định hướng nghề nghiệp", value: "career_confusion" },
      { text: "Cô đơn", value: "loneliness" },
      { text: "Chán học", value: "boredom" },
      { text: "Stress vì thực tập/thi cử", value: "intern_stress" },
    ],
    worker: [
      { text: "Căng thẳng công việc", value: "work_stress" },
      { text: "Mâu thuẫn đồng nghiệp", value: "colleague_conflict" },
      { text: "Cảm giác không được công nhận", value: "not_recognized" },
      { text: "Không còn đam mê", value: "no_passion" },
      { text: "Mất cân bằng cuộc sống - công việc", value: "work_life_balance" },
    ],
  },
  whereOptions: [
    { text: "Ở nhà", value: "home" },
    { text: "Ở trường/lớp học", value: "school" },
    { text: "Nơi làm việc", value: "work" },
    { text: "Trên mạng xã hội", value: "social" },
    { text: "Khác", value: "other" },
  ],
  whenOptions: [
    { text: "Buổi sáng", value: "morning" },
    { text: "Trước khi ngủ", value: "before_sleep" },
    { text: "Buổi tối", value: "evening" },
    { text: "Khi đi học/làm", value: "at_work" },
    { text: "Luôn luôn", value: "always" },
    { text: "Khác", value: "other" },
  ],
  relatedOptions: [
    { text: "Bố mẹ", value: "parent" },
    { text: "Giáo viên / giảng viên", value: "teacher" },
    { text: "Bạn bè / người yêu", value: "friend" },
    { text: "Sếp / đồng nghiệp", value: "boss" },
    { text: "Chính bản thân mình", value: "myself" },
    { text: "Không rõ", value: "unknown" },
    { text: "Khác", value: "other" },
  ],
  suggestedRoadmaps: {
    student: {
      study_pressure: [
        {
          id: "1",
          title: "Vượt qua áp lực học tập",
          description: "Phương pháp giảm căng thẳng và cải thiện hiệu suất học tập",
          match: 95,
          steps: 5,
          isPaid: true,
          price: 500000,
          features: [
            "5 bài tập thư giãn chuyên sâu",
            "Hướng dẫn quản lý thời gian hiệu quả",
            "Kỹ thuật học tập tối ưu",
            "Tư vấn 1-1 với chuyên gia",
            "Theo dõi tiến độ cá nhân",
          ],
        },
      ],
      future_worry: [
        {
          id: "1",
          title: "Vượt qua áp lực học tập",
          description: "Phương pháp giảm căng thẳng và cải thiện hiệu suất học tập",
          match: 95,
          steps: 5,
          isPaid: true,
          price: 500000,
          features: [
            "5 bài tập thư giãn chuyên sâu",
            "Hướng dẫn quản lý thời gian hiệu quả",
            "Kỹ thuật học tập tối ưu",
            "Tư vấn 1-1 với chuyên gia",
            "Theo dõi tiến độ cá nhân",
          ],
        },
      ],
      bullying: [
        {
          id: "2",
          title: "Xây dựng kỹ năng xã hội",
          description: "Phát triển sự tự tin và kỹ năng giao tiếp hiệu quả",
          match: 90,
          steps: 5,
          isPaid: true,
          price: 450000,
          features: [
            "Bài tập rèn luyện sự tự tin",
            "Kỹ thuật giao tiếp hiệu quả",
            "Xử lý tình huống khó khăn",
            "Hỗ trợ từ cộng đồng",
            "Tài liệu chuyên sâu về kỹ năng xã hội",
          ],
        },
      ],
      no_close_friend: [
        {
          id: "2",
          title: "Xây dựng kỹ năng xã hội",
          description: "Phát triển sự tự tin và kỹ năng giao tiếp hiệu quả",
          match: 90,
          steps: 5,
          isPaid: true,
          price: 450000,
          features: [
            "Bài tập rèn luyện sự tự tin",
            "Kỹ thuật giao tiếp hiệu quả",
            "Xử lý tình huống khó khăn",
            "Hỗ trợ từ cộng đồng",
            "Tài liệu chuyên sâu về kỹ năng xã hội",
          ],
        },
      ],
    },
    university: {
      career_confusion: [
        {
          id: "3",
          title: "Định hướng nghề nghiệp",
          description: "Khám phá đam mê và xây dựng lộ trình sự nghiệp rõ ràng",
          match: 93,
          steps: 5,
          isPaid: true,
          price: 550000,
          features: [
            "Bài kiểm tra định hướng nghề nghiệp",
            "Tư vấn 1-1 với chuyên gia hướng nghiệp",
            "Kế hoạch phát triển cá nhân",
            "Kỹ năng phỏng vấn và tìm việc",
            "Mạng lưới kết nối chuyên nghiệp",
          ],
        },
      ],
      future_worry: [
        {
          id: "3",
          title: "Định hướng nghề nghiệp",
          description: "Khám phá đam mê và xây dựng lộ trình sự nghiệp rõ ràng",
          match: 93,
          steps: 5,
          isPaid: true,
          price: 550000,
          features: [
            "Bài kiểm tra định hướng nghề nghiệp",
            "Tư vấn 1-1 với chuyên gia hướng nghiệp",
            "Kế hoạch phát triển cá nhân",
            "Kỹ năng phỏng vấn và tìm việc",
            "Mạng lưới kết nối chuyên nghiệp",
          ],
        },
      ],
      loneliness: [
        {
          id: "4",
          title: "Sống trọn vẹn đời sinh viên",
          description: "Tận hưởng và phát triển bản thân trong thời gian đại học",
          match: 88,
          steps: 5,
          isPaid: false,
          price: 0,
        },
      ],
      boredom: [
        {
          id: "4",
          title: "Sống trọn vẹn đời sinh viên",
          description: "Tận hưởng và phát triển bản thân trong thời gian đại học",
          match: 88,
          steps: 5,
          isPaid: false,
          price: 0,
        },
      ],
    },
    worker: {
      work_stress: [
        {
          id: "5",
          title: "Cân bằng công việc - cuộc sống",
          description: "Phương pháp quản lý stress và tạo sự cân bằng",
          match: 96,
          steps: 5,
          isPaid: true,
          price: 600000,
          features: [
            "5 kỹ thuật quản lý thời gian",
            "Phương pháp thiền mindfulness",
            "Kỹ năng đặt ranh giới lành mạnh",
            "Tư vấn 1-1 với chuyên gia",
            "Theo dõi mức độ stress hàng ngày",
          ],
        },
      ],
      work_life_balance: [
        {
          id: "5",
          title: "Cân bằng công việc - cuộc sống",
          description: "Phương pháp quản lý stress và tạo sự cân bằng",
          match: 96,
          steps: 5,
          isPaid: true,
          price: 600000,
          features: [
            "5 kỹ thuật quản lý thời gian",
            "Phương pháp thiền mindfulness",
            "Kỹ năng đặt ranh giới lành mạnh",
            "Tư vấn 1-1 với chuyên gia",
            "Theo dõi mức độ stress hàng ngày",
          ],
        },
      ],
      no_passion: [
        {
          id: "6",
          title: "Tìm lại đam mê trong công việc",
          description: "Khám phá lại ý nghĩa và niềm vui trong sự nghiệp",
          match: 92,
          steps: 5,
          isPaid: true,
          price: 500000,
          features: [
            "Bài tập khám phá giá trị cốt lõi",
            "Kỹ thuật đặt mục tiêu SMART",
            "Phương pháp tạo động lực nội tại",
            "Tư vấn phát triển sự nghiệp",
            "Công cụ đánh giá sự hài lòng",
          ],
        },
      ],
      not_recognized: [
        {
          id: "6",
          title: "Tìm lại đam mê trong công việc",
          description: "Khám phá lại ý nghĩa và niềm vui trong sự nghiệp",
          match: 92,
          steps: 5,
          isPaid: true,
          price: 500000,
          features: [
            "Bài tập khám phá giá trị cốt lõi",
            "Kỹ thuật đặt mục tiêu SMART",
            "Phương pháp tạo động lực nội tại",
            "Tư vấn phát triển sự nghiệp",
            "Công cụ đánh giá sự hài lòng",
          ],
        },
      ],
    },
    default: [
      {
        id: "7",
        title: "Thư giãn với âm nhạc",
        description: "Bộ sưu tập nhạc thư giãn và thiền định giúp giảm căng thẳng",
        match: 85,
        steps: 5,
        isPaid: false,
        price: 0,
      },
      {
        id: "8",
        title: "Yoga cơ bản",
        description: "Các bài tập yoga đơn giản giúp thư giãn cơ thể và tâm trí",
        match: 80,
        steps: 5,
        isPaid: false,
        price: 0,
      }
    ],
    normal: [
      {
        id: "9",
        title: "Duy trì sức khỏe tinh thần",
        description: "Các hoạt động và thói quen giúp duy trì trạng thái tâm lý tích cực",
        match: 98,
        steps: 5,
        isPaid: false,
        price: 0,
      }
    ]
  },
  roadmapIcons: {
    1: "mdi-school",
    2: "mdi-account-group",
    3: "mdi-briefcase",
    4: "mdi-school",
    5: "mdi-briefcase-check",
    6: "mdi-heart-pulse",
    7: "mdi-music",
    8: "mdi-yoga",
    9: "mdi-meditation",
    "default-paid": "mdi-star-circle",
  },
  audioTracks: ["Relaxing Nature Sounds", "Meditation Music", "Deep Sleep Music", "Stress Relief Melody"],
}

// Completion data
export const completionData = {
  statistics: {
    daysActive: 14,
    actionsCompleted: 23,
    emotionalImprovement: 68,
  },
  couponCode: "MENTAL25",
  couponDescription: 'Sử dụng mã này để được giảm 25% cho khóa học "Tâm lý học ứng dụng" của chúng tôi',
  advancedRoadmaps: [
    {
      title: "Lộ trình nâng cao: Vượt qua lo âu",
      description: "Các kỹ thuật nâng cao để đối phó với lo âu mãn tính",
    },
    {
      title: "Thiền định hàng ngày",
      description: "Xây dựng thói quen thiền định để cải thiện sức khỏe tinh thần",
    },
  ],
}

// App.vue data
export const appData = {
  moods: [
    { label: "Struggling", value: "struggling" },
    { label: "Okay", value: "okay" },
    { label: "Neutral", value: "neutral" },
    { label: "Good", value: "good" },
    { label: "Great", value: "great" },
  ],
  challenges: [
    "Anxiety or worry",
    "Low mood or sadness",
    "Sleep difficulties",
    "Concentration problems",
    "Work/study stress",
    "Relationship challenges",
    "Loneliness or isolation",
    "Physical health concerns",
  ],
  moodThemeMap: {
    struggling: "calm",
    okay: "peaceful",
    neutral: "refreshing",
    good: "focused",
    great: "energetic",
  },
  availableThemes: [
    { name: "Calm", value: "calm" },
    { name: "Refreshing", value: "refreshing" },
    { name: "Energetic", value: "energetic" },
    { name: "Focused", value: "focused" },
    { name: "Peaceful", value: "peaceful" },
  ],
  completionAssessmentResult: {
    sentiment: "Positive",
    summary: "You have made significant progress in your mental health journey.",
    stats: {
      daysActive: 24,
      actionsCompleted: 42,
      consistency: 85,
    },
    achievements: [
      "Established a regular mindfulness practice",
      "Improved sleep quality",
      "Developed effective stress management techniques",
      "Built a stronger support network",
    ],
    improvementAreas: [
      "Consistency in daily practice",
      "Managing stress during high-pressure situations",
      "Building more social connections",
    ],
  },
}

// CompletionView.vue data
export const completionViewData = {
  roadmapSteps: [
    {
      id: 1,
      title: "Self-Awareness",
      completed: true,
      icon: "mdi-eye-outline",
    },
    {
      id: 2,
      title: "Seeking Support",
      completed: true,
      icon: "mdi-hand-heart-outline",
    },
    {
      id: 3,
      title: "Building Healthy Habits",
      completed: true,
      icon: "mdi-sprout-outline",
    },
    {
      id: 4,
      title: "Developing Coping Strategies",
      completed: true,
      icon: "mdi-brain",
    },
    {
      id: 5,
      title: "Maintaining Mental Wellness",
      completed: true,
      icon: "mdi-heart-pulse",
    },
  ],
  improvementOptions: [
    { label: "Tôi đã cải thiện một chút", value: "little" },
    { label: "Tôi đã cải thiện kha khá", value: "moderate" },
    { label: "Tôi đã cải thiện rất nhiều", value: "significant" },
  ],
  statistics: {
    daysActive: 14,
    actionsCompleted: 23,
    emotionalImprovement: 68,
  },
  coupon: {
    code: "MENTAL25",
    description: 'Sử dụng mã này để được giảm 25% cho khóa học "Tâm lý học ứng dụng" của chúng tôi',
  },
  advancedRoadmaps: [
    {
      title: "Lộ trình nâng cao: Vượt qua lo âu",
      description: "Các kỹ thuật nâng cao để đối phó với lo âu mãn tính",
    },
    {
      title: "Thiền định hàng ngày",
      description: "Xây dựng thói quen thiền định để cải thiện sức khỏe tinh thần",
    },
  ],
}