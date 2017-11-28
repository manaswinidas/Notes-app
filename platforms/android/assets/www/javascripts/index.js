$(() => {

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

  $("#add").click(() => {
    const text = $("#idea").val();
    list.set(generateUID(), text);
    saveTodoList();
    $('#idea').val("");
    render();
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
