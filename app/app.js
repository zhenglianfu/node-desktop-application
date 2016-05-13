var nw = require('nw.gui');
var os = require('os');
var fs = require('fs');
var Constants = {
    MENU_BAR_OPTS: {
        background: 'rgba(200,200,200,.8)'
    },
    MENU_BAR: [
        {
            label: '菜单1',
            submenu: [
                {
                    label: '子菜单1',
                    click: function(){
                        
                    }
                },
                {label: '子菜单2'}
            ]
        },
        {
            label: '菜单2',
            submenu: [
                {label: '打开文件', click: function(){
                }},
                {label: '打开文件夹', click: function(){
                }}
            ] 
        },
        {
            label: '菜单3',
            submenu: [
                {label: 'toggle develop tool', click: function(){
                    getNativeWindow().showDevTools();
                }}
            ]
        },
    ],
    CONTEXT_MENUS: [
        {
            label: '刷新           F5',
            click: function(){
                window.location.reload();
            }
        },
        {
            label: '强制刷新   ctrl F5',
            click: function(){
                nw.App.clearCache();
                window.location.reload();
            }
        },
        {label: '关闭', click: function(){
            if (window.confirm('即将关闭')) {
                nw.App.crashBrowser();    
            }
        }}
    ],
    TEXT_CONTEXT_MENUS: []
};
var createElement = function createElement(tagName){
    return document.createElement(tagName);
};
var createMenuItem = function(menuItemConf){
    if (menuItemConf) {
        if (Array.isArray(menuItemConf)) {
            var menus = [];
            for (var i = 0, len = menuItemConf.length; i < len; i++) {
                menus[i] = createMenuItem(menuItemConf[i]);                
            }
            return menus;
        } else if (menuItemConf.submenu) {
            // create submenu
            menuItemConf.submenu = createMenu(menuItemConf.submenu);
            return new nw.MenuItem(menuItemConf);
        } else {
            return new nw.MenuItem(menuItemConf);
        }
    } else {
        return null;
    }
};
var createMenu = function createMenu(menuConf, opt){
    var ui_menu = new nw.Menu($.extend({type: 'contextmenu'}, opt));
    var ui_meunItems = createMenuItem(menuConf);
    if (ui_meunItems != null) {
        if (Array.isArray(ui_meunItems)) {
            $.each(ui_meunItems, function(index, ui_item){
                ui_menu.append(ui_item);    
            });    
        } else {
            ui_menu.append(ui_meunItems);
        }
    }
    return ui_menu;
};
var getNativeWindow = function getNativeWindow(){
    return nw.Window.get(); 
};

// ####工具栏####
getNativeWindow().menu = createMenu(Constants.MENU_BAR, {type: 'menubar'});

/* app events */
// 文档右键
var body = document.body;
body.addEventListener('contextmenu', function(ev){
    ev.preventDefault();
    createMenu(Constants.CONTEXT_MENUS, {}).popup(ev.x, ev.y);
    return false;
}, false);
// 窗体右键
window.addEventListener('contextmenu', function(ev){
    ev.preventDefault();
    return false;
});