import { HubConnectionBuilder } from '@microsoft/signalr';
import { getUserBearerToken } from '@/scripts/api/services/authService';
import { CreateChatMessageDto, CreateReactionDto, UpdateChatMessageDto } from '../types/dtos';
export {
    HubConnection, MessagingHandler, RTCHandler,
    MESSAGE_TYPES, STREAM_EVENTS, ParticipantExtraInfo
}

class HubConnection {
    #connection;

    constructor() {
        var bearer = getUserBearerToken();
        //console.log(bearer);

        this.#connection = new HubConnectionBuilder().withUrl(
            import.meta.env.VITE_HUB_URL,
            //{ headers: { "ngrok-skip-browser-warning": "69420" } }
            { accessTokenFactory: () => bearer }
        ).build();
    }

    subscribe(eventName, callback) {
        this.#connection.on(eventName, callback);
    }

    start() {
        this.#connection.start();
    }

    getConnectionId() {
        window.con = this.#connection.connection;
        return this.#connection.connection.connectionId;
    }






    // Messaging
    createChatMessage = (message) =>
        this.#connection.invoke(MESSAGE_TYPES.CreateChatMessage.label, message);
    updateChatMessage = (message) =>
        this.#connection.invoke(MESSAGE_TYPES.UpdateChatMessage.label, message);
    deleteChatMessage = (message) =>
        this.#connection.invoke(MESSAGE_TYPES.DeleteChatMessage.label, message);
    createMessageReaction = (message) =>
        this.#connection.invoke(MESSAGE_TYPES.CreateMessageReaction.label, message);
    deleteMessageReaction = (message) =>
        this.#connection.invoke(MESSAGE_TYPES.DeleteMessageReaction.label, message);

    // Stream
    sendOffers = (offerMessages, isRenegotiation) =>
        this.#connection.invoke("SendOffers", offerMessages, isRenegotiation);
    sendAnswer = (offerer, answer) =>
        this.#connection.invoke("SendAnswer", offerer, JSON.stringify(answer));
    sendICECandidate = (receiver, candidate) =>
        this.#connection.invoke("SendICECandidate", receiver, JSON.stringify(candidate));
    joinRoom = (roomId, info) =>
        this.#connection.invoke("JoinRoom", roomId, info);
    sendRoom = (roomId, message) =>
        this.#connection.invoke("SendRoom", roomId, message);
    leaveRoom = (roomId) =>
        this.#connection.invoke("LeaveRoom", roomId);
}






class MessagingHandler {
    #hubConnection;

    constructor(hubConnection) {
        this.#hubConnection = hubConnection;

        // bind the method with #hubConnection to call it from outside
        this.addListener = this.addListener.bind(this);
        this.startListening = this.startListening.bind(this);

        this.createChatMessage = this.createChatMessage.bind(this);
        this.updateChatMessage = this.updateChatMessage.bind(this);
        this.deleteChatMessage = this.deleteChatMessage.bind(this);
        this.createMessageReaction = this.createMessageReaction.bind(this);
        this.deleteMessageReaction =this.deleteMessageReaction.bind(this);
    }

    addListener(event, handler) {
        let isValidEvent = Object.values(MESSAGE_TYPES).some(type => type.callback.toLowerCase() === event.toLowerCase());
        if (!isValidEvent)
            return;
        this.#hubConnection.subscribe(event, response => handler(response));
    }
    
    startListening() {
        this.#hubConnection.start();
    }

