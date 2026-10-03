function openLab(labName) {
    if (labName === "geometry") {
        window.location.href = "geometry.html";
    } 
    else if (labName === "algebra") {
        window.location.href = "algebra.html";
    } 
    else if (labName === "trigonometry") {
        window.location.href = "trigonometry.html";
    } 
    else if (labName === "statistics") {
        window.location.href = "statistics.html";
    } 
    else if (labName === "probability") {
        window.location.href = "probability.html";
    } 
    else {
        alert("Lab not found!");
    }
}