---
title: Dynamic Financial Reporting System
description: An automated financial dashboard built with Advanced Spreadsheets and VBA to transform raw operational data into real-time business metrics.
image: /assets/image/data_preparation_excel (2).png
previews: [/assets/image/data_preparation_excel (2).png]
tags: [Data Engineering, Excel, VBA, Automation, Data Processing]
github: https://github.com/yourusername/dynamic-financial-dashboard
demo: 
date: 2026-04
featured: true
---

## Overview

![Financial Dashboard Preview](/assets/image/data_preparation_excel (2).png)
*A clean view of the dynamic financial dashboard tracking key business metrics.*

Built an automated financial reporting system for a freelance client that removed their daily manual data entry. Raw transaction rows go in; the workbook spits out Gross Profit (*Laba Kotor*) and Net Profit (*Laba Bersih*) numbers the client can read at a glance.

## Key Features

- **Automated Data Processing**: VBA macros format, clean, and validate each day's operational data on open.
- **Dynamic Metrics**: `QUERY`-based formulas restructure raw rows into the metrics the owner actually checks.
- **Clean View Dashboard**: Pivot Tables and charts let the client collapse to top-level summaries or drill into a single transaction.
- **Time Saved**: Daily processing went from about an hour of manual work to clicking one button.

## Technical Highlights

| Component | Technology | Details |
|-----------|-----------|---------|
| **Data Ingestion** | VBA (Macros) | Auto-extracts and cleans raw rows on workbook open |
| **Data Transformation** | Advanced Formulas (`QUERY`) | Aggregates transactions into Gross/Net Profit |
| **Reporting & BI** | Pivot Tables & Charts | Top-level summaries with drill-down to row |
| **Environment** | Microsoft Excel | Single-file deliverable, no extra tools |

## What I Learned

Two things stuck. First, the `QUERY` function is the closest thing Excel has to a SQL `GROUP BY`: once I started writing it like one, the formulas stopped being clever workarounds and became a small data pipeline I could reason about. Second, a one-hour-per-day manual task becomes a serious business case very quickly when you multiply it across the year.