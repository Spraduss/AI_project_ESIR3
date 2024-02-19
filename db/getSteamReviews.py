import steamreviews
import csv

# NBA 2K24 : 2338770 DONE négatif
# Godus : 232810 DONE négatif
# Baldur's Gate 3 : 1086940 DONE positif
# Overwatch 2 : 2357570 DONE négatif
# The day before : 1372880 DONE négatif
# Starfield : 1716740 DONE plutôt équilibré
app_ids = [2338770, 232810, 1086940, 2357570, 1372880, 1716740] # the steam ID of the considered games
f_positif = open('DB_positif.csv', 'a', encoding="utf-8")
writer_p = csv.writer(f_positif, lineterminator='\n')
f_negatif = open('DB_negatif.csv', 'a', encoding="utf-8")
writer_n = csv.writer(f_negatif, lineterminator='\n')

def doNothing():
    return

for app_id in app_ids:
    # Load from api
    review_dict, query_count = steamreviews.download_reviews_for_app_id(app_id)
    # Keep the authors of the review to avoid dupicate
    list_authors_local = []
    # Go through all the reviews
    for id in review_dict['reviews'].keys():
        for content in review_dict['reviews'][id]:
            # We keep only english review and make sure there is no duplicate
            if review_dict['reviews'][id]['language']=='english' and not (review_dict['reviews'][id]['author']['steamid'] in list_authors_local):
                list_authors_local.append(review_dict['reviews'][id]['author']['steamid'])
                row = review_dict['reviews'][id]['review'].replace("\n", " ")
                if review_dict['reviews'][id]['voted_up']:
                    writer_p.writerow([1,row])
                else:
                    writer_n.writerow([0,row])
    print("End of "+str(app_id))


f_positif.close()
f_negatif.close()