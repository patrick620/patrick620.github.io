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



function GaussianWPlot(id, z, wavelength, z0) {
    let w1 = beamWidth(z, wavelength, z0);

    let w2 = new Array(0);
    w1.forEach(function(z){
        w2.push(-z)
    });

    let theta1 = new Array(0);
    z.forEach(function(i){
        theta1.push(Math.sqrt(wavelength / (z0 * Math.PI)) * i)
    })

    let theta2 = new Array(0);
    z.forEach(function(i){
        theta2.push(-Math.sqrt(wavelength / (z0 * Math.PI)) * i)
    })

    let trace1 = {
        x: z,
        y: w1,
        type: 'scatter',
        mode: 'lines',
        marker: {color: 'blue'},
        fill: "tozeroy",
        fillcolor:'rgba(168,168,168,0.3)',
    };
    let trace2 = {
        x: z,
        y: w2,
        type: 'scatter',
        mode: 'lines',
        marker: {color: 'blue'},
        fill: "tozeroy",
        fillcolor:'rgba(168,168,168,0.3)',
    };
    let trace3 = {
        x: z,
        y: theta1,
        type: 'scatter',
        mode: 'lines',
        marker: {color: 'red'},
        line: {dash: 'dash'},
    };
    let trace4 = {
        x: z,
        y: theta2,
        type: 'scatter',
        mode: 'lines',
        marker: {color: 'red'},
        line: {dash: 'dash'}
    };

    let data = [trace1, trace2, trace3, trace4];
    let layout = {
        xaxis: {
            title: 'z (mm)',
            titlefont: {size: 20},
        },
        yaxis: {
            title: 'W(z)',
            titlefont: {size: 20},
        },
        showlegend: false,
        autosize: true,
    };
    let config = {responsive: true};

    Plotly.newPlot(id, data, layout, config);
}



function GaussianRPlot(id, z, wavelength, z0) {
    let r1 = curvature(z, wavelength, z0);
    let r2 = z.slice();

    let trace1 = {
        x: z,
        y: r1,
        type: 'scatter',
        mode: 'lines',
        marker: {color: 'blue'},
        name: 'Gaussian',
        fill: "tozeroy",
        fillcolor:'rgba(168,168,168,0.3)',
    };

    let trace2 = {
        x: z,
        y: r2,
        type: 'scatter',
        mode: 'lines',
        marker: {color: 'red'},
        line: {dash: 'dash'},
        name: 'Spherical',
    };

    let data = [trace1, trace2];
    let layout = {
        xaxis: {
            title: 'z (mm)',
            titlefont: {size: 20},
        },

        yaxis: {
            title: 'R(z)',
            titlefont: {size: 20},
            range: [-30, 30],
        },
        showlegend: true,
        autosize: true,
    };
    let config = {responsive: true};

    Plotly.newPlot(id, data, layout, config);
}



function GouyPhasePlot(id, z, wavelength, z0) {
    let phase = new Array(0);
    let line1 = new Array(z.length).fill(Math.PI / 2);
    let line2 = new Array(z.length).fill(-Math.PI / 2);

    z.forEach(function(i) {
        phase.push(Math.atan(i/z0));
    });

    let trace1 = {
        x: z,
        y: phase,
        type: 'scatter',
        mode: 'lines',
        marker: {color: 'blue'},
        name: 'Gouy phase',
        fill: "tozeroy",
        fillcolor:'rgba(168,168,168,0.3)',
    };

    let trace2 = {
        x: z,
        y: line1,
        type: 'scatter',
        mode: 'lines',
        marker: {color: 'red'},
        line: {dash: 'dash'},
        name: '𝜋/2',
    };

    let trace3 = {
        x: z,
        y: line2,
        type: 'scatter',
        mode: 'lines',
        marker: {color: 'red'},
        line: {dash: 'dash'},
        name: '-𝜋/2',
    };

    let data = [trace1, trace2, trace3];
    let layout = {
        xaxis: {
            title: 'z (mm)',
            titlefont: {size: 20},
        },

        yaxis: {
            title: 'ζ(z) (rad)',
            titlefont: {size: 20},
        },
        showlegend: true,
        autosize: true,
    };
    let config = {responsive: true};

    Plotly.newPlot(id, data, layout, config);
};



