export const mentalRoadmap = {
    name: "Lộ Trình Sức Khỏe Tinh Thần",
    tourName: "mental-roadmap-tour",
    introTexts: [
        "CBT là phương pháp trị liệu nhẹ nhàng giúp mọi người có được công cụ để hiểu và kiểm soát suy nghĩ, hành vi của mình theo tốc độ thoải mái.",
        "Tại Healpathy, chúng tôi cam kết hướng dẫn bạn qua lộ trình này, đảm bảo bạn có được sự hỗ trợ và nguồn lực cần thiết cho hành trình sức khỏe tinh thần của mình.",
        "Hãy đón nhận quá trình này và bắt đầu bước đầu tiên hướng tới tư duy lành mạnh hơn ngay hôm nay! Hãy nhớ rằng, những bước nhỏ sẽ dẫn đến những thay đổi lớn."
    ],
    steps: [
        { target: "#roadmap-step-1", header: { title: "Bước 1: Nhận Diện Vấn Đề" }, content: "Nhẹ nhàng xác định cảm xúc và vấn đề để hiểu những gì bạn đang cảm nhận." },
        { target: "#roadmap-step-2", header: { title: "Bước 2: Ổn Định Tâm Trí" }, content: "Thực hành các kỹ thuật thư giãn để giảm căng thẳng trước khi bắt đầu quá trình thay đổi." },
        { target: "#roadmap-step-3", header: { title: "Bước 3: Xây Dựng Thói Quen Tích Cực" }, content: "Tạo nền tảng cho sức khỏe tinh thần lâu dài bằng cách thiết lập các thói quen nhỏ, tích cực." },
        { target: "#roadmap-step-4", header: { title: "Bước 4: Quản Lý Stress & Cảm Xúc" }, content: "Học cách duy trì tư duy tích cực và mở rộng kỹ năng thông qua các thực hành nhẹ nhàng." },
        { target: "#roadmap-step-5", header: { title: "Bước 5: Đánh Giá & Duy Trì" }, content: "Kiểm tra sự tiến bộ và tiếp tục quá trình theo tốc độ của riêng bạn." }
    ],
    timelineItems: [
        // Prioritize issues to address based on their impact on your life.
        // Gain knowledge about your specific mental health concerns.
        // Discuss how CBT has helped others with similar issues.
        { color: '#6c757d', icon: 'mdi-account-heart', title: 'Nhận Diện Vấn Đề', content: 'Sử dụng các công cụ để xác định rõ cảm xúc và vấn đề của bạn. Bước này rất quan trọng để hiểu được nguồn gốc của cảm xúc và hành vi, từ đó phát triển các chiến lược hiệu quả.', link: '/practice' },
        //Practice relaxation techniques such as deep breathing and mindfulness.
        //Identify activities that bring joy or a sense of accomplishment.
        //Gradually incorporate these activities into your routine to improve mood.
        { color: '#6c757d', icon: 'mdi-bullseye', title: 'Ổn Định Tâm Trí', content: 'Học các kỹ thuật giảm căng thẳng và chuẩn bị cho sự thay đổi. Bao gồm các thực hành chánh niệm và kỹ thuật thư giãn có thể giúp bạn lấy lại kiểm soát suy nghĩ và cảm xúc.', link: '/practice' },
        { color: '#6c757d', icon: 'mdi-clock-outline', title: 'Xây Dựng Thói Quen Tích Cực', content: 'Thiết lập các thói quen hỗ trợ sức khỏe tinh thần lâu dài. Bước này tập trung vào việc tạo ra các thói quen hàng ngày thúc đẩy sự khỏe mạnh và khả năng phục hồi.', link: '/practice' },
        //Keep a journal to track negative thoughts and their triggers.
        //Challenge and reframe negative thoughts using evidence-based techniques.
        //Replace distorted thoughts with more balanced, realistic ones.
        { color: '#6c757d', icon: 'mdi-emoticon-happy', title: 'Quản Lý Stress & Cảm Xúc', content: 'Phát triển kỹ năng duy trì tư duy tích cực và cân bằng cảm xúc. Điều này bao gồm học các chiến lược đối phó và kỹ thuật điều chỉnh cảm xúc để xử lý hiệu quả các thách thức trong cuộc sống.', link: '/practice' },
        { color: '#6c757d', icon: 'mdi-rocket-launch', title: 'Đánh Giá & Duy Trì', content: 'Thường xuyên đánh giá tiến độ và điều chỉnh chiến lược khi cần thiết. Bước này nhấn mạnh tầm quan trọng của việc phản ánh và thích nghi trong hành trình sức khỏe tinh thần của bạn.', link: '/practice' }
    ]
};

