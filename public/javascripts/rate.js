const rate = document.getElementById("rate");
const rating = document.getElementById("rating");
const form = document.getElementById("rateform");

rate.addEventListener("click", async (e) => {
    e.preventDefault();
    const inputOptions = new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                1: "1",
                2: "2",
                3: "3",
                4: "4",
                5: "5"
            });
        }, 1000);
    });
    const { value: num } = await Swal.fire({
        title: "Give your best ratings!!",
        input: "radio",
        inputOptions,
        inputValidator: (value) => {
            if (!value) {
            return "You need to choose something!";
            }
        }
    });
    if (num) {
        rating.value = Number(num);
        console.log(rating.value);
        Swal.fire({ html: `Response submitted... Thank you!!` });
    }
    form.submit();
})