function GaussianTransIPlot(id, wavelength, z0, z=0) {
    const w0 = Math.sqrt(wavelength * z0 / Math.PI);
    const w = w0 * Math.sqrt(1 + Math.pow(z / z0, 2));
    const M = 256, N = 256;
    let x = linspace(-3*w0, 3*w0, M)
    let y = linspace(-3*w0, 3*w0, N)
    let intensity = createArray(M, N);
    for (let i = 0; i < M; i++) {
        for (let j = 0; j < N; j++) {
            rho = Math.sqrt(Math.pow(x[i], 2) + Math.pow(y[j], 2))
            // console.log(rho[i][j])
            intensity[i][j] = Math.pow(w0 / w, 2) * Math.exp(-2 * Math.pow(rho / w, 2))
        }
    }

    let trace = {
        z: intensity,
        x: x,
        y: y,
        type: 'heatmap',
        colorscale: 'Jet',
        colorbar: {x: 0.85, len: 1},
    };

    let data = [trace];
    let layout = {
        xaxis: {domain:[0.25, 0.8]},
        yaxis: {scaleratio: 1},
        autosize: true,
    };
    let config = {responsive: true};
    Plotly.newPlot(id, data, layout, config);
}


function GaussianSideIPlot1d(id, z, wavelength, z0) {
    const w0 = Math.sqrt(wavelength * z0 / Math.PI);
    let intensity = new Array(0);
    z.forEach(function(i){
        intensity.push(1 / (1 + Math.pow(i / z0, 2)));
    });


    let trace = {
        x: z,
        y: intensity,
        type: 'scatter',
        mode: 'lines',
        marker: {color: 'red'},
        fill: "tozeroy",
        fillcolor:'rgba(168,168,168,0.3)',
    };

    let layout = {
        xaxis: {
            title: 'z (mm)',
            titlefont: {
                size: 20,
            },
        },

        yaxis: {
            title: 'Normalized intensity',
            titlefont: {
                size: 20,
            },
        },
        autosize: true,
    };
    let data = [trace];
    let config = {responsive: true};
    Plotly.newPlot(id, data, layout, config);
    }

// ----------------------------------------------------------------

function GaussianSideIPlot2d(id, wavelength, z0) {
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
        colorbar: {x: 1, len: 0.7},

    };
    let trace2 = {
        x: z,
        y: w1,
        type: 'scatter',
        mode: 'lines',
        marker: {color: "rgba(255,28,174,1)"},
        line: {dash: 'dash'},
    };
    let trace3 = {
        x: z,
        y: w2,
        type: 'scatter',
        mode: 'lines',
        marker: {color: "rgba(255,28,174,1)"},
        line: {
            dash: 'dash',
        },
    };

    let data = [trace1, trace2, trace3];
    let layout = {
        // title: {
        //     text: 'Intensity distribution in y-z plane',
        //     font: {
        //         size: 20,
        //     },
        // },
        showlegend: false,
        autosize: true,
        yaxis:{domain: [0.15, 0.85]},
    };
    let config = {responsive: true};

    Plotly.newPlot(id, data, layout, config);
}


// ----------------------------------------------------------------

