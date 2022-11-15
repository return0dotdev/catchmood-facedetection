from flask import Flask, request, jsonify, Response
import cv2
from flask_restful import Resource, Api, reqparse
from flask_cors import CORS
import json
import os
os.environ["CUDA_VISIBLE_DEVICES"]="-1" 
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import numpy as np
from keras.models import model_from_json
from keras.preprocessing import image
from paz.pipelines import MiniXceptionFER

model_MiniXception = MiniXceptionFER()

# Use a service account
cred = credentials.Certificate('catmood-f6a24-firebase-adminsdk-8g3ix-dfc6cab534.json')
firebase_admin.initialize_app(cred)
db = firestore.client()

parser = reqparse.RequestParser()

APP_ROOT = os.path.dirname(os.path.abspath(__file__))

app = Flask(__name__, static_url_path="", static_folder="record")
CORS(app)
api = Api(app)


def genEmotionLive(url,id_teaching,check_record):
    face_haar_cascade = cv2.CascadeClassifier('./haarcascade_frontalface_default.xml')

    #cap = cv2.VideoCapture(url+'/videostream.cgi?user=admin&pwd=888888')
    cap = cv2.VideoCapture(0)
    if check_record == "Yes":
        fourcc = cv2.VideoWriter_fourcc(*'avc1')
        name_video = './record/Video-' + id_teaching + '.mp4'
        save_video = cv2.VideoWriter(name_video,fourcc, 5, (int(cap.get(3)),int(cap.get(4))))

    e1 = Emotion()
    while True:
        ret,frame=cap.read()# captures frame and returns boolean value and captured image
        Anger = 0
        Anxiety = 0
        Joy = 0
        Disgust = 0
        Surprise = 0
        Natural = 0
        if (ret):
            frame_name = "framevideo-" + id_teaching + ".jpg"
            gray_img= cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            faces_detected = face_haar_cascade.detectMultiScale(gray_img, 1.32, 5)

            for (x,y,w,h) in faces_detected:
                name_emotion = ''
                name_color_bgr = (0,0,0)
                classify = model_MiniXception(frame)

                if classify.get('class_name','') == 'anger':
                    Anger = Anger + 1
                    name_emotion = 'Anger'
                    name_color_bgr = (132,105,195)
                if classify.get('class_name','') == 'fear':
                    Anxiety = Anxiety + 1
                    name_emotion = 'Anxiety'
                    name_color_bgr = (89,157,255)
                if classify.get('class_name','') == 'happy':
                    Joy = Joy + 1
                    name_emotion = 'Joy'
                    name_color_bgr = (102,204,255)
                if classify.get('class_name','') == 'disgust':
                    Disgust = Disgust + 1
                    name_emotion = 'Disgust'
                    name_color_bgr = (255,188,94)
                if classify.get('class_name','') == 'surprise':
                    Surprise = Surprise + 1
                    name_emotion = 'Surprise'
                    name_color_bgr = (72,252,63)
                if classify.get('class_name','') == 'neutral':
                    Natural = Natural + 1
                    name_emotion = 'Natural'
                    name_color_bgr = (173,123,102)

                cv2.rectangle(frame,(x,y),(x+w,y+h),name_color_bgr,thickness=3)
                cv2.putText(frame, name_emotion, (int(x), int(y)), cv2.FONT_HERSHEY_SIMPLEX, 1, (0,0,255), 2)
            
            e1.setEmotion(Anger,Anxiety,Joy,Disgust,Surprise,Natural)
            cv2.imwrite('./image/' + frame_name, frame) 
            if check_record == "Yes":
                save_video.write(frame)

            frame = open('./image/' + frame_name,'rb').read()
            yield (b'--frame\r\n'b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

            if(e1.getEndTeaching() == True):
                break

    if check_record == "Yes":
        save_video.release()
    cap.release()
    cv2.destroyAllWindows()
    e1.setDefault()


def genEmotionVideo(url,id_teaching):
    face_haar_cascade = cv2.CascadeClassifier('./haarcascade_frontalface_default.xml')

    cap = cv2.VideoCapture(url)
    e1 = Emotion()  
    while True:
        ret,frame=cap.read()# captures frame and returns boolean value and captured image
        Anger = 0
        Anxiety = 0
        Joy = 0
        Disgust = 0
        Surprise = 0
        Natural = 0
        if (ret and np.shape(frame) != ()):
            frame_name = "framevideo-" + id_teaching + ".jpg"
            gray_img= cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            faces_detected = face_haar_cascade.detectMultiScale(gray_img, 1.32, 5)

            for (x,y,w,h) in faces_detected:
                name_emotion = ''
                name_color_bgr = (0,0,0)
                classify = model_MiniXception(frame)

                if classify.get('class_name','') == 'anger':
                    Anger = Anger + 1
                    name_emotion = 'Anger'
                    name_color_bgr = (132,105,195)
                if classify.get('class_name','') == 'fear':
                    Anxiety = Anxiety + 1
                    name_emotion = 'Anxiety'
                    name_color_bgr = (89,157,255)
                if classify.get('class_name','') == 'happy':
                    Joy = Joy + 1
                    name_emotion = 'Joy'
                    name_color_bgr = (102,204,255)
                if classify.get('class_name','') == 'disgust':
                    Disgust = Disgust + 1
                    name_emotion = 'Disgust'
                    name_color_bgr = (255,188,94)
                if classify.get('class_name','') == 'surprise':
                    Surprise = Surprise + 1
                    name_emotion = 'Surprise'
                    name_color_bgr = (72,252,63)
                if classify.get('class_name','') == 'neutral':
                    Natural = Natural + 1
                    name_emotion = 'Natural'
                    name_color_bgr = (173,123,102)

                cv2.rectangle(frame,(x,y),(x+w,y+h),name_color_bgr,thickness=3)
                cv2.putText(frame, name_emotion, (int(x), int(y)), cv2.FONT_HERSHEY_SIMPLEX, 1, (0,0,255), 2)
            
            e1.setEmotion(Anger,Anxiety,Joy,Disgust,Surprise,Natural)
            cv2.imwrite('./image/' + frame_name, frame)  
            frame = open('./image/' + frame_name,'rb').read()
            yield (b'--frame\r\n'b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

            if(e1.getEndTeaching() == True):
                break
        else:
            frame = cv2.imread('./black.jpg') 
            yield (b'--frame\r\n'b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')
            break

    cap.release()
    cv2.destroyAllWindows()
    e1.setDefault()  

class Emotion:
    Anger = 0
    Anxiety = 0
    Joy = 0
    Disgust = 0
    Surprise = 0
    Natural = 0
    End_Teaching = False

    def setEmotion(self, anger, anxiety, joy, disgust, surprise, natural):
        Emotion.Anger = anger
        Emotion.Anxiety = anxiety
        Emotion.Joy = joy
        Emotion.Disgust = disgust
        Emotion.Surprise = surprise
        Emotion.Natural = natural

    def setDefault(self):
        Emotion.Anger = 0
        Emotion.Anxiety = 0
        Emotion.Joy = 0
        Emotion.Disgust = 0
        Emotion.Surprise = 0
        Emotion.Natural = 0
        Emotion.End_Teaching = False

    def setEndTeaching(self):
        Emotion.End_Teaching = True

    def getAnger(self):
        return Emotion.Anger

    def getAnxiety(self):
        return Emotion.Anxiety

    def getJoy(self):
        return Emotion.Joy

    def getDisgust(self):
        return Emotion.Disgust

    def getSurprise(self):
        return Emotion.Surprise

    def getNatural(self):
        return Emotion.Natural
    
    def getEndTeaching(self):
        return Emotion.End_Teaching

class StartEmotion(Resource):
    def post(self):
        e1 = Emotion()
        data = {
            'Natural' : e1.getNatural(),
            'Anxiety' : e1.getAnxiety(),
            'Disgust' : e1.getDisgust(),
            'Surprise' : e1.getSurprise(),
            'Anger' : e1.getAnger(),
            'Joy' : e1.getJoy(),
        }
        return json.dumps(data, separators=(',', ':'))

class EndEmotion(Resource):
    def post(self):
        e1 = Emotion()
        e1.setEndTeaching()

        parser.add_argument('uid')
        parser.add_argument('courseKey')
        parser.add_argument('termKey')
        parser.add_argument('teachKey')
        parser.add_argument('anger')
        parser.add_argument('anxiety')
        parser.add_argument('joy')
        parser.add_argument('disgust')
        parser.add_argument('surprise')
        parser.add_argument('natural')
        parser.add_argument('link_video')
        
        args = parser.parse_args()
        
        data = {
            'emotion_anger': args['anger'],
            'emotion_anxiety': args['anxiety'],
            'emotion_disgust': args['disgust'],
            'emotion_joy': args['joy'],
            'emotion_natural': args['natural'],
            'emotion_surprise': args['surprise'],
            'link_video': args['link_video'],
        }

        user_ref = db.collection('user').document(args['uid'])
        course_ref = user_ref.collection('course').document(args['courseKey'])
        term_ref = course_ref.collection('term').document(args['termKey'])
        term_ref.collection('teaching').document(args['teachKey']).update(data)

        return "Success"


class Register(Resource):
    def post(self):
        parser.add_argument('firstname')
        parser.add_argument('lastname')
        parser.add_argument('insittution')
        parser.add_argument('major')
        parser.add_argument('username')
        parser.add_argument('password')
        args = parser.parse_args()

        data = {
            'firstname': args['firstname'],
            'lastname': args['lastname'],
            'insittution': args['insittution'],
            'major': args['major'],
            'username': args['username'],
            'password': args['password'],
        }

        db.collection('user').document().set(data)
        return "Success"


class Login(Resource):
    def post(self):
        parser.add_argument('username')
        parser.add_argument('password')
        args = parser.parse_args()

        users_ref = db.collection('user')
        docs = users_ref.stream()

        for doc in docs:
            data = doc.to_dict()
            if data['username'] == args['username'] and data['password'] == args['password']:
                return json.dumps({"uid": doc.id, "firstname": data['firstname'], "lastname": data['lastname'], "insittution": data['insittution'], "major": data['major'], "username": data['username'], "password": data['password']},  separators=(',', ':'))

        return "Fail"


class EditProfile(Resource):
    def post(self):
        parser.add_argument('uid')
        parser.add_argument('firstname')
        parser.add_argument('lastname')
        parser.add_argument('insittution')
        parser.add_argument('major')
        parser.add_argument('username')
        parser.add_argument('password')
        args = parser.parse_args()

        data = {
            'firstname': args['firstname'],
            'lastname': args['lastname'],
            'insittution': args['insittution'],
            'major': args['major'],
            'username': args['username'],
            'password': args['password'],
        }

        users_ref = db.collection('user')
        users_ref.document(args['uid']).update(data)

        return "Success"


class CreateCourse(Resource):
    def post(self):
        parser.add_argument('uid')
        parser.add_argument('courseId')
        parser.add_argument('courseName')
        args = parser.parse_args()

        data = {
            'course_id': args['courseId'],
            'course_name': args['courseName'],
        }

        course_ref = db.collection('user').document(
            args['uid']).collection('course')
        course_ref.document().set(data)

        return "Success"


class EditCourse(Resource):
    def post(self):
        parser.add_argument('uid')
        parser.add_argument('courseKey')
        parser.add_argument('courseId')
        parser.add_argument('courseName')
        args = parser.parse_args()

        data = {
            'course_id': args['courseId'],
            'course_name': args['courseName'],
        }

        course_ref = db.collection('user').document(
            args['uid']).collection('course')
        course_ref.document(args['courseKey']).set(data)

        return "Success"


class DeleteCourse(Resource):
    def post(self):
        parser.add_argument('uid')
        parser.add_argument('courseKey')
        args = parser.parse_args()

        course_ref = db.collection('user').document(
            args['uid']).collection('course')
        course_ref.document(args['courseKey']).delete()

        return "Success"


class Course(Resource):
    def post(self):
        parser.add_argument('uid')
        parser.add_argument('courseKey')
        args = parser.parse_args()

        course_ref = db.collection('user').document(
            args['uid']).collection('course')
        data = course_ref.document(args['courseKey']).get()
        data = data.to_dict()
        return json.dumps({"courseId": data['course_id'], "courseName": data['course_name']}, separators=(',', ':'))


class AllCourse(Resource):
    def post(self):
        parser.add_argument('uid')
        args = parser.parse_args()
        course_ref = db.collection('user').document(
            args['uid']).collection('course')
        docs = course_ref.stream()
        data = []

        for doc in docs:
            item = doc.to_dict()
            data.append(
                {'courseKey': doc.id, 'courseId': item['course_id'], 'courseName': item['course_name']})

        return json.dumps(data, separators=(',', ':'))


class Term(Resource):
    def post(self):
        parser.add_argument('uid')
        parser.add_argument('courseKey')
        parser.add_argument('termKey')
        args = parser.parse_args()

        course_ref = db.collection('user').document(
            args['uid']).collection('course').document(args['courseKey'])
        term_ref = course_ref.collection('term').document(args['termKey'])
        data = term_ref.get()
        data = data.to_dict()

        return json.dumps({'semester': data['semester'], 'trimester': data['trimester'], 'status': data['status']}, separators=(',', ':'))


class AllTerm(Resource):
    def post(self):
        parser.add_argument('uid')
        parser.add_argument('courseKey')
        args = parser.parse_args()

        course_ref = db.collection('user').document(
            args['uid']).collection('course').document(args['courseKey'])
        term_ref = course_ref.collection('term')
        docs = term_ref.stream()
        data = []

        for doc in docs:
            item = doc.to_dict()
            data.append(
                {'termKey': doc.id, 'semester': item['semester'], 'trimester': item['trimester'], 'status': item['status']})
        data = sorted(data, key = lambda i: i['semester'])
        return json.dumps(data, separators=(',', ':'))


class CreateTerm(Resource):
    def post(self):
        parser.add_argument('uid')
        parser.add_argument('courseKey')
        parser.add_argument('semester')
        parser.add_argument('trimester')
        parser.add_argument('status')
        args = parser.parse_args()

        data = {
            'semester': args['semester'],
            'trimester': args['trimester'],
            'status': args['status'],
        }

        term_ref = db.collection('user').document(
            args['uid']).collection('course').document(args['courseKey'])
        term_ref.collection('term').document().set(data)

        return "Success"


class EditTerm(Resource):
    def post(self):
        parser.add_argument('uid')
        parser.add_argument('courseKey')
        parser.add_argument('termKey')
        parser.add_argument('semester')
        parser.add_argument('trimester')
        parser.add_argument('status')
        args = parser.parse_args()

        data = {
            'semester': args['semester'],
            'trimester': args['trimester'],
            'status': args['status'],
        }

        term_ref = db.collection('user').document(
            args['uid']).collection('course').document(args['courseKey'])
        term_ref.collection('term').document(args['termKey']).set(data)

        return "Success"


class DeleteTerm(Resource):
    def post(self):
        parser.add_argument('uid')
        parser.add_argument('courseKey')
        parser.add_argument('termKey')
        args = parser.parse_args()

        term_ref = db.collection('user').document(
            args['uid']).collection('course').document(args['courseKey'])
        term_ref.collection('term').document(args['termKey']).delete()

        return "Success"


class AllTeaching(Resource):
    def post(self):
        parser.add_argument('uid')
        parser.add_argument('courseKey')
        parser.add_argument('termKey')
        args = parser.parse_args()

        user_ref = db.collection('user').document(args['uid'])
        course_ref = user_ref.collection('course').document(args['courseKey'])
        term_ref = course_ref.collection('term').document(args['termKey'])
        teach_ref = term_ref.collection('teaching')

        docs = teach_ref.stream()
        data = []

        for doc in docs:
            item = doc.to_dict()
            data.append(
                 {
                    'teachKey': doc.id, 
                    'subject': item['subject'], 
                    'date': item['date'], 
                    'description': item['description'], 
                    'emotion_anger': item['emotion_anger'],
                    'emotion_anxiety': item['emotion_anxiety'],
                    'emotion_disgust': item['emotion_disgust'],
                    'emotion_joy': item['emotion_joy'],
                    'emotion_natural': item['emotion_natural'],
                    'emotion_surprise': item['emotion_surprise'],
                    'status': item['status'],
                    'link_video': item['link_video']
                })
        data = sorted(data, key = lambda i: i['date'])
        return json.dumps(data, separators=(',', ':'))


class Teaching(Resource):
    def post(self):
        parser.add_argument('uid')
        parser.add_argument('courseKey')
        parser.add_argument('termKey')
        parser.add_argument('teachKey')
        args = parser.parse_args()

        user_ref = db.collection('user').document(args['uid'])
        course_ref = user_ref.collection('course').document(args['courseKey'])
        term_ref = course_ref.collection('term').document(args['termKey'])
        teach_ref = term_ref.collection('teaching').document(args['teachKey'])

        data = teach_ref.get()
        data = data.to_dict()

        return json.dumps(data, separators=(',', ':'))


class CreateTeaching(Resource):
    def post(self):
        parser.add_argument('uid')
        parser.add_argument('courseKey')
        parser.add_argument('termKey')
        parser.add_argument('subject')
        parser.add_argument('date')
        parser.add_argument('description')
        parser.add_argument('status')
        args = parser.parse_args()

        data = {
            'subject': args['subject'],
            'date': args['date'],
            'description': args['description'],
            'status' : args['status'],
            'emotion_anger': '',
            'emotion_anxiety': '',
            'emotion_disgust': '',
            'emotion_joy': '',
            'emotion_natural': '',
            'emotion_surprise': '',
            'link_video': '',
        }

        user_ref = db.collection('user').document(args['uid'])
        course_ref = user_ref.collection('course').document(args['courseKey'])
        term_ref = course_ref.collection('term').document(args['termKey'])
        term_ref.collection('teaching').document().set(data)

        return "Success"


class EditTeaching(Resource):
    def post(self):
        parser.add_argument('uid')
        parser.add_argument('courseKey')
        parser.add_argument('termKey')
        parser.add_argument('teachKey')
        parser.add_argument('subject')
        parser.add_argument('date')
        parser.add_argument('description')
        parser.add_argument('link_video')
        args = parser.parse_args()

        data = {
            'subject': args['subject'],
            'date': args['date'],
            'description': args['description'],
            'link_video': args['link_video'],
        }

        user_ref = db.collection('user').document(args['uid'])
        course_ref = user_ref.collection('course').document(args['courseKey'])
        term_ref = course_ref.collection('term').document(args['termKey'])
        term_ref.collection('teaching').document(args['teachKey']).update(data)

        return "Success"


class DeleteTeaching(Resource):
    def post(self):
        parser.add_argument('uid')
        parser.add_argument('courseKey')
        parser.add_argument('termKey')
        parser.add_argument('teachKey')
        args = parser.parse_args()

        user_ref = db.collection('user').document(args['uid'])
        course_ref = user_ref.collection('course').document(args['courseKey'])
        term_ref = course_ref.collection('term').document(args['termKey'])
        term_ref.collection('teaching').document(args['teachKey']).delete()

        return "Success"


class OpenCamera(Resource):
    def get(self):
        args = request.args
        url = args['url']
        id_teaching = args['id_teaching']
        check_record = args['check_record']
        return Response(genEmotionLive(url,id_teaching,check_record), mimetype='multipart/x-mixed-replace; boundary=frame')

class OpenVideo(Resource):
    def get(self):
        args = request.args
        url = args['url']
        id_teaching = args['id_teaching']
        return Response(genEmotionVideo(url,id_teaching), mimetype='multipart/x-mixed-replace; boundary=frame')

class AllTermDashboard(Resource):
    def post(self):
        args = request.args
        parser.add_argument('uid')
        parser.add_argument('courseKey')
        args = parser.parse_args()

        term_ref = db.collection('user').document(args['uid']).collection('course').document(args['courseKey']).collection('term')
        all_term = term_ref.stream()
        data = []
        
        for term in all_term:
            temp = term.to_dict()
            termName = temp['trimester'] + '/' + temp['semester']
            teach_ref = term_ref.document(term.id).collection('teaching')
            all_teach = teach_ref.stream()

            sumAnger = 0
            sumAnxiety = 0
            sumDisgust = 0
            sumJoy = 0
            sumNatural = 0
            sumSurprise = 0

            for teach in all_teach:
                doc = teach.to_dict()   
                if (type(doc['emotion_anger']) is str and doc['emotion_anger'] != ''):
                    anger_list = doc['emotion_anger'].split(',')
                    for i in range(0, len(anger_list)):
                        sumAnger = sumAnger + int(anger_list[i])

                if (type(doc['emotion_anxiety']) is str and doc['emotion_anxiety'] != ''):
                    anxiety_list = doc['emotion_anxiety'].split(',')
                    for i in range(0, len(anxiety_list)):
                        sumAnxiety = sumAnxiety + int(anxiety_list[i])

                if (type(doc['emotion_disgust']) is str and doc['emotion_disgust'] != ''):
                    disgust_list = doc['emotion_disgust'].split(',')
                    for i in range(0, len(disgust_list)):
                        sumDisgust = sumDisgust + int(disgust_list[i])

                if (type(doc['emotion_joy']) is str and doc['emotion_joy'] != ''):
                    joy_list = doc['emotion_joy'].split(',')
                    for i in range(0, len(joy_list)):
                        sumJoy = sumJoy + int(joy_list[i])

                if (type(doc['emotion_natural']) is str and doc['emotion_natural'] != ''):
                    natural_list = doc['emotion_natural'].split(',')
                    for i in range(0, len(natural_list)):
                        sumNatural = sumNatural + int(natural_list[i])

                if (type(doc['emotion_surprise']) is str and doc['emotion_surprise'] != ''):
                    surprise_list = doc['emotion_surprise'].split(',')
                    for i in range(0, len(surprise_list)):
                        sumSurprise = sumSurprise + int(surprise_list[i])

            data.append({
                'name': termName,
                'sum_anger': sumAnger,
                'sum_anxiety': sumAnxiety,
                'sum_disgust': sumDisgust,
                'sum_joy': sumJoy,
                'sum_natural': sumNatural,
                'sum_surprise': sumSurprise,
            })

        data = sorted(data, key = lambda i: i['name'])
        return json.dumps(data, separators=(',', ':'))

class TermDashboard(Resource):
    def post(self):
        args = request.args
        parser.add_argument('uid')
        parser.add_argument('courseKey')
        parser.add_argument('termKey')
        args = parser.parse_args()

        term_ref = db.collection('user').document(args['uid']).collection('course').document(args['courseKey']).collection('term')
        teach_ref = term_ref.document(args['termKey']).collection('teaching')
        all_teach = teach_ref.stream()
        data = []
        
        for teach in all_teach:
            doc = teach.to_dict()
            strDate = doc['date']
            sumAnger = 0
            sumAnxiety = 0
            sumDisgust = 0
            sumJoy = 0
            sumNatural = 0
            sumSurprise = 0

            if (type(doc['emotion_anger']) is str and doc['emotion_anger'] != ''):
                anger_list = doc['emotion_anger'].split(',')
                for i in range(0, len(anger_list)):
                    sumAnger = sumAnger + int(anger_list[i])

            if (type(doc['emotion_anxiety']) is str and doc['emotion_anxiety'] != ''):
                anxiety_list = doc['emotion_anxiety'].split(',')
                for i in range(0, len(anxiety_list)):
                    sumAnxiety = sumAnxiety + int(anxiety_list[i])

            if (type(doc['emotion_disgust']) is str and doc['emotion_disgust'] != ''):
                disgust_list = doc['emotion_disgust'].split(',')
                for i in range(0, len(disgust_list)):
                    sumDisgust = sumDisgust + int(disgust_list[i])

            if (type(doc['emotion_joy']) is str and doc['emotion_joy'] != ''):
                joy_list = doc['emotion_joy'].split(',')
                for i in range(0, len(joy_list)):
                    sumJoy = sumJoy + int(joy_list[i])

            if (type(doc['emotion_natural']) is str and doc['emotion_natural'] != ''):
                natural_list = doc['emotion_natural'].split(',')
                for i in range(0, len(natural_list)):
                    sumNatural = sumNatural + int(natural_list[i])

            if (type(doc['emotion_surprise']) is str and doc['emotion_surprise'] != ''):
                surprise_list = doc['emotion_surprise'].split(',')
                for i in range(0, len(surprise_list)):
                    sumSurprise = sumSurprise + int(surprise_list[i])

            data.append({
                'name': strDate,
                'sum_anger': sumAnger,
                'sum_anxiety': sumAnxiety,
                'sum_disgust': sumDisgust,
                'sum_joy': sumJoy,
                'sum_natural': sumNatural,
                'sum_surprise': sumSurprise,
            })

        data = sorted(data, key = lambda i: i['name'])
        return json.dumps(data, separators=(',', ':'))

class DeleteRecord(Resource):
    def post(self):
        args = request.args
        parser.add_argument('filename')
        args = parser.parse_args()
        path_video = './record/Video-' + args['filename'] + '.mp4'
        path_image = './image/framevideo-' + args['filename'] + '.jpg'
        if os.path.exists(path_image):
            os.remove(path_image)

        if os.path.exists(path_video):
            os.remove(path_video)

        return 'success'

api.add_resource(Register, "/api/user/register")
api.add_resource(Login, "/api/user/login")
api.add_resource(EditProfile, "/api/user/edit")
api.add_resource(Course, "/api/course")
api.add_resource(AllCourse, "/api/course/all")
api.add_resource(CreateCourse, "/api/course/create")
api.add_resource(EditCourse, "/api/course/edit")
api.add_resource(DeleteCourse, "/api/course/delete")
api.add_resource(Term, "/api/course/term")
api.add_resource(AllTerm, "/api/course/term/all")
api.add_resource(CreateTerm, "/api/course/term/create")
api.add_resource(EditTerm, "/api/course/term/edit")
api.add_resource(DeleteTerm, "/api/course/term/delete")
api.add_resource(AllTeaching, "/api/teaching/all")
api.add_resource(Teaching, "/api/teaching")
api.add_resource(CreateTeaching, "/api/teaching/create")
api.add_resource(EditTeaching, "/api/teaching/edit")
api.add_resource(DeleteTeaching, "/api/teaching/delete")
api.add_resource(OpenCamera, "/api/camera/open")
api.add_resource(OpenVideo, "/api/video/open")
api.add_resource(StartEmotion,"/api/emotion/start")
api.add_resource(EndEmotion,"/api/emotion/end")
api.add_resource(AllTermDashboard, "/api/dashboard/term/all")
api.add_resource(TermDashboard, "/api/dashboard/term")
api.add_resource(DeleteRecord, "/api/record/delete")

if __name__ == "__main__":
    app.run(debug=True)
