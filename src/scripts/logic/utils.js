// before making change to this, consider SingleSelectSurvey.setSurveyAndAnswers
export const calcSurveyResult = (survey, choices) => {
    let answerArr = [];
    let score = 0;

    let surveyRef = survey;
    surveyRef.questions.forEach((question, index) => {
        let choice = choices.find(choice => choice.mcqQuestionId == question.id);
        if (choice) {
            answerArr[index] = choice.mcqAnswerId;
            let answer = question.answers.find(answer => answer.id == choice.mcqAnswerId)
            score += answer.score;
        }
    });

    let maxScore = 0;

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

        if (band.maxScore > maxScore)
            maxScore = band.maxScore;
    }

    return {
        answers: answerArr,
        score: score,
        maxScore: maxScore,
        bands: matchingBands
    }
}