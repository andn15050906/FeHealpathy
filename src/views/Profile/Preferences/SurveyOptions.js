class SurveyOptions {
    constructor(survey, title, switchCallback, submitCallback) {
        this.survey = survey;
        this.title = title;
        this.switchCallback = switchCallback;
        this.submitCallback = submitCallback;
    }
}

/*class SurveyOptions {
    survey: Object;
    title: String;
    switchCallback: Function;
    submitCallback: Function;

    constructor(survey: Object, title: String, switchCallback: Function, submitCallback: Function) {
        this.survey = survey;
        this.title = title;
        this.switchCallback = switchCallback;
        this.submitCallback = submitCallback;
    }
}*/

export { SurveyOptions }