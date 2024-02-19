from transformers import pipeline

classifier = pipeline("sentiment-analysis", model="distilbert-base-uncased-finetuned-sst-2-english")

def analyse_sentiments(message):
    classification = classifier([message])[0]
    if(classification['label'] == 'POSITIVE'):
        classification['label'] = 1
    else:
        classification['label'] = 0
    return classification