/*
.roadmap-intro {
    background-color: #ffffff; 
    padding: 30px;
    border-radius: 12px; 
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); 
    margin-bottom: 30px; 
    border: 1px solid #e0e0e0; 
    transition: all 0.3s ease; 
}

.roadmap-intro:hover {
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2); 
    transform: translateY(-2px); 
}

.roadmap-text {
    font-size: 1.2rem; 
    color: #444; 
    margin-bottom: 15px; 
    line-height: 1.6; 
    font-family: 'Poppins', sans-serif; 
    text-align: center; 
}

.v-tour__target {
    outline: 3px solid #ff6f61 !important; 
    border-radius: 8px; 
}

.v-tour__button {
    background-color: #007bff !important; 
    color: white !important;
    font-weight: bold;
    border-radius: 6px;
    padding: 8px 16px;
    transition: 0.3s;
}

.v-tour__button:hover {
    background-color: #0056b3 !important;
}

.timeline-item {
    padding: 15px;
    border-radius: 8px;
    margin-bottom: 20px;
    background: #f8f9fa;
    transition: 0.3s;
}

.timeline-item:hover {
    background: #e9ecef;
    transform: translateY(-3px);
}

.timeline-item-content {
    margin-top: 10px;
    font-size: 2rem;
}

.timeline-item-title {
    font-size: 2.5rem;
}

.roadmap-intro a {
    text-decoration: none;
    color: #007bff;
    font-weight: bold;
    transition: 0.3s;
}

.roadmap-intro a:hover {
    color: #0056b3;
    text-decoration: underline;
}

.roadmap-step {
    margin-bottom: 24px; 
} */
export const strictMentalRoadmap = {
    name: "Lộ Trình Sức Khỏe Tinh Thần Chuyên Sâu",
    tourName: "strict-mental-roadmap-tour",
    introTexts: [
        "Lộ trình này được thiết kế để thách thức và thúc đẩy bạn hướng tới sự phát triển cá nhân và khám phá bản thân thông qua các hành động có kỷ luật.",
        "Tại Healpathy, chúng tôi tin vào sức mạnh của kỷ luật và cam kết để đạt được sự ổn định về tinh thần và cảm xúc.",
        "Hãy thực hiện từng bước một cách cẩn thận và chịu trách nhiệm về tiến độ của bạn để đảm bảo một trải nghiệm chuyển đổi. Hãy nhớ rằng, tính nhất quán là chìa khóa của thành công."
    ],
    steps: [
        { target: "#roadmap-step-1", header: { title: "Bước 1: Kỷ Luật Bản Thân" }, content: "Đặt ra các mục tiêu cá nhân nghiêm túc và kiên định thực hiện." },
        { target: "#roadmap-step-2", header: { title: "Bước 2: Xây Dựng Thói Quen" }, content: "Phát triển thói quen buổi sáng và buổi tối để duy trì tính nhất quán." },
        { target: "#roadmap-step-3", header: { title: "Bước 3: Thực Hành Chánh Niệm" }, content: "Đưa các kỹ thuật chánh niệm vào cuộc sống hàng ngày." },
        { target: "#roadmap-step-4", header: { title: "Bước 4: Trách Nhiệm" }, content: "Tìm một người cố vấn hoặc bạn bè để giúp bạn duy trì trách nhiệm." },
        { target: "#roadmap-step-5", header: { title: "Bước 5: Tầm Nhìn Dài Hạn" }, content: "Tạo lộ trình cho sự phát triển cá nhân trong năm tới." }
    ],
    timelineItems: [
        { color: '#F28076', icon: 'mdi-brain', title: 'Kỷ Luật Bản Thân', content: 'Xác định và ghi lại những thách thức cụ thể bạn gặp phải trong cuộc sống hàng ngày. Đây là bước đầu tiên để vượt qua chúng.', link: '/practice' },
        { color: '#FFB6AF', icon: 'mdi-calendar-check', title: 'Xây Dựng Thói Quen', content: 'Xác định các mục tiêu có thể đo lường và đạt được để vượt qua những thách thức này một cách hiệu quả. Mục tiêu rõ ràng sẽ cung cấp định hướng.', link: '/practice' },
        { color: '#FAE0C7', icon: 'mdi-meditation', title: 'Thực Hành Chánh Niệm', content: 'Thiết lập thói quen hàng ngày nghiêm ngặt bao gồm thời gian cho việc tự chăm sóc bản thân và suy ngẫm. Tính nhất quán là điều quan trọng.', link: '/practice' },
        { color: '#FBC193', icon: 'mdi-account-group', title: 'Trách Nhiệm', content: 'Duy trì nhật ký hàng ngày để theo dõi cảm xúc và tiến độ hướng tới mục tiêu của bạn. Sự phản ánh giúp bạn duy trì trách nhiệm.', link: '/practice' },
        { color: '#4EB09B', icon: 'mdi-road', title: 'Tầm Nhìn Dài Hạn', content: 'Chia sẻ mục tiêu của bạn với một người bạn đáng tin cậy hoặc nhà trị liệu để duy trì trách nhiệm. Sự hỗ trợ này rất quan trọng cho thành công.', link: '/practice' }
    ]
};

