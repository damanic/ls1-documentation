var InputChangeTracker=new Class({Implements:[Options,Events],options:{regexp_mask:'^.*$',interval:300},element:null,prev_value:null,timer_obj:null,regexp_obj:null,initialize:function(element,options)
{this.setOptions(options);this.element=element;this.is_dropdown=element.tagName.toLowerCase()=='select';this.element.addEvent('keyup',this.onElementChange.bind(this));if(!this.is_dropdown)
{this.element.addEvent('keydown',this.onElementChange.bind(this));this.element.addEvent('keypress',this.onElementChange.bind(this));}else
this.element.addEvent('change',this.onElementChange.bind(this));this.prev_value=element.get('value');this.regexp_obj=new RegExp(this.options.regexp_mask);},onElementChange:function(event)
{if(this.prev_value==this.element.get('value').trim())
return;this.prev_value=this.element.get('value').trim();$clear(this.timer_obj);if(this.regexp_obj.test(this.prev_value))
this.timer_obj=this.fireChangeEvent.delay(this.options.interval,this);},fireChangeEvent:function()
{if(!this.regexp_obj.test(this.prev_value))
return;this.fireEvent('change',[this.element]);}});function assing_dropdown_change_handler(element,handler)
{$(element).addEvent('change',handler);$(element).addEvent('keyup',handler);}
var post_timer=null;function update_state_list(country_selector)
{return country_selector.getForm().sendRequest('shop:on_updateStateList',{extraFields:{'country':$(country_selector).get('value'),'control_name':'state','control_id':'state','current_state':null,'tabindex':9},update:{'state':'state_options'},lock:false,onAfterUpdate:function()
{$('state').selectedIndex=0;if(!$('dev_mode'))
update_order_totals();if(!$('dev_mode'))
new InputChangeTracker($('state')).addEvent('change',update_order_totals);}})}
function place_order()
{$('order_form').sendRequest('lssalestracking:on_placeCoreOrder',{});}
function update_order_totals()
{$('order_form').sendRequest('lssalestracking:on_updateCoreOrderTotals',{lock:false,update:{order_totals:'buy:order_totals','included_credits':'buy:included_credits','total_credits':'buy:total_credits','extra_credits_cost':'buy:extra_credits_cost'},noLoadingIndicator:true,onBeforePost:function(){$('totals_content').setStyles({'visibility':'hidden'});$('totals_loading').removeClass('hidden');},onComplete:function(){$('totals_content').setStyles({'visibility':'visible'});$('totals_loading').addClass('hidden');},onAfterUpdate:function(){if(typeof bind_terms_link=='function')
bind_terms_link(jQuery);}});}
function update_owner_mode()
{if($('owner_me').checked)
{$('my_license').removeClass('hidden');$('customer_license').addClass('hidden');}else{$('customer_license').removeClass('hidden');$('my_license').addClass('hidden');}
$('order_totals').removeClass('hidden');}
function load_customer_by_email()
{return $('order_form').sendRequest('lssalestracking:on_loadCustomerDetailsByEmail',{update:{customer_details:'myaccount:customer_details_form'},onSuccess:function(){$('order_totals_container').removeClass('hidden');},onAfterUpdate:assign_order_field_events});}
function load_customer_by_email_delayed()
{load_customer_by_email.delay(200);}
function assign_order_field_events()
{if(!$('dev_mode'))
{var track_fields=['referral_code','quantity','lssales_coupon','state','credits_quantity'];$A(track_fields).each(function(field_name){var field_element=$(field_name);if(field_element)
{new InputChangeTracker(field_element).addEvent('change',update_order_totals);}});}
var country_field=$('country');if(country_field)
new InputChangeTracker(country_field,{interval:600}).addEvent('change',update_state_list);var share_cb=$('share');if(share_cb)
{share_cb.addEvent('click',function(){if(share_cb.checked)
$('referal_code_field').removeClass('hidden');else
{$('referal_code_field').addClass('hidden');$('referral_code').value='';update_order_totals();}})}
var coupon_cb=$('have_a_coupon');if(coupon_cb)
{coupon_cb.addEvent('click',function(){if(coupon_cb.checked)
$('coupon_code_field').removeClass('hidden');else
{$('coupon_code_field').addClass('hidden');$('lssales_coupon').value='';update_order_totals();}})}
var tickets_cb=$('buy_credits');if(tickets_cb)
{tickets_cb.addEvent('click',function(){if(tickets_cb.checked)
{$$('li.tickets_field').each(function(el){el.removeClass('hidden');});}
else
{$$('li.tickets_field').each(function(el){el.addClass('hidden');});}
update_order_totals();})}
$$('.qty_controls a.arrow').each(function(button){button.addEvent('click',function(){var oldValue=parseInt($(button).getParent().getElement("input").value);if(isNaN(oldValue))
oldValue=0;var newVal=oldValue;if(button.hasClass('up'))
newVal=oldValue+1;else{if(oldValue>=1)
newVal=oldValue-1;}
$(button).getParent().getElement("input").value=newVal;$clear(post_timer);post_timer=update_order_totals.delay(500);return false;})})}
window.addEvent('domready',function()
{assign_order_field_events();if($('customer_mode'))
{var email=$('email');email.bindKeys({'enter':load_customer_by_email_delayed});}});jQuery(document).ready(function($){window.site={message:{remove:function(){$.removebar();},custom:function(message,params){if(!message)
return;this.remove();var params=$.extend({position:'top',removebutton:false,color:'#ffffff',message:message,time:10000,background_color:'#B1B92B'},params||{});jQuery(document).ready(function($){$.bar(params);});},addToCart:function(){site.message.custom('Your selection has been added to the cart!',{time:3000});}}};});function configure_fronted_ajax()
{Request.Phpr.implement({getRequestDefaults:function()
{return{onBeforePost:function(){site.message.custom('Processing...',{background_color:'#f7c809',color:'#000',time:999999});},onComplete:function(){site.message.remove();},onFailure:function(xhr){site.message.custom(xhr.responseText.replace('@AJAX-ERROR@',''),{background_color:'#c32611',color:'#fff',time:5000});},execScriptsOnFailure:true};}});}
window.addEvent('frontendready',configure_fronted_ajax);