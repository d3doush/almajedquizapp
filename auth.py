from flask import Blueprint, jsonify, request, session
from src.models.employee import Employee, db

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    user_type = data.get('user_type')
    
    if user_type == 'admin':
        username = data.get('username')
        password = data.get('password')
        
        if username == 'admin' and password == 'admin':
            session['user_type'] = 'admin'
            session['user_id'] = 'admin'
            return jsonify({
                'success': True,
                'user_type': 'admin',
                'message': 'تم تسجيل الدخول بنجاح'
            })
        else:
            return jsonify({
                'success': False,
                'message': 'اسم المستخدم أو كلمة المرور غير صحيحة'
            }), 401
    
    elif user_type == 'employee':
        region = data.get('region')
        city = data.get('city')
        store = data.get('store')
        name = data.get('name')
        password = data.get('password')
        
        employee = Employee.query.filter_by(
            region=region,
            city=city,
            store=store,
            name=name,
            password=password
        ).first()
        
        if employee:
            session['user_type'] = 'employee'
            session['user_id'] = employee.id
            session['employee_name'] = employee.name
            session['employee_store'] = employee.store
            session['employee_region'] = employee.region
            session['employee_city'] = employee.city
            return jsonify({
                'success': True,
                'user_type': 'employee',
                'employee': employee.to_dict(),
                'message': 'تم تسجيل الدخول بنجاح'
            })
        else:
            return jsonify({
                'success': False,
                'message': 'بيانات الموظف غير صحيحة'
            }), 401
    
    else:
        return jsonify({
            'success': False,
            'message': 'نوع المستخدم غير صحيح'
        }), 400

@auth_bp.route('/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({
        'success': True,
        'message': 'تم تسجيل الخروج بنجاح'
    })

@auth_bp.route('/check-session', methods=['GET'])
def check_session():
    if 'user_type' in session:
        return jsonify({
            'logged_in': True,
            'user_type': session['user_type'],
            'user_id': session['user_id']
        })
    else:
        return jsonify({
            'logged_in': False
        })

