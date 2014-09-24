"use strict";
// initialize Hoodie
var hoodie  = new Hoodie();

hoodie.account.on('signup', function (user) {
  showEvents();
  setUsername();
  $('#lnkSignUp').hide();
  $('#lnkSignIn').hide();
});

hoodie.account.on('signin', function (user) {
  showMyEvents();
  setUsername();
  $('#lnkSignUp').hide();
  $('#lnkSignIn').hide();
});

hoodie.account.on('signout', function (user) {
  $('#lnkSignUp').show();
  $('#lnkSignIn').show();
});

hoodie.global.on('add:event', loadEvent);

function setUsername() {
  $('#headerUser a:first').html(hoodie.account.username + " <span class='caret'></span>");
  $('#headerUser').removeClass('hidden');
}

$(function(){
  registerHomeEvents();
  registerMenuEvents();
  registerEventsEvents();
  registerMyEventsEvents();
  if(hoodie.account.username) {
    setUsername();
    $('#lnkSignUp').hide();
    $('#lnkSignIn').hide();
  }
});

function registerHomeEvents() {
  $('#btnSignUp').click(signUp);
  $('#btnSignIn').click(signIn);
  $('#lnkSignUp').click(showSignUp);
  $('#lnkSignIn').click(showSignIn);
}

function registerMenuEvents() {
  $('#menuHome').click(showHome);
  $('#menuEvents').click(showEvents);
  $('#menuMyEvents').click(showMyEvents);
  $('#logout').click(logout);
}

function registerEventsEvents() {
  $('#events table tbody').on('click','.btn-apply',applyForEvent);
}

function registerMyEventsEvents() {
  $('#btnCreateEvent').click(createEvent);
  $('#myEvents table tbody').on('click','.btn-remove',removeEventApplication);
}

function applyForEvent() {
  var id = $(this).parent().parent().data('id');
  hoodie.global.find('event',id)
  .done(function(event){
    hoodie.store.add('myevent',event);
  });
}

function removeEventApplication() {
  var id = $(this).parent().parent().data('id');
  hoodie.store.remove('myevent',id);
  loadMyEvents();
}

function createEvent() {
  var event = {};
  event.name = $('#txtName').val();
  event.date = $('#txtDate').val();
  event.time = $('#txtTime').val();
  hoodie.store.add('event',event).publish();
  $('#txtName').val('');
  $('#txtDate').val('');
  $('#txtTime').val('');
}

function loadEvents() {
  hoodie.global.findAll('event')
  .then(function(events) {
    var $el = $('#events table tbody');
    $el.html('');
    events.forEach(loadEvent);
  });
}

function loadMyEvents() {
  hoodie.store.findAll('myevent')
  .then(function(events) {
    var $el = $('#myEvents table tbody');
    $el.html('');
    events.forEach(loadMyEvent);
  });
}

function loadEvent(event) {
  var $el = $('#events table tbody');
  $el.append(
    '<tr data-id="' + event.id + '">' +
      '<td>' + event.name + '</td>' +
      '<td>' + event.date + '</td>' +
      '<td>' + event.time + '</td>' +
      '<td><button class="btn btn-primary btn-sm btn-apply">Apply</button></td>' +
    '</tr>'
  );
}

function loadMyEvent(event) {
  var $el = $('#myEvents table tbody');
  $el.append(
    '<tr data-id="' + event.id + '">' +
      '<td>' + event.name + '</td>' +
      '<td>' + event.date + '</td>' +
      '<td>' + event.time + '</td>' +
      '<td><button class="btn btn-danger btn-sm btn-remove">Remove</button></td>' +
    '</tr>'
  );
}

function signUp() {
  var email = $('#txtEmail').val();
  var password = $('#txtPassword').val();
  hoodie.account.signUp(email, password)
  .fail(function(err){
    console.log('Log error...let the user know it failed');
  });
}

function signIn() {
  var email = $('#txtEmail').val();
  var password = $('#txtPassword').val();
  hoodie.account.signIn(email, password)
  .fail(function(err){
    console.log('Log error...let the user know it failed');
  });
}

function showSignIn() {
  hideElements();
  $('#signForm').show();
  $('.signin').show();
  $('#btnSignIn').show();
}

function showSignUp() {
  hideElements();
  $('#signForm').show();
  $('.signup').show();
  $('#btnSignUp').show();
}


function showHome() {
  setActiveMenu.call($('#menuHome'));
  $('.jumbotron').show();
}

function showEvents() {
  setActiveMenu.call($('#menuEvents'));
  loadEvents();
  $('#events').show();
}

function showMyEvents() {
  setActiveMenu.call($('#menuMyEvents'));
  loadMyEvents();
  $('#myEvents').show();
}

function logout() {
  $('#headerUser').addClass('hidden');
  hoodie.account.signOut();
}

function setActiveMenu() {
  clearActiveMenu();
  hideElements();
  $(this).parent().addClass('active');
}

function clearActiveMenu() {
  $('#menuHome').parent().removeClass('active');
  $('#menuEvents').parent().removeClass('active');
  $('#menuMyEvents').parent().removeClass('active');
}

function hideElements() {
  $('.jumbotron').hide();
  $('#signForm').hide();
  $('#events').hide();
  $('#myEvents').hide();
  $('.signup').hide();
  $('.signin').hide();
  $('#btnSignUp').hide();
  $('#btnSignIn').hide();
}
