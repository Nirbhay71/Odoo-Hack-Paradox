const questionService = {
    // Get all questions with optional filters
    async getAllQuestions(page = 1, filter = 'newest', search = '') {
        try {
            const response = await axios.get('${CONFIG.API_URL}'/questions, {
                params: { page, filter, search }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching questions:', error);
            throw error;
        }
    },

    // Create new question
    async createQuestion(questionData) {
        try {
            const response = await axios.post('${CONFIG.API_URL}/questions, questionData');
            return response.data;
        } catch (error) {
            console.error('Error creating question:', error);
            throw error;
        }
    },

    // Upload image
    async uploadImage(file) {
        try {
            const formData = new FormData();
            formData.append('image', file);

            const response = await axios.post('${CONFIG.API_URL}'/upload, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error uploading image:', error);
            throw error;
        }
    }

    
};

const answerService = {
    // Post an answer to a question
    async createAnswer(questionId, content) {
        try {
            const response = await axios.post('${CONFIG.API_URL}/answers/${questionId}, { content }');
            return response.data;
        } catch (error) {
            console.error('Error posting answer:', error);
            throw error;
        }
    }
};