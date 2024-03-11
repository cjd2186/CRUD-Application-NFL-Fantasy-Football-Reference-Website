// Handle form submission
$(document).ready(function() {

    $("#submit-btn").click(function(event) {
        event.preventDefault(); // Prevent default form submission
        let player_id = String($("#rank").text());
        // Convert form data array to JSON object
        let formDataArray = $("#edit-form").serializeArray();
        let formData = {};
        formData['player_id']=player_id

        formDataArray.forEach(function(input) {
            formData[String(input.name)] = input.value;
        });
        console.log(formData);
        let str =formData['teammates_depth_chart']

        let formattedStr = str.replace(/'/g, ""); // Remove single quotes
        let list = formattedStr.substring(1, formattedStr.length - 1).split(","); // Split the string at commas
        
        formData['teammates_depth_chart']= ['12', '34', '35']

        console.log(player_id, "ID")
        console.log(formData, "DAAATA");
        // Send data to the server
        $.ajax({
            type: "POST",
            url: "/edit/" + player_id, // Update the URL with your endpoint to save data
            dataType : "json",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(formData),
            success: function(result) {
                // Redirect to the view page after successful submission
                window.location.href = "/view/" + player_id;
            },
            error: function(request, status, error){
                console.log("Error");
                console.log(request)
                console.log(status)
                console.log(error)
            }
        });        
    });

    // Handle discard changes
    $("#discard-btn").click(function() {
        $("#confirmation-dialog").show();

        $("#confirmation-dialog")[0].scrollIntoView();
        
        // Event listener for the Confirm button
        $("#confirm-btn").click(function() {
            // Redirect to view page or take appropriate action
            let player_id = String($("#rank").text());
            window.location.href = "/view/" + player_id;
        });
    
        // Event listener for the Cancel button
        $("#cancel-btn").click(function() {
            // Close the dialog
            $("#confirmation-dialog").hide();
        });
    });
});