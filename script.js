// A. تهيئة العناصر الأساسية في الصفحة
const employeeNameInput = document.getElementById('employeeName');
const passwordInput = document.getElementById('password');
const regionSelect = document.getElementById('region');
const citySelect = document.getElementById('city');
const exhibitionSelect = document.getElementById('exhibition');
const loginBtn = document.getElementById('loginBtn');
const adminLoginBtn = document.getElementById('adminLoginBtn');

// B. مسار الملف المحلي للموظفين
const employeesCsvPath = './AL MAJED 4 OUD.xlsx - الموظفين.csv';

let employeesData = []; // متغير لتخزين بيانات الموظفين بعد جلبها

// C. دالة لجلب البيانات من ملف CSV
async function fetchEmployeesData() {
    try {
        // نستخدم fetch لجلب الملف من المسار المحلي
        const response = await fetch(employeesCsvPath);
        const text = await response.text();
        const rows = text.split('\n').map(row => row.trim()).filter(row => row.length > 0);
        
        const headers = rows[0].split(',').map(header => header.trim());
        employeesData = rows.slice(1).map(row => {
            const values = row.split(',').map(value => value.trim());
            let employee = {};
            employee.exhibition = values[0];
            employee.city = values[1];
            employee.region = values[2];
            employee.name = values[3];
            employee.password = values[4];
            return employee;
        });

        populateDropdowns(employeesData);
    } catch (error) {
        console.error('خطأ في جلب بيانات الموظفين:', error);
        alert('حدث خطأ في جلب البيانات. يرجى التأكد من وجود ملف الموظفين في نفس المجلد.');
    }
}

// D. دالة لملء القوائم المنسدلة (لا يوجد تغيير هنا)
function populateDropdowns(data) {
    const uniqueRegions = [...new Set(data.map(emp => emp.region))];
    const uniqueCities = [...new Set(data.map(emp => emp.city))];
    const uniqueExhibitions = [...new Set(data.map(emp => emp.exhibition))];

    uniqueRegions.forEach(item => {
        const option = document.createElement('option');
        option.value = item;
        option.textContent = item;
        regionSelect.appendChild(option);
    });

    uniqueCities.forEach(item => {
        const option = document.createElement('option');
        option.value = item;
        option.textContent = item;
        citySelect.appendChild(option);
    });

    uniqueExhibitions.forEach(item => {
        const option = document.createElement('option');
        option.value = item;
        option.textContent = item;
        exhibitionSelect.appendChild(option);
    });
}

// E. دالة للتحقق من بيانات الموظف (لا يوجد تغيير هنا)
function checkEmployeeLogin() {
    const name = employeeNameInput.value.trim();
    const password = passwordInput.value.trim();
    const region = regionSelect.value;
    const city = citySelect.value;
    const exhibition = exhibitionSelect.value;

    const matchedEmployee = employeesData.find(emp => 
        emp.name === name && 
        emp.password === password && 
        emp.region === region && 
        emp.city === city && 
        emp.exhibition === exhibition
    );

    if (matchedEmployee) {
        alert('تم تسجيل الدخول بنجاح!');
        // يمكن هنا حفظ بيانات الموظف في الجلسة والانتقال إلى الصفحة الثانية
        // window.location.href = 'employee-dashboard.html'; 
    } else {
        alert('بيانات الدخول غير صحيحة. يرجى التحقق من جميع الحقول.');
    }
}

// F. دالة للتحقق من بيانات المشرف (لا يوجد تغيير هنا)
function checkAdminLogin() {
    const username = employeeNameInput.value.trim();
    const password = passwordInput.value.trim();

    if (username === 'admin' && password === '4455') {
        alert('تم تسجيل الدخول كـ مشرف!');
        // يمكن هنا الانتقال إلى صفحة المشرف
        // window.location.href = 'admin-dashboard.html';
    } else {
        alert('بيانات المشرف غير صحيحة.');
    }
}

// G. ربط الأزرار بالدوال (لا يوجد تغيير هنا)
loginBtn.addEventListener('click', checkEmployeeLogin);
adminLoginBtn.addEventListener('click', checkAdminLogin);

// H. البدء بجلب البيانات عند تحميل الصفحة (لا يوجد تغيير هنا)
fetchEmployeesData();