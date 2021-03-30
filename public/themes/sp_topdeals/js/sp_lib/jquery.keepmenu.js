$(window).on("load", function() {
	if (($(window).width()+scrollCompensate()) > 768){
		if($(".header_v1 .header-bottom, .header_v2 .header-bottom, .header_v3 .header-bottom")){
			offset_top = $(".header_v1 .header-bottom, .header_v2 .header-bottom, .header_v3 .header-top").offset().top
			processScroll(".header_v1 .header-bottom, .header_v2 .header-bottom, .header_v3 .header-top", "menu-fixed", offset_top);
			$(window).scroll(function(){
				processScroll(".header_v1 .header-bottom, .header_v2 .header-bottom, .header_v3 .header-top", "menu-fixed", offset_top);
			});
		}
	}
});

$(document).ready(function() {
    $(window).on('orientationchange', function(event) {
        console.log(orientation);
    });
});
	
// Used to compensante Chrome/Safari bug (they don't care about scroll bar for width)
function scrollCompensate() 
{
    var inner = document.createElement('p');
    inner.style.width = "100%";
    inner.style.height = "200px";

    var outer = document.createElement('div');
    outer.style.position = "absolute";
    outer.style.top = "0px";
    outer.style.left = "0px";
    outer.style.visibility = "hidden";
    outer.style.width = "200px";
    outer.style.height = "150px";
    outer.style.overflow = "hidden";
    outer.appendChild(inner);

    document.body.appendChild(outer);
    var w1 = inner.offsetWidth;
    outer.style.overflow = 'scroll';
    var w2 = inner.offsetWidth;
    if (w1 == w2) w2 = outer.clientWidth;

    document.body.removeChild(outer);

    return (w1 - w2);
}

function processScroll(element, eclass, offset_top) {
	var scrollTop = $(window).scrollTop();
	if($(element).height()< $(window).height()){
		if (scrollTop > offset_top) {
			//fix secondary navigation
			$(element).addClass(eclass);
			
			//push the .cd-main-content giving it a top-margin

			$('.header-menu, .header_v2 .header-center').addClass('has-top-margin');	

			
			//on Firefox CSS transition/animation fails when parent element changes position attribute
			//so we to change secondary navigation childrens attributes after having changed its position value
			setTimeout(function() {
	            $(element).addClass('animate-children');
	        }, 150);
		} else if (scrollTop <= offset_top) {
			$(element).removeClass(eclass);
			//push the .cd-main-content giving it a top-margin
			$('.header-menu, .header_v2 .header-center').removeClass('has-top-margin');	

			
			setTimeout(function() {
	            $(element).removeClass('animate-children');
	        }, 150);
		}

	}
}

