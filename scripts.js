var task_list_body =  document.getElementById("task_list_body");
document.getElementById("new_task_text").addEventListener('keydown',function(event){
    if(event.keyCode == 13){
        submit_new();
    };
});



document.getElementById("new_task_submit").addEventListener("click", submit_new);

var submit_new = function () {
    var task_input = document.getElementById('new_task_text');
    task_name = task_input.value;
    task_input.value = '';
    task_input.focus();
    //
    // WE SHOULD BE ESCAPING USER INPUT!
    //
    current_time = new Date().toLocaleString();
    var data = {"name" : task_name, ts_start : current_time};
    socket.emit('task_create', data);
    task_name = '';
};



socket.on('add_task', function (data) {
    // Make new node
    var temp_row = document.createElement('tr');
    
    var task_name_cell = document.createElement('td')
    task_name_cell.innerHTML = data.name;
    
    var task_start_cell = document.createElement('td');
    task_start_cell.innerHTML= data.ts_start;
    
    //var duration = document.createElement('td');
    //duration.innerHTML = "test2"
    
    var deleteButton = document.createElement('button');
    deleteButton.class = 'button_delete';
    deleteButton.innerHTML = 'x';
    deleteButton.addEventListener('click',function(deleteButton){
        var toRemove = this.parentNode;
        toRemove.parentNode.removeChild(toRemove);
    });
    
    temp_row.appendChild(task_name_cell);
    temp_row.appendChild(task_start_cell);
    //temp_row.appendChild(duration);
    temp_row.appendChild(deleteButton);
    
    // Prepend node, inserting it at index 0 (before index 1)    
    // This way, the most recent nodes show up at the top.
    task_list_body.insertBefore( temp_row, task_list_body.childNodes[1] );
    
});

