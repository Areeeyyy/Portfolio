---
title: Dashboarding from 8000 Rows of Excel Data
description: An interactive Looker dashboard built from 8,000 rows of raw Excel data, transforming a flat spreadsheet into clear, actionable visual insights.
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

Built an end-to-end dashboarding solution starting from a flat Excel workbook containing roughly 8,000 rows of operational data. The raw spreadsheet was cleaned, modeled, and visualized inside Looker, turning dense tabular records into an interactive set of views that make trends, outliers, and KPIs immediately obvious to non-technical stakeholders.

## Key Features

- **Data ingestion from Excel** — Imported and mapped 8,000 rows of source data into Looker's semantic layer, preserving grain and business keys.
- **Interactive visualizations** — Built dynamic charts, filters, and drill-down views so users can slice metrics by relevant dimensions in real time.
- **KPI tracking** — Surfaced the most important business indicators at a glance, with secondary tabs for deeper exploration.
- **Self-serve analytics** — Empowered stakeholders to answer their own questions without needing a new spreadsheet or report request.

## Dashboard Views

The dashboard is composed of four complementary views, each focused on a different analytical angle:

![View 1 — KPI Overview](/assets/image/1_looker.png)
*High-level KPI overview.*

![View 2 — Trends Over Time](/assets/image/2_looker.png)
*Trend analysis across the reporting period.*

![View 3 — Breakdown by Dimension](/assets/image/3_looker.png)
*Breakdown of metrics by key categories.*

![View 4 — Detailed Exploration](/assets/image/4_looker.png)
*Drill-down view for granular exploration.*

## Technical Highlights

| Component | Technology | Details |
|-----------|-----------|---------|
| **Source Data** | Microsoft Excel | ~8,000 rows of operational records |
| **Modeling** | LookML | Dimensions, measures, and derived metrics |
| **Visualization** | Looker Dashboards | Interactive charts, filters, and drill-downs |
| **Distribution** | Looker | Browser-based self-serve analytics |

## What I Learned

This project reinforced how powerful a purpose-built BI tool can be when the underlying data is modeled correctly. I learned to think like an analyst designing for an audience — choosing the right chart types, deciding which filters belong on each tile, and keeping the core KPIs visible while still giving curious users a path to drill deeper.
