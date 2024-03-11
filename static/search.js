$(document).ready(function() {
  $("#searchForm").submit(function(event) {
    var query = $("#SearchInput").val().trim();
    if (query === "") {
      event.preventDefault(); // Prevent form submission
    }
  });

  $("#SearchInput").focus();
});