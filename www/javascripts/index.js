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
                  "note_number:int":{},
                  "note:string": {},
              },
          }
      ],
    });

    const add_button = $('#show');
    const close_button = $('#close');
    const list = $('.list');
    const note_input = $('.add-note-container');
    const input = $('#note');
    const note_add = $('.note_add');
    const card_row = $('.row');
    var update_check, update_id;
    var card_number = 0;

    //Check to see if there is any text entered
    //If there is no text within the input then disable the button
    $(input).keyup( function() {
      $('#submit-button').prop('disabled',this.value==""? true : false);
    });
    
    //Showing input option on clicking add button
    add_button.click(() => {
      db_connect.then( () => {
        return nSQL("note_table").query("select", ["MAX(note_number)"]).exec();
      }).then( (row) => {
        if (row[0]['MAX(note_number)'])
          card_number = row[0]['MAX(note_number)'];
        
        card_number += 1;
        create_new_card(card_number);
        note_add.hide(() => {
          note_input.show();
          $("#note").focus();
        });
      });
    });

    //Add new note to a list
    note_add.click(() => {
      $('.active-list').css('margin-bottom', '60px');
      note_add.hide( () => {
        note_input.show();
        $("#note").focus();
      });
    });

    //Hide button on clicking close button
    close_button.click(() => {
      $('.active-list').css('margin-bottom', '');
      note_input.hide(250, () => {
        note_add.show(250);
      });
    });

    //Get the active card 
    function get_active_values( val ) {
      var current_card = card_row.find('.active-card');
      var note_num = current_card.attr('data-note-id');
      var current_list = current_card.find('ul');
      note_num = parseInt(note_num);

      if ( val == 'note_number')
        return note_num;
      else if( val == 'list')
        return current_list;
    }

    //Adding data to the database
    $("#add-note-form").submit((e) => {
      e.preventDefault();
      var text = $(input).val();
      if (update_check) {                     //If existing data is updated
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
          nSQL("note_table").query("upsert",{note_number: get_active_values('note_number'), note: text}).exec();
        });
      }
      setTimeout(function(){ 
        if (update_check) {
          update_check = 0;
          $('.active-list').html('');
        }
        render(get_active_values('note_number'));
      }, 50);
      $(input).val("");
      $('#submit-button').prop('disabled', true);
      var container = get_active_values('list');
      container.delay(25).animate({
        scrollTop: container[0].scrollHeight
      });
    });

    //Delete a data
    function delete_data( id ) {
      id = parseInt(id);
      if (confirm("Are you sure you want to delete it?")) {
        db_connect.then(() => {
          nSQL("note_table").query("delete").where(["id","=",id]).exec();
        });
        setTimeout( () => {
          $('.active-list').html(''); 
          render(get_active_values('note_number'));
        }, 75);
      }
      else
        return false;
    }

    //Edit an existing data
    function edit_data( id ) {
      id = parseInt(id);
      $(input).val("");
      var text = $('li[data-id='+id+']').text();
      add_button.hide(250, () => {
        note_input.show(250);
        input.focus();
      });
      $(input).val(text);
      text = $(input).val();
      $('#submit-button').prop('disabled', false);
      update_check = 1;
      update_id = id;
    }

    //Check if delete or edit button is clicked
    $(document).click(function(event) {
      if ($(event.target).closest('button').attr('data-del-id') != undefined) {
        delete_data($(event.target).closest('button').attr('data-del-id'));
      }
      else if ($(event.target).closest('button').attr('data-edit-id') != undefined) {
        edit_data($(event.target).closest('button').attr('data-edit-id'));
      }
      else if ($(event.target).closest('button').hasClass('remove_card')) {
        var id = $(event.target).closest('.column').attr('data-note-id');
        id = parseInt(id);
        if (confirm("Are you sure you want to remove the complete note?")) {
          db_connect.then(() => {
            nSQL("note_table").query("delete").where(["note_number","=",id]).exec();
          });
          $(event.target).closest('.column').remove();
        }
      }
      else if ($(event.target).closest('.column').length && (!($(event.target).closest('.column')).hasClass('active-card'))){
        var thisClass = $(event.target).closest('.column');
        thisClass.addClass('active-card');
        thisClass.parent().addClass('active-card');
        $(".back_arrow, .note_add, .box_border_top, .box_border_left").addClass('is-active');
        thisClass.find('ul').addClass('active-list');
        add_button.hide(50);
        card_row.find('.column').not('.active-card').addClass('is-inactive');
        thisClass.find('ul button').removeClass('is-inactive');
        thisClass.find('.remove_card').addClass('is-inactive');
      }
      else if ($(event.target).closest('button').hasClass("back_arrow")) {
        var currentColumn = card_row.find('.active-card');
        var num = parseInt(currentColumn.attr('data-note-id'));
        if (note_input.css('display') == 'block') {
          note_input.hide(() => {
            note_add.css('display', '');
          })
        }
        $(".back_arrow, .note_add, .box_border_top, .box_border_left").removeClass('is-active');
        add_button.show(50);
        db_connect.then(() => {
          return nSQL("note_table").query("select").where(["note_number","=",num]).exec();
        }).then((row) => {
          if(row.length == 0) {
            card_row.removeClass('active-card');
            card_row.find('.column').not('div[class="column"]').removeClass('is-inactive');
            currentColumn.remove();
          }
          else {
            card_row.find('.active-card').find('ul button').addClass('is-inactive');
            card_row.removeClass('active-card');
            card_row.find('.active-card').removeClass('active-card');
            card_row.find('.column').not('div[class="column"]').removeClass('is-inactive');
            $('.active-list').css('margin-bottom', '');
            card_row.find('.active-list').removeClass('active-list');
            card_row.find('.remove_card').removeClass('is-inactive'); 
          }
        });
      }
      else if (!note_input.is(event.target) && note_input.has(event.target).length === 0 && note_input.css('display')=='block') {
        note_input.hide( 250, () => {
          note_add.show(250);
        });
      }
    });

    //Create a new card
    function render_initial_cards( value ) {
      var column = $("<div class='column' data-note-id='" + value + "'></div>");
      const note_card = $("<div class='card'></div>");
      const note_list = $("<ul id='list_" + value + "' class='list'></ul>");
      const delete_card_button = $("<button class='remove_card'><i class='fa fa-remove' style='font-size:24px; outline:0;'></i></button>")
      note_card.append(delete_card_button);
      note_card.append(note_list);
      column.append(note_card);
      card_row.append(column);
    }

    function create_new_card( value ) {
      var column = $("<div class='column active-card' data-note-id='" + value + "'></div>");
      const note_card = $("<div class='card'></div>");
      const note_list = $("<ul id='list_" + value + "' class='list active-list'></ul>");
      const delete_card_button = $("<button class='remove_card is-inactive'><i class='fa fa-remove' style='font-size:24px; outline:0;'></i></button>")
      note_card.append(delete_card_button);
      note_card.append(note_list);
      column.append(note_card);
      card_row.append(column);
      card_row.addClass('active-card');
      $(".back_arrow, .note_add, .box_border_top, .box_border_left").addClass('is-active');
      add_button.hide(50);
      card_row.find('.column').not('.active-card').addClass('is-inactive');
    }

    //Displaying the data
    function render( card_number ) {
      var listed, delete_button, edit_button, temp = 0;
      var current_note_list = $('#list_' + card_number);
      db_connect.then(() => {
        return nSQL("note_table").query("select").exec();
      }).then((row) => {
        for (let i=0;i<row.length;i++) {
          if (row[i]['note_number'] == card_number) {
            if ($('#list_'+card_number+' li[data-id='+ row[i]['id'] +']').length==0) {
              listed = $('<li data-id=' + row[i]['id'] + '>' + row[i]['note'] + '</li>');  
              delete_button = $('<button data-del-id=' + row[i]['id'] + ' class="remove" style="outline:0;"><i class="fa fa-trash-o"></i></button>');
              edit_button = $('<button data-edit-id=' + row[i]['id'] + ' class="edit" style="outline:0;"><i class="fa fa-pencil"></i></button>');  
              listed.append(delete_button);
              listed.append(edit_button);
              current_note_list.append(listed);
            }
          }
        }
        if (!card_row.hasClass('active-card')) {
          card_row.find('.remove').addClass('is-inactive');
          card_row.find('.edit').addClass('is-inactive');
        }
      });
    }

    //Display previosuly created notes
    function initial_render() {
      db_connect.then( () => {
        return nSQL("note_table").query("select").exec();
      }).then( (row) => {
        if (row.length > 0) {
          db_connect.then( () => {
            return nSQL("note_table").query("select").distinct(['note_number']).exec();
          }).then( (row1) => {
            for (let i=0; i< row1.length; i++) {
              render_initial_cards(row1[i]['note_number']);
              render(row1[i]['note_number']);
            }
          });
        }
      });
    }

    initial_render();
  });
});
