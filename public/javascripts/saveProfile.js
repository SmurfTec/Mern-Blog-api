const sumbitBtn = document.getElementById('submitProfile');
const nameBtn = document.getElementById('name');
const emailBtn = document.getElementById('email');
const bioBtn = document.getElementById('bio');
const delAccount = document.getElementById('delAccount');
const delAvatar = document.getElementById('delAvatar');
const saveAvatar = document.getElementById('saveAvatar');

delAccount.addEventListener('click', function deleteAccount(e) {
  $.ajax({
    type: 'DELETE',
    url: '/profile',
    //   data: {  },
    success: function (data) {
      //do something with the data via front-end framework
      // location.reload();
      $(location).attr('href', '/login');
    },
  });
});

sumbitBtn.addEventListener('click', function saveProfile(e) {
  e.preventDefault();

  let err = 0;
  let name = nameBtn.value;
  let email = emailBtn.value;
  let bio = bioBtn.value;

  name
    ? nameBtn.classList.remove('is-invalid')
    : (nameBtn.classList.add('is-invalid'), err++);
  email
    ? emailBtn.classList.remove('is-invalid')
    : (emailBtn.classList.add('is-invalid'), err++);

  if (!bio) bioBtn.classList.add('is-invalid'), err++;
  bio
    ? bioBtn.classList.remove('is-invalid')
    : (bioBtn.classList.add('is-invalid'), err++);

  if (err < 1) {
    sendRequest(name, bio, email);
  }
});

function sendRequest(name, bio, email) {
  $.ajax({
    type: 'POST',
    url: '/profile',
    data: { name: name, bio: bio, email: email },
    success: function (data) {
      //do something with the data via front-end framework
      location.reload();
    },
  });
}
