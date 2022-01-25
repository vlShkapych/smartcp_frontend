from flask import Flask
import json


app = Flask(__name__)



class Info:
    id = 0;
    status = "Working";


@app.route('/getStatus')
def updateNeuralModel():

    i = Info();

    return json.dumps(i.__dict__)

if __name__ == '__main__':
    app.run()