// Base

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
class CreateMcqChoiceDto {
    constructor(mcqQuestionId, mcqAnswerId) {
        this.mcqQuestionId = mcqQuestionId;
        this.mcqAnswerId = mcqAnswerId;
    }
}

class CreateSubmissionDto {
    constructor(surveyId, choices) {
        this.surveyId = surveyId;
        this.choices = choices;
    }
}

class QuerySubmissionDto {
    //CreatorId
    //SurveyId
}

export { CreateMcqChoiceDto, CreateSubmissionDto }