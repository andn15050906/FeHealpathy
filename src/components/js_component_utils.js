export { createDiv, createLi }

const createDiv = (innerHTML, classList, id) => createElement("div", innerHTML, classList, id);
const createLi = (innerHTML, classList) => createElement("li", innerHTML, classList);

function createElement(tag, innerHTML, classList, id) {
    var element = document.createElement(tag);
    element.innerHTML = innerHTML;
    if (classList)
        element.classList = classList;
    if (id)
        element.id = id;
    return element;
}