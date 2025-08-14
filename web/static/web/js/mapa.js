document.addEventListener("DOMContentLoaded", function () {
    const tooltip = document.getElementById("map-tooltip");
    const tooltipImg = document.getElementById("tooltip-img");
    const tooltipTitle = document.getElementById("tooltip-title");
    const tooltipDesc = document.getElementById("tooltip-desc");

    // Selecciona solo las ciudades que te interesan
    const ciudades = ["quito", "guayaquil", "cuenca", "riobamba"];

    ciudades.forEach(id => {
        const ciudad = document.getElementById(id);
        if (!ciudad) return;

        ciudad.addEventListener("mouseenter", function (e) {
            tooltipImg.src = this.dataset.img;
            tooltipTitle.textContent = this.dataset.title;
            tooltipDesc.textContent = this.dataset.desc;

            tooltip.style.display = "block";
        });

        ciudad.addEventListener("mousemove", function (e) {
            tooltip.style.left = (e.pageX + 15) + "px";
            tooltip.style.top = (e.pageY + 15) + "px";
        });

        ciudad.addEventListener("mouseleave", function () {
            tooltip.style.display = "none";
        });
    });
});
