function update_gallery()
{
	return $('search_form').sendRequest(
		'lspartners:on_search', {
			update: {'partner-list': 'partner:partner_list'}
		});
}