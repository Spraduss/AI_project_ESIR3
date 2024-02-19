from flask import Flask, render_template, request, jsonify
from markdown import markdown

from sentiments import analyse_sentiments
from review_generation import generer_revue

app = Flask(__name__)



@app.route('/')
def home():
    """
    Return the main page
    """
    return render_template('./index.html')



@app.route('/backend-endpoint', methods=['POST'])
def backend_logic():
    """
    Do something different depending of the request's parameter 'task'
    """
    data = request.json
    if data['task'] == 'sentimentAnalysis':
        proba = getStringAnalysisResponseForTest(data['data'])
        return jsonify(proba)
    elif data['task'] == "generation":
        return jsonify(getStringGenerationResponseForTest(data['genre'], data['positive']))



def getStringAnalysisResponseForTest(review):
    """
    Execute the sentiment analysis on the review 
    """
    sentiment = analyse_sentiments(review)
    return sentiment


def getStringGenerationResponseForTest(genre, isPositive):
    """
    Generate a review depending on the parameters
    """
    appreciation = "positive" if isPositive else "negative"
    review = generer_revue(appreciation, genre)
    return review
    

def avoid_cumulating_tags(line):
    if len(line)>19:
        if line[:9] == '<p><code>' and line[-11:] == '</code></p>':
            return line[3:-4]
    return line


@app.route('/README', methods=['GET'])
def getREADME():
    """
    Return the readme as HTML code after a conversion (Markdown -> HTML)
    """
    with open('../README.md', 'r', encoding='utf-8') as f:
        tmp = f.readlines()
    html_content = " ".join([avoid_cumulating_tags(markdown(str(line))) for line in tmp])
    return jsonify(html_content)



if __name__ == '__main__':
    app.run(debug=True)
