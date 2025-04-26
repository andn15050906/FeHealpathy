// before making change to this, consider SingleSelectSurvey.setSurveyAndAnswers
export const calcSurveyResult = (survey, choices) => {
    let answerArr = [];
    let score = 0;
    let maxScore = 0;

    let surveyRef = survey;
    surveyRef.questions.forEach((question, index) => {
        let choice = choices.find(choice => choice.mcqQuestionId == question.id);
        if (choice) {
            answerArr[index] = choice.mcqAnswerId;
            let answer = question.answers.find(answer => answer.id == choice.mcqAnswerId);
            score += answer.score;
            let questionMaxScore = question.answers.map(_ => _.score).reduce((a, b) => Math.max(a, b), -Infinity);
            maxScore += questionMaxScore;
            console.log(questionMaxScore);
        }
    });


    let matchingBands = [];
    for (let band of surveyRef.bands) {
        if (band.minScore <= score && band.maxScore >= score) {
            if (['normal', 'mild'].includes(band.bandRating.toLowerCase())) {
                matchingBands.push({
                    name: band.bandName,
                    rating: 'Tốt',
                    ratingClass: 'good'
                });
            }
            else if (['moderate'].includes(band.bandRating.toLowerCase())) {
                matchingBands.push({
                    name: band.bandName,
                    rating: 'Trung bình',
                    ratingClass: 'average'
                });
            }
            else if (['severe', 'examplely severe'].includes(band.bandRating.toLowerCase())) {
                matchingBands.push({
                    name: band.bandName,
                    rating: 'Tệ',
                    ratingClass: 'bad'
                });
            }
        }
    }

    for (let band of surveyRef.bands) {
        let existingBand = matchingBands.find(_ => _.name == band.bandName);
        if (!existingBand) {
            matchingBands.push({
                name: band.bandName,
                rating: 'Tệ',
                ratingClass: 'bad'
            });
        }
    }

    var result = {
        answers: answerArr,
        score: score,
        maxScore: maxScore,
        bands: matchingBands
    }
    return result;
}