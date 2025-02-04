class Image {
    constructor(src, alt, link) {
        this.src = src;
        this.alt = alt;
        this.link = link;
    }
}

class Noti {
    constructor(isShown, callback, title, content) {
        this.id = crypto.randomUUID();
        this.isShown = isShown;
        this.callback = callback;
        this.title = title;
        this.content = content;
    }
}

class ConversationHubMessage {
    //id;
    //creatorId;
    dto;
    //createdAt;
    //updatedAt;
    //status;
    //attachments;
    //reactions;

    constructor(dto) {
        this.dto = dto;
    }
}

export { Image, Noti, ConversationHubMessage }