export const skillRoadmap = {
    name: "Lộ Trình Phát Triển Kỹ Năng",
    tourName: "skill-roadmap-tour",
    introTexts: [
        "Lộ trình này giúp bạn nâng cao kỹ năng một cách có hệ thống.",
        "Tại Healpathy, chúng tôi tin rằng học tập là một quá trình suốt đời.",
        "Hãy bắt đầu hành trình của bạn ngay hôm nay và tận hưởng trải nghiệm học tập!"
    ],
    steps: [
        { target: "#roadmap-step-1", header: { title: "Bước 1: Xác Định Điểm Mạnh" }, content: "Hiểu những gì bạn giỏi và phát triển từ đó." },
        { target: "#roadmap-step-2", header: { title: "Bước 2: Đặt Mục Tiêu Học Tập" }, content: "Xác định rõ mục tiêu phát triển kỹ năng." },
        { target: "#roadmap-step-3", header: { title: "Bước 3: Thực Hành Hàng Ngày" }, content: "Dành ít nhất 30 phút mỗi ngày để thực hành." },
        { target: "#roadmap-step-4", header: { title: "Bước 4: Áp Dụng Kiến Thức" }, content: "Sử dụng kỹ năng mới trong các dự án thực tế." },
        { target: "#roadmap-step-5", header: { title: "Bước 5: Cải Thiện Liên Tục" }, content: "Tìm kiếm phản hồi và hoàn thiện kỹ năng." }
    ],
    timelineItems: [
        { color: '#FF6384', icon: 'mdi-star', title: 'Xác Định Điểm Mạnh', content: 'Lộ trình này được thiết kế để giúp bạn phát triển các kỹ năng thiết yếu với tốc độ thoải mái.', link: '/practice' },
        { color: '#FF9F40', icon: 'mdi-target', title: 'Đặt Mục Tiêu Học Tập', content: 'Tại Healpathy, chúng tôi tin rằng việc học tập nên thú vị và từ từ. Hãy đón nhận quá trình và dành thời gian để thành thạo từng kỹ năng.', link: '/practice' },
        { color: '#FFCD56', icon: 'mdi-clock', title: 'Thực Hành Hàng Ngày', content: 'Dành ít nhất 30 phút mỗi ngày để thực hành.', link: '/practice' },
        { color: '#4BC0C0', icon: 'mdi-lightbulb-on', title: 'Áp Dụng Kiến Thức', content: 'Sử dụng kỹ năng mới trong các dự án thực tế.', link: '/practice' },
        { color: '#36A2EB', icon: 'mdi-refresh', title: 'Cải Thiện Liên Tục', content: 'Tìm kiếm phản hồi và hoàn thiện kỹ năng.', link: '/practice' }
    ]
};

