var width = 800,
    height = 800,
    maxRadius = 390,
    pointRadius = 1;

var canvas = document.getElementById("canvas"),
    context = canvas.getContext("2d");
context.canvas.width = width;
context.canvas.height = height;



d3.json('./all.json', (err, data) => {
    data.forEach(d => {
        d.imageData = d['images_mainColors'].map((j, index) => {
            return {
                color: j, //array of [H, S, V]
                percent: d.images_mainColorPercentages[index],
                url: d.images.standard_resolution.url
            }
        });
        d.imageData.sort((a, b) => b.percent - a.percent);
        d.hour = new Date(d.timestamp['$date']).getHours();
        d.primaryColor = d.imageData[0];
        //radial coordinates of the image point
        d.theta = d.hour/24  * 2 * Math.PI; //in radians
        d.radialDistance = d.primaryColor.color[0] * maxRadius;
        d.x = d.radialDistance * Math.cos(d.theta) + 400;
        d.y = d.radialDistance * Math.sin(d.theta) + 400;
    });

    var simulation = d3.forceSimulation(data)
        // .drag(0.2)
        .alphaDecay(0.7)
        .force("x", d3.forceX().x(d => d.x).strength(0.4))
        .force("y", d3.forceY().y(d => d.y).strength(0.4))
        .force("collide", d3.forceCollide().radius(() => 2 * pointRadius).iterations(10));

    simulation.on('tick', () => {ticked(data)});
    simulation.on('end', () => {console.log('end', data)})

    function ticked() {
        context.clearRect(0, 0, width, height);
        context.save();

        data.forEach(function(d, i) {
            context.beginPath();
            context.moveTo(d.x + pointRadius, d.y);
            context.arc(d.x, d.y, pointRadius, 0, 2 * Math.PI);
            // context.fillStyle = 'blue';
            context.fillStyle = d3.hsv(d.primaryColor.color[0] * 360, 1, 1);
            // context.fillStyle = d3.hsv(d.primaryColor.color[0] * 360, d.primaryColor.color[1], d.primaryColor.color[2]);
            context.fill();
            // context.strokeStyle = d3.hsv(d.primaryColor.color[0] * 360, d.primaryColor.color[1], d.primaryColor.color[2]);
            // context.strokeStyle = 'blue';
            // context.stroke();
        });

        context.restore();
    }

});
