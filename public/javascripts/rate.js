document.addEventListener("click", async (e) => {
    const btn = e.target.closest(".rateBtn");
    if (!btn) return;

    const form = btn.closest(".rateform");
    const ratingInput = form.querySelector(".ratingInput");

    const { value: num } = await Swal.fire({
        title: "Give your best rating ⭐",
        input: "radio",
        inputOptions: {
            1: "1",
            2: "2",
            3: "3",
            4: "4",
            5: "5"
        },
        inputValidator: (value) => {
            if (!value) return "Please select a rating!";
        }
    });

    if (!num) return;

    ratingInput.value = Number(num);

    await Swal.fire({
        icon: "success",
        title: "Thank you!",
        text: "Your rating has been submitted."
    });

    form.submit();
});
