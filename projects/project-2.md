---
title: Web-Based Pneumonia Detection using CNN
description: A deep learning-powered web application that utilizes a Convolutional Neural Network to detect and classify pneumonia from medical X-ray images.
image: /assets/image/pneumonia_detection (2).png
previews: [/assets/image/pneumonia_detection (2).png, /assets/image/pneumonia_detection (1).png, /assets/image/pneumonia_detection (3).png]
tags: [Python, Deep Learning, CNN, TensorFlow, Computer Vision, Data Science]
github: https://github.com/yourusername/pneumonia-detection-cnn
demo: 
date: 2026-05
featured: true
---

## Overview

![Web App Interface Preview](/assets/image/pneumonia_detection (1).png)
*Preview of the web interface predicting a chest X-ray scan.*

Built a small web app that takes a chest X-ray and predicts whether it shows signs of pneumonia. The classification model is a Convolutional Neural Network I trained in TensorFlow; the web layer is a thin Flask/Streamlit frontend that handles the file upload.

## Key Features

- **CNN classifier**: A from-scratch convolutional architecture that takes a resized chest X-ray and outputs a normal / pneumonia prediction.
- **Upload and predict**: A page where a user drops in an image and gets the model's verdict plus a confidence number, without touching Python.
- **Preprocessing pipeline**: Resize, normalize to `[0, 1]`, and apply augmentation on the training set so the model sees more variety than the raw dataset offers.
- **Validation metrics**: Precision, recall, and a confusion matrix logged after each training run, not just accuracy.

## Technical Highlights

| Component | Technology | Details |
|-----------|-----------|---------|
| **Model** | Python + TensorFlow/Keras | CNN trained on labeled X-ray images |
| **Data Prep** | NumPy + OpenCV/PIL | Resize, normalize, augment |
| **Web App** | Flask / Streamlit | File upload + prediction route |
| **Deployment** | Local / Cloud | Model served behind the web app |

## What I Learned

The biggest lesson was about class imbalance. My first training run reported 92% accuracy and looked great until I plotted the confusion matrix: the model was predicting "pneumonia" on almost every image because that was the easier way to be right. After I switched the loss weighting and reported recall per class instead of plain accuracy, the same architecture produced a much more honest model. That single change taught me more about evaluation than any textbook chapter.