    createChatMessage(conversationMembers, conversationId, content/*, attachments*/) {
        this.#hubConnection.createChatMessage({
            conversationMembers: conversationMembers,
            callback: MESSAGE_TYPES.CreateChatMessage.callback,
            dto: JSON.stringify(new CreateChatMessageDto(conversationId, content, null))
        });
    }

    updateChatMessage(conversationMembers, messageId, content/*, attachments*/) {
        this.#hubConnection.updateChatMessage({
            conversationMembers: conversationMembers,
            callback: MESSAGE_TYPES.UpdateChatMessage.callback,
            dto: JSON.stringify(new UpdateChatMessageDto(messageId, content, 0, null, null))
        });
    }

    deleteChatMessage(conversationMembers, messageId) {
        this.#hubConnection.deleteChatMessage({
            conversationMembers: conversationMembers,
            callback: MESSAGE_TYPES.DeleteChatMessage.callback,
            dto: messageId
        });
    }

    createMessageReaction(conversationMembers, messageId, reactionUnicode) {
        console.log(new CreateReactionDto(messageId, reactionUnicode));
        this.#hubConnection.createMessageReaction({
            conversationMembers: conversationMembers,
            callback: MESSAGE_TYPES.CreateMessageReaction.callback,
            dto: JSON.stringify(new CreateReactionDto(messageId, reactionUnicode))
        });
    }

    deleteMessageReaction(conversationMembers, reactionId) {
        console.log(reactionId);
        this.#hubConnection.deleteMessageReaction({
            conversationMembers: conversationMembers,
            callback: MESSAGE_TYPES.DeleteMessageReaction.callback,
            dto: reactionId
        });
    }
}






class RTCHandler {
    #hubConnection;
    #rtcPeerConnections = {};           // by connectionId

    //firefox suggest use 2
    #rtcConfiguration = {
        iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' }
        ]
    }



    constructor(hubConnection) {
        this.#hubConnection = hubConnection;



        this.#hubConnection.subscribe(STREAM_EVENTS.OfferReceived, (offerer, offer, isRenegotiation) => {
            this.onOfferReceived(offerer, offer, isRenegotiation);
        })
        this.#hubConnection.subscribe(STREAM_EVENTS.AnswerReceived, (answerer, answer) => {
            this.onAnswerReceived(answerer, answer);
        });
        this.#hubConnection.subscribe(STREAM_EVENTS.ICECandidateReceived, (peer, candidate) => {
            this.onICECandidateReceived(peer, candidate);
        });



        this.#hubConnection.subscribe(STREAM_EVENTS.RoomCreated, (roomId) => {
            this.onRoomCreated(roomId);
        });
        this.#hubConnection.subscribe(STREAM_EVENTS.RoomInfoReceived, (roomInfo) => {
            this.onRoomInfoReceived(roomInfo);
        })
        this.#hubConnection.subscribe(STREAM_EVENTS.RoomJoined, (roomId, participant) => {
            this.onRoomJoined(roomId, participant);
        });
        this.#hubConnection.subscribe(STREAM_EVENTS.ParticipantLeft, (roomId, connectionId) => {
            this.onParticipantLeft(roomId, connectionId);
        });
        this.#hubConnection.subscribe(STREAM_EVENTS.RoomMessageReceived, (roomId, connectionId, message) => {
            this.onRoomMessageReceived(roomId, connectionId, message);
        });



        window.onbeforeunload = () => {
            for (let peer in this.#rtcPeerConnections)
                this.#rtcPeerConnections[peer].close();
        }
        this.#hubConnection.start();
    }

    // these methods (events) should be overriden
    onConversationMessageReceived = (conversationId, connectionId, message) => { }

    onOfferReceived = (offerer, offer, isRenegotiation) => { }
    onAnswerReceived = (answerer, answer) => { }
    onICECandidateReceived = (peer, candidate) => { }
    onRoomCreated = (roomId) => { }
    onRoomInfoReceived = (roomInfo) => { }
    onRoomJoined = (roomId, participant) => { }
    onRoomMessageReceived = (roomId, connectionId, message) => { }
    onParticipantLeft = (roomId, connectionId) => { }



    setupRTCPeerConnection = (peer) => {
        let connection = new RTCPeerConnection(this.#rtcConfiguration);

        connection.ontrack = (trackEvent) => {
            this.onRTCTrack(peer, trackEvent);
        }
        connection.onicecandidate = (event) => {
            if (event.candidate) {
                console.log("new candidate");
                this.#hubConnection.sendICECandidate(peer, event.candidate);
            }
        }

        this.#rtcPeerConnections[peer] = connection;
    }
    setupRTCPeerConnections = (peers) => {
        for (let peer of peers)
            this.setupRTCPeerConnection(peer);
    }
    setupRTCStream = (peers, stream) => {
        stream.getTracks().forEach((track) => {
            for (let peer of peers)
                this.#rtcPeerConnections[peer].addTrack(track, stream);
        });
    }
    setupRTCTransceiver = (peers) => {
        for (let peer of peers)
            this.#rtcPeerConnections[peer].addTransceiver('audio', { direction: 'recvonly' });
    }
    createAndSendOffers = async (peers, isRenegotiation) => {
        // offers are sent from the new participant
        let offerMessages = [];

        for (let peer of peers) {
            let connection = this.#rtcPeerConnections[peer];
            let offer = await connection.createOffer();
            connection.setLocalDescription(offer);
            offerMessages.push(new OfferMessage(JSON.stringify(offer), peer));
        }
        this.#hubConnection.sendOffers(offerMessages, isRenegotiation);
    }
    answer = async (peer, offer) => {
        this.setRemoteDescription(peer, offer);
        let connection = this.#rtcPeerConnections[peer];
        let sdpAnswer = await connection.createAnswer();
        connection.setLocalDescription(sdpAnswer);
        this.#hubConnection.sendAnswer(peer, sdpAnswer);
    }
    setRemoteDescription = (peer, description) => {
        this.#rtcPeerConnections[peer].setRemoteDescription(new RTCSessionDescription(description));
    }
    addIceCandidate = (peer, candidate) => {
        this.#rtcPeerConnections[peer].addIceCandidate(new RTCIceCandidate(JSON.parse(candidate)));
    }
    renegotiate = (peers, newStream) => {
        this.setupRTCStream(peers, newStream);
        this.createAndSendOffers(peers, true);
    }
    // Override this
    onRTCTrack = (peerId, trackEvent) => { }



    joinRoom = (roomId, info) => {
        this.#hubConnection.joinRoom(roomId, info);
    }
    leaveRoom = (roomId) => {
        this.#hubConnection.leaveRoom(roomId);
    }



    // message: chatHandler.ChatMessage
    sendRoomChatMessage = (roomId, message) => {
        this.#hubConnection.sendRoom(roomId, new StreamMessage(STREAM_EVENTS.RoomMessageReceived, message));
    }
    sendRoomVideoOff = (roomId) => {
        this.#hubConnection.sendRoom(roomId, new StreamMessage(STREAM_EVENTS.VideoOff, null));
    }



    getConnectionId = () => {
        return this.#hubConnection.getConnectionId();
    }
    removeConnection = (peer) => {
        delete this.#rtcPeerConnections[peer];
    }
}