export const strictSkillRoadmap = {
    name: "Lộ Trình Phát Triển Kỹ Năng Chuyên Sâu",
    tourName: "strict-skill-roadmap-tour",
    introTexts: [
        "Lộ trình này được thiết kế để thách thức và thúc đẩy bạn hướng tới việc thành thạo các kỹ năng thiết yếu với kỷ luật.",
        "Tại Healpathy, chúng tôi tin vào tầm quan trọng của cam kết và tính nhất quán trong việc đạt được mục tiêu phát triển kỹ năng của bạn.",
        "Hãy thực hiện từng bước một cách cẩn thận và chịu trách nhiệm về tiến độ của bạn để đảm bảo một trải nghiệm chuyển đổi."
    ],
    steps: [
        { target: "#roadmap-step-1", header: { title: "Bước 1: Nền Tảng Kỹ Năng" }, content: "Thành thạo các kiến thức cơ bản trước khi tiến lên." },
        { target: "#roadmap-step-2", header: { title: "Bước 2: Học Tập Nâng Cao" }, content: "Đi sâu vào các khái niệm và lý thuyết phức tạp." },
        { target: "#roadmap-step-3", header: { title: "Bước 3: Phát Triển Dự Án" }, content: "Tạo các dự án để áp dụng những gì đã học." },
        { target: "#roadmap-step-4", header: { title: "Bước 4: Phản Hồi Chuyên Gia" }, content: "Tìm kiếm hướng dẫn từ các chuyên gia trong ngành." },
        { target: "#roadmap-step-5", header: { title: "Bước 5: Thành Thạo & Giảng Dạy" }, content: "Dạy người khác để củng cố kiến thức của bạn." }
    ],
    timelineItems: [
        { color: '#E57373', icon: 'mdi-book-open', title: 'Nền Tảng Kỹ Năng', content: 'Xác định rõ các kỹ năng bạn muốn thành thạo và đặt ra các mục tiêu cụ thể, có thể đo lường được.', link: '/practice' },
        { color: '#FF8A65', icon: 'mdi-school', title: 'Học Tập Nâng Cao', content: 'Phát triển kế hoạch có cấu trúc phác thảo các bước bạn cần thực hiện để đạt được mục tiêu.', link: '/practice' },
        { color: '#FFD54F', icon: 'mdi-laptop', title: 'Phát Triển Dự Án', content: 'Dành thời gian mỗi ngày để thực hành và hoàn thiện kỹ năng của bạn.', link: '/practice' },
        { color: '#81C784', icon: 'mdi-account-check', title: 'Phản Hồi Chuyên Gia', content: 'Tìm một người cố vấn hoặc chuyên gia có thể cung cấp hướng dẫn và phản hồi về tiến độ của bạn.', link: '/practice' },
        { color: '#64B5F6', icon: 'mdi-teach', title: 'Thành Thạo & Giảng Dạy', content: 'Thường xuyên đánh giá tiến độ và điều chỉnh kế hoạch khi cần thiết để duy trì đúng hướng.', link: '/practice' }
    ]
};

export const physicalRoadmap = {
    name: "Lộ Trình Sức Khỏe Thể Chất",
    tourName: "physical-roadmap-tour",
    introTexts: [
        "Lộ trình này được thiết kế để hướng dẫn bạn đến một lối sống khỏe mạnh hơn thông qua các hoạt động thể chất nhẹ nhàng. Chúng tôi tin rằng những thay đổi nhỏ, nhất quán có thể dẫn đến những cải thiện đáng kể trong sức khỏe tổng thể của bạn.",
        "Tại Healpathy, chúng tôi nhấn mạnh tầm quan trọng của sự cân bằng và tiến bộ từ từ trong hành trình sức khỏe thể chất của bạn. Hãy nhớ rằng, mỗi bước đều quan trọng, và việc lắng nghe cơ thể khi bạn bắt đầu hành trình này là điều cần thiết.",
        "Hãy đón nhận hành trình và bắt đầu bước đầu tiên hướng tới một cơ thể khỏe mạnh hơn ngay hôm nay! Cam kết của bạn với các hoạt động này sẽ mở đường cho một cuộc sống năng động và tràn đầy năng lượng hơn."
    ],
    steps: [
        { target: "#roadmap-step-1", header: { title: "Bước 1: Vận Động Hàng Ngày" }, content: "Tích hợp ít nhất 30 phút tập thể dục mỗi ngày." },
        { target: "#roadmap-step-2", header: { title: "Bước 2: Ăn Uống Lành Mạnh" }, content: "Theo dõi chế độ ăn uống cân bằng với dinh dưỡng phù hợp." },
        { target: "#roadmap-step-3", header: { title: "Bước 3: Nước & Giấc Ngủ" }, content: "Duy trì đủ nước và nghỉ ngơi đầy đủ." },
        { target: "#roadmap-step-4", header: { title: "Bước 4: Sức Mạnh & Sức Bền" }, content: "Tập trung vào việc xây dựng sức mạnh cơ bắp và sức bền." },
        { target: "#roadmap-step-5", header: { title: "Bước 5: Sức Khỏe Dài Hạn" }, content: "Duy trì tính nhất quán và theo dõi tiến độ." }
    ],
    timelineItems: [
        { color: '#FF5252', icon: 'mdi-run', title: 'Vận Động Hàng Ngày', content: 'Tập thể dục ít nhất 30 phút mỗi ngày.', link: '/practice' },
        { color: '#FFB74D', icon: 'mdi-food-apple', title: 'Ăn Uống Lành Mạnh', content: 'Theo dõi chế độ ăn uống dinh dưỡng để có sức khỏe tốt hơn.', link: '/practice' },
        { color: '#4DB6AC', icon: 'mdi-water', title: 'Nước & Giấc Ngủ', content: 'Duy trì đủ nước và nghỉ ngơi tốt.', link: '/practice' },
        { color: '#7986CB', icon: 'mdi-weight-lifter', title: 'Sức Mạnh & Sức Bền', content: 'Xây dựng cơ bắp và cải thiện sức bền.', link: '/practice' },
        { color: '#64B5F6', icon: 'mdi-heart', title: 'Sức Khỏe Dài Hạn', content: 'Duy trì tính nhất quán cho sức khỏe suốt đời.', link: '/practice' }
    ]
};

