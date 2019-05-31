let isFocused = false;

document.addEventListener("keydown", () => {
    let search_container = document.getElementById("search_container");
    let search = document.getElementById("search");
    if (!isFocused) {
        if (!event.shiftKey && event.key == "Enter") {
            search_container.classList.add("show");
            search.focus();
            isFocused = true;
        }
    } else {
        if (!event.shiftKey && event.key == "Enter") {
            let reset = true;
            switch (search.value) {
                case "reset":
                case "restart":
                    game.restart();
                    break;
                case "stop":
                    game.stop();
                    break;
                case "start":
                    game.start();
                default:
                    console.warn("the command doesnt exist")
                    reset = false;
            }
            if (reset) search.value = "";
        }
        if (event.shiftKey && event.key == "Enter") {
            search_container.classList.remove("show");
            isFocused = false;
        }
    }
});