// Enums for message types
const MESSAGE_TYPES = Object.freeze({
    CreateConversation: { value: 0, label: 'CreateConversation', callback: '' },
    UpdateConversation: { value: 1, label: 'UpdateConversation', callback: '' },

    CreateChatMessage: { value: 2, label: 'CreateChatMessage', callback: 'ChatMessageCreated' },
    UpdateChatMessage: { value: 3, label: 'UpdateChatMessage', callback: 'ChatMessageUpdated' },
    DeleteChatMessage: { value: 4, label: 'DeleteChatMessage', callback: 'ChatMessageDeleted' },
    
    CreateMessageReaction: { value: 5, label: 'CreateMessageReaction', callback: 'MessageReactionCreated' },
    DeleteMessageReaction: { value: 6, label: 'DeleteMessageReaction', callback: 'MessageReactionDeleted' }
});

const STREAM_EVENTS = {
    RoomCreated: "RoomCreated",
    RoomInfoReceived: "RoomInfoReceived",
    RoomJoined: "RoomJoined",
    ParticipantLeft: "ParticipantLeft",

    OfferReceived: "OfferReceived",
    AnswerReceived: "AnswerReceived",
    ICECandidateReceived: "ICECandidateReceived",

    RoomMessageReceived: "RoomMessageReceived",
    VideoOff: "VideoOff"
}

class ParticipantExtraInfo {
    constructor(fullName, avatar) {
        this.fullName = fullName;
        this.avatar = avatar;
    }
}

class StreamMessage {
    constructor(event, data) {
        this.event = event;
        this.data = data;
    }
}

class OfferMessage {
    constructor(offer, peer) {
        this.offer = offer;
        this.peer = peer;
    }
}