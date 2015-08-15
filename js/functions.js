var belonging_api_data	=	[];

function loadSelectBox(url,type,select_box_id) {
	var defaultOptions = [];
		
	defaultOptions.push('<option value=""></option>');
	
	//Loading the select box from pulling the data from api
	$.getJSON(url,function(data) {
		try {
			var response	= 	data,
				options		=	defaultOptions,
				selectElem	=	$("#" + select_box_id);
			
			var data_arr = [];
			for(var i in response)
				if( response.hasOwnProperty(i) )
					data_arr.push({id:response[i][type].id, name:response[i][type].name});
			
			data_arr.sort(function(a, b){
				 var nameA=a.name.toLowerCase(), nameB=b.name.toLowerCase()
				 if (nameA < nameB) //sort string ascending
				  return -1 
				 if (nameA > nameB)
				  return 1
				 return 0 //default return value (no sorting)
				});

			for(var i in data_arr)
				if( response.hasOwnProperty(i) )
					options.push('<option value="' + data_arr[i].id + '">' + data_arr[i].name + '</option>');
			
			selectElem
				.html(options.join('')) //Loading data to the select box
				.trigger("chosen:updated"); //Updating the chosen plugin with loaded options

		} catch(e) {
			console.log(e.message);
		}
	});
}

//Loading the canvas with disease data based on category
function loadBasedOnCategory(value) {
	$('#disease,#toxin').val('').trigger("chosen:updated");
	$.getJSON('http://pollutantapi-aaroncheng.rhcloud.com/category/getDiseases/' + value,function(data) {
		try {
			
			var api_data = [],
				count	=	1;
			if( data.hasOwnProperty('diseases') )
				for(var i in data.diseases) {
					api_data.push( { type:'disease', name:data.diseases[i]['name'], id:count++, color:'#1f77b4' } );
			}
			$(".current-status").html('<i>Diseases linked to '+value+' </i>');
			updateCanvas(api_data);
			
		} catch(e) {
			console.log(e.message);
		}
	});
}

function loadBasedOnDisease(value) {
	$('#category,#toxin').val('').trigger("chosen:updated");
	$.getJSON('http://pollutantapi-aaroncheng.rhcloud.com/disease/getToxins/' + value,function(data) {
		try {
			
			var api_data 	= 	[],
				count		=	1,
				color_code	=	'#1f77b4';
				
			if( data.hasOwnProperty('toxins') )
				for(var i in data.toxins) {
					if( data.toxins[i]['evidence_str'] == 1 ) // Strong
						color_code	=	'#d62728';
					else if( data.toxins[i]['evidence_str'] == 2 ) // Good
						color_code	=	'#FF7F0E';
					else if( data.toxins[i]['evidence_str'] == 3 ) // Limited
						color_code	=	'#2CA02C';
			
					api_data.push( { type:'toxin', name:data.toxins[i]['toxin'], id:count++, color:color_code } );
				}
			$(".current-status").html('<i>Causes linked to '+value+' </i>');
			updateCanvas(api_data);
			
		} catch(e) {
			console.log(e.message);
		}
	});
}

function loadBasedOnToxin(value) {
	$('#disease,#category').val('').trigger("chosen:updated");
	$.getJSON('http://pollutantapi-aaroncheng.rhcloud.com/toxin/getDiseases/' + value,function(data) {
		try {
			
			var api_data 	=	[],
				count		=	1,
				color_code	=	'#1f77b4';
			if( data.hasOwnProperty('diseases') )
				for(var i in data.diseases) {
					if( data.diseases[i]['evidence_str'] == 1 ) // Strong
						color_code	=	'#d62728';
					else if( data.diseases[i]['evidence_str'] == 2 ) // Good
						color_code	=	'#FF7F0E';
					else if( data.diseases[i]['evidence_str'] == 3 ) // Limited
						color_code	=	'#2CA02C';
					api_data.push( { type:'disease', name:data.diseases[i]['name'], id:count++, color:color_code } );
				}
			$(".current-status").html('<i>Diseases linked to '+value+' </i>');
			updateCanvas(api_data);
			
		} catch(e) {
			console.log(e.message);
		}
	});
}

