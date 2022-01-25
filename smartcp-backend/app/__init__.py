import os
import requests
from flask_mongoengine import MongoEngine
from flask import Flask
from flask_cors import CORS, cross_origin
import json
from flask import current_app,jsonify,request,Response

import base64
from PIL import Image
import io
import os
from os import walk
import subprocess
from datetime import datetime, timedelta, timezone
from flask_jwt_extended import create_access_token,get_jwt,get_jwt_identity,unset_jwt_cookies, jwt_required, JWTManager

xmlImgTrain = '''
<annotation>
	<folder>train</folder>
	<filename>{imageName}</filename>
	<path>{imagePath}</path>
	<source>
		<database>Unknown</database>
	</source>
	<size>
		<width>{imageWidth}</width>
		<height>{imageHeight}</height>
		<depth>3</depth>
	</size>
	<segmented>0</segmented>
	<object>
		<name>{name}</name>
		<pose>Unspecified</pose>
		<truncated>0</truncated>
		<difficult>0</difficult>
		<bndbox>
			<xmin>{xMin}</xmin>
			<ymin>{yMin}</ymin>
			<xmax>{xMax}</xmax>
			<ymax>{yMax}</ymax>
		</bndbox>
	</object>
</annotation>

'''



def convert_and_save(b64_string,name, personId,faceCoord):

    FILE_UPLOAD_DIR = 'imagesToTrain/'

    filenames = next(walk(os.path.join(FILE_UPLOAD_DIR,'train')), (None, None, []))[2]  # [] if no file

    nFiles = list(filter(lambda x: ".jpeg" in x, filenames))
    
    name = str(len(nFiles) + 1);



    image = base64.b64decode(str(b64_string))       
    fileName = '{}.jpeg'.format(name)
    xmlFile = '{}.xml'.format(name)

    imagePath = os.path.join(FILE_UPLOAD_DIR,'train',fileName)
    xmlPath = os.path.join(FILE_UPLOAD_DIR,'train',xmlFile)

    img = Image.open(io.BytesIO(image))
    
    img.save(imagePath, 'jpeg')

    with open(xmlPath, 'x') as f:
        f.write(xmlImgTrain.format(imageName = fileName, 
            imagePath = "~/tensorflow2/models/research/object_detection/images/train/"+fileName,
            imageWidth = img.width, imageHeight = img.height,name = personId,
            xMin = int(faceCoord['x']), yMin = int(faceCoord['y']),
            xMax = int(faceCoord['x'])+int(faceCoord['width']),
            yMax = int(faceCoord['y'])+int(faceCoord['height'])))

    if(int(name) % 2 !=  0):
        imagePath = os.path.join(FILE_UPLOAD_DIR,'test',fileName);
        img.save(imagePath, 'jpeg');
        xmlPath = os.path.join(FILE_UPLOAD_DIR,'test',xmlFile)

        

        with open(xmlPath, 'x') as f:
            f.write(xmlImgTrain.format(imageName = fileName, 
            imagePath = "~/tensorflow2/models/research/object_detection/images/test/"+fileName,
            imageWidth = img.width, imageHeight = img.height,name = personId,
            xMin = int(faceCoord['x']), yMin = int(faceCoord['y']),
            xMax = int(faceCoord['x'])+int(faceCoord['width']),
            yMax = int(faceCoord['y'])+int(faceCoord['height'])))

    

    
    



