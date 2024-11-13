
function upvotePost(postId) {
    const upvoteButton = document.getElementById(`upvoteButton_${postId}`);
    const downvoteButton = document.getElementById(`downvoteButton_${postId}`);
    const voteCountElement = document.getElementById(`voteCount_${postId}`);

    if (!upvoteButton.classList.contains('upvoted')) {
    if (downvoteButton.classList.contains('downvoted')) {
        
        const currentVotes = parseInt(voteCountElement.innerText);
        voteCountElement.innerText = currentVotes + 1;
        downvoteButton.classList.remove('downvoted');
        sendVoteRequest(`/posts/${postId}/downvote`);
    }

    
    sendVoteRequest(`/posts/${postId}/upvote`);

    
    const currentVotes = parseInt(voteCountElement.innerText);
    voteCountElement.innerText = currentVotes + 1;

    
    upvoteButton.classList.toggle('upvoted');
    } else {
    
    const currentVotes = parseInt(voteCountElement.innerText);
    voteCountElement.innerText = currentVotes - 1;
    upvoteButton.classList.remove('upvoted');
    sendVoteRequest(`/posts/${postId}/upvote`);
    }
}


function downvotePost(postId) {
    const upvoteButton = document.getElementById(`upvoteButton_${postId}`);
    const downvoteButton = document.getElementById(`downvoteButton_${postId}`);
    const voteCountElement = document.getElementById(`voteCount_${postId}`);

    if (!downvoteButton.classList.contains('downvoted')) {
    if (upvoteButton.classList.contains('upvoted')) {
        
        const currentVotes = parseInt(voteCountElement.innerText);
        voteCountElement.innerText = currentVotes - 1;
        upvoteButton.classList.remove('upvoted');
        sendVoteRequest(`/posts/${postId}/upvote`);
    }

    
    sendVoteRequest(`/posts/${postId}/downvote`);

    
    const currentVotes = parseInt(voteCountElement.innerText);
    voteCountElement.innerText = currentVotes - 1;

    
    downvoteButton.classList.toggle('downvoted');
    } else {
    
    const currentVotes = parseInt(voteCountElement.innerText);
    voteCountElement.innerText = currentVotes + 1;
    downvoteButton.classList.remove('downvoted');
    sendVoteRequest(`/posts/${postId}/downvote`);
    }
}


function upvoteComment(commentId) {
    const upvoteButton = document.getElementById(`upvoteButton_${commentId}`);
    const downvoteButton = document.getElementById(`downvoteButton_${commentId}`);
    const voteCountElement = document.getElementById(`voteCount_${commentId}`);
  
    if (!upvoteButton.classList.contains('upvoted')) {
      if (downvoteButton.classList.contains('downvoted')) {
        
        const currentVotes = parseInt(voteCountElement.innerText);
        voteCountElement.innerText = currentVotes + 1;
        downvoteButton.classList.remove('downvoted');
        sendVoteRequest(`/comments/${commentId}/downvote`);
      }
  
      
      sendVoteRequest(`/comments/${commentId}/upvote`);
  
      
      const currentVotes = parseInt(voteCountElement.innerText);
      voteCountElement.innerText = currentVotes + 1;
  
      
      upvoteButton.classList.toggle('upvoted');
    } else {
      
      const currentVotes = parseInt(voteCountElement.innerText);
      voteCountElement.innerText = currentVotes - 1;
      upvoteButton.classList.remove('upvoted');
      sendVoteRequest(`/comments/${commentId}/upvote`);
    }
  }
  
  
  function downvoteComment(commentId) {
    const upvoteButton = document.getElementById(`upvoteButton_${commentId}`);
    const downvoteButton = document.getElementById(`downvoteButton_${commentId}`);
    const voteCountElement = document.getElementById(`voteCount_${commentId}`);
  
    if (!downvoteButton.classList.contains('downvoted')) {
      if (upvoteButton.classList.contains('upvoted')) {
        
        const currentVotes = parseInt(voteCountElement.innerText);
        voteCountElement.innerText = currentVotes - 1;
        upvoteButton.classList.remove('upvoted');
        sendVoteRequest(`/comments/${commentId}/upvote`);
      }
  
      
      sendVoteRequest(`/comments/${commentId}/downvote`);
  
      
      const currentVotes = parseInt(voteCountElement.innerText);
      voteCountElement.innerText = currentVotes - 1;
  
      
      downvoteButton.classList.toggle('downvoted');
    } else {
      
      const currentVotes = parseInt(voteCountElement.innerText);
      voteCountElement.innerText = currentVotes + 1;
      downvoteButton.classList.remove('downvoted');
      sendVoteRequest(`/comments/${commentId}/downvote`);
    }
  }

  
function sendVoteRequest(url) {
    fetch(url, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        
    },
    
    })
    .then(response => {
        if (response.ok) {
        
        } else {
        throw new Error('Vote request failed');
        }
    })
    .catch(error => {
        console.error(error);
        
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
  