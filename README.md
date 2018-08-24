# Picasso Designer

Picasso Designer is an extension to aid building complex charts based on the Picasso.JS library without having to write any code or understand the Picasso JSON structure. The extension also provides support for selections against the chart for the expected user experience in Qlik Sense.

Watch an introduction video here: [YouTube](https://youtu.be/0tLm7Lf3TYc)

## Important Information ( August 2018 )
>This extension code requires packing using the qExt tools. You can no longer download the repo and directly install. To get the correct approved version download from the releases page (file: aePicassoChart.zip) and install directly into Qlik Sense.

* [GitHub releases page](https://github.com/AnalyticsEarth/aePicassoChart/releases)

Only developers need to use qExt
* [qExt](https://github.com/axisgroup/qExt)

## How to create a chart
1. Add Data, Dimension and Measures
1. Create the scales required
1. Created the axis as a docked item
1. Add a layer for each chart item needed, choice from (Line, Bar, Point, Pie, Grid)

## Support in BETA v0.4
* Tooltip now available for Bar, Point, Pie layers

## Support in BETA v0.3
* Update to webpack and babel for extension packaging
* Support for Picasso.js theme settings and compliance to the Qlik Sense selected theme (colors, font size)
* Reference Lines (on numeric axis)

## Support in BETA v0.2
* Color Picker supports themes (themes will be auto applied when changed)
* Fix bug in 0.2.2 causing extra data points
* Fix Color Picker
* Add Bar width and offset (allow side by side bars)
* Specify the size and position of the hypercube
* Enables calculation conditions for chart level
* Picassojs v.0.11.0
* Expression legend labels
* Hide zero values (hypercube option)
* Layer legend
* Multiple fields on scales (max 3)

## Support in BETA v0.1
* Labels on Box/Bar Layer
* Fix for bar template with labels.
* Chart Templates
* Grid Layer
* Single Dimension Line, Bar, Point and Pie charts
* 2 Dimension Point Layer
* Dimension selection and range selection on dimension axis

## Support planned
* Stacked lines and bars
* Range selection on measure axis
* Lasso selection

## Examples of Charts built in BETA
### Combo Chart and Pie
![Combo and Pie](https://github.com/AnalyticsEarth/data/raw/master/Random-Combo.png)

### Line and Point
![Line and Point](https://github.com/AnalyticsEarth/data/raw/master/LineandPoint.png)

### Scatter & Trend Line
![Scatter and Trend Line](https://github.com/AnalyticsEarth/data/raw/master/Scatter.png)

### Bubble Grid
![Bubble Grid](https://github.com/AnalyticsEarth/data/raw/master/bubble-grid.png)

### Crazy & Wrong Combos!!!
![Crazy Chart](https://github.com/AnalyticsEarth/data/raw/master/crazy.png)
