$(() => {

  //Connecting to database
  document.addEventListener(typeof cordova !== "undefined" ? "deviceready" : "DOMContentLoaded", () => {
    var db_connect = nSQL().connect({
      id: "my_db",
      mode: "PERM",
      tables: [
          {
              name: "note_table",
              model: {
                  "id:int": {pk: true, ai:true},
                  "note:string": {},
              },
          }
      ],
      });/*then(()=>{
        alert("sa");
      });*/

    const add_button = $('#show');
    const close_button = $('#close');
    const note_input = $('.add-note-container');
    const input = $('#note');
    var update_check, update_id;

    //Check to see if there is any text entered
    //If there is no text within the input then disable the button
    $(input).keyup( function() {
      $('#submit-button').prop('disabled',this.value==""? true : false);
    });
    
    //Showing input option on clicking add button
    add_button.click(() => {
      add_button.hide(250, () => {
        note_input.show(250);
        input.focus();
      });
    });

    // Hide input if the target of the click isn't the container
    $(document).mouseup(function(e){
      if(!note_input.is(e.target) && note_input.has(e.target).length === 0 && $(e.target).attr('data-edit-id') == undefined){
          note_input.hide(250, () => {
            add_button.show(250);
          });
      }
    });

    //Hide button on clicking close button
    close_button.click(() => {
      note_input.hide(250, () => {
        add_button.show(250);
      });
    });

    //Adding data to the database
    $("#add-note-form").submit((e) => {
      e.preventDefault();
      var text = $(input).val();
      if (update_check) {                     //If data is being updated
        if (confirm("Are you sure you want to update?")) {
          db_connect.then(() => {
            nSQL("note_table").query("upsert",{note: text}).where(["id","=",update_id]).exec();
          });
        }
        else
          return false;
      }
      else {                                  //If new data is added
        db_connect.then(() => {
          nSQL("note_table").query("upsert",{note: text}).exec();
        });
      }
      setTimeout(function(){ 
        if (update_check) {
          update_check = 0;
          $('#list').html('');
        }
        render();
      }, 50);
      $(input).val("");
      $('#submit-button').prop('disabled', true);
      const container = $('.list-container');
      container.delay(25).animate({
        scrollTop: container[0].scrollHeight
      });
    });

    //Delete a data
    function delete_data(id) {
      var x=parseInt(id);
      if (confirm("Are you sure you want to delete it?")) {
        db_connect.then(() => {
          nSQL("note_table").query("delete").where(["id","=",x]).exec();
        });
        setTimeout(function(){
          $('#list').html(''); 
          render();
        }, 75);
      }
      else
        return false;
    }

    //Edit an existing data
    function edit_data(id) {
      var x=parseInt(id);
      $(input).val("");
      var text = $('li[data-id='+x+']').text();
      add_button.hide(250, () => {
        note_input.show(250);
        input.focus();
      });
      $(input).val(text);
      text = $(input).val();
      $('#submit-button').prop('disabled', false);
      update_check=1;
      update_id=x;
    }

    //Check if delete or edit button is clicked
    $(document).click(function(event) {
      if ($(event.target).attr('data-del-id') != undefined) {
        delete_data($(event.target).attr('data-del-id'));
      }
      else if ($(event.target).attr('data-edit-id') != undefined) {
        edit_data($(event.target).attr('data-edit-id'));
      }
    });
    
    //Displaying the data
    function render() {
      var listed, delete_button, edit_button;
      db_connect.then(() => {
        return nSQL("note_table").query("select").exec();
      }).then((row) => {
        for (let i=0;i<row.length;i++) {
          if ($('li[data-id='+row[i]['id']+']').length==0) {
            listed = $('<li data-id=' + row[i]['id'] + '>' + row[i]['note'] + '</li>');  
            delete_button = $('<button data-del-id=' + row[i]['id'] + ' class="remove"><i data-del-id=' + row[i]['id'] + ' class="fa fa-trash-o"></i></button>');
            edit_button = $('<button data-edit-id=' + row[i]['id'] + ' class="edit"><i data-edit-id=' + row[i]['id'] + ' class="fa fa-pencil"></i></button>');  
            listed.append(delete_button);
            listed.append(edit_button);
            $('#list').append(listed);
          }       
        }
      });
    }

    render();
    });
});
