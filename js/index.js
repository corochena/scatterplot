d3.json('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json', render);

function render(data) {
  var container_dim = {width:1000, height:650},
      margins = {top:80,right:40,bottom:80,left:70},
      chart_dim = {
        width:container_dim.width-margins.left-margins.right,
        height:container_dim.height-margins.top-margins.bottom
      };
  var divInfo = d3.select('body').append('div')
  .attr('class', 'tooltip');

  var svg = d3.select('body').append('svg')
  .attr('width', container_dim.width)
  .attr('height', container_dim.height);

  var plot = svg.append('g')
  .attr('transform', 'translate(' + margins.left + ',' + margins.top + ')');

  var yearScale = d3.scaleLinear()
  .domain([1993,2016])
  .range([0,chart_dim.width]);

  var secScale = d3.scaleTime()
  .domain(d3.extent(data, function(d) { return d.Seconds*1000; }))
  .range([0,chart_dim.height]);

  var xAxis = d3.axisBottom().scale(yearScale)
  .tickFormat(d3.format(''));

  var yAxis = d3.axisLeft().scale(secScale)
  .tickFormat(d3.timeFormat('%M:%S'));

  var circles = plot.selectAll('circle')
  .data(data)
  .enter()
  .append('circle')
  .attr('cx', function(d) { return yearScale(d.Year); })
  .attr('cy', function(d) { return secScale(d.Seconds*1000); })
  .attr('r',6)
  .attr('class', function(d) { return (d.Doping)?'doped':'noDoped'; });

  plot.append('g')
    .attr('transform', 'translate(0,' + chart_dim.height + ')')
    .call(xAxis);

  plot.append('g')
    .call(yAxis);

  circles.on('mouseover', function(d) {
    var msg = d.Name + ":" + d.Nationality + "<br>Year: " + d.Year;
    msg += ", Time: " + d.Time + (d.Doping?"<br><br>" + d.Doping:"");
    divInfo
      .style('left', yearScale(d.Year) + 3.5*margins.left + 'px')
      .style('top', secScale(d.Seconds*1000) + margins.top + 'px')
      .style('opacity',0.9)
      .style('display','block')
      .html(msg);
  });

  circles.on('mouseout', function(d) {
    divInfo
      .style('display','none');
  });

  plot.append('g')
    .append('text');

  var divLegend = d3.select('body').append('div')
  .attr('id','legend');
  divLegend.append('div')
    .attr('class','legend_line')
    .append('text')
    .text('No doping allegations')
    .style('float', 'right')
    .append('div')
    .attr('class', 'legend_square')
    .attr('id', 'no_doped_sq');

  divLegend.append('div')
    .attr('class', 'legend_line')
    .append('text')
    .text('Riders with doping allegations')
    .style('float', 'right')
    .append('div')
    .attr('class', 'legend_square')
    .attr('id','doped_sq');

  plot.append('g')
    .attr('id', 'title')
    .append('text')
    .text('Doping in Professional Bicycle Racing')
    .attr('x',chart_dim.width/2)
    .attr('y', -40)
    .style('text-anchor','middle');

  plot.append('g')
    .attr('id', 'subtitle')
    .append('text')
    .text('35 Fastest times up Alpe d Huez')
    .attr('x',chart_dim.width/2)
    .attr('y', -10)
    .style('text-anchor','middle');

  plot.append('g')
    .append('text')
    .text('Time in minutes')
    .attr('transform', 'rotate(-90,0,0) translate(-150,-50)')
    .style('font-family','sans-serif')
}