function GaussianSideWFPlot(id, wavelength, z0) {
    const w0 = Math.sqrt(wavelength * z0 / Math.PI);
    const k = 2 * Math.PI / wavelength;
    const M = 512, N = 512;
    let y = linspace(-3*w0, 3*w0, M)
    let z = linspace(-3*z0, 3*z0, N)
    let sideWF = createArray(M, N);    
    let w1 = beamWidth(z, wavelength, z0);
    let w2 = new Array(0);
    w1.forEach(function(z){
        w2.push(-z)
    });

    for (let i = 0; i < M; i++) {
        for (let j = 0; j < N; j++) {
            // y = y[i]; z = z[j];
            w = w0 * Math.pow((1 + Math.pow(z[j] / z0, 2)), 0.5);
            c = Math.pow((1 + Math.pow(z[j] / z0, 2)), -0.5);
            r = z[j] * (1 + Math.pow(z0 / z[j], 2));
            zeta = Math.atan(z[j] / z0);

            amp = c * Math.exp(-Math.pow(y[i] / w, 2));
            phase = k * z[j] + k * Math.pow(y[i], 2) / (2 * r) - zeta;

            u = amp * Math.cos(phase);

            sideWF[i][j] = Math.pow(Math.abs(u), 2);
        }
    }

    let trace1 = {
        z: sideWF,
        x: z,
        y: y,
        type: 'heatmap',
        colorscale: 'Jet',
        colorbar: {x: 1, len: 0.7},
    };
    let trace2 = {
        x: z,
        y: w1,
        type: 'scatter',
        mode: 'lines',
        marker: {color: "rgba(255,28,174,1)"},
        line: {dash: 'dash'},
    };
    let trace3 = {
        x: z,
        y: w2,
        type: 'scatter',
        mode: 'lines',
        marker: {color: "rgba(255,28,174,1)"},
        line: {dash: 'dash'},
    };

    let data = [trace1, trace2, trace3];
    let layout = {
        // title: {
        //     text: 'Wavefront in y-z plane',
        //     font: {
        //         size: 20,
        //     },
        // },
        xaxis: {
            title: "z (mm)",
            font: {
                size: 20,
            },
        },
        yaxis: {
            title: "ρ (mm)",
            font: {
                size: 20,
            },
            domain: [0.15, 0.85],
        },
        showlegend: false,
        autosize: true,
    };
    let config = {responsive: true};

    Plotly.newPlot(id, data, layout, config);
}

// ----------------------------------------------------------------


function GaussianIPlot3d(id, wavelength, z0) {
    const w0 = Math.sqrt(wavelength * z0 / Math.PI);
    const M = 32, N = 32;
    let x = linspace(-3*w0, 3*w0, M)
    let y = linspace(-3*w0, 3*w0, M)
    let z = linspace(-3*z0, 3*z0, N)
    let xc = new Array(0);
    let yc = new Array(0);
    let zc = new Array(0);
    let intensity = new Array(0);
    
    for (let k = 0; k < N; k++) {
        w = w0 * Math.sqrt(1 + Math.pow(z[k] / z0, 2));
        c = 1 / (1 + Math.pow(z[k] / z0, 2));
        w2 = w * w;
        for (let i = 0; i < M; i++) {
            for (let j = 0; j < M; j++) {
                rho2 = x[i] * x[i] + y[j] * y[j];
                iten = c * Math.exp(-2 * rho2 / w2);
                xc.push(x[i]);
                yc.push(y[j]);
                zc.push(z[k]);
                intensity.push(c * Math.exp(-2 * rho2 / w2));
            };
        };
    };
    let trace = {
        type: 'volume',
        x: xc,
        y: yc,
        z: zc,
        value: intensity,
        opacity: 0.1,

    };
    let data = [trace];
    let layout = {
        showlegend: false,
        autosize: true,
    };
    let config = {responsive: true};
    Plotly.newPlot(id, data, layout, config);
}



// ----------------------------------------------------------------

function GaussianTransI(wavelength, z0, z=0) {
    const w0 = Math.sqrt(wavelength * z0 / Math.PI);
    const w = w0 * Math.sqrt(1 + Math.pow(z / z0, 2));
    const M = 256, N = 256;
    let x = linspace(-3*w0, 3*w0, M)
    let y = linspace(-3*w0, 3*w0, N)
    let intensity = createArray(M, N);
    
    for (let i = 0; i < M; i++) {
        for (let j = 0; j < N; j++) {
            rho = Math.sqrt(Math.pow(x[i], 2) + Math.pow(y[j], 2))
            // console.log(rho[i][j])
            intensity[i][j] = Math.pow(w0 / w, 2) * Math.exp(-2 * Math.pow(rho / w, 2))
        }
    }
    let trace = {
        z: intensity,
        x: x,
        y: y,
        type: 'heatmap',
        colorscale: 'Jet',
        xaxis: "x",
        yaxis: "y",
    };

    return trace;
}


