/*
* 2007-2015 PrestaShop
*
* NOTICE OF LICENSE
*
* This source file is subject to the Academic Free License (AFL 3.0)
* that is bundled with this package in the file LICENSE.txt.
* It is also available through the world-wide-web at this URL:
* http://opensource.org/licenses/afl-3.0.php
* If you did not receive a copy of the license and are unable to
* obtain it through the world-wide-web, please send an email
* to license@prestashop.com so we can send you a copy immediately.
*
* DISCLAIMER
*
* Do not edit or add to this file if you wish to upgrade PrestaShop to newer
* versions in the future. If you wish to customize PrestaShop for your
* needs please refer to http://www.prestashop.com for more information.
*
*  @author PrestaShop SA <contact@prestashop.com>
*  @copyright  2007-2015 PrestaShop SA
*  @license    http://opensource.org/licenses/afl-3.0.php  Academic Free License (AFL 3.0)
*  International Registered Trademark & Property of PrestaShop SA
*/
//global variables
var responsiveflag = false;

$(document).ready(function(){
	highdpiInit();
	responsiveResize();
	$(window).resize(responsiveResize);
	if (navigator.userAgent.match(/Android/i))
	{
		var viewport = document.querySelector('meta[name="viewport"]');
		viewport.setAttribute('content', 'initial-scale=1.0,maximum-scale=1.0,user-scalable=0,width=device-width,height=device-height');
		window.scrollTo(0, 1);
	}
	if (typeof quickView !== 'undefined' && quickView)
		quick_view();
	dropDown();

	if (typeof page_name != 'undefined' && !in_array(page_name, ['index', 'product']))
	{
		bindGrid();

 		$(document).on('change', '.selectProductSort', function(e){
			if (typeof request != 'undefined' && request)
				var requestSortProducts = request;
 			var splitData = $(this).val().split(':');
 			var url = '';
			if (typeof requestSortProducts != 'undefined' && requestSortProducts)
			{
				url += requestSortProducts ;
				if (typeof splitData[0] !== 'undefined' && splitData[0])
				{
					url += ( requestSortProducts.indexOf('?') < 0 ? '?' : '&') + 'orderby=' + splitData[0] + (splitData[1] ? '&orderway=' + splitData[1] : '');
					if (typeof splitData[1] !== 'undefined' && splitData[1])
						url += '&orderway=' + splitData[1];
				}
				document.location.href = url;
			}
    	});

		$(document).on('change', 'select[name="n"]', function(){
			$(this.form).submit();
		});

		$(document).on('change', 'select[name="currency_payment"]', function(){
			setCurrency($(this).val());
		});
	}

	$(document).on('change', 'select[name="manufacturer_list"], select[name="supplier_list"]', function(){
		if (this.value != '')
			location.href = this.value;
	});

	$(document).on('click', '.back', function(e){
		e.preventDefault();
		history.back();
	});

	jQuery.curCSS = jQuery.css;
	if (!!$.prototype.cluetip)
		$('a.cluetip').cluetip({
			local:true,
			cursor: 'pointer',
			dropShadow: false,
			dropShadowSteps: 0,
			showTitle: false,
			tracking: true,
			sticky: false,
			mouseOutClose: true,
			fx: {
		    	open:       'fadeIn',
		    	openSpeed:  'fast'
			}
		}).css('opacity', 0.8);

	if (!!$.prototype.fancybox)
		$.extend($.fancybox.defaults.tpl, {
			closeBtn : '<a title="' + FancyboxI18nClose + '" class="fancybox-item fancybox-close" href="javascript:;"></a>',
			next     : '<a title="' + FancyboxI18nNext + '" class="fancybox-nav fancybox-next" href="javascript:;"><span></span></a>',
			prev     : '<a title="' + FancyboxI18nPrev + '" class="fancybox-nav fancybox-prev" href="javascript:;"><span></span></a>'
		});

	// Close Alert messages
	$(".alert.alert-danger").on('click', this, function(e){
		if (e.offsetX >= 16 && e.offsetX <= 39 && e.offsetY >= 16 && e.offsetY <= 34)
			$(this).fadeOut();
	});
});

