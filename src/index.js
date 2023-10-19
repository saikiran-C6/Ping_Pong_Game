import "./styles.css";

("use strict");

// Get references to DOM elements
var first_rod = document.getElementById("rod-one");
var second_rod = document.getElementById("rod-two");
var ball = document.getElementById("ball");
var current_timeout_is_running = false;
var current_score = {
  first: 0,
  second: 0
};

var action = {
  loosing_side: "",
  lost: false
};

// Function to center an element on the screen
function centre_element(element) {
  // Center horizontally
  element.style.left =
    (
      document.documentElement.clientWidth / 2 -
      element.offsetWidth / 2
    ).toString() + "px";
  element.style.left =
    (
      document.documentElement.clientWidth / 2 -
      element.offsetWidth / 2
    ).toString() + "px";
  if (element == ball) {
    // Center vertically
    if (action.lost) {
      if (action.loosing_side == "first") {
        ball.style.top = (first_rod.clientHeight + 5).toString() + "px";
      } else {
        ball.style.top =
          (
            document.documentElement.clientHeight -
            second_rod.clientHeight -
            ball.clientHeight -
            5
          ).toString() + "px";
      }
    } else
      element.style.top =
        (document.documentElement.clientHeight / 2).toString() + "px";
  }
}

// Function to add event listeners for rod movement
function add_event_listener_to_rods() {
  window.addEventListener("keydown", function (event) {
    let code = event.keyCode;
    if (code == 68) {
      // Move rods to the right
      let left_numeric = parseInt(
        first_rod.style.left.substring(0, first_rod.style.left.length - 2)
      );
      left_numeric += 20;
      if (
        left_numeric + first_rod.offsetWidth >
        document.documentElement.clientWidth
      ) {
        left_numeric =
          document.documentElement.clientWidth - first_rod.offsetWidth;
      }
      first_rod.style.left = left_numeric.toString() + "px";
      second_rod.style.left = left_numeric.toString() + "px";
    } else if (code == 65) {
      // Move rods to the left
      let left_numeric = parseInt(
        first_rod.style.left.substring(0, first_rod.style.left.length - 2)
      );
      left_numeric -= 20;
      if (left_numeric < 0) {
        left_numeric = 0;
      }
      first_rod.style.left = left_numeric.toString() + "px";
      second_rod.style.left = left_numeric.toString() + "px";
    }
  });
}

// Function to check if the ball touched the upper bar
function touched_upper_bar() {
  let ball_top_numerical = ball.getBoundingClientRect().top;
  let ball_left_numerical = ball.getBoundingClientRect().left;
  let bar_left_numerical = parseInt(
    first_rod.style.left.substring(0, first_rod.style.left.length - 2)
  );
  if (
    ball_top_numerical <= first_rod.clientHeight &&
    ball_left_numerical + ball.clientWidth / 2 > bar_left_numerical &&
    ball_left_numerical + ball.clientWidth / 2 <
      bar_left_numerical + first_rod.clientWidth
  ) {
    if (!current_timeout_is_running) {
      current_timeout_is_running = true;
      setTimeout(function () {
        current_score.first++;
        current_timeout_is_running = false;
        console.log("first", current_score.first);
      }, 200);
    }
    return true;
  }
  return false;
}

// Function to check if the ball touched the lower bar
function touched_lower_bar() {
  let ball_top_numerical = ball.getBoundingClientRect().top;
  let ball_left_numerical = ball.getBoundingClientRect().left;
  let bar_left_numerical = parseInt(
    second_rod.style.left.substring(0, second_rod.style.left.length - 2)
  );
  if (
    ball_top_numerical + ball.clientHeight + second_rod.clientHeight >=
      document.documentElement.clientHeight &&
    ball_left_numerical + ball.clientWidth / 2 > bar_left_numerical &&
    ball_left_numerical + ball.clientWidth / 2 <
      bar_left_numerical + second_rod.clientWidth
  ) {
    if (!current_timeout_is_running) {
      current_timeout_is_running = true;
      setTimeout(function () {
        current_score.second++;
        current_timeout_is_running = false;
        console.log("second", current_score.second);
      }, 200);
    }
    return true;
  }
  return false;
}

