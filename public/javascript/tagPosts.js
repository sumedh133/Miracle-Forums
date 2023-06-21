const tagForms = document.querySelectorAll('.tagForm');

tagForms.forEach((form) => {
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const isRemove = form.id === 'removeButtonForm';
        const message = isRemove ? 'Tag removed successfully' : 'Tag saved successfully';
        alert(message);
        form.submit();
    });
});