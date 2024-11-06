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

 // Function to handle upvote button click
 function upvote(postId) {
    const upvoteButton = document.getElementById(`upvoteButton_${postId}`);
    const downvoteButton = document.getElementById(`downvoteButton_${postId}`);
    const voteCountElement = document.getElementById(`voteCount_${postId}`);

    if (!upvoteButton.classList.contains('upvoted')) {
    if (downvoteButton.classList.contains('downvoted')) {
        // Cancel the downvote
        const currentVotes = parseInt(voteCountElement.innerText);
        voteCountElement.innerText = currentVotes + 1;
        downvoteButton.classList.remove('downvoted');
        sendVoteRequest(`/posts/${postId}/downvote`);
    }

    // Send an HTTP request to upvote the post
    sendVoteRequest(`/posts/${postId}/upvote`);

    // Update the vote count on the page
    const currentVotes = parseInt(voteCountElement.innerText);
    voteCountElement.innerText = currentVotes + 1;

    // Toggle the upvote button class
    upvoteButton.classList.toggle('upvoted');
    } else {
    // Cancel the upvote
    const currentVotes = parseInt(voteCountElement.innerText);
    voteCountElement.innerText = currentVotes - 1;
    upvoteButton.classList.remove('upvoted');
    sendVoteRequest(`/posts/${postId}/upvote`);
    }
}

// Function to handle downvote button click
function downvote(postId) {
    const upvoteButton = document.getElementById(`upvoteButton_${postId}`);
    const downvoteButton = document.getElementById(`downvoteButton_${postId}`);
    const voteCountElement = document.getElementById(`voteCount_${postId}`);

    if (!downvoteButton.classList.contains('downvoted')) {
    if (upvoteButton.classList.contains('upvoted')) {
        // Cancel the upvote
        const currentVotes = parseInt(voteCountElement.innerText);
        voteCountElement.innerText = currentVotes - 1;
        upvoteButton.classList.remove('upvoted');
        sendVoteRequest(`/posts/${postId}/upvote`);
    }

    // Send an HTTP request to downvote the post
    sendVoteRequest(`/posts/${postId}/downvote`);

    // Update the vote count on the page
    const currentVotes = parseInt(voteCountElement.innerText);
    voteCountElement.innerText = currentVotes - 1;

    // Toggle the downvote button class
    downvoteButton.classList.toggle('downvoted');
    } else {
    // Cancel the downvote
    const currentVotes = parseInt(voteCountElement.innerText);
    voteCountElement.innerText = currentVotes + 1;
    downvoteButton.classList.remove('downvoted');
    sendVoteRequest(`/posts/${postId}/downvote`);
    }
}

// Function to send vote request to the server
function sendVoteRequest(url) {
    fetch(url, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        // Add any necessary headers, such as authentication tokens
    },
    // You can add a body if needed for additional data
    })
    .then(response => {
        if (response.ok) {
        // Handle successful response if necessary
        } else {
        throw new Error('Vote request failed');
        }
    })
    .catch(error => {
        console.error(error);
        // Handle error case if necessary
    });
}
function sortPosts(sortBy) {
    const url = new URL(window.location.href);
    url.searchParams.set('sortBy', sortBy);
    window.location.href = url.href;
}