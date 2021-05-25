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



function hermite(x, order) {
    if (order === 0) {
        return 1
    } else if (order === 1) {
        return 2 * x
    } else {
        return 2 * x * hermite(x, order-1) - 2 * (order - 1) * hermite(x, order-2)
    }
}


function hermiteGauss(x, order) {
    var h = hermite(x, order);
    return h * Math.exp(- x * x / 2)
}




// function HermiteGaussianPolyPlot(id, order) {
//     x = linspace(-6, 6, 500);
//     let arr = new Array(0);

//     x.forEach(function(i){
//         arr.push(hermiteGauss(i, order))
//     });

//     const Figure = document.getElementById(id);

//     let trace = {
//         x: x,
//         y: arr,
//         type: "scatter",
//         mode: "lines",
//         marker: {
//             color: "red",
//         },
//         name: "order=" + order,
//         fill: "tozeroy",
//         fillcolor:'rgba(168,168,168,0.3)',
//     };

//     let layout = {
//         // title: "Hermite-Gaussian polynomial",
//         titlefont: {
//             size: 20,
//         },
//         showlegend: true,
//         autosize: true,
//     };

//     let data = [trace];
//     let config = {responsive: true};

//     Plotly.newPlot(id, data, layout, config);
// }



function HermiteGaussianPolyPlot(id) {
    const Figure = document.getElementById(id);
    let x = linspace(-6, 6, 500);
    let data = [];

    for (let order=0; order<8; order++) {
        let arr = new Array(0);
            x.forEach(function(i){
                arr.push(hermiteGauss(i, order))
            });
        trace = {
            x: x,
            y: arr,
            type: "scatter",
            mode: "lines",
            name: `order=${order}`,
        };
        data.push(trace);
    }

    let layout = {
        // title: "Hermite-Gaussian polynomial",
        // titlefont: {
        //     size: 20,
        // },
        showlegend: true,
        // yaxis: {
        //     range: [-5,10],
        // },
        autosize: true,
        // automargin: true,
        // margin: {
        //     b:30,
        //     t:30,
        // },
    };

    let config = {responsive: true};

    Plotly.newPlot(id, data, layout, config);
}









function HermiteGaussIPlot(id, wavelength, z0, z, l, m) {
    const Figure = document.getElementById(id);
    const w0 = Math.sqrt(wavelength * z0 / Math.PI);
    const w = w0 * Math.sqrt(1 + Math.pow(z/z0, 2));
    const k = 2 * Math.PI / wavelength;
    const M = 512, N = 512;

    let x = linspace(-3*w0, 3*w0, N)
    let y = linspace(-3*w0, 3*w0, M)
    
    let intensity = createArray(M, N);

    const c = w0 / w;
    const s = Math.sqrt(2) / w;

    for (let i=0; i<M; i++) {
        for (let j=0; j<N; j++) {
            // x = x[j], y = y[i]
            
            hg_x = hermiteGauss(x[j] * s, l);
            hg_y = hermiteGauss(y[i] * s, m);

            intensity[i][j] = Math.pow(c * hg_x * hg_y, 2);
        }
    };


    let trace = {
        z: intensity,
        x: x,
        y: y,
        type: "heatmap",
        colorscale: "Jet",
        colorbar: {x: 0.85, len: 1},
    };

    // console.log(`<sub>${l}</sub>`)


    let layout = {
        title: {
            text: "Intensity of HG" + `<sub>${l}</sub>` + `<sub>${m}</sub>`,
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




function HermiteGaussSideIPlot2d(id, wavelength, z0) {
    const Figure = document.getElementById(id);
    const w0 = Math.sqrt(wavelength * z0 / Math.PI);
    const M = 256, N = 256;

    let y = linspace(-3*w0, 3*w0, M)
    let z = linspace(-3*z0, 3*z0, N)
    
    let w1 = beamWidth(z, wavelength, z0);
    let w2 = new Array(0);
    w1.forEach(function(z){
        w2.push(-z)
    });
    let intensity = createArray(M, N);
    
    for (let i = 0; i < M; i++) {
        for (let j = 0; j < N; j++) {
            rho = y[i]
            w = w0 * Math.sqrt(1 + Math.pow(z[j] / z0, 2));
            // console.log(rho[i][j])
            intensity[i][j] = Math.pow(w0 / w, 2) * Math.exp(-2 * Math.pow(rho / w, 2))
        }
    }
 
    let trace1 = {
        z: intensity,
        x: z,
        y: y,
        type: 'heatmap',
        colorscale: 'Jet',
        zmin: 0,
        zmax: 1,

    };
    let trace2 = {
        x: z,
        y: w1,
        type: 'scatter',
        // name: "Beam width",
        mode: 'lines',
        marker: {
            // color: 'black',
            color: "rgba(255,28,174,1)"
        },
        line: {
            dash: 'dash',
        },
    };
    let trace3 = {
        x: z,
        y: w2,
        type: 'scatter',
        // name: "Beam width",
        mode: 'lines',
        marker: {
            // color: 'black',
            color: "rgba(255,28,174,1)"
        },
        line: {
            dash: 'dash',
        },
    };

    let data = [trace1, trace2, trace3];
    let layout = {
        title: {
            text: 'Intensity distribution in y-z plane',
            font: {
                size: 20,
            },
        },
        showlegend: false,
        autosize: true,
        // coloraxis: {
        //     colorscale: 'RdBu',
        //     cmin: 0,
        //     cmax: 1,
        // },
    };

    let config = {responsive: true};

    Plotly.newPlot(id, data, layout, config);
}








window.addEventListener('load', function () {
    const wavelength = 632.8e-6;
    const z0 = 1.0;
    const w0 = Math.sqrt(wavelength * z0 / Math.PI);
    
    let z = linspace(-5, 5, 200);
    
    // Hermite-Gaussian polynomial
    HermiteGaussianPolyPlot("HermiteGaussianPolyPlot");
    // Hermite-Gaussian intensity in transverse plane
    HermiteGaussIPlot("HermiteGaussIPlot", wavelength, z0, 0, 1, 1);
})







