let isShown = false;

document.addEventListener("keydown", () => {
    let search_container = document.getElementById("search_container");
    let search = document.getElementById("search");
    if (!isShown) {
        if (!event.shiftKey && event.key == "Enter") {
            search_container.classList.add("show");
            search.focus();
            isShown = true;
        }
    } else {
        // general stuff to happen when writing
        clear_errors() // clear any errors when starting to write
        // general stuff to happen when writing
        if (!event.shiftKey && event.key == "Enter") {
            // test if search bar is focused
            if (search != document.activeElement) {
                search.focus();
                return;
            } 

            // process commands if its focused
            let reset = true;
            
            let args = search.value.split(" ");
            let command = args.shift();

            switch (command) {
                case "reset":
                case "restart":
                    game.restart();
                    break;
                case "stop":
                case "pause":
                    game.stop();
                    break;
                case "start":
                    game.start();
                    break;
                case "continue":
                    game.continue();
                    break;
                case "speed":
                    if (args[0] > 0 && args[0] <= 30) {
                        game.updateSpeed(args[0]);
                    } else {
                        show_error("New speed value is not valid or doesn't exist, it must be a value between 0 and 30")
                        reset = false;
                    }
                    break;
                default:
                    show_error("The command doesnt exist")
                    reset = false;
            }
            if (reset) search.value = "";
        }
        if (event.key == "Escape" || event.shiftKey && event.key == "Enter") {
            search_container.classList.remove("show");
            isShown = false;
        }
    }
});

function show_error(error) {
    let error_div = document.getElementById("error");
    error_div.innerHTML = error;
    error_div.style.opacity = "1";
}

function clear_errors() {
    let error_div = document.getElementById("error");
    error_div.innerHTML = "";
    error_div.style.opacity = "";
}