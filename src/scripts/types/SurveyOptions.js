class SurveyOptions {
    constructor(survey, title, switchCallback, submitCallback, isReadOnly, isTransparentStyle) {
        this.survey = survey;
        this.title = title;
        this.switchCallback = switchCallback;
        this.submitCallback = submitCallback;
        this.isReadOnly = isReadOnly;
        this.isTransparentStyle = isTransparentStyle;
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