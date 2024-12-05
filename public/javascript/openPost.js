const postDataElement = document.getElementById('post-data');
const postTitle = postDataElement.getAttribute('data-title');
const postDescription = postDataElement.getAttribute('data-description');

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

const fetchPredictionScore = async (inputText) => {
  try {
    const response = await fetch('http://127.0.0.1:5000/predict_score', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ post_title: postTitle,
        post_content: postDescription}),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data && data.prediction_score !== undefined) {
      return data.prediction_score;
    } else {
      throw new Error("Invalid response format or missing 'prediction_score' property.");
    }
  } catch (error) {
    console.error('Error fetching prediction score:', error);
    throw error; 
  }
};


document.addEventListener("DOMContentLoaded", async () => {
  const numberBox = document.getElementById("numberBox");

  try {
    // Wait for the prediction score to be fetched
    const targetValue = await fetchPredictionScore();
    console.log(targetValue);

    if (isNaN(targetValue)) {
      console.error("The fetched target value is not a valid number.");
      return;
    }

    let counter = 0;

    const updateNumberBox = () => {
      if (counter < targetValue) {
        counter++;
        numberBox.textContent = counter;

        // Update styles based on counter value
        if (counter >= 80) {
          numberBox.style.backgroundColor = "green";
          numberBox.style.color = "white";
        } else if (counter <= 25) {
          numberBox.style.backgroundColor = "red";
          numberBox.style.color = "white";
        } else {
          numberBox.style.backgroundColor = "yellow";
          numberBox.style.color = "black";
        }
      } else {
        // Stop the interval when counter reaches the target value
        clearInterval(intervalId);
      }
    };

    const intervalId = setInterval(updateNumberBox, 30);

  } catch (error) {
    console.error('Failed to fetch target value:', error);
  }
});