function highdpiInit()
{
	if($('.replace-2x').css('font-size') == "1px")
	{
		var els = $("img.replace-2x").get();
		for(var i = 0; i < els.length; i++)
		{
			src = els[i].src;
			extension = src.substr( (src.lastIndexOf('.') +1) );
			src = src.replace("." + extension, "2x." + extension);

			var img = new Image();
			img.src = src;
			img.height != 0 ? els[i].src = src : els[i].src = els[i].src;
		}
	}
}


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

function responsiveResize()
{
	compensante = scrollCompensate();
	if (($(window).width()+scrollCompensate()) <= 767 && responsiveflag == false)
	{
		accordion('enable');
	    accordionFooter('enable');
		responsiveflag = true;
	}
	else if (($(window).width()+scrollCompensate()) >= 768)
	{
		accordion('disable');
		accordionFooter('disable');
	    responsiveflag = false;
	}
	// blockHover();
}

// function blockHover(status)
// {
	// var screenLg = $('body').find('.container').width() == 1170;

	// if ($('.product_list').is('.grid'))
		// if (screenLg)
			// $('.product_list .button-container').hide();
		// else
			// $('.product_list .button-container').show();

	// $(document).off('mouseenter').on('mouseenter', '.product_list.grid li.ajax_block_product .product-container', function(e){
		// if (screenLg)
		// {
			// var pcHeight = $(this).parent().outerHeight();
			// var pcPHeight = $(this).parent().find('.button-container').outerHeight() + $(this).parent().find('.comments_note').outerHeight() + $(this).parent().find('.functional-buttons').outerHeight();
			// $(this).parent().addClass('hovered').css({'height':pcHeight + pcPHeight, 'margin-bottom':pcPHeight * (-1)});
			// $(this).find('.button-container').show();
		// }
	// });

	// $(document).off('mouseleave').on('mouseleave', '.product_list.grid li.ajax_block_product .product-container', function(e){
		// if (screenLg)
		// {
			// $(this).parent().removeClass('hovered').css({'height':'auto', 'margin-bottom':'0'});
			// $(this).find('.button-container').hide();
		// }
	// });
// }

$(document).ready(function($){
	$('[data-toggle="popover"]').each(function(){
		if($(this).parents('.wishlist_button').length){
			$(this).popover({
				html: true,
				content:[$(this).parent().siblings('.popover-content').html()].join('')
			});
		}
		
	});
});

function quick_view()
{
	$(document).on('click', '.quick-view-ex:visible, .quick-view:visible, .quick-view-mobile:visible', function(e){
		e.preventDefault();
		var url = $(this).attr('data-rel');
		var anchor = '';
		$('body.rtl').css({"direction":"ltr","text-align":"right"});
		if (url.indexOf('#') != -1)
		{
			anchor = url.substring(url.indexOf('#'), url.length);
			url = url.substring(0, url.indexOf('#'));
		}

		if (url.indexOf('?') != -1)
			url += '&';
		else
			url += '?';

		if (!!$.prototype.fancybox)
			$.fancybox({
				'padding':  0,
				'width':    1087,
				'height':   610,
				'type':     'iframe',
				'href':     url + 'content_only=1' + anchor,
				afterClose : function() {
					$('body').removeAttr('style');
					return;
				}
			});
	});
	
	// $('[data-toggle="popover"]').each(function(){
		// $(this).attr('data-content',($(this).parent().siblings('.popover-content').html())).popover();
	// });
}

function bindGrid()
{
	var view = $.totalStorage('display');

	if (!view && (typeof displayList != 'undefined') && displayList)
		view = 'list';

	if (view && view != 'grid')
		display(view);
	else
		$('.category-view-type').find('#grid').addClass('selected');

	$(document).on('click', '#grid', function(e){
		e.preventDefault();
		display('grid');
	});

	$(document).on('click', '#list', function(e){
		e.preventDefault();
		display('list');
	});
}