// Function to set the interval for ball movement
function set_interval_for_ball() {
  let interval_id = setInterval(function () {
    let numeric_left = ball.getBoundingClientRect().left;
    let numeric_top = ball.getBoundingClientRect().top;
    if (numeric_left <= 0) {
      //hit left
      let class_present = ball.classList[0];
      if (class_present == "animate-top-left") {
        ball.classList.remove(class_present);
        ball.classList.add("animate-top-right");
      } else if (class_present == "animate-bottom-left") {
        ball.classList.remove(class_present);
        ball.classList.add("animate-bottom-right");
      }
    } else if (
      numeric_left + ball.offsetWidth >=
      document.documentElement.clientWidth
    ) {
      //hit right
      let class_present = ball.classList[0];
      if (class_present == "animate-top-right") {
        ball.classList.remove(class_present);
        ball.classList.add("animate-top-left");
      } else if (class_present == "animate-bottom-right") {
        ball.classList.remove(class_present);
        ball.classList.add("animate-bottom-left");
      }
    } else if (
      numeric_top <= 0 ||
      numeric_top + ball.offsetHeight >= document.documentElement.clientHeight
    ) {
      //game over
      ball.classList.remove(ball.classList[0]);
      if (numeric_top <= 0) {
        action.loosing_side = "first";
        action.lost = true;
      } else if (
        numeric_top + ball.offsetHeight >=
        document.documentElement.clientHeight
      ) {
        action.loosing_side = "second";
        action.lost = true;
      }
      centre_element(ball);
      centre_element(first_rod);
      centre_element(second_rod);

      alert("Game Over");
      clearInterval(interval_id);

      if (current_score.first > localStorage.getItem("maxScore")) {
        localStorage.setItem("maxScore", current_score.first);
        localStorage.setItem("maxScorePlayer", "Player 1");
        alert(`Player 1 has the new highest score of ${current_score.first}`);
      }

      if (current_score.second > localStorage.getItem("maxScore")) {
        localStorage.setItem("maxScore", current_score.second);
        localStorage.setItem("maxScorePlayer", "Player 2");
        alert(`Player 2 has the new highest score of ${current_score.second}`);
      }

      current_score.first = 0;
      current_score.second = 0;
      show_score();
    } else if (touched_lower_bar()) {
      //touched lower bar
      let class_present = ball.classList[0];
      if (class_present == "animate-bottom-right") {
        ball.classList.remove(class_present);
        ball.classList.add("animate-top-right");
      } else if (class_present == "animate-bottom-left") {
        ball.classList.remove(class_present);
        ball.classList.add("animate-top-left");
      }
    } else if (touched_upper_bar()) {
      //touched upper bar
      let class_present = ball.classList[0];
      if (class_present == "animate-top-right") {
        ball.classList.remove(class_present);
        ball.classList.add("animate-bottom-right");
      } else if (class_present == "animate-top-left") {
        ball.classList.remove(class_present);
        ball.classList.add("animate-bottom-left");
      }
    }
  }, 1);
}

// Function to display the highest score
function show_score() {
  if (localStorage.getItem("maxScore") == null) {
    localStorage.setItem("maxScore", 0);
    localStorage.setItem("maxScorePlayer", "No one");
    alert("This is your first time");
  } else {
    alert(
      `Player 1 has a maximum score of ${localStorage.getItem(
        "maxScore"
      )} - Player 2 has a maximum score of ${localStorage.getItem("maxScore")}`
    );
  }
}

// Initial setup
centre_element(first_rod);
centre_element(second_rod);
centre_element(ball);
show_score();
add_event_listener_to_rods();
set_interval_for_ball();

// Start a new round on Enter key press
document.addEventListener("keydown", function (event) {
  if (event.keyCode == 13) {
    if (action.lost) {
      if (action.loosing_side == "first") {
        ball.classList.add("animate-bottom-right");
      } else {
        ball.classList.add("animate-top-right");
      }
    } else ball.classList.add("animate-bottom-right");
    set_interval_for_ball();
  }
});
