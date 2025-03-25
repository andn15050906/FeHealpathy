export const mentalRoadmap = {
    name: "Mental Roadmap",
    tourName: "mental-roadmap-tour",
    introTexts: [
        "CBT is a gentle therapeutic approach that equips individuals with the tools to understand and manage their thoughts and behaviors at a comfortable pace.",
        "At Healpathy, we are committed to guiding you through this roadmap, ensuring that you have the support and resources necessary for your mental health journey.",
        "Embrace the process, and take the first step toward a healthier mindset today! Remember, small steps lead to significant changes."
    ],
    steps: [
        { target: "#roadmap-step-1", header: { title: "Step 1: Identify the Problem" }, content: "Gently define your emotions and issues to understand what you are feeling." },
        { target: "#roadmap-step-2", header: { title: "Step 2: Stabilize Your Mind" }, content: "Practice relaxation techniques to reduce stress before entering the change process." },
        { target: "#roadmap-step-3", header: { title: "Step 3: Build Positive Habits" }, content: "Create a foundation for long-term mental health by establishing small, positive routines." },
        { target: "#roadmap-step-4", header: { title: "Step 4: Manage Stress & Emotions" }, content: "Learn to maintain a positive mindset and expand your skills through gentle practices." },
        { target: "#roadmap-step-5", header: { title: "Step 5: Evaluate & Continue Maintenance" }, content: "Check your improvement and continue the process at your own pace." }
    ],
    timelineItems: [
        // Prioritize issues to address based on their impact on your life.
        // Gain knowledge about your specific mental health concerns.
        // Discuss how CBT has helped others with similar issues.
        { color: '#6c757d', icon: 'mdi-account-heart', title: 'Identify the Problem', content: 'Utilize tools to define your emotions and issues clearly. This step is crucial for understanding the root causes of your feelings and behaviors, allowing for effective strategies to be developed.', link: '/practice' },
        //Practice relaxation techniques such as deep breathing and mindfulness.
        //Identify activities that bring joy or a sense of accomplishment.
        //Gradually incorporate these activities into your routine to improve mood.
        { color: '#6c757d', icon: 'mdi-bullseye', title: 'Stabilize Your Mind', content: 'Learn techniques to reduce stress and prepare for change. This includes mindfulness practices and relaxation techniques that can help you regain control over your thoughts and emotions.', link: '/practice' },
        { color: '#6c757d', icon: 'mdi-clock-outline', title: 'Build Positive Habits', content: 'Establish routines that support long-term mental health. This step focuses on creating daily habits that promote well-being and resilience, ensuring a healthier lifestyle.', link: '/practice' },
        //Keep a journal to track negative thoughts and their triggers.
        //Challenge and reframe negative thoughts using evidence-based techniques.
        //Replace distorted thoughts with more balanced, realistic ones.
        { color: '#6c757d', icon: 'mdi-emoticon-happy', title: 'Manage Stress & Emotions', content: 'Develop skills to maintain a positive mindset and emotional balance. This involves learning coping strategies and emotional regulation techniques to handle life’s challenges effectively.', link: '/practice' },
        { color: '#6c757d', icon: 'mdi-rocket-launch', title: 'Evaluate & Continue Maintenance', content: 'Regularly assess your progress and adjust your strategies as needed. This step emphasizes the importance of reflection and adaptation in your mental health journey.', link: '/practice' }
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
    name: "Strict Mental Roadmap",
    tourName: "strict-mental-roadmap-tour",
    introTexts: [
        "This roadmap is designed to challenge you and push you towards significant personal growth and self-discovery through disciplined actions.",
        "At Healpathy, we believe in the power of discipline and commitment to achieve mental wellness and emotional stability.",
        "Follow each step diligently, and hold yourself accountable for your progress to ensure a transformative experience. Remember, consistency is key to success."
    ],
    steps: [
        { target: "#roadmap-step-1", header: { title: "Step 1: Self-Discipline" }, content: "Set strict personal goals and stick to them." },
        { target: "#roadmap-step-2", header: { title: "Step 2: Routine Building" }, content: "Develop a morning and night routine for consistency." },
        { target: "#roadmap-step-3", header: { title: "Step 3: Mindful Practices" }, content: "Incorporate mindfulness techniques into your daily life." },
        { target: "#roadmap-step-4", header: { title: "Step 4: Accountability" }, content: "Find a mentor or friend to hold you accountable." },
        { target: "#roadmap-step-5", header: { title: "Step 5: Long-Term Vision" }, content: "Create a roadmap for your personal growth over the next year." }
    ],
    timelineItems: [
        { color: '#F28076', icon: 'mdi-brain', title: 'Self-Discipline', content: 'Identify and write down the specific challenges you face in your daily life. This is the first step towards overcoming them.', link: '/practice' },
        { color: '#FFB6AF', icon: 'mdi-calendar-check', title: 'Routine Building', content: 'Define measurable and achievable goals to overcome these challenges effectively. Clear goals provide direction.', link: '/practice' },
        { color: '#FAE0C7', icon: 'mdi-meditation', title: 'Mindful Practices', content: 'Establish a strict daily routine that includes time for self-care and reflection. Consistency is crucial.', link: '/practice' },
        { color: '#FBC193', icon: 'mdi-account-group', title: 'Accountability', content: 'Keep a daily journal to track your feelings and progress towards your goals. Reflection helps you stay accountable.', link: '/practice' },
        { color: '#4EB09B', icon: 'mdi-road', title: 'Long-Term Vision', content: 'Share your goals with a trusted friend or therapist to hold yourself accountable. This support is vital for success.', link: '/practice' }
    ]
};

export const skillRoadmap = {
    name: "Skill Roadmap",
    tourName: "skill-roadmap-tour",
    introTexts: [
        "This roadmap helps you enhance your skills systematically.",
        "At Healpathy, we believe learning is a lifelong process.",
        "Start your journey today and enjoy the learning experience!"
    ],
    steps: [
        { target: "#roadmap-step-1", header: { title: "Step 1: Identify Strengths" }, content: "Understand what you're good at and build on it." },
        { target: "#roadmap-step-2", header: { title: "Step 2: Set Learning Goals" }, content: "Define clear skill-building goals." },
        { target: "#roadmap-step-3", header: { title: "Step 3: Daily Practice" }, content: "Dedicate at least 30 minutes daily to practice." },
        { target: "#roadmap-step-4", header: { title: "Step 4: Apply Knowledge" }, content: "Use your new skills in real projects." },
        { target: "#roadmap-step-5", header: { title: "Step 5: Continuous Improvement" }, content: "Seek feedback and refine your skills." }
    ],
    timelineItems: [
        { color: '#FF6384', icon: 'mdi-star', title: 'Identify Strengths', content: 'This roadmap is designed to help you develop essential skills at a comfortable pace.', link: '/practice' },
        { color: '#FF9F40', icon: 'mdi-target', title: 'Set Learning Goals', content: 'At Healpathy, we believe that learning should be enjoyable and gradual. Embrace the process and take your time to master each skill.', link: '/practice' },
        { color: '#FFCD56', icon: 'mdi-clock', title: 'Daily Practice', content: 'Dedicate at least 30 minutes daily to practice.', link: '/practice' },
        { color: '#4BC0C0', icon: 'mdi-lightbulb-on', title: 'Apply Knowledge', content: 'Use your new skills in real projects.', link: '/practice' },
        { color: '#36A2EB', icon: 'mdi-refresh', title: 'Continuous Improvement', content: 'Seek feedback and refine your skills.', link: '/practice' }
    ]
};

export const strictSkillRoadmap = {
    name: "Strict Skill Roadmap",
    tourName: "strict-skill-roadmap-tour",
    introTexts: [
        "This roadmap is designed to challenge you and push you towards mastering essential skills with discipline.",
        "At Healpathy, we believe in the importance of commitment and consistency in achieving your skill development goals.",
        "Follow each step diligently, and hold yourself accountable for your progress to ensure a transformative experience."
    ],
    steps: [
        { target: "#roadmap-step-1", header: { title: "Step 1: Skill Foundation" }, content: "Master the basics before moving forward." },
        { target: "#roadmap-step-2", header: { title: "Step 2: Advanced Learning" }, content: "Dive deep into complex concepts and theories." },
        { target: "#roadmap-step-3", header: { title: "Step 3: Project Development" }, content: "Create projects to apply what you've learned." },
        { target: "#roadmap-step-4", header: { title: "Step 4: Expert Feedback" }, content: "Seek guidance from industry professionals." },
        { target: "#roadmap-step-5", header: { title: "Step 5: Mastery & Teaching" }, content: "Teach others to solidify your knowledge." }
    ],
    timelineItems: [
        { color: '#E57373', icon: 'mdi-book-open', title: 'Skill Foundation', content: 'Clearly define the skills you want to master and set specific, measurable goals.', link: '/practice' },
        { color: '#FF8A65', icon: 'mdi-school', title: 'Advanced Learning', content: 'Develop a structured plan that outlines the steps you need to take to achieve your goals.', link: '/practice' },
        { color: '#FFD54F', icon: 'mdi-laptop', title: 'Project Development', content: 'Dedicate time each day to practice and refine your skills.', link: '/practice' },
        { color: '#81C784', icon: 'mdi-account-check', title: 'Expert Feedback', content: 'Find a mentor or expert who can provide guidance and feedback on your progress.', link: '/practice' },
        { color: '#64B5F6', icon: 'mdi-teach', title: 'Mastery & Teaching', content: 'Regularly evaluate your progress and adjust your plan as needed to stay on track.', link: '/practice' }
    ]
};

export const physicalRoadmap = {
    name: "Physical Roadmap",
    tourName: "physical-roadmap-tour",
    introTexts: [
        "This roadmap is designed to guide you towards a healthier lifestyle through gentle physical activities. We believe that small, consistent changes can lead to significant improvements in your overall well-being.",
        "At Healpathy, we emphasize the importance of balance and gradual progress in your physical health journey. Remember, every step counts, and it's essential to listen to your body as you embark on this journey.",
        "Embrace the journey, and take the first step towards a healthier body today! Your commitment to these activities will pave the way for a more vibrant and energetic life."
    ],
    steps: [
        { target: "#roadmap-step-1", header: { title: "Step 1: Daily Movement" }, content: "Incorporate at least 30 minutes of exercise daily." },
        { target: "#roadmap-step-2", header: { title: "Step 2: Healthy Eating" }, content: "Follow a balanced diet with proper nutrition." },
        { target: "#roadmap-step-3", header: { title: "Step 3: Hydration & Sleep" }, content: "Stay hydrated and get enough rest." },
        { target: "#roadmap-step-4", header: { title: "Step 4: Strength & Endurance" }, content: "Focus on building muscle strength and stamina." },
        { target: "#roadmap-step-5", header: { title: "Step 5: Long-Term Wellness" }, content: "Maintain consistency and track your progress." }
    ],
    timelineItems: [
        { color: '#FF5252', icon: 'mdi-run', title: 'Daily Movement', content: 'Exercise for at least 30 minutes a day.', link: '/practice' },
        { color: '#FFB74D', icon: 'mdi-food-apple', title: 'Healthy Eating', content: 'Follow a nutritious diet for better health.', link: '/practice' },
        { color: '#4DB6AC', icon: 'mdi-water', title: 'Hydration & Sleep', content: 'Stay hydrated and rest well.', link: '/practice' },
        { color: '#7986CB', icon: 'mdi-weight-lifter', title: 'Strength & Endurance', content: 'Build muscle and improve stamina.', link: '/practice' },
        { color: '#64B5F6', icon: 'mdi-heart', title: 'Long-Term Wellness', content: 'Maintain consistency for lifelong health.', link: '/practice' }
    ]
};

export const strictPhysicalRoadmap = {
    name: "Strict Physical Roadmap",
    tourName: "strict-physical-roadmap-tour",
    introTexts: [
        "This roadmap is designed to challenge you and push you towards significant physical improvement and discipline.",
        "At Healpathy, we believe in the importance of commitment and consistency in achieving your physical health goals.",
        "Follow each step diligently, and hold yourself accountable for your progress to ensure a transformative experience."
    ],
    steps: [
        { target: "#roadmap-step-1", header: { title: "Step 1: Intense Training" }, content: "Follow a structured training program." },
        { target: "#roadmap-step-2", header: { title: "Step 2: Optimized Nutrition" }, content: "Track macros and optimize diet for performance." },
        { target: "#roadmap-step-3", header: { title: "Step 3: Recovery & Regeneration" }, content: "Prioritize muscle recovery and injury prevention." },
        { target: "#roadmap-step-4", header: { title: "Step 4: Mental Toughness" }, content: "Train your mind along with your body." },
        { target: "#roadmap-step-5", header: { title: "Step 5: Peak Performance" }, content: "Aim for continuous improvement and peak health." }
    ],
    timelineItems: [
        { color: '#D32F2F', icon: 'mdi-dumbbell', title: 'Intense Training', content: 'Incorporate rigorous stretching into your daily routine to enhance flexibility and prevent injuries.', link: '/practice' },
        { color: '#FFA000', icon: 'mdi-food', title: 'Optimized Nutrition', content: 'Commit to at least 30 minutes of cardio each day to boost your endurance and overall fitness.', link: '/practice' },
        { color: '#388E3C', icon: 'mdi-bed', title: 'Recovery & Regeneration', content: 'Engage in strength training exercises at least three times a week to build muscle and improve strength.', link: '/practice' },
        { color: '#1976D2', icon: 'mdi-brain', title: 'Mental Toughness', content: 'Maintain hydration by drinking sufficient water throughout the day. Proper hydration is crucial for performance.', link: '/practice' },
        { color: '#512DA8', icon: 'mdi-trophy', title: 'Peak Performance', content: 'Regularly assess your physical activities and make necessary adjustments to stay on track.', link: '/practice' }
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