function display(view)
{
	if (view == 'list')
	{
		$('.content_product_list ul.product_list').removeClass('grid').addClass('list row');
		$('.product_list .ajax_block_product').removeClass('col-lg-3 col-xs-6 col-lg-4 col-xs-12 col-xs-12 col-sm-6 col-md-6 col-md-4 col-sm-4 col-md-3 col-sm-3 col-md-2 col-sm-2 col-md-12 col-sm-12').addClass('col-xs-12');
		$('.product_list .ajax_block_product').each(function(index, element) {
			html = '';
			html = '<div class="product-container"><div class="row">';
				html += '<div class="left-block col-lg-4 col-md-5 col-sm-12">' + $(element).find('.left-block').html() + '</div>';
				html += '<div class="right-block col-lg-8 col-md-7 col-sm-12">';
					html += '<div class="product-info">';
					html += '<h5 class="product-name" itemprop="name">'+ $(element).find('h5').html() + '</h5>';
					var rating = $(element).find('.comments_note').html(); // check : rating
					if (rating != null) {
						html += '<div itemprop="aggregateRating" itemscope itemtype="http://schema.org/AggregateRating" class="comments_note">'+ rating + '</div>';
					}
					
					var colorList = $(element).find('.color-list-container').html();
					if (colorList != null) {
						html += '<div class="color-list-container">'+ colorList +'</div>';
					}
					var availability = $(element).find('.availability').html();	// check : catalog mode is enabled
					if (availability != null) {
						html += '<span class="availability">'+ availability +'</span>';
					}
					var price = $(element).find('.price-box').html();       // check : catalog mode is enabled
					if (price != null) {
						html += '<div class="price-box">'+ price + '</div>';
					}
					html += '<p class="product-desc">'+ $(element).find('.product-desc').html() + '</p>';
					html += '<div class="button-container">'+ $(element).find('.button-container').html() +'</div>';
				html += '</div></div>';
			html += '</div></div>';
		$(element).html(html);
		});
		$('.category-view-type').find('#list').addClass('selected');
		$('.category-view-type').find('#grid').removeClass('selected');
		$.totalStorage('display', 'list');
	}
	else
	{
		$('.content_product_list ul.product_list').removeClass('list').addClass('grid row');
		$('.product_list .ajax_block_product').each(function(){
			$(this).removeClass('col-xs-12').addClass($(this).parents('.content_product_list').data('class'));
		});
		$('.product_list .ajax_block_product').each(function(index, element) {
		html = '';
		html += '<div class="product-container">';
			html += '<div class="left-block">' + $(element).find('.left-block').html() + '</div>';
			html += '<div class="right-block">';
				//html += '<div class="product-flags">'+ $(element).find('.product-flags').html() + '</div>';
				
				html += '<h5 itemprop="name" class="product-name">'+ $(element).find('h5').html() + '</h5>';
				
				var rating = $(element).find('.comments_note').html(); // check : rating
				if (rating != null) {
					html += '<div itemprop="aggregateRating" itemscope itemtype="http://schema.org/AggregateRating" class="comments_note">'+ rating + '</div>';
				}
				
				var colorList = $(element).find('.color-list-container').html();
				if (colorList != null) {
					html += '<div class="color-list-container">'+ colorList +'</div>';
				}
				
				html += '<div class="price-off clearfix">';
					html += '<div class="price-left">';
							var price = $(element).find('.price-box').html(); // check : catalog mode is enabled
							if (price != null) {
								html += '<div class="price-box">'+ price + '</div>';
							}
						html += '</div>';
					html += '<div class="price-right">';
							var price = $(element).find('.price-box').html(); // check : catalog mode is enabled
							if (price != null) {
								html += '<div class="price-box">'+ price + '</div>';
							}
					html += '</div>';
				html += '</div>';
				
				html += '<p itemprop="description" class="product-desc">'+ $(element).find('.product-desc').html() + '</p>';
				
				var availability = $(element).find('.availability').html(); // check : catalog mode is enabled
				if (availability != null) {
					html += '<span class="availability">'+ availability +'</span>';
				}
			html += '</div>';
			//html += '<div itemprop="offers" itemscope itemtype="http://schema.org/Offer" class="button-container">'+ $(element).find('.button-container').html() +'</div>';
			
		html += '</div>';
		$(element).html(html);
		});
		$('.category-view-type').find('#grid').addClass('selected');
		$('.category-view-type').find('#list').removeClass('selected');
		$.totalStorage('display', 'grid');
	}
	$('.wishlist_button_list').each(function() {
		current = $(this).parent('.button-container');
		$(this).popover({
			html: true,
			content: function () {
				return current.children('.popover-content').html();
			}
		});
	});
}

