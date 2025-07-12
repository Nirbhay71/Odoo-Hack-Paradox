async function testEndpoints() {
    const API_URL = 'http://localhost:5000/api';

    // Function to make API calls
    async function makeRequest(url, method = 'GET', body = null) {
        try {
            const options = {
                method,
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            if (body) {
                options.body = JSON.stringify(body);
            }

            const response = await fetch(API_URL + url, options);
            const data = await response.json();

            return {
                status: response.status,
                data: data
            };
        } catch (error) {
            return {
                status: 'error',
                error: error.message
            };
        }
    }

    // Test GET /questions
    console.log('Testing GET /questions');
    const getQuestions = await makeRequest('/questions');
    console.log('Status:', getQuestions.status);
    console.log('Response:', getQuestions.data);
    console.log('------------------------');

    // Test POST /questions
    console.log('Testing POST /questions');
    const newQuestion = {
        title: "Test Question",
        description: "This is a test question",
        tags: ["test", "api"]
    };
    const postQuestion = await makeRequest('/questions', 'POST', newQuestion);
    console.log('Status:', postQuestion.status);
    console.log('Response:', postQuestion.data);
    console.log('------------------------');

    // Test GET single question
    if (postQuestion.data && postQuestion.data._id) {
        console.log('Testing GET /questions/${postQuestion.data._id}');
        const getOneQuestion = await makeRequest('/questions/${postQuestion.data._id}');
        console.log('Status:', getOneQuestion.status);
        console.log('Response:', getOneQuestion.data);
        console.log('------------------------');
    }

    // Test POST /answers
    if (postQuestion.data && postQuestion.data._id) {
        console.log('Testing POST /answers/${postQuestion.data._id}');
        const newAnswer = {
            content: "This is a test answer"
        };
        const postAnswer = await makeRequest('/answers/${postQuestion.data._id}', 'POST', newAnswer);
        console.log('Status:', postAnswer.status);
        console.log('Response:', postAnswer.data);
        console.log('------------------------');
    }
}

testEndpoints();