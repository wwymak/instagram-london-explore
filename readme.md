This is a mini project to analyse a month (sept 2016) of instagram posts around London

Posts are collected every hour with an AWS Lambda function and saved as json files
to a S3 bucket. 

Parser.js runs through the json files and saves the data to a mongodb -- it assumes
the files exists locally in a folder called `dataFolderS3`. (these files can 
be saved to the folder with `aws s3 sync`

the ipython notebooks are there for exploring the data

the OA_2011_BGC_london.json is the boundary for the output areas for greater london
and is used for geo analysis (e.g. which areas has the most posts)







