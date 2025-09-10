from flask import Blueprint, jsonify, request, session
from src.models.employee import Question, Score, DailyProgress, db
from datetime import datetime, date
import random

training_bp = Blueprint('training', __name__)

@training_bp.route('/daily-questions', methods=['GET'])
def get_daily_questions():
    if 'user_type' not in session or session['user_type'] != 'employee':
        return jsonify({'success': False, 'message': 'غير مصرح لك بالوصول'}), 401
    
    employee_name = session['employee_name']
    today = date.today()
    
    # Get or create daily progress
    daily_progress = DailyProgress.query.filter_by(
        employee_name=employee_name,
        date=today
    ).first()
    
    if not daily_progress:
        daily_progress = DailyProgress(
            employee_name=employee_name,
            date=today,
            questions_answered=0,
            answered_question_ids=''
        )
        db.session.add(daily_progress)
        db.session.commit()
    
    # Check if employee has already answered 10 questions today
    if daily_progress.questions_answered >= 10:
        return jsonify({
            'success': False,
            'message': 'لقد أجبت على 10 أسئلة اليوم. يمكنك المحاولة غداً.',
            'questions_answered': daily_progress.questions_answered
        })
    
    # Get answered question IDs
    answered_ids = []
    if daily_progress.answered_question_ids:
        answered_ids = [int(id) for id in daily_progress.answered_question_ids.split(',') if id]
    
    # Get all questions
    all_questions = Question.query.all()
    
    if not all_questions:
        return jsonify({
            'success': False,
            'message': 'لا توجد أسئلة متاحة'
        })
    
    # Filter out answered questions
    available_questions = [q for q in all_questions if q.id not in answered_ids]
    
    # If no available questions, reset (employee answered all questions)
    if not available_questions:
        available_questions = all_questions
        daily_progress.answered_question_ids = ''
        db.session.commit()
    
    # Select random question
    question = random.choice(available_questions)
    
    return jsonify({
        'success': True,
        'question': {
            'id': question.id,
            'perfume_name': question.perfume_name,
            'question': question.question,
            'answers': [question.answer1, question.answer2, question.answer3, question.answer4]
        },
        'questions_answered': daily_progress.questions_answered,
        'remaining_questions': 10 - daily_progress.questions_answered
    })

@training_bp.route('/submit-answer', methods=['POST'])
def submit_answer():
    if 'user_type' not in session or session['user_type'] != 'employee':
        return jsonify({'success': False, 'message': 'غير مصرح لك بالوصول'}), 401
    
    data = request.json
    question_id = data.get('question_id')
    selected_answer = data.get('selected_answer')  # 0, 1, 2, 3
    
    employee_name = session['employee_name']
    store_name = session['employee_store']
    today = date.today()
    
    # Get question
    question = Question.query.get(question_id)
    if not question:
        return jsonify({'success': False, 'message': 'السؤال غير موجود'})
    
    # Check correct answer
    correct_answer_map = {'C': 0, 'D': 1, 'E': 2, 'F': 3}
    correct_index = correct_answer_map.get(question.correct_answer, 0)
    is_correct = selected_answer == correct_index
    
    # Update daily progress
    daily_progress = DailyProgress.query.filter_by(
        employee_name=employee_name,
        date=today
    ).first()
    
    if daily_progress:
        daily_progress.questions_answered += 1
        answered_ids = daily_progress.answered_question_ids.split(',') if daily_progress.answered_question_ids else []
        answered_ids.append(str(question_id))
        daily_progress.answered_question_ids = ','.join(answered_ids)
        
        # If completed 10 questions, save score
        if daily_progress.questions_answered == 10:
            # Calculate score from today's session (simplified - each correct = 10 points)
            # For now, we'll use a simple scoring system
            score = Score.query.filter_by(
                employee_name=employee_name,
                store_name=store_name,
                date=today
            ).first()
            
            if not score:
                score = Score(
                    employee_name=employee_name,
                    store_name=store_name,
                    date=today,
                    score=10 if is_correct else 0
                )
                db.session.add(score)
            else:
                score.score += 10 if is_correct else 0
        
        db.session.commit()
    
    return jsonify({
        'success': True,
        'is_correct': is_correct,
        'correct_answer': question.correct_answer,
        'correct_answer_text': [question.answer1, question.answer2, question.answer3, question.answer4][correct_index],
        'questions_answered': daily_progress.questions_answered if daily_progress else 0,
        'completed_daily_limit': daily_progress.questions_answered >= 10 if daily_progress else False
    })

