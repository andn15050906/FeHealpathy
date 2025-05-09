<template>
  <div class="window-container">
    <div v-if="singleRoom">
      <form v-if="addNewRoom" @submit.prevent="createRoom">
        <input
          v-model="addRoomUsername"
          type="text"
          placeholder="thêm tên người dùng"
        />
        <button type="submit" :disabled="disableForm || !addRoomUsername">
          Tạo cuộc trò chuyện
        </button>
        <button class="button-cancel" @click="addNewRoom = false"
          >Hủy bỏ</button
        >
      </form>

      <form v-if="inviteRoomId" @submit.prevent="addRoomUser">
        <input
          v-model="invitedUsername"
          type="text"
          placeholder="thêm tên người dùng"
        />
        <button type="submit" :disabled="disableForm || !invitedUsername">
          Thêm người dùng
        </button>
        <button class="button-cancel" @click="inviteRoomId = null"
          >Hủy bỏ</button
        >
      </form>

      <form v-if="removeRoomId" @submit.prevent="deleteRoomUser">
        <select v-model="removeUserId">
          <option default value="">Chọn người dùng</option>
          <option v-for="user in removeUsers" :key="user._id" :value="user._id">
            {{ user.username }}
          </option>
        </select>
        <button type="submit" :disabled="disableForm || !removeUserId">
          Xóa người dùng
        </button>
        <button class="button-cancel" @click="removeRoomId = null"
          >Hủy bỏ</button
        >
      </form>
    </div>

    <vue-advanced-chat
      ref="chatWindow"
      :height="screenHeight"
      :theme="'light'"
      :styles="JSON.stringify(styles)"
      :current-user-id="currentUser.id"
      :room-id="roomId"
      :rooms="JSON.stringify(loadedRooms)"
      :loading-rooms="loadingRooms"
      :rooms-loaded="roomsLoaded"
      :messages="JSON.stringify(messages)"
      :messages-loaded="messagesLoaded"
      :room-message="roomMessage"
      :room-actions="JSON.stringify(roomActions)"
      :menu-actions="JSON.stringify(menuActions)"
      :message-actions="JSON.stringify(messageActions)"
      :templates-text="JSON.stringify(templatesText)"
      @fetch-more-rooms="fetchMoreRooms"
      @fetch-messages="fetchMessages($event.detail[0])"
      @send-message="sendMessage($event.detail[0])"
      @edit-message="editMessage($event.detail[0])"
      @delete-message="deleteMessage($event.detail[0])"
      @open-file="openFile($event.detail[0])"
      @add-room="addRoom($event.detail[0])"
      @room-action-handler="menuActionHandler($event.detail[0])"
      @menu-action-handler="menuActionHandler($event.detail[0])"
      @send-message-reaction="sendMessageReaction($event.detail[0])"
      :show-files="false"
      :show-new-messages-divider="false"
      :single-room="singleRoom"
    >
      <!--@open-user-tag="openUserTag($event.detail[0])"-->
      <!--@typing-message="typingMessage($event.detail[0])"-->
      <!--@toggle-rooms-list="$emit('show-demo-options', $event.detail[0].opened)"-->
      <!--@show-audio="false"-->
    </vue-advanced-chat>
    <teleport to="body">
      <InviteUser
        v-if="showInviteModal"
        :conversationId="inviteRoomId"
        :current-user="currentUser"
        :current-room-members="currentRoomMembers"
        :isCreatingNewRoom="inviteForNewRoom"
        @created="fetchRooms"
        @close="showInviteModal = false"
      />

      <ConversationInfoModal
        v-if="showConversationInfoModal"
        :conversation="selectedConversation"
        @close="showConversationInfoModal  = false"
         @updated="() => { fetchRooms(); showConversationInfoModal = false }"
      />

    </teleport>
  </div>
</template>

