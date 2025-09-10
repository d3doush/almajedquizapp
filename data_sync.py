from flask import Blueprint, jsonify, request
from src.models.employee import Employee, Question, Score, db
from src.services.google_sheets import MockGoogleSheetsService
from datetime import datetime

data_sync_bp = Blueprint('data_sync', __name__)

# Initialize Google Sheets service (using mock for demo)
sheets_service = MockGoogleSheetsService()
sheets_service.authenticate()

@data_sync_bp.route('/sync-from-sheets', methods=['POST'])
def sync_from_sheets():
    """Sync data from Google Sheets to local database"""
    try:
        # Sync staff data
        staff_data = sheets_service.read_sheet_data('staff')
        if staff_data and len(staff_data) > 1:  # Skip header row
            # Clear existing staff data
            Employee.query.delete()
            
            for row in staff_data[1:]:  # Skip header
                if len(row) >= 5:
                    employee = Employee(
                        region=row[0],
                        city=row[1],
                        store=row[2],
                        name=row[3],
                        password=row[4]
                    )
                    db.session.add(employee)
        
        # Sync training questions
        training_data = sheets_service.read_sheet_data('تدريباتي')
        if training_data and len(training_data) > 1:  # Skip header row
            # Clear existing questions
            Question.query.delete()
            
            for row in training_data[1:]:  # Skip header
                if len(row) >= 7:
                    question = Question(
                        perfume_name=row[0],
                        question=row[1],
                        answer1=row[2],
                        answer2=row[3],
                        answer3=row[4],
                        answer4=row[5],
                        correct_answer=row[6]
                    )
                    db.session.add(question)
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'تم مزامنة البيانات بنجاح'
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': f'حدث خطأ في المزامنة: {str(e)}'
        }), 500

@data_sync_bp.route('/sync-to-sheets', methods=['POST'])
def sync_to_sheets():
    """Sync scores from local database to Google Sheets"""
    try:
        # Get all scores
        scores = Score.query.all()
        
        # Prepare data for sheets
        scores_data = []
        for score in scores:
            scores_data.append([
                score.date.isoformat(),
                score.employee_name,
                score.store_name,
                score.score
            ])
        
        # Write to sheets (append new data)
        if scores_data:
            sheets_service.append_sheet_data('علامتي', scores_data)
        
        return jsonify({
            'success': True,
            'message': 'تم رفع النتائج إلى Google Sheets بنجاح'
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'حدث خطأ في رفع البيانات: {str(e)}'
        }), 500

@data_sync_bp.route('/load-sample-data', methods=['POST'])
def load_sample_data():
    """Load sample data for testing"""
    try:
        # Clear existing data
        Employee.query.delete()
        Question.query.delete()
        
        # Add sample employees
        employees = [
            Employee(region='الرياض', city='الرياض', store='معرض النخيل', name='أحمد محمد', password='123456'),
            Employee(region='جدة', city='جدة', store='معرض البحر', name='فاطمة أحمد', password='654321'),
            Employee(region='الدمام', city='الدمام', store='معرض الخليج', name='محمد علي', password='789012'),
        ]
        
        for emp in employees:
            db.session.add(emp)
        
        # Add sample questions
        questions = [
            Question(
                perfume_name='عود ملكي',
                question='ما هي المكونات الأساسية لهذا العطر؟',
                answer1='العود والورد',
                answer2='الياسمين والعنبر',
                answer3='المسك والصندل',
                answer4='الفانيليا والبرغموت',
                correct_answer='C'
            ),
            Question(
                perfume_name='عطر الليل',
                question='متى يُفضل استخدام هذا العطر؟',
                answer1='في الصباح',
                answer2='في المساء',
                answer3='في الظهيرة',
                answer4='في أي وقت',
                correct_answer='D'
            ),
            Question(
                perfume_name='ورد جوري',
                question='ما هو الطابع الأساسي لهذا العطر؟',
                answer1='حار ومتبل',
                answer2='منعش وحمضي',
                answer3='زهري ورومانسي',
                answer4='خشبي وترابي',
                correct_answer='E'
            ),
            Question(
                perfume_name='مسك الليل',
                question='ما هي أفضل مناسبة لاستخدام هذا العطر؟',
                answer1='العمل اليومي',
                answer2='المناسبات الرسمية',
                answer3='الرياضة',
                answer4='النوم',
                correct_answer='D'
            ),
            Question(
                perfume_name='عنبر ذهبي',
                question='ما هي الفئة العمرية المناسبة لهذا العطر؟',
                answer1='المراهقون',
                answer2='الشباب',
                answer3='متوسطي العمر',
                answer4='جميع الأعمار',
                correct_answer='F'
            ),
            Question(
                perfume_name='صندل هندي',
                question='ما هو موسم استخدام هذا العطر؟',
                answer1='الصيف',
                answer2='الشتاء',
                answer3='الربيع',
                answer4='جميع المواسم',
                correct_answer='D'
            ),
            Question(
                perfume_name='ياسمين شامي',
                question='ما هي شدة هذا العطر؟',
                answer1='خفيف جداً',
                answer2='متوسط',
                answer3='قوي',
                answer4='قوي جداً',
                correct_answer='D'
            ),
            Question(
                perfume_name='عود كمبودي',
                question='ما هو أصل هذا العطر؟',
                answer1='عربي',
                answer2='فرنسي',
                answer3='آسيوي',
                answer4='أمريكي',
                correct_answer='E'
            ),
            Question(
                perfume_name='روز بلغاري',
                question='ما هي الملاحظة الأساسية في هذا العطر؟',
                answer1='الفواكه',
                answer2='الورود',
                answer3='الأخشاب',
                answer4='التوابل',
                correct_answer='D'
            ),
            Question(
                perfume_name='لافندر فرنسي',
                question='ما هو التأثير النفسي لهذا العطر؟',
                answer1='منشط',
                answer2='مهدئ',
                answer3='محفز',
                answer4='محايد',
                correct_answer='D'
            ),
            Question(
                perfume_name='فانيليا مدغشقر',
                question='ما هي الفئة التي يناسبها هذا العطر أكثر؟',
                answer1='الرجال فقط',
                answer2='النساء فقط',
                answer3='الأطفال',
                answer4='الجميع',
                correct_answer='F'
            ),
            Question(
                perfume_name='برغموت إيطالي',
                question='ما هو وقت ثبات هذا العطر؟',
                answer1='ساعة واحدة',
                answer2='3-4 ساعات',
                answer3='6-8 ساعات',
                answer4='أكثر من 12 ساعة',
                correct_answer='E'
            )
        ]
        
        for q in questions:
            db.session.add(q)
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'تم تحميل البيانات التجريبية بنجاح'
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': f'حدث خطأ في تحميل البيانات: {str(e)}'
        }), 500

