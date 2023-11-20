let currentQuestionIndex = 0;
  let questions = []; // This will be populated with fetched quiz details
  let userResponses = []; // Array to store user responses

  document.getElementById('start-button').addEventListener('click', function() {
    fetchQuizDetails(2); // Assuming '2' is the quizId
  });

  function fetchQuizDetails(quizId) {
    document.getElementById('start-button').textContent = 'Loading...';
    document.getElementById('start-button').disabled = true;
    fetch('https://lara.com/api/get-quiz-details', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ quizId: quizId })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        console.log('Quiz Details:', data);
        // Assuming 'questions' is defined globally or in a higher scope
        questions = data.map(q => ({
          questionText: q.question_text,
          answerOptions: q.options.map(option => ({
            answerText: option.option_text,
            optionId: option.option_id
          }))
        }));

        const startButton = document.getElementById('start-button');
        startButton.textContent = 'Start Quiz';
        startButton.disabled = false;
      })
    .catch(error => {
        console.error('Error fetching quiz details:', error);
    });// Fetch request and processing logic here
  }

  // The rest of your quiz functions here
  function startQuiz() {
    currentQuestionIndex = 0;
    userResponses = []; // Reset responses for a new quiz

    document.getElementById('results-container').style.display = 'none';
    showQuestion();

    document.getElementById('start-button').style.display = 'none';
    document.getElementById('question-container').style.display = 'block';
    document.getElementById('quiz-container').style.display = 'block';



  }
  function showQuestion() {
    const question = questions[currentQuestionIndex];
    document.getElementById('question').textContent = question.questionText;
    const answersHtml = question.answerOptions.map(option =>
      `<li><button onclick="selectAnswer(${option.optionId})">${option.answerText}</button></li>`
    ).join('');
    document.getElementById('answer-options').innerHTML = answersHtml;

  }

  function selectAnswer(optionId) {
    const questionId = questions[currentQuestionIndex].questionId;
    userResponses.push({ question_id: questionId, answers: [optionId] });
    // Clear previous selections
    const buttons = document.querySelectorAll('.answer-options li button');
    buttons.forEach(button => {
        button.classList.remove('selected');
    });

    // Highlight the selected button
    event.target.classList.add('selected');

    console.log('Selected Option ID:', optionId);
    // Add a delay before moving to the next question
    // setTimeout(() => {
    //     nextQuestion();
    // }, 1000); // 1 second delay
}

  function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
      showQuestion();
    } else {
      endQuiz();
    }
  }

  function endQuiz() {
    submitQuizResults();

    document.getElementById('quiz-container').style.display = 'none';
    document.getElementById('results-container').style.display = 'block';
    // Display results
    document.getElementById('results').textContent = 'Quiz completed!'; // Placeholder text
  }
  function submitQuizResults() {
    const quizId = 2; // Replace with actual quiz ID
    fetch('https://lara.com/api/quiz/submit-results', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ quizId: quizId, result: userResponses })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        console.log('Quiz submission successful:', data);
        document.getElementById('results').textContent = 'Recommendations received!';
        // Process the recommendations here
    })
    .catch(error => {
        console.error('Error submitting quiz results:', error);
    });
}

  // Start the quiz
  fetchQuizDetails(2);
  // More functions like showQuestion, selectAnswer, nextQuestion, and endQuiz
  const handleSelectProduct = (ruleId, selectedProductIds) => {
  
  };