<script>
import { register } from 'vue-advanced-chat'
import { getUserProfile } from '@/scripts/api/services/authService';
import { formatISODate, reactionMap } from '@/scripts/logic/common';
import { getUsers } from '@/scripts/api/services/userService';
import { getPagedConversations } from '@/scripts/api/services/conversationService';
import { getPagedChatMessages } from '@/scripts/api/services/chatMessageService';
import { HubConnection, MessagingHandler, MESSAGE_TYPES } from '@/scripts/api/hubClient';
import InviteUser from "@/components/Common/Popup/InviteUser.vue";
import ConversationInfoModal from "@/components/Common/Popup/ConversationInfoModal.vue";

register();

export default {
    components: {
        InviteUser,
        ConversationInfoModal
    },
    props: {
        singleRoom: {
            type: Boolean
        }
    },
    async mounted() {
        //const styles = await import('../../assets/conversation.css')
        this.addStyle(
            `.vac-icon-textarea-left, .vac-toggle-button, .vac-text-started {
                display: none !important;
            }
            .vac-message-wrapper .vac-message-box {
                max-width: 90% !important;
            }
            .vac-message-wrapper .vac-offset-current {
                margin-left: 20% !important;
            }
            code {
                overflow: scroll;
            }
            `
        );

        this.currentUser = await getUserProfile();
        this.isPartnerChat = this.singleRoom;

        if (this.isPartnerChat) {
            if (!this.autoMessage) {
                setTimeout(() => {
                    var questions = [
                        'Bạn thường làm gì khi khó ngủ?',
                        'Điều gì mang lại cho bạn sự bình yên nhất?',
                        'Bạn đối phó với căng thẳng như thế nào?',
                        'Điều gì khiến bạn mỉm cười hôm nay?',
                        'Hôm nay bạn đã làm gì cho bản thân chưa?',
                        'Bạn biết ơn điều gì nhất?',
                        'Điều gì khiến bạn cảm thấy sống động nhất?',
                        'Bạn nạp lại năng lượng như thế nào khi cảm thấy quá tải?',
                        'Điều nhỏ nhặt nào mang lại niềm vui cho bạn hôm nay?',
                        'Điều gì giúp bạn duy trì động lực?'
                    ];

                    var question = questions[Math.floor(Math.random() * questions.length)];

                    var response = {
                        "id": "x5208e49-c001-44b2-97e6-4dc61e11fd0f",
                        "creatorId": "00000000-0000-0000-0000-000000000001",
                        "lastModifierId": "00000000-0000-0000-0000-000000000000",
                        "creationTime": (new Date()).toISOString(),
                        "lastModificationTime": (new Date()).toISOString(),
                        "content": question,
                        "status": 0,
                        "conversationId": this.roomId,
                        "attachments": [],
                        "reactions": []
                    }

                    if (!this.fetchedMessagesData.items) {
                        this.fetchMessages({ room: { roomId: this.roomId } });
                        return;
                    }

                    this.fetchedMessagesData.items.push(response);
                    if (response.conversationId == this.roomId) {
                        let sender = this.allUsers.find(user => user?._id === response.creatorId);
                        this.addMessageToContainer(
                            this.messages,
                            response,
                            sender,
                            this.currentUser.id == sender.id,
                            this.formatReactions(response)
                        );
                    }
                }, 60000);

                this.autoMessage = true;
            }
            this.menuActions = [
                { name: 'toggleChat', title: 'Bật/Tắt cuộc trò chuyện' }
            ];
            this.toggleChat();
            this.fetchPartnerRoom();
        }
        else {
            this.menuActions = [
                { name: 'inviteUser', title: 'Thêm người dùng' },
                { name: 'removeUser', title: 'Xóa người dùng' },
                { name: 'createRoom', title: 'Tạo cuộc trò chuyện mới' },
                { name: 'viewConversationInfo', title: 'Xem thông tin cuộc trò chuyện' }  
            ];
            this.fetchRooms();
        }

        this.listenMessages();
    },
    data() {
        return {
            autoMessage: false,
            messagingHandler: {},
            allUsers: [],
            currentUser: {},
            isPartnerChat: false,
            fetchedMessagesData: {},
            roomsPerPage: 15,
            rooms: [],
            roomId: '',
            startRooms: null,
            endRooms: null,
            roomsLoaded: false,
            loadingRooms: true,
            loadingLastMessageByRoom: 0,
            roomsLoadedCount: 0,
            selectedRoom: null,
            messagesPerPage: 20,
            messages: [],
            messagesLoaded: false,
            roomMessage: '',
            lastLoadedMessage: null,
            previousLastLoadedMessage: null,
            roomsListeners: [],
            listeners: [],
            disableForm: false,
            addNewRoom: null,
            addRoomUsername: '',
            inviteRoomId: null,
            invitedUsername: '',
            removeRoomId: null,
            removeUserId: '',
            removeUsers: [],
            roomActions: [],
            menuActions: [],
            showInviteModal: false,
            showMembersTooltip: false,
            showConversationInfoModal: false,
            selectedConversation: { id: "", title: "", avatarUrl: "", members: [] },
            messageActions: [
                { name: 'editMessage', title: 'Chỉnh sửa tin nhắn', onlyMe: true },
                { name: 'deleteMessage', title: 'Xóa tin nhắn', onlyMe: true }
            ],
            styles: { container: { borderRadius: '4px' } },
            templatesText: [{ tag: 'help', text: 'Đây là hỗ trợ' }]
        }
    },
    computed: {
        loadedRooms() {
            return this.rooms.slice(0, this.roomsLoadedCount)
        },
        screenHeight() {
            return !this.singleRoom ? '750px' : '460px';
        },
        currentRoom() {
            return this.rooms.find(_ => _.id == this.selectedRoom);
        },
        currentRoomMembers() {
            return Array.from(this.currentRoom.users.map(user => user._id));
        },
        currentConversation() {
            return this.selectedConversation || { 
            id: "", title: "", avatarUrl: "", members: [] 
            };
        }
    },
    methods: {
        addStyle(style, id) {
            let element = document.createElement('style');
            element.innerHTML = style;
            Object.assign(element, { id: id })
            this.$refs.chatWindow.shadowRoot.appendChild(element);
        },
        removeStyle(id) {
            let element = this.$refs.chatWindow.shadowRoot.getElementById(id);
            element.parentNode.removeChild(element);
        },

        resetRooms() {
            this.loadingRooms = true
            this.loadingLastMessageByRoom = 0
            this.roomsLoadedCount = 0
            this.rooms = []
            this.roomsLoaded = true
            this.startRooms = null
            this.endRooms = null
            this.roomsListeners.forEach(listener => listener())
            this.roomsListeners = []
            this.resetMessages()
        },

        resetMessages() {
            this.messages = []
            this.messagesLoaded = false
            this.lastLoadedMessage = null
            this.previousLastLoadedMessage = null
            this.listeners.forEach(listener => listener())
            this.listeners = []
        },

        fetchRooms() {
            this.resetRooms()
            this.fetchMoreRooms()
        },

        async fetchPartnerRoom() {
            var users = [
                {
                    _id: this.currentUser.id,
                    username: this.currentUser.fullName,
                    avatar: this.currentUser.avatarUrl
                },
                {
                    _id: "00000000-0000-0000-0000-000000000001",
                    username: "Hapi",
                    avatar: 'https://img.freepik.com/free-vector/cartoon-style-robot-vectorart_78370-4103.jpg?t=st=1738321862~exp=1738325462~hmac=b560fdb38b0ed4d909df8515962e618b4608320fd6b2997b8773c39d498f10d4&w=826'
                }
            ];

            this.allUsers = users;
            this.roomId = this.currentUser.id;

            let fetchedRoom = {
                id: this.currentUser.id,
                roomId: this.currentUser.id,
                roomName: users[1].username,
                avatar: users[1].avatar,
                unreadCount: 0,
                lastMessage: {},
                users: Array.from(users.map(item => item._id)),
                lastUpdated: {}
            }

            this.roomsLoaded = true;
            this.setupFetchedRooms([fetchedRoom], users);
        },

        async fetchMoreRooms() {
            if (this.endRooms && !this.startRooms || this.isPartnerChat) {
                this.roomsLoaded = true;
                return;
            }

            let userPromise = getUsers().then(pagedUsers => {
                this.allUsers = Array.from(pagedUsers.items.map(item => {
                    return {
                        _id: item.id,
                        username: item.fullName,
                        avatar: item.avatarUrl
                        //status: { state: 'online', lastChanged: 'today, 14:30' }
                    }
                }));
            });

            let fetchedRooms = [];
            let conversationPromise = getPagedConversations({ Members: /*[*/this.currentUser.id/*]*/ })
                .then(pagedConversations => {
                    fetchedRooms = Array.from(pagedConversations.items
                        .filter(item => item.id != this.currentUser.id)                             //exclude partner chat
                        .map(item => {
                            return {
                                id: item.id,
                                roomId: item.id,
                                title: item.title,
                                roomName: item.title,
                                avatar: item.avatarUrl,
                                unreadCount: 0,                                                     //...
                                lastMessage: {},                                                    //...
                                users: Array.from(item.members.map(item => item.creatorId)),
                                lastUpdated: item.creationTime
                            }
                        })
                    );
                })
                .catch(error => { });
            
            if (fetchedRooms.length == 0) {
                const fallback = await getPagedConversations();

                const fallbackItem = fallback.items?.filter(item => item.id != this.currentUser.id)?.[0];    //exclude partner chat
                if (fallbackItem) {
                    fetchedRooms = [{
                        id: fallbackItem.id,
                        roomId: fallbackItem.id,
                        title: fallbackItem.title,
                        roomName: fallbackItem.title,
                        avatar: fallbackItem.avatarUrl,
                        unreadCount: 0,
                        lastMessage: {},
                        users: Array.from(fallbackItem.members.map(item => item.creatorId)),
                        lastUpdated: fallbackItem.creationTime
                    }];
                }
            }

            await Promise.all([userPromise, conversationPromise]);

            this.roomsLoaded = fetchedRooms.length === 0 || fetchedRooms.length < this.roomsPerPage;

            /*if (this.startRooms) this.endRooms = this.startRooms
            this.startRooms = docs[docs.length - 1]*/

            this.setupFetchedRooms(fetchedRooms, this.allUsers);

            if (!this.rooms.length) {
                this.loadingRooms = false
                this.roomsLoadedCount = 0
            }

            //this.listenUsersOnlineStatus(formattedRooms);
        },

        setupFetchedRooms(fetchedRooms, allUsers) {
            const formattedRooms = []
            fetchedRooms.forEach(room => {
                // re-assign room users (convert from userId to user)
                for (let i = 0; i < room.users.length; i++) {
                    const foundUser = allUsers.find(user => user?._id === room.users[i]);
                    if (foundUser) {
                        room.users[i] = foundUser;
                    } else {
                        room.users[i] = { _id: room.users[i], username: 'Unknown User', avatar: '' };
                    }
                }

                // re-assign room name
                const otherRoomUsers = room.users.filter(user => user && user._id !== this.currentUser.id);
                if (otherRoomUsers.length === 1) {
                    // 1-1 chat: use the partner's username and avatar
                    room.roomName = otherRoomUsers.map(user => user.username).join(', ') || 'Your AI Partner';
                    room.avatar = otherRoomUsers[0].avatar || '';
                } else {
                    // Group chat: use the room title and avatarUrl from server
                    room.roomName = room.title || 'Group Chat'; // Use the title from the room
                    room.avatar = room.avatar || ''; // Use the avatarUrl from the room
                    room.membersCount = otherRoomUsers.length + 1;
                }
                formattedRooms.push({
                    ...room,
                    roomId: room.id,
                    index: room.lastUpdated.seconds,
                    lastMessage: {
                        content: '',
                        timestamp: formatISODate(room.lastUpdated)
                    }
                })
            })

            this.rooms = this.rooms.concat(formattedRooms)
            formattedRooms.forEach(room => this.listenLastMessage(room))
        },

        listenLastMessage(room) {
            /*messageStore.forEach(message => {
                const lastMessage = this.formatLastMessage(message, room)
                const roomIndex = this.rooms.findIndex(
                    r => room.roomId === r.roomId
                )
                this.rooms[roomIndex].lastMessage = lastMessage
                this.rooms = [...this.rooms]
            })*/
            if (this.loadingLastMessageByRoom < this.rooms.length) {
                this.loadingLastMessageByRoom++

                if (this.loadingLastMessageByRoom === this.rooms.length) {
                    this.loadingRooms = false
                    this.roomsLoadedCount = this.rooms.length
                }
            }

            /*
            const listener = firestoreService.listenLastMessage(
                room.roomId,
                messages => {
                    // this.incrementDbCounter('Listen Last Room Message', messages.length)
                    messages.forEach(message => {
                        const lastMessage = this.formatLastMessage(message, room)
                        const roomIndex = this.rooms.findIndex(
                            r => room.roomId === r.roomId
                        )
                        this.rooms[roomIndex].lastMessage = lastMessage
                        this.rooms = [...this.rooms]
                    })
                    if (this.loadingLastMessageByRoom < this.rooms.length) {
                        this.loadingLastMessageByRoom++

                        if (this.loadingLastMessageByRoom === this.rooms.length) {
                            this.loadingRooms = false
                            this.roomsLoadedCount = this.rooms.length
                        }
                    }
                }
            )

            this.roomsListeners.push(listener)*/
        },



        fetchMessages({ room, options = {} }) {
            if (options.reset)
                this.resetMessages();

            if (this.previousLastLoadedMessage && !this.lastLoadedMessage) {
                this.messagesLoaded = true;
                return
            }

            this.selectedRoom = room.roomId;
            this.roomId = room.roomId;
            getPagedChatMessages({ conversationId: room.roomId }).then(response => {
                if (this.selectedRoom !== room.roomId || !response.items)
                    return;

                if (response.items.length === 0 || response.items.length < this.messagesPerPage)
                    this.messagesLoaded = true;

                if (options.reset)
                    this.messages = [];

                this.fetchedMessagesData = response;
                this.fetchedMessagesData.items.forEach(newMessage => {
                    let sender = this.allUsers.find(user => user?._id === newMessage.creatorId)
                    this.addMessageToContainer(
                        this.messages,
                        newMessage,
                        sender,
                        this.currentUser.id == sender.id,
                        this.formatReactions(newMessage),
                    )
                })

                if (this.lastLoadedMessage)
                    this.previousLastLoadedMessage = this.lastLoadedMessage

                //this.lastLoadedMessage = docs[docs.length - 1]
                this.lastLoadedMessage = response.items[response.items.length - 1]
            }).catch(err => {
                if (err.status == 404)
                    this.messagesLoaded = true;
            });
        },

        formatMessage(message, sender, isCurrentUser, reactions) {
            return {
                _id: message.id,
                content: message.content,
                senderId: sender?._id,
                username: sender?.username,
                avatar: sender?.avatar,
                date: formatISODate(message.lastModificationTime),
                disableActions: false,
                disableReactions: isCurrentUser,
                // files: [
                //     {
                //         name: 'My File',
                //         size: 67351,
                //         type: 'png',
                //         audio: true,
                //         duration: 14.4,
                //         url: 'https://fastly.picsum.photos/id/716/200/300.jpg?hmac=qbNS_afUKsp_nyvuAAcK8T7OxOtMoqJvLIeaK-jirsU',
                //         preview: 'https://fastly.picsum.photos/id/716/200/300.jpg?hmac=qbNS_afUKsp_nyvuAAcK8T7OxOtMoqJvLIeaK-jirsU',
                //         //progress: 88
                //     }
                // ],
                reactions: reactions,
                // replyMessage: {
                //     content: 'Reply Message',
                //     senderId: '4321',
                //     files: [
                //         {
                //             name: 'My Replied File',
                //             size: 67351,
                //             type: 'png',
                //             audio: true,
                //             duration: 14.4,
                //             url: 'https://fastly.picsum.photos/id/716/200/300.jpg?hmac=qbNS_afUKsp_nyvuAAcK8T7OxOtMoqJvLIeaK-jirsU',
                //             preview: 'https://fastly.picsum.photos/id/716/200/300.jpg?hmac=qbNS_afUKsp_nyvuAAcK8T7OxOtMoqJvLIeaK-jirsU'
                //         }
                //     ]
                // }
            }
        },

        addMessageToContainer(messages, message, sender, isCurrentUser, reactions) {
            messages.push(this.formatMessage(message, sender, isCurrentUser, reactions));
        },

        formatReactions(message) {
            let reactions = {};
            message.reactions.forEach(item => {
                let emoji = reactionMap[item.content] ?? item.content;
                if (emoji) {
                    if (!reactions[emoji]) {
                        reactions[emoji] = [];
                    }
                    reactions[emoji].push(item.creatorId);
                }
            });
            return reactions;
        },

        listenMessages() {
            this.messagingHandler = new MessagingHandler(new HubConnection());

            this.messagingHandler.addListener(MESSAGE_TYPES.CreateChatMessage.callback, response => {
                if (!this.fetchedMessagesData.items) {
                    this.fetchMessages({ room: { roomId: this.roomId } });
                    return;
                }

                this.fetchedMessagesData.items.push(response);
                if (response.conversationId == this.roomId) {
                    let sender = this.allUsers.find(user => user?._id === response.creatorId);
                    this.addMessageToContainer(
                        this.messages,
                        response,
                        sender,
                        this.currentUser.id == sender.id,
                        this.formatReactions(response)
                    );
                }
            })

            this.messagingHandler.addListener(MESSAGE_TYPES.UpdateChatMessage.callback, response => {
                //... keep both
                this.fetchedMessagesData.items.push(response);

                if (response.conversationId == this.roomId) {
                    let sender = this.allUsers.find(user => user?._id === response.creatorId);

                    // can't get findIndex to work
                    this.messages.forEach((item, index) => {
                        if (item._id == response.id) {
                            this.messages[index] = this.formatMessage(
                                response,
                                sender,
                                this.currentUser.id == sender.id,
                                this.formatReactions(response)
                            );
                        }
                    })
                }
            })

            this.messagingHandler.addListener(MESSAGE_TYPES.DeleteChatMessage.callback, response => {
                //... keep both
                this.fetchedMessagesData.items.push(response);

                if (response.conversationId == this.roomId) {
                    this.messages.forEach((item, index) => {
                        if (item._id == response.id) {
                            this.messages.splice(index, 1);
                        }
                    })
                }
            })

            this.messagingHandler.addListener(MESSAGE_TYPES.CreateMessageReaction.callback, response => {
                let fetchedMessage = this.fetchedMessagesData.items.find(item => item.id == response.sourceId);
                fetchedMessage.reactions.push(response);

                this.messages.forEach((item, index) => {
                    if (item._id == response.sourceId) {
                        let message = this.messages[index];

                        let emoji = reactionMap[response.content] ?? response.content;
                        if (emoji) {
                            if (!message.reactions[emoji]) {
                                message.reactions[emoji] = [];
                            }
                            message.reactions[emoji].push(response.creatorId);
                        }
                    }
                })
            })

            this.messagingHandler.addListener(MESSAGE_TYPES.DeleteMessageReaction.callback, response => {
                this.messages.forEach((item, index) => {
                    if (item._id == response.sourceId) {
                        let emoji = reactionMap[response.content] ?? response.content;
                        if (emoji) {
                            if (!this.messages[index].reactions[emoji]) {
                                this.messages[index].reactions[emoji] = [];
                            }
                            let creatorIdIndex = this.messages[index].reactions[emoji].findIndex(reactionCreator => reactionCreator == response.creatorId);
                            this.messages[index].reactions[emoji].splice(creatorIdIndex, 1);
                        }
                    }
                })
            })

            this.messagingHandler.startListening();
        },

        async sendMessage({ content, roomId, files, replyMessage }) {
            /*if (files) {
                this.formattedFiles(files);
                for (let index = 0; index < files.length; index++) {
                    await this.uploadFile({ file: files[index], messageId: id, roomId })
                }
            }

            if (replyMessage) {
                message.replyMessage = {
                    _id: replyMessage._id,
                    content: replyMessage.content,
                    sender_id: replyMessage.senderId
                }

                if (replyMessage.files) {
                    message.replyMessage.files = replyMessage.files
                }
            }*/
            this.messagingHandler.createChatMessage(this.currentRoomMembers, roomId, content, files);
        },

        async editMessage({ messageId, newContent, roomId, files }) {
            /*const newMessage = { edited: new Date() }
            newMessage.content = newContent

            if (files) {
                newMessage.files = this.formattedFiles(files)
            } else {
                newMessage.files = firestoreService.deleteDbField
            }

            if (files) {
                for (let index = 0; index < files.length; index++) {
                    if (files[index]?.blob) {
                        await this.uploadFile({ file: files[index], messageId, roomId })
                    }
                }
            }*/

            this.messagingHandler.updateChatMessage(this.currentRoomMembers, messageId, newContent, files);
        },

        async deleteMessage({ message, roomId }) {
            this.messagingHandler.deleteChatMessage(this.currentRoomMembers, message._id);
        },

        async sendMessageReaction({ reaction, remove, messageId, roomId }) {
            let message = this.fetchedMessagesData.items.find(item => item.id == messageId);
            let currentReaction = message.reactions.find(item => item.creatorId == this.currentUser.id);
            if (!remove && !currentReaction)
                this.messagingHandler.createMessageReaction(this.currentRoomMembers, message.id, reaction.unicode, remove);
            else if (remove && currentReaction)
                this.messagingHandler.deleteMessageReaction(this.currentRoomMembers, currentReaction.id);
        },

        async uploadFile({ file, messageId, roomId }) {
            return new Promise(resolve => {
                let type = file.extension || file.type
                if (type === 'svg' || type === 'pdf') {
                    type = file.type
                }

                /*storageService.listenUploadImageProgress(
                    this.currentUser.id,
                    messageId,
                    file,
                    type,
                    progress => {
                        this.updateFileProgress(messageId, file.localUrl, progress)
                    },
                    _error => {
                        resolve(false)
                    },
                    async url => {
                        const message = await firestoreService.getMessage(roomId, messageId)

                        message.files.forEach(f => {
                            if (f.url === file.localUrl) {
                                f.url = url
                            }
                        })

                        await firestoreService.updateMessage(roomId, messageId, {
                            files: message.files
                        })
                        resolve(true)
                    }
                )*/
            })
        },

        /*updateFileProgress(messageId, fileUrl, progress) {
            const message = this.messages.find(message => message._id === messageId)

            if (!message || !message.files) return

            message.files.find(file => file.url === fileUrl).progress = progress
            this.messages = [...this.messages]
        },*/

        formattedFiles(files) {
            const formattedFiles = []

            files.forEach(file => {
                const messageFile = {
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    extension: file.extension || file.type,
                    url: file.url || file.localUrl
                }

                if (file.audio) {
                    messageFile.audio = true
                    messageFile.duration = file.duration
                }

                formattedFiles.push(messageFile)
            })

            return formattedFiles
        },

        openFile({ file }) {
            window.open(file.file.url, '_blank')
        },

        menuActionHandler({ action, roomId }) {
            switch (action.name) {
                case 'toggleChat':
                    return this.toggleChat();
                case 'inviteUser':
                    return this.inviteUser(roomId)
                case 'removeUser':
                    return this.removeUser(roomId)
                case 'createRoom':
                    return this.openCreateRoomModal();
                case 'viewConversationInfo':
                    return this.viewConversationInfo(roomId);
            }
        },

        async viewConversationInfo(roomId) {
            const conversation = this.rooms.find(r => r.id === roomId);

            if (conversation) {
            this.selectedConversation = conversation;
            this.showConversationInfoModal = true;
            }
        },

        openCreateRoomModal() {
            this.showInviteModal = true;
            this.inviteForNewRoom = true;
        },

        addRoom() {
            this.resetForms()
            this.addNewRoom = true
        },

        async createRoom() {
            this.disableForm = true
            this.showInviteModal = true
            /*const { id } = await firestoreService.addUser({
                username: this.addRoomUsername
            })
            await firestoreService.updateUser(id, { _id: id })

            await firestoreService.addRoom({
                users: [id, this.currentUser.id],
                lastUpdated: new Date()
            })*/

            this.addNewRoom = false
            this.addRoomUsername = ''
            this.fetchRooms()
        },

        toggleChat() {
            this.$emit("toggleChat");
        },

        inviteUser(roomId) {
            this.resetForms(),
                this.showInviteModal = true;
            console.log("showInviteModal:", this.showInviteModal);
            this.inviteRoomId = roomId
        },

        async addRoomUser() {
            this.disableForm = true

            /*const { id } = await firestoreService.addUser({
                username: this.invitedUsername
            })
            await firestoreService.updateUser(id, { _id: id })

            await firestoreService.addRoomUser(this.inviteRoomId, id)*/

            this.inviteRoomId = null
            this.invitedUsername = ''
            this.fetchRooms()
        },

        removeUser(roomId) {
            this.resetForms()
            this.removeRoomId = roomId
            this.removeUsers = this.rooms.find(room => room.roomId === roomId).users
        },

        async deleteRoomUser() {
            this.disableForm = true

            /*await firestoreService.removeRoomUser(
                this.removeRoomId,
                this.removeUserId
            )*/

            this.removeRoomId = null
            this.removeUserId = ''
            this.fetchRooms()
        },

        resetForms() {
            this.disableForm = false
            this.addNewRoom = null
            this.addRoomUsername = ''
            this.inviteRoomId = null
            this.invitedUsername = ''
            this.removeRoomId = null
            this.removeUserId = ''
        }
    }
}
</script>

<style scoped>
form {
  padding-bottom: 20px;
}

input {
  padding: 5px;
  width: 140px;
  height: 21px;
  border-radius: 4px;
  border: 1px solid #d2d6da;
  outline: none;
  font-size: 14px;
  vertical-align: middle;
}

input::placeholder {
  color: #9ca6af;
}

button {
  background: #1976d2;
  color: #fff;
  outline: none;
  cursor: pointer;
  border-radius: 4px;
  padding: 8px 12px;
  margin-left: 10px;
  border: none;
  font-size: 14px;
  transition: 0.3s;
  vertical-align: middle;
}

button:hover {
  opacity: 0.8;
}

button:active {
  opacity: 0.6;
}

button:disabled {
  cursor: initial;
  background: #c6c9cc;
  opacity: 0.6;
}

.button-cancel {
  color: #a8aeb3;
  background: none;
  margin-left: 5px;
}

select {
  vertical-align: middle;
  height: 33px;
  width: 152px;
  font-size: 13px;
  margin: 0 !important;
}
</style>
