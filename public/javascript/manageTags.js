
function handleSavedSortChange() {
    const selectedOption = document.getElementById('savedSortOption').value;
    const url = new URL(window.location.href);
    url.searchParams.set('savedSort', selectedOption);
    window.location.href = url.toString();
  }

  
  function handleUnsavedSortChange() {
    const selectedOption = document.getElementById('unsavedSortOption').value;
    const url = new URL(window.location.href);
    url.searchParams.set('unsavedSort', selectedOption);
    window.location.href = url.toString();
  }

  function validateSaveTags() {
    const checkboxes = document.querySelectorAll('#saveButton input[type="checkbox"]');
    let checked = false;
    
    for (let i = 0; i < checkboxes.length; i++) {
      if (checkboxes[i].checked) {
        checked = true;
        break;
      }
    }
    
    if (!checked) {
      alert('Please select at least one tag to save.');
      return false;
    }
  
    alert('Tag(s) saved successfully');
    return true;
  }
  
  function validateRemoveTags() {
    const checkboxes = document.querySelectorAll('#removeButton input[type="checkbox"]');
    let checked = false;
    
    for (let i = 0; i < checkboxes.length; i++) {
      if (checkboxes[i].checked) {
        checked = true;
        break;
      }
    }
    
    if (!checked) {
      alert('Please select at least one tag to remove.');
      return false;
    }
  
    alert('Tag(s) removed successfully');
    return true;
  }  

  
  function handleTagSuggestion(event) {
    const input = event.target.value.trim();
    const suggestedTagsContainer = document.getElementById('suggestedTags');

    
    suggestedTagsContainer.innerHTML = '';

    if (input.length === 0) {
      return;
    }

    
    fetch(`/suggestedTags?input=${input}`)
      .then(response => response.json())
      .then(data => {
        
        data.forEach(tag => {
          const listItem = document.createElement('li');
          const tagLink = document.createElement('a');
          tagLink.href = `/viewTagPosts/${tag._id}`;
          tagLink.textContent = tag.name;
          listItem.appendChild(tagLink);
          suggestedTagsContainer.appendChild(listItem);
        });
      })
      .catch(error => {
        console.error('Failed to fetch suggested tags:', error);
      });
  }