export const strictPhysicalRoadmap = {
    name: "Lộ Trình Sức Khỏe Thể Chất Chuyên Sâu",
    tourName: "strict-physical-roadmap-tour",
    introTexts: [
        "Lộ trình này được thiết kế để thách thức và thúc đẩy bạn hướng tới sự cải thiện thể chất đáng kể và kỷ luật.",
        "Tại Healpathy, chúng tôi tin vào tầm quan trọng của cam kết và tính nhất quán trong việc đạt được mục tiêu sức khỏe thể chất của bạn.",
        "Hãy thực hiện từng bước một cách cẩn thận và chịu trách nhiệm về tiến độ của bạn để đảm bảo một trải nghiệm chuyển đổi."
    ],
    steps: [
        { target: "#roadmap-step-1", header: { title: "Bước 1: Tập Luyện Chuyên Sâu" }, content: "Theo một chương trình tập luyện có cấu trúc." },
        { target: "#roadmap-step-2", header: { title: "Bước 2: Dinh Dưỡng Tối Ưu" }, content: "Theo dõi macros và tối ưu hóa chế độ ăn uống cho hiệu suất." },
        { target: "#roadmap-step-3", header: { title: "Bước 3: Phục Hồi & Tái Tạo" }, content: "Ưu tiên phục hồi cơ bắp và phòng ngừa chấn thương." },
        { target: "#roadmap-step-4", header: { title: "Bước 4: Sức Mạnh Tinh Thần" }, content: "Rèn luyện tâm trí cùng với cơ thể." },
        { target: "#roadmap-step-5", header: { title: "Bước 5: Hiệu Suất Đỉnh Cao" }, content: "Hướng tới cải thiện liên tục và sức khỏe đỉnh cao." }
    ],
    timelineItems: [
        { color: '#D32F2F', icon: 'mdi-dumbbell', title: 'Tập Luyện Chuyên Sâu', content: 'Tích hợp các bài tập kéo giãn nghiêm ngặt vào thói quen hàng ngày để tăng tính linh hoạt và phòng ngừa chấn thương.', link: '/practice' },
        { color: '#FFA000', icon: 'mdi-food', title: 'Dinh Dưỡng Tối Ưu', content: 'Cam kết tập cardio ít nhất 30 phút mỗi ngày để tăng cường sức bền và thể lực tổng thể.', link: '/practice' },
        { color: '#388E3C', icon: 'mdi-bed', title: 'Phục Hồi & Tái Tạo', content: 'Tham gia tập luyện sức mạnh ít nhất ba lần một tuần để xây dựng cơ bắp và cải thiện sức mạnh.', link: '/practice' },
        { color: '#1976D2', icon: 'mdi-brain', title: 'Sức Mạnh Tinh Thần', content: 'Duy trì đủ nước bằng cách uống đủ nước trong ngày. Việc cung cấp đủ nước rất quan trọng cho hiệu suất.', link: '/practice' },
        { color: '#512DA8', icon: 'mdi-trophy', title: 'Hiệu Suất Đỉnh Cao', content: 'Thường xuyên đánh giá các hoạt động thể chất và thực hiện các điều chỉnh cần thiết để duy trì đúng hướng.', link: '/practice' }
    ]
};

export const roadmaps = {
    "mental-roadmap": mentalRoadmap, 
    "strict-mental-roadmap": strictMentalRoadmap,
    "skill-roadmap": skillRoadmap,
    "strict-skill-roadmap": strictSkillRoadmap,
    "physical-roadmap": physicalRoadmap,
    "strict-physical-roadmap": strictPhysicalRoadmap
};