def create_app(test_config=None):
    # create and configure the app
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_mapping(
        SECRET_KEY='dev',
        JWT_SECRET_KEY = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc',
        JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1),
    )
    CORS(app, support_credentials=True)

    app.config['MONGODB_SETTINGS'] = {
    'db': 'workers',
    'host': 'localhost',
    'port': 27017
    }
    db = MongoEngine()
    db.init_app(app)

    jwt = JWTManager(app)

    @app.after_request
    def refresh_expiring_jwts(response):
        try:
            exp_timestamp = get_jwt()["exp"]
            now = datetime.now(timezone.utc)
            target_timestamp = datetime.timestamp(now + timedelta(minutes=30))
            if target_timestamp > exp_timestamp:
                access_token = create_access_token(identity=get_jwt_identity())
            return response
        except (RuntimeError, KeyError):
            # Case where there is not a valid JWT. Just return the original respone
            return response


    class Worker(db.Document):

        name = db.StringField();
        img = db.StringField();
        created = db.DateTimeField( default=datetime.utcnow )    
        

    class Turnstile(db.Document):

        name = db.StringField();
        ipAddress = db.StringField();
        added = db.DateTimeField( default=datetime.utcnow ) 

   
        


    

    if test_config is None:
        # load the instance config, if it exists, when not testvald"ing
        app.config.from_pyfile('config.py', silent=True)
    else:
        # load the test config if passed in
        app.config.from_mapping(test_config)

    # ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    # a simple page that says hello
    @app.route('/cardsList',  methods=['GET'])
    def cardList():
        workers = Worker.objects();

        return jsonify(workers.to_json());

    
    
    
    @app.route('/addTurnstile', methods=['POST'])
    def addTurnstile():
        
        record = json.loads(request.data)


        turnstile = Turnstile(name=record['name'], ipAddress = record['ipAddress']);
        turnstile.save()
    
        return jsonify(turnstile.to_json())


    @app.route('/add', methods=['POST'])
    def addCard():
        
        record = json.loads(request.data)


        worker = Worker(name=record['name'], img = record['photos'][0]['src']);
        worker.save()

        #for i,photo in enumerate(record['photos']):
        #    print(photo["faceCoords"])
        #    convert_and_save(photo["src"],i,record['name'],photo["faceCoords"]);
    
        return jsonify(worker.to_json())



    @app.route('/turnstileList', methods=['GET'])
    def turnstileList():

        turnstiles = Turnstile.objects();
            
        
        
        return jsonify(turnstiles.to_json());
    
    @app.route('/updateAiModel', methods=['GET'])
    def updateAiModel():

        def run (command):
            output=subprocess.run(
                command,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE)

            if output.returncode != 0:
                raise RuntimeError(
                    output.stderr.decode("utf-8"))

            return output


        #output = run (["/home/vladyslav/smartcp_frontend/smartcp-backend/bash.sh", ""])
        subprocess.call("/home/vladyslav/smartcp_frontend/smartcp-backend/bash.sh", shell=True)

        with open("/home/vladyslav/smartcp_frontend/smartcp-backend/log.txt","r") as f:
            f = f.read();
        

        text = str(f);
        
        return json.dumps(text);




    @app.route('/getTrainLogFile', methods=['GET'])
    def getTrainLogFile():

        with open("/home/vladyslav/smartcp_frontend/smartcp-backend/log.txt","r") as f:
            f = f.read();

        text = str(f);
        
        return json.dumps(text);    


    @app.route('/token', methods=["POST"])
    def create_token():
        login = request.json.get("login", None)
        password = request.json.get("password", None)
        if login != "test" or password != "test":
            return {"msg": "Wrong login or password"}, 401

        access_token = create_access_token(identity= login)
        response = {"access_token":access_token}

  

        return json.dumps(response)

    @app.route("/logout", methods=["POST"])
    def logout():
        response = jsonify({"msg": "logout successful"})
        unset_jwt_cookies(response)
        return response
    
    return app
   

 




# python /home/vladyslav/tensorflow1/models/research/object_detection/prepareTF.py >>log.txt
# python /home/vladyslav/tensorflow1/models/research/object_detection/xml_to_csv.py >> log.txt

# python /home/vladyslav/tensorflow1/models/research/object_detection/generate_tfrecord.py --csv_input=/home/vladyslav/tensorflow1/models/research/object_detection/images/train_labels.csv --image_dir=/home/vladyslav/tensorflow1/models/research/object_detection/images/train --output_path=/home/vladyslav/tensorflow1/models/research/object_detection/train.record >> log.txt
# python /home/vladyslav/tensorflow1/models/research/object_detection/generate_tfrecord.py --csv_input=/home/vladyslav/tensorflow1/models/research/object_detection/images/test_labels.csv --image_dir=/home/vladyslav/tensorflow1/models/research/object_detection/images/test --output_path=/home/vladyslav/tensorflow1/models/research/object_detection/test.record >> log.txt


# python /home/vladyslav/tensorflow1/models/research/object_detection/legacy/train.py --logtostderr --train_dir=/home/vladyslav/tensorflow1/models/research/object_detection/training/ --pipeline_config_path=/home/vladyslav/tensorflow1/models/research/object_detection/training/pipeline.config >> log.txt 2>> log.txt
