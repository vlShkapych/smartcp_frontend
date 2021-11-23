import os
from flask_mongoengine import MongoEngine
from flask import Flask
from flask_cors import CORS, cross_origin
import json
from flask import current_app,jsonify,request
import datetime
import base64
from PIL import Image
import io
import os
from os import walk



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



def convert_and_save(b64_string,name, personId):

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
        xMin = 0, yMin = 0,xMax = img.width, yMax = img.height))

    if(int(name) % 2 !=  0):
        imagePath = os.path.join(FILE_UPLOAD_DIR,'test',fileName);
        img.save(imagePath, 'jpeg');
        xmlPath = os.path.join(FILE_UPLOAD_DIR,'test',xmlFile)

        with open(xmlPath, 'x') as f:
            f.write(xmlImgTrain.format(imageName = fileName, 
            imagePath = "~/tensorflow2/models/research/object_detection/images/test/"+fileName,
            imageWidth = img.width, imageHeight = img.height,name = personId,
            xMin = 0, yMin = 0,xMax = img.width, yMax = img.height))

    

    
    



def create_app(test_config=None):
    # create and configure the app
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_mapping(
        SECRET_KEY='dev',
    )
    app.config['MONGODB_SETTINGS'] = {
    'db': 'workers',
    'host': 'localhost',
    'port': 27017
    }
    db = MongoEngine()
    db.init_app(app)
    class Worker(db.Document):
        firstName = db.StringField()
        lastName = db.StringField()

    CORS(app, support_credentials=True)



    if test_config is None:
        # load the instance config, if it exists, when not testing
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
    @app.route('/hello')
    def hello():
        return 'Hello, World!'

    
    
    
    @app.route('/add', methods=['POST'])
    def login():





        record = json.loads(request.data)
        worker = Worker(firstName=record['firstName'],
                lastName=record['lastName'])
        worker.save()

        for i,photo in enumerate(record['photos']):
            convert_and_save(photo,i,record['firstName']);
    
        return jsonify(worker.to_json())


       
        
    
    
    
    
    
    return app



   
