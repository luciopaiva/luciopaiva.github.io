
# X Reasons to Stop Using jQuery

Aug 17th, 2017

## Matching elements in a document

    const myElement = $('#my-element');
    const buttons = $('input[type=button]');

Vanilla Javascript:

    const myElement = document.getElementById('my-element');
    const buttons = document.querySelectorAll('input[type=button]');

## Manipulating attributes

    const html = $('html');
    const lang = html.attr('lang');
    html.attr('foo', 'bar');
    html.removeAttr('foo');

Vanilla Javascript:

    const html = document.querySelector('html');
    const lang = html.getAttribute('lang');
    html.setAttribute('foo', 'bar');
    html.removeAttribute('foo');

## Manipulating classes

    const someElement = $('#my-element');
    someElement.addClass('foo');
    someElement.hasClass('foo') === true;
    someElement.removeClass('foo');
    someElement.toggleClass('foo');

Vanilla Javascript:

    const someElement = document.getElementById('my-element');
    someElement.classList.add('foo');
    someElement.classList.contains('foo') === true;
    someElement.classList.remove('foo');
    someElement.classList.toggle('foo');

## Iteration

    const paragraphs = $('p');
    paragraphs.forEach(p => p.html('Using jQuery'));

Vanilla Javascript:

    const paragraphs = document.querySelectorAll('p');
    for (const p of paragraphs) {
        p.innerHTML = 'Using Vanilla Javascript';
    }

## Event listeners

    $('#my-button').click(() => console.info('Button was clicked'));

Vanilla Javascript:

    document.getElementById('my-button').addEventListener('click', () => console.info('Button was clicked'));

## DOM manipulation

    const container = $('#container');
    const child = $('<div>');
    const otherChild = child.clone();
    container.append(child);
    container.prepend(otherChild);

Vanilla Javascript:

    const container = document.getElementById('container');
    const child = document.createElement('div');
    const otherChild = child.cloneNode(true);
    container.appendChild(child);
    container.insertBefore(otherChild, container.firstChild);



