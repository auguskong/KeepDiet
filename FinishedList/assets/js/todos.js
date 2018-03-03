//Check off specific todos by clicking

// $("li").click(function() {
// 	//if li is gray
// 	//console.log($(this).css("color"));  this return rgb(0,0,0)
// 	if($(this).css("color") === "rgb(128, 128, 128)") {

// 		//turn it black
// 		$(this).css("color", "black");
// 		$(this).css("text-decoration", "none"); 
// 	}
// 	else{
// 		$(this).css({//use 'this' keyword
// 		color: "gray",
// 		textDecoration: "line-through"  //@MUST USE 'D' to replace '-'
// 		});
// 	}
	
// });

$("ul").on('click',"li", function() {
	$(this).toggleClass("completed");
});


//Click on X to delete Todo
$("ul").on("click", "span", function(){
	$(this).parent().fadeOut(500, function(){
		//here (this) means the <span> element
		$(this).remove(); //here (this) means the <li> element
	}); //parent() to <li> element
	event.stopPropagation(); //stop `bubble up`
});


$("input[type = 'text']").keypress(function(event){
	if(event.which === 13){ //[enter] key's number is 13
		//grabbing new todo text from input
		var todoText = $(this).val();
		//create a new li and add to ul
		$("ul").append("<li><span><i class='fa fa-trash'></i></span> " + todoText + "</li>");
	}
});

$(".fa-plus").click(function(){
	$("input[type = 'text']").fadeToggle();
})