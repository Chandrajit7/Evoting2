import json
import os
import random
import smtplib
from email.mime.text import MIMEText
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS

app = Flask(__name__, static_folder='.')
CORS(app)

SENDER_EMAIL = "chandrajitbanerjee.bcrec@gmail.com"
SENDER_APP_PASSWORD = "rdlb rnsr ilfw ioay"

ADMIN_USERS = {
    "admin": {"password": "2026", "email": "chandrajitbanerjee11@gmail.com"},
    "admin_ops": {"password": "opsPass!99", "email": "chandrajitbanerjee11@gmail.com"},
    "admin_audit": {"password": "auditSecure#1", "email": "chandrajitbanerjee11@gmail.com"},
    "eci": {"password": "eci@", "email": "chandrajitb943@gmail.com"}
}

otp_storage = {}
DB_FILE = 'votes.json'

def load_votes():
    if not os.path.exists(DB_FILE):
        return {}
    with open(DB_FILE, 'r') as f:
        return json.load(f)

def save_votes(votes):
    with open(DB_FILE, 'w') as f:
        json.dump(votes, f)

def send_otp_email(recipient_email, otp):
    msg = MIMEText(f"Your Admin Login OTP is: {otp}")
    msg['Subject'] = 'Election Admin Portal - OTP Verification'
    msg['From'] = SENDER_EMAIL
    msg['To'] = recipient_email

    try:
        with smtplib.SMTP_SSL('smtp.gmail.com', 465) as server:
            server.login(SENDER_EMAIL, SENDER_APP_PASSWORD)
            server.sendmail(SENDER_EMAIL, recipient_email, msg.as_string())
    except Exception as e:
        print(f"Failed to send email: {e}")

@app.route('/')
def index():
    return send_from_directory('.', 'admin-login.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('.', path)

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    admin_id = data.get('admin_id')
    password = data.get('password')

    if admin_id in ADMIN_USERS and ADMIN_USERS[admin_id]['password'] == password:
        otp = str(random.randint(100000, 999999))
        otp_storage[admin_id] = otp
        recipient = ADMIN_USERS[admin_id]['email']
        
        send_otp_email(recipient, otp)
        
        return jsonify({"success": True, "message": "OTP sent to your registered email."})
    return jsonify({"success": False, "message": "Invalid credentials."})

@app.route('/api/verify-otp', methods=['POST'])
def verify_otp():
    data = request.json
    admin_id = data.get('admin_id')
    otp = data.get('otp')

    if admin_id in otp_storage and otp_storage[admin_id] == otp:
        del otp_storage[admin_id]
        return jsonify({"success": True, "message": "Authentication successful!"})
    return jsonify({"success": False, "message": "Invalid or expired OTP."})

@app.route('/api/vote', methods=['POST'])
def cast_vote():
    candidate = request.json.get('candidate')
    votes = load_votes()
    votes[candidate] = votes.get(candidate, 0) + 1
    save_votes(votes)
    return jsonify({"success": True})

@app.route('/api/results', methods=['GET'])
def get_results():
    return jsonify(load_votes())

@app.route('/api/reset', methods=['POST'])
def reset_votes():
    save_votes({})
    return jsonify({"success": True})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
