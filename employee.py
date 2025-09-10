from src.models.user import db
from datetime import datetime

class Employee(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    region = db.Column(db.String(100), nullable=False)
    city = db.Column(db.String(100), nullable=False)
    store = db.Column(db.String(100), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    password = db.Column(db.String(100), nullable=False)
    
    def __repr__(self):
        return f'<Employee {self.name}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'region': self.region,
            'city': self.city,
            'store': self.store,
            'name': self.name
        }

class Question(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    perfume_name = db.Column(db.String(100), nullable=False)
    question = db.Column(db.Text, nullable=False)
    answer1 = db.Column(db.String(200), nullable=False)
    answer2 = db.Column(db.String(200), nullable=False)
    answer3 = db.Column(db.String(200), nullable=False)
    answer4 = db.Column(db.String(200), nullable=False)
    correct_answer = db.Column(db.String(10), nullable=False)  # C, D, E, F (corresponding to columns)
    
    def __repr__(self):
        return f'<Question {self.perfume_name}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'perfume_name': self.perfume_name,
            'question': self.question,
            'answers': [self.answer1, self.answer2, self.answer3, self.answer4],
            'correct_answer': self.correct_answer
        }

class Score(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.Date, nullable=False, default=datetime.utcnow().date())
    employee_name = db.Column(db.String(100), nullable=False)
    store_name = db.Column(db.String(100), nullable=False)
    score = db.Column(db.Integer, nullable=False)
    
    def __repr__(self):
        return f'<Score {self.employee_name}: {self.score}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'date': self.date.isoformat(),
            'employee_name': self.employee_name,
            'store_name': self.store_name,
            'score': self.score
        }

class DailyProgress(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    employee_name = db.Column(db.String(100), nullable=False)
    date = db.Column(db.Date, nullable=False, default=datetime.utcnow().date())
    questions_answered = db.Column(db.Integer, default=0)
    answered_question_ids = db.Column(db.Text, default='')  # Comma-separated question IDs
    
    def __repr__(self):
        return f'<DailyProgress {self.employee_name}: {self.questions_answered}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'employee_name': self.employee_name,
            'date': self.date.isoformat(),
            'questions_answered': self.questions_answered,
            'answered_question_ids': self.answered_question_ids.split(',') if self.answered_question_ids else []
        }

