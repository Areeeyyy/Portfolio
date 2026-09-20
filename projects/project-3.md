---
title: Dashboarding from 8000 Rows of Excel Data
description: An interactive Looker dashboard built from 8,000 rows of raw Excel data, replacing a flat, hard-to-filter spreadsheet with views that answer trend, breakdown, and row-level questions.
image: /assets/image/1_looker.png
previews: [/assets/image/1_looker.png, /assets/image/2_looker.png, /assets/image/3_looker.png, /assets/image/4_looker.png]
tags: [Looker, Data Visualization, Excel, Dashboarding, Business Intelligence]
github:
demo:
date: 2026-09
featured: true
---

## Overview

![Looker Dashboard Overview](/assets/image/1_looker.png)
*An overview of the Looker dashboard, surfacing key metrics from the underlying Excel dataset.*

Built an interactive Looker dashboard on top of a flat Excel workbook of about 8,000 rows of operational records. The original spreadsheet was hard to filter and impossible to trend across periods; the dashboard replaces that with four views that answer the questions stakeholders actually ask.

## Key Features

- **Excel ingestion**: Loaded the workbook, kept the original grain and business keys, and shaped the columns into Looker's semantic model.
- **Interactive views**: Charts, filters, and drill-downs so a user can slice the same metric by date, region, or category without a new report.
- **KPI tile**: A single tile at the top of each view shows the one number the audience checks first.
- **Tabs for depth**: After the headline metric, three more tabs answer the next questions (`Is it getting better or worse?`, `Which category drives it?`, `Show me the rows.`).

## Dashboard Views

Four views, each tuned to a different question:

![View 1: KPI Overview](/assets/image/1_looker.png)
*High-level KPI overview.*

![View 2: Trends Over Time](/assets/image/2_looker.png)
*Trend analysis across the reporting period.*

![View 3: Breakdown by Dimension](/assets/image/3_looker.png)
*Breakdown of metrics by key categories.*

![View 4: Detailed Exploration](/assets/image/4_looker.png)
*Drill-down view for granular exploration.*

## Technical Highlights

| Component | Technology | Details |
|-----------|-----------|---------|
| **Source Data** | Microsoft Excel | ~8,000 rows of operational records |
| **Modeling** | LookML | Dimensions, measures, and derived metrics |
| **Visualization** | Looker Dashboards | Interactive charts, filters, and drill-downs |
| **Distribution** | Looker | Browser-based self-serve analytics |

## What I Learned

The modeling step mattered more than the chart step. My first pass built a long list of measures and one big dashboard; users opened it, did not know which tile to read first, and went back to the spreadsheet. Reorganizing around one KPI per view with three supporting tabs changed the same data into something people actually used.
