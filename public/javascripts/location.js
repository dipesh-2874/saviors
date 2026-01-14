const locality = document.getElementById("loc");
const latitude = document.getElementById("lat");
const longitude = document.getElementById("long");
const form = document.getElementById("locform");

document.getElementById("reg").addEventListener("click", (e) => {
    e.preventDefault(); 

    if (!navigator.geolocation) {
        alert("Location isn't supported");
        return;
    }
    navigator.geolocation.getCurrentPosition(async (pos) => {
            const lat = pos.coords.latitude;
            const lon = pos.coords.longitude;

            try {
                const res = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
                );
                const data = await res.json();

                latitude.value = lat;
                longitude.value = lon;
                locality.value = data.address.city || data.address.county || "Unknown";

                form.submit();

            } catch (err) {
                console.error("Error fetching location", err);
            }
        },
        (err) => alert(err.message)
    );
});
