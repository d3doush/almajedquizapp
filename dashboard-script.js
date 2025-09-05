// A. تهيئة العناصر الأساسية في الصفحة
const welcomeMessage = document.getElementById('welcomeMessage');
const rankingResultsDiv = document.getElementById('rankingResults');
const rankingViewSelect = document.getElementById('rankingView');
const viewRankingBtn = document.getElementById('viewRankingBtn');
const startQuizBtn = document.getElementById('startQuizBtn');

// B. دالة لجلب بيانات الموظف المسجل دخوله
function getLoggedInUser() {
    // هنا يمكننا جلب بيانات الموظف من sessionStorage
    // const user = JSON.parse(sessionStorage.getItem('loggedInUser'));
    // return user;

    // أو لأغراض الاختبار، يمكن استخدام كائن افتراضي
    return { name: 'محمود', exhibition: 'النخيل مول', city: 'الدمام', region: 'الشرقية' };
}

// C. دالة لعرض رسالة الترحيب
function displayWelcomeMessage() {
    const user = getLoggedInUser();
    if (user && user.name) {
        welcomeMessage.textContent = `أهلاً بك، ${user.name}!`;
    }
}

// D. دالة لعرض الترتيب (ستُضاف لاحقًا)
function displayRanking() {
    const view = rankingViewSelect.value;
    const user = getLoggedInUser();

    // هنا سيتم إضافة المنطق الخاص بجلب النتائج من Firebase
    // و حساب الترتيب بناءً على خيار العرض المحدد
    rankingResultsDiv.innerHTML = `<p>يتم الآن حساب ترتيبك ضمن ${view}...</p>`;

    // مثال بسيط للنتائج (يجب استبداله بكود حقيقي)
    setTimeout(() => {
        rankingResultsDiv.innerHTML = `<p>ترتيبك ضمن **${view}** هو: <strong>#5 من 20</strong></p>`;
    }, 1000);
}

// E. ربط الأزرار بالدوال
viewRankingBtn.addEventListener('click', displayRanking);
startQuizBtn.addEventListener('click', () => {
    // الانتقال إلى صفحة الأسئلة
    window.location.href = 'quiz-page.html';
});

// F. تشغيل الدوال عند تحميل الصفحة
displayWelcomeMessage();
displayRanking(); // عرض الترتيب الافتراضي عند تحميل الصفحة