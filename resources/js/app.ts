import { debounce } from "./Console/Components/editor/util";

let searchInput = document.getElementById("search") as HTMLInputElement | null;
let searchResults = document.getElementById("search-results");
let searchIcon = document.getElementById("search-icon");
let spinner = document.getElementById("spinner-icon");
if (searchInput && searchResults && searchIcon && spinner) {
    let lastQuery = "";
    let searchItems: HTMLElement[] = [];
    let isActiveElementSearchOrResults = () =>
        document.activeElement == searchInput ||
        searchItems.indexOf(document.activeElement as any) !== -1;

    searchInput.addEventListener("focusin", () => {
        searchResults.hidden = false;

        if (searchInput.value !== lastQuery) {
            searchInput.dispatchEvent(new Event("input", { bubbles: true }));
        }
    });

    searchInput.addEventListener(
        "input",
        debounce((e: Event) => {
            let query: string = (e.target as HTMLInputElement).value;

            if (query === "") {
                searchResults.innerHTML = "";
                searchItems = [];
                return;
            }

            searchIcon.classList.toggle("hidden", true);
            spinner.classList.toggle("hidden", false);

            fetch(
                "/partials/preview-search-results?" +
                    new URLSearchParams({ query }),
            )
                .then((response) => response.text())
                .then((response) => {
                    searchResults.innerHTML = response;
                    searchItems = Array.from(
                        searchResults.querySelectorAll("ul > li > a") ?? [],
                    );

                    searchIcon.classList.toggle("hidden", false);
                    spinner.classList.toggle("hidden", true);
                    lastQuery = query;
                });
        }, 250),
    );

    searchResults.addEventListener("focusout", (e) => {
        if (searchResults.contains(e.relatedTarget as any)) {
            return;
        }

        searchResults.hidden = true;
    });

    window.addEventListener("click", (e) => {
        if (
            searchInput.contains(e.target as any) ||
            searchResults.contains(e.target as any)
        ) {
            return;
        }

        searchResults.hidden = true;
    });

    window.addEventListener("keydown", (e) => {
        if (searchItems.length === 0) {
            return;
        }

        if (e.key == "Escape" && isActiveElementSearchOrResults()) {
            e.preventDefault();
            searchInput.blur();
            searchResults.hidden = true;
        }

        if (e.key == "ArrowDown" || e.key == "ArrowUp") {
            if (!document.activeElement || !isActiveElementSearchOrResults()) {
                return;
            }

            let focusedItemIndex = searchItems.indexOf(
                document.activeElement as any,
            );

            e.preventDefault();
            let direction = e.key == "ArrowDown" ? 1 : -1;
            let nextIndex = focusedItemIndex + direction;
            if (nextIndex < 0) {
                nextIndex = searchItems.length - 1;
            }

            searchItems[nextIndex % searchItems.length].focus();
        }
    });
}
