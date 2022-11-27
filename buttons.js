function submitQuizAnswer(quizNum, correct) {
    const incorrectAnswerFeedback = document.querySelector(`#quiz_${quizNum}_wrongAnswer`);
    const correctAnswerFeedback = document.querySelector(`#quiz_${quizNum}_rightAnswer`);
    const quizOneButtons = document.querySelectorAll(`.quiz_${quizNum}_buttons`);

    if (correct) {
        correctAnswerFeedback?.classList.add('visible');
        const previousImage = document.querySelector(`#quiz_${quizNum}_img_v1`);
        previousImage.src = `images/${quizNum}_v2.png`;
        incorrectAnswerFeedback?.classList.remove('visible')
        
        quizOneButtons.forEach(button => {
            button.classList.add('hidden');
        });
    } else {
        correctAnswerFeedback?.classList.remove('visible');
        incorrectAnswerFeedback?.classList.add('visible');
    }
}
