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

const fetchPrediction = async (postTitle, postContent) => {
  try {
    const response = await fetch('http://127.0.0.1:5000/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        post_title: postTitle,
        post_content: postContent,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    

    if (data && data.predicted_label !== undefined && data.probabilities) {
      return data;
    } else {
      throw new Error("Invalid response format or missing data properties.");
    }
  } catch (error) {
    console.error('Error fetching prediction:', error);
    throw error;
  }
};

document.addEventListener("DOMContentLoaded", async () => {
  const numberBox = document.getElementById("numberBox");

  try {
    const postTitle = "<%= post.title %>"; // Replace with dynamic title
    const postContent = "<%= post.description %>"; // Replace with dynamic content

    // Fetch prediction data
    const data = await fetchPrediction(postTitle, postContent);
    console.log(data)
    const { predicted_label, probabilities } = data;

    const targetValue = Math.round(Math.max(probabilities.class_0, probabilities.class_1) * 100);
    console.log(predicted_label)

    if (isNaN(targetValue)) {
      console.error("The fetched target value is not a valid number.");
      return;
    }

    // Update the label and color of the box
    numberBox.textContent = `${predicted_label} - ${targetValue}`;
    if (predicted_label === "Likely Fake") {
      numberBox.style.backgroundColor = "red";
      numberBox.style.color = "white";
    } else if (predicted_label === "Likely Real") {
      numberBox.style.backgroundColor = "green";
      numberBox.style.color = "white";
    }

    let counter = 0;

    const updateNumberBox = () => {
      if (counter < targetValue) {
        counter++;
        numberBox.textContent = `${predicted_label} - ${counter}%`;
      } else {
        // Stop the interval when counter reaches the target value
        clearInterval(intervalId);
      }
    };

    const intervalId = setInterval(updateNumberBox, 30);

  } catch (error) {
    console.error('Failed to fetch prediction data:', error);
    numberBox.textContent = "Error";
    numberBox.style.backgroundColor = "gray";
    numberBox.style.color = "white";
  }
});



