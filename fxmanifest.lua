fx_version 'cerulean'
games { 'gta5' }

name 'exec_loadingscreen'
version '1.5.1'
description 'Custom loading screen resource for EXEC RZ.'
author 'WickmanCapo'

loadscreen 'html/index.html'

shared_script 'config.lua'

files {
    'html/index.html',
    'html/css/style.css',
    'html/js/main.js',
    'html/assets/*'
}

--loadscreen_manual_shutdown 'yes'

client_script 'client/client.lua'

escrow_ignore {
    '.git',
    '.git/**',
    'config.lua',
}
