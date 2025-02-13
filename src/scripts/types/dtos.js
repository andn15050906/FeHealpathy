import { isArrayOfType } from "../logic/validation";


// Base
export class CreateMediaDto {
    constructor(url, file, title) {
        this.Url = url;
        this.File = file;
        this.Title = title;
    }
}

export class CreateReactionDto {
    constructor(sourceId, content) {
        this.SourceId = sourceId;
        this.Content = content;
    }
}

// User
class UpdatePreferenceDto {
    // public Guid SourceId { get; set; }
    // public List<Guid> PreferenceValueIds { get; set; }
}






// McqQuestion
class CreateMcqAnswerDto {
    //public string Content { get; set; }
}

class CreateMcqQuestionDto {
    /*public Guid SurveyId { get; set; }

    public string Content { get; set; }
    public string Explanation { get; set; }

    public List<CreateMcqAnswerDto> Answers { get; set; }*/
}

/*class QueryMcqQuestionDto : PagingQueryDto
{
    public Guid SurveyId { get; set; }
}*/





// Survey
class CreateSurveyDto {
    //public string Name { get; set; }
    //public string Description { get; set; }
    //public List<CreateMcqQuestionDto> Questions { get; set; }
}

class QuerySurveyDto {
    //public string? Name { get; set; } 
}

class UpdateSurveyDto {
    /*
        public Guid Id { get; set; }
    
        public string? Name { get; set; }
        public string? Description { get; set; }
    
        public List<CreateMcqQuestionDto>? AddedQuestions { get; set; }
        public List<Guid>? RemovedQuestions { get; set; } */
}

// Submission
export class CreateMcqChoiceDto {
    constructor(mcqQuestionId, mcqAnswerId) {
        this.mcqQuestionId = mcqQuestionId;
        this.mcqAnswerId = mcqAnswerId;
    }
}

export class CreateSubmissionDto {
    constructor(surveyId, choices) {
        this.surveyId = surveyId;

        let isNotArrayError = !isArrayOfType(choices, CreateMcqChoiceDto);
        if (isNotArrayError)
            throw new Error(isNotArrayError)
        this.choices = choices;
    }
}

class QuerySubmissionDto {
    //CreatorId
    //SurveyId
}

// ChatMessage
export class CreateChatMessageDto {
    constructor(conversationId, content, medias) {
        this.ConversationId = conversationId;
        this.Content = content;

        if (medias) {
            let isNotArrayError = !isArrayOfType(medias, CreateMediaDto);
            if (isNotArrayError)
                throw new Error(isNotArrayError)
            this.Medias = medias;
        }
    }
}

export class UpdateChatMessageDto {
    constructor(id, content, status, addedMedias, removedMedias) {
        this.Id = id;
        this.Content = content;
        this.Status = status;

        if (addedMedias) {
            let isNotArrayError = !isArrayOfType(addedMedias, CreateMediaDto);
            if (isNotArrayError)
                throw new Error(isNotArrayError)
            this.AddedMedias = addedMedias;
        }
        //...
        this.RemovedMedias = removedMedias;
    }
}