// Make monochrome colors
var pieColors = (function () {
    var colors = ['#007bff','#cf3546','#be7e19','#009d8c','#a620a2','#a62045','#19be9f'],
        base = Highcharts.getOptions().colors[0],
        i;

    for (i = 0; i < 10; i += 1) {
        // Start out with a darkened base color (negative brighten), and end
        // up with a much brighter color
        colors.push(Highcharts.Color(base).brighten((i - 3) / 7).get());
    }
    return colors;
}());

// Build the chart
Highcharts.chart('container', {
    chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie'
    },
    title: {
        text: ''
    },
    tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
    },
    plotOptions: {
        pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            colors: pieColors,
            dataLabels: {
                enabled: true,
                format: '{point.name}',
                distance: -50,
                filter: {
                    property: 'percentage',
                    operator: '>',
                    value: 4
                }
            }
        }
    },                   
    series: [{
        name: 'Tokenomics',
        data: [
            { name: 'AirDrop', y: 5 },
            { name: 'Public Sale', y: 25 },
            { name: 'Private Sale', y: 25 },
            { name: 'Staking', y: 20 },
            { name: 'Team', y: 10 },
            { name: 'Reserve', y: 15 }
            
        ]
    }]
});