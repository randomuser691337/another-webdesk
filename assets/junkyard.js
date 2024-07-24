// WELCOME TO THE JUNKYARD
// Unused code that might have a use later.

// FILES SEARCHBAR

const search = tk.c('input', win.main, 'i1');
search.placeholder = "Search for any file...";
search.addEventListener('input', function (event) {
    items.innerHTML = "";
    thing.items.forEach(function (thing) {
        if (thing.path.includes(event.target.value)) {
            tk.cb('flist', thing.path, () => console.log(thing.path), items);
        }
    });
}); 