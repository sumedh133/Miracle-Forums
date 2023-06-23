const tagInput = document.getElementById('tagInput');
const tagSuggestions = document.getElementById('tagSuggestions');

tagInput.addEventListener('input', async (event) => {
  const enteredText = event.target.value;
  const tags = enteredText.split(',').map((tag) => tag.trim());
  const currentTagFragment = tags[tags.length - 1]; 

  tagSuggestions.innerHTML = '';

  if (currentTagFragment.length > 0) {
    const response = await fetch(`/tag/suggestions?searchText=${currentTagFragment}`);
    const matchedTags = await response.json();

    matchedTags.forEach((matchedTag) => {
      const suggestion = document.createElement('div');
      suggestion.textContent = matchedTag.name;
      suggestion.addEventListener('click', () => {
        const updatedTags = tags.slice(0, -1).concat(matchedTag.name).join(', ');
        tagInput.value = updatedTags; 
        tagSuggestions.innerHTML = ''; 
      });
      tagSuggestions.appendChild(suggestion);
    });
  }
});