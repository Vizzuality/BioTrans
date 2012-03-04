$(function() {

    // Get the data
    var 
    temp_labels     = [],
transcribed     = [],
volunteers_data = [],
pending_data    = [],
temp_data       = [];

$(".data tfoot th").each(function() {
    temp_labels.push($(this).html());
});

$(".data tbody td.pos").each(function() {
    temp_data.push($(this).html());
});

$("#pending-data tbody td.pos").each(function() {
    pending_data.push($(this).html());
});

$("#pending tbody td.pos").each(function() {
    pending.push($(this).html());
});

$("#volunteers tbody td.pos").each(function() {
    volunteers.push($(this).html());
});

// Hide the data
$(".data").hide();

$("#temp_graph_holder").simplegraph(temp_data, temp_labels, {
    penColor: "#0099CC",
    fillColor: "#D6E4D0",
    fillUnderLine: true,
    lineWidth:4,
    fillOpacity: .8,
    minYAxisValue: 10,
    drawPoints: true,
    width:300,
    height:200,
    leftGutter:7,
    labelColor: "#777", 
    labelFont: "Arial", 
    labelFontSize: "14px",
    cpWidth:6,
    addHover: false
});
});