function dropDown()
{
	elementClick = '#header .current';
	elementSlide =  '.toogle_content';
	activeClass = 'active';

	$(elementClick).on('click', function(e){
		e.stopPropagation();
		var subUl = $(this).next(elementSlide);
		if(subUl.is(':hidden'))
		{
			subUl.slideDown();
			$(this).addClass(activeClass);
		}
		else
		{
			subUl.slideUp();
			$(this).removeClass(activeClass);
		}
		$(elementClick).not(this).next(elementSlide).slideUp();
		$(elementClick).not(this).removeClass(activeClass);
		e.preventDefault();
	});

	$(elementSlide).on('click', function(e){
		e.stopPropagation();
	});

	$(document).on('click', function(e){
		e.stopPropagation();
		var elementHide = $(elementClick).next(elementSlide);
		$(elementHide).slideUp();
		$(elementClick).removeClass('active');
	});
}

function accordionFooter(status)
{
	if(status == 'enable')
	{
		if ($('#footer .footer-block h4')) {
			$('#footer .footer-block h4').on('click', function(){
				$(this).toggleClass('active').parent().find('.toggle-footer').stop().slideToggle('medium');
			})
			$('#footer').addClass('accordion').find('.toggle-footer').slideUp('fast');
		}
		
	}
	else
	{
		$('.footer-block h4').removeClass('active').off().parent().find('.toggle-footer').removeAttr('style').slideDown('fast');
		$('#footer').removeClass('accordion');
	}
}

function accordion(status)
{
	leftColumnBlocks = $('#sidebar, #product .left-sidebar');
	if(status == 'enable')
	{
		var accordion_selector = '#sidebar .block .block-title, #sidebar .ex-slider .block-title, #sidebar .block .block-title, #sidebar #newsletter_block_left h4,' +
								'#sidebar .shopping_cart > a:first-child, #sidebar .shopping_cart > a:first-child, #product .left-sidebar .block .block-title';

		$(accordion_selector).on('click', function(e){
			$(this).toggleClass('active').parent().find('.block_content').stop().slideToggle('medium');
		});
		$('#sidebar, #product .left-sidebar').addClass('accordion').find('.block .block_content').slideUp('fast');
		if (typeof(ajaxCart) !== 'undefined')
			ajaxCart.collapse();
	}
	else
	{
		$('#sidebar .block .block-title, #sidebar .ex-slider .block-title, #sidebar .block .block-title, #sidebar #newsletter_block_left h4, #product .left-sidebar .block .block-title').removeClass('active').off().parent().find('.block_content').removeAttr('style').slideDown('fast');
		$('#sidebar, #product .left-sidebar').removeClass('accordion');
	}
}

jQuery(document).ready(function($){  
	 if($('#sidebar').length) {
		$('#header_menu .btn2.leftsidebar').css('display', 'inline-block').on('click', function(){
			if($('#sidebar').hasClass('active')){
				$(this).find('.overlay').fadeOut(250);
				$('#sidebar').removeClass('active');
				$('body').removeClass('show-sidebar');
			} else {
				$('#sidebar').addClass('active');
				$(this).find('.overlay').fadeIn();
				$('body').addClass('show-sidebar');
			}
		});
	}
 });
 
$(document).ready(function($){
	$(".btn-show-action").each(function(){
		$(this).click(function(){
			if($(this).hasClass('show')) {
				$(this).removeClass('show');
			  } else { 
				$(this).addClass('show');
			  }
			  
			if($(this).parents(".product-image-container").hasClass('show')) {
				$(this).parents(".product-image-container").removeClass('show');
			  } else { 
				$(this).parents(".product-image-container").addClass('show');
			  }
		});
	});
});
