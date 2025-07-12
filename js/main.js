async function loadQuestions(page = 1) {
    try {
        const search = document.getElementById('search').value;
        const data = await questionService.getAllQuestions(page, currentFilter, search);
        
        renderQuestions(data.questions);
        renderPagination(data.totalPages);
    } catch (error) {
        console.error('Error:', error);
        // Show error message to user
        const list = document.getElementById('question-list');
        list.innerHTML = `
            <div class="text-center py-12">
                <div class="text-6xl mb-4">😕</div>
                <h3 class="text-2xl font-bold mb-2" style="color: var(--beige-800);">
                    Error loading questions
                </h3>
                <p style="color: var(--beige-600);">
                    ${error.response?.data?.message || 'Please try again later'}
                </p>
            </div>
        `;
    }
}