function getBelongingDisease(id,value) {
	$.getJSON('http://pollutantapi-aaroncheng.rhcloud.com/category/getDiseases/' + value,function(data) {
		try {
			var api_data 	= 	[],
				count		=	1,
				color_code	=	'#1f77b4';
			if( data.hasOwnProperty('diseases') )
				for(var i in data.diseases) {
					if( data.diseases[i]['evidence_str'] == 1 ) // Strong
						color_code	=	'#d62728';
					else if( data.diseases[i]['evidence_str'] == 2 ) // Good
						color_code	=	'#FF7F0E';
					else if( data.diseases[i]['evidence_str'] == 3 ) // Limited
						color_code	=	'#2CA02C';
					api_data.push( { type:'disease', name:data.diseases[i]['name'], id:count++, color:color_code } );
				}
			
			var radius = ( ( count + 25 ) < 75 ) ? ( count + 25 ) : 75;
			
			if( api_data.length == 0 ) {
				radius = 25;
				d3.select("#node_" + id).each(function() { d3.select(this.parentNode).attr("class","no-child"); });
			}
			
			d3.select("#node_" + id)
					.transition()
					.attr("r",radius)
					.attr("data-r",radius);
			
			belonging_api_data[id] = api_data;
			
		} catch(e) {
			console.log(e.message);
		}
	}).fail(function() {
		d3.select("#node_" + id)
					.transition()
					.attr("r",25)
					.attr("data-r",25);
		d3.select("#node_" + id).each(function() { d3.select(this.parentNode).attr("class","no-child"); });
	});
}

function getBelongingToxin(id,value) {
	$.getJSON('http://pollutantapi-aaroncheng.rhcloud.com/disease/getToxins/' + value,function(data) {
		try {
			var api_data 	= 	[],
				count		=	1,
				color_code	=	'#1f77b4';
			if( data.hasOwnProperty('toxins') )
				for(var i in data.toxins) {
					if( data.toxins[i]['evidence_str'] == 1 ) // Strong
						color_code	=	'#d62728';
					else if( data.toxins[i]['evidence_str'] == 2 ) // Good
						color_code	=	'#FF7F0E';
					else if( data.toxins[i]['evidence_str'] == 3 ) // Limited
						color_code	=	'#2CA02C';
					api_data.push( { type:'toxin', name:data.toxins[i]['toxin'], id:count++, color:color_code } );
				}
			
			var radius = ( ( count + 25 ) < 75 ) ? ( count + 25 ) : 75;
			
			if( api_data.length == 0 ) {
				radius = 25;
				d3.select("#node_" + id).each(function() { d3.select(this.parentNode).attr("class","no-child"); });
			}

			d3.select("#node_" + id)
				.transition()
				.attr("r",radius)
				.attr("data-r",radius);
				
			belonging_api_data[id] = api_data;
			
		} catch(e) {
			console.log(e.message);
		}
	}).fail(function() {
		d3.select("#node_" + id)
					.transition()
					.attr("r",25)
					.attr("data-r",25);
		d3.select("#node_" + id).each(function() { d3.select(this.parentNode).attr("class","no-child"); });
	});
}

