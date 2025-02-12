class Club extends Faveable {
    async fromId(id = 0, need_blocks = false) {
        let info = null
        if(!window.use_execute) {
            info = await window.vk_api.call('groups.getById', {'group_id': id, 'fields': 'activity,addresses,age_limits,ban_info,can_create_topic,can_message,can_post,can_suggest,can_see_all_posts,can_upload_doc,can_upload_story,can_upload_video,city,contacts,counters,country,cover,crop_photo,description,fixed_post,has_photo,is_favorite,is_hidden_from_feed,is_subscribed,is_messages_blocked,links,main_album_id,main_section,member_status,members_count,place,photo_50,photo_200,photo_max_orig,public_date_label,site,start_date,finish_date,status,trending,verified,wall,wiki_page'}, false)

            if(info.error || !info.response.groups) {
                return
            }

            info = info.response.groups[0]
            let user_ids = ''

            if(info.contacts) {
                info.contacts.forEach(cont => {
                    user_ids += cont.user_id + ','
                })
            }

            if(need_blocks) {
                info.main_photos = await window.vk_api.call('photos.getAll', {"owner_id": info.id * -1, "count": 6, "skip_hidden": 1}, false)
                
                info.main_photos = info.main_photos.response

                info.albums = await window.vk_api.call('photos.getAlbums', {"owner_id": info.id * -1, "count": 2, "need_covers": 1}, false);
                
                info.albums = info.albums.response

                info.videos = await window.vk_api.call('video.get', {"owner_id": info.id * -1, "count": 2}, false)
                
                info.videos = info.videos.response
                
                info.members = await window.vk_api.call('groups.getMembers', {"group_id": info.id, "sort": "id_desc", "fields": window.Utils.typical_fields, "count": "6"}, false)
                
                info.members = info.members.response
                
                info.members_friends = await window.vk_api.call('groups.getMembers', {"group_id": info.id, "sort": "id_desc", "fields": window.Utils.typical_fields, "count": "6", 'filter': 'friends'}, false);
                
                info.members_friends = info.members_friends.response
            }

            info.contacts_users = await window.vk_api.call('users.get', {'user_ids': user_ids, 'fields': window.Utils.typical_fields})
            info.contacts_users = info.contacts_users.response
        } else {
            info = await window.vk_api.call('execute', {'code': `
                var club = API.groups.getById({"group_id": "${id}", "fields": "activity,addresses,age_limits,ban_info,can_create_topic,can_message,can_post,can_suggest,can_see_all_posts,can_upload_doc,can_upload_story,can_upload_video,city,contacts,counters,country,cover,crop_photo,description,fixed_post,has_photo,is_favorite,is_hidden_from_feed,is_subscribed,is_messages_blocked,links,main_album_id,main_section,member_status,members_count,place,photo_50,photo_200,photo_max_orig,public_date_label,site,start_date,finish_date,status,trending,verified,wall,wiki_page"});
                club = club.groups[0];
                var users_to_insert = "";
                
                if (club.contacts) {
                    var j = 0;
                    while (j < club.contacts.length) {
                        if (club.contacts[j].user_id) {
                            users_to_insert = users_to_insert + club.contacts[j].user_id + ",";
                        }
                        j = j + 1;
                    }
                }

                ${need_blocks ? `
                    club.contacts_users = API.users.get({"user_ids": users_to_insert, "fields": "${window.Utils.typical_fields}"});
                    club.main_photos = API.photos.getAll({"owner_id": club.id * -1, "count": 6, "skip_hidden": 1});
                    club.albums = API.photos.getAlbums({"owner_id": club.id * -1, "count": 2, "need_covers": 1});
                    club.videos = API.video.get({"owner_id": club.id * -1, "count": 2});
                    club.members = API.groups.getMembers({"group_id": club.id, "sort": "id_desc", "fields": "${window.Utils.typical_fields}", "count": "6"});
                    club.members_friends = API.groups.getMembers({"group_id": club.id, "sort": "id_desc", "fields": "${window.Utils.typical_fields}", "count": "6", "filter": "friends"});
                    club.board = API.board.getTopics({"group_id": club.id, "order": 1, "preview": 2, "extended": 1, "count": 3});
                ` : ''}
                return club;
            `}, false)

            info = info.response
        }

        if(info && info.contacts && info.contacts_users && info.contacts.length > 0) {
            info.contacts.forEach(contact => {
                let contact_index = info.contacts.indexOf(contact)
            
                if(info.contacts[contact_index].user_id) {
                    let user_id = info.contacts[contact_index].user_id
            
                    info.contacts[contact_index].user = info.contacts_users.find(el => el.id == user_id)
                }
            })
        }

        this.info = info
    }

    hydrate(info) {
        super.hydrate(info)
    }

    getAvatar(mini = false) {
        if(mini) {
            return this.info.photo_50
        } else {
            return this.info.photo_200
        }
    }
    
    getUrl() {
        return '#club' + this.getId()
    }

    getId() {
        return Math.abs(this.info.id)
    }

    getRealId() {
        return this.getId() * -1
    }

    getName() {
        return Utils.escape_html(this.info.name)
    }

    getTextStatus() {
        return Utils.escape_html(this.info.status)
    }

    getTemplate() {
        return window.templates.club_page(this)
    }
    
    getCover() {
        return this.info.cover
    }

    getCoverURL(size = 1) {
        let base = this.getCover()

        if(size > 4) {
            return base.images[1].url
        }

        try {
            return base.images[size].url
        } catch(e) {
            return base.images[1].url
        }
    }

    getDescription(cut = 0) {
        let str = this.info.description
        if(cut > 0) {
            str = Utils.cut_string(str, cut)
        }

        return Utils.format_text(str)
    }
    
    getDomain() {
        return this.info.screen_name
    }

    getActivity() {
        return this.info.activity
    }

    getCounters() {
        return this.info.counters
    }

    getCity() {
        return (this.has('city') ? Utils.escape_html(this.info.city.title) : '') + (this.has('city') && this.has('country') ? ', ' : '') + (this.has('country') ? Utils.escape_html(this.info.country.title) : '')
    }

    getAgeLimits() {
        if(this.info.age_limits == 2) {
            return '16+'
        } else if(this.info.age_limits == 3) {
            return '18+'
        } else {
            return '0+'
        }
    }

    hasAccess() {
        return true
    }

    hasCover() {
        return this.getCover() && this.getCover().enabled == 1 && this.getCover().images
    }

    hasAccess() {
        if(!this.isClosed()) {
            return true
        } else {
            return this.isMember()
        }
    }
    
    isHiddenFromFeed() {
        return this.info.is_hidden_from_feed == 1
    }

    isFriend() {
        return false
    }
    
    isSubscribed() {
        return this.info.is_subscribed == 1
    }

    isAdmin() {
        return this.info.is_admin == 1
    }
    
    isVerified() {
        return this.info.verified == 1
    }

    isClosed() {
        return this.info.is_closed
    }

    isMember() {
        return this.info.is_member
    }

    isOnline() {
        return false
    }
}