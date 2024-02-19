# Steam's reviews sentiment analysis and generation
## authors
* [Louis Ruellou](https://gitlab.istic.univ-rennes1.fr/lruellou)
* [Léo Filoche](https://gitlab.istic.univ-rennes1.fr/lfiloche)
* [Jérémy Bindel](https://gitlab.istic.univ-rennes1.fr/15005748)

Original repository : [here](https://gitlab.istic.univ-rennes1.fr/15005748/ai_filoche_bindel.git)

This original also contains lab works, and some tries for fine-tuning the models used during the projects. However, since we don't think the labs are really relevant, and the fine-tuning didn't meet our expectations, we decided to only include the project in its last runnable version.

## Download and run
Execute : `git clone https://github.com/Spraduss/AI_project_ESIR3.git`
Run in 2 steps
```shell
pip install -r requirements.txt
```
```shell
cd UI/
python entry_point.py
```

# Presentation
## Purpose
Our solution solves two problems that every player who wants to review a game has met at least once.

The first one is to write the actual review. Our AI powered tool offers to do it for you to fight the blank-page syndrome.

The second is to make sure that your review will be correctly interpreted by the other players. Our tool offers to analyse your review to make sure you are conveying the right sentiment.

## Usage
In order to run the application, you first have to install the different requirements (available in the requirements.txt file) by executing the command : 

`pip install -r requirements.txt`

Then, launch the application by executing the following command in the `UI` directory of the project :

`python3 entry_point.py`

# Graphical user interface (GUI)
The GUI is a server using the python's [Flask](https://pypi.org/project/Flask/) librairy. It deploys the application on the port 5000 of the machine used to run the script (localhost), accessible via this [link](http://localhost:5000).

It is composed of three main parts.

## Review generation
This panel (left) allow the user to generate a review, positive or negative, for a game's genre of its choice. To generate it, the user must click on the robot button.

Once the review is generated, the review appear on the bottom-right section, dedicated for AI generated content.

## Review analysis
This panel (top right) allow the user to fill a review and submit it to the model in order to evaluate it. Once it has been written in the text area, the user can hit the send button on the right of the panel.

Once the review has been evaluated by the backend, it is display in the AI panel, taking the form of a classic Steam review. The thumbs indicate if the review is interpreted as positive (thumbs-up blue) or negative (thumbs-down red), And there's a percentage indicating the degree of certainty with which the classification decision has been made.

## Display the readme
The user can display the readme of the projet (the one you are actually reading) by pressing the '?' button (top-left of the page). This will convert the markdown of the file in an html page using the Python's [markdown](https://pypi.org/project/Markdown/) librairy.

By clicking on the 'x' button (top-left of the page), the user can go back to the main page. The different messages previously displayed are still here.

# Gathering the data

## Scrapping
In order to gather data to fine tune the models, we decided to directly scrap the data from Steam. To do that, we used the python's librairy [steamreview](https://pypi.org/project/steamreviews/).

Even with the limit in the number of request that forces a sleep, we manage to scrap approximately 200,000 reviews. We did a pre-sort to only keep english review, and one review per user.

We decided not to include the data in this repository. However, you can still get them by running the script [getSteamReviews.py](db/getSteamReviews.py). This will give you two files "DB_positif.csv" and "DB_negatif.csv". You can then run [clean_DB.py](db/clean_DB.py) to clean the two datasets (generating two new files) and get another file "DB_head_clean.py" containing 20,000 reviews (10,000 positives and 10,000 negatives) shuffled so you can use it for testing purpose.

It is important to notice that you don't need the data to run the UI and test our project. We still included this part in the repository because scrapping the data was an important part of the project. 

## Cleaning
Once we get the reviews, we were confronted to a dilemna. There are a lot of reviews that do not make sense like :
`aweueyg` or `jjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj` (they are positive reviews) or `每年退步 没剧情又貪钱` and `AH, AHAHAHAHAHAA hAahh AHHHAHAgahaHAHah` (they are negative reviews). We can also be confronted to ASCII art like :

`⢀⡴⠑⡄⠀⠀⠀⠀⠀⠀⠀⣀⣀⣤⣤⣤⣀⡀                  `
`⠸⡇⠀⠿⡀⠀⠀⠀⣀⡴⢿⣿⣿⣿⣿⣿⣿⣿⣷⣦⡀             `
`⠀⠀⠀⠀⠑⢄⣠⠾⠁⣀⣄⡈⠙⣿⣿⣿⣿⣿⣿⣿⣿⣆            `
`⠀⠀⠀⠀⢀⡀⠁⠀⠀⠈⠙⠛⠂⠈⣿⣿⣿⣿⣿⠿⡿⢿⣆           `
`⠀⠀⠀⢀⡾⣁⣀⠀⠴⠂⠙⣗⡀⠀⢻⣿⣿⠭⢤⣴⣦⣤⣹⠀⠀⠀⢀⢴⣶⣆  `
`⠀⠀⢀⣾⣿⣿⣿⣷⣮⣽⣾⣿⣥⣴⣿⣿⡿⢂⠔⢚⡿⢿⣿⣦⣴⣾⠁⠸⣼⡿ `
`⠀⢀⡞⠁⠙⠻⠿⠟⠉⠀⠛⢹⣿⣿⣿⣿⣿⣌⢤⣼⣿⣾⣿⡟⠉        `
`⠀⣾⣷⣶⠇⠀⠀⣤⣄⣀⡀⠈⠻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇         `
`⠀⠉⠈⠉⠀⠀⢦⡈⢻⣿⣿⣿⣶⣶⣶⣶⣤⣽⡹⣿⣿⣿⣿⡇         `
`⠀⠀⠀⠀⠀⠀⠀⠉⠲⣽⡻⢿⣿⣿⣿⣿⣿⣿⣷⣜⣿⣿⣿⡇          `
`⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⣷⣶⣮⣭⣽⣿⣿⣿⣿⣿⣿⣿           `
`⠀⠀⠀⠀⠀⠀⣀⣀⣈⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠇           `
`⠀⠀⠀⠀⠀⠀⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠃            `
`⠀⠀⠀⠀⠀⠀⠀⠹⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠟⠁              `
    
Since it is not really possible to make sens from those reviews we decided to clean the dataset. However, automatically remove reviews without alphabetical characters is easy, but removing reviews such as "aweueyg" can not be done easily with scripts.

In the end, we decided to keep those reviews, and to only remove reviews without alphabetical characters.

# Review analysis
## Our own model

In contrast of the demo, we finally succeed to train our own model for the review analysis. The jupyter-notebook of it is `sentiment_analysis.ipynb`.

Our way to achieve was to used the `text_classification_transformer` of [Keras](https://github.com/keras-team/keras-io/blob/master/examples/nlp/text_classification_with_transformer.py). 

The reason why we do not succeed to train the model for the demo was because the data needs to be really well processed for the training phase.

### 1. Load the data

The first step of the training process was to load the data. We did it easily with pandas. But we had to convert it into `tf.data.Dataset` for the further steps.

### 2. Preprocess the data

Then, we preprocess the data with a `TextVectorization` layer. We chose an `int` output mode to get the same form of the data used by the text classification transformer of **Keras**. This mode will convert the token into integer with a value depending of the frequency of the token within the corpus. The most frequent a word is, the lower the integer it will be.
Concerning the parameter of the Text Vectorization layer, we choose a vocabulary size of 20,000 words. Then a sentence length of 250 words. This values are based one the Keras `text_classification_transformer` values that work pretty well.

### 3. The training

For the model, we chose the same of Keras `text_classification_transformer` which includes **Embedding** and **Transformer block**.
About the training, we did 2 epochs with batch size of 32 which was enough since the loss stagnates at the second epoch.
Concerning the evaluation of the model, we get an accuracy of **90.30%**.

### 4. Test

To sum up, our model for sentiment analysis has a quite good accuracy after evaluation. After our tries, we can see that it seems better to classify positive reviews than negative ones. But despite our dilemma about nonsense reviews, we can observe that our model adapt well for non-english reviews.

## Choice of the pre-trained model used in the demo

We mainly followed one [tutorial](https://huggingface.co/blog/sentiment-analysis-python) about fine-tunning a model from HF. 
It works when we follow it with exactly, using IMDB data for the fine-tunning.

However, despite all our attempts, we failed to make it work on our data.

Therefore we chose to keep the HF model (without our custom fine-tunning).

It is the [distilbert-base-uncased-finetuned-sst-2-english](https://huggingface.co/distilbert/distilbert-base-uncased-finetuned-sst-2-english) model. As the name suggests, this model is based on Google Bert's model. It has been tweaked ("distilled") to be [40% lighter, 60% lighter while being 97% as performant](https://arxiv.org/abs/1910.01108) as the original. The last part of the name is about [sst2](https://huggingface.co/datasets/sst2), a corpus of movie reviews on which it was fine tuned.

# Review generation
## Choice of the pre-trained model
Since text to text model needs a lot of training and resources, we decided to use a pre-trained model from hugging face. After trying to use different models, we decided to use the `google/flan-t5-small` model. To chose this model, we had three main criterias :
* Not to large.
* Generation not to long.
* Already able to generate coherent reviews.

Those criterias eliminated models such as [google/flan-t5-xxl](https://huggingface.co/google/flan-t5-xxl) which took more than 50GB of disk space (and bandwith).

At the end, we decided to chose [google/flan-t5-small](https://huggingface.co/google/flan-t5-small) and to fine tune it. However, as explained in the next section, we could not fine tune the model. So we decided the usage of the `google/flan-t5-large` model.

## Fine-tunning
After many attempts, we decided to give up on the fine tunning of the model. One of the last problems was the fact that we needed a GPU to train the model from hugging-face.

Our advancement is in the file [huggin_face_playground_generation.ipnyb](Projet/test_review_gen_models/hugging_face_playground_generation.ipynb). It describes how we built our dataset from the CSV files containing all the reviews.

# Ressources
## Icones
Colors have been modified to correspond to our color palette.
* Gear : https://icon-icons.com/fr/icone/gear/126775
* Send-button : https://www.pngegg.com/en/png-ptfze
* Robot : Home-made

## Models
* Sentiment analysis : [distilbert-base-uncased-finetuned-sst-2-english](https://huggingface.co/distilbert-base-uncased-finetuned-sst-2-english)
* Review generation : [google/flan-t5-large](https://huggingface.co/google/flan-t5-large)