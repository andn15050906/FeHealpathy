export { ChatMessage/*, ChatHandler*/ }

// not ChatMessageDTO
class ChatMessage {
    //id;
    //senderId;
    creatorId;
    content;
    createdAt;
    //updatedAt;
    //status;
    attachments;
    //reactions;

    constructor(content, attachments) {
        this.content = content;
        this.attachments = attachments;
    }

    setCreationData(creatorId) {
        this.creatorId = creatorId;
        this.createdAt = new Date().toLocaleString();;
    }
}