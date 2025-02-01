<template>
    <div class="window-container">
        <div v-if="singleRoom">
            <form v-if="addNewRoom" @submit.prevent="createRoom">
                <input v-model="addRoomUsername" type="text" placeholder="Add username" />
                <button type="submit" :disabled="disableForm || !addRoomUsername">
                    Create Room
                </button>
                <button class="button-cancel" @click="addNewRoom = false">Cancel</button>
            </form>

            <form v-if="inviteRoomId" @submit.prevent="addRoomUser">
                <input v-model="invitedUsername" type="text" placeholder="Add username" />
                <button type="submit" :disabled="disableForm || !invitedUsername">
                    Add User
                </button>
                <button class="button-cancel" @click="inviteRoomId = null">Cancel</button>
            </form>

            <form v-if="removeRoomId" @submit.prevent="deleteRoomUser">
                <select v-model="removeUserId">
                    <option default value="">Select User</option>
                    <option v-for="user in removeUsers" :key="user._id" :value="user._id">
                        {{ user.username }}
                    </option>
                </select>
                <button type="submit" :disabled="disableForm || !removeUserId">
                    Remove User
                </button>
                <button class="button-cancel" @click="removeRoomId = null">Cancel</button>
            </form>
        </div>

        <vue-advanced-chat ref="chatWindow" :height="screenHeight" :theme="'light'" :styles="JSON.stringify(styles)"
            :current-user-id="currentUser.id" :room-id="roomId" :rooms="JSON.stringify(loadedRooms)"
            :loading-rooms="loadingRooms" :rooms-loaded="roomsLoaded" :messages="JSON.stringify(messages)"
            :messages-loaded="messagesLoaded" :room-message="roomMessage" :room-actions="JSON.stringify(roomActions)"
            :menu-actions="JSON.stringify(menuActions)"
            :message-selection-actions="JSON.stringify(messageSelectionActions)"
            :templates-text="JSON.stringify(templatesText)" @fetch-more-rooms="fetchMoreRooms"
            @fetch-messages="fetchMessages($event.detail[0])" @send-message="sendMessage($event.detail[0])"
            @edit-message="editMessage($event.detail[0])" @delete-message="deleteMessage($event.detail[0])"
            @open-file="openFile($event.detail[0])" @open-user-tag="openUserTag($event.detail[0])"
            @add-room="addRoom($event.detail[0])" @room-action-handler="menuActionHandler($event.detail[0])"
            @menu-action-handler="menuActionHandler($event.detail[0])"
            @message-selection-action-handler="messageSelectionActionHandler($event.detail[0])"
            @send-message-reaction="sendMessageReaction($event.detail[0])"
            @typing-message="typingMessage($event.detail[0])"
            :show-new-messages-divider="false"
            :single-room="singleRoom">
            <!--@toggle-rooms-list="$emit('show-demo-options', $event.detail[0].opened)"-->
            <!--@show-audio="false"-->
        </vue-advanced-chat>
    </div>
</template>

<script>
import { register } from 'vue-advanced-chat'
import { getUserAuthData } from '@/scripts/api/services/authService';
import { formatISODate, reactionMap } from '@/scripts/logic/common';
import { getUsers } from '@/scripts/api/services/userService';
import { getPagedConversations } from '@/scripts/api/services/conversationService';
import { getPagedChatMessages } from '@/scripts/api/services/chatMessageService';
import { HubConnection, MessagingHandler } from '@/scripts/api/hubClient';
import { ChatMessage } from '@/scripts/logic/store/chat';

register();

