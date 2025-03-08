<template>
    <v-container>
      <v-card>
        <v-card-title>
          <h1>{{ roadmap.title }}</h1>
        </v-card-title>
        <v-card-text>
          <p>{{ roadmap.introText }}</p>
          <v-tabs v-model="activeTab">
            <v-tab v-for="phase in roadmap.phases" :key="phase.id">
              {{ phase.title }}
            </v-tab>
          </v-tabs>
          <v-tabs-items v-model="activeTab">
            <v-tab-item v-for="phase in roadmap.phases" :key="phase.id">
              <v-card>
                <v-card-title>{{ phase.title }}</v-card-title>
                <v-card-subtitle>{{ phase.description }}</v-card-subtitle>
                <v-card-text>
                  <v-simple-table>
                    <thead>
                      <tr>
                        <th>Milestone Title</th>
                        <th>Event Name</th>
                        <th>Repeat Times Required</th>
                        <th>Time Spent Required</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="milestone in phase.milestones" :key="milestone.id">
                        <td>{{ milestone.title }}</td>
                        <td>{{ milestone.eventName }}</td>
                        <td>{{ milestone.repeatTimesRequired }}</td>
                        <td>{{ milestone.timeSpentRequired }} minutes</td>
                      </tr>
                    </tbody>
                  </v-simple-table>
                </v-card-text>
              </v-card>
            </v-tab-item>
          </v-tabs-items>
        </v-card-text>
      </v-card>
    </v-container>
  </template>
  
  <script>
  export default {
    data() {
      return {
        roadmap: {
            "id": "8cacd52d-bad9-4dbb-b361-f388fd3d46de",
            "creatorId": "5128ac4c-845f-4c4a-a6df-bda74ddea07c",
            "lastModifierId": "5128ac4c-845f-4c4a-a6df-bda74ddea07c",
            "creationTime": "2025-03-07T21:44:16.94",
            "lastModificationTime": "2025-03-07T21:44:16.94",
            "title": "Mental Roadmap",
            "introText": "CBT is a gentle therapeutic approach that equips individuals with the tools to understand and manage their thoughts and behaviors at a comfortable pace. At Healpathy, we are committed to guiding you through this roadmap, ensuring that you have the support and resources necessary for your mental health journey. Embrace the process, and take the first step toward a healthier mindset today! Remember, small steps lead to significant changes.",
            "phases": [
                {
                    "id": "f2199062-1272-4bd7-bd80-34b380a6475a",
                    "title": "Evaluate & Continue Maintenance",
                    "description": "Regularly assess your progress and adjust your strategies as needed. This step emphasizes the importance of reflection and adaptation in your mental health journey.",
                    "timeSpan": 0,
                    "milestones": [
                        {
                            "id": "0de36f7b-a168-4feb-9cc1-09d7d0c8e570",
                            "title": "Trò chuyện với Bạn đồng hành",
                            "eventName": "ChatMessage_Created",
                            "repeatTimesRequired": 10,
                            "timeSpentRequired": 0,
                            "recommendations": []
                        },
                        {
                            "id": "3b11b28c-e41e-4657-b88c-0a629ff367da",
                            "title": "Bình luận trong bài giảng",
                            "eventName": "LectureComment_Created",
                            "repeatTimesRequired": 3,
                            "timeSpentRequired": 0,
                            "recommendations": []
                        },
                        {
                            "id": "80a75a7d-7f04-491e-99a6-a3460c0f702c",
                            "title": "Viết nhật ký suy nghĩ",
                            "eventName": "DiaryNote_Created",
                            "repeatTimesRequired": 5,
                            "timeSpentRequired": 0,
                            "recommendations": []
                        },
                        {
                            "id": "5d9b5c17-05eb-4473-bb5d-a4b4a9e6d858",
                            "title": "Bình luận trong bài giảng",
                            "eventName": "LectureComment_Created",
                            "repeatTimesRequired": 3,
                            "timeSpentRequired": 0,
                            "recommendations": []
                        },
                        {
                            "id": "8de20567-ba2f-48e9-a9d8-bec6c07e6169",
                            "title": "Trò chuyện với Bạn đồng hành",
                            "eventName": "ChatMessage_Created",
                            "repeatTimesRequired": 10,
                            "timeSpentRequired": 0,
                            "recommendations": []
                        },
                        {
                            "id": "5a7a7a50-cdfa-4618-b015-db0086a40d9d",
                            "title": "Đánh giá khóa học",
                            "eventName": "CourseReview_Created",
                            "repeatTimesRequired": 1,
                            "timeSpentRequired": 0,
                            "recommendations": []
                        },
                        {
                            "id": "aa3a9e39-b55b-4a30-9327-e52193032449",
                            "title": "Đánh giá khóa học",
                            "eventName": "CourseReview_Created",
                            "repeatTimesRequired": 1,
                            "timeSpentRequired": 0,
                            "recommendations": []
                        },
                        {
                            "id": "81f4234c-e1b7-4202-94e8-e61fe5ffad22",
                            "title": "Viết nhật ký suy nghĩ",
                            "eventName": "DiaryNote_Created",
                            "repeatTimesRequired": 5,
                            "timeSpentRequired": 0,
                            "recommendations": []
                        }
                    ]
                },
                {
                    "id": "028108df-f46e-4287-8a70-4cc1e1fb0b2e",
                    "title": "Mindful Practices",
                    "description": "Establish routines that support long-term mental health. This step focuses on creating daily habits that promote well-being and resilience, ensuring a healthier lifestyle.",
                    "timeSpan": 0,
                    "milestones": [
                        {
                            "id": "dd2933d8-767d-4d66-b44c-0ab209b71907",
                            "title": "Tạo thói quen mới",
                            "eventName": "Routine_Created",
                            "repeatTimesRequired": 2,
                            "timeSpentRequired": 0,
                            "recommendations": []
                        },
                        {
                            "id": "a3b6f427-7e01-43c9-aaa7-185b60dca011",
                            "title": "Đọc và thích một bài blog",
                            "eventName": "ArticleReaction_Created",
                            "repeatTimesRequired": 5,
                            "timeSpentRequired": 0,
                            "recommendations": []
                        },
                        {
                            "id": "6b599dc2-1080-4080-9acf-3106b7f85401",
                            "title": "Viết nhật ký suy nghĩ",
                            "eventName": "DiaryNote_Created",
                            "repeatTimesRequired": 5,
                            "timeSpentRequired": 0,
                            "recommendations": []
                        },
                        {
                            "id": "88d046ae-2c18-44bc-b8a6-36cab4716e8b",
                            "title": "Cập nhật trạng thái cảm xúc",
                            "eventName": "Mood_Updated",
                            "repeatTimesRequired": 7,
                            "timeSpentRequired": 0,
                            "recommendations": []
                        },
                        {
                            "id": "c1cb1e17-b2fc-40fa-967d-3d7b22b25701",
                            "title": "Tham gia một khóa học",
                            "eventName": "Course_Enrolled",
                            "repeatTimesRequired": 1,
                            "timeSpentRequired": 0,
                            "recommendations": []
                        },
                        {
                            "id": "e9cd2fea-b3db-4114-b368-5d72f26aaf60",
                            "title": "Trò chuyện với Bạn đồng hành",
                            "eventName": "ChatMessage_Created",
                            "repeatTimesRequired": 10,
                            "timeSpentRequired": 0,
                            "recommendations": []
                        },
                        {
                            "id": "1340dca4-707f-4a33-ae91-783ee059a0b7",
                            "title": "Tham gia một khóa học",
                            "eventName": "Course_Enrolled",
                            "repeatTimesRequired": 1,
                            "timeSpentRequired": 0,
                            "recommendations": [
                                {
                                    "id": "01838b51-5653-488a-b475-631d66212459",
                                    "targetEntityId": "090413cd-dcb2-49e9-b0bb-79933ff1cb3a",
                                    "entityType": "Course",
                                    "milestoneId": "1340dca4-707f-4a33-ae91-783ee059a0b7",
                                    "trait": "Content",
                                    "traitDescription": "Healing"
                                },
                                {
                                    "id": "195f0647-2876-4d37-93bb-9f967f725634",
                                    "targetEntityId": "76bf19f6-1221-4242-97bb-0355035a3389",
                                    "entityType": "Course",
                                    "milestoneId": "1340dca4-707f-4a33-ae91-783ee059a0b7",
                                    "trait": "Content",
                                    "traitDescription": "Mental Health"
                                },
                                {
                                    "id": "5ded4f76-bb9d-4884-8270-c2b0cc71ae4e",
                                    "targetEntityId": "8999b164-da6b-4769-b65e-57860202e531",
                                    "entityType": "Course",
                                    "milestoneId": "1340dca4-707f-4a33-ae91-783ee059a0b7",
                                    "trait": "Content",
                                    "traitDescription": "Depression"
                                }
                            ]
                        },
                        {
                            "id": "dd1f7b29-bac5-4f0a-bebb-84c859e0680b",
                            "title": "Tạo thói quen mới",
                            "eventName": "Routine_Created",
                            "repeatTimesRequired": 2,
                            "timeSpentRequired": 0,
                            "recommendations": []
                        },
                        {
                            "id": "bc075b27-0663-4cb0-8680-8c5a37a9e7ff",
                            "title": "Tập yoga",
                            "eventName": "Yoga_Practiced",
                            "repeatTimesRequired": 1,
                            "timeSpentRequired": 300,
                            "recommendations": []
                        },
                        {
                            "id": "29814a27-3fe2-419a-bca3-c6e48b11974e",
                            "title": "Trò chuyện với Bạn đồng hành",
                            "eventName": "ChatMessage_Created",
                            "repeatTimesRequired": 10,
                            "timeSpentRequired": 0,
                            "recommendations": []
                        },
                        {
                            "id": "4f40a980-3ee0-4c53-bffd-d6087c1556c5",
                            "title": "Ghi nhật ký thói quen",
                            "eventName": "RoutineLog_Created",
                            "repeatTimesRequired": 7,
                            "timeSpentRequired": 0,
                            "recommendations": []
                        },
                        {
                            "id": "28b6e33a-8f08-4749-8d78-d9742e2ed17e",
                            "title": "Tập yoga",
                            "eventName": "Yoga_Practiced",
                            "repeatTimesRequired": 1,
                            "timeSpentRequired": 300,
                            "recommendations": []
                        },
                        {
                            "id": "c65e4d99-5fbd-411a-861b-ddbd98ed9258",
                            "title": "Cập nhật trạng thái cảm xúc",
                            "eventName": "Mood_Updated",
                            "repeatTimesRequired": 7,
                            "timeSpentRequired": 0,
                            "recommendations": []
                        },
                        {
                            "id": "9595e4f2-b5b0-436e-8678-e7f0a3147eb5",
                            "title": "Viết nhật ký suy nghĩ",
                            "eventName": "DiaryNote_Created",
                            "repeatTimesRequired": 5,
                            "timeSpentRequired": 0,
                            "recommendations": []
                        },
                        {
                            "id": "c705e338-6ba7-4435-b0fc-f1ad1d9dbf27",
                            "title": "Đọc và thích một bài blog",
                            "eventName": "ArticleReaction_Created",
                            "repeatTimesRequired": 5,
                            "timeSpentRequired": 0,
                            "recommendations": [
                                {
                                    "id": "a43fbfcc-6f33-4959-a6a0-266e17382381",
                                    "targetEntityId": "9bf5fdc4-cc28-4c25-8780-d9bacc1b2e83",
                                    "entityType": "Article",
                                    "milestoneId": "c705e338-6ba7-4435-b0fc-f1ad1d9dbf27",
                                    "trait": "Content",
                                    "traitDescription": "Mental Health"
                                },
                                {
                                    "id": "281c7d0e-5bd5-4492-a6c3-9ea5b18e876c",
                                    "targetEntityId": "05fae083-f51f-4298-ac78-be97599cda8f",
                                    "entityType": "Article",
                                    "milestoneId": "c705e338-6ba7-4435-b0fc-f1ad1d9dbf27",
                                    "trait": "Content",
                                    "traitDescription": "Healing"
                                }
                            ]
                        },
                        {
                            "id": "e4e17593-12cc-4a26-b00d-fe158798ac7c",
                            "title": "Ghi nhật ký thói quen",
                            "eventName": "RoutineLog_Created",
                            "repeatTimesRequired": 7,
                            "timeSpentRequired": 0,
                            "recommendations": []
                        }
                    ]
                },
                {
                    "id": "d791f09a-710b-4415-8b8c-4f0408a4fbef",
                    "title": "Stabilize Your Mind",
                    "description": "Learn techniques to reduce stress and prepare for change. This includes mindfulness practices and relaxation techniques that can help you regain control over your thoughts and emotions.",
                    "timeSpan": 0,
                    "milestones": [
                        {
                            "id": "c2f5073f-7ac9-4e58-b3e6-00e24e53a522",
                            "title": "Viết nhật ký suy nghĩ",
                            "eventName": "DiaryNote_Created",
                            "repeatTimesRequired": 5,
                            "timeSpentRequired": 0,
                            "recommendations": []
                        },
                        {
                            "id": "11569eb0-08db-4232-bd08-2aa7dc6b9875",
                            "title": "Cập nhật trạng thái cảm xúc",
                            "eventName": "Mood_Updated",
                            "repeatTimesRequired": 7,
                            "timeSpentRequired": 0,
                            "recommendations": []
                        },
                        {
                            "id": "69cdda10-ffae-4fb0-b4e1-2d7f379a9596",
                            "title": "Trò chuyện với Bạn đồng hành",
                            "eventName": "ChatMessage_Created",
                            "repeatTimesRequired": 10,
                            "timeSpentRequired": 0,
                            "recommendations": []
                        },
                        {
                            "id": "01e601b9-0720-4c61-8ccc-3420b7a0e692",
                            "title": "Thực hành Thiền",
                            "eventName": "Yoga_Practiced",
                            "repeatTimesRequired": 1,
                            "timeSpentRequired": 15,
                            "recommendations": []
                        },
                        {
                            "id": "46381fec-0d77-405d-a216-3663f84f4f26",
                            "title": "Trò chuyện với Bạn đồng hành",
                            "eventName": "ChatMessage_Created",
                            "repeatTimesRequired": 10,
                            "timeSpentRequired": 0,
                            "recommendations": []
                        },
                        {
                            "id": "6b288c76-36e4-421b-a3a6-50d203941e96",
                            "title": "Trò chuyện với Bạn đồng hành",
                            "eventName": "ChatMessage_Created",
                            "repeatTimesRequired": 10,
                            "timeSpentRequired": 0,
                            "recommendations": []
                        },
                        {
                            "id": "13e542da-5e33-4277-8025-51d6a8aad4ac",
                            "title": "Trả lời câu hỏi mỗi ngày",
                            "eventName": "QuestionOfTheDay_Answered",
                            "repeatTimesRequired": 3,
                            "timeSpentRequired": 0,
                            "recommendations": []
                        },
                        {
                            "id": "7fbf846c-0d9b-4730-a229-65818dd31669",
                            "title": "Nghe nhạc thư giãn",
                            "eventName": "Media_Viewed",
                            "repeatTimesRequired": 2,
                            "timeSpentRequired": 0,
                            "recommendations": [
                                {
                                    "id": "fe3b912d-24e6-4ad5-8ee9-a44bd2f5ab55",
                                    "targetEntityId": "b9df9f81-46c4-4009-a0b9-f6b817978408",
                                    "entityType": "MediaResource",
                                    "milestoneId": "7fbf846c-0d9b-4730-a229-65818dd31669",
                                    "trait": "Content",
                                    "traitDescription": "Mental Health"
                                },
                                {
                                    "id": "cd8c0657-970c-4eac-b289-d8787ca0325c",
                                    "targetEntityId": "1edee14b-fcb0-4996-9b2f-451266215dfc",
                                    "entityType": "MediaResource",
                                    "milestoneId": "7fbf846c-0d9b-4730-a229-65818dd31669",
                                    "trait": "Content",
                                    "traitDescription": "Depression"
                                }
                            ]
                        },
                        {
                            "id": "2b9d471b-31d1-4e48-9c0b-a639c356b378",
                            "title": "Viết nhật ký suy nghĩ",
                            "eventName": "DiaryNote_Created",
                            "repeatTimesRequired": 5,
                            "timeSpentRequired": 0,
                            "recommendations": []
                        },
                        {
                            "id": "1f37a567-c694-436b-b574-aca5a1e917ab",
                            "title": "Nghe nhạc thư giãn",
                            "eventName": "Media_Viewed",
                            "repeatTimesRequired": 2,
                            "timeSpentRequired": 0,
                            "recommendations": []
                        },
                        {
                            "id": "6f3bb361-b0ab-486d-8505-b56579ee08c6",
                            "title": "Trò chuyện với Bạn đồng hành",
                            "eventName": "ChatMessage_Created",
                            "repeatTimesRequired": 10,
                            "timeSpentRequired": 0,
                            "recommendations": []
                        },
                        {
                            "id": "1839b927-2957-4607-b7a5-b5f1c5bc44f7",
                            "title": "Cập nhật trạng thái cảm xúc",
                            "eventName": "Mood_Updated",
                            "repeatTimesRequired": 7,
                            "timeSpentRequired": 0,
                            "recommendations": []
                        },
                        {
                            "id": "5bdbca24-19e3-4795-bb8e-caf65785033c",
                            "title": "Thực hành Thiền",
                            "eventName": "Yoga_Practiced",
                            "repeatTimesRequired": 1,
                            "timeSpentRequired": 15,
                            "recommendations": []
                        },
                        {
                            "id": "8f3e9821-36c1-4e2b-beb2-ffaf2b911815",
                            "title": "Trả lời câu hỏi mỗi ngày",
                            "eventName": "QuestionOfTheDay_Answered",
                            "repeatTimesRequired": 3,
                            "timeSpentRequired": 0,
                            "recommendations": []
                        }
                    ]
                },
                {
                    "id": "382c6f0d-fd91-441f-b457-51177a882480",
                    "title": "Manage Stress & Emotions",
                    "description": "Develop skills to maintain a positive mindset and emotional balance. This involves learning coping strategies and emotional regulation techniques to handle life’s challenges effectively.",
                    "timeSpan": 0,
                    "milestones": []
                },
                {
                    "id": "2c4407ab-5638-4d11-97da-5999781f0ddf",
                    "title": "Identify the Problem",
                    "description": "Utilize tools to define your emotions and issues clearly. This step is crucial for understanding the root causes of your feelings and behaviors, allowing for effective strategies to be developed.",
                    "timeSpan": 0,
                    "milestones": [
                        {
                            "id": "dd40e4ea-1dd5-4bef-80eb-381d62cc66c2",
                            "title": "Tự đánh giá bản thân",
                            "eventName": "Submission_Created",
                            "repeatTimesRequired": 2,
                            "timeSpentRequired": 0,
                            "recommendations": []
                        },
                        {
                            "id": "7d485b73-6865-4389-b40d-4d201b8c070b",
                            "title": "Cập nhật trạng thái cảm xúc",
                            "eventName": "Mood_Updated",
                            "repeatTimesRequired": 7,
                            "timeSpentRequired": 0,
                            "recommendations": []
                        },
                        {
                            "id": "b25b6453-7ec8-4376-85e0-55ccab3b7780",
                            "title": "Trả lời câu hỏi mỗi ngày",
                            "eventName": "QuestionOfTheDay_Answered",
                            "repeatTimesRequired": 3,
                            "timeSpentRequired": 0,
                            "recommendations": []
                        },
                        {
                            "id": "8974d775-ad1a-44b7-9e9b-5cc12511445d",
                            "title": "Tự đánh giá bản thân",
                            "eventName": "Submission_Created",
                            "repeatTimesRequired": 2,
                            "timeSpentRequired": 0,
                            "recommendations": []
                        },
                        {
                            "id": "eac6a7a6-349c-4076-bd58-5dfef6cc2ddb",
                            "title": "Trò chuyện với Bạn đồng hành",
                            "eventName": "ChatMessage_Created",
                            "repeatTimesRequired": 10,
                            "timeSpentRequired": 0,
                            "recommendations": []
                        },
                        {
                            "id": "c1f1e808-0be8-462c-b03f-60a4b582c9c1",
                            "title": "Viết nhật ký suy nghĩ",
                            "eventName": "DiaryNote_Created",
                            "repeatTimesRequired": 5,
                            "timeSpentRequired": 0,
                            "recommendations": []
                        },
                        {
                            "id": "a91df735-912f-4941-96a5-62b2ab81913b",
                            "title": "Tự đánh giá bản thân",
                            "eventName": "Submission_Created",
                            "repeatTimesRequired": 2,
                            "timeSpentRequired": 0,
                            "recommendations": [
                                {
                                    "id": "c8a3b5c7-1403-41e1-94f7-0ae5c45bd029",
                                    "targetEntityId": "674ce30c-5116-4fb3-a6ff-88fc90d6ac89",
                                    "entityType": "Survey",
                                    "milestoneId": "a91df735-912f-4941-96a5-62b2ab81913b",
                                    "trait": "Content",
                                    "traitDescription": "Depression"
                                },
                                {
                                    "id": "8f47ee08-5911-47d9-bfec-e1711d66a2b0",
                                    "targetEntityId": "99d96f04-6e03-4266-922c-c8b40a86de1c",
                                    "entityType": "Survey",
                                    "milestoneId": "a91df735-912f-4941-96a5-62b2ab81913b",
                                    "trait": "Content",
                                    "traitDescription": "Healing"
                                }
                            ]
                        },
                        {
                            "id": "e60eb4ea-c52c-4dfe-b0c1-9aacd159b8c7",
                            "title": "Trả lời câu hỏi mỗi ngày",
                            "eventName": "QuestionOfTheDay_Answered",
                            "repeatTimesRequired": 3,
                            "timeSpentRequired": 0,
                            "recommendations": []
                        },
                        {
                            "id": "f78ed4db-3ec9-4219-acc3-b0bd66ac9c72",
                            "title": "Cập nhật trạng thái cảm xúc",
                            "eventName": "Mood_Updated",
                            "repeatTimesRequired": 7,
                            "timeSpentRequired": 0,
                            "recommendations": []
                        },
                        {
                            "id": "b5479fbe-9f71-449a-bfdd-b82cc1ab4ef4",
                            "title": "Trò chuyện với Bạn đồng hành",
                            "eventName": "ChatMessage_Created",
                            "repeatTimesRequired": 10,
                            "timeSpentRequired": 0,
                            "recommendations": []
                        },
                        {
                            "id": "abf63e1e-9480-4d6e-8320-bc48e29b5e1d",
                            "title": "Tự đánh giá bản thân",
                            "eventName": "Submission_Created",
                            "repeatTimesRequired": 2,
                            "timeSpentRequired": 0,
                            "recommendations": []
                        },
                        {
                            "id": "93a1e536-f829-4cf7-83fb-f799973a5cd5",
                            "title": "Viết nhật ký suy nghĩ",
                            "eventName": "DiaryNote_Created",
                            "repeatTimesRequired": 5,
                            "timeSpentRequired": 0,
                            "recommendations": []
                        }
                    ]
                },
                {
                    "id": "dd83ac77-5f83-4dfd-b448-629aacbd16f9",
                    "title": "Identify the Problem",
                    "description": "Utilize tools to define your emotions and issues clearly. This step is crucial for understanding the root causes of your feelings and behaviors, allowing for effective strategies to be developed.",
                    "timeSpan": 0,
                    "milestones": []
                },
                {
                    "id": "3f13abb0-a1e6-4fe3-ba02-654e5205e491",
                    "title": "Mindful Practices",
                    "description": "Establish routines that support long-term mental health. This step focuses on creating daily habits that promote well-being and resilience, ensuring a healthier lifestyle.",
                    "timeSpan": 0,
                    "milestones": []
                },
                {
                    "id": "4ac5077b-f8fd-403e-8a2d-97bebc0499f8",
                    "title": "Manage Stress & Emotions",
                    "description": "Develop skills to maintain a positive mindset and emotional balance. This involves learning coping strategies and emotional regulation techniques to handle life’s challenges effectively.",
                    "timeSpan": 0,
                    "milestones": [
                        {
                            "id": "f7b1d5f7-8120-4cbf-9a56-26336f30882a",
                            "title": "Bày tỏ cảm xúc với tin nhắn",
                            "eventName": "MessageReaction_Created",
                            "repeatTimesRequired": 7,
                            "timeSpentRequired": 0,
                            "recommendations": []
                        },
                        {
                            "id": "3356641a-708c-4d10-89a6-40aa538fe916",
                            "title": "Tham gia nhóm trò chuyện",
                            "eventName": "Conversation_Joined",
                            "repeatTimesRequired": 2,
                            "timeSpentRequired": 0,
                            "recommendations": []
                        },
                        {
                            "id": "4b75bf4c-fcc0-4002-88c9-4bcf6a0ff349",
                            "title": "Tập yoga",
                            "eventName": "Yoga_Practiced",
                            "repeatTimesRequired": 1,
                            "timeSpentRequired": 300,
                            "recommendations": []
                        },
                        {
                            "id": "f6f1703b-bcc9-4b54-bd8f-5361526bfe90",
                            "title": "Ghi nhật ký thói quen",
                            "eventName": "RoutineLog_Created",
                            "repeatTimesRequired": 7,
                            "timeSpentRequired": 0,
                            "recommendations": []
                        },
                        {
                            "id": "7e2305d9-4f74-44e8-a5dd-8e63f3605e4f",
                            "title": "Trò chuyện với Bạn đồng hành",
                            "eventName": "ChatMessage_Created",
                            "repeatTimesRequired": 10,
                            "timeSpentRequired": 0,
                            "recommendations": []
                        },
                        {
                            "id": "b09ebb62-ccfc-44b0-ab8a-97921e1c5990",
                            "title": "Gửi tin nhắn trò chuyện",
                            "eventName": "ChatMessage_Created",
                            "repeatTimesRequired": 10,
                            "timeSpentRequired": 0,
                            "recommendations": []
                        },
                        {
                            "id": "e90beabb-2f5a-4f97-b512-9c3c66006ebe",
                            "title": "Gửi tin nhắn trò chuyện",
                            "eventName": "ChatMessage_Created",
                            "repeatTimesRequired": 10,
                            "timeSpentRequired": 0,
                            "recommendations": []
                        },
                        {
                            "id": "4331e56c-9d88-4fcd-b0ae-afd2f56f05d3",
                            "title": "Cập nhật trạng thái cảm xúc",
                            "eventName": "Mood_Updated",
                            "repeatTimesRequired": 7,
                            "timeSpentRequired": 0,
                            "recommendations": []
                        },
                        {
                            "id": "0a86e36f-e3f4-4d49-afef-b0dac53578fe",
                            "title": "Hoàn thành một khóa học",
                            "eventName": "Course_Completed",
                            "repeatTimesRequired": 1,
                            "timeSpentRequired": 0,
                            "recommendations": []
                        },
                        {
                            "id": "891598e1-49cd-4a72-807e-b812f7bc0cc4",
                            "title": "Cập nhật trạng thái cảm xúc",
                            "eventName": "Mood_Updated",
                            "repeatTimesRequired": 7,
                            "timeSpentRequired": 0,
                            "recommendations": []
                        },
                        {
                            "id": "eeb93fd7-54c6-40c3-a83b-baddab526600",
                            "title": "Ghi nhật ký thói quen",
                            "eventName": "RoutineLog_Created",
                            "repeatTimesRequired": 7,
                            "timeSpentRequired": 0,
                            "recommendations": []
                        },
                        {
                            "id": "653ef5cc-e461-4651-bbee-bfa761572ca3",
                            "title": "Tham gia nhóm trò chuyện",
                            "eventName": "Conversation_Joined",
                            "repeatTimesRequired": 2,
                            "timeSpentRequired": 0,
                            "recommendations": [
                                {
                                    "id": "da6f1138-d240-417a-b854-0041441aa141",
                                    "targetEntityId": "9fe4d9e2-1df8-4dbe-b493-49870b4340b0",
                                    "entityType": "Conversation",
                                    "milestoneId": "653ef5cc-e461-4651-bbee-bfa761572ca3",
                                    "trait": "Content",
                                    "traitDescription": "Healing"
                                },
                                {
                                    "id": "e475bc10-e759-4127-a3ef-ec25c2dc6193",
                                    "targetEntityId": "9fe4d9e2-1df8-4dbe-b493-49870b4340b0",
                                    "entityType": "Conversation",
                                    "milestoneId": "653ef5cc-e461-4651-bbee-bfa761572ca3",
                                    "trait": "Content",
                                    "traitDescription": "Mental Health"
                                }
                            ]
                        },
                        {
                            "id": "deac31db-f154-4067-bf82-d02f6b113c9f",
                            "title": "Trò chuyện với Bạn đồng hành",
                            "eventName": "ChatMessage_Created",
                            "repeatTimesRequired": 10,
                            "timeSpentRequired": 0,
                            "recommendations": []
                        },
                        {
                            "id": "7951bda1-22e5-4cf1-a09d-d2627e81f9ad",
                            "title": "Hoàn thành một khóa học",
                            "eventName": "Course_Completed",
                            "repeatTimesRequired": 1,
                            "timeSpentRequired": 0,
                            "recommendations": []
                        },
                        {
                            "id": "a5330810-fb80-4bf0-88d1-d757a52f2f8d",
                            "title": "Bày tỏ cảm xúc với tin nhắn",
                            "eventName": "MessageReaction_Created",
                            "repeatTimesRequired": 7,
                            "timeSpentRequired": 0,
                            "recommendations": []
                        },
                        {
                            "id": "f9ca73eb-0423-44f8-8dad-e8d7f517f28c",
                            "title": "Tập yoga",
                            "eventName": "Yoga_Practiced",
                            "repeatTimesRequired": 1,
                            "timeSpentRequired": 300,
                            "recommendations": []
                        }
                    ]
                },
                {
                    "id": "15d07478-3381-4086-98ed-9d1b85f26b9f",
                    "title": "Stabilize Your Mind",
                    "description": "Learn techniques to reduce stress and prepare for change. This includes mindfulness practices and relaxation techniques that can help you regain control over your thoughts and emotions.",
                    "timeSpan": 0,
                    "milestones": []
                },
                {
                    "id": "f258d994-45b6-411e-bf4e-fc6267f96d91",
                    "title": "Evaluate & Continue Maintenance",
                    "description": "Regularly assess your progress and adjust your strategies as needed. This step emphasizes the importance of reflection and adaptation in your mental health journey.",
                    "timeSpan": 0,
                    "milestones": []
                }
            ]
        }
      };
    }
  };
  </script>
  
  <style scoped>
  .roadmap {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    font-family: Arial, sans-serif;
  }
  
  .phase {
    margin-bottom: 20px;
    border: 1px solid #ccc;
    padding: 10px;
    border-radius: 5px;
  }
  
  .milestones {
    margin-top: 10px;
  }
  
  .milestones ul {
    list-style-type: none;
    padding: 0;
  }
  
  .milestones li {
    margin: 5px 0;
  }
  </style>