// ----------------------------------------------------------------



function GaussianSideI2d(wavelength, z0) {
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
            intensity[i][j] = Math.pow(w0 / w, 2) * Math.exp(-2 * Math.pow(rho / w, 2))
        }
    };
    let trace1 = {
        z: intensity,
        x: z,
        y: y,
        type: 'heatmap',
        colorscale: 'Jet',
        zmin: 0,
        zmax: 1,
        xaxis: 'x2',
        yaxis: 'y2',
    };
    let trace2 = {
        x: z,
        y: w1,
        type: 'scatter',
        mode: 'lines',
        marker: {color: "rgba(255,28,174,1)"},
        line: {dash: "dash"},
        xaxis: 'x2',
        yaxis: 'y2',
    };
    let trace3 = {
        x: z,
        y: w2,
        type: 'scatter',
        mode: 'lines',
        marker: {color: "rgba(255,28,174,1)"},
        line: {dash: 'dash'},
        xaxis: 'x2',
        yaxis: 'y2',
    };

    return [trace1, trace2, trace3];
}



function GaussianTransIPlotBind (id, wavelength, z0, z_plane=0) {
    let outputs = GaussianSideI2d(wavelength, z0);
    let trace1 = GaussianTransI(wavelength, z0, z=0);
    let trace2 = outputs[0];
    let trace3 = outputs[1];
    let trace4 = outputs[2];
    let data = [trace1, trace2, trace3, trace4];
    let layout = {
        showlegend: false,
        autosize: true,
        xaxis: {domain: [0, 0.15]},
        yaxis: {domain: [0.075, 0.925]},
        xaxis2: {domain: [0.2, 1], anchor:'y2'},
        yaxis2: {anchor: 'x2'},
    };
    let config = {responsive: true};

    Plotly.newPlot(id, data, layout, config);
}





window.addEventListener('load', function () {
    const wavelength = 632.8e-6;
    const z0 = 1.0;
    const w0 = Math.sqrt(wavelength * z0 / Math.PI);
    
    let z = linspace(-5, 5, 200);
    
    // Beam width
    GaussianWPlot('GaussianWPlot', z, wavelength, z0);
    
    // Radius of curvature
    GaussianRPlot('GaussianRPlot', z, wavelength, z0);
    
    // Gouy phase
    GouyPhasePlot("GouyPhasePlot", z, wavelength, z0);

    // Normalized intensity on the beam axis
    GaussianSideIPlot1d('GaussianSideIPlot1d', z, wavelength, z0);

    
    // Intensity distribution in transverse plane
    GaussianTransIPlot('GaussianTransIPlot', wavelength, z0)

    // Intensity distribution in y-z plane
    GaussianSideIPlot2d('GaussianSideIPlot2d', wavelength, z0)

    // Intensity distribution in transverse plane + Intensity distribution in y-z plane
    // GaussianTransIPlotBind("GaussianTransIPlotBind", wavelength, z0, z=0);
    
    // GaussianSideWFPlot
    GaussianSideWFPlot('GaussianSideWFPlot', wavelength, z0);

    // Gaussian 3d plot (from json file)
    var url = "../assets/js/projects/Gaussian-optics/Gaussian3dPlot.js"
    // Figure = document.getElementById("GaussianIPlot3d")
    Plotly.d3.json(url, function(figure){
        let data = figure.data;
        let layout = figure.layout;
        let config = {responsive: true};
        Plotly.newPlot("GaussianIPlot3d", data, layout, config);
    });
    // GaussianIPlot3d("GaussianIPlot3d", wavelength, z0);
});


















