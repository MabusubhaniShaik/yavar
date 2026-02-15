# Instructions for Downloading Kaggle Datasets

## Required Datasets

You need to download 3 CSV files from Kaggle and place them in this `data/` folder.

### 1. Netflix Shows Dataset

- **URL**: https://www.kaggle.com/datasets/shivamb/netflix-shows
- **File**: `netflix_titles.csv`
- **Save as**: `data/netflix_titles.csv`

### 2. IBM HR Analytics Attrition Dataset

- **URL**: https://www.kaggle.com/datasets/pavansubhasht/ibm-hr-analytics-attrition-dataset
- **File**: `WA_Fn-UseC_-HR-Employee-Attrition.csv`
- **Save as**: `data/WA_Fn-UseC_-HR-Employee-Attrition.csv`

### 3. Sample Sales Data

- **URL**: https://www.kaggle.com/datasets/kyanyoga/sample-sales-data
- **File**: `sales_data_sample.csv`
- **Save as**: `data/sales_data_sample.csv`

## How to Download

1. Go to each Kaggle dataset URL
2. Click "Download" button (you may need to sign in to Kaggle)
3. Extract the CSV file from the downloaded zip
4. Place the CSV file in this `data/` folder with the exact name specified above

## After Downloading

Once all 3 CSV files are in this folder, run:

```bash
npm run seed
```

This will import all the data into your MongoDB database.
