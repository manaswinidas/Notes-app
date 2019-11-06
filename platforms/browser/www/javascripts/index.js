$(() => {
  const fbutton = $('#show');
  const next = $('.add-note-container');
  fbutton.click(() => {
    fbutton.hide(250, () => {
      next.show(250);
    });
  });

  // hide button when focus is lost
  $('#idea').blur(() => {
    fbutton.hide(250, () => {
      next.show(250);
    });
  });

  function generateUID() {
    // I generate the UID from two parts here
    // to ensure the random number provide enough bits.
    let firstPart = (Math.random() * 46656) | 0;
    let secondPart = (Math.random() * 46656) | 0;
    firstPart = ("000" + firstPart.toString(36)).slice(-3);
    secondPart = ("000" + secondPart.toString(36)).slice(-3);
    return firstPart + secondPart;
  }

  const list = new Map(JSON.parse(localStorage.getItem("todoList")) || []);

  function saveTodoList() {
    localStorage.setItem('todoList', JSON.stringify(Array.from(list)));
  }

  $("#add-note-form").submit((e) => {
    e.preventDefault();
    const text = $("#idea").val();
    list.set(generateUID(), text);
    saveTodoList();
    $('#idea').val("");
    render();
    const container = $('.list-container');
    container.delay(500).animate({
      scrollTop: container[0].scrollHeight
      //scrollTop: 0
    });
  });

  function render() {
    $('#list').html('');
    for (let [k, v] of list) {
      const listed = $('<li data-id' + k + '>' + v + '</li>');
      const button = $('<button class="btn btn-danger">Remove</button>');
      button.click(() => {
        list.delete(k);
        saveTodoList();
        render();
      });
      listed.append(button);
      $('#list').append(listed);
    }
  }
  render();
});