export default {
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
            }`
        );

        this.currentUser = await getUserAuthData();
        this.isPartnerChat = this.singleRoom;

        if (this.isPartnerChat) {
            this.menuActions = [
                { name: 'toggleChat', title: 'Toggle Chat' }
            ];
            this.fetchPartnerRoom();
        }
        else {
            this.menuActions = [
                { name: 'inviteUser', title: 'Invite User' },
                { name: 'removeUser', title: 'Remove User' }
            ];
            this.fetchRooms();
        }

        this.listenMessages();
    },
    data() {
        return {
            messagingHandler: {},
            allUsers: [],
            currentUser: {},
            isPartnerChat: false,
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
            typingMessageCache: '',
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
            messageSelectionActions: [{ name: 'deleteMessages', title: 'Delete' }],
            styles: { container: { borderRadius: '4px' } },
            templatesText: [{ tag: 'help', text: 'This is the help' }]
        }
    },
    computed: {
        loadedRooms() {
            return this.rooms.slice(0, this.roomsLoadedCount)
        },
        screenHeight() {
            return !this.singleRoom ? '750px' : '460px';
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
            let fetchedRoom = {
                id: this.currentUser.id,
                roomId: this.currentUser.id,
                roomName: 'Your AI partner',
                avatar: 'https://img.freepik.com/free-vector/cartoon-style-robot-vectorart_78370-4103.jpg?t=st=1738321862~exp=1738325462~hmac=b560fdb38b0ed4d909df8515962e618b4608320fd6b2997b8773c39d498f10d4&w=826',
                unreadCount: 0,
                lastMessage: {},
                users: [
                    {
                        _id: this.currentUser.id,
                        username: this.currentUser.fullName,
                        avatar: this.currentUser.avatarUrl
                    }
                ],
                lastMessage: {
                    content: '',
                    timestamp: formatISODate(new Date())
                }
            }

            this.rooms = this.rooms.concat([fetchedRoom])
            this.listenLastMessage(fetchedRoom);
        },

        async fetchMoreRooms() {
            if (this.endRooms && !this.startRooms) {
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
            let conversationPromise = getPagedConversations().then(pagedConversations => {
                fetchedRooms = Array.from((pagedConversations.items).map(item => {          //... filter user conversation only?
                    return {
                        id: item.id,
                        roomId: item.id,
                        roomName: item.title,
                        avatar: item.avatarUrl,
                        unreadCount: 0,                                                     //...
                        lastMessage: {},                                                    //...
                        users: Array.from(item.members.map(item => item.creatorId)),
                        lastUpdated: item.creationTime
                    }
                }));
            })

            await Promise.all([userPromise, conversationPromise]);

            this.roomsLoaded = fetchedRooms.length === 0 || fetchedRooms.length < this.roomsPerPage;

            /*if (this.startRooms) this.endRooms = this.startRooms
            this.startRooms = docs[docs.length - 1]*/

            const formattedRooms = []
            fetchedRooms.forEach(room => {
                // re-assign room users (convert from userId to user)
                for (let i = 0; i < room.users.length; i++) {
                    room.users[i] = this.allUsers.find(user => user?._id === room.users[i]);
                }

                // re-assign room name
                const otherRoomUsers = room.users.filter(user => user._id != this.currentUser.id);
                room.roomName = otherRoomUsers.map(user => user.username).join(', ') || 'Myself'

                formattedRooms.push({
                    ...room,
                    roomId: room.id,
                    avatar: otherRoomUsers.length === 1 && otherRoomUsers[0].avatar ? otherRoomUsers[0].avatar : '',
                    index: room.lastUpdated.seconds,
                    lastMessage: {
                        content: '',
                        timestamp: formatISODate(room.lastUpdated)
                    }
                })
            })

            this.rooms = this.rooms.concat(formattedRooms)
            formattedRooms.forEach(room => this.listenLastMessage(room))

            if (!this.rooms.length) {
                this.loadingRooms = false
                this.roomsLoadedCount = 0
            }

            //this.listenUsersOnlineStatus(formattedRooms);
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
            //this.$emit('show-demo-options', false)

            if (options.reset)
                this.resetMessages();

            if (this.previousLastLoadedMessage && !this.lastLoadedMessage) {
                this.messagesLoaded = true;
                return
            }

            this.selectedRoom = room.roomId;
            this.roomId = room.roomId;
            getPagedChatMessages({conversationId : room.roomId}).then(response => {
                if (this.selectedRoom !== room.roomId || !response.items)
                    return;

                if (response.items.length === 0 || response.items.length < this.messagesPerPage)
                    this.messagesLoaded = true;

                if (options.reset)
                    this.messages = [];

                response.items.forEach(newMessage => {
                    let sender = this.allUsers.find(user => user?._id === newMessage.creatorId)
                    this.addMessage(
                        this.messages,
                        newMessage,
                        sender,
                        this.currentUser.id == sender.id,
                        this.addReaction(newMessage),
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

        addMessage(messages, message, sender, isCurrentUser, reactions) {
            messages.push(
            {
                _id: message.id,
                content: message.content,
                senderId: sender?._id,
                username: sender?.username,
                avatar: sender?.avatar,
                date: formatISODate(message.lastModificationTime),
                disableActions: true,
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
            });
        },

        addReaction(message) {
            let reactions = {};
            message.reactions.forEach(item => {
                const emoji = reactionMap[item.content];
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
            this.messagingHandler.onChatMessageCreated = (conversationId, newMessage) => {
                if (conversationId == this.roomId) {
                    let sender = this.allUsers.find(user => user?._id === newMessage.creatorId);
                    this.addMessage(
                        this.messages,
                        newMessage,
                        sender,
                        this.currentUser.id == sender.id,
                        this.addReaction(newMessage)
                    );
                }
            }

            /*const listener = firestoreService.listenMessages(
                room.roomId,
                this.lastLoadedMessage,
                this.previousLastLoadedMessage,
                messages => {
                    messages.forEach(message => {
                        const formattedMessage = this.formatMessage(room, message)
                        const messageIndex = this.messages.findIndex(
                            m => m._id === message.id
                        )
        
                        if (messageIndex === -1) {
                            this.messages = this.messages.concat([formattedMessage])
                        } else {
                            this.messages[messageIndex] = formattedMessage
                            this.messages = [...this.messages]
                        }
        
                        this.markMessagesSeen(room, message)
                    })
                }
            )
            this.listeners.push(listener);*/
        },

        markMessagesSeen(room, message) {
            if (message.sender_id !== this.currentUser.id && (!message.seen || !message.seen[this.currentUser.id]))
            {
                /*firestoreService.updateMessage(room.roomId, message.id, {
                    [`seen.${this.currentUser.id}`]: new Date()
                })*/
            }
        },

        async sendMessage({ content, roomId, files, replyMessage }) {
            let message = new ChatMessage(
                content,
                files ? this.formattedFiles(files) : null
            );
            message.setCreationData(this.currentUser.id);

            /*if (replyMessage) {
                message.replyMessage = {
                    _id: replyMessage._id,
                    content: replyMessage.content,
                    sender_id: replyMessage.senderId
                }

                if (replyMessage.files) {
                    message.replyMessage.files = replyMessage.files
                }
            }*/

            this.messagingHandler.createChatMessage(this.selectedRoom, content, files);

            /*if (files) {
                for (let index = 0; index < files.length; index++) {
                    await this.uploadFile({ file: files[index], messageId: id, roomId })
                }
            }*/

            //firestoreService.updateRoom(roomId, { lastUpdated: new Date() })
        },

        async editMessage({ messageId, newContent, roomId, files }) {
            const newMessage = { edited: new Date() }
            newMessage.content = newContent

            if (files) {
                newMessage.files = this.formattedFiles(files)
            } else {
                newMessage.files = firestoreService.deleteDbField
            }

            //await firestoreService.updateMessage(roomId, messageId, newMessage)

            if (files) {
                for (let index = 0; index < files.length; index++) {
                    if (files[index]?.blob) {
                        await this.uploadFile({ file: files[index], messageId, roomId })
                    }
                }
            }
        },

        async deleteMessage({ message, roomId }) {
            /*await firestoreService.updateMessage(roomId, message._id, {
                deleted: new Date()
            })*/

            const { files } = message

            if (files) {
                files.forEach(file => {
                    //storageService.deleteFile(this.currentUser.id, message._id, file)
                })
            }
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

        async openUserTag({ user }) {
            let roomId

            this.rooms.forEach(room => {
                if (room.users.length === 2) {
                    const userId1 = room.users[0]._id
                    const userId2 = room.users[1]._id
                    if (
                        (userId1 === user._id || userId1 === this.currentUser.id) &&
                        (userId2 === user._id || userId2 === this.currentUser.id)
                    ) {
                        roomId = room.roomId
                    }
                }
            })

            if (roomId) {
                this.roomId = roomId
                return
            }

            /*const query1 = await firestoreService.getUserRooms(
                this.currentUser.id,
                user._id
            )
        
            if (query1.data.length) {
                return this.loadRoom(query1)
            }
        
            const query2 = await firestoreService.getUserRooms(
                user._id,
                this.currentUser.id
            )
        
            if (query2.data.length) {
                return this.loadRoom(query2)
            }*/

            const users =
                user._id === this.currentUser.id
                    ? [this.currentUser.id]
                    : [user._id, this.currentUser.id]

            /*const room = await firestoreService.addRoom({
                users: users,
                lastUpdated: new Date()
            })
        
            this.roomId = room.id*/
            this.fetchRooms()
        },

        async loadRoom(query) {
            query.forEach(async room => {
                if (this.loadingRooms) return
                /*await firestoreService.updateRoom(room.id, { lastUpdated: new Date() })*/
                this.roomId = room.id
                this.fetchRooms()
            })
        },

        menuActionHandler({ action, roomId }) {
            switch (action.name) {
                case 'toggleChat':
                    return this.toggleChat();
                case 'inviteUser':
                    return this.inviteUser(roomId)
                case 'removeUser':
                    return this.removeUser(roomId)
            }
        },

        messageSelectionActionHandler({ action, messages, roomId }) {
            switch (action.name) {
                case 'deleteMessages':
                    messages.forEach(message => {
                        this.deleteMessage({ message, roomId })
                    })
            }
        },

        async sendMessageReaction({ reaction, remove, messageId, roomId }) {
            /*firestoreService.updateMessageReactions(
                roomId,
                messageId,
                this.currentUser.id,
                reaction.unicode,
                remove ? 'remove' : 'add'
            )*/
        },

        typingMessage({ message, roomId }) {
            if (roomId) {
                if (message?.length > 1) {
                    this.typingMessageCache = message
                    return
                }

                if (message?.length === 1 && this.typingMessageCache) {
                    this.typingMessageCache = message
                    return
                }

                this.typingMessageCache = message

                /*firestoreService.updateRoomTypingUsers(
                    roomId,
                    this.currentUser.id,
                    message ? 'add' : 'remove'
                )*/
            }
        },

        /*listenUsersOnlineStatus(rooms) {
            rooms.forEach(room => {
                room.users.forEach(user => {
                    const listener = firebaseService.firebaseListener(
                        firebaseService.userStatusRef(user._id),
                        snapshot => {
                            if (!snapshot || !snapshot.val()) return
        
                            const lastChanged = formatTimestamp(
                                new Date(snapshot.val().lastChanged),
                                new Date(snapshot.val().lastChanged)
                            )
        
                            user.status = { ...snapshot.val(), lastChanged }
        
                            const roomIndex = this.rooms.findIndex(
                                r => room.roomId === r.roomId
                            )
        
                            this.rooms[roomIndex] = room
                            this.rooms = [...this.rooms]
                        }
                    )
                    this.roomsListeners.push(listener)
                })
            })
        },*/

        addRoom() {
            this.resetForms()
            this.addNewRoom = true
        },

        async createRoom() {
            this.disableForm = true

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
            this.resetForms()
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

        /*formatLastMessage(message, room) {
            if (!message.timestamp) return

            let content = message.content
            if (message.files?.length) {
                const file = message.files[0]
                content = `${file.name}.${file.extension || file.type}`
            }

            const username = message.sender_id !== this.currentUser.id
                ? room.users.find(user => message.sender_id === user._id)?.username
                : ''

            return {
                ...message,
                ...{
                    _id: message.id,
                    content,
                    senderId: message.sender_id,
                    timestamp: formatTimestamp(
                        new Date(message.timestamp.seconds * 1000),
                        message.timestamp
                    ),
                    username: username,
                    distributed: true,
                    seen: message.sender_id === this.currentUser.id ? message.seen : null,
                    new:
                        message.sender_id !== this.currentUser.id &&
                        (!message.seen || !message.seen[this.currentUser.id])
                }
            }
        },*/

        /* message
        //timestamp: 
        //system: false,
        //saved: false,
        //distributed: false,
        //seen: false,
        //deleted: false,
        //failure: false,
        */
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