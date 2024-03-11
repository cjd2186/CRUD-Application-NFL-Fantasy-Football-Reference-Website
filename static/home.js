// Function to display popular items
function displayPopularItems(data) {
    // Get the container where popular items will be displayed
    var $container = $('#popular-items-container');

    // Extract three popular items from the 'data' object
    var popularItems = [
        data["3"],  
        data["2"],  
        data["1"]   
    ];

    // Loop through items and create HTML elements dynamically
    $.each(popularItems, function(index, item) {
        // Create a div element for each item
        var $itemDiv = $('<div>').addClass('popular-item');
        
        // Create inner HTML content for the item
        var itemHTML = '<div class= "row">'

        //itemHTML += '<div class= "col-2">'

        itemHTML+= '<div class= "col-6">'
        
        itemHTML += '<div class="image-container">'
        itemHTML += '<div href="#"> <img class= "headshot item-link" src="' + item.image + '" alt="' + item.first_name + '"></div>'; // Example: Displaying image
        if (item.player_id == 1){
            itemHTML+= '<img class= "medal item-link " src="https://a.espncdn.com/i/oly/medals/gold.svg" alt="gold medal">'
        }

        if (item.player_id == 2){
            itemHTML+= '<img class= "medal item-link" src="https://a.espncdn.com/i/oly/medals/silver.svg" alt="silver medal">'
        }

        if (item.player_id == 3){
            itemHTML+= '<img class= "medal item-link" src="https://a.espncdn.com/i/oly/medals/bronze.svg" alt="bronze medal">'
        }
        
        itemHTML += '</div></div>'

        itemHTML += '<div class= "col-6">'
        itemHTML +='<h1>' + 'Fantasy Ranking: ' + item.player_id + '</h1>';
        itemHTML += '<h3>' + item.name + ', ' +item.position+ '</h3>'; 
        itemHTML += '<h3>' + ' Total fantasy points: ' + item.total_fpts + '</h3>';
        itemHTML += '</div></div><hr>'


        
        // Set the inner HTML of the item div
        $itemDiv.html(itemHTML);

        // Add a click event listener to the anchor tag inside the item div 
        $itemDiv.find('.item-link').on('click', function(e) {
            // Store the player data in sessionStorage to access it on the next page
            sessionStorage.setItem('selectedPlayer', JSON.stringify(item));
            
            // Navigate to another page
            var playerUrl = '/view/' + item.player_id;
    
            // Navigate to another page
            window.location.href = playerUrl;
        });

        // Append the item div to the container
        $container.append($itemDiv);
    });
}

$(document).ready(function(){
    displayPopularItems(data)
});