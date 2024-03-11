$(document).ready(function() {
    // Event listener for form submission
    $("#see-it-here").hide();
    $("#success-message").hide();

    // Listen for keypress events on input fields
    $("input").keypress(function(event) {
      // If Enter key is pressed
      if (event.which == 13) {
          event.preventDefault(); // Prevent default behavior

          // Find all input fields in the form
          let $inputs = $(this).closest("form").find(":input");

          // Find the index of the current input field
          let currentIndex = $inputs.index(this);

          // Find the next input field
          let $nextInput = $inputs.eq(currentIndex + 1);

          // If the next input field exists, focus on it
          if ($nextInput.length != 0) {
              $nextInput.focus();
          }
        }
      });

    $("#add-submit").keypress(function(event){
      
      $(".error-message").remove();
      $(".yellow").removeClass("yellow");
      $(".red").removeClass("red");

      let data=getData();
      console.log(data, "DATAATA")
      if (event.which == 13){
        if (data === null) {
          // If there are errors, focus on the first input field with the "yellow" class
          
          let $firstError = $(".yellow, .red").first();
          if ($firstError.length > 0) {
            $(".yellow, .red").first().focus();
            // Scroll the page to bring the focused input field into view
            smoothScrollToError();
          }
        }  
      }
    });
    
    $("#add-submit").click(function(event){
      event.preventDefault(); // Prevent the default form submission behavior
            
      $(".error-message").remove();
      $(".yellow").removeClass("yellow");
      $(".red").removeClass("red");

      let data=getData();
      if (event.which == 13){
        if (data === null) {
          // If there are errors, focus on the first input field with the "yellow" class
          
          let $firstError = $(".yellow, .red").first();
          if ($firstError.length > 0) {
            $(".yellow, .red").first().focus();
            // Scroll the page to bring the focused input field into view
            smoothScrollToError();
          }
        } 
        else {
          // If there are no errors, proceed with form submission or other actions
          console.log(data, "DATA"); // You can use the data object as needed
          // Show "See it here" link
          $("#see-it-here").show();
          $("#success-message").show();
          console.log("#success-message", "MSG")
          // Clear input boxes
          $("input[type='text']").val('');
          $("textarea").val('');
          // Set focus on the first text box
          $("#name").focus();
          console.log(data.player_id)
          $("#see-it-here").attr("data-url", "{{ url_for('view', id=data.player_id) }}");
        }
      }
    });

    $("#see-it-here").click(function() {
      var url = $(this).attr("data-url");
      // Redirect the user to the URL
      window.location.href = url;
    });

    function getData(){
      
      let fieldIds = ["player_id", "name", "team", "team_short", "position_full", "position", "number", "image", "passing_yds", "passing_tds", "ints", "rushing_yds", "rushing_tds", "receiving_yds", "receiving_tds", "receptions", "total_fpts", "avg_fpts", "summary", "teammates_depth_chart"];
      let numFields= ["player_id", "number", "passing_yds", "passing_tds", "ints", "rushing_yds", "rushing_tds", "receiving_yds", "receiving_tds", "receptions", "total_fpts", "avg_fpts", "teammates_depth_chart"];
      let english={
        "name": "Name",
        "playe_id": "Fantasy Ranking",
        "team": "Team",
        "team_short": "Team Abbreviation",
        "position_full": "Position",
        "position": "Position Abbreviation",
        "number": "Jersey Number",
        "image": "Headshot Image url",
        "passing_yds": "Passing Yards",
        "passing_tds": "Passing Touchdowns",
        "ints": "Interceptions",
        "rushing_yds": "Rushing Yards",
        "rushing_tds": "Rushing Touchdowns",
        "receiving_yds": "Receiving Yards",
        "receiving_tds": "Receiving Touchdowns",
        "receptions": "Receptions",
        "total_fpts": "Total Fantasy Points",
        "avg_fpts": "Average Fantasy Points",
        "summary": "Summary",
        "teammates_depth_chart": "Teammates Depth Chart"
      }
      let errors = [];
      let newPlayer={};
      // Iterate over each input field
      fieldIds.forEach(function(fieldId) {
        let fieldValue = $("#" + fieldId).val(); // Get the value of the field
          
        // Check if the field is empty
        if (fieldValue.trim() === "") {
          $("#" + fieldId).addClass("yellow"); // Add yellow class to the empty field
            // Check if error message element exists, if not, create and insert it before the input field
            if (!$("#" + fieldId + "-error").length) {
              $("<div id='" + fieldId + "-error'></div>")
              .text("Error: " + english[fieldId] + " field is empty.")
              .insertBefore("label[for='" + fieldId + "']")
              .addClass("error-message");            
            }
            errors.push(fieldId.replace("_", " ") + " field is empty.");
        } 
        else {
          $("#" + fieldId).removeClass("yellow"); // Remove yellow class if field is not empty
        }

        if (numFields.includes(fieldId) && isNaN(parseFloat(fieldValue.trim()))){
          $("#" + fieldId).addClass("red"); // Add yellow class to the empty field
          $("#" + fieldId).val('');

            // Check if error message element exists, if not, create and insert it before the input field
            if (!$("#" + fieldId + "-error").length) {
              $("<div id='" + fieldId + "-error'></div>")
              .text("Error: " + english[fieldId] + " must enter a number.")
              .insertBefore("label[for='" + fieldId + "']")
              .addClass("error-message");            
            }
            errors.push(fieldId.replace("_", " ") + " must enter a number.");
        }
        else {
          $("#" + fieldId).removeClass("red"); // Add yellow class to the empty field
        }

        // Add the field value to the newPlayer object
        if (fieldId == "teammates_depth_chart"){
          newPlayer[fieldId] = fieldValue.split(", ");
        }
        else{
          newPlayer[fieldId] = fieldValue;
        }
      });

      // If there are errors, display them and return null
      if (errors.length > 0) {
          return null;
      }
      else{
        addPlayer(newPlayer);
      }
      console.log(newPlayer, "new")
      return newPlayer;
      }

      function addPlayer(newPlayer){
        $.ajax({
          type: "POST",
          url: "add",                
          dataType : "json",
          contentType: "application/json; charset=utf-8",
          //send over a string of the new_sale json object
          data : JSON.stringify(newPlayer),
          //returned value will be an array of data, must get data object only
          success: function(result){
            // If there are no errors, proceed with form submission or other actions
            console.log(newPlayer, "DATA"); // You can use the data object as needed
            // Show "See it here" link
            $("#success-message").show();
            $("#see-it-here").show();
            
            // Clear input boxes
            $("input[type='text']").val('');
            $("textarea").val('');
            // Set focus on the first text box
            $("#name").focus();
            console.log(newPlayer.player_id)
            let playerId = newPlayer.player_id;
            let url = "/view/" + playerId; // Construct the URL dynamically
            console.log(url, "URL!")
            $("#see-it-here").attr("data-url", url);
          },
          error: function(request, status, error){
              console.log("Error");
              console.log(request)
              console.log(status)
              console.log(error)
          }
        });
      }

      function smoothScrollToError() {
        let $firstError = $(".yellow, .red").first();
        
        if ($firstError.length > 0) {
            // Get the position of the first error element
            let firstErrorPosition = $firstError.offset().top;
            // Calculate the duration of the scroll animation based on the distance to scroll
            let duration = Math.abs($(window).scrollTop() - firstErrorPosition) * 1.5; // Adjust the multiplier for slower scroll
            
            // Smoothly scroll to the first error element
            $("html, body").animate({
                scrollTop: firstErrorPosition - 100 // Scroll to the position of the first error, with an offset of 100 pixels from the top
            }, duration);
        }
      }
  });