# D3 Multiple Bar Chart with Tooltips in React

In this article we are going to build an interactive barchart with D3.js and React. D3 is an open source, lightweight javascript graphing framework for producing interactive and dynamic data visualization in the web browser. For those uninitiated with D3 and why it may make sense to learn, I advise taking a look at the documentation and tutorial at Observable. (https://observablehq.com/@d3/learn-d3?collection=@d3/learn-d3)

The code for this tutorial can be downloaded here https://github.com/connorpheraty/d3-barchart-example

I am going to assume you are already familiar with the basic concepts of D3 such as selections scales, and data joins. If not don't worry, the best way to learn is to tinker with the code and see what happens.

## CSV Parsing with React Hooks

To fetch our data we are going to use react hooks and the D3 csv method. Note that the csv method does not automatically infer data types so we will need to iterate over the resulting array and manually type gdp as an integer.

```
  useEffect(() => {
    d3.csv(
      "https://raw.githubusercontent.com/connorpheraty/d3-barchart-example/main/src/data.csv"
    ).then(function (data) {
      data.forEach(function (d) {
        d.gdp = +d.gdp;
      });
      drawChart(data);
    });
  });
```

## Tooltip

Tooltips can be a great way to display additional dimensions of data in your visualizations. Since D3 relies on common web standards (HTML, SVG, and CSS), we can create bespoke tooltips without having to learn any proprietary frameowrks.

```
    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
```

Let's start by creating a d3 selection object that we will call tooltip. We first select body of the DOM as our node of which we append a div element. Next we will chain the .attr method to add a css class. Note that since we do not want to display the tooltip unless the mouseover condition is met, we set the visibility property to hidden.

## Data Joins

To create shapes that correspond to our data points in D3 you need to understand data joins.

```
    g.selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
```

This sequence of methods can be confusing for beginners to D3. I recommend console logging at each step in the method chain to understand what is actually happening.

1. The first method returns a new empty selection of rects, with the grouped svg object (g) as the parent node.
2. The second method links our data to the empty array and results in three different possible states: enter, update, and exit. The enter selection now contains enterNodes which act as a placeholder for new datum. When we call the enter method, the amount of possible states will be reduced to just enter.
3. Lastly, the append("rect") method appends a rectangle for each data point in the SVG container.

## Event Handling

D3 has many built-in events that can help make your visualizations much more interactive. For our chart, we want our tooltip selection that we created above to become visibile and to display the gdp for each respective country. To do this, we will chain our rect selections with the .on() method.

```
      .on("mouseover", function () {
        return tooltip.style("visibility", "visible");
      })
      .on("mousemove", function (event, d) {
        return tooltip
          .style("top", event.pageY + 30 + "px")
          .style("left", event.pageX + 20 + "px")
          .html("GDP: $" + d3.format(".3s")(d.gdp).replace("G", "B"));
      })
      .on("mouseout", function () {
        return tooltip.style("visibility", "hidden");
      });
```

There are three event handlers used to render the tooltip - mouseover, mousemove, and mouseout. The mouseover and mouseout event handlers toggle the visibility of the tooltip. The mousemove event handler is used here determines the location of the cursors using event.pageY and event.pageX and positions the tooltip down and to the right. We then add html to populate the tooltip with data.
