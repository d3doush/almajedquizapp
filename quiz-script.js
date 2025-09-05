// B. مسار ملف الأسئلة المحلي
const questionsCsvPath = './AL MAJED 4 OUD.xlsx - الأسئلة.csv';

// تهيئة العناصر الأساسية في الصفحة
const quizQuestionsDiv = document.getElementById('quiz-questions');
const submitQuizBtn = document.getElementById('submitQuizBtn');

let questionsData = [];      // لتخزين كل الأسئلة
let selectedQuestions = [];  // لتخزين الـ 10 أسئلة العشوائية
let userAnswers = {};        // لتخزين إجابات المستخدم

// A. دالة لجلب البيانات من ملف CSV وتحضير الأسئلة
async function fetchQuestionsData() {
    try {
        const response = await fetch(questionsCsvPath);
        const text = await response.text();
        const rows = text.split('\n').map(row => row.trim()).filter(row => row.length > 0);
        
        const headers = rows[0].split(',').map(header => header.trim());
        questionsData = rows.slice(1).map(row => {
            const values = row.split(',').map(value => value.trim());
            let question = {};
            question.perfume = values[0];
            question.questionText = values[1];
            question.option1 = values[2];
            question.option2 = values[3];
            question.option3 = values[4];
            question.correctAnswer = values[5];
            return question;
        });

        selectRandomQuestions(10);
    } catch (error) {
        console.error('خطأ في جلب بيانات الأسئلة:', error);
        quizQuestionsDiv.innerHTML = '<p>حدث خطأ في تحميل الأسئلة. يرجى المحاولة مرة أخرى لاحقاً.</p>';
    }
}

// B. دالة لاختيار عدد معين من الأسئلة بشكل عشوائي
function selectRandomQuestions(num) {
    // خلط ترتيب الأسئلة
    const shuffled = [...questionsData].sort(() => 0.5 - Math.random());
    // اختيار أول عدد محدد من الأسئلة
    selectedQuestions = shuffled.slice(0, num);
    
    displayQuestions();
}

// C. دالة لعرض الأسئلة على الصفحة
function displayQuestions() {
    quizQuestionsDiv.innerHTML = ''; // تفريغ المحتوى القديم
    selectedQuestions.forEach((question, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.classList.add('question');
        questionDiv.innerHTML = `
            <h4>${index + 1}. ${question.questionText}</h4>
            <div class="options">
                <button class="option-btn" data-answer="C">${question.option1}</button>
                <button class="option-btn" data-answer="D">${question.option2}</button>
                <button class="option-btn" data-answer="E">${question.option3}</button>
            </div>
        `;
        quizQuestionsDiv.appendChild(questionDiv);
    });

    submitQuizBtn.style.display = 'block'; // إظهار زر الإنهاء
    
    // إضافة مستمعي الأحداث لأزرار الخيارات
    document.querySelectorAll('.option-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            handleAnswer(event.target);
        });
    });
}

// D. دالة للتعامل مع الإجابات
function handleAnswer(button) {
    const questionContainer = button.closest('.question');
    const questionIndex = Array.from(questionContainer.parentNode.children).indexOf(questionContainer);
    const selectedAnswer = button.dataset.answer;

    // حفظ إجابة المستخدم
    userAnswers[questionIndex] = selectedAnswer;

    // تمييز الزر المختار وتعطيل الأزرار الأخرى للسؤال نفسه
    questionContainer.querySelectorAll('.option-btn').forEach(btn => {
        btn.disabled = true;
        btn.classList.remove('selected');
    });
    button.classList.add('selected');
}

// E. دالة لحساب النتيجة النهائية
function calculateScore() {
    let score = 0;
    selectedQuestions.forEach((question, index) => {
        if (userAnswers[index] === question.correctAnswer) {
            score++;
        }
    });

    alert(`لقد أنهيت الاختبار! نتيجتك هي: ${score} من 10.`);
    // هنا يمكن حفظ النتيجة في قاعدة بيانات Firebase
    // window.location.href = 'employee-dashboard.html';
}

// F. ربط زر الإنهاء بالدالة
submitQuizBtn.addEventListener('click', calculateScore);

// G. البدء بجلب الأسئلة عند تحميل الصفحة
fetchQuestionsData();