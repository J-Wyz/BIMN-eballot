from flask import Flask, request, render_template
import json

app = Flask(__name__)

@app.route('/store_vote', methods=['POST'])
def store_vote():
    data = request.get_json()
    with open('votes.txt', 'a') as file:
        json.dump(data, file)
        file.write('\n')
    return 'Data stored successfully'
@app.route('/')
def home():
    return render_template('index.html')

if __name__ == '__main__':
    app.run()