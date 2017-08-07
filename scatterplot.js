d3.custom = {};
 
d3.custom.scatterplot = function module() {
	var margin = {top: 30, right: 40, bottom: 100, left: 30},
    	width = 450,
    	height = 400,
    	xValue ='Distance',
    	yValue='Taxonomic',
    	xLabel='Pairwise Distance',
    	yLabel = 'Beta Diversity (Taxonomic)',
    	landsea = 'Land',
    	_index = 0,
    	xlog='log';
    

    
    
    	var svg;
    
    	function exports(_selection) {
			_selection.each(function(_data) {
		
			var x
		
				if(xlog=='log'){
				
					 x = d3.scale.log()
					.range([0, width]);
				}else{
					 x = d3.scale.linear()
					.range([0, width]);
				}

				var y = d3.scale.linear()
					.range([height, 0]);


				var xAxis = d3.svg.axis()
					.scale(x)
					.orient("bottom")
					.tickFormat(function (d) {
						return x.tickFormat(4,d3.format(",d"))(d)
					});

				var yAxis = d3.svg.axis()
					.scale(y)
					.orient("left");

		
				if (!svg) {
					 svg = d3.select(this).append('svg');
					 var container = svg.append('g').classed('container-group'+_index, true);

				}
			
				svg.attr("width", width + margin.left + margin.right)
						.attr("height", height + margin.top + margin.bottom);
			
				container
						.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
					
				
				
				  _data = _data.filter(function(d){
						return d[yValue] != null;
				  }); 	
				  
				  console.log(_data);
				
				  x.domain(d3.extent(_data, function(d) { return d[xValue]; })).nice();
				  y.domain(d3.extent(_data, function(d) { return d[yValue]; })).nice();
				  //  y.domain([0,1]);
	

				   //x-axis labels
				  container.append("g")
					  .attr("class", "x axis")
					  .attr("transform", "translate(0," + height + ")")
					  .call(xAxis)
					  .selectAll("text")	
							.style("text-anchor", "end")
							.attr("dx", "-.8em")
							.attr("dy", ".15em")
							.attr("transform", function(d) {
								return "rotate(-65)" 
							});
   
				   //x-axis title label
					container.append("g")
					  .attr("class", "x axis")
					  .attr("transform", "translate(-5," + height + ")")
					  .append("text")
					  .attr("class", "label")
					  .attr("x", width)
					  .attr("y", -6)
					  .style("text-anchor", "end")
					  .text(xLabel);

				
				  
					  
					  
				if(yValue=='Taxonomic'){
					  
					container.selectAll(".dot"+_index)
					  .data(_data)
					  .enter().append("circle")
					  .attr("class", "dot")
					  .attr("r", 3.5)
					  .attr("cx", function(d) { return x(d[xValue]); })
					  .attr("cy", function(d) { return y(d[yValue]); })
					  .style("fill", '#000000')
					  .style("opacity",0.7);
	  			}else if(yValue == 'Phylogenetic'){
	  				
	  				container.selectAll(".dot"+_index)
					  .data(_data)
					  .enter().append("path")
      				  .attr("d", d3.svg.symbol().type("triangle-up"))
					  .attr("class", "dot")
					  .attr("transform", function(d){ return "translate(" + x(d[xValue]) + "," +y(d[yValue]) + ")"})
					  .style("fill", '#737373')
					  .style("opacity",0.7);
	  			
	  			}else if(yValue == 'Functional'){
	  			
	  				container.selectAll(".dot"+_index)
					  .data(_data)
					  .enter().append("path")
      				  .attr("d", d3.svg.symbol().type("cross"))
					  .attr("class", "dot")
					  .attr("transform", function(d){ return "translate(" + x(d[xValue]) + "," +y(d[yValue]) + ")"})
					  .style("fill", '#bdbdbd')
					  .style("opacity",0.7);
	  			
	  			
	  			}

		  
					  

					var ySeries = _data.map(function(d){return d[yValue]});

					//get the x and y values for least squares
					var xSeries = _data.map(function(d) { return d[xValue] });
		
		
		
					var dataArray=[];
		
					for (var i=0;i<xSeries.length;i++){
						var indvArray = [];
						indvArray.push(xSeries[i],ySeries[i]);
						dataArray.push(indvArray);
			
						
					}
		
		
					var result= regression('linear', dataArray);
					var slope = result.equation[0];
					var yIntercept = result.equation[1];
		
		
		
					// apply the reults of the least squares regression
		
					var x1 = d3.min(xSeries);
					var y1= slope*x1+ yIntercept;
					var x2= d3.max(xSeries);
					var y2 = slope*x2 + yIntercept;
					var trendData= [[x1,y1,x2,y2]];
		
		
					var trendline= container.selectAll(".trendline"+_index)
						.data(trendData);
						
						
						trendline.enter()
						.append("line")
						.attr("class", "trendline")
						.attr("x1", function(d) { return x(d[0]); })
						.attr("y1", function(d) { return y(d[1]); })
						.attr("x2", function(d) { return x(d[2]); })
						.attr("y2", function(d) { return y(d[3]); })
						.attr("stroke-width", 2);

			
				if(yValue=='Taxonomic'){
					  
					  trendline.attr("stroke", "#000000");
				
	  			}else if(yValue == 'Phylogenetic'){
	  			
	  				  trendline.attr("stroke", "#737373");
	  			
	  			}else if(yValue == 'Functional'){
	  			
	  				  trendline.attr("stroke", "#bdbdbd");
	  			
	  			
	  			}
			
			
				 //y-axis title label
				  container.append("g")
					  .attr("class", "y axis")
					  .call(yAxis)
					  .append("text")
					  .attr("class", "label")
					  .attr("transform", "rotate(-90)")
					  .attr("y", 6)
					  .attr("dy", ".71em")
					  .style("text-anchor", "end")
					  .text(yLabel);
					
					  
					  
					  
					  

			})
	
		}
		
		exports.xValue = function(value) {
			if (!arguments.length) return xValue;
			xValue = value;
			return this;
		}
		
	
		exports.yValue = function(value) {
			if (!arguments.length) return yValue;
			yValue = value;
			return this;
		}
		
		exports.xLabel = function(value) {
			if (!arguments.length) return xLabel;
			xLabel = value;
			return this;
		}
		
		exports.yLabel = function(value) {
			if (!arguments.length) return yLabel;
			yLabel = value;
			return this;
		}
		
		exports.landsea = function(value) {
			if (!arguments.length) return _index;
			_index = value;
			return this;
		}
	
		exports._index = function(value) {
			if (!arguments.length) return _index;
			_index = value;
			return this;
		}
		
		exports.xlog = function(value) {
			if (!arguments.length) return xlog;
			xlog = value;
			return this;
		}
	
	
		return exports;

}








  




  

	


