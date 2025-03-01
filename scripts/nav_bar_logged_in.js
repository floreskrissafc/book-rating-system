function showNavigationMenu() {
    document.getElementById("navigation_links_container").style.width = "100vw";
}
function closeMenu() {
    document.getElementById("navigation_links_container").style.width = "0px";
}

let openDropdownMenuItemObjs = new Set();

function switchContentVisibility(num) {
    // Show or hide the menu elements on small screens
    if (window.matchMedia("(max-width: 700px)").matches) {
        var content_id = "dropdown_content_" + num;
        var caret_id = "caret_down_" + num;
        var caret = document.getElementById(caret_id);
        var content = document.getElementById(content_id);
        if (caret.className === "fa fa-caret-down") {
            caret.className = "fa fa-caret-up";
            content.style.height = "auto";
            openDropdownMenuItemObjs.add(num);
        } else {
            caret.className = "fa fa-caret-down";
            //content.style.height = "0px";
            content.style = "";
            openDropdownMenuItemObjs.delete(num);
        }
    }
}

function handleResize() {
    // If the window goes from small to big, the small screen menu should
    // close by itself and put back to its original state all the menu
    // items that could have been expanded
    if (window.matchMedia("(min-width: 701px)").matches) {
        closeMenu();
        for (const num of openDropdownMenuItemObjs) {
            var content_id = "dropdown_content_" + num;
            var caret_id = "caret_down_" + num;
            var caret = document.getElementById(caret_id);
            var content = document.getElementById(content_id);
            caret.className = "fa fa-caret-down";
        }
        openDropdownMenuItemObjs.clear(); // delete all elements
    }
}
window.addEventListener("resize", handleResize);