function canvasInit(root) {
	
	if( root.length == 0 )
		root	=	[{ type:'Not Found', name:'Not found', id:1 }];
		
	var width	= 	window.innerWidth - 17,
		height	=	window.innerHeight - 3 - 85,
		radius	=	50,
		format 	= 	d3.format(",d");

	var fill = d3.scale.category10();
	
	var force = d3.layout.force()
		.nodes(root)
		.size([width, height])
		.on("tick", tick)
		.gravity(.05)
		.distance(100)
		.charge(-200)
		.start();
	
	var svg = d3.select("#canvas").append("svg")
		.attr("width", width)
		.attr("height", height);
		
	var svgGroup = svg.append("g");
	
		
	node = svg.selectAll(".node")
		.data(root)
	  .enter().append("g");
	  
	  node.append("circle")
		.attr("class", "node")
		.attr("id", function(d) { return "node_" + d.id; })
		.attr("cx", function(d) { return d.x; })
		.attr("cy", function(d) { return d.y; })
		.attr("r", radius)
		.style("fill", function(d, i) { return d.color; })
		.style("stroke", function(d, i) { return '#000'; })
		.call(force.drag)
		.on("click", bubbleListener);
		
		
	node.append("title")
	  .text(function(d) { return d.name; });
	  
	  
	node.append("text")
		.attr("dy", ".03em")
		.attr("class", "wrap")
		.attr("x", function(d) { return d.x; })
		.attr("y", function(d) { return d.y; })
		.attr("font-size", "15px")
		.style("text-anchor", "middle")
		.attr("fill", "#fff")
		.text(function(d) { return d.name.substring(0, 3) + '...'; })
		.on("click", bubbleListener);

				
	svg.style("opacity", 1e-6)
	  .transition()
		.duration(1000)
		.style("opacity", 1);
		

	function bubbleListener(d) {
		if (d3.event.defaultPrevented) return;
		var id				=	d.id,
			g				=	d3.select(this.parentNode),
			circle			=	g.select("circle"),
			text			=	g.select("text"),
			is_same_bubble 	= 	false;
			
		if( circle.attr("r") == 150 ) 
			is_same_bubble = true;
		
		d3.selectAll("circle").each(function() {
			var radius = $(this).attr("data-r"); 
			d3.select(this).transition().attr("r",radius);
		});
		d3.selectAll("circle").attr("r", radius); 
		d3.selectAll(".nextlink").remove();
		d3.selectAll("text").text(function(d) { return d.name.substring(0, 3) + '...'; });
		
		if( ! is_same_bubble ) {
			circle.transition().attr("r", 150);
			text.text(function(d) { return d.name; });

			if( d.type != 'Not Found' && ! g.classed("no-child") ) {
				text
					.append('tspan')
					.attr("dy", "1em")
					.style("cursor", "pointer")
					.style("fill", "rgb(194, 175, 175)")
						.text("Click")
						.on("click",nextLinkListener);
			}
					
		}
		
		force.charge(function(d) {
			if( id == d.id && ! is_same_bubble ) return -1650;  
			return -200;
		});
		
		force.start(); 
		
	}
	
	function nextLinkListener(d) {
		if( typeof belonging_api_data[d.id] !== 'undefined' ) {
			updateCanvas(belonging_api_data[d.id]);
		} else {
			updateCanvas([]);
		}
		if( d.type == 'category' || d.type == 'toxin' )
			$(".current-status").html('<i>Diseases linked to '+d.name+' </i>');
		else	
			$(".current-status").html('<i>Causes linked to '+d.name+' </i>');
		belonging_api_data	=	[];
	}
	
	function tick(e) {
		node.select("circle").attr("cx", function(d) { return d.x = Math.max(radius, Math.min(width - radius, d.x)); })
        .attr("cy", function(d) { return d.y = Math.max(radius, Math.min(height - radius, d.y)); });
		
		node.select("text").attr("x", function(d) { return d.x; })
		  .attr("y", function(d) { return d.y; });
	}
	
	var force_nodes	=	force.nodes();
	
	if( force_nodes[0].type == 'disease' ) {
		for(var index in force_nodes)
			getBelongingToxin(force_nodes[index]['id'],force_nodes[index]['name']);
	} else {
		for(var index in force_nodes)
			getBelongingDisease(force_nodes[index]['id'],force_nodes[index]['name']);
	}

}

function updateCanvas(root) {
	d3.select("#canvas").select("svg").remove();
	$("#canvas").empty();
	canvasInit(root);
}


jQuery(function($) {
	
	
	if( $(".chosen").length ) {
		
		$(".chosen").chosen();
		
		loadSelectBox('http://pollutantapi-aaroncheng.rhcloud.com/category/index','Category','category');
		loadSelectBox('http://pollutantapi-aaroncheng.rhcloud.com/disease/index','Disease','disease');
		loadSelectBox('http://pollutantapi-aaroncheng.rhcloud.com/toxin/index','Toxin','toxin');
		
		$("#category,#disease,#toxin").change(function() {
			var _this		=	$(this),
				id			=	_this.attr("id"),
				value		=	_this.find("option:selected").text(),
				optionVal	=	_this.val();
			switch(id) {
				case 'category':
				
					if( optionVal != '' )
						loadBasedOnCategory(value);
					
					break;
				case 'disease':
				
					if( optionVal != '' )
						loadBasedOnDisease(value);

					break;
				case 'toxin':
					
					if( optionVal != '' )
						loadBasedOnToxin(value);
					
					break;
			}
		});
	}
	
	
	
	function setSectionHeight() {
		var windowHeight = window.innerHeight;
		$("#canvas, #canvas > svg").height(windowHeight - 85 - 3);
		var marginTop = ( windowHeight - 75 - $(".blocks.block1").outerHeight() ) / 2;
		$(".blocks.block1").css("margin-top", marginTop + "px");
	}
	
 	setSectionHeight();
	
	
	//Begin -- Pulling category data from API
	$.get("http://pollutantapi-aaroncheng.rhcloud.com/category/index",{},function(data) {
		
		var api_data 		= 	[];
		
		for(var i in data)
			api_data.push( { type:'category', name:data[i]['Category']['name'], id:data[i]['Category']['id'], color:'#1f77b4' } );

		canvasInit(api_data);
	});
	//End -- Pulling category data from API
	
	var timer1;
	$(window).resize(function() {
		clearTimeout(timer1);
		timer1	=	setTimeout(function() {
			setSectionHeight();
		},100);
	});
	
	
});
