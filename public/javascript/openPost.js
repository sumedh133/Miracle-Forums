// Function to handle upvote button click
function upvotePost(postId) {
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
function downvotePost(postId) {
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

// Function to handle upvote button click for comments
function upvoteComment(commentId) {
    const upvoteButton = document.getElementById(`upvoteButton_${commentId}`);
    const downvoteButton = document.getElementById(`downvoteButton_${commentId}`);
    const voteCountElement = document.getElementById(`voteCount_${commentId}`);
  
    if (!upvoteButton.classList.contains('upvoted')) {
      if (downvoteButton.classList.contains('downvoted')) {
        // Cancel the downvote
        const currentVotes = parseInt(voteCountElement.innerText);
        voteCountElement.innerText = currentVotes + 1;
        downvoteButton.classList.remove('downvoted');
        sendVoteRequest(`/comments/${commentId}/downvote`);
      }
  
      // Send an HTTP request to upvote the comment
      sendVoteRequest(`/comments/${commentId}/upvote`);
  
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
      sendVoteRequest(`/comments/${commentId}/upvote`);
    }
  }
  
  // Function to handle downvote button click for comments
  function downvoteComment(commentId) {
    const upvoteButton = document.getElementById(`upvoteButton_${commentId}`);
    const downvoteButton = document.getElementById(`downvoteButton_${commentId}`);
    const voteCountElement = document.getElementById(`voteCount_${commentId}`);
  
    if (!downvoteButton.classList.contains('downvoted')) {
      if (upvoteButton.classList.contains('upvoted')) {
        // Cancel the upvote
        const currentVotes = parseInt(voteCountElement.innerText);
        voteCountElement.innerText = currentVotes - 1;
        upvoteButton.classList.remove('upvoted');
        sendVoteRequest(`/comments/${commentId}/upvote`);
      }
  
      // Send an HTTP request to downvote the comment
      sendVoteRequest(`/comments/${commentId}/downvote`);
  
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
      sendVoteRequest(`/comments/${commentId}/downvote`);
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

function toggleReplies(commentId) {
  const repliesContainer = document.getElementById(`replies_${commentId}`);
  const replyFormContainer = repliesContainer.querySelector('.replyFormContainer');

  if (repliesContainer.style.display === 'none') {
    repliesContainer.style.display = 'block';
    replyFormContainer.style.display = 'block';
  } else {
    repliesContainer.style.display = 'none';
    replyFormContainer.style.display = 'none';
  }
}
  