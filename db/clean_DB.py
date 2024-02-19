import pandas

def sort_db_review(line):
    for character in line:
        if character.isalpha():
            return True
    return False

# Prepare the "DB_positif_clean" file : all positive reviews that contain at least one alphabetical char
df_positive_clean = pandas.read_csv('db/DB_positif.csv')                                      # Load the original file
df_positive_clean['text'] = df_positive_clean['text'].apply(str)                              # Convert all reviews to strings (avoid floats or other types)
df_positive_clean = df_positive_clean.sample(frac=1)                                          # Shuffle the df to avoid bias of having having all the reviews for the same game together
df_positive_clean = df_positive_clean.loc[df_positive_clean['text'].apply(sort_db_review)]    # Clean the reviews with "contains_alphabetical_char" as a criteria
df_positive_clean.to_csv('db/DB_positif_clean.csv', index=False)                              # Write the new CSV



# Prepare the "DB_negatif_clean" file : all negative reviews that contain at least one alphabetical char
df_negative_clean = pandas.read_csv('db/DB_negatif.csv')                                      # Load the original file
df_negative_clean['text'] = df_negative_clean['text'].apply(str)                              # Convert all reviews to strings (avoid floats or other types)
df_negative_clean = df_negative_clean.sample(frac=1)                                          # Shuffle the df to avoid bias of having having all the reviews for the same game together
df_negative_clean = df_negative_clean.loc[df_negative_clean['text'].apply(sort_db_review)]    # Clean the reviews with "contains_alphabetical_char" as a criteria
df_negative_clean.to_csv('db/DB_negatif_clean.csv', index=False)                              # Write the new CSV



# Prepare the "DB_head_clean" file : 10000 positive cleaned reviews and 10000 negative cleaned reviews
df_p_head = df_positive_clean.head(10000)                           # Keep first 10000 positive reviews
df_n_head = df_negative_clean.head(10000)                           # Keep first 10000 negative reviews
df_heads = pandas.concat([df_p_head, df_n_head]).sample(frac=1)     # Concatenate both df and shuffle
df_heads.to_csv('db/DB_head_clean.csv', index=False)                # Write the new CSV
