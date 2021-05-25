function linspace(start, stop, num=100) {
    const step = (stop - start) / (num - 1);
    let arr = new Array(num);
    
    for (let i = 0; i < num; i++) {
        arr[i] = start + i * step;
    }

    return arr
}



function createArray(length) {
    var arr = new Array(length || 0),
        i = length;

    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        while(i--) arr[length-1 - i] = createArray.apply(this, args);
    }

    return arr;
}



function beamWidth(z, wavelength, z0) {
    const w0 = Math.sqrt(wavelength * z0 / Math.PI);
    let arr = new Array(0);

    z.forEach(function(i){
        arr.push(w0 * Math.sqrt(1 + Math.pow(i / z0, 2)))
    });

    return arr
}



function curvature(z, wavelength, z0) {
    let arr = new Array(0);

    z.forEach(function(i){
        // console.log(i)
        arr.push(i * (1 + Math.pow(z0 / i, 2)))
    });

    return arr
}



function laguerre(x, l, m) {
    if (m === 0) {
        return 1
    } else if (m === 1) {
        return 1 + l - x
    } else {
        return ((2*m-1+l-x)*laguerre(x, l, m-1) - (m-1-l)*laguerre(x, l, m-2)) / m
    }
}


function LaguerrePolyPlot(id) {
    const Figure = document.getElementById(id);
    let x = linspace(-5, 10, 100);
    let data = [];

    for (let l=0; l<4; l++) {
        for (let m=0; m<4; m++) {
            let arr = new Array(0);
            x.forEach(function(i){
                arr.push(laguerre(i, l, m))
            });
            trace = {
                x: x,
                y: arr,
                type: "scatter",
                mode: "lines",
                name: `l=${l} m=${m}`,
            };
            data.push(trace);
        }
    }

    let layout = {
        // title: "Hermite-Gaussian polynomial",
        titlefont: {
            size: 20,
        },
        showlegend: true,
        // legend: {"orientation": "h"},
        legend: {y:0.9},
        yaxis: {
            range: [-5,10],
            domain:[0.1, 0.9],
        },
        autosize: true,
        // automargin: true,
        margin: {
            b:30,
            t:30,
        },
    };

    let config = {responsive: true};

    Plotly.newPlot(id, data, layout, config);
}



function LaguerreGaussIPlot(id, wavelength, z0, z, l, m) {
    const Figure = document.getElementById(id);
    const w0 = Math.sqrt(wavelength * z0 / Math.PI);
    const w = w0 * Math.sqrt(1 + Math.pow(z/z0, 2));
    const M = 512, N = 512;

    let x = linspace(-3*w0, 3*w0, N);
    let y = linspace(-3*w0, 3*w0, M);
    
    let intensity = createArray(M, N);

    const w2 = w * w;
    const c = Math.pow(1 + Math.pow(z/z0, 2), -0.5);

    for (let i=0; i<M; i++) {
        for (let j=0; j<N; j++) {
            // x = x[j], y = y[i]
            var rho = Math.sqrt(x[j] * x[j] + y[i] * y[i]);
            var s = 2 * rho * rho / w2;
            var la = laguerre(s, l, m);
            var exp = Math.exp(-s);

            var inten = Math.pow(c * Math.pow(rho / w, l) * la, 2) * exp;

            intensity[i][j] = inten;
            // if (inten >= 1e-2) {
            //     intensity[i][j] = inten;
            // } else {
            //     intensity[i][j] = 0;
            // };
        };
    };


    let trace = {
        z: intensity,
        x: x,
        y: y,
        type: "heatmap",
        colorscale: "Jet",
        colorbar: {x: 0.85, len: 1},
    };

    let layout = {
        title: {
            text: "Intensity of LG" + `<sub>${l}</sub>` + `<sub>${m}</sub>`,
            font : {
                size: 20,
            },
        },
        autosize: true,
        xaxis: {domain:[0.25, 0.8]},
    };

    let data = [trace];
    let config = {responsive: true};

    Plotly.newPlot(id, data, layout, config);
}


window.addEventListener('load', function () {
    const wavelength = 632.8e-6;
    const z0 = 1.0;
    const w0 = Math.sqrt(wavelength * z0 / Math.PI);
    
    let z = linspace(-5, 5, 200);
    
    // Laguerre-Gaussian polynomial
    LaguerrePolyPlot("LaguerrePolyPlot", 3, 2);
    // Laguerre-Gaussian intensity in transverse plane
    LaguerreGaussIPlot("LaguerreGaussIPlot", wavelength, z0, z=0, 3, 1);
})





