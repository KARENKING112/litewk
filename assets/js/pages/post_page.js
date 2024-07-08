window.page_class = new class {
    async render_page() {
        let id = window.main_class['hash_params'].owner_id + '_' + window.main_class['hash_params'].post_id
        let splitted = id.split('_')

        if(!id || id == '0' || id.split(',').length > 1) {
            add_onpage_error(':(')
            return
        }

        // Drawing user page
        let post = new Post

        try {
            await post.fromId(id)
        } catch(e) {}

        if(!post.info) {
            main_class.add_onpage_error(_('errors.post_not_found', id))
            return
        }

        let tabs = ['all', 'owner']
        let tabs_ = ''

        if(Number(splitted[0]) == window.active_account.info.id) {
            tabs.push('others')
            tabs.push('archived')
        }

        document.title = _('wall.post')
        tabs.forEach(tab => {tabs_ += `<a href='#wall${splitted[0]}/${tab}'>${_(`wall.${tab}_posts`)}</a>`})

        let comment_sort = window.main_url.searchParams.get('comment_sort') && ['asc', 'desc', 'smart'].indexOf(window.main_url.searchParams.get('comment_sort')) != -1 ? window.main_url.searchParams.get('comment_sort') : window.site_params.get('ux.default_sort', 'asc')
        $('.page_content')[0].insertAdjacentHTML('beforeend', 
            `
                <div class='default_wrapper wall_wrapper'>
                    <div class='wall_wrapper_post'>
                        ${post.getTemplate({'hide_comments': 1})}

                        ${!post.needToHideComments() ?
                        `<div class='bordered_block comment_select_block' id='insert_paginator_here_bro'>
                            <span>${_('wall.comments_count', post.info.comments.count)}</span>
                        </div>
                        
                        ${post.info.comments.count > 1 ? `
                        <div id='post_comment_sort' class='comment_sort'>
                            <select>
                                <option value='desc' ${comment_sort == 'desc' ? 'selected' : ''}>${_('wall.sort_new_first')}</option>
                                <option value='asc' ${comment_sort == 'asc' ? 'selected' : ''}>${_('wall.sort_old_first')}</option>
                                <option value='smart' ${comment_sort == 'smart' ? 'selected' : ''}>${_('wall.sort_interesting_first')}</option>
                            </select>
                        </div>` : ''}

                        <div class='wall_wrapper_comments'></div>` : ''}
                    </div>
                    <div class='wall_wrapper_tabs bordered_block'>
                        ${tabs_}
                        <a href='#wall${splitted[0]}/search'>${_(`wall.search_posts`)}</a>
                        <a data-ignore='1' class='selectd'>${_(`wall.post`)}</a>
                    </div>
                </div>
            `
        )

        if(!post.needToHideComments()) {
            window.main_classes['wall'] = new Comments(Comment, '.wall_wrapper_post .wall_wrapper_comments')
            window.main_classes['wall'].setParams('wall.getComments', {'owner_id': post.info.owner_id, 'post_id': post.getCorrectID(), 'need_likes': 1, 'extended': 1, 'thread_items_count': 3, 'fields': window.Utils.typical_fields + ',' + window.Utils.typical_group_fields, 'sort': comment_sort})
                
            if(window.main_url.searchParams.has('page')) {
                window.main_classes['wall'].objects.page = Number(window.main_url.searchParams.get('page')) - 1
            }
    
            window.main_classes['wall'].clear()
            await window.main_classes['wall'].nextPage()
    
            $('.comment_select_block span')[0].innerHTML = _('wall.comments_count_with_threads', window.main_classes['wall'].objects.count, post.info.comments.count)
            $('.comment_select_block')[0].insertAdjacentHTML('beforeend', window.templates.paginator(window.main_classes['wall'].objects.pagesCount, (Number(window.main_url.searchParams.get('page') ?? 1))))
        }
    }
}
