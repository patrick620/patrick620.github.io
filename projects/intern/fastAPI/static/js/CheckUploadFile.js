function initFilenames() {
    var referenceMeasureFilename = document.getElementById('ref_measure_filename');
    var compareMeasureFilename = document.getElementById('compare_measure_filename');
    var referenceHeaderFilename = document.getElementById('ref_header_filename');
    var compareHeaderFilename = document.getElementById('compare_header_filename');

    referenceMeasureFilename.textContent = "";
    compareMeasureFilename.textContent = "";
    referenceHeaderFilename.textContent = "";
    compareHeaderFilename.textContent = "";
}


// Update filename of the uploaded files
window.addEventListener('change', function(e) {
    var referenceMeasureFile = document.getElementById('ref_measure_file');
    var compareMeasureFile = document.getElementById('compare_measure_file');
    var referenceHeaderFile = document.getElementById('ref_header_file');
    var compareHeaderFile = document.getElementById('compare_header_file');

    var referenceMeasureFilename = document.getElementById('ref_measure_filename');
    var compareMeasureFilename = document.getElementById('compare_measure_filename');
    var referenceHeaderFilename = document.getElementById('ref_header_filename');
    var compareHeaderFilename = document.getElementById('compare_header_filename');


    if (referenceMeasureFile.files.length > 0) {
        referenceMeasureFilename.textContent = referenceMeasureFile.files[0].name;
    }

    if (compareMeasureFile.files.length > 0) {
        compareMeasureFilename.textContent = compareMeasureFile.files[0].name;
    }

    if (referenceHeaderFile.files.length > 0) {
        referenceHeaderFilename.textContent = referenceHeaderFile.files[0].name;
    }

    if (compareHeaderFile.files.length > 0) {
        compareHeaderFilename.textContent = compareHeaderFile.files[0].name;
    }
})


window.addEventListener("change", function(e) {
    var uploadBotton = document.getElementById("submit-label");
    uploadBotton.disabled = true;
    
    var referenceMeasureFile = document.getElementById('ref_measure_file');
    var compareMeasureFile = document.getElementById('compare_measure_file');
    var referenceHeaderFile = document.getElementById('ref_header_file');
    var compareHeaderFile = document.getElementById('compare_header_file');

    if ((referenceMeasureFile.files.length > 0) & (compareMeasureFile.files.length > 0) & (referenceHeaderFile.files.length > 0) & (compareHeaderFile.files.length > 0)) {
        uploadBotton.disabled = false;
    }

    console.log(uploadBotton.disabled);

})


