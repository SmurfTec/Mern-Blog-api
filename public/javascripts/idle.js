var inactivityTime = function () {
  var time;
  window.onload = resetTimer;
  // DOM Events
  document.onmousemove = resetTimer;
  document.onkeydown = resetTimer;

  function logout() {
    alert('You are now logged out.');
    window.location.href = '/logout';
  }

  function resetTimer() {
    clearTimeout(time);
    time = setTimeout(logout, 1000 * 60 * 30);
    // 1000 milliseconds = 1 second
  }
};
window.onload = function () {
